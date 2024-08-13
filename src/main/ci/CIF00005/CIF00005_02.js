
import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken, getScplAdContext } from "../../common/common"
import { Alert } from "react-bootstrap";
import { Delete, Download, Edit } from "@mui/icons-material";
import Smalltag from "../../common/SmallTag/smalltag";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
// import { divLovColumns, courtLovColumns, refCaseLovColumns, advLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const SearchCourtCaseViewForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

    console.log(edtVal);
    console.log(addVal.ddImgDbFlg);
    const userId = getScplAdContext().userId;
    const reqEmailId = getScplAdContext().mailId;
    const reqMobNo = getScplAdContext().mobNo;
    const reqAppLogNo = getScplAdContext().appLogNo;
    const initLvlRefCd = sessionStorage.getItem("lvlRefCd")
    const [formData, setFormData] = useState({
        ccaseId: '',
        ccaseNm:'',
        ccasedof: "",
        courtId: '',
        courtNm:'',
        ccaseTypCd: '',
        ccaseTypNm: "",
        ccaseNo: '',
        ccaseYr: "",
        ccaseDesc: '',
        secOfLaw: '',
        phedStatus: 'R',
        petnAdvocateId: '',
        petnNm: '',
        petnAdvocateNm: '',
        respndtNm: '',
        advocateId: '',
        advocateNm:'',
        advocateIdTwo: '',
        advocateIdTwoNm:'',
        advocateIdThree: '',
        advocateIdThreeNm:'',
        initLvlRefCd: '',
        petnAdvocateIdTwo: '',
        petnAdvocateIdThree: '',
        ccaseStat: 'N',
        ccaseStatDesc: '',
        ccaseRmks: '',
        parCcaseId: '',
        userFileNo: '',
        divCd: '',
        divNm:'',
        smstxt: '',
        actFlg: "A",
        dtl01: [
            {
                ccaseId: '',
                chrngSlNo: "",
                ccaseDoh: "",
                courtNo: '',
                actFlg: 'A',
            }
        ],
        dtl02: [
            {
                ccaseId: '',
                fileSlNo: 0,
                fileId: '',
                fileNm: '',
                filePath: '',
                actFlg: 'A',
                fileTyp: '',
                fileSz: 0,
                fileUrl: '',
                flUpldLogNo: ''
            }
        ]
    });


    useEffect(() => {
        console.log(edtVal.dtl01);
        if (mode !== 1) {
            // Set all properties of edtVal to null
            // set_tblLen(edtVal?.mst?.dtl?.length || 1)
            setFormData({
                ccaseId: rowData ? rowData?.ccaseId : "",
                ccaseNm:  edtVal ? edtVal?.ccaseNm : "",
                ccasedof: edtVal ? edtVal?.ccasedof : "",
                ccaseYr: edtVal ? edtVal?.ccaseYr : "",
                ccaseTypNm: edtVal ? edtVal?.ccaseTypNm : "",
                courtId: edtVal ? edtVal?.courtId : '',
                courtNm: edtVal ? edtVal?.courtNm : '',
                ccaseTypCd: edtVal ? edtVal?.ccaseTypCd : '',
                ccaseNo: rowData ? rowData?.ccaseNo : "",
                ccaseDesc: rowData ? rowData?.ccaseDesc : "",
                secOfLaw: edtVal ? edtVal?.secOfLaw : '',
                phedStatus: edtVal ? edtVal?.phedStatus : 'R',
                petnAdvocateId: edtVal ? edtVal?.petnAdvocateId : '',
                petnNm: edtVal ? edtVal?.petnNm : '',
                petnAdvocateNm: edtVal ? edtVal?.petnAdvocateNm : '',
                respndtNm: edtVal ? edtVal?.respndtNm : '',
                advocateId: edtVal ? edtVal?.advocateId : '',
                advocateNm:  edtVal ? edtVal?.advocateNm : '',
                advocateIdTwo: edtVal ? edtVal?.advocateIdTwo : '',
                advocateIdTwoNm:edtVal ? edtVal?.advocateIdTwoNm : '',
                advocateIdThree: edtVal ? edtVal?.advocateIdThree : '',
                advocateIdThreeNm: edtVal ? edtVal?.advocateIdThreeNm : '',
                initLvlRefCd: edtVal ? edtVal?.initLvlRefCd : initLvlRefCd,
                petnAdvocateIdTwo: edtVal ? edtVal?.petnAdvocateId : '',
                petnAdvocateIdThree: edtVal ? edtVal?.petnAdvocateIdThree : '',
                ccaseStat: edtVal ? edtVal?.ccaseStat : 'N',
                ccaseStatDesc: edtVal ? edtVal?.ccaseStatDesc : '',
                ccaseRmks: edtVal ? edtVal?.ccaseRmks : '',
                parCcaseId: edtVal ? edtVal?.parCcaseId : '',
                userFileNo: edtVal ? edtVal?.userFileNo : '',
                divCd: edtVal ? edtVal?.divCd : '',
                divNm: edtVal ? edtVal?.divNm : '',
                smstxt: edtVal ? edtVal?.smstxt : '',
                actFlg: rowData ? rowData?.actFlg : "A",
                dtl01: edtVal?.dtl01 || [
                    {
                        ccaseId: '',
                        chrngSlNo: "",
                        ccaseDoh: "",
                        ccaseToh: "",
                        courtNo: '',
                        actFlg: 'A',
                        datetyp: "H",
                    }
                ],
                dtl02: edtVal?.dtl02?.length ? edtVal?.dtl02 : [
                    {
                        ccaseId: '',
                        fileSlNo: 0,
                        fileId: '',
                        fileNm: '',
                        filePath: '',
                        actFlg: 'A',
                        fileTyp: '',
                        fileSz: 0,
                        fileUrl: '',
                        flUpldLogNo: ''
                    }
                ]
            })





        }

    }, [mode, edtVal, rowData]);
    console.log(formData);

   
    // Get All List
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00137/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content?.qryRsltSet);
            console.log(data);
            // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
            //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        })
    }

    // Module LOV Start..............


    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    console.log(formData);





    const handleInputChange = (event) => {
        setFormData({
            ...formData, [event.target.name]: event.target.value,
            dtl01: [...formData.dtl01]
        });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })

    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData, [event.target.name]: event.target.value,
            dtl01: [...formData.dtl01]
        });
        // if(formData.status==="2"||"3"){
        //   setFormData({
        //     ...formData, 
        //     closedAppLogNo: closedAppLogNo,
        //     dtl01: [...formData.dtl01]
        //   })
        // }

    };





    const [tblErr, set_tblErr] = useState("")
    // const [tblLen, set_tblLen] = useState(1)
    const addtableRow = () => {

        let list = formData?.dtl01
        let obj = list[list.length - 1]
        // if (obj.dataMrgMode === '1' && !obj.apiId) set_tblErr("API ID Required");
        // else if (obj.dataMrgMode === '2' && !obj.spNm) set_tblErr("Store Procedure Required");
        // else {
        // set_tblLen(tblLen+1)
        setFormData({
            ...formData,
            dtl01: [
                ...list,
                {
                    actFlg: "A",
                    action: "I",
                    fileSlNo: "",
                    fileCat: "C0001",
                    fileId: "",
                    fileNm: "",
                    filePath: "",
                    fileSz: 0,
                    fileTyp: "",
                    fileUrl: "",
                    flUpldLogNo: "",
                    reqRemarks: ""
                }
            ],
        })
        console.log(list.length + 1);

        // }
        console.log(tblErr);

    };

    const handleDtlInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = formData.dtl01;

        // Clear the error message for the corresponding field
        let currentAct = list[index]?.action
        list[index] = {
            ...list[index],
            [name]: value,
            action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'

        };

        setFormData({
            ...formData,
            dtl01: list
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

        let list = formData.dtl01.slice(); // Create a copy of the dtl array
        let currentAct = list[index]?.action;

        // if (name === "dataMrgMode" && value === "2") {
        //   // If dataMrgMode is changed to 2, set apiId and apiNm to empty
        //   list[index] = {
        //     ...list[index],
        //     apiId: "",
        //     apiNm: "",
        //     [name]: value,
        //     action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
        //   };
        // } else if (name === "dataMrgMode" && value === "1") {
        //   // If dataMrgMode is changed to 1, set spNm to empty
        //   list[index] = {
        //     ...list[index],
        //     spNm: "",
        //     [name]: value,
        //     action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
        //   };
        // } else {
        // For other changes, update the corresponding property
        list[index] = {
            ...list[index],
            [name]: value,
            action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
        };
        // }

        console.log(list);
        setFormData({
            ...formData,
            dtl01: list
        });
    };



    const [delArr, set_delArr] = useState([])
    const removetableRow = (e, index) => {
        let list = formData.dtl01; // Create a copy of the tableRow array
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
            dtl01: list,
        });

    };



    const resetForm = () => {

        setFormData({
            actFlg: "",
            appId: "",
            appNm: "",
            chngReqDesc: "",
            chngReqNo: "",
            chngReqTypCd: "",
            chgReqTypDesc: "",
            closedAppLogNo: "",
            respContactId: "",
            respSlNo: "",
            dtl01: [
                {
                    action: "I",
                    actFlg: "A",
                    fileSlNo: "",
                    fileCat: "C0001",
                    fileId: "",
                    fileNm: "",
                    filePath: "",
                    fileSz: 0,
                    fileTyp: "",
                    fileUrl: "",
                    flUpldLogNo: "",
                    reqRemarks: ""
                }
            ],
            formId: "",
            formNm: "",
            fromLvlRefCd: "",
            modId: "",
            modNm: "",
            reqAppLogNo: "",
            status: "1",
            userId: ""
        })


        console.log(edtVal);
    };








    const handle_confirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
            obj,
            { headers })
    }
    console.log("650",);

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(selectRowModGrpLov);
        const { modNm, appNm, appDesc, formNm, chngReqNo, actFlg, action, chgReqTypDesc, closedAppLogNo, respContactId, respSlNo, respContactNm, ...obj } = formData

        const addObj = {
            apiId: "SUA00539",
            mst: {
                ...obj,
                userId: userId,
                fromLvlRefCd: "",
                reqAppLogNo: reqAppLogNo,
                dtl01: obj.dtl01.map(item => {
                    const { fileSlNo, actFlg, action, ...data } = item
                    return {
                        ...data,
                        fileCat: "C0001"
                    }
                })
            }
        }

        if (mode === 2) {
            obj.dtl01 = obj.dtl01.filter(item => item.action)
            obj.dtl01 = [...obj.dtl01, ...delArr]
        }
        // console.log("xnnnn", typeof(formData?.status), formData?.status);
        const editObj = {
            apiId: "SUA00542",
            mst: {
                ...obj,
                chngReqNo: formData?.chngReqNo,
                action: formData?.action,
                actFlg: formData?.actFlg,
                respContactId: formData.status === "2" || formData.status === "3" ? edtVal?.respContactId : formData.respContactId,
                respSlNo: formData.status === "2" || formData.status === "3" ? edtVal?.respSlNo : formData.respSlNo,
                closedAppLogNo: formData.status === "2" || formData.status === "3" ? formData.closedAppLogNo : "",
                dtl01: obj.dtl01.map(item => {
                    const { ddActFlg, actFlgTxt, fileTypTxt, ...data } = item
                    return {
                        ...data,
                        fileSlNo: item?.action !== "I" ? parseInt(item.fileSlNo) : 0,
                        fileSz: parseInt(item.fileSz)

                    }
                })
            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00137/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    // fetchData()
                }
                const conf_obj = {
                    "apiId": "SUA00487",
                    "mst": formData.dtl01.map((item) => {
                        return {
                            "colNm": res.data?.content?.mst?.colNm,
                            "flUpldLogNo": item?.flUpldLogNo,
                            "keyStr": res.data?.content?.mst?.keyStr,
                            "keyStrVal": res.data?.content?.mst?.keyStrVal,
                            "tabNm": res.data?.content?.mst?.tabNm
                        }
                    })
                }
                if (res?.data?.appMsgList?.errorStatus === false)
                    handle_confirmation(conf_obj).then((res) => {
                        if (res?.data?.appMsgList?.errorStatus === true) {
                            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                            set_errExp({ status: res.data?.appMsgList?.errorStatus })

                        }
                    })
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm();
                }

            }).catch(error => {
                console.log("error")
            }).finally(() => {
                set_viewMsg(true)
            });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00137/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()

                }
                const conf_obj = {
                    "apiId": "SUA00487",
                    "mst": formData.dtl01.map((item) => {
                        return {
                            "colNm": res.data?.content?.mst?.colNm,
                            "flUpldLogNo": item?.flUpldLogNo,
                            "keyStr": res.data?.content?.mst?.keyStr,
                            "keyStrVal": res.data?.content?.mst?.keyStrVal,
                            "tabNm": res.data?.content?.mst?.tabNm
                        }
                    })
                }
                if (res?.data?.appMsgList?.errorStatus === false)
                    handle_confirmation(conf_obj).then((res) => {
                        if (res?.data?.appMsgList?.errorStatus === true) {
                            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                            set_errExp({ status: res.data?.appMsgList?.errorStatus })

                        }
                    })
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
            apiId: "SUA00545",
            mst: {
                chngReqNo: formData.chngReqNo

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00137/saveDelete', deleteObj, { headers }).then(res => {
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


    // File Related Code...........
    const [doc, set_doc] = useState([]);
    // useEffect(() => {
    //   set_doc(
    //     formData.fildetails.map((item, index) => ({
    //       fileUri: item.fileUri,
    //       name: "File " + (index + 1),
    //     }))
    //   );
    // }, []);
    const [fileErr_msg, set_fileErr_msg] = useState("")
    const uploadFiles = async (e, index) => {
        if (mode > 2) return

        const { files } = e.target;
        const refApiId = mode === 1 ? "SUA00539" : "SUA00542"
        let fileArr = [];

        for (let i = 0; i < files.length; i++) {
            let formData = new FormData();
            if (files[i].size > 1000 * 1000 * 1) {
                set_fileErr_msg("File size exceded : 25mb")
                break;
            } else {
                set_fileErr_msg("")
            }
            formData.append("vfile", files[i]);

            //"http://192.168.0.44/SuV4Sa/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00499" + "&appId=" + "" + "&mobRegNo=" + "",
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + refApiId + "&appId=" + "" + "&mobRegNo=" + "" + "&fileCatCd=" + "C0004",
                    formData, { headers }
                )
                .then((res) => {
                    if (res?.data?.appMsgList?.errorStatus === false) {
                        fileArr = [
                            ...fileArr,
                            {
                                ...res.data.content
                                //name: "File "+(doc.length+1+i)
                                // name: files[i].name,
                            },
                        ];
                    }
                    else {
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                        set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        }

        set_doc([...doc, ...fileArr]);
        console.log("doc", doc);


        setFormData({
            ...formData,
            dtl02: [...doc, ...fileArr]
        });
        console.log("formData", formData);

    };
    const download_file = async (e, i) => {
        const obj = {
            apiId: "SUA00488",
            mst: {
                fileId: formData.dtl02[i]?.fileId,
                fileNm: formData.dtl02[i]?.fileNm
            }
        }
        // await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",
        // obj, {headers})
        // .then((res) => {
        //  await fetch(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile", 
        //  {
        //     method: 'POST',
        //     headers: {
        //       ...headers,
        //       'Content-Type': 'application/octet-stream',
        //     },
        //     body: JSON.stringify(obj)

        //   })
        //   .then((response) => response.blob())
        //   .then((blob) => {
        //   // Create blob link to download
        //   const url = window.URL.createObjectURL(
        //     new Blob([blob]),
        //   );
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.setAttribute(
        //     'download'
        //   );

        //   // Append to html link element page
        //   document.body.appendChild(link);

        //   // Start download
        //   link.click();

        //   // Clean up and remove the link
        //   link.parentNode.removeChild(link);
        // })
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/downloadFile", obj, {
            headers: {
                Authorization: headers?.Authorization,
                Accept: "application/zip"
            },
            responseType: 'arraybuffer',
        })
            .then((res) => {
                //fileDownload(res.data, "file.pdf")
                const url = window.URL.createObjectURL(
                    new Blob([res.data]),
                );
                const tempArr = doc[i]?.fileNm?.split(".") || [];
                const extention = tempArr[tempArr?.length - 1] || "pdf"
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download', formData.dtl02[i]?.fileId + "." + extention
                );
                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                //link.parentNode.removeChild(link);
            })
    }

    const delete_file = async (e, i) => {
        let obj = {
            apiId: "SUA00489",
            mst: [{
                flUpldLogNo: formData.dtl02[i]?.flUpldLogNo
            }]
        }
        console.log("yyyyyyyy", formData.dtl02[i]);

        if (window.confirm("Are you sure? File cannot be recover once deleted !")) {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/forceFileDeletion",
                    obj, { headers }
                    // formData
                )
                .then((res) => {
                    if (res?.data?.appMsgList?.errorStatus === false) {
                        const updatedDtl01 = [...formData.dtl02];

                        updatedDtl01[i] = {
                            ...updatedDtl01[i],
                            flUpldLogNo: "",
                            fileId: "",
                            fileNm: "",
                            filePath: "",
                            fileUrl: "",
                            fileTyp: "",
                            fileSz: 0
                        };

                        setFormData({
                            ...formData,
                            dtl02: updatedDtl01
                        });
                    }
                    else {
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        }
    };


    console.log("gggggggg", formData);

    // {
    //   ...item,
    //   fileId: "",
    //   fileNm: "",
    //   filePath: "",
    //   fileSz: 0,
    //   fileTyp: "",
    //   fileUrl: "",
    //   flUpldLogNo: "",
    // }))}








    return (
        <div className="container">
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

            <h4 className="card-title">Search Court Case{getFormTitle(mode)}</h4>
            <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                <div className="row mb-4">
                    <label className="col-md-3 form-label">Case Id</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.ccaseId} type="text" disabled={mode===3 || mode===4} />
                    </div>
                    <label className="col-md-3 form-label">Date Of Filling</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.ccasedof} type="date" onChange={handleInputChange} required  disabled={mode===3 || mode===4}/>
                    </div>
                </div>

                <div className="row mb-4">
                    <label className="col-md-3 form-label">Year</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.ccaseYr} type="text" readOnly />
                    </div>
                    <label className="col-md-3 form-label">Case Type</label>
                    <div className="col-md-3">
                        <input className="form-select col-md-12" onChange={handleStatusChange}
                            name="ccaseTypNm"
                            value={formData?.ccaseTypNm}
                            disabled={mode === 3 || mode === 4}

                        />
                    </div>
                </div>


                {/* Court Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Court:<span className="text-red">*</span></b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" /></span>}
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control col-md-3"
                                required
                                disabled={mode === 3 || mode === 4}
                                value={formData.courtId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="courtDesc"
                                disabled={mode === 3 || mode === 4}
                                value={formData.courtNm}

                            />
                        </div>
                    </div>
                </div>
                {/* Case No*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Case No:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" readOnly name="ccaseNo" value={formData.ccaseNo} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>
                </div>}


                {/*  Ref Case Id Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b> Ref Case Id:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control col-md-3"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.ccaseId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                name="ccaseNm"
                                disabled={mode === 3 || mode === 4}
                                value={formData.ccaseNm}

                            />
                        </div>
                    </div>
                </div>

                {/* Year*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Year:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" readOnly name="ccaseYr" value={formData.ccaseYr} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>
                </div>}

                {/* Brief Description */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Brief Description:</label>
                    <div className="col-md-9 input-group">
                        <textarea type="text" className="form-control rounded-3 ui_entry_txt_rc" name="ccaseDesc" value={formData.ccaseDesc} onChange={handleInputChange}
                            disabled={mode === 3 || mode === 4}
                            required
                            maxLength={1000} onFocus={() => toggleCharCountVisibility("ccaseDesc")}
                            onBlur={() => toggleCharCountVisibility("ccaseDesc")}
                        />
                        {fieldCharCountVisibility.ccaseDesc && (
                            <span className="input-group-text">
                                {formData?.ccaseDesc?.length}/1000
                            </span>
                        )}
                    </div>
                </div>

                {/* Section of law*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Section of law:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" required name="secOfLaw" value={formData.secOfLaw} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} maxLength={500} onFocus={() => toggleCharCountVisibility("secOfLaw")}
                                onBlur={() => toggleCharCountVisibility("secOfLaw")}
                            />
                            {fieldCharCountVisibility.secOfLaw && (
                                <span className="input-group-text">
                                    {formData?.secOfLaw?.length}/500
                                </span>
                            )}
                        </div>
                    </div>
                </div>}

                {/* Petitioner*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Petitioner:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" required name="petnNm" value={formData.petnNm} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} maxLength={500} onFocus={() => toggleCharCountVisibility("petnNm")}
                                onBlur={() => toggleCharCountVisibility("petnNm")}
                            />
                            {fieldCharCountVisibility.petnNm && (
                                <span className="input-group-text">
                                    {formData?.petnNm?.length}/500
                                </span>
                            )}
                        </div>
                    </div>
                </div>}

                {/* Advocate Of Petitioner*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Advocate Of Petitioner:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" name="petnAdvocateNm" value={formData.petnAdvocateNm} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>
                </div>}


                {/* Respondent */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Respondent:</label>
                    <div className="col-md-9 input-group">
                        <textarea type="text" className="form-control rounded-3 ui_entry_txt_rc" name="respndtNm" value={formData.respndtNm} onChange={handleInputChange}
                            disabled={mode === 3 || mode === 4}
                            required
                            maxLength={1000} onFocus={() => toggleCharCountVisibility("respndtNm")}
                            onBlur={() => toggleCharCountVisibility("respndtNm")}
                        />
                        {fieldCharCountVisibility.respndtNm && (
                            <span className="input-group-text">
                                {formData?.respndtNm?.length}/1000
                            </span>
                        )}
                    </div>
                </div>



                {/* Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title=""  /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateNm}

                            />
                           
                        </div>
                    </div>
                </div>

                {/*2nd Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Second Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title=""  /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateIdTwo}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateIdTwoNm}

                            />
                        </div>
                    </div>
                </div>

                {/*3rd Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Third Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateIdThree}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.advocateIdThreeNm}

                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Status:</label>

                    <div className="col-md-9">
                        <select
                            className="form-select col-md-12" onChange={handleStatusChange}
                            name="status"
                            value={formData?.ccaseStat}
                            disabled={mode === 3 || mode === 4}
                        //defaultValue={edtVal.dtlActFlg}
                        // onChange={handleStatusChange}
                        // value={edtVal.actFlg}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.ddCcaseStat?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.ddCcaseStat?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }



                        </select>
                    </div>
                </div>}


                {/* Detail Status */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Details Status:</label>
                    <div className="col-md-9 input-group">
                        <textarea type="text" className="form-control rounded-3 ui_entry_txt_rc" name="ccaseStatDesc" value={formData.ccaseStatDesc} onChange={handleInputChange}
                            disabled={mode === 3 || mode === 4}
                            // required
                            maxLength={1000} onFocus={() => toggleCharCountVisibility("ccaseStatDesc")}
                            onBlur={() => toggleCharCountVisibility("ccaseStatDesc")}
                        />
                        {fieldCharCountVisibility.ccaseStatDesc && (
                            <span className="input-group-text">
                                {formData?.ccaseStatDesc?.length}/1000
                            </span>
                        )}
                    </div>
                </div>


                {/* Remarks */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Remarks:</label>
                    <div className="col-md-9 input-group">
                        <textarea type="text" className="form-control rounded-3 ui_entry_txt_rc" name="ccaseRmks" value={formData.ccaseRmks} onChange={handleInputChange}
                            disabled={mode === 3 || mode === 4}
                            // required
                            maxLength={1000} onFocus={() => toggleCharCountVisibility("ccaseRmks")}
                            onBlur={() => toggleCharCountVisibility("ccaseRmks")}
                        />
                        {fieldCharCountVisibility.ccaseRmks && (
                            <span className="input-group-text">
                                {formData?.ccaseRmks?.length}/1000
                            </span>
                        )}
                    </div>
                </div>


                {/*Division Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Division:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title=""  /></span>}

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
                        </div>
                    </div>
                </div>


                {/* File No*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">File No:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" name="petnNm" value={formData.userFileNo} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} maxLength={50} onFocus={() => toggleCharCountVisibility("userFileNo")}
                                onBlur={() => toggleCharCountVisibility("userFileNo")}
                            />
                            {fieldCharCountVisibility.userFileNo && (
                                <span className="input-group-text">
                                    {formData?.userFileNo?.length}/50
                                </span>
                            )}
                        </div>
                    </div>
                </div>}

                {/* SMS text*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">SMS Text:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" required name="smstxt" value={formData.smstxt} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} maxLength={160} onFocus={() => toggleCharCountVisibility("smstxt")}
                                onBlur={() => toggleCharCountVisibility("smstxt")}
                            />
                            {fieldCharCountVisibility.smstxt && (
                                <span className="input-group-text">
                                    {formData?.smstxt?.length}/160
                                </span>
                            )}
                        </div>
                    </div>
                </div>}

                {<div className="row mb-4">
                    <label className="col-md-3 form-label">
                        PHED Status:
                    </label>
                    <div className="col-md-9">
                        <select
                            className="form-select col-md-12" onChange={handleStatusChange}
                            name="phedStatus"
                            value={formData?.phedStatus}
                            disabled={mode === 3 || mode === 4}
                        //defaultValue={edtVal.dtlActFlg}
                        // onChange={handleStatusChange}
                        // value={edtVal.actFlg}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.ddPhedStatus?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.ddPhedStatus?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }



                        </select>
                    </div>
                </div>}
                {<div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Status:
                    </label>
                    <div className="col-md-9">
                        <select
                            className="form-select col-md-12" onChange={handleStatusChange}
                            name="actFlg"
                            value={formData?.actFlg}
                            disabled={mode === 3 || mode === 4}
                        //defaultValue={edtVal.dtlActFlg}
                        // onChange={handleStatusChange}
                        // value={edtVal.actFlg}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.ddActFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.ddActFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }



                        </select>
                    </div>
                </div>}






                <Card>
                    <Card.Title className="pt-2 " style={{ backgroundColor: "#6259c9", height: "35px" }}><p className="font-weight-bold text-white">&nbsp;Hearing Details</p></Card.Title>
                    <div className="table-responsive table">
                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                            <thead>
                                <tr>
                                    <th className="sno">Row#</th>
                                    <th>Sl No</th>
                                    <th> DOH<span className="text-red">*</span></th>
                                    <th> Date Type<span className="text-red">*</span></th>
                                    <th> TOH<span className="text-red">*</span></th>
                                    {/* <th> TOH<span className="text-red">*</span></th> */}
                                    {/* <th> Actual Table Name<span className="text-red">*</span></th>
                  <th>Merge Mode<span className="text-red">*</span></th>
                  <th>Store Procedure Name</th>
                  <th></th>
                  <th>API Id</th>*/}
                                    <th>Court</th>
                                    {/* <th>Status</th> */}
                                    {<th>Status</th>}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.dtl01.map((row, index) => (
                                    row.action !== "D" ? row.actFlg !== "D" && <tr key={index}>
                                        <td>{index + 1}</td>

                                        <td>
                                            <div className=" input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.chrngSlNo}
                                                    className="form-control"
                                                    type="text"
                                                    name="chrngSlNo"
                                                    readOnly
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={30}
                                                />

                                            </div>

                                        </td>
                                        <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.ccaseDoh}
                                                    className="form-control"
                                                    type="text"
                                                    name="ccaseDoh"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={10}
                                                    onFocus={() => toggleCharCountVisibility("ccaseDoh")}
                                                    onBlur={() => toggleCharCountVisibility("ccaseDoh")}

                                                />
                                                {fieldCharCountVisibility.ccaseDoh && (
                                                    <span className="input-group-text">
                                                        {row?.ccaseDoh?.length}/10
                                                    </span>
                                                )}


                                            </div>

                                        </td>

                                        {<td>
                                            <select
                                                className="form-control select"
                                                aria-label=".form-select-lg example"
                                                id="status"
                                                value={row.datetyp}
                                                required
                                                disabled={mode === 3 || mode === 4}
                                                onChange={(e) => handleDtlStatusChange(e, index)}
                                                name="datetyp"

                                            >


                                                <option disabled>--Select--</option>

                                                {(mode === 1) ?
                                                    (addVal?.dtl01 && addVal?.dtl01[0]?.ddDataTyp?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    ))) : (edtVal?.dtl01 && edtVal?.dtl01[0]?.ddDateTypFlg?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    )))
                                                }
                                            </select>

                                        </td>}

                                        <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.ccaseToh}
                                                    className="form-control"
                                                    type="time"
                                                    name="ccaseToh"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                // maxLength={5}
                                                // onFocus={() => toggleCharCountVisibility("ccaseToh")}
                                                // onBlur={() => toggleCharCountVisibility("ccaseToh")}

                                                />
                                                {/* {fieldCharCountVisibility.ccaseToh && (
                                                    <span className="input-group-text">
                                                        {row?.ccaseToh?.length}/5
                                                    </span>
                                                )} */}


                                            </div>

                                        </td>
                                        {/* <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.ccaseToh}
                                                    className="form-control"
                                                    type="text"
                                                    name="ccaseToh"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={5}
                                                    onFocus={() => toggleCharCountVisibility("ccaseToh")}
                                                    onBlur={() => toggleCharCountVisibility("ccaseToh")}

                                                />
                                                {fieldCharCountVisibility.ccaseToh && (
                                                    <span className="input-group-text">
                                                        {row?.ccaseToh?.length}/5
                                                    </span>
                                                )}


                                            </div>

                                        </td> */}

                                        <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.courtNo}
                                                    className="form-control"
                                                    type="text"
                                                    name="courtNo"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={10}
                                                    onFocus={() => toggleCharCountVisibility("courtNo")}
                                                    onBlur={() => toggleCharCountVisibility("courtNo")}

                                                />
                                                {fieldCharCountVisibility.courtNo && (
                                                    <span className="input-group-text">
                                                        {row?.courtNo?.length}/10
                                                    </span>
                                                )}


                                            </div>

                                        </td>

                                        {/* <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.chrngStat}
                                                    className="form-control"
                                                    type="text"
                                                    name="chrngStat"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={500}
                                                    onFocus={() => toggleCharCountVisibility("chrngStat")}
                                                    onBlur={() => toggleCharCountVisibility("chrngStat")}

                                                />
                                                {fieldCharCountVisibility.chrngStat && (
                                                    <span className="input-group-text">
                                                        {row?.chrngStat?.length}/500
                                                    </span>
                                                )}


                                            </div>

                                        </td> */}




                                        {<td>
                                            <select
                                                className="form-control select"
                                                aria-label=".form-select-lg example"
                                                id="status"
                                                value={row.actFlg}
                                                required
                                                disabled={mode === 3 || mode === 4}
                                                onChange={(e) => handleDtlStatusChange(e, index)}
                                                name="actFlg"

                                            >


                                                <option disabled>--Select--</option>

                                                {/*  Array.isArray(edtVal.chngReqDtl) && edtVal.chngReqDtl[0]?.ddActFlg && Array.isArray(edtVal.chngReqDtl[0].ddActFlg)) && */}
                                                {edtVal?.dtl01 && edtVal?.dtl01[0]?.ddActFlg?.map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))
                                                }
                                            </select>

                                        </td>}

                                        <td>
                                            {index !== formData?.dtl01?.length - 1 ? (
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
                                                        className="action-button"
                                                        disabled={mode === 3 || mode === 4}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>}
                                                    <button type="button" onClick={addtableRow} disabled={mode === 3 || mode === 4} className="action-button">
                                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                    </button>

                                                </div>
                                            )}
                                        </td>

                                    </tr> : ""
                                ))}
                            </tbody>
                        </table>
                        {tblErr && (
                            <p className="error-message text-red d-flex justify-content-center">{tblErr}</p>
                        )}
                    </div>
                </Card>
                {/* <Card>
                    <Card.Title className="pt-2 " style={{ backgroundColor: "#6259c9", height: "35px" }}><p className="font-weight-bold text-white">&nbsp;Attach Files</p></Card.Title>
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Attach File:</label>
                        <div className="col-md-9">

              {<div className="file-upload">
                <div className="input-name">Choose File</div>
                <input
                  style={{ visibility: (mode === 1 || mode === 2) ? "visible" : "hidden" }}
                  type="file"
                  required={mode === 1}
                  className="form-control"
                  id="formFile"
                  onChange={uploadFiles}
                  name="File"
                  //required={!doc.length}
                  // multiple
                  // accept=".pdf"
                  disabled={mode === 3 || mode === 4}
                />
              </div>}
              {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

              {formData?.dtl02?.map((file, i) => (
                <div className="file-div">
                  {(file.filePath) && <Smalltag
                    handleClick={() =>
                      window.open(
                        process.env.REACT_APP_API_URL_PREFIX +
                        file.fileUri,
                        "_blank",
                        "rel=noopener noreferrer"
                      )
                    }
                    fontAwsmIcon={"fa-file"}
                    lable={file.fileNm}
                    key={i}
                  />}

                  {mode !== 4 && ((file?.filePath) &&
                    <>
                      <Delete
                        onClick={(e) => delete_file(e, i)}
                        className="cross-icon"
                      />

                      <Download
                        onClick={(e) => download_file(e, i)}
                        className="cross-icon"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
                    </div>
                </Card> */}

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
export default SearchCourtCaseViewForm;


