import { Uri, workspace } from 'vscode';
import JSZip = require('jszip');
import { dirname, join } from 'path';

export default class Cache {
  private _cacheFolderUri: Uri;
  private _file1Folder: string;
  private _file2Folder: string;
  private _textEncoder: TextEncoder;

  constructor(cacheFolderUri: Uri) {
    this._cacheFolderUri = cacheFolderUri;
    this._file1Folder = 'first';
    this._file2Folder = 'second';
    this._textEncoder = new TextEncoder();
  }
  async createCache([uri1, uri2]: Uri[]): Promise<void> {
    await workspace.fs.createDirectory(this._cacheFolderUri);
    const file1Buffer: Uint8Array = await workspace.fs.readFile(uri1);
    const file2Buffer: Uint8Array = await workspace.fs.readFile(uri2);
    const file1Zip: JSZip = await JSZip.loadAsync(file1Buffer);
    const file2Zip: JSZip = await JSZip.loadAsync(file2Buffer);

    await this.createFiles(file1Zip, join(this._cacheFolderUri.fsPath, 'first'));
    await this.createFiles(file2Zip, join(this._cacheFolderUri.fsPath, 'second'));
    console.log('created');
  }

  async createFiles(zip: JSZip, folder: string) {
    for (const path of Object.keys(zip.files)) {
      const filePath = join(folder, ...path.split('/'));
      const folderPath = dirname(filePath);
      await workspace.fs.createDirectory(Uri.file(folderPath));
      await workspace.fs.writeFile(Uri.file(filePath), (await zip.file(path)?.async('uint8array')) || new Uint8Array());
    }
  }
}