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
         * Default theme mode when user visits for the first time
         * - 'light': Always start in light mode
         * - 'dark': Always start in dark mode
         * - 'system': Use system preference
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
        name: 'ArticleReader',
        tagline: 'Tu biblioteca de conocimiento',
        description: 'Sistema dinámico de artículos en Markdown con soporte completo para GFM, Mermaid, KaTeX y más.',
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
            title: 'Biblioteca de Artículos',
            subtitle: 'Explora y lee artículos dinámicos renderizados directamente desde Markdown.',
            itemLabels: {
                folder: '📂 Categoría • Ver carpeta',
                article: '📄 Artículo • Leer ahora',
            },
        },
        article: {
            backButton: {
                toHome: 'Volver al inicio',
                toParent: 'Volver atrás',
            },
            navigation: {
                previous: 'Anterior',
                next: 'Siguiente',
            },
            folderSubtitle: 'Explora el contenido de esta categoría.',
        },
        footer: {
            text: 'Article Reader',
            year: 2026,
            showPath: true,
        },
    },
    ui: {
        search: {
            placeholder: 'Buscar artículos... (Esc para salir)',
            noResults: 'No se encontraron resultados para',
            minCharacters: 'Escribe al menos 2 caracteres para buscar...',
            tooltip: 'Buscar (Cmd+K)',
            resultsCount: 'resultados encontrados',
        },
        buttons: {
            print: 'Exportar a PDF',
            toggleTheme: 'Cambiar tema',
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
    if (path && siteConfig.content.footer.showPath) {
        return `${baseText} - ${path}`;
    }
    return baseText;
};
