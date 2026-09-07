const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Curto Café ERP Conversacional</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #2B2A26;
      background: #F8F7F4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      page-break-after: always;
      overflow: hidden;
      background: #F8F7F4;
      padding: 16mm 18mm 14mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* Backgrounds per page */
    .bg-cover {
      background: linear-gradient(145deg, #1C3F3A 0%, #152F2C 60%, #0D1E1C 100%);
      color: #FFFFFF;
    }
    .bg-prd {
      background: linear-gradient(180deg, #F8F7F4 0%, #F3EFE6 100%);
    }
    .bg-tech {
      background: linear-gradient(180deg, #F8F7F4 0%, #EFEBE0 100%);
    }
    .bg-finance {
      background: linear-gradient(155deg, #1C3F3A 0%, #173430 70%, #0F2320 100%);
      color: #FFFFFF;
    }

    /* Subtle watermark / background elements */
    .watermark-pattern {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 165, 116, 0.12) 0%, rgba(212, 165, 116, 0) 70%);
      pointer-events: none;
    }
    .watermark-corner {
      position: absolute;
      bottom: -60px;
      left: -60px;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(28, 63, 58, 0.06) 0%, rgba(28, 63, 58, 0) 70%);
      pointer-events: none;
    }

    /* Header & Footer */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1.5px solid rgba(43, 42, 38, 0.12);
      margin-bottom: 14px;
    }
    .header-dark {
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.15);
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #1C3F3A;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: -0.5px;
    }
    .logo-circle-dark {
      background: #EBE8D8;
      color: #1C3F3A;
    }
    .brand-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #1C3F3A;
    }
    .brand-name-dark {
      color: #EBE8D8;
    }
    .doc-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 20px;
      background: #EBE8D8;
      color: #1C3F3A;
    }
    .doc-tag-dark {
      background: rgba(255, 255, 255, 0.12);
      color: #EBE8D8;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid rgba(43, 42, 38, 0.1);
      font-size: 9px;
      color: #9B9789;
    }
    .footer-dark {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.5);
    }

    /* Content Typography */
    .section-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #D4A574;
      margin-bottom: 4px;
    }
    .main-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #1C3F3A;
      line-height: 1.15;
      margin-bottom: 12px;
    }
    .main-title-dark {
      color: #FFFFFF;
    }
    .section-subtitle {
      font-size: 13px;
      font-weight: 700;
      color: #1C3F3A;
      margin-top: 10px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    p, li {
      font-size: 11px;
      line-height: 1.5;
      color: #4A4841;
    }
    .page-dark p, .page-dark li {
      color: rgba(255, 255, 255, 0.82);
    }

    /* Cards and Grids */
    .card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 12px 14px;
      border: 1px solid #E5E3DB;
      box-shadow: 0 2px 10px rgba(28, 63, 58, 0.04);
      margin-bottom: 10px;
    }
    .card-accent {
      background: #EBE8D8;
      border: 1px solid #DCD8C8;
    }
    .card-dark {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
    }

    /* Badges & Pills */
    .badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      background: #EBE8D8;
      color: #1C3F3A;
    }
    .badge-green {
      background: #1C3F3A;
      color: #FFFFFF;
    }
    .badge-gold {
      background: #D4A574;
      color: #2B2A26;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin: 8px 0;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E5E3DB;
    }
    th {
      background: #1C3F3A;
      color: #FFFFFF;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      font-size: 9.5px;
      letter-spacing: 0.3px;
    }
    td {
      padding: 5.5px 8px;
      border-bottom: 1px solid #F0EEE8;
      color: #4A4841;
      vertical-align: top;
      font-size: 9.5px;
      line-height: 1.35;
    }
    tr:nth-child(even) td {
      background: #FAF9F6;
    }

    /* Buttons mock */
    .mock-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      background: #1C3F3A;
      color: #FFFFFF;
      margin-right: 6px;
      margin-top: 4px;
    }
    .mock-btn-secondary {
      background: #EBE8D8;
      color: #1C3F3A;
      border: 1px solid #DCD8C8;
    }

    /* Mermaid container */
    .mermaid-box {
      background: #FFFFFF;
      border: 1px solid #E5E3DB;
      border-radius: 10px;
      padding: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .mermaid svg {
      max-width: 100%;
      height: auto;
    }

    /* Cover Page Custom Styles */
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 20px 0;
    }
    .cover-tag {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #D4A574;
    }
    .cover-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 48px;
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -1px;
      text-transform: uppercase;
      color: #FFFFFF;
      margin: 16px 0;
    }
    .cover-title span {
      color: #D4A574;
    }
    .cover-subtitle {
      font-size: 15px;
      line-height: 1.5;
      color: #EBE8D8;
      max-width: 520px;
    }
    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 16px;
      border-radius: 14px;
    }
    .meta-item-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #D4A574;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .meta-item-val {
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
    }

    /* Highlight box */
    .highlight-box {
      border-left: 4px solid #1C3F3A;
      background: #EBE8D8;
      padding: 8px 12px;
      border-radius: 0 8px 8px 0;
      margin: 8px 0;
      font-size: 11px;
      color: #2B2A26;
      font-weight: 500;
    }
  </style>
