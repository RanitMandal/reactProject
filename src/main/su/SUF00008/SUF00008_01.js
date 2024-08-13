import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Fullscreen, Visibility } from "@mui/icons-material";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";
import { Alert } from "react-bootstrap";
//import * as dashboard from "../../data/dashboard/dashboard";
import TreeView from "deni-react-treeview";
//import { treeview1 } from "../../components/Dashboard/treeview1";
import { Link } from "react-router-dom";
import { LocationTreeForm } from "./SUF00008_02";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };

const Location_Tree = () => {
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj={
        apiId:"SUA00001"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openForm", obj, {
          headers,
        })
        .then((res) => {
          console.log(res.data);
          setOpenData(res.data);
          console.log(openData);
          if (res.data?.content?.qryRsltSet?.length) {
            const modifiedData = res.data.content.qryRsltSet.map((item) => ({
              ...item,
              parLvlRefCd: item.parLvlRefCd === "*" ? null : item.parLvlRefCd,
            }));
            let list = modifiedData.map((el) => {
              return {
                ...el,

                text: el.text,
                id: el.id,
              };
            });
            setTreeview1([]);
            setData(modifiedData);
          } else {
            setData([]);
          }
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
            res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        });
    };
    fetchOpenData();
  }, []);

  const [data, setData] = useState([]);
  console.log(data);

  const [treeview1, setTreeview1] = useState([]);

  // // Tree Populate
  // const idMapping = data.reduce((acc, el, i) => {
  //   acc[el.lvlRefCd] = i;
  //   return acc;
  // }, []);

  //  let treeview1=[];

  // useEffect(() => {
  //   data.forEach((el) => {
  //     // Handle the root element
  //     if (el.parLvlRefCd === null) {
  //       setTreeview1([...treeview1, el]);
  //       return;
  //     }
  //     // Use our mapping to locate the parent element in our data array
  //     const parentEl = data[idMapping[el.parLvlRefCd]];
  //     // Add our current el to its parent's `children` array
  //     parentEl.children = [...(parentEl.children || []), el];
  //   });
  // }, [data]);

  console.log(treeview1);

  const onRenderItem = (item, treeview) => {
    console.log(item);
    return (
      <div className="treeview-item-example">
        <span
          className="actionButton edit"
          onClick={() =>
            setCreateModalOpen({
              open: true,
              mode: 2,
              rowData: item,
            })
          }
        >
          <Edit color="success" size="15" />
        </span>
        &nbsp;&nbsp;
        <span
          className="actionButton view"
          onClick={() =>
            setCreateModalOpen({
              open: true,
              mode: 4,
              rowData: item,
            })
          }
        >
          <Visibility color="warning" size="15" />
        </span>
        &nbsp;&nbsp;
        <span
          className="actionButton trash"
          onClick={() =>
            setCreateModalOpen({
              open: true,
              mode: 3,
              rowData: item,
            })
          }
        >
          <Delete color="error" size="15" />
        </span>
        &nbsp;&nbsp;
        <span className="treeview-item-example-text">{item.text}</span>
      </div>
    );
  };

  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null,
  });
  const [render, setRender] = useState(0);

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    const lvlRefCd = item.lvlRefCd;

    //   if (item.clickable) {
    navigate("/CMF00000_05", { state: lvlRefCd });
    //    }
  };


  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }

  
  return (
    <div>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Location Tree</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item className="breadcrumb-item" href="#">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                SUF00008_01
                <FavLink />
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <a
              className="btn btn-primary btn-icon text-white"
              onClick={() =>
                setCreateModalOpen({
                  open: true,
                  mode: 1,
                  rowData: null,
                })
              }
              variant="contained"
            >
              <span>
                <i className="fe fe-plus" />
                &nbsp;
              </span>
              Add New
            </a>
            {/* &nbsp;
                    <Link
      className="btn btn-success btn-icon text-white"
      to={`${process.env.PUBLIC_URL}/SUF00005_03`}
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Add Multiple
    </Link> */}
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <div className="main-content-label mg-b-5">
                  Available Locations
                </div>
                <p className="mg-b-20 card-sub-title tx-12 text-muted">
                  Select Your Location
                </p>
                <Row>
                  <Col className=" mt-4 mt-lg-0" lg={12} xl={12}>
                    <ul id="tree2" className="tree">
                      <li className="branch">
                        <TreeView
                          id="tree"
                          style={{ height: "auto" }}
                          showIcon={false}
                          className="branch"
                          items={data}
                          selectRow={true}
                          onRenderItem={onRenderItem}
                        />
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <CreateNewAccountModal
        open={createModalOpen.open}
        onClose={() =>
          setCreateModalOpen({
            open: false,
            mode: 0,
            rowId: -1,
            rowData: null,
          })
        }
        // onSubmit={handleCreateNewRow}
        mode={createModalOpen.mode}
        rowId={createModalOpen.rowId}
        rowData={createModalOpen.rowData}
        data={data}
        setData={setData}
        // onTreeDataChange={handleTreeDataChange} // Add this line
      />
    </div>
  );
};
export default Location_Tree;

export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  mode,
  rowId,
  setData,
  data,
  rowData,
  index,
  queryInputObj,
}) => {
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [edtVal, setEdtVal] = useState({});
  const [addVal, setAddVal]=useState([])

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
        apiId: "SUA00003"
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
  console.log(rowData);
  // useEffect(()=>{
  //     let url= "";
  //     if (mode===1){
  //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00025/openAddForm";
  //     }
  //     open && call_formOpen_api(url, headers)
  // }, [mode])

  useEffect(() => {
    let url = "";
    let body = {};

    if (mode === 1) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openAddForm";
    }
    if (mode === 2) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openEditForm";
      body = {
        apiId: "SUA00006",
        mst: {
        lvlRefCd: rowData.id,
      }
    };
    }
    if (mode === 3) {
      url =
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openDeleteForm";
      body = {
        apiId: "SUA00008",
        mst: {
        lvlRefCd: rowData.id,
      }
    };
    }
    if (mode === 4) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openViewForm";
      body ={
        apiId: "SUA00005",
        mst: {
        lvlRefCd: rowData.id,
      }
    };
    }

    {
      mode === 1 && open && call_formOpen_api(url, headers);
    }
    {
      mode !== 1 && open && call_pageOpen_api(url, body, headers);
    }
  }, [mode]);

  const handleClose = () => {
    setEdtVal({})
    onClose();
  };
  // const [dlgElem, setDlgElem] = useState();

  return (
    <Dialog open={open} setData={setData} data={data} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 1, p: 2 }}>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
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
        <LocationTreeForm
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          index={index}
          queryInputObj={queryInputObj}
          msg={msg}
          setMsg={setMsg}
          msgTyp={msgTyp}
          setMsgTyp={setMsgTyp}
          edtVal={edtVal}
          updateEdtVal={updateEdtVal}
          setEdtVal={setEdtVal}
          addVal={addVal}
          setAddVal={setAddVal}
          errExp={errExp} set_errExp={set_errExp}
        />
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
