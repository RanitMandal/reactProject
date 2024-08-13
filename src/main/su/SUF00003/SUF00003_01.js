import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { Modal, ModalTitle } from "react-bootstrap";
import {
  Button,
  Dialog,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import {EventMasterForm} from "./SUF00003_02";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Lov from "../../common/Lov _new";
import MsgAlert from "../../common/MsgAlert";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import { getApiToken } from "../../common/common";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import FavLink from "../../common/FavLink";
const headers = { Authorization: "Bearer " + getApiToken() };
const EventMaster = () => {

  //Form open api calling
  const [showPage, setShowPage] = useState(true);
  const [openData, setOpenData] = useState([]);
  let openForm_post_obj = {
    apiId: "SUA00131",
  }
  useEffect(() =>{
    const openFrom = async () =>{
      await axios.post( process.env.REACT_APP_API_URL_PREFIX+"/SUF00003/openForm", openForm_post_obj, {headers})
      .then((res) =>{
        setShowPage(res.data?.content?.criteria);
        setOpenData(res.data?.content?.criteria);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
    }
    openFrom();
  },[]); 
//Form open api end
 
  
  //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  useEffect(() => {
    const modGrpLovObj = {
        apiId : "SUA00173",
       
    } 
    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/getAllModGrp",modGrpLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleGrpLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
         /*  setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp( res?.data?.appMsgList?.list[0]?.errType ); */
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getModuleGrpName = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm;
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId;
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModuleLov({});
      /* setQueryInputObj({ 
        criteria: {
            ...queryInputObj.criteria,
            modGrpId: getModuleGrpId(rowData),
            
        }
    })  */
  };
  //Module Group Lov ends


  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00174",
      criteria: {
      modGrpId: getModuleGrpId(selectRow),
      }
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
            "/SUF00003/getModMstByModGrp",
          formLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        /*   setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };

    selectRow && fetchModuleLovData();
  }, [selectRow]);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm;
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId;
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
   
  };

  //module Lov Ends
useEffect(() => {
  setQueryInputObj({
      
    apiId: "SUA00130",
    criteria: {
      ...queryInputObj?.criteria,
    modId: getModuleId(selectRowModuleLov),

    }
 
}); 
}, [selectRowModuleLov])

 
//function to rest lovs
const resetForm = () => {
  setSelectRow({}) 
  setSelectRowModuleLov({}) 
  setQueryInputObj({
    apiId: "SUA00130",
    criteria: {
  
      
    modId: "",
    actFlg: "L",
    }})
    setTableData([]);
    setMsg("");
    setMsgTyp("");
  /*  const Form = document.getElementById('myForm')
    Form.reset(); */

 
  };


  const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
      status: true,
      content: ""
  })
    const [queryInputObj, setQueryInputObj] = useState({
      apiId: "SUA00130",
      criteria: {
    
        
      modId: "",
      actFlg: "L",
      }
      
      
  
})

