# Funcionalidad y Guía de Artículos

Este documento es la referencia definitiva sobre cómo funciona este proyecto y todas las capacidades de renderizado que hemos construido. Aquí encontrarás desde la arquitectura técnica hasta los formatos avanzados de Markdown soportados.

## Tabla de Contenidos

---

## 1. Características de Markdown Avanzado

Nuestro sistema utiliza un motor de renderizado basado en **React Markdown** con soporte para múltiples extensiones profesionales.

### Callouts (Admonitions)
Los callouts son bloques resaltados que ayudan a organizar la información por importancia. Se crean usando citas (`>`) seguidas de un marcador especial.

> [!NOTE]
> Bloque de nota estándar para información general y contexto.

> [!TIP]
> **Consejo**: Usa el modo oscuro para reducir la fatiga visual durante sesiones largas de lectura.

> [!IMPORTANT]
> **Importante**: El orden de los artículos se determina por el prefijo numérico en el nombre del archivo (ej: `#1-`).

> [!WARNING]
> **Aviso**: Evita borrar la carpeta `public/md` ya que contiene la fuente de datos del sitio.

> [!CAUTION]
> **Cuidado**: Cambios estructurales mal realizados pueden causar errores de renderizado (SSR).

### Tabla de Contenidos Automática
Si incluyes un heading llamado `## Tabla de Contenidos`, el sistema generará automáticamente un índice interactivo con desplazamiento suave (`smooth scroll`).

### Formato GFM y Tablas
Soportamos **GitHub Flavored Markdown**, lo que incluye tablas elegantes y listas de tareas.

| Característica | Estado | Detalle |
| :--- | :---: | :--- |
| Callouts | ✅ Activo | 5 estilos disponibles |
| TOC | ✅ Activo | Navegación interna suave |
| Código | ✅ Activo | Resaltado profesional |
| Imágenes | ✅ Activo | Sombras y centrado automático |

---

## 2. Arquitectura del Proyecto

El proyecto está construido con **Next.js**, **TypeScript** y **Tailwind CSS v4**, optimizado para velocidad y estética premium.

### Generación Estática (SSG)
Utilizamos `getStaticPaths` y `getStaticProps` para detectar automáticamente cualquier archivo `.md` en la carpeta `/public/md/`. Esto significa que el sitio es extremadamente rápido y amigable para el SEO.

### Estructura de Archivos
- `src/pages/index.tsx`: La galería principal de artículos.
- `src/pages/[...slug].tsx`: El sistema de rutas dinámicas que soporta carpetas y categorías.
- `src/components/MarkdownRenderer.tsx`: El corazón del proyecto, donde se procesa el Markdown.
- `public/md/`: El lugar donde viven tus archivos de contenido.

---

## 3. Guía de Estilo y Código

El resaltado de sintaxis es automático y utiliza el tema **GitHub Dark** para una legibilidad máxima en bloques de código.

```typescript
// Ejemplo de cómo se ve el código tipificado
const saludar = (nombre: string) => {
  return `Hola, ${nombre}. Bienvenid@ al lector de artículos.`;
};
```

### Estética Premium
- **Tipografía**: Utilizamos la fuente **Inter** para un look moderno.
- **Modo Oscuro**: Implementado nativamente con un refinado color `slate-900`.
- **Efectos**: Transiciones suaves, desenfoques de fondo (`backdrop-blur`) y sombras profundas.

---

## 4. Gestión de Contenido

### Cómo añadir nuevos artículos
1. Crea un archivo `.md` en `public/md/`.
2. (Opcional) Usa un prefijo numérico como `1-titulo.md` para controlar el orden.
3. El sistema limpiará el URL automáticamente (ej: `/titulo`) manteniendo el orden visual en la galería.

### Organización por Categorías
Puedes crear carpetas dentro de `public/md/` (ej: `public/md/Ciencia/`) para organizar tus artículos. El sistema generará rutas anidadas automáticamente.

---

> [!TIP]
> ¡Este documento es un ejemplo vivo de todas estas funcionalidades funcionando juntas!
