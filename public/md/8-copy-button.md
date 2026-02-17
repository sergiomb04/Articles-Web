# Botón "Copiar Código"

Esta característica añade un botón de copia a todos los bloques de código en los artículos. El botón aparece en la esquina superior derecha y proporciona feedback visual al usuario.

## Ejemplo de uso

A continuación se muestra un bloque de código donde puedes probar la funcionalidad:

```javascript
function saludar(nombre) {
  console.log(`Hola, ${nombre}!`);
  return true;
}

saludar("Mundo");
```

### Características técnicas:
- **Interactividad**: Usa el API `navigator.clipboard` para una copia segura.
- **Feedback Visual**: Cambia el icono a un check verde y muestra un tooltip temporal.
- **Estilo**: Completamente integrado con el tema oscuro y el diseño premium del sitio.
- **Accesibilidad**: Incluye etiquetas `aria-label` y títulos descriptivos.

## Implementación

El componente `CopyButton` se inyecta automáticamente en cada elemento `<pre>` procesado por el `MarkdownRenderer`.

```tsx
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    // ... lógica de copia
    return (
        <button onClick={handleCopy} className="absolute ...">
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
};
```
