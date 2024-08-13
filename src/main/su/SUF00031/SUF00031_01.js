import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { Modal, ModalTitle } from "react-bootstrap";

import CloseIcon from '@mui/icons-material/Close';
import {
    Card,
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
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import { modGrpLovColumns, modLovColumns, codeLovColumns } from "./columns";
import { LastAutoNumberUpdationForm } from "./SUF00031_02";
import MsgAlert from "../../common/MsgAlert";
import FavLink from "../../common/FavLink";

const headers = { Authorization: 'Bearer ' + getApiToken() };
const LastAutoNumberUpdation = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [selectedItem, set_selectedItem] = useState([])
    const [unSelectedItem, set_unSelectedItem] = useState([])
    const [render, setRender] = useState(0);
    const [createModalOpen, setCreateModalOpen] = useState({
        open: false,
        mode: 0,
        rowId: -1,
        row: null,
        rowData: null
    });
    const [queryInputObj, setQueryInputObj] = useState({

        //   modId:'',
        //   cdId:''

    })
    const [modLovObj, setModLovObj] = useState({
        modGrpId: ''
    })
    //Form open api calling
    const [showPage, setShowPage] = useState(false);
    useEffect(() => {
        const openFrom = async () => {
            let obj={
                apiId:'SUA00225'
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00031/openForm", obj,  { headers })
                .then((res) => { setShowPage(res.data)
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                        res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    set_errExp({status:res.data?.appMsgList?.errorStatus})
                 })
        }
        openFrom();
    }, []);
    //Form open api end


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
                apiId:'SUA00161'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00031/getAllModGrp", obj, { headers })
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
        setSelectRowModLov("")
        setSelectRowCodeLov("")
     
    };
    //ModuleGroup Lov ends

    //Mod Lov Starts

    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {

        const modLovObj = {
            apiId:'SUA00162',
            criteria: {
                modGrpId: getModGrpId(selectRow)
            }

        }
        console.log(modLovObj)
        const fetchModLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00031/getModMstByModGrp", modLovObj, { headers })
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
        setSelectRowCodeLov("")
        setQueryInputObj({

            apiId:'SUA00223',
            criteria:{ 
            modId: getModId(rowData),
            cdId: getCodeId(selectRowCodeLov)
        }


        })
    };

    //Mod Lov Ends

    //code Lov Starts

    const [codeLovData, setCodeLovData] = useState([]);
    useEffect(() => {

        const codeLovObj = {
            apiId:'SUA00244',
            criteria: {
                modId: getModId(selectRowModLov)
            }


        }
        console.log()
        const fetchCodeLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00031/getCodeByModId", codeLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCodeLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                });
        };

        fetchCodeLovData();
    }, [selectRowModLov]);


    const getCodeName = (obj) => {
        return codeLovData[Number(Object.keys(obj)[0])]?.cdDesc
    }

    const getCodeId = (obj) => {
        return codeLovData[Number(Object.keys(obj)[0])]?.cdId
    }

    const [selectRowCodeLov, setSelectRowCodeLov] = useState({});
    const [showModelCodeLov, setShowModelCodeLov] = useState(false);
    const handleRowClickCodeLov = (rowData) => {
        setSelectRowCodeLov(rowData);
        setQueryInputObj({
            apiId:'SUA00223',
            criteria:{
            modId: getModId(selectRowModLov),
            cdId: getCodeId(rowData)
        }
    })
    };

    //code Lov Ends

    // Query Start.............
    const [tableData, setTableData] = useState([]);
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00031/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setTableData(res.data?.content?.qryRsltSet)

            }
            else {
                setTableData([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
        }).catch(error => {
            console.log(error);
        })
    }


    const [validationErrors, setValidationErrors] = useState({});



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
                accessorKey: "cdDesc",
                header: "Code Description",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "keyStr",
                header: "Key String",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "lastNo",
                header: "Last No",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },


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
        csvExporter.generateCsv(tableData);
    };

