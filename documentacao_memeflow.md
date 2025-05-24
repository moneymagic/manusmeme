# Documentação do Memeflow - Sistema de Copy Trading com Contrato Inteligente

## Visão Geral

O Memeflow é uma plataforma de copy trading na blockchain Solana, focada em replicar automaticamente as operações de uma carteira mestre para uma base de seguidores. O sistema utiliza um contrato inteligente para permitir que os seguidores deleguem permissão de negociação à plataforma uma única vez, eliminando a necessidade de assinar cada transação de cópia.

## Arquitetura

O sistema é composto por três componentes principais:

1. **Contrato Inteligente (On-chain)**: Programa Solana desenvolvido com Anchor que gerencia delegações e executa swaps via Jupiter.
2. **Backend (Off-chain)**: Serviços que monitoram operações do master trader, calculam proporções e lucros, e orquestram a execução de swaps delegados.
3. **Frontend**: Interface para usuários delegarem autorização, visualizarem operações e gerenciarem suas configurações.

## Fluxo de Operação

### 1. Delegação de Autoridade (Única)

1. O usuário acessa a plataforma e configura quanto deseja alocar para copy trading.
2. O sistema gera uma transação de delegação que o usuário assina com sua carteira.
3. Esta transação:
   - Cria uma conta `DelegatedAuthority` associada ao usuário
   - Aprova a autoridade da plataforma para gastar tokens em nome do usuário
   - Requer apenas uma assinatura inicial

### 2. Monitoramento e Cópia de Trades

1. O backend monitora continuamente as operações da carteira mestre.
2. Quando uma operação lucrativa é detectada:
   - O sistema identifica todos os seguidores ativos com delegação
   - Calcula a proporção de cópia para cada seguidor
   - Executa swaps proporcionais via contrato inteligente

### 3. Execução de Swaps Delegados

1. Para cada seguidor, o backend:
   - Obtém cotação do Jupiter para o par de tokens
   - Constrói a transação de swap com os parâmetros adequados
   - Chama a instrução `execute_swap` do contrato Memeflow
   - O contrato verifica a delegação e executa o swap via CPI para o Jupiter

### 4. Cálculo de Lucro e Taxas

1. Após cada swap bem-sucedido:
   - O sistema calcula o lucro obtido
   - Deduz 30% de taxa sobre o lucro (10% para a plataforma, 20% para rede de afiliados)
   - Distribui as comissões conforme a estrutura unilevel

## Componentes Técnicos

### Contrato Inteligente

O contrato Memeflow implementa as seguintes instruções:

- `initialize`: Configura parâmetros iniciais da plataforma
- `update_config`: Permite ao admin atualizar configurações
- `delegate_authority`: Permite ao usuário delegar autoridade de swap
- `revoke_authority`: Permite ao usuário revogar a autoridade delegada
- `execute_swap`: Executa um swap em nome do usuário via Jupiter

### Serviços Backend

- `MemeflowContractService`: Interface para interagir com o contrato inteligente
- `CopyTradeExecutor`: Orquestra o monitoramento e execução de copy trades
- `JupiterService`: Gerencia interações com a API do Jupiter para cotações e rotas
- `TradeProcessorService`: Calcula lucros, taxas e comissões

## Configuração e Implantação

### Pré-requisitos

- Node.js 20+
- Solana CLI 1.18+
- Anchor 0.29+

### Variáveis de Ambiente

```
# Supabase
SUPABASE_URL=https://fndkivztnbkzuqosmbdx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
MEMEFLOW_PROGRAM_ID=HX3Ex4icMLJFwqSDJ9vsLe87ZNd7UyrBxPiUHj78rKLm
SWAP_EXECUTOR_PRIVATE_KEY=... # Chave privada da autoridade executora de swaps
MASTER_WALLET_ADDRESS=... # Endereço da carteira mestre a ser monitorada
JUPITER_PROGRAM_ID=JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
```

### Implantação do Contrato

1. Compilar o contrato:
   ```
   cd memeflow_contract
   anchor build
   ```

2. Implantar em devnet para testes:
   ```
   anchor deploy --provider.cluster devnet
   ```

3. Inicializar a configuração da plataforma:
   ```
   ts-node scripts/initialize-platform.ts
   ```

### Inicialização do Backend

1. Instalar dependências:
   ```
   npm install
   ```

2. Iniciar o serviço de monitoramento:
   ```
   npm run start:monitor
   ```

## Segurança

- A chave privada do `swap_executor_authority` deve ser mantida em segurança extrema
- O contrato valida rigorosamente as contas e autoridades em cada instrução
- A instrução `execute_swap` só pode operar em nome de usuários com delegação ativa
- Recomenda-se uma auditoria de segurança do contrato antes do deploy em mainnet

## Limitações e Considerações

- A delegação é por token, então múltiplos tokens requerem múltiplas delegações
- O contrato usa CPI manual para Jupiter devido a limitações de compatibilidade de dependências
- O slippage deve ser configurado adequadamente para evitar falhas em mercados voláteis

## Próximos Passos

- Implementar suporte a múltiplos tokens em uma única delegação
- Adicionar mecanismos de stop-loss e take-profit
- Desenvolver dashboard avançado para análise de desempenho
- Implementar notificações em tempo real para usuários
