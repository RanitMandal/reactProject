
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
import { locLovColumns, dtlDistLovColumns, postLovColumns, dsgnLovColumns, crntDsgnLovColumns, crntLocLovColumns, crntPostLovColumns, dtlBlkLovColumns, emailLovColumns } from "./columns";
import TextArea from "antd/es/input/TextArea";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const EmployeeBasicInfoForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

    console.log(edtVal);
    console.log(addVal);


    const [formData, setFormData] = useState({
        // empCd: '',
        sex: 'M',
        dob: "",
        lastNm: '',
        postCdCurrent: '',
        postCdCurrentNm: '',
        dsgnCdCurrent: '',
        dsgnCdCurrentNm: '',
        // actFlg: 'A',
        dojCurrent: "",
        empTyp: 'P',
        firstNm: '',
        pan: '',
        postCdJoining: '',
        postCdJoiningNm: '',
        spouseWrkngStat: 'Y',
        spouseWrkngAt: 'I',
        spouseWrkngDistCd: '',
        emailId: '',
        mobNo: '',
        permPin: 0,
        permAddr: '',
        permAddrFlg: "Y",
        currPin: 0,
        currAddr: '',
        lvlRefCdJoining: '',
        lvlRefCdJoiningNm: '',
        lvlRefCdCurrent: '',
        lvlRefCdCurrentNm: '',
        dsgnCdJoining: '',
        dsgnCdJoiningNm: '',
        doj: "",
        middleNm: '',
        titleCd: '',
        spouseWrkngDtl: '',
        hrmsEmpId: '',
        maritalStat: 'M',
        dtl: [
            {
                empCd: '',
                distCd: '',
                distNm: "",
                blkNm: "",
                blkCd: '',
                actFlg: '',
            }
        ],
    });

    // Title Lov For DD
    const [titleLovData, setTitleLovData] = useState([]);

    useEffect(() => {

        const fetchTitleLovData = async () => {
            let obj = {
                apiId: 'HRA00040'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllTitle", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setTitleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchTitleLovData();
    }, []);

    // //State Lov Starts     

    // const [stateLovData, setStateLovData] = useState([]);
    // useEffect(() => {
    //     let stateList = []
    //     const fetchStateLovData = async () => {
    //         let obj = {
    //             apiId: 'SUA00344'
    //         }
    //         await axios
    //             .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllState", obj, { headers })
    //             .then((res) => {
    //                 console.log(res.data);
    //                 if (res.data?.content?.qryRsltSet?.length) {
    //                     stateList = res.data?.content?.qryRsltSet.filter(ele => ele.stateCd !== "19")
    //                 }
    //                 setStateLovData(stateList);

    //             });
    //     };
    //     fetchStateLovData();
    // }, []);


    // const getStateNm = (obj) => {
    //     return stateLovData[Number(Object.keys(obj)[0])]?.stateNm ? stateLovData[Number(Object.keys(obj)[0])]?.stateNm : ""
    // }

    // const getStateId = (obj) => {
    //     return stateLovData[Number(Object.keys(obj)[0])]?.stateCd ? stateLovData[Number(Object.keys(obj)[0])]?.stateCd : ""
    // }

    // const [selectRowState, setSelectRowState] = useState("");
    // const [selectRowStateLov, setSelectRowStateLov] = useState("");
    // const [showModelStateLov, setShowModelStateLov] = useState(false);
    // const handleRowClickStateLov = (rowData) => {
    //     setSelectRowState(rowData);
    //     setSelectRowStateLov(rowData);
    //     setFormData({
    //         ...formData,
    //         StateCd: getStateId(rowData),
    //         stateNm: getStateNm(rowData),

    //     })

    // };
    // console.log(queryInputObj);
    // //State Lov ends 




    // Dist Lov for DD
    const [distLovData, setDistLovData] = useState([]);

    useEffect(() => {

        const fetchDistLovData = async () => {
            let obj = {
                apiId: 'HRA00042',
                criteria: {
                    stateCd: "19"
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getDistByState", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDistLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchDistLovData();
    }, []);
    // dist lov for DD




    //Location Lov Starts     

    const [locLovData, setLocLovData] = useState([]);
    useEffect(() => {

        const fetchLocLovData = async () => {
            let obj = {
                apiId: 'HRA00038'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllLocations", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setLocLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchLocLovData();
    }, []);


    const getLocNm = (obj) => {
        return locLovData[Number(Object.keys(obj)[0])]?.lvlNm ? locLovData[Number(Object.keys(obj)[0])]?.lvlNm : ""
    }

    const getLocId = (obj) => {
        return locLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? locLovData[Number(Object.keys(obj)[0])]?.lvlRefCd : ""
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowLocLov, setSelectRowLocLov] = useState("");
    const [showModelLocLov, setShowModelLocLov] = useState(false);
    const handleRowClickLocLov = (rowData) => {
        setSelectRow(rowData);
        setSelectRowLocLov(rowData);
        setFormData({
            ...formData,
            lvlRefCdJoining: getLocId(rowData),
            lvlRefCdJoiningNm: getLocNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Location Lov ends 


    //Post Lov Starts     

    const [postLovData, setPostLovData] = useState([]);
    useEffect(() => {

        const fetchPostLovData = async () => {
            let obj = {
                apiId: 'HRA00039'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllPost", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setPostLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchPostLovData();
    }, []);


    const getPostNm = (obj) => {
        return postLovData[Number(Object.keys(obj)[0])]?.postNm ? postLovData[Number(Object.keys(obj)[0])]?.postNm : ""
    }

    const getPostId = (obj) => {
        return postLovData[Number(Object.keys(obj)[0])]?.postCd ? postLovData[Number(Object.keys(obj)[0])]?.postCd : ""
    }

    const [selectRowPost, setSelectRowPost] = useState("");
    const [selectRowPostLov, setSelectRowPostLov] = useState("");
    const [showModelPostLov, setShowModelPostLov] = useState(false);
    const handleRowClickPostLov = (rowData) => {
        setSelectRowPost(rowData);
        setSelectRowPostLov(rowData);
        setFormData({
            ...formData,
            postCdJoining: getPostId(rowData),
            postCdJoiningNm: getPostNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Post Lov ends 


    //Designation Lov Starts     

    const [dsgnLovData, setDsgnLovData] = useState([]);
    useEffect(() => {

        const fetchDsgnLovData = async () => {
            let obj = {
                apiId: 'HRA00041',
                criteria: {
                    postCd: formData.postCdJoining
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getDesignationByPost", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDsgnLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        formData.postCdJoining && fetchDsgnLovData();
    }, [formData.postCdJoining]);


    const getDsgnNm = (obj) => {
        return dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnNm ? dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnNm : ""
    }

    const getDsgnId = (obj) => {
        return dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnCd ? dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnCd : ""
    }

    const [selectRowDsgn, setSelectRowDsgn] = useState("");
    const [selectRowDsgnLov, setSelectRowDsgnLov] = useState("");
    const [showModelDsgnLov, setShowModelDsgnLov] = useState(false);
    const handleRowClickDsgnLov = (rowData) => {
        setSelectRowDsgn(rowData);
        setSelectRowDsgnLov(rowData);
        setFormData({
            ...formData,
            dsgnCdJoining: getDsgnId(rowData),
            dsgnCdJoiningNm: getDsgnNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Designation Lov ends 


    //Current Location Lov Starts     

    const [crntLocLovData, setCrntLocLovData] = useState([]);
    useEffect(() => {

        const fetchCrntLocLovData = async () => {
            let obj = {
                apiId: 'HRA00038'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllLocations", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCrntLocLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchCrntLocLovData();
    }, []);


    const getCrntLocNm = (obj) => {
        return crntLocLovData[Number(Object.keys(obj)[0])]?.lvlNm ? crntLocLovData[Number(Object.keys(obj)[0])]?.lvlNm : ""
    }

    const getCrntLocId = (obj) => {
        return crntLocLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? crntLocLovData[Number(Object.keys(obj)[0])]?.lvlRefCd : ""
    }

    const [selectRowCrntLoc, setSelectRowCrntLoc] = useState("");
    const [selectRowCrntLocLov, setSelectRowCrntLocLov] = useState("");
    const [showModelCrntLocLov, setShowModelCrntLocLov] = useState(false);
    const handleRowClickCrntLocLov = (rowData) => {
        setSelectRowCrntLoc(rowData);
        setSelectRowCrntLocLov(rowData);
        setFormData({
            ...formData,
            lvlRefCdCurrent: getCrntLocId(rowData),
            lvlRefCdCurrentNm: getCrntLocNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Current Location Lov ends 



    //Current Post Lov Starts     

    const [crntPostLovData, setCrntPostLovData] = useState([]);
    useEffect(() => {

        const fetchCrntPostLovData = async () => {
            let obj = {
                apiId: 'HRA00050',
                criteria: {
                    lvlRefCdCurrent: addVal?.mst?.lvlTypCd === "05" ? addVal?.mst?.divCd : formData.lvlRefCdCurrent
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getAllPostByLvlRefCdCurrent", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCrntPostLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        formData.lvlRefCdCurrent && fetchCrntPostLovData();
    }, [formData.lvlRefCdCurrent]);


    const getCrntPostNm = (obj) => {
        return crntPostLovData[Number(Object.keys(obj)[0])]?.postNm ? crntPostLovData[Number(Object.keys(obj)[0])]?.postNm : ""
    }

    const getCrntPostId = (obj) => {
        return crntPostLovData[Number(Object.keys(obj)[0])]?.postCd ? crntPostLovData[Number(Object.keys(obj)[0])]?.postCd : ""
    }

    const [selectRowCrntPost, setSelectRowCrntPost] = useState("");
    const [selectRowCrntPostLov, setSelectRowCrntPostLov] = useState("");
    const [showModelCrntPostLov, setShowModelCrntPostLov] = useState(false);
    const handleRowClickCrntPostLov = (rowData) => {
        setSelectRowCrntPost(rowData);
        setSelectRowCrntPostLov(rowData);
        setFormData({
            ...formData,
            postCdCurrent: getCrntPostId(rowData),
            postCdCurrentNm: getCrntPostNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Current Post Lov ends 

    // Current Designation Lov Starts     

    const [crntDsgnLovData, setCrntDsgnLovData] = useState([]);
    useEffect(() => {

        const fetchCrntDsgnLovData = async () => {
            let obj = {
                apiId: 'HRA00041',
                criteria: {
                    postCd: formData.postCdCurrent
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getDesignationByPost", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setCrntDsgnLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        formData.postCdCurrent && fetchCrntDsgnLovData();
    }, [formData.postCdCurrent]);


    const getCrntDsgnNm = (obj) => {
        return crntDsgnLovData[Number(Object.keys(obj)[0])]?.dsgnNm ? crntDsgnLovData[Number(Object.keys(obj)[0])]?.dsgnNm : ""
    }

    const getCrntDsgnId = (obj) => {
        return crntDsgnLovData[Number(Object.keys(obj)[0])]?.dsgnCd ? crntDsgnLovData[Number(Object.keys(obj)[0])]?.dsgnCd : ""
    }

    const [selectRowCrntDsgn, setSelectRowCrntDsgn] = useState("");
    const [selectRowCrntDsgnLov, setSelectRowCrntDsgnLov] = useState("");
    const [showModelCrntDsgnLov, setShowModelCrntDsgnLov] = useState(false);
    const handleRowClickCrntDsgnLov = (rowData) => {
        setSelectRowCrntDsgn(rowData);
        setSelectRowCrntDsgnLov(rowData);
        setFormData({
            ...formData,
            dsgnCdCurrent: getCrntDsgnId(rowData),
            dsgnCdCurrentNm: getCrntDsgnNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Current Designation Lov ends 


    // Email Lov Starts     

    const [emailLovData, setEmailLovData] = useState([]);
    useEffect(() => {

        const fetchEmailLovData = async () => {
            let obj = {
                apiId: "HRA00043",
                criteria: {
                    lvlRefCd: addVal?.mst?.lvlTypCd === "05" ? addVal?.mst?.divCd : formData.lvlRefCdCurrent,
                    postCd: formData.postCdCurrent
                }
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getEmailId", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setEmailLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        formData.postCdCurrent && fetchEmailLovData();
    }, [formData.postCdCurrent]);


    // const getEmailNm = (obj) => {
    //     return postLovData[Number(Object.keys(obj)[0])]?.dsgnNm ? postLovData[Number(Object.keys(obj)[0])]?.dsgnNm : ""
    // }

    const getEmailId = (obj) => {
        return emailLovData[Number(Object.keys(obj)[0])]?.emailid ? emailLovData[Number(Object.keys(obj)[0])]?.emailid : ""
    }

    const [selectRowEmail, setSelectRowEmail] = useState("");
    const [selectRowEmailLov, setSelectRowEmailLov] = useState("");
    const [showModelEmailLov, setShowModelEmailLov] = useState(false);
    const handleRowClickEmailLov = (rowData) => {
        setSelectRowEmail(rowData);
        setSelectRowEmailLov(rowData);
        setFormData({
            ...formData,
            emailId: getEmailId(rowData),
            // dsgnNmCurrent: getEmailNm(rowData),

        })

    };
    console.log(queryInputObj);
    //Email Lov ends 











    // Details distCd LOV..........
    const [rowIndex, setRowIndex] = useState(0);
    // const [dtlApiObj, set_dtlApiObj] = useState({
    //     apiId: "SUA00358",
    //     criteria: {
    //         modId: ""
    //     }
    // })
    // useEffect(() => {
    //     set_dtlApiObj({
    //         apiId: "SUA00343",
    //         criteria: {
    //             modId: formData.modId
    //         }
    //     })
    // }, [formData.modId,])

    const [dtlDistLovData, setDtlDistLovData] = useState([]);
    useEffect(() => {
        let distObj = {
            apiId: "HRA00042",
            criteria: {
                stateCd: "19"
            }
        }
        const fetchDtlDistLovData = async () => {

            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getDistByState", distObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDtlDistLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);


                });
        };
        fetchDtlDistLovData();
    }, []);


    const getDtlDistNm = (obj) => {
        return dtlDistLovData[Number(Object.keys(obj)[0])]?.distNm ? dtlDistLovData[Number(Object.keys(obj)[0])]?.distNm : ""
    }

    const getDtlDistCd = (obj) => {
        return dtlDistLovData[Number(Object.keys(obj)[0])]?.distCd ? dtlDistLovData[Number(Object.keys(obj)[0])]?.distCd : ""
    }
    const openDtlDist = (index) => {
        setRowIndex(index)
        setSelectRowDtlDistLov({})
        console.log(rowIndex);
    }

    const [selectRowDtlDist, setSelectRowDtlDist] = useState("");
    const [selectRowDtlDistLov, setSelectRowDtlDistLov] = useState("");
    const [showModelDtlDistLov, setShowModelDtlDistLov] = useState(false);
    const handleRowClickDtlDistLov = (rowData) => {
        console.log(rowData)
        setSelectRowDtlDist(rowData);
        setSelectRowDtlDistLov(rowData);
        let list = formData.dtl
        list[rowIndex] = {
            ...list[rowIndex],
            distCd: getDtlDistCd(rowData),
            distNm: getDtlDistNm(rowData),

        }
        console.log(list[rowIndex]);
        set_blkObj({
            ...blkObj,
            criteria: {
                distCd: list[rowIndex]?.distCd
            }
        })
        setFormData({
            ...formData,
            dtl: list
        })
    };
    //Details distCd Lov ends 



    //Details Block Code Lov................
    const [blkObj, set_blkObj] = useState({
        apiId: "HRA00054",
        criteria: {
            distCd: ""
        }
    })




    const [dtlBlkLovData, setDtlBlkLovData] = useState([]);
    useEffect(() => {

        const fetchDtlBlkLovData = async () => {

            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/HRF00001/getPostByDist", blkObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDtlBlkLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);


                });
        };
        blkObj && fetchDtlBlkLovData();
    }, [blkObj]);


    const getDtlBlkNm = (obj) => {
        return dtlBlkLovData[Number(Object.keys(obj)[0])]?.blkNm ? dtlBlkLovData[Number(Object.keys(obj)[0])]?.blkNm : ""
    }

    const getDtlBlkCd = (obj) => {
        return dtlBlkLovData[Number(Object.keys(obj)[0])]?.blkCd ? dtlBlkLovData[Number(Object.keys(obj)[0])]?.blkCd : ""
    }
    const openDtlBlk = (index) => {
        setRowIndex(index)
        setSelectRowDtlBlkLov({})
        console.log(rowIndex);
    }

    const [selectRowDtlBlk, setSelectRowDtlBlk] = useState("");
    const [selectRowDtlBlkLov, setSelectRowDtlBlkLov] = useState("");
    const [showModelDtlBlkLov, setShowModelDtlBlkLov] = useState(false);
    const handleRowClickDtlBlkLov = (rowData) => {
        console.log(rowData)
        setSelectRowDtlBlk(rowData);
        setSelectRowDtlBlkLov(rowData);
        let list = formData.dtl
        list[rowIndex] = {
            ...list[rowIndex],
            blkCd: getDtlBlkCd(rowData),
            blkNm: getDtlBlkNm(rowData),

        }
        //  console.log(rows);
        setFormData({
            ...formData,
            dtl: list
        })
    };
    //Details Block Code Lov ends 


    useEffect(() => {
        //const [selectRowMod, setSelectRowMod] = useState("");
        console.log(edtVal);
        let lvlRefCdJoining = edtVal?.mst?.lvlRefCdJoining || ""
        let resIndex = locLovData.findIndex(item => item.lvlRefCd === lvlRefCdJoining)
        let currentLvlRefCdJoin = {}
        if (resIndex !== -1) currentLvlRefCdJoin = { [resIndex]: true }
        setSelectRow(currentLvlRefCdJoin)
        console.log(lvlRefCdJoining);

        //     //   console.log("9999999", resIndex, currentModId, modLovData, modId);
        let postCdJoining = edtVal?.mst?.postCdJoining || ""
        let resPostJoinIndex = postLovData.findIndex(item => item.postCd === postCdJoining)
        let currentPostCdJoin = {}
        if (resPostJoinIndex !== -1) currentPostCdJoin = { [resPostJoinIndex]: true }
        setSelectRowPost(currentPostCdJoin)

        let dsgnCdJoining = edtVal?.mst?.dsgnCdJoining || ""
        let resDsgnJoinIndex = dsgnLovData.findIndex(item => item.dsgnCd === dsgnCdJoining)
        let currentDsgnCdJoin = {}
        if (resDsgnJoinIndex !== -1) currentDsgnCdJoin = { [resDsgnJoinIndex]: true }
        setSelectRowDsgn(currentDsgnCdJoin)


        let lvlRefCdCurrent = edtVal?.mst?.lvlRefCdCurrent || ""
        let resLvlRefCdCurrIndex = crntLocLovData.findIndex(item => item.lvlRefCd === lvlRefCdCurrent)
        let currentLvlRefCdCurr = {}
        if (resLvlRefCdCurrIndex !== -1) currentLvlRefCdCurr = { [resLvlRefCdCurrIndex]: true }
        setSelectRowCrntLoc(currentLvlRefCdCurr)

        let dsgnCdCurrent = edtVal?.mst?.dsgnCdCurrent || ""
        let resDsgnCdCurrIndex = crntDsgnLovData.findIndex(item => item.dsgnCd === dsgnCdCurrent)
        let currentDsgnCdCurr = {}
        if (resDsgnCdCurrIndex !== -1) currentDsgnCdCurr = { [resDsgnCdCurrIndex]: true }
        setSelectRowCrntDsgn(currentDsgnCdCurr)

        let postCdCurrent = edtVal?.mst?.postCdCurrent || ""
        let resPostCdCurrIndex = crntPostLovData.findIndex(item => item.postCd === postCdCurrent)
        let currentPostCdCurr = {}
        if (resPostCdCurrIndex !== -1) currentPostCdCurr = { [resPostCdCurrIndex]: true }
        setSelectRowCrntPost(currentPostCdCurr)


        //     console.log(appId);
        let dtlDistCd = edtVal?.mst?.dtl?.distCd || ""
        let resDtlDistCdIndex = dtlDistLovData.findIndex(item => item.distCd === dtlDistCd)
        let currentDtlDistCd = {}
        if (resDtlDistCdIndex !== -1) currentDtlDistCd = { [resDtlDistCdIndex]: true }
        setSelectRowDtlDist(currentDtlDistCd)

        let dtlBlkCd = edtVal?.mst?.dtl?.blkCd || ""
        let resDtlBlkCdIndex = dtlDistLovData.findIndex(item => item.blkCd === dtlBlkCd)
        let currentDtlBlkCd = {}
        if (resDtlBlkCdIndex !== -1) currentDtlBlkCd = { [resDtlBlkCdIndex]: true }
        setSelectRowDtlBlk(currentDtlBlkCd)

    }, [rowData, edtVal, locLovData, postLovData, dsgnLovData, crntLocLovData, crntPostLovData, crntDsgnLovData, emailLovData, dtlDistLovData, dtlBlkLovData])


    useEffect(() => {
        if (mode !== 1) {
            // Set all properties of edtVal to null
            // set_tblLen(edtVal?.mst?.dtl?.length || 1)
            setFormData({

                empCd: edtVal ? edtVal?.mst?.empCd : "",
                sex: edtVal ? edtVal.mst?.sex : '',
                dob: edtVal ? edtVal.mst?.dob : "",
                lastNm: edtVal ? edtVal.mst?.lastNm : '',
                permAddrFlg: edtVal ? edtVal.mst?.permAddrFlg : '',
                postCdCurrent: edtVal ? edtVal.mst?.postCdCurrent : '',
                postCdCurrentNm: edtVal ? edtVal.mst?.postCdCurrentNm : '',
                dsgnCdCurrent: edtVal ? edtVal.mst?.dsgnCdCurrent : '',
                dsgnCdCurrentNm: edtVal ? edtVal.mst?.dsgnCdCurrentNm : '',
                actFlg: edtVal ? edtVal.mst?.actFlg : '',
                dojCurrent: edtVal ? edtVal.mst?.dojCurrent : "",
                empTyp: edtVal ? edtVal.mst?.empTyp : '',
                firstNm: edtVal ? edtVal.mst?.firstNm : '',
                pan: edtVal ? edtVal.mst?.pan : '',
                postCdJoining: edtVal ? edtVal.mst?.postCdJoining : '',
                postCdJoiningNm: edtVal ? edtVal.mst?.postCdJoiningNm : '',
                spouseWrkngStat: edtVal ? edtVal.mst?.spouseWrkngStat : '',
                spouseWrkngAt: edtVal ? edtVal.mst?.spouseWrkngAt : '',
                spouseWrkngDistCd: edtVal ? edtVal.mst?.spouseWrkngDistCd : '',
                emailId: edtVal ? edtVal.mst?.emailId : '',
                mobNo: edtVal ? edtVal.mst?.mobNo : '',
                permPin: edtVal ? edtVal.mst?.permPin : 0,
                permAddr: edtVal ? edtVal.mst?.permAddr : '',
                currPin: edtVal ? edtVal.mst?.currPin : 0,
                currAddr: edtVal ? edtVal.mst?.currAddr : '',
                lvlRefCdJoining: edtVal ? edtVal.mst?.lvlRefCdJoining : '',
                lvlRefCdJoiningNm: edtVal ? edtVal.mst?.lvlRefCdJoiningNm : '',
                lvlRefCdCurrent: edtVal ? edtVal.mst?.lvlRefCdCurrent : '',
                lvlRefCdCurrentNm: edtVal ? edtVal.mst?.lvlRefCdCurrentNm : '',
                dsgnCdJoining: edtVal ? edtVal.mst?.dsgnCdJoining : '',
                dsgnCdJoiningNm: edtVal ? edtVal.mst?.dsgnCdJoiningNm : '',
                doj: edtVal ? edtVal.mst?.doj : "",
                middleNm: edtVal ? edtVal.mst?.middleNm : '',
                titleCd: edtVal ? edtVal.mst?.titleCd : '',
                spouseWrkngDtl: edtVal ? edtVal.mst?.spouseWrkngDtl : '',
                hrmsEmpId: edtVal ? edtVal.mst?.hrmsEmpId : '',
                maritalStat: edtVal ? edtVal.mst?.maritalStat : '',
                // lvlTypCd: edtVal ? edtVal?.mst?.lvlTypCd : "",
                dtl: edtVal?.mst?.dtl || [
                    {
                        empCd: '',
                        distCd: '',
                        distNm: "",
                        blkNm: "",
                        blkCd: '',
                        actFlg: '',
                    }
                ]
            })
        } else {
            if (addVal?.mst?.lvlTypCd === "05") {
                setFormData({
                    ...formData,
                    lvlRefCdCurrent: addVal ? addVal?.mst?.subDivCd : '',
                    lvlRefCdCurrentNm: addVal ? addVal?.mst?.subDivNm : '',
                    // lvlTypCd: addVal ? addVal?.mst?.lvlTypCd : "",

                    dtl: [...formData?.dtl]
                })
            } else if (addVal?.mst?.lvlTypCd === "04" || addVal?.mst?.lvlTypCd === "09") {
                setFormData({
                    ...formData,
                    lvlRefCdCurrent: addVal ? addVal?.mst?.divCd : '',
                    lvlRefCdCurrentNm: addVal ? addVal?.mst?.divNm : '',
                    // lvlTypCd: addVal ? addVal?.mst?.lvlTypCd : "",
                    dtl: [...formData?.dtl]
                })
            }else{
                setFormData({
                    ...formData,
                    lvlRefCdCurrent: addVal ? addVal?.mst?.divCd : '',
                    lvlRefCdCurrentNm: addVal ? addVal?.mst?.divNm : '',
                    // lvlTypCd: addVal ? addVal?.mst?.lvlTypCd : "",
                    dtl: [...formData?.dtl]
                }) 
            }

        }

    }, [mode, edtVal, rowData, addVal]);

    // Get All List
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00001/getListPageData', queryInputObj, { headers }).then((res) => {
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
        const { name, value } = event.target;

        if ((name === "currPin" || name === "permPin" || name === "mobNo") && isNaN(value)) {
            if ((name === "currPin" && value.length > 6) ||
                (name === "permPin" && value.length > 6) ||
                (name === "mobNo" && value.length > 10)) {
                return;
            }
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })

    };

    const handleSelectChange = (event) => {
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
                    actFlg: "A",
                    action: "I",
                    empCd: '',
                    distCd: '',
                    distNm: "",
                    blkNm: "",
                    blkCd: '',
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

        setFormData({
            // empCd: '',
            sex: 'M',
            dob: "",
            lastNm: '',
            permAddrFlg: '',
            postCdCurrent: '',
            postCdCurrentNm: '',
            dsgnCdCurrent: '',
            dsgnCdCurrentNm: '',
            // actFlg: 'A',
            dojCurrent: "",
            empTyp: 'P',
            firstNm: '',
            pan: '',
            postCdJoining: '',
            postCdJoiningNm: '',
            spouseWrkngStat: 'Y',
            spouseWrkngAt: 'I',
            spouseWrkngDistCd: '',
            emailId: '',
            mobNo: '',
            permPin: 0,
            permAddr: '',
            permAddrFlg: "N",
            currPin: 0,
            currAddr: '',
            lvlRefCdJoining: '',
            lvlRefCdJoiningNm: '',
            lvlRefCdCurrent: '',
            lvlRefCdCurrentNm: '',
            dsgnCdJoining: '',
            dsgnCdJoiningNm: '',
            doj: "",
            middleNm: '',
            titleCd: '',
            spouseWrkngDtl: '',
            hrmsEmpId: '',
            maritalStat: 'M',
            dtl: [
                {
                    empCd: '',
                    distCd: '',
                    distNm: "",
                    blkNm: "",
                    blkCd: '',
                    actFlg: '',
                }
            ],
        })


        console.log(edtVal);
    };










    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(selectRowModGrpLov);
        const { postCdCurrentNm, dsgnCdCurrentNm, dsgnCdJoiningNm, postCdJoiningNm, lvlRefCdCurrentNm, lvlRefCdJoiningNm, ...obj } = formData

        const addObj = {
            apiId: "HRA00051",
            mst: {
                ...obj,
                currPin: parseInt(obj.currPin),
                permPin: parseInt(obj.permPin),
                dtl: obj.dtl.map(item => {
                    const { distNm, blkNm, actFlg, empCd, action, ...data } = item
                    return {
                        ...data,

                    }
                })
            }
        }

        if (mode === 2) {
            obj.dtl = obj.dtl.filter(item => item.action)
            obj.dtl = [...obj.dtl, ...delArr]
        }
        console.log(obj);
        const editObj = {
            apiId: "HRA00053",
            mst: {
                ...obj,
                currPin: parseInt(obj.currPin),
                permPin: parseInt(obj.permPin),
                action: "U",
                dtl: obj.dtl.map(item => {
                    const { distNm, blkNm, ddActFlg, empCd, ...data } = item
                    return {
                        ...data,

                    }
                })
            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00001/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    // fetchData()
                }
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
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00001/saveEdit', editObj, { headers }).then(res => {
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
            apiId: "HRA00052",
            mst: {
                empCd: formData.empCd

            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00001/saveDelete', deleteObj, { headers }).then(res => {
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
        hrmsEmpId: false,
        firstNm: false,
        middleNm: false,
        lastNm: false,
        currAddr: false,
        currPin: false,
        permPin: false,
        permAddr: false,
        mobNo: false,
        pan: false,
        spouseWrkngDtl: false




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

            <h4 className="card-title">Employee Basic Information {getFormTitle(mode)}</h4>
            <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

                {/* Title */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Title:<span className="text-red">*</span>
                    </label>
                    <div className="col-md-9">
                        <select
                            className="form-select col-md-12"
                            name="titleCd"
                            //defaultValue={edtVal.dtlActFlg}
                            onChange={handleSelectChange}
                            value={formData.titleCd}

                        >
                            <option value="">--Select--</option>

                            {
                                (titleLovData?.map((item) => (
                                    <option value={item.titleCd}>{item.titleNm}</option>
                                )))
                            }
                        </select>
                    </div>
                </div>
                {/* First Name */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">
                        First Name:<span className="text-red">*</span>
                    </label>
                    <div className="col-md-9 input-group">
                        <input className="form-control" type="text" value={formData.firstNm} onChange={handleInputChange} disabled={mode === 3 || mode === 4} name="firstNm" maxLength={25} onFocus={() => toggleCharCountVisibility("firstNm")}
                            onBlur={() => toggleCharCountVisibility("firstNm")}
                        />
                        {fieldCharCountVisibility.firstNm && (
                            <span className="input-group-text">
                                {formData?.firstNm?.length}/25
                            </span>
                        )}
                    </div>
                </div>
                {/* Middle name */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">
                        Middle Name:<span className="text-red">*</span>
                    </label>
                    <div className="col-md-9 input-group">
                        <input className="form-control" type="text" value={formData.middleNm} onChange={handleInputChange} disabled={mode === 3 || mode === 4} name="middleNm"
                            maxLength={25} onFocus={() => toggleCharCountVisibility("middleNm")}
                            onBlur={() => toggleCharCountVisibility("middleNm")}
                        />
                        {fieldCharCountVisibility.middleNm && (
                            <span className="input-group-text">
                                {formData?.middleNm?.length}/25
                            </span>
                        )}
                    </div>
                </div>

                {/* Last Name */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">
                        Last Name:<span className="text-red">*</span>
                    </label>
                    <div className="col-md-9 input-group">
                        <input className="form-control" type="text" value={formData.lastNm} onChange={handleInputChange} disabled={mode === 3 || mode === 4} name="lastNm"
                            maxLength={25} onFocus={() => toggleCharCountVisibility("lastNm")}
                            onBlur={() => toggleCharCountVisibility("lastNm")}
                        />
                        {fieldCharCountVisibility.lastNm && (
                            <span className="input-group-text">
                                {formData?.lastNm?.length}/25
                            </span>
                        )}
                    </div>
                </div>

                {/* Emp Type & HRMS Code */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Employee Type:
                    </label>
                    <div className="col-md-3">
                        <select
                            className="form-select col-md-12"
                            name="empTyp"
                            //defaultValue={edtVal.dtlActFlg}
                            onChange={handleSelectChange}
                            value={formData.empTyp}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.mst?.ddEmpTyp?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.mst?.ddEmpTyp?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }
                        </select>
                    </div>
                    <label className="col-md-3 form-label">HRMS Code:</label>
                    <div className="col-md-3">
                        <input className="form-control" type="text" value={formData.hrmsEmpId} name="hrmsEmpId" onChange={handleInputChange} maxLength={15} />
                    </div>
                </div>

                {/* DOB & Gender */}

                <div className="row mb-4">

                    <label className="col-md-3 form-label">Date Of Birth:</label>
                    <div className="col-md-3">
                        <input className="form-control" type="date" value={formData.dob} name="dob" onChange={handleInputChange} />
                    </div>

                    <label className="col-md-3 form-label">
                        Gender Type:
                    </label>
                    <div className="col-md-3">
                        <select
                            className="form-select col-md-12"
                            name="sex"
                            //defaultValue={edtVal.dtlActFlg}
                            onChange={handleSelectChange}
                            value={formData.sex}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.mst?.ddGenderFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.mst?.ddGenderFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }
                        </select>
                    </div>
                </div>

                {/* Joining posting Details */}
                <div className="card shadow-none">
                    <div className="card-header bg-primary" style={{ height: '40px' }}>
                        {/* <div className=""> */}
                        <h4 className="my-1" style={{ color: "white" }}><b>Joining Posting Details:</b></h4>
                        {/* </div> */}
                    </div>
                    <div className="card-body">
                        {/* Joining Date */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">Joining Date:</label>
                            <div className="col-md-9">
                                <input className="form-control" type="date" name="doj" value={formData.doj} onChange={handleInputChange} disabled={mode === 3 || mode === 4} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Location:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelLocLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.lvlRefCdJoining}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="lvlRefNmJoining"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.lvlRefCdJoiningNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelLocLov && <Lov
                                            moduleLovData={locLovData}
                                            setShowModel={setShowModelLocLov}
                                            showModel={showModelLocLov}
                                            handleRowClick={handleRowClickLocLov}
                                            columns={locLovColumns}
                                            currentSelection={selectRow}
                                            setCurrentSelection={setSelectRow}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Post:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelPostLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.postCdJoining}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="postNmJoining"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.postCdJoiningNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelPostLov && <Lov
                                            moduleLovData={postLovData}
                                            setShowModel={setShowModelPostLov}
                                            showModel={showModelPostLov}
                                            handleRowClick={handleRowClickPostLov}
                                            columns={postLovColumns}
                                            currentSelection={selectRowPost}
                                            setCurrentSelection={setSelectRowPost}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Designation */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Designation:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDsgnLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnCdJoining}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="dsgnNmJoining"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnCdJoiningNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelDsgnLov && <Lov
                                            moduleLovData={dsgnLovData}
                                            setShowModel={setShowModelDsgnLov}
                                            showModel={showModelDsgnLov}
                                            handleRowClick={handleRowClickDsgnLov}
                                            columns={dsgnLovColumns}
                                            currentSelection={selectRowDsgn}
                                            setCurrentSelection={setSelectRowDsgn}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Current Posting Details */}
                <div className="card shadow-none">
                    <div className="card-header bg-primary" style={{ height: '40px' }}>
                        {/* <div className=""> */}
                        <h4 className="my-1" style={{ color: "white" }}><b>Current Posting Details:</b></h4>
                        {/* </div> */}
                    </div>
                    <div className="card-body pb-0">
                        {/* Joining Date */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">Joining Date:<span className="text-red">*</span></label>
                            <div className="col-md-9">
                                <input className="form-control" type="date" name="dojCurrent" value={formData.dojCurrent} onChange={handleInputChange} disabled={mode === 3 || mode === 4} />
                            </div>
                        </div>

                        {/*Current Location */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Location:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) &&
                                        (!(addVal?.mst?.lvlTypCd === "05" || edtVal?.mst?.lvlTypCd === "05")) && (
                                            <span className="input-group-text bg-primary">
                                                <i
                                                    className="fa fa-search d-inline text-white"
                                                    title=""
                                                    onClick={() => setShowModelCrntLocLov(true)}
                                                />
                                            </span>
                                        )
                                    }
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.lvlRefCdCurrent}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="lvlRefNmCurrent"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.lvlRefCdCurrentNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelCrntLocLov && <Lov
                                            moduleLovData={crntLocLovData}
                                            setShowModel={setShowModelCrntLocLov}
                                            showModel={showModelCrntLocLov}
                                            handleRowClick={handleRowClickCrntLocLov}
                                            columns={crntLocLovColumns}
                                            currentSelection={selectRowCrntLoc}
                                            setCurrentSelection={setSelectRowCrntLoc}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Current Post */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Post:<span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelCrntPostLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.postCdCurrent}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="postCdCurrent"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.postCdCurrentNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelCrntPostLov && <Lov
                                            moduleLovData={crntPostLovData}
                                            setShowModel={setShowModelCrntPostLov}
                                            showModel={showModelCrntPostLov}
                                            handleRowClick={handleRowClickCrntPostLov}
                                            columns={crntPostLovColumns}
                                            currentSelection={selectRowCrntPost}
                                            setCurrentSelection={setSelectRowCrntPost}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Current Designation */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Designation:<span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelCrntDsgnLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnCdCurrent}

                                    />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        // required
                                        name="dsgnNmCurrent"
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnCdCurrentNm}

                                    />
                                    <div className="row-mb-12">
                                        {showModelCrntDsgnLov && <Lov
                                            moduleLovData={crntDsgnLovData}
                                            setShowModel={setShowModelCrntDsgnLov}
                                            showModel={showModelCrntDsgnLov}
                                            handleRowClick={handleRowClickCrntDsgnLov}
                                            columns={crntDsgnLovColumns}
                                            currentSelection={selectRowCrntDsgn}
                                            setCurrentSelection={setSelectRowCrntDsgn}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Current Address */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Current Address:
                    </label>
                    <div className="col-md-9 input-group">
                        <TextArea className="form-control" type="text" value={formData.currAddr} name="currAddr" onChange={handleInputChange} disabled={mode === 3 || mode === 4} maxLength={200} onFocus={() => toggleCharCountVisibility("currAddr")}
                            onBlur={() => toggleCharCountVisibility("currAddr")}
                        />
                        {fieldCharCountVisibility.currAddr && (
                            <span className="input-group-text">
                                {formData?.currAddr?.length}/200
                            </span>
                        )}
                    </div>
                </div>

                {/* Pin NO. */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">Pin No.:</label>
                    <div className="col-md-3 input-group">
                        <input className="form-control" type="text" value={formData.currPin} onChange={handleInputChange} name="currPin" maxLength={6} onFocus={() => toggleCharCountVisibility("currPin")}
                            onBlur={() => toggleCharCountVisibility("currPin")}
                        />
                        {fieldCharCountVisibility.currPin && (
                            <span className="input-group-text">
                                {formData?.currPin?.length}/6
                            </span>
                        )}
                    </div>

                    <label className="col-md-4 form-label">
                        Permanent Address same as Current Address?:
                    </label>
                    <div className="col-md-2">
                        <select
                            className="form-select col-md-12"
                            name="permAddrFlg"
                            //defaultValue={edtVal.dtlActFlg}
                            onChange={handleSelectChange}
                            value={formData.permAddrFlg}

                        >
                            <option disabled>--Select--</option>

                            {(mode === 1) ?
                                (addVal?.mst?.ddPermAddrFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.mst?.ddPermAddrFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }
                        </select>
                    </div>
                </div>

                {/* Permanet Address */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Permanent Address:
                    </label>
                    <div className="col-md-9 input-group">
                        <TextArea className="form-control" type="text" value={formData.permAddrFlg === "Y" ? formData.currAddr : formData.permAddr} name="permAddr" onChange={handleInputChange} disabled={mode === 3 || mode === 4 || formData.permAddrFlg === "Y"} maxLength={200} onFocus={() => toggleCharCountVisibility("permAddr")}
                            onBlur={() => toggleCharCountVisibility("permAddr")}
                        />
                        {fieldCharCountVisibility.permAddr && (
                            <span className="input-group-text">
                                {formData?.permAddr?.length}/200
                            </span>
                        )}
                    </div>
                </div>

                {/* Permanet Pin */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Pin No.:
                    </label>
                    <div className="col-md-3 input-group">
                        <input className="form-control" type="text" value={formData.permAddrFlg === "Y" ? formData.currPin : formData.permPin} name="permPin" onChange={handleInputChange} disabled={mode === 3 || mode === 4 || formData.permAddrFlg === "Y"} maxLength={6} onFocus={() => toggleCharCountVisibility("permPin")}
                            onBlur={() => toggleCharCountVisibility("permPin")}
                        />
                        {fieldCharCountVisibility.permPin && (
                            <span className="input-group-text">
                                {formData?.permPin?.length}/6
                            </span>
                        )}
                    </div>
                    <label className="col-md-3 form-label">
                        Mobile No.:
                    </label>
                    <div className="col-md-3 input-group">
                        <input className="form-control" type="text" value={formData.mobNo} name="mobNo" onChange={handleInputChange} disabled={mode === 3 || mode === 4}
                            maxLength={10} onFocus={() => toggleCharCountVisibility("mobNo")}
                            onBlur={() => toggleCharCountVisibility("mobNo")}
                        />
                        {fieldCharCountVisibility.mobNo && (
                            <span className="input-group-text">
                                {formData?.mobNo?.length}/10
                            </span>
                        )}
                    </div>
                </div>


                {/* Mobile No.
 <div className="row mb-4">
    <label className="col-md-3 form-control">
        Mobile No.:
    </label>
    <div className="col-md-9">
        <TextArea type="text" value={formData.mobNo} name="mobNo" onChange={handleInputChange} disabled={mode===3 || mode===4}/>
    </div>
</div> */}

                {/* Email Id. */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>Email Id:</b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelEmailLov(true)} /></span>}

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                // required
                                disabled={mode === 3 || mode === 4}
                                value={formData.emailId}

                            />

                            <div className="row-mb-12">
                                {showModelEmailLov && <Lov
                                    moduleLovData={emailLovData}
                                    setShowModel={setShowModelEmailLov}
                                    showModel={showModelEmailLov}
                                    handleRowClick={handleRowClickEmailLov}
                                    columns={emailLovColumns}
                                    currentSelection={selectRowEmail}
                                    setCurrentSelection={setSelectRowEmail}
                                />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marital Status */}
                <div className="row mb-4">

                    <label className="col-md-3 form-label">Marital Status:</label>
                    <div className="col-md-9">
                        <select
                            /*  className="form-select col-md-3 mx-2 border rounded-3" */
                            className="form-select col-md-12"
                            // aria-label="Default select example"
                            name="maritalStat"
                            // defaultValue="A"
                            value={formData.maritalStat}
                            onChange={handleSelectChange}
                        >

                            {(mode === 1) ?
                                (addVal?.mst?.ddMaritalStatusFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                ))) : (edtVal?.mst?.ddMaritalStatusFlg?.map((item) => (
                                    <option value={item.value}>{item.label}</option>
                                )))
                            }

                        </select>
                    </div>



                </div>

                {/* Pan & emp Id */}
                <div className="row mb-4">
                    <label className="col-md-3 form-label">
                        Pan:
                    </label>
                    <div className="col-md-3 input-group">
                        <input className="form-control" type="text" value={formData.pan} name="pan" onChange={handleInputChange} disabled={mode === 3 || mode === 4} maxLength={15} onFocus={() => toggleCharCountVisibility("pan")}
                            onBlur={() => toggleCharCountVisibility("pan")}
                        />
                        {fieldCharCountVisibility.pan && (
                            <span className="input-group-text">
                                {formData?.pan?.length}/15
                            </span>
                        )}
                    </div>
                    <label className="col-md-3 form-label">
                        Employee Code:
                    </label>
                    <div className="col-md-3">
                        <input className="form-control" type="text" readOnly value={formData.empCd} name="empCd" onChange={handleInputChange} disabled={mode === 3 || mode === 4} />
                    </div>
                </div>


                <div className="card shadow-none">
                    <div className="card-header bg-primary" style={{ height: '40px' }}>
                        {/* <div className=""> */}
                        <h4 className="my-1" style={{ color: "white" }}><b>Spouse Posting Details:</b></h4>
                        {/* </div> */}
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">

                            <label className="col-md-3 form-label">Working Status:</label>
                            <div className="col-md-9">
                                <select
                                    /*  className="form-select col-md-3 mx-2 border rounded-3" */
                                    className="form-select col-md-12"
                                    aria-label="Default select example"
                                    name="spouseWrkngStat"
                                    defaultValue="A"
                                    value={formData.spouseWrkngStat}
                                    onChange={handleSelectChange}
                                >

                                    {(mode === 1) ?
                                        (addVal?.mst?.ddWrkngStatusFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.mst?.ddWrkngStatusFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }

                                </select>
                            </div>



                        </div>

                        <div className="row mb-4">

                            <label className="col-md-3 form-label">Working At:</label>
                            <div className="col-md-9">
                                <select
                                    /*  className="form-select col-md-3 mx-2 border rounded-3" */
                                    className="form-select col-md-12"
                                    aria-label="Default select example"
                                    name="spouseWrkngAt"
                                    defaultValue="A"
                                    value={formData.spouseWrkngAt}
                                    onChange={handleSelectChange}
                                >

                                    {(mode === 1) ?
                                        (addVal?.mst?.ddWorkingAtFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.mst?.ddWorkingAtFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }

                                </select>
                            </div>



                        </div>

                        <div className="row mb-4">

                            <label className="col-md-3 form-label">District:</label>
                            <div className="col-md-9">
                                <select
                                    /*  className="form-select col-md-3 mx-2 border rounded-3" */
                                    className="form-select col-md-12"
                                    aria-label="Default select example"
                                    name="spouseWrkngDistCd"
                                    // defaultValue="A"
                                    value={formData.spouseWrkngDistCd}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">--Select District--</option>
                                    {(mode === 1) ?
                                        (distLovData?.map((item) => (
                                            <option value={item.distCd}>{item.distNm}</option>
                                        ))) : (distLovData?.map((item) => (
                                            <option value={item.distCd}>{item.distNm}</option>
                                        )))
                                    }

                                </select>
                            </div>



                        </div>

                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Posting Location:
                            </label>
                            <div className="col-md-9 input-group">
                                <input className="form-control" type="text" value={formData.spouseWrkngDtl} name="spouseWrkngDtl" onChange={handleInputChange} disabled={mode === 3 || mode === 4}
                                    maxLength={500} onFocus={() => toggleCharCountVisibility("spouseWrkngDtl")}
                                    onBlur={() => toggleCharCountVisibility("spouseWrkngDtl")}
                                />
                                {fieldCharCountVisibility.spouseWrkngDtl && (
                                    <span className="input-group-text">
                                        {formData?.spouseWrkngDtl?.length}/500
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <Card>
                    <div className="table-responsive table">
                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                            <thead>
                                <tr>
                                    <th className="sno">Row#</th>

                                    {/* <th></th> */}
                                    <th>District Code</th>
                                    <th>District Name</th>
                                    <th>Block Code</th>
                                    <th>Block name</th>
                                    <th>Status<span className="text-red">*</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData?.dtl?.map((row, index) => (
                                    row.action !== "D" ? <tr key={index}>
                                        <td>{index + 1}</td>


                                        <td>
                                            <div className=" input-group">
                                                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                                                    <i className="fa fa-search d-inline text-white" title="" onClick={() => {
                                                        setShowModelDtlDistLov(true);
                                                        openDtlDist(index);
                                                    }} /></span>}
                                                <input
                                                    type="text"
                                                    autoComplete={false}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="form-control"
                                                    // readOnly
                                                    name="distCd"
                                                    disabled={mode === 3 || mode === 4}
                                                    // required
                                                    value={row?.distCd}
                                                // disabled={}
                                                />

                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <input
                                                    type="text"
                                                    autoComplete={false}
                                                    className="form-control"
                                                    // required
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={row?.distNm}
                                                    disabled={mode === 3 || mode === 4}
                                                />

                                                <div className="row-mb-12">
                                                    {showModelDtlDistLov && <Lov
                                                        moduleLovData={dtlDistLovData}
                                                        setShowModel={setShowModelDtlDistLov}
                                                        showModel={showModelDtlDistLov}
                                                        handleRowClick={handleRowClickDtlDistLov}
                                                        columns={dtlDistLovColumns}
                                                        currentSelection={selectRowDtlDistLov}
                                                        setCurrentSelection={setSelectRowDtlDistLov}
                                                    />}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className=" input-group">
                                                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                                                    <i className="fa fa-search d-inline text-white" title="" onClick={() => {
                                                        setShowModelDtlBlkLov(true);
                                                        openDtlBlk(index);
                                                    }} /></span>}
                                                <input
                                                    type="text"
                                                    autoComplete={false}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className="form-control"
                                                    // readOnly
                                                    name="blkCd"
                                                    disabled={mode === 3 || mode === 4}
                                                    // required
                                                    value={row?.blkCd}
                                                // disabled={}
                                                />

                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <input
                                                    type="text"
                                                    autoComplete={false}
                                                    className="form-control"
                                                    // required
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    value={row?.blkNm}
                                                    disabled={mode === 3 || mode === 4}
                                                />

                                                <div className="row-mb-12">
                                                    {showModelDtlBlkLov && <Lov
                                                        moduleLovData={dtlBlkLovData}
                                                        setShowModel={setShowModelDtlBlkLov}
                                                        showModel={showModelDtlBlkLov}
                                                        handleRowClick={handleRowClickDtlBlkLov}
                                                        columns={dtlBlkLovColumns}
                                                        currentSelection={selectRowDtlBlkLov}
                                                        setCurrentSelection={setSelectRowDtlBlkLov}
                                                    />}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
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
                                                    (addVal?.mst?.dtl[0]?.ddActFlg?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    ))) : (edtVal?.mst?.dtl[0]?.ddActFlg?.map((item) => (
                                                        <option value={item.value}>{item.label}</option>
                                                    )))
                                                }
                                            </select>

                                        </td>

                                        <td>
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