const resetForm=()=>{
    setSelectRow("")
    setSelectRowModLov("")
    setSelectRowCodeLov("")
    setTableData([])
    setMsg("")
    setMsgTyp("")
}
    
  // Conditionally render the component based on the value of showPage
  if (showPage?.appMsgList?.errorStatus==true) {
    return null; // Don't render the component
  } 
    return (
        <>
            <div showPage={showPage}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Last Auto Number Updation</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00031_01
                                        <FavLink />
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> } 
                <div className=" card ">
                    <div className="container">
                        <form id="myForm" onSubmit={postQuery} className="py-4 mx-2">
                            {/* Module Group Lov */}
                            <div className="row mb-2">
                                <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control "
                                            required
                                            value={getModGrpId(selectRow) ? getModGrpId(selectRow) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
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
                            <div className="row mb-2">
                                <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
                                            required
                                            value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
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
                            {/*Code LOV */}
                            <div className="row mb-2">
                                <label className="col-sm-3 col-form-label"><b>Code Id:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelCodeLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
required
                                            value={getCodeId(selectRowCodeLov) ? getCodeId(selectRowCodeLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
                                            value={getCodeName(selectRowCodeLov) ? getCodeName(selectRowCodeLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelCodeLov && <Lov
                                                moduleLovData={codeLovData}
                                                setShowModel={setShowModelCodeLov}
                                                showModel={showModelCodeLov}
                                                handleRowClick={handleRowClickCodeLov}
                                                columns={codeLovColumns}
                                                currentSelection={selectRowCodeLov}
                                                setCurrentSelection={setSelectRowCodeLov}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container text-end mb-2">
                                <button class="btn btn-primary" type="submit">
                                    Query
                                </button>

                                <button
                                    className="btn btn-secondary mx-1"
                                    type="reset"
                                onClick={resetForm}
                                >
                                    Reset
                                </button>

                                {/*  <div className="col-md-1">
            
              </div> */}
                            </div>
                        </form>
                    </div>
                    <div className="container mb-5">
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

                                        })}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip arrow placement="right" title="View">
                                        <IconButton className="text-orange" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 4,
                                            rowData: tableData[row.index],
                                            index: row.index,

                                        })}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>

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
            />

                </div>

            </div>


           
        </>
    );
};

export default LastAutoNumberUpdation;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj }) => {
    

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [msg1, setMsg1] = useState("")
    const [msgTyp1, setMsgTyp1] = useState("")
    const [store, setStore] = useState('')
    const[addVal, setAddVal]=useState([])
    const[edtVal, setEdtVal]=useState([])
    const call_pageOpen_api = async (url, body, headers)=>{
        await axios.post(url, body, {headers} ).then(res=>{
            if(res.data.content){
                setEdtVal(res.data?.content?.mst);
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            
  
        }).catch(error=>{
            console.log(error);
        })
    }


   /*  const call_formOpen_api = async (url,  headers)=>{
        let obj= {
            apiId: "SUA00105"
          }
        await axios.post(url,obj,  {headers} ).then(res=>{
            if(res.data.content){
            setAddVal(res.data.content.mst);
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            
  
        }).catch(error=>{
            console.log(error);
        })
    } */


    useEffect(() => {
        let url = "";
        let body= {}

        //  if(mode === 1) {
        //     url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00002/openAddForm"
        //     open && call_formOpen_api(url, headers)
        // } 
        if(mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00031/openEditForm";
            body=
            {
                apiId: "SUA00224",
                mst:{
                
                    cdId: queryInputObj?.criteria?.cdId,
                    keyStr: rowData?.keyStr,
                    modId: queryInputObj?.criteria?.modId
                    
            }
            
        }
            open && call_pageOpen_api(url,body, headers)
        }
        // if(mode === 3) {
        //     url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00002/openDeleteForm";
        //     body={
        //         apiId: "SUA00114",
        //         mst:{
                
        //                 roleId: rowData.roleId 
                    
        //     }
        // }
        //     open && call_pageOpen_api(url,body, headers)
        // }
        if(mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00031/openViewForm";
            body={
                apiId: "SUA00226",
                mst:{
                
                    cdId: queryInputObj?.criteria?.cdId,
                    keyStr: rowData?.keyStr,
                    modId: queryInputObj?.criteria?.modId
                    
            }
        }
            open && call_pageOpen_api(url,body, headers)
        }

      
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
                <LastAutoNumberUpdationForm  mode={mode} setData={setData}  data={data} rowData={rowData} index={index} queryInputObj={queryInputObj} 
                msg={msg} msg1={msg1}  setMsg={setMsg} setMsg1={setMsg1}  msgTyp={msgTyp} msgTyp1={msgTyp1} setMsgTyp={setMsgTyp} setMsgTyp1={setMsgTyp1}  addVal={addVal} edtVal={edtVal} setEdtVal={setEdtVal}errExp={errExp} set_errExp={set_errExp}  />
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

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
const validateAge = (age) => age >= 18 && age <= 50;