# Tiempo de Lectura Estimado

Esta nueva característica calcula automáticamente cuánto tiempo le tomará a un usuario medio leer el artículo. Se basa en una velocidad promedio de 200 palabras por minuto.

## ¿Cómo funciona?

El sistema analiza el contenido Markdown, elimina la sintaxis de imágenes para no desvirtuar el conteo de palabras, y realiza el cálculo matemático.

### Beneficios:
- **Mejor UX**: El usuario sabe de antemano el compromiso de tiempo requerido.
- **Automatización**: No requiere que el autor especifique el tiempo manualmente en el frontmatter.
- **Visualización**: Se muestra de forma elegante al inicio del artículo con un icono de reloj.

## Ejemplo de contenido largo

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

*Nota: Este artículo es corto, por lo que debería marcar "1 minuto de lectura".*
