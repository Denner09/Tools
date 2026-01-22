# Business Tools

Este repositório contém uma suíte de ferramentas web de produtividade ("Business Tools") desenvolvida para facilitar tarefas de gestão, manipulação de documentos e modelagem de processos. A aplicação é totalmente client-side (roda no navegador), segura e funciona como um PWA (Progressive Web App).

## 🚀 Funcionalidades

### 1. Editor e Conversor de Texto

Ferramenta para manipulação avançada de textos.

- **Transformações de Texto**:
  - Maiúsculas / Minúsculas
  - Title Case / Alternado
  - Formato de Frase
  - Remoção de quebras de linha
- **Ferramentas Específicas**:
  - **Formatador de Processo CNJ**: Transforma sequências de 18 dígitos no formato padrão CNJ (com cálculo de dígito verificador).
  - Corretor Ortográfico (toggle).
- **Estatísticas**: Contagem de palavras e caracteres.
- **Exportação**:
  - PDF, DOC (Word), TXT, JSON.
  - Cópia rápida para área de transferência.

### 2. Ferramentas PDF (PDF Utilities)

Uma coleção robusta de utilitários para manipulação de arquivos PDF usando bibliotecas avançadas (WASM/JS).

- **Juntar PDF**: Combine múltiplos arquivos em um só.
- **Comprimir**:
  - 5 Níveis de compressão (Mínima até Ultra/Reconstrução).
  - Compressão personalizada (defina um tamanho alvo em MB).
  - Uso de Ghostscript WASM para alta eficiência.
- **Dividir**: Extraia páginas específicas ou divida o documento inteiro.
- **Recortar (Crop)**: Ferramenta visual interativa para cortar margens de páginas.
- **Redimensionar**: Altere a escala das páginas (50%, 75%, 150%, 200%).
- **Rodar**: Rotacione páginas (90°, 180°, 270°) com pré-visualização.
- **Converter**:
  - **Para PDF**: Imagens (JPG/PNG) e Office (DOCX/XLSX - Experimental).
  - **De PDF**: Para Word (.doc), Excel, PowerPoint, JPG, PNG e SVG.
- **Numeração**: Adicione numeração de páginas (bates stamping) em várias posições.
- **Comparar**: Sobreponha dois PDFs para identificar diferenças visuais.
- **OCR (Reconhecimento de Texto)**: Extração de texto de PDFs digitalizados (Tesseract.js).
- **Reparar**: Tenta recuperar PDFs corrompidos.

### 3. Modelador BPMN (Fluxogramas)

Editor visual completo para modelagem de processos de negócio (Business Process Model and Notation 2.0).

- Criação de diagramas de fluxo padrão de mercado.
- Painel de propriedades e elementos BPMN completos.
- **Exportação**:
  - Salvar como XML (formato nativo BPMN).
  - Exportar como Imagem (SVG, PNG).
  - Exportar como PDF.

### 4. Funcionalidades Gerais

- **PWA (Progressive Web App)**: Instalável no desktop/mobile, funciona offline.
- **Dark Mode**: Tema escuro/claro integrado ao sistema.
- **Responsividade**: Layout adaptável para dispositivos móveis.
- **Segurança**: Processamento local (arquivos não são enviados para servidores), CSP rigorosa.

---

## 🛠 Tecnologias Utilizadas

### Core

- **HTML5 & CSS3** (Variáveis CSS, Flexbox, Grid)
- **JavaScript (ES6+)**
- **Vue.js 3** (Framework reativo para gerenciamento de estado e interface)

### Estilização

- **Bootstrap 5.3** (Framework CSS base)
- **Font Awesome 6.4** (Ícones)
- **Google Fonts (Inter)** (Tipografia)
- CSS Customizado (Design System "Premium", Glassmorphism)

### Bibliotecas Principais

| Funcionalidade | Biblioteca |
|Data/Hora | (Nativa) |
| **PDF Core** | `pdf-lib`, `pdf.js` |
| **PDF Render/Convert** | `Ghostscript WASM` (@jspawn/ghostscript-wasm) |
| **Office/Export** | `docx`, `xlsx`, `pptxgenjs`, `mammoth` |
| **Imagens** | `browser-image-compression`, `canvg` |
| **BPMN** | `bpmn-js` |
| **OCR** | `tesseract.js` |
| **Utilitários** | `FileSaver.js`, `jszip` |

---

## 📦 Instalação e Uso

1. Clone o repositório.
2. Não requer instalação de dependências de servidor (Node.js/Python apenas para dev server se desejar).
3. Abra o `index.html` diretamente no navegador ou sirva através de um servidor estático (ex: Live Server do VSCode, `http-server`, `python -m http.server`).

_Nota: Para funcionamento correto dos Web Workers (OCR, Ghostscript) e Service Workers (PWA), recomenda-se rodar via HTTPS ou localhost._
