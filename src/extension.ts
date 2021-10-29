// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, Uri } from 'vscode';
import DiffView from './diff-view';
import { SHOW_MENU_ITEM_COMMAND } from './constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  const diffView: DiffView = new DiffView(context);

  context.subscriptions.push(
    commands.registerCommand(SHOW_MENU_ITEM_COMMAND, async (uri: Uri, uriArr: Uri[]) => await diffView.openDiffView(uri, uriArr)),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
