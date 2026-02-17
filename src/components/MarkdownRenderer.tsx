import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import mermaid from 'mermaid';
import { Check, Copy, Clock, ChevronDown, ChevronRight, Maximize2, X } from 'lucide-react';

interface MarkdownRendererProps {
    content: string;
}

// --- Helper Components ---

const Callout: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
    const styles: Record<string, { bg: string; border: string; icon: string; text: string; label: string }> = {
        '!NOTE': { bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-500', icon: 'ℹ️', text: 'text-blue-700 dark:text-blue-300', label: 'Nota' },
        '!TIP': { bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-500', icon: '💡', text: 'text-emerald-700 dark:text-emerald-300', label: 'Tip' },
        '!IMPORTANT': { bg: 'bg-purple-100 dark:bg-purple-900/40', border: 'border-purple-500', icon: '✨', text: 'text-purple-700 dark:text-purple-300', label: 'Importante' },
        '!WARNING': { bg: 'bg-amber-100 dark:bg-amber-900/40', border: 'border-amber-500', icon: '⚠️', text: 'text-amber-700 dark:text-amber-300', label: 'Aviso' },
        '!CAUTION': { bg: 'bg-red-100 dark:bg-red-900/40', border: 'border-red-500', icon: '🚫', text: 'text-red-700 dark:text-red-300', label: 'Cuidado' },
    };
    const style = styles[type] || styles['!NOTE'];
    return (
        <div className={`my-6 px-6 py-4 border-l-4 rounded-r-xl ${style.bg} ${style.border} ${style.text}`}>
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-xs">
                <span>{style.icon}</span>
                <span>{style.label}</span>
            </div>
            <div className="prose-p:m-0 prose-p:leading-relaxed">{children}</div>
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
                    ref.current.innerHTML = `<pre class="text-red-500 p-4 bg-red-500/10 rounded-lg">Error: ${error}</pre>`;
                }
            }
        };
        renderChart();
    }, [chart]);
    return <div className="mermaid flex justify-center my-10 bg-slate-900/10 dark:bg-slate-800/20 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner" ref={ref} />;
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { console.error(err); }
    };
    return (
        <button onClick={handleCopy} className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-slate-700/50 z-10" title="Copiar código">
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied && <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 animate-in fade-in slide-in-from-right-1 duration-200 fill-mode-forwards pointer-events-none">¡COPIADO!</span>}
        </button>
    );
};

const ReadingTime: React.FC<{ content: string }> = ({ content }) => {
    const words = content.replace(/!\[.*?\]\(.*?\)/g, '').trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return (
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
            <Clock size={16} />
            <span>{minutes} {minutes === 1 ? 'minuto' : 'minutos'} de lectura</span>
        </div>
    );
};

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="my-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                <span>{title}</span>
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] border-t border-slate-200 dark:border-slate-800 p-6' : 'max-h-0'}`}>{children}</div>
        </div>
    );
};

const Tabs: React.FC<{ items: { title: string; content: React.ReactNode }[] }> = ({ items }) => {
    const [activeTab, setActiveTab] = useState(0);
    if (!items.length) return null;
    return (
        <div className="my-8 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-1">
                {items.map((item, index) => (
                    <button key={index} onClick={() => setActiveTab(index)} className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${activeTab === index ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}>
                        {item.title}
                    </button>
                ))}
            </div>
            <div className="p-8">{items[activeTab]?.content}</div>
        </div>
    );
};

const YoutubeEmbed: React.FC<{ url: string }> = ({ url }) => {
    const id = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
    if (!id || id.length !== 11) return null;
    return (
        <div className="relative w-full pb-[56.25%] my-12 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${id}`} title="YouTube" frameBorder="0" allowFullScreen></iframe>
        </div>
    );
};

const OptimizedImage: React.FC<{ src: any; alt?: string }> = ({ src, alt }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!src) return null;
    const safeSrc = typeof src === 'string' ? src : '';

    return (
        <>
            <figure className="my-12">
                <div className="relative group cursor-zoom-in" onClick={() => setIsOpen(true)}>
                    <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800">
                        <Image src={safeSrc} alt={alt || ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                        <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full shadow-xl"><Maximize2 size={24} /></div>
                    </div>
                </div>
                {alt && <figcaption className="text-center text-sm text-slate-500 mt-5 italic font-medium">{alt}</figcaption>}
            </figure>
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
                    <button className="absolute top-6 right-6 p-3 text-white" onClick={() => setIsOpen(false)}><X size={32} /></button>
                    <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
                        <Image src={safeSrc} alt={alt || ''} fill className="object-contain" />
                    </div>
                    {alt && <span className="absolute bottom-10 text-white bg-black/50 px-6 py-2 rounded-full">{alt}</span>}
                </div>
            )}
        </>
    );
};

// --- Utils ---

const extractText = (node: any): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node) && (node.props as any).children) return extractText((node.props as any).children);
    return '';
};


