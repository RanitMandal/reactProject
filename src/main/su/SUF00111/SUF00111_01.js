import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Tooltip, } from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import { modGrpLovColumns, modLovColumns } from "./columns";
import UpldDocumentsForm from "./SUF00111_02";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const UpldDocuments = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00493",
        criteria: {
            docNm: "",
            modId: "",
            fromDate: "",
            toDate: ""
        }
    })

    // Open Form
    const [openData, setOpenData] = useState([]);
    useEffect(() => {
        const fetchOpenData = async () => {
            let obj = {
                apiId: "SUA00492"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/openForm', obj, { headers }).then((res) => {
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

    //Mod Lov Starts

    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {

        const modLovObj = {
            apiId: "SUA00140"
        }
        console.log(modLovObj)
        const fetchModLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/getAllModId", modLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    if (res.data?.content?.qryRsltSet?.length) {
                        setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    }
                    //   if(res.data?.appMsgList?.errorStatus){
                    //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                    //   }
                });


        };

        fetchModLovData();
    }, []);


    const getModName = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm : ""
    }

    const getModId = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId : ""
    }


    const [selectRowModLov, setSelectRowModLov] = useState({});
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        setSelectRowModLov(rowData);
        setQueryInputObj({
            apiId: "SUA00493",
            criteria: {
                ...queryInputObj.criteria,
                modId: getModId(rowData)
            }
        });

    };

    //Mod Lov Ends
    //  const [date, set_date] = useState({
    //     fromDate:"",
    //     toDate:""
    // })
    // const handleDateChange =(event)=>{
    //     const name = event.target.name;
    //     const value = event.target.value;
    //     set_date({
    //         ...date,
    //         [name]:value
    //     })
    // }

    // //Date Convert yyyymmdd to ddmmyyyy
    //  const getDateFormart_ddmmyyyy = (yyyymmdd)=>{
    //     console.log(yyyymmdd);
    //     const date = new Date(yyyymmdd);
    //     const month = Number(date.getMonth()) <10? "0"+(date.getMonth()+1): (date.getMonth()+1);
    //     const day = Number(date.getDate()) <10? "0"+(date.getDate()): (date.getDate());
    //     const year = date.getFullYear();
    //     return `${day}/${month}/${year}`
    //   }
    //   let fromDate = getDateFormart_ddmmyyyy(date?.fromDate) 
    //   let toDate = getDateFormart_ddmmyyyy(date?.toDate) 

    // useEffect(() => {
    //     setQueryInputObj({ 
    //         apiId : "SUA00347",
    //         criteria: {
    //             ...queryInputObj.criteria,
    //             "fromDate":fromDate,
    //             "toDate":toDate
    //         }
    //     });
    // }, [fromDate, toDate])


    const handleQueryInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(event.target.name, event.target.value);
        setQueryInputObj({
            apiId: "SUA00493",
            criteria: {
                ...queryInputObj.criteria,
                [name]: value
            }
        });
    };

    // Query Start..............
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/getListPageData', queryInputObj, { headers }).then((res) => {

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
    const [dialogOpen, setDialogOpen] = useState(false);
    const closeDialog = () => {
        setDialogOpen(false);
    };

    const [selectedFileUrl, setSelectedFileUrl] = useState(null);

    const handleFileUrlClick = (fileUrl) => {
        setSelectedFileUrl(fileUrl);
        setDialogOpen(true); // Open the dialog when the link is clicked
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: "docId",
                header: "Document Id",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "docNm",
                header: "Document Name",
                size: 80,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },

            {
                accessorKey: "uploadDt",
                header: "Upload Date",
                size: 240,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "fileNm",
                header: "File Name",
                size: 240,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "actFlgTxt",
                header: "Status",
                size: 240,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "fileUrl",
                header: "File",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                Cell: ({ renderedCellValue, row }) => (
                    <IconButton color="success" onClick={() => handleFileUrlClick(row.original.fileUrl)}>
                      {(row?.original?.fileUrl)? <FileOpenIcon /> : <FileOpenIcon  style={{color:"black"}}/>}
                    </IconButton>
                  
                ),
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
        setSelectRowModLov({})

        setTableData2([])

        setQueryInputObj({
            apiId: "SUA00493",
            criteria: {
                docNm: "",
                modId: "",
                fromDate: "",
                toDate: ""
            }
        })
        setMsg("")
        setMsgTyp("")
    }

    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }


    return (
        <>
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Upload Documents</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00111_01
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
                        &nbsp;
                        {/* <Link
      className="btn btn-success btn-icon text-white"
      to={`${process.env.PUBLIC_URL}/SUF00104_03`}
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
                        <form id="myForm" onSubmit={postQuery} className="py-4" >
                            {/* Module LOV */}
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label"><b>Module:</b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

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

                            {/* Document Name */}
                            <div class="row mb-2 mx-2">

                                <label className="col-md-3 d-flex justify-content-md-cente form-label">Document name:</label>
                                <div className="col-md-6">
                                    <input value={queryInputObj.criteria.docNm} name="docNm" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="Document Name" />
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
                                    <input className="form-control" type="Date" name="fromDate" onChange={handleQueryInputChange} value={queryInputObj?.criteria?.fromDate} />
                                    {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
                                </div>
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-2 col-form-label"
                                >
                                    <b>To Date:</b>
                                </label>
                                <div className="col-md-2">
                                    <input className="form-control" type="Date" name="toDate" onChange={handleQueryInputChange} value={queryInputObj?.criteria?.toDate} />
                                    {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
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
                                            rowData: tableData2[row.index],
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
                                            rowData: tableData2[row.index],
                                            index: row.index,

                                        })}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip arrow placement="right" title="Delete">
                                        <IconButton color="error" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 3,
                                            rowData: tableData2[row.index],
                                            queryInputObj
                                        })}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip arrow placement="right" title="Delete">
                                    <IconButton color="error" onClick={() => setCreateModalOpen({
                                        open: true,
                                        mode: 3,
                                        rowData: tableData2[row.index],
                                        queryInputObj
                                    })}>
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
                {/* fileOpen Dialog */}
                <Dialog open={dialogOpen} onClose={closeDialog} fullWidth
                    maxWidth="md" >
                    <DialogTitle sx={{ m: 1, p: 2 }} >


                        <IconButton
                            aria-label="close"
                            onClick={closeDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="text-center">
                            <img src={process.env.REACT_APP_API_URL_PREFIX + selectedFileUrl} />
                        </div>
                    </DialogContent>
                    {/* <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions> */}
                </Dialog>
            </div>

            <CreateNewAccountModal
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
            />
        </>
    );
};

