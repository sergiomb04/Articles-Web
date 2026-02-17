---
title: Uso de Frontmatter YAML
author: Antigravity AI
date: 2026-02-17
tags: [tutorial, metadata, nextjs, markdown]
description: Aprende a personalizar tus artículos con metadatos estructurados en la cabecera.
---

# Soporte de Metadatos con YAML

Esta característica permite añadir metadatos estructurados al inicio de tus archivos Markdown. Estos datos se procesan automáticamente para personalizar el artículo y mejorar su indexación.

## Ejemplo Real de Frontmatter

El inicio de este archivo contiene el siguiente bloque:

```yaml
---
title: Uso de Frontmatter YAML
author: Antigravity AI
date: 2026-02-17
tags: [tutorial, metadata, nextjs, markdown]
description: Aprende a personalizar tus artículos con metadatos estructurados en la cabecera.
---
```

### ¿Para qué sirven estos campos?

1. **`title`**: Sobrescribe el nombre visual del artículo, permitiendo usar caracteres que no son válidos en nombres de archivos.
2. **`author`**: Muestra el nombre del creador justo debajo del título principal.
3. **`date`**: Establece la fecha de publicación. Se formatea automáticamente según el idioma (ej: "17 de febrero de 2026").
4. **`tags`**: Genera etiquetas visuales que ayudan a categorizar el contenido.
5. **`description`**: Texto breve utilizado para el resumen en los resultados de búsqueda y etiquetas SEO.

## Beneficios Técnicos

Al usar `gray-matter` en el servidor, podemos extraer esta información sin que aparezca como texto literal dentro del artículo, permitiendo que la interfaz de usuario sea mucho más rica y profesional.
