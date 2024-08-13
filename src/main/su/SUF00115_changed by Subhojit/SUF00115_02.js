import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { MaterialReactTable } from "material-react-table";
import Lov from "../../common/Lov";
//import Accordian from "./Accordian";
import ApiFormMapping from "./ApiFormMapping";
//import {JsonComposer} from "./JsonComposer";
import JsonEditorViewer from "./JsonEditorViewer";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import axios from 'axios'
import { getApiToken } from "../../common/common"
import {decodeFullForm} from "../../common/decode"
import { Alert } from "react-bootstrap";
import { apiCategoryLovColumns, moduleLovColumns, formLovColumns, appLovColumns } from "./columns";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
//MuiTableCell-root

const ApiMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, editFormData, setEditFormData, defaultData, setDefaultData, openPageData, setOpenPageData ,  errExp, set_errExp,}) => {
const headers = { Authorization: 'Bearer ' + getApiToken() };
if(mode === 1) openPageData = null;
  const fetchData = async () => {
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00115/getListPageData', queryInputObj, { headers }).then((res) => {
      setData(res?.data?.content?.qryRsltSet);
      setData(res?.data?.content?.qryRsltSet.map(item=>{
        return{
          ...item,
          apiTypTxt: decodeFullForm(item.apiTyp), 
          actFlgTxt: decodeFullForm(item.actFlg)
          
        }
      }));
    })
  }
  
  const [saveButton, setSaveButton] = useState({
    apiDtl: false,
    apiResStruc: false,
    apiReqStruc: false
  })

  const [formData, setFormData] = useState("");

  useEffect(() => {
    
 setFormData({
    apiId: rowData ? rowData.apiId : "",
    apiNm: rowData ? rowData.apiNm : "",
    apiDesc: rowData ? rowData.apiDesc : "",
    apiCatCd: openPageData ? openPageData.apiCatCd : "",
    apiTyp: openPageData ? openPageData.apiTyp : "P",
    modId: openPageData ? openPageData.modId : "",
    formId: openPageData ? openPageData.formId : "",
    formNm: openPageData ? openPageData.formNm : "",
    apiMethodNm: openPageData ? openPageData.apiMethodNm : "",
    totReqRow: 0,
    totResRow: 0,
    apiUrl: rowData ? rowData.apiUrl : "",
    apiReqChkFlg: openPageData ? openPageData.apiReqChkFlg : 'N',
    apiResChkFlg: openPageData ? openPageData.apiResChkFlg : 'N',
    appId:openPageData ? openPageData.appId : "",
    appDesc:openPageData ? openPageData.appDesc : "",
    actFlg: openPageData ? openPageData.actFlg : 'A'
  })

}, [openPageData])

console.log("xxxxx",editFormData)
const [apiReqStruc, setApiReqStruc] = useState({jsObject: ''})
const [apiResStruc, setApiResStruc] = useState({jsObject: ''})

