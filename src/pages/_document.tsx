import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          <script src="https://cdn.tailwindcss.com"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                tailwind.config = {
                  darkMode: 'class',
                  theme: {
                    extend: {
                      boxShadow: {
                        soft: '0 10px 30px -10px rgba(2,6,23,0.15)'
                      },
                      backgroundImage: {
                        'hero': 'radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,.20) 0%, rgba(255,255,255,0) 60%)'
                      }
                    }
                  },
                  plugins: []
                }
              `,
            }}
          />
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
