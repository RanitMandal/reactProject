import React from 'react';
import { Tree} from 'antd';

const { DirectoryTree } = Tree;

export const CustomTree = ({ treeData, selectedKeys, onSelect }) => {
  const onCheck = (checkedKeys, { checkedNodes }) => {
    const selectedKeys = checkedNodes.map((node) => node.key);
    onSelect(selectedKeys);
  };

  return (
    <DirectoryTree
      showLine
      showLeafIcon
      treeData={treeData}
      checkedKeys={selectedKeys}
      onCheck={onCheck}
      checkable // Enable checkboxes for tree nodes
      selectable={false} // Disable text selection
      // style={{ border: '1px solid #d9d9d9', borderRadius: '2px', padding: '8px' }} // Custom styling
    />
  );
};

// export const Test = () => {
//   const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
//   const [rightSelectedKeys, setRightSelectedKeys] = useState([]);
//   const [rightBoxItems, setRightBoxItems] = useState([]);
//   const [treeData, setTreeData] = useState([
//     // Your treeData here
//     {
//       title: 'parent 0',
//       key: '0-0',
//       children: [
//         {
//           title: 'leaf 0-0',
//           key: '0-0-0',
//           isLeaf: true,
//         },
//         {
//           title: 'leaf 0-1',
//           key: '0-0-1',
//           isLeaf: true,
//         },
//       ],
//     },
//     {
//       title: 'parent 1',
//       key: '0-1',
//       children: [
//         {
//           title: 'leaf 1-0',
//           key: '0-1-0',
//           isLeaf: true,
//         },
//         {
//           title: 'leaf 1-1',
//           key: '0-1-1',
//           isLeaf: true,
//         },
//       ],
//     },
//   ]);

//   const handleRightShift = () => {
//     const selectedItems = [];
//     leftSelectedKeys.forEach((key) => {
//       const node = findNodeByKey(treeData, key);
//       if (node && !rightBoxItems.some((item) => item.key === node.key)) {
//         // Check if the node is not already in the right box before adding it
//         selectedItems.push(node);
//         getAllSelectedKeys(node, leftSelectedKeys);
//       }
//     });

//     setRightBoxItems([...rightBoxItems, ...selectedItems]);
//     setLeftSelectedKeys([]); // Clear selected items from left box after shift
//   };

//   const handleLeftShift = () => {
//     const selectedItems = [];
//     rightSelectedKeys.forEach((key) => {
//       const node = findNodeByKey(rightBoxItems, key);
//       if (node) {
//         selectedItems.push(node);
//         getAllSelectedKeys(node, rightSelectedKeys);
//       }
//     });

//     setRightBoxItems((prevItems) => prevItems.filter((item) => !rightSelectedKeys.includes(item.key)));
//     setRightSelectedKeys([]); // Clear selected items from right box after shift
//   };

//   const getAllSelectedKeys = (node, selectedKeys) => {
//     if (!node) return;
//     selectedKeys.push(node.key);
//     if (node.children) {
//       node.children.forEach((child) => getAllSelectedKeys(child, selectedKeys));
//     }
//   };

//   const findNodeByKey = (data, key) => {
//     for (let node of data) {
//       if (node.key === key) {
//         return node;
//       }
//       if (node.children) {
//         const foundNode = findNodeByKey(node.children, key);
//         if (foundNode) return foundNode;
//       }
//     }
//     return null;
//   };

//   return (
//     <div className='row mb-12'>
//       {/* Left Box */}
//       <div className='col-md-5 border border-primary'>
//         <CustomTree treeData={treeData} selectedKeys={leftSelectedKeys} onSelect={setLeftSelectedKeys} />
//       </div>
//       <div className='col-md-1 justify-content-center'>
//         {/* Right Shift Button */}
//         <Button className='btn-info' variant='contained' color='primary' type='button' onClick={handleRightShift}>
//           &gt;
//         </Button>
//         <br />
//         <br />
//         {/* Left Shift Button */}
//         <Button className='btn-info' variant='contained' color='primary' type='button' onClick={handleLeftShift}>
//           &lt;
//         </Button>
//       </div>
//       {/* Right Box */}
//       <div className='col-md-5 border border-primary'>
//         <ul>
//           {rightBoxItems.map((item) => (
//             <li
//               key={item.key}
//               style={{
//                 background: rightSelectedKeys.includes(item.key) ? 'lightblue' : 'white',
//                 cursor: 'pointer', // Add pointer cursor to indicate clickable
//                 padding: '4px',
//                 borderRadius: '4px',
//                 marginBottom: '4px',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               <Checkbox
//                 checked={rightSelectedKeys.includes(item.key)}
//                 onChange={(e) => {
//                   const selectedKeys = rightSelectedKeys.slice();
//                   if (e.target.checked) {
//                     selectedKeys.push(item.key);
//                   } else {
//                     const index = selectedKeys.indexOf(item.key);
//                     if (index > -1) {
//                       selectedKeys.splice(index, 1);
//                     }
//                   }
//                   setRightSelectedKeys(selectedKeys);
//                 }}
//               />
//               {item.title}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };
