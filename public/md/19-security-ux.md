# Seguridad y Navegación Fluida

Hemos reforzado la seguridad del sitio y mejorado la experiencia de navegación interna.

## Navegación Fluida (Smooth Scroll)

Ahora, al hacer clic en cualquier enlace de la "Tabla de Contenidos" o en anclas internas:
1. El desplazamiento es suave y elegante.
2. Hemos añadido una compensación (`scroll-padding-top`) para que el título del ancla no quede oculto detrás de la barra de navegación fija.

## Sanitización de HTML

Para prevenir ataques de inyección de scripts (XSS), todo el contenido HTML procesado pasa por un filtro de seguridad:
- Se eliminan etiquetas peligrosas como `<script>`.
- Se permite un conjunto seguro de etiquetas necesarias para nuestra interactividad (como `iframe` para vídeos o `div` para componentes complejos).
- Se limpian atributos potencialmente maliciosos.

### Ejemplo de seguridad
Incluso si alguien intentara poner esto en un artículo:
```html
<script>alert('hackeado')</script>
```
El sistema lo eliminará automáticamente antes de mostrarlo al usuario.
