import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { postLovColumns, subDivLovColumns } from "./columns";

const PostEmailDetailForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp, }) => {
    const [chooseData, setChooseData] = useState({
        SubDivCd: false,
        loc: false
    })
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00014/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content?.qryRsltSet);
            // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            console.log(data);
        })
    }
    const lvlRefCd = sessionStorage.getItem("lvlRefCd");
    const headers = { Authorization: 'Bearer ' + getApiToken() };
    console.log(mode);
    console.log(rowData);
    console.log(rowId);

    const [formData, setFormData] = useState({});
    useEffect(() => {
        setChooseData({
            ...chooseData,
            subDivCd: (addVal.lvlTypCd === "04" || addVal.lvlTypCd === "09") ? true: false,
            loc: (addVal.lvlTypCd === "05") ?  true: false 
        })
        if (mode !== 1) {
            setFormData({
                actFlg: "A",
                lvlRefCd: edtVal ? edtVal.lvlRefCd:"",
                
                postCd: edtVal? edtVal.postCd:"",
                postNm: edtVal? edtVal.postNm:"",
                emailId: edtVal? edtVal.emailId:"",
                subDivCd: edtVal ? edtVal.subDivCd:"",
                lvlTypCd: edtVal? edtVal.lvlTypCd:"",
                divNm: edtVal ? edtVal.divNm:"",
                subDivNm: edtVal ? edtVal.subDivNm:"",
                divCd: edtVal? edtVal.lvlRefCd:"",
                divNm: edtVal? edtVal.lvlRefNm:"",
                subDivCd: edtVal? edtVal.subDivCd:""

            })
        } else {

            setFormData({
                actFlg: "A",
                lvlRefCd: addVal.lvlTypCd==="05"?addVal.subDivCd:addVal?.divCd,
                postCd: "",
                emailId:"",
                lvlTypCd:addVal.lvlTypCd,
                divNm: addVal.lvlTypCd==="05"? addVal.subDivNm:addVal?.divNm,
                subDivNm: addVal.lvlTypCd==="05" ? addVal.subDivNm:"",
                divCd: addVal.lvlTypCd==="05"?addVal.subDivCd:addVal?.divCd,
                subDivCd: addVal.lvlTypCd==="05"? addVal.subDivCd:""
            })
        }

    }, [mode, edtVal, rowData, addVal])






    const [showCharacterCount, setShowCharacterCount] = useState(false);











    //SubDiv Lov Starts  

    const [subDivLovData, setSubDivLovData] = useState([]);
    useEffect(() => {

        const fetchSubDivLovData = async () => {
            let obj = {
                apiId: "HRA00037",
                criteria: {
                    lvlRefCd: lvlRefCd
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00014/getAllSubDivision", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setSubDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        (addVal.lvlTypCd === "04" || addVal.lvlTypCd === "09") && fetchSubDivLovData();
    }, [addVal.lvlTypCd]);


    const getSubDivNm = (obj) => {
        return subDivLovData[Number(Object.keys(obj)[0])]?.lvlNm
    }

    const getSubDivCd = (obj) => {
        return subDivLovData[Number(Object.keys(obj)[0])]?.lvlRefCd
    }

    const [selectRowSubDiv, setSelectRowSubDiv] = useState("");
    const [selectRowSubDivLov, setSelectRowSubDivLov] = useState("");
    const [showModelSubDivLov, setShowModelSubDivLov] = useState(false);
    const handleRowClickSubDivLov = (rowData) => {
        console.log(rowData)
        // setSelectRow(rowData);
        setSelectRowSubDivLov(rowData);
        setFormData({
            ...formData,
            subDivCd: getSubDivCd(rowData),
            subDivNm: getSubDivNm(rowData)
        })

    };
    //SubDiv Lov ends 




    //Post Lov Starts  

    const [postLovData, setPostLovData] = useState([]);
    useEffect(() => {

        const fetchPostLovData = async () => {
            let obj = {
                apiId: "HRA00036"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00014/getAllPostDefn", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setPostLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        fetchPostLovData();
    }, []);


    const getPostNm = (obj) => {
        return postLovData[Number(Object.keys(obj)[0])]?.postNm ? postLovData[Number(Object.keys(obj)[0])]?.postNm:""
    }

    const getPostCd = (obj) => {
        return postLovData[Number(Object.keys(obj)[0])]?.postCd ? postLovData[Number(Object.keys(obj)[0])]?.postCd:""
    }
    const getRankCd = (obj) => {
        return postLovData[Number(Object.keys(obj)[0])]?.rankCd ? postLovData[Number(Object.keys(obj)[0])]?.rankCd:""
    }


    const [selectRow, setSelectRow] = useState("");
    const [selectRowPostLov, setSelectRowPostLov] = useState("");
    const [showModelPostLov, setShowModelPostLov] = useState(false);
    const handleRowClickPostLov = (rowData) => {
        console.log(rowData)
        setSelectRow(rowData);
        setSelectRowPostLov(rowData);
        setFormData({
            ...formData,
            postCd: getPostCd(rowData),
            postNm: getPostNm(rowData),
            rankCd: getRankCd(rowData)
        })

    };
    //Post Lov ends 

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
        setSelectRowPostLov("")
        setFormData({
            actFlg: "A",
            lvlRefCd: addVal.lvlTypCd==="05"?addVal.lvlRefCd:"",
            emailId:"",
            postCd: "",
            postNm:"",
           
            subDivCd: addVal.lvlTypCd==="05"? addVal.subDivCd:"",
            lvlTypCd:addVal.lvlTypCd,
            divNm: addVal.divNm,
            subDivNm: addVal.lvlTypCd==="05" ? addVal.subDivNm:"",
            divCd: addVal.divCd,
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
        console.log("selectRowStateLov");

        const addObj = {
            apiId: "HRA00029",
            mst: {
                lvlRefCd: addVal?.lvlTypCd==="05"?formData.subDivCd: formData.lvlRefCd,
                emailId:formData.emailId,
                postCd: formData.postCd,
                subDivCd: formData.subDivCd
            }
        }

        const editObj = {
            apiId: "HRA00031",
            mst: {
                actFlg: formData.actFlg,
                lvlRefCd: formData.lvlRefCd,
                postCd: formData.postCd,
                emailId:formData.emailId,
                subDivCd: formData.subDivCd

            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00014/saveAdd', addObj, { headers }).then(res => {
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
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00014/saveEdit', editObj, { headers }).then(res => {
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
            apiId: "HRA00033",
            mst: {
                lvlRefCd: formData.lvlRefCd,
                postCd: formData.postCd,
                emailId:formData.emailId,
                subDivCd: formData.subDivCd

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00014/saveDelete', deleteObj, { headers }).then(res => {
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
                <h4 className="card-title">Post Email Detail {getFormTitle(mode)}</h4>
                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                    {(!chooseData.loc) ? <div className="row mb-4">
                        <label className="col-sm-3 col-form-label"><b>Division:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control "
                                    required
                                    value={formData.divCd}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control mx-4"
                                    required
                                    value={formData.divNm}
                                />
                            </div>
                        </div>
                    </div> : <div className="row mb-4">
                        <label className="col-sm-3 col-form-label"><b>Location:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control"
                                    required
                                    value={formData.divCd}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    required
                                    value={formData.divNm}
                                    disabled={mode===3 || mode===4}
                                />
                            </div>
                        </div>
                    </div>}
                    {!(addVal?.lvlTypCd === "05" || edtVal?.lvlTypCd === "05") ? <div className="row mb-4">
                        <label className="col-sm-3 col-form-label"><b>Sub Division:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                {(mode===1 || mode===2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelSubDivLov(true)} /></span>}

                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control"
                                    required
                                    value={formData.subDivCd}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    required
                                    disabled={mode===3 || mode===4}
                                    value={formData.subDivNm}
                                />
                                <div className="row-mb-12">
                                    {showModelSubDivLov && <Lov
                                        moduleLovData={subDivLovData}
                                        setShowModel={setShowModelSubDivLov}
                                        showModel={showModelSubDivLov}
                                        handleRowClick={handleRowClickSubDivLov}
                                        columns={subDivLovColumns}
                                        currentSelection={selectRowSubDiv}
                                        setCurrentSelection={setSelectRowSubDiv}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div> : <div className="row mb-4">
                        <label className="col-sm-3 col-form-label"><b>Sub Division:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control"
                                    required
                                    value={formData.subDivCd}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    required
                                    value={formData.subDivNm}
                                    disabled={mode===3 || mode===4}
                                />
                            </div>
                        </div>
                    </div>}
                    <div className="row mb-4">
                        <label className="col-sm-3 col-form-label"><b>Post:<span className="text-red">*</span></b></label>
                        <div className="col-md-9">
                            <div className="input-group">
                                {(mode===1 || mode===2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelPostLov(true)} /></span>}

                                <input
                                    type="text"
                                    autoComplete={false}
                                    disabled={mode===3 || mode===4}
                                    className="form-control"
                                    required
                                    value={formData.postCd}
                                />
                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    required
                                    disabled={mode===3 || mode===4}
                                    value={formData.postNm}
                                />
                                <div className="row-mb-12">
                                    {showModelPostLov && <Lov
                                        moduleLovData={postLovData}
                                        setShowModel={setShowModelPostLov}
                                        showModel={showModelPostLov}
                                        handleRowClick={handleRowClickPostLov}
                                        columns={postLovColumns}
                                        currentSelection={selectRow}
                                        setCurrentSelection={setSelectRow}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className=" row mb-4">
                        <label className="col-md-3">Rank Code:</label>
                        <div className="col-md-3">
                            <input className="form-control" type="text" name="rankCd" value={formData.rankCd} disabled={mode===3 || mode===4} />
                        </div>
                        <label className="col-md-3">No. of Sanctioned Post:</label>
                        <div className="col-md-3">
                            <input className="form-control" type="text" name="noSancPost" value={formData.noSancPost} onChange={handleInputChange} disabled={mode===3 || mode===4} />
                        </div>
                    </div> */}

                    <div className=" row mb-4">
                        {/* <label className="col-md-3">Email ID:</label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" name="emailId" value={formData.emailId} disabled={mode===3 || mode===4} />
                        </div> */}
                        <label className="col-md-3">Email ID:</label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" name="emailId" value={formData.emailId} onChange={handleInputChange} disabled={mode===3 || mode===4} />
                        </div>
                    </div>
                   
                    {(mode !== 1) && <div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Status:
                        </label>
                        <div className="col-md-9">
                            <select
                                className="form-select col-md-12"
                                name="actFlg"
                                disabled={mode === 3 || mode === 4}
                                //defaultValue={edtVal.dtlActFlg}
                                onChange={handleStatusChange}
                                value={(formData?.actFlg) || edtVal?.actFlg}
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

export default PostEmailDetailForm;