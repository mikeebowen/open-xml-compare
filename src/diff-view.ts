import { Uri, ViewColumn, WebviewPanel, window, ExtensionContext } from 'vscode';
import { join } from 'path';
import Cache from './cache';

export default class DiffView {
  private _extensionPath: string;
  private _cache: Cache | undefined;
  private _webviewPanels: WebviewPanel[];

  constructor({ extensionPath, storageUri }: ExtensionContext) {
    this._extensionPath = extensionPath;
    this._webviewPanels = [];
    if (storageUri) {
      this._cache = new Cache(storageUri);
    }
  }

  async openDiffView(uri: Uri, uriArr: Uri[]): Promise<void> {
    if (uriArr.length !== 2) {
      await window.showErrorMessage('Select 2 OXML files to compare', { modal: true });
      return;
    }

    for (const webviewPanel of this._webviewPanels) {
      webviewPanel.dispose();
    }

    const zips = await this._cache?.createCache(uriArr);

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
          window.fileData = ${JSON.stringify(zips)}
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script src="${reactAppUri}"></script>
      </body>
    </html>`;
  }
}
