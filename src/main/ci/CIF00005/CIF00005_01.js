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
import SearchCourtCaseViewForm from "./CIF00005_02";
import MsgAlert from "../../common/MsgAlert";
import { Alert } from "react-bootstrap";
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { caseTypeColumns, courtLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const SearchCourtCase = () => {


  const [mode, setMode] = useState();

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "CIA00050",
    criteria: {
      ccaseNo: "",
      ccaseStat: "",
      ccaseTypCd: "",
      ccaseYr: 0,
      courtId: "",
      frDt: "",
      petnNm: "",
      respndtNm: "",
      searchTyp: "",
      toDt: ""
    }
  })

  const handleSelectChange = (event) => {
    const selectedMode = parseInt(event.target.value, 10);
    setMode(selectedMode);
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        [event.target.name]: event.target.value
      }
    });
  };

  const handleSelectChange2 = (event) => {
    // if (event.target.name === "searchTyp") {
    //   set_ccaseStateVal(true)
    //   setQueryInputObj({
    //     ...queryInputObj,
    //     criteria: {
    //       ...queryInputObj.criteria,
    //       ccaseStat: "L"
    //     }
    //   });
    // }
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        [event.target.name]: event.target.value
      }
    });
  };


  useEffect(() => {
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        ccaseStat: "L",
        ccaseYr: "2024"
      }
    });
    // set_ccaseStateVal(false)
    // console.log("kkkkkkk");
  }, [mode])

  console.log(queryInputObj);
  const handleSelectChange3 = (event) => {
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
        apiId: 'CIA00060'
      }

      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00005/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data.content);
        console.log(openData);

        setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      })
    }
    fetchOpenData()
  }, [])

  //Case Type     

  const [caseTypeData, setCaseTypeData] = useState([]);
  useEffect(() => {

    const fetchErrDeffLovData = async () => {
      let obj = {
        apiId: 'CIA00047'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00005/getAllCcaseTyp", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setCaseTypeData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchErrDeffLovData();
  }, []);

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value);
    setQueryInputObj({
      "apiId": "CIA00050",
      criteria: {
        ...queryInputObj?.criteria,
        [name]: value,
      }
    }
    )
  }



  //CourtLov Starts     

  const [courtLovData, setCourtLovData] = useState([]);
  useEffect(() => {

    const fetchCourtLovData = async () => {
      let obj = {
        apiId: 'CIA00048'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00005/getAllCourt", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setCourtLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchCourtLovData();
  }, []);


  const getCourtNm = (obj) => {
    return courtLovData[Number(Object.keys(obj)[0])]?.courtNm
  }

  const getCourtId = (obj) => {
    return courtLovData[Number(Object.keys(obj)[0])]?.courtId
  }

  const [selectCourtRow, setSelectCourtRow] = useState("");
  const [selectRowCourtLov, setSelectRowCourtLov] = useState("");
  const [showCourtLov, setShowCourtLov] = useState(false);
  const handleRowClickCourtLov = (rowData) => {
    setSelectCourtRow(rowData);
    setSelectRowCourtLov(rowData);
    setQueryInputObj({
      ...queryInputObj,
      criteria: {
        ...queryInputObj.criteria,
        courtId: getCourtId(rowData),
        // courtNm: getCourtNm(rowData)
      }
    });

  };
  console.log(queryInputObj);

  //year
  const [yearData, setYearData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: 'CIA00049'
      }

      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00005/getAllYears', obj, { headers }).then((res) => {
        console.log(res.data);
        setYearData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        console.log(openData);
      })
    }
    fetchOpenData()
  }, [])

  //Err_deff Lov Starts     

  let obj = {
    apiId: "CIA00050",
    criteria: {
      ...queryInputObj.criteria,
      ccaseYr: parseInt(queryInputObj?.criteria?.ccaseYr)

    }
  }

  //  query Api.............
  const postQuery = async (e) => {
    e.preventDefault()

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00005/getListPageData', obj, { headers }).then((res) => {

      if (res.data?.content?.qryRsltSet?.length) {
        setTableData(res.data?.content.qryRsltSet)

      }
      else {
        setTableData([])
      }

      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
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
        accessorKey: "ccaseId",
        header: "Case Id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 1,
      },

      {
        accessorKey: "ccaseNo",
        header: "Case No",
        size: 100,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "ccaseDesc",
        header: "Description",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
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
    setSelectRowCourtLov("")
    setSelectCourtRow("")
    setTableData([])
    setQueryInputObj({
      apiId: "CIA00050",
      criteria: {
        ccaseNo: "",
        ccaseStat: "",
        ccaseTypCd: "",
        ccaseYr: 0,
        courtId: "",
        frDt: "",
        petnNm: "",
        respndtNm: "",
        searchTyp: "",
        toDt: ""
      }
    })
    setMsg("")
    setMsgTyp("")
  }

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Search Court Cases</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    CIF00005_01
                    <FavLink />
                  </a>
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
          </div> */}
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        <div className="card">
          <div className="container-fluid mb-5">
            <form onSubmit={postQuery} id="myForm" className="py-4">
              <div class="row mb-2 mx-2 ">
                <label className="col-md-3 d-flex justify-content-md-cente form-label">Search By:</label>
                <div className="col-md-3">
                  <select
                    className="form-select col-md-12"
                    name="searchTyp"
                    // defaultValue="Select Search By"
                    value={queryInputObj.criteria.searchTyp}
                    onChange={handleSelectChange}
                  >
                    <option>Select Search By</option>
                    {openData?.criteria?.ddSearchTyp?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}

                  </select>
                </div>
              </div>

              {/* Case Type  */}
              {mode === 1 &&
                <div className="row mb-2 mx-2">
                  <label className="col-md-3 form-label">Case Type:</label>
                  <div className="col-md-3">
                    <select
                      className="form-select col-md-12"
                      name="ccaseTypCd"
                      defaultValue="09"
                      value={queryInputObj.criteria.ccaseTypCd}
                      onChange={handleSelectChange2}
                    >
                      {caseTypeData?.map((option) => (
                        <option key={option.ccaseTypCd} value={option.ccaseTypCd}>
                          {option.ccaseTypNmSh}
                        </option>
                      ))}

                    </select>
                  </div>
                  <label className="col-md-2 d-flex justify-content-md-cente form-label">Status:</label>
                  <div className="col-md-3">
                    <select
                      className="form-select col-md-12 "
                      name="ccaseStat"
                      // defaultValue="L"
                      value={queryInputObj.criteria.ccaseStat}
                      onChange={handleSelectChange2}
                    >
                      {openData?.criteria?.ddCcaseStat?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>}

              {/* Case No  */}
              {mode === 2 &&
                <div className="row mb-2 mx-2">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Case No:</label>
                  <div className="col-md-3">
                    <input name="ccaseNo" className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" value={queryInputObj?.criteria?.ccaseNo} onChange={handleInputChange} /></div>
                </div>}

              {/* Court && year && status*/}
              {mode === 3 && <>
                <div className="row mb-2 mx-2 ">
                  <label className="col-sm-3 col-form-label"><b>Court:</b></label>
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-primary"><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowCourtLov(true)} /></span>
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control "
                        value={getCourtId(selectRowCourtLov) ? getCourtId(selectRowCourtLov) : ''}
                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        value={getCourtNm(selectRowCourtLov) ? getCourtNm(selectRowCourtLov) : ''}
                      />
                      <div className="row-mb-12">
                        {showCourtLov && <Lov
                          moduleLovData={courtLovData}
                          setShowModel={setShowCourtLov}
                          showModel={showCourtLov}
                          handleRowClick={handleRowClickCourtLov}
                          columns={courtLovColumns}
                          currentSelection={selectCourtRow}
                          setCurrentSelection={setSelectCourtRow}
                        />}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-2 mx-2">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Year:</label>
                  <div className="col-md-3">
                    <select
                      className="form-select col-md-12"
                      name="ccaseYr"
                      // defaultValue="AL"
                      value={queryInputObj?.criteria?.ccaseYr}
                      onChange={handleSelectChange2}
                    >

                      {yearData?.map((option) => (
                        <option key={option.yearCd} value={option.yearCd}>
                          {option.yearCd}
                        </option>
                      ))}

                    </select>
                  </div>
                  <label className="col-md-2 d-flex justify-content-md-cente form-label">Status:</label>
                  <div className="col-md-3">
                    <select
                      className="form-select col-md-12"
                      name="ccaseStat"
                      defaultValue="L"
                      value={queryInputObj?.criteria?.ccaseStat}
                      onChange={handleSelectChange2}
                    >
                      {openData?.criteria?.ddCcaseStat?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}

                    </select>
                  </div>
                </div> </>}

              {/* Petitioner */}
              {mode === 4 &&
                <div className="row mb-2 mx-2">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Petitioner:</label>
                  <div className="col-md-3">
                    <input name="petnNm" className="form-control" type="text" id="exampleFormControlSelect1" value={queryInputObj?.criteria?.petnNm} placeholder="" onChange={handleInputChange} />
                  </div>
                </div>}
              {/* Respondent */}
              {mode === 5 &&
                <div className
                  ="row mb-2 mx-2">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Respondent:</label>
                  <div className="col-md-3">
                    <input name="respndtNm" className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" value={queryInputObj?.criteria?.respndtNm} onChange={handleInputChange} /></div>
                </div>}

              {/* Year */}
              {mode === 6 &&
                <div className="row mb-2 mx-2 ">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Year:</label>
                  <div className="col-md-3">
                    <select
                      className="form-select col-md-12"
                      name="ccaseYr"
                      defaultValue="AL"
                      value={queryInputObj?.criteria?.ccaseYr}
                      onChange={handleSelectChange2}
                    >

                      {yearData?.map((option) => (
                        <option key={option.yearCd} value={option.yearCd}>
                          {option.yearCd}
                        </option>
                      ))}

                    </select>
                  </div>
                </div>}

              {/* Hearing Period */}
              {mode === 7 &&
                <div className="row mb-2 mx-2">
                  <label className="col-md-3 d-flex justify-content-md-cente form-label">Hearing Period:</label>
                  <div className="col-md-3">
                    <input name="frDt" className="form-control" type="date" placeholder="" value={queryInputObj?.criteria?.frDt} onChange={handleInputChange} />
                  </div>
                  <label className="col-md-2 d-flex justify-content-md-cente form-label">To:</label>
                  <div className="col-md-3">
                    <input name="toDt" className="form-control" type="date" placeholder="" value={queryInputObj?.criteria?.toDt} onChange={handleInputChange} />
                  </div>
                </div>}

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
                  {/* <Tooltip arrow placement="left" title="Edit">
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
                  </Tooltip> */}

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

                  {/* <Tooltip arrow placement="right" title="Delete">
                    <IconButton color="error" onClick={() => setCreateModalOpen({
                      open: true,
                      mode: 3,
                      rowData: tableData[row.index],
                      queryInputObj
                    })}>
                      <Delete />
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

export default SearchCourtCase;

export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp }) => {


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
      set_errExp({ status: res.data?.appMsgList?.errorStatus })
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
      set_errExp({ status: res.data?.appMsgList?.errorStatus })

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
      url = process.env.REACT_APP_API_URL_PREFIX + "/CIF00005/openViewForm";
      body = {
        apiId: "CIA00055",
        mst: {
          ccaseId: rowData.ccaseId
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
        <SearchCourtCaseViewForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
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


