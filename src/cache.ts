import { Uri, workspace, window } from 'vscode';
import JSZip from 'jszip';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import xmlFormatter from 'xml-formatter';

export default class Cache {
  private _cacheFolderUri: Uri;
  private _file1Folder: string;
  private _file2Folder: string;
  private _textEncoder: TextEncoder;
  private _textDecoder: TextDecoder;

  constructor(cacheFolderUri: Uri) {
    this._cacheFolderUri = cacheFolderUri;
    this._file1Folder = 'first';
    this._file2Folder = 'second';
    this._textEncoder = new TextEncoder();
    this._textDecoder = new TextDecoder();
  }

  get cacheFolderUri() {
    return this._cacheFolderUri;
  }
  async createCache([uri1, uri2]: Uri[]): Promise<JSZip[] | void> {
    try {
      if (existsSync(this._cacheFolderUri.fsPath)) {
        await workspace.fs.delete(this._cacheFolderUri, { recursive: true, useTrash: false });
      }

      await workspace.fs.createDirectory(this._cacheFolderUri);
      const file1Buffer: Uint8Array = await workspace.fs.readFile(uri1);
      const file2Buffer: Uint8Array = await workspace.fs.readFile(uri2);
      const file1Zip: JSZip = await JSZip.loadAsync(file1Buffer);
      const file2Zip: JSZip = await JSZip.loadAsync(file2Buffer);

      await this.createFiles(file1Zip, join(this._cacheFolderUri.fsPath, 'first'));
      await this.createFiles(file2Zip, join(this._cacheFolderUri.fsPath, 'second'));

      return [file1Zip, file2Zip];
    } catch (err) {
      const error = <Error>err;
      await window.showErrorMessage(error?.message || error.toString());
    }
  }

  async createFiles(zip: JSZip, folder: string) {
    for (const path of Object.keys(zip.files)) {
      const filePath = join(folder, ...path.split('/'));
      const folderPath = dirname(filePath);
      const data: Uint8Array | undefined = await zip.file(path)?.async('uint8array');

      if (data) {
        await workspace.fs.createDirectory(Uri.file(folderPath));

        const fileContents: string = this._textDecoder.decode(data);

        if (fileContents.startsWith('<?xml')) {
          const formatted: Uint8Array = this._textEncoder.encode(xmlFormatter(fileContents, { indentation: '  ', collapseContent: true }));
          await workspace.fs.writeFile(Uri.file(filePath), formatted);
        } else {
          await workspace.fs.writeFile(Uri.file(filePath), data);
        }
      }
    }
  }
}
