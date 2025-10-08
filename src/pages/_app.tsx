import type { AppProps } from "next/app";
import "@/styles/globals.css";

// IMPORTANT: Do NOT import { Inter } from "next/font/google" here.
// That fetch can be blocked in this environment. We rely on the Tailwind/system font stack instead.

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
