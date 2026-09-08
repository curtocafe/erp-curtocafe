---
title: 'Schema inicial do Supabase para o Curto ERP Conversacional'
type: 'feature'
created: '2026-09-07'
status: 'in-review'
route: 'dispatch'
baseline_commit: '62c6bc22a5d38c06025243e76abef883083b448f'
review_loop_iteration: 0
context:
  - '{project-root}/docs/ESCOPO_E_ARQUITETURA_ERP.md'
  - '{project-root}/docs/ARQUITETURA_FRAMEWORK_INVOKTA.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O Curto ERP não possui ainda um esquema versionado no Supabase para registrar o catálogo, os contatos reconhecidos pelo WhatsApp, o estoque e os estados conversacionais. Sem uma base transacional, o Invokta e as Edge Functions não têm uma fronteira segura para operar.

**Approach:** Criar uma primeira migração SQL versionada e aplicá-la pelo MCP do Supabase quando a conexão permitir escrita. O esquema concentrará o núcleo operacional de estoque; compras, fiscal, IA e integrações externas permanecerão como migrações posteriores.

## Boundaries & Constraints

**Always:** A operação do cliente acontece por WhatsApp; IA e gateway jamais gravam diretamente no PostgreSQL; somente capabilities Invokta/Edge Functions validadas podem confirmar efeitos de negócio. Movimentações são um livro-razão imutável, com confirmação idempotente, quantidades positivas e sinal definido pelo tipo. O saldo deve ser alterado atomicamente e impedir consumo ou perda que deixe saldo negativo, exceto ajuste de inventário auditável. O acesso nasce aberto apenas para contatos cadastrados, mas com flags globais e permissões por usuário prontas para restrição futura. RLS deve negar acesso direto anônimo.

**Never:** Não criar N8N, painel web para cliente, dados fictícios, APIs fiscais, pedidos de compra, tabelas de IA ou Storage nesta migração. Não editar `docs/*.md`, PDFs, propostas HTML, geradores de PDF ou dependências existentes.

**Decisões confirmadas:** O estoque será separado por unidade/local, com suporte às operações Brasil e Paraguai. Todas as quantidades usarão precisão decimal (`numeric`) para suportar kg e litros. Cada evento UAZAPI fornecerá uma chave externa estável para idempotência.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Confirmação de entrada | Capability validada recebe produto ativo, quantidade e chave idempotente inédita | Registra uma movimentação de entrada e atualiza o saldo da unidade na mesma transação | Falha integralmente se produto, usuário ou unidade forem inválidos/inativos |
| Callback repetido | A mesma chave idempotente chega novamente | Retorna o resultado previamente persistido sem nova movimentação ou novo saldo | Não duplica efeitos financeiros ou de estoque |
| Baixa acima do saldo | Consumo/perda excede o saldo disponível | Nenhum registro nem saldo são alterados | Retorna erro de saldo insuficiente para o fluxo pedir correção |
| Ajuste de inventário | Operador autorizado informa diferença e motivo | Registra ajuste auditável, podendo levar o saldo ao valor físico informado | Rejeita ajuste sem motivo, produto ou autor válido |

</frozen-after-approval>

## Code Map

- `docs/ESCOPO_E_ARQUITETURA_ERP.md` -- diretrizes atuais: Supabase, Edge Functions, Invokta, WhatsApp e flags de acesso.
- `docs/ARQUITETURA_FRAMEWORK_INVOKTA.md` -- fronteira obrigatória: IA invoca capability; capability valida e persiste.
- `docs/PROPOSTA_TECNICA_E_PRD_CURTO_CAFE.md` -- entidades iniciais e requisitos de catálogo, estoque, sessões e idioma; referências a N8N/painel de cliente são legadas.
- `.mcp.json` -- conexão Supabase atual, configurada como somente leitura.
- `supabase/migrations/<timestamp>_initial_curto_erp.sql` -- novo artefato versionado a criar; nenhum schema Supabase existe hoje no repositório.

