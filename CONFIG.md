# Guía de Configuración - Articles-Web

Esta guía explica cómo personalizar tu instalación de Articles-Web mediante el sistema de configuración centralizado.

## 📍 Ubicación del Archivo de Configuración

El archivo de configuración se encuentra en:
```
src/config/site.config.ts
```

## 🎨 Opciones de Configuración

### 1. Branding (Marca)

Personaliza el nombre y descripción de tu sitio:

```typescript
branding: {
  name: 'ArticleReader',              // Nombre del sitio (aparece en header y títulos)
  tagline: 'Tu biblioteca de conocimiento',  // Eslogan
  description: 'Sistema dinámico de artículos...',  // Descripción general
}
```

**Dónde aparece:**
- `name`: Header, títulos de página, meta tags
- `tagline`: Puede usarse en páginas personalizadas
- `description`: Meta tags y SEO

---

### 2. Tema (Theme)

Configura el tema predeterminado y colores:

```typescript
theme: {
  defaultMode: 'light',  // Opciones: 'light', 'dark', 'system'
  colors: {
    primary: {
      light: 'blue-600',   // Color primario en modo claro
      dark: 'blue-400',    // Color primario en modo oscuro
    },
    // ... más colores
  }
}
```

**Opciones de `defaultMode`:**
- `'light'`: Siempre inicia en modo claro
- `'dark'`: Siempre inicia en modo oscuro
- `'system'`: Usa la preferencia del sistema operativo

**Nota sobre colores:** Actualmente los colores están documentados pero requieren modificaciones adicionales en las clases de Tailwind CSS para aplicarse completamente. Los valores de texto y UI sí se aplican automáticamente.

---

### 3. Contenido (Content)

Personaliza todos los textos de la interfaz:

#### Página de Inicio
```typescript
content: {
  home: {
    title: 'Biblioteca de Artículos',
    subtitle: 'Explora y lee artículos dinámicos...',
    itemLabels: {
      folder: '📂 Categoría • Ver carpeta',
      article: '📄 Artículo • Leer ahora',
    },
  },
  // ...
}
```

#### Páginas de Artículos
```typescript
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
}
```

#### Footer
```typescript
footer: {
  text: 'Article Reader',
  year: 2026,
  showPath: true,  // Mostrar la ruta actual en el footer
}
```

**Resultado del footer:**
- Con `showPath: true`: `© 2026 Article Reader - ruta/del/articulo`
- Con `showPath: false`: `© 2026 Article Reader`

---

### 4. UI (Interfaz de Usuario)

Personaliza textos de búsqueda y botones:

```typescript
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
}
```

---

## 🚀 Ejemplos de Personalización

### Ejemplo 1: Cambiar a Tema Oscuro por Defecto

```typescript
theme: {
  defaultMode: 'dark',  // Cambia de 'light' a 'dark'
  // ... resto de la configuración
}
```

### Ejemplo 2: Personalizar para un Blog Personal

```typescript
branding: {
  name: 'Mi Blog Tech',
  tagline: 'Aprendiendo y compartiendo conocimiento',
  description: 'Blog personal sobre desarrollo web y tecnología',
}

content: {
  home: {
    title: 'Últimas Publicaciones',
    subtitle: 'Artículos sobre desarrollo, diseño y tecnología',
    itemLabels: {
      folder: '📚 Serie • Ver todos',
      article: '📝 Post • Leer más',
    },
  },
  footer: {
    text: 'Mi Blog Tech',
    year: 2026,
    showPath: false,  // No mostrar ruta en el footer
  },
}
```

### Ejemplo 3: Sitio en Inglés

```typescript
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

---

## 🔧 Funciones Helper

El archivo de configuración incluye funciones helper para facilitar el uso:

### `getPageTitle(pageTitle?: string)`
Genera títulos de página consistentes:
```typescript
// Sin argumento: "ArticleReader"
// Con argumento: "Mi Artículo | ArticleReader"
getPageTitle('Mi Artículo')
```

### `getFooterText(path?: string)`
Genera el texto del footer:
```typescript
// Sin path: "© 2026 Article Reader"
// Con path: "© 2026 Article Reader - mi/ruta"
getFooterText('mi/ruta')
```

---

## 💡 Consejos

1. **Haz cambios incrementales**: Modifica una sección a la vez y verifica los resultados
2. **Mantén la consistencia**: Usa el mismo tono y estilo en todos los textos
3. **Prueba en ambos temas**: Verifica que tus cambios se vean bien en modo claro y oscuro
4. **Guarda copias**: Antes de hacer cambios grandes, guarda una copia del archivo original

---

## 🔄 Aplicar Cambios

Después de modificar `site.config.ts`:

1. Guarda el archivo
2. El servidor de desarrollo (`npm run dev`) recargará automáticamente
3. Refresca tu navegador para ver los cambios

**Nota:** Los cambios en el tema predeterminado solo afectan a nuevos visitantes o después de limpiar localStorage.

---

## 🎯 Próximos Pasos

- Personaliza los colores según tu marca
- Ajusta los textos a tu audiencia
- Configura el tema predeterminado según tus preferencias
- Considera traducir todo el contenido si tu audiencia habla otro idioma

¡Disfruta personalizando tu Articles-Web! 🚀
