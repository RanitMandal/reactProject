import React, { useState, useEffect, useRef } from "react";
import TreeView from "deni-react-treeview";
import { Col, Row, Card } from "react-bootstrap";
import { Delete, Edit, Fullscreen, Visibility } from "@mui/icons-material";
import {
  Button,
  Dialog,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  IconButton,
  TextField
} from "@mui/material";
import { Alert } from "react-bootstrap";
import MenuCreationForm from "./SUF00007_02";
import CloseIcon from '@mui/icons-material/Close';
import { getApiToken } from "../../common/common";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { modGrpLovColumns } from "./columns";
import { modLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const MenuCreation = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00228",
    criteria:{
    modId: ""
  }})
  const [modLovObj, setModLovObj] = useState({
    modGrpId: ''
  })
  // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj={
        apiId:'SUA00232'
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
          res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
    }
    fetchOpenData()
  }, [])



  //ModuleGroup Lov Starts     

  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {
    //   const modLovObj = {
    //     apiId : "SUA00013",
    //     criteria: {

    //         }

    // }
    const fetchModGrpLovData = async () => {
      let obj={
        apiId:'SUA00139'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getAllModGrp", obj,  { headers })
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
    //   setQueryInputObj({ 

    //         ...queryInputObj,
    //         modId: getModGrpId(rowData),


    // })
  };
  //Module Lov ends


  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj ={
      apiId: "SUA00140",
      criteria: {

      modGrpId: getModGrpId(selectRow)

      }
    }
    console.log(modLovObj)
    const fetchModLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getModMstByModGrp", modLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          if(res.data?.content?.qryRsltSet?.length){
          setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          }
        //   if(res.data?.appMsgList?.errorStatus){
        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        //   }
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
    setData([])
    //   setQueryInputObj({ 


    //         modId: getModId(selectRowModLov)

    // })
  };

  //Mod Lov Ends

  useEffect(() => {
    // This effect will run whenever selectRowModLov changes
    if (selectRowModLov) {
      setQueryInputObj({
        apiId: "SUA00228",
        criteria:{
        modId: getModId(selectRowModLov)
      }});
    }
  }, [selectRowModLov]);

  // Query API
  const [data, setData] = useState([]);
const [approval, setApproval]= useState(false)
  const postQuery = async (e) => {
    e.preventDefault()
    if (!selectRow) {
      setMsgTyp("VE")
      setMsg("Please Select Module")
      return
    }
    console.log(queryInputObj)
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSet?.length) {
        setApproval(true)
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

      else {
        setData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       set_errExp({status:res.data?.appMsgList?.errorStatus})
    }).catch(error => {
      console.log(error);
    })

  }
console.log(data);
  const [treeview1, set_treeview1] = useState([])

  // const idMapping = data.reduce((acc, el, i) => {
  //     acc[el.menuId] = i;
  //     return acc;
  // }, []);
  // // let treeview1 = [];

  // useEffect(() => {
  //   const updatedTree = {};
  
  //   // Initialize the tree with an empty children array for each parent
  //   data.forEach((el) => {
  //     if (el.parMenuId === null) {
  //       updatedTree[el.id] = { ...el, children: [] };
  //     }
  //   });
  
  //   // Populate children for each parent
  //   data.forEach((el) => {
  //     if (el.parMenuId !== null) {
  //       const parentEl = updatedTree[el.parMenuId];
  //       if (parentEl) {
  //         parentEl.children.push(el);
  //       }
  //     }
  //   });
  
  //   // Extract the root elements from the updatedTree
  //   const rootElements = Object.values(updatedTree).filter((el) => el.parMenuId === null);
  
  //   set_treeview1(rootElements);
  // }, [data]);
  


console.log(data);
  console.log(treeview1);



  // Tree Population Ends................
  // const treeviewRef = useRef<TreeView>(null)

  const deleteItemClick = id => {
    // if (treeviewRef.current) treeviewRef.current.api.removeItem(id);
   
  }

  const editItemClick = item => {
    // alert('Edit item: ' + JSON.stringify(item, null, 2))
    console.log(item);
  }

  const onRenderItem = (item, treeview) => {
    return (
      <div className="treeview-item-example">
        
        <span className="actionButton edit" onClick={() => setCreateModalOpen({
                open: true,
                mode: 2,
                rowData:item
              })}><Edit color="success" size="15" /></span>&nbsp;&nbsp;
              <span className="actionButton view" onClick={() => setCreateModalOpen({
                open: true,
                mode: 4,
                rowData:item
              })}>
        <Visibility color="warning" size="15" />
      </span>&nbsp;&nbsp;
        <span className="actionButton trash" onClick={() => setCreateModalOpen({
                open: true,
                mode: 3,
                rowData:item
              })}><Delete color="error" size="15" /></span>
     
               &nbsp;&nbsp;
      <span className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }



  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null
  });
  const [render, setRender] = useState(0);
















  const handleCreateNewRow = (values) => {
    //tableData.push(values);
    // setTableData([...tableData]);

  };

