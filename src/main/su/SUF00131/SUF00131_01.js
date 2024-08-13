import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MsgAlert from "../../common/MsgAlert";
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
// import DivSubMapForm from "./SUF00104_02";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import { modGrpLovColumns, modLovColumns } from "./columns";
import NewsEntryForm from "./SUF00131_02";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const NewsEntry = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "SUA00472",
        mst: {
            "fromDt": "",
            "newsText": "",
            "newsTyp": "",
            "toDt": ""
        }
    })
   

  

    // Open Form
    const [openData, setOpenData] = useState([]);
    useEffect(() => {
        const fetchOpenData = async () => {
            let obj = {
                apiId: "SUA00471"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/openForm', obj, { headers }).then((res) => {
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

    const handleSelectChange = (event) => {
        setQueryInputObj({
          ...queryInputObj,
          mst: {
            ...queryInputObj.mst,
            [event.target.name]: event.target.value
          }
        });
      };

    const handleQueryInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(event.target.name, event.target.value);
        setQueryInputObj({
            apiId: "SUA00472",
            mst: {
                ...queryInputObj.mst,
                [name]: value
            }
        });
    };

    // Query Start..............
    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                setTableData2(res.data?.content?.qryRsltSet)

            }
            else {
                setTableData2([])
            }

            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
        }).catch(error => {
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

    const columns = useMemo(
        () => [
            {
                accessorKey: "newsTyp",
                header: "Type",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },

            {
                accessorKey: "newsText",
                header: "Text",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "newsNo",
                header: "Number",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "newsTitle",
                header: "Title",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "newsDt",
                header: "News Date",
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
        // setSelectRowDivLov("");
        setTableData2([])
        setQueryInputObj({
            apiId: "SUA00472",
            mst: {
                "fromDt": "",
                "newsText": "",
                "newsTyp": "",
                "toDt": ""
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
                        <h1 className="page-title">News Entry(Private)</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00131_01
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
      to={`${process.env.PUBLIC_URL}/SUF00104_03`}
    >
      <span>
        <i className="fe fe-log-in" />
        &nbsp;
      </span>
      Add Multiple
    </Link> */}

                    </div>
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }  

                <div className="card">
                    <div className="container-fluid mb-5">
                        <form id="myForm" onSubmit={postQuery} className="py-4" >




                            <div class="row mb-2 mx-2">
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-3 col-form-label"
                                >
                                    <b>From Date:</b>
                                </label>
                                <div className="col-md-2">
                                    <input className="form-control" type="Date" maxLength={9} name="fromDt"  onChange={handleQueryInputChange} value={queryInputObj?.mst?.fromDt} />
                                    {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
                                </div>
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-2 col-form-label"
                                >
                                    <b>To Date:</b>
                                </label>
                                <div className="col-md-2">
                                    <input className="form-control" type="Date" maxLength={9}  name="toDt" onChange={handleQueryInputChange} value={queryInputObj?.mst?.toDt} />
                                    {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
                                </div>


                            </div>
                            <div class="row mb-2 mx-2 ">

                                <label className="col-md-3 form-label">News Type:</label>
                                <div className="col-md-6">
                                <select
                                    className="form-select col-md-12"

                                    name="newsTyp"
                                   // defaultValue="AL"
                                    value={queryInputObj?.mst?.newsTyp }
                                    onChange={handleSelectChange}
                                >
                                     <option value="">All</option>
                                    {openData?.criteria?.ddNewsTyp?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

</div>
                            </div>
                            <div class="row mb-2 mx-2">

                                <label className="col-md-3 d-flex justify-content-md-cente form-label">Description:</label>
                                <div className="col-md-6">
                                    <input value={queryInputObj?.mst?.newsText} name="newsText" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" />
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
                                            rowData: tableData2[row.index],
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
                                            rowData: tableData2[row.index],
                                            index: row.index,

                                        })}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip arrow placement="right" title="Delete">
                                        <IconButton color="error" onClick={() => setCreateModalOpen({
                                            open: true,
                                            mode: 3,
                                            rowData: tableData2[row.index],
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

            <CreateNewAccountModal
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
            />
        </>
    );
};

export default NewsEntry;

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj }) => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [edtVal, setEdtVal] = useState('')
    const [addVal, setAddVal] = useState('')
    const call_pageOpen_api = async (url, body, headers) => {
        await axios.post(url, body, { headers }).then(res => {
            if (res.data.content) {
                setEdtVal(res.data.content.mst);
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})


        }).catch(error => {
            console.log(error);
        })
    }


    const call_formOpen_api = async (url, headers) => {
        let obj = {
            apiId: "SUA00473"
        }
        await axios.post(url, obj, { headers }).then(res => {
            if (res.data.content) {
                setAddVal(res.data.content.mst);
            }
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
    //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00025/openAddForm";
    //     }
    //     open && call_formOpen_api(url, headers)
    // }, [mode])

    useEffect(() => {
        let url = "";
        let body = {}

        if (mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00131/openAddForm"
            body = {
                apiId: "SUA00473",
            }
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00131/openEditForm";
            console.log(queryInputObj)
            console.log(queryInputObj?.criteria?.lvlRefCd)
            body = {
                apiId: "SUA00474",
                mst: {

                    "newsNo": rowData?.newsNo
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00131/openDeleteForm";
            body = {
                apiId: "SUA00477",
                mst: {
                    "newsNo": rowData?.newsNo
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00131/openViewForm";
            body = {
                apiId: "SUA00475",
                mst: {

                    "newsNo": rowData?.newsNo
                }
            }
        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])

    const handleClose = () => {
        onClose();
    }
    // const [dlgElem, setDlgElem] = useState();


    return (


        <Dialog open={open} setData={setData} data={data} fullWidth
            maxWidth="md">
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
            <DialogContent className="pb-0">
                <NewsEntryForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} edtVal={edtVal} setEdtVal={setEdtVal} addVal={addVal} errExp={errExp} set_errExp={set_errExp} />
            </DialogContent>
            <DialogActions sx={{ p: "1.25rem" }} className="pt-0">
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


