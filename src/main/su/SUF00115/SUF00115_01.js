import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
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
import  ApiMasterForm  from "./SUF00115_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import {decodeFullForm} from "../../common/decode"
import Lov from "../../common/Lov";
import { moduleLovColumns, formLovColumns } from "./columns";
import FavLink from "../../common/FavLink";

const headers = { Authorization: 'Bearer ' + getApiToken() };

const ApiMaster = () => {

    const [openData, setOpenData] = useState([]);
    useEffect(() => {
      
        console.log(headers)
        const fetchOpenData = async ()=>{
            const openFormObj = {
                apiId : "SUA00264"
             
            }
          
            await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00115/openForm', openFormObj, {headers} ).then((res)=>{
              console.log(res.data);
              setOpenData(res.data);
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc? 
                res?.data?.appMsgList?.list[0]?.errDesc+" ("+ res?.data?.appMsgList?.list[0]?.errCd+")": "");
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            })
        }
       
        fetchOpenData()
               
      }, [])

 //Module Lov Starts     
      
      const [moduleLovData, setModuleLovData] = useState([]);
      useEffect(() => {
        const modLovObj = {
          apiId : "SUA00258"
        //   criteria: {
                 
        //       }
        
      }
        const fetchModuleLovData = async () => {
          await axios
            .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/getAllModMst", modLovObj, {headers} )
            .then((res) => {
              console.log(res.data);
              setModuleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
              
            });
        };
        fetchModuleLovData();
      }, []);
    
    
      const getModuleName = (obj)=>{
        return moduleLovData[Number(Object.keys(obj)[0])]?.modNm
      }
      
      const getModuleId = (obj)=>{
        return moduleLovData[Number(Object.keys(obj)[0])]?.modId
      }
     
    
      const [selectRow, setSelectRow] = useState("");
      const [showModel, setShowModel] = useState(false);
      const handleRowClick = (rowData) => {
        setSelectRow(rowData);
        setSelectRowFormLov({});
        setQueryInputObj({ 
            apiId : "SUA00260",
          criteria: {
              ...queryInputObj.criteria,
              modId: getModuleId(rowData),
              
          }
      })
      };
//Module Lov ends

//Form Lov Starts

const [formLovData, setFormLovData] = useState([]);
useEffect(() => {
  const formLovObj = {
    apiId : "SUA00259",
    criteria: {
           modId: getModuleId(selectRow)
        }  
  }
  const fetchFormLovData = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/getFormMstByModMst", formLovObj, {headers} )
      .then((res) => {
        console.log(res.data);
        setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
      });
  };

  selectRow && fetchFormLovData();
}, [selectRow]);


const getFormName = (obj)=>{
  return formLovData[Number(Object.keys(obj)[0])]?.formNm
}

const getFormId = (obj)=>{
  return formLovData[Number(Object.keys(obj)[0])]?.formId
}


const [selectRowFormLov, setSelectRowFormLov] = useState("");
const [showModelFormLov, setShowModelFormLov] = useState(false);
const handleRowClickFormLov = (rowData) => {
  setSelectRowFormLov(rowData);
  setQueryInputObj({ 
    apiId : "SUA00260",
    criteria: {
        ...queryInputObj.criteria,
        formId: getFormId(rowData)
    }
})
};