export default UpldDocuments;

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj }) => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [edtVal, setEdtVal] = useState('')
    const [addVal, setAddVal] = useState('')
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const call_pageOpen_api = async (url, body, headers) => {
        await axios.post(url, body, { headers }).then(res => {
            if (res.data.content) {
                setEdtVal(res.data.content.mst);
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })


        }).catch(error => {
            console.log(error);
        })
    }


    const call_formOpen_api = async (url, headers) => {
        let obj = {
            apiId: "SUA00190"
        }
        await axios.post(url, obj, { headers }).then(res => {
            if (res.data.content) {
                setAddVal(res.data.content.mst);
            }
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
    //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00025/openAddForm";
    //     }
    //     open && call_formOpen_api(url, headers)
    // }, [mode])



    useEffect(() => {
        let url = "";
        let body = {}

        if (mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/openAddForm"
            body = {
                apiId: "SUA00494",
            }
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/openEditForm";
            console.log(queryInputObj)
            console.log(queryInputObj?.criteria?.lvlRefCd)
            body = {
                apiId: "SUA00496",
                mst: {
                    docId: rowData?.docId
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/openDeleteForm";
            body = {
                apiId: "SUA00495",
                mst: {
                    docId: rowData?.docId
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/openViewForm";
            body = {
                apiId: "SUA00497",
                mst: {
                    docId: rowData?.docId
                }
            }
        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])

    const handleClose = () => {
        onClose();
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
                <UpldDocumentsForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} edtVal={edtVal} setEdtVal={setEdtVal} addVal={addVal} errExp={errExp} set_errExp={set_errExp} />
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

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
const validateAge = (age) => age >= 18 && age <= 50;


