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
    Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import MsgAlert from "../../common/MsgAlert";
import { Alert } from "react-bootstrap";
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { modGrpLovColumns, modLovColumns } from "./columns";
import { ReportDeffForm } from "./SUF00050_02";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ReportDeff = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00575",
        criteria: {
            modId: "",
            repNm: ""

        }
    })


    const handleQueryInputChange = (event) => {
        console.log(event.target.name, event.target.value);
        setQueryInputObj({
            apiId: "SUA00575",
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
                apiId: 'SUA00571'
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/openForm', obj, { headers }).then((res) => {
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


  //ModuleGroup Lov Starts     

  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {
    const fetchModGrpLovData = async () => {
      let obj={
        apiId:'SUA00570'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/getAllModGrp", obj,  { headers })
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


  const [selectRow, setSelectRow] = useState("");
  const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
  const handleRowClickModGrpLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModLov({});
  };
  //Module Lov ends


  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj ={
      apiId: "SUA00574",
      criteria: {

      modGrpId: getModGrpId(selectRow)

      }
    }
    console.log(modLovObj)
    const fetchModLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/getModMstByModGrp", modLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          if(res.data?.content?.qryRsltSet?.length){
          setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          }
        //   if(res.data?.appMsgList?.errorStatus){
        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        //   }
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
    setQueryInputObj({
        apiId: "SUA00575",
        criteria: {
            ...queryInputObj.criteria,
            modId:getModId(rowData)
        }
    });
  };

  //Mod Lov Ends 


    //  query Api.............
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/getListPageData', queryInputObj, { headers }).then((res) => {

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
                accessorKey: "repId",
                header: "Report Id",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 1,
            },

            {
                accessorKey: "repNm",
                header: "Report Name",
                size: 100,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },

            {
                accessorKey: "repObj",
                header: "Report Object",
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
        console.log(rows);
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(tableData);
    };

    function resetForm() {
        setMsg("")
        setMsgTyp("")
        setSelectRow({})
        setTableData([])
        setQueryInputObj({
            apiId: "SUA00347",
            criteria: {
                modId: "",
                repNm: ""

            }
        })
    }

    return (
        <>


            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Report Definition</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00050_01
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
                        {/* <Link
              className="btn btn-success btn-icon text-white"
              to={`${process.env.PUBLIC_URL}/SUF00024_03`}
            >
              <span>
                <i className="fe fe-log-in" />
                &nbsp;
              </span>
              Add Multiple
            </Link> */}
                    </div>
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
                <div className="card">
                    <div className="container-fluid mb-5">
                        <form onSubmit={postQuery} id="myForm" className="py-4">
                            {/* Module Group */}
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"

                                            value={getModGrpId(selectRow) ? getModGrpId(selectRow) : ''}
                                        />&nbsp;&nbsp;&nbsp;
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"

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
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"

                                            value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                        />&nbsp;&nbsp;&nbsp;
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"

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
                            <div class="row mb-2 mx-2">

                                <label className="col-md-3 d-flex justify-content-md-cente form-label">Report Name:</label>
                                <div className="col-md-6">
                                    <input value={queryInputObj.criteria.repNm} name="repNm" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="Report Name" />
                                </div>

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

export default ReportDeff;

export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp }) => {


    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [addVal, setAddVal] = useState({})
    const [edtVal, setEdtVal] = useState({})
    const call_pageOpen_api = async (url, body, headers) => {
        await axios.post(url, body, { headers }).then(res => {
            let data = res.data.content
            data.mst.dtl = data.mst.dtl.map(item => {
                return {
                    ...item,
                    action: "U"
                }
            })
            setEdtVal(data)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
        }).catch(error => {
            console.log(error);
        })
    }

    const call_formOpen_api = async (url, headers) => {
        let obj = {
            apiId: "SUA00576"
        }
        await axios.post(url, obj, { headers }).then(res => {
            setAddVal(res.data?.content)

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
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/openAddForm";
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/openEditForm";
            body = {
                apiId: "SUA00577",
                mst: {
                    repId: rowData.repId,
                   
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/openDeleteForm";
            body = {
                apiId: "SUA00572",
                mst: {
                    repId: rowData.repId,
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/openViewForm";
            body = {
                apiId: "SUA00568",
                mst: {
                    repId: rowData.repId,
                }
            }


        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])





    const handleClose = () => {
        setEdtVal({})
        onClose();
    }


    return (


        <Dialog open={open} setData={setData} data={data} fullWidth
            maxWidth="xl" >
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

                <ReportDeffForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
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


