import * as React from 'react';
import JSZip from 'jszip';
import { Treebeard } from 'react-treebeard';
import { readFile } from 'fs/promises';
import { dirname } from 'path';

import './app.css';

const showDiff = ({ vscode, fileData }) => {
  console.log('🚀 ~ file: App.tsx ~ line 9 ~ showDiff ~ fileData', fileData);
  const [leftTree, setLeftTree] = React.useState({});
  const [rightTree, setRightTree] = React.useState({});
  const [cursor, setCursor] = React.useState(undefined);
  // const [{ name: leftFileName, zip: left }, { name: rightFileName, zip: right }] = fileData;
  const { first: { name: leftFileName, zip: left }, second: { name: rightFileName, zip: right }, basePath } = fileData;

  const getData = (zip: JSZip, file: string): any => {
    const sorted = Object.keys(zip.files).sort().reduce((obj, key) => {
      if (!zip.files[key].dir) {
        obj[key] = zip.files[key];
      }
      return obj;
    }, {} as any);

    const groups: any[] = [];
    for (const key in sorted) {
      const keys = key.split('/').reverse();
      let childrenHolder = groups;
      while(keys.length) {
        const item = keys.pop();

        const existing = childrenHolder.find(c => c.name === item);

        if (existing) {
          childrenHolder = existing.children;
          continue;
        }
        const grp = { name: item, toggled: true, children: [], key };

        childrenHolder.push(grp);

        if (keys.length === 0) {
          delete grp.children;
          delete grp.toggled;
          childrenHolder = groups;
        } else {
          childrenHolder = grp.children;
        }

      }
    }
    return groups;
  };

  const showData = () => {
    const data = getData(left, 'test');
    console.log('🚀 ~ file: App.tsx ~ line 55 ~ showData ~ data', data);
  };

  function onToggle (node: any, toggled: boolean) {
    console.log('🚀 ~ file: App.tsx ~ line 59 ~ onToggle ~ toggled', toggled);
    // node.toggled = !node.toggled;
    console.log('🚀 ~ file: App.tsx ~ line 60 ~ onToggle ~ node', dirname(basePath));

    if (cursor) {
      setCursor({ ...cursor, active: false });
    }

    node.active = true;

    if (node.children) {
      node.toggled = toggled;
    }

    setCursor(node);
    // setLeftTree(Object.assign({}, leftTree));
    // setRightTree(Object.assign({}, rightTree));
  }

  React.useState(() => {
    const leftData = getData(left, leftFileName);
    const rightData = getData(right, rightFileName);
    setLeftTree({ name: leftFileName, toggled: true, children: leftData });
    setRightTree({ name: rightFileName, toggled: true, children: rightData });
  });

  // setLeftTree({ name: 'Root', children: getData(left) });

  return (
    <div className={'container'}>
      <div className="file-list-container">
        <button onClick={showData}>Click</button>
        <Treebeard data={leftTree} onToggle={onToggle} />
      </div>
      <div className="file-list-container">
        <Treebeard data={rightTree} onToggle={onToggle} />
      </div>
    </div>
  );
};

export default showDiff;
