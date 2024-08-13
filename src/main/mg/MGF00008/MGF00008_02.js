import React, { useState, useEffect, useRef } from "react";

import { Modal, ModalTitle } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { cellLovColumns, subCellLovColumns } from "./columns";
import axios from "axios";
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
// import { TransferList } from '@mui/lab';

const FileMasterForm = ({
    editMode,
    post,
    dispatch,
    mode,
    rowId,
    setData,
    data,
    onClose,
    row,
    rowData,
    index,
    queryInputObj,
    headers,
    editVal,
    setEditVal,
    updateEditVal,
    addVal,
    msg,
    setMsg,
    msgTyp,
    setMsgTyp,
    errExp, set_errExp,
}) => {


    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate);

    let lvlRefCd = sessionStorage.getItem("lvlRefCd");
    console.log(lvlRefCd);
    //Cell Lov Starts
    const [cellLovData, setCellLovData] = useState([]);
    useEffect(() => {
        const cellLovObj = {
            apiId: "MGA00029",
            criteria: {
                lvlRefCd: lvlRefCd
            }
        }

        const fetchModuleGrpLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/MGF00008/getAllCellMst", cellLovObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    setCellLovData(
                        res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                    );
                });
        };
        fetchModuleGrpLovData();
    }, []);

    const getCellDescription = (obj) => {
        return cellLovData[Number(Object.keys(obj)[0])]?.cellDesc ? cellLovData[Number(Object.keys(obj)[0])]?.cellDesc : "";
    };

    const getCellId = (obj) => {
        return cellLovData[Number(Object.keys(obj)[0])]?.cellId ? cellLovData[Number(Object.keys(obj)[0])]?.cellId : "";
    };

    const [selectRow, setSelectRow] = useState("");
    const [showModel, setShowModel] = useState(false);
    const handleRowClick = (rowData) => {
        setSelectRow(rowData);
        setSelectRowModuleLov({});
        setFormData({
            ...formData,
            cellId: getCellId(rowData),
            cellDesc: getCellDescription(rowData),
        });
    };
    //Cell Lov ends

    //Sub Cell Lov Starts

    const [subCellLovData, setSubCellLovData] = useState([]);
    useEffect(() => {
        const formLovObj = {
            apiId: "MGA00030",
            criteria: {
                cellId: getCellId(selectRow),
                lvlRefCd: lvlRefCd
            }

        };

        const fetchSubCellLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX +
                    "/MGF00008/getAllSubCellMst",
                    formLovObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    setSubCellLovData(
                        res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                    );
                });
        };

        selectRow && fetchSubCellLovData();
    }, [selectRow]);

    const getSubCellDesc = (obj) => {
        return subCellLovData[Number(Object.keys(obj)[0])]?.subCellDesc ? subCellLovData[Number(Object.keys(obj)[0])]?.subCellDesc : "";
    };

    const getSubCellId = (obj) => {
        return subCellLovData[Number(Object.keys(obj)[0])]?.subCellId ? subCellLovData[Number(Object.keys(obj)[0])]?.subCellId : "";
    };

    const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
    const [showModelModuleLov, setShowModelModuleLov] = useState(false);
    const handleRowClickModuleLov = (rowData) => {
        setSelectRowModuleLov(rowData);
        setFormData({
            ...formData,
            subCellId: getSubCellId(rowData),
            subCellDesc: getSubCellDesc(rowData),
        });
        // setQueryInputObj({

        //     ...queryInputObj,
        //     modId: getModuleId(rowData),

        // });
    };

    //module Lov Ends

    const fetchData = async () => {
        await axios
            .post(
                process.env.REACT_APP_API_URL_PREFIX + "/MGF00008/getListPageData",
                queryInputObj,
                { headers }
            )
            .then((res) => {
                console.log(res.data);
                setData(res.data?.content?.qryRsltSet);
                console.log(data);
            });
    };
    console.log(mode);
    console.log(rowData);
    console.log(rowId);



    const [formData, setFormData] = useState({
        cellId: "",
        cellDesc: "",
        subCellId: "",
        subCellDesc: "",
        fileSubj: "",
        oldFileNo: "",
        userFileNo: "",
        lvlRefCd: lvlRefCd,
    });

    useEffect(() => {
        if (mode !== 1) {
            setFormData({
                cellId: rowData ? rowData.cellId : "",
                cellDesc: rowData ? rowData.cellDesc : "",
                subCellId: rowData ? rowData.subCellId : "",
                subCellDesc: rowData ? rowData.subCellDesc : "",
                fileSubj: editVal ? editVal.fileSubj : "",
                oldFileNo: rowData ? rowData.oldFileNo : "",
                userFileNo: rowData ? rowData.userFileNo : "",
                sysFileNo: rowData ? rowData.sysFileNo : "",
                fileSubj: rowData ? rowData.fileSubj : ""
            })
        }

    }, [mode, editVal])



    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    // const validateInput = (formData) => {
    //     if (!formData.dev_nm.trim() || formData.dev_nm.trim() === "") {
    //         return false;
    //     }
    //     if (!formData.addr.trim() || formData.addr.trim() === "") {
    //         return false;
    //     }

    //     // other validations

    //     return true;
    // };
    const resetForm = () => {
        setSelectRow('');
        setSelectRowModuleLov('');
        setFormData({
            cellId:'',
            cellDesc:'',
            subCellId:'',
            subCellDesc:'',
            fileSubj: "",
            oldFileNo: ""
        })


        const Form = document.getElementById('myForm')
        Form.reset();
    };

    //  function resetForm () {
    //   // Get the form element by its ID
    //   const form = document.getElementById("myForm");

    //   // Reset the form fields
    //   form.reset();
    // }

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        cdDesc: false,
        modPrefix: false,
        suffix: false,
        prefix: false,
        helppath: false,
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(editVal.prefixFlg);

        const addObj = {
            apiId: "MGA00037",
            mst: {
                cellId: formData.cellId,
                subCellId: formData.subCellId,
                lvlRefCd: formData.lvlRefCd,
                oldFileNo: formData?.oldFileNo,
                fileSubj: formData.fileSubj

            }
        }

        const editObj = {

            apiId: "MGA00039",
            mst: {
                cellId: formData.cellId,
                fileSubj: formData.fileSubj,
                lvlRefCd: lvlRefCd,
                oldFileNo: formData.oldFileNo,
                subCellId: formData.subCellId,
                sysFileNo: formData.sysFileNo,
                actFlg: editVal?.actFlg,
            }
        };


        if (mode === 1)
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/MGF00008/saveAdd", addObj, { headers })
                .then((res) => {
                    console.log(res.data);

                    if (!res?.data?.appMsgList?.errorStatus) {
                        fetchData();
                    }
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                        resetForm();
                    }
                })
                .catch((error) => {
                    console.log("error");
                })

        if (mode === 2)
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/MGF00008/saveEdit",
                    editObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    if (!res?.data?.appMsgList?.errorStatus) {
                        //TRUE OPERATION
                        fetchData();
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
                    set_errExp({ status: res.data?.appMsgList?.errorStatus })
                })
                .catch((error) => {
                    console.log("error");
                }).finally(() => {
                    set_viewMsg(true)
                });

        if (mode === 3)
            set_open(true)

    };



    const pageTitle = editMode ? "Edit Post" : "Create Post";

    const getFormTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Add New";
                break;
            case 2:
                return "Update";
                break;
            case 3:
                return "Delete";
                break;
            case 4:
                return "View";
                break;

            default:
                return "Unknown";
                break;
        }
    };
    const buttonTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Save";
                break;
            case 2:
                return "Update";
                break;
            case 3:
                return "Delete";
                break;
            case 4:
                return "View";
                break;

            default:
                return "Unknown";
                break;
        }
    };

    const [open, set_open] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [delStatus, set_delStatus] = useState(false);
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: 'MGA00038',
            mst: {
                lvlRefCd: lvlRefCd,
                sysFileNo: formData.sysFileNo,
            }
        };
        await axios
            .post(
                process.env.REACT_APP_API_URL_PREFIX + "/MGF00008/saveDelete",
                deleteObj,
                { headers }
            )
            .then((res) => {
                console.log(res.data);
                if (!res?.data?.appMsgList?.errorStatus) {
                    fetchData();
                }
                set_delStatus(true)
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
                console.log("error");
            }).finally(() => {
                set_viewMsg(true)
            });
    }

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])



    const [isValid, setIsValid] = useState(true);

    return (
        <div>
            <div className="container">
                {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
                <h4 className="card-title">File Master {getFormTitle(mode)}</h4>
                <div className="row ">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Cell :<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1) && <span className="input-group-text bg-primary">
                                        <i
                                            className="fa fa-search d-inline text-white"
                                            onClick={() => setShowModel(true)}
                                        />
                                    </span>}
                                    <input
                                        type="text"
                                        aria-label="First name"
                                        className="form-control  col-md-2 rounded-3"
                                        value={formData.cellId}
                                        required
                                        disabled={mode === 3 || mode === 4 || mode===2}
                                    />
                                    <input
                                        type="text"
                                        aria-label="Last name"
                                        className="form-control col-md-9 mx-4 rounded-3"
                                        value={formData.cellDesc}
                                        required
                                        disabled={mode === 3 || mode === 4 || mode===2}
                                    />
                                    <div className="row-mb-12">
                                        {showModel && (
                                            <Lov
                                                moduleLovData={cellLovData}
                                                setShowModel={setShowModel}
                                                showModel={showModel}
                                                handleRowClick={handleRowClick}
                                                columns={cellLovColumns}
                                                currentSelection={selectRow}
                                                setCurrentSelection={setSelectRow}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <div className="col-md-3">
                                <label className="form-label">
                                    Sub Cell :<span className="text-red">*</span>
                                </label>
                            </div>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1) && <span className="input-group-text bg-primary">
                                        <i
                                            className="fa fa-search d-inline text-white"
                                            onClick={() => setShowModelModuleLov(true)}

                                        />
                                    </span>}
                                    <input
                                        type="text"
                                        aria-label="First name"
                                        className="form-control  col-md-2 rounded-3"
                                        required
                                        value={formData.subCellId}
                                        disabled={mode === 3 || mode === 4 || mode===2}
                                    />
                                    <input
                                        type="text"
                                        aria-label="Last name"
                                        className="form-control col-md-9 mx-4 rounded-3"
                                        value={formData.subCellDesc}
                                        required
                                        disabled={mode === 3 || mode === 4 || mode===2}
                                    />
                                    <div className="row-mb-12">
                                        {showModelModuleLov && (
                                            <Lov
                                                moduleLovData={subCellLovData}
                                                setShowModel={setShowModelModuleLov}
                                                showModel={showModelModuleLov}
                                                handleRowClick={handleRowClickModuleLov}
                                                columns={subCellLovColumns}
                                                currentSelection={selectRowModuleLov}
                                                setCurrentSelection={setSelectRowModuleLov}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">File Id :</label>
                            <div className="col-sm-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="sysFileNo"
                                    // placeholder="Code"
                                    readOnly
                                    value={formData.sysFileNo}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">File Subject :<span className="text-red">*</span></label>
                            <div className="col-sm-9 input-group">
                                <textarea
                                    className="form-control"
                                    type="text"
                                    name="fileSubj"
                                    required
                                    value={formData.fileSubj}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder=""
                                    maxLength={300}
                                    onFocus={() => toggleCharCountVisibility("fileSubj")}
                                    onBlur={() => toggleCharCountVisibility("fileSubj")}
                                />
                                {fieldCharCountVisibility.fileSubj && (
                                    <span className="input-group-text">
                                        {formData?.fileSubj?.length}/300
                                    </span>
                                )}

                            </div>
                        </div>
                        {/* <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Creation Date<span className="text-red">*</span>
                            </label>
                            <div className="col-sm-9 input-group">
                                <input
                                    className="form-control"
                                    type="date"
                                    name="length"
                                    placeholder="Length"
                                    value={currentDate}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div> */}
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">User File No :</label>
                            <div className="col-sm-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="userFileNo"
                                    readOnly
                                    value={formData.userFileNo}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">Old File No :<span className="text-red">*</span></label>
                            <div className="col-sm-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="oldFileNo"
                                    required
                                    value={formData.oldFileNo}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>
                        {mode !== 4 && (
                            <button
                                type="submit"
                                //onClick={(e) => handleSubmit(e, mode, data, setData, onClose)}
                                className="btn btn-primary"
                            >
                                {buttonTitle(mode)}
                            </button>
                        )}
                        {mode == 1 && (
                            <button
                                className="btn btn-secondary mx-2"
                                type="reset"
                                onClick={(e) => resetForm()}
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>

            </div>

            <ConfirmDialog
                title="Confirmation"
                open={open}
                setOpen={set_open}
                onConfirm={handleConfirmation}
                setConfirmStatus={setConfirmStatus}
                confirmStatus={confirmStatus}
            >
                Are you sure you want to delete this record?
            </ConfirmDialog>
        </div>
    );
};

export default FileMasterForm;
