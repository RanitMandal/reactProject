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
import { newsLovColumns } from "./columns";
import TreeView from 'deni-react-treeview';
import { logs } from "nvd3";

import MsgAlert from "../../common/MsgAlert";
import FavLink from "../../common/FavLink";
const headers = { Authorization: 'Bearer ' + getApiToken() };
let qryObj = []
const NewsLocMapping = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [selectedItem, set_selectedItem] = useState([])
  const [unSelectedItem, set_unSelectedItem] = useState([])

  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })

  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00532",
    criteria: {
      newsNo: ""
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
        apiId: 'SUA00531'
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/openForm', obj, { headers }).then((res) => {
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


  //News Lov Starts     

  const [newsLovData, setNewsLovData] = useState([]);
  useEffect(() => {

    const fetchNewsLovData = async () => {
      let obj = {
        apiId: "SUA00535"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00132/getAllNewsInfo", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setNewsLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchNewsLovData();
  }, []);


  const getNewsNm = (obj) => {
    return newsLovData[Number(Object.keys(obj)[0])]?.newsText
  }

  const getNewsId = (obj) => {
    return newsLovData[Number(Object.keys(obj)[0])]?.newsNo
  }


  const [selectRow, setSelectRow] = useState({});
  const [showModelNewsLov, setShowModelNewsLov] = useState(false);
  const handleRowClickNewsLov = (rowData) => {
    setSelectRow(rowData);
    setQueryInputObj({
      apiId: "SUA00532",
      criteria: {
        newsNo: getNewsId(rowData),
      }
    })
    setleftData([])
    setRightData([])
    setApprove(false)
    setMsg("")
    setMsgTyp("")

  };
  //News Lov ends




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
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        //Left Hand side
        setApprove(true)
        const modifyData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              lvlRefNm: item.text,
              lvlRefCd: item.id,
              parlvlRefCd: item.parentId,
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
              lvlRefNm: item.text,
              lvlRefCd: item.id,
              parlvlRefCd: item.parentId,
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
  const addChild = (obj) => {

    if (!obj.children) return
    obj.children.forEach((el) => {
      // Select the child items


      items.push({
        lvlRefCd: el.lvlRefCd,
        parlvlRefCd: el.parlvlRefCd,
        // roleId: getRoleId(selectRowRoleLov)
      });
      if (el.children) addChild(el)

    });
  }
  // Tree Population and Manipulation Ends................
  const handleSelectItem = (obj) => {
    let items = [...selectedItem];

    const AddParent = (parentId) => {
      const parentItem = findParentItem(leftData, parentId);

      if (parentItem && parentItem.checked === false) {
        if (!items.some(item => item.lvlRefCd === parentItem.lvlRefCd)) {
          items.push({
            lvlRefCd: parentItem.lvlRefCd,
            // roleId: getRoleId(selectRowRoleLov)
          });
        }

        AddParent(parentItem.parentId);
      }
    };

    const AddChildren = (children) => {
      children.forEach(child => {
        AddParent(child.parentId);

        items.push({
          lvlRefCd: child.lvlRefCd,
          //   roleId: getRoleId(selectRowRoleLov)
        });

        if (child.children && child.children.length > 0) {
          AddChildren(child.children);
        }
      });
    };

    if (obj.state === 1) {
      if (!obj.parentId) {
        if (window.confirm("Do you want to select all child?")) {
          AddChildren(obj.children);
        }
      } else {
        AddParent(obj.parentId);
      }

      items.push({
        lvlRefCd: obj.lvlRefCd,
        parlvlRefCd: obj.parlvlRefCd,
        // roleId: getRoleId(selectRowRoleLov)
      });
    } else {
      const unselectChildren = (children) => {
        children.forEach(child => {
          items = items.filter(el => el.lvlRefCd !== child.lvlRefCd);

          if (child.children && child?.children?.length > 0) {
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
      if (!items.some(item => item.lvlRefCd === obj.parlvlRefCd)) {
        items = items.filter(el => el.lvlRefCd !== obj.parlvlRefCd);
      }
    }

    console.log(items);
    set_selectedItem(items);
    console.log(7777777, obj, items);
  };


  const unMapArr = (obj) => {
    if (!obj.children) return
    obj.children.forEach(el => {
      items2.push({
        lvlRefCd: el.lvlRefCd,
        parlvlRefCd: el.parlvlRefCd,
        // roleId: getRoleId(selectRowRoleLov)
      })
      if (el.children) unMapArr(el)
    });

  }

  let items2 = []
  const handleUnSelectItem = (obj) => {
    console.log(obj);
    let selectAllChild = true
    let currentItem = {
      lvlRefCd: obj.lvlRefCd,
      parlvlRefCd: obj.parlvlRefCd,
      //   roleId: getRoleId(selectRowRoleLov)
    }
    items2 = [...unSelectedItem, currentItem];

    if (obj.state === 1) {
      if (obj.lvlRefCd && obj.hasChildren === true) {
        if (!window.confirm("Do you want to selecet all child?")) {
          selectAllChild = false
        }
      }
      if (obj?.children && selectAllChild) {
        unMapArr(obj)
      }
    }
    else {
      items2 = items2.filter((el) => {
        // console.log(el.lvlRefCd+"---"+obj.lvlRefCd);
        return el.lvlRefCd !== obj.lvlRefCd
      })
      if (obj?.children) {
        items2 = items2.filter((el) => {
          return el.parlvlRefCd !== obj.lvlRefCd
        })

      }
    }
    set_unSelectedItem([...items2])
    console.log(obj, items2);
    items2 = []
  }

  const postCheckItem = async (obj) => {
    console.log(obj);
    if (selectedItem.length) {
      qryObj = selectedItem.map(el => {
        return {
          lvlRefCd: el.lvlRefCd,
          newsNo: getNewsId(selectRow)

        }
      })
      const updatedMapObj = {
        apiId: "SUA00533",
        map: qryObj, // Updated map object
      };
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/saveMap', updatedMapObj, { headers })
        .then((res) => {
          console.log(res.data)
          if (res.data?.code === 0) set_selectedItem([])
        })
      fetchData()
    } else {
      alert("please select any item first!")
    }

  }


  const postUnCheckItem = async (obj) => {
    console.log(obj);
    if (unSelectedItem.length) {
      let qryObjj = unSelectedItem.map(el => {
        return {
          lvlRefCd: el.lvlRefCd,
          newsNo: getNewsId(selectRow)
        }
      })
      const updatedUnMapObj = {
        apiId: "SUA00534",
        unmap: qryObjj, // Updated map object
      };
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/saveUnMap', updatedUnMapObj, { headers })
        .then((res) => {
          if (res.data?.code === 0) set_unSelectedItem([])
        })
      fetchData()
    } else {
      alert("please select any item first!")
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
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSetAvl?.length) {
        //Left Hand side
        const modifyData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              lvlRefNm: item.text,
              lvlRefCd: item.id,
              parlvlRefCd: item.parentId,
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
              lvlRefNm: item.text,
              lvlRefCd: item.id,
              parlvlRefCd: item.parentId,
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
          unSelectedItem.some((el) => el.lvlRefCd === item.lvlRefCd) ?
            <input type="checkbox" checked onClick={(e) => handleRightCheckbox(e, item)} />
            :
            <input type="checkbox" onClick={(e) => handleRightCheckbox(e, item)} />

        }
        &nbsp;&nbsp;
        {/* <Edit onClick={(e) => { set_mapInfo(item); console.log(item) }} />
        &nbsp;&nbsp; */}
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
        lvlRefCd: mapInfo?.id,
        modFlg: mapInfo?.attributes?.modFlg,
        roleId: queryInputObj?.criteria?.roleId,
        viewFlg: mapInfo?.attributes?.viewFlg
      }
    }

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00132/updateMapInfo', obj, { headers })
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

    setQueryInputObj({

      apiId: "SUA00532",
      criteria: {
        newsNo: "",
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
            <h1 className="page-title">News Location Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00132_01
                  </a>
                  <FavLink />
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        {/* {msg && msgTyp === "AI" && <div className="card">

          <Alert variant="success">
            <span className="alert-inner--icon">
              <i className="fa fa-bell-o me-2" aria-hidden="true"></i></span>&nbsp;
            <strong>{msg}</strong>
          </Alert>

        </div>} */}
        {/* {msg && msgTyp !== "AI" && <div className="card">

          <Alert variant="danger">
            <span className="alert-inner--icon">
              <i className="fe fe-slash"></i></span>&nbsp;
            <strong>{msg}</strong>
          </Alert>

        </div>} */}
        <div className="">
          <Card>
            <Card.Body>
              <form id="myForm" onSubmit={postQuery}>
                {/* News Lov */}
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>News:<span className="text-red">*</span></b></label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelNewsLov(true)} /></span>

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control "

                        value={getNewsId(selectRow) ? getNewsId(selectRow) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-4"

                        value={getNewsNm(selectRow) ? getNewsNm(selectRow) : ''}
                      />
                      <div className="row-mb-12">
                        {showModelNewsLov && <Lov
                          moduleLovData={newsLovData}
                          setShowModel={setShowModelNewsLov}
                          showModel={showModelNewsLov}
                          handleRowClick={handleRowClickNewsLov}
                          columns={newsLovColumns}
                          currentSelection={selectRow}
                          setCurrentSelection={setSelectRow}
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
                            // onCheckItem={handleUnSelectItem}
                            // Checkbox={item.mpFlag}
                            onRenderItem={onRenderRightItem}
                          />
                        </Box>
                      </Card>
                    </Box>
                  </Row>
                  
                </Form.Group>
              </div>}
            </Card.Body>

          </Card>

        </div>

      </div>

    </>
  );
};

export default NewsLocMapping;
