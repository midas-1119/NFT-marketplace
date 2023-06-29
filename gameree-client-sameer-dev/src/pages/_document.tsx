import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" translate="no">
        <Head>
          <link
            rel="preload"
            href="/fonts/Montserrat-Bold.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/Montserrat-SemiBold.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/Montserrat-Medium.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/Montserrat-Regular.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/TTTrailers-DemiBold.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/TTTrailers-Bold.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/TTTrailers-Medium.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link
            rel="preload"
            href="/fonts/TTTrailers-Regular.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
