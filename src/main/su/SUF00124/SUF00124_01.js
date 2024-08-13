import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
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
// import { OptTypMasterFrom } from "./SUF00130_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import Lov from "../../common/Lov";
import { mobLovColumns, appLovColumns} from "./columns";
import { getApiToken } from "../../common/common"
const headers = { Authorization: 'Bearer ' + getApiToken() };

const UserLogInfoDtl = () => {
    console.log(headers);
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "SUA00451"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00124/openForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
                    res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res?.data?.appMsgList?.errorStatus });
            })
        }

        fetchOpenData()

    }, [])

   


    //App Lov Starts

    const [appLovData, setAppLovData] = useState([]);
    useEffect(() => {
        const appLovObj = {
            apiId: "SUA00453",


        }
        const fetchAppLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00124/getAllAppInfo", appLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setAppLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                });
        };

        fetchAppLovData();
    }, []);


    const getAppName = (obj) => {
        return appLovData[Number(Object.keys(obj)[0])]?.appDesc ? appLovData[Number(Object.keys(obj)[0])]?.appDesc:""
    }

    const getAppId = (obj) => {
        return appLovData[Number(Object.keys(obj)[0])]?.appid ? appLovData[Number(Object.keys(obj)[0])]?.appid:""
    }


    const [selectRowAppLov, setSelectRowAppLov] = useState("");
    const [showModelAppLov, setShowModelAppLov] = useState(false);
    const handleRowClickAppLov = (rowData) => {
        setSelectRowAppLov(rowData);
        setQueryInputObj({
            apiId: "SUA00452",
            criteria: {
                ...queryInputObj.criteria,
                appId: getAppId(rowData)
            }
        })
    };

    //App Lov End

     //Module Lov Starts     

     const [mobLovData, setMobLovData] = useState([]);
     useEffect(() => {
         const mobLovObj = {
             apiId: "SUA00454",
             criteria: {
                 appId: getAppId(selectRowAppLov)
               }
 
         }
         const fetchMobLovData = async () => {
             await axios
                 .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00124/getAllRegUserInfo", mobLovObj, { headers })
                 .then((res) => {
                     console.log(res.data);
                     setMobLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
 
                 });
         };
         selectRowAppLov && fetchMobLovData();
     }, [selectRowAppLov]);
 
 
     const getUserName = (obj) => {
         return mobLovData[Number(Object.keys(obj)[0])]?.userNm ? mobLovData[Number(Object.keys(obj)[0])]?.userNm:""
     }
 
     const getUserId = (obj) => {
         return mobLovData[Number(Object.keys(obj)[0])]?.userId ? mobLovData[Number(Object.keys(obj)[0])]?.userId:""
     }

     const getMobNo = (obj) => {
        return mobLovData[Number(Object.keys(obj)[0])]?.mobNo ? mobLovData[Number(Object.keys(obj)[0])]?.mobNo:""
    }
 
 
     const [selectRow, setSelectRow] = useState("");
     const [showModel, setShowModel] = useState(false);
     const handleRowClick = (rowData) => {
         setSelectRow(rowData);
         // setSelectRowFormLov({});
         setQueryInputObj({
             apiId: "SUA00452",
             criteria: {
                 ...queryInputObj.criteria,
                 mobNo: getMobNo(rowData)
                 
 
             }
         })
     };
     //Module Lov ends

     const handleQueryInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(event.target.name, event.target.value);
          setQueryInputObj({ 
              apiId : "SUA00452",
              criteria: {
                  ...queryInputObj.criteria,
                  [name]:value
              }
          });
        };

    const [createModalOpen, setCreateModalOpen] = useState({
        open: false,
        mode: 0,
        rowId: -1,
        row: null,
        rowData: null
    });
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [render, setRender] = useState(0);
    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };





    const columns = useMemo(
        () => [
            {
                accessorKey: "loginDt",
                header: "Login Date",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "loginTm",
                header: "Login Time",
                size: 40,

            },
            {
                accessorKey: "appLogNo",
                header: "Log No",
                size: 100

            },
            {
                accessorKey: "mobNo",
                header: "Mobile No",
                size: 40,
                enableSorting: true,

            }, {
                accessorKey: "mobRegno",
                header: "Registration Number",
                size: 100

            },
            {
                accessorKey: "userId",
                header: "User Id",
                size: 40

            },
            {
                accessorKey: "userNm",
                header: "User Name",
                size: 40

            },
            {
                accessorKey: "emailid",
                header: "Email Id",
                size: 40

            },
            {
                accessorKey: "logoutDt",
                header: "Logout Date",
                size: 240

            },
            {
                accessorKey: "logoutTm",
                header: "Logout Time",
                size: 40

            },
            {
                accessorKey: "forceLogoutFlgTxt",
                header: "Force Logout?",
                size: 10,
                

            },
            {
                accessorKey: "lstApiAccessDt",
                header: "Last Api Access Date",
                size: 240,

            },
            {
                accessorKey: "lstApiAccessTm",
                header: "Last Api Access Time",
                size: 240,

            },
            

        ],

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
        csvExporter.generateCsv(tableData);
    };

    const resetForm = () => {
        setSelectRow("")
        setSelectRowAppLov("")
        setTableData([])
        setQueryInputObj({
            apiId: "SUA00452",
            criteria: {
                appId: "",
                mobNo: "",
                initialDt:"",
                uptoDt:""
            }
        })
        setMsg("")
        setMsgTyp("")

    };
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00452",
        criteria: {
            appId: "",
            mobNo: "",
            initialDt:"",
            uptoDt:""
        }

    })
    // const handleQueryInputChange = (event) => {
    //     setQueryInputObj({
    //         "apiId": "SUA00431",
    //         criteria: {
    //             ...queryInputObj.criteria,
    //             [event.target.name]: event.target.value
    //         }
    //     });
    // };


    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00124/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setTableData(res.data?.content.qryRsltSet)

            }
            else {
                setTableData([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res?.data?.appMsgList?.errorStatus });
            console.log(msg);
        }).catch(error => {
            console.log(error);
        })
    }
    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }
    return (
        <>

            <div openData={openData}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">User Login Info Details</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item className="breadcrumb-item" href="#">
                                List Page
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                SUF00124_01
                                <FavLink />
                            </Breadcrumb.Item>
                        </Breadcrumb>
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



                        <form onSubmit={postQuery} id="myForm" className="py-4">
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label"><b>App:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary">
                                            <i
                                                className="fa fa-search d-inline text-white"
                                                onClick={() => setShowModelAppLov(true)}
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            autoComplete="false"
                                            //className="form-control-lov-cd"
                                            className="form-control col-md-2 rouned"
                                            value={getAppId(selectRowAppLov) ? getAppId(selectRowAppLov) : ""}
                                            required
                                        />
                                        <input
                                            type="text"
                                            autoComplete="false"
                                            className="form-control mx-4"
                                            required
                                            value={getAppName(selectRowAppLov) ? getAppName(selectRowAppLov) : ""}
                                           

                                        />
                                        <div className="row-mb-12">
                                            {showModelAppLov && <Lov
                                                moduleLovData={appLovData}
                                                setShowModel={setShowModelAppLov}
                                                showModel={showModelAppLov}
                                                handleRowClick={handleRowClickAppLov}
                                                columns={appLovColumns}
                                                currentSelection={selectRowAppLov}
                                                setCurrentSelection={setSelectRowAppLov}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label"><b>Mobile No:</b><span className="text-red">*</span></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary">
                                            <i
                                                className="fa fa-search d-inline text-white"
                                                onClick={() => setShowModel(true)}
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            autoComplete="false"
                                            //className="form-control-lov-cd"
                                            className="form-control col-md-2 rouned"
                                            value={getMobNo(selectRow) ? getMobNo(selectRow) : ""}
                                            
                                            required
                                        />
                                        <input
                                            type="text"
                                            autoComplete="false"
                                            className="form-control mx-4"

                                            value={getUserName(selectRow) ? getUserName(selectRow) : ""}
                                           

                                        />
                                        <div className="row-mb-12">
                                            {showModel && <Lov
                                                moduleLovData={mobLovData}
                                                setShowModel={setShowModel}
                                                showModel={showModel}
                                                handleRowClick={handleRowClick}
                                                columns={mobLovColumns}
                                                currentSelection={selectRow}
                                                setCurrentSelection={setSelectRow}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-2 mx-2">
            <label
              for="exampleFormControlSelect1"
              className="col-md-3 col-form-label"
            >
              <b>From Date:</b>
            </label>
            <div className="col-md-2">
              <input className="form-control" type="Date"  name="initialDt" onChange={handleQueryInputChange} value={queryInputObj?.criteria?.initialDt} />
              {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
            </div>
            <label
              for="exampleFormControlSelect1"
              className="col-md-2 col-form-label"
            >
              <b>To Date:</b>
            </label>
            <div className="col-md-2">
              <input className="form-control" type="Date"  name="uptoDt" onChange={handleQueryInputChange} value={queryInputObj?.criteria?.uptoDt} />
              {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
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

                            //enableStickyHeader
                            //muiTableContainerProps={{ sx: { maxHeight: '800px' } }}
                            columns={columns}
                            data={tableData}
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
                            //                 rowData: tableData[row.index],
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
                            //                 rowData: tableData[row.index],
                            //                 index: row.index,

                            //             })}>
                            //                 <Visibility />
                            //             </IconButton>
                            //         </Tooltip>
                            //         <Tooltip arrow placement="right" title="Delete">
                            //             <IconButton color="error" onClick={() => setCreateModalOpen({
                            //                 open: true,
                            //                 mode: 3,
                            //                 rowData: tableData[row.index],
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


                {/* <CreateModal
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
                    data={tableData}
                    setData={setTableData}
                    rowData={createModalOpen.rowData}
                    queryInputObj={queryInputObj}
                    maxWidth="1200px"
                    parMsg={msg}
                    setParMsg={setMsg}
                    parMsgTyp={msgTyp}
                    setParMsgTyp={setMsgTyp}
                    parErrExp={errExp}
                    set_parErrExp={set_errExp}
                /> */}
            </div>
        </>

    );
};

export default UserLogInfoDtl;
//example of creating a mui dialog modal for creating new rows
// export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp, parErrExp, set_parErrExp }) => {


//     const [msg, setMsg] = useState("")
//     const [msgTyp, setMsgTyp] = useState("")
//     const [errExp, set_errExp] = useState({
//         status: true,
//         content: ""
//     })
//     const [addVal, setAddVal] = useState([])
//     const [edtVal, setEdtVal] = useState([])
//     const call_pageOpen_api = async (url, body, headers) => {
//         await axios.post(url, body, { headers }).then(res => {
//             setEdtVal(res.data.content.mst)
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
//             set_errExp({ status: res.data?.appMsgList?.errorStatus })

//         }).catch(error => {
//             console.log(error);
//         })
//     }

//     const call_formOpen_api = async (url, headers) => {
//         let obj = {
//             apiId: "SUA00435"
//         }
//         await axios.post(url, obj, { headers }).then(res => {
//             setAddVal(res.data.content.mst)
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
//             set_errExp({ status: res.data?.appMsgList?.errorStatus })

//         }).catch(error => {
//             console.log(error);
//         })
//     }

//     // useEffect(()=>{
//     //     let url= "";
//     //     if (mode===1){
//     //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00001/openAddForm";
//     //     }
//     //     open && call_formOpen_api(url, headers)
//     // }, [mode])


//     useEffect(() => {
//         let url = "";
//         let body = {}

//         if (mode === 1) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/openAddForm";
//         }
//         if (mode === 2) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/openEditForm";
//             body = {
//                 apiId: "SUA00434",
//                 mst: {
//                     otpTypCd: rowData.otpTypCd
//                 }
//             }
//         }
//         if (mode === 3) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/openDeleteForm";
//             body = {
//                 apiId: "SUA00433",
//                 mst: {
//                     otpTypCd: rowData.otpTypCd
//                 }
//             }
//         }
//         if (mode === 4) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/openViewForm";
//             body = {
//                 apiId: "SUA00436",
//                 mst: {
//                     otpTypCd: rowData.otpTypCd
//                 }
//             }


//         }

//         { (mode === 1) && open && call_formOpen_api(url, headers) }
//         { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
//     }, [mode])





//     const handleClose = () => {
//         setEdtVal({})
//         onClose();
//     }


//     return (


//         <Dialog open={open} setData={setData} data={data} fullWidth
//             maxWidth="md" >
//             <DialogTitle sx={{ m: 1, p: 2 }} >

//                 {onClose ? (
//                     <IconButton
//                         aria-label="close"
//                         onClick={handleClose}
//                         sx={{
//                             position: 'absolute',
//                             right: 8,
//                             top: 8,
//                             color: (theme) => theme.palette.grey[500],
//                         }}
//                     >
//                         <CloseIcon style={{ color: "black" }} />
//                     </IconButton>
//                 ) : null}
//             </DialogTitle>
//             {/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
//             <DialogContent className="pb-0" >
//                 {/* {msg&&<span>{msg}</span>} */}
//                 <OptTypMasterFrom mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
//                     msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
//                     setParMsg={setParMsg}
//                     parMsgTyp={parMsgTyp}
//                     setParMsgTyp={setParMsgTyp} errExp={errExp}
//                     set_errExp={set_errExp} parErrExp={parErrExp} set_parErrExp={set_parErrExp} />
//             </DialogContent>
//             <DialogActions sx={{ p: "1.25rem" }}>
//                 {/* <Button onClick={onClose}>Cancel</Button> */}
//                 {/* <Button color="secondary" onClick={handleSubmit} variant="contained">
//       Add New
//     </Button> */}
//             </DialogActions>
//         </Dialog>

//     );
// };

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//     !!email.length &&
//     email
//         .toLowerCase()
//         .match(
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//         );
// const validateAge = (age) => age >= 18 && age <= 50;


