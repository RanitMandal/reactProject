
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
import { moduleLovColumns, formLovColumns, appLovColumns, chngReqLovColumns, contactLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };

export const ChangeReqstFormForJackt = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

  console.log(edtVal);
  console.log(addVal.ddImgDbFlg);
  const userId = getScplAdContext().userId;
  const reqAppLogNo = getScplAdContext().appLogNo;
  const fromLvlRefCd = sessionStorage.getItem("lvlRefCd")
  const closedAppLogNo = getScplAdContext().appLogNo;
  const [formData, setFormData] = useState({
    action: "I",
    actFlg: "A",
    appId: "",
    appDesc: "",
    chngReqDesc: "",
    chngReqNo: "",
    chngReqTypCd: "",
    chgReqTypDesc: "",
    closedAppLogNo: "",
    respContactId: "",
    respContactNm: "",
    respSlNo: "",
    dtl01: [
      {
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
    "formId": "",
    "formNm": "",
    "fromLvlRefCd": "",
    "modId": "",
    "modNm": "",
    "reqAppLogNo": "",
    "status": "1",
    "userId": ""
  });

  //chngReq Lov Starts     

  const [chngReqLovData, setChngReqLovData] = useState([]);
  useEffect(() => {

    const fetchChngReqLovData = async () => {
      let obj = {
        apiId: 'SUA00647'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/getAllChngReqTypeMst", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setChngReqLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchChngReqLovData();
  }, []);


  const getChngReqNm = (obj) => {
    return chngReqLovData[Number(Object.keys(obj)[0])]?.chgReqTypDesc ? chngReqLovData[Number(Object.keys(obj)[0])]?.chgReqTypDesc : ""
  }

  const getChngReqId = (obj) => {
    return chngReqLovData[Number(Object.keys(obj)[0])]?.chngReqTypCd ? chngReqLovData[Number(Object.keys(obj)[0])]?.chngReqTypCd : ""
  }

  const [selectRowChngReq, setSelectRowChngReq] = useState("");
  const [selectRowChngReqLov, setSelectRowChngReqLov] = useState("");
  const [showModelChngReqLov, setShowModelChngReqLov] = useState(false);
  const handleRowClickChngReqLov = (rowData) => {
    setSelectRowChngReq(rowData);
    setSelectRowChngReqLov(rowData);
    setFormData({
      ...formData,
      chngReqTypCd: getChngReqId(rowData),
      chgReqTypDesc: getChngReqNm(rowData),
      dtl01: [...formData.dtl01]
    })

  };
  console.log(queryInputObj);
  //ChngReq Lov ends 


  // Mod Lov
  const [modLovData, setModLovData] = useState([]);

  useEffect(() => {

    const fetchModLovData = async () => {
      let obj = {
        apiId: 'SUA00548'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/getAllModMst", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

        });
    };
    fetchModLovData();
  }, []);




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
      formId: "",
      formNm: "",
      dtl01: formData.dtl01.map((dtlRow) => ({
        ...dtlRow,

      }))
    });


  };
  //Module Lov ends 

  //App Lov Starts     

  const [appLovData, setAppLovData] = useState([]);
  useEffect(() => {

    const fetchAppLovData = async () => {
      let obj = {
        apiId: 'SUA00549'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/getAllAppInfo", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setAppLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchAppLovData();
  }, []);


  const getAppNm = (obj) => {
    return appLovData[Number(Object.keys(obj)[0])]?.appDesc ? appLovData[Number(Object.keys(obj)[0])]?.appDesc : ""
  }

  const getAppId = (obj) => {
    return appLovData[Number(Object.keys(obj)[0])]?.appid ? appLovData[Number(Object.keys(obj)[0])]?.appid : ""
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowAppLov, setSelectRowAppLov] = useState("");
  const [showModelAppLov, setShowModelAppLov] = useState(false);
  const handleRowClickAppLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowAppLov(rowData);
    setFormData({
      ...formData,
      appId: getAppId(rowData),
      appDesc: getAppNm(rowData),
      dtl01: [...formData.dtl01]
    })

  };
  console.log(queryInputObj);
  //App Lov ends 

  //Form Lov Starts
  const [formLovObj, setFormLovObj] = useState({
    apiId: "SUA00343",
    criteria: {

      modId: "",

    }

  })
  useEffect(() => {
    setFormLovObj({
      apiId: "SUA00550",
      criteria: {

        modId: formData.modId

      }
    })
  }, [formData.modId])

  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {

    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/getAllFormInfo", formLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    formLovObj && fetchFormLovData();
  }, [formLovObj]);


  // const getApiName = (obj)=>{
  //   return apiLovData[Number(Object.keys(obj)[0])]?.apiNm ? apiLovData[Number(Object.keys(obj)[0])]?.apiNm:""
  // }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId ? formLovData[Number(Object.keys(obj)[0])]?.formId : ""
  }
  const getFormNm = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm ? formLovData[Number(Object.keys(obj)[0])]?.formNm : ""
  }




  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    setSelectRowFormLov(rowData);
    /* setQueryInputObj({ 
      apiId : "SUA00276",
      criteria: {
          ...queryInputObj.criteria,
          apiId: getApiId(rowData)
      }
  }) */
    console.log(rowData?.formDesc)
    setFormData({
      ...formData,
      formId: getFormId(rowData),
      formNm: getFormNm(rowData),
      dtl01: [...formData.dtl01]
    })

  };

  //Form Lov Ends

  //Contact Lov Starts     

  const [contactLovData, setContactLovData] = useState([]);
  useEffect(() => {

    const fetchContactLovData = async () => {
      let obj = {
        apiId: 'SUA00655',
        criteria: {
          modId: formData?.modId
        }
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/getAllContactUsDtl", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setContactLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    formData?.modId && fetchContactLovData();
  }, [formData.modId]);


  const getContactNm = (obj) => {
    return contactLovData[Number(Object.keys(obj)[0])]?.contactNm ? contactLovData[Number(Object.keys(obj)[0])]?.contactNm : ""
  }

  const getContactId = (obj) => {
    return contactLovData[Number(Object.keys(obj)[0])]?.contactId ? contactLovData[Number(Object.keys(obj)[0])]?.contactId : ""
  }

  const getSlNo = (obj) => {
    return contactLovData[Number(Object.keys(obj)[0])]?.respSlno ? contactLovData[Number(Object.keys(obj)[0])]?.respSlno : ""
  }

  const [selectRowContact, setSelectRowContact] = useState("");
  const [selectRowContactLov, setSelectRowContactLov] = useState("");
  const [showModelContactLov, setShowModelContactLov] = useState(false);
  const handleRowClickContactLov = (rowData) => {
    setSelectRowContact(rowData);
    setSelectRowContactLov(rowData);
    setFormData({
      ...formData,
      respContactId: getContactId(rowData),
      respContactNm: getContactNm(rowData),
      respSlNo: getSlNo(rowData),
      dtl01: [...formData.dtl01]
    })

  };
  console.log(queryInputObj);
  //Contact Lov ends 



  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");

    let modId = rowData?.modId || ""
    let resIndex = modLovData.findIndex(item => item.modId === modId)
    let currentModId = {}
    if (resIndex !== -1) currentModId = { [resIndex]: true }
    setSelectRowMod(currentModId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);

    let appId = edtVal?.mst?.appId || ""
    let resAppIndex = appLovData.findIndex(item => item.appId === appId)
    let currentAppId = {}
    if (resAppIndex !== -1) currentAppId = { [resAppIndex]: true }
    setSelectRow(currentAppId)
    console.log(appId);
    let formId = edtVal?.mst?.formId || ""
    let resFormIndex = formLovData.findIndex(item => item.formId === formId)
    let currentFormId = {}
    if (resFormIndex !== -1) currentFormId = { [resFormIndex]: true }
    setSelectRowFormLov(currentFormId)

  }, [rowData, edtVal, modLovData, formLovData, appLovData])


  useEffect(() => {
    if (mode !== 1) {
      // Set all properties of edtVal to null
      // set_tblLen(edtVal?.mst?.dtl?.length || 1)
      setFormData({
        action: "U",
        actFlg: edtVal ? edtVal?.actFlg : "A",
        appId: rowData ? rowData.appId : "",
        appDesc: edtVal ? edtVal.appDesc : "",
        chngReqDesc: rowData ? rowData.chngReqDesc : "",
        chngReqNo: rowData ? rowData.chngReqNo : "",
        chngReqTypCd: rowData ? rowData.chngReqTypCd : "",
        chgReqTypDesc: edtVal ? edtVal.chgReqTypDesc : "",
        closedAppLogNo: edtVal ? edtVal.closedAppLogNo : closedAppLogNo,
        respContactId: edtVal ? edtVal.respContactId : "",
        respContactNm: edtVal ? edtVal.respContactNm : "",
        respSlNo: edtVal ? edtVal.respSlNo : "",
        dtl01: edtVal?.chngReqDtl?.length ? edtVal?.chngReqDtl : [
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
        formId: rowData ? rowData.formId : "",
        formNm: edtVal ? edtVal.formNm : "",
        fromLvlRefCd: rowData ? rowData.fromLvlRefCd : "",
        modId: rowData ? rowData.modId : "",
        modNm: edtVal ? edtVal.modNm : "",
        reqAppLogNo: rowData ? rowData.reqAppLogNo : "",
        status: edtVal?.status ? edtVal?.status : "1",
        userId: rowData ? rowData.userId : ""
      })





    }

  }, [mode, edtVal, rowData]);

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
  console.log("650", closedAppLogNo);

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowModGrpLov);
    const { modNm, appNm, appDesc, formNm, chngReqNo, actFlg, action, chgReqTypDesc, closedAppLogNo, respContactId, respSlNo, respContactNm, ...obj } = formData

    const addObj = {
      apiId: "SUA00539",
      mst: {
        ...obj,
        userId: userId,
        fromLvlRefCd: fromLvlRefCd,
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
    console.log("xnnnn", typeof(formData?.status), formData?.status);
    const editObj = {
      apiId: "SUA00542",
      mst: {
        ...obj,
        chngReqNo: formData?.chngReqNo,
        action: formData?.action,
        actFlg: formData?.actFlg==="I"? formData.actFlg :"I",
        respContactId:formData.status === "2" || formData.status === "3"? edtVal?.respContactId: formData.respContactId,
        respSlNo: formData.status === "2" || formData.status === "3"? edtVal?.respSlNo : formData.respSlNo,
        closedAppLogNo: formData.status === "2" || formData.status === "3" ? formData.closedAppLogNo  : "" ,
        dtl01: obj.dtl01.map(item => {
          const { ddActFlg, ...data } = item
          return {
            ...data,
            fileSlNo: parseInt(item.fileSlNo),
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
    let list = formData.dtl01;

    // Clear the error message for the corresponding field
    let currentAct = list[index]?.action
    list[index] = {
      ...list[index],
      // fileCat: "",
      fileId: fileArr[0].fileId,
      fileNm: fileArr[0].fileNm,
      filePath: fileArr[0].filePath,
      fileSz: fileArr[0].fileSz,
      fileTyp: fileArr[0].fileTyp,
      fileUrl: fileArr[0].fileUri,
      flUpldLogNo: fileArr[0].flUpldLogNo,
      action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'

    };

    setFormData({
      ...formData,
      dtl01: list
    });
    console.log("formData", formData);

  };
  const download_file = async (e, i) => {
    if(mode===2){
      return;
    }
    const obj = {
      apiId: "SUA00488",
      mst: {
        fileId: formData.dtl01[i]?.fileId,
        fileNm: formData.dtl01[i]?.fileNm
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
          'download', formData.dtl01[i]?.fileId + "." + extention
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
    if(mode===2){
      return;
    }
    let obj = {
      apiId: "SUA00489",
      mst: [{
        flUpldLogNo: formData.dtl01[i]?.flUpldLogNo
      }]
    }
    console.log("yyyyyyyy", formData.dtl01[i]);

    if (window.confirm("Are you sure? File cannot be recover once deleted !")) {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/forceFileDeletion",
          obj, { headers }
          // formData
        )
        .then((res) => {
          if (res?.data?.appMsgList?.errorStatus === false) {
            const updatedDtl01 = [...formData.dtl01];

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
              dtl01: updatedDtl01
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

      <h4 className="card-title">Report Problem {getFormTitle(mode)}</h4>
      <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
        {/* Change Req No */}
        {mode !== 1 && <div className=" row mb-4">
          <label className="col-md-3 form-label">Change Request No:<span className="text-red">*</span></label>
          <div className="col-md-9">
            <div className="input-group ">
              <input type="" className="form-control rounded-3 ui_display_txt_" readOnly name="chngReqNo" value={formData.chngReqNo} onChange={handleInputChange}
                disabled={mode === 2} />
            </div>
          </div>
        </div>}
        {/* Change Request Type Code Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Change Request Type:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode  !== 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelChngReqLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 2}
                value={formData.chngReqTypCd}

              />&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                name="chgReqTypDesc"
                disabled={mode === 2}
                value={formData.chgReqTypDesc}

              />
              <div className="row-mb-12">
                {showModelChngReqLov && <Lov
                  moduleLovData={chngReqLovData}
                  setShowModel={setShowModelChngReqLov}
                  showModel={showModelChngReqLov}
                  handleRowClick={handleRowClickChngReqLov}
                  columns={chngReqLovColumns}
                  currentSelection={selectRowChngReq}
                  setCurrentSelection={setSelectRowChngReq}
                />}
              </div>
            </div>
          </div>
        </div>
        {/* change Req Desc */}
        <div className="row mb-4 ">
          <label className="col-md-3 form-label">Change Request Description</label>
          <div className="col-md-9 input-group">
            <textarea type="text" className="form-control rounded-3 ui_entry_txt_rc" name="chngReqDesc" value={formData.chngReqDesc} onChange={handleInputChange}
              disabled={mode === 2}
              required
              maxLength={100} onFocus={() => toggleCharCountVisibility("chngReqDesc")}
              onBlur={() => toggleCharCountVisibility("chngReqDesc")}
            />
            {fieldCharCountVisibility.chngReqDesc && (
              <span className="input-group-text">
                {formData?.chngReqDesc?.length}/100
              </span>
            )}
          </div>
        </div>




        {/* Module Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode !== 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 2}
                value={formData.modId}

              />&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 2}
                value={formData.modNm}

              />
              <div className="row-mb-12">
                {showModelModLov && <Lov
                  moduleLovData={modLovData}
                  setShowModel={setShowModelModLov}
                  showModel={showModelModLov}
                  handleRowClick={handleRowClickModLov}
                  columns={moduleLovColumns}
                  currentSelection={selectRowMod}
                  setCurrentSelection={setSelectRowMod}
                />}
              </div>
            </div>
          </div>
        </div>

        {/* Form Code */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Form Id:</b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode !== 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelFormLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                disabled={mode === 2}
                value={formData.formId}

              />&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                disabled={mode === 2}
                value={formData.formNm}

              />
              <div className="row-mb-12">
                {showModelFormLov && <Lov
                  moduleLovData={formLovData}
                  setShowModel={setShowModelFormLov}
                  showModel={showModelFormLov}
                  handleRowClick={handleRowClickFormLov}
                  columns={formLovColumns}
                  currentSelection={selectRowFormLov}
                  setCurrentSelection={setSelectRowFormLov}
                />}
              </div>
            </div>
          </div>
        </div>

        {/* App Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>App Id:</b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode !== 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelAppLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                disabled={mode === 2}
                value={formData.appId}

              />&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                name="appDesc"
                disabled={mode === 2}
                value={formData.appDesc}

              />
              <div className="row-mb-12">
                {showModelAppLov && <Lov
                  moduleLovData={appLovData}
                  setShowModel={setShowModelAppLov}
                  showModel={showModelAppLov}
                  handleRowClick={handleRowClickAppLov}
                  columns={appLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        {mode !== 1 && <div className=" row mb-4">
          <label className="col-md-3 form-label">Request Status:</label>

          <div className="col-md-9">
            <select
              className="form-select col-md-12" onChange={handleStatusChange}
              name="status"
              value={formData?.status}
              disabled={mode === 2}
            //defaultValue={edtVal.dtlActFlg}
            // onChange={handleStatusChange}
            // value={edtVal.actFlg}

            >
              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddReportReqStatusFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddReportReqStatusFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }



            </select>
          </div>
        </div>}

        {/* Contact Lov */}
        {((mode !== 1) && (formData.status==="1")) && <> <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Assign to Contact:</b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode !== 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelContactLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                disabled={mode === 2}
                value={formData.respContactId}

              />&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                // required
                name="appDesc"
                disabled={mode === 2}
                value={formData.respContactNm}

              />
              <div className="row-mb-12">
                {showModelContactLov && <Lov
                  moduleLovData={contactLovData}
                  setShowModel={setShowModelContactLov}
                  showModel={showModelContactLov}
                  handleRowClick={handleRowClickContactLov}
                  columns={contactLovColumns}
                  currentSelection={selectRowContact}
                  setCurrentSelection={setSelectRowContact}
                />}
              </div>
            </div>
          </div>
        </div>
          <div className="row mb-4">
            <label className="col-md-3"><b>Contact Sl No:</b></label>
            <div className="col-md-9">
              <input type="text" className="form-control" name="respSlNo" value={formData.respSlNo} disabled={mode===2} />
            </div>
          </div></>}

        {mode !== 1 && <div className="row mb-4">
          <label className="col-md-3 form-label">
            Status:<span className="text-red">*</span>
          </label>
          <div className="col-md-9">
            <select
              className="form-select col-md-12" onChange={handleStatusChange}
              name="actFlg"
              value={formData?.actFlg}
              disabled={mode === 2}
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
          <Card.Title className="pt-2 " style={{ backgroundColor: "#6259c9", height: "35px" }}><p className="font-weight-bold text-white">&nbsp;Attach Files/ScreenShots</p></Card.Title>
          <div className="table-responsive table">
            <table className="table  dta-tabl" style={{ background: 'white' }}>
              <thead>
                <tr>
                  <th className="sno">Row#</th>
                  <th>Sl No</th>
                  <th> Attach File<span className="text-red">*</span></th>
                  {/* <th> Actual Table Name<span className="text-red">*</span></th>
                  <th>Merge Mode<span className="text-red">*</span></th>
                  <th>Store Procedure Name</th>
                  <th></th>
                  <th>API Id</th>*/}
                  <th>Request Remarks</th>
                  {mode !== 1 && <th>Status</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData?.dtl01?.map((row, index) => (
                  row.action !== "D" ? row.actFlg !== "D" && <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <div className=" input-group">
                        <input
                          onChange={(e) => handleDtlInputChange(e, index)}
                          // onBlur={(e) => handleCharCount(e, index)}
                          value={row.fileSlNo}
                          className="form-control"
                          type="text"
                          name="fileSlNo"
                          readOnly
                          disabled={mode === 2}
                          maxLength={30}
                        // onFocus={() => toggleCharCountVisibility("chngReqNo")}
                        // onBlur={() => toggleCharCountVisibility("chngReqNo")}

                        />
                        {/* {fieldCharCountVisibility.chngReqNo && (
                          <span className="input-group-text">
                            {row?.chngReqNo?.length}/30
                          </span>
                        )} */}
                      </div>

                    </td>

                    <td>
                      <div className="row mb-2">
                        {/* <label className="form-label col-md-3">Attach Document<span className="text-red">*</span></label> */}
                        <div className="">

                          {(row?.filePath === "") && <div className="file-uploaddd">
                            {/* <div className="input-namedd">Choose File</div> */}
                            <input
                              style={{ visibility: (mode === 1 || mode === 2) ? "visible" : "hidden" }}
                              type="file"
                              required={mode === 1}
                              className="form-control"
                              id="formFile"
                              onChange={(e) => uploadFiles(e, index)}
                              name="File"
                              //required={!doc.length}
                              // multiple
                              // accept=".pdf"
                              disabled={mode === 2}
                            />
                          </div>}
                          {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

                          {/* {row?.map((file, index) => ( */}
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
                                  disabled={mode===2}
                                />

                                <Download
                                  onClick={(e) => download_file(e, index)}
                                  className="cross-icon"
                                  disabled={mode===2}

                                />
                              </>
                            )}
                          </div>
                          {/* ))} */}
                        </div>
                      </div>

                    </td>
                    <td>
                      <div className="input-group">
                        <input
                          onChange={(e) => handleDtlInputChange(e, index)}
                          // onBlur={(e) => handleCharCount(e, index)}
                          value={row.reqRemarks}
                          className="form-control"
                          type="text"
                          name="reqRemarks"
                          // required
                          disabled={mode === 2}
                          maxLength={30}
                          onFocus={() => toggleCharCountVisibility("reqRemarks")}
                          onBlur={() => toggleCharCountVisibility("reqRemarks")}

                        />
                        {fieldCharCountVisibility.reqRemarks && (
                          <span className="input-group-text">
                            {row?.reqRemarks?.length}/30
                          </span>
                        )}


                      </div>

                    </td>



                    {mode !== 1 && <td>
                      <select
                        className="form-control select"
                        aria-label=".form-select-lg example"
                        id="status"
                        value={row.actFlg}
                        required
                        disabled={mode === 2}
                        onChange={(e) => handleDtlStatusChange(e, index)}
                        name="actFlg"

                      >


                        <option disabled>--Select--</option>

                        {/*  Array.isArray(edtVal.chngReqDtl) && edtVal.chngReqDtl[0]?.ddActFlg && Array.isArray(edtVal.chngReqDtl[0].ddActFlg)) && */}
                        {edtVal?.chngReqDtl && edtVal?.chngReqDtl[0]?.ddActFlg?.map((item) => (
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
                          disabled={mode === 2}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <div className="d-flex">
                          {index !== 0 && <button
                            type="button"
                            onClick={(e) => removetableRow(e, index)}
                            className="action-button"
                            disabled={mode === 2}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>}
                          <button type="button" onClick={addtableRow} disabled={mode === 2} className="action-button">
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


