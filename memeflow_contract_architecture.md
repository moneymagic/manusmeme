# Arquitetura Proposta: Contrato Inteligente Memeflow (Delegação e Swap CPI)

Este documento descreve a arquitetura proposta para o contrato inteligente (programa Solana) do Memeflow, focado em permitir que usuários deleguem autoridade de swap para a plataforma, que então executará os swaps via CPI no Jupiter.

**Objetivo:** Permitir que a Memeflow execute swaps de tokens na Jupiter em nome dos usuários seguidores, com base em uma autorização única dada pelo usuário ao contrato inteligente.

**Framework:** Anchor (Rust)

**Componentes Principais:**

1.  **Estado do Contrato (Contas Solana):**
    *   **`PlatformConfig` (Singleton PDA):**
        *   Armazena configurações globais da plataforma.
        *   `admin_authority`: Chave pública com permissão para atualizar configurações.
        *   `swap_executor_authority`: Chave pública (controlada pelo backend Memeflow) autorizada a *invocar* a instrução `execute_swap` no contrato.
        *   `jupiter_program_id`: ID do programa Jupiter a ser chamado via CPI.
    *   **`DelegatedAuthority` (PDA por Usuário):**
        *   Semente: `["delegate", user_wallet_pubkey]`
        *   Armazena a delegação de um usuário específico.
        *   `user`: Chave pública do usuário que delegou.
        *   `is_active`: Booleano indicando se a delegação está ativa.
        *   `allowed_swap_authority`: Chave pública (derivada ou fixa, controlada pela Memeflow) que *efetivamente* terá a permissão `set_authority` sobre as contas de token do usuário ou será usada como `delegate` no `approve` do SPL Token.
        *   *(Opcional)* `max_slippage_bps`: Limite de slippage configurado pelo usuário.
        *   *(Opcional)* `allowed_tokens`: Lista de tokens permitidos para swap (se necessário).

2.  **Mecanismo de Delegação (SPL Token `approve` + `delegate`):**
    *   **Fluxo:**
        1.  **Frontend:** O usuário, ao ativar o copy trading, interage com o frontend.
        2.  **Frontend:** Constrói e solicita ao usuário a assinatura de uma transação que chama a instrução `delegate_authority` do nosso contrato Memeflow.
        3.  **Contrato (`delegate_authority`):**
            *   Cria a conta `DelegatedAuthority` para o usuário (se não existir).
            *   Marca `is_active = true`.
            *   Define `allowed_swap_authority` (esta será a chave que o contrato usará internamente para assinar CPIs ou que terá a permissão delegada).
            *   **Importante:** Esta instrução *também* deve incluir chamadas (via CPI do nosso contrato para o programa SPL Token) para que o usuário aprove (`approve`) um `delegate` (`allowed_swap_authority`) para gastar seus tokens (SOL ou outros tokens relevantes) até um limite "infinito" (ou muito alto) para as contas de token que serão usadas nos swaps. A chave `allowed_swap_authority` será o `delegate` aprovado.
    *   **Vantagem:** Usa o mecanismo padrão `approve/delegate` do SPL Token, que é bem estabelecido.
    *   **Desvantagem:** Requer que o usuário aprove para cada conta de token que possa ser usada como entrada no swap.

3.  **Instruções do Contrato:**
    *   **`initialize(ctx, config)`:**
        *   Chamada uma única vez pelo admin para criar a `PlatformConfig`.
        *   Define `admin_authority`, `swap_executor_authority`, `jupiter_program_id`.
    *   **`update_config(ctx, new_config)`:**
        *   Chamada pelo `admin_authority` para atualizar a configuração.
    *   **`delegate_authority(ctx)`:**
        *   Chamada pelo *usuário*.
        *   Assinante: `user`.
        *   Cria/atualiza a conta `DelegatedAuthority` do usuário.
        *   Marca `is_active = true`.
        *   **Executa CPIs para `spl_token::approve`:** O usuário aprova a `allowed_swap_authority` (definida na conta `DelegatedAuthority`) como `delegate` para suas contas de token relevantes (ex: conta SOL, contas de memecoins comuns) com um `amount` alto.
    *   **`revoke_authority(ctx)`:**
        *   Chamada pelo *usuário*.
        *   Assinante: `user`.
        *   Marca `is_active = false` na conta `DelegatedAuthority`.
        *   **Executa CPIs para `spl_token::revoke`:** Remove a delegação das contas de token do usuário.
    *   **`execute_swap(ctx, input_amount, min_output_amount, quote_params)`:**
        *   Chamada pela `swap_executor_authority` (backend Memeflow).
        *   Assinante: `swap_executor_authority`.
        *   **Contas Necessárias:**
            *   `platform_config`
            *   `delegated_authority` (do usuário seguidor para quem o swap está sendo feito - verifica `is_active` e obtém `allowed_swap_authority`).
            *   Conta de token de *entrada* do usuário.
            *   Conta de token de *saída* do usuário (pode precisar ser criada).
            *   Conta da `allowed_swap_authority` (que foi aprovada como `delegate`).
            *   Programa Jupiter.
            *   Programa SPL Token.
            *   Todas as contas exigidas pela rota específica do Jupiter (obtidas off-chain e passadas ou derivadas on-chain).
        *   **Lógica:**
            1.  Verifica se o chamador é a `swap_executor_authority`.
            2.  Verifica se a `delegated_authority` do usuário está ativa.
            3.  Obtém a rota do Jupiter (provavelmente passada como argumento após consulta off-chain da API `/quote`, pois a lógica de roteamento on-chain é complexa).
            4.  Constrói a instrução CPI para o programa Jupiter usando o crate `jupiter-cpi`, passando as contas necessárias e a autoridade delegada (`allowed_swap_authority` atuando como `delegate` da conta de token de entrada do usuário).
            5.  Executa a CPI.
            6.  (Opcional) Emite um evento com o resultado do swap.

4.  **Segurança:**
    *   A `swap_executor_authority` (chave do backend) deve ser mantida em segurança extrema.
    *   O contrato deve validar rigorosamente as contas e autoridades em cada instrução.
    *   A instrução `execute_swap` deve garantir que só pode operar em nome de usuários que delegaram ativamente (`is_active = true`).
    *   Auditoria de segurança do contrato é fundamental antes do deploy em mainnet.

5.  **Interação Backend <-> Contrato:**
    *   O backend ainda usará a API `/quote` do Jupiter para encontrar a melhor rota e os parâmetros (`min_output_amount`, contas necessárias).
    *   O backend (usando a chave `swap_executor_authority`) chamará a instrução `execute_swap` do contrato Memeflow, passando os detalhes da rota e os parâmetros necessários.
    *   O backend precisará monitorar a blockchain para confirmar o sucesso da transação iniciada pelo contrato.

**Próximos Passos:**

1.  Refinar a estrutura das contas e instruções.
2.  Validar a abordagem de delegação (`approve`) e suas implicações.
3.  Começar a implementação do contrato usando Anchor e o crate `jupiter-cpi`.
4.  Desenvolver testes unitários e de integração robustos.
