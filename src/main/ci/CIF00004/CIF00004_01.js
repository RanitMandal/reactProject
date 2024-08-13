import { MaterialReactTable } from "material-react-table";
import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useEffect, useState, useMemo } from 'react';
import { Delete, Download, Edit, Visibility } from "@mui/icons-material";
import { CourtCasesMaintenanceForm } from "./CIF00004_02";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { ExportToCsv } from "export-to-csv";
import { getApiToken } from "../../common/common"
import CloseIcon from '@mui/icons-material/Close';
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

function CourtCasesMaintenance() {

    const [doc, set_doc] = useState([]);
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "CIA00054"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/openForm', obj, { headers }).then((res) => {
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








    const [tableData, setTableData] = useState([]);
    const resetForm = () => {
        setTableData([])
        setQueryInputObj({
            apiId: "CIA00043",
            criteria: {
                ccaseNo: '',
                ccaseYr: ""
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
        apiId: "CIA00043",
        criteria: {
            ccaseYr: '',
            ccaseNo: ""
        }
    })
    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };
    const [createModalOpen, setCreateModalOpen] = useState({
        open: false,
        mode: 0,
        rowId: -1,
        row: null,
        rowData: null
    });


    const [render, setRender] = useState(0);

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };


    const [validationErrors, setValidationErrors] = useState({});
    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "ccaseId",
                header: "Case Id",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "ccaseNo",
                header: "Case No",
                size: 200,

            },
            {
                accessorKey: "ccaseDesc",
                header: "Case Description",
                size: 200,

            },
            {
                accessorKey: "actFlgTxt",
                header: "Status",
                size: 80,

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

    const handleQueryInputChange = (event) => {
        const { name, value } = event.target;
        if(name==="ccaseYr"){
            setQueryInputObj({
                "apiId": "CIA00043",
                criteria: {
                    ...queryInputObj.criteria,
                    [name]:parseInt(value) ,
                   
                }
            }); 
        }else{
             setQueryInputObj({
            "apiId": "CIA00043",
            criteria: {
                ...queryInputObj.criteria,
                [name]: value,
               
            }
        });
        }
       
    };
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setTableData(res.data?.content.qryRsltSet)


            }
            else {
                setTableData([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
            console.log(msg);
        }).catch(error => {
            console.log(error);
        })
    }

    // const download_file = async (e, row) => {
    //     console.log(row);
    //     const obj = {
    //         apiId: "SUA00580",
    //         mst: {
    //             keyStr: row.chngReqNo,
    //             keyStrVal: row.chngReqDesc,
    //             tabNm: "SUT_CHNG_REQ_HDR"
    //         }
    //     }
    //     // await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",
    //     // obj, {headers})
    //     // .then((res) => {
    //     //  await fetch(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile", 
    //     //  {
    //     //     method: 'POST',
    //     //     headers: {
    //     //       ...headers,
    //     //       'Content-Type': 'application/octet-stream',
    //     //     },
    //     //     body: JSON.stringify(obj)

    //     //   })
    //     //   .then((response) => response.blob())
    //     //   .then((blob) => {
    //     //   // Create blob link to download
    //     //   const url = window.URL.createObjectURL(
    //     //     new Blob([blob]),
    //     //   );
    //     //   const link = document.createElement('a');
    //     //   link.href = url;
    //     //   link.setAttribute(
    //     //     'download'
    //     //   );

    //     //   // Append to html link element page
    //     //   document.body.appendChild(link);

    //     //   // Start download
    //     //   link.click();

    //     //   // Clean up and remove the link
    //     //   link.parentNode.removeChild(link);
    //     // })
    //     await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/downloadTransFileZip", obj, {
    //         headers: {
    //             Authorization: headers?.Authorization,
    //             Accept: "application/zip"
    //         },
    //         responseType: 'arraybuffer',
    //     })
    //         .then((res) => {
    //             const url = window.URL.createObjectURL(
    //                 new Blob([res.data]),
    //             );
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', 'files.zip');
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         }
    //             //   {
    //             //     //fileDownload(res.data, "file.pdf")
    //             //     const url = window.URL.createObjectURL(
    //             //       new Blob([res.data]),
    //             //     );
    //             //     const tempArr = row?.fileDtls?.fileNm?.split(".") || [];
    //             //     const extention = tempArr[tempArr?.length - 1] || "pdf"
    //             //     const link = document.createElement('a');
    //             //     link.href = url;
    //             //     link.setAttribute(
    //             //       'download', row?.fileDtls?.fileId + "." + extention
    //             //     );
    //             //     // Append to html link element page
    //             //     document.body.appendChild(link);

    //             //     // Start download
    //             //     link.click();

    //             //     // Clean up and remove the link
    //             //     //link.parentNode.removeChild(link);
    //             //   }
    //         )
    // }










    return (
        <>

            <div >
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Court Cases Maintenance</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item className="breadcrumb-item" href="#">
                                List Page
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                CIF00004_01
                                <FavLink />
                            </Breadcrumb.Item>
                        </Breadcrumb>
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
                        {/* &nbsp;
                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/SUF00120_03`}
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
                            <div className="row mb-2 mx-2 ">
                                <label
                                    htmlFor="exampleFormControlSelect1"
                                    className="col-sm-3 col-form-label"
                                >
                                    <b>Case No:</b>
                                    {/* <span className="text-red">*</span> */}
                                </label>
                                <div className="col-sm-4 mb-2">
                                    <input value={queryInputObj?.criteria?.ccaseNo} name="ccaseNo" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" />

                                </div>

                            </div>
                            <div className="row mb-2 mx-2 ">
                                <label
                                    htmlFor="exampleFormControlSelect1"
                                    className="col-sm-3 col-form-label"
                                >
                                    <b>Year:<span className="text-red">*</span></b>
                                    {/* <span className="text-red">*</span> */}
                                </label>
                                <div className="col-sm-4 mb-2">
                                    <input value={queryInputObj?.criteria?.ccaseYr} name="ccaseYr" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" required />

                                </div>
                            </div>
                            <div className="container text-end">

                                <button className="btn btn-primary" type="submit">
                                    Query
                                </button>

                                <button
                                    className="btn btn-secondary mx-2"
                                    type="reset"
                                    onClick={(e) => resetForm()}
                                >
                                    Reset
                                </button>



                            </div>
                        </form>

                        <MaterialReactTable
                            displayColumnDefOptions={{
                                "mrt-row-actions": {
                                    muiTableHeadCellProps: {
                                        aglin: "center",
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
                            enableEditing
                            positionToolbarAlertBanner="bottom"
                            onEditingRowSave={handleSaveRowEdits}
                            onEditingRowCancel={handleCancelRowEdits}
                            renderRowActions={({ row, table }) => (
                                <Box sx={{ display: "flex", gap: "1rem" }}>
                                    <Tooltip arrow placement="left" title="Edit">
                                        <IconButton color="success" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 2,
                                            rowData: tableData[row.index],
                                            index: row.index,
                                            queryInputObj
                                            //rowData:[1,2,3]
                                        })}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip arrow placement="right" title="View">
                                        <IconButton color="warning" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 4,
                                            rowData: tableData[row.index],
                                            index: row.index,

                                        })}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip arrow placement="right" title="Delete">
                                        <IconButton color="error" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 3,
                                            rowData: tableData[row.index],
                                            queryInputObj
                                        })}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip arrow placement="right" title="File Download">
                                        <IconButton color="success" onClick={(e) => download_file(e, tableData[row.index])}>
                                            <Download />
                                        </IconButton>
                                    </Tooltip> */}
                                </Box>
                            )}
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


                <CreateModal
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
                />
            </div>
        </>

    );
};