// --- Main Renderer ---

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="w-full relative">
            <style jsx global>{`
                html { scroll-behavior: smooth; scroll-padding-top: 100px; }
                @media print {
                    header, footer, nav, .no-print, button { display: none !important; }
                    body { background: white !important; color: black !important; }
                    article { margin: 0 !important; padding: 0 !important; max-width: none !important; }
                    a:after { content: " (" attr(href) ") "; font-size: 0.8em; color: #666; }
                }
            `}</style>
            <ReadingTime content={content} />
            <article className={`prose prose-slate dark:prose-invert max-w-none
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
            `} id="article-content">
                <ReactMarkdown
                    remarkPlugins={[remarkUnwrapImages, remarkGfm, remarkMath, [remarkToc, { heading: 'Tabla de Contenidos', tight: true, maxDepth: 3 }]]}
                    rehypePlugins={[
                        rehypeRaw,
                        rehypeHighlight,
                        rehypeKatex,
                        [rehypeSanitize, {
                            ...defaultSchema,
                            tagNames: [...(defaultSchema.tagNames || []), 'iframe', 'div', 'section', 'style', 'figure', 'figcaption'],
                            attributes: {
                                ...defaultSchema.attributes,
                                iframe: ['src', 'title', 'frameBorder', 'allow', 'allowFullScreen', 'className'],
                                div: ['className', 'id'],
                                section: ['className'],
                                span: ['className'],
                                button: ['className', 'onClick', 'title'],
                                '*': ['className', 'style'],
                                h1: ['className'],
                                h2: ['className'],
                                h3: ['className'],
                                h4: ['className'],
                                h5: ['className'],
                                h6: ['className']
                            }
                        }],
                        rehypeSlug // Slug AFTER sanitize ensures IDs are applied to the final safe HTML
                    ]}
                    components={{
                        p: ({ children }) => {
                            const isBlock = React.Children.toArray(children).some((child: any) => {
                                if (React.isValidElement(child)) {
                                    // Check for block elements
                                    if (['div', 'figure', 'blockquote', 'table', 'pre', 'section'].includes(child.type as string)) return true;
                                    // Check for OptimizedImage
                                    if (child.type === OptimizedImage || (child.props as any)?.node?.tagName === 'img') return true;
                                    // Check for YoutubeEmbed (it comes as an anchor with specific href)
                                    if (child.type === 'a' || (child.props as any)?.node?.tagName === 'a') {
                                        const href = (child.props as any).href;
                                        const text = extractText((child.props as any).children);
                                        if (href && (href.includes('youtube.com') || href.includes('youtu.be')) && text === href) return true;
                                    }
                                }
                                return false;
                            });
                            return isBlock ? <div className="mb-4 leading-relaxed">{children}</div> : <p className="mb-4 leading-relaxed">{children}</p>;
                        },
                        blockquote: ({ children }) => {
                            const fullText = extractText(children).trim();

                            if (fullText.startsWith('[!TABS]')) {
                                const items: { title: string; content: React.ReactNode }[] = [];
                                let currentTitle = '';
                                let currentContent: React.ReactNode[] = [];
                                React.Children.forEach(children, (child: any) => {
                                    const text = extractText(child).trim();
                                    if (text === '[!TABS]') return;
                                    if (React.isValidElement(child) && ['h4', 'h5', 'h6'].includes(child.type as string)) {
                                        if (currentTitle) items.push({ title: currentTitle, content: <div>{currentContent}</div> });
                                        currentTitle = text; currentContent = [];
                                    } else { currentContent.push(child); }
                                });
                                if (currentTitle) items.push({ title: currentTitle, content: <div>{currentContent}</div> });
                                return <Tabs items={items} />;
                            }

                            const accMatch = fullText.match(/^\[!ACCORDION:(.+)\]/);
                            if (accMatch) {
                                const title = accMatch[1];
                                const filter = (nodes: any): any => React.Children.map(nodes, c => {
                                    if (typeof c === 'string') return c.replace(/^\[!ACCORDION:.+\]/, '').trim();
                                    if (React.isValidElement(c) && (c.props as any).children) return React.cloneElement(c, { children: filter((c.props as any).children) } as any);
                                    return c;
                                });
                                return <Accordion title={title}>{filter(children)}</Accordion>;
                            }

                            const calloutMatch = fullText.match(/^["'«]?\s*\[(![A-Z]+)\]/);
                            if (calloutMatch) {
                                const type = calloutMatch[1];
                                const filter = (nodes: any): any => React.Children.map(nodes, c => {
                                    if (typeof c === 'string') return c.replace(/^["'«]?\s*\[(![A-Z]+)\]\s*["'»]?/, '').trim();
                                    if (React.isValidElement(c) && (c.props as any).children) return React.cloneElement(c, { children: filter((c.props as any).children) } as any);
                                    return c;
                                });
                                return <Callout type={type}>{filter(children)}</Callout>;
                            }
                            return <blockquote>{children}</blockquote>;
                        },
                        pre: ({ children }) => (
                            <div className="group relative my-10 no-print">
                                <CopyButton text={extractText(children)} />
                                <pre className="overflow-x-auto rounded-xl shadow-2xl bg-[#0d1117] p-8 border border-slate-800/50">{children}</pre>
                            </div>
                        ),
                        code: ({ className, children }) => {
                            if (className?.includes('language-mermaid')) return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                            if (!className || !className.startsWith('language-')) return <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400 font-mono">{children}</code>;
                            return <code className={`${className} bg-transparent p-0`}>{children}</code>;
                        },
                        img: ({ src, alt }) => <OptimizedImage src={src} alt={alt} />,
                        a: ({ href, children }) => {
                            const text = extractText(children);
                            if (href && (href.includes('youtube.com') || href.includes('youtu.be')) && text === href) return <YoutubeEmbed url={href} />;

                            const isExternal = href?.startsWith('http');
                            return (
                                <a
                                    href={href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                >
                                    {children}
                                </a>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default MarkdownRenderer;
