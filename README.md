[🇪🇸 Español](README.es.md)

# BEMify - VSCode Extension

BEMify is a Visual Studio Code extension that automatically applies CSS classes using the **BEM (Block Element Modifier)** methodology to selected HTML fragments, and generates the corresponding CSS rules in your project.

## 📦 Features

- Prompts the user for a base class name.
- Parses the selected HTML and adds BEM classes following the hierarchical structure.
- Generates CSS rules for each created class.
- Automatically searches for a common CSS file (`styles.css`, `main.css`, `app.css`, `index.css`, `style.css`, `estilos.css`, `estilo.css`) in your project:
  - If it exists, appends the new classes to the end.
  - If it doesn’t exist, creates a `styles.css` file with the generated classes.
- Preserves original attributes of HTML elements.
- Compatible with projects that already have existing classes.

## 🚀 Usage

1. Select an HTML fragment in your editor.
2. Run the command:
   - **From the Command Palette**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS), then type **"bemify"**.
   - Or use the registered command: `extension.applyBEM`.
3. Enter the base class name (e.g., `header`).
4. The extension will:
   - Modify the selected HTML by adding BEM classes.
   - Create or update the corresponding CSS file.

## 📂 Example

Original HTML:

```html
<div>
  <nav>
    <ul class="flex">
      <li><a href="http://" target="_blank">Link</a></li>
      <li>Item</li>
      <li><img src="" alt="img" /></li>
    </ul>
  </nav>
</div>
```

Modified HTML:

```html
<div class="header">
  <nav class="header__nav">
    <ul class="flex header__nav__ul">
      <li class="header__nav__ul__li">
        <a href="http://" target="_blank" class="header__nav__ul__li__a"
          >Link</a
        >
      </li>
      <li class="header__nav__ul__li">Item</li>
      <li class="header__nav__ul__li">
        <img src=" " alt="img" class="header__nav__ul__li__img" />
      </li>
    </ul>
  </nav>
</div>
```

Generated CSS:

```css
.header {
  /* styles */
}

.header__nav {
  /* styles */
}

.header__nav__ul {
  /* styles */
}

.header__nav__ul__li {
  /* styles */
}

.header__nav__ul__li__a {
  /* styles */
}

.header__nav__ul__li__img {
  /* styles */
}
```

## 📥 Installation (development mode

Clone this repository.

Install dependencies:

- bash
- npm install
- Open the project in VSCode and press F5 to run the extension in a test environment.

## 🛠 Dependencies

node-html-parser - MIT License.
