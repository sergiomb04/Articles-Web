import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Printer, Search, X, CornerDownLeft } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

interface SearchResult {
    slug: string;
    title: string;
    description: string;
}

const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

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
                onClose ? onClose() : null;
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
                        placeholder={siteConfig.ui.search.placeholder}
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
                        <div className="p-10 text-center text-slate-500">{siteConfig.ui.search.noResults} "{query}"</div>
                    ) : (
                        <div className="p-10 text-center text-slate-400 text-sm italic">{siteConfig.ui.search.minCharacters}</div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{results.length} {siteConfig.ui.search.resultsCount}</span>
                    <div className="flex gap-4">
                        <span>↑↓ para navegar</span>
                        <span>↵ para seleccionar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme || siteConfig.theme.defaultMode;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

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

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header className="border-b border-slate-200/50 dark:border-slate-800/50 py-4 px-6 fixed top-0 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-20">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        {siteConfig.branding.name}
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            title={siteConfig.ui.search.tooltip}
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            title={siteConfig.ui.buttons.print}
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={() => {
                                if (typeof document !== 'undefined') {
                                    const isDark = document.documentElement.classList.toggle('dark');
                                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                                }
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            aria-label={siteConfig.ui.buttons.toggleTheme}
                        >
                            🌓
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
