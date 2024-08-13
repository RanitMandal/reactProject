import React, { useCallback, useMemo, useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
import Grid from '@mui/material/Grid';
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Alert } from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close'
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
  // autocompleteClasses,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
// import { UserMaintenanceNewEntry } from "./SUF00033_02";
import { getApiToken } from "../../common/common";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import {Form} from "./SUF00078_02";
import MsgAlert from "../../common/MsgAlert";
//import PolicyDefinationNewEntryPage from './SUF00042_02'
const headers = { Authorization: 'Bearer ' + getApiToken() };
const LikeUserCreation = () => {



  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [render, setRender] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null
  });
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: 'SUA00370',
    criteria: {
      userId: "",
      userNm: ""
    }
  })
  //Form open api calling
  const [showPage, setShowPage] = useState(false);
  useEffect(() => {
    const openFrom = async () => {
      let obj = {
        apiId: "SUA00374"
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00078/openForm", obj, { headers })
        .then((res) => {
          setShowPage(res.data.content)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
            res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus});
        })

    }
    openFrom();
  }, []);
  //Form open api end

  const [formData, setFormData] = useState({
    userNm: '',
    userId: ''

  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

    // setEdtVal({ ...edtVal, [event.target.name]: event.target.value });
    // setCharCount({ ...charCount, [event.target.name]: true });
  };

  useEffect(() => {
    setQueryInputObj({
      apiId: "SUA00370",
      criteria: {
        userId: formData.userId,
        userNm: formData.userNm
      }
    })
  }, [formData])

  // Query Start.............
  const [tableData, setTableData] = useState([]);
  const postQuery = async (e) => {
    e.preventDefault()

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00078/getListPageData', queryInputObj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSet?.length) {
        setTableData(res.data?.content?.qryRsltSet)

      }
      else {
        setTableData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      set_errExp({status:res.data?.appMsgList?.errorStatus});
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
        accessorKey: "userId",
        header: "User Id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: "userNm",
        header: "User Name",
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
    setFormData({})
    setTableData([])
    setMsg("")
    setMsgTyp("")

  }

  // Conditionally render the component based on the value of showPage
  if (showPage == true) {
    return null; // Don't render the component
  }
  return (
    <>
      <div showPage={showPage}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Like User Creation</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00078_01
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
            { /*<a
      className="btn btn-success btn-icon text-white"
      href="/zanex/preview/components/cardsDesign/"
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Export
    </a>*/
            }
          </div>
        </div>
        {msg &&  <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }
        <div className="card">
        <div className="container-fluid mb-5">
          <form onSubmit={postQuery}>
            <Grid container spacing={2} className="p-2">
              <Grid item xs={6}>
                <div className=" row">
                  <label className="col-md-auto form-label" for="start">
                    User:
                  </label>
                  <div className="col-md-9">
                    <input
                      type="text"
                      name="userNm"
                      value={formData.userNm || ""}
                      onChange={handleInputChange}
                      className="form-control"

                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="row">
                  <label className="col-md-auto form-label" for="start">
                    User Id:
                  </label>
                  <div className="col-md-7">
                    <input
                      className="form-control"
                      type="text"
                      name="userId"
                      value={formData.userId || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
















            <div className="container text-end mb-4">
              <button class="btn btn-primary" type="submit">
                Query
              </button>

              <button
                className="btn btn-secondary mx-2"
                type="reset"
                onClick={() => resetForm()}
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
            initialState={{ density: "compact" }} //set the toogle button
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
                    index: row.index
                    //rowData:[1,2,3]
                  })}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="view">
                  <IconButton color="warning" onClick={() => setCreateModalOpen({
                    open: true,
                    mode: 4,
                    rowData: tableData[row.index],
                    index: row.index
                  })}>
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
      {/*   <PolicyDefinationNewEntryPage
      columns={columns}
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
    /> */}
      {/* Modal code end */}
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
        setParMsg={setMsg}
        parMsg={msg}
        parMsgTyp={msgTyp}
        setParMsgTyp={setMsgTyp}
        parErrExp={errExp}
                set_parErrExp={set_errExp}
      />
    </>
  );
};

export default LikeUserCreation;

export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp,  parErrExp, set_parErrExp  }) => {


  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [msg1, setMsg1] = useState("")
  const [msgTyp1, setMsgTyp1] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [store, setStore] = useState('')
  const [addVal, setAddVal] = useState([])
  const [edtVal, setEdtVal] = useState({})
  const updateEdtVal = (newEdtVal) => {
    setEdtVal(newEdtVal);
  };
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
      apiId: "SUA00371"
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
    let body = {}

    if (mode === 1) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00078/openAddForm"
      open && call_formOpen_api(url, headers)
    }
    if (mode === 2) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00078/openEditForm";
      body = {
        apiId: "SUA00373",
        mst: {
          userId: rowData.userId
        }
      }
      open && call_pageOpen_api(url, body, headers)
    }
    if (mode === 3) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/openDeleteForm";
      body = {
        apiId: "SUA00372",
        mst: {
          userId: rowData.userId
        }
      }
      open && call_pageOpen_api(url, body, headers)
    }
    if (mode === 4) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00078/openViewForm";
      body = {
        apiId: "SUA00375",
        mst: {
          userId: rowData.userId
        }
      }
      open && call_pageOpen_api(url, body, headers)
    }


  }, [mode])



  console.log(edtVal);

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
        <Form mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
          msg={msg} msg1={msg1} setMsg={setMsg} setMsg1={setMsg1} msgTyp={msgTyp} msgTyp1={msgTyp1} setMsgTyp={setMsgTyp}
          setMsgTyp1={setMsgTyp1} addVal={addVal} edtVal={edtVal} updateEdtVal={updateEdtVal} setEdtVal={setEdtVal} 
          parMsg={parMsg} setParMsg={setParMsg} parMsgTyp={parMsgTyp} setParMsgTyp={setParMsgTyp} errExp={errExp} 
          set_errExp={set_errExp} parErrExp={parErrExp} set_parErrExp={set_parErrExp} />

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