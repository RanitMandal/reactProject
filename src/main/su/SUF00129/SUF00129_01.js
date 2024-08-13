import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { Alert } from "react-bootstrap";
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
// import FormM from "./SUF00006_02";
import CloseIcon from "@mui/icons-material/Close";
import Lov from "../../common/Lov _new";
import { formLovColumns, moduleLovColumns } from "./columns";
import axios from "axios";
import FavLink from "../../common/FavLink";
import { getApiToken, setApiToken } from "../../common/common";
import { FormFileUpldForm } from "./SUF00129_02";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };
const FormFileUpldDefination = () => {


  //Form open api calling
  const [openData, setOpenData] = useState({});
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00456",
    criteria: {
      formId: "",
      modId: "",
    },
  });
  useEffect(() => {
    // console.log(headers);
    let openFormObj = {
      apiId: "SUA00442",
    };

    const fetchOpenData = async () => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/openForm",
          openFormObj,
          { headers }
        );
        const data = response.data;

        setOpenData(data);
        setMsg(
          data?.appMsgList?.list[0]?.errDesc ? data?.appMsgList?.list[0]?.errDesc +
            " (" +
            data?.appMsgList?.list[0]?.errCd +
            ")" : ""
        );
        setMsgTyp(data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: data?.appMsgList?.errorStatus });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOpenData();
  }, []);
  //Form open api end



  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const moduleLovObj = {
      apiId: "SUA00448",
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/SUF00129/getAllModMst",
          moduleLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res?.data);
          setModuleLovData(res.data.content ? res.data.content.qryRsltSet : []);
          /*  setMsg(
             res?.data?.appMsgList?.list[0]?.errDesc +
             " (" +
             res?.data?.appMsgList?.list[0]?.errCd +
             ")"
           );
           setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */

        });
    };

    fetchModuleLovData();
  }, []);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm : "";
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId : "";
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    setSelectRowFormLov("")
    setQueryInputObj({
      apiId: "SUA00456",
      criteria: {
        ...queryInputObj.criteria,
        modId: getModuleId(rowData),
        formId:""
      },
    });
  };

  //module Lov Ends

  //Form Lov Starts

  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00449",
      criteria: {
        modId: getModuleId(selectRowModuleLov)
      }

    }
    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/getFormMstByModMst", formLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    selectRowModuleLov && fetchFormLovData();
  }, [selectRowModuleLov]);


  const getFormName = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm ? formLovData[Number(Object.keys(obj)[0])]?.formNm:""
  }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId ? formLovData[Number(Object.keys(obj)[0])]?.formId:""
  }


  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    setSelectRowFormLov(rowData);
    setQueryInputObj({
      apiId: "SUA00456",
      criteria: {
        ...queryInputObj.criteria,
        formId: getFormId(rowData)
      }
    })
  };

  //Form Lov Ends

  const getDateFormart_yyyymmdd = (ddmmyyyy) => {
    console.log(ddmmyyyy);


    if (ddmmyyyy) {
      const day = ddmmyyyy.slice(8, 10)
      const month = ddmmyyyy.slice(5, 7)
      const year = ddmmyyyy.slice(0, 4)
      console.log(`${year}-${month}-${day}`);
      return `${day}-${month}-${year}`

    } else return ""
  }



  //query api call

  const postQuery = async (e) => {
    e.preventDefault();
    if (!selectRowModuleLov) {
      setMsgTyp("VE");
      setMsg("Please Select Module");
      return;
    }

    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/getListPageData",
        queryInputObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data?.content);
        console.log(res.data?.content?.qryRsltSet);
        if (res.data?.content) {

          const modifyData = (items) => {
            return items.map((item) => {
              const newItem = {
                ...item,
                modDate: getDateFormart_yyyymmdd(item.modDt),

              };
              return newItem;
            });
          };

          const modifiedData = modifyData(res.data.content.qryRsltSet);
          setTableData(modifiedData);
        } else {
          setTableData([]);
        }
        console.log(tableData);
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            ' (' +
            res.data?.appMsgList?.list[0]?.errCd +
            ')'
            : ''
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus });

      })
      .catch((error) => {
        console.log(error);
      });
  };


  // let modDate = getDateFormart_yyyymmdd(tableData.map(item=>{
  //     return item.modDt
  // }));

  //function to rest lovs
  const resetForm = () => {
    setSelectRowFormLov("");
    setSelectRowModuleLov({});
    setQueryInputObj({
      apiId: "SUA00456",
      criteria: {
        modId: "",
        formId: "",
      },
    });
    setTableData([])
    setMsg('');
    setMsgTyp('');
  };

  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null,
  });
  const [render, setRender] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [approval, setApproval] = useState(true);
  const [tableData, setTableData] = useState([]);
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
        accessorKey: "modId",
        header: "Modeule Id",
        size: 140,
        
      },
      {
        accessorKey: "modNm",
        header: "Modeule Name",
        size: 140,
      },
      {
        accessorKey: "formId",
        header: "Form Id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: "formNm",
        header: "Form Name",
        size: 140, 
      },
      
      {
        accessorKey: "filePath",
        header: "File Path",
        size: 140,
      },
      {
        accessorKey: "fileSz",
        header: "File Size",
        size: 140,
      },
      {
        accessorKey: "imageSz",
        header: "Image Size",
        size: 140,
      },
      {
        accessorKey: "videoSz",
        header: "Video Size",
        size: 140,
      },
      {
        accessorKey: "voiceSz",
        header: "Voice Size",
        size: 140,
      },
      {
        accessorKey: "modDt",
        header: "Modified date",
        size: 140,
      },
      {
        accessorKey: "actFlgTxt",
        header: "Status",
        size: 140,
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

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Form File Upload Defination</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00129_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto pageheader-btn">
            <a
              className="btn btn-primary btn-icon text-white"
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
                <i className="fe fe-plus" />
                &nbsp;
              </span>
              Add New
            </a>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        <div className="card">
          <div className="container-fluid mb-5">
            <form id="myForm" onSubmit={postQuery}>

              <div className="row mb-4 ms-4 mt-5">
                <label
                  for="exampleFormControlSelect1"
                  className="col-md-3 col-form-label"
                >
                  <b>
                    Module:<span className="text-red">*</span>
                  </b>
                </label>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary">
                      <i
                        className="fa fa-search d-inline text-white"
                        onClick={() => setShowModelModuleLov(true)}
                      />
                    </span>
                    <input
                      type="text"
                      aria-label="First name"
                      value={
                        getModuleId(selectRowModuleLov)
                          ? getModuleId(selectRowModuleLov)
                          : ""
                      }
                      required
                      className="form-control"
                    />
                    <input
                      type="text"
                      aria-label="Last name"
                      value={
                        getModuleName(selectRowModuleLov)
                          ? getModuleName(selectRowModuleLov)
                          : ""
                      }
                      required
                      className="form-control mx-4"
                    />

                    <div className="row-mb-12">
                      {showModelModuleLov && (
                        <Lov
                          moduleLovData={moduleLovData}
                          setShowModel={setShowModelModuleLov}
                          showModel={showModelModuleLov}
                          handleRowClick={handleRowClickModuleLov}
                          columns={moduleLovColumns}
                          currentSelection={selectRowModuleLov}
                          setCurrentSelection={setSelectRowModuleLov}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-4 ms-4 mt-5">
                <label
                  for="exampleFormControlSelect1"
                  className="col-md-3 col-form-label"
                >
                  <b>
                    Form:<span className="text-red">*</span>
                  </b>
                </label>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary">
                      <i
                        className="fa fa-search d-inline text-white"
                        // style={{ color: "blue" }}
                        onClick={() => setShowModelFormLov(true)}
                      />
                    </span>
                    <input
                      type="text"
                      autoComplete="false"
                      //className="form-control-lov-cd"
                      className="form-control  rouned"
                      value={getFormId(selectRowFormLov) ? getFormId(selectRowFormLov) : ""}
                      required

                    />
                    <input
                      type="text"
                      autoComplete="false"
                      className="form-control mx-4"
                      value={getFormName(selectRowFormLov) ? getFormName(selectRowFormLov) : ""}
                      required

                    />

                    <div className="row-mb-12">
                      {showModelFormLov && (
                        <Lov
                          moduleLovData={formLovData}
                          setShowModel={setShowModelFormLov}
                          showModel={showModelFormLov}
                          handleRowClick={handleRowClickFormLov}
                          columns={formLovColumns}
                          currentSelection={selectRowFormLov}
                          setCurrentSelection={setSelectRowFormLov}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="container text-end mb-4">
                <button
                  className="btn btn-primary"
                  type="submit"
                //   onClick={handleClick}
                >
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
            {approval && (
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
                      <IconButton
                        color="success"
                        onClick={() =>
                          setCreateModalOpen({
                            open: true,
                            mode: 2,
                            rowData: tableData[row.index],
                            index: row.index,
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
            )}
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
        setQueryInputObj={setQueryInputObj}
        parErrExp={errExp}
        set_parErrExp={set_errExp}
      />

    </>
  );
};

export default FormFileUpldDefination;
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
  const [edtVal, setEdtVal] = useState({});
  const [addVal, setAddVal] = useState({});

  const call_pageOpen_api = async (url, body, headers) => {
    await axios
      .post(url, body, { headers })
      .then((res) => {
        setEdtVal(res.data?.content?.mst);
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            ' (' +
            res.data?.appMsgList?.list[0]?.errCd +
            ')'
            : ''
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const call_formOpen_api = async (url, body, headers) => {
    await axios
      .post(url, body, { headers })
      .then((res) => {
        setAddVal(res.data?.content?.mst);
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            ' (' +
            res.data?.appMsgList?.list[0]?.errCd +
            ')'
            : ''
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let url = "";
    let body = {};

    if (mode === 1) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/openAddForm";
      body = {
        apiId: "SUA00450",
      };
      open && call_formOpen_api(url, body, headers);
    }

    if (mode === 2) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/openEditForm";
      body = {
        apiId: "SUA00441",
        mst: {
          formId: rowData.formId
        },
      };

      //console.log(rowData.cdId);
      //console.log(queryInputObj.modId);
      open && call_pageOpen_api(url, body, headers);
    }
    if (mode === 3) {
      url =
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/openDeleteForm";
      body = {
        apiId: "SUA00440",
        mst: {
          formId: rowData.formId
        },
      };
      open && call_pageOpen_api(url, body, headers);
    }
    if (mode === 4) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/openViewForm";
      body = {
        apiId: "SUA00443",
        mst: {
          formId: rowData.formId
        },
      };
      open && call_pageOpen_api(url, body, headers);
    }
  }, [mode]);

  /*  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  }; */
  const handleClose = () => {
    onClose();
    setEdtVal({});
  };
  // const [dlgElem, setDlgElem] = useState();
  const setDlgElem = (column) => {
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
  };

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
        <FormFileUpldForm
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          index={index}
          edtVal={edtVal}
          setEdtVal={setEdtVal}
          addVal={addVal}
          setAddVal={setAddVal}
          msg={msg}
          setMsg={setMsg}
          msgTyp={msgTyp}
          setMsgTyp={setMsgTyp}
          queryInputObj={queryInputObj}
          setQueryInputObj={setQueryInputObj}
          errExp={errExp}
          set_errExp={set_errExp} parErrExp={parErrExp} set_parErrExp={set_parErrExp}

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