//Form Lov Ends

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
            accessorKey: "apiId",
            header: "API Id",
            enableColumnOrdering: true,
            size: 4,
          },
    
          {
            accessorKey: "apiNm",
            header: "API Name",
            enableColumnOrdering: true,
            size: 100,
            
          },
          {
            accessorKey: "apiDesc",
            header: "API Description",
            enableColumnOrdering: true,
            size: 100,
          },
          {
            accessorKey: "apiTypTxt",
            header: "API Type",
            enableColumnOrdering: true,
            size: 4,
          },
    
          {
            accessorKey: "apiUrl",
            header: "API Url",
            enableColumnOrdering: true,
            size: 4,
          },
        //   {
        //     accessorKey: "apiCatCd",
        //     header: "API CATEGORY CODE",
        //     enableColumnOrdering: true,
        //     size: 4,
        //   },
        //   {
        //     accessorKey: "apiCatNm",
        //     header: "API CATEGORY NAME",
        //     enableColumnOrdering: true,
        //     size: 4,
        //   },
    
          {
            accessorKey: "modId",
            header: "Module Id",
            enableColumnOrdering: true,
            size: 4,
          },
          {
            accessorKey: "modNm",
            header: "Module Name",
            enableColumnOrdering: true,
            size: 4,
          },
          {
            accessorKey: "formId",
            header: "Form Id",
            enableColumnOrdering: true,
            size: 4,
          },
          {
            accessorKey: "formNm",
            header: "Form Name",
            enableColumnOrdering: true,
            size: 4,
          },
          
          {
            accessorKey: "actFlgTxt",
            header: "Status",
            enableColumnOrdering: true,
            size: 4,
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
        useKeysAsHeaders: true,
        headers: columns.map((c) => c.header),
    };

    //csv files
    const csvExporter = new ExportToCsv(csvOptions);

    //functions
    const handleExportRows = (rows) => {
        console.log(rows);
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        const fileheader = columns
        const requireData = tableData.map((item, index)=>{
            let tableObj = {}
            for(let i=0; i<fileheader.length; i++){
                tableObj = {
                    ...tableObj,
                    [fileheader[i].header]: item[fileheader[i].accessorKey]
                }
            }
            return tableObj
        }) 
        csvExporter.generateCsv(requireData);
    };

   
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [queryInputObj, setQueryInputObj] = useState({
        apiId : "SUA00260",
        criteria: {
            modId: "",
            formId: "",
            apiNm: ""
        }
    })
    const handleQueryInputChange = (event) => {
      console.log(event.target.name, event.target.value);
        setQueryInputObj({ 
            apiId : "SUA00260",
            criteria: {
                ...queryInputObj.criteria,
                [event.target.name]: event.target.value
            }
        });
      };


    const postQuery = async (e)=>{
        e.preventDefault()
        if(!selectRow){
          setMsgTyp("VE")
          setMsg("Please Select Module")
          return
        }
        
        await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00115/getListPageData',queryInputObj, {headers}).then((res)=>{
            
            if(res.data?.content?.qryRsltSet?.length){
                setTableData(res.data?.content?.qryRsltSet)
                // setTableData(res?.data?.content?.qryRsltSet.map(item=>{
                //     return{
                //       ...item,
                //       apiTypTxt: decodeFullForm(item.apiTyp), 
                //       actFlgTxt: decodeFullForm(item.actFlg)
                      
                //     }
                //   }));
                    
            }
            else{
                setTableData([])     
            }
           
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")":"");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        }).catch(error=>{
            console.log(error);
        })
    }

    const resetForm = () => {
        setSelectRow({}) 
        setSelectRowFormLov({}) 
        setQueryInputObj({
            apiId : "SUA00260",
            criteria: {
                modId: '',
                formId: '',
                apiNm: ''
            }})
            setTableData([])
       
        };

    return (
        <>

            <div>
            <div className="page-header">
        <div>
          <h1 className="page-title">API Master</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
            List Page
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              SUF00115_01
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
                        &nbsp;
                    {/* <Link
      className="btn btn-success btn-icon text-white"
      to={`${process.env.PUBLIC_URL}/SUF00115_03`}
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Add Multiple
    </Link> */}

                    </div>
                 
      </div>
      {msg && msgTyp==="AI" && <div className="card">
                   
                    <Alert variant="success">
          <span className="alert-inner--icon">
          <i className="fa fa-bell-o me-2" aria-hidden="true"></i></span>&nbsp;
      <strong>{msg}</strong>
    </Alert>

                </div>} 
                {msg && msgTyp!=="AI" && <div className="card">
                  
                   <Alert variant="danger">
         <span className="alert-inner--icon">
         <i className="fe fe-slash"></i></span>&nbsp;
     <strong>{msg}</strong>
   </Alert>

               </div>}  
              
                
        <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Body>
              <Row>
              <div className="col-lg-12 col-md-12">
                    <form onSubmit={postQuery} id="myForm" className="py-4">
                    <div className="row mb-2 mx-2 ">
                      <label  className="col-sm-3 col-form-label"><b>Module:</b><span className="text-red">*</span></label>
                      <div className="col-md-6">
                        <div className="input-group">
                        <span className="input-group-text bg-primary">                            
                        <i
                              className="fa fa-search d-inline text-white"                              
                              onClick={()=> setShowModel(true)}
                            />
                          </span>                          
                          <input
                            type="text"
                            autoComplete="false"
                            //className="form-control-lov-cd"
                            className="form-control col-md-2 rouned"
                            value={getModuleId(selectRow)? getModuleId(selectRow): "" }
                            readOnly
                            required
                          />
                          <input
                            type="text"
                            autoComplete="false"
                            className="form-control mx-4"
                            value={getModuleName(selectRow)? getModuleName(selectRow): "" }
                            readOnly
                          />
                           <div className="row-mb-12">
                                {showModel && <Lov 
                                moduleLovData={moduleLovData} 
                                setShowModel={setShowModel} 
                                showModel={showModel}
                                handleRowClick={handleRowClick}
                                columns={moduleLovColumns}
                                currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                                />}
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-2 mx-2 ">
                      <label  className="col-sm-3 col-form-label"><b>Form:</b></label>
                      <div className="col-md-6">
                        <div className="input-group">
                        <span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                              
                              onClick={()=> setShowModelFormLov(true)}
                            />
                          </span>
                          
                          <input
                            type="text"
                            autoComplete="false"
                            //className="form-control-lov-cd"
                            className="form-control col-md-2 rouned"
                            value={getFormId(selectRowFormLov)? getFormId(selectRowFormLov): "" }
                            readOnly
                           
                          />
                          <input
                            type="text"
                            autoComplete="false"
                            className="form-control mx-4"
                            value={getFormName(selectRowFormLov)? getFormName(selectRowFormLov): "" }
                            readOnly
                          
                          />
                           <div className="row-mb-12">
                                {showModelFormLov && <Lov 
                                moduleLovData={formLovData} 
                                setShowModel={setShowModelFormLov} 
                                showModel={showModelFormLov}
                                handleRowClick={handleRowClickFormLov}
                                columns={formLovColumns}
                                currentSelection={selectRowFormLov}
                                setCurrentSelection={setSelectRowFormLov}
                                />}
                            </div>
                        </div>
                      </div>
                    </div>
                        <div className="row mb-2 mx-2 ">
                          
                            <label
                                htmlFor="exampleFormControlSelect1"
                                className="col-sm-3 col-form-label"
                            >
                                <b>API Name:</b>
                                
                            </label>
                            <div className="col-sm-4 mb-2">
                                <input value={queryInputObj.criteria.apiNm} name="apiNm" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="API Name"  />

                            </div>

                            <div className="col-sm-4">

                                <button className="btn btn-primary" type="submit">
                                    Query
                                </button>

                                <button
                                    className="btn btn-secondary mx-2"
                                    type="reset"
                                    onClick={(e)=>resetForm()}
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
                </Row>
                </Card.Body>
                </Card>

            </div>
            </Row>

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
                
            />
            </div>
        </>
        
    );
};

