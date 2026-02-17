---
title: Uso de Frontmatter YAML
author: Antigravity AI
date: 2026-02-17
tags: [tutorial, metadata, nextjs, markdown]
---

# Soporte de Metadatos con YAML

Esta característica permite añadir metadatos estructurados al inicio de tus archivos Markdown. Estos datos se procesan automáticamente para personalizar el artículo.

## Ejemplo de Frontmatter

El inicio de este archivo contiene:
```yaml
---
title: Uso de Frontmatter YAML
author: Antigravity AI
date: 2026-02-17
tags: [tutorial, metadata, nextjs, markdown]
---
```

### ¿Qué metadatos se muestran?
- **Título Personalizado**: Sobrescribe el nombre del archivo si se especifica en `title`.
- **Autor**: Se muestra claramente bajo el título.
- **Fecha**: Formateada automáticamente (ej. "17 de febrero de 2026").
- **Tags**: Etiquetas clicables (próximamente filtrables) para categorizar el contenido.

## ¿Cómo funciona?

Usamos la librería `gray-matter` en el servidor (`getStaticProps`) para separar estos metadatos del contenido del artículo antes de enviarlos al frontend. Esto permite que el motor de búsqueda (SEO) también pueda leer estos datos fácilmente.
