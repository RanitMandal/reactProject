import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
// import Lov from "../../common/Lov _new";
// import { stateLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const ExternalUserRegistrationForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp, }) => {
    console.log(edtVal?.mst);

    const [formData, setFormData] = useState({
        sysRegNo: "",
        refRegNo: "",
        sysRegDt: "",
        extUserTypCd: "",
        extUserTypDesc: "",
        userId: "",
        userNm: "",
        regNm: "",
        regOffAddr: "",
        regScndAddr: "",
        regMobNo: "",
        emailId: "",
        pan: "",
        gstNo: "",
        landLineNo: "",
        webSite: "",
        mobOtpLogNo: "",
        emailOtpLogNo: "",
        optnChngLogNo: "",


    });


    useEffect(() => {
        if (mode !== 1) {
            // Set all properties of edtVal to null
            // set_tblLen(edtVal?.mst?.dtl?.length || 1)
            setFormData({
                sysRegNo: rowData ? rowData.sysRegNo : '',
                userId: rowData ? rowData.userId : '',
                userNm: rowData ? rowData.userNm : '',
                regNm: rowData ? rowData.regNm : '',
                regMobNo: rowData ? rowData.regMobNo : '',
                emailId: rowData ? rowData.emailId : '',
                refRegNo: rowData ? rowData?.refRegNo : "",
                sysRegDt: rowData ? rowData?.sysRegDt : "",

                extUserTypCd: edtVal ? edtVal.extUserTypCd : '',
                extUserTypDesc: edtVal ? edtVal.extUserTypDesc : '',
                regOffAddr: edtVal ? edtVal.regOffAddr : '',
                regScndAddr: edtVal ? edtVal.regScndAddr : '',
                pan: edtVal ? edtVal.pan : '',
                gstNo: edtVal ? edtVal.gstNo : '',
                landLineNo: edtVal ? edtVal.landLineNo : '',
                webSite: edtVal ? edtVal.webSite : '',
                mobOtpLogNo: edtVal ? edtVal.mobOtpLogNo : '',
                optnChngLogNo: edtVal ? edtVal.optnChngLogNo : ''


            })





        }

    }, [mode, edtVal, rowData]);

    const fetchData = async () => {
        console.log(rowData)

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/getListPageData', queryInputObj, { headers }).then((res) => {
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
        if (mode === 1)
            setEdtVal({})
    }, [mode])


    const [showCharacterCount, setShowCharacterCount] = useState(false);


    // State Lov Starts........
    const [stateLovData, setStateLovData] = useState([]);
    useEffect(() => {

        const fetchStateLovData = async () => {
            let obj = {
                apiId: "SUA00158"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00015/getAllState", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchStateLovData();
    }, []);


    const getStateNm = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateNm
    }

    const getStateCd = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateCd
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowStateLov, setSelectRowStateLov] = useState("");
    const [showModelStateLov, setShowModelStateLov] = useState(false);
    const handleRowClickStateLov = (rowData) => {
        console.log(rowData)
        setSelectRow(rowData);
        setSelectRowStateLov(rowData);
        //   setQueryInputObj({ 

        //         stateCd: getStateCd(rowData),


        // })
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
            apiId: "SUA00195",
            mst: [

                {
                    distCd: formData.distCd,
                    distNm: formData.distNm,
                    stateCd: getStateCd(selectRowStateLov),
                    actFlg: formData.actFlg
                }

            ]
        }

        const editObj = {
            apiId: "SUA00196",
            mst: {

                distCd: formData.distCd,
                distNm: formData.distNm,
                stateCd: edtVal?.stateCd,
                actFlg: formData.actFlg

            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveAdd', addObj, { headers }).then(res => {
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
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveEdit', editObj, { headers }).then(res => {
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
            apiId: "SUA00197",
            mst: {

                distCd: formData.distCd

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveDelete', deleteObj, { headers }).then(res => {
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
                <h4 className="card-title">External User Registration Master {getFormTitle(mode)}</h4>
                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

                    <div className="row mb-2">
                        <label className="col-sm-3 form-label"><b>System Registration No:<span className="text-red">*</span></b></label>
                        <div className="col-md-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    required
                                    value={formData.sysRegNo}
                                    disabled={mode !== 1}
                                />
                            </div>

                        </div>
                    </div>

                    <div className="row mb-2">
                        <label className="col-sm-3 form-label"><b>External User Type:</b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="extUserTypCd"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData?.extUserTypCd}
                                    disabled={mode !== 1}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    name="extUserTypDesc"
                                    value={formData.extUserTypDesc}
                                    disabled={mode !== 1}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="row mb-2">
                        <label className="col-sm-3 form-label"><b>User:</b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    // disabled={mode !== 1}
                                    value={formData.userId}
                                    disabled={mode !== 1}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    // disabled={mode !== 1}
                                    value={formData.userNm}
                                    disabled={mode !== 1}
                                />
                            </div>
                        </div>
                    </div>


                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Reference Registration Number<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="refRegNo"
                                value={formData.refRegNo}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            System Registration Date<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="sysRegDt"
                                value={formData.sysRegDt}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Registration Name<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="regNm"
                                value={formData.regNm}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            Registration Office Address<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="regOffAddr"
                                value={formData.regOffAddr}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Registration Secondary Address<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="regScndAddr"
                                value={formData.regScndAddr}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            Mobile Number<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="number"
                                name="regMobNo"
                                value={formData.regMobNo}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>


                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Email<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="email"
                                name="emailId"
                                value={formData.emailId}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            Pan Number<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                // type="number"
                                name="pan"
                                value={formData.pan}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Gst No<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="gstNo"
                                value={formData.gstNo}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            Land Line Number<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="number"
                                name="landLineNo"
                                value={formData.landLineNo}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Website<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="webSite"
                                value={formData.webSite}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            Mobile OTP log Number<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="mobOtpLogNo"
                                value={formData.mobOtpLogNo}
                                disabled={mode !== 1}
                            />
                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Email Otp Log No<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                // type="number"
                                name="emailOtpLogNo"
                                value={edtVal.emailOtpLogNo}
                                disabled={mode !== 1}
                            />
                        </div>
                        <label className="col-md-3 form-label">
                            OTP Change Log No<span className="text-red">*</span>
                        </label>
                        <div className="col-md-3 input-group">
                            <input
                                className="form-control"
                                type="number"
                                name="optnChngLogNo"
                                value={edtVal.optnChngLogNo}
                                disabled={mode !== 1}
                            />
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

export default ExternalUserRegistrationForm;