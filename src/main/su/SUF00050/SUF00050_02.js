
import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { modLovColumns, modGrpLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const ReportDeffForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

    console.log(edtVal?.mst?.dtl);
    console.log(addVal);


    const [formData, setFormData] = useState({
        repId: "",
        dmpTotCol: "",
        fileTyp: "P",
        graphCharFlg: "G",
        loginFlg: "Y",
        modId: "",
        noOfParam: "",
        otpFlg: "Y",
        repNm: "",
        repObj: "",
        repRmks: "",
        repTyp: "C",
        action: "I",
        dtl: [{
            action: "I",
            dispId: "Y",
            lovHeight: "",
            lovWidth: "",
            nullId: "N",
            parId: "",
            parNm: "",
            parQryStmt: "",
            parSrlNo: "",
            parTyp: "C"
        }]


    });

    // Module LOV Start..............
    const [modGrpLovData, setModGrpLovData] = useState([]);

    useEffect(() => {

        const fetchModGrpLovData = async () => {
            let obj = {
                apiId: 'SUA00570'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/getAllModGrp", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setModGrpLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchModGrpLovData();
    }, []);

    const getModGrpNm = (obj) => {
        return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm ? modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm : ""
    }

    const getModGrpId = (obj) => {
        return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId ? modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId : ""
    }

    const [selectRow, setSelectRow] = useState("");
    const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
    const handleRowClickModGrpLov = (rowData) => {
        setSelectRow(rowData);
        setFormData({
            ...formData, modGrpId: getModGrpId(rowData),
            modGrpNm: getModGrpNm(rowData),
            modId: "",
            modNm: "",
        });


    };
    //Module Lov ends 




    // Module LOV Start..............
    const [modLovData, setModLovData] = useState([]);

    useEffect(() => {

        const fetchModLovData = async () => {

            const modLovObj = {
                apiId: "SUA00574",
                criteria: {

                    modGrpId: formData.modGrpId

                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/getModMstByModGrp", modLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        (formData.modGrpId) && fetchModLovData();
    }, [formData.modGrpId]);

    const getModNm = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm : ""
    }

    const getModId = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId : ""
    }

    const [selectRowMod, setSelectRowMod] = useState("");
    const [selectRowModLov, setSelectRowModLov] = useState("");
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        setSelectRowMod(rowData);
        setSelectRowModLov(rowData);
        setFormData({
            ...formData, modId: getModId(rowData),
            modNm: getModNm(rowData),
        });


    };
    //Module Lov ends 

    useEffect(() => {
        //const [selectRowMod, setSelectRowMod] = useState("");

        let modId = rowData?.modId || ""
        let resIndex = modLovData.findIndex(item => item.modId === modId)
        let currentModId = {}
        if (resIndex !== -1) currentModId = { [resIndex]: true }
        setSelectRowMod(currentModId)
        //   console.log("9999999", resIndex, currentModId, modLovData, modId);


    }, [rowData, edtVal, modLovData,])


    useEffect(() => {
        if (mode !== 1) {
            // Set all properties of edtVal to null
            // set_tblLen(edtVal?.mst?.dtl?.length || 1)
            setFormData({
                id: rowData ? rowData.id : '',
                action: "U",
                actFlg: edtVal?.actFlg || "A",
                modGrpId: edtVal ? edtVal?.mst?.modGrpId : "",
                modGrpNm: edtVal ? edtVal?.mst?.modGrpNm : "",
                modId: edtVal ? edtVal?.mst?.modId : "",
                modNm: edtVal ? edtVal?.mst?.modNm : "",
                fileTyp: edtVal ? edtVal?.mst?.fileTyp : 'P',
                graphCharFlg: edtVal ? edtVal?.mst?.graphCharFlg : "G",
                loginFlg: edtVal ? edtVal?.mst?.loginFlg : 'Y',
                noOfParam: edtVal ? edtVal?.mst?.noOfParam : 0,
                otpFlg: edtVal ? edtVal?.mst?.otpFlg : 'Y',
                repId: rowData ? rowData?.repId : "",
                repNm: rowData ? rowData.repNm : '',
                repObj: rowData ? rowData.repObj : '',
                repRmks: edtVal ? edtVal?.mst?.repRmks : '',
                repTyp: edtVal ? edtVal?.mst?.repTyp : 'C',
                dmpTotCol: edtVal ? edtVal?.mst?.dmpTotCol : 0,
                dtl: edtVal?.mst?.dtl || [{
                    "actFlg": "A",
                    "action": "I",
                    "dispId": "Y",
                    "lovHeight": 0,
                    "lovWidth": 0,
                    "nullId": "N",
                    "parId": "",
                    "parNm": "",
                    "parQryStmt": "",
                    "parSrlNo": "",
                    parTyp: "C"
                }],
            })





        }

    }, [mode, edtVal, rowData]);

    // Get All List
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content.qryRsltSet);
            console.log(data);
            // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
            //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        })
    }



    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    console.log(formData);





    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })

    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData, [event.target.name]: event.target.value,

        });

    };





    const [tblErr, set_tblErr] = useState("")
    // const [tblLen, set_tblLen] = useState(1)
    const addtableRow = () => {

        let list = formData?.dtl
        let obj = list[list.length - 1]


        // set_tblLen(tblLen+1)
        setFormData({
            ...formData,
            dtl: [
                ...list,
                {
                   
                    "action": "I",
                    "dispId": "Y",
                    "lovHeight": "",
                    "lovWidth": "",
                    "nullId": "N",
                    "parId": "",
                    "parNm": "",
                    "parQryStmt": "",
                    "parSrlNo": "",
                    parTyp: "C"
                }
            ],
        })
        console.log(list.length + 1);


        console.log(tblErr);

    };

    const handleDtlInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = formData.dtl;

        // Clear the error message for the corresponding field
        let currentAct = list[index]?.action
        list[index] = {
            ...list[index],
            [name]: value,
            action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'

        };

        setFormData({
            ...formData,
            dtl: list
        });


    };

    // const handleDtlStatusChange = (e, index) => {
    //   const { name, value } = e.target;

    //   let list = formData.dtl; // Create a copy of the tableRow array
    //   let currentAct = list[index]?.action
    //   list[index] = {
    //       ...list[index],
    //       [name]: value,
    //       action: mode ===1 ? "I": currentAct === 'I' ? 'I': 'U'
    //   };
    //   console.log(list);
    //   setFormData({
    //     ...formData,
    //     dtl : list
    //   });
    // };

    const handleDtlStatusChange = (e, index) => {
        const { name, value } = e.target;

        let list = formData.dtl.slice(); // Create a copy of the dtl array
        let currentAct = list[index]?.action;


        // For other changes, update the corresponding property
        list[index] = {
            ...list[index],
            [name]: value,
            action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
        };


        console.log(list);
        setFormData({
            ...formData,
            dtl: list
        });
    };



    const [delArr, set_delArr] = useState([])
    const removetableRow = (e, index) => {
        console.log(formData);
        let list = formData.dtl; // Create a copy of the tableRow array
        let currentAct = list[index].action
        if (currentAct === 'I') list.splice(index, 1)
        else {
            list[index] = {
                ...list[index],
                action: "D"
            };
            set_delArr([...delArr, list[index]])
            list.splice(index, 1)
        }

        // set_tblLen(tblLen-1)
        setFormData({
            ...formData,
            dtl: list,
        });

    };



    const resetForm = () => {
        setSelectRow("")
        setModGrpLovData([])
        setSelectRowMod("")
        setModLovData([])
        setFormData({
            repId: "",
            dmpTotCol: "",
            fileTyp: "P",
            graphCharFlg: "G",
            loginFlg: "Y",
            modId: "",
            noOfParam: "",
            otpFlg: "Y",
            repNm: "",
            repObj: "",
            repRmks: "",
            repTyp: "C",
            action: "I",
            dtl: [{
                action: "I",
                dispId: "Y",
                lovHeight: "",
                lovWidth: "",
                nullId: "N",
                parId: "",
                parNm: "",
                parQryStmt: "",
                parSrlNo: "",
                parTyp: "C"
            }]


        })
        setMsg("")
        setMsgTyp("")
        set_errExp({
            status: true,
            content: ""
        })

        console.log(edtVal);
    };

    const resetForm1 = () => {
        setSelectRow("")
        setModGrpLovData([])
        setSelectRowMod("")
        setModLovData([])
        setFormData({
            repId: "",
            dmpTotCol: "",
            fileTyp: "P",
            graphCharFlg: "G",
            loginFlg: "Y",
            modId: "",
            noOfParam: "",
            otpFlg: "Y",
            repNm: "",
            repObj: "",
            repRmks: "",
            repTyp: "C",
            action: "I",
            dtl: [{
                action: "I",
                dispId: "Y",
                lovHeight: "",
                lovWidth: "",
                nullId: "N",
                parId: "",
                parNm: "",
                parQryStmt: "",
                parSrlNo: "",
                parTyp: "C"
            }]


        })


        console.log(edtVal);
    };








    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData);
        const { repId, modGrpId, modGrpNm, modNm,actFlg, ...obj } = formData;
        const {...dtl}=formData.dtl
        console.log(dtl);
        const addObj = {
            apiId: "SUA00569",
            mst: {
                ...obj,
                dmpTotCol: parseInt(obj.dmpTotCol),
                noOfParam: parseInt(obj.noOfParam),
                dtl: formData.dtl.map(item => {
                    //   const { apiNm, ...data } = item
                    return {
                        //     action: "I",
                        // dispId: item.dispId,
                        // lovHeight: item.lovHeight,
                        // lovWidth: item.lovWidth,
                        // nullId: item.nullId,
                        // parId: item.parId,
                        // parNm: item.parNm,
                        // parQryStmt: item.parQryStmt,
                        // parSrlNo:item.parSrlNo,
                        // parTyp: item.parTyp
                        ...item,
                        lovHeight: parseInt(item.lovHeight),
                        lovWidth: parseInt(item.lovWidth),
                        parSrlNo: parseInt(item.parSrlNo)
                    }
                })
            }
        }

        if (mode === 2) {
            obj.dtl = formData.dtl.filter(item => item.action)
            obj.dtl = [...obj.dtl, ...delArr]
        }
        console.log(obj.dtl);
        const editObj = {
            apiId: "SUA00578",
            mst: {
                ...obj,
                repId: formData.repId,
                dmpTotCol: parseInt(formData.dmpTotCol),
                noOfParam: parseInt(formData.noOfParam),
                dtl: obj.dtl.map(item => {
                    const { ddDispId, ddNullId, ddParTyp, ...data } = item
                    return {
                        ...data,
                        lovHeight: parseInt(data.lovHeight),
                        lovWidth: parseInt(data.lovWidth),
                        parSrlNo: parseInt(data.parSrlNo)
                        // uploadDownloadFlg: obj.uploadDownloadFlg,
                        // onlineOffline: obj.onlineOffline,
                        // appId: obj.appId,
                        // dataTrnsfrCd: obj?.dataTrnsfrCd,
                        // tabSlNo: data?.tabSlNo || undefined,
                        // ...item

                    }
                })
            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    // fetchData()
                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm1();
                }

            }).catch(error => {
                console.log("error")
            }).finally(() => {
                set_viewMsg(true)
            });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/saveEdit', editObj, { headers }).then(res => {
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
            }).finally(() => {
                set_viewMsg(true)
            });


        if (mode === 3)
            set_open(true)


    };


    const [open, set_open] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [delStatus, set_delStatus] = useState(false);
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: "SUA00573",
            mst: {
               repId:formData.repId

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00050/saveDelete', deleteObj, { headers }).then(res => {
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




    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        dataTrnsfrNm: false,
        tempTabNm: false,
        actualTabNm: false,
        spNm: false
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };
    return (
        <div className="container">
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

            <h4 className="card-title">Report Definition {getFormTitle(mode)}</h4>
            <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                {/* Module Grp Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                disabled={mode === 3 || mode === 4}
                                value={formData.modGrpId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="modGrpNm"
                                disabled={mode === 3 || mode === 4}
                                value={formData.modGrpNm}

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
                {/* Module Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                disabled={mode === 3 || mode === 4}
                                value={formData.modId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="modNm"
                                disabled={mode === 3 || mode === 4}
                                value={formData.modNm}

                            />
                            <div className="row-mb-12">
                                {showModelModLov && <Lov
                                    moduleLovData={modLovData}
                                    setShowModel={setShowModelModLov}
                                    showModel={showModelModLov}
                                    handleRowClick={handleRowClickModLov}
                                    columns={modLovColumns}
                                    currentSelection={selectRowMod}
                                    setCurrentSelection={setSelectRowMod}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Code */}
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">Report Code:<span className="text-red">*</span></label>

                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="" className="form-control col-md-3 rounded-3 ui_display_txt_" readOnly name="repId" value={formData.repId} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} />&nbsp;&nbsp;&nbsp;
                            <input type="" className="form-control col-md-9 rounded-3 ui_entry_txt_rc" name="repNm" value={formData.repNm} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4}
                                required
                                maxLength={100} onFocus={() => toggleCharCountVisibility("repNm")}
                                onBlur={() => toggleCharCountVisibility("repNm")}
                            />
                            {fieldCharCountVisibility.repNm && (
                                <span className="input-group-text">
                                    {formData?.repNm?.length}/100
                                </span>
                            )}
                        </div>

                    </div>
                </div>

                {/* report object */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">Report Object:<span className="text-red">*</span></label>
                    <div className="col-md-9">
                        <input className="form-control" required disabled={mode === 3 || mode === 4} value={formData?.repObj} onChange={handleInputChange} name="repObj" />
                    </div>

                </div>

                {/* Report mode & File Type */}
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">Report Mode:<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="graphCharFlg"
                                value={formData?.graphCharFlg}
                                onChange={handleStatusChange}
                                required
                                disabled={mode === 3 || mode === 4}
                            >


                                <option disabled>--Select--</option>
                                {(mode === 1) ?
                                    (addVal?.mst?.ddGraphCharFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.mst?.ddGraphCharFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }




                            </select>
                        </div>
                    </div>


                    <label className="col-md-3 form-label">File Type:<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="fileTyp"
                                value={formData?.fileTyp}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                                required
                            >


                                <option disabled>--Select--</option>
                                {(mode === 1) ?
                                    (addVal?.mst?.ddFileTyp?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.mst?.ddFileTyp?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }


                            </select>
                        </div>
                    </div>
                </div>

                {/* 	DMP Total Coulmn & No. Of param */}

                <div className="row mb-4">
                    <label className="form-label col-md-3">DMP Total Coulmn<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <input className="form-control" required disabled={mode === 3 || mode === 4} value={formData?.dmpTotCol} name="dmpTotCol" type="text" onChange={handleInputChange} />
                    </div>

                    <label className="form-label col-md-3">No. Of Parameter</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData?.noOfParam} disabled={mode === 3 || mode === 4} name="noOfParam" onChange={handleInputChange} type="text" />
                    </div>
                </div>


                {/* Report Type */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">Report Type:<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="repTyp"
                                required
                                value={formData?.repTyp}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                            >
                                <option disabled>--Select--</option>
                                {(mode === 1) ?
                                    (addVal?.mst?.ddRepTyp?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.mst?.ddRepTyp?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }
                            </select>
                        </div>
                    </div>
                    <label className="col-md-3 form-label">Status:</label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="actFlg"
                                // required
                                value={formData.actFlg}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                            >
                                <option disabled>--Select--</option>
                                <option value='A'>Active</option>
                                <option value='I'>InActive</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* report remarks */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">Report Remarks</label>
                    <div className="col-md-9">
                        <textarea className="form-control" value={formData?.repRmks} onChange={handleInputChange} name="repRmks" />
                    </div>
                </div>

                {/* OTP && Login */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">OTP:</label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="otpFlg"
                                // required
                                value={formData?.otpFlg}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                            >
                                <option disabled>--Select--</option>
                                {(mode === 1) ?
                                    (addVal?.mst?.ddOtpFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.mst?.ddOtpFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }
                            </select>
                        </div>
                    </div>
                    <label className="col-md-3 form-label">Login:</label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="loginFlg"
                                // required
                                value={formData.loginFlg}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                            >
                                <option disabled>--Select--</option>
                                {(mode === 1) ?
                                    (addVal?.mst?.ddLoginFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.mst?.ddLoginFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }
                            </select>
                        </div>
                    </div>

                </div>


                <div className="card text-center">
                    <div className="card-header" style={{ height: '40px' }}>
                        <div className="">
                            <h4 className=""><b>Report Details:</b></h4>
                        </div>
                    </div>
                    <div className="card-body">

                        <div className="table-responsive table">
                            <table className="table  dta-tabl" style={{ background: 'white' }}>
                                <thead className="">
                                    <tr className="bg-success">
                                        {/* <th>del</th>
      <th>Org</th> */}
                                        <th>Parameter Info</th>
                                        <th></th>
                                        <th>Query Info</th>
                                        <th></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="">

                                    {formData.dtl.map((row, index) => (<tr>
                                        {/* <td>
                      
                    </td>
                    <td >
                      
                    </td> */}
                                        <td className="border">
                                            <div>
                                                <div style={{ display: "flex" }} className="border border-2 mb-2">

                                                    <label className="form-label">
                                                        ID: <span className="text-red">*</span>
                                                    </label>
                                                    <div className="col-md">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            name="parId"
                                                            value={row.parId}
                                                            onChange={(e) =>
                                                                handleDtlInputChange(e, index, "parId")
                                                            }
                                                            // onBlur={handleCharCount}
                                                            placeholder=" "
                                                            required
                                                            maxLength={50}
                                                            disabled={mode === 3 || mode === 4}

                                                        />
                                                        {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}

                                                    </div>



                                                    <label className="form-label">Type: <span className="text-red">*</span></label>
                                                    <div className="col-md">
                                                        <select
                                                            className="form-select"
                                                            name="parTyp"
                                                            required
                                                            value={row.parTyp}
                                                            onChange={(e) =>
                                                                handleDtlStatusChange(e, index, "parTyp")
                                                            }
                                                            // onChange={handleStatusChange}
                                                            disabled={mode === 3 || mode === 4}
                                                        >
                                                            <option disabled>select</option>
                                                            {(mode === 1) ?
                                                                (addVal?.mst?.dtl[0]?.ddParTyp?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                ))) : (edtVal?.mst?.dtl[0]?.ddParTyp?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                )))
                                                            }


                                                        </select>
                                                    </div>


                                                    <label className="form-label">
                                                        SL No:
                                                    </label>
                                                    <div className="col-md">
                                                        <input
                                                            className="form-control"
                                                            type="Number"
                                                            name="parSrlNo"
                                                            value={row.parSrlNo}
                                                            onChange={(e) =>
                                                                handleDtlInputChange(e, index, "parSrlNo")
                                                            }
                                                            // onBlur={handleCharCount}
                                                            placeholder=" "
                                                            // required
                                                            maxLength={50}
                                                            disabled={mode === 3 || mode === 4}

                                                        />
                                                        {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}

                                                    </div>
                                                </div>

                                                <div style={{ display: "flex" }} className="py-2 border border-2 mb-2">
                                                    <label style={{ display: "flex", marginRight: "15px" }} className="form-label">
                                                        Name: <span className="text-red">*</span>
                                                    </label>
                                                    {/* <div className=""> */}
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="parNm"
                                                        value={row.parNm}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "parNm")
                                                        }
                                                        // onBlur={handleCharCount}
                                                        placeholder=" "
                                                        required
                                                        maxLength={50}
                                                        disabled={mode === 3 || mode === 4}
                                                        style={{ flexFlow: 1 }}
                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}
                                                    {/* 
                        </div> */}
                                                </div  >

                                                <div style={{ display: "flex" }} className="border border-2">
                                                    <label className="form-label">Type: <span className="text-red">*</span></label>
                                                    <div className="col-md">
                                                        <select
                                                            className="form-select"
                                                            name="nullId"
                                                            required
                                                            value={row?.nullId}
                                                            onChange={(e) =>
                                                                handleDtlStatusChange(e, index, "nullId")
                                                            }
                                                            disabled={mode === 3 || mode === 4}
                                                        >
                                                            <option disabled>select</option>
                                                            {(mode === 1) ?
                                                                (addVal?.mst?.dtl[0]?.ddNullId?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                ))) : (edtVal?.mst?.dtl[0]?.ddNullId?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                )))
                                                            }
                                                        </select>
                                                    </div>

                                                    <label className="form-label">	Display ID:  <span className="text-red">*</span></label>
                                                    <div className="col-md">
                                                        <select
                                                            className="form-select"
                                                            name="dispId"
                                                            required
                                                            value={row.dispId}
                                                            onChange={(e) =>
                                                                handleDtlStatusChange(e, index, "dispId")
                                                            }
                                                            //onChange={handleStatusChange}
                                                            disabled={mode === 3 || mode === 4}
                                                        >
                                                            <option disabled>select</option>
                                                            {(mode === 1) ?
                                                                (addVal?.mst?.dtl[0]?.ddDispId?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                ))) : (edtVal?.mst?.dtl[0]?.ddDispId?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                )))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>


                                        <td className="border-bottom ">

                                        </td>

                                        <td className="border">
                                            <div style={{ display: "flex" }} className="border border-2 mb-2">
                                                <label className="form-label">
                                                    Querry:
                                                </label>
                                                <div className="col-md">
                                                    <textarea
                                                        className="form-control"
                                                        name="parQryStmt"
                                                        // required
                                                        value={row.parQryStmt}
                                                        disabled={mode === 3 || mode === 4}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "parQryStmt")
                                                        }


                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}

                                                </div>

                                            </div>

                                            <div style={{ display: "flex" }}
                                                className="py-2 border border-2" >
                                                <label className="form-label">
                                                    Height:
                                                </label>
                                                <div className="col-md">
                                                    <input
                                                        className="form-control"
                                                        type="Number"
                                                        name="lovHeight"
                                                        value={row.lovHeight}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "lovHeight")
                                                        }
                                                        // onBlur={handleCharCount}
                                                        placeholder=" "
                                                        // required
                                                        maxLength={50}
                                                        disabled={mode === 3 || mode === 4}

                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}

                                                </div>
                                                <label className="form-label">
                                                    Width:
                                                </label>
                                                <div className="col-md">
                                                    <input
                                                        className="form-control"
                                                        type="Number"
                                                        name="lovWidth"
                                                        value={row.lovWidth}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "lovWidth")
                                                        }
                                                        // onBlur={handleCharCount}
                                                        placeholder=" "
                                                        // required
                                                        maxLength={50}
                                                        disabled={mode === 3 || mode === 4}

                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}

                                                </div>



                                            </div>

                                        </td>
                                        <td className="border-bottom ">

                                        </td>

                                        <td className="border">
                                            {index !== formData.dtl.length - 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => removetableRow(e, index)}
                                                    className="action-button"
                                                    disabled={mode === 3 || mode === 4}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            ) : (
                                                <div className="d-flex">
                                                    {index !== 0 && <button
                                                        type="button"
                                                        onClick={(e) => removetableRow(e, index)}
                                                        className="action-button py-3"
                                                        disabled={mode === 3 || mode === 4}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>}
                                                    <button type="button" onClick={addtableRow} className="action-button" disabled={mode === 3 || mode === 4}>
                                                        <FontAwesomeIcon icon={faPlus} className="me-2 py-3" />
                                                    </button>

                                                </div>
                                            )}
                                        </td>

                                    </tr>))}





                                </tbody>
                            </table>
                            {tblErr && (
                                <p className="error-message text-red d-flex justify-content-center">{tblErr}</p>
                            )}
                        </div>
                    </div>
                </div>

                {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
                {mode == 1 && <button
                    className="btn btn-secondary mx-2"
                    type=" button"
                    //onClick="resetForm"
                    onClick={(e) => resetForm()}
                >
                    Reset
                </button>}
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
    );
};


