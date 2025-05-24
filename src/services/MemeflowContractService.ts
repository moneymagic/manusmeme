import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, BN, web3 } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getJupiterQuote, getJupiterSwapTransaction } from './JupiterService';

// Importar o IDL do contrato Memeflow
// Nota: Este arquivo será gerado automaticamente pelo Anchor após a compilação
// Precisará ser ajustado para o caminho correto após a compilação
import { IDL } from '../../memeflow_contract/target/types/memeflow_contract';

export class MemeflowContractService {
  private connection: Connection;
  private programId: PublicKey;
  private program: Program;
  private platformConfigPDA: PublicKey;
  private platformConfigBump: number;
  private swapExecutorKeypair: Keypair;

  constructor(
    connection: Connection,
    programId: string,
    swapExecutorPrivateKey: Uint8Array
  ) {
    this.connection = connection;
    this.programId = new PublicKey(programId);
    this.swapExecutorKeypair = Keypair.fromSecretKey(swapExecutorPrivateKey);

    // Configurar o provider e programa Anchor
    const provider = new AnchorProvider(
      this.connection,
      {
        publicKey: this.swapExecutorKeypair.publicKey,
        signTransaction: async (tx: Transaction) => {
          tx.partialSign(this.swapExecutorKeypair);
          return tx;
        },
        signAllTransactions: async (txs: Transaction[]) => {
          return txs.map(tx => {
            tx.partialSign(this.swapExecutorKeypair);
            return tx;
          });
        },
      },
      { commitment: 'confirmed' }
    );

    this.program = new Program(IDL, this.programId, provider);

    // Derivar o PDA da configuração da plataforma
    const [platformConfigPDA, platformConfigBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      this.programId
    );
    this.platformConfigPDA = platformConfigPDA;
    this.platformConfigBump = platformConfigBump;
  }

