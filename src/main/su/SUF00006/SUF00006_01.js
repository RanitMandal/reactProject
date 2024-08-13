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
import FormM from "./SUF00006_02";
import CloseIcon from "@mui/icons-material/Close";
import Lov from "../../common/Lov _new";
import { moduleGrpLovColumns, moduleLovColumns } from "./columns";
import axios from "axios";
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken, setApiToken } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };
const FormMasterPageDefination = () => {


  //Form open api calling
  const [openData, setOpenData] = useState({});
  const [msg, setMsg] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [msgTyp, setMsgTyp] = useState("");
  useEffect(() => {
    // console.log(headers);
    let openFormObj = {
      apiId: "SUA00020",
    };

    const fetchOpenData = async () => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/openForm",
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
        set_errExp({status:data?.appMsgList?.errorStatus});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOpenData();
  }, []);
  //Form open api end

  //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  const [moduleGrpLovDataLoading, setModuleGrpLovDataLoading] = useState(false);
  useEffect(() => {
    const modGrpLovObj = {
      apiId: "SUA00187",
    };
    const fetchModuleGrpLovData = async () => {
      setModuleGrpLovDataLoading(true)
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/getAllModGrp", modGrpLovObj, {
          headers,
        })
        .then((res) => {
          console.log(res?.data);
          setModuleGrpLovData(res?.data ? res?.data : []);
          /* setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res?.data?.appMsgList?.list[0]?.errCd +
            ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        }).catch((err)=>{

        }).finally(()=>{
          setModuleGrpLovDataLoading(false)
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getModuleGrpName = (obj) => {
    return moduleGrpLovData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.modGrpNm;
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.modGrpId;
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModuleLov("");
    setQueryInputObj({
      apiId: "SUA00021",
      criteria: {
        formNm: "",
        modId: "",
      },
    });
  };
  //Module Group Lov ends

  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  const [moduleLovDataLoading, setModuleLovDataLoading] = useState(false);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00188",
      criteria: {
        modGrpId: getModuleGrpId(selectRow),
      },
    };

    const fetchModuleLovData = async () => {
      setModuleLovDataLoading(true)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/SUF00006/getModMstByModGrp",
          formLovObj,
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

        }).catch((err)=>{

        }).finally(()=>{
          setModuleLovDataLoading(false)
        });
    };

    selectRow && fetchModuleLovData();
  }, [selectRow]);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]
      ?.modNm;
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]
      ?.modId;
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    setQueryInputObj({
      apiId: "SUA00021",
      criteria: {
        ...queryInputObj.criteria,
        modId: getModuleId(rowData),
      },
    });
  };

  //module Lov Ends

  //query api call

  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00021",
    criteria: {
      formNm: "",
      modId: "",
    },
  });
  const postQuery = async (e) => {
    e.preventDefault();
    if (!selectRow) {
      setMsgTyp("VE");
      setMsg("Please Select Module");
      return;
    }

    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/getListPageData",
        queryInputObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data?.content);
        console.log(res.data?.content?.qryRsltSet);
        if (res.data?.content) {
          setTableData(res.data?.content?.qryRsltSet);
        } else {
          setTableData([]);
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
        set_errExp({status:res.data?.appMsgList?.errorStatus});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //function to rest lovs
  const resetForm = () => {
    setSelectRow("");
    setSelectRowModuleLov("");
    setQueryInputObj({
      apiId: "SUA00021",
      criteria: {
        modId: "",
        formNm: "",
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

  // const [createModalOpen, setCreateModalOpen] = useState(false);
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "formDesc",
        header: "Form Description",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "actFlgTxt",
        header: "Status",
        size: 140,
      }
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
            <h1 className="page-title">Form Master with Page Defination</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00006_01
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
        {msg &&  <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }
        <div className="card">
          <div className="container-fluid mb-5">
            <form id="myForm" onSubmit={postQuery}>
              <div class="row mb-4 ms-4 mt-5">
                <label
                  for="exampleFormControlSelect1"
                  className="col-md-3 col-form-label"
                >
                  <b>
                    Module Group:<span className="text-red">*</span>
                  </b>
                </label>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary">
                      <i
                        className="fa fa-search d-inline text-white"
                        // style={{ color: "blue" }}
                        onClick={() => setShowModel(true)}
                      />
                    </span>
                    <input
                      type="text"
                      aria-label="First name"
                      value={
                        getModuleGrpId(selectRow) ? getModuleGrpId(selectRow) : ""
                      }
                      required
                      className="form-control"
                    />
                    <input
                      type="text"
                      aria-label="Last name"
                      value={
                        getModuleGrpName(selectRow)
                          ? getModuleGrpName(selectRow)
                          : ""
                      }
                      required
                      className="form-control  mx-4"
                    />

                    <div className="row-mb-12">
                      {showModel && (
                        <Lov
                          moduleLovData={moduleGrpLovData?.content?.qryRsltSet}
                          setShowModel={setShowModel}
                          showModel={showModel}
                          handleRowClick={handleRowClick}
                          columns={moduleGrpLovColumns}
                          currentSelection={selectRow}
                          setCurrentSelection={setSelectRow}
                          //loading={moduleGrpLovDataLoading}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                        onClick={() => selectRow? setShowModelModuleLov(true) 
                          : alert("Please select Module Group first ")}
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
                          //loading={moduleLovDataLoading}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-4 ms-4 mt-5">
                <label
                  for="exampleFormControlSelect1"
                  className="col-md-3 col-form-label"
                >
                  <b>Form:</b>
                </label>
                <div className="col-md-6">
                  <input
                    className="form-control col-md-11"
                    type="text"
                    name="form_name"
                    value={queryInputObj.formNm}
                    id="exampleFormControlSelect1"
                    placeholder="Form"
                    onChange={(e) => {
                      setQueryInputObj({
                        apiId: "SUA00021",
                        criteria: {
                          ...queryInputObj.criteria,
                          formNm: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              <div className="container text-end mb-4">
                <button
                  className="btn btn-primary"
                  type="submit"
                  // onClick={handleClick}
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
        queryInputObj = {queryInputObj}
        setQueryInputObj={setQueryInputObj}
      />
     
    </>
  );
};

export default FormMasterPageDefination;
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
  const [addVal, setAddVal] = useState({});
  const updateEditVal = (newEditVal) => {
    setEditVal(newEditVal);
  };

  const call_pageOpen_api = async (url, body, headers) => {
    await axios
      .post(url, body, { headers })
      .then((res) => {
        setEditVal(res.data?.content?.mst);
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
        set_errExp({status:res.data?.appMsgList?.errorStatus})

      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let url = "";
    let body = {};

    if (mode === 1) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/openAddForm";
      body = {
        apiId: "SUA00022",
      };
      open && call_formOpen_api(url, body, headers);
    }

    if (mode === 2) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/openEditForm";
      body = {
        apiId: "SUA00025",
        criteria: {
          formId: rowData.formId,
          modId: queryInputObj.criteria.modId,
        },
      };

      //console.log(rowData.cdId);
      //console.log(queryInputObj.modId);
      open && call_pageOpen_api(url, body, headers);
    }
    if (mode === 3) {
      url =
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/openDeleteForm";
      body = {
        apiId: "SUA00029",
        criteria: {
          formId: rowData.formId,
          modId: queryInputObj.criteria.modId,
        },
      };
      open && call_pageOpen_api(url, body, headers);
    }
    if (mode === 4) {
      url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/openViewForm";
      body = {
        apiId: "SUA00024",
        criteria: {
          formId: rowData.formId,
          modId: queryInputObj?.criteria?.modId,
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
    setEditVal({
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      formDesc: "",
      tempCd: "",
      tempNm: "",
      listFlg: "",
      addFlg: "",
      modFlg: "",
      delFlg: "",
      cancFlg: "",
      viewFlg: "",
      userChk: "",
      finYrChk: "",
      cashFlg: "",
      finImpactFlg: "",
      autoVoucherGenFlg: "",
      otpFlg: "",
      loginFlg: "",
      dataRestc: "",
      techRmks: "",
      actFlg: "A",
        });
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
        <FormM
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          index={index}
          editVal={editVal}
          setEditVal={setEditVal}
          addVal={addVal}
          setAddVal={setAddVal}
          updateEditVal={updateEditVal}
          msg = {msg}
          setMsg = {setMsg}
          msgTyp = {msgTyp}
          setMsgTyp = {setMsgTyp}
          queryInputObj = {queryInputObj}
          setQueryInputObj = {setQueryInputObj}
          errExp={errExp} set_errExp={set_errExp}

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
