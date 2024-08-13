import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Modal, ModalTitle } from "react-bootstrap";
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import { modLovColumns } from "./columns";
import { chngReqNoLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
import moment from "moment/moment";
import FavLink from "../../common/FavLink";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ChangeRequestTracking = () => {
    const navigate = useNavigate()
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [viewData, set_viewData] = useState([])
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00641",
        criteria: {
            modId: " ",
            chngReqNo: ""

        }
    })

    // Open Form
    const [openData, setOpenData] = useState([]);
    useEffect(() => {
        const fetchOpenData = async () => {
            let obj = {
                apiId: "SUA00638"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00151/openForm', obj, { headers }).then((res) => {
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


    //State Lov Starts     

    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {

        const fetchModLovData = async () => {
            let obj = {
                apiId: "SUA00640"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00151/getAllModMst", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        fetchModLovData();
    }, []);


    const getModNm = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm : ""
    }

    const getModId = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId : ""
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowModLov, setSelectRowModLov] = useState("");
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        console.log(rowData)
        setSelectRow(rowData);
        setSelectRowModLov(rowData);
        setQueryInputObj({
            apiId: "SUA00641",
            criteria: {
                ...queryInputObj.criteria,
                modId: getModId(rowData),

            }
        })
    };
    //State Lov ends  


    //Changereq Lov Starts     

    const [chngReqNoLovData, setChngReqNoLovData] = useState([]);
    useEffect(() => {

        const fetchChngReqNoLovData = async () => {
            let obj = {
                apiId: "SUA00639",
                criteria: {
                    modId: getModId(selectRow)
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00151/getAllChngReqInfo", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setChngReqNoLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        fetchChngReqNoLovData();
    }, [selectRow]);


    const getChngReqNoNm = (obj) => {
        return chngReqNoLovData[Number(Object.keys(obj)[0])]?.chngReqDesc ? chngReqNoLovData[Number(Object.keys(obj)[0])]?.chngReqDesc : ""
    }

    const getChngReqNo = (obj) => {
        return chngReqNoLovData[Number(Object.keys(obj)[0])]?.chngReqNo ? chngReqNoLovData[Number(Object.keys(obj)[0])]?.chngReqNo : ""
    }

    // const [selectRow, setSelectRow] = useState("");
    const [selectRowChngReqNoLov, setSelectRowChngReqNoLov] = useState("");
    const [showModelChngReqNoLov, setShowModelChngReqNoLov] = useState(false);
    const handleRowClickChngReqNoLov = (rowData) => {

        console.log(rowData)
        //  setSelectRow(rowData);
        setSelectRowChngReqNoLov(rowData);
        setQueryInputObj({
            apiId: "SUA00641",
            criteria: {
                ...queryInputObj.criteria,
                chngReqNo: getChngReqNo(rowData)
            }
        })


    };

    useEffect(() => {
        let view_obj = {

            apiId: "SUA00543",
            mst: {
                chngReqNo: getChngReqNo(selectRowChngReqNoLov)
            }

        }
        selectRowChngReqNoLov && handleViewDtl(view_obj).then((res) => {
            console.log(res);
            if (!res.data?.appMsgList?.errorStatus) {
                const obj = res.data?.content?.mst;
                console.log(obj);
                set_viewData(obj)
                // const [chngReqTrackDtl, chngReqDtl, ...objct] = obj
                // set_viewData(JSON.stringify(obj, null, 2))
                let viewObj = JSON.stringify(obj, null, 2)
                console.log('calling' + isContainerOpen)
                setIsContainerOpen(true)
            }
        })


    }, [selectRowChngReqNoLov])


    const handleViewDtl = async (obj) => {

        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00137/openViewForm', obj, { headers })
    }

    const show = (viewData) => {
        
        console.log(viewData);
        let showData = {}
        showData = {
            ...viewData,
            chngReqDt: moment(showData.chngReqDt).format('DD/MM/YYYY')
        }
        console.log(showData, "jjjjjjjjjjjjjjj")
        return (
            <>
                {/* <Row style={{width:"100%"}}>
                    <div className="col-md-6 p-0">Change Request No: {showData.chngReqNo}</div>
                    <div className="col-md-6 p-0" xs={6}>Change Request Description: {showData.chngReqDesc}</div>
                    <Col>3 of 3</Col>
                </Row>
                <Row>
                    <div className="col-md-4">change Request Type: {showData.chngReqTypCd}</div>
                    <div className="col-md-4" >change Request Date: {showData.chngReqDt}</div>
                    <div className="col-md-4">change Request Time: {showData.chngReqTm}</div>
                </Row>
                <Row>
                    <div className="col-md-3">User Id: {showData.userId}</div>
                    <div className="col-md-3">Module Name: {showData.modNm}</div>
                    <div className="col-md-3">FormName: {showData.formNm}</div>
                    <col>App Name: {showData.appNm}</col>
                </Row> */}
                <Row style={{ paddingLeft:"10px", width: "100%" }}>
                    <span><b>User Id:</b> {showData.userId}</span>
                    <span><b>Change Request No:</b> {showData.chngReqNo}</span>
                    <span><b>Change Request Description:</b> {showData.chngReqDesc}</span>
                    {/* <Col>3 of 3</Col> */}
                
                    <span><b>change Request Type: </b>{showData.chngReqTypCd}</span>
                    <span ><b>change Request Date: </b>{showData.chngReqDt}</span>
                    <span><b>change Request Time: </b>{showData.chngReqTm}</span>
               
                    <span><b>Module Name:</b> {showData.modNm}</span>
                    <span><b>Form Name:</b> {showData.formNm}</span>
                    <span><b>App Name: </b>{showData.appDesc}</span>
                    <span><b>Request App Log No:</b> {showData.reqAppLogNo}</span>
                    <span><b>Request Status:</b> {showData.status}</span>
                    <span><b>Repsonse Sl No:</b> {showData.respSlNo}</span>
                    <span><b>Repsonse Contact ID: </b>{showData.respContactId}</span>
                    <span><b>Repsonse Contact Name:</b> {showData.respContactNm}</span>
                    <span><b>Closed Contact ID:</b> {showData.closedContactId}</span>
                    <span><b>Closed Contact Name: </b>{showData.closedContactNm}</span>
                    <span><b>Closed Sl No: </b>{showData.closedBySlNo}</span>
                    <span><b>Status:</b> {showData.actFlg}</span>
                    <span><b>Level Reference Code:</b> {showData.fromLvlRefCd}</span>
                        {console.log(showData, "kkkkkkk")}
                    <span className="bg-primary" style={{color:"6259c9"}}><b className="text-white">File Details:</b></span>
                       
                    <table>
                        <thead>
                        <tr>
                            <th >S. No.</th>
                            
                            <th>ID</th>
                           
                            <th>Desc.</th>
                            <th>File</th>
                        </tr>
                        </thead>
                        <tbody>
                        
                        {
                            showData.chngReqDtl.map((item, i)=>
                                <tr>
                                <td>{item?.fileSlNo}</td>
                                <td>{item?.fileId}</td>
                                <td>{item?.fileNm}</td>
                                <td onClick={()=> window.open(`${process.env.REACT_APP_API_URL_PREFIX+item?.fileUrl}`)}>click</td>   
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                   
                </Row>
            </>
        )
    }








    // Query Start..............
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00151/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setTableData2(res.data?.content?.qryRsltSet)

            }
            else {
                setTableData2([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })

        }).catch(error => {
            console.log(error);
        })
    }

    // Query end...............

    //for container...
    const [isContainerOpen, setIsContainerOpen] = useState(false);

    // const openContainer = () => {
    //     setIsContainerOpen(true);
    // };

    const closeContainer = () => {
        setIsContainerOpen(false);
    };


    const [tableData2, setTableData2] = useState([]);


    const [createModalOpen, setCreateModalOpen] = useState({
        open: false,
        mode: 0,
        rowId: -1,
        row: null,
        rowData: null
    });

    const [validationErrors, setValidationErrors] = useState({});

    const [render, setRender] = useState(0);

    const handleCreateNewRow = (values) => {
        tableData2.push(values);
        setTableData2([...tableData2]);
    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            tableData2[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData2([...tableData2]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };



    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    const isValid =
                        cell.column.id === "email"
                            ? validateEmail(event.target.value)
                            : cell.column.id === "age"
                                ? validateAge(+event.target.value)
                                : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} is required`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors]
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: "chngReqNo",
                header: "Change Request No.",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "chngReqDesc",
                header: "Change Request Desc",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respSlNo",
                header: "Response Serial No",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respContactId",
                header: "Response Contact Id",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respContactNm",
                header: "Response Contact Name",
                size: 80,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respStatUpdtRemarks",
                header: "ResponseUpdateRemarks",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "assignDt",
                header: "Assign Date",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "assignTm",
                header: "Assign Time",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respCloseDt",
                header: "Response Close Date",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "respCloseTm",
                header: "Response Close Time",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            },
            {
                accessorKey: "actFlgTxt",
                header: "Status",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                muiTableBodyCellProps: {
                    align: "center",
                  }
            }
        ],
        [getCommonEditTextFieldProps]
    );

    //1st
    const csvOptions = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    //csv files
    const csvExporter = new ExportToCsv(csvOptions);

    //functions
    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(tableData2);
    };

    function resetForm() {
        setSelectRowModLov("");
        setSelectRow("")
        setTableData2([])
        // setQueryInputObj({
        //     apiId: "SUA00641",
        //     criteria: {
        //       modId: "",
        //       chngReqNo: ""
        //     }
        //   })
        setMsg("")
        setMsgTyp("")
        setIsContainerOpen("")
    }

    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }


    return (
        <>
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Change Request Tracking</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00151_01
                                    </a>
                                    <FavLink />
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {/* <div className="ms-auto pageheader-btn">
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
                  

                    </div> */}
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}


                <div className="card">
                    <div className="container-fluid mb-5">
                        <form id="myForm" onSubmit={postQuery} className="py-4" >
                            <div className="row mb-3 mx-4">
                                <label className="col-sm-3 col-form-label"><b>Module:</b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}

                                            className="form-control col-md-2 rouned"
                                            // required
                                            value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            // required
                                            value={getModNm(selectRowModLov) ? getModNm(selectRowModLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelModLov && <Lov
                                                moduleLovData={modLovData}
                                                setShowModel={setShowModelModLov}
                                                showModel={showModelModLov}
                                                handleRowClick={handleRowClickModLov}
                                                columns={modLovColumns}
                                                currentSelection={selectRow}
                                                setCurrentSelection={setSelectRow}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3 mx-4">
                                <label className="col-sm-3 col-form-label"><b>Change Request No:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelChngReqNoLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}

                                            className="form-control col-md-2 rouned"
                                            required
                                            value={getChngReqNo(selectRowChngReqNoLov) ? getChngReqNo(selectRowChngReqNoLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
                                            value={getChngReqNoNm(selectRowChngReqNoLov) ? getChngReqNoNm(selectRowChngReqNoLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelChngReqNoLov && <Lov
                                                moduleLovData={chngReqNoLovData}
                                                setShowModel={setShowModelChngReqNoLov}
                                                showModel={showModelChngReqNoLov}
                                                handleRowClick={handleRowClickChngReqNoLov}
                                                columns={chngReqNoLovColumns}
                                                currentSelection={selectRowChngReqNoLov}
                                                setCurrentSelection={setSelectRowChngReqNoLov}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                {isContainerOpen && (
                                    <div className="container" style={{ border: "1px solid #6259c9", height: "150px", width: "90%", margin: "20px", borderRadius: "5px", position: "relative", overflow: "auto" }}>

                                        <IconButton
                                            aria-label="close"
                                            onClick={closeContainer}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                                zIndex: 9999
                                            }}
                                        >
                                            <CloseIcon style={{ color: "black" }} />
                                        </IconButton>
                                        {viewData && <div className="mt-2">
                                            {/* <pre>Change Request No:{viewData.chngReqNo},
                                            Change Request Description:{viewData.chngReqDesc}
                                            Module ID:{viewData.modId}
                                            change Request Date:{moment(viewData.chngReqDt).format("dd-mm-yyyy")}</pre> */}
                                            {/* <pre className="m-0,mx-2 pe-2" style={{ height: "130px", position: "absolute", width: "100%", backgroundColor: "ffffff" }}>{viewData}</pre> */}
                                            {show(viewData)}


                                        </div>}

                                    </div>)}


                            </div>
                            <div className="row">

                                <div className="text-end">
                                    {/* <button className="btn btn-primary mx-2" type="button" onClick={openContainer}>View</button> */}
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
                            </div>
                        </form>

                        <MaterialReactTable
                        autoResetPageIndex={false}
                            displayColumnDefOptions={{
                                "mrt-row-actions": {
                                    muiTableHeadCellProps: {
                                        align: "center",
                                    },
                                    size: 120,
                                },
                            }}
                            columns={columns}
                            data={tableData2}
                            // initialState={{ density: "compact" }}
                            editingMode="modal" //default
                            enableRowSelection
                            enableColumnOrdering
                            // enableEditing
                            positionToolbarAlertBanner="bottom"
                            onEditingRowSave={handleSaveRowEdits}
                            onEditingRowCancel={handleCancelRowEdits}
                            // renderRowActions={({ row, table }) => (
                            //     <Box sx={{ display: "flex", gap: "1rem" }}>
                            //         <Tooltip arrow placement="left" title="Edit">
                            //             <IconButton color="success" onClick={() => setCreateModalOpen({
                            //                 open: true,
                            //                 mode: 2,
                            //                 rowData: tableData2[row.index],
                            //                 index: row.index,
                            //                 queryInputObj
                            //                 //rowData:[1,2,3]
                            //             })}>
                            //                 <Edit />
                            //             </IconButton>
                            //         </Tooltip>
                            //         <Tooltip arrow placement="right" title="View">
                            //             <IconButton color="warning" onClick={() => setCreateModalOpen({
                            //                 open: true,
                            //                 mode: 4,
                            //                 rowData: tableData2[row.index],
                            //                 index: row.index,

                            //             })}>
                            //                 <Visibility />
                            //             </IconButton>
                            //         </Tooltip>
                            //         <Tooltip arrow placement="right" title="Delete">
                            //             <IconButton color="error" onClick={() => setCreateModalOpen({
                            //                 open: true,
                            //                 mode: 3,
                            //                 rowData: tableData2[row.index],
                            //                 queryInputObj
                            //             })}>
                            //                 <Delete />
                            //             </IconButton>
                            //         </Tooltip>
                            //     </Box>
                            // )}
                            renderTopToolbarCustomActions={({ table }) => (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "1rem",
                                            p: "0.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Button
                                            className="btn btn-primary fs-10"
                                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                            onClick={handleExportData}
                                            startIcon={<FileDownloadIcon />}
                                            variant="contained"
                                        >
                                            Export All Data
                                        </Button>
                                        <Button
                                            className="btn btn-primary fs-10"
                                            disabled={table.getPrePaginationRowModel().rows.length === 0}
                                            //export all rows, including from the next page, (still respects filtering and sorting)
                                            onClick={() =>
                                                handleExportRows(table.getPrePaginationRowModel().rows)
                                            }
                                            startIcon={<FileDownloadIcon />}
                                            variant="contained"
                                        >
                                            Export All Rows
                                        </Button>
                                        <Button
                                            className="btn btn-primary fs-10"
                                            disabled={table.getRowModel().rows.length === 0}
                                            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                                            onClick={() => handleExportRows(table.getRowModel().rows)}
                                            startIcon={<FileDownloadIcon />}
                                            variant="contained"
                                        >
                                            Export Page Rows
                                        </Button>
                                        <Button
                                            className="btn btn-primary fs-10"
                                            disabled={
                                                !table.getIsSomeRowsSelected() &&
                                                !table.getIsAllRowsSelected()
                                            }
                                            //only export selected rows
                                            onClick={() =>
                                                handleExportRows(table.getSelectedRowModel().rows)
                                            }
                                            startIcon={<FileDownloadIcon />}
                                            variant="contained"
                                        >
                                            Export Selected Rows
                                        </Button>
                                    </Box>
                                </>
                            )}
                        />

                    </div>
                </div>
            </div>

            {/* <CreateNewAccountModal
                columns={columns}
                open={createModalOpen.open}
                onClose={() => setCreateModalOpen({
                    open: false,
                    mode: 0,
                    rowId: -1,
                    rowData: null
                })}
                render={render}
                setRender={setRender}
                onSubmit={handleCreateNewRow}
                mode={createModalOpen.mode}
                rowId={createModalOpen.rowId}
                data={tableData2}
                setData={setTableData2}
                rowData={createModalOpen.rowData}
                queryInputObj={queryInputObj}
                maxWidth="1200px"
            /> */}
        </>
    );
};

export default ChangeRequestTracking;

//example of creating a mui dialog modal for creating new rows
// export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj }) => {
//     const [msg, setMsg] = useState("")
//     const [msgTyp, setMsgTyp] = useState("")
//     const [edtVal, setEdtVal]=useState('')
//     const [addVal, setAddVal]=useState('')
//     const call_pageOpen_api = async (url, body, headers)=>{
//         await axios.post(url, body, {headers} ).then(res=>{
//             if(res.data.content){
//                 setEdtVal(res.data.content.mst);
//             }
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)


//         }).catch(error=>{
//             console.log(error);
//         })
//     }


//     const call_formOpen_api = async (url,  headers)=>{
//         let obj= {
//             apiId: "SUA00190"
//           }
//         await axios.post(url,obj,  {headers} ).then(res=>{
//             if(res.data.content){
//             setAddVal(res.data.content.mst);
//             }
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)


//         }).catch(error=>{
//             console.log(error);
//         })
//     }

//     // useEffect(()=>{
//     //     let url= "";
//     //     if (mode===1){
//     //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00025/openAddForm";
//     //     }
//     //     open && call_formOpen_api(url, headers)
//     // }, [mode])

//     useEffect(() => {
//         let url = "";
//         let body= {}

//         if(mode === 1) {
//             url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00015/openAddForm"
//         }
//         if(mode === 2) {
//             url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00015/openEditForm";
//             body={
//                 apiId: "SUA00192",
//                 mst: {
//                   distCd: rowData.distCd
//                 }
//               }
//         }
//         if(mode === 3) {
//             url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00015/openDeleteForm";
//             body={
//                 apiId: "SUA00191",
//                 mst: {
//                   distCd: rowData.distCd
//                 }
//               }
//         }
//         if(mode === 4) {
//             url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00015/openViewForm";
//             body={
//                 apiId: "SUA00194",
//                 mst: {
//                   distCd: rowData.distCd
//                 }
//               }
//         }

//         {(mode===1)&&open && call_formOpen_api(url, headers)}
//       {(mode!==1)&&open && call_pageOpen_api(url,body, headers)}
//     }, [mode])

//     const handleClose = () => {
//         onClose();
//     }
//     // const [dlgElem, setDlgElem] = useState();


//     return (


//         <Dialog open={open} setData={setData} data={data} fullWidth
//             maxWidth="md">
//             <DialogTitle sx={{ m: 1, p: 2 }} >

//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={{
//             position: 'absolute',
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon style={{color: "black"}}/>
//         </IconButton>
//       ) : null}
//     </DialogTitle>
//             {/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
//             <DialogContent className="pb-0">
//                 <DistrictMasterForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj} 
//                 msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp}  edtVal={edtVal} setEdtVal={setEdtVal} addVal={addVal} />
//             </DialogContent>
//             <DialogActions sx={{ p: "1.25rem" }} className="pt-0">
//                 {/* <Button onClick={onClose}>Cancel</Button> */}
//                 {/* <Button color="secondary" onClick={handleSubmit} variant="contained">
//       Add New
//     </Button> */}
//             </DialogActions>
//         </Dialog>

//     );
// };

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
const validateAge = (age) => age >= 18 && age <= 50;


