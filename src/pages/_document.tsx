import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          {/* Tailwind CDN fallback — no build-time plugin required */}
          <script src="https://cdn.tailwindcss.com"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                tailwind.config = {
                  darkMode: 'class',
                  theme: { extend: {
                    colors: { surface: { light: '#ffffff', dark: '#0b1020' } },
                    boxShadow: { soft: '0 10px 30px -10px rgba(2,6,23,0.15)' }
                  }},
                  corePlugins: {},
                  plugins: []
                };
              `,
            }}
          />
          {/* System font stack for a clean look */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <body className="h-full bg-slate-50 text-slate-900 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
