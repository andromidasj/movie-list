import { Head, Html, Main, NextScript } from "next/document";

export default function _Document() {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#000" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>

      <body className="bg-slate-900 dark text-slate-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
