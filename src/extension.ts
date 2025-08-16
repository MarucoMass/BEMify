import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { HTMLElement, parse } from "node-html-parser";
import { registerChangeModeCommand } from "./changeMode";

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

        function addBEMClasses(
          element: HTMLElement,
          classPrefix: string,
          isFirst: boolean = false
        ) {
          if (!classes[classPrefix]) {
            classes[classPrefix] = [];
          }

          // Leer configuración del usuario
          const config = vscode.workspace.getConfiguration("bemify");
          const mode = config.get<string>("mode", "modern");

          // Asignar la clase al elemento actual
          if (element.tagName) {
            const originalAttributes: { [key: string]: string } = {};
            for (const [name, value] of Object.entries(element.attributes)) {
              if (value === "") {
                // Si el atributo tiene un valor vacío, mantenerlo como atributo vacío
                originalAttributes[name] = " ";
              } else {
                // Si el atributo tiene un valor, mantener el valor original
                originalAttributes[name] = value;
              }
            }

            const existingClasses = element.getAttribute("class") || "";
            const newClasses = `${existingClasses} ${classPrefix}`.trim();

            if (!classes[classPrefix].includes(classPrefix)) {
              classes[classPrefix].push(classPrefix);
            }

            element.setAttribute("class", newClasses);

            for (const nombreAtributo in originalAttributes) {
              if (nombreAtributo !== "class") {
                // Restaurar los atributos sin añadir comillas adicionales
                const value = originalAttributes[nombreAtributo];
                if (value === "") {
                  // Si el atributo es vacío, establecerlo sin valor
                  element.setAttribute(nombreAtributo, " ");
                } else {
                  // De lo contrario, restaurar con su valor original
                  element.setAttribute(nombreAtributo, value);
                }
              }
            }
          }

          // Iterar sobre los hijos que son nodos de tipo elemento
          const children = element.childNodes.filter(
            (nodo) => nodo.nodeType === 1
          );

          children.forEach((child: any) => {
            if (child.tagName) {
              // Crear la nueva clase hija basada en el modo elegido
              
              // let newChildClass: string = isFirst
              //   ? `${classPrefix}`
              //   : `${classPrefix}__${child.tagName.toLowerCase()}`;

              let newChildClass: string;
              if (isFirst) {
                newChildClass = `${classPrefix}`;
              } else {
                if (mode === "modern") {
                  // todo el prefijo acumulado
                  newChildClass = `${classPrefix}__${child.tagName.toLowerCase()}`;
                } else {
                  // solo bloque base + nivel actual
                  const baseBlock = classPrefix.split(/__|_/)[0]; // extraer solo el bloque base
                  newChildClass = `${baseBlock}_${child.tagName.toLowerCase()}`;
                }
              }

              addBEMClasses(child, newChildClass, false);
            }
          });
        }
        addBEMClasses(root, className, true);

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
          const existingCssName = path
            .relative(workspaceFolder, cssFilePath)
            .replace(/\\/g, "/");
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

  // funcion para cambiar el modo
  registerChangeModeCommand(context);
}

export function deactivate() {}
