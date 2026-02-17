import React, { useEffect, useState, useRef } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const isManualScroll = useRef(false);

    useEffect(() => {
        // Parse headings from markdown content
        // Query specifically within #article-content to avoid page title or other potential H1s
        const elements = Array.from(document.querySelectorAll('#article-content h1, #article-content h2, #article-content h3'));

        const items: TocItem[] = elements.map((elem) => ({
            id: elem.id,
            text: (elem as HTMLElement).innerText,
            level: Number(elem.tagName.substring(1))
        })).filter(item => item.id);

        setHeadings(items);

        // Store intersection state of all monitored elements
        const headingVisibility = new Map<string, boolean>();

        const callback: IntersectionObserverCallback = (entries) => {
            // Update visibility map always, even during manual scroll, 
            // to ensure state is accurate when lock is released
            entries.forEach((entry) => {
                headingVisibility.set(entry.target.id, entry.isIntersecting);
            });

            if (isManualScroll.current) return;

            // Find the first visible heading
            const visibleId = items.find(item => headingVisibility.get(item.id))?.id;

            if (visibleId) {
                setActiveId(visibleId);
            }
        };

        observer.current = new IntersectionObserver(callback, {
            // Adjust rootMargin to focus on the top part of the screen
            rootMargin: '-100px 0px -60% 0px'
        });

        elements.forEach((elem) => observer.current?.observe(elem));

        return () => observer.current?.disconnect();
    }, [content]);

    if (headings.length === 0) return null;

    // Calculate minLevel to normalize indentation dynamically
    const minLevel = headings.reduce((min, item) => Math.min(min, item.level), 3);

    return (
        <nav className="w-full max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 
            scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent 
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 
            [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600"
        >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider sticky top-0 bg-slate-50 dark:bg-slate-900 pb-2 z-10">
                En esta página
            </h4>
            <ul className="space-y-2 border-l border-slate-200 dark:border-slate-800">
                {headings.map((heading) => (
                    <li key={heading.id} style={{ paddingLeft: `${(heading.level - minLevel) * 1}rem` }}>
                        <a
                            href={`#${heading.id}`}
                            className={`block border-l-2 pl-4 -ml-[1px] text-sm transition-colors duration-200 py-1 ${activeId === heading.id
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                isManualScroll.current = true;
                                setActiveId(heading.id); // Instant feedback

                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });

                                history.pushState(null, '', `#${heading.id}`);

                                // Reset lock after animation
                                setTimeout(() => {
                                    isManualScroll.current = false;
                                }, 800);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
