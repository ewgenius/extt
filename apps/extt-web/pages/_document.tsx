import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-white font-ibm text-stone-900 dark:bg-stone-900 dark:text-white overflow-x-hidden">
      <Head>
        <script
          async
          defer
          data-domains="www.extt.app"
          data-website-id="367fb37a-f3d5-4100-942d-81abd8b668c8"
          src="https://analytics.ewgenius.me/umami.js"
        ></script>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
