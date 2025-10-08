import type { AppProps } from "next/app";

// Load global CSS exactly once here.
// If Tailwind is already configured, this file should import the Tailwind entry (e.g., globals.css)
// Do NOT import any page-specific css files here.
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
