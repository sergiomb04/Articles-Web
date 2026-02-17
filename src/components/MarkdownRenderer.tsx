import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Clock } from 'lucide-react';




interface MarkdownRendererProps {
    content: string;
}

const Callout: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
    const styles: Record<string, { bg: string; border: string; icon: string; text: string; label: string }> = {
        '!NOTE': { bg: 'bg-blue-50/50 dark:bg-blue-900/20', border: 'border-blue-500', icon: 'ℹ️', text: 'text-blue-700 dark:text-blue-300', label: 'Nota' },
        '!TIP': { bg: 'bg-emerald-50/50 dark:bg-emerald-900/20', border: 'border-emerald-500', icon: '💡', text: 'text-emerald-700 dark:text-emerald-300', label: 'Tip' },
        '!IMPORTANT': { bg: 'bg-purple-50/50 dark:bg-purple-900/20', border: 'border-purple-500', icon: '✨', text: 'text-purple-700 dark:text-purple-300', label: 'Importante' },
        '!WARNING': { bg: 'bg-amber-50/50 dark:bg-amber-900/20', border: 'border-amber-500', icon: '⚠️', text: 'text-amber-700 dark:text-amber-300', label: 'Aviso' },
        '!CAUTION': { bg: 'bg-red-50/50 dark:bg-red-900/20', border: 'border-red-500', icon: '🚫', text: 'text-red-700 dark:text-red-300', label: 'Cuidado' },
    };

    const style = styles[type] || styles['!NOTE'];

    return (
        <div className={`my-6 px-6 py-4 border-l-4 rounded-r-xl ${style.bg} ${style.border} ${style.text}`}>
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-xs">
                <span>{style.icon}</span>
                <span>{style.label}</span>
            </div>
            <div className="prose-p:m-0 prose-p:leading-relaxed">
                {children}
            </div>
        </div>
    );
};

const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (ref.current) {
                try {
                    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
                    const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
                    ref.current.innerHTML = svg;
                } catch (error) {
                    console.error('Mermaid render error:', error);
                    ref.current.innerHTML = `<pre class="text-red-500 font-mono text-xs p-4 bg-red-500/10 rounded-lg border border-red-500/20">Error rendering Mermaid chart: ${error}</pre>`;
                }
            }
        };
        renderChart();
    }, [chart]);

    return (
        <div className="mermaid flex justify-center my-10 bg-slate-900/10 dark:bg-slate-800/20 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner" ref={ref} />
    );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-slate-700/50 z-10"
            title="Copiar código"
        >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied && (
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 animate-in fade-in slide-in-from-right-1 duration-200 fill-mode-forwards pointer-events-none">
                    ¡COPIADO!
                </span>
            )}
        </button>
    );
};

const ReadingTime: React.FC<{ content: string }> = ({ content }) => {
    const wordsPerMinute = 200;
    const noStaging = content.replace(/!\[.*?\]\(.*?\)/g, ''); // Remove image syntax
    const words = noStaging.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return (
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
            <Clock size={16} />
            <span>{minutes} {minutes === 1 ? 'minuto' : 'minutos'} de lectura</span>
        </div>
    );
};

const YoutubeEmbed: React.FC<{ url: string }> = ({ url }) => {


    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const id = getYoutubeId(url);
    if (!id) return null;

    return (
        <div className="relative w-full pb-[56.25%] my-12 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

// Robust text extractor for slugifying
const extractText = (node: any): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node) && (node.props as any).children) return extractText((node.props as any).children);
    return '';
};

