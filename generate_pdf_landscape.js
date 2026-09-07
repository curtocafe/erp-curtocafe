const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const logoBase64 = fs.readFileSync(path.join(__dirname, 'logo_curto_erp.jpg')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Apresentação Proposta Curto Café ERP Conversacional</title>
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
      size: A4 landscape;
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
      width: 297mm;
      height: 210mm;
      position: relative;
      page-break-after: always;
      overflow: hidden;
      background: #F8F7F4;
      padding: 12mm 16mm 10mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* Backgrounds per slide */
    .bg-cover {
      background: linear-gradient(135deg, #1C3F3A 0%, #152F2C 55%, #0B1C1A 100%);
      color: #FFFFFF;
    }
    .bg-slide {
      background: linear-gradient(180deg, #F8F7F4 0%, #F2EEE5 100%);
    }
    .bg-finance {
      background: linear-gradient(145deg, #1C3F3A 0%, #173733 60%, #0E221F 100%);
      color: #FFFFFF;
    }
    .bg-black {
      background: #000000;
      color: #FFFFFF;
    }

    /* Ambient decor */
    .ambient-glow {
      position: absolute;
      top: -80px;
      right: -80px;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 165, 116, 0.14) 0%, rgba(212, 165, 116, 0) 70%);
      pointer-events: none;
    }

    /* Header & Footer */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1.5px solid rgba(43, 42, 38, 0.12);
    }
    .slide-header-dark {
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.15);
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1C3F3A;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
    .logo-circle-dark {
      background: #EBE8D8;
      color: #1C3F3A;
    }
    .brand-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.3px;
      text-transform: uppercase;
      color: #1C3F3A;
    }
    .brand-title-dark {
      color: #EBE8D8;
    }
    .slide-tag {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 3px 8px;
      border-radius: 14px;
      background: #EBE8D8;
      color: #1C3F3A;
    }
    .slide-tag-dark {
      background: rgba(255, 255, 255, 0.12);
      color: #EBE8D8;
    }

    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 6px;
      border-top: 1px solid rgba(43, 42, 38, 0.1);
      font-size: 8.5px;
      color: #9B9789;
    }
    .slide-footer-dark {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.5);
    }

    /* Content Typography */
    .section-eyebrow {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #D4A574;
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .slide-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #1C3F3A;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .slide-title-dark {
      color: #FFFFFF;
    }

    p, li {
      font-size: 10.5px;
      line-height: 1.45;
      color: #4A4841;
    }
    .page-dark p, .page-dark li {
      color: rgba(255, 255, 255, 0.85);
    }

    /* Layout Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
    }
    .grid-1-2 {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 12px;
    }

    /* Cards */
    .card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 10px 12px;
      border: 1px solid #E5E3DB;
      box-shadow: 0 2px 8px rgba(28, 63, 58, 0.04);
    }
    .card-accent {
      background: #EBE8D8;
      border: 1px solid #DCD8C8;
    }
    .card-dark {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    /* Badges */
    .badge {
      display: inline-block;
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
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
      font-size: 9.5px;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E5E3DB;
    }
    th {
      background: #1C3F3A;
      color: #FFFFFF;
      text-align: left;
      padding: 5px 8px;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.3px;
    }
    td {
      padding: 5px 8px;
      border-bottom: 1px solid #F0EEE8;
      color: #4A4841;
      vertical-align: middle;
      font-size: 9px;
      line-height: 1.3;
    }
    tr:nth-child(even) td {
      background: #FAF9F6;
    }
    tr.total-row {
      background: #1C3F3A !important;
    }
    tr.total-row td {
      background: #1C3F3A !important;
      color: #FFFFFF !important;
      font-weight: 700 !important;
      font-size: 9.5px !important;
      border-bottom: none;
    }

    /* Mock WhatsApp buttons */
    .mock-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9.5px;
      font-weight: 700;
      background: #1C3F3A;
      color: #FFFFFF;
      margin-right: 4px;
    }
    .mock-btn-sec {
      background: #EBE8D8;
      color: #1C3F3A;
      border: 1px solid #DCD8C8;
    }

    /* Mermaid box */
    .mermaid-box {
      background: #FFFFFF;
      border: 1px solid #E5E3DB;
      border-radius: 10px;
      padding: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      height: 125mm;
    }
    .mermaid svg {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>

  <!-- ==================== SLIDE 1: CAPA ==================== -->
  <div class="page bg-cover page-dark">
    <div class="ambient-glow"></div>
    <div class="slide-header slide-header-dark">
      <div class="brand-box">
        <div class="logo-circle logo-circle-dark">curto</div>
        <div class="brand-title brand-title-dark">Curto Café</div>
      </div>
      <div class="slide-tag slide-tag-dark">Apresentação Executiva</div>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 0 10px;">
      <span style="font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #D4A574;">
        Tecnologia, Inteligência Artificial & Automação de Varejo
      </span>
      <h1 style="font-family: 'Barlow Condensed', sans-serif; font-size: 46px; font-weight: 800; line-height: 0.95; letter-spacing: -1px; text-transform: uppercase; color: #FFFFFF; margin: 10px 0 14px 0;">
        Curto ERP <span style="color: #D4A574;">Conversacional</span> & Colaborativo
      </h1>
      <p style="font-size: 14px; line-height: 1.5; color: #EBE8D8; max-width: 780px; margin-bottom: 20px;">
        Documento de Requisitos de Produto (PRD), Arquitetura, Benchmark e Proposta Técnica para Gestão de Estoque e Reposição via WhatsApp com IA e Cockpit Web Operacional.
      </p>

      <div class="grid-4" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px; border-radius: 12px;">
        <div>
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 1px; color: #D4A574; font-weight: 700;">Cliente / Solicitante</div>
          <div style="font-size: 11px; font-weight: 700; color: #FFF;">Curto Café</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.6);">Sérgio Kienteca</div>
        </div>
        <div>
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 1px; color: #D4A574; font-weight: 700;">Desenvolvimento</div>
          <div style="font-size: 11px; font-weight: 700; color: #FFF;">Miguez Neto Tecnologia</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.6);">Neto (CEO) & Fernando (Dev)</div>
        </div>
        <div>
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 1px; color: #D4A574; font-weight: 700;">Metodologia & Prazo</div>
          <div style="font-size: 11px; font-weight: 700; color: #FFF;">Scrum (Sprints Quinzenais)</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.6);">4 a 6 meses de execução</div>
        </div>
        <div>
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 1px; color: #D4A574; font-weight: 700;">Escopo & Stack</div>
          <div style="font-size: 11px; font-weight: 700; color: #FFF;">Web-First + UAZAPI + IA</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.6);">N8N, Postgres, Whisper, Fiscal</div>
        </div>
      </div>
    </div>

    <div class="slide-footer slide-footer-dark">
      <span>Curto Café & Miguez Neto Tecnologia</span>
      <span>Confidencial • Proposta de Engenharia e Negócio</span>
      <span>Slide 1 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 2: PRD [1] & [2] ==================== -->
  <div class="page bg-slide">
    <div class="ambient-glow"></div>
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">PRD — Seções [1] e [2]</div>
    </div>

    <div>
      <span class="section-eyebrow">Documento de Requisitos de Produto</span>
      <h2 class="slide-title">PRD — [1] Nome do Projeto & [2] Visão Geral</h2>

      <div class="grid-1-2" style="gap: 12px; margin-top: 4px;">
        <div>
          <div class="card card-accent" style="margin-bottom: 10px;">
            <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase;">[1] Nome do Projeto</div>
            <div style="font-size: 15px; font-weight: 800; color: #2B2A26; margin-top: 4px;">Curto ERP Conversacional & Colaborativo</div>
          </div>

          <div class="card" style="border-left: 4px solid #1C3F3A; margin-bottom: 10px;">
            <strong style="font-size: 11px; color: #1C3F3A;">🌱 Filosofia Aberta & Descentralizada</strong>
            <p style="font-size: 9.5px; margin-top: 3px;">Alinhado com software livre, transparência de processos, flexibilidade e autonomia de rede entre Brasil e Paraguai.</p>
          </div>

          <div class="card" style="border-left: 4px solid #D4A574;">
            <strong style="font-size: 11px; color: #1C3F3A;">📱 Zero Curva de Aprendizado</strong>
            <p style="font-size: 9.5px; margin-top: 3px;">Feito para usuários com baixa maturidade digital: basta enviar áudio ou foto no WhatsApp e tocar nos botões.</p>
          </div>
        </div>

        <div class="card">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[2] Visão Geral do App / Sistema</div>
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
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 2 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 3: PRD [3] & [4] ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">PRD — Seções [3] e [4]</div>
    </div>

    <div>
      <span class="section-eyebrow">Objetivos & Personas</span>
      <h2 class="slide-title">[3] Objetivos da v1 & [4] Personas Prioritárias</h2>

      <div class="grid-2" style="gap: 12px; margin-top: 4px;">
        <!-- Objetivos -->
        <div class="card card-accent">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 8px;">[3] Objetivos da Primeira Versão (v1)</div>
          <ul style="padding-left: 14px; font-size: 10px;">
            <li style="margin-bottom: 6px;"><strong>Zero Fricção no Balcão:</strong> Registro de entradas e baixas de mercadorias em menos de 10 segundos via áudio ou foto no WhatsApp.</li>
            <li style="margin-bottom: 6px;"><strong>Base Web Operacional Imediata (Web-First):</strong> Disponibilizar em até 60 dias o painel web para cadastro de produtos, preços (custo e venda), fornecedores e controle de saldos.</li>
            <li style="margin-bottom: 6px;"><strong>Precisão na Reposição:</strong> Automatizar o cálculo de estoque mínimo e disparar alertas acionáveis no WhatsApp para compra/torra de café antes da ruptura.</li>
            <li style="margin-bottom: 6px;"><strong>Operação Internacional Unificada:</strong> Garantir suporte bilíngue completo (pt-BR e es-PY) e controle multimoeda (BRL e PYG/USD).</li>
            <li><strong>Emissão Fiscal Sem Burocracia:</strong> Emitir documentos fiscais (NFC-e / NF-e) através de gatilhos automáticos integrados a API fiscal.</li>
          </ul>
        </div>

        <!-- Personas (3 prioritárias) -->
        <div>
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[4] Personas Prioritárias</div>
          
          <div class="card" style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <strong style="font-size: 11px; color: #1C3F3A;">Sérgio (Fundador / Gestor)</strong>
              <span class="badge badge-green">Gestor Geral</span>
            </div>
            <p style="font-size: 9.5px;">Visão clara de estoque, alertas de reposição no WhatsApp, controle de margens e precificação segura sem planilhas complexas.</p>
          </div>

          <div class="card" style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <strong style="font-size: 11px; color: #1C3F3A;">Barista / Operador de Balcão (BR & PY)</strong>
              <span class="badge badge-gold">Operação</span>
            </div>
            <p style="font-size: 9.5px;">Registra quebras, abertura de pacotes e recebimento de mercadorias apenas enviando um áudio rápido no WhatsApp.</p>
          </div>

          <div class="card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <strong style="font-size: 11px; color: #1C3F3A;">Fornecedor Artesanal Local</strong>
              <span class="badge" style="background:#4A4841; color:#FFF;">Parceiro</span>
            </div>
            <p style="font-size: 9.5px;">Avisa a entrega de doces/pães (ex: "Deixei 30 brownies") e recebe confirmação formal com recibo digital no WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 3 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 4: PRD [5] PARTE 1 ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">PRD — Seção [5] (Parte 1)</div>
    </div>

    <div>
      <span class="section-eyebrow">Escopo Funcional</span>
      <h2 class="slide-title">[5] Funcionalidades Essenciais (MVP)</h2>

      <div class="grid-2" style="gap: 12px; margin-top: 4px;">
        <div class="card card-accent">
          <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span>🖥️</span> Módulo Web Administrativo (Cockpit de Gestão)
          </div>
          <ul style="padding-left: 14px; font-size: 10px;">
            <li style="margin-bottom: 5px;"><strong>Autenticação & Perfis:</strong> Acesso seguro com perfis de Gestor e Operador.</li>
            <li style="margin-bottom: 5px;"><strong>Catálogo de Produtos:</strong> Cadastro de SKU, unidade de medida, preço de custo, preço de venda, estoque mínimo de segurança e <strong>campo de sinônimos/apelidos</strong> (para alimentação da IA).</li>
            <li style="margin-bottom: 5px;"><strong>Gestão de Fornecedores:</strong> Cadastro de parceiros com número de WhatsApp vinculado para identificação automática do remetente.</li>
            <li style="margin-bottom: 5px;"><strong>Movimentações de Estoque:</strong> Telas para entrada manual, saída, ajuste de inventário e registro de perdas.</li>
            <li><strong>Internacionalização (i18n):</strong> Seletor no topo da tela (Português pt-BR / Español es-PY) e suporte a moedas (R$ e ₲ / US$).</li>
          </ul>
        </div>

        <div class="card">
          <div style="font-weight: 800; font-size: 12px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span>📱</span> Módulo Conversacional WhatsApp (UAZAPI + IA)
          </div>
          <ul style="padding-left: 14px; font-size: 10px;">
            <li style="margin-bottom: 5px;"><strong>Entrada de Mercadoria por Áudio:</strong> O fornecedor ou barista envia áudio → Whisper transcreve → LLM extrai itens e quantidades → Sistema envia mensagem com <strong>Botões Interativos</strong> (<code>[✅ Confirmar]</code>, <code>[✏️ Ajustar]</code>, <code>[❌ Cancelar]</code>) → Ao clicar, credita estoque.</li>
            <li style="margin-bottom: 5px;"><strong>Entrada por Foto de Documento (OCR):</strong> Envio de foto de canhoto, nota de entrega ou recibo de papel → IA lê os itens e monta a confirmação com botões.</li>
            <li style="margin-bottom: 5px;"><strong>Baixa Rápida de Consumo e Perdas:</strong> Comando de voz simples (ex: <em>"abrimos 2 sacos de café 1kg"</em> ou <em>"estragou 1 torta"</em>).</li>
            <li style="margin-bottom: 5px;"><strong>Consulta Rápida de Saldo:</strong> Pergunta informal no WhatsApp (ex: <em>"quantos pacotes de café moído temos?"</em>) respondida em tempo real.</li>
            <li><strong>Alertas de Reposição Automática:</strong> Mensagem proativa quando o estoque atingir o nível de alerta, com botão <code>[📦 Pedir Reposição]</code>.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 4 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 5: PRD [5] PARTE 2 & [6] ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">PRD — Seções [5] e [6]</div>
    </div>

    <div>
      <span class="section-eyebrow">Fluxo Operacional</span>
      <h2 class="slide-title">[5] Módulo Fiscal & [6] Fluxo do Usuário</h2>

      <div class="grid-1-2" style="gap: 12px; margin-top: 4px;">
        <div class="card" style="border-left: 4px solid #1C3F3A;">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">
            🧾 Módulo Fiscal Descomplicado
          </div>
          <ul style="padding-left: 14px; font-size: 9.5px;">
            <li style="margin-bottom: 6px;"><strong>Integração com API Fiscal (Focus NFe / Nuvem Fiscal):</strong> Parametrização prévia de NCM e regras tributárias alinhadas com a contabilidade.</li>
            <li><strong>Emissão em 1 Toque:</strong> Emissão assíncrona com envio imediato do link do PDF e XML no WhatsApp ou download no painel.</li>
          </ul>
        </div>

        <div class="card card-accent">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">
            [6] Fluxo Principal do Usuário (Exemplo Real)
          </div>

          <div class="grid-2" style="gap: 6px;">
            <div style="background:#FFF; padding: 6px 8px; border-radius: 6px; border:1px solid #DCD8C8;">
              <strong style="font-size: 9.5px; color: #1C3F3A;">1. Áudio do Fornecedor:</strong>
              <p style="font-size: 8.5px; margin-top: 2px;"><em>"Fala Sérgio, entreguei 40 brownies tradicionais e 20 de doce de leite a 4 reais cada."</em></p>
            </div>
            <div style="background:#FFF; padding: 6px 8px; border-radius: 6px; border:1px solid #DCD8C8;">
              <strong style="font-size: 9.5px; color: #1C3F3A;">2. IA Extrai & Cruza:</strong>
              <p style="font-size: 8.5px; margin-top: 2px;">Whisper transcreve → LLM extrai <code>40x Tradicional</code> e <code>20x Doce de Leite</code> → Fornecedor mapeado.</p>
            </div>
            <div style="background:#FFF; padding: 6px 8px; border-radius: 6px; border:1px solid #DCD8C8;">
              <strong style="font-size: 9.5px; color: #1C3F3A;">3. Mensagem com Botões:</strong>
              <div style="margin-top: 3px;">
                <span class="mock-btn">✅ Confirmar</span>
                <span class="mock-btn mock-btn-sec">✏️ Ajustar</span>
                <span class="mock-btn mock-btn-sec" style="background:#FFF; color:#B00;">❌ Cancelar</span>
              </div>
            </div>
            <div style="background:#FFF; padding: 6px 8px; border-radius: 6px; border:1px solid #DCD8C8;">
              <strong style="font-size: 9.5px; color: #1C3F3A;">4. Gravação em 1 Toque:</strong>
              <p style="font-size: 8.5px; margin-top: 2px;">Ao tocar em <strong>[Confirmar]</strong>, o ERP credita o estoque e lança o contas a pagar automaticamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 5 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 6: PRD [7], [8] & [9] ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">PRD — Seções [7], [8] e [9]</div>
    </div>

    <div>
      <span class="section-eyebrow">Requisitos & Métricas</span>
      <h2 class="slide-title">[7] Não-Funcionais, [8] Fora do Escopo & [9] KPIs</h2>

      <div class="grid-3" style="gap: 10px; margin-top: 4px;">
        <div class="card">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[7] Não-Funcionais</div>
          <ul style="padding-left: 12px; font-size: 9px;">
            <li style="margin-bottom: 4px;"><strong>Performance:</strong> Resposta de áudios no WhatsApp em menos de 5 segundos (Dependendo do tamanho do áudio).</li>
            <li style="margin-bottom: 4px;"><strong>Tolerância a Ruídos:</strong> Transcrição calibrada para barulho ambiente de cafeteria.</li>
            <li style="margin-bottom: 4px;"><strong>Segurança:</strong> Backups periódicos do Banco de Dados e tokens seguros no WhatsApp.</li>
            <li style="margin-bottom: 4px;"><strong>Open-Source & N8N:</strong> Nós modulares para total facilidade de edição.</li>
            <li><strong>Linguagem:</strong> Suporte nativo a pt-BR, es-PY e portunhol.</li>
          </ul>
        </div>

        <div class="card" style="border-left: 3px solid #D4A574;">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[8] Fora do Escopo (v1)</div>
          <ul style="padding-left: 12px; font-size: 9px;">
            <li style="margin-bottom: 4px;">Aplicativo mobile nativo para download nas lojas de apps.</li>
            <li style="margin-bottom: 4px;">Integração com sistema da Contabilidade.</li>
            <li style="margin-bottom: 4px;">Módulo complexo de folha de pagamento ou contabilidade pesada.</li>
            <li style="margin-bottom: 4px;">Hardware/leitores de RFID integrados fisicamente (preparado para v2).</li>
            <li>Cobrança de cartão de crédito direto no WhatsApp.</li>
          </ul>
        </div>

        <div class="card card-accent">
          <div style="font-weight: 800; font-size: 11px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 6px;">[9] Indicadores de Sucesso (KPIs)</div>
          <div class="grid-2" style="gap: 6px;">
            <div style="background:#FFF; padding:6px; border-radius:6px; text-align:center;">
              <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">&gt; 80%</div>
              <div style="font-size: 8px; color: #4A4841;">Menos tempo no lançamento de estoque</div>
            </div>
            <div style="background:#FFF; padding:6px; border-radius:6px; text-align:center;">
              <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">&gt; 92%</div>
              <div style="font-size: 8px; color: #4A4841;">Acurácia da IA na extração de itens</div>
            </div>
            <div style="background:#FFF; padding:6px; border-radius:6px; text-align:center;">
              <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">100%</div>
              <div style="font-size: 8px; color: #4A4841;">Adesão dos baristas via WhatsApp</div>
            </div>
            <div style="background:#FFF; padding:6px; border-radius:6px; text-align:center;">
              <div style="font-size: 16px; font-weight: 800; color: #1C3F3A;">Zero</div>
              <div style="font-size: 8px; color: #4A4841;">Ruptura crítica inesperada de café</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • PRD</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 6 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 7: BENCHMARK ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Benchmark Competitivo</div>
    </div>

    <div>
      <span class="section-eyebrow">Diferencial de Mercado</span>
      <h2 class="slide-title">🔍 Benchmark de Concorrentes & Proposta Única</h2>

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
          <tr style="background: #EBE8D8; font-weight: 700;">
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

      <div class="grid-3" style="gap: 8px; margin-top: 8px;">
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">1. Foco em Operação Interna:</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Uso pioneiro de IA no WhatsApp para desburocratizar a rotina de estoques e fornecedores.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">2. Fim do Gargalo da Planilha:</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Lançamentos no instante em que a mercadoria chega ao balcão, sem adiar tarefas.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">3. Liberdade Tecnológica:</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Propriedade 100% do Curto Café, sem cobrança de royalties por usuário cadastrado.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Benchmark</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 7 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 8: MAPA DE TELAS ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Arquitetura Web</div>
    </div>

    <div>
      <span class="section-eyebrow">Interface do Usuário</span>
      <h2 class="slide-title">🗺️ Mapa de Telas (Interface Web Administrativa)</h2>

      <div class="grid-4" style="gap: 8px; margin-top: 4px;">
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">1. Autenticação & Idioma</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Login simples por e-mail com seletor de idioma (Português pt-BR / Español es-PY).</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">2. Dashboard Operacional</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Indicadores de saldo total, itens em nível crítico de reposição e alertas do dia.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">3. Catálogo & Preços</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">SKU, preço de custo/venda, estoque mínimo e <strong>tags/apelidos para IA</strong>.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">4. Gestão de Fornecedores</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Cadastro de parceiros com telefone WhatsApp para reconhecimento automático.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">5. Movimentações Estoque</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Tabela de Entradas, Saídas, Perdas e Ajustes com filtros por data e produto.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">6. Central de Reposição</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Lista de itens abaixo do mínimo e botão para disparar ordem de compra/torra.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">7. Fila de Exceções IA</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Histórico de áudios com divergências para validação e ajuste manual rápido.</p>
        </div>
        <div class="card">
          <strong style="font-size: 10px; color: #1C3F3A;">8. Relatórios Fiscais</strong>
          <p style="font-size: 8.5px; margin-top: 2px;">Notas fiscais emitidas (NFC-e/NF-e) com download de XML/PDF.</p>
        </div>
      </div>

      <div class="card card-accent" style="margin-top: 10px; padding: 8px 12px;">
        ⭐ <strong>Estratégia Web-First:</strong> Essas 8 telas estarão operacionais no <strong>Mês 2</strong>, permitindo que o Sérgio já organize e valide toda a base de dados real antes da ativação dos fluxos de WhatsApp.
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Mapa de Telas</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 8 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 9: FLUXOGRAMA MERMAID ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Diagrama de Fluxo</div>
    </div>

    <div>
      <span class="section-eyebrow">Engenharia do Sistema</span>
      <h2 class="slide-title">🔄 Fluxograma da Solução Integrada</h2>

      <div class="mermaid-box">
        <pre class="mermaid">
