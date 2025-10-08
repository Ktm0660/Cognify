import type { AppProps } from "next/app";

// Tailwind/global entry (adjust path if yours differs)
import "../styles/globals.css";

// Move page-level global CSS imports here so Next is happy.
// Keep these even if some pages don't always need them.
// (If a file does not exist, keep the import; Codex may create it.)
import "../styles/bank.css";
import "../styles/game.css";
import "../styles/login.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