</head>
<body>

  <!-- ==================== CAPA ==================== -->
  <div class="page bg-cover page-dark">
    <div class="watermark-pattern"></div>
    <div class="header header-dark">
      <div class="logo-badge">
        <div class="logo-circle logo-circle-dark">curto</div>
        <div class="brand-name brand-name-dark">Curto Café</div>
      </div>
      <div class="doc-tag doc-tag-dark">Proposta Técnica & PRD</div>
    </div>

    <div class="cover-container">
      <div>
        <span class="cover-tag">Tecnologia, IA & Automação Descentralizada</span>
        <h1 class="cover-title">Curto ERP<br><span>Conversacional</span><br>& Colaborativo</h1>
        <p class="cover-subtitle">
          Sistema Inteligente de Gestão de Estoque, Compras e Operação de Varejo via WhatsApp com Inteligência Artificial, Reconhecimento de Áudio/Fotos e Cockpit Web Operacional.
        </p>
      </div>

      <div>
        <div class="cover-meta-grid">
          <div>
            <div class="meta-item-label">Cliente / Solicitante</div>
            <div class="meta-item-val">Curto Café (Sérgio Kienteca & Renato / Brax)</div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top:2px;">Operações Brasil (RJ) e Paraguai</div>
          </div>
          <div>
            <div class="meta-item-label">Desenvolvimento & Arquitetura</div>
            <div class="meta-item-val">Miguez Neto Tecnologia (Neto & Fernando)</div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top:2px;">Metodologia Ágil (Scrum) • Stack N8N + IA</div>
          </div>
          <div>
            <div class="meta-item-label">Data & Versão</div>
            <div class="meta-item-val">Setembro de 2026 • Versão 1.0 (MVP)</div>
          </div>
          <div>
            <div class="meta-item-label">Escopo Principal</div>
            <div class="meta-item-val">Web-First + UAZAPI + Whisper + API Fiscal</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer footer-dark">
      <span>Curto Café & Miguez Neto Tecnologia</span>
      <span>Confidencial • Documento de Engenharia & Negócio</span>
      <span>Capa</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 1: PRD [1] & [2] ==================== -->
  <div class="page bg-prd">
    <div class="watermark-pattern"></div>
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">PRD — Seções [1] e [2]</div>
    </div>

    <div>
      <span class="section-tag">Documento de Requisitos de Produto</span>
      <h2 class="main-title">PRD — [1] Nome do Projeto & [2] Visão Geral</h2>

      <div class="card card-accent" style="margin-bottom: 12px;">
        <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase;">[1] Nome do Projeto</div>
        <div style="font-size: 14px; font-weight: 700; color: #2B2A26; margin-top: 2px;">Curto ERP Conversacional & Colaborativo</div>
      </div>

      <div class="card" style="margin-bottom: 12px;">
        <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[2] Visão Geral do App / Sistema</div>
        <p style="margin-bottom: 8px;">
          O <strong>Curto ERP Conversacional</strong> é um sistema de gestão desenhado sob medida para a realidade operacional do <strong>Curto Café</strong> (com operações no Rio de Janeiro e no Paraguai). Ele une a facilidade e velocidade de uma interface conversacional no <strong>WhatsApp</strong> (com transcrição de áudio, leitura de fotos e botões interativos via IA) a uma base sólida de <strong>ERP Web administrativo</strong> para controle de estoque distribuído e reposição.
        </p>
        <p style="margin-bottom: 8px;">
          Diferente dos ERPs tradicionais de mercado — pesados, burocráticos e com alta curva de aprendizado —, o Curto ERP foi concebido para que pessoas com <strong>baixa maturidade digital</strong> (baristas, fornecedores artesanais e ajudantes de operação) consigam alimentar entradas de mercadorias, dar baixas de consumo e consultar saldos através de <strong>mensagens de voz ou fotos de comprovantes no WhatsApp</strong>, com validação em 1 clique via botões interativos.
        </p>
        <p>
          A solução opera de forma descentralizada, com suporte nativo bilíngue (<strong>Português do Brasil</strong> e <strong>Espanhol do Paraguai</strong>), respeitando a filosofia de software livre, transparência de processos e colaboração em rede.
        </p>
      </div>

      <div class="grid-2">
        <div class="card" style="border-left: 3px solid #1C3F3A;">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">🌱 Filosofia Aberta & Descentralizada</div>
          <p style="margin-top: 4px; font-size: 10px;">Sem ferramentas fechadas ou estruturas pesadas. O sistema respeita a autonomia da rede e trabalha com a realidade prática do campo.</p>
        </div>
        <div class="card" style="border-left: 3px solid #D4A574;">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">📱 WhatsApp como Front-End Principal</div>
          <p style="margin-top: 4px; font-size: 10px;">O canal que os colaboradores e fornecedores já utilizam diariamente, sem necessidade de baixar novos aplicativos.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 1</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 2: PRD [3] & [4] ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">PRD — Seções [3] e [4]</div>
    </div>

    <div>
      <span class="section-tag">Objetivos & Personas</span>
      <h2 class="main-title">[3] Objetivos da v1 & [4] Personas Prioritárias</h2>

      <div class="card" style="margin-bottom: 12px;">
        <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[3] Objetivos da Primeira Versão (v1)</div>
        <ul style="padding-left: 14px; margin-bottom: 4px;">
          <li style="margin-bottom: 4px;"><strong>Zero Fricção no Balcão:</strong> Permitir que operadores e fornecedores registrem entradas e baixas de mercadorias em menos de 10 segundos via áudio ou foto no WhatsApp.</li>
          <li style="margin-bottom: 4px;"><strong>Base Web Operacional Imediata (Web-First):</strong> Disponibilizar em até 60 dias o painel web para cadastro de produtos, preços (custo e venda), fornecedores e controle de saldos.</li>
          <li style="margin-bottom: 4px;"><strong>Precisão na Reposição:</strong> Automatizar o cálculo de estoque mínimo e disparar alertas acionáveis no WhatsApp para compra/torra de café antes da ruptura.</li>
          <li style="margin-bottom: 4px;"><strong>Operação Internacional Unificada:</strong> Garantir suporte bilíngue completo (pt-BR e es-PY) e controle multimoeda (BRL e PYG/USD).</li>
          <li><strong>Emissão Fiscal Sem Burocracia:</strong> Emitir documentos fiscais (NFC-e / NF-e) através de gatilhos automáticos integrados a API fiscal.</li>
        </ul>
      </div>

      <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin: 8px 0 6px 0;">[4] Personas Prioritárias</div>
      
      <div class="grid-2">
        <div class="card">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span class="badge badge-green">Gestor Geral</span>
            <strong style="font-size: 11px; color: #1C3F3A;">Sérgio (Fundador)</strong>
          </div>
          <p style="font-size: 10px;">Necessidade: Visão clara de estoque, alertas de reposição no WhatsApp, controle de margens e precificação segura, sem perder tempo preenchendo planilhas complexas.</p>
        </div>

        <div class="card">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span class="badge badge-gold">Operação</span>
            <strong style="font-size: 11px; color: #1C3F3A;">Barista / Operador de Balcão</strong>
          </div>
          <p style="font-size: 10px;">Necessidade: Registrar que um bolo quebrou, que um saco de café foi aberto ou que um fornecedor entregou pães/brownies apenas enviando um áudio rápido no WhatsApp.</p>
        </div>

        <div class="card">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span class="badge" style="background:#4A4841; color:#FFF;">Parceiro</span>
            <strong style="font-size: 11px; color: #1C3F3A;">Fornecedor Artesanal Local</strong>
          </div>
          <p style="font-size: 10px;">Necessidade: Avisar a entrega de produtos (ex: "Deixei 30 brownies") e receber na hora a confirmação formal com recibo digital no WhatsApp.</p>
        </div>

        <div class="card">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span class="badge" style="background:#D4A574; color:#2B2A26;">Contábil</span>
            <strong style="font-size: 11px; color: #1C3F3A;">Renato (Contador / Brax)</strong>
          </div>
          <p style="font-size: 10px;">Necessidade: Acesso ao painel web para extrair relatórios fiscais, conciliação de entradas/saídas e parametrização tributária correta.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 2</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 3: PRD [5] PARTE 1 ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">PRD — Seção [5] (Parte 1)</div>
    </div>

    <div>
      <span class="section-tag">Escopo Funcional</span>
      <h2 class="main-title">[5] Funcionalidades Essenciais (MVP)</h2>

      <div class="card card-accent" style="margin-bottom: 12px;">
        <div class="section-subtitle" style="margin-top:0;">
          <span>🖥️</span> Módulo Web Administrativo (Cockpit de Gestão)
        </div>
        <ul style="padding-left: 14px;">
          <li style="margin-bottom: 3px;"><strong>Autenticação & Perfis:</strong> Acesso seguro com perfis de Gestor, Operador e Contador.</li>
          <li style="margin-bottom: 3px;"><strong>Catálogo de Produtos:</strong> Cadastro de SKU, unidade de medida, preço de custo, preço de venda, estoque mínimo de segurança e <strong>campo de sinônimos/apelidos</strong> (para alimentação da IA).</li>
          <li style="margin-bottom: 3px;"><strong>Gestão de Fornecedores:</strong> Cadastro de parceiros com número de WhatsApp vinculado para identificação automática do remetente.</li>
          <li style="margin-bottom: 3px;"><strong>Movimentações de Estoque:</strong> Telas para entrada manual, saída, ajuste de inventário e registro de perdas.</li>
          <li><strong>Internacionalização (i18n):</strong> Seletor no topo da tela (Português pt-BR / Español es-PY) e suporte a moedas (R$ e ₲ / US$).</li>
        </ul>
      </div>

      <div class="card">
        <div class="section-subtitle" style="margin-top:0;">
          <span>📱</span> Módulo Conversacional WhatsApp (UAZAPI + IA)
        </div>
        <ul style="padding-left: 14px;">
          <li style="margin-bottom: 4px;"><strong>Entrada de Mercadoria por Áudio:</strong> O fornecedor ou barista envia áudio $\rightarrow$ Whisper transcreve $\rightarrow$ LLM extrai itens e quantidades $\rightarrow$ Sistema envia mensagem com <strong>Botões Interativos</strong> (<code>[✅ Confirmar]</code>, <code>[✏️ Ajustar]</code>, <code>[❌ Cancelar]</code>) $\rightarrow$ Ao clicar, credita estoque.</li>
          <li style="margin-bottom: 4px;"><strong>Entrada por Foto de Documento (OCR):</strong> Envio de foto de canhoto, nota de entrega ou recibo de papel $\rightarrow$ IA lê os itens e monta a confirmação com botões.</li>
          <li style="margin-bottom: 4px;"><strong>Baixa Rápida de Consumo e Perdas:</strong> Comando de voz simples (ex: <em>"abrimos 2 sacos de café 1kg"</em> ou <em>"estragou 1 torta"</em>).</li>
          <li style="margin-bottom: 4px;"><strong>Consulta Rápida de Saldo:</strong> Pergunta informal no WhatsApp (ex: <em>"quantos pacotes de café moído temos?"</em>) respondida em tempo real.</li>
          <li><strong>Alertas de Reposição Automática:</strong> Mensagem proativa quando o estoque atingir o nível de alerta, com botão <code>[📦 Pedir Reposição]</code>.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 3</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 4: PRD [5] PARTE 2 & [6] ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">PRD — Seções [5] e [6]</div>
    </div>

    <div>
      <span class="section-tag">Fluxo Operacional</span>
      <h2 class="main-title">[5] Módulo Fiscal & [6] Fluxo do Usuário</h2>

      <div class="card" style="margin-bottom: 12px;">
        <div class="section-subtitle" style="margin-top:0;">
          <span>🧾</span> Módulo Fiscal Descomplicado
        </div>
        <ul style="padding-left: 14px;">
          <li style="margin-bottom: 3px;"><strong>Integração com API Fiscal (Focus NFe / Nuvem Fiscal):</strong> Parametrização prévia de NCM e tributos alinhados com a contabilidade (Renato / Brax).</li>
          <li><strong>Emissão em 1 Toque:</strong> Emissão assíncrona com link do PDF e XML disponibilizados no WhatsApp ou no painel web.</li>
        </ul>
      </div>

      <div class="card card-accent">
        <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 8px;">[6] Fluxo Principal do Usuário (Exemplo Prático)</div>
        
        <div style="background: #FFFFFF; border-radius: 8px; padding: 10px; border: 1px solid #DCD8C8; font-size: 10px; line-height: 1.45;">
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <div style="font-weight: 800; color: #1C3F3A;">1. Entrada:</div>
            <div>Fornecedor/Barista envia áudio no WhatsApp: <em>"Fala Sérgio, entreguei aí no balcão 40 brownies tradicionais e 20 de doce de leite a 4 reais cada."</em></div>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <div style="font-weight: 800; color: #1C3F3A;">2. IA Processa:</div>
            <div>Whisper transcreve áudio $\rightarrow$ LLM extrai: <code>40x Brownie Tradicional (R$ 4,00)</code> e <code>20x Brownie Doce de Leite (R$ 4,00)</code> $\rightarrow$ Fornecedor identificado pelo número.</div>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <div style="font-weight: 800; color: #1C3F3A;">3. Botões:</div>
            <div>
              Sistema envia mensagem formatada com botões nativos:
              <div style="margin-top: 4px;">
                <span class="mock-btn">✅ Confirmar Entrada</span>
                <span class="mock-btn mock-btn-secondary">✏️ Ajustar Itens</span>
                <span class="mock-btn mock-btn-secondary" style="background:#FFF; color:#B00;">❌ Cancelar</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <div style="font-weight: 800; color: #1C3F3A;">4. Finalização:</div>
            <div>Ao tocar em <strong>[Confirmar Entrada]</strong>, o ERP atualiza o estoque e registra o contas a pagar automaticamente.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 4</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 5: PRD [7], [8] & [9] ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">PRD — Seções [7], [8] e [9]</div>
    </div>

    <div>
      <span class="section-tag">Requisitos & Critérios de Sucesso</span>
      <h2 class="main-title">[7] Não-Funcionais, [8] Fora do Escopo & [9] KPIs</h2>

      <div class="card" style="margin-bottom: 8px;">
        <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 4px;">[7] Requisitos Não-Funcionais</div>
        <ul style="padding-left: 14px; font-size: 10px;">
          <li><strong>Performance:</strong> Processamento de áudios no WhatsApp e retorno com botões em <strong>menos de 5 segundos</strong>.</li>
          <li><strong>Tolerância a Ruídos:</strong> Transcrição precisa com barulho de cafeteria e tráfego de pessoas.</li>
          <li><strong>Segurança:</strong> Sessões de WhatsApp com tokens seguros e banco de dados PostgreSQL com backups diários.</li>
          <li><strong>Arquitetura Aberta (N8N):</strong> Nós modulares visuais para total autonomia de alteração de regras sem código compilado.</li>
          <li><strong>Idioma & Dialeto:</strong> Compreensão de português brasileiro, espanhol do Paraguai e variações de gírias/portunhol.</li>
        </ul>
      </div>

      <div class="card" style="margin-bottom: 8px; border-left: 3px solid #D4A574;">
        <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 4px;">[8] Itens Fora do Escopo (v1)</div>
        <ul style="padding-left: 14px; font-size: 10px;">
          <li>Aplicativo mobile nativo para download em lojas (Google Play / App Store).</li>
          <li>Módulo complexo de folha de pagamento ou contabilidade avançada (foco é estoque, compras e operação).</li>
          <li>Hardware ou sensores de RFID integrados fisicamente (preparado na arquitetura para v2).</li>
          <li>Checkout e cobrança de cartão de crédito no WhatsApp (mantém pagamentos no balcão / Pix / boleto).</li>
        </ul>
      </div>

      <div class="card card-accent">
        <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 4px;">[9] Indicadores de Sucesso (KPIs da v1)</div>
        <div class="grid-2">
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">&gt; 80%</div>
            <div style="font-size: 9.5px; color: #4A4841;">Redução no tempo gasto para lançar entradas de mercadorias no balcão.</div>
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">&gt; 92%</div>
            <div style="font-size: 9.5px; color: #4A4841;">Assertividade da IA na identificação de produtos por áudios informais.</div>
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">100%</div>
            <div style="font-size: 9.5px; color: #4A4841;">Adesão dos lançamentos de insumos via WhatsApp pelos operadores.</div>
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">Zero</div>
            <div style="font-size: 9.5px; color: #4A4841;">Ruptura crítica inesperada de estoque de cafés e insumos chave.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 5</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 6: BENCHMARK ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Benchmark de Mercado</div>
    </div>

    <div>
      <span class="section-tag">Análise Competitiva</span>
      <h2 class="main-title">🔍 Benchmark de Mercado & Concorrentes</h2>
      
      <p style="font-size: 10px; margin-bottom: 6px;">Comparativo entre as soluções convencionais e o ecossistema conversacional sob medida do Curto Café:</p>

      <table>
        <thead>
          <tr>
            <th>Solução / ERP</th>
            <th>Canal Principal</th>
            <th>Interface IA (Voz/Foto)</th>
            <th>Baixa Instrução</th>
            <th>Rede / Colaborativo</th>
            <th>Suporte Bilíngue</th>
            <th>Custo & Liberdade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ERPs Tradicionais</strong><br><span style="font-size:8px; color:#888;">Totvs, Linx, Alterdata</span></td>
            <td>Desktop / Telas densas</td>
            <td>❌ Não possui</td>
            <td>❌ Muito baixa (dezenas de campos)</td>
            <td>❌ Rígido e centralizado</td>
            <td>⚠️ Módulos caros e engessados</td>
            <td>🔴 Licenças caras e mensalidades altas</td>
          </tr>
          <tr>
            <td><strong>Sistemas Cloud PME</strong><br><span style="font-size:8px; color:#888;">ContaAzul, Bling, Tiny</span></td>
            <td>Navegador Web</td>
            <td>❌ Não possui (só formulários)</td>
            <td>⚠️ Média (exige treino prévio)</td>
            <td>❌ Foco em empresa individual</td>
            <td>❌ Apenas pt-BR</td>
            <td>🟡 Preço acessível, mas código fechado</td>
          </tr>
          <tr>
            <td><strong>Chatbots Comuns</strong><br><span style="font-size:8px; color:#888;">Menus 1, 2, 3</span></td>
            <td>WhatsApp</td>
            <td>❌ Sem IA contextual</td>
            <td>⚠️ Baixa (erros travam o fluxo)</td>
            <td>❌ Só atendimento a cliente</td>
            <td>❌ Engessado</td>
            <td>🟡 Barato, mas inútil para estoque</td>
          </tr>
          <tr style="background: #EBE8D8; font-weight: 600;">
            <td><strong>🚀 Curto ERP</strong><br><span style="font-size:8px; color:#1C3F3A;">Solução Proposta</span></td>
            <td><strong>WhatsApp + Web Simples</strong></td>
            <td><strong>✅ Whisper + LLM + OCR</strong></td>
            <td><strong>⭐ Máxima (1 toque em botões)</strong></td>
            <td><strong>✅ Rede distribuída (BR + PY)</strong></td>
            <td><strong>✅ pt-BR e es-PY nativos</strong></td>
            <td><strong>🟢 N8N livre, sem taxas por usuário</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="card card-accent" style="margin-top: 8px;">
        <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 4px;">💡 Insights e Diferenciais Competitivos:</div>
        <ul style="padding-left: 14px; font-size: 10px;">
          <li style="margin-bottom: 3px;"><strong>Inovação Operacional:</strong> O mercado usa WhatsApp só para vender/SAC. O Curto ERP inova ao usar IA para a <strong>operação interna e fornecedores</strong>.</li>
          <li style="margin-bottom: 3px;"><strong>Eliminação do "Gargalo da Planilha":</strong> O registro ocorre no exato instante em que a mercadoria entra no balcão.</li>
          <li><strong>Liberdade Tecnológica:</strong> Arquitetura aberta em N8N + PostgreSQL sem cobrança de mensalidades abusivas por usuário.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Benchmark</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 6</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 7: MAPA DE TELAS ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Arquitetura Web</div>
    </div>

    <div>
      <span class="section-tag">Interface do Usuário</span>
      <h2 class="main-title">🗺️ Mapa de Telas (Interface Web Administrativa)</h2>

      <div class="grid-2" style="gap: 8px;">
        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">1. Autenticação & Idioma</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Login simples por e-mail/senha com seletor de idioma (Português pt-BR / Español es-PY) e controle de nível de acesso.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">2. Dashboard Operacional</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Indicadores limpos com total de itens em estoque, produtos em nível crítico de reposição e alertas rápidos do dia.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">3. Catálogo de Produtos & Preços</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Cadastro de SKU, unidade, preço de custo/venda, estoque mínimo e <strong>tags/apelidos para IA</strong> (ex: "cafe graos, grao 250").</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">4. Gestão de Fornecedores</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Cadastro de parceiros com telefone de WhatsApp vinculado para reconhecimento automático das mensagens de entrega.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">5. Movimentações de Estoque</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Tabela completa de Entradas, Saídas, Perdas e Ajustes de Inventário com filtros por data, produto e operador.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">6. Central de Alertas & Compras</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Lista de itens com estoque baixo e botão para envio de ordem de compra/reposição direta para o fornecedor/torrefação.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">7. Fila de Exceções da IA</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Histórico de áudios e mensagens do WhatsApp que tiveram divergência de interpretação para validação humana rápida.</p>
        </div>

        <div class="card">
          <div style="font-weight: 700; font-size: 11px; color: #1C3F3A;">8. Relatórios Fiscais & Contábeis</div>
          <p style="font-size: 9.5px; margin-top: 2px;">Consulta de notas fiscais emitidas (NFC-e / NF-e) e download de arquivos XML/PDF para apoio ao contador (Renato).</p>
        </div>
      </div>

      <div class="highlight-box" style="margin-top: 10px;">
        ⭐ <strong>Estratégia Web-First:</strong> Essas 8 telas estarão operacionais no <strong>Mês 2</strong>, permitindo que a equipe já organize toda a base de dados real antes da ativação do WhatsApp.
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Mapa de Telas</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 7</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 8: FLUXOGRAMA MERMAID ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Diagrama de Fluxo</div>
    </div>

    <div>
      <span class="section-tag">Engenharia do Sistema</span>
      <h2 class="main-title">🔄 Fluxograma da Solução Integrada</h2>

      <div class="mermaid-box" style="height: 380px;">
        <pre class="mermaid">
