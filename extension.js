const vscode = require("vscode");

function getEditor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  return editor;
}

function getSelectedText(editor) {
  const selection = editor.selection;
  let text = editor.document.getText(selection);
  return text;
}

function activate(context) {
  const formatMessage = vscode.commands.registerCommand(
    "extension.formattedMessage",
    function() {
      const editor = getEditor();
      const code = getSelectedText(editor);
      const fileName = ""; // TODO

      editor.edit(edit => {
        edit.replace(
          editor.selection,
          `<FormattedMessage defaultMessage="${code}" description="" id="${fileName}"/>`
        );
      });
    }
  );

  context.subscriptions.push(formatMessage);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
