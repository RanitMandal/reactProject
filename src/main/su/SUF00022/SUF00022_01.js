import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, ModalTitle, Card, Row, Form } from "react-bootstrap";
import * as formelement from "../../../data/Form/formelement/formelement";
import { Delete, Edit, Fullscreen, Visibility } from "@mui/icons-material";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField, List,
} from "@mui/material";
import { CustomTree } from "../../../components/Test";
import { Checkbox } from 'antd';
import Grid from '@mui/system/Unstable_Grid';
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import { modGrpLovColumns, modLovColumns, userLovColumns } from "./columns";
import TreeView from 'deni-react-treeview';
import { logs } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import FavLink from "../../common/FavLink";
const headers = { Authorization: 'Bearer ' + getApiToken() };
let qryObj = []
const UserMenuMapping = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [selectedItem, set_selectedItem] = useState([])
  const [unSelectedItem, set_unSelectedItem] = useState([])

  const [queryInputObj, setQueryInputObj] = useState({

    apiId: "SUA00062",
    criteria: {
      modId: '',
      userId: ''

    }
  })
  const [modLovObj, setModLovObj] = useState({
    modGrpId: ''
  })
  // Open Form

  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: "SUA00061"
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);

      })
    }
    fetchOpenData()
  }, [])


  //ModuleGroup Lov Starts     

  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {

    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: "SUA00155"
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

  };
  //ModuleGroup Lov ends

  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj = {
      apiId: "SUA00156",
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
      apiId: "SUA00062",
      criteria: {
        modId: getModId(rowData),
        userId: getUserId(selectRowUserLov)
      }

    }
    setQueryInputObj(obj)
  };

  //Mod Lov Ends

  //Role Lov Starts

  const [userLovData, setUserLovData] = useState([]);
  useEffect(() => {

    console.log()
    const fetchUserLovData = async () => {
      let obj = {
        apiId: "SUA00157"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00022/getAllUsers", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    fetchUserLovData();
  }, []);


  const getUserName = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.userNm
  }

  const getUserId = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.userId
  }

  const [selectRowUserLov, setSelectRowUserLov] = useState({});
  const [showModelUserLov, setShowModelUserLov] = useState(false);
  const handleRowClickUserLov = (rowData) => {
    setSelectRowUserLov(rowData);
    let obj = {

      apiId: "SUA00062",
      criteria: {
        modId: getModId(selectRowModLov),
        userId: getUserId(rowData)
      }

    }
    setQueryInputObj(obj)
  };

  //Role Lov Ends



  // Query API

  const [leftData, setleftData] = useState([]);
  const [rightData, setRightData] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [treeview1, set_treeview1] = useState([])
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
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        setApprove(true)
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
      set_errExp({status:res.data?.appMsgList?.errorStatus})
    }).catch(error => {
      console.log(error);
    })

  }

  console.log(rightItems);


  console.log(treeview1);


  // const [dialogObj, setDialogObj] = useState({
  //   status: false,
  //   onConfirm: ()=>{}
  // })
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

  const AddParent = (parentId, itemArr) => {
    const parentItem = findParentItem(leftData, parentId);
  
    if (parentItem && parentItem.checked === false) {
      if (!itemArr.some(item => item.menuId === parentItem.menuId)) {
        itemArr.push({
          menuId: parentItem.menuId,
          userId: getUserId(selectRowUserLov)
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
        userId: getUserId(selectRowUserLov)
      });
  
      if (child?.children && child?.children?.length > 0) {
        itemArr = AddChildren(child.children, itemArr);
      }
    });
  
    return itemArr
  };

  let handleConfirmation = (children, items, data)=>{
  
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
            userId: getUserId(selectRowUserLov)
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
          userId: getUserId(selectRowUserLov)
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
    onConfirm: ()=>{},
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
              onConfirm: ()=>handleConfirmation(obj.children, items, leftData),
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
          userId: getUserId(selectRowUserLov)
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
  







  const addChild = (obj, items) => {
    if (!obj.children) return;

    obj.children.forEach((el) => {
      items.push({
        menuId: el.menuId,
        parMenuId: el.parMenuId,
        userId: getUserId(selectRowUserLov)
      });

      if (el.children) addChild(el, items);
    });
  };



  // const unMapArr = (obj) => {
  //   if (!obj.children) return
  //   obj.children.forEach(el => {
  //     items2.push({
  //       menuId: el.menuId,
  //       parMenuId: el.parMenuId,
  //       userId: getUserId(selectRowUserLov)
  //     })
  //     if (el.children) unMapArr(el)
  //   });

  // }

  let items2 = []
  // const handleUnSelectItem = (obj) => {
  //   let selectAllChild = true
  //   let currentItem = {
  //     menuId: obj.menuId,
  //     parMenuId: obj.parMenuId,
  //     userId: getUserId(selectRowUserLov)
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
            userId: getUserId(selectRowUserLov)
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
          userId: getUserId(selectRowUserLov)
        });
    
        if (child?.children && child?.children?.length > 0) {
          AddChildren(child.children, itemArr);
        }
      })
    };
    AddChildren(children, itemArr);
    set_unSelectedItem(itemArr);
  }
  
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
        userId: getUserId(selectRowUserLov)
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
    if(selectedItem.length){
    qryObj = selectedItem.map(el => {
      return {
        menuId: el.menuId,
        userId: getUserId(selectRowUserLov)
      }
    })
    const updatedMapObj = {
      apiId: "SUA00063",
      map: qryObj, // Updated map object
    };
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/saveMap', updatedMapObj, { headers })
      .then((res) => {
        console.log(res.data)
        if (res.data?.code === 0) set_selectedItem([])
      })
    fetchData()
    }else{
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
    if(unSelectedItem.length){
    let qryObjj = unSelectedItem.map(el => {
      return {
        menuId: el.menuId,
        userId: getUserId(selectRowUserLov)
      }
    })
    const updatedUnMapObj = {
      apiId: "SUA00065",
      unmap: qryObjj, // Updated map object
    };
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/saveUnMap', updatedUnMapObj, { headers })
      .then((res) => {
        if (res.data?.code === 0) set_unSelectedItem([])
      })
    fetchData()
    }
    else{
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


  }

  const handleRightCheckbox = (e, item) => {
    let checked = e.target.checked;
    handleUnSelectItem({ ...item, state: checked ? 1 : 2 })

  }



  const fetchData = async () => {
    setleftData([])
    setRightData([])
    set_selectedItem([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/getListPageData', queryInputObj, { headers }).then((res) => {

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
      set_errExp({status:res.data?.appMsgList?.errorStatus})
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
  console.log({ ...mapInfo,
    attributes: {
      ...mapInfo.attributes,
      [name]: !checked ? 'N' : 'Y'
    }});
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
      apiId: "SUA00243",
      updateMap: {
        addFlg: mapInfo?.attributes?.addFlg,
        cancFlg: mapInfo?.attributes?.cancFlg,
        dataRestc: mapInfo?.attributes?.dataRestc,
        delFlg: mapInfo?.attributes?.delFlg,
        listFlg: mapInfo?.attributes?.listFlg,
        menuId: mapInfo?.id,
        modFlg: mapInfo?.attributes?.modFlg,
        naFlg: mapInfo?.attributes?.naFlg,
        userId: queryInputObj?.criteria?.userId,
        viewFlg: mapInfo?.attributes?.viewFlg
      }
    }

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00022/updateMapInfo', obj, { headers })
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
    setSelectRowUserLov({})
    set_selectedItem([]);
    set_unSelectedItem([]);
    setQueryInputObj({

      apiId: "SUA00062",
      criteria: {
        modId: '',
        userId: ''

      }
    })
    setleftData([])
    setRightData([])
    setApprove(false)
    setMsg('')
    setMsgTyp('')


  };

  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  return (
    <>
      <div >
        <div className="page-header">
          <div>
            <h1 className="page-title">User Menu Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00022_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> } 
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
                        required
                        value={getModGrpId(selectRow) ? getModGrpId(selectRow) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"
                        required
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
                        required
                        value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"
                        required
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

                {/*User LOV */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>User Id:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control"
                        required
                        value={getUserId(selectRowUserLov) ? getUserId(selectRowUserLov) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"
                        required
                        value={getUserName(selectRowUserLov) ? getUserName(selectRowUserLov) : ''}
                      />
                      <div className="row-mb-12">
                        {showModelUserLov && <Lov
                          moduleLovData={userLovData}
                          setShowModel={setShowModelUserLov}
                          showModel={showModelUserLov}
                          handleRowClick={handleRowClickUserLov}
                          columns={userLovColumns}
                          currentSelection={selectRowUserLov}
                          setCurrentSelection={setSelectRowUserLov}
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
                            onCheckItem={handleSelectItem}
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
                          <h5 className="fw-bold text-primary text-uppercase">{mapInfo?.text}</h5>
                          <hr className="hr hr-blurry"></hr>
                          <div>
                            <div className=" row mb-2 ">
                          
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
                              <div className="row mb-2 ">
                              
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
                              <div className="col-md-3 d-flex justify-content-md-center p-0">
                              <label className="form-label custom-control custom-radio">
                                {mapInfo?.attributes?.naFlg === 'Y' ?
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="naFlg"
                                    checked={true}
                                    onClick={handleCheckChange}
                                  /> :
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="naFlg"
                                    onClick={handleCheckChange}
                                  />}
                                <span className="custom-control-label">Na</span>
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

export default UserMenuMapping;