export default CourtCasesMaintenance;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp }) => {


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
            let data = res.data.content.mst
            data.dtl01 = data.dtl01.map(item => {
                return {
                    ...item,
                    action: "U"
                }
            })
            data.dtl02 = data.dtl02.map(item=>{
                return{
                    ...item,
                    action: "U"
                }
            })
            setEdtVal(data)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })

        }).catch(error => {
            console.log(error);
        })
    }

    const call_formOpen_api = async (url, headers) => {
        let obj = {
            apiId: "CIA00044"
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
    //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00001/openAddForm";
    //     }
    //     open && call_formOpen_api(url, headers)
    // }, [mode])


    useEffect(() => {
        let url = "";
        let body = {}

        if (mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/openAddForm";
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/openEditForm";
            body = {
                apiId: "CIA00051",
                mst: {
                    ccaseId: rowData.ccaseId
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/openDeleteForm";
            body = {
                apiId: "CIA00045",
                mst: {
                    ccaseId: rowData.ccaseId
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/openViewForm";
            body = {
                apiId: "CIA00056",
                mst: {
                    ccaseId: rowData.ccaseId
                }
            }


        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])





    const handleClose = () => {
        onClose();
        setMsg("")
        setMsgTyp("")
        set_errExp({...errExp, status:""})
    }


    return (


        <Dialog open={open} setData={setData} data={data} fullWidth
            maxWidth="lg" >
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
                <CourtCasesMaintenanceForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
                    setParMsg={setParMsg} parMsgTyp={parMsgTyp} setParMsgTyp={setParMsgTyp}
                    errExp={errExp} set_errExp={set_errExp} />
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


