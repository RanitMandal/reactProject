import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import TreeView from "deni-react-treeview";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    Tabs,
    Tab,
    OverlayTrigger,

    Breadcrumb,
    Card,
    Row,
    Col,
    Form,

} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    // MenuItem,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { ArticleCategoryMasterForm } from "./WPF00004_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import MsgAlert from "../../common/MsgAlert";
import { getApiToken, getScplAdContext } from "../../common/common"
import FavLink from "../../common/FavLink";
import { stateLovColumns } from "./columns";
import Lov from "../../common/Lov _new";
const headers = { Authorization: 'Bearer ' + getApiToken() };



const ArticleCategoryMaster = () => {
    console.log(headers);

    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "WPA00024"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/openForm', obj, { headers }).then((res) => {
                console.log(res.data);
                // setOpenData(res.data);

                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
                    res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
            })
        }

        fetchOpenData()

    }, [])




    //portal Lov Starts     

    const [stateLovData, setStateLovData] = useState([]);
    useEffect(() => {

        const fetchStateLovData = async () => {
            let obj = {
                apiId: "WPA00028"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/getAllPortal", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        fetchStateLovData();
    }, []);


    const getportalTitle = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.portalTitle
    }

    const getportalId = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.portalId
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowStateLov, setSelectRowStateLov] = useState("");
    const [showModelStateLov, setShowModelStateLov] = useState(false);
    const handleRowClickStateLov = (rowData) => {
        console.log(rowData)
        setSelectRow(rowData);
        setSelectRowStateLov(rowData);
        setQueryInputObj({
            apiId: "WPA00041",
            criteria: {
                portalId: getportalId(rowData),


            }
        })
        setData([]);
        setApproval(false)
    };
    //portal Lov ends   




    const [createModalOpen, setCreateModalOpen] = useState({
        open: false,
        mode: 0,
        rowId: -1,
        row: null,
        rowData: null
    });
    const [tableData, setTableData] = useState([]);










    const resetForm = () => {
        setTableData([])
        setSelectRow('')
        setSelectRowStateLov('')
        setQueryInputObj({
            apiId: "WPA00041",
            criteria: {
                portalId: ''
               
               

            }
        })
        setMsg("")
        setMsgTyp("")
        setData([]);
        setApproval(false)
        

    };
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "WPA00041",
        criteria: {
            portalId: ''
        }
    })
    const handleQueryInputChange = (event) => {
        setQueryInputObj({
            "apiId": "WPA00041",
            criteria: {
                ...queryInputObj.criteria,
                [event.target.name]: event.target.value
            }
        });
    };
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    const [data, setData] = useState([]);
    const [approval, setApproval] = useState(false)
    const postQuery = async (e) => {
        e.preventDefault()
        if (!selectRow) {
            setMsgTyp("VE")
            setMsg("Please Select Module")
            return
        }
        console.log(queryInputObj)
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setApproval(true)
                const modifyData = (items) => {
                    return items.map((item) => {
                        const newItem = {
                            ...item,
                            catId: item.text,
                            catNm: item.id,
                            parCatId: item.parentId,
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
                setApproval(false)
                setData([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
        }).catch(error => {
            console.log(error);
        })

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

    return (
        <>

            <div >
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Article Category Master</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item className="breadcrumb-item" href="#">
                                List Page
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                WPF00004_01
                                <FavLink />
                            </Breadcrumb.Item>

                        </Breadcrumb>
                        {/* <Breadcrumb className="breadcrumb">
                          <Breadcrumb.Item>
                          
                          </Breadcrumb.Item>
                          </Breadcrumb>
          <i className="fa fa-star"></i> */}
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
                        &nbsp;
                        {/* <Link
                            className="btn btn-success btn-icon text-white"
                            to={`${process.env.PUBLIC_URL}/WPF00004_03`}
                        >
                            <span>
                                <i className="fe fe-log-in" />
                                &nbsp;
                            </span>
                            Add Multiple
                        </Link> */}

                    </div>

                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}




                <div className="card">
                    <div className="container-fluid mb-5">



                        <form onSubmit={postQuery} id="myForm" className="py-4">
                            <div className="row mb-3 mx-4">
                                <label className="col-sm-3 col-form-label"><b>Portal Id:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}

                                            className="form-control col-md-2 rouned"
                                            required
                                            value={getportalId(selectRowStateLov) ? getportalId(selectRowStateLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
                                            value={getportalTitle(selectRowStateLov) ? getportalTitle(selectRowStateLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelStateLov && <Lov
                                                moduleLovData={stateLovData}
                                                setShowModel={setShowModelStateLov}
                                                showModel={showModelStateLov}
                                                handleRowClick={handleRowClickStateLov}
                                                columns={stateLovColumns}
                                                currentSelection={selectRow}
                                                setCurrentSelection={setSelectRow}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container text-end">
                                <button className="btn btn-primary" type="Submit" >
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


                        <Card.Body>
                            <div className="main-content-label mg-b-5">Available Locations</div>
                            <p className="mg-b-20 card-sub-title tx-12 text-muted">
                                Select Your Location
                            </p>
                            <Row>
                                {approval && <Col className=" mt-4 mt-lg-0" lg={12} xl={12}>
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



                    </div>

                </div>


                <CreateModal
                    // columns={columns}
                    open={createModalOpen.open}
                    onClose={() => setCreateModalOpen({
                        open: false,
                        mode: 0,
                        rowId: -1,
                        rowData: null
                    })}
                    // render={render}
                    // setRender={setRender}
                   
                    mode={createModalOpen.mode}
                    rowId={createModalOpen.rowId}
                    data={data}
                    setData={setData}
                    rowData={createModalOpen.rowData}
                    queryInputObj={queryInputObj}
                    maxWidth="1200px"
                    parMsg={msg}
                    setParMsg={setMsg}
                    parMsgTyp={msgTyp}
                    setParMsgTyp={setMsgTyp}
                    parErrExp={errExp}
                    set_parErrExp={set_errExp}
                />
            </div>
        </>

    );
};

export default ArticleCategoryMaster;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp, parErrExp, set_parErrExp }) => {


    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [addVal, setAddVal] = useState([])
    const [edtVal, setEdtVal] = useState([])
    const call_pageOpen_api = async (url, body, headers) => {
        await axios.post(url, body, { headers }).then(res => {
            setEdtVal(res?.data?.content?.mst)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })


        }).catch(error => {
            console.log(error);
        })
    }

    const call_formOpen_api = async (url, headers) => {
        let obj = {
            apiId: "WPA00027"
        }
        await axios.post(url, obj, { headers }).then(res => {
            setAddVal(res.data.content.mst)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })


        }).catch(error => {
            console.log(error);
        })
    }

    // useEffect(()=>{
    //     let url= "";
    //     if (mode===1){
    //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/WPF00004/openAddForm";
    //     }
    //     open && call_formOpen_api(url, headers)
    // }, [mode])


    useEffect(() => {
        let url = "";
        let body = {}

        if (mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/openAddForm";
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/openEditForm";
            body = {
                apiId: "WPA00025",
                mst: {
                    articleCatId: rowData.id
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/openDeleteForm";
            body = {
                apiId: "WPA00026",
                mst: {
                    articleCatId: rowData.id
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/openViewForm";
            body = {
                apiId: "WPA00023",
                mst: {
                    articleCatId: rowData.id
                }
            }


        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])





    const handleClose = () => {
        onClose();
    }


    return (


        <Dialog open={open} setData={setData} data={data} fullWidth
            maxWidth="md" >
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
            <DialogContent className="pb-0" >
                {/* {msg&&<span>{msg}</span>} */}
                <ArticleCategoryMasterForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
                    setParMsg={setParMsg} parMsgTyp={parMsgTyp} setParMsgTyp={setParMsgTyp} errExp={errExp} set_errExp={set_errExp}
                    parErrExp={parErrExp} set_parErrExp={set_parErrExp} />
            </DialogContent>
            <DialogActions sx={{ p: "1.25rem" }}>
                {/* <Button onClick={onClose}>Cancel</Button> */}
                {/* <Button color="secondary" onClick={handleSubmit} variant="contained">
      Add New
    </Button> */}
            </DialogActions>
        </Dialog>

    );
};

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//     !!email.length &&
//     email
//         .toLowerCase()
//         .match(
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//         );
// const validateAge = (age) => age >= 18 && age <= 50;