const handleSelectChange = (event) => {
  setQueryInputObj({
   apiId: "SUA00130",
  criteria: {
    ...queryInputObj.criteria,
    actFlg: event.target.value,
  }
  });
};

    const handleQueryInputChange = (event) => {
      console.log(event.target.name, event.target.value);
        setQueryInputObj({ 
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
        
        await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00003/getListPageData',queryInputObj, {headers}).then((res)=>{
            
            if(res.data?.content?.qryRsltSet?.length){
                setTableData(res.data?.content?.qryRsltSet)
                    
            }
            else{
                setTableData([])     
            }
           
            setMsg(
              res.data?.appMsgList?.list[0]?.errDesc
                ? res.data?.appMsgList?.list[0]?.errDesc +
                    ' (' +
                    res.data?.appMsgList?.list[0]?.errCd +
                    ')'
                : ''
            );
            
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
        }).catch(error=>{
            console.log(error);
        })
    }






  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null,
  });
  const [render, setRender] = useState(0);

  const [validationErrors, setValidationErrors] = useState({});

  // const [createModalOpen, setCreateModalOpen] = useState(false);
  const [approval, setApproval] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchText2, setSearchText2] = useState("");

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [tableData, setTableData] = useState([]);
 // const [tableData2, setTableData2] = useState(data);
  //const [tableData4, setTableData4] = useState(data);

  const [filteredData, setFilteredData] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);

  // const [selectRow, setSelectRow] = useState(null);
  const [selectRow2, setSelectRow2] = useState(null);

  



 /*  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);
 */
  // useEffect(() => {
  //   // Update the filtered data when the table data changes
  //   setFilteredData2(tableData2);
  // }, [tableData2]);

 /*  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(tableData);
      setFilteredData(tableData);
      setSearchText("");
    }
  }, [open]);  */

  // useEffect(() => {
  //   // Reset the table data when the modal is closed
  //   if (!open2) {
  //    // setTableData2(data);
  //    // setFilteredData2(data);
  //    // setSearchText2("");
  //   }
  // }, [open2]);

  const handleReset = () => {
    setSelectRow(null);
    setSearchText("");
    setSelectRow2(null);
    setSearchText2("");
    setApproval(false);
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

  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
};



  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "evtId",
        header: "EventId",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: "evtNm",
        header: "Event Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "evtDesc",
        header: "Event Description",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "actFlgTxt",
        header: "Status",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);