// Slugify logic that matches remark-toc (GitHub style)
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\s\u00A0-\u017F-]/g, '') // Remove dots, punctuation but keep accents
        .replace(/\s+/g, '-') // extra safety for spaces turned into dashes
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="w-full relative">
            <ReadingTime content={content} />
            <article className="prose prose-slate dark:prose-invert max-w-none

        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
        prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2
        prose-p:mb-4 prose-p:leading-relaxed
        prose-ul:ml-5 prose-ul:list-disc prose-ul:mb-4
        prose-ol:ml-5 prose-ol:list-decimal prose-ol:mb-4
        prose-hr:my-10 prose-hr:border-slate-200 dark:prose-hr:border-slate-700
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
        prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-xl
        prose-pre:bg-[#0d1117] dark:prose-pre:bg-[#0d1117] prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-800/50
        prose-blockquote:border-l-4 prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-600 prose-blockquote:bg-slate-50/50 dark:prose-blockquote:bg-slate-800/10 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:my-8
      " id="article-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath, [remarkToc, { heading: 'Tabla de Contenidos', tight: true, maxDepth: 3 }]]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                    components={{
                        // Custom heading renderers to provide IDs for TOC
                        h1: ({ children }) => <h1 id={slugify(extractText(children))}>{children}</h1>,
                        h2: ({ children }) => <h2 id={slugify(extractText(children))}>{children}</h2>,
                        h3: ({ children }) => <h3 id={slugify(extractText(children))}>{children}</h3>,
                        p: ({ children }) => {
                            const childrenArray = React.Children.toArray(children);
                            const hasBlockElement = childrenArray.some((child: any) => {
                                if (React.isValidElement(child)) {
                                    return (
                                        typeof child.type === 'function' ||
                                        ['div', 'figure', 'blockquote', 'table', 'pre', 'section'].includes(child.type as string)
                                    );
                                }
                                return false;
                            });

                            if (hasBlockElement) {
                                return <div className="mb-4 leading-relaxed">{children}</div>;
                            }
                            return <p className="mb-4 leading-relaxed">{children}</p>;
                        },
                        blockquote: ({ children }) => {
                            const fullText = extractText(children).trim();
                            const calloutRegex = /^["'«]?\s*\[(![A-Z]+)\]\s*["'»]?/;
                            const match = fullText.match(calloutRegex);

                            if (match) {
                                const type = match[1];
                                const removeMarker = (nodes: any): any => {
                                    return React.Children.map(nodes, (child) => {
                                        if (typeof child === 'string') return child.replace(calloutRegex, '').trim();
                                        if (React.isValidElement(child) && (child.props as any).children) {
                                            return React.cloneElement(child, { children: removeMarker((child.props as any).children) } as any);
                                        }
                                        return child;
                                    });
                                };
                                return <Callout type={type}>{removeMarker(children)}</Callout>;
                            }
                            return <blockquote>{children}</blockquote>;
                        },
                        // Improved pre/code rendering to avoid layout shifts and fix contrast
                        pre: ({ children }) => {
                            const codeText = extractText(children);
                            return (
                                <div className="group relative">
                                    <CopyButton text={codeText} />
                                    <pre className="overflow-x-auto rounded-xl shadow-2xl bg-[#0d1117] p-8 my-10 border border-slate-800/50">
                                        {children}
                                    </pre>
                                </div>
                            );
                        },

                        code: (props) => {
                            const { className, children } = props;
                            const isMermaid = className?.includes('language-mermaid');
                            const isInline = !className || !className.startsWith('language-');

                            if (isMermaid) {
                                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                            }

                            if (isInline) return <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400 font-mono">{children}</code>;
                            return <code className={`${className} bg-transparent p-0`}>{children}</code>;
                        },
                        img: ({ src, alt }) => {
                            const [isOpen, setIsOpen] = useState(false);
                            if (!src) return null;

                            return (
                                <>
                                    <figure className="my-10">
                                        <div
                                            className="relative group cursor-zoom-in"
                                            onClick={() => setIsOpen(true)}
                                        >
                                            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 transition-transform duration-300 group-hover:scale-[1.02]">
                                                <Image
                                                    src={src}
                                                    alt={alt || ''}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl">
                                                {/* Optional: Add a zoom icon here */}
                                            </div>
                                        </div>
                                        {alt && <figcaption className="text-center text-sm text-slate-500 mt-4 italic font-medium">{alt}</figcaption>}
                                    </figure>

                                    {isOpen && (
                                        <div
                                            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <button
                                                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[110]"
                                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                            >
                                                <X size={32} />
                                            </button>
                                            <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
                                                <Image
                                                    src={src}
                                                    alt={alt || ''}
                                                    fill
                                                    className="object-contain animate-in zoom-in-95 duration-300"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            {alt && (
                                                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full pointer-events-none">
                                                    {alt}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            );
                        },
                        a: ({ href, children }) => {
                            const isYoutube = href && (href.includes('youtube.com') || href.includes('youtu.be'));
                            if (isYoutube && children === href && href) {
                                return <YoutubeEmbed url={href} />;
                            }
                            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </div >
    );
};

export default MarkdownRenderer;