const resetForm=()=>{
  setSelectRow('')
  setSelectRowModLov('')
  setData([])
  setMsg("")
  setMsgTyp("")
  setApproval(false)
}





  const handleDeleteItemClick = (item) => {
    // Perform delete action for the selected item
    console.log("Deleting item:", item);
  };


  const handleTreeDataChange = () => {

  };
  console.log(treeview1, "xxxxxxxx");

  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  return (
    <>

      <div >
        <div className="page-header">
          <div>
            <h1 className="page-title">Menu Creation</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00007_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto pageheader-btn">
            <a
              className="btn btn-primary btn-icon text-white"
              onClick={() => setCreateModalOpen({
                open: true,
                mode: 1,
                rowData: null
              })}

              variant="contained"
            >
              <span>
                <i className="fe fe-plus" />
                &nbsp;
              </span>
              Add New
            </a>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }

        <Card>
          <Card.Body>
            <form id="myForm" onSubmit={postQuery} >
              {/* Module Group */}
              <div className="row mb-2 mx-2 ">
                <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                <div className="col-md-6">
                  <div className="input-group">
                  <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() =>setShowModelModGrpLov(true)} /></span>
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
                  <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() =>setShowModelModLov(true)} /></span>

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


              <div className="container text-end">
                <button class="btn btn-primary " type="submit">
                  Query
                </button>

                <button
                  className="btn btn-secondary mx-2"
                  type="button"
                        onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
            <Row>


              <Card.Body>
                <div className="main-content-label mg-b-5">Available Locations</div>
                <p className="mg-b-20 card-sub-title tx-12 text-muted">
                  Select Your Location
                </p>
                <Row>
                  {approval&&<Col className=" mt-4 mt-lg-0" lg={12} xl={12}>
                    <ul id="tree2" className="tree">

                      <li className="branch">
                      <TreeView
  id="tree"
  style={{ height: "auto" }}
  showIcon={false}
  className="branch"
  items={data}
  TextField="menuNm"
  selectRow={true}
  onRenderItem={onRenderItem}
/>
                      </li>

                    </ul>
                    {/* <ul id="tree2" className="tree">
              {renderTreeItems(treeview1)}
            </ul> */}
                  </Col>}

                </Row>
              </Card.Body>
            </Row>
          </Card.Body>
        </Card>


      </div>
      <CreateNewAccountModal
        open={createModalOpen.open}
        onClose={() => setCreateModalOpen({
          open: false,
          mode: 0,
          rowId: -1,
          rowData: null
        })}
        onSubmit={handleCreateNewRow}
        mode={createModalOpen.mode}
        rowId={createModalOpen.rowId}
        rowData={createModalOpen.rowData}
        onTreeDataChange={handleTreeDataChange} // Add this line
        queryInputObj={queryInputObj}
        data={data}
        setData={setData}
      />

    </>
  );
};

export default MenuCreation;
//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj }) => {
  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [addVal, setAddVal] = useState([])
  const [edtVal, setEdtVal] = useState({
    modGrpId: '',
    modGrpNm: '',
    modId: '',
    modNm: '',
    menuId:'',
    menuNm:'',
    formRepId:'',
    formRepNm:'',
    parMenuId:'',
    parMenuNm:"",
    orderBy:'',
    pwaMenu:"",
    actFlg: ''

  });

  // Function to update edtVal
  const updateEdtVal = (newEdtVal) => {
    setEdtVal(newEdtVal);
  };
  const call_pageOpen_api = async (url, body, headers)=>{
    await axios.post(url, body, {headers} ).then(res=>{
        if(res.data.content){
            setEdtVal(res.data.content.mst);
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})

    }).catch(error=>{
        console.log(error);
    })
}


const call_formOpen_api = async (url,  headers)=>{
    let obj= {
        apiId: "SUA00229"
      }
    await axios.post(url,obj,  {headers} ).then(res=>{
        if(res.data.content){
        setAddVal(res.data.content.mst);
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})

    }).catch(error=>{
        console.log(error);
    })
}
  console.log(rowData)
  // useEffect(()=>{
  //     let url= "";
  //     if (mode===1){
  //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00025/openAddForm";
  //     }
  //     open && call_formOpen_api(url, headers)
  // }, [mode])

  useEffect(() => {
    let url = "";
    let body = {}

    if (mode === 1) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/openAddForm"
    }
    if (mode === 2) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/openEditForm";
      body = {
        apiId: "SUA00231",
        mst:{
        modId: queryInputObj?.criteria?.modId,
        menuId: rowData.id
      }
    }
    }
    if (mode === 3) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/openDeleteForm";
      body = {
        apiId: "SUA00230",
        mst:{
          modId: queryInputObj?.criteria?.modId,
          menuId: rowData.id
      }
    }
    }
    if (mode === 4) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/openViewForm";
      body = {
        apiId: "SUA00233",
        mst:{
        modId: queryInputObj?.criteria?.modId,
        menuId: rowData.id
      }
    }
    }

    { (mode === 1) && open && call_formOpen_api(url, headers) }
    { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
  }, [mode])

  const handleClose = () => {
    onClose();
    setEdtVal({
      modGrpId: '',
      modGrpNm: '',
      modNm: '',
      menuTyp: '',
      pwaMenu: '',
      parMenuId: '',
      parMenuNm: '',
      formRepId: '',
      formRepNm: '',
      refModId:"",
      orderBy: 0,
      actFlg: 'A',
      url:""
    });
  }
  // const [dlgElem, setDlgElem] = useState();
  return (


    <Dialog open={open} setData={setData} data={data} fullWidth
      maxWidth="md">
      <DialogTitle sx={{ m: 1, p: 2 }} >

        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon style={{ color: "black" }} />
          </IconButton>
        ) : null}
      </DialogTitle>
      {/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
      <DialogContent className="pb-0">
        <MenuCreationForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
          msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} edtVal={edtVal} updateEdtVal={updateEdtVal} setEdtVal={setEdtVal} addVal={addVal}  errExp={errExp} set_errExp={set_errExp} />
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }} className="pt-0">
        {/* <Button onClick={onClose}>Cancel</Button> */}
        {/* <Button color="secondary" onClick={handleSubmit} variant="contained">
    Add New
  </Button> */}
      </DialogActions>
    </Dialog>

  );
};
