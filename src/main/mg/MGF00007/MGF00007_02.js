import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import Lov from "../../common/Lov _new";
import { cellLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

const SubCellMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp, }) => {

    let lvlRefCd = sessionStorage.getItem("lvlRefCd");
    console.log(lvlRefCd);
    console.log(rowData);
    console.log(edtVal);
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00007/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content?.qryRsltSet);
            // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            console.log(data);
        })
    }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    useEffect(() => {
        if (mode !== 1)
            setFormData(
                {
                    cellId: rowData ? rowData.cellId : '',
                    cellDesc: edtVal ? edtVal.cellDesc : '',
                    cellDesc: rowData ? rowData.cellDesc : '',
                    subCellDesc: rowData ? rowData.subCellDesc : '',
                    subCellAbvr: rowData ? rowData.subCellAbvr : '',
                    subCellId: rowData ? rowData.subCellId : '',
                    actFlg: edtVal ? edtVal.actFlg : 'A',
                })

    }, [mode, edtVal])

    const [formData, setFormData] = useState({
        cellId: "",
        cellDesc: '',
        cellDesc: '',
        subCellDesc: '',
        subCellAbvr: '',
        lvlRefCd: sessionStorage ? sessionStorage.lvlRefCd : '',
        subCellId: '',
        actFlg: 'A',
    });


    const [showCharacterCount, setShowCharacterCount] = useState(false);


    // Cell Lov Starts........
    const [stateLovData, setStateLovData] = useState([]);
    useEffect(() => {

        const fetchStateLovData = async () => {
            let obj = {
                apiId: "MGA00010"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/MGF00007/getAllCellMst", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchStateLovData();
    }, []);


    const getCellId = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.cellId
    }

    const getCellDesc = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.cellDesc
    }


    const [selectRow, setSelectRow] = useState("");
    const [selectRowStateLov, setSelectRowStateLov] = useState("");
    const [showModelStateLov, setShowModelStateLov] = useState(false);
    const handleRowClickStateLov = (rowData) => {
        console.log(rowData)
        setSelectRow(rowData);
        setSelectRowStateLov(rowData);
        setFormData({
            ...formData,
            cellId: getCellId(rowData),
            cellDesc: getCellDesc(rowData)
        })
    };
    //State Lov ends   

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleStatusChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };





    const validateInput = (formData) => {
        if ((!formData.st_code.trim()) || (formData.st_code.trim() === "")) {
            return false;
        }
        if ((!formData.st_desc.trim()) || (formData.st_desc.trim() === "")) {
            return false;
        }
        if ((!formData.code.trim()) || (formData.code.trim() === "")) {
            return false;
        }
        if ((!formData.Dist_name.trim()) || (formData.Dist_name.trim() === "")) {
            return false;
        }
        // other validations

        return true;
    };
    const resetForm = () => {
        setSelectRow('')
        setSelectRowStateLov("")
        setFormData({
            id: '',
            stateCd: '',
            stateNm: '',
            distCd: '',
            distNm: '',
            actFlg: 'A'
        })

    };

    //  function resetForm () {
    //   // Get the form element by its ID
    //   const form = document.getElementById("myForm");

    //   // Reset the form fields
    //   form.reset();
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(selectRowStateLov);

        const addObj = {
            apiId: "MGA00007",
            mst: [{
                subCellAbvr: formData.subCellAbvr,
                subCellDesc: formData.subCellDesc,
                cellId: getCellId(selectRowStateLov),
                lvlRefCd: formData.lvlRefCd
            }]
        }

        const editObj = {
            apiId: "MGA00009",
            mst: {
                cellId:formData.cellId,
                subCellId: formData.subCellId,
                subCellAbvr: formData.subCellAbvr,
                subCellDesc: formData.subCellDesc,
                actFlg: formData.actFlg,
                lvlRefCd:lvlRefCd

            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00007/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    fetchData()
                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm();
                }

            }).catch(error => {
                console.log("error")
            });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00007/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()

                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
            }).catch(error => {
                console.log("error")
            });


        if (mode === 3)
            set_open(true)


    };

    const [open, set_open] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [delStatus, set_delStatus] = useState(false);
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: "MGA00008",
            mst: {

                subCellId: rowData?.subCellId || '',
                cellId:rowData?.cellId || "",
                lvlRefCd:lvlRefCd

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00007/saveDelete', deleteObj, { headers }).then(res => {
            console.log(res.data)
            if (!res?.data?.appMsgList?.errorStatus) {
                fetchData()

            }
            set_delStatus(true)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })


        }).catch(error => {
            console.log("error")
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

    const pageTitle = editMode ? 'Edit Post' : 'Create Post';

    const getFormTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Add New"
                break;
            case 2:
                return "Update"
                break;
            case 3:
                return "Delete"
                break;
            case 4:
                return "View"
                break;

            default:
                return "Unknown"
                break;
        }
    }
    const buttonTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Add New"
                break;
            case 2:
                return "Update"
                break;
            case 3:
                return "Delete"
                break;
            case 4:
                return "View"
                break;

            default:
                return "Unknown"
                break;
        }
    }
    return (
        <div>
            <div className="container">
                {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
                <h4 className="card-title">Sub Cell Master {getFormTitle(mode)}</h4>
                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                    <div className="row mb-2 mx-2 ">
                        <label className="col-sm-3 col-form-label"><b>Cell:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">{(mode == 1) &&
                                <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>}

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    name="cellId"
                                    required
                                    value={formData.cellId}
                                    disabled={mode === 3 || mode === 4}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    name="cellDesc"
                                    value={formData.cellDesc}
                                    disabled={mode === 3 || mode === 4}
                                />
                                <div className="row-mb-12">
                                    {showModelStateLov && <Lov
                                        moduleLovData={stateLovData}
                                        setShowModel={setShowModelStateLov}
                                        showModel={showModelStateLov}
                                        handleRowClick={handleRowClickStateLov}
                                        columns={cellLovColumns}
                                        currentSelection={selectRow}
                                        setCurrentSelection={setSelectRow}
                                    />}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="container border mb-4">
                        <div className="">
                            <div className="row mb-4">
                                <label className="col-sm-3 col-form-label"><b>Sub Cell Id:</b></label>
                                <div className="col-md-9">
                                    <div className="input-group">
                                        <input
                                            readOnly
                                            className="form-control"
                                            type=""
                                            name="subCellId"
                                            value={formData.subCellId}
                                            disabled={mode === 3 || mode === 4}
                                            placeholder=""
                                            required
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className=" row mb-4">
                                <label className="col-md-3 form-label">
                                    Sub Cell Description<span className="text-red">*</span>
                                </label>
                                <div className="col-md-9 input-group">
                                    <input
                                        className="form-control"
                                        type=""
                                        name="subCellDesc"
                                        value={formData.subCellDesc} onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                        placeholder="Description"
                                        required
                                        onFocus={() => {
                                            // Show character count when input is focused
                                            setShowCharacterCount(true);
                                        }}
                                        onBlur={() => {
                                            // Hide character count when input loses focus
                                            setShowCharacterCount(false);
                                        }}
                                        maxLength={100}
                                    />
                                    {showCharacterCount && (
                                        <span className="input-group-text">{formData?.subCellDesc?.length}/100</span>
                                    )}
                                    {/* {(formData.Dist_name || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.Dist_name || '').length}/100</span>
                  ) : (
                    <span className="input-group-text">{(formData.Dist_name || '').length}/100</span>
                  )} */}

                                </div>
                            </div>
                            <div className="row mb-4">
                                <label className="col-md-3 form-label">
                                    Sub Cell Abbreviation<span className="text-red">*</span>
                                </label>
                                <div className="col-md-9 input-group">
                                    <input
                                        className="form-control"
                                        type=""
                                        name="subCellAbvr"
                                        value={formData.subCellAbvr} onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                        placeholder="Abbreviation"
                                        required
                                        onFocus={() => {
                                            // Show character count when input is focused
                                            setShowCharacterCount(true);
                                        }}
                                        onBlur={() => {
                                            // Hide character count when input loses focus
                                            setShowCharacterCount(false);
                                        }}
                                        maxLength={5}
                                    />
                                    {showCharacterCount && (
                                        <span className="input-group-text">{formData?.subCellAbvr?.length}/5</span>
                                    )}


                                </div>
                            </div>
                            {mode !== 1 &&
                                <div className="row mb-4">
                                    <label className="col-md-3 form-label">
                                        Status:<span className="text-red">*</span>
                                    </label>
                                    <div className="col-md-9">
                                        <select
                                            className="form-select col-md-12"
                                            name="actFlg"
                                            disabled={mode === 3 || mode === 4}
                                            //defaultValue={edtVal.dtlActFlg}
                                            onChange={handleStatusChange}
                                            value={(formData.actFlg)}
                                            placeholder="Select"
                                        >
                                            <option disabled>--Select--</option>

                                            {(mode === 1) ?
                                                (addVal?.ddActFlg?.map((item) => (
                                                    <option value={item.value}>{item.label}</option>
                                                ))) : (edtVal?.ddActFlg?.map((item) => (
                                                    <option value={item.value}>{item.label}</option>
                                                )))
                                            }


                                            {/* {
    edtVal?.ddLongTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))
} */}
                                        </select>
                                    </div>
                                </div>}

                            {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
                            {mode == 1 && <button
                                className="btn btn-secondary mx-2"
                                type="button"
                                //onClick="resetForm"
                                onClick={(e) => resetForm()}
                            >
                                Reset
                            </button>}

                        </div>

                    </div>
                </form>
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

        </div>
    );
};

export default SubCellMasterForm;