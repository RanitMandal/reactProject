
import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import { Page } from "@mobiscroll/react-lite";
// import { fileLovColumns } from "./columns";
import MemoRegister from "./MGF00004_01";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const MemoRegisterViewForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

    console.log(edtVal?.dtl01);
    console.log(addVal);

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate);
    // open Add Page
    const [showPage, setShowPage] = useState({});
    let openForm_post_obj = {
        apiId: 'MGA00043',
    }
    useEffect(() => {
        const openFrom = async () => {
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/MGF00002/openAddForm", openForm_post_obj, { headers })
                .then(
                    (res) => {
                        setShowPage(res.data?.content)
                        console.log(showPage);
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
                    }

                )
        }
        openFrom();
    }, []);

    const [formData, setFormData] = useState({
        memoDt: "",
        memoNo: "",
        sysFileNo: "",
        memoSubj: "",
        memoIssTo: "",
        memoTyp: "",
        userFileNo: " ",
        fileId: null,
        filePath: null,
        fileNm: null,
        fileTyp: "",
        ddMemoTyp: [
            {}
        ],
        dtl: [{
            copyToNm: "",
            copyToSlNo: 1
        }]


    });

    useEffect(() => {
        if (mode !== 1)
            setFormData(
                {
                    memoDt: rowData ? rowData.memoDt : "",
                    memoNo: rowData ? rowData.memoNo : "",
                    sysFileNo: rowData ? rowData.sysFileNo : "",
                    userFileNo: edtVal ? edtVal.userFileNo : "",
                    memoSubj: rowData ? rowData.memoSubj : "",
                    memoIssTo: rowData ? rowData.memoIssTo : "",
                    dtl: edtVal?.dtl01?.map((item) => {
                        return {
                            ...item
                        }
                    }


                    )
                })


    }, [mode, edtVal])

    // File LOV Start..............
    const [modGrpLovData, setModGrpLovData] = useState([]);

    useEffect(() => {

        const fetchModGrpLovData = async () => {
            let obj = {
                apiId: 'MGA00042'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/MGF00002/getAllFileInfo", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setModGrpLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchModGrpLovData();
    }, []);

    const getUserFileNo = (obj) => {
        return modGrpLovData[Number(Object.keys(obj)[0])]?.userFileNo ? modGrpLovData[Number(Object.keys(obj)[0])]?.userFileNo : ""
    }

    const getFileId = (obj) => {
        return modGrpLovData[Number(Object.keys(obj)[0])]?.fileId ? modGrpLovData[Number(Object.keys(obj)[0])]?.fileId : ""
    }

    const [selectRow, setSelectRow] = useState("");
    const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
    const handleRowClickModGrpLov = (rowData) => {
        setSelectRow(rowData);
        console.log(rowData);
        setFormData({
            ...formData,
            fileId: getFileId(rowData),
            userFileNo: getUserFileNo(rowData)
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
        const { repId, modGrpId, modGrpNm, modNm, actFlg, ...obj } = formData;
        const { ...dtl } = formData.dtl
        console.log(dtl);
        const addObj = {
            apiId: "MGA00046",
            mst: {
                ...obj,
                dmpTotCol: parseInt(obj.dmpTotCol),
                noOfParam: parseInt(obj.noOfParam),
                fileId: getFileId(rowData),
                fileNm: '',
                filePath: '',
                finYrCd: '',
                lvlRefCd: '',
                memoIssTo: '',
                memoSubj: '',
                memoTyp: '',
                sysFileNo: '',
                userFileNo: '',
                userId: '',
                yr: '',
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
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00002/saveAdd', addObj, { headers }).then(res => {
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
                repId: formData.repId

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
            <h4 className="card-title">Memo Register {getFormTitle(mode)}</h4>
            <form className="form-horizontal" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                <div className="row mb-4">
                    <label className="form-label col-md-3">Memo Number:</label>
                    <div className="col-md-3">
                        <input className="form-control" name="memoNo" onChange={handleInputChange} value={formData.memoNo} type="text" disabled={mode === 3 || mode === 4} />
                    </div>
                </div>

                {/* Memo Date & memo Type */}
                <div className="row mb-4">

                    <label className="form-label col-md-3">Memo Date:</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.memoDt} onChange={handleInputChange} name="memoDt" disabled={mode === 3 || mode === 4} />
                    </div>
                    <label className="form-label col-md-3">Memo Type:</label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                className="form-select"
                                name="fileTyp"
                                value={formData?.fileTyp}
                                onChange={handleStatusChange}
                                required
                                disabled={mode === 3 || mode === 4}
                            >
                                <option disabled>--Select-</option>
                                {showPage?.mst?.ddMemoTypeFlg?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                {/* File Number Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>File Number:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="sysFileNo"
                                value={formData.sysFileNo}
                                disabled={mode === 3 || mode === 4}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="userFileNo"
                                value={formData.userFileNo}
                                disabled={mode === 3 || mode === 4}

                            />
                        </div>
                    </div>
                </div>
                {/* subject*/}
                <div className="row mb-4">
                    <label className="form-label col-md-3">Subject:</label>
                    <div className="col-md-9">
                        <input className="form-control" required disabled={mode === 3 || mode === 4} value={formData?.memoSubj} onChange={handleInputChange} name="repObj" />
                    </div>

                </div>
                {/* To Whom send */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">To Whom Sent:</label>
                    <div className="col-md-9">
                        <textarea className="form-control" value={formData?.memoIssTo} onChange={handleInputChange} name="memoIssTo" disabled={mode === 3 || mode === 4} />
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive table">
                            <table className="table  dta-tabl" style={{ background: 'white' }}>
                                <thead className="">
                                    <tr className="bg-primary">
                                        <th className="text-white">Row#</th>
                                        <th></th>
                                        <th className="text-white">Copy To</th>
                                        {/* <th></th> */}
                                        {/* <th className="text-white">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="">

                                    {formData?.dtl?.map((row, index) =>
                                    (<tr>
                                        <td className="">
                                            <>{index + 1}</>
                                        </td>
                                        <td className="">

                                        </td>

                                        <td className="">

                                            <div>
                                                <div className="row">

                                                    <input
                                                        className="form-control col-md-10"
                                                        type="text"
                                                        name="copyToNm"
                                                        value={row.copyToNm}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "copyToNm")
                                                        }
                                                        // onBlur={handleCharCount}
                                                        disabled={mode === 3 || mode === 4}
                                                        placeholder=" "
                                                        required
                                                        maxLength={50}
                                                        style={{ flexFlow: 1 }}
                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}
                                                    {/* 
                        </div> */}
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="border-bottom ">

                                        </td> */}

                                        {/* <td className="border">
                                            {index !== formData.dtl.length - 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => removetableRow(e, index)}
                                                    disabled={mode === 3 || mode === 4}
                                                    className="action-button"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            ) : (
                                                <div className="d-flex">
                                                    {index !== 0 && <button
                                                        type="button"
                                                        onClick={(e) => removetableRow(e, index)}
                                                        className="action-button py-3"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>}
                                                    <button type="button" onClick={addtableRow} className="action-button"   disabled={mode === 3 || mode === 4}>
                                                        <FontAwesomeIcon icon={faPlus} className="me-2 py-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </td> */}
                                    </tr>))}
                                </tbody>
                            </table>
                            {tblErr && (
                                <p className="error-message text-red d-flex justify-content-center">{tblErr}</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div><button type="submit" className='btn btn-primary'>Save</button>
                    <button
                        className="btn btn-secondary mx-2"
                        type=" button"
                        //onClick="resetForm"
                        onClick={(e) => resetForm()}
                    >
                        Reset
                    </button></div> */}

            </form>
        </div>
    );
};
export default MemoRegisterViewForm;


