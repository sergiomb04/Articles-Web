---
title: Seguridad y Experiencia de Usuario (UX)
author: Antigravity AI
date: 2026-02-17
tags: [seguridad, ux, rendimiento]
description: Detalles sobre la sanitización de HTML y mejoras en la navegación fluida.
---

# Seguridad y Experiencia de Usuario

Este proyecto no solo se enfoca en las características visuales, sino también en lo que ocurre "bajo el capó" para garantizar un sitio seguro y agradable.

## 1. Sanitización de HTML (Protección XSS)
Utilizamos `rehype-sanitize` para limpiar cualquier entrada maliciosa. Si intentas inyectar scripts peligrosos en el Markdown, el sistema los eliminará automáticamente antes de renderizar.

> [!IMPORTANT]
> Solo se permiten etiquetas HTML seguras y componentes específicos autorizados (como `iframe` para vídeos).

## 2. Navegación Fluida (Smooth Scrolling)
Al hacer clic en un enlace de la Tabla de Contenidos (TOC), la página se desplazará suavemente hacia la sección correspondiente en lugar de saltar bruscamente.

### Compensación de Cabecera
Hemos añadido un `scroll-padding-top` de 100px para que los títulos no queden ocultos debajo de la barra de navegación fija al navegar por el índice.

## 3. Rendimiento (Content Minification & ISR)
- **Minificación**: Eliminamos espacios y líneas en blanco innecesarias del Markdown antes de procesarlo, reduciendo el tamaño de transferencia.
- **ISR (Incremental Static Regeneration)**: Si editas un archivo en el servidor, los cambios se reflejarán automáticamente en el sitio producción cada 60 segundos sin necesidad de reconstruir todo el proyecto.

---

*Estas capas de optimización aseguran que el sitio sea rápido, seguro y profesional.*
