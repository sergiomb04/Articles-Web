import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="es" className="dark">
            <Head />
            <body className="antialiased bg-slate-50 dark:bg-slate-900 transition-colors">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