/*    // Conditionally render the component based on the value of showPage
  if (showPage==false) {
    return null; // Don't render the component
  }  */
  return (
    <>
    
      <div >
        <div className="page-header">
          <div>
            <h1 className="page-title"> Event Master </h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00003_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto pageheader-btn">
            <a
              className="btn btn-primary btn-icon text-white"
             // to={`${process.env.PUBLIC_URL}/SUF00003_03`}
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
                <i className="fe fe-plus"/>
                &nbsp;
              </span>
              Add New
            </a>
            &nbsp;
            <Link
      className="btn btn-success btn-icon text-white"
      to={`${process.env.PUBLIC_URL}/SUF00003_03`}
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Add Multiple
    </Link>
            
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }
        <div className="card">
        <div className="container-fluid mb-5">
          <form id="myForm" onSubmit={postQuery}>
           
              <div className="row my-2 mx-4">
                <label
                  for="exampleFormControlSelect1"
                  className="col-sm-3 col-form-label"
                >
                  <b>
                    Module Group:<span className="text-red">*</span>
                  </b>
                </label>
                <div className="col-md-6">
                  <div class="input-group">
                    {/*                                         <span class="input-group-text border-primary" id=""><i className="fa fa-search d-inline" title="" onClick={() => openModal()} /></span>
                                        <input type="text" class="form-control col-md-2 rounded-3" value={selectRow?.modGrpCode || ''} placeholder="Module Group Code" readOnly />
                                        <input type="text" class="form-control col-md-6 rounded-3 mx-2" value={selectRow?.modGrpName || ''} placeholder="Module Group Name" readOnly /> */}
                    <span className="input-group-text bg-primary">
                      <i
                        className="fa fa-search d-inline text-white"
                       
                        onClick={() => setShowModel(true)}
                      />
                    </span>

                    <input
                      type="text"
                      autoComplete={false}
                      className="form-control "

                       value={getModuleGrpId(selectRow)? getModuleGrpId(selectRow): "" }
                       
                    />
                    <input
                      type="text"
                      autoComplete={false}
                      className="form-control mx-4"

                       value={getModuleGrpName(selectRow)? getModuleGrpName(selectRow): "" }
                    />

                    <div className="row-mb-12">
                      {showModel && (
                        <Lov
                          moduleLovData={moduleGrpLovData}
                          setShowModel={setShowModel}
                          showModel={showModel}
                          handleRowClick={handleRowClick}
                          columns={moduleGrpLovColumns}
                          currentSelection={selectRow}
                          setCurrentSelection={setSelectRow}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="row my-2 mx-4">
                <label
                  for="exampleFormControlSelect1"
                  className="col-sm-3 col-form-label"
                >
                  <b>
                    Module:<span className="text-red">*</span>
                  </b>
                </label>
                <div className="col-md-6">
                  <div class="input-group">
                    {/*                                         <span class="input-group-text border-primary" id=""><i className="fa fa-search d-inline" title="" onClick={() => openModal2()} /></span>
                                        <input type="text" class="form-control col-md-2 rounded-3" name="modCode" value={selectRow2?.modCode || ''} placeholder="Module Code" readOnly />
                                        <input type="text" class="form-control col-md-6 rounded-3 mx-2" name="modName" value={selectRow2?.modName || ''} placeholder="Module Name" readOnly /> */}
                    <span className="input-group-text  bg-primary">
                            
                            <i
                              className="fa fa-search d-inline text-white"
                             
                              onClick = {()=> setShowModelModuleLov(true)}
                            />
                          </span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control "
                            
                            value={getModuleId(selectRowModuleLov)? getModuleId(selectRowModuleLov): "" }
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            value={getModuleName(selectRowModuleLov)? getModuleName(selectRowModuleLov): "" }
                          />
                          <div className="row-mb-12">
                     {showModelModuleLov && <Lov 
                                moduleLovData={moduleLovData} 
                                setShowModel={setShowModelModuleLov} 
                                showModel={showModelModuleLov}
                                handleRowClick={handleRowClickModuleLov}
                                columns={moduleLovColumns}
                                currentSelection={selectRowModuleLov}
                                setCurrentSelection={setSelectRowModuleLov}
                                />}
                                </div>
                  </div>
                </div>
               
              </div>
              <div className="row mb-2 mx-4 ">

<label className="col-md-3 mx-1 d-flex justify-content-md-cente form-label">Status:</label>

<select
 /*  className="form-select col-md-3 mx-2 border rounded-3" */
 className="form-select col-md-3 mx-1"
  aria-label="Default select example"
  name="actFlg"
  defaultValue="A"
  value={queryInputObj.actFlg}
  onChange={handleSelectChange}
>
  
{openData?.ddActFlg?.map((option) => (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
  
</select>


</div>

          
            <div className="container text-end mb-2">
              <button
                class="btn btn-primary"
                type="submit"
               // onClick={handleClick}
              >
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
           // data={approval && tableData4}
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
                  <IconButton
                    color="success"
                    onClick={() =>
                      setCreateModalOpen({
                        // open: true,
                        // mode: 2,
                        // rowData: tableData[row.index],
                        // index: row.index,
                        open: true,
                        mode: 2,
                        rowData: tableData[row.index],
                        index: row.index,
                        queryInputObj,
                        selectRow,
                        //rowData:[1,2,3]
                      })
                    }
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="View">
                  <IconButton
                    color="warning"
                    onClick={() =>
                      setCreateModalOpen({
                        open: true,
                        mode: 4,
                        rowData: tableData[row.index],
                        index: row.index,
                      })
                    }
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton
                    color="error"
                    onClick={() =>
                      setCreateModalOpen({
                        open: true,
                        mode: 3,
                        rowData: tableData[row.index],
                        queryInputObj,
                      })
                    }
                  >
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
                    onClick = {handleExportData}
                    startIcon = {<FileDownloadIcon />}
                    variant="contained"
                  >
                    Export All Data
                  </Button>
                  <Button
                    className="btn btn-primary fs-10"
                    disabled={
                      table.getPrePaginationRowModel().rows.length === 0
                    }
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
      

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen.open}
        onClose={() =>
          setCreateModalOpen({
            open: false,
            mode: 0,
            rowId: -1,
            rowData: null,
          })
        }
        render={render}
        setRender={setRender}
        onSubmit={handleCreateNewRow}
        mode={createModalOpen.mode}
        rowId={createModalOpen.rowId}
        data={tableData}
        setData={setTableData}
        rowData={createModalOpen.rowData}
        queryInputObj={queryInputObj}
        setQueryInputObj = {setQueryInputObj}
        parErrExp={errExp}
        set_parErrExp={set_errExp}
      />
    </>
  );
};

export default EventMaster;
//example of creating a mui dialog modal for creating new rows
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
  setQueryInputObj,
  parErrExp, set_parErrExp
}) => {
  /* const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  ); */
  
    const [msg, setMsg] = useState("");
    const [msgTyp, setMsgTyp] = useState("");
    const [errExp, set_errExp] = useState({
      status: true,
      content: ""
  })
    const [editVal, setEditVal] = useState({});
    const updateEditVal = (newEditVal) => {
      setEditVal(newEditVal);
    };
    const [addVal, setAddVal]=useState([])
    const call_pageOpen_api = async (url, body, headers) => {
      await axios
        .post(url, body, { headers })
        .then((res) => {
          setEditVal(res.data?.content?.mst)
          setMsg(
            data?.appMsgList?.list[0]?.errDesc? data?.appMsgList?.list[0]?.errDesc +
              " (" +
              data?.appMsgList?.list[0]?.errCd +
              ")":""
          );
          setMsgTyp(data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const call_formOpen_api = async (url, headers, body) => {
      await axios
        .post(url, body, { headers })
        .then((res) => {
          setAddVal(res.data?.content?.mst);
          setMsg(
            data?.appMsgList?.list[0]?.errDesc? data?.appMsgList?.list[0]?.errDesc +
              " (" +
              data?.appMsgList?.list[0]?.errCd +
              ")":""
          );
          setMsgTyp(data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
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
        url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/openAddForm";
        body = {
          apiId: "SUA00132",
        }
        open && call_formOpen_api(url, headers, body);
      }
     
      if (mode === 2) {
        url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/openEditForm";
        body = {
          
            apiId: "SUA00134",
            mst: {
          evtId: rowData.evtId,
          modId: queryInputObj.criteria.modId
            }
        };
        //console.log(rowData.cdId);
        //console.log(queryInputObj.modId);
        open && call_pageOpen_api(url, body, headers);
      }
      if (mode === 3) {
        url =
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/openDeleteForm";
        body = {
          apiId: "SUA00137",
          mst: {
          evtId: rowData.evtId,
          modId: queryInputObj.criteria.modId
          }
        };
        open && call_pageOpen_api(url, body, headers);
      }
      if (mode === 4) {
        url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/openViewForm";
        body = {
          apiId: "SUA00136",
          mst: {
          evtId: rowData.evtId,
          modId: queryInputObj.criteria.modId
          }
        };
        open && call_pageOpen_api(url, body, headers);
      }
  
     
      
      
      
    }, [mode]);

  /* const handleSubmit = () => {
    //put your validation logic here
    //onSubmit(values);
    onClose();
  }; */
  const handleClose = () => {
    onClose();
  };
  // const [dlgElem, setDlgElem] = useState();
 /*  const setDlgElem = (column) => {
    const dlgElem = null;
    switch (column.fldType) {
      //     case 1:
      //       dlgElem =
      //       <input type="checkbox"
      //       key={column.accessorKey}
      //       label={column.header}
      //      name={column.accessorKey}
      //  onChange={(e) =>
      //      setChecked(((state) => !checked)
      //    }
      //     />
      default:
        const dlgElem = (
          <TextField
            key={column.accessorKey}
            label={column.header}
            name={column.accessorKey}
            //  onChange={(e) =>
            //    setValues({ ...values, [e.target.name]: e.target.value })
            //   }
          />
        );
    }
    return dlgElem;
  }; */

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
      <DialogContent>
         <EventMasterForm
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          index={index}
          headers = {headers}
          editVal = {editVal}
          setEditVal = {setEditVal}
          queryInputObj={queryInputObj}
          setQueryInputObj={setQueryInputObj}
          updateEditVal={updateEditVal}
          addVal={addVal}
          msg = {msg}
          setMsg = {setMsg}
          setMsgTyp = {setMsgTyp}
          msgTyp = {msgTyp}
          errExp={errExp} set_errExp={set_errExp} parErrExp={parErrExp} set_parErrExp={set_parErrExp}
        /> 
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