  /**
   * Inicializa a configuração da plataforma (chamado apenas uma vez pelo admin)
   */
  async initializePlatform(
    adminAuthority: PublicKey,
    jupiterProgramId: PublicKey,
    payerKeypair: Keypair
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .initialize(
          adminAuthority,
          this.swapExecutorKeypair.publicKey,
          jupiterProgramId
        )
        .accounts({
          platformConfig: this.platformConfigPDA,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([payerKeypair])
        .rpc();

      console.log("Plataforma inicializada com sucesso:", tx);
      return tx;
    } catch (error) {
      console.error("Erro ao inicializar a plataforma:", error);
      throw error;
    }
  }

  /**
   * Obtém o PDA da autoridade delegada para um usuário específico
   */
  getDelegatedAuthorityPDA(userPublicKey: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("delegate"), userPublicKey.toBuffer()],
      this.programId
    );
  }

  /**
   * Gera a transação para o usuário delegar autoridade de swap
   * Esta transação deve ser assinada pelo usuário no frontend
   */
  async createDelegateAuthorityTransaction(
    userPublicKey: PublicKey,
    tokenMint: PublicKey,
    approvalAmount: number | BN
  ): Promise<Transaction> {
    try {
      // Converter para BN se for um número
      const amount = typeof approvalAmount === 'number' 
        ? new BN(approvalAmount) 
        : approvalAmount;

      // Obter a conta de token associada do usuário
      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        userPublicKey
      );

      // Obter o PDA da autoridade delegada
      const [delegatedAuthorityPDA, _] = this.getDelegatedAuthorityPDA(userPublicKey);

      // Criar a transação
      const tx = await this.program.methods
        .delegateAuthority(amount)
        .accounts({
          delegatedAuthority: delegatedAuthorityPDA,
          user: userPublicKey,
          platformConfig: this.platformConfigPDA,
          systemProgram: SystemProgram.programId,
          userTokenAccount: userTokenAccount,
          swapExecutor: this.swapExecutorKeypair.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction();

      return tx;
    } catch (error) {
      console.error("Erro ao criar transação de delegação:", error);
      throw error;
    }
  }

  /**
   * Gera a transação para o usuário revogar a autoridade de swap
   * Esta transação deve ser assinada pelo usuário no frontend
   */
  async createRevokeAuthorityTransaction(
    userPublicKey: PublicKey,
    tokenMint: PublicKey
  ): Promise<Transaction> {
    try {
      // Obter a conta de token associada do usuário
      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        userPublicKey
      );

      // Obter o PDA da autoridade delegada
      const [delegatedAuthorityPDA, _] = this.getDelegatedAuthorityPDA(userPublicKey);

      // Criar a transação
      const tx = await this.program.methods
        .revokeAuthority()
        .accounts({
          delegatedAuthority: delegatedAuthorityPDA,
          user: userPublicKey,
          userTokenAccount: userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction();

      return tx;
    } catch (error) {
      console.error("Erro ao criar transação de revogação:", error);
      throw error;
    }
  }

  /**
   * Verifica se um usuário tem delegação ativa
   */
  async isDelegationActive(userPublicKey: PublicKey): Promise<boolean> {
    try {
      const [delegatedAuthorityPDA, _] = this.getDelegatedAuthorityPDA(userPublicKey);
      const delegateAccount = await this.program.account.delegatedAuthority.fetch(delegatedAuthorityPDA);
      return delegateAccount.isActive;
    } catch (error) {
      console.error("Erro ao verificar delegação:", error);
      return false;
    }
  }

  /**
   * Executa um swap em nome de um usuário usando a autoridade delegada
   * Esta função é chamada pelo backend quando um trade do master deve ser copiado
   */
  async executeSwap(
    userPublicKey: PublicKey,
    inputMint: PublicKey,
    outputMint: PublicKey,
    inputAmount: number | BN,
    slippageBps: number = 50 // 0.5% padrão
  ): Promise<string> {
    try {
      // Verificar se a delegação está ativa
      const isActive = await this.isDelegationActive(userPublicKey);
      if (!isActive) {
        throw new Error(`Delegação inativa para o usuário ${userPublicKey.toString()}`);
      }

      // Converter para BN se for um número
      const amount = typeof inputAmount === 'number' 
        ? new BN(inputAmount) 
        : inputAmount;

      // Obter cotação do Jupiter
      const quote = await getJupiterQuote(
        inputMint.toString(),
        outputMint.toString(),
        amount.toNumber(),
        slippageBps
      );

      if (!quote) {
        throw new Error("Falha ao obter cotação do Jupiter");
      }

      // Calcular o valor mínimo de saída com base na cotação e slippage
      const minOutputAmount = new BN(Math.floor(
        Number(quote.outAmount) * (1 - slippageBps / 10000)
      ));

      // Obter os dados da rota do Jupiter
      // Nota: Aqui precisamos extrair os dados da rota da cotação
      // Isso pode variar dependendo da estrutura exata da resposta da API Jupiter
      const jupiterRouteData = Buffer.from(JSON.stringify(quote.routePlan));

      // Obter o PDA da autoridade delegada
      const [delegatedAuthorityPDA, _] = this.getDelegatedAuthorityPDA(userPublicKey);

      // Obter a configuração da plataforma para o ID do programa Jupiter
      const platformConfig = await this.program.account.platformConfig.fetch(this.platformConfigPDA);
      const jupiterProgramId = platformConfig.jupiterProgramId;

      // Obter as contas de token do usuário
      const userInputTokenAccount = await getAssociatedTokenAddress(
        inputMint,
        userPublicKey
      );
      
      const userOutputTokenAccount = await getAssociatedTokenAddress(
        outputMint,
        userPublicKey,
        true // allowOwnerOffCurve = true para criar se não existir
      );

      // Aqui precisaríamos obter todas as contas necessárias para o swap Jupiter
      // Isso normalmente viria da API do Jupiter ou seria derivado com base na rota
      // Para simplificar, estamos usando um placeholder
      const remainingAccounts = [
        { pubkey: userInputTokenAccount, isWritable: true, isSigner: false },
        { pubkey: userOutputTokenAccount, isWritable: true, isSigner: false },
        // Outras contas necessárias para o Jupiter...
      ];

      // Executar o swap
      const tx = await this.program.methods
        .executeSwap(
          amount,
          minOutputAmount,
          Array.from(jupiterRouteData)
        )
        .accounts({
          platformConfig: this.platformConfigPDA,
          swapExecutor: this.swapExecutorKeypair.publicKey,
          delegatedAuthority: delegatedAuthorityPDA,
          jupiterProgram: jupiterProgramId,
        })
        .remainingAccounts(remainingAccounts)
        .signers([this.swapExecutorKeypair])
        .rpc();

      console.log(`Swap executado com sucesso para o usuário ${userPublicKey.toString()}: ${tx}`);
      return tx;
    } catch (error) {
      console.error("Erro ao executar swap:", error);
      throw error;
    }
  }

  /**
   * Método para copiar um trade do master para todos os seguidores ativos
   * Esta é a função principal que seria chamada pelo sistema de copy trading
   */
  async copyMasterTradeToFollowers(
    masterTradeInfo: {
      inputMint: PublicKey,
      outputMint: PublicKey,
      inputAmount: number,
      outputAmount: number
    },
    followers: Array<{
      publicKey: PublicKey,
      allocationAmount: number
    }>
  ): Promise<{
    successful: Array<{ follower: PublicKey, txid: string }>,
    failed: Array<{ follower: PublicKey, error: string }>
  }> {
    const results = {
      successful: [],
      failed: []
    };

    // Para cada seguidor, calcular a proporção e executar o swap
    for (const follower of followers) {
      try {
        // Verificar se a delegação está ativa
        const isActive = await this.isDelegationActive(follower.publicKey);
        if (!isActive) {
          results.failed.push({
            follower: follower.publicKey,
            error: "Delegação inativa"
          });
          continue;
        }

        // Calcular o valor proporcional para o seguidor
        // Proporção = (alocação do seguidor / valor total do master) * valor do trade do master
        const proportion = follower.allocationAmount / masterTradeInfo.inputAmount;
        const followerInputAmount = Math.floor(masterTradeInfo.inputAmount * proportion);

        if (followerInputAmount <= 0) {
          results.failed.push({
            follower: follower.publicKey,
            error: "Valor calculado muito pequeno para executar"
          });
          continue;
        }

        // Executar o swap para o seguidor
        const txid = await this.executeSwap(
          follower.publicKey,
          masterTradeInfo.inputMint,
          masterTradeInfo.outputMint,
          followerInputAmount
        );

        results.successful.push({
          follower: follower.publicKey,
          txid
        });
      } catch (error) {
        results.failed.push({
          follower: follower.publicKey,
          error: error.message || "Erro desconhecido"
        });
      }
    }

    return results;
  }
}
