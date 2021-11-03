import * as React from 'react';
import set from 'lodash.set';
// import { IGroup } from '@fluentui/react';

import './app.css';
import { IGroup } from '@fluentui/react/lib/GroupedList';
import { debug } from 'console';
// import { folder } from 'jszip';

// interface IXmlPart {
//   name: string;
//   location: string;
// }

// class XmlPart {
//   name: string;
//   location: string;

//   constructor(options?: IXmlPart) {
//     options.location = this.location;
//     options.name = this.name;
//   }
// }

const showDiff = ({ vscode, fileData }) => {
  // const [value, setValue] = React.useState('');
  // const [chats, setChats] = React.useState([]);
  // const [msgId, setMessageId] = React.useState(1);
  const [left, right] = fileData;
  const leftFiles: any = {};
  const rightFiles: any = {};
  const leftItems: any[] = [];
  const rightItems: any[] = [];
  const leftGroups: any[] = [];
  const sortedLeft = Object.keys(left.files).sort().reduce((obj, key) => {
    if (!left?.files[key].dir) {
      obj[key] = left?.files[key];
    }
    return obj;
  }, {} as any);
  // const leftGroup: IGroup = { key: 'leftRoot', count: sortedLeft.length, name: 'left file', level: 0, startIndex: 0, children: [] };


  for (const key in left.files) {
    const folders = key.split('/');
    // const fileName = folders.pop();
    if (left.files[key].dir) {
      set(leftFiles, folders, folders[folders.length - 1]);
      leftItems.push({ name: folders[folders.length - 1], location: folders.slice(0, folders.length - 1) });
    }
  }

  for (const key in right.files) {
    const folders = key.split('/');
    set(rightFiles, folders, folders[folders.length - 1]);
    rightItems.push({ name: folders[folders.length - 1], location: folders.slice(0, folders.length - 1) });
  }

  // for (const key in sortedLeft) {
  //   const keys = key.split('/').reverse();
  //   // keys.splice(keys.length - 1, 1);
  //   // let index = '';
  //   // for (const k of keys) {
  //   //   if (!depth.hasOwnProperty(k)) {
  //   //     depth[k] = 0;
  //   //   } else {
  //   //     depth[k]++;
  //   //   }
  //   //   index += `[${depth[k]}]`;
  //   // }

  //   // set(leftGroups, index, sortedLeft[key].name);
  //   let childrenHolder = groups;
  //   while(keys.length) {
  //     console.log('🚀 ~ file: App.tsx ~ line 61 ~ showDiff ~ keys', keys);
  //     for (let i = 0; i < keys.length; i++) {
  //       console.log('key: ', keys[i]);
  //     }
  //     debugger;
  //     const item = keys.pop();
  //     const grp = { name: item, count: 99, key: 'not unique', startIndex: 0, children: [] };

  //     const existing = childrenHolder.find(c => {
  //       // console.log('🚀 ~ file: App.tsx ~ line 81 ~ showDiff ~ item ~ c.name', item, '  :  ', c.name);
  //       return c.name === item;
  //     });

  //     if (existing) {
  //       console.log('🚀 ~ file: App.tsx ~ line 85 ~ showDiff ~ existing2', existing);
  //       childrenHolder = existing.children;
  //     }

  //     childrenHolder.push(grp);

  //     if (keys.length === 0) {
  //       childrenHolder = groups;
  //     } else {
  //       childrenHolder = grp.children;
  //     }

  //   }
  // }

  // const objectDepth = (o) => Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(objectDepth)) : 0;

  const showData = () => {
    // console.log('data:     ', { vscode, fileData });
    console.log('leftFiles  :   ', leftFiles);
    console.log('left  :  ', left);
    // console.log('leftItems  :  ', leftItems);
    const groups: IGroup[] = [];
    let index = 0;
    for (const key in sortedLeft) {
      const keys = key.split('/').reverse();
      // keys.splice(keys.length - 1, 1);
      // let index = '';
      // for (const k of keys) {
      //   if (!depth.hasOwnProperty(k)) {
      //     depth[k] = 0;
      //   } else {
      //     depth[k]++;
      //   }
      //   index += `[${depth[k]}]`;
      // }

      // set(leftGroups, index, sortedLeft[key].name);
      let childrenHolder = groups;
      let level = 0;
      while(keys.length) {
        const item = keys.pop();

        const existing = childrenHolder.find(c => c.name === item);

        if (existing) {
          childrenHolder = existing.children;
          continue;
        }
        const grp = { name: item, count: 99, key: key, startIndex: index, children: [], level: level++ };

        childrenHolder.push(grp);

        if (keys.length === 0) {
          index++;
          childrenHolder = groups;
        } else {
          childrenHolder = grp.children;
        }

      }
    }
    console.log('sorted  :  ', sortedLeft);
    console.log('grops  :  ', groups);
  };

  return (
    <div className={'container'}>
      <div className="file-list-container">
        <button onClick={showData}>Click</button>
      </div>
      <div className="file-list-container">right</div>
    </div>
  );
};

export default showDiff;
