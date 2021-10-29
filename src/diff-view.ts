import { Uri, ViewColumn, WebviewPanel, window, ExtensionContext } from 'vscode';
import { join } from 'path';

export default class DiffView {
  private _extensionPath: string;

  constructor({ extensionPath }: ExtensionContext) {
    this._extensionPath = extensionPath;
  }

  async openDiffView(uri1: Uri, uri2: Uri): Promise<void> {
    if (!uri1 || !uri2) {
      await window.showErrorMessage('Select 2 Open XML files to compare', { modal: true });
      return;
    }

    const panel: WebviewPanel = window.createWebviewPanel('compareOpenXmlFiles', 'Compare Open XML Files', ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [Uri.file(join(this._extensionPath, 'oxmlDiffViewer'))],
    });

    const reactAppPathOnDisk = Uri.file(join(this._extensionPath, 'oxmlDiffViewer', 'oxmlDiffViewer.js'));
    const reactAppUri = reactAppPathOnDisk.with({ scheme: 'vscode-resource' });

    panel.webview.html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Config View</title>

        <meta http-equiv="Content-Security-Policy"
              content="default-src https://random-data-api.com/;
                      img-src https:;
                      script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                      style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script src="${reactAppUri}"></script>
      </body>
    </html>`;
  }
}
