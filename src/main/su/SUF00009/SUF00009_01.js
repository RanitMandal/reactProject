import React, { useState, useEffect } from "react";
import { Modal, Button, ModalTitle, Card, Form } from "react-bootstrap";
// import { Button,  } from 'antd';
import TreeView from 'deni-react-treeview';
import { Box, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
// import { TreeTransfer } from "./TreeTransfer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getApiToken } from "../../common/common";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { modGrpLovColumns } from "./columns";
import { modLovColumns } from "./columns";
import { set } from "react-hook-form";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ModuleToLocation = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const [selectedItem, set_selectedItem] = useState([])
  const [unSelectedItem, set_unSelectedItem] = useState([])

  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00216",
    criteria: {
      modId: "",
    },
  })
  const [modLovObj, setModLovObj] = useState({
    modGrpId: ''
  })
  // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: "SUA00220"
      }

      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00009/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      })
    }
    fetchOpenData()
  }, [])

  //Module Lov Starts     

  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {
    //   const modLovObj = {
    //     apiId : "SUA00013",
    //     criteria: {

    //         }

    // }
    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: "SUA00214"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00009/getAllModGrp", obj, { headers })
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
    setSelectRowModLov({});
    setData([])
    setRightItems([])
    setMsg("")
    setMsgTyp("")
    setApproval(false)
  };
  //Module Lov ends


  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj = {
      apiId: "SUA00218",
      criteria: {

        modGrpId: getModGrpId(selectRow)


      }
    }
    console.log(modLovObj)
    const fetchModLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00009/getModMstByModGrp", modLovObj, { headers })
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
    setQueryInputObj({
      apiId: "SUA00216",
      criteria: {


        modId: getModId(rowData)

      }
    })
    setData([])
    setRightItems([])
    setMsg("")
    setMsgTyp("")
    setApproval(false)
  };

  //Mod Lov Ends


  const [approval, setApproval] = useState(false);

  // Query API
  const [data, setData] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const postQuery = async (e) => {
    e.preventDefault()
    if (!selectRow) {
      setMsgTyp("VE")
      setMsg("Please Select Module")
      return
    }
    console.log(queryInputObj)
    setData([])
    setRightItems([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00009/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        setApproval(true)
        // const modifiedData = res.data.content.qryRsltSetAvl.map((item) => ({
        //   ...item,
        //   parLvlRefCd: item.parLvlRefCd === "*" ? null : item.parLvlRefCd,
        // }));
        // let list = modifiedData.map(el => {
        //   return {
        //     ...el,
        //     // lvlNm: el.menuNm,
        //     text: el.lvlNm,
        //     id: el.lvlRefCd

        //   }
        // })
        // set_treeview1([])

        const modifyData = (items) => {
          return items?.map((item) => {
            const newItem = {
              ...item,
              lvlNm: item.text,
              lvlRefCd: item.id,
              parLvlRefCd: item.parentId,
            };
            if (item?.children) {
              newItem.children = modifyData(item.children);
            }
            return newItem;
          });
        };

        const modifiedData = modifyData(res.data.content.qryRsltSetAvl);

        setData(modifiedData);
        // setData([...data, lvlNm: res?.data?.content?.qryRsltSetAvl?.text, lvlRefCd:res.data?.content?.qryRsltSetAvl?.text])
        const modifData = res.data.content.qryRsltSetMap.map(el => {
          return {
            ...el,
            // lvlNm: el.menuNm,
            text: el.lvlNm,
            id: el.lvlRefCd

          }
        })
        setRightItems(modifData)
        setApproval(true)
      }

      else {
        setData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc
        + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
    }).catch(error => {
      console.log(error);
    })

  }
  const [treeview1, set_treeview1] = useState([])
  console.log(data);
  // const idMapping = data.reduce((acc, el, i) => {
  //   acc[el.lvlRefCd] = i;
  //   return acc;
  // }, []);



  // useEffect(() => {
  //   data.forEach((el) => {
  //     // Handle the root element
  //     if (el.parLvlRefCd === null) {
  //       set_treeview1([...treeview1, el]);
  //       return;
  //     }
  //     // Use our mapping to locate the parent element in our data array
  //     const parentEl = data[idMapping[el.parLvlRefCd]];
  //     // Add our current el to its parent's `children` array
  //     parentEl.children = [...(parentEl.children || []), el];
  //   });
  // }, [data])





  const [leftData, setleftData] = useState([]);
  const [dialogObj, setDialogObj] = useState({
    status: false,
    onConfirm: () => { },
    msg: ""
  })

  // Tree Population and Manipulation Ends................
  const addChild = (obj) => {

    if (!obj.children) return
    obj.children.forEach((el) => {
      // Select the child items

      // if(document.querySelector("."+el.menuId)) {
      //   console.log("xxxxxxxxxxxxxxxxx");
      //   document.querySelector("."+el.menuId).checked = true}
      // console.log("88888888"+el.menuId);
      items.push({
        lvlRefCd: el.lvlRefCd,
        parLvlRefCd: el.parLvlRefCd,
        modId: getModId(selectRowModLov)
      });
      if (el.children) addChild(el)

    });
  }
  // Tree Population and Manipulation Ends................
  let items = [];
  // const handleSelectItem = (obj) => {
  //   items = [...selectedItem];
  //   let selectAllChild = true;
  //   // const isParent = items.some((item) => item.menuId === obj.menuId);
  //   // console.log("======>",isParent);
  //   if (obj.state === 1) {
  //     if (!obj.parLvlRefCd) {
  //       if (window.confirm("Do you want to selecet all child?")) {
  //       }
  //       else {
  //         selectAllChild = false
  //       }

  //     }

  //     // Select the current item
  //     items.push({
  //       lvlRefCd: obj.lvlRefCd,
  //       parLvlRefCd: obj.parLvlRefCd,
  //       modId: getModId(selectRowModLov)
  //     });
  //     console.log("999999999", obj.children);
  //     if (obj?.children && selectAllChild) {

  //       addChild(obj)
  //     }
  //   } else {
  //     // Unselect the current item
  //     items = items.filter((el) => el.lvlRefCd !== obj.lvlRefCd);

  //     if (obj?.children) {
  //       // Unselect the child items
  //       items = items.filter((el) => !obj.children.find(child => child.lvlRefCd === el.lvlRefCd));
  //     }

  //     // Unselect the parent item if no more children are selected
  //     if (!items.some(item => item.lvlRefCd === obj.parLvlRefCd)) {
  //       items = items.filter((el) => el.lvlRefCd !== obj.parLvlRefCd);
  //     }
  //   }

  //   set_selectedItem([...items]);
  //   console.log(7777777, obj, items);
  //   items = []
  // };

  const unSelectItem = (obj) => {
    let items = unSelectedItem;
    if (obj.state === 1) {
      items = [
        ...items,
        {
          lvlRefCd: obj.lvlRefCd,
          // parLvlRefCd: obj?.children? obj.children[0].parLvlRefCd: null,
          modId: getModId(selectRowModLov)
        }
      ]
    }
    else {
      items = items.filter((el) => {
        // console.log(el.lvlRefCd+"---"+obj.lvlRefCd);
        return el.lvlRefCd !== obj.lvlRefCd
      })

    }
    set_unSelectedItem([...items])
    console.log(obj, items);
  }

  const postCheckItem = async (obj) => {
    console.log(selectedItem);
    if (selectedItem.length) {
      let qryObj = selectedItem.map(el => {
        return {
          lvlRefCd: el.lvlRefCd,
          modId: el.modId
        }
      })
      let mapObj = {
        apiId: "SUA00019",
        map: qryObj
      }
      console.log(">>>>>>>>" + mapObj);
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00009/saveMap', mapObj, { headers })
        .then((res) => {
          if (res.data?.code === 0) set_selectedItem([])
        })
      fetchData()

      // setData([])
      // setRightItems([])
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
      let qryObj = unSelectedItem.map(el => {
        return {
          lvlRefCd: el.lvlRefCd,
          modId: el.modId
        }
      })
      let unMapObj = {
        apiId: "SUA00026",
        unmap: qryObj
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00009/saveUnMap', unMapObj, { headers })
        .then((res) => {
          console.log(res.data)
          if (res.data?.code === 0) set_unSelectedItem([])
        })
      fetchData()
      // setData([])
      // setRightItems([])
    } else {
      setDialogObj({
        status: true,
        type: "alert",
        title: "Alert Message",
        msg: "Select Any Item First"
      })
    }
  }


  const fetchData = async () => {
    setData([])
    setRightItems([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00009/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {

        // const modifiedData = res.data.content.qryRsltSetAvl.map((item) => ({
        //   ...item,
        //   // parLvlRefCd: item.parLvlRefCd === "*" ? null : item.parLvlRefCd,
        // }));
        // let list = modifiedData.map(el => {
        //   return {
        //     ...el,
        //     // lvlNm: el.menuNm,
        //     text: el.lvlNm,
        //     id: el.lvlRefCd

        //   }
        // })
        // set_treeview1([])

        const modifyData = (items) => {
          return items?.map((item) => {
            const newItem = {
              ...item,
              lvlNm: item.text,
              lvlRefCd: item.id,
              parLvlRefCd: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyData(item.children);
            }
            return newItem;
          });
        };

        const modifiedData = modifyData(res.data?.content?.qryRsltSetAvl);
        // setData([])

        setData(modifiedData);
        const modifData = res.data?.content?.qryRsltSetMap?.map(el => {
          return {
            ...el,
            // lvlNm: el.menuNm,
            text: el.lvlNm,
            id: el.lvlRefCd

          }
        })
        // setRightItems([])
        setRightItems(modifData)
      }

      else {

        setData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
    }).catch(error => {
      console.log(error);
    })
  }
  console.log(data);
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


  const onRenderItem = (item, treeview) => {
    // console.log(item, treeview);
    let isSelect = item.checked === true;
    return (
      <div className="treeview-item-example">

        {isSelect ?
          <input type="checkbox" checked={isSelect} disabled={isSelect} />
          :
          selectedItem.some((el) => el.lvlRefCd === item.lvlRefCd) ?
            <input type="checkbox" checked onClick={(e) => handleCheckbox(e, item)} />
            :
            <input type="checkbox" onClick={(e) => handleCheckbox(e, item)} />

        }
        &nbsp;&nbsp;
        <span className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }


  const resetForm = () => {
    setSelectRow("");
    setSelectRowModLov("");
    setQueryInputObj({
      apiId: "string",
      criteria: {
        modId: "",
      },
    });
    setData([])
    set_treeview1([]);
    setRightItems([]);
    setApproval(false)
    setMsg("")
    setMsgTyp("")
  };
  console.log(treeview1);


  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  

  const findParentItem = (items, parentId) => {

    for (const item of items) {
      if (item.lvlRefCd === parentId) {
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
    const parentItem = findParentItem(data, parentId);

    if (parentItem && parentItem.checked === false) {
      if (!itemArr.some(item => item.lvlRefCd === parentItem.lvlRefCd)) {
        // itemArr.push({
        //   lvlRefCd: parentItem.lvlRefCd,
        //   modId: getModId(selectRowModLov)
        // });
      }

      AddParent(parentItem.parentId);
    }

    return itemArr
  };

 
  let handleConfirmation = (children, items, data) => {

    let itemArr = [...items]
    const findParentItem = (data, parentId) => {

      for (const item of data) {
        if (item.lvlRefCd === parentId) {
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
        if (!itemArr.some(item => item.lvlRefCd === parentItem.lvlRefCd)) {
          itemArr.push({
            lvlRefCd: parentItem.lvlRefCd,
            modId: getModId(selectRowModLov)
          });

        }

        AddParent(parentItem.parentId);
      }

    };

    const AddChildren = (children) => {
      children.forEach(child => {
        AddParent(child.parentId, itemArr);

        itemArr.push({
          lvlRefCd: child.lvlRefCd,
          modId: getModId(selectRowModLov)
        });

        if (child?.children && child?.children?.length > 0) {
          AddChildren(child.children, itemArr);
        }
      })
    };
    AddChildren(children, itemArr);
    set_selectedItem(itemArr);
  }

  const handleSelectItem = async (obj) => {
    let items = [...selectedItem];
    if (obj.state === 1) {
      if ((!obj.parentId || obj.hasChildren === true)) {
        //if (window.confirm("Do you want to select all items under this category?")) {
        // items = AddChildren(obj.children, items);
        // handleConfirmation(obj.children, items)
        setDialogObj({
          status: true,
          onConfirm: () => handleConfirmation(obj.children, items, data),
          type: "confirm",
          title: "Confirmation",
          msg: "Do You Want To Select All Child?"
        })

        //}

      } else {
        items = AddParent(obj.parentId, items);
      }

      items.push({
        lvlRefCd: obj.lvlRefCd,
        parLvlRefCd: obj.parLvlRefCd,
        modId: getModId(selectRowModLov)
      });
    }
    else {
      const unselectChildren = (children) => {
        children.forEach(child => {
          items = items.filter(el => el.lvlRefCd !== child.lvlRefCd);

          if (child?.children && child?.children?.length > 0) {
            unselectChildren(child.children);
          }
        });
      };

      // Unselect the current item
      items = items.filter(el => el.lvlRefCd !== obj.lvlRefCd);

      // Unselect all children and their descendants
      if (obj.children) {
        unselectChildren(obj.children);
      }

      // Unselect the parent item if no more children are selected
      if (!items.some(item => item.lvlRefCd === obj.parLvlRefCd)) {
        items = items.filter(el => el.menuId !== obj.parLvlRefCd);
      }
    }

    set_selectedItem(items);
  };

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
        if (!itemArr.some(item => item.lvlRefCd === parentItem.lvlRefCd)) {
          itemArr.push({
            lvlRefCd: parentItem.lvlRefCd,
             modId: getModId(selectRowModLov)
          });
          
        }
    
        AddParent(parentItem.parentId);
      }
      
    };
  
    const AddChildren = (children) => {
      children.forEach(child => {
        // AddParent(child.parentId, itemArr);
    
        itemArr.push({
          lvlRefCd: child.lvlRefCd,
          modId: getModId(selectRowModLov)
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
            onConfirm: ()=>handleConfirmation2(obj.children, items, rightItems),
            type: "confirm",
            title: "Confirmation",
            msg: "Do You Want To Select All Child?"
          })
  
        //}
        
      } else {
        // items = AddParent(obj.parentId, items);
      }
  
      items.push({
        lvlRefCd: obj.lvlRefCd,
        parLvlRefCd: obj.parLvlRefCd,
        modId: getModId(selectRowModLov)
      });
    } 
    else {
      const unselectChildren = (children) => {
        children.forEach(child => {
          items = items.filter(el => el.lvlRefCd !== child.lvlRefCd);
  
          if (child?.children && child?.children?.length > 0) {
            unselectChildren(child.children);
          }
        });
      };
  
      // Unselect the current item
      items = items.filter(el => el.lvlRefCd !== obj.lvlRefCd);
  
      // Unselect all children and their descendants
      if (obj.children) {
        unselectChildren(obj.children);
      }
  
      // Unselect the parent item if no more children are selected
      if (!items.some(item => item.lvlRefCd === obj.parLvlRefCd)) {
        items = items.filter(el => el.lvlRefCd !== obj.parLvlRefCd);
      }
    }
  
    set_unSelectedItem(items);
  };




  return (
    <>

      <div >
        <div className="page-header">
          <div>
            <h1 className="page-title">Module Location Mapping </h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00009_01
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
              <form id="myForm" onSubmit={postQuery} >
                {/* Module Group */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control"

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
                        className="form-control "

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


                <div className="container text-end mb-4">
                  <button class="btn btn-primary " type="submit">
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
              {approval && <div className="container mb-4">
                <Form.Group className="from-group ">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, }}>
                    <Card style={{ height: "400px", overflow: "scroll" }} className="border border-primary">
                      <List>
                        <Box
                          sx={{
                            width: "100%", // Set the width to 100% to make it responsive
                            maxWidth: "400px", // Set a maximum width for larger screens
                            minHeight: "300px", // Set a minimum height for the Box
                            minWidth: "400px", // Let the height be auto to adjust based on content
                            margin: 0, // Remove margin
                            padding: 0, // Remove padding
                            display: "flex", // Use flex display to center content vertically
                            flexDirection: "column", // Align items vertically
                            // justifyContent: "center", // Center content vertically
                            // alignItems: "center", // Center content horizontally
                            "@media (max-width: 600px)": {
                              minWidth: "100%", // Adjust the minWidth for mobile devices
                              maxWidth: "100%", // Adjust the maxWidth for mobile devices
                            },
                          }}
                        >
                          <TreeView
                            style={{ height: "auto" }}
                            // showCheckbox={true}
                            showIcon={false}
                            items={data}
                            onCheckItem={handleSelectItem}
                            // Checkbox={item.mpFlag}
                            onRenderItem={onRenderItem}
                          />
                        </Box>
                      </List>


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
                      <List>
                        <Box
                          sx={{
                            width: "100%", // Set the width to 100% to make it responsive
                            maxWidth: "400px", // Set a maximum width for larger screens
                            minHeight: "300px", // Set a minimum height for the Box
                            minWidth: "400px", // Let the height be auto to adjust based on content
                            margin: 0, // Remove margin
                            padding: 0, // Remove padding
                            display: "flex", // Use flex display to center content vertically
                            flexDirection: "column", // Align items vertically
                            // justifyContent: "center", // Center content vertically
                            //lalignItems: "center", // Center content horizontally
                            "@media (max-width: 600px)": {
                              minWidth: "100%", // Adjust the minWidth for mobile devices
                              maxWidth: "100%", // Adjust the maxWidth for mobile devices
                            },
                          }}
                        >
                          <TreeView
                            style={{ height: "auto" }}
                            showCheckbox={true}
                            showIcon={false}
                            selectRow={true}
                            items={rightItems}
                            onCheckItem={handleUnSelectItem}

                          />
                        </Box>
                      </List>



                    </Card>

                  </Box>

                </Form.Group>
              </div>}

            </Card.Body>
          </Card>
        </div>
        <ConfirmDialog
          title={dialogObj.title}
          open={dialogObj.status}
          setOpen={(status) => { setDialogObj({ ...dialogObj, status: status }) }}
          onConfirm={dialogObj.onConfirm}
          // setConfirmStatus={setConfirmStatus}
          // confirmStatus={confirmStatus}
          dialogObj={dialogObj}
          setDialogObj={setDialogObj}
          type={dialogObj.type}
        >
          {(dialogObj.type === "alert" ? <div className="text-center pb-4 fs-5">Select any Item First</div> : <div className=" pb-4 text-center fs-5">{dialogObj.msg}</div>)}
        </ConfirmDialog>
      </div>



    </>
  );
};
export default ModuleToLocation;