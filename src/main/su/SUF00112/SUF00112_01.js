import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Modal, ModalTitle } from "react-bootstrap";
import {
    Box,
    Button,
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
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import Lov from "../../common/Lov _new";
import { modLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
import FavLink from "../../common/FavLink";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const SearchDocument = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00501",
        criteria: {
          modId: ""
        }
      })

// Open Form
const [openData, setOpenData ]= useState([]);
    useEffect(()=>{
        const fetchOpenData = async ()=>{
            let obj={
                apiId:"SUA00502"
            }

            await axios.post (process.env.REACT_APP_API_URL_PREFIX + '/SUF00112/openForm', obj, {headers}).then((res)=>{
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
    },[])


//State Lov Starts     
      
const [modLovData, setModLovData] = useState([]);
useEffect(() => {

  const fetchModLovData = async () => {
    let obj={
        apiId:"SUA00526"
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00112/getAllModMst",obj, {headers} )
      .then((res) => {
        console.log(res.data);
        setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
        // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
        //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        
      });
  };
  fetchModLovData();
}, []);


const getModNm = (obj)=>{
  return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm:""
}

const getModCd = (obj)=>{
  return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId:""
}

const [selectRow, setSelectRow] = useState("");
const [selectRowModLov, setSelectRowModLov] = useState("");
const [showModelModLov, setShowModelModLov] = useState(false);
const handleRowClickModLov = (rowData) => {
 console.log(rowData)
 setSelectRow(rowData);
  setSelectRowModLov(rowData);
  setQueryInputObj({
    apiId: "SUA00501",
    criteria: {
      modId: getModCd(rowData)
    }
  })
};
//State Lov ends   

// Query Start..............
const postQuery = async (e)=>{
    e.preventDefault()
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00112/getListPageData',queryInputObj, {headers}).then((res)=>{
        
        if(res.data?.content?.qryRsltSet?.length){
            setTableData2(res.data?.content?.qryRsltSet)
                
        }
        else{
            setTableData2([])     
        }
       
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        
    }).catch(error=>{
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
                header: "Document Code",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "docNm",
                header: "Document Name",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "fileNm",
                header: "File Name",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "fileTypTxt",
                header: "File Type",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "fileSz",
                header: "File Size",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "actFlgTxt",
                header: "Status",
                size: 40,
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
        setSelectRowModLov("");
        setSelectRow("")
        setTableData2([])
        setQueryInputObj({
            apiId: "SUA00501",
            criteria: {
              modId: ""
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
                        <h1 className="page-title">Search Document</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00112_01
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
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }   


                <div className="card">
                <div className="container-fluid mb-5">
                    <form id="myForm" onSubmit={postQuery} className="py-4" >
                    <div className="row mb-3 mx-4">
                      <label  className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                      <div className="col-md-6">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            
                            className="form-control col-md-2 rouned"
                            required
                            value={getModCd(selectRowModLov)?getModCd(selectRowModLov):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getModNm(selectRowModLov)?getModNm(selectRowModLov):''}
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

export default SearchDocument;

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