flowchart LR
    classDef primary fill:#1C3F3A,stroke:#152F2C,stroke-width:1.5px,color:#FFFFFF;
    classDef accent fill:#D4A574,stroke:#B88755,stroke-width:1.5px,color:#2B2A26;
    classDef light fill:#EBE8D8,stroke:#D5D1BE,stroke-width:1px,color:#2B2A26;
    classDef base fill:#F8F7F4,stroke:#E5E3DB,stroke-width:1px,color:#2B2A26;

    subgraph Inputs["Entradas"]
        AudioIn["🎤 Áudio WhatsApp"]:::light
        PhotoIn["📷 Foto Canhoto"]:::light
        WebIn["💻 Painel Web"]:::light
    end

    subgraph Gateway["Mensageria"]
        UAZ["UAZAPI Gateway"]:::accent
        Webhook["Webhook n8n"]:::accent
    end

    subgraph AIEngine["Inteligência Artificial"]
        Whisper["Whisper (STT)"]:::base
        Vision["Vision (OCR)"]:::base
        NLU["LLM Parser"]:::base
        Fuzzy["Fuzzy Matcher"]:::base
    end

    subgraph CoreERP["Core ERP & DB"]
        StateMachine["State Machine"]:::primary
        DB[(PostgreSQL)]:::primary
        Stock["Estoque & Saldos"]:::primary
        FiscalAPI["API Fiscal"]:::primary
    end

    subgraph Outputs["Saídas"]
        BtnMsg["💬 Botões Interativos"]:::accent
        AlertStock["⚠️ Alerta Reposição"]:::accent
        FiscalDoc["📄 Nota Fiscal PDF"]:::accent
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
    Stock -->|Venda| FiscalAPI
    FiscalAPI --> FiscalDoc
        </pre>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Fluxograma</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 9 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 10: BANCO DE DADOS ERD ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Modelagem de Dados</div>
    </div>

    <div>
      <span class="section-eyebrow">Estrutura Relacional</span>
      <h2 class="slide-title">🗄️ Estrutura do Banco de Dados — Diagrama ERD</h2>

      <div class="mermaid-box">
        <pre class="mermaid">
