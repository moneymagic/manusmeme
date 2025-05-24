# Planejamento da Integração com Jupiter Aggregator

Com base na análise da documentação oficial da API de Swap do Jupiter (v6), o fluxo de integração no Memeflow, especificamente dentro do `TradeProcessorService.ts`, será o seguinte:

**API Endpoints Principais:**

1.  **`GET /quote`**: Para obter as melhores rotas e cotações para um determinado par de tokens e valor.
    *   **URL:** `https://quote-api.jup.ag/v6/quote`
    *   **Parâmetros Essenciais:**
        *   `inputMint`: Endereço do token de entrada (ex: SOL ou o token que o master vendeu).
        *   `outputMint`: Endereço do token de saída (ex: o memecoin que o master comprou).
        *   `amount`: Quantidade do token de entrada (calculado proporcionalmente para o seguidor em `userAmount`).
        *   `slippageBps`: Slippage permitido em basis points (ex: 50 para 0.5%).
    *   **Resposta:** Contém informações da rota (`routePlan`), incluindo o valor estimado de saída (`outAmount`).

2.  **`POST /swap`**: Para obter a transação serializada (pronta para ser assinada e enviada) com base na cotação obtida.
    *   **URL:** `https://quote-api.jup.ag/v6/swap`
    *   **Corpo da Requisição (JSON):**
        *   `userPublicKey`: A chave pública da carteira do *seguidor* que realizará o swap.
        *   `quoteResponse`: O objeto de resposta completo obtido do endpoint `/quote`.
        *   `wrapAndUnwrapSol`: `true` (geralmente recomendado para lidar com wSOL automaticamente).
        *   `dynamicComputeUnitLimit`: `true` (para estimar dinamicamente a C.U. da transação).
        *   `prioritizationFeeLamports`: `auto` ou um valor específico (para taxas de prioridade).
    *   **Resposta:** Contém `swapTransaction`, uma string base64 representando a transação serializada e pronta para ser assinada.

**Fluxo de Implementação em `processFollowerTrade`:**

1.  **Antes do Cálculo de Lucro:** Após calcular `userAmount` (o valor proporcional que o seguidor irá operar):
    *   Chamar a API `GET /quote` do Jupiter com os dados do token de entrada/saída e `userAmount`.
    *   Verificar se a cotação foi bem-sucedida.
2.  **Construir a Transação:**
    *   Chamar a API `POST /swap` do Jupiter, enviando a `quoteResponse` obtida e a `userPublicKey` da carteira do seguidor.
    *   Receber a `swapTransaction` serializada.
3.  **Assinar e Enviar a Transação:**
    *   **Ponto Crítico:** A transação precisa ser assinada pela chave privada correspondente à `userPublicKey` do seguidor. Como o backend terá acesso a essa chave privada é uma questão de arquitetura e segurança a ser definida.
        *   **Opção 1 (Menos Segura/Centralizada):** O backend armazena/acessa as chaves dos seguidores (não recomendado).
        *   **Opção 2 (Ideal/Descentralizada):** O frontend recebe a transação serializada, pede ao usuário para assiná-la via extensão de carteira (Phantom, Solflare, etc.) e envia a transação assinada de volta para o backend ou diretamente para a rede.
        *   **Opção 3 (Intermediária):** Usar um serviço de custódia ou um contrato inteligente intermediário.
    *   Após a assinatura, a transação é enviada para um nó RPC da Solana.
4.  **Confirmar Transação e Obter Resultados:**
    *   Monitorar a rede Solana pela confirmação da transação usando sua assinatura.
    *   Obter os detalhes da transação confirmada para saber exatamente quanto do token de saída foi recebido.
5.  **Calcular Lucro Real:**
    *   Substituir o cálculo de lucro simulado (`userProfit = userAmount * (profitPerUnit / masterTrade.entryPrice)`) pelo lucro real baseado nos valores de entrada e saída da transação confirmada no Jupiter.
6.  **Prosseguir com Taxas e Comissões:** Continuar o fluxo existente de cálculo de taxas (`performanceFee`, `masterFee`, `networkFee`) e distribuição de comissões com base no lucro *real*.

**Próximos Passos:**

*   Implementar as chamadas aos endpoints `/quote` e `/swap` no `TradeProcessorService.ts` ou em um novo serviço dedicado (`JupiterService.ts`).
*   Definir a estratégia de assinatura e envio de transações (requer decisão de arquitetura/segurança).
*   Implementar a lógica de confirmação de transação na Solana.
*   Ajustar o cálculo de lucro para usar os dados reais da transação.
*   Testar rigorosamente a integração com a rede de desenvolvimento (devnet) da Solana.
