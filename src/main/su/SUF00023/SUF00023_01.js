import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {Breadcrumb,Card,Row,} from "react-bootstrap";
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
import { CalendarYearMasterForm } from "./SUF00023_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import {getApiToken} from "../../common/common"
const headers = { Authorization: 'Bearer ' + getApiToken() };

const CalendarYearMaster = () => {

    const [openData, setOpenData] = useState([]);
    useEffect(() => {
      
        console.log(headers)
        const fetchOpenData = async ()=>{
            let body={
                apiId:"SUA00297"
            }
          
            await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/openForm', body, {headers} ).then((res)=>{
              console.log(res.data);
              setOpenData(res.data);
              console.log(openData);
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")":"");
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
              set_errExp({status:res.data?.appMsgList?.errorStatus})
            })
        }
       
        fetchOpenData()
               
      }, [])




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

    // const handleDeleteRow = useCallback(
    //     (row) => {
    //         if (
    //             !window.confirm(
    //                 `Are you sure you want to delete ${row.getValue("firstName")}`
    //             )
    //         ) {
    //             return;
    //         }
    //         //send api delete request here, then refetch or update local table data for re-render
    //         tableData.splice(row.index, 1);
    //         setTableData([...tableData]);
    //     },
    //     [tableData]
    // );

   

    const columns = useMemo(
        () => [
            {
                accessorKey: "yearCd",
                header: "Calendar Year",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 180,
            },
            {
                accessorKey: "startDt",
                header: "Start Date",
                size: 90,
               
            },
            {
                accessorKey: "endDt",
                header: "End Date",
                size: 90,
              
            }

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

    const resetForm = () => {
          
        setQueryInputObj({
            ...queryInputObj,
            criteria: {
                yearCd: ''
            }})
       
        };
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId:"SUA00293",
        criteria: {
            yearCd: ''
        }
    })
    const handleQueryInputChange = (event) => {
        setQueryInputObj({ 
            ...queryInputObj,
            criteria: {
                ...queryInputObj.criteria,
                [event.target.name]: event.target.value
            }
        });
      };


    const postQuery = async (e)=>{
        e.preventDefault()
        
        await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/getListPageData',queryInputObj, {headers}).then((res)=>{
            
            if(res.data?.content?.qryRsltSet?.length){
                setTableData(res.data?.content?.qryRsltSet)
                    
            }
            else{
                setTableData([])     
            }
           
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")":"");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
        }).catch(error=>{
            console.log(error);
        })
    }

    return (
        <>

            <div>
            <div className="page-header">
        <div>
          <h1 className="page-title">Calendar Year</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
            List Page
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              SUF00023_01
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
                    <Link
      className="btn btn-success btn-icon text-white"
      to={`${process.env.PUBLIC_URL}/SUF00023_03`}
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Add Multiple
    </Link>

                    </div>
                 
      </div>
      {msg &&  <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> } 
              
                
        <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Body>
              <Row>
              <div className="col-lg-12 col-md-12">
                    <form onSubmit={postQuery} id="myForm" className="py-4">
                        <div className="row mb-2 mx-2 ">
                            <label
                                htmlFor="exampleFormControlSelect1"
                                className="col-sm-3 col-form-label"
                            >
                                <b>Calendar Year :</b>
                                {/* <span className="text-red">*</span> */}
                            </label>
                            <div className="col-sm-4 mb-2">
                                <input value={queryInputObj.criteria.yearCd} name="yearCd" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="Calendar Year"  />

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
                                <Tooltip arrow placement="right" title="Delete">
                                    <IconButton color="warning" onClick={() => setCreateModalOpen({
                                        open: true,
                                        mode: 4,
                                        rowData: tableData[row.index],
                                        index: row.index,
                                        
                                    })}>
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow placement="right" title="View">
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
                maxWidth="1200px"
                parMsg={msg}
                ParMsgTyp={msgTyp}
                parErrExp={errExp}
                set_parErrExp={set_errExp}
            />
            </div>
        </>
        
    );
};

export default CalendarYearMaster;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsgTyp, parMsg, setParMsg, setParMsgTyp, parErrExp, set_parErrExp }) => {
    

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
          setEdtVal(res.data.content.mst)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
          set_errExp({status:res.data?.appMsgList?.errorStatus})
    
        }).catch(error => {
          console.log(error);
        })
      }
    
      const call_formOpen_api = async (url, headers) => {
        let obj = {
          apiId: "SUA00294"
        }
        await axios.post(url, obj, { headers }).then(res => {
          setAddVal(res.data.content.mst)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
          set_errExp({status:res.data?.appMsgList?.errorStatus})
    
        }).catch(error => {
          console.log(error);
        })
      }


    useEffect(() => {
        let url = "";
        let body= {}

        if(mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00023/openAddForm"
            // body= {
            //     apiId:"SUA00077"
            // }
        }
        if(mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00023/openEditForm";
            body={
                apiId:"SUA00296",
                mst: 
                    
                    {
                        yearCd: rowData.yearCd 
                    }
                
            }
        }
        if(mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00023/openDeleteForm";
            body={
                apiId:"SUA00295",
                mst: 
                    {
                        yearCd: rowData.yearCd 
                    }
                
            }
        }
        if(mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX +"/SUF00023/openViewForm";
            body={
                apiId:"SUA00298",
                mst: 
                    {
                        yearCd: rowData.yearCd 
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
                <CalendarYearMasterForm  mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj} 
                msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setAddVal={setAddVal} edtVal={edtVal} setEdtVal={setEdtVal} setParMsg={setParMsg} 
                setParMsgTyp={setParMsgTyp} parMsg={parMsg} parMsgTyp={parMsgTyp} errExp={errExp} set_errExp={set_errExp} parErrExp={parErrExp} set_parErrExp={set_parErrExp} />
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