erDiagram
    USUARIOS ||--o{ MOVIMENTACOES_ESTOQUE : "registra"
    USUARIOS ||--o{ SESSOES_WHATSAPP : "interage"
    FORNECEDORES ||--o{ PRODUTOS : "fornece"
    CATEGORIAS ||--o{ PRODUTOS : "categoriza"
    PRODUTOS ||--o{ MOVIMENTACOES_ESTOQUE : "movimenta"
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

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Banco de Dados</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 10 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 11: TABELAS & PERFORMANCE ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Dicionário de Dados</div>
    </div>

    <div>
      <span class="section-eyebrow">Especificação Técnica</span>
      <h2 class="slide-title">🗄️ Tabelas Detalhadas & Performance (Postgres)</h2>

      <div class="grid-2" style="gap: 12px; margin-top: 4px;">
        <div>
          <div style="font-weight: 700; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 2px;">Tabela: produtos</div>
          <table>
            <thead>
              <tr><th>Campo</th><th>Tipo</th><th>Descrição</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code></td><td>UUID (PK)</td><td>Identificador único do produto</td></tr>
              <tr><td><code>nome_pt / es</code></td><td>VARCHAR</td><td>Nome em português e espanhol</td></tr>
              <tr><td><code>sinonimos</code></td><td>TEXT</td><td>Termos para IA (ex: <em>"grao 250"</em>)</td></tr>
              <tr><td><code>preco_custo/venda</code></td><td>NUMERIC</td><td>Preço de custo e venda balcão</td></tr>
              <tr><td><code>estoque_atual/min</code></td><td>INTEGER</td><td>Saldo atual e ponto de reposição</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <div style="font-weight: 700; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 2px;">Tabela: movimentacoes_estoque</div>
          <table>
            <thead>
              <tr><th>Campo</th><th>Tipo</th><th>Descrição</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code></td><td>UUID (PK)</td><td>Identificador da movimentação</td></tr>
              <tr><td><code>tipo</code></td><td>VARCHAR</td><td><code>ENTRADA</code>, <code>SAIDA</code>, <code>PERDA</code>, <code>AJUSTE</code></td></tr>
              <tr><td><code>quantidade</code></td><td>INTEGER</td><td>Quantidade movimentada</td></tr>
              <tr><td><code>valor_total</code></td><td>NUMERIC</td><td>Valor financeiro total</td></tr>
              <tr><td><code>origem_canal</code></td><td>VARCHAR</td><td><code>WHATSAPP_AUDIO</code>, <code>WEB</code>, etc.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card card-accent" style="margin-top: 8px;">
        <div style="font-weight: 800; font-size: 10px; color: #1C3F3A; text-transform: uppercase; margin-bottom: 3px;">⚡ Otimização & Escala:</div>
        <p style="font-size: 9.5px;">
          Índices <strong>GIN (Trigram)</strong> no campo <code>sinonimos_apelidos</code> para <em>fuzzy search</em> ultrarrápido da IA + Indexação B-Tree em <code>produtos.codigo_sku</code>, <code>usuarios.telefone_whatsapp</code> e <code>movimentacoes_estoque.data_hora</code>.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Dicionário de Dados</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 11 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 12: IDENTIDADE VISUAL ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Design System</div>
    </div>

    <div>
      <span class="section-eyebrow">Identidade Visual</span>
      <h2 class="slide-title">🎨 Paleta de Cores Oficial do Curto Café</h2>

      <div class="grid-3" style="gap: 8px; margin-top: 4px; margin-bottom: 8px;">
        <div class="card" style="border-top: 5px solid #1C3F3A;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Verde Curto</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#1C3F3A</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Botões principais (CTAs), cabeçalhos e identidade primária.</p>
        </div>

        <div class="card" style="border-top: 5px solid #EBE8D8;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Areia Natural</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#EBE8D8</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Cards de destaque, badges de status e fundos suaves.</p>
        </div>

        <div class="card" style="border-top: 5px solid #F8F7F4;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Off-White</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#F8F7F4</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Fundo principal da aplicação (clean, descansado e elegante).</p>
        </div>

        <div class="card" style="border-top: 5px solid #D4A574;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Caramelo Torra</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#D4A574</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Alertas, selos e elementos visuais de destaque.</p>
        </div>

        <div class="card" style="border-top: 5px solid #2B2A26;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Grafite Profundo</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#2B2A26</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Tipografia principal, títulos e bordas estruturais.</p>
        </div>

        <div class="card" style="border-top: 5px solid #4A4841;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 11px; color: #1C3F3A;">Cinza Neutro</strong>
            <code style="font-size: 9px; background: #EBE8D8; padding: 1px 4px; border-radius: 4px;">#4A4841</code>
          </div>
          <p style="font-size: 8.5px; margin-top: 2px;">Textos de apoio, legendas e descrições secundárias.</p>
        </div>
      </div>

      <div class="card card-accent" style="padding: 8px 12px;">
        <div class="grid-2">
          <div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 800; color: #1C3F3A; text-transform: uppercase;">BARLOW CONDENSED</div>
            <div style="font-size: 9px; color: #4A4841;">Títulos de impacto, números de estoque e códigos SKU.</div>
          </div>
          <div>
            <div style="font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: #1C3F3A;">Manrope Regular & Bold</div>
            <div style="font-size: 9px; color: #4A4841;">Leitura fluida, formulários web e mensagens no WhatsApp.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Identidade Visual</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 12 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 13: MATRIZ DE ESFORÇO ==================== -->
  <div class="page bg-slide">
    <div class="slide-header">
      <div class="brand-box">
        <div class="logo-circle">curto</div>
        <div class="brand-title">Curto Café</div>
      </div>
      <div class="slide-tag">Planejamento & Sprints</div>
    </div>

    <div>
      <span class="section-eyebrow">Cronograma & Entregas</span>
      <h2 class="slide-title">📊 Matriz de Esforço, Prazos e Investimento</h2>

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
            <td>VPS com Docker, PostgreSQL/Supabase, Redis, N8N e banco de dados indexado.</td>
          </tr>
          <tr style="background: #EBE8D8; font-weight: 700;">
            <td><strong>2. Interface Web Operacional (Web-First)</strong></td>
            <td>Mês 2 *(Sprints 3 e 4)*</td>
            <td><strong>80h</strong></td>
            <td><strong>🚀 Sistema Web no ar:</strong> Telas de produtos, preços, fornecedores e estoques (pt-BR / es-PY).</td>
          </tr>
          <tr>
            <td><strong>3. WhatsApp Gateway (UAZAPI) & IA</strong></td>
            <td>Mês 3 *(Sprints 5 e 6)*</td>
            <td><strong>70h</strong></td>
            <td>Pareamento do WhatsApp, motor Whisper para áudios bilíngues e mensagens com botões interativos.</td>
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
            <td>Emissão automática de notas fiscais via API Fiscal com envio de link e PDF no WhatsApp.</td>
          </tr>
          <tr>
            <td><strong>6. Calibração em Campo & Go-Live</strong></td>
            <td>Mês 6 *(Sprints 11 e 12)*</td>
            <td><strong>60h</strong></td>
            <td>Testes no balcão da loja, ajuste de prompts para ruídos/gírias, treinamento e entrega final.</td>
          </tr>
          <tr class="total-row">
            <td><strong>TOTAL CONSOLIDADO</strong></td>
            <td><strong>4 a 6 Meses</strong></td>
            <td><strong>410h</strong></td>
            <td><strong>Ecossistema Completo Operando em Produção (Web + WhatsApp + IA + Fiscal)</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="grid-3" style="gap: 8px; margin-top: 6px;">
        <div class="card" style="padding: 6px 10px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">1. Entregas Quinzenais</strong>
          <p style="font-size: 8px; margin-top: 1px;">Validações reais a cada 15 dias direto no WhatsApp do Sérgio.</p>
        </div>
        <div class="card" style="padding: 6px 10px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">2. Código & Autonomia</strong>
          <p style="font-size: 8px; margin-top: 1px;">100% de propriedade do Curto Café, sem taxas por usuário.</p>
        </div>
        <div class="card" style="padding: 6px 10px;">
          <strong style="font-size: 9.5px; color: #1C3F3A;">3. Ajustes Rápidos no N8N</strong>
          <p style="font-size: 8px; margin-top: 1px;">Novas regras ou produtos configurados em minutos.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>Curto ERP Conversacional • Matriz de Esforço</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 13 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 14: PROPOSTA FINANCEIRA ==================== -->
  <div class="page bg-finance page-dark">
    <div class="ambient-glow"></div>
    <div class="slide-header slide-header-dark">
      <div class="brand-box">
        <div class="logo-circle logo-circle-dark">curto</div>
        <div class="brand-title brand-title-dark">Curto Café</div>
      </div>
      <div class="slide-tag slide-tag-dark">Investimento do Projeto</div>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 4px 0;">
      <div>
        <span class="section-eyebrow">Proposta Comercial & Condições de Investimento</span>
        <h2 class="slide-title slide-title-dark" style="font-size: 28px; margin-bottom: 10px;">💼 Proposta Financeira</h2>

        <div style="background: rgba(255,255,255,0.06); border: 1.5px solid rgba(212, 165, 116, 0.4); border-radius: 12px; padding: 12px 18px; margin-bottom: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #D4A574; font-weight: 800;">
            Cálculo Total do Investimento
          </div>
          <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin: 6px 0;">
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 34px; font-weight: 800; color: #FFFFFF; line-height: 1;">
              R$ 85,00 <span style="font-size: 18px; font-weight: 600; color: #D4A574;">/ hora</span>
            </div>
            <div style="font-size: 20px; color: rgba(255,255,255,0.4); font-weight: 300;">×</div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 34px; font-weight: 800; color: #FFFFFF; line-height: 1;">
              410 <span style="font-size: 18px; font-weight: 600; color: #D4A574;">horas</span>
            </div>
            <div style="font-size: 20px; color: rgba(255,255,255,0.4); font-weight: 300;">=</div>
            <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 40px; font-weight: 800; color: #D4A574; line-height: 1;">
              R$ 34.850,00
            </div>
          </div>
          <p style="font-size: 10px; color: rgba(255,255,255,0.8);">
            Valor total para desenvolvimento completo, implantação, calibração da IA e entrega de todo o ecossistema operando em produção.
          </p>
        </div>

        <div class="grid-2" style="gap: 10px; margin-bottom: 10px;">
          <div class="card card-dark" style="padding: 8px 12px;">
            <div style="font-weight: 800; font-size: 10px; color: #D4A574; text-transform: uppercase; margin-bottom: 3px;">📅 Pagamento por Marcos (Sprints)</div>
            <ul style="padding-left: 12px; font-size: 9px; line-height: 1.4; color: rgba(255,255,255,0.85);">
              <li><strong>Entrada de Início (Setup & Banco):</strong> 20% (R$ 6.970,00) - Sinal para início do desenvolvimento.</li>
              <li><strong>Marco 2 (ERP Web Operacional no ar):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 3 (WhatsApp Gateway + Whisper IA):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 4 (Estoque Conversacional & Alertas):</strong> 20% (R$ 6.970,00)</li>
              <li><strong>Marco 5 (Módulo Fiscal + Go-Live Final):</strong> 20% (R$ 6.970,00)</li>
            </ul>
          </div>

          <div class="card card-dark" style="padding: 8px 12px;">
            <div style="font-weight: 800; font-size: 10px; color: #D4A574; text-transform: uppercase; margin-bottom: 3px;">🛡️ Garantias e Benefícios Inclusos</div>
            <ul style="padding-left: 12px; font-size: 9px; line-height: 1.4; color: rgba(255,255,255,0.85);">
              <li><strong>Propriedade Integral:</strong> Código e fluxos N8N 100% do Curto Café.</li>
              <li><strong>Treinamento Completo:</strong> Capacitação prática com o time de balcão.</li>
              <li><strong>Suporte Pós Go-Live:</strong> 30 dias de acompanhamento assistido.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #FFFFFF;">Miguez Neto Tecnologia</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.6);">Neto (CEO) & Fernando (Sócio Desenvolvedor)</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10.5px; font-weight: 700; color: #D4A574;">Prontos para Iniciar</div>
          <div style="font-size: 8.5px; color: rgba(255,255,255,0.5);">Rio de Janeiro • 2026</div>
        </div>
      </div>
    </div>

    <div class="slide-footer slide-footer-dark">
      <span>Curto ERP Conversacional • Proposta Comercial</span>
      <span>Miguez Neto Tecnologia</span>
      <span>Slide 14 / 15</span>
    </div>
  </div>


  <!-- ==================== SLIDE 15: ENCERRAMENTO (LOGO) ==================== -->
  <div class="page bg-black page-dark" style="padding: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <img src="data:image/jpeg;base64,${logoBase64}" alt="Curto ERP Logo" style="max-width: 420px; max-height: 420px; width: auto; height: auto; object-fit: contain; border-radius: 50%; box-shadow: 0 0 60px rgba(0, 200, 255, 0.15);" />
    </div>
    <div style="position: absolute; bottom: 12px; left: 20px; right: 20px; display: flex; justify-content: space-between; font-size: 8.5px; color: rgba(255, 255, 255, 0.3);">
      <span>Curto Café & Miguez Neto Tecnologia</span>
      <span>Slide 15 / 15</span>
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

fs.writeFileSync(path.join(__dirname, 'proposta_landscape.html'), htmlContent);

async function generatePDF() {
  console.log('Iniciando geração de PDF Paisagem via Edge/Puppeteer com 15 slides...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  
  const filePath = 'file:///' + path.join(__dirname, 'proposta_landscape.html').replace(/\\\\/g, '/');
  console.log('Carregando HTML:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Aguarda renderização do Mermaid
  await page.waitForFunction(() => {
    return document.querySelectorAll('.mermaid svg').length >= 2;
  }, { timeout: 15000 }).catch(e => console.log('Aviso: timeout esperando mermaid, prosseguindo...'));

  await new Promise(r => setTimeout(r, 2500));

  const pdfPath = path.join(__dirname, 'docs', 'PROPOSTA_CURTO_CAFE_ERP_SLIDES.pdf');
  console.log('Gerando PDF Paisagem em:', pdfPath);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('PDF Paisagem gerado com sucesso com 15 slides!');
}

generatePDF().catch(err => {
  console.error('Erro na geração do PDF Paisagem:', err);
  process.exit(1);
});
