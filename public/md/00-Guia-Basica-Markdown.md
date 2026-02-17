---
title: Guía Básica de Markdown
description: Aprende a escribir en Markdown con ejemplos prácticos y sencillos.
author: Sistema
date: 2026-02-17
tags:
  - markdown
  - basico
  - tutorial
---
## Tabla de Contenidos

# Guía Básica de Markdown

Markdown es un lenguaje ligero de marcado que te permite dar formato al texto de manera sencilla. Aquí tienes los elementos más comunes que usarás día a día.

## 1. Encabezados
Usa almohadillas (`#`) para crear títulos. Cuantas más almohadillas, más pequeño será el título.

```markdown
# Título Principal (H1)
## Subtítulo (H2)
### Sección (H3)
```

## 2. Énfasis
Puedes poner texto en **negrita** o *cursiva*.

```markdown
**Texto en negrita**
*Texto en cursiva*
***Negrita y cursiva***
~~Texto tachado~~
```
**Resultado:**
- **Texto en negrita**
- *Texto en cursiva*
- ***Negrita y cursiva***
- ~~Texto tachado~~

## 3. Listas

### Listas Desordenadas
Usa guiones (`-`), asteriscos (`*`) o signos más (`+`).

```markdown
- Elemento 1
- Elemento 2
  - Sub-elemento A
  - Sub-elemento B
```

### Listas Ordenadas
Simplemente usa números seguidos de un punto.

```markdown
1. Primer paso
2. Segundo paso
3. Tercer paso
```

## 4. Enlaces e Imágenes

### Enlaces
```markdown
[Texto del enlace](https://www.google.com)
```
[Ir a Google](https://www.google.com)

### Imágenes
Es igual que un enlace, pero con un signo de exclamación `!` delante.

```markdown
![Texto alternativo](/logo.png)
```

## 5. Citas (Blockquotes)
Perfecto para resaltar frases o notas.

```markdown
> El conocimiento es poder.
```
> El conocimiento es poder.

## 6. Código

### Código en línea
Usa comillas invertidas (backticks) `` ` `` para resaltar comandos o variables.

```markdown
Usa la función `console.log()` para depurar.
```
Usa la función `console.log()` para depurar.

### Bloques de código
Usa tres comillas invertidas y especifica el lenguaje para el resaltado de sintaxis.

```markdown
\`\`\`javascript
function saludar() {
  console.log("¡Hola Mundo!");
}
\`\`\`
```
*(Nota: Quita las barras invertidas `\` al escribirlo)*

```javascript
function saludar() {
  console.log("¡Hola Mundo!");
}
```

## 7. Tablas
Las tablas se crean con barras verticales `|` y guiones `-`.

```markdown
| Encabezado 1 | Encabezado 2 |
|--------------|--------------|
| Celda 1      | Celda 2      |
| Celda 3      | Celda 4      |
```

| Encabezado 1 | Encabezado 2 |
|--------------|--------------|
| Celda 1      | Celda 2      |
| Celda 3      | Celda 4      |

## 8. Líneas Divisorias
Usa tres guiones o asteriscos para separar secciones.

```markdown
---
```

---

¡Y eso es todo! Con estos elementos básicos ya puedes crear documentos con formato profesional.
