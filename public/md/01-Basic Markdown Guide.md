---
author: System
date: 2026-02-17
description: Learn how to write in Markdown with simple and practical
  examples.
tags:
- markdown
- basic
- tutorial
title: Basic Markdown Guide
---

## Table of Contents

# Basic Markdown Guide

Markdown is a lightweight markup language that allows you to format text
easily. Here are the most common elements you will use on a daily basis.

## 1. Headings

Use hash symbols (`#`) to create titles. The more hashes you use, the
smaller the heading.

``` markdown
# Main Title (H1)
## Subtitle (H2)
### Section (H3)
```

## 2. Emphasis

You can make text **bold** or *italic*.

``` markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough text~~
```

**Result:** - **Bold text** - *Italic text* - ***Bold and italic*** -
~~Strikethrough text~~

## 3. Lists

### Unordered Lists

Use hyphens (`-`), asterisks (`*`), or plus signs (`+`).

``` markdown
- Item 1
- Item 2
  - Sub-item A
  - Sub-item B
```

### Ordered Lists

Simply use numbers followed by a period.

``` markdown
1. First step
2. Second step
3. Third step
```

## 4. Links and Images

### Links

``` markdown
[Link text](https://www.google.com)
```

[Go to Google](https://www.google.com)

### Images

It works the same as a link, but with an exclamation mark `!` at the
beginning.

``` markdown
![Alt text](/logo.png)
```

## 5. Blockquotes

Perfect for highlighting quotes or notes.

``` markdown
> Knowledge is power.
```

> Knowledge is power.

## 6. Code

### Inline Code

Use backticks `` ` `` to highlight commands or variables.

``` markdown
Use the function `console.log()` to debug.
```

Use the function `console.log()` to debug.

### Code Blocks

Use three backticks and specify the language for syntax highlighting.

``` markdown
\`\`\`javascript
function greet() {
  console.log("Hello World!");
}
\`\`\`
```

*(Note: Remove the backslashes `\` when writing it)*

``` javascript
function greet() {
  console.log("Hello World!");
}
```

## 7. Tables

Tables are created with vertical bars `|` and hyphens `-`.

``` markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

  Header 1   Header 2
  ---------- ----------
  Cell 1     Cell 2
  Cell 3     Cell 4

## 8. Horizontal Rules

Use three hyphens or asterisks to separate sections.

``` markdown
---
```

------------------------------------------------------------------------

And that's it! With these basic elements, you can already create
professionally formatted documents.
