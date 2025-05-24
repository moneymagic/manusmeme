use anchor_lang::prelude::*;
use anchor_spl::token::{self, Approve, Mint, Revoke, Token, TokenAccount};
use anchor_lang::solana_program::{
    instruction::Instruction,
    program::invoke_signed,
};

declare_id!("HX3Ex4icMLJFwqSDJ9vsLe87ZNd7UyrBxPiUHj78rKLm"); // Replace with actual Program ID after deployment

#[program]
pub mod memeflow_contract {
    use super::*;

    // Instruction to initialize the platform configuration
    pub fn initialize(
        ctx: Context<Initialize>,
        admin_authority: Pubkey,
        swap_executor_authority: Pubkey,
        jupiter_program_id: Pubkey,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.admin_authority = admin_authority;
        platform_config.swap_executor_authority = swap_executor_authority;
        platform_config.jupiter_program_id = jupiter_program_id;
        platform_config.bump = ctx.bumps.platform_config;
        msg!("PlatformConfig initialized");
        msg!("Admin: {}", admin_authority);
        msg!("Executor: {}", swap_executor_authority);
        msg!("Jupiter ID: {}", jupiter_program_id);
        Ok(())
    }

    // Instruction to update the platform configuration
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_admin_authority: Option<Pubkey>,
        new_swap_executor_authority: Option<Pubkey>,
        new_jupiter_program_id: Option<Pubkey>,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;

        // Authorization check: Only current admin can update
        require!(platform_config.admin_authority == ctx.accounts.admin.key(), ErrorCode::Unauthorized);

        if let Some(new_admin) = new_admin_authority {
            platform_config.admin_authority = new_admin;
            msg!("Admin authority updated to: {}", new_admin);
        }
        if let Some(new_executor) = new_swap_executor_authority {
            platform_config.swap_executor_authority = new_executor;
            msg!("Swap executor authority updated to: {}", new_executor);
        }
        if let Some(new_jupiter_id) = new_jupiter_program_id {
            platform_config.jupiter_program_id = new_jupiter_id;
            msg!("Jupiter program ID updated to: {}", new_jupiter_id);
        }

