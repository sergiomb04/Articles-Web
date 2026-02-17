import "@/styles/globals.css";
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="antialiased">
            <Component {...pageProps} />
        </div>
    );
}
