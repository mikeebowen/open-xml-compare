import * as JSZip from 'jszip';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import './index.css';
import App from './App';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    fileData: JSZip[];
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <App vscode={vscode} fileData={window.fileData}/>,
  document.getElementById('root'),
);