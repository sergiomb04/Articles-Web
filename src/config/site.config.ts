/**
 * Site Configuration
 * 
 * Centralized configuration for the Articles-Web application.
 * Modify these values to customize your site's branding, theme, and content.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SiteConfig {
    branding: {
        name: string;
        tagline: string;
        description: string;
    };
    theme: {
        /**
         * Default theme mode when a user visits for the first time
         * - 'light': Always start in light mode
         * - 'dark': Always start in dark mode
         * - 'system': Use the system preference
         */
        defaultMode: ThemeMode;
        /**
         * Color palette for the site
         * You can use Tailwind CSS color names or custom CSS color values
         */
        colors: {
            primary: {
                light: 'blue-600';
                dark: 'blue-400';
            };
            accent: {
                light: 'indigo-600';
                dark: 'indigo-400';
            };
            background: {
                light: 'slate-50';
                dark: 'slate-900';
            };
            surface: {
                light: 'white';
                dark: 'slate-800';
            };
            text: {
                primary: {
                    light: 'slate-900';
                    dark: 'white';
                };
                secondary: {
                    light: 'slate-600';
                    dark: 'slate-400';
                };
            };
        };
    };
    content: {
        home: {
            title: string;
            subtitle: string;
            itemLabels: {
                folder: string;
                article: string;
            };
        };
        article: {
            backButton: {
                toHome: string;
                toParent: string;
            };
            navigation: {
                previous: string;
                next: string;
            };
            folderSubtitle: string;
        };
        footer: {
            text: string;
            year: number;
            showPath: boolean;
            rootPath: string;
        };
    };
    ui: {
        search: {
            placeholder: string;
            noResults: string;
            minCharacters: string;
            tooltip: string;
            resultsCount: string;
        };
        buttons: {
            print: string;
            toggleTheme: string;
        };
    };
}

export const siteConfig: SiteConfig = {
    branding: {
        name: 'ArticlesWeb',
        tagline: 'Your knowledge library',
        description: 'Dynamic Markdown article system with full support for GFM, Mermaid, KaTeX, and more.',
    },
    theme: {
        defaultMode: 'dark',
        colors: {
            primary: {
                light: 'blue-600',
                dark: 'blue-400',
            },
            accent: {
                light: 'indigo-600',
                dark: 'indigo-400',
            },
            background: {
                light: 'slate-50',
                dark: 'slate-900',
            },
            surface: {
                light: 'white',
                dark: 'slate-800',
            },
            text: {
                primary: {
                    light: 'slate-900',
                    dark: 'white',
                },
                secondary: {
                    light: 'slate-600',
                    dark: 'slate-400',
                },
            },
        },
    },
    content: {
        home: {
            title: 'Article Library',
            subtitle: 'Explore and read dynamic articles rendered directly from Markdown.',
            itemLabels: {
                folder: '📂 Category • View folder',
                article: '📄 Article • Read now',
            },
        },
        article: {
            backButton: {
                toHome: 'Back to home',
                toParent: 'Go back',
            },
            navigation: {
                previous: 'Previous',
                next: 'Next',
            },
            folderSubtitle: 'Explore the content of this category.',
        },
        footer: {
            text: 'Articles Web',
            year: 2026,
            showPath: true,
            rootPath: 'Root',
        },
    },
    ui: {
        search: {
            placeholder: 'Search articles... (Esc to close)',
            noResults: 'No results found for',
            minCharacters: 'Type at least 2 characters to search...',
            tooltip: 'Search (Cmd+K)',
            resultsCount: 'results found',
        },
        buttons: {
            print: 'Export to PDF',
            toggleTheme: 'Toggle theme',
        },
    },
};

/**
 * Helper function to get the full site title
 */
export const getPageTitle = (pageTitle?: string): string => {
    if (pageTitle) {
        return `${pageTitle} | ${siteConfig.branding.name}`;
    }
    return siteConfig.branding.name;
};

/**
 * Helper function to get footer text
 */
export const getFooterText = (path?: string): string => {
    const baseText = `© ${siteConfig.content.footer.year} ${siteConfig.content.footer.text}`;

    if (!siteConfig.content.footer.showPath) {
        return baseText;
    }

    const finalPath = path ?? siteConfig.content.footer.rootPath;

    return `${baseText} - ${finalPath}`;
};