# Guia de Implementação e Uso do Memeflow

Este guia fornece instruções passo a passo para implementar e utilizar o sistema Memeflow de copy trading com contrato inteligente na Solana.

## Para Desenvolvedores

### 1. Configuração do Ambiente

```bash
# Clonar o repositório
git clone https://github.com/moneymagic/meme-moon-flow.git
cd meme-moon-flow

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves e configurações
```

### 2. Compilação e Implantação do Contrato

```bash
# Navegar para o diretório do contrato
cd memeflow_contract

# Compilar o contrato
anchor build

# Obter o ID do programa
solana address -k target/deploy/memeflow_contract-keypair.json

# Atualizar o ID do programa em lib.rs e Anchor.toml
# declare_id!("SEU_PROGRAM_ID_AQUI");

# Implantar em devnet para testes
anchor deploy --provider.cluster devnet

# Inicializar a configuração da plataforma
ts-node scripts/initialize-platform.ts
```

### 3. Inicialização do Backend

```bash
# Voltar para o diretório raiz
cd ..

# Iniciar o serviço de monitoramento
npm run start:monitor

# Em outro terminal, iniciar o servidor API
npm run start:api
```

### 4. Testes

```bash
# Testar o contrato
cd memeflow_contract
anchor test

# Testar o backend
cd ..
npm test
```

## Para Administradores

### 1. Configuração Inicial

1. Gerar uma carteira segura para a autoridade executora de swaps
2. Inicializar a configuração da plataforma com:
   - Admin authority (sua carteira)
   - Swap executor authority (carteira gerada)
   - Jupiter program ID

3. Configurar a carteira mestre a ser monitorada

### 2. Monitoramento e Manutenção

1. Verificar logs do serviço de monitoramento regularmente
2. Monitorar saldo da carteira executora para taxas de transação
3. Ajustar parâmetros de slippage conforme necessário

## Para Usuários Finais

### 1. Delegação de Autoridade

1. Conectar sua carteira Solana (Phantom, Solflare, etc.)
2. Navegar para a seção "Configurações de Copy Trading"
3. Definir o valor que deseja alocar para copy trading
4. Clicar em "Ativar Copy Trading"
5. Assinar a transação de delegação quando solicitado pela sua carteira
6. Pronto! Você só precisa fazer isso uma vez

### 2. Monitoramento de Operações

1. Acesse o dashboard para visualizar:
   - Histórico de operações copiadas
   - Lucros e taxas
   - Status da delegação

### 3. Revogação de Autoridade

1. Para desativar o copy trading, navegue para "Configurações"
2. Clique em "Desativar Copy Trading"
3. Assine a transação de revogação quando solicitado

## Solução de Problemas Comuns

### Falha na Delegação

- Verifique se sua carteira tem SOL suficiente para taxas de transação
- Confirme que você está usando uma carteira compatível (Phantom, Solflare)
- Tente novamente com um valor de alocação diferente

### Operações Não Sendo Copiadas

- Verifique se sua delegação está ativa no dashboard
- Confirme que você tem saldo suficiente para as operações
- Verifique se o serviço de monitoramento está ativo

### Erros de Slippage

- As operações podem falhar se o mercado for muito volátil
- Considere aumentar sua alocação para operações maiores
- Contate o suporte se o problema persistir
