

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

import * as vscode from 'vscode';
import { HTMLElement, parse } from 'node-html-parser';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const className = await vscode.window.showInputBox({
            prompt: "Ingrese el nombre de la clase",
            placeHolder: "Ejemplo: header",
          });

          if (!className) {
            // El usuario canceló la entrada o no proporcionó una clase
            return;
          }

          const classes: { [key: string]: string[] } = {};

          const selection = editor.selection;
          const selectedText = editor.document.getText(selection);
          
          // Parsear el HTML con node-html-parser
          const root = parse(selectedText);

          function agregarClasesBEM(elemento: HTMLElement, prefijoClase: string) {

            if (!classes[prefijoClase]) {
                classes[prefijoClase] = [];
            }
            // Asignar la clase al elemento actual
            if (elemento.tagName) {
                const clasesExistentes = elemento.getAttribute('class') || '';
                const nuevasClases = `${clasesExistentes} ${prefijoClase}`.trim();
                if (!classes[prefijoClase].includes(nuevasClases)) {
                    classes[prefijoClase].push(nuevasClases);
                }
                elemento.setAttribute('class', nuevasClases); 
            }
        
            // Iterar sobre los hijos que son nodos de tipo elemento
            const hijos = elemento.childNodes.filter((nodo) => nodo.nodeType === 1); 
            hijos.forEach((hijo: any) => {
                if (hijo.tagName) {
                    // Crear la nueva clase hija basada en la jerarquía actual
                    const nuevaClaseHija = `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
                    agregarClasesBEM(hijo, nuevaClaseHija); 
                }
            });

        }
        
          agregarClasesBEM(root, className);

          // Convertir el árbol de vuelta a HTML
          const modifiedText = root.toString();

          // Reemplazar el texto seleccionado con el HTML modificado
          editor.edit((editBuilder) => {
            editBuilder.replace(selection, modifiedText);
          });

          const cssOutput = Object.values(classes)
          .flatMap((set) => Array.from(set)) // Convertir Sets a arrays y combinarlos
          .map((className) => `.${className} {\n  /* estilos */\n}`)
          .join("\n\n");

            // Mostrar al usuario las clases generadas
            const doc = await vscode.workspace.openTextDocument({
                content: cssOutput,
                language: "css",
            });

            vscode.window.showTextDocument(doc);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}


////////////////////////////////////////////////////////



// import * as vscode from 'vscode';
// import { HTMLElement, parse } from 'node-html-parser';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//             const className = await vscode.window.showInputBox({
//                 prompt: "Ingrese el nombre de la clase",
//                 placeHolder: "Ejemplo: header",
//             });

//             if (!className) {
//                 return; // El usuario canceló la entrada
//             }

//             const selection = editor.selection;
//             const selectedText = editor.document.getText(selection);
//             const root = parse(selectedText);

//             // Objeto para almacenar las clases
//             const classes: { [key: string]: Set<string> } = {};

//             function agregarClasesBEM(elemento: HTMLElement, prefijoClase: string) {
//                 if (!classes[prefijoClase]) {
//                     classes[prefijoClase] = new Set();
//                 }

//                 if (elemento.tagName) {
//                     const nuevaClase = `${prefijoClase}`;
//                     classes[prefijoClase].add(nuevaClase);
//                     elemento.setAttribute("class", nuevaClase);
//                 }

//                 const hijos = elemento.childNodes.filter((nodo) => nodo.nodeType === 1);
//                 hijos.forEach((hijo: any) => {
//                     if (hijo.tagName) {
//                         const nuevaClaseHija = `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
//                         agregarClasesBEM(hijo, nuevaClaseHija);
//                     }
//                 });
//             }

//             agregarClasesBEM(root, className);

//             // Generar listado de clases en formato CSS
            // const cssOutput = Object.values(classes)
            //     .flatMap((set) => Array.from(set)) // Convertir Sets a arrays y combinarlos
            //     .map((className) => `.${className} {\n  /* estilos */\n}`)
            //     .join("\n\n");

            // // Mostrar al usuario las clases generadas
            // const doc = await vscode.workspace.openTextDocument({
            //     content: cssOutput,
            //     language: "css",
            // });

            // vscode.window.showTextDocument(doc);
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}




////////////////////////////////////////


// import * as vscode from 'vscode';
// import { HTMLElement, parse } from 'node-html-parser';
// import * as path from 'path';
// import * as fs from 'fs';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//             const className = await vscode.window.showInputBox({
//                 prompt: "Ingrese el nombre de la clase",
//                 placeHolder: "Ejemplo: header",
//             });

//             if (!className) {
//                 return; // El usuario canceló la entrada
//             }

//             const selection = editor.selection;
//             const selectedText = editor.document.getText(selection);
//             const root = parse(selectedText);

//             // Objeto para almacenar las clases
//             const classes: { [key: string]: Set<string> } = {};

//             function agregarClasesBEM(elemento: HTMLElement, prefijoClase: string) {
//                 if (!classes[prefijoClase]) {
//                     classes[prefijoClase] = new Set();
//                 }

//                 if (elemento.tagName) {
//                     const nuevaClase = `${prefijoClase}`;
//                     classes[prefijoClase].add(nuevaClase);
//                     elemento.setAttribute("class", nuevaClase);
//                 }

//                 const hijos = elemento.childNodes.filter((nodo) => nodo.nodeType === 1);
//                 hijos.forEach((hijo: any) => {
//                     if (hijo.tagName) {
//                         const nuevaClaseHija = `${prefijoClase}__${hijo.tagName.toLowerCase()}`;
//                         agregarClasesBEM(hijo, nuevaClaseHija);
//                     }
//                 });
//             }

//             agregarClasesBEM(root, className);

//             // Generar listado de clases en formato CSS
//             const cssOutput = Object.values(classes)
//                 .flatMap((set) => Array.from(set)) // Convertir Sets a arrays y combinarlos
//                 .map((className) => `.${className} {\n  /* estilos */\n}`)
//                 .join("\n\n");

//             // Guardar el resultado en un archivo .css en el sistema
//             const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

//             if (workspaceFolder) {
//                 // Verificar si el archivo CSS ya existe
//                 const filePath = path.join(workspaceFolder, 'styles.css'); // O el nombre que prefieras
//                 const cssFileExists = fs.existsSync(filePath);

//                 if (cssFileExists) {
//                     // Si el archivo ya existe, abrirlo y agregar las nuevas clases al final
//                     const currentContent = fs.readFileSync(filePath, 'utf8');
//                     const updatedContent = `${currentContent}\n\n${cssOutput}`; // Agregar las nuevas clases al final
//                     fs.writeFileSync(filePath, updatedContent, 'utf8');
//                     vscode.window.showInformationMessage(`Clases agregadas al archivo CSS existente: ${filePath}`);
//                 } else {
//                     // Si el archivo no existe, crear uno nuevo con las clases generadas
//                     fs.writeFileSync(filePath, cssOutput, 'utf8');
//                     vscode.window.showInformationMessage(`Archivo CSS creado en: ${filePath}`);
//                 }
//             }
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}
