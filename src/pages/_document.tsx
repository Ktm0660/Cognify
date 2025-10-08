import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head />
        <body className="h-full bg-slate-50 text-slate-900 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
