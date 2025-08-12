# BEMify - VSCode Extension

BEMify es una extensión para Visual Studio Code que te permite aplicar automáticamente clases CSS usando la metodología **BEM (Block Element Modifier)** sobre fragmentos de HTML seleccionados, y generar las reglas CSS correspondientes en tu proyecto.

## 📦 Características

- Solicita al usuario un nombre de clase base.
- Analiza el HTML seleccionado y agrega clases BEM siguiendo la estructura jerárquica.
- Genera reglas CSS para cada clase creada.
- Busca automáticamente un archivo CSS común (`styles.css`, `main.css`, `app.css`, `index.css`, `style.css`, `estilos.css`, `estilo.css`) en tu proyecto:
  - Si existe, agrega las nuevas clases al final.
  - Si no existe, crea un archivo `styles.css` con las clases generadas.
- Preserva atributos originales de los elementos HTML.
- Compatible con proyectos que ya tienen clases existentes.

## 🚀 Uso

1. Selecciona un fragmento de HTML en tu editor.
2. Ejecuta el comando:
   - **Desde la Paleta de Comandos**: `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (macOS), luego escribe **"bem"**.
   - O usa el comando registrado: `extension.applyBEM`.
3. Ingresa el nombre de la clase base (por ejemplo: `header`).
4. La extensión:
   - Modificará el HTML seleccionado agregando las clases BEM.
   - Creará o actualizará el archivo CSS correspondiente.

## 📂 Ejemplo

HTML original:
```html
<div>
  <nav>
    <ul>
      <li>Item</li>
    </ul>
  </nav>
</div>
```

HTML modificado:
```html
<div class="header">
  <nav class="header__nav">
    <ul class="header__nav__ul">
      <li class="header__nav__ul__li">Item</li>
    </ul>
  </nav>
</div>
```

CSS generado:
```css
.header {
  /* estilos */
}

.header__nav {
  /* estilos */
}

.header__nav__ul {
  /* estilos */
}

.header__nav__ul__li {
  /* estilos */
}
```


## 📥 Instalación (modo desarrollo)
Clona este repositorio.

Instala las dependencias:
- bash
- npm install
- Abre el proyecto en VSCode y presiona F5 para ejecutar la extensión en un entorno de prueba.

## 🛠 Dependencias
node-html-parser - Licencia MIT.