flowchart TD
    classDef primary fill:#1C3F3A,stroke:#152F2C,stroke-width:1.5px,color:#FFFFFF;
    classDef accent fill:#D4A574,stroke:#B88755,stroke-width:1.5px,color:#2B2A26;
    classDef light fill:#EBE8D8,stroke:#D5D1BE,stroke-width:1px,color:#2B2A26;
    classDef base fill:#F8F7F4,stroke:#E5E3DB,stroke-width:1px,color:#2B2A26;

    subgraph Inputs["Entradas do Usuário"]
        AudioIn["🎤 Áudio WhatsApp (pt-BR / es-PY)"]:::light
        PhotoIn["📷 Foto de Nota / Canhoto"]:::light
        WebIn["💻 Lançamento no Painel Web"]:::light
    end

    subgraph Gateway["Mensageria & Orquestração"]
        UAZ["UAZAPI Gateway"]:::accent
        Webhook["Webhook n8n Receiver"]:::accent
    end

    subgraph AIEngine["Motor de Inteligência Artificial"]
        Whisper["Whisper (Áudio STT)"]:::base
        Vision["Vision (OCR de Notas)"]:::base
        NLU["LLM NLU (Extração de Entidades)"]:::base
        Fuzzy["Fuzzy Matcher de SKUs"]:::base
    end

    subgraph CoreERP["Core ERP & Banco de Dados"]
        StateMachine["State Machine de Confirmação"]:::primary
        DB[(PostgreSQL / Supabase)]:::primary
        Stock["Controle de Estoque & Saldos"]:::primary
        FiscalAPI["API Fiscal (Focus NFe)"]:::primary
    end

    subgraph Outputs["Saídas & Alertas"]
        BtnMsg["💬 Mensagem c/ Botões [Confirmar]"]:::accent
        AlertStock["⚠️ Alerta Estoque Mínimo"]:::accent
        FiscalDoc["📄 Emissão Nota Fiscal (PDF)"]:::accent
    end

    AudioIn --> UAZ
    PhotoIn --> UAZ
    UAZ --> Webhook
    Webhook --> Whisper
    Webhook --> Vision
    Whisper --> NLU
    Vision --> NLU
    NLU --> Fuzzy
    Fuzzy --> StateMachine
    StateMachine -->|Pergunta| UAZ
    UAZ --> BtnMsg
    BtnMsg -->|Clique Operador| Webhook
    Webhook --> DB
    WebIn --> DB
    DB --> Stock
    Stock -->|Saldo Baixo| AlertStock
    Stock -->|Venda/Saída| FiscalAPI
    FiscalAPI --> FiscalDoc
        </pre>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Fluxograma</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 8</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 9: ESTRUTURA DO BANCO DE DADOS (ERD) ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Modelagem de Dados</div>
    </div>

    <div>
      <span class="section-tag">Estrutura Relacional</span>
      <h2 class="main-title">🗄️ Estrutura do Banco de Dados — Diagrama ERD</h2>

      <div class="mermaid-box" style="height: 380px;">
        <pre class="mermaid">
