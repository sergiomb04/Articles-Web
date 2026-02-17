import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Printer, Search, X, CornerDownLeft } from 'lucide-react'; // Added Printer

interface ArticleInfo {
    slug: string;
    title: string;
    isDir: boolean;
}

interface NavItem {
    slug: string;
    title: string;
}

interface ArticlePageProps {
    content?: string;
    data?: { [key: string]: any };
    slug: string[];
    isDir: boolean;
    items?: ArticleInfo[];
    prev?: NavItem | null;
    next?: NavItem | null;
}


// Helper to strip sorting prefixes for display and URLs
const cleanSlug = (s: string) => s.replace(/^(#?\d+-)/, '');
const cleanTitle = (s: string) => s.replace('.md', '').replace(/^(#?\d+-)/, '').replace(/-/g, ' ').trim();

const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        };

        const timer = setTimeout(handleSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose ? onClose() : null; // This is actually for toggling, let's simplify
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-40">
            <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <Search className="text-slate-400" size={24} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar artículos... (Esc para salir)"
                        className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <Link
                                key={result.slug}
                                href={result.slug}
                                onClick={onClose}
                                className="flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{result.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">{result.description}</p>
                                </div>
                                <CornerDownLeft size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        ))
                    ) : query.length > 1 ? (
                        <div className="p-10 text-center text-slate-500">No se encontraron resultados para "{query}"</div>
                    ) : (
                        <div className="p-10 text-center text-slate-400 text-sm italic">Escribe al menos 2 caracteres para buscar...</div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{results.length} resultados encontrados</span>
                    <div className="flex gap-4">
                        <span>↑↓ para navegar</span>
                        <span>↵ para seleccionar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ArticlePage({ content, data, slug, isDir, items, prev, next }: ArticlePageProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const rawTitle = slug[slug.length - 1];

    const title = data?.title || cleanTitle(rawTitle);
    const author = data?.author;
    const date = data?.date ? new Date(data.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
    const tags = data?.tags as string[] | undefined;


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Head>
                <title>{`${title.charAt(0).toUpperCase() + title.slice(1)} | Article Reader`}</title>
                <meta name="description" content={data?.description || `Lee sobre ${title} en Article Reader`} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={data?.description || `Explora el artículo sobre ${title}`} />
                {data?.image && <meta property="og:image" content={data.image} />}
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={data?.description || `Lee más sobre ${title}`} />
                {data?.image && <meta name="twitter:image" content={data.image} />}
            </Head>


            <header className="border-b border-slate-200/50 dark:border-slate-800/50 py-4 px-6 fixed top-0 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-20">
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        ArticleReader
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            title="Buscar (Cmd+K)"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            title="Exportar a PDF"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={() => {
                                if (typeof document !== 'undefined') {
                                    document.documentElement.classList.toggle('dark');
                                }
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            aria-label="Toggle dark mode"
                        >
                            🌓
                        </button>
                    </div>
                </div>
            </header>


            <main className="pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <Link href={slug.length > 1 ? `/${slug.slice(0, -1).join('/')}` : "/"} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
                            ← {slug.length > 1 ? "Volver atrás" : "Volver al inicio"}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white capitalize mb-4">
                            {title}
                        </h1>
                        {!isDir && (author || date || tags) && (
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-6 mb-8">
                                {author && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Por {author}</span>
                                    </div>
                                )}
                                {date && (
                                    <div className="flex items-center gap-2">
                                        <span>•</span>
                                        <span>{date}</span>
                                    </div>
                                )}
                                {tags && tags.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span>•</span>
                                        {tags.map(tag => (
                                            <span key={tag} className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {isDir && (
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Explora el contenido de esta categoría.
                            </p>
                        )}
                    </div>

                    {isDir ? (
                        <div className="grid gap-6">
                            {items?.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/${slug.join('/')}/${item.slug}`}
                                    className="group block p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
                                                {item.title}
                                            </h2>
                                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                                {item.isDir ? "📂 Categoría" : "📄 Artículo"}
                                            </p>
                                        </div>
                                        <span className="text-slate-300 group-hover:text-blue-500 transition-colors text-2xl">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <>
                            <MarkdownRenderer content={content || ''} />

                            <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
                                {prev ? (
                                    <Link
                                        href={`/${slug.slice(0, -1).concat(prev.slug).join('/')}`}
                                        className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
                                    >
                                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Anterior</span>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 capitalize">{prev.title}</p>
                                    </Link>
                                ) : <div className="flex-1" />}

                                {next ? (
                                    <Link
                                        href={`/${slug.slice(0, -1).concat(next.slug).join('/')}`}
                                        className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group text-right"
                                    >
                                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Siguiente</span>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 capitalize">{next.title}</p>
                                    </Link>
                                ) : <div className="flex-1" />}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <footer className="py-8 text-center text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900 mt-12">
                <p>© 2026 Article Reader - {slug.map(cleanSlug).join(' / ')}</p>
            </footer>
        </div >
    );
}

function getAllPaths(dir: string, baseDir: string = ''): string[][] {
    const files = fs.readdirSync(dir);
    let paths: string[][] = [];

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relPath = path.join(baseDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            paths.push(relPath.split(path.sep).map(cleanSlug));
            paths = paths.concat(getAllPaths(fullPath, relPath));
        } else if (file.endsWith('.md')) {
            paths.push(relPath.replace('.md', '').split(path.sep).map(cleanSlug));
        }
    });

    return paths;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const mdDir = path.join(process.cwd(), 'public/md');
    if (!fs.existsSync(mdDir)) return { paths: [], fallback: false };

    const allPaths = getAllPaths(mdDir);
    const paths = allPaths.map(p => ({ params: { slug: p } }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string[];
    console.log('[getStaticProps] Checking slug:', slug);
    const mdDir = path.join(process.cwd(), 'public/md');

    // Find the actual file path by matching clean slugs
    let currentActualPath = mdDir;
    const actualSlugParts: string[] = [];

    for (const part of slug) {
        const items = fs.readdirSync(currentActualPath);
        const match = items.find(item => cleanSlug(item.replace('.md', '')) === part);
        if (!match) return { notFound: true };
        currentActualPath = path.join(currentActualPath, match);
        actualSlugParts.push(match);
    }

    const isDir = fs.statSync(currentActualPath).isDirectory();

    if (isDir) {
        const items = fs.readdirSync(currentActualPath).map(file => {
            const itemPath = path.join(currentActualPath, file);
            const itemIsDir = fs.statSync(itemPath).isDirectory();
            if (!itemIsDir && !file.endsWith('.md')) return null;

            return {
                slug: cleanSlug(itemIsDir ? file : file.replace('.md', '')),
                title: cleanTitle(file),
                isDir: itemIsDir,
                rawName: file
            };
        }).filter(Boolean) as (ArticleInfo & { rawName: string })[];

        items.sort((a, b) => a.rawName.localeCompare(b.rawName, undefined, { numeric: true, sensitivity: 'base' }));

        return {
            props: {
                slug,
                isDir: true,
                items: items.map(({ rawName, ...rest }) => rest)
            }
        };
    } else {
        const fileContent = fs.readFileSync(currentActualPath, 'utf8');
        const { data: rawData, content: rawContent } = matter(fileContent);
        const data = JSON.parse(JSON.stringify(rawData));

        // Simple minification: remove extra empty lines
        const content = rawContent.replace(/\n\s*\n/g, '\n\n').trim();


        // Get navigation

        const parentDir = path.dirname(currentActualPath);
        const siblings = fs.readdirSync(parentDir).map(file => {
            const p = path.join(parentDir, file);
            const itemIsDir = fs.statSync(p).isDirectory();
            if (itemIsDir || !file.endsWith('.md')) return null;
            return {
                slug: cleanSlug(file.replace('.md', '')),
                title: cleanTitle(file),
                rawName: file
            };
        }).filter(Boolean) as (NavItem & { rawName: string })[];

        siblings.sort((a, b) => a.rawName.localeCompare(b.rawName, undefined, { numeric: true, sensitivity: 'base' }));

        const currentIndex = siblings.findIndex(s => s.rawName === path.basename(currentActualPath));
        const prev = currentIndex > 0 ? { slug: siblings[currentIndex - 1].slug, title: siblings[currentIndex - 1].title } : null;
        const next = currentIndex < siblings.length - 1 ? { slug: siblings[currentIndex + 1].slug, title: siblings[currentIndex + 1].title } : null;

        return {
            props: {
                content,
                data,
                slug,
                isDir: false,
                prev,
                next
            },
            revalidate: 60, // ISR: Revalidate every 60 seconds
        };

    }
};
