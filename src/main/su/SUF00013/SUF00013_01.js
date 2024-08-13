import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, Row, Card, Col, Form } from "react-bootstrap";
import TreeView from "deni-react-treeview";
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Tree } from "antd";
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import axios from "axios";
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
const headers = { Authorization: "Bearer " + getApiToken() };
const MenuRoleMapping = () => {
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [menuObj, setMenuObj] = useState({});
  const [modLovObj, setModLovObj] = useState({
    modGrpId: "",
  });
  // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: "SUA00032"

      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/openForm", obj, {
          headers,
        })
        .then((res) => {
          console.log(res.data);
          setOpenData(res.data);
          console.log(openData);
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
            res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        });
    };
    fetchOpenData();
  }, []);
  //open Form end

  //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  useEffect(() => {
    /*  const modGrpLovObj = {
         apiId : "SUA00013",
         criteria: {
                
             }
       
     } */
    const fetchModuleGrpLovData = async () => {
      let obj = {
        apiId: 'SUA00145'
      }
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/getAllModGrp", obj,

          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleGrpLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getModuleGrpName = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm;
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId;
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setValue({  id: '',
    text: "",});
    setSelectRowModuleLov({})
    setLeftItems([])
    setRightItems([])
    setMsg("")
    setMsgTyp("")
  setApproval(false)
    /* setQueryInputObj({ 
         criteria: {
             ...queryInputObj.criteria,
             modGrpId: getModuleGrpId(rowData),
             
         }
     })  */
  };
  //Module Group Lov ends

  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const modLovObj = {
      apiId: "SUA00146",
      criteria: {
        modGrpId: getModuleGrpId(selectRow),
      }
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/SUF00013/getModMstByModGrp",
          modLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    selectRow && fetchModuleLovData();
  }, [selectRow]);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm;
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId;
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    setMenuObj({
      apiId: "SUA00147",
      criteria: {

        modId: getModuleId(rowData),
      }
    });
    setValue({  id: '',
    text: "",});
    setLeftItems([])
    setRightItems([])
    setMsg("")
    setMsgTyp("")
    setApproval(false)
  };

  //module Lov Ends

  // TreeLov Api................
  const [data, setData] = useState([]);

  //   const modLovObj = {
  //     apiId : "SUA00013",
  //     criteria: {

  //         }

  // }
  const fetchTreeLovData = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX +
        "/SUF00013/getAllMenuByModMst",
        menuObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.content?.qryRsltSet?.length) {
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
  
          const modifiedData = modifyData(res.data.content.qryRsltSet);
  
          setData(modifiedData);
        }
        setOpenModal(true);
      });
  };

  console.log(data);
  // const idMapping = data.reduce((acc, el, i) => {
  //   acc[el.lvlRefCd] = i;
  //   return acc;
  // }, []);

  // let treeview1 = [];

  // data.forEach((el) => {
  //   // Handle the root element
  //   if (el.parLvlRefCd === null) {
  //     treeview1.push(el);
  //     return;
  //   }
  //   // Use our mapping to locate the parent element in our data array
  //   const parentEl = data[idMapping[el.parLvlRefCd]];
  //   // Add our current el to its parent's `children` array
  //   parentEl.children = [...(parentEl.children || []), el];
  // });

  const [qryObj, setQryObj] = useState({
    apiId: "SUA00034",
    criteria: {
      menuId: '',
    }
  });
  const [value, setValue] = useState({
    id: '',
    text: "",
  });
  const [title, setTitle] = useState({});
  
  const onRenderItem = (item, treeview) => {
    console.log(item);
    return (
      <div className="treeview-item-example">
      <span onClick={(e)=>handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }
 
  const handleItemClick = (item) => {
    const menuId = item.id;
    // console.log(lvlRefCd)
    setValue({
      ...item,
      id: item.id,
      text: item.text,
    }); // Assuming `item.text` is the title you want to set
    setOpenModal(false);

    // setQryObj({
    //   apiId: "SUA00034",
    //   criteria: {
    //     menuId: menuId,
    //   }
    // });
    setLeftItems([])
    setRightItems([])
    setMsg("")
    setMsgTyp("")
    setApproval(false)
  };
  console.log(qryObj);

  // TreeLov API Ends.......................
  useEffect(() => {
    setQryObj({
      apiId: "SUA00034",
      criteria: {
        menuId: value?.id,
      }
    });
  }, [value])


  // Query API------------

  const postQuery = async (e) => {
    e.preventDefault();

    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/getListPageData",
        qryObj,
        { headers }
      )
      .then((res) => {
        if (res.data?.content?.qryRsltSetAvl?.length) {
          setApproval(true)
          const newLeftItems = res.data.content.qryRsltSetAvl.map((item) => ({
            ...item,
            // checked: item.mapFlag === "Y",
          }));
          setLeftItems(newLeftItems);
          setRightItems(res.data?.content?.qryRsltSetMap);
        }
        // if (res.data?.content?.qryRsltSetMap?.length){

        // }
        else {
          setLeftItems([]);
        }

        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [approval, setApproval] = useState(false);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  // Mapping API................
  const [responseData, setResponseData] = useState();
  const saveMap = async (selectedItems) => {
    // Ensure that at least one role is selected
    if (selectedItems.length === 0) {
      // Handle the case where no roles are selected
      return;
    }

    try {
      // Create the request body with userId and selected roleIds
      const requestBody = selectedItems.map((item) => ({
        // Get the userId from getUserId function
        menuId: qryObj.criteria.menuId,
        roleId: item.roleId, // Pass the roleId for the current selected role
      }));

      console.log(requestBody);
      let mapObj = {
        apiId: "SUA00037",
        map: requestBody
      }
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/saveMap",
        mapObj,
        { headers }
      );

      // Handle the response as needed
      fetchData();
      setRightItems([]);
      setResponseData(response.data);

      setMsg(
        response.data?.appMsgList?.list[0]?.errDesc +
        " (" +
        response.data?.appMsgList?.list[0]?.errCd +
        ")"
      );
      setMsgTyp(response.data?.appMsgList?.list[0]?.errType);
      set_errExp({status:response.data?.appMsgList?.errorStatus})

      if (response.data?.appMsgList?.list[0]?.errCd === "CMAI000011") {
        // resetForm();
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error while making the request:", error);
      // You may want to set an error message or handle the error in some way
    }
  };
  // Mapping API ends............

  // Fetching data After Mapping and UnMappuing start.............
  const fetchData = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/getListPageData",
        qryObj,
        { headers }
      )
      .then((res) => {
        if (res.data?.content?.qryRsltSetAvl?.length) {
          const newLeftItems = res.data.content.qryRsltSetAvl.map((item) => ({
            ...item,
          }));
          setLeftItems(newLeftItems);
          setRightItems(res.data?.content?.qryRsltSetMap);
        }
        // if (res.data?.content?.qryRsltSetMap?.length){

        // }
        else {
          setLeftItems([]);
        }

        setMsg(
          res?.data?.appMsgList?.list[0]?.errDesc +
          " (" +
          res?.data?.appMsgList?.list[0]?.errCd +
          ")"
        );
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetching Data After Mapping And UnMapping Ends.............

  // UnMapping API ...................
  const saveUnMap = async (selectedItems) => {
    // Ensure that at least one role is selected
    if (selectedItems.length === 0) {
      // Handle the case where no roles are selected
      return;
    }

    try {
      // Create the request body with userId and selected roleIds
      const requestBody = selectedItems.map((item) => ({
        roleId: item.roleId, // Get the userId from getUserId function
        menuId: qryObj.criteria.menuId, // Pass the roleId for the current selected role
      }));

      console.log(requestBody);
      let unMapObj = {
        apiId: "SUA00041",
        unmap: requestBody
      }
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00013/saveUnMap",
        unMapObj,
        { headers }
      );

      // Handle the response as needed
      fetchData();
      setLeftItems([]);
      const responseData = response.data;
      setMsg(
        response.data?.appMsgList?.list[0]?.errDesc +
        " (" +
        response.data?.appMsgList?.list[0]?.errCd +
        ")"
      );
      setMsgTyp(response.data?.appMsgList?.list[0]?.errType);
      set_errExp({status:response.data?.appMsgList?.errorStatus})

      if (response.data?.appMsgList?.list[0]?.errCd === "CMAI000011") {
        // resetForm();
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error while making the request:", error);
      // You may want to set an error message or handle the error in some way
    }
  };

  const handleTransfer = (direction) => {
    if (direction === "right") {
      
      const selectedItems = leftItems.filter((item) => item.selected);
      if(selectedItems.length){
      setLeftItems(leftItems.filter((item) => !item.selected));
      setRightItems([
        ...rightItems,
        ...selectedItems.map((item) => ({ ...item, selected: false })),
      ]);
      saveMap(selectedItems);
    }else{
      alert("please select any item first!")
    }} else if (direction === "left") {
      const selectedItems = rightItems.filter((item) => item.selected);
      if(selectedItems.length){
      setRightItems(rightItems.filter((item) => !item.selected));
      setLeftItems([
        ...leftItems,
        ...selectedItems.map((item) => ({ ...item, selected: false })),
      ]);
      saveUnMap(selectedItems);
    }else{
      alert("please select any item first!")
    }
    }
  };

  const handleSelectItem = (item, direction) => {
    const updatedItems =
      direction === "left"
        ? leftItems.map((i) =>
          i.roleId === item.roleId ? { ...i, selected: !i.selected } : i
        )
        : rightItems.map((i) =>
          i.roleId === item.roleId ? { ...i, selected: !i.selected } : i
        );

    direction === "left"
      ? setLeftItems(updatedItems)
      : setRightItems(updatedItems);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleReset = () => {
    setValue("");
    setSelectRow({})
    setSelectRowModuleLov({})
    setQryObj({
      apiId: "SUA00034",
      criteria: {
        menuId: '',
      }
    })
    setLeftItems([]);
    setRightItems([]);
    setApproval(false)
    setMsg("")
    setMsgTyp("")

  };

  const handleOpenModal = () => {
    fetchTreeLovData();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClear = ()=>{
    setValue({
      ...value,
      id: "",
      text: "",
  
    })
    // updateEdtVal({
    //   ...edtVal,
    //   parMenuId:"",
    //   parMenuNm:""
    // })
    handleCloseModal()
  }
 


  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Menu Role Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    Mapping Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00013_01
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

                <div className="row my-2">
                  <label
                    for="exampleFormControlSelect1"
                    className="col-sm-3 col-form-label"
                  >
                    <b>
                      Module Group:<span className="text-red">*</span>
                    </b>
                  </label>
                  <div className="col-md-6">
                    <div class="input-group">
                      {/*                                         <span class="input-group-text border-primary" id=""><i className="fa fa-search d-inline" title="" onClick={() => openModal()} /></span>
                                    <input type="text" class="form-control col-md-2 rounded-3" value={selectRow?.modGrpCode || ''} placeholder="Module Group Code" readOnly />
                                    <input type="text" class="form-control col-md-6 rounded-3 mx-2" value={selectRow?.modGrpName || ''} placeholder="Module Group Name" readOnly /> */}
                      <span className="input-group-text bg-primary">
                        <i
                          className="fa fa-search d-inline text-white"
                          onClick={() => setShowModel(true)}
                        />
                      </span>

                      <input
                        type="text"
                        autoComplete={false}
                        required
                        className="form-control"
                        value={
                          getModuleGrpId(selectRow)
                            ? getModuleGrpId(selectRow)
                            : ""
                        }
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        required
                        className="form-control mx-4"
                        value={
                          getModuleGrpName(selectRow)
                            ? getModuleGrpName(selectRow)
                            : ""
                        }
                      />

                      <div className="row-mb-12">
                        {showModel && (
                          <Lov
                            moduleLovData={moduleGrpLovData}
                            setShowModel={setShowModel}
                            showModel={showModel}
                            handleRowClick={handleRowClick}
                            columns={moduleGrpLovColumns}
                            currentSelection={selectRow}
                            setCurrentSelection={setSelectRow}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <label
                    for="exampleFormControlSelect1"
                    className="col-sm-3 col-form-label"
                  >
                    <b>
                      Module:<span className="text-red">*</span>
                    </b>
                  </label>
                  <div className="col-md-6">
                    <div class="input-group">
                      {/*                                         <span class="input-group-text border-primary" id=""><i className="fa fa-search d-inline" title="" onClick={() => openModal2()} /></span>
                                    <input type="text" class="form-control col-md-2 rounded-3" name="modCode" value={selectRow2?.modCode || ''} placeholder="Module Code" readOnly />
                                    <input type="text" class="form-control col-md-6 rounded-3 mx-2" name="modName" value={selectRow2?.modName || ''} placeholder="Module Name" readOnly /> */}
                      <span className="input-group-text bg-primary">
                        <i
                          className="fa fa-search d-inline text-white"
                          onClick={() => setShowModelModuleLov(true)}
                        />
                      </span>

                      <input
                        type="text"
                        autoComplete={false}
                        required
                        className="form-control"
                        value={
                          getModuleId(selectRowModuleLov)
                            ? getModuleId(selectRowModuleLov)
                            : ""
                        }
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        required
                        className="form-control mx-4"
                        value={
                          getModuleName(selectRowModuleLov)
                            ? getModuleName(selectRowModuleLov)
                            : ""
                        }
                      />
                      <div className="row-mb-12">
                        {showModelModuleLov && (
                          <Lov
                            moduleLovData={moduleLovData}
                            setShowModel={setShowModelModuleLov}
                            showModel={showModelModuleLov}
                            handleRowClick={handleRowClickModuleLov}
                            columns={moduleLovColumns}
                            currentSelection={selectRowModuleLov}
                            setCurrentSelection={setSelectRowModuleLov}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <label
                    for="exampleFormControlSelect1"
                    className="col-md-3 col-form-label"
                  >
                    <b>
                      Menu Id:<span className="text-red">*</span>
                    </b>
                  </label>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-primary" id="">
                        <i
                          className="fa fa-search d-inline text-white"
                          title=""
                          onClick={() => {
                            handleOpenModal();
                          }}
                        />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={value?value.id:''}
                        required
                      />
                      <input
                        type="text"
                        className="form-control mx-4"
                        value={value?value.text:""}
                        required
                      />
                    </div>
                  </div>
                  <div className="row-mb-12">
                    {/* Modal */}
                    {openModal && (
                      <Modal scrollable show={openModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                          <Modal.Title><b>Select a Menu</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                          <TreeView
                            id="treeview1"
                            style={{ height: "auto" }}
                            showIcon={false}
                            className="branch"
                            items={data}
                            onSelectItem={handleItemClick}
                            onRenderItem={onRenderItem}
                          // items={renderTreeItems(treeview1)}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                          <button className="btn btn-primary" onClick={handleClear}>Clear</button>
                        </Modal.Footer>
                      </Modal>
                    )}
                    {/* Input fields */}
                  </div>
                </div>

               
                  <div className="container text-end mb-4">
                    <button class="btn btn-primary" type="submit">
                      Query
                    </button>

                    <button
                      className="btn btn-secondary mx-2"
                      type="reset"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
             
              </form>

             {approval&& <div className="container mb-4">
                <Form.Group className="from-group ">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Card
                      style={{ height: "400px", overflow: "scroll" }}
                      className="border border-primary"
                    >
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
                          
                          {  leftItems.map((item) => (
                              <ListItem key={item.roleId} disablePadding>
                                <Checkbox
                                  checked={item.selected}
                                  onChange={() => handleSelectItem(item, "left")}
                                  color="primary"
                                  defaultChecked={item.mapFlag === "Y"}
                                  disabled={item.mapFlag === "Y"}
                                />
                                <ListItemText primary={item.roleNm} />
                              </ListItem>
                            ))}
                        </Box>
                      </List>
                    </Card>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        className="btn btn-info"
                        variant="contained"
                        color="primary"
                        onClick={() => handleTransfer("right")}
                      >
                        &gt;
                      </Button>
                      <br></br>
                      <Button
                        className="btn btn-info"
                        variant="contained"
                        color="primary"
                        onClick={() => handleTransfer("left")}
                      >
                        &lt;
                      </Button>
                    </Box>
                    <Card
                      style={{ height: "400px", overflow: "scroll" }}
                      className="border border-primary"
                    >
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
                          {
                            rightItems.map((item) => (
                              <ListItem key={item.roleId} disablePadding>
                                <Checkbox
                                  checked={item.selected}
                                  onChange={() => handleSelectItem(item, "right")}
                                  color="primary"
                                />
                                <ListItemText primary={item.roleNm} />
                              </ListItem>
                            ))}
                        </Box>
                      </List>
                    </Card>
                  </Box>
                </Form.Group>
              </div>}
            </Card.Body>
          </Card>


        </div>
      </div>
    </>
  );
};

export default MenuRoleMapping;
//example of creating a mui dialog modal for creating new rows