        Ok(())
    }

    // Instruction for a user to delegate swap authority
    pub fn delegate_authority(ctx: Context<DelegateAuthorityAccounts>, amount: u64) -> Result<()> {
        let delegated_authority_account = &mut ctx.accounts.delegated_authority;
        delegated_authority_account.user = ctx.accounts.user.key();
        delegated_authority_account.is_active = true;
        // Define the actual authority that will perform swaps
        // Using the platform_config.swap_executor_authority now
        delegated_authority_account.allowed_swap_authority = ctx.accounts.platform_config.swap_executor_authority;
        // Access bump correctly via ctx.bumps.delegated_authority (no .get needed)
        delegated_authority_account.bump = ctx.bumps.delegated_authority;

        msg!("User {} delegated authority.", ctx.accounts.user.key());
        msg!("Delegate account created/updated: {}", delegated_authority_account.key());
        msg!("Allowed Swap Authority: {}", delegated_authority_account.allowed_swap_authority);

        // Implement CPI call for spl_token::approve
        // This approves the swap_executor_authority to spend tokens on behalf of the user
        token::approve(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Approve {
                    to: ctx.accounts.user_token_account.to_account_info(),
                    delegate: ctx.accounts.swap_executor.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount, // Amount of tokens to approve (can be u64::MAX for unlimited)
        )?;

        msg!("Approved {} tokens for delegate: {}", amount, ctx.accounts.swap_executor.key());

        Ok(())
    }

    // Instruction for a user to revoke swap authority
    pub fn revoke_authority(ctx: Context<RevokeAuthorityAccounts>) -> Result<()> {
        let delegated_authority_account = &mut ctx.accounts.delegated_authority;
        // Authorization check already handled by has_one constraint in context
        
        delegated_authority_account.is_active = false;
        msg!("User {} revoked authority.", ctx.accounts.user.key());
        msg!("Delegate account deactivated: {}", delegated_authority_account.key());

        // Implement CPI call for spl_token::revoke
        // This revokes any previous approval for the token account
        token::revoke(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Revoke {
                    source: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
        )?;

        msg!("Revoked token approval for account: {}", ctx.accounts.user_token_account.key());

        Ok(())
    }

    // Instruction to execute a swap using the delegated authority
    pub fn execute_swap(
        ctx: Context<ExecuteSwapAccounts>,
        input_amount: u64,
        minimum_output_amount: u64,
        jupiter_route_data: Vec<u8>, // Serialized Jupiter route data
    ) -> Result<()> {
        msg!("Executing swap for user: {}", ctx.accounts.delegated_authority.user);
        msg!("Input amount: {}, Min output: {}", input_amount, minimum_output_amount);

        // 1. Authorization Checks:
        // - Check if the signer is the designated swap_executor_authority from platform_config
        require!(ctx.accounts.platform_config.swap_executor_authority == ctx.accounts.swap_executor.key(), ErrorCode::Unauthorized);
        // - Check if the delegated_authority account is active
        require!(ctx.accounts.delegated_authority.is_active, ErrorCode::DelegationInactive);
        // - Check if the delegated_authority account allows the swap_executor
        require!(ctx.accounts.delegated_authority.allowed_swap_authority == ctx.accounts.swap_executor.key(), ErrorCode::Unauthorized);

        // 2. Implement Manual CPI call to Jupiter
        // Construct the instruction for Jupiter swap
        let jupiter_instruction = Instruction {
            program_id: ctx.accounts.jupiter_program.key(),
            accounts: ctx.remaining_accounts.iter().map(|account| {
                if account.is_signer {
                    AccountMeta::new_readonly(account.key(), true)
                } else if account.is_writable {
                    AccountMeta::new(account.key(), false)
                } else {
                    AccountMeta::new_readonly(account.key(), false)
                }
            }).collect(),
            data: jupiter_route_data,
        };

        // Collect all account infos needed for the CPI call
        let account_infos = ctx.remaining_accounts.iter().map(|account| account.to_account_info()).collect::<Vec<_>>();

        // Execute the Jupiter swap via CPI
        msg!("Invoking Jupiter program: {}", ctx.accounts.jupiter_program.key());
        invoke_signed(
            &jupiter_instruction,
            &account_infos,
            &[], // No seeds needed as swap_executor is a real keypair, not a PDA
        )?;

        msg!("Swap execution completed successfully");
        Ok(())
    }
}

// Account definition for PlatformConfig (Singleton PDA)
#[account]
#[derive(InitSpace)]
pub struct PlatformConfig {
    pub admin_authority: Pubkey,
    pub swap_executor_authority: Pubkey, // The authority allowed to trigger swaps
    pub jupiter_program_id: Pubkey,
    pub bump: u8,
}

// Account definition for DelegatedAuthority (PDA per User)
#[account]
#[derive(InitSpace)]
pub struct DelegatedAuthority {
    pub user: Pubkey,
    pub is_active: bool,
    pub allowed_swap_authority: Pubkey, // Should match platform_config.swap_executor_authority
    pub bump: u8,
}

// Context for the Initialize instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + PlatformConfig::INIT_SPACE,
        seeds = [b"platform_config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for the UpdateConfig instruction
#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    // The current admin authority must sign the transaction
    pub admin: Signer<'info>,
}


// Context for the DelegateAuthority instruction
#[derive(Accounts)]
pub struct DelegateAuthorityAccounts<'info> {
    #[account(
        init_if_needed, // Requires 'init-if-needed' feature in anchor-lang
        payer = user,
        space = 8 + DelegatedAuthority::INIT_SPACE,
        seeds = [b"delegate", user.key().as_ref()],
        bump
    )]
    pub delegated_authority: Account<'info, DelegatedAuthority>,
    #[account(mut)]
    pub user: Signer<'info>, // The user delegating authority
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>, // Needed to get swap_executor_authority
    pub system_program: Program<'info, System>,
    
    // Accounts needed for spl_token::approve CPI call
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub swap_executor: AccountInfo<'info>, // The authority that will be allowed to swap
    pub token_program: Program<'info, Token>,
}

// Context for the RevokeAuthority instruction
#[derive(Accounts)]
pub struct RevokeAuthorityAccounts<'info> {
    #[account(
        mut,
        seeds = [b"delegate", user.key().as_ref()],
        bump = delegated_authority.bump,
        has_one = user @ ErrorCode::Unauthorized // Ensures the signer is the user associated with this account
    )]
    pub delegated_authority: Account<'info, DelegatedAuthority>,
    #[account(mut)]
    pub user: Signer<'info>, // The user revoking authority
    
    // Accounts needed for spl_token::revoke CPI call
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// Context for the ExecuteSwap instruction
#[derive(Accounts)]
pub struct ExecuteSwapAccounts<'info> {
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    // The authority designated in platform_config must sign
    pub swap_executor: Signer<'info>,

    #[account(
        seeds = [b"delegate", delegated_authority.user.as_ref()], // Use user from the account itself
        bump = delegated_authority.bump,
        // Constraint: Ensure the delegate account is active and allows the executor
        // These checks are done in the instruction logic for better error messages
    )]
    pub delegated_authority: Account<'info, DelegatedAuthority>,

    // Jupiter program account
    /// CHECK: Jupiter program ID from platform_config
    pub jupiter_program: AccountInfo<'info>,

    // Note: All other accounts required by Jupiter will be passed as remaining_accounts
    // This includes user's source/destination token accounts, mints, etc.
}


// Custom Error Codes
#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Delegation is not active.")]
    DelegationInactive,
    // Add other error codes as needed
}
