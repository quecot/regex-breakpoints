import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "regex-breakpoints.setBreakpoints",
      async (args?: any) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor found!");
          return;
        }

        const regexInput =
          args?.providedRegex ??
          (await vscode.window.showInputBox({
            prompt: "Enter the regex pattern to match lines for breakpoints",
            placeHolder: "e.g., console\\.log",
          }));

        if (!regexInput) {
          vscode.window.showWarningMessage("Regex input is required.");
          return;
        }

        let regex: RegExp;
        try {
          regex = new RegExp(regexInput);
        } catch (e) {
          vscode.window.showErrorMessage("Invalid regex pattern!");
          return e;
        }

        const document = editor.document;
        const breakpoints: vscode.SourceBreakpoint[] = [];

        for (let line = 0; line < document.lineCount; line++) {
          const lineText = document.lineAt(line).text;
          if (regex.test(lineText)) {
            const uri = document.uri;
            const position = new vscode.Position(line, 0);
            const breakpoint = new vscode.SourceBreakpoint(
              new vscode.Location(uri, position)
            );
            breakpoints.push(breakpoint);
          }
        }

        vscode.debug.addBreakpoints(breakpoints);
        vscode.window.showInformationMessage(
          `${breakpoints.length} breakpoints added.`
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "regex-breakpoints.removeBreakpoints",
      async (args?: any) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No active editor found!");
          return;
        }

        const regexInput =
          args?.providedRegex ??
          (await vscode.window.showInputBox({
            prompt:
              "Enter the regex pattern to match lines for removing breakpoints",
            placeHolder: "e.g., console\\.log",
          }));

        if (!regexInput) {
          vscode.window.showWarningMessage("Regex input is required.");
          return;
        }

        let regex: RegExp;
        try {
          regex = new RegExp(regexInput);
        } catch (e) {
          vscode.window.showErrorMessage("Invalid regex pattern!");
          return;
        }

        const document = editor.document;

        const existingBreakpoints = vscode.debug.breakpoints.filter((bp) => {
          if (bp instanceof vscode.SourceBreakpoint) {
            const line = bp.location.range.start.line;
            const lineText = document.lineAt(line).text;
            return (
              bp.location.uri.toString() === document.uri.toString() &&
              regex.test(lineText)
            );
          }
          return false;
        });

        vscode.debug.removeBreakpoints(existingBreakpoints);
        vscode.window.showInformationMessage(
          `${existingBreakpoints.length} breakpoints removed.`
        );
      }
    )
  );
}

export function deactivate() {}
