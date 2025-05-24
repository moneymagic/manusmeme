# Análise da Função `distribute-commission`

Analisei o código da função Supabase Edge Function localizada em `supabase/functions/distribute-commission/index.ts`. Aqui estão as principais observações e pontos de atenção:

**Funcionalidades Implementadas:**

1.  **Endpoint HTTP:** A função expõe um endpoint HTTP que espera uma requisição POST.
2.  **Autenticação:** Verifica o token JWT do usuário (`Authorization: Bearer <token>`) para autenticação via Supabase Auth.
3.  **Entrada:** Espera `copyTradeId` e `profit` no corpo da requisição JSON.
4.  **Busca de Dados (Simplificada):** Tenta buscar dados do `copy_trades` e `affiliates`, mas a lógica de busca da cadeia de uplines (`uplines`) está atualmente **mockada** (usa dados de exemplo) e precisa ser implementada corretamente para buscar a estrutura real da rede de afiliados recursivamente a partir do `sponsor_id`.
5.  **Estrutura de Ranks:** Define ranks de V1 a V8.
6.  **Percentuais de Comissão por Rank:** Define percentuais fixos por rank (`rankCommissionPercentages`). Atualmente: 2% para V1-V6, 4% para V7-V8.
7.  **Lógica de Distribuição com Compressão:** A função `distributeCommission` implementa uma lógica de compressão dinâmica. Para cada nível de rank (V1 a V8), ela procura o primeiro upline na cadeia que tenha o rank mínimo necessário e atribui a comissão daquele nível a ele. Isso garante que a comissão 

seja paga mesmo que os uplines imediatos não tenham o rank necessário.
8.  **Cálculo de Taxas:** A função `processTradeCommission` calcula a taxa de performance (30%), a taxa do master trader (10% - *embora a descrição inicial mencionasse 10% para a Memeflow*), e a taxa de rede (20% usada para comissões). O lucro restante é calculado após deduzir a taxa de performance.
9.  **Cálculo dos Valores de Comissão:** A função `calculateCommissionAmounts` calcula o valor absoluto em SOL para cada upline com base no percentual distribuído e na *taxa de rede* (20% do lucro total), **não** sobre o lucro total diretamente. Isso parece correto conforme a descrição inicial (20% do lucro distribuído na rede).
10. **Residual para a Plataforma:** A lógica em `distributeCommission` calcula um residual (20% - total distribuído) e o atribui a um ID 'memeflow'. Isso corresponde aos 10% que deveriam ir para a plataforma, mas depende da soma das comissões distribuídas não exceder 10% (o que acontece no cenário atual onde V1-V6 pagam 2% e V7-V8 pagam 4%, totalizando 16% + 4% = 20% se todos os níveis encontrarem um qualificado, mas pode ser menos).

**Pontos de Atenção e Próximos Passos:**

*   **Busca Real de Uplines:** A principal pendência é substituir a lógica mockada de busca de uplines por uma implementação real que consulte a tabela `uplines` (ou `affiliates` como referenciado no código) recursivamente para construir a cadeia correta de patrocinadores e seus ranks.
*   **Lógica do Master Trader:** A descrição inicial menciona que 10% da taxa de 30% vai para a Memeflow e 20% para a rede. O código calcula `masterTraderFee = profitAmount * 0.1` e `networkFee = profitAmount * 0.2`. Isso soma 30%. No entanto, a `networkFee` (20%) é usada como base para calcular as comissões da rede. O residual não distribuído na rede vai para 'memeflow'. Isso parece alinhar com a descrição, mas precisa ser confirmado se a `masterTraderFee` (10%) é de fato a parte da Memeflow ou se vai para a carteira master original (o que não está explícito no código da função).
*   **Tratamento de Erros:** A função possui tratamento básico de erros (autenticação, dados faltantes, erros do Supabase), o que é bom.
*   **Persistência:** A função atualmente **não salva** os resultados da distribuição de comissão no banco de dados. É crucial adicionar a lógica para registrar as transações de comissão para cada upline e para a plataforma na tabela `transactions` ou similar.
*   **Segurança das Variáveis:** A função usa `Deno.env.get` para buscar `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Para funções de backend que podem precisar realizar operações privilegiadas (como inserir transações de comissão), geralmente se utiliza a `SUPABASE_SERVICE_ROLE_KEY` em vez da `ANON_KEY`. Isso precisa ser revisado e ajustado conforme a necessidade de permissões.
*   **Onde está o Resto da Lógica?** Esta função foca apenas na *distribuição da comissão* após um lucro ser informado. A lógica de *detecção da operação do master*, *replicação proporcional para seguidores*, *cálculo do lucro individual do seguidor* e *dedução da taxa de 30% do saldo do seguidor* (mencionadas na descrição inicial e nos arquivos `CopyTradeExecutor.ts` e `TradeProcessorService.ts`) **não estão** nesta Edge Function. Precisamos localizar e analisar esses outros componentes.

**Recomendação:** Priorizar a implementação da busca real de uplines e a persistência dos resultados da comissão no banco de dados. Verificar a necessidade de usar a `SERVICE_ROLE_KEY`. Localizar e analisar os demais componentes da lógica de copy trading.
