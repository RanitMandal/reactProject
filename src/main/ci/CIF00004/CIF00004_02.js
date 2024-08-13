
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
import { divLovColumns, courtLovColumns, refCaseLovColumns, advLovColumns, petAdvLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };

export const CourtCasesMaintenanceForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

    console.log(edtVal);
    console.log(addVal);
    console.log(addVal.ddImgDbFlg);
    const userId = getScplAdContext().userId;
    const reqEmailId = getScplAdContext().mailId;
    const reqMobNo = getScplAdContext().mobNo;
    const reqAppLogNo = getScplAdContext().appLogNo;
    const initLvlRefCd = sessionStorage.getItem("lvlRefCd")
    console.log(initLvlRefCd);
    const [formData, setFormData] = useState({
        ccaseId: "",
        ccaseDof: "",
        courtId: '',
        courtNm: '',
        ccaseTypCd: '',
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
        advocateIdTwo: '',
        advocateIdTwoNm: '',
        advocateIdThree: '',
        advocateIdThreeNm: '',
        petnAdvocateIdTwo: '',
        petnAdvocateIdTwoNm: '',
        petnAdvocateIdThree: '',
        petnAdvocateIdThreeNm: '',
        ccaseStat: 'N',
        ccaseStatDesc: '',
        ccaseRmks: '',
        parCcaseId: '',
        parCcaseDesc: '',
        parCcaseYr: '',
        userFileNo: '',
        divCd: '',
        smstxt: '',
        actFlg: "A",

        dtl01: [
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


    const getDateFormart_ddmmyyyy = (ddmmyyyy) => {
        console.log(ddmmyyyy);


        if (ddmmyyyy) {
            const day = ddmmyyyy.slice(8, 10)
            const month = ddmmyyyy.slice(5, 7)
            const year = ddmmyyyy.slice(0, 4)
            console.log(`${day}-${month}-${year}`);
            // return `${day}-${month}-${year}`
            return `${year}-${month}-${day}`

        } else return ""
    }
    // let ccaseDof = getDateFormart_ddmmyyyy(edtVal?.ccaseDof);

    useEffect(() => {
        if (formData.ccaseDof) {
            let date = new Date(formData.ccaseDof);
            if (!isNaN(date)) {
                let n = date.getFullYear();
                console.log(n);
                setFormData({
                    ...formData,
                    ccaseYr: n,
                    dtl01: formData?.dtl01,
                    dtl02: formData?.dtl02
                })
            }
        }
    }, [formData.ccaseDof])


    // CaseTpe Lov Starts..................   

    const [caseTypLovData, setCaseTypLovData] = useState([]);
    useEffect(() => {

        const fetchCaseTypLovData = async () => {
            let obj = {
                apiId: 'CIA00042'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllCcaseTyp", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCaseTypLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchCaseTypLovData();
    }, []);


    //   const getCaseTypNm = (obj) => {
    //     return caseTypLovData[Number(Object.keys(obj)[0])]?.chgReqTypDesc ? caseTypLovData[Number(Object.keys(obj)[0])]?.chgReqTypDesc : ""
    //   }

    //   const getCaseTypId = (obj) => {
    //     return caseTypLovData[Number(Object.keys(obj)[0])]?.chngReqTypCd ? caseTypLovData[Number(Object.keys(obj)[0])]?.chngReqTypCd : ""
    //   }

    //   const [selectRowCaseTyp, setSelectRowCaseTyp] = useState("");
    //   const [selectRowCaseTypLov, setSelectRowCaseTypLov] = useState("");
    //   const [showModelCaseTypLov, setShowModelCaseTypLov] = useState(false);
    //   const handleRowClickCaseTypLov = (rowData) => {
    //     setSelectRowCaseTyp(rowData);
    //     setSelectRowCaseTypLov(rowData);
    //     setFormData({
    //       ...formData,
    //       caseTypCd: getCaseTypId(rowData),
    //       caseTypDesc: getCaseTypNm(rowData),
    //       dtl01: [...formData.dtl01]
    //     })

    //   };
    console.log(queryInputObj);
    //caseType Lov ends 



    //Court Lov Starts     

    const [courtLovData, setCourtLovData] = useState([]);
    useEffect(() => {

        const fetchCourtLovData = async () => {
            let obj = {
                apiId: 'CIA00039'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllCourt", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCourtLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchCourtLovData();
    }, []);


    const getCourtNm = (obj) => {
        return courtLovData[Number(Object.keys(obj)[0])]?.courtNm ? courtLovData[Number(Object.keys(obj)[0])]?.courtNm : ""
    }

    const getCourtId = (obj) => {
        return courtLovData[Number(Object.keys(obj)[0])]?.courtId ? courtLovData[Number(Object.keys(obj)[0])]?.courtId : ""
    }

    const [selectRowCourt, setSelectRowCourt] = useState("");
    const [selectRowCourtLov, setSelectRowCourtLov] = useState("");
    const [showModelCourtLov, setShowModelCourtLov] = useState(false);
    const handleRowClickCourtLov = (rowData) => {
        setSelectRowCourt(rowData);
        setSelectRowCourtLov(rowData);
        setFormData({
            ...formData,
            courtId: getCourtId(rowData),
            courtNm: getCourtNm(rowData),
            dtl01: [...formData.dtl01]
        })

    };
    console.log(queryInputObj);
    //Court Lov ends 

    //Ref Case Lov Starts     

    const [refCaseLovData, setRefCaseLovData] = useState([]);
    useEffect(() => {

        const fetchRefCaseLovData = async () => {
            let obj = {
                apiId: 'CIA00040'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllCcaseId", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setRefCaseLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchRefCaseLovData();
    }, []);


    const getRefCaseNm = (obj) => {
        return refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseDesc ? refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseDesc : ""
    }

    const getRefCaseId = (obj) => {
        return refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseId ? refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseId : ""
    }

    const getRefCaseYr = (obj) => {
        return refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseYr ? refCaseLovData[Number(Object.keys(obj)[0])]?.cCaseYr : ""
    }

    const [selectRowRefCase, setSelectRowRefCase] = useState("");
    const [selectRefCaseLov, setSelectRowRefCaseLov] = useState("");
    const [showModelRefCaseLov, setShowModelRefCaseLov] = useState(false);
    const handleRowClickRefCaseLov = (rowData) => {
        setSelectRowRefCase(rowData);
        setSelectRowRefCaseLov(rowData);
        setFormData({
            ...formData,
            parCcaseId: getRefCaseId(rowData),
            parCcaseDesc: getRefCaseNm(rowData),
            parCcaseYr: getRefCaseYr(rowData),
            dtl01: [...formData.dtl01]
        })

    };
    console.log(queryInputObj);
    //RefCase Lov ends 










    // Advocate Lov
    const [advLovData, setAdvLovData] = useState([]);

    useEffect(() => {

        const fetchAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00041'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchAdvLovData();
    }, []);

    const getAdvNm = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateNm ? advLovData[Number(Object.keys(obj)[0])]?.advocateNm : ""
    }

    const getAdvId = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateCd ? advLovData[Number(Object.keys(obj)[0])]?.advocateCd : ""
    }

    const [selectRowAdv, setSelectRowAdv] = useState("");
    const [selectRowAdvLov, setSelectRowAdvLov] = useState("");
    const [showModelAdvLov, setShowModelAdvLov] = useState(false);
    const handleRowClickAdvLov = (rowData) => {
        setSelectRowAdv(rowData);
        setSelectRowAdvLov(rowData);
        setFormData({
            ...formData,
            advocateId: getAdvId(rowData),
            advocateNm: getAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    //Advocate Lov ends 

    //2nd Advocate Lov
    const [secAdvLovData, setSecAdvLovData] = useState([]);

    useEffect(() => {

        const fetchSecAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00041'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setSecAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchSecAdvLovData();
    }, []);




    const getSecAdvNm = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateNm ? advLovData[Number(Object.keys(obj)[0])]?.advocateNm : ""
    }

    const getSecAdvId = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateCd ? advLovData[Number(Object.keys(obj)[0])]?.advocateCd : ""
    }

    const [selectRowSecAdv, setSelectRowSecAdv] = useState("");
    const [selectRowSecAdvLov, setSelectRowSecAdvLov] = useState("");
    const [showModelSecAdvLov, setShowModelSecAdvLov] = useState(false);
    const handleRowClickSecAdvLov = (rowData) => {
        setSelectRowSecAdv(rowData);
        setSelectRowSecAdvLov(rowData);
        setFormData({
            ...formData,
            advocateIdTwo: getSecAdvId(rowData),
            advocateIdTwoNm: getSecAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    // 2nd Advocate Lov ends 



    //3rd Advocate Lov
    const [thrdAdvLovData, setThrdAdvLovData] = useState([]);

    useEffect(() => {

        const fetchThrdAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00041'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setThrdAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchThrdAdvLovData();
    }, []);

    const getThrdAdvNm = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateNm ? advLovData[Number(Object.keys(obj)[0])]?.advocateNm : ""
    }

    const getThrdAdvId = (obj) => {
        return advLovData[Number(Object.keys(obj)[0])]?.advocateCd ? advLovData[Number(Object.keys(obj)[0])]?.advocateCd : ""
    }

    const [selectRowThrdAdv, setSelectRowThrdAdv] = useState("");
    const [selectRowThrdAdvLov, setSelectRowThrdAdvLov] = useState("");
    const [showModelThrdAdvLov, setShowModelThrdAdvLov] = useState(false);
    const handleRowClickThrdAdvLov = (rowData) => {
        setSelectRowThrdAdv(rowData);
        setSelectRowThrdAdvLov(rowData);
        setFormData({
            ...formData,
            advocateIdThree: getThrdAdvId(rowData),
            advocateIdThreeNm: getThrdAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    // 3rd Advocate Lov ends 


    //Petn Advocate Lov
    const [petnAdvLovData, setPetnAdvLovData] = useState([]);

    useEffect(() => {

        const fetchPetnAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00062'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllOthersAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setPetnAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchPetnAdvLovData();
    }, []);

    const getPetnAdvNm = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm : ""
    }

    const getPetnAdvId = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd : ""
    }

    const [selectRowPetnAdv, setSelectRowPetnAdv] = useState("");
    const [selectRowPetnAdvLov, setSelectRowPetnAdvLov] = useState("");
    const [showModelPetnAdvLov, setShowModelPetnAdvLov] = useState(false);
    const handleRowClickPetnAdvLov = (rowData) => {
        setSelectRowPetnAdv(rowData);
        setSelectRowPetnAdvLov(rowData);
        setFormData({
            ...formData,
            petnAdvocateId: getPetnAdvId(rowData),
            petnAdvocateIdOneNm: getPetnAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    // petn Advocate Lov ends 



    //2nd Petn Advocate Lov
    const [secPetnAdvLovData, setSecPetnAdvLovData] = useState([]);

    useEffect(() => {

        const fetchSecPetnAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00062'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllOthersAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setSecPetnAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchSecPetnAdvLovData();
    }, []);

    const getSecPetnAdvNm = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm : ""
    }

    const getSecPetnAdvId = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd : ""
    }

    const [selectRowSecPetnAdv, setSelectRowSecPetnAdv] = useState("");
    const [selectRowSecPetnAdvLov, setSelectRowSecPetnAdvLov] = useState("");
    const [showModelSecPetnAdvLov, setShowModelSecPetnAdvLov] = useState(false);
    const handleRowClickSecPetnAdvLov = (rowData) => {
        setSelectRowSecPetnAdv(rowData);
        setSelectRowSecPetnAdvLov(rowData);
        setFormData({
            ...formData,
            petnAdvocateIdTwo: getSecPetnAdvId(rowData),
            petnAdvocateIdTwoNm: getSecPetnAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    //2nd petn Advocate Lov ends 



    //2nd Petn Advocate Lov
    const [thrdPetnAdvLovData, setThrdPetnAdvLovData] = useState([]);

    useEffect(() => {

        const fetchThrdPetnAdvLovData = async () => {
            let obj = {
                apiId: 'CIA00062'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllOthersAdvocate", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setThrdPetnAdvLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchThrdPetnAdvLovData();
    }, []);

    const getThrdPetnAdvNm = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateNm : ""
    }

    const getThrdPetnAdvId = (obj) => {
        return petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd ? petnAdvLovData[Number(Object.keys(obj)[0])]?.othAdvocateCd : ""
    }

    const [selectRowThrdPetnAdv, setSelectRowThrdPetnAdv] = useState("");
    const [selectRowThrdPetnAdvLov, setSelectRowThrdPetnAdvLov] = useState("");
    const [showModelThrdPetnAdvLov, setShowModelThrdPetnAdvLov] = useState(false);
    const handleRowClickThrdPetnAdvLov = (rowData) => {
        setSelectRowThrdPetnAdv(rowData);
        setSelectRowThrdPetnAdvLov(rowData);
        setFormData({
            ...formData,
            petnAdvocateIdThree: getThrdPetnAdvId(rowData),
            petnAdvocateIdThreeNm: getThrdPetnAdvNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    //3rd petn Advocate Lov ends 





    //division Lov
    const [divLovData, setDivLovData] = useState([]);

    useEffect(() => {

        const fetchDivLovData = async () => {
            let obj = {
                apiId: 'CIA00041'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00004/getAllDivision", obj, { headers })
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
        return divLovData[Number(Object.keys(obj)[0])]?.lvlNm ? divLovData[Number(Object.keys(obj)[0])]?.lvlNm : ""
    }

    const getDivId = (obj) => {
        return divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd : ""
    }

    const [selectRowDiv, setSelectRowDiv] = useState("");
    const [selectRowDivLov, setSelectRowDivLov] = useState("");
    const [showModelDivLov, setShowModelDivLov] = useState(false);
    const handleRowClickDivLov = (rowData) => {
        setSelectRowDiv(rowData);
        setSelectRowDivLov(rowData);
        setFormData({
            ...formData,
            divCd: getDivId(rowData),
            divNm: getDivNm(rowData),
            dtl01: formData.dtl01.map((dtlRow) => ({
                ...dtlRow,

            }))
        });


    };
    // Division Lov ends 


    // useEffect(() => {
    //     //const [selectRowMod, setSelectRowMod] = useState("");

    //     let modId = rowData?.modId || ""
    //     let resIndex = advLovData.findIndex(item => item.modId === modId)
    //     let currentModId = {}
    //     if (resIndex !== -1) currentModId = { [resIndex]: true }
    //     setSelectRowAdv(currentModId)
    //     //   console.log("9999999", resIndex, currentModId, modLovData, modId);

    //     let appId = edtVal?.mst?.appId || ""
    //     let resAppIndex = appLovData.findIndex(item => item.appId === appId)
    //     let currentAppId = {}
    //     if (resAppIndex !== -1) currentAppId = { [resAppIndex]: true }
    //     setSelectRow(currentAppId)
    //     console.log(appId);
    //     let formId = edtVal?.mst?.formId || ""
    //     let resFormIndex = advLovData.findIndex(item => item.formId === formId)
    //     let currentFormId = {}
    //     if (resFormIndex !== -1) currentFormId = { [resFormIndex]: true }
    //     setSelectRowSecAdv(currentFormId)

    // }, [rowData, edtVal, advLovData,  appLovData])


    useEffect(() => {
        console.log(edtVal.dtl01);
        if (mode !== 1) {
            // Set all properties of edtVal to null
            // set_tblLen(edtVal?.mst?.dtl?.length || 1)
            setFormData({
                ccaseId: rowData ? rowData?.ccaseId : "",
                ccaseDof: edtVal ? getDateFormart_ddmmyyyy(edtVal?.ccasedof) : "",
                courtId: edtVal ? edtVal?.courtId : '',
                courtNm: edtVal ? edtVal?.courtNm : '',
                ccaseTypCd: edtVal ? edtVal?.ccaseTypCd : '',
                ccaseNo: rowData ? rowData?.ccaseNo : "",
                ccaseYr: edtVal ? edtVal?.ccaseYr : 0,
                ccaseDesc: rowData ? rowData?.ccaseDesc : "",
                secOfLaw: edtVal ? edtVal?.secOfLaw : '',
                phedStatus: edtVal ? edtVal?.phedStatus : 'R',
                petnAdvocateId: edtVal ? edtVal?.petnAdvocateId : '',
                petnAdvocateIdOneNm: edtVal ? edtVal?.petnAdvocateIdOneNm : '',
                petnNm: edtVal ? edtVal?.petnNm : '',
                petnAdvocateNm: edtVal ? edtVal?.petnAdvocateNm : '',
                respndtNm: edtVal ? edtVal?.respndtNm : '',
                advocateId: edtVal ? edtVal?.advocateId : '',
                advocateNm: edtVal ? edtVal?.advocateNm : '',
                advocateIdTwo: edtVal ? edtVal?.advocateIdTwo : '',
                advocateIdTwoNm: edtVal ? edtVal?.advocateIdTwoNm : '',
                advocateIdThree: edtVal ? edtVal?.advocateIdThree : '',
                advocateIdThreeNm: edtVal ? edtVal?.advocateIdThreeNm : '',
                petnAdvocateIdTwo: edtVal ? edtVal?.petnAdvocateIdTwo : '',
                petnAdvocateIdTwoNm: edtVal ? edtVal?.petnAdvocateIdTwoNm : '',
                petnAdvocateIdThree: edtVal ? edtVal?.petnAdvocateIdThree : '',
                petnAdvocateIdThreeNm: edtVal ? edtVal?.petnAdvocateIdThreeNm : '',
                ccaseStat: edtVal ? edtVal?.ccaseStat : 'N',
                ccaseStatDesc: edtVal ? edtVal?.ccaseStatDesc : '',
                ccaseRmks: edtVal ? edtVal?.ccaseRmks : '',
                parCcaseId: edtVal ? edtVal?.parCcaseId : '',
                parCcaseDesc: edtVal ? edtVal?.parCcaseDesc : '',
                parCcaseYr: edtVal ? edtVal?.parCcaseYr : '',
                userFileNo: edtVal ? edtVal?.userFileNo === null ? "" : edtVal?.userFileNo : '',
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
                        datetyp: ""
                    }
                ],
                dtl02: edtVal?.dtl02 ? edtVal?.dtl02 : [
                    {
                        ccaseId: '',
                        fileSlNo: 0,
                        fileId: '',
                        fileNm: '',
                        filePath: '',
                        actFlg: 'A',
                        fileTyp: '',
                        fileSz: 0,
                        fileUri: '',
                        flUpldLogNo: ''
                    }
                ]
            })





        }

    }, [mode, edtVal, rowData]);
    console.log(formData);
    // Get All List
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/getListPageData', queryInputObj, { headers }).then((res) => {
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
            dtl01: [...formData.dtl01],
            dtl02: [...formData.dtl02]
        });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })

    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;
        if (name === "ccaseTypCd") {
            setReqFld(false)
        }

        setFormData({
            ...formData, [event.target.name]: event.target.value,
            dtl01: [...formData.dtl01],
            dtl02: [...formData.dtl02]
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
            ccaseId: "",
            ccaseDof: "",
            courtId: '',
            courtNm: '',
            ccaseTypCd: '',
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
            advocateNm: '',
            advocateIdTwo: '',
            advocateIdTwoNm: '',
            advocateIdThree: '',
            advocateIdThreeNm: '',
            petnAdvocateIdTwo: '',
            petnAdvocateIdTwoNm: '',
            petnAdvocateIdThree: '',
            petnAdvocateIdThreeNm: '',
            ccaseStat: 'N',
            ccaseStatDesc: '',
            ccaseRmks: '',
            parCcaseId: '',
            parCcaseDesc: '',
            parCcaseYr: '',
            userFileNo: '',
            divCd: '',
            smstxt: '',
            actFlg: "A",

            dtl01: [
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
        })


        console.log(edtVal);
    };








    const handle_confirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
            obj,
            { headers })
    }
    console.log("650",);

    const [reqFld, setReqFld] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.ccaseTypCd) {
            setReqFld(true)
            set_viewMsg(true)
            return;
        }
        // console.log(selectRowModGrpLov);
        const { petnAdvocateIdTwoNm, petnAdvocateIdThreeNm, petnAdvocateIdOneNm, advocateNm,
            advocateIdTwoNm, advocateIdThreeNm, parCcaseDesc, divNm, courtNm, action, actFlg, ccaseNm, ccaseId,
            ccaseYr, parCcaseYr, ...obj } = formData

        const addObj = {
            apiId: "CIA00057",
            mst: {
                ...obj,
                initLvlRefCd: initLvlRefCd,
                // parCcaseId: formData.parCcaseId,
                dtl01: obj.dtl01.map(item => {
                    const { ccaseId, chrngSlNo, actFlg, action, ...data } = item
                    return {
                        ...data,
                    }
                }),
                dtl02: formData.dtl02.map(item => {
                    const { fileUri, ...data } = item
                    return {
                        ...data,
                        fileSlNo: 0,
                        fileSz: parseInt(data.fileSz),
                        fileCatCd: "C0001"
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
            apiId: "CIA00059",
            mst: {
                ...obj,
                ccaseId: formData?.ccaseId,
                action: "U",
                dtl01: obj.dtl01.map(item => {
                    const { ddActFlg, ddDateTypFlg, ...data } = item
                    return {
                        ...data,
                        chrngSlNo: parseInt(data.chrngSlNo)

                    }
                }),
                dtl02: formData.dtl02.map(item => {
                    const { fileUri, ...data } = item
                    return {
                        ...data,
                        fileSlNo: parseInt(data.fileSlNo),
                        fileSz: parseInt(data.fileSz),
                        fileCatCd: "C0001",
                        
                        
                        // ccaseId:item.ccaseId
                    }
                })
            }
        }


        if (mode === 1) {
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    // fetchData()
                }
                const conf_obj = {
                    "apiId": "SUA00487",
                    "mst": formData.dtl02.map((item) => {
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
        }

        if (mode === 2) {
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()

                }
                formData.dtl02 = formData.dtl02.filter(item => item.action !== "D");
                const conf_obj = {
                    "apiId": "SUA00487",
                    "mst": formData.dtl02.map((item) => {
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

        }

        if (mode === 3)
            set_open(true)


    };


    const [open, set_open] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [delStatus, set_delStatus] = useState(false);
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: "CIA00058",
            mst: {
                ccaseId: formData.ccaseId

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00004/saveDelete', deleteObj, { headers }).then(res => {
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
        ccaseToh: false,
        courtNo: false,
        chrngStat: false
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
        const refApiId = mode === 1 ? "CIA00057" : "CIA00059"
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
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + refApiId + "&appId=" + "" + "&mobRegNo=" + "" + "&fileCatCd=" + "C0001",
                    formData, { headers }
                )
                .then((res) => {
                    if (res?.data?.appMsgList?.errorStatus === false) {
                        fileArr = [
                            ...fileArr,
                            {
                                ...res.data.content,
                                fileUrl: res.data.content.fileUri,
                                //name: "File "+(doc.length+1+i)
                                // name: files[i].name,
                                action: mode===2 ? "I":undefined
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
        if(mode!==1){
            setFormData({
                ...formData,
                dtl02: [...formData.dtl02, ...doc, ...fileArr]
            });
        }else{
            setFormData({
                ...formData,
                dtl02: [...doc, ...fileArr]
            });
        }

        
        console.log("formData", formData);

    };
    const download_file = async (e, i) => {
        if(mode===3 || mode===4){
            return;
        }
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
        if(mode===3 || mode===4){
            return;
        }
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
                        const updatedDtl02 = [...formData.dtl02];

                        updatedDtl02[i] = {
                            ...updatedDtl02[i],
                            action:"D"
                        };

                        setFormData({
                            ...formData,
                            dtl02: updatedDtl02
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

            <h4 className="card-title">Court Cases Maintenance {getFormTitle(mode)}</h4>
            <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                <div className="row mb-4">
                    <label className="col-md-3 form-label">Case Id</label>
                    <div className="col-md-3">
                        <input className="form-control" readOnly name="ccaseId" value={formData.ccaseId} type="text" />
                    </div>
                    <label className="col-md-3 form-label">Date Of Filling<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.ccaseDof} name="ccaseDof" type="date" onChange={handleInputChange} required disabled={mode===3 || mode===4} />
                    </div>
                </div>

                <div className="row mb-4">
                    <label className="col-md-3 form-label">Year</label>
                    <div className="col-md-3">
                        <input className="form-control" value={formData.ccaseYr} name="ccaseYr" type="text" readOnly />
                    </div>
                    <label className="col-md-3 form-label">Case Type<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <select
                            style={reqFld ? { border: "1px red solid" } : { border: "1px red ebeef2" }}
                            className="form-select col-md-12" onChange={handleStatusChange}
                            name="ccaseTypCd"
                            value={formData?.ccaseTypCd}
                            required
                            disabled={mode === 3 || mode === 4}
                        //defaultValue={edtVal.dtlActFlg}
                        // onChange={handleStatusChange}
                        // value={edtVal.actFlg}

                        >
                            <option >--Select--</option>

                            {
                                (caseTypLovData?.map((item) => (
                                    <option value={item.ccaseTypCd}>{item.ccaseTypNmSh}</option>
                                )))
                            }



                        </select>
                    </div>
                </div>


                {/* Court Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Court:<span className="text-red">*</span></b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelCourtLov(true)} /></span>}

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
                            <div className="row-mb-12">
                                {showModelCourtLov && <Lov
                                    moduleLovData={courtLovData}
                                    setShowModel={setShowModelCourtLov}
                                    showModel={showModelCourtLov}
                                    handleRowClick={handleRowClickCourtLov}
                                    columns={courtLovColumns}
                                    currentSelection={selectRowCourt}
                                    setCurrentSelection={setSelectRowCourt}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Case No*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Case No:<span className="text-red">*</span></label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" name="ccaseNo" value={formData.ccaseNo} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} maxLength={25} onFocus={() => toggleCharCountVisibility("ccaseNo")}
                            onBlur={() => toggleCharCountVisibility("ccaseNo")}
                        />
                        {fieldCharCountVisibility.ccaseNo && (
                            <span className="input-group-text">
                                {formData?.ccaseNo?.length}/25
                            </span>
                        )}
                        </div>
                    </div>
                </div>}


                {/*  Ref Case Id Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b> Ref Case Id:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelRefCaseLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control col-md-3"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.parCcaseId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                name="ccaseNm"
                                disabled={mode === 3 || mode === 4}
                                value={formData.parCcaseDesc}

                            />&nbsp;&nbsp;&nbsp;
                            <input type="text" className="form-control rounded-3 ui_display_txt_"  name="parCcaseYr" value={formData.parCcaseYr} 
                                disabled={mode === 3 || mode === 4} />
                            <div className="row-mb-12">
                                {showModelRefCaseLov && <Lov
                                    moduleLovData={refCaseLovData}
                                    setShowModel={setShowModelRefCaseLov}
                                    showModel={showModelRefCaseLov}
                                    handleRowClick={handleRowClickRefCaseLov}
                                    columns={refCaseLovColumns}
                                    currentSelection={selectRowRefCase}
                                    setCurrentSelection={setSelectRowRefCase}
                                />}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Year
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">Year:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            
                        </div>
                    </div>
                </div>} */}







                {/* Brief Description */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Brief Description:<span className="text-red">*</span></label>
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
                    <label className="col-md-3 form-label">Section of law:<span className="text-red">*</span></label>
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
                    <label className="col-md-3 form-label">Petitioner:<span className="text-red">*</span></label>
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
                    <label className="col-md-3 form-label">Advocate Of Petitioner:<span className="text-red">*</span></label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" name="petnAdvocateNm" value={formData.petnAdvocateNm} onChange={handleInputChange}
                                disabled={mode === 3 || mode === 4} required />
                        </div>
                    </div>
                </div>}


                {/* Respondent */}
                <div className="row mb-4 ">
                    <label className="col-md-3 form-label">Respondent:<span className="text-red">*</span></label>
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
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelAdvLov(true)} /></span>}

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
                            <div className="row-mb-12">
                                {showModelAdvLov && <Lov
                                    moduleLovData={advLovData}
                                    setShowModel={setShowModelAdvLov}
                                    showModel={showModelAdvLov}
                                    handleRowClick={handleRowClickAdvLov}
                                    columns={advLovColumns}
                                    currentSelection={selectRowAdv}
                                    setCurrentSelection={setSelectRowAdv}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/*2nd Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Second Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelSecAdvLov(true)} /></span>}

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
                            <div className="row-mb-12">
                                {showModelSecAdvLov && <Lov
                                    moduleLovData={secAdvLovData}
                                    setShowModel={setShowModelSecAdvLov}
                                    showModel={showModelSecAdvLov}
                                    handleRowClick={handleRowClickSecAdvLov}
                                    columns={advLovColumns}
                                    currentSelection={selectRowSecAdv}
                                    setCurrentSelection={setSelectRowSecAdv}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/*3rd Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Third Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelThrdAdvLov(true)} /></span>}

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
                            <div className="row-mb-12">
                                {showModelThrdAdvLov && <Lov
                                    moduleLovData={thrdAdvLovData}
                                    setShowModel={setShowModelThrdAdvLov}
                                    showModel={showModelThrdAdvLov}
                                    handleRowClick={handleRowClickThrdAdvLov}
                                    columns={advLovColumns}
                                    currentSelection={selectRowThrdAdv}
                                    setCurrentSelection={setSelectRowThrdAdv}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/*Petn Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Petitioner Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelPetnAdvLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateIdOneNm}

                            />
                            <div className="row-mb-12">
                                {showModelPetnAdvLov && <Lov
                                    moduleLovData={petnAdvLovData}
                                    setShowModel={setShowModelPetnAdvLov}
                                    showModel={showModelPetnAdvLov}
                                    handleRowClick={handleRowClickPetnAdvLov}
                                    columns={petAdvLovColumns}
                                    currentSelection={selectRowPetnAdv}
                                    setCurrentSelection={setSelectRowPetnAdv}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/*2nd Petn Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Second Petitioner Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelSecPetnAdvLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateIdTwo}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateIdTwoNm}

                            />
                            <div className="row-mb-12">
                                {showModelSecPetnAdvLov && <Lov
                                    moduleLovData={secPetnAdvLovData}
                                    setShowModel={setShowModelSecPetnAdvLov}
                                    showModel={showModelSecPetnAdvLov}
                                    handleRowClick={handleRowClickSecPetnAdvLov}
                                    columns={petAdvLovColumns}
                                    currentSelection={selectRowSecPetnAdv}
                                    setCurrentSelection={setSelectRowSecPetnAdv}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/*3rd Petn Advocate Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Third Petitioner Advocate:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelThrdPetnAdvLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateIdThree}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.petnAdvocateIdThreeNm}

                            />
                            <div className="row-mb-12">
                                {showModelThrdPetnAdvLov && <Lov
                                    moduleLovData={thrdPetnAdvLovData}
                                    setShowModel={setShowModelThrdPetnAdvLov}
                                    showModel={showModelThrdPetnAdvLov}
                                    handleRowClick={handleRowClickThrdPetnAdvLov}
                                    columns={petAdvLovColumns}
                                    currentSelection={selectRowThrdPetnAdv}
                                    setCurrentSelection={setSelectRowThrdPetnAdv}
                                />}
                            </div>
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


                {/* File No*/}
                {<div className=" row mb-4">
                    <label className="col-md-3 form-label">File No:</label>
                    <div className="col-md-9">
                        <div className="input-group ">
                            <input type="text" className="form-control rounded-3 ui_display_txt_" name="userFileNo" value={formData.userFileNo} onChange={handleInputChange}
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
                    <label className="col-md-3 form-label">SMS Text:<span className="text-red">*</span></label>
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
                                    {/* <th> Actual Table Name<span className="text-red">*</span></th>
                  <th>Merge Mode<span className="text-red">*</span></th>
                  <th>Store Procedure Name</th>
                  <th></th>
                  <th>API Id</th>*/}
                                    <th>Court</th>
                                    <th>Status</th>
                                    {(mode !== 1) && <th>Status</th>}
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
                                                    type="date"
                                                    name="ccaseDoh"
                                                    // required
                                                    disabled={mode === 3 || mode === 4}
                                                    maxLength={10}
                                                // onFocus={() => toggleCharCountVisibility("ccaseDoh")}
                                                // onBlur={() => toggleCharCountVisibility("ccaseDoh")}

                                                />
                                                {/* {fieldCharCountVisibility.ccaseDoh && (
                                                    <span className="input-group-text">
                                                        {row?.ccaseDoh?.length}/10
                                                    </span>
                                                )} */}


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
                                                    disabled={mode !== 2}
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

                                        <td>
                                            <div className="input-group">
                                                <input
                                                    onChange={(e) => handleDtlInputChange(e, index)}
                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.chrngStat}
                                                    className="form-control"
                                                    type="text"
                                                    name="chrngStat"
                                                    // required
                                                    disabled={mode !== 2}
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

                                        </td>




                                        {(mode !== 1) && <td>
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

                                                {(mode === 1) ?
                                                    (addVal?.dtl01 && addVal?.dtl01[0]?.ddActFlg?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    ))) : (edtVal?.dtl01 && edtVal?.dtl01[0]?.ddActFlg?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    )))
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
                <Card>
                    <Card.Title className="pt-2 " style={{ backgroundColor: "#6259c9", height: "35px" }}><p className="font-weight-bold text-white">&nbsp;Attach Files</p></Card.Title>
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Attach File:</label>
                        <div className="col-md-9">

                            { ((mode === 1 || mode === 2) && <div className="file-upload">
                                <div className="input-name">Choose File</div>
                                <input
                                    style={{ visibility: (mode === 1 || mode === 2) ? "visible" : "hidden" }}
                                    type="file"
                                    // required={mode === 1}
                                    className="form-control"
                                    id="formFile"
                                    onChange={uploadFiles}
                                    name="File"
                                    //required={!doc.length}
                                    multiple
                                    // accept=".pdf"
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>)}
                            {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

                            {formData?.dtl02?.map((file, i) => (
                              (file.action !=="D") &&  <div className="file-div">
                                    {(file.filePath) && <Smalltag
                                        handleClick={() =>
                                            window.open(
                                                process.env.REACT_APP_API_URL_PREFIX +
                                                file.fileUrl,
                                                "_blank",
                                                "rel=noopener noreferrer"
                                            )
                                        }
                                        fontAwsmIcon={"fa-file"}
                                        lable={file.fileNm}
                                        key={i}
                                    />}

                                    {(mode !== 4 || mode !==3) && ((file?.filePath) &&
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
                </Card>

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


{/* <div className="row mb-2">
<div className="">

    {(row?.filePath === "") && <div className="file-uploaddd">
        <input
            style={{ visibility: (mode === 1 || mode === 2) ? "visible" : "hidden" }}
            type="file"
            required={mode === 1}
            className="form-control"
            id="formFile"
            onChange={(e) => uploadFiles(e, index)}
            name="File"

            disabled={mode === 3 || mode === 4}
        />
    </div>}
    {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

    <div className="file-div" key={index}>
        {(row.filePath) && <Smalltag
            handleClick={() =>
                window.open(
                    process.env.REACT_APP_API_URL_PREFIX +
                    row.fileUrl,
                    "_blank",
                    "rel=noopener noreferrer"
                )
            }
            fontAwsmIcon={"fa-file"}
            lable={row.fileNm}
            key={index}
        />}

        {mode !== 4 && ((row?.filePath) &&
            <>
                <Delete
                    onClick={(e) => delete_file(e, index)}
                    className="cross-icon"
                />

                <Download
                    onClick={(e) => download_file(e, index)}
                    className="cross-icon"
                />
            </>
        )}
    </div>

</div>
</div> */}