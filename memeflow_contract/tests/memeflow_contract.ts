import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MemeflowContract } from "../target/types/memeflow_contract";
import { assert } from "chai";
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount
} from "@solana/spl-token";

describe("memeflow_contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MemeflowContract as Program<MemeflowContract>;

  // Keypairs for testing
  const admin = anchor.web3.Keypair.generate();
  const swapExecutor = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();
  const jupiterProgramId = anchor.web3.Keypair.generate().publicKey; // Placeholder

  // PDA for PlatformConfig
  const [platformConfigPDA, platformConfigBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );

  // PDA for DelegatedAuthority
  const [delegatedAuthorityPDA, delegatedAuthorityBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("delegate"), user.publicKey.toBuffer()],
    program.programId
  );

  // Token variables
  let mintA: anchor.web3.PublicKey;
  let userTokenAccountA: anchor.web3.PublicKey;
  let mintB: anchor.web3.PublicKey;
  let userTokenAccountB: anchor.web3.PublicKey;

  // Fund wallets and setup tokens
  before(async () => {
    // Airdrop SOL to payer accounts
    await provider.connection.requestAirdrop(admin.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(swapExecutor.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Small delay to ensure airdrop is processed
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Create test tokens
    mintA = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9 // 9 decimals like SOL
    );

    mintB = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9 // 9 decimals like SOL
    );

    // Create token accounts for user
    const userATA_A = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mintA,
      user.publicKey
    );
    userTokenAccountA = userATA_A.address;

    const userATA_B = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mintB,
      user.publicKey
    );
    userTokenAccountB = userATA_B.address;

    // Mint some tokens to user
    await mintTo(
      provider.connection,
      admin,
      mintA,
      userTokenAccountA,
      admin.publicKey,
      1000000000 // 1 token with 9 decimals
    );

    console.log("Test setup complete");
    console.log("Admin:", admin.publicKey.toString());
    console.log("User:", user.publicKey.toString());
    console.log("Swap Executor:", swapExecutor.publicKey.toString());
    console.log("Token A Mint:", mintA.toString());
    console.log("User Token A Account:", userTokenAccountA.toString());
  });

  it("Initializes the Platform Config!", async () => {
    const tx = await program.methods
      .initialize(admin.publicKey, swapExecutor.publicKey, jupiterProgramId)
      .accounts({
        platformConfig: platformConfigPDA,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
    console.log("Initialize transaction signature", tx);

    // Fetch the created account
    const configAccount = await program.account.platformConfig.fetch(platformConfigPDA);
    
    assert.ok(configAccount.adminAuthority.equals(admin.publicKey));
    assert.ok(configAccount.swapExecutorAuthority.equals(swapExecutor.publicKey));
    assert.ok(configAccount.jupiterProgramId.equals(jupiterProgramId));
    assert.equal(configAccount.bump, platformConfigBump);
  });

  it("Updates the Platform Config!", async () => {
    const newJupiterProgramId = anchor.web3.Keypair.generate().publicKey;
    
    const tx = await program.methods
      .updateConfig(null, null, newJupiterProgramId)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log("Update config transaction signature", tx);

    // Fetch the updated account
    const configAccount = await program.account.platformConfig.fetch(platformConfigPDA);
    
    assert.ok(configAccount.adminAuthority.equals(admin.publicKey)); // Unchanged
    assert.ok(configAccount.swapExecutorAuthority.equals(swapExecutor.publicKey)); // Unchanged
    assert.ok(configAccount.jupiterProgramId.equals(newJupiterProgramId)); // Updated
  });

  it("Delegates authority for a user!", async () => {
    // Check token balance before delegation
    const accountBefore = await getAccount(provider.connection, userTokenAccountA);
    console.log("Token balance before delegation:", accountBefore.amount.toString());
    console.log("Delegate before:", accountBefore.delegate?.toString() || "None");

    const approvalAmount = new anchor.BN(500000000); // 0.5 tokens with 9 decimals

    const tx = await program.methods
      .delegateAuthority(approvalAmount)
      .accounts({
        delegatedAuthority: delegatedAuthorityPDA,
        user: user.publicKey,
        platformConfig: platformConfigPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        userTokenAccount: userTokenAccountA,
        swapExecutor: swapExecutor.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
    console.log("Delegate authority transaction signature", tx);

    // Fetch the created account
    const delegateAccount = await program.account.delegatedAuthority.fetch(delegatedAuthorityPDA);

    assert.ok(delegateAccount.user.equals(user.publicKey));
    assert.isTrue(delegateAccount.isActive);
    // Check if allowed_swap_authority is set correctly
    const configAccount = await program.account.platformConfig.fetch(platformConfigPDA);
    assert.ok(delegateAccount.allowedSwapAuthority.equals(configAccount.swapExecutorAuthority)); 
    assert.equal(delegateAccount.bump, delegatedAuthorityBump);

    // Check if token account has the correct delegate set
    const accountAfter = await getAccount(provider.connection, userTokenAccountA);
    console.log("Token balance after delegation:", accountAfter.amount.toString());
    console.log("Delegate after:", accountAfter.delegate?.toString());
    console.log("Delegated amount:", accountAfter.delegatedAmount.toString());
    
    assert.ok(accountAfter.delegate?.equals(swapExecutor.publicKey));
    assert.equal(accountAfter.delegatedAmount.toString(), approvalAmount.toString());
  });

  it("Revokes authority for a user!", async () => {
    // First, ensure authority is delegated
    try {
      await program.account.delegatedAuthority.fetch(delegatedAuthorityPDA);
    } catch (e) {
      // If not found, delegate first (useful if tests run independently)
      const approvalAmount = new anchor.BN(500000000);
      await program.methods
        .delegateAuthority(approvalAmount)
        .accounts({
          delegatedAuthority: delegatedAuthorityPDA,
          user: user.publicKey,
          platformConfig: platformConfigPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
          userTokenAccount: userTokenAccountA,
          swapExecutor: swapExecutor.publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
    }

    // Check token account before revocation
    const accountBefore = await getAccount(provider.connection, userTokenAccountA);
    console.log("Delegate before revocation:", accountBefore.delegate?.toString() || "None");

    const tx = await program.methods
      .revokeAuthority()
      .accounts({
        delegatedAuthority: delegatedAuthorityPDA,
        user: user.publicKey,
        userTokenAccount: userTokenAccountA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
    console.log("Revoke authority transaction signature", tx);

    // Fetch the updated account
    const delegateAccount = await program.account.delegatedAuthority.fetch(delegatedAuthorityPDA);

    assert.ok(delegateAccount.user.equals(user.publicKey));
    assert.isFalse(delegateAccount.isActive); // Check if deactivated

    // Check if token account delegate is revoked
    const accountAfter = await getAccount(provider.connection, userTokenAccountA);
    console.log("Delegate after revocation:", accountAfter.delegate?.toString() || "None");
    
    assert.isNull(accountAfter.delegate);
    assert.equal(accountAfter.delegatedAmount.toString(), "0");
  });

  // Note: A full test for execute_swap would require mocking the Jupiter program
  // or using a local Jupiter instance, which is beyond the scope of this test suite.
  // Instead, we'll test the authorization checks in execute_swap.
  it("Validates authorization in execute_swap", async () => {
    // First, ensure authority is delegated
    const approvalAmount = new anchor.BN(500000000);
    await program.methods
      .delegateAuthority(approvalAmount)
      .accounts({
        delegatedAuthority: delegatedAuthorityPDA,
        user: user.publicKey,
        platformConfig: platformConfigPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        userTokenAccount: userTokenAccountA,
        swapExecutor: swapExecutor.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Create a fake Jupiter route data for testing
    const jupiterRouteData = Buffer.from("test_route_data");
    
    // Try to execute swap with wrong signer (should fail)
    try {
      await program.methods
        .executeSwap(
          new anchor.BN(100000000), // 0.1 tokens
          new anchor.BN(90000000),  // 0.09 tokens (10% slippage)
          Array.from(jupiterRouteData)
        )
        .accounts({
          platformConfig: platformConfigPDA,
          swapExecutor: user.publicKey, // Wrong signer (user instead of swapExecutor)
          delegatedAuthority: delegatedAuthorityPDA,
          jupiterProgram: jupiterProgramId,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have thrown an error due to unauthorized signer");
    } catch (e) {
      console.log("Expected error when using wrong signer:", e.message);
      assert.include(e.message, "Unauthorized");
    }

    // Now revoke authority and try with correct signer (should fail due to inactive delegation)
    await program.methods
      .revokeAuthority()
      .accounts({
        delegatedAuthority: delegatedAuthorityPDA,
        user: user.publicKey,
        userTokenAccount: userTokenAccountA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    try {
      await program.methods
        .executeSwap(
          new anchor.BN(100000000), // 0.1 tokens
          new anchor.BN(90000000),  // 0.09 tokens (10% slippage)
          Array.from(jupiterRouteData)
        )
        .accounts({
          platformConfig: platformConfigPDA,
          swapExecutor: swapExecutor.publicKey, // Correct signer
          delegatedAuthority: delegatedAuthorityPDA,
          jupiterProgram: jupiterProgramId,
        })
        .signers([swapExecutor])
        .rpc();
      assert.fail("Should have thrown an error due to inactive delegation");
    } catch (e) {
      console.log("Expected error when delegation is inactive:", e.message);
      assert.include(e.message, "inactive");
    }

    console.log("Authorization checks in execute_swap validated successfully");
  });
});
