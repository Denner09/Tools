# 💼 Business Tools

**Uma suíte completa de ferramentas executivas para gestão de documentos, modelagem de processos e formatação de textos.**

Este projeto é uma aplicação web moderna construída com **Next.js**, focada em produtividade e utilitário para ambiente corporativo. O sistema oferece uma interface limpa, modo escuro nativo e processamento client-side para máxima performance e privacidade.

---

## 🚀 Funcionalidades do Sistema

### 📄 1. Suite de Ferramentas PDF

Uma coleção robusta de utilitários para manipulação de arquivos PDF, rodando diretamente no navegador (WASM/JS) ou via API selecionada.

- **Juntar PDF**: Combine múltiplos arquivos em um único documento, mantendo a ordem selecionada.
- **Dividir PDF**: Separe documentos por **intervalos de páginas** (ex: 1-5, 8) ou por **tamanho do arquivo** (ex: dividir em partes de 5MB).
- **Comprimir PDF**: Reduza o tamanho do arquivo com opções de qualidade (Normal, Alta, Extrema) ou um **alvo de tamanho personalizado** (MB).
- **OCR (Reconhecimento de Texto)**:
  - Extração de texto puro (.txt).
  - Criação de PDF Pesquisável (através de imagens).
  - **Comparação de Documentos**: Analisa diferenças textuais entre dois PDFs (Diff).
- **Cortar (Crop)**: Interface visual interativa para recortar áreas específicas de uma página.
- **Rotacionar**: Gire páginas individuais ou o documento inteiro em 90°, 180° ou 270°.
- **Numeração**: Adicione números de páginas customizáveis (posição, cor, formato, início).
- **Converter**: Transforme PDFs em Word, Excel, PowerPoint, JPG, PNG ou SVG.
- **Reparar**: Tenta reconstruir a tabela XRef de arquivos corrompidos.

### 🔄 2. Modelador BPMN 2.0

Um editor visual completo para Business Process Model and Notation (BPMN).

- **Modelagem Visual**: Interface drag-and-drop para criar diagramas de fluxo.
- **Dark Mode Nativo**: O modelador adapta todas as formas e conexões para um tema escuro otimizado.
- **Palette Customizada**: Barra de ferramentas lateral personalizada e estilizada.
- **Importação/Exportação**:
  - Abrir arquivos `.bpmn` ou `.xml`.
  - Salvar rascunho.
  - Exportar como **XML (BPMN 2.0)**, **SVG**, **PNG** ou **PDF**.
- **Auto-Save**: Salva automaticamente um rascunho no LocalStorage para evitar perda de dados.

### ✍️ 3. Editor de Texto & Formatador Jurídico

Ferramenta para limpeza e formatação rápida de textos.

- **Formatação Automática de CNJ**: Detecta numerações jurídicas (20 ou 18 dígitos) e aplica a máscara correta (NNNNNNN-DD.AAAA.J.TR.OOOO).
- **Limpeza de Texto**: Remove quebras de linha excessivas, espaços duplos e caracteres especiais de PDFs mal formatados.
- **Histórico**: Sistema de Desfazer/Refazer (Undo/Redo).
- **Estatísticas**: Contagem de palavras e caracteres em tempo real.
- **Exportação**: Gera documentos `.docx` ou `.pdf` baseados no texto editado.

---

## 💻 Seção do Desenvolvedor (Dev Section)

### 🛠️ Stack Tecnológica

O projeto foi construído utilizando as seguintes tecnologias principais:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (React)
  - _Uso_: Gerenciamento de rotas, renderização híbrida e estrutura do projeto.
  - _Localização_: `src/pages/_app.jsx` (Global), `src/pages/index.jsx` (Home).

- **Estilização**:
  - **TailwindCSS**: Utilitário CSS principal para layout responsivo e design system.
  - **SASS/SCSS**: Utilizado para estilos globais complexos e overrides de bibliotecas (`src/styles/main.scss`).
  - **CSS Modules/Global**: `src/index.css` contém variáveis CSS (CSS Variables) para o tema Claro/Escuro (`--bg-page`, `--text-main`, etc).
  - **FontAwesome**: Ícones vetoriais (`@fortawesome/fontawesome-free`).

- **Gerenciamento de Estado & Contexto**:
  - `src/context/ThemeContext`: Gerencia o estado global do tema (Dark/Light) e persiste a preferência do usuário.

### 📚 Bibliotecas e Implementações Chave

#### PDF Tools (`src/pages/pdf-tools.jsx` & `src/components/pdf-tools/`)

- **pdf-lib**: Utilizada para manipulação estrutural de PDFs (Juntar, Dividir, Rotacionar, Numeração). Permite criar e modificar documentos via JavaScript no browser.
- **tesseract.js**: Engine de OCR em WebAssembly para reconhecimento de texto via client-side.
- **diff**: Biblioteca para computar diferenças textuais entre documentos na ferramenta de comparação.
- **jszip**: Utilizada na ferramenta de Compressão/Divisão para gerar arquivos .zip quando o output é múltiplo.
- **Architecture**: A página foi refatorada para utilizar componentes modulares (`PDFToolsSidebar`, `FileDropzone`) e manter o código limpo.

#### BPMN Modeler (`src/pages/bpmn.jsx` & `src/components/bpmn/`)

- **bpmn-js**: O core do modelador visual.
- **Customização de Tema** (`BpmnTheme.js`): Foi implementada uma lógica personalizada para interceptar eventos de renderização (`shape.added`) e injetar classes CSS específicas para suportar o modo escuro, já que a biblioteca original não suporta nativamente.
- **CSS Overrides**: O arquivo `index.css` contém regras CSS com alta especificidade (`!important`) para forçar a estilização da Palette e do Context Pad para que combinem com o design system da aplicação.

#### Editor de Texto (`src/pages/text-editor.jsx`)

- **docx**: Biblioteca para gerar documentos Word (.docx) programaticamente no navegador.
- **file-saver**: Para gerenciar o download de blobs gerados pelo navegador.
- **Regex**: Utilizado extensivamente para as regras de formatação de CNJ e limpeza de texto.

### 📂 Estrutura de Arquivos

```
src/
├── components/
│   ├── bpmn/           # Lógica e módulos específicos do BPMN
│   ├── layout/         # Componentes estruturais (Navbar, Footer, Sidebar)
│   ├── pdf-tools/      # Componentes parciais da ferramenta PDF
│   ├── ui/             # Componentes atômicos (Card, Button)
│   ├── FeatureCard.jsx # Card da Home
│   └── ThemeToggle.jsx # Botão de alternância de tema
├── context/            # React Context Provider (Theme)
├── pages/              # Rotas do Next.js (index, bpmn, pdf-tools, text-editor)
├── styles/             # Arquivos SASS globais
├── App.css             # Estilos legados/globais
└── index.css           # Configuração Tailwind e Váriaveis de CSS (Tema)
```

### 🎨 Design System

O design segue uma abordagem **"Glassmorphism & Clean UI"**:

- **Cores**: Baseadas em variáveis (`var(--bg-card)`, `var(--primary-color)`). O Laranja (`#f97316`) é a cor de destaque (Primary).
- **Tipografia**: Utiliza a fonte **Poppins** (Google Fonts) para uma aparência moderna e geométrica.
- **Feedback**: Micro-interações em hover, transições suaves (300ms) e toasts de notificação.

---

### Executando Localmente

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Acesse `http://localhost:3000`.
