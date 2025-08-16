import * as vscode from "vscode";

export function registerChangeModeCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.changeBEMifyMode",
    async () => {
      // Opciones que se mostrarán en el selector
      const options: vscode.QuickPickItem[] = [
        {
          label: "classic",
          description: "Classic BEM: header_nav, header_ul, header_li",
        },
        {
          label: "modern",
          description:
            "Modern BEM: header__nav, header__nav__ul, header__nav__ul__li",
        },
      ];

      // Mostrar el selector
      const selected = await vscode.window.showQuickPick(options, {
        placeHolder: "Choose a BEMify mode",
      });

      if (selected) {
        // Guardar la opción en la configuración global
        const config = vscode.workspace.getConfiguration("bemify");
        await config.update(
          "mode",
          selected.label,
          vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage(
          `BEMify switched to: ${selected.label}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
