import * as  vscode from "vscode";

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

const getFileName = () => vscode.window.activeTextEditor.document.fileName;

function getInterpolatedName(originalText, interpolationPattern) {
  const {interpolateName} = require("@formatjs/ts-transformer");
  return interpolateName(
    { resourcePath: getFileName() },
    interpolationPattern /* Defaults to '[hash].[ext]'. */,
    { content: originalText }
  );
}

function generateId(editor, originalText) {
  let id = vscode.workspace.asRelativePath(editor.document.fileName);

  // remove filename extensions
  id = id.split(".").slice(0, -1).join("");

  // change '/' to '.'
  id = id.split("/").join(".");

  // remove leading '.' if any
  id = id[0] === "." ? id.slice(1) : id;

  const allowlistedPaths = vscode.workspace
    .getConfiguration("extension.formattedMessage")
    .get("allowlistedPaths");

    allowlistedPaths.forEach((path) => {
    id = id.replace(path, "");
  });
  return id;
}

function getMessageId(editor, originalText) {
  const idPattern = vscode.workspace
    .getConfiguration("extension.formattedMessage")
    .get("idGenerationPattern");
  const id =
    idPattern === "default"
      ? `${generateId(editor, originalText)}.${hashId(originalText)}`
      : getInterpolatedName(originalText, idPattern);

  return id;
}

function activate(context) {
  // for javascript files
  const formatMessage = vscode.commands.registerCommand(
    "extension.formattedMessage",
    function () {
      vscode.window.showInformationMessage(`Esta es la nueva versión.`)
      const editor = getEditor();
      const originalText = getSelectedText(editor);
      const id = getMessageId(editor, originalText);

      editor.edit((edit) => {
        edit.replace(
          editor.selection,
          `<FormattedMessage defaultMessage="${originalText}" description="" id="${id}"/>`
        );
      });
    }
  );
  context.subscriptions.push(formatMessage);

  // for python files
  const transMessage = vscode.commands.registerCommand(
    "extension.transMessage",
    function () {
      const editor = getEditor();
      const originalText = getSelectedText(editor);
      const id = getMessageId(editor, originalText);

      editor.edit((edit) => {
        edit.replace(
          editor.selection,
          `trans.message(
            id="${id}",
            message="${originalText}",
            language=current_user.language,
            description="",
          )`
        );
      });
    }
  );

  context.subscriptions.push(transMessage);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