## Tasks & Acceptance

**Execution:**
- [x] `supabase/migrations/20260907230000_initial_curto_erp.sql` -- criar extensões, tipos controlados e tabelas de usuários, permissões globais, unidades, categorias, fornecedores, produtos/apelidos, saldos, movimentações e sessões/eventos WhatsApp -- estabelecer o núcleo conversacional auditável.
- [x] `supabase/migrations/20260907230000_initial_curto_erp.sql` -- criar restrições, índices de telefone/SKU/data, busca aproximada por apelidos, função transacional de estoque e políticas RLS deny-by-default -- preservar consistência e segurança.
- [x] `supabase/migrations/20260907230000_initial_curto_erp.sql` -- expor somente funções RPC de domínio para registrar movimentação e consultar saldo -- impedir escrita de negócios por tabelas expostas.
- [ ] MCP Supabase -- aplicar a migração, inspecionar as relações e executar cenários de entrada, repetição, saldo insuficiente e ajuste -- confirmar que o ambiente remoto reproduz o SQL versionado.

**Acceptance Criteria:**
- Given uma instalação vazia do Supabase, when a migração é aplicada, then o núcleo de catálogo, contatos, estoque e sessão existe com chaves, relações e índices válidos.
- Given uma confirmação inédita e válida, when a capability chama a função de movimentação, then o ledger e o saldo mudam uma única vez na mesma transação.
- Given uma confirmação repetida ou uma baixa sem saldo, when a função de domínio é chamada, then o saldo não é duplicado nem fica negativo.
- Given uma chamada anônima direta às tabelas públicas, when RLS é avaliada, then nenhuma leitura ou escrita é permitida.

## Implementation Notes

- Documentação considerada: somente arquivos Markdown em `docs/`. Por decisão do usuário, N8N e qualquer painel web destinado ao cliente são legados e fora do escopo.
- A decisão aprovada separa o estoque por unidade/local para suportar Brasil e Paraguai.
- A migração local foi criada. A aplicação e os cenários no banco remoto aguardam a ferramenta MCP Supabase ser exposta nesta sessão; o `.mcp.json` já está configurado com escrita habilitada.
- Revisão BMAD concluída: achados de idempotência, autorização e imutabilidade foram corrigidos na migração; não houve achado pendente além da aplicação remota.
- Ajuste de domínio solicitado: `perfil_acesso` usa `GESTOR`, `OPERADOR` e `FORNECEDOR`; não existe perfil de contador.

## Spec Change Log

## Review Triage Log

- high — idempotência retornava saldo com unidade/produto do retry — corrigido validando todos os campos canônicos e retornando o saldo da movimentação original.
- high — ajuste aceitava usuário sem permissão e sem motivo — corrigido exigindo `permissao_estoque`, delta não nulo e observação não vazia.
- medium — ledger podia ser alterado pelo `service_role` — corrigido com trigger de imutabilidade; falha de saldo aborta a transação sem excluir manualmente o ledger.
- medium — retry após desativação falhava antes da busca idempotente — corrigido buscando payload existente antes das validações de atividade.
- low — migração não é rerunnable — mantido como comportamento normal de migração versionada única; reexecução deve ocorrer via histórico do Supabase.

## Design Notes

O saldo atual será mantido como projeção transacional do livro-razão, não como dado editável. Essa separação permite consultas rápidas no WhatsApp sem perder rastreabilidade das entradas, consumos, perdas e ajustes.

## Verification

**Commands:**
- `supabase db reset` -- expected: a migração aplica integralmente em banco local configurado.
- `supabase db lint` -- expected: nenhum erro de segurança ou estrutura no schema.

**Manual checks (if no CLI):**
- No MCP do Supabase, conferir as tabelas, FKs, RLS, funções RPC e os quatro cenários da matriz antes de liberar Edge Functions.
