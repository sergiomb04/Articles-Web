import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

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

export default function ArticlePage({ content, data, slug, isDir, items, prev, next }: ArticlePageProps) {
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


            <main className="pt-20">
                <div className={`mx-auto px-6 py-12 ${isDir ? 'max-w-4xl' : 'max-w-4xl lg:max-w-[90rem]'}`}>
                    <div className="mb-12 max-w-4xl mx-auto">
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
                                            <span key={tag} className="bg-blue-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
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
                        <div className="grid gap-6 max-w-4xl mx-auto">
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
                        <div className="flex flex-col lg:flex-row justify-center gap-12 xl:gap-24 relative">
                            {/* Sidebar pushed to the left by justify-center and gap */}
                            <aside className="hidden lg:block w-64 shrink-0">
                                {/* Sticky container needs to account for header height */}
                                <div className="sticky top-24">
                                    <TableOfContents content={content || ''} />
                                </div>
                            </aside>

                            {/* Content constrained to avoid being too wide */}
                            <div className="flex-1 min-w-0 max-w-4xl">
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
                            </div>
                            {/* Useful clear div or spacer if needed for 3-column balancing in future */}
                        </div>
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
