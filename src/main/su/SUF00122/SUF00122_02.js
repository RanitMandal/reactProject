
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
import { moduleLovColumns, apiLovColumns, appLovColumns, dtlApiLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const DataTrnsfrDeffForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, errExp, set_errExp, }) => {

  console.log(edtVal);
  console.log(addVal.ddImgDbFlg);


  const [formData, setFormData] = useState({

    appId: "",
    // appDesc:"",
    // appNm:"",
    apiId: "",
    // apiNm:"",
    modId: '',
    // modNm: '',
    action: 'I',
    onlineOffline: '0',
    dataTrnsfrNm: '',
    // dataTrnsfrCd:'',
    uploadDownloadFlg: 'U',
    actFlg: 'A',
    dtl: [
      {
        "actFlg": "A",
        "action": "I",
        "actualTabNm": "",
        "apiId": "",
        "appId": "",
        "dataMrgMode": "1",
        "onlineOffline": "",
        "spNm": "",

        "tempTabNm": "",
        "uploadDownloadFlg": ""
      }
    ],
  });
  const [modLovData, setModLovData] = useState([]);

  useEffect(() => {

    const fetchModLovData = async () => {
      let obj = {
        apiId: 'SUA00345'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00122/getAllModMst", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

        });
    };
    fetchModLovData();
  }, []);

  //App Lov Starts     

  const [appLovData, setAppLovData] = useState([]);
  useEffect(() => {

    const fetchAppLovData = async () => {
      let obj = {
        apiId: 'SUA00344'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00122/getAllAppInfo", obj, { headers })
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
      modId: "",
      modNm: "",
      apiId: "",
      apiNm: ""
    })

  };
  console.log(queryInputObj);
  //App Lov ends 

  //Api Lov Starts
  const [apiLovObj, setApiLovObj] = useState({
    apiId: "SUA00343",
    criteria: {

      modId: "",

    }

  })
  useEffect(() => {
    setApiLovObj({
      apiId: "SUA00343",
      criteria: {

        modId: formData.modId

      }
    })
  }, [formData.modId])

  const [apiLovData, setApiLovData] = useState([]);
  useEffect(() => {

    const fetchApiLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00122/getAllApiByModMst", apiLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setApiLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    apiLovObj && fetchApiLovData();
  }, [apiLovObj]);


  // const getApiName = (obj)=>{
  //   return apiLovData[Number(Object.keys(obj)[0])]?.apiNm ? apiLovData[Number(Object.keys(obj)[0])]?.apiNm:""
  // }

  const getApiId = (obj) => {
    return apiLovData[Number(Object.keys(obj)[0])]?.apiId ? apiLovData[Number(Object.keys(obj)[0])]?.apiId : ""
  }
  const getApiNm = (obj) => {
    return apiLovData[Number(Object.keys(obj)[0])]?.apiNm ? apiLovData[Number(Object.keys(obj)[0])]?.apiNm : ""
  }
  const getApiDesc = (obj) => {
    return apiLovData[Number(Object.keys(obj)[0])]?.apiDesc ? apiLovData[Number(Object.keys(obj)[0])]?.apiDesc : ""
  }
  const getApiUrl = (obj) => {
    return apiLovData[Number(Object.keys(obj)[0])]?.apiUrl ? apiLovData[Number(Object.keys(obj)[0])]?.apiUrl : ""
  }



  const [selectRowApiLov, setSelectRowApiLov] = useState("");
  const [showModelApiLov, setShowModelApiLov] = useState(false);
  const handleRowClickApiLov = (rowData) => {
    setSelectRowApiLov(rowData);
    /* setQueryInputObj({ 
      apiId : "SUA00276",
      criteria: {
          ...queryInputObj.criteria,
          apiId: getApiId(rowData)
      }
  }) */
    console.log(rowData?.apiDesc)
    setFormData({
      ...formData,
      apiId: getApiId(rowData),
      apiNm: getApiDesc(rowData),
    })

  };

  //Api Lov Ends

  // Details Api LOV..........
  const [rowIndex, setRowIndex] = useState(0);
  const [dtlApiObj, set_dtlApiObj] = useState({
    apiId: "SUA00358",
    criteria: {
      modId: ""
    }
  })
  useEffect(() => {
    set_dtlApiObj({
      apiId: "SUA00343",
      criteria: {
        modId: formData.modId
      }
    })
  }, [formData.modId,])

  const [dtlApiLovData, setDtlApiLovData] = useState([]);
  useEffect(() => {

    const fetchDtlApiLovData = async () => {

      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00122/getAllApiByModMst", dtlApiObj, { headers })
        .then((res) => {
          console.log(res.data);
          setDtlApiLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);


        });
    };
    dtlApiObj && fetchDtlApiLovData();
  }, [dtlApiObj]);


  const getDtlApiNm = (obj) => {
    return dtlApiLovData[Number(Object.keys(obj)[0])]?.apiNm ? dtlApiLovData[Number(Object.keys(obj)[0])]?.apiNm : ""
  }

  const getDtlApiCd = (obj) => {
    return dtlApiLovData[Number(Object.keys(obj)[0])]?.apiId ? dtlApiLovData[Number(Object.keys(obj)[0])]?.apiId : ""
  }
  const openDtlApi = (index) => {
    setRowIndex(index)
    setSelectRowDtlApiLov({})
    console.log(rowIndex);
  }

  const [selectRowDtlApi, setSelectRowDtlApi] = useState("");
  const [selectRowDtlApiLov, setSelectRowDtlApiLov] = useState("");
  const [showModelDtlApiLov, setShowModelDtlApiLov] = useState(false);
  const handleRowClickDtlApiLov = (rowData) => {
    console.log(rowData)
    setSelectRowDtlApi(rowData);
    setSelectRowDtlApiLov(rowData);
    let list = formData.dtl
    list[rowIndex] = {
      ...list[rowIndex],
      apiId: getDtlApiCd(rowData),
      apiNm: getDtlApiNm(rowData),

    }
    //  console.log(rows);
    setFormData({
      ...formData,
      dtl: list
    })
  };
  //Details Api Lov ends 
  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");

    let modId = rowData?.modId || ""
    let resIndex = modLovData.findIndex(item => item.modId === modId)
    let currentModId = {}
    if (resIndex !== -1) currentModId = { [resIndex]: true }
    setSelectRowMod(currentModId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);
    let apiId = edtVal?.mst?.apiId || ""
    let resApiIndex = apiLovData.findIndex(item => item.apiId === apiId)
    let currentApiId = {}
    if (resApiIndex !== -1) currentApiId = { [resApiIndex]: true }
    setSelectRowApiLov(currentApiId)

    let appId = edtVal?.mst?.appId || ""
    let resAppIndex = appLovData.findIndex(item => item.appId === appId)
    let currentAppId = {}
    if (resAppIndex !== -1) currentAppId = { [resAppIndex]: true }
    setSelectRow(currentAppId)
    console.log(appId);
    let dtlApiId = edtVal?.mst?.dtl?.apiId || ""
    let resDtlApiIndex = dtlApiLovData.findIndex(item => item.apiId === dtlApiId)
    let currentDtlApiId = {}
    if (resDtlApiIndex !== -1) currentDtlApiId = { [resDtlApiIndex]: true }
    setSelectRowDtlApiLov(currentDtlApiId)

  }, [rowData, edtVal, modLovData, dtlApiLovData, appLovData, apiLovData])


  useEffect(() => {
    if (mode !== 1) {
      // Set all properties of edtVal to null
      // set_tblLen(edtVal?.mst?.dtl?.length || 1)
      setFormData({
        id: rowData ? rowData.id : '',
        action: "U",
        actFlg: edtVal?.actFlg || "A",
        appId: edtVal ? edtVal?.mst?.appId : "",
        appDesc: edtVal ? edtVal?.mst?.appDesc : "",
        apiId: edtVal ? edtVal?.mst?.apiId : "",
        apiNm: edtVal ? edtVal?.mst?.apiNm : "",
        modId: rowData ? rowData.modId : '',
        modNm: rowData ? rowData.modNm : '',
        onlineOffline: rowData ? rowData.onlineOffline : '',
        dataTrnsfrCd: edtVal?.mst?.dataTrnsfrCd || "",
        dataTrnsfrNm: rowData ? rowData.dataTrnsfrNm : '',
        uploadDownloadFlg: rowData ? rowData.uploadDownloadFlg : 'U',
        dtl: edtVal?.mst?.dtl || [{
          "actFlg": "A",
          "action": "I",
          "actualTabNm": "",
          "apiId": "",
          "appId": "",
          "dataMrgMode": "1",
          // "dataTrnsfrCd": "",
          "onlineOffline": "0",
          "spNm": "",
          // "tabSlNo": 0,
          "tempTabNm": "",
          "uploadDownloadFlg": ""
        }],
      })





    }

  }, [mode, edtVal, rowData]);

  // Get All List
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00122/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    })
  }

  // Module LOV Start..............



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
      apiId: "",
      apiNm: "",
      dtl: formData.dtl.map((dtlRow) => ({
        ...dtlRow,
        apiId: "",
        apiNm: ""
      }))
    });


  };
  //Module Lov ends  

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
    if (obj.dataMrgMode === '1' && !obj.apiId) set_tblErr("API ID Required");
    else if (obj.dataMrgMode === '2' && !obj.spNm) set_tblErr("Store Procedure Required");
    else {
      // set_tblLen(tblLen+1)
      setFormData({
        ...formData,
        dtl: [
          ...list,
          {
            actFlg: "A",
            action: "I",
            actualTabNm: "",
            apiId: "",
            apiNm: "",
            appId: "",
            dataMrgMode: "1",
            //dataTrnsfrCd: "",
            onlineOffline: "",
            spNm: "",
            //tabSlNo: 0,
            tempTabNm: "",
            uploadDownloadFlg: "",

          }
        ],
      })
      console.log(list.length + 1);

    }
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

    if (name === "dataMrgMode" && value === "2") {
      // If dataMrgMode is changed to 2, set apiId and apiNm to empty
      list[index] = {
        ...list[index],
        apiId: "",
        apiNm: "",
        [name]: value,
        action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
      };
    } else if (name === "dataMrgMode" && value === "1") {
      // If dataMrgMode is changed to 1, set spNm to empty
      list[index] = {
        ...list[index],
        spNm: "",
        [name]: value,
        action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
      };
    } else {
      // For other changes, update the corresponding property
      list[index] = {
        ...list[index],
        [name]: value,
        action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'
      };
    }

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

      appId: "",
      appDesc: "",
      appNm: "",
      apiId: "",
      apiNm: "",
      modId: '',
      modNm: '',
      action: 'I',
      onlineOffline: '',
      dataTrnsfrNm: '',
      // dataTrnsfrCd:'',
      uploadDownloadFlg: 'U',
      actFlg: 'A',
      dtl: formData.dtl.map((dtlRow) => ({
        actFlg: "A",
        action: "I",
        actualTabNm: "",
        apiId: "",
        apiNm: "",
        appId: "",
        dataMrgMode: "1",
        onlineOffline: "",
        spNm: "",

        tempTabNm: "",
        uploadDownloadFlg: ""
      }))
    })


    console.log(edtVal);
  };










  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowModGrpLov);
    const { modNm, appDesc, apiNm, ...obj } = formData

    const addObj = {
      apiId: "SUA00349",
      mst: {
        ...obj,
        dtl: obj.dtl.map(item => {
          const { apiNm, ...data } = item
          return {
            ...data,
            uploadDownloadFlg: obj.uploadDownloadFlg,
            onlineOffline: obj.onlineOffline,
            appId: obj.appId,
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
      apiId: "SUA00352",
      mst: {
        ...obj,
        dataTrnsfrCd: obj?.dataTrnsfrCd,
        dtl: obj.dtl.map(item => {
          const { apiNm, appDesc, ddActFlg, ddDataMrgMode, ddOnlineOffline, ddUploadDownLoadFlg, ...data } = item
          return {
            ...data,
            uploadDownloadFlg: obj.uploadDownloadFlg,
            onlineOffline: obj.onlineOffline,
            appId: obj.appId,
            dataTrnsfrCd: obj?.dataTrnsfrCd,
            tabSlNo: data?.tabSlNo || undefined,

          }
        })
      }
    }
    

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00122/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          // fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00122/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
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
      apiId: "SUA00354",
      mst: {
        appId: formData.appId,
        dataTrnsfrCd: formData.dataTrnsfrCd

      }
    }
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00122/saveDelete', deleteObj, { headers }).then(res => {
    console.log(res.data)
    if (!res?.data?.appMsgList?.errorStatus) {
      fetchData()

    }
    set_delStatus(true)
    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    set_errExp({status:res.data?.appMsgList?.errorStatus})


  }).catch(error => {
    console.log("error")
  }).finally(() => {
    set_viewMsg(true)
});
  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
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
                 {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }

      <h4 className="card-title">Data Transfer Definition {getFormTitle(mode)}</h4>
      <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
        {/* App Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>App Id:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelAppLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 3 || mode === 4}
                value={formData.appId}

              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                required
                name="appDesc"
                disabled={mode === 3 || mode === 4}
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

        {/* Data Transfer Code */}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">Data Transfer Code:<span className="text-red">*</span></label>

          <div className="col-md-9">
            <div className="input-group ">
              <input type="" className="form-control col-md-3 rounded-3 ui_display_txt_" readOnly name="dataTrnsfrCd" value={formData.dataTrnsfrCd} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4} />
              <input type="" className="form-control col-md-9 mx-4 rounded-3 ui_entry_txt_rc" name="dataTrnsfrNm" value={formData.dataTrnsfrNm} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                required
                maxLength={100} onFocus={() => toggleCharCountVisibility("dataTrnsfrNm")}
                onBlur={() => toggleCharCountVisibility("dataTrnsfrNm")}
              />
              {fieldCharCountVisibility.dataTrnsfrNm && (
                <span className="input-group-text">
                  {formData?.dataTrnsfrNm?.length}/100
                </span>
              )}
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

              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                required
                disabled={mode === 3 || mode === 4}
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

        {/* Api Code */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Api Code:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelApiLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 3 || mode === 4}
                value={formData.apiId}

              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                required
                disabled={mode === 3 || mode === 4}
                value={formData.apiNm}

              />
              <div className="row-mb-12">
                {showModelApiLov && <Lov
                  moduleLovData={apiLovData}
                  setShowModel={setShowModelApiLov}
                  showModel={showModelApiLov}
                  handleRowClick={handleRowClickApiLov}
                  columns={apiLovColumns}
                  currentSelection={selectRowApiLov}
                  setCurrentSelection={setSelectRowApiLov}
                />}
              </div>
            </div>
          </div>
        </div>

        {/* DownLoad Flag */}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">DownLoad/Upload Flag:</label>
          <div className="col-md-9">

            <select
              className="form-select col-md-11"
              name="uploadDownloadFlg"
              value={formData.uploadDownloadFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >


              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.mst?.ddUploadDownLoadFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.mst?.ddUploadDownLoadFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }


            </select>
          </div>
        </div>
        <div className="row mb-4">
          <label className="col-md-3 form-label">Network:<span className="text-red">*</span></label>
          <div className="col-md-2 col-lg-2">
            <div className="form-group">
              <select
                className="form-select"
                name="onlineOffline"
                required
                value={formData.onlineOffline}
                onChange={handleStatusChange}
                disabled={mode === 3 || mode === 4}
              >
                {(mode === 1) ?
                  (addVal?.mst?.ddOnlineOffline?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.mst?.ddOnlineOffline?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
          </div>
          <label className="col-md-3 form-label">Status:<span className="text-red">*</span></label>
          <div className="col-md-2 col-lg-2">
            <div className="form-group">
              <select
                className="form-select"
                name="actFlg"
                required
                value={formData.actFlg}
                onChange={handleStatusChange}
                disabled={mode === 3 || mode === 4}
              >
                {(mode === 1) ?
                  (addVal?.mst?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.mst?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
          </div>

        </div>

        <Card>
          <div className="table-responsive table">
            <table className="table  dta-tabl" style={{ background: 'white' }}>
              <thead>
                <tr>
                  <th className="sno">Row#</th>
                  <th>Sl No</th>
                  <th> Table Name<span className="text-red">*</span></th>
                  <th> Actual Table Name<span className="text-red">*</span></th>
                  <th>Merge Mode<span className="text-red">*</span></th>
                  <th>Store Procedure Name</th>
                  {/* <th></th> */}
                  <th>API Id</th>
                  <th>API Name</th>
                  <th>Status<span className="text-red">*</span></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData?.dtl?.map((row, index) => (
                  row.action !== "D" ? <tr key={index}>
                    <td>{index + 1}</td>



                    <td>
                      <input

                        className="form-control"
                        type="text"
                        name="tabSlNo"
                        value={row.tabSlNo}
                        disabled
                      />

                    </td>
                    <td>
                      <div className="input-group">
                        <input
                          onChange={(e) => handleDtlInputChange(e, index)}
                          // onBlur={(e) => handleCharCount(e, index)}
                          value={row.tempTabNm}
                          className="form-control"
                          type="text"
                          name="tempTabNm"
                          required
                          disabled={mode === 3 || mode === 4}
                          maxLength={30}
                          onFocus={() => toggleCharCountVisibility("tempTabNm")}
                          onBlur={() => toggleCharCountVisibility("tempTabNm")}

                        />
                        {fieldCharCountVisibility.tempTabNm && (
                          <span className="input-group-text">
                            {row?.tempTabNm?.length}/30
                          </span>
                        )}


                      </div>

                    </td>
                    <td>
                      <div className=" input-group">
                        <input
                          onChange={(e) => handleDtlInputChange(e, index)}
                          // onBlur={(e) => handleCharCount(e, index)}
                          value={row.actualTabNm}
                          className="form-control"
                          type="text"
                          name="actualTabNm"
                          required
                          disabled={mode === 3 || mode === 4}
                          maxLength={30}
                          onFocus={() => toggleCharCountVisibility("actualTabNm")}
                          onBlur={() => toggleCharCountVisibility("actualTabNm")}

                        /> {fieldCharCountVisibility.actualTabNm && (
                          <span className="input-group-text">
                            {row?.actualTabNm?.length}/30
                          </span>
                        )}
                      </div>

                    </td>
                    <td>
                      <select
                        className="form-control select"
                        aria-label=".form-select-lg example"
                        id="status"
                        value={row.dataMrgMode}
                        required
                        disabled={mode === 3 || mode === 4}
                        onChange={(e) => handleDtlStatusChange(e, index)}
                        name="dataMrgMode"
                      >

                        <option disabled>--Select--</option>


                        {(mode === 1) ?
                          (addVal?.mst?.dtl[0]?.ddDataMrgMode?.map((item) => (
                            <option value={item.value}>{item.label}</option>
                          ))) : (edtVal?.mst?.dtl[0]?.ddDataMrgMode?.map((item) => (
                            <option value={item.value}>{item.label}</option>
                          )))
                        }

                      </select>

                    </td>
                    <td>
                      <div className=" input-group">
                        <input
                          onChange={(e) => handleDtlInputChange(e, index)}
                          // onBlur={(e) => handleCharCount(e, index)}
                          value={row.spNm}
                          className="form-control"
                          type="text"
                          name="spNm"
                          disabled={mode === 3 || mode === 4 || row.dataMrgMode !== '2'}
                          // disabled={ }
                          // required
                          maxLength={50} onFocus={() => toggleCharCountVisibility("spNm")}
                          onBlur={() => toggleCharCountVisibility("spNm")}

                        /> {fieldCharCountVisibility.spNm && (
                          <span className="input-group-text">
                            {row?.spNm?.length}/50
                          </span>
                        )}
                      </div>

                    </td>

                    {/* <td>
                  
                    </td> */}

                    <td>
                      <div className=" input-group">
                        {row.dataMrgMode === '1' && (mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                          <i className="fa fa-search d-inline text-white" title="" onClick={() => {
                            setShowModelDtlApiLov(true);
                            openDtlApi(index);
                          }} /></span>}
                        <input
                          type="text"
                          autoComplete={false}
                          onChange={(e) => handleInputChange(e, index)}
                          className="form-control"
                          // readOnly
                          name="apiId"
                          disabled={mode === 3 || mode === 4 || row.dataMrgMode !== '1'}
                          // required
                          value={row?.apiId}
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
                          value={row?.apiNm}
                          disabled={mode === 3 || mode === 4 || row.dataMrgMode !== '1'}
                        />

                        <div className="row-mb-12">
                          {showModelDtlApiLov && <Lov
                            moduleLovData={dtlApiLovData}
                            setShowModel={setShowModelDtlApiLov}
                            showModel={showModelDtlApiLov}
                            handleRowClick={handleRowClickDtlApiLov}
                            columns={dtlApiLovColumns}
                            currentSelection={selectRowDtlApiLov}
                            setCurrentSelection={setSelectRowDtlApiLov}
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