export default ApiMaster;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj  }) => {
    

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [defaultData, setDefaultData] = useState("")
    const [openPageData, setOpenPageData] = useState("")
    const [editFormData, setEditFormData] = useState({
        apiReqStruc:"",
        apiResStruc:"",
        apiReqStrucSl:"",
        apiResStrucSl:"",

    })

    const call_pageOpen_api = async (url, body, headers)=>{
        console.log("call_pageOpen_api");
        
        await axios.post(url, body, {headers} ).then(res=>{
            if(mode !== 1) { 

                setEditFormData({
                    apiReqStruc: res?.data?.content?.mst01?.reqStr,
                    apiReqStrucSl: res?.data?.content?.mst01?.slNo,                
                    apiResStruc: res?.data?.content?.mst02?.resStr,
                    apiResStrucSl:res?.data?.content?.mst02?.slNo
                })
                setOpenPageData(
                    res?.data?.content?.mst
                )
            }
            setDefaultData(
                res?.data?.content?.mst
            )
            setMsg("");
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")":"");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
           
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(() => {
        let url = "";
        let body= {}

        if(mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/openAddForm";
            body={
                apiId : "SUA00261"   
            }
        }
        if(mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/openEditForm";
            body={
                apiId : "SUA00263",
                mst: 
                    {
                        apiId: rowData.apiId 
                    }
                
            }
        }
        if(mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/openDeleteForm";
            body={
                apiId : "SUA00262",
                mst: 
                    {
                        apiId: rowData.apiId 
                    }
                
            }
        }
        if(mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00115/openViewForm";
            body={
                apiId : "SUA00265",
                mst: 
                    {
                        apiId: rowData.apiId 
                    }
                
            }
        }

      open && call_pageOpen_api(url,body, headers, mode)
    }, [mode])

   
    const handleClose = () => {
        setEditFormData({
            apiReqStruc: "",
            apiReqStrucSl: "",                
            apiResStruc: "",
            apiResStrucSl:""
        })
        onClose();
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
            </DialogTitle >
            
            {/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
            <DialogContent className="pb-0" >
            {/* {msg&&<span>{msg}</span>} */}
                <ApiMasterForm  mode={mode} setData={setData} data={data} rowData={rowData} onClose={onClose} index={index} queryInputObj={queryInputObj} 
                msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} editFormData={editFormData} setEditFormData={setEditFormData} defaultData={defaultData} setDefaultData={setDefaultData} openPageData={openPageData} setopenPageData={setOpenPageData} />
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


