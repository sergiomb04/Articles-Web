# Optimización de Imágenes y Lazy Loading

Hemos integrado `next/image` para asegurar que el sitio vuele, incluso con artículos llenos de imágenes pesadas.

## ¿Qué ha cambiado?

1. **Carga Diferida (Lazy Loading)**: Las imágenes no se descargan hasta que están a punto de entrar en el viewport. Esto ahorra datos y mejora el tiempo de carga inicial.
2. **Formatos Modernos**: Next.js sirve automáticamente versiones WebP o AVIF de las imágenes si el navegador las soporta.
3. **Resizing Inteligente**: Las imágenes se redimensionan en el servidor según el tamaño de pantalla del usuario.
4. **Layout Estable**: Se reservan espacios para las imágenes, evitando el molesto "Layout Shift" (CLS) mientras se cargan.

## Prueba el rendimiento

Aquí tienes varias imágenes de alta resolución. Observa cómo aparecen suavemente a medida que haces scroll:

![Nebulosa en el espacio profundo](https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000)

![Bosque tropical con niebla](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000)

![Ciudad costera al atardecer](https://images.unsplash.com/photo-1506929113679-b6a013b0c2a2?auto=format&fit=crop&q=80&w=2000)

### Configuración
Hemos configurado `next.config.mjs` para permitir imágenes de cualquier dominio seguro (`https`), garantizando que tus artículos externos siempre se vean optimizados.
