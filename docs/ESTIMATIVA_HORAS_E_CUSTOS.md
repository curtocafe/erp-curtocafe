## Parâmetros do Projeto (Atualizados Pós-Aprovação)
* **Status:** **PROJETO APROVADO!**
* **Equipe:** 2 Desenvolvedores (Neto & Fernando).
* **Metodologia:** **BMAD Method** (Breakthrough Method for Agile AI-Driven Development).
* **Stack Principal:** **Supabase Nativo** (PostgreSQL, Auth, Storage, Edge Functions em Deno/TypeScript), **uazapi** (WhatsApp Gateway), APIs de IA (Whisper + Vision OCR + LLM Parser), API Fiscal (Focus NFe / Nuvem Fiscal).
* **Interface do Cliente:** **100% WhatsApp** (áudio, texto e botões). Interface Web desenvolvida **apenas para os desenvolvedores (Neto & Fernando)** como ferramenta de visualização do banco e testes de CRUD.
* **Ordem de Desenvolvimento:** A definir após imersão física do Fernando na loja da Curto Café.

---

## 1. Decomposição de Módulos Técnicos (410 Horas)

| Módulo / Frente de Trabalho | O que inclui na prática | Horas Est. |
| :--- | :--- | :---: |
| **1. Imersão BMAD, Setup & Banco** | • Imersão presencial do Fernando na cafeteria + Mapeamento de dores reais.<br>• Setup Supabase (PostgreSQL, Triggers, RLS, Storage) e modelagem de produtos, movimentações e flags de permissão aberta. | **60h** |
| **2. Dev Cockpit Web (Uso Exclusivo Devs)** | • Frontend interno simples para Neto & Fernando inspecionarem tabelas, testarem CRUDs e monitorarem sessões do WhatsApp. | **40h** |
| **3. WhatsApp Gateway (UAZAPI) & Edge Functions** | • Edge Functions (TypeScript/Deno) para webhooks da UAZAPI (áudio, texto, foto, callbacks de botões).<br>• Gestão de sessão e estado da conversa no Supabase/PostgreSQL. | **70h** |
| **4. Motor de IA (Whisper + Vision + LLM Parser)** | • Pipeline de transcrição de áudio Whisper bilíngue (pt-BR e es-PY).<br>• Vision OCR para canhotos/comprovantes em papel.<br>• Extração estruturada de JSON e Fuzzy Matching com o catálogo de produtos. | **70h** |
| **5. Estoque Conversacional & Reposição** | • Edge Functions de regras de negócio: Entradas, Baixas, Perdas, Consulta de Saldo com botões nativos.<br>• Gatilhos automáticos de estoque mínimo no WhatsApp. | **60h** |
| **6. Módulo Fiscal Simplificado** | • Edge Function para integração assíncrona com API Fiscal (Focus NFe / Nuvem Fiscal) e envio de PDF/XML no WhatsApp. | **50h** |
| **7. Homologação em Campo, Calibração & Go-Live** | • Testes no balcão da loja, calibração de prompts para barulhos/gírias, suporte assistido e Go-Live. | **60h** |
| **TOTAL CONSOLIDADO** | **Investimento: R$ 85,00/h × 410h = R$ 34.850,00** | **410h** |

---

## 2. Orçamento Expandido do Projeto & Metodologia Ágil (Scrum)

Para garantir **qualidade**, **acompanhamento contínuo** e **flexibilidade para conciliar com outras atividades**, o projeto foi dimensionado para um pacote de **400h a 450h de projeto** distribuídas ao longo de **4 a 6 meses** (16 a 24 semanas).

* **Dedicação da Dupla (Neto & Fernando):** ~18h a 22h semanais conjuntas (~9h a 11h por dev).
* **Ciclos de Desenvolvimento (Sprints):** Quinzenais (2 semanas por Sprint), totalizando de 8 a 12 Sprints.
* **Entregas Parciais (Milestones / Releases):** Cada ciclo entrega uma funcionalidade 100% testável no WhatsApp do Sérgio.

---

## 3. Entregas Parciais por Mês (Estratégia Web-First $\rightarrow$ WhatsApp/IA)

* **Mês 1 (Sprints 1 e 2):** Setup de Infraestrutura (VPS, Docker, Postgres, n8n) + Modelagem e Base de Dados.
* **Mês 2 (Sprints 3 e 4) — 🚀 Entrega 1:** **ERP Web Operacional no ar.** Telas de cadastro de produtos/preços/fornecedores e movimentações manuais de estoque. O Sérgio e o Renato já começam a usar e popular a base real.
* **Mês 3 (Sprints 5 e 6) — 🚀 Entrega 2:** Conexão do Gateway UAZAPI no WhatsApp + Motor Whisper/IA para transcrição e botões nativos.
* **Mês 4 (Sprints 7 e 8) — 🚀 Entrega 3:** Entrada e Baixa de Estoque 100% Conversacional por áudio/foto no WhatsApp + Alertas de Reposição Automática.
* **Mês 5 (Sprints 9 e 10) — 🚀 Entrega 4:** Módulo Fiscal Simplificado (Emissão automática NFe/NFCe via API Fiscal com PDF/XML no WhatsApp).
* **Mês 6 (Sprints 11 e 12) — 🚀 Go-Live:** Homologação integrada Web + WhatsApp com a equipe da loja, treinamento e encerramento.

