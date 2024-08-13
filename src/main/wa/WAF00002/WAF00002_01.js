import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import TreeView from "deni-react-treeview";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    Tabs,
    Tab,
    OverlayTrigger,
    Modal,
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
    tabClasses,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { ImageUploadMultiAdd } from "./WAF00002_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import MsgAlert from "../../common/MsgAlert";
import Lov from "../../common/Lov _new";
import { getApiToken, getScplAdContext } from "../../common/common"
import FavLink from "../../common/FavLink";
import { portalLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const ImageUpload = () => {
    console.log(headers);
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "WAA00010"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/openForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
                    res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
            })
        }

        fetchOpenData()

    }, [])

    //Portal Lov Starts

    const [portalLovData, setPortalLovData] = useState([]);
    useEffect(() => {
        const portalLovObj = {
            apiId: "WAA00023",
        };
        const fetchPortalLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/getAllPortal", portalLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setPortalLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        fetchPortalLovData();
    }, []);

    const getPortalTitle = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalTitle ? portalLovData[Number(Object.keys(obj)[0])]?.portalTitle : "";
    };

    const getportalId = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalId ? portalLovData[Number(Object.keys(obj)[0])]?.portalId : "";
    };

    const [selectRowPortalLov, setSelectRowPortalLov] = useState({});
    const [showModelPortalLov, setShowModelPortalLov] = useState(false);
    const handleRowClickPortalLov = (rowData) => {
        setSelectRowPortalLov(rowData);
        setQueryInputObj({
            ...queryInputObj,
            criteria: {
                ...queryInputObj.criteria,
                portalId: getportalId(rowData)
            }
        })
    };

    //portal Lov Ends



    // TreeLov Api................
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState({})
    const fetchImgCatLovData = async () => {
        let obj = {
            apiId: "WAA00022",
            criteria: {
                portalId: getportalId(selectRowPortalLov)
            }
        }
        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/getAllCategoryInfo", obj, { headers })
            .then((res) => {
                console.log(res.data);
                if (res.data?.content?.qryRsltSet?.length) {

                    const modifiedData = res.data.content.qryRsltSet.map((item) => ({
                        ...item,
                        parentId: item.parentId === "*" ? null : item.parentId,
                    }));
                    let list = modifiedData.map(el => {
                        return {
                            ...el,
                            // lvlNm: el.menuNm,
                            catNm: el.text,
                            catId: el.id
                        }
                    })
                    setData(list);
                }
                setOpenModal(true);
            });
    };





    console.log(data)
    // const idMapping = data.reduce((acc, el, i) => {
    //   acc[el.lvlRefCd] = i;
    //   return acc;
    // }, []);

    // let treeview1;

    // data.forEach((el) => {
    //   // Handle the root element
    //   if (el.parLvlRefCd === null) {
    //     treeview1 = [el];
    //     return;
    //   }
    //   // Use our mapping to locate the parent element in our data array
    //   const parentEl = data[idMapping[el.parLvlRefCd]];
    //   // Add our current el to its parent's `children` array
    //   parentEl.children = [...(parentEl.children || []), el];
    // });



    const onRenderItem = (item, treeview) => {
        console.log(item);
        return (
            <div className="treeview-item-example">
                <span onClick={(e) => handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
            </div>
        )
    }

    const handleItemClick = (item) => {
        const catId = item.id;
        setValue({
            catId: item.id,
            catNm: item.text
        })
        setQueryInputObj({
            ...queryInputObj,
            criteria: {
                ...queryInputObj.criteria,
                catId: item.id
            }
        })
        setOpenModal(false);

        setMsg("")
        setMsgTyp("")

    };

    const handleOpenModal = () => {

        fetchImgCatLovData();

    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleClear = () => {
        setValue({
            catId: "",
            catNm: ""
        })
        setQueryInputObj({
            ...queryInputObj,
            criteria: {
                ...queryInputObj.criteria,
                catId: ""
            }
        })

        handleCloseModal()
    }

    // TreeLov API Ends.......................





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

    const [file, setFile] = useState()
// MUI Table Display file Related Code
const [dialogOpen, setDialogOpen] = useState(false);
const closeDialog = () => {
    setDialogOpen(false);
};
const [selectedFileUrl, setSelectedFileUrl] = useState(null);

const handleFileUrlClick = (fileUrl) => {
    // console.log(fileUrl);
    setSelectedFileUrl(fileUrl);
    setDialogOpen(true); // Open the dialog when the link is clicked
};

    const columns = useMemo(
        () => [
            {
                accessorKey: "imgId",
                header: "ID",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: true,
                size: 80,
            },
            {
                accessorKey: "imgTitle",
                header: "TITLE",
                size: 80,

            },
            {
                accessorKey: "imgDesc",
                header: "Description",
                size: 40,

            },
            {
                accessorKey: "imgDt",
                header: "Date",
                size: 40,

            },
            {
                accessorKey: "fileUrl",
                header: "File",
                size: 40,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
                Cell: ({ renderedCellValue, row }) => (
                    // <IconButton color="success" onClick={() => handleFileUrlClick(row.original.fileUrl)}>
                    //   {(row?.original?.fileUrl)? <FileOpenIcon /> : <FileOpenIcon  style={{color:"black"}}/>}
                    // </IconButton>
                    <img className="img" src={row?.original?.imageUrl} onClick={() => handleFileUrlClick(row.original.imageUrl)}></img>

                ),
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


    //csv files
    const csvExporter = new ExportToCsv(csvOptions);

    //functions
    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(tableData);
    };

    const resetForm = () => {
        setTableData([])
        setValue({})
        setSelectRowPortalLov({})
        setQueryInputObj({
            apiId: "WAA00013",
            criteria: {
                catId: '',
                portalId: ""
            }
        })
        setMsg("")
        setMsgTyp("")

    };
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [queryInputObj, setQueryInputObj] = useState({
        apiId: "WAA00013",
        criteria: {
            catId: '',
            portalId: ""
        }
    })

    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    const postQuery = async (e) => {
        e.preventDefault()

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/getListPageData', queryInputObj, { headers }).then((res) => {

            if (res.data?.content?.qryRsltSet?.length) {
                const updatedQryRsltSet = res.data.content.qryRsltSet.map(item => {
                    let ext = item?.imgFileUrl?.split(".")[1];
                    const imageUrl = `${process.env.REACT_APP_API_URL_PREFIX}${item?.imgFilePath}${item?.imgFileId}.${ext}`;
                    return {
                        ...item,
                        imageUrl: imageUrl
                    };
                });

                setTableData(updatedQryRsltSet);
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
            // setMsg(error.message)
        })
    }
    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }

    return (
        <>

            <div openData={openData}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Image Upload</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item className="breadcrumb-item" href="#">
                                List Page
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                WAF00002_01
                                <FavLink />
                            </Breadcrumb.Item>

                        </Breadcrumb>
                        {/* <Breadcrumb className="breadcrumb">
                          <Breadcrumb.Item>
                          
                          </Breadcrumb.Item>
                          </Breadcrumb>
          <i className="fa fa-star"></i> */}
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


                    </div>

                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}




                <div className="card">
                    <div className="container-fluid mb-5">



                        <form onSubmit={postQuery} id="myForm" className="py-4">
                            {/* Portal LOV */}
                            <div className="row mb-2 mx-2 ">
                                <label className="col-sm-3 col-form-label">
                                    <b>
                                        Portal Id:<span className="text-red">*</span>
                                    </b>
                                </label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary">
                                            <i
                                                className="fa fa-search d-inline text-white"
                                                title=""
                                                onClick={() => setShowModelPortalLov(true)}
                                            />
                                        </span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
                                            value={getportalId(selectRowPortalLov) ? getportalId(selectRowPortalLov) : ""}
                                            required
                                        />

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            value={getPortalTitle(selectRowPortalLov) ? getPortalTitle(selectRowPortalLov) : ""}

                                        />
                                        <div className="row-mb-12">
                                            {showModelPortalLov && (
                                                <Lov
                                                    moduleLovData={portalLovData}
                                                    setShowModel={setShowModelPortalLov}
                                                    showModel={showModelPortalLov}
                                                    handleRowClick={handleRowClickPortalLov}
                                                    columns={portalLovColumns}
                                                    currentSelection={selectRowPortalLov}
                                                    setCurrentSelection={setSelectRowPortalLov}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ImgCat Lov */}
                            <div className="row mb-2 mx-2">
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-3 col-form-label"
                                >
                                    <b>Image Category:<span className="text-red">*</span></b>

                                </label>
                                <div className="col-md-6">
                                    <div class="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>
                                        <input type="text" class="form-control" value={value.catId} required />
                                        <input type="text" class="form-control  mx-4 rounded-3" value={value.catNm} required />
                                    </div>
                                </div>
                                <div className="row-mb-12">
                                    {/* Modal */}
                                    {openModal && (
                                        <Modal show={openModal} onHide={handleCloseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title><b>Select Image Category</b></Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <TreeView
                                                    id="treeview1"
                                                    style={{ height: "auto" }}
                                                    showIcon={false}
                                                    className="branch"
                                                    items={data}
                                                    onSelectItem={handleItemClick}
                                                    onRenderItem={onRenderItem}
                                                // items={renderTreeItems(treeview1)}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                                                <button className="btn btn-primary" onClick={handleClear}>Clear</button>

                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                    {/* Input fields */}
                                </div>
                            </div>

                            <div className="container text-end mb-4">
                                <button class="btn btn-primary" type="submit" >
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
                    {/* fileOpen Dialog */}
                    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth
                        maxWidth="md" >
                        <DialogTitle sx={{ m: 1, p: 2 }} >


                            <IconButton
                                aria-label="close"
                                onClick={closeDialog}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <div className="text-center">
                                <img  src={selectedFileUrl} />
                            </div>
                        </DialogContent>
                        {/* <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions> */}
                    </Dialog>
                </div>


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
                    parErrExp={errExp}
                    set_parErrExp={set_errExp}
                />
            </div>
        </>

    );
};

export default ImageUpload;
//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp, parErrExp, set_parErrExp }) => {


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
            apiId: "WAA00011"
        }
        await axios.post(url, obj, { headers }).then(res => {
            setAddVal(res?.data?.content?.mst)
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
            url = process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/openAddForm";
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/openEditForm";
            body = {
                apiId: "WAA00015",
                mst: {
                    "imgId": rowData?.imgId
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/openDeleteForm";
            body = {
                apiId: "WAA00014",
                mst: {
                    "imgId": rowData?.imgId
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/openViewForm";
            body = {
                apiId: "WAA00016",
                mst: {
                    "imgId": rowData?.imgId
                }
            }


        }

        { (mode === 1) && open && call_formOpen_api(url, headers) }
        { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
    }, [mode])





    const handleClose = () => {
        onClose();
        edtVal({})
        setMsg("")
        setMsgTyp("")
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
                <ImageUploadMultiAdd mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
                    setParMsg={setParMsg} parMsgTyp={parMsgTyp} setParMsgTyp={setParMsgTyp} errExp={errExp} set_errExp={set_errExp}
                    parErrExp={parErrExp} set_parErrExp={set_parErrExp} />
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