erDiagram
    USUARIOS ||--o{ MOVIMENTACOES_ESTOQUE : "registra"
    USUARIOS ||--o{ SESSOES_WHATSAPP : "interage"
    FORNECEDORES ||--o{ PRODUTOS : "fornece"
    FORNECEDORES ||--o{ PEDIDOS_COMPRA : "recebe"
    CATEGORIAS ||--o{ PRODUTOS : "categoriza"
    PRODUTOS ||--o{ MOVIMENTACOES_ESTOQUE : "movimenta"
    PRODUTOS ||--o{ ITENS_PEDIDO_COMPRA : "compoe"
    PEDIDOS_COMPRA ||--o{ ITENS_PEDIDO_COMPRA : "possui"
    MOVIMENTACOES_ESTOQUE ||--o{ NOTAS_FISCAIS : "origina"

    USUARIOS {
        uuid id PK
        string nome
        string telefone_whatsapp
        string idioma_preferencial
        string perfil_acesso
        boolean ativo
    }

    FORNECEDORES {
        uuid id PK
        string razao_social
        string telefone_whatsapp
        string documento_fiscal
        string pais
    }

    PRODUTOS {
        uuid id PK
        uuid categoria_id FK
        uuid fornecedor_padrao_id FK
        string codigo_sku
        string nome_pt
        string nome_es
        text sinonimos_apelidos
        decimal preco_custo
        decimal preco_venda
        integer estoque_atual
        integer estoque_minimo_seguranca
    }

    MOVIMENTACOES_ESTOQUE {
        uuid id PK
        uuid produto_id FK
        uuid usuario_id FK
        string tipo_movimentacao
        integer quantidade
        decimal valor_unitario
        string origem_canal
        timestamp data_hora
    }

    SESSOES_WHATSAPP {
        uuid id PK
        string telefone_remetente
        string estado_conversa
        jsonb dados_temporarios_payload
    }
        </pre>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Banco de Dados</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 9</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 10: TABELAS DETALHADAS & PERFORMANCE ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Dicionário de Dados</div>
    </div>

    <div>
      <span class="section-tag">Especificação Técnica</span>
      <h2 class="main-title">🗄️ Tabelas Detalhadas & Performance (Postgres)</h2>

      <div style="font-weight: 700; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 2px;">Tabela: produtos</div>
      <table>
        <thead>
          <tr>
            <th>Campo</th>
            <th>Tipo</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td>UUID (PK)</td><td>Identificador único do produto</td></tr>
          <tr><td><code>nome_pt / nome_es</code></td><td>VARCHAR(150)</td><td>Nome em português e espanhol (pt-BR / es-PY)</td></tr>
          <tr><td><code>sinonimos_apelidos</code></td><td>TEXT</td><td>Termos/gírias para a IA (ex: <em>"grao 250, cafe graos"</em>)</td></tr>
          <tr><td><code>preco_custo / preco_venda</code></td><td>NUMERIC(12,2)</td><td>Preço de custo unitário e preço de venda balcão</td></tr>
          <tr><td><code>estoque_atual / estoque_minimo</code></td><td>INTEGER</td><td>Saldo físico atual e ponto de gatilho para alerta de compra</td></tr>
        </tbody>
      </table>

      <div style="font-weight: 700; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin: 6px 0 2px 0;">Tabela: movimentacoes_estoque</div>
      <table>
        <thead>
          <tr>
            <th>Campo</th>
            <th>Tipo</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>id</code></td><td>UUID (PK)</td><td>Identificador da movimentação</td></tr>
          <tr><td><code>tipo_movimentacao</code></td><td>VARCHAR(20)</td><td><code>ENTRADA</code>, <code>SAIDA_CONSUMO</code>, <code>PERDA_AVARIA</code>, <code>AJUSTE</code></td></tr>
          <tr><td><code>quantidade / valor_total</code></td><td>INTEGER / NUMERIC</td><td>Quantidade movimentada e valor total calculado</td></tr>
          <tr><td><code>origem_canal</code></td><td>VARCHAR(20)</td><td><code>WHATSAPP_AUDIO</code>, <code>WHATSAPP_FOTO</code>, <code>PAINEL_WEB</code></td></tr>
        </tbody>
      </table>

      <div class="card card-accent" style="margin-top: 6px;">
        <div style="font-weight: 800; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 3px;">⚡ Regras de Performance & Escala:</div>
        <ul style="padding-left: 14px; font-size: 9.5px;">
          <li><strong>Índices GIN (Trigram) em <code>sinonimos_apelidos</code>:</strong> Permite que a IA realize buscas aproximadas em milissegundos sem sobrecarregar o servidor.</li>
          <li><strong>Indexação B-Tree:</strong> Em <code>produtos.codigo_sku</code>, <code>usuarios.telefone_whatsapp</code> e <code>movimentacoes_estoque.data_hora</code>.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Dicionário de Dados</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 10</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 11: IDENTIDADE VISUAL ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Guia de Estilo</div>
    </div>

    <div>
      <span class="section-tag">Design System</span>
      <h2 class="main-title">🎨 Identidade Visual & Paleta de Cores Oficial</h2>

      <p style="font-size: 10px; margin-bottom: 8px;">A interface web e os templates de WhatsApp seguirão rigorosamente as cores e a tipografia da marca Curto Café:</p>

      <div class="grid-3" style="gap: 8px; margin-bottom: 12px;">
        <div class="card" style="border-top: 6px solid #1C3F3A;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Verde Curto</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#1C3F3A</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Botões principais (CTAs), cabeçalhos e identidade primária.</p>
        </div>

        <div class="card" style="border-top: 6px solid #EBE8D8;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Areia Natural</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#EBE8D8</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Cards de destaque, badges de status e fundos suaves.</p>
        </div>

        <div class="card" style="border-top: 6px solid #F8F7F4;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Off-White</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#F8F7F4</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Fundo principal das telas (clean, descansado e elegante).</p>
        </div>

        <div class="card" style="border-top: 6px solid #D4A574;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Caramelo Torra</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#D4A574</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Alertas, selos e elementos visuais de destaque.</p>
        </div>

        <div class="card" style="border-top: 6px solid #2B2A26;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Grafite Profundo</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#2B2A26</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Tipografia principal, títulos e bordas estruturais.</p>
        </div>

        <div class="card" style="border-top: 6px solid #4A4841;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Cinza Neutro</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 2px 4px; border-radius: 4px;">#4A4841</code>
          </div>
          <p style="font-size: 9px; margin-top: 4px;">Textos de apoio, legendas e descrições secundárias.</p>
        </div>
      </div>

      <div class="card card-accent">
        <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 4px;">Tipografia Oficial do Projeto</div>
        <div class="grid-2">
          <div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 800; color: #1C3F3A; text-transform: uppercase;">BARLOW CONDENSED</div>
            <div style="font-size: 9.5px; color: #4A4841;">Utilizada para títulos de impacto, números de estoque e códigos SKU.</div>
          </div>
          <div>
            <div style="font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 700; color: #1C3F3A;">Manrope Regular & Bold</div>
            <div style="font-size: 9.5px; color: #4A4841;">Utilizada para leitura fluida, formulários web e textos no WhatsApp.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Identidade Visual</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 11</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 12: MATRIZ DE ESFORÇO E INVESTIMENTO ==================== -->
  <div class="page bg-prd">
    <div class="header">
      <div class="logo-badge">
        <div class="logo-circle">curto</div>
        <div class="brand-name">Curto Café</div>
      </div>
      <div class="doc-tag">Planejamento & Sprints</div>
    </div>

    <div>
      <span class="section-tag">Cronograma & Entregas</span>
      <h2 class="main-title">📊 Matriz de Esforço, Prazos e Investimento</h2>

      <p style="font-size: 10px; margin-bottom: 6px;">
        Planejamento técnico dimensionado para 2 desenvolvedores (<strong>Neto & Fernando</strong>), com dedicação média conjunta de ~20h/semana ao longo de <strong>4 a 6 meses</strong> (12 Sprints quinzenais):
      </p>

      <table>
        <thead>
          <tr>
            <th>Módulo / Pacote de Entrega</th>
            <th>Janela (Scrum)</th>
            <th>Esforço (Horas)</th>
            <th>Entrega Tangível para o Cliente</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Infraestrutura, Setup & Modelagem</strong></td>
            <td>Mês 1 *(Sprints 1 e 2)*</td>
            <td><strong>60h</strong></td>
            <td>Servidor VPS configurado com Docker, PostgreSQL/Supabase, Redis, N8N e banco de dados pronto e indexado.</td>
          </tr>
          <tr style="background: #EBE8D8; font-weight: 600;">
            <td><strong>2. Interface Web Operacional (Web-First)</strong></td>
            <td>Mês 2 *(Sprints 3 e 4)*</td>
            <td><strong>80h</strong></td>
            <td><strong>🚀 Sistema Web no ar:</strong> Telas de produtos, preços, fornecedores e lançamentos manuais (pt-BR / es-PY).</td>
          </tr>
          <tr>
            <td><strong>3. WhatsApp Gateway (UAZAPI) & IA</strong></td>
            <td>Mês 3 *(Sprints 5 e 6)*</td>
            <td><strong>70h</strong></td>
            <td>Pareamento do WhatsApp, motor Whisper para áudios bilíngues e envio de mensagens com botões interativos.</td>
          </tr>
          <tr>
            <td><strong>4. Estoque Conversacional & Reposição</strong></td>
            <td>Mês 4 *(Sprints 7 e 8)*</td>
            <td><strong>80h</strong></td>
            <td>Entradas por áudio/foto + confirmação em 1 toque + alertas automáticos de estoque mínimo no WhatsApp.</td>
          </tr>
          <tr>
            <td><strong>5. Módulo Fiscal Simplificado (NFe/NFCe)</strong></td>
            <td>Mês 5 *(Sprints 9 e 10)*</td>
            <td><strong>60h</strong></td>
            <td>Emissão automática de notas fiscais via API Fiscal com envio direto do link e PDF no WhatsApp.</td>
          </tr>
          <tr>
            <td><strong>6. Calibração em Campo & Go-Live</strong></td>
            <td>Mês 6 *(Sprints 11 e 12)*</td>
            <td><strong>60h</strong></td>
            <td>Testes no balcão da loja, ajuste fino de prompts para ruídos/gírias, treinamento dos baristas e entrega final.</td>
          </tr>
          <tr style="background: #1C3F3A; color: #FFF; font-weight: 700;">
            <td>TOTAL CONSOLIDADO</td>
            <td>4 a 6 Meses</td>
            <td>410h</td>
            <td>Ecossistema Completo Operando em Produção (Web + WhatsApp + IA + Fiscal)</td>
          </tr>
        </tbody>
      </table>

      <div class="grid-3" style="margin-top: 6px;">
        <div class="card" style="padding: 8px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">1. Entregas Quinzenais</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Validações reais a cada 15 dias direto no WhatsApp do Sérgio.</p>
        </div>
        <div class="card" style="padding: 8px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">2. Código & Autonomia</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">100% de propriedade do Curto Café, sem taxas por usuário.</p>
        </div>
        <div class="card" style="padding: 8px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">3. Ajustes Rápidos no N8N</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Novas regras ou produtos configurados em minutos.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>Curto ERP Conversacional • Matriz de Esforço</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 12</span>
    </div>
  </div>


  <!-- ==================== PÁGINA 13: PROPOSTA FINANCEIRA (SLIDE FINAL) ==================== -->
  <div class="page bg-finance page-dark">
    <div class="watermark-pattern"></div>
    <div class="header header-dark">
      <div class="logo-badge">
        <div class="logo-circle logo-circle-dark">curto</div>
        <div class="brand-name brand-name-dark">Curto Café</div>
      </div>
      <div class="doc-tag doc-tag-dark">Investimento do Projeto</div>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 6px 0;">
      <div>
        <span class="section-tag">Proposta Comercial & Condições de Investimento</span>
        <h2 class="main-title main-title-dark" style="font-size: 32px; margin-bottom: 14px;">💼 Proposta Financeira</h2>

        <div style="background: rgba(255,255,255,0.06); border: 1.5px solid rgba(212, 165, 116, 0.4); border-radius: 14px; padding: 18px 20px; margin-bottom: 16px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #D4A574; font-weight: 800; margin-bottom: 4px;">
            Cálculo Total do Investimento
          </div>
          <div style="display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin: 10px 0;">
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 38px; font-weight: 800; color: #FFFFFF; line-height: 1;">
              R$ 85,00 <span style="font-size: 20px; font-weight: 600; color: #D4A574;">/ hora</span>
            </div>
            <div style="font-size: 24px; color: rgba(255,255,255,0.4); font-weight: 300;">×</div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 38px; font-weight: 800; color: #FFFFFF; line-height: 1;">
              410 <span style="font-size: 20px; font-weight: 600; color: #D4A574;">horas</span>
            </div>
            <div style="font-size: 24px; color: rgba(255,255,255,0.4); font-weight: 300;">=</div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 44px; font-weight: 800; color: #D4A574; line-height: 1;">
              R$ 34.850,00
            </div>
          </div>
          <p style="font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 6px;">
            Valor total para desenvolvimento completo, implantação, calibração da IA e entrega de todo o ecossistema operando em produção.
          </p>
        </div>

        <div class="grid-2" style="gap: 12px; margin-bottom: 16px;">
          <div class="card card-dark">
            <div style="font-weight: 800; font-size: 11px; color: #D4A574; text-transform: uppercase; margin-bottom: 4px;">📅 Sugestão de Pagamento por Marcos (Sprints)</div>
            <ul style="padding-left: 14px; font-size: 10px; line-height: 1.5; color: rgba(255,255,255,0.85);">
              <li><strong>Entrada de Início (Setup & Banco):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 2 (ERP Web Operacional no ar):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 3 (WhatsApp Gateway + Whisper IA):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 4 (Estoque Conversacional & Alertas):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 5 (Módulo Fiscal + Go-Live Final):</strong> 20% (R$ 6.970,00)</li>
            </ul>
          </div>

          <div class="card card-dark">
            <div style="font-weight: 800; font-size: 11px; color: #D4A574; text-transform: uppercase; margin-bottom: 4px;">🛡️ Garantias e Benefícios Inclusos</div>
            <ul style="padding-left: 14px; font-size: 10px; line-height: 1.5; color: rgba(255,255,255,0.85);">
              <li><strong>Código Aberto e Próprio:</strong> Todo o repositório e fluxos N8N são de propriedade integral do Curto Café.</li>
              <li><strong>Treinamento da Equipe:</strong> Capacitação prática com o time de balcão e contabilidade.</li>
              <li><strong>Suporte Pós Go-Live:</strong> 30 dias de acompanhamento e ajustes finos assistidos.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #FFFFFF;">Miguez Neto Tecnologia</div>
          <div style="font-size: 10px; color: rgba(255,255,255,0.6);">Neto (CEO) & Fernando (Sócio Desenvolvedor)</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; font-weight: 700; color: #D4A574;">Prontos para Iniciar</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.5);">Rio de Janeiro • 2026</div>
        </div>
      </div>
    </div>

    <div class="footer footer-dark">
      <span>Curto ERP Conversacional • Proposta Comercial</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Página 13</span>
    </div>
  </div>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      fontFamily: 'Manrope, sans-serif'
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'proposta.html'), htmlContent);

async function generatePDF() {
  console.log('Iniciando geração de PDF via Edge/Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const filePath = 'file:///' + path.join(__dirname, 'proposta.html').replace(/\\\\/g, '/');
  
  console.log('Carregando HTML:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Aguarda a renderização do Mermaid
  await page.waitForFunction(() => {
    return document.querySelectorAll('.mermaid svg').length >= 2;
  }, { timeout: 15000 }).catch(e => console.log('Aviso: timeout esperando mermaid, prosseguindo...'));

  await new Promise(r => setTimeout(r, 2000));

  const pdfPath = path.join(__dirname, 'docs', 'PROPOSTA_CURTO_CAFE_ERP.pdf');
  console.log('Gerando PDF em:', pdfPath);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('PDF gerado com sucesso!');
}

generatePDF().catch(err => {
  console.error('Erro na geração do PDF:', err);
  process.exit(1);
});