useEffect(() => {
  let reqStruc = null, resStruc=null;
  try{
    reqStruc = JSON.parse(editFormData?.apiReqStruc)
  }catch(err){
    console.log(err);
  }
  try{
    resStruc = JSON.parse(editFormData?.apiResStruc)
  }catch(err){
    console.log(err);
  }
  
  setApiReqStruc(reqStruc? {jsObject: reqStruc, json: editFormData?.apiReqStruc}: {jsObject: {}})
  setApiResStruc(resStruc? {jsObject: resStruc, json: editFormData?.apiResStruc}: {jsObject: {}})

  // setApiResStruc(editFormData?.apiResStruc? {jsObject: resStruc}: null)
   
 }, [editFormData?.apiReqStrucSl])


  const [submitFlg, setSubmitFlg] = useState(false)


  //Api Category Lov Starts

  const [apiCatLovData, setApiCatLovData] = useState([]);

  useEffect(() => {
    const apiCatLovObj = {
      apiId: "SUA00257"
      // mst: {

      // }
    }
    const fetchApiCatLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/getAllCatMst", apiCatLovObj, { headers })
        .then((res) => {
          setApiCatLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchApiCatLovData();
  }, []);

  const getApiCatCd = (obj) => {
    return apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatCd
  }

  const getApiCatName = (obj) => {
    return apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatNm
  }

  const [selectRowApiCat, setSelectRowApiCat] = useState({});
  const [showModelApiCat, setShowModelApiCat] = useState(false);
  const handleRowClickApiCat = (rowData) => {
    if(openPageData) openPageData.apiCatNm = null
    setSelectRowApiCat(rowData);
    setFormData({
      ...formData,
      apiCatCd: getApiCatCd(rowData)
    })
  };

  //Module Lov Starts
  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const modLovObj = {
      apiId: "SUA00258"
      // mst: {

      // }
    }
    const fetchModuleLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/getAllModMst", modLovObj, { headers })
        .then((res) => {
          setModuleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchModuleLovData();
  }, []);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm
  }

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId
  }

  const [selectRow, setSelectRow] = useState({});
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    if(openPageData) {
      openPageData.modNm = null
      openPageData.formNm=null
    }
    setSelectRow(rowData);
    setSelectRowFormLov({});
    
    setFormData({
      ...formData,
      modId: getModuleId(rowData),
      formId: "",
      formNm: ""
    })
  };

  //Form Lov Starts
  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId : "SUA00259",
      criteria: {
           modId: getModuleId(selectRow)
        }
    }
    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/getFormMstByModMst", formLovObj, { headers })
        .then((res) => {
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    selectRow && fetchFormLovData();
  }, [selectRow]);


  const getFormName = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm
  }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId
  }

  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    //openPageData.formNm = null
    setSelectRowFormLov(rowData);
    setFormData({
      ...formData,
      formId: getFormId(rowData),
      formNm: getFormName(rowData)
    })
  };
  //Form Lov Ends

 //App Lov Starts

 const [appLovData, setAppLovData] = useState([]);

 useEffect(() => {
   const appLovObj = {
     apiId: "SUA00291"
     // mst: {

     // }
   }
   const fetchAppLovData = async () => {
     await axios
       .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/getAllAppInfo", appLovObj, { headers })
       .then((res) => {
         setAppLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

       });
   };
   fetchAppLovData();
 }, []);

 const getAppCd = (obj) => {
   return appLovData[Number(Object.keys(obj)[0])]?.appid ? appLovData[Number(Object.keys(obj)[0])]?.appid:""
 }

 const getAppName = (obj) => {
   return appLovData[Number(Object.keys(obj)[0])]?.appDesc ? appLovData[Number(Object.keys(obj)[0])]?.appDesc:""
 }

 const [selectRowApp, setSelectRowApp] = useState({});
 const [showModelApp, setShowModelApp] = useState(false);
 const handleRowClickApp = (rowData) => {
   if(openPageData) openPageData.appDesc = null
   setSelectRowApp(rowData);
   setFormData({
     ...formData,
     appId: getAppCd(rowData),
     appDesc: getAppName(rowData)
   })
 };




  console.log("EditFormData"+editFormData?.apiReqStrucSl);
  const submitStruc = async (e) => {
    e.preventDefault();

    const addReqObj = {
      apiId: "SUA00267",
      mst01:
      {
        slNo:"",
        apiId: formData.apiId,
        reqStr: apiReqStruc.json
      }
    }

    const editReqObj = {
      apiId: "SUA00255",
      mst01:
      {
        apiId: formData.apiId,
        // slNo: editFormData?.apiReqStrucSl,
        reqStr: apiReqStruc.json
      }
    }
   console.log("000000REQ",editFormData);
    if (mode === 1)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/saveDataMst/01", addReqObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Saved Successfully")
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          setSaveButton({
            ...saveButton, apiReqStruc: true
          })
        }
      }
    })

    if (mode === 2 && editFormData.apiReqStrucSl===0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/saveDataMst/01", addReqObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Saved Successfully")
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

        setSaveButton({
          ...saveButton, apiReqStruc: true
        })
        setEditFormData({
          ...editFormData, apiReqStrucSl:(res.data.content.mst01.slNo)
        })
      }
    })

    else if (mode === 2 && editFormData.apiReqStrucSl!==0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/editDataMst/01", editReqObj, { headers }).then((res) => {
      if (res.data) {

        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Updated Successfully")
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

      }
    })

   

  }

  const submitResStruc = async (e) => {
    e.preventDefault();

    const addResObj = {
      apiId: "SUA00268",
      mst02:
      {
        slNo:"",
        apiId: formData.apiId,
        resStr: apiResStruc.json
      }
    }

    const editResObj = {
      apiId: "SUA00256",
      mst02:
      {
        apiId: formData.apiId,
        // slNo: editFormData?.apiResStrucSl,
        resStr: apiResStruc.json
      }
    }

    if (mode === 1)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/saveDataMst/02", addResObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Saved Successfully")
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       set_errExp({ status: res.data?.appMsgList?.errorStatus })

       if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
        setSaveButton({
          ...saveButton, apiResStruc: true
        })
      }
      }
    })

    if (mode === 2 && editFormData.apiResStrucSl===0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/saveDataMst/02", addResObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Saved Successfully")
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       set_errExp({ status: res.data?.appMsgList?.errorStatus })

        setSaveButton({
          ...saveButton, apiResStruc: true
        })
        setEditFormData({
          ...editFormData, apiResStrucSl:(res.data.content.mst02.slNo)
        })
      }
    })

    else if (mode === 2 && editFormData.apiResStrucSl!==0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00115/editDataMst/02", editResObj, { headers }).then((res) => {
      if (res.data) {

        // setSubmitFlg(true)
        if(res.data?.code === 0) alert("Record Updated Successfully")
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       set_errExp({ status: res.data?.appMsgList?.errorStatus })

      }
    })


  }


  //const [openAcordian, setOpenAcordian] = useState(2)
  //onClick={()=>setOpenAcordian(4)} class={`accordion-collapse ${openAcordian === 4? "": "collapse"}`}
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const apiDetailSubmit = async (e) => {
    e.preventDefault()
    const {formNm,appDesc, ...data} = formData
    const {apiId,  ...addData} = data
    const addObj = {
      apiId: "SUA00266",
      mst: {
        ...addData,

      }
    }

    const editObj = {
      apiId: "SUA00254",
      mst: {
        ...data,
      }
    }
   

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00115/saveDataMst/00', addObj, { headers }).then(res => {

        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          setSaveButton({
            ...saveButton, apiDtl: true
          })
        }
        setFormData({
          ...formData,
          apiId: res.data?.content?.mst?.apiId

        })

        

      }).catch(error => {
      }).finally(() => {
        set_viewMsg(true)
    });

    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00115/editDataMst/00', editObj, { headers }).then(res => {
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })


      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 3)
      set_open(true)
        // await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00115/saveDelete', deleteObj, { headers }).then(res => {
        //   if (!res?.data?.appMsgList?.errorStatus) {
        //     fetchData()

        //   }
        //   setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        //   setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        //   set_errExp({ status: res.data?.appMsgList?.errorStatus })
        //   if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000006") {
        //     onClose()
        //   }


        // }).catch(error => {
        //   console.log("error")
        // });

  };


  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "SUA00269",
      mst: {
        apiId: formData.apiId
      }
    }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00115/saveDelete', deleteObj, { headers }).then(res => {
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000006") {
          onClose()
        }


      }).catch(error => {
        console.log("error")
      }).finally(() => {
          set_viewMsg(true)
      });
  }

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
        return "Submit"
        break;
      case 2:
        return "Submit"
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

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
      set_viewMsg(false)

  }, [viewMsg])


  return (
    <div>
      <div className="container" >
      {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

        <h4 className="card-title">
          API Master  {getFormTitle(mode)}
        </h4>

        <div className="col-lg-12 col-md-12">
          <form onSubmit={apiDetailSubmit} className="form-horizontal py-3 container">
            <div className="row">
              <div className="col-lg-6 col-md-12">

              <div className="row mb-4">
                  <label className="col-md-3 form-label">API Category:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <div className="input-group">
                      {/* <span className="input-group-text rounded-circle border border-primary">

                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ color: "blue" }}
                          onClick={() => setShowModelApiCat(true)}
                        />
                      </span> */}
                      {(mode===1 || mode===2)&&<span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={() => setShowModelApiCat(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control col-md-3 rouned"
                        //value={getApiCatCd(selectRowApiCat)? getApiCatCd(selectRowApiCat): "" }
                        name="apiCatCd"
                        value={formData?.apiCatCd}
                        required
                        disabled={mode===3||mode===4}

                      />
                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control mx-2"
                        //value={getApiCatName(selectRowApiCat)? getApiCatName(selectRowApiCat): "" }
                        name="apiCatNm"
                       value={openPageData ? 
                        openPageData?.apiCatNm ? openPageData.apiCatNm : getApiCatName(selectRowApiCat)
                        : getApiCatName(selectRowApiCat)}
                       //value={formData?.apiCatNm}
                       disabled={mode===3||mode===4}
                       required
                       

                      />
                      <div className="row-mb-12">
                        {showModelApiCat && <Lov
                          moduleLovData={apiCatLovData}
                          setShowModel={setShowModelApiCat}
                          showModel={showModelApiCat}
                          handleRowClick={handleRowClickApiCat}
                          columns={apiCategoryLovColumns}
                          currentSelection={selectRowApiCat}
                          setCurrentSelection={setSelectRowApiCat}
                        />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <label className="col-md-3 form-label">
                    API Type:
                  </label>
                  <div className="col-md-8">
                    <select
                        className="form-select col-md-12"
                        name="apiTyp"
                        disabled={mode===3||mode===4}
                        onChange={handleStatusChange}
                        value={(formData.apiTyp)}
                        placeholder="Select"
                      >
                       <option>--Select--</option>

{
    (defaultData?.ddApiTyp?.map((item)=>(
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
                </div>
                <div className="row mb-4">
                  <label className="col-md-3 form-label">API URL:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter URL"
                      disabled={mode===3||mode===4}
                      value={formData?.apiUrl}
                      onChange={handleInputChange}
                      name="apiUrl"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-md-3 form-label">
                    API Method Name:
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      value={formData?.apiMethodNm}
                      onChange={handleInputChange}
                      name="apiMethodNm"
                      className="form-control"
                      disabled={mode===3||mode===4}
                      placeholder="Methodes Name Here"
                    />
                  </div>
                </div>


                <div className="row mb-4">
                  <label className="col-md-3 form-label">APP:</label>
                  <div className="col-md-8">
                    <div className="input-group">
                      {/* <span className="input-group-text rounded-circle border border-primary">

                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ color: "blue" }}
                          onClick={() => setShowModelApiCat(true)}
                        />
                      </span> */}
                      {(mode===1||mode===2)&&<span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={() => setShowModelApp(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control col-md-3 rouned"
                        //value={getApiCatCd(selectRowApiCat)? getApiCatCd(selectRowApiCat): "" }
                        name="appCd"
                        value={formData?.appId}
                        // required
                        disabled={mode===3||mode===4}

                      />
                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control mx-2"
                        //value={getApiCatName(selectRowApiCat)? getApiCatName(selectRowApiCat): "" }
                        name="appNm"
                       value={openPageData ? 
                        openPageData?.appDesc ? openPageData.appDesc : getAppName(selectRowApp)
                        : getAppName(selectRowApp)}
                       //value={formData?.apiCatNm}
                       disabled={mode===3||mode===4}
                      //  required
                       

                      />
                      <div className="row-mb-12">
                        {showModelApp && <Lov
                          moduleLovData={appLovData}
                          setShowModel={setShowModelApp}
                          showModel={showModelApp}
                          handleRowClick={handleRowClickApp}
                          columns={appLovColumns}
                          currentSelection={selectRowApp}
                          setCurrentSelection={setSelectRowApp}
                        />}
                      </div>
                    </div>
                  </div>
                </div>


                
                <div className=" row mb-4">
                  <label className="col-md-3 form-label">
                    Status
                  </label>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group ">

                      <div className="custom-controls-stacked">
                      <select
                        className="form-select col-md-12"
                        name="actFlg"
                        disabled={mode===3 || mode===4}
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={(formData.actFlg)}
                        placeholder="Select"
                      >
                       <option>--Select--</option>

{
    (defaultData?.ddActFlg?.map((item)=>(
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
                    </div>


                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="row mb-4">
                  <label className="col-md-3 form-label">API Name:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <input
                      className="form-control"
                      placeholder="Name Here"
                      type="text"
                      value={formData?.apiNm}
                      name={"apiNm"}
                      onChange={handleInputChange}
                      required
                      disabled={mode===3||mode===4}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <label className="col-md-3 form-label">
                    API Description:<span className="text-red">*</span>
                  </label>
                  <div className="col-md-8">
                    <textarea
                      className="form-control"
                      rows={2}
                      defaultValue={"Write Description Here....."}
                      value={formData?.apiDesc}
                      name={"apiDesc"}
                      onChange={handleInputChange}
                      required
                      disabled={mode===3||mode===4}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <label className="col-md-3 form-label">Module:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <div className="input-group">
                      {/* <span className="input-group-text rounded-circle border border-primary">

                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ color: "blue" }}
                          onClick={() => setShowModel(true)}
                        />
                      </span> */}
                      {(mode===1||mode===2)&&<span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={()=> setShowModel(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete="false"
                        //className="form-control mx-2"
                        className="form-control col-md-3 rouned"
                        name="modId"
                        value={formData.modId}
                        disabled={mode===3||mode===4}
                        required

                      />
                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control mx-2"
                        name="modNm"
                        value={openPageData ? 
                          openPageData?.modNm ? openPageData.modNm : getModuleName(selectRow)
                          :
                           getModuleName(selectRow)}
                           disabled={mode===3||mode===4}
                           required
                      
                        
                        
                      />
                      <div className="row-mb-12">
                        {showModel && <Lov
                          moduleLovData={moduleLovData}
                          setShowModel={setShowModel}
                          showModel={showModel}
                          handleRowClick={handleRowClick}
                          columns={moduleLovColumns}
                          currentSelection={selectRow}
                          setCurrentSelection={setSelectRow}
                        />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <label className="col-md-3 form-label">Form:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <div className="input-group">
                      {/* <span className="input-group-text rounded-circle border border-primary">

                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ color: "blue" }}
                          onClick={() => setShowModelFormLov(true)}
                        />
                      </span> */}
                      {(mode===1||mode===2)&&<span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={() => setShowModelFormLov(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control col-md-3 rouned"
                        name="formId"
                        value={formData.formId}
                        disabled={mode===3||mode===4}
                        

                      />
                      <input
                        type="text"
                        autoComplete="false"
                        className="form-control mx-2"
                        name="formNm"
                      //  value={openPageData ? 
                      //   openPageData?.formNm ? openPageData.formNm : getFormName(selectRowFormLov)
                      //   : 
                      //   getFormName(selectRowFormLov)}
                      value={formData.formNm}
                      disabled={mode===3||mode===4}
                        
                       
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

                <div className=" row mb-4">
                  <label className="col-md-3 form-label">
                    API Request Check Flag
                  </label>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group ">

                      <div className="custom-controls-stacked">
                        <label className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            name="apiReqChkFlg"
                            defaultValue='Y'
                            // defaultChecked='true'
                            checked={formData.apiReqChkFlg === 'Y'}
                            value='Y' onChange={handleStatusChange}
                          disabled={mode===3 || mode===4}
                          />
                          <span className="custom-control-label">Yes</span>
                        </label>
                        <label className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            name="apiReqChkFlg"
                            checked={formData.apiReqChkFlg === 'N'}
                            value='N' onChange={handleStatusChange}
                          disabled={mode===3 || mode===4}
                          />
                          <span className="custom-control-label">No</span>
                        </label>

                      </div>
                    </div>
                  </div>
                </div>

                <div className=" row mb-4">
                  <label className="col-md-3 form-label">
                    Api Response Check Flag
                  </label>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group ">

                      <div className="custom-controls-stacked">
                        <label className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            name="apiResChkFlg"
                            defaultValue='Y'
                            // defaultChecked='true'
                            checked={formData.apiResChkFlg === 'Y'}
                            value='Y' onChange={handleStatusChange}
                          disabled={mode===3 || mode===4}
                          />
                          <span className="custom-control-label">Yes</span>
                        </label>
                        <label className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            name="apiResChkFlg"
                            checked={formData.apiResChkFlg === 'N'}
                            value='N' onChange={handleStatusChange}
                          disabled={mode===3 || mode===4}
                          />
                          <span className="custom-control-label">No</span>
                        </label>

                      </div>
                    </div>


                  </div>
                </div>
                
              </div>
            </div>
{(mode===1||mode===2)&&<Button disabled={saveButton.apiDtl || delStatus} type="submit" variant="primary">Save</Button>}          </form>

          <div className="card border-bottom">
            <div className="card-header bg-dark"></div>



            <div className="card-body">

              <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      <h4>API Request Structure</h4>
                    </button>
                  </h2>
                  <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                      <form  onSubmit={submitStruc}>
                        <div className="col-lg-12 col-md-12">
                      {mode === 1 && <JSONInput
                        id='a_unique_id'
                        //colors      = { darktheme }
                        locale={locale}
                        height='550px'
                        width="100%"
                        onChange={(obj) => { setApiReqStruc(obj) }}
                        
                      />}
                      {mode !== 1  &&
                        <JSONInput
                          id='a_unique_id'
                          //colors      = { darktheme }
                          locale={locale}
                          height='550px'
                          width="100%"
                          onChange={(obj) => { setApiReqStruc(obj) }}
                        //placeholder={editFormData.apiReqStruc ? JSON.parse(editFormData.apiReqStruc):null}
                        placeholder={apiReqStruc?.jsObject ? apiReqStruc?.jsObject : null }
                        // placeholder={JSON.parse("{\"apiId\":\"SUA00011\",\"mst\":{\"apiId\":\"FTA00017\",\"apiNm\":\"test api from home1edit\",\"apiDesc\":\"test api from home1edit\",\"apiCatCd\":\"C0001\",\"apiTyp\":\"P\",\"modId\":\"M0003\",\"formId\":\"FTF00003\",\"apiMethodNm\":\" post\",\"totReqRow\":0,\"totResRow\":0,\"apiUrl\":\"/testurl/\",\"actFlg\":\"A\"}}")}
                        />
                      }
                      <div className="justify-content-end">
                      {mode !== 3 && mode !==4 &&  <Button disabled={saveButton.apiReqStruc} type="submit" variant="primary" style={{ margin:"20px auto", display:"block"}} >Save</Button>}
                     </div>
                      </div>
                      </form>
                   
                    </div>
                  </div>
                </div>
                
                <div class="accordion-item">
                  <h2 class="accordion-header" id="flush-headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                      <h4>API Response Structure</h4>
                    </button>
                  </h2>
                  <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                      <form onSubmit={submitResStruc}>
                        <div className="col-lg-12 col-md-12">
                        {mode === 1 && <JSONInput
                        id='a_unique_id'
                        //colors      = { darktheme }
                        locale={locale}
                        height='550px'
                        width="100%"
                        onChange={(obj) => { setApiResStruc(obj) }}                        
                      />}

                        {mode !== 1  &&
                        <JSONInput
                          id='a_unique_id'
                          //colors      = { darktheme }
                          locale={locale}
                          height='550px'
                          width="100%"
                          onChange={(obj) => { setApiResStruc(obj) }}
                        //placeholder={editFormData.apiResStruc ? JSON.parse(editFormData.apiResStruc):null}
                        placeholder={apiResStruc?.jsObject ? apiResStruc?.jsObject : null}
                        />
                      }
                        </div>
                        <div className="justify-content-end">
                        {mode !== 3 && mode !==4 && <Button disabled={saveButton.apiResStruc} type="submit" variant="primary" style={{ margin:"20px auto", display:"block"}} >Save</Button>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* {mode === 2  && <div class="accordion-item">
                  <h2 class="accordion-header" id="flush-headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                      <h4>API Form Mapping</h4>
                    </button>
                  </h2>
                  <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                      <ApiFormMapping />
                    </div>
                  </div>
                </div>} */}
                {/* <div class="accordion-item">
                  <h2 class="accordion-header" id="flush-headingFour">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                      <h4>API Test Case</h4>
                    </button>
                  </h2>
                  <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">

                      <JsonEditorViewer />

                    </div>
                  </div>
                </div> */}
              </div>
            </div>



            <br></br>
          </div>

          {/*   <div className="row mb-4 d-flex justify-content-center ">
                  <button className="btn btn-secondary col-md-1 " type="submit">
                    Save
                  </button>
                </div> */}

        </div>
      </div>
      {/* </ModalBody> */}
      <ModalFooter className="justify-content-end">
      {mode === 3 && <Button  type="submit" onClick={apiDetailSubmit} className='btn btn-primary'>{buttonTitle(mode)}</Button>}
      {/* {mode === 1 || mode === 2  && <Button  type="submit" onClick={onClose} className='btn btn-primary'>{buttonTitle(mode)}</Button>} */}
    {/* {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="reset"
                //onClick="resetForm"
                onClick={(e)=>resetForm()}
              >
                Reset
              </button>} */}
        {/* <Button variant="primary" onClick={submitStruc}>Sumbit</Button> */}
        {/* <Button variant="secondary" onClick={onClose}>
          Close
        </Button> */}
      </ModalFooter>
      {/* </Modal> */}
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

export default ApiMasterForm;

