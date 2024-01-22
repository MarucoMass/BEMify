// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
//             // Solicitar al usuario que ingrese la clase
//             const className = await vscode.window.showInputBox({
//                 prompt: 'Ingrese el nombre de la clase BEM',
//                 placeHolder: 'Ejemplo: bloque__elemento--modificador',
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

// export function deactivate() {}

// console.log('¡Hola desde mi extensión!');



// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
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

// export function deactivate() {}

// console.log('¡Hola desde mi extensión!');


// import * as vscode from 'vscode';
// import * as cheerio from 'cheerio';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {

            // const className = await vscode.window.showInputBox({
            //     prompt: 'Ingrese el nombre de la clase',
            //     placeHolder: 'Ejemplo: header',
            // });

            // if (!className) {
            //     // El usuario canceló la entrada o no proporcionó una clase
            //     return;
            // }

//             const selection = editor.selection;

//             // Obtener el texto de la selección
//             const selectedText = editor.document.getText(selection);

//             // Cargar el texto HTML en Cheerio
//             const $ = cheerio.load(selectedText);

//             // Obtener los hijos del elemento seleccionado
//             const children = $.root().children();

//             console.log($.root());

//             // Iterar sobre los hijos
//             children.each((index, element) => {
//                 // Realizar operaciones específicas con cada hijo (puedes reemplazar esto con tu propia lógica)
//                 console.log(element.tagName);
//             });
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}

// import * as vscode from 'vscode';
// import * as cheerio from 'cheerio';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.applyBEM', async() => {
//         const editor = vscode.window.activeTextEditor;

//         if (editor) {
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

//             const $ = cheerio.load(selectedText);

//             // Agregar una clase a todos los elementos seleccionados
//             // const className = 'tu-nueva-clase';
//             // $('*').addClass(className);
//             // $('*:not(html):not(head):not(body)').addClass(className);
//             // $('*:not(html):not(head):not(body)').each((index, element) => {
//             //     const $element = $(element);

//             //     const tagName = $element.prop("tagName");
//             //     const parentTagName = $element.parent().prop("tagName");
//             //     const childTagName = $element.children().prop("tagName");

//             //     let isFirstTag;
//             //     let minTag = tagName?.toLowerCase();

//             //     if (parentTagName === 'BODY') {
//             //         isFirstTag = tagName;
//             //         $(element).addClass(className);
//             //     } else{
//             //         $(element).addClass(`${className}__${minTag}`);
//             //     }
             
//             //     // console.log(`Elemento: ${tagName}, Padre: ${parentTagName}, Hijo: ${childTagName}`);
//             // });
//             $('*:not(html):not(head):not(body)').each((index, element) => {
//                 const $element = $(element);
//                 const tagName = $element.prop("tagName")?.toLowerCase();
//                 const parentTagName = $element.parent().prop("tagName").toLowerCase();
         
                
//                 let classNameToAdd;
//                 let isFirstTag;
//                 if (parentTagName === 'body') {
//                     // Es el primer nivel, agregar la clase directamente
//                     classNameToAdd = className;
//                     isFirstTag = tagName;
//                     console.log(isFirstTag);
//                 } else {
//                     // No es el primer nivel, agregar clase BEM
//                     if (parentTagName === 'header') {
//                         classNameToAdd = `${className}__${tagName}`;
//                     } else {
//                         // const parentTagNameLowerCase = parentTagName;
//                         classNameToAdd = `${className}__${parentTagName}--${tagName}`;
//                     }
//                 }
            
//                 console.log(`index: ${index}, tag: ${tagName}`);
//                 // Agregar la clase al elemento
//                 $element.addClass(classNameToAdd);
//             });
            
//             // Convierte el documento de nuevo a cadena
//             const modifiedText = $.html();

//             // console.log(modifiedText);
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}

import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.applyBEM', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const className = await vscode.window.showInputBox({
                prompt: 'Ingrese el nombre de la clase',
                placeHolder: 'Ejemplo: header',
            });

            if (!className) {
                // El usuario canceló la entrada o no proporcionó una clase
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            const $ = cheerio.load(selectedText);

            // Filtrar elementos que no son body
            $('body *').each((index, element) => {
                const $element = $(element);
                const tagName = $element.prop("tagName")?.toLowerCase();
                const parentTagName = $element.parent().prop("tagName")?.toLowerCase();

                let classNameToAdd;
                if (parentTagName === 'body') {
                    // Es el primer nivel, agregar la clase directamente
                    classNameToAdd = className;
                } else {
                    // No es el primer nivel, agregar clase BEM
                    classNameToAdd = `${className}__${tagName}`;
                }

                // Agregar la clase al elemento
                $element.addClass(classNameToAdd);
            });

            // Obtener solo el contenido dentro de body
            const modifiedHtml = $('body').html() || '';

            // Reemplazar solo el contenido dentro de la selección original
            editor.edit(editBuilder => {
                editBuilder.replace(selection, modifiedHtml);
            });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
