// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    '"react-intl-string-to-formatted-message" is now active! Highlight text to format'
  );

  // 👍 formatter implemented using API
  vscode.languages.registerDocumentFormattingEditProvider("foo-lang", {
    provideDocumentFormattingEdits(document) {
      const firstLine = document.lineAt(0);
      if (firstLine.text !== "42") {
        return [vscode.TextEdit.insert(firstLine.range.start, "42\n")];
      }
    }
  });

  // context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
