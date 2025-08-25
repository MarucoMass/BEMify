[🇬🇧 English](README.md)

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
- 🔄 **Modos intercambiables**:  
  - **Modo Moderno** (por defecto): genera nombres de clases anidados (ej: `header__nav, header__nav__ul, header__nav__ul__li`).  
  - **Modo Clásico**: genera nombres de clases más planos (ej: `header_nav, header_ul, header_li`).  
  - Usa el comando **`bemify-mode`** para cambiar el modo — se abrirá un selector donde podés elegir entre **modern** o **classic**.

## 🚀 Uso

1. Selecciona un fragmento de HTML en tu editor.
2. Ejecuta el comando:
   - **Desde la Paleta de Comandos**: `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (macOS), luego escribe **"bemify"**.
   - O usa el comando registrado: `extension.applyBEM`.
3. Ingresa el nombre de la clase base (por ejemplo: `header`).
4. La extensión:
   - Modificará el HTML seleccionado agregando las clases BEM.
   - Creará o actualizará el archivo CSS correspondiente.
5. Podés cambiar el modo de nomenclatura en cualquier momento con el comando:
   - **`bemify-mode`** → elegí **modern** o **classic** en el selector.

## 📂 Ejemplo

HTML original:

```html
<div>
  <nav>
    <ul class="flex">
      <li>
        <a href="#" target="_blank">Link</a>
      </li>
      <li>Item</li>
      <li><img src="assets/bemify-logo.png" alt="bemify-logo" /></li>
    </ul>
  </nav>
</div>
```

### Modern mode (por defecto)

HTML modificado:

```html
<div class="header">
  <nav class="header__nav">
    <ul class="flex header__nav__ul">
      <li class="header__nav__ul__li">
        <a href="#" target="_blank" class="header__nav__ul__li__a"
          >Link</a
        >
      </li>
      <li class="header__nav__ul__li">Item</li>
      <li class="header__nav__ul__li">
        <img src="assets/bemify-logo.png" alt="bemify-logo" class="header__nav__ul__li__img" />
      </li>
    </ul>
  </nav>
</div>
```

CSS generado:

```css
.header { /* styles */ }
.header__nav { /* styles */ }
.header__nav__ul { /* styles */ }
.header__nav__ul__li { /* styles */ }
.header__nav__ul__li__a { /* styles */ }
.header__nav__ul__li__img { /* styles */ }
```

### Classic mode

HTML modificado:

```html
<div class="header">
  <nav class="header_nav">
    <ul class="flex header_ul">
      <li class="header_li">
        <a href="#" target="_blank" class="header_a">Link</a>
      </li>
      <li class="header_li">Item</li>
      <li class="header_li">
        <img src="assets/bemify-logo.png" alt="bemify-logo" class="header_img" />
      </li>
    </ul>
  </nav>
</div>
```

CSS generado:

```css
.header { /* styles */ }
.header_nav { /* styles */ }
.header_ul { /* styles */ }
.header_li { /* styles */ }
.header_a { /* styles */ }
.header_img { /* styles */ }
```

## Video tutorial 
### Modo Modern sin CSS
En este ejemplo se crea automáticamente un archivo `styles.css` al no existir previamente.
![Modern mode with no previous css file](assets/bemify-tutorial-1.gif)

### Modo Modern con CSS existente
Aquí se detecta un archivo de estilos existente y se agregan las clases al final.
![Modern mode with existing CSS file](assets/bemify-tutorial-2.gif)

### Cambiando a Modo Modern con archivo CSS existente
El usuario selecciona **Modern mode** desde el comando `bemify-mode`.
![Switching to Modern mode with existing CSS file](assets/modern.gif)

### Cambiando a Modo Classic con archivo CSS existente
El usuario selecciona **Classic mode** desde el comando `bemify-mode`.
![Switching to Classic mode with existing CSS file](assets/classic.gif)

## 🛠 Dependencias

node-html-parser - Licencia MIT.
