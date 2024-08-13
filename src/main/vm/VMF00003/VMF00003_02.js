import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import {divLovColumns} from "./columns";
import Lov from "../../common/Lov _new";


export const BillDocMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, edtVal, addVal, parMsgTyp, parMsg, setParMsg, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

    
    const getFormattedTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2);
        const day = (`0${today.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
       };
      const [date, setDate] = useState(getFormattedTodayDate());

    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00001/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content?.qryRsltSet);
            setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
            console.log(data);
        })
    }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
    console.log(mode);
    console.log(rowData);
    console.log(rowId);

    // const [msg, setMsg] = useState("")
    // const [msgTyp, setMsgTyp] = useState("")

    //division Lov
    const [divLovData, setDivLovData] = useState([]);

    useEffect(() => {

        const fetchDivLovData = async () => {
            let obj = {
                apiId: 'VMA00011'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/VMF00002/getAllDivisionList", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchDivLovData();
    }, []);

    const getDivNm = (obj) => {
        return divLovData[Number(Object.keys(obj)[0])]?.divNm ? divLovData[Number(Object.keys(obj)[0])]?.divNm : ""
    }

    const getDivId = (obj) => {
        return divLovData[Number(Object.keys(obj)[0])]?.divCd ? divLovData[Number(Object.keys(obj)[0])]?.divCd : ""
    }

    const [selectRowDiv, setSelectRowDiv] = useState("");
    const [selectRowDivLov, setSelectRowDivLov] = useState("");
    const [showModelDivLov, setShowModelDivLov] = useState(false);
    const handleRowClickDivLov = (rowData) => {
        setSelectRowDiv(rowData);
        // setSelectRowDivLov(rowData);
        setFormData({
            ...formData,
            divCd: getDivId(rowData),
            divNm: getDivNm(rowData),
           
        });


    };
    // Division Lov ends 

    const [formData, setFormData] = useState({
        divCd: rowData ? rowData.divCd : '',
        regNo: rowData ? rowData.regNo : '',
        reqDt: rowData ? rowData.reqDt : '',
        reqRson: rowData ? rowData.reqRson : '',
        actFlg: rowData ? rowData.actFlg : 'A',
    });


    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setCharCount({ ...charCount, [event.target.name]: true });
    };

    const handleStatusChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const validateInput = (formData) => {
        if ((!formData.name.trim()) || (formData.dev_nm.trim() === "")) {
            return false;
        }
        if ((!formData.addr.trim()) || (formData.addr.trim() === "")) {
            return false;
        }

        // other validations

        return true;
    };
    const resetForm = () => {

        setFormData({
            iBillDocCd: '',
            curncyDesc: '',
            actFlg: 'A'
        })


    };

    const [charCount, setCharCount] = useState({

        iBillDocCd: false
    })

    const handleCharCount = (event) => {

        setCharCount({ ...charCount, [event.target.name]: false });
    };

    // const Secondaryalertbutton = () => {
    //   return Swal.fire({ 
    //     position: "top-center",
    //     title: "Are you sure?",
    //     text: "The record will be deleted permanently.",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "OK",
    //     cancelButtonText: "Cancel",

    //   }).then((result) => {
    //     return result.isConfirmed;
    //   });
    // };
    const handleSubmit = async (e) => {
        e.preventDefault()


        const addObj = {
            apiId: "VMA00022",
            mst: {
                actFlg: formData.actFlg,
                divCd: formData.divCd,
                regNo: formData.regNo,
                reqDt: date,
                reqRson: formData.reqRson
            }
        }

        const editObj = {
            apiId: 'VMA00010',
            mst: {
                iBillDocCd: formData.iBillDocCd,
                iBillDocNm: formData.iBillDocNm

            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00003/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    fetchData()
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
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm();
                }

            }).catch(error => {
                console.log("error")
            });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00001/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()

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

            }).catch(error => {
                console.log("error")
            });


        if (mode === 3) {
            set_open(true)
            // const confirmed = await Secondaryalertbutton();
            // if (confirmed)

        }
    };

    const pageTitle = editMode ? 'Edit Post' : 'Create Post';

    const getFormTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Add"
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
                return "Save"
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

    const [open, set_open] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [delStatus, set_delStatus] = useState(false)
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: 'VMA00009',
            mst: {

                iBillDocCd: formData.iBillDocCd

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00001/saveDelete', deleteObj, { headers }).then(res => {
            console.log(res.data)
            if (!res?.data?.appMsgList?.errorStatus) {
                fetchData()

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



        }).catch(error => {
            console.log("error")
        });
    }
    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])

    return (
        <div>


            <div className="container">
                {msg && <div msgRef={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
                <h4 className="card-title">
                Vendor Request Details {getFormTitle(mode)}
                </h4>



                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

                    {/*Division Lov */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label"><b>Division:</b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDivLov(true)} /></span>}

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    // required
                                    disabled={mode === 3 || mode === 4}
                                    value={formData.divCd}

                                />&nbsp;&nbsp;&nbsp;
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    // required
                                    disabled={mode === 3 || mode === 4}
                                    value={formData.divNm}

                                />
                                <div className="row-mb-12">
                                    {showModelDivLov && <Lov
                                        moduleLovData={divLovData}
                                        setShowModel={setShowModelDivLov}
                                        showModel={showModelDivLov}
                                        handleRowClick={handleRowClickDivLov}
                                        columns={divLovColumns}
                                        currentSelection={selectRowDiv}
                                        setCurrentSelection={setSelectRowDiv}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
{/*  */}

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Request Reaosn :
                        </label>
                        <div className="col-md-9 input-group">
                            <textarea
                                className="form-control"
                                type="text"
                                name="reqRson"
                                value={formData.reqRson}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Description"
                                required
                                // maxLength={50}
                                disabled={mode === 3 || mode === 4}

                            />

                        </div>
                    </div>
                    
                    {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
                    {mode == 1 && <button
                        className="btn btn-secondary mx-2"
                        type="reset"
                        //onClick="resetForm"
                        onClick={(e) => resetForm()}
                    >
                        Reset
                    </button>}
                </form>

                {/* <div className="container text-center">
                    <input
                        className="btn btn-success"
                        type="submit"
                        defaultValue="Submit"
                    />
                </div> */}
                {/* </div> */}
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

