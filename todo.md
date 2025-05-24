# Memeflow - Lista de Tarefas

## Contrato Inteligente
- [x] Implementar estrutura básica do contrato Anchor
- [x] Implementar contas PlatformConfig e DelegatedAuthority
- [x] Implementar instruções initialize e update_config
- [x] Implementar instruções delegate_authority e revoke_authority
- [ ] Implementar CPI para SPL Token approve na instrução delegate_authority
- [ ] Implementar CPI para SPL Token revoke na instrução revoke_authority
- [ ] Implementar CPI manual para Jupiter na instrução execute_swap
- [ ] Adicionar testes para execute_swap
- [ ] Adicionar testes para update_config

## Backend
- [x] Implementar JupiterService para consulta de cotações
- [x] Implementar JupiterService para obtenção de transações de swap
- [ ] Adaptar backend para interagir com o contrato inteligente Memeflow
- [ ] Implementar lógica para monitorar operações do master trader
- [ ] Implementar lógica para calcular proporções de cópia para seguidores
- [ ] Implementar lógica para executar swaps delegados via contrato inteligente
- [ ] Implementar cálculo e distribuição de comissões

## Frontend
- [ ] Implementar interface para usuário assinar delegação única
- [ ] Implementar visualização de status de delegação
- [ ] Implementar dashboard de operações copiadas
- [ ] Implementar visualização de saldo e lucros

## Infraestrutura
- [ ] Configurar ambiente de produção
- [ ] Implantar contrato em testnet/devnet para testes
- [ ] Preparar para implantação em mainnet

## Documentação
- [ ] Documentar fluxo completo de delegação e execução de swaps
- [ ] Documentar arquitetura do sistema integrado
- [ ] Criar guia de uso para usuários finais
