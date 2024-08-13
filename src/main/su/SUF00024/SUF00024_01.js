import React, { useCallback, useMemo, useState, useEffect } from "react";

import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Modal, ModalTitle } from "react-bootstrap";
import ErrorDefinitionForm from "./SUF00024_02";
import MsgAlert from "../../common/MsgAlert";
//import { data, states } from './makeData';
import { Alert } from "react-bootstrap";
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { modGrpLovColumns, errCdLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const Error_Definition = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00312",
    criteria: {
      errType: "AL",
      errCd: ""
    }
  })
  const handleSelectChange = (event) => {
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        [event.target.name]: event.target.value
      }
    });
  };

  // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: 'SUA00318'
      }

      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00024/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data.content);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
    }
    fetchOpenData()
  }, [])

  //Err_deff Lov Starts     

  const [errDeffLovData, setErrDeffLovData] = useState([]);
  useEffect(() => {

    const fetchErrDeffLovData = async () => {
      let obj = {
        apiId: 'SUA00355'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/getAllErrorInfo", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setErrDeffLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchErrDeffLovData();
  }, []);


  const getErrDeffNm = (obj) => {
    return errDeffLovData[Number(Object.keys(obj)[0])]?.errDesc
  }

  const getErrDeffId = (obj) => {
    return errDeffLovData[Number(Object.keys(obj)[0])]?.errCd
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowErrDeffLov, setSelectRowErrDeffLov] = useState("");
  const [showModelErrDeffLov, setShowModelErrDeffLov] = useState(false);
  const handleRowClickErrDeffLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowErrDeffLov(rowData);
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        errCd: getErrDeffId(rowData)
      }
    });

  };
  console.log(queryInputObj);
  //Err_deff Lov ends  


  //  query Api.............
  const postQuery = async (e) => {
    e.preventDefault()

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00024/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSet?.length) {
        setTableData(res.data?.content.qryRsltSet)

      }
      else {
        setTableData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({status:res.data?.appMsgList?.errorStatus})
      console.log(msg);
    }).catch(error => {
      console.log(error);
    })
  }

  const [render, setRender] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null
  })
  const [tableData, setTableData] = useState([]);
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

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("firstName")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

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
        accessorKey: "errCd",
        header: "Code",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 1,
      },

      {
        accessorKey: "errDesc",
        header: "Description",
        size: 100,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "errType",
        header: "Type",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 4,
      },

      {
        accessorKey: "actFlgTxt",
        header: "Status",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 4,
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

  function resetForm() {
    // Get the form element by its ID
    const form = document.getElementById("myForm");

    // Reset the form fields
    form.reset();
  }

  return (
    <>


      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Error Definition</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00024_01
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
            <Link
              className="btn btn-success btn-icon text-white"
              to={`${process.env.PUBLIC_URL}/SUF00024_03`}
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
            <form onSubmit={postQuery} id="myForm" className="py-4">
              {/* Error Deffintion */}
              <div className="row mb-2 mx-2 ">
                <label className="col-sm-3 col-form-label"><b>Error Code:</b></label>
                <div className="col-md-6">
                  <div className="input-group">
                    <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelErrDeffLov(true)} /></span>

                    <input
                      type="text"
                      autoComplete={false}
                      className="form-control"

                      value={getErrDeffId(selectRowErrDeffLov) ? getErrDeffId(selectRowErrDeffLov) : ''}
                    />
                    <input
                      type="text"
                      autoComplete={false}
                      className="form-control mx-4"

                      value={getErrDeffNm(selectRowErrDeffLov) ? getErrDeffNm(selectRowErrDeffLov) : ''}
                    />
                    <div className="row-mb-12">
                      {showModelErrDeffLov && <Lov
                        moduleLovData={errDeffLovData}
                        setShowModel={setShowModelErrDeffLov}
                        showModel={showModelErrDeffLov}
                        handleRowClick={handleRowClickErrDeffLov}
                        columns={errCdLovColumns}
                        currentSelection={selectRow}
                        setCurrentSelection={setSelectRow}
                      />}
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-2 mx-2 ">

                <label className="col-md-3 d-flex justify-content-md-cente form-label">Error Type:</label>

                <select
                  className="form-select col-md-3 mx-2"

                  name="errType"
                  defaultValue="AL"
                  value={queryInputObj.criteria.errType}
                  onChange={handleSelectChange}
                >

                  {openData?.criteria?.ddErrType?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}

                </select>


              </div>

              <div className="container text-end">
                <button class="btn btn-primary " type="submit">
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
              data={tableData}
              initialState={{ density: "spacious" }} //set the toogle button
              editingMode="modal" //default
              enableRowSelection
              enableColumnOrdering
              enableEditing
              enableFullScreenToggle={true}
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
        </div>
      </div>

      {/* Modal code start */}
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
      {/* Modal code end */}
    </>

  )
}

export default Error_Definition;

export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp  }) => {


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
          apiId: "SUA00314"
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
          url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/openAddForm";
      }
      if (mode === 2) {
          url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/openEditForm";
          body = {
              apiId: "SUA00317",
              mst: {
                errCd: rowData.errCd
              }
          }
      }
      if (mode === 3) {
          url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/openDeleteForm";
          body = {
              apiId: "SUA00316",
              mst: {
                errCd: rowData.errCd
              }
          }
      }
      if (mode === 4) {
          url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/openViewForm";
          body = {
              apiId: "SUA00320",
              mst: {
                errCd: rowData.errCd
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
              <ErrorDefinitionForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                  msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
              setParMsg={setParMsg}
              parMsgTyp={parMsgTyp}
              setParMsgTyp={setParMsgTyp} errExp={errExp} set_errExp={set_errExp} />
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


