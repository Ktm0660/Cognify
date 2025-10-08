import type { AppProps } from "next/app";

// Core globals (Tailwind entry or your base CSS)
import "../styles/globals.css";

// Centralize ALL first-party global styles here:
import "../styles/bank.css";
import "../styles/game.css";
import "../styles/login.css";
import "../styles/styles.css"; // <-- this is the one causing the current error

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
