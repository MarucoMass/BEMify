

/////////////////  FUNCA   //////////////////////
// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//     console.log("hola dame bola");
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//             // Solicitar al usuario que ingrese la clase
//             const className = await vscode.window.showInputBox({
//                 prompt: 'Ingrese el nombre de la clase',
//                 placeHolder: 'Ejemplo: header',
//             });

//             if (!className) {
//                 // El usuario canceló la entrada o no proporcionó una clase
//                 return;
//             }

//             const selection = editor.selection;
//             const selectedText = editor.document.getText(selection);

//             // Utilizar una expresión regular para encontrar los nombres de las etiquetas
//             const tagMatches = selectedText.match(/<\s*(\w+)/g);

//             if (tagMatches) {
//                 let isFirstTag = true;
//                 let depth = 0;

//                 const modifiedText = selectedText.replace(/<\s*(\w+)/g, (match, tagName) => {
//                     // Construir la clase deseada para cada etiqueta
//                     let modifiedTag = `<${tagName} class="${className}"`;
                    
//                     // Agregar "__" y "--" para hijos y nietos respectivamente
//                     if (!isFirstTag) {
//                         modifiedTag = `<${tagName} class="${className}__${tagName.toLowerCase()}"`;

//                         if (depth > 1) {
//                             modifiedTag = `<${tagName} class="${className}__${tagName.toLowerCase()}--${tagName.toLowerCase()}"`;
//                         }
//                     }

//                     isFirstTag = false;
//                     depth++;
//                     return modifiedTag;
//                 });

//                 // Actualizar el contenido del editor con las etiquetas modificadas
//                 editor.edit(editBuilder => {
//                     editBuilder.replace(selection, modifiedText);
//                 });
//             }
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function desactivate() {}

// console.log('¡Hola desde mi extensión!');


////////////////////////////////////////////

// import * as vscode from 'vscode';
// import { HTMLElement, parse } from 'node-html-parser';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//           const className = await vscode.window.showInputBox({
//             prompt: "Ingrese el nombre de la clase",
//             placeHolder: "Ejemplo: header",
//           });

//           if (!className) {
//             // El usuario canceló la entrada o no proporcionó una clase
//             return;
//           }

//           const classes: { [key: string]: string[] } = {};

//           const selection = editor.selection;
//           const selectedText = editor.document.getText(selection);
          
//           // Parsear el HTML con node-html-parser
//           const root = parse(selectedText);
          
//           let isFirstTag = true;

//           function agregarClasesBEM(elemento: HTMLElement, prefijoClase: string) {

//             if (!classes[prefijoClase]) {
//                 classes[prefijoClase] = [];
//             }
//             // Asignar la clase al elemento actual
//             if (elemento.tagName) {
//                 const clasesExistentes = elemento.getAttribute('class') || '';
//                 const nuevasClases = `${clasesExistentes} ${prefijoClase}`.trim();
//                 if (!classes[prefijoClase].includes(nuevasClases)) {
//                     classes[prefijoClase].push(nuevasClases);
//                 }
//                 elemento.setAttribute('class', nuevasClases); 
//             }
        
//             // Iterar sobre los hijos que son nodos de tipo elemento
//             const hijos = elemento.childNodes.filter((nodo) => nodo.nodeType === 1); 
   
//             hijos.forEach((hijo: any) => {
//               if (hijo.tagName) {
//                     // Crear la nueva clase hija basada en la jerarquía actual
//                     const nuevaClaseHija = `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
//                     agregarClasesBEM(hijo, nuevaClaseHija); 
//                 }
//             });

//         }
        
//           agregarClasesBEM(root, className);

//           // Convertir el árbol de vuelta a HTML
//           const modifiedText = root.toString();

//           // Reemplazar el texto seleccionado con el HTML modificado
//           editor.edit((editBuilder) => {
//             editBuilder.replace(selection, modifiedText);
//           });

//           const cssOutput = Object.values(classes)
//           .flatMap((set) => Array.from(set)) // Convertir Sets a arrays y combinarlos
//           .map((className) => `.${className} {\n  /* estilos */\n}`)
//           .join("\n\n");

//             // Mostrar al usuario las clases generadas
//             const doc = await vscode.workspace.openTextDocument({
//                 content: cssOutput,
//                 language: "css",
//             });

//             vscode.window.showTextDocument(doc);
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}


///////////////////////////////////////////////



import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { HTMLElement, parse } from 'node-html-parser';

// Función para encontrar archivos .css en el directorio (y subdirectorios)
function findCssFileInDirectory(directory: string, fileNames: string[]): string | null {
    try {
        const files = fs.readdirSync(directory);
        for (let file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                const result = findCssFileInDirectory(fullPath, fileNames);
                if (result) return result;
            } else if (fileNames.some(name => file.toLowerCase() === name)) {
                if (file.endsWith('.css')) {
                    return fullPath;
                }
            }
        }
    } catch (err) {
        console.error('Error al buscar archivos:', err);
    }
    return null;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const className = await vscode.window.showInputBox({
                prompt: "Ingrese el nombre de la clase",
                placeHolder: "Ejemplo: header",
            });

            if (!className) {
                return;
            }

            const classes: { [key: string]: string[] } = {};
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            const root = parse(selectedText);

          function agregarClasesBEM(elemento: HTMLElement, prefijoClase: string) {
            if (!classes[prefijoClase]) {
              classes[prefijoClase] = [];
            }
            // Asignar la clase al elemento actual
            if (elemento.tagName) {

               const atributosOriginales: { [key: string]: string } = {};
                for (const [name, value] of Object.entries(
                  elemento.attributes
                )) {
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
                const nuevaClaseHija = `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
                agregarClasesBEM(hijo, nuevaClaseHija);
              }
            });
          }
            agregarClasesBEM(root, className);

            const modifiedText = root.toString();

            editor.edit((editBuilder) => {
                editBuilder.replace(selection, modifiedText);
            });

            const cssOutput = Object.values(classes)
                .flatMap((set) => Array.from(set))
                .map((className) => `.${className} {\n  /* estilos */\n}`)
                .join("\n\n");

            const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
            const commonCssNames = ['styles.css', 'main.css', 'app.css', 'index.css', 'style.css'];

            let cssFilePath = findCssFileInDirectory(workspaceFolder, commonCssNames);

            if (cssFilePath) {
                const currentContent = fs.readFileSync(cssFilePath, 'utf8');
                const updatedContent = `${currentContent}\n\n${cssOutput}`;
                fs.writeFileSync(cssFilePath, updatedContent, 'utf8');
                vscode.window.showInformationMessage(`Clases agregadas al archivo CSS existente: ${cssFilePath}`);
            } else {
                const newCssFilePath = path.join(workspaceFolder, 'styles.css');
                fs.writeFileSync(newCssFilePath, cssOutput, 'utf8');
                vscode.window.showInformationMessage(`Archivo CSS creado en: ${newCssFilePath}`);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
