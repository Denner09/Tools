import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR" data-scroll-behavior="smooth">
      <Head />
      <body className="bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
