# Configuration Guide -- Articles-Web

This guide explains how to customize your Articles-Web installation
using the centralized configuration system.

## 📍 Configuration File Location

The configuration file is located at:

    src/config/site.config.ts

## 🎨 Configuration Options

### 1. Branding

Customize your site's name and description:

``` typescript
branding: {
  name: 'ArticleReader',              // Site name (appears in header and titles)
  tagline: 'Your knowledge library',  // Tagline
  description: 'Dynamic article system...',  // General description
}
```

**Where it appears:** - `name`: Header, page titles, meta tags -
`tagline`: Can be used on custom pages - `description`: Meta tags and
SEO

------------------------------------------------------------------------

### 2. Theme

Configure the default theme and colors:

``` typescript
theme: {
  defaultMode: 'light',  // Options: 'light', 'dark', 'system'
  colors: {
    primary: {
      light: 'blue-600',   // Primary color in light mode
      dark: 'blue-400',    // Primary color in dark mode
    },
    // ... more colors
  }
}
```

**`defaultMode` options:** - `'light'`: Always start in light mode -
`'dark'`: Always start in dark mode - `'system'`: Use the operating
system preference

**Note on colors:** Colors are currently documented but require
additional Tailwind CSS class modifications to be fully applied. Text
and UI values are applied automatically.

------------------------------------------------------------------------

### 3. Content

Customize all interface texts:

#### Home Page

``` typescript
content: {
  home: {
    title: 'Article Library',
    subtitle: 'Explore and read dynamic articles rendered directly from Markdown.',
    itemLabels: {
      folder: '📂 Category • View folder',
      article: '📄 Article • Read now',
    },
  },
  // ...
}
```

#### Article Pages

``` typescript
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
}
```

#### Footer

``` typescript
footer: {
  text: 'Article Reader',
  year: 2026,
  showPath: true,  // Show the current path in the footer
}
```

**Footer result:** - With `showPath: true`:
`© 2026 Article Reader - path/to/article` - With `showPath: false`:
`© 2026 Article Reader`

------------------------------------------------------------------------

### 4. UI (User Interface)

Customize search texts and buttons:

``` typescript
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
}
```

------------------------------------------------------------------------

## 🚀 Customization Examples

### Example 1: Switch to Dark Mode by Default

``` typescript
theme: {
  defaultMode: 'dark',  // Change from 'light' to 'dark'
  // ... rest of the configuration
}
```

### Example 2: Customize for a Personal Blog

``` typescript
branding: {
  name: 'My Tech Blog',
  tagline: 'Learning and sharing knowledge',
  description: 'Personal blog about web development and technology',
}

content: {
  home: {
    title: 'Latest Posts',
    subtitle: 'Articles about development, design, and technology',
    itemLabels: {
      folder: '📚 Series • View all',
      article: '📝 Post • Read more',
    },
  },
  footer: {
    text: 'My Tech Blog',
    year: 2026,
    showPath: false,
  },
}
```

### Example 3: English Website

``` typescript
content: {
  home: {
    title: 'Article Library',
    subtitle: 'Explore and read dynamic articles rendered from Markdown.',
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
    text: 'Article Reader',
    year: 2026,
    showPath: true,
  },
}

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
}
```

------------------------------------------------------------------------

## 🔧 Helper Functions

The configuration file includes helper functions to simplify usage:

### `getPageTitle(pageTitle?: string)`

Generates consistent page titles:

``` typescript
// Without argument: "ArticleReader"
// With argument: "My Article | ArticleReader"
getPageTitle('My Article')
```

### `getFooterText(path?: string)`

Generates the footer text:

``` typescript
// Without path: "© 2026 Article Reader"
// With path: "© 2026 Article Reader - my/path"
getFooterText('my/path')
```

------------------------------------------------------------------------

## 💡 Tips

1.  **Make incremental changes**: Modify one section at a time and
    verify results
2.  **Keep consistency**: Use the same tone and style across all texts
3.  **Test both themes**: Ensure your changes look good in light and
    dark mode
4.  **Keep backups**: Before making major changes, save a copy of the
    original file

------------------------------------------------------------------------

## 🔄 Applying Changes

After modifying `site.config.ts`:

1.  Save the file
2.  The development server (`npm run dev`) will reload automatically
3.  Refresh your browser to see the changes

**Note:** Changes to the default theme only affect new visitors or after
clearing localStorage.

------------------------------------------------------------------------

## 🎯 Next Steps

-   Customize colors to match your brand
-   Adjust texts for your audience
-   Configure the default theme based on your preference
-   Consider translating all content if your audience speaks another
    language

Enjoy customizing your Articles-Web! 🚀