import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { HTMLElement, parse } from "node-html-parser";

// Función para encontrar archivos .css en el directorio (y subdirectorios)
function findCssFileInDirectory(
  directory: string,
  fileNames: string[]
): string | null {
  try {
    const files = fs.readdirSync(directory);
    for (let file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const result = findCssFileInDirectory(fullPath, fileNames);
        if (result) {
          return result;
        }
      } else if (fileNames.some((name) => file.toLowerCase() === name)) {
        if (file.endsWith(".css")) {
          return fullPath;
        }
      }
    }
  } catch (err) {
    console.error("Failed to search files:", err);
  }
  return null;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.applyBEM",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const className = await vscode.window.showInputBox({
          prompt: "Enter the base BEM block name",
          placeHolder: "Example: header",
        });

        if (!className) {
          return;
        }

        const classes: { [key: string]: string[] } = {};
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        const root = parse(selectedText);

        function agregarClasesBEM(
          elemento: HTMLElement,
          prefijoClase: string,
          esPrimero: boolean = false
        ) {
          if (!classes[prefijoClase]) {
            classes[prefijoClase] = [];
          }
          // Asignar la clase al elemento actual
          if (elemento.tagName) {
            const atributosOriginales: { [key: string]: string } = {};
            for (const [name, value] of Object.entries(elemento.attributes)) {
              if (value === "") {
                // Si el atributo tiene un valor vacío, mantenerlo como atributo vacío
                atributosOriginales[name] = " ";
              } else {
                // Si el atributo tiene un valor, mantener el valor original
                atributosOriginales[name] = value;
              }
            }

            const clasesExistentes = elemento.getAttribute("class") || "";
            const nuevasClases = `${clasesExistentes} ${prefijoClase}`.trim();

            if (!classes[prefijoClase].includes(prefijoClase)) {
              classes[prefijoClase].push(prefijoClase);
            }

            elemento.setAttribute("class", nuevasClases);

            for (const nombreAtributo in atributosOriginales) {
              if (nombreAtributo !== "class") {
                // Restaurar los atributos sin añadir comillas adicionales
                const valor = atributosOriginales[nombreAtributo];
                if (valor === "") {
                  // Si el atributo es vacío, establecerlo sin valor
                  elemento.setAttribute(nombreAtributo, " ");
                } else {
                  // De lo contrario, restaurar con su valor original
                  elemento.setAttribute(nombreAtributo, valor);
                }
              }
            }
          }

          // Iterar sobre los hijos que son nodos de tipo elemento
          const hijos = elemento.childNodes.filter(
            (nodo) => nodo.nodeType === 1
          );

          hijos.forEach((hijo: any) => {
            if (hijo.tagName) {
              // Crear la nueva clase hija basada en la jerarquía actual
              const nuevaClaseHija = esPrimero
                ? `${prefijoClase}`
                : `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
              agregarClasesBEM(hijo, nuevaClaseHija, false);
            }
          });
        }
        agregarClasesBEM(root, className, true);

        const modifiedText = root.toString();

        editor.edit((editBuilder) => {
          editBuilder.replace(selection, modifiedText);
        });

        const cssOutput = Object.values(classes)
          .flatMap((set) => Array.from(set))
          .map((className) => `.${className} {\n  /* styles */\n}`)
          .join("\n\n");

        const workspaceFolder =
          vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
        const commonCssNames = [
          "styles.css",
          "main.css",
          "app.css",
          "index.css",
          "style.css",
          "estilos.css",
          "estilo.css",
        ];

        let cssFilePath = findCssFileInDirectory(
          workspaceFolder,
          commonCssNames
        );

        if (cssFilePath) {
          const currentContent = fs.readFileSync(cssFilePath, "utf8");
          const updatedContent = `${currentContent}\n\n${cssOutput}`;
          fs.writeFileSync(cssFilePath, updatedContent, "utf8");
          const existingCssName = path.relative(workspaceFolder, cssFilePath).replace(/\\/g, '/');
          vscode.window.showInformationMessage(
            `Classes added to existing CSS file: ${existingCssName}`
          );
        } else {
          const newCssFilePath = path.join(workspaceFolder, "styles.css");
          fs.writeFileSync(newCssFilePath, cssOutput, "utf8");
          const linkTag = '<link rel="stylesheet" href="styles.css">';

          vscode.window
            .showInformationMessage(
              `CSS file created: styles.css.\nTag to add in <head>: ${linkTag}`,
              "Copy to clipboard"
            )
            .then((selection) => {
              if (selection === "Copy to clipboard") {
                vscode.env.clipboard.writeText(linkTag);
                vscode.window.showInformationMessage(
                  "<link> tag copied to clipboard"
                );
              }
            });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
