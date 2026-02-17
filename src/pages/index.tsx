import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { siteConfig, getPageTitle, getFooterText } from '@/config/site.config';

interface Item {
    slug: string;
    title: string;
    isDir: boolean;
    rawName: string;
}

interface HomeProps {
    items: Item[];
}

const cleanSlug = (s: string) => s.replace(/^(#?\d+-)/, '');
const cleanTitle = (s: string) => s.replace('.md', '').replace(/^(#?\d+-)/, '').replace(/-/g, ' ').trim();

export default function Home({ items }: HomeProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Head>
                <title>{getPageTitle('Mis Artículos')}</title>
            </Head>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <header className="my-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                        {siteConfig.content.home.title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {siteConfig.content.home.subtitle}
                    </p>
                </header>

                <div className="grid gap-6">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/${item.slug}`}
                            className="group block p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
                                        {item.title}
                                    </h2>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                                        {item.isDir ? siteConfig.content.home.itemLabels.folder : siteConfig.content.home.itemLabels.article}
                                    </p>
                                </div>
                                <span className="text-slate-300 group-hover:text-blue-500 transition-colors text-2xl">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <footer className="py-8 text-center text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900 mt-12">
                <p>{getFooterText('Root')}</p>
            </footer>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const mdDir = path.join(process.cwd(), 'public/md');
    if (!fs.existsSync(mdDir)) {
        return { props: { items: [] } };
    }

    const files = fs.readdirSync(mdDir);
    const items = files.map(file => {
        const fullPath = path.join(mdDir, file);
        const isDir = fs.statSync(fullPath).isDirectory();

        if (!isDir && !file.endsWith('.md')) return null;

        return {
            slug: cleanSlug(isDir ? file : file.replace('.md', '')),
            title: cleanTitle(file),
            isDir,
            rawName: file
        };
    }).filter(Boolean) as Item[];

    // Sort by rawName to respect numbering
    items.sort((a, b) => a.rawName.localeCompare(b.rawName, undefined, { numeric: true, sensitivity: 'base' }));

    return {
        props: {
            items: items.map(({ rawName, ...rest }) => rest),
        },
    };
};
