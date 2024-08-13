import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, ModalTitle, Card, Form, Row } from "react-bootstrap";

import { Delete, Edit, Fullscreen, Visibility } from "@mui/icons-material";
import Grid from '@mui/system/Unstable_Grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField, List
} from "@mui/material";
import { CustomTree } from "../../../components/Test";
import { Checkbox } from 'antd';

import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import { modGrpLovColumns, modLovColumns, roleLovColumns } from "./columns";
import TreeView from 'deni-react-treeview';
import { logs } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import FavLink from "../../common/FavLink";
const headers = { Authorization: 'Bearer ' + getApiToken() };
let qryObj = []
const RoleMenuMapping = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const [selectedItem, set_selectedItem] = useState([])
  const [unSelectedItem, set_unSelectedItem] = useState([])

  const [queryInputObj, setQueryInputObj] = useState({})
  const [modLovObj, setModLovObj] = useState({
    modGrpId: ''
  })
  // Open Form

  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: "SUA00031"
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);
        // setMsg(res?.data?.appMsgList?.List[0]?.errDesc + "(" + res?.data?.appMsgList?.List[0]?.errCd + ")");
        // setMsgTyp(res?.data?.appMsgList?.List[0]?.errType)
      })
    }
    fetchOpenData()
  }, [])


  //ModuleGroup Lov Starts     

  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {

    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: "SUA00142"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00010/getAllModGrp", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setModGrpLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchModGrpLovData();
  }, []);


  const getModGrpNm = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm
  }

  const getModGrpId = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId
  }


  const [selectRow, setSelectRow] = useState({});
  const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
  const handleRowClickModGrpLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModLov({})
    setSelectRowRoleLov({})
    setleftData([])
    setRightData([])
    setApprove(false)
    setMsg("")
    setMsgTyp("")

  };
  //ModuleGroup Lov ends

  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj = {
      apiId: "SUA00143",
      criteria: {
        modGrpId: getModGrpId(selectRow)
      }
    }
    console.log(modLovObj)
    const fetchModLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00010/getModMstByModGrp", modLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    selectRow && fetchModLovData();
  }, [selectRow]);


  const getModName = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modNm
  }

  const getModId = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modId
  }

  const [selectRowModLov, setSelectRowModLov] = useState({});
  const [showModelModLov, setShowModelModLov] = useState(false);
  const handleRowClickModLov = (rowData) => {
    setSelectRowModLov(rowData);

    let obj = {
      apiId: "SUA00033",
      criteria: {
        modId: getModId(rowData),
        roleId: getRoleId(selectRowRoleLov)
      }

    }
    setQueryInputObj(obj)
    setSelectRowRoleLov({})
    setleftData([])
    setRightData([])
    setApprove(false)
    setMsg("")
    setMsgTyp("")
  };

  //Mod Lov Ends

  //Role Lov Starts

  const [roleLovData, setRoleLovData] = useState([]);
  useEffect(() => {


    console.log()
    const fetchRoleLovData = async () => {
      let obj = {
        apiId: "SUA00144"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00010/getAllRole", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setRoleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    fetchRoleLovData();
  }, []);


  const getRoleName = (obj) => {
    return roleLovData[Number(Object.keys(obj)[0])]?.roleNm
  }

  const getRoleId = (obj) => {
    return roleLovData[Number(Object.keys(obj)[0])]?.roleId
  }

  const [selectRowRoleLov, setSelectRowRoleLov] = useState({});
  const [showModelRoleLov, setShowModelRoleLov] = useState(false);
  const handleRowClickRoleLov = (rowData) => {
    setSelectRowRoleLov(rowData);
    let obj = {

      apiId: "SUA00033",
      criteria: {
        modId: getModId(selectRowModLov),
        roleId: getRoleId(rowData)
      }

    }
    setQueryInputObj(obj)
    setleftData([])
    setRightData([])
    setApprove(false)
    setMsg("")
    setMsgTyp("")
  };

  //Role Lov Ends



  // Query API

  const [leftData, setleftData] = useState([]);
  const [rightData, setRightData] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [approve, setApprove] = useState(false)

  const postQuery = async (e) => {
    e.preventDefault()
    if (!selectRow) {
      setMsgTyp("VE")
      setMsg("Please Select Module")
      return
    }
    console.log(queryInputObj)
    setleftData([])
    setRightData([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        //Left Hand side
        setApprove(true)
        const modifyData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              menuNm: item.text,
              menuId: item.id,
              parMenuId: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyData(item.children);
            }
            return newItem;
          });
        };

        const modifiedData = modifyData(res.data.content.qryRsltSetAvl);

        setleftData(modifiedData);
        const modifyRightData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              menuNm: item.text,
              menuId: item.id,
              parMenuId: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyRightData(item.children);
            }
            return newItem;
          });
        };

        const modifiedRightData = modifyData(res.data.content.qryRsltSetMap);

        setRightData(modifiedRightData);

      }

      else {
        setleftData([])
        setRightData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
    }).catch(error => {
      console.log(error);
    })

  }

  console.log(rightData);


  console.log(leftData);



  let items = [];
  const [itemArr, set_itemArr] = useState([])
  const findParentItem = (items, parentId) => {

    for (const item of items) {
      if (item.menuId === parentId) {
        return item;
      }

      if (item.children && item.children.length > 0) {
        const parentItem = findParentItem(item.children, parentId);
        if (parentItem) {
          return parentItem;
        }
      }
    }

    return null;
  };
  const addChild = (obj) => {

    if (!obj.children) return
    obj.children.forEach((el) => {
      // Select the child items


      items.push({
        menuId: el.menuId,
        parMenuId: el.parMenuId,
        roleId: getRoleId(selectRowRoleLov)
      });
      if (el.children) addChild(el)

    });
  }

  const AddParent = (parentId, itemArr) => {
    const parentItem = findParentItem(leftData, parentId);

    if (parentItem && parentItem.checked === false) {
      if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
        itemArr.push({
          menuId: parentItem.menuId,
          roleId: getRoleId(selectRowRoleLov)
        });
      }

      AddParent(parentItem.parentId);
    }

    return itemArr
  };

  const AddChildren = (children, itemArr) => {
    children.forEach(child => {
      itemArr = AddParent(child.parentId, itemArr);

      itemArr.push({
        menuId: child.menuId,
        roleId: getRoleId(selectRowRoleLov)
      });

      if (child?.children && child?.children?.length > 0) {
        itemArr = AddChildren(child.children, itemArr);
      }
    });

    return itemArr
  };

  // Tree Population and Manipulation Ends................
  // let handleConfirmation = (children, items, data) => {

  //   let itemArr = [...items]
  //   const findParentItem = (data, parentId) => {

  //     for (const item of data) {
  //       if (item.menuId === parentId) {
  //         return item;
  //       }

  //       if (item.children && item.children.length > 0) {
  //         const parentItem = findParentItem(item.children, parentId);
  //         if (parentItem) {
  //           return parentItem;
  //         }
  //       }
  //     }

  //     return null;
  //   };

  //   const AddParent = (parentId) => {
  //     //debugger
  //     const parentItem = findParentItem(data, parentId);
  //     if (parentItem && parentItem.checked === false) {
  //       if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
  //         itemArr.push({
  //           menuId: parentItem.menuId,
  //           roleId: getRoleId(selectRowRoleLov)
  //         });

  //       }

  //       AddParent(parentItem.parentId);
  //     }

  //   };

  //   const AddChildren = (children) => {
  //     children.forEach(child => {
  //       AddParent(child.parentId, itemArr);

  //       itemArr.push({
  //         menuId: child.menuId,
  //         roleId: getRoleId(selectRowRoleLov)
  //       });

  //       if (child?.children && child?.children?.length > 0) {
  //         AddChildren(child.children, itemArr);
  //       }
  //     })
  //   };
  //   AddChildren(children, itemArr);
  //   set_selectedItem(itemArr);
  // }
  let handleConfirmation = (children, items, data) => {

    let itemArr = [...items]
    const findParentItem = (data, parentId) => {

      for (const item of data) {
        if (item.menuId === parentId) {
          return item;
        }

        if (item.children && item.children.length > 0) {
          const parentItem = findParentItem(item.children, parentId);
          if (parentItem) {
            return parentItem;
          }
        }
      }

      return null;
    };

    const AddParent = (parentId) => {
      //debugger
      const parentItem = findParentItem(data, parentId);
      if (parentItem && parentItem.checked === false) {
        if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
          itemArr.push({
            menuId: parentItem.menuId,
            roleId: getRoleId(selectRowRoleLov)
          });

        }

        AddParent(parentItem.parentId);
      }

    };

    const AddChildren = (children) => {
      children.forEach(child => {
        AddParent(child.parentId, itemArr);

        itemArr.push({
          menuId: child.menuId,
          roleId: getRoleId(selectRowRoleLov)
        });

        if (child?.children && child?.children?.length > 0) {
          AddChildren(child.children, itemArr);
        }
      })
    };
    AddChildren(children, itemArr);
    set_selectedItem(itemArr);
  }
  const [dialogObj, setDialogObj] = useState({
    status: false,
    onConfirm: () => { },
    msg: ""
  })

  const handleSelectItem = async (obj) => {
    let items = [...selectedItem];
    if (obj.state === 1) {
      if ((!obj.parentId || obj.hasChildren === true)) {
        //if (window.confirm("Do you want to select all items under this category?")) {
        // items = AddChildren(obj.children, items);
        // handleConfirmation(obj.children, items)
        setDialogObj({
          status: true,
          onConfirm: () => handleConfirmation(obj.children, items, leftData),
          type: "confirm",
          title: "Confirmation",
          msg: "Do You Want To Select All Child?"
        })

        //}

      } else {
        items = AddParent(obj.parentId, items);
      }

      items.push({
        menuId: obj.menuId,
        parMenuId: obj.parMenuId,
        roleId: getRoleId(selectRowRoleLov)
      });
    }
    else {
      const unselectChildren = (children) => {
        children.forEach(child => {
          items = items.filter(el => el.menuId !== child.menuId);

          if (child?.children && child?.children?.length > 0) {
            unselectChildren(child.children);
          }
        });
      };

      // Unselect the current item
      items = items.filter(el => el.menuId !== obj.menuId);

      // Unselect all children and their descendants
      if (obj.children) {
        unselectChildren(obj.children);
      }

      // Unselect the parent item if no more children are selected
      if (!items.some(item => item.menuId === obj.parMenuId)) {
        items = items.filter(el => el.menuId !== obj.parMenuId);
      }
    }

    set_selectedItem(items);
  };


  

  // const handleSelectItem = async (obj) => {
  //   let items = [...selectedItem];





  //   if (obj.state === 1) {
  //     if ((!obj.parentId || obj.hasChildren === true)) {
  //       //if (window.confirm("Do you want to select all items under this category?")) {
  //       // items = AddChildren(obj.children, items);
  //       // handleConfirmation(obj.children, items)
  //       setDialogObj({
  //         status: true,
  //         onConfirm: () => handleConfirmation(obj.children, items, leftData),
  //         type: "confirm",
  //         title: "Confirmation",
  //         msg: "Do You Want To Select All Child?"
  //       })

  //       //}

  //     } else {
  //       items = AddParent(obj.parentId, items);
  //     }

  //     items.push({
  //       menuId: obj.menuId,
  //       parMenuId: obj.parMenuId,
  //       roleId: getRoleId(selectRowRoleLov)
  //     });
  //   }
  //   else {
  //     const unselectChildren = (children) => {
  //       children.forEach(child => {
  //         items = items.filter(el => el.menuId !== child.menuId);

  //         if (child?.children && child?.children?.length > 0) {
  //           unselectChildren(child.children);
  //         }
  //       });
  //     };

  //     // Unselect the current item
  //     items = items.filter(el => el.menuId !== obj.menuId);

  //     // Unselect all children and their descendants
  //     if (obj.children) {
  //       unselectChildren(obj.children);
  //     }

  //     // Unselect the parent item if no more children are selected
  //     if (!items.some(item => item.menuId === obj.parMenuId)) {
  //       items = items.filter(el => el.menuId !== obj.parMenuId);
  //     }
  //   }

  //   set_selectedItem(items);
  // };


  // const unMapArr = (obj) => {
  //   if (!obj.children) return
  //   obj.children.forEach(el => {
  //     items2.push({
  //       menuId: el.menuId,
  //       parMenuId: el.parMenuId,
  //       roleId: getRoleId(selectRowRoleLov)
  //     })
  //     if (el.children) unMapArr(el)
  //   });

  // }

  let items2 = []
  // const handleUnSelectItem = (obj) => {
  //   console.log(obj);
  //   let selectAllChild = true
  //   let currentItem = {
  //     menuId: obj.menuId,
  //     parMenuId: obj.parMenuId,
  //     roleId: getRoleId(selectRowRoleLov)
  //   }
  //   items2 = [...unSelectedItem, currentItem];

  //   if (obj.state === 1) {
  //     if (obj.menuId && obj.hasChildren === true) {
  //       if (!window.confirm("Do you want to selecet all child?")) {
  //         selectAllChild = false
  //       }
  //     }
  //     if (obj?.children && selectAllChild) {
  //       unMapArr(obj)
  //     }
  //   }
  //   else {
  //     items2 = items2.filter((el) => {
  //       // console.log(el.lvlRefCd+"---"+obj.lvlRefCd);
  //       return el.menuId !== obj.menuId
  //     })
  //     if (obj?.children) {
  //       items2 = items2.filter((el) => {
  //         return el.parMenuId !== obj.menuId
  //       })

  //     }
  //   }
  //   set_unSelectedItem([...items2])
  //   console.log(obj, items2);
  //   items2 = []
  // }

  // let handleConfirmation2 = (children, items, data) => {

  //   let itemArr = [...items]
  //   const findParentItem = (data, parentId) => {

  //     for (const item of data) {
  //       if (item.menuId === parentId) {
  //         return item;
  //       }

  //       if (item.children && item.children.length > 0) {
  //         const parentItem = findParentItem(item.children, parentId);
  //         if (parentItem) {
  //           return parentItem;
  //         }
  //       }
  //     }

  //     return null;
  //   };

  //   const AddParent = (parentId) => {
  //     //debugger
  //     const parentItem = findParentItem(data, parentId);
  //     if (parentItem && parentItem.checked === false) {
  //       if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
  //         itemArr.push({
  //           menuId: parentItem.menuId,
  //           roleId: getRoleId(selectRowRoleLov)
  //         });

  //       }

  //       AddParent(parentItem.parentId);
  //     }

  //   };

  //   const AddChildren = (children) => {
  //     children.forEach(child => {
  //       // AddParent(child.parentId, itemArr);

  //       itemArr.push({
  //         menuId: child.menuId,
  //         roleId: getRoleId(selectRowRoleLov)
  //       });

  //       if (child?.children && child?.children?.length > 0) {
  //         AddChildren(child.children, itemArr);
  //       }
  //     })
  //   };
  //   AddChildren(children, itemArr);
  //   set_unSelectedItem(itemArr);
  // }

  let handleConfirmation2 = (children, items, data)=>{
  
    let itemArr = [...items]
    const findParentItem = (data, parentId) => {
  
      for (const item of data) {
        if (item.menuId === parentId) {
          return item;
        }
  
        if (item.children && item.children.length > 0) {
          const parentItem = findParentItem(item.children, parentId);
          if (parentItem) {
            return parentItem;
          }
        }
      }
  
      return null;
    };
  
    const AddParent = (parentId) => {
      //debugger
      const parentItem = findParentItem(data, parentId);
      if (parentItem && parentItem.checked === false) {
        if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
          itemArr.push({
            menuId: parentItem.menuId,
            roleId: getRoleId(selectRowRoleLov)
          });
          
        }
    
        AddParent(parentItem.parentId);
      }
      
    };
  
    const AddChildren = (children) => {
      children.forEach(child => {
        // AddParent(child.parentId, itemArr);
    
        itemArr.push({
          menuId: child.menuId,
          roleId: getRoleId(selectRowRoleLov)
        });
    
        if (child?.children && child?.children?.length > 0) {
          AddChildren(child.children, itemArr);
        }
      })
    };
    AddChildren(children, itemArr);
    set_unSelectedItem(itemArr);
  }

  // const handleUnSelectItem = async (obj) => {
  //   let items = [...unSelectedItem];

  //   if (obj.state === 1) {
  //     // if ((!obj.parentId || obj.hasChildren === true)){
  //     if ((obj.hasChildren === true)) {
  //       //if (window.confirm("Do you want to select all items under this category?")) {
  //       // items = AddChildren(obj.children, items);
  //       // handleConfirmation(obj.children, items)
  //       setDialogObj({
  //         status: true,
  //         onConfirm: () => handleConfirmation2(obj.children, items, rightData),
  //         type: "confirm",
  //         title: "Confirmation",
  //         msg: "Do You Want To Select All Child?"


  //       })

  //       //}

  //     } else {
  //       // items = AddParent(obj.parentId, items);
  //     }

  //     items.push({
  //       menuId: obj.menuId,
  //       parMenuId: obj.parMenuId,
  //       roleId: getRoleId(selectRowRoleLov)
  //     });
  //   }
  //   else {
  //     const unselectChildren = (children) => {
  //       children.forEach(child => {
  //         items = items.filter(el => el.menuId !== child.menuId);

  //         if (child?.children && child?.children?.length > 0) {
  //           unselectChildren(child.children);
  //         }
  //       });
  //     };

  //     // Unselect the current item
  //     items = items.filter(el => el.menuId !== obj.menuId);

  //     // Unselect all children and their descendants
  //     if (obj.children) {
  //       unselectChildren(obj.children);
  //     }

  //     // Unselect the parent item if no more children are selected
  //     if (!items.some(item => item.menuId === obj.parMenuId)) {
  //       items = items.filter(el => el.menuId !== obj.parMenuId);
  //     }
  //   }

  //   set_unSelectedItem(items);
  // };


  const handleUnSelectItem = async (obj) => {
    let items = [...unSelectedItem];
    if (obj.state === 1) {
      // if ((!obj.parentId || obj.hasChildren === true)){
      if (( obj.hasChildren === true)) {
        //if (window.confirm("Do you want to select all items under this category?")) {
          // items = AddChildren(obj.children, items);
          // handleConfirmation(obj.children, items)
          setDialogObj({
            status: true,
            onConfirm: ()=>handleConfirmation2(obj.children, items, rightData),
            type: "confirm",
            title: "Confirmation",
            msg: "Do You Want To Select All Child?"
          })
  
        //}
        
      } else {
        // items = AddParent(obj.parentId, items);
      }
  
      items.push({
        menuId: obj.menuId,
        parMenuId: obj.parMenuId,
        roleId: getRoleId(selectRowRoleLov)
      });
    } 
    else {
      const unselectChildren = (children) => {
        children.forEach(child => {
          items = items.filter(el => el.menuId !== child.menuId);
  
          if (child?.children && child?.children?.length > 0) {
            unselectChildren(child.children);
          }
        });
      };
  
      // Unselect the current item
      items = items.filter(el => el.menuId !== obj.menuId);
  
      // Unselect all children and their descendants
      if (obj.children) {
        unselectChildren(obj.children);
      }
  
      // Unselect the parent item if no more children are selected
      if (!items.some(item => item.menuId === obj.parMenuId)) {
        items = items.filter(el => el.menuId !== obj.parMenuId);
      }
    }
  
    set_unSelectedItem(items);
  };

  const postCheckItem = async (obj) => {
    console.log(obj);
    if (selectedItem.length) {
      qryObj = selectedItem.map(el => {
        return {
          menuId: el.menuId,
          roleId: getRoleId(selectRowRoleLov)
        }
      })
      const updatedMapObj = {
        apiId: "SUA00035",
        map: qryObj, // Updated map object
      };
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/saveMap', updatedMapObj, { headers })
        .then((res) => {
          console.log(res.data)
          if (res.data?.code === 0) set_selectedItem([])
        })
      fetchData()
    } else {
      setDialogObj({
        status: true,
        type: "alert",
        title: "Alert Message",
        msg: "Select Any Item First"
      })
    }

  }


  const postUnCheckItem = async (obj) => {
    console.log(obj);
    if (unSelectedItem.length) {
      let qryObjj = unSelectedItem.map(el => {
        return {
          menuId: el.menuId,
          roleId: getRoleId(selectRowRoleLov)
        }
      })
      const updatedUnMapObj = {
        apiId: "SUA00038",
        unmap: qryObjj, // Updated map object
      };
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/saveUnMap', updatedUnMapObj, { headers })
        .then((res) => {
          if (res.data?.code === 0) set_unSelectedItem([])
        })
      fetchData()
    } else {
      setDialogObj({
        status: true,
        type: "alert",
        title: "Alert Message",
        msg: "Select Any Item First"
      })
    }

  }

  const handleRightShift = () => {
    postCheckItem()
  };


  const handleLeftShift = () => {
    postUnCheckItem()
  };

  const handleCheckbox = (e, item) => {
    let checked = e.target.checked;
    handleSelectItem({ ...item, state: checked ? 1 : 2 })
    // handleUnSelectItem({...item, state: checked? 1 : 2})

  }

  const handleRightCheckbox = (e, item) => {
    let checked = e.target.checked;
    handleUnSelectItem({ ...item, state: checked ? 1 : 2 })

  }



  const fetchData = async () => {
    setleftData([])
    setRightData([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        //Left Hand side

        const modifyData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              menuNm: item.text,
              menuId: item.id,
              parMenuId: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyData(item.children);
            }
            return newItem;
          });
        };

        const modifiedData = modifyData(res.data.content.qryRsltSetAvl);

        setleftData(modifiedData);
        const modifyRightData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              menuNm: item.text,
              menuId: item.id,
              parMenuId: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyRightData(item.children);
            }
            return newItem;
          });
        };

        const modifiedRightData = modifyData(res.data.content.qryRsltSetMap);

        setRightData(modifiedRightData);
      }

      else {
        setleftData([])
        setRightData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
    }).catch(error => {
      console.log(error);
    })
  }





  const onRenderItem = (item, treeview) => {
    // console.log(item, treeview);
    let isSelect = item.checked === true;
    return (
      <div className="treeview-item-example">

        {isSelect ?
          <input type="checkbox" checked={isSelect} disabled={isSelect} />
          :
          selectedItem.some((el) => el.menuId === item.menuId) ?
            <input type="checkbox" checked onClick={(e) => handleCheckbox(e, item)} />
            :
            <input type="checkbox" onClick={(e) => handleCheckbox(e, item)} />

        }
        &nbsp;&nbsp;
        <span className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }


  const [mapInfo, set_mapInfo] = useState(null)
  const onRenderRightItem = (item, treeview) => {
    console.log(item, treeview);
    let isSelect = item.checked === true;
    console.log(isSelect);
    return (
      <div className="treeview-item-example">

        {isSelect ?
          <input type="checkbox" checked={isSelect} disabled={isSelect} />
          :
          unSelectedItem.some((el) => el.menuId === item.menuId) ?
            <input type="checkbox" checked onClick={(e) => handleRightCheckbox(e, item)} />
            :
            <input type="checkbox" onClick={(e) => handleRightCheckbox(e, item)} />

        }
        &nbsp;&nbsp;
        <Edit onClick={(e) => { set_mapInfo(item); console.log(item) }} />
        &nbsp;&nbsp;
        <span className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }

  const handleCheckChange = (e, item) => {
    const { name, checked } = e.target;
    console.log({
      ...mapInfo,
      attributes: {
        ...mapInfo.attributes,
        [name]: !checked ? 'N' : 'Y'
      }
    });
    set_mapInfo({
      ...mapInfo,
      attributes: {
        ...mapInfo.attributes,
        [name]: !checked ? 'N' : 'Y'
      }
    });
  };

  const handleSelectInputChange = (e) => {
    const { name, value } = e.target;
    set_mapInfo({
      ...mapInfo,
      attributes: {
        ...mapInfo.attributes,
        [name]: value
      }
    });
  };

  const postMapInfo = async (e) => {
    e.preventDefault()
    if (!mapInfo) alert("Please select")
    const obj = {
      apiId: "SUA00242",
      updateMap: {
        addFlg: mapInfo?.attributes?.addFlg,
        cancFlg: mapInfo?.attributes?.cancFlg,
        dataRestc: mapInfo?.attributes?.dataRestc,
        delFlg: mapInfo?.attributes?.delFlg,
        listFlg: mapInfo?.attributes?.listFlg,
        menuId: mapInfo?.id,
        modFlg: mapInfo?.attributes?.modFlg,
        roleId: queryInputObj?.criteria?.roleId,
        viewFlg: mapInfo?.attributes?.viewFlg
      }
    }

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00010/updateMapInfo', obj, { headers })
      .then((res) => {
        alert("done")
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {

      })

    console.log(obj);
  }

  const resetForm = () => {
    setSelectRow({})
    setSelectRowModLov({})
    setSelectRowRoleLov({})
    set_selectedItem([]);
    set_unSelectedItem([]);
    setQueryInputObj({

      apiId: "SUA00033",
      criteria: {
        modId: '',
        roleId: ''

      }
    })
    setleftData([])
    setRightData([])
    setMsg("")
    setMsgTyp("")
    setApprove(false)



  };

  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  return (
    <>
      <div >
        <div className="page-header">
          <div>
            <h1 className="page-title">Role Menu Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00010_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        <div className="">
          <Card>
            <Card.Body>
              <form id="myForm" onSubmit={postQuery}>
                {/* Module Group Lov */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control "

                        value={getModGrpId(selectRow) ? getModGrpId(selectRow) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"

                        value={getModGrpNm(selectRow) ? getModGrpNm(selectRow) : ''}
                      />
                      <div className="row-mb-12">
                        {showModelModGrpLov && <Lov
                          moduleLovData={modGrpLovData}
                          setShowModel={setShowModelModGrpLov}
                          showModel={showModelModGrpLov}
                          handleRowClick={handleRowClickModGrpLov}
                          columns={modGrpLovColumns}
                          currentSelection={selectRow}
                          setCurrentSelection={setSelectRow}
                        />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module LOV */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control"

                        value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"

                        value={getModName(selectRowModLov) ? getModName(selectRowModLov) : ''}
                      />
                      <div className="row-mb-12">
                        {showModelModLov && <Lov
                          moduleLovData={modLovData}
                          setShowModel={setShowModelModLov}
                          showModel={showModelModLov}
                          handleRowClick={handleRowClickModLov}
                          columns={modLovColumns}
                          currentSelection={selectRowModLov}
                          setCurrentSelection={setSelectRowModLov}
                        />}
                      </div>
                    </div>
                  </div>
                </div>

                {/*Role LOV */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>Role Id:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelRoleLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control"

                        value={getRoleId(selectRowRoleLov) ? getRoleId(selectRowRoleLov) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"

                        value={getRoleName(selectRowRoleLov) ? getRoleName(selectRowRoleLov) : ''}
                      />
                      <div className="row-mb-12">
                        {showModelRoleLov && <Lov
                          moduleLovData={roleLovData}
                          setShowModel={setShowModelRoleLov}
                          showModel={showModelRoleLov}
                          handleRowClick={handleRowClickRoleLov}
                          columns={roleLovColumns}
                          currentSelection={selectRowRoleLov}
                          setCurrentSelection={setSelectRowRoleLov}
                        />}
                      </div>
                    </div>
                  </div>
                </div>




                <div className="container text-end mb-4">
                  <button class="btn btn-primary" type="subhmit" >
                    Query
                  </button>

                  <button
                    className="btn btn-secondary mx-2"
                    type="reset"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>

              </form>
              {approve && <div className="container py-2">

                <Form.Group className="from-group ">
                  <Row>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, overflow: 'scroll' }}>
                      <Card style={{ height: "400px", overflow: "scroll" }} className="border border-primary">

                        <Box sx={{
                          width: '100%', // Set the width to 100% to make it responsive
                          maxWidth: '500px', // Set a maximum width for larger screens
                          minHeight: '300px', // Set a minimum height for the Box
                          minWidth: '800px', // Let the height be auto to adjust based on content
                          margin: 0, // Remove margin
                          padding: 0, // Remove padding
                          display: 'flex', // Use flex display to center content vertically
                          flexDirection: 'column', // Align items vertically
                          // justifyContent: 'center', // Center content vertically
                          // alignItems: 'center', // Center content horizontally
                          '@media (max-width: 600px)': {
                            minWidth: '100%', // Adjust the minWidth for mobile devices
                            maxWidth: '100%', // Adjust the maxWidth for mobile devices
                          },
                        }}>
                          <TreeView
                            style={{ height: "auto" }}
                            showIcon={false}
                            items={leftData}
                            // onCheckItem={handleSelectItem}
                            // Checkbox={item.mpFlag}
                            onRenderItem={onRenderItem}
                          />
                        </Box>

                      </Card>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Right Shift Button */}
                        <Button className='btn-info' variant='contained' color='primary' type='button' onClick={handleRightShift}>
                          &gt;
                        </Button>
                        {/* Left Shift Button */}
                        <br></br>
                        <Button className='btn-info' variant='contained' color='primary' type='button' onClick={handleLeftShift}>
                          &lt;
                        </Button>

                      </Box>
                      {/* Right Box */}

                      <Card style={{ height: "400px", overflow: "scroll" }} className="border border-primary">
                        <Box sx={{
                          width: '100%', // Set the width to 100% to make it responsive
                          maxWidth: '400px', // Set a maximum width for larger screens
                          minHeight: '300px', // Set a minimum height for the Box
                          minWidth: '400px', // Let the height be auto to adjust based on content
                          margin: 0, // Remove margin
                          padding: 0, // Remove padding
                          display: 'flex', // Use flex display to center content vertically
                          flexDirection: 'column', // Align items vertically
                          // justifyContent: 'center', // Center content vertically
                          // alignItems: 'center', // Center content horizontally
                          '@media (max-width: 600px)': {
                            minWidth: '100%', // Adjust the minWidth for mobile devices
                            maxWidth: '100%', // Adjust the maxWidth for mobile devices
                          },
                        }}>
                          <TreeView
                            style={{ height: "auto" }}
                            showIcon={false}
                            items={rightData}
                            onCheckItem={handleUnSelectItem}
                            // Checkbox={item.mpFlag}
                            onRenderItem={onRenderRightItem}
                          />
                        </Box>
                      </Card>
                    </Box>
                  </Row>
                  {mapInfo && <div className="">
                    <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                      <Grid md={6} mdOffset={6}>
                        <Box className="border border-primary" >
                          <h5 className="fw-bold text-primary text-uppercase ">{mapInfo?.text}</h5>
                          <hr className="hr hr-blurry"></hr>
                          <div>
                            <div className=" row mb-2 d-flex justify-content-md-right">

                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.listFlg === "Y" ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="listFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    /> :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="listFlg"
                                      onClick={handleCheckChange}
                                    />}
                                  <span className="custom-control-label">List</span>
                                </label>
                              </div>
                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.addFlg === 'Y' ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="addFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    />
                                    :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="addFlg"
                                      onClick={handleCheckChange}

                                    />
                                  }
                                  <span className="custom-control-label">Add</span>
                                </label>
                              </div>
                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.modFlg === 'Y' ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="modFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    /> :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="modFlg"
                                      onClick={handleCheckChange}
                                    />
                                  }
                                  <span className="custom-control-label">Modify</span>
                                </label>
                              </div>
                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.delFlg === 'Y' ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="delFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    /> :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="delFlg"
                                      onClick={handleCheckChange}
                                    />}
                                  <span className="custom-control-label">Delete</span>
                                </label>
                              </div>

                            </div>
                            <div className="row mb-2 d-flex justify-content-md-right ">

                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.viewFlg === 'Y' ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="viewFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    /> :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="viewFlg"
                                      onClick={handleCheckChange}
                                    />}
                                  <span className="custom-control-label">View</span>
                                </label>
                              </div>
                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                                <label className=" form-label custom-control custom-radio">
                                  {mapInfo?.attributes?.cancFlg === 'Y' ?
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="cancFlg"
                                      checked={true}
                                      onClick={handleCheckChange}
                                    /> :
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="cancFlg"
                                      onClick={handleCheckChange}
                                    />}
                                  <span className="custom-control-label">Cancel</span>
                                </label>
                              </div>

                            </div>


                            <div className=" row mb-4 d-flex justify-content-md-center">
                              <label className="col-md-3 d-flex justify-content-md-center p-0 form-label">
                                Restrict:
                              </label>
                              <div className="col-md-9 ">
                                <select
                                  className="form-control "
                                  name="dataRestc"
                                  value={mapInfo?.attributes?.dataRestc}
                                  onChange={handleSelectInputChange}
                                >
                                  <option disabled >--select--</option>
                                  {
                                    mapInfo?.attributes?.ddDataRestc?.map((item, index) => (
                                      <option value={item.value}>{item.label}</option>
                                    ))
                                  }

                                </select>
                              </div>
                            </div>
                            <div className="container text-center">
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={postMapInfo}
                              >Submit</button>
                            </div>
                          </div>
                        </Box>
                      </Grid>
                    </Grid>


                  </div>}
                </Form.Group>
              </div>}
            </Card.Body>

          </Card>

        </div>
        <ConfirmDialog
  title={dialogObj.title}
  open={dialogObj.status} 
  setOpen={(status)=> {setDialogObj({...dialogObj, status: status})}} 
  onConfirm={dialogObj.onConfirm} 
  // setConfirmStatus={setConfirmStatus}
  // confirmStatus={confirmStatus}
  dialogObj={dialogObj}
  setDialogObj={setDialogObj}
  type={dialogObj.type}
>
  {(dialogObj.type==="alert"?<div className="text-center pb-4 fs-5">Select any Item First</div> : <div className=" pb-4 text-center fs-5">{dialogObj.msg}</div>)}
</ConfirmDialog>
      </div>

    </>
  );
};

export default RoleMenuMapping;
