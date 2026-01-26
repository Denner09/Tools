# 🚀 Guia Definitivo: Deploy Next.js (Static Export) no GitHub Pages

Este guia foi customizado para o seu projeto e cobre a versão mais recente do Next.js (App Router/Pages Router).

**Dados do Projeto:**

- **Repositório:** `Versão-React` (Atenção: Se o seu repositório atual for `Tools` como consta no git local, altere o `basePath` abaixo para `/Tools`).
- **Usuário:** `Denner09`

---

## 🛠️ 1. Preparação (Arquivos Críticos)

### A. Criar arquivo `.nojekyll`

O GitHub Pages usa Jekyll por padrão, que ignora pastas começando com `_` (como a vital `_next`). Precisamos desativar isso.

**Ação:** Crie um arquivo vazio chamado `.nojekyll` dentro da pasta `public/`.

_(Você pode usar o comando: `New-Item public/.nojekyll -ItemType File`)_

### B. Configurar `next.config.js`

Esta é a parte mais importante. Precisamos configurar o modo de exportação estática e o caminho base.

**Arquivo:** `next.config.js` (ou `.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Habilita o Static Export (gera HTML/CSS/JS na pasta 'out')
  output: "export",

  // 2. Define o caminho base do repositório
  // IMPORTANTE: Troque '/Versão-React' pelo nome exato do seu repositório no GitHub
  basePath: "/Versão-React",

  // 3. Desativa otimização de imagem do servidor (obrigatório para Static Export)
  images: {
    unoptimized: true,
  },

  // (Opcional) Garante que o React funcione estritamente
  reactStrictMode: true,
};

export default nextConfig;
```

---

## 📦 2. Dependências e Scripts

### A. Instalar `gh-pages`

Esta ferramenta fará o upload da pasta de build para o GitHub.

```bash
npm install gh-pages --save-dev
```

### B. Atualizar `package.json`

Abra o `package.json` e adicione/modifique estas linhas:

1.  **Homepage:** (Ajuda o roteador a entender onde está)

    ```json
    "homepage": "https://Denner09.github.io/Versão-React",
    ```

2.  **Scripts de Deploy:**
    Localize a seção `"scripts"` e adicione:
    ```json
    "scripts": {
      ...
      "deploy": "next build && gh-pages -d out -t"
    }
    ```
    _Explicação:_
    - `next build`: Gera a versão estática na pasta `out` (devido ao `output: 'export'`).
    - `gh-pages -d out`: Envia o conteúdo da pasta `out` para a branch `gh-pages`.
    - `-t`: (Opcional) Inclui arquivos dotfiles (como .nojekyll).

---

## 🖼️ 3. Ajustes de Código (Imagens e Links)

### Imagens (`<Image />`)

Como configuramos `images: { unoptimized: true }` no passo 1, o componente `<Image />` funcionará como uma tag `<img>` normal.

- **Não é necessário** criar um custom loader complexo para uso básico.
- Apenas certifique-se de usar caminhos relativos ou importar a imagem estaticamente (ex: `import logo from '../assets/logo.png'`).

### Links (`<Link />`)

O Next.js lida automaticamente com o `basePath`.

- Continue usando `<Link href="/sobre">`. O Next.js irá gerar o link final como `/Versão-React/sobre` automaticamente.

---

## 🚫 4. Limitações do Modo Estático (Static Export)

Ao usar `output: 'export'`, seu app vira puramente Frontend. Você **PERDE** as seguintes funcionalidades:

1.  **API Routes** (`src/pages/api/*` ou `app/api/*`): Não funcionam. Se precisar de backend, use serviços externos (Firebase, Supabase).
2.  **getServerSideProps**: Não roda. Use `getStaticProps` ou fetch no cliente (`useEffect`).
3.  **Middleware**: Não suportado.
4.  **Otimização de Imagem on-demand**: Desativada (já tratamos com `unoptimized: true`).

---

## 🚀 5. Executando o Deploy

1.  **Commitar alterações:**

    ```bash
    git add .
    git commit -m "chore: configure static export for gh-pages"
    git push origin main
    ```

2.  **Rodar o Script:**

    ```bash
    npm run deploy
    ```

3.  **Verificar no GitHub:**
    Vá em **Settings > Pages** no seu repositório e garanta que a fonte está definida para a branch `gh-pages`.

---

**Resumo para Copiar/Colar no Terminal:**

```powershell
# 1. Instalar dependência
npm install gh-pages --save-dev

# 2. Criar .nojekyll
New-Item public/.nojekyll -ItemType File -Force

# (Depois de configurar os arquivos package.json e next.config.js)...

# 3. Deploy
npm run deploy
```
