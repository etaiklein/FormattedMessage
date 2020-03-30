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

function hashId(text = "") {
  let hash = 0;
  let i = 0;
  let char = 0;
  if (text.length == 0) return hash;
  for (i = 0, l = text.length; i < l; i++) {
    char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  return Math.abs(hash); // remove leading '-'
}

function generateId(editor, originalText) {
  let id = vscode.workspace.asRelativePath(editor.document.fileName);

  // remove filename extensions
  id = id
    .split(".")
    .slice(0, -1)
    .join("");

  // change '/' to '.'
  id = id.split("/").join(".");

  // remove leading '.' if any
  id = id[0] === "." ? id.slice(1) : id;

  // TODO move whitelist to settings config
  // remove whitelisted paths
  const whitelistedPaths = [
    "mobile.member.js.",
    "python.manhattan.static.js.",
    "python.manhattan.oscar."
  ];
  whitelistedPaths.forEach(path => {
    id = id.replace(path, "");
  });
  return id;
}

function activate(context) {
  const formatMessage = vscode.commands.registerCommand(
    "extension.formattedMessage",
    function() {
      const editor = getEditor();
      const originalText = getSelectedText(editor);
      const id = `${generateId(editor, originalText)}.${hashId(originalText)}`;

      editor.edit(edit => {
        edit.replace(
          editor.selection,
          `<FormattedMessage defaultMessage="${originalText}" description="" id="${id}"/>`
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
