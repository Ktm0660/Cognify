import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/bank.css";
import "../styles/game.css";
import "../styles/login.css";
import "../styles/styles.css";
import "../styles/home.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
