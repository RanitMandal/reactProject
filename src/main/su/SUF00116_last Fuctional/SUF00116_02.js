import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { apiCatLovColumns, moduleLovColumns, formLovColumns, apiLovColumns } from "./columns";
import { useNavigate } from "react-router-dom";

const headers = { Authorization: 'Bearer ' + getApiToken() };
//MuiTableCell-root

  // grid Style start
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));
  // grid Style start

const ApiTestCaseForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, editFormData, setEditFormData, defaultData, setDefaultData, openPageData, setOpenPageData, closeval, set_closeval, mstSave, set_mstSave }) => {
const headers = { Authorization: 'Bearer ' + getApiToken() };
console.log("999999999999999",editFormData);
console.log("kkkkk", rowData);

if(mode === 1) openPageData = null;
  const fetchData = async () => {
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00116/getListPageData', queryInputObj, { headers }).then((res) => {
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
  const [reqDtl, setReqDtl]=useState({})
  const [resDtl, setResDtl]=useState({})
  const [formData, setFormData] = useState("");

  useEffect(() => {
    
    setFormData({
      apiId: rowData ? rowData.apiId : "",
      apiNm: rowData ? rowData.apiNm : "",
      apiDesc: rowData ? rowData.apiDesc : "",
      apiCatCd: rowData ? rowData.apiCatCd : "",
      apiCatNm: rowData ? rowData.apiCatNm : "",
      apiTyp: rowData ? rowData.apiTyp : "P",
      modId: rowData ? rowData.modId : "",
      modNm: rowData ? rowData.modNm : "",
      formId: rowData ? rowData.formId : "",
      formNm: rowData ? rowData.formNm : "",
      apiMethodNm: openPageData ? openPageData.apiMethodNm : "",
      totReqRow: 0,
      totResRow: 0,
      apiUrl: rowData ? rowData.apiUrl : "",
      apiReqChkFlg: openPageData ? openPageData.apiReqChkFlg : 'N',
      apiResChkFlg: openPageData ? openPageData.apiResChkFlg : 'N',
      actFlg: rowData ? rowData.actFlg : 'A',
      tstCaseNo: openPageData ? openPageData.tstCaseNo : '',
      tstcaseDesc: openPageData ? openPageData.tstcaseDesc : ''
    })

}, [openPageData, rowData])

const [saveMst, set_saveMSt]= useState({})
useEffect(() => {
  const getReqObj = {
    apiId: "SUA00277",
    criteria: {
      apiId: saveMst?.apiId ? saveMst?.apiId : rowData?.apiId  
    }
  }
  const fetchReq = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getReqDtl", getReqObj, { headers })
      .then((res) => {
        
        setReqDtl({...reqDtl,reqStr:res.data?.content?.requestStructure?.reqStr});
        
      });
  };
  if(mode === 1) fetchReq();
}, [saveMst]);
console.log("pppppp",editFormData);

// getResDtl

useEffect(() => {
  const getResObj = {
    apiId: "SUA00278",
    criteria: {
      apiId: saveMst?.apiId ? saveMst?.apiId : rowData?.apiId  
    }
  }
  const fetchRes = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getResDtl", getResObj, { headers })
      .then((res) => {
        setResDtl({...resDtl,resStr:res.data?.content?.responseStructure?.resStr});
      });
  };
  if(mode === 1) fetchRes();
}, [saveMst]);

const [apiReqStruc, setApiReqStruc] = useState({jsObject: null})
const [apiResStruc, setApiResStruc] = useState({jsObject: null})
let reset = {
  reqObj: null,
  reqJson: "",
  resObj: null,
  resJson: ""
}
const case1 = ()=>{
  let reqStruc = null
  try{
    reqStruc = JSON.parse(editFormData?.apiReqStruc)
  }catch(err){
    console.log(err);
  }
  reset.reqObj = reqStruc
  reset.reqJson = editFormData?.apiReqStruc
  setApiReqStruc(reqStruc? {jsObject: reqStruc, json: editFormData?.apiReqStruc}: {jsObject: null})
}
const case3 = ()=>{
  let resStruc={};
  
  try{
    resStruc = JSON.parse(editFormData?.apiResStruc)
  }catch(err){
    console.log(err);
  }

  reset.resObj = resStruc
  reset.resJson = editFormData?.apiResStruc
  setApiResStruc(resStruc? {jsObject: resStruc, json: editFormData?.apiResStruc}: {jsObject: {}})
}

const [initialReqObj, set_initialReqObj] = useState({})
const case2 = async (type)=>{
  let reqStruc = null;
  let getReqObj ={
    apiId:"SUA00277",
    criteria: {
      apiId: rowData.apiId || formData.apiId
    }
  }
  await axios
    .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getReqDtl", getReqObj, { headers })
    .then((res) => {
      
      try {
        reqStruc = JSON.parse(res?.data?.content?.requestStructure?.reqStr)
        set_initialReqObj(reqStruc)
        reset.reqObj = reqStruc
        reset.reqJson = editFormData?.apiReqStruc
        if(type === 1 ) setApiReqStruc(reqStruc? {jsObject: reqStruc, json: editFormData?.apiReqStruc}: {jsObject: null})
      } catch (error) {
        console.log(error);
      }
      
    });
}
const case4 = async ()=>{
  let resStruc = null;
  let getResObj ={
    apiId:"SUA00278",
    criteria: {
      apiId: rowData.apiId
    }
  }

  await axios
    .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getResDtl", getResObj, { headers })
    .then((res) => {
      
      try {
        resStruc = JSON.parse(res?.data?.content?.responseStructure?.resStr)
        reset.resObj = resStruc
        reset.resJson = editFormData?.apiResStruc
        setApiResStruc(resStruc? {jsObject: resStruc, json: editFormData?.apiResStruc}: {jsObject: null})
      } catch (error) {
        console.log(error);
      }
      
    });
}


useEffect(() => {

  if(mode!==1){

    if(editFormData.apiReqStruc)case1()
    else case2(1)
    

    if(editFormData.apiResStruc)case3()
    else case4()
 
}
if(mode===1){
  let reqStruc = null
  try{
    reqStruc = JSON.parse(reqDtl?.reqStr)
  }catch(err){
    console.log(err);
  }

  setApiReqStruc(reqDtl?.reqStr?  {jsObject: reqStruc, json: reqDtl?.reqStr}: {jsObject: null})
 }
   
 }, [editFormData, reqDtl])

 useEffect(() => {
   if(mode === 1){
    let resStruc=null;
    try{
      resStruc = JSON.parse(resDtl?.resStr)
    }catch(err){
      console.log(err);
    }
    setApiResStruc(resDtl?.resStr?  {jsObject: resStruc, json: resDtl?.resStr}: {jsObject: null})
   }

 }, [resDtl])

 useEffect(() => {
  //intitial req structure for both mode 1 and 2
  case2(2)
}, [])
 

 const handle_resetStruc = ()=>{
  setApiReqStruc({jsObject: reset.reqObj, json: reset.reqJson})
  setApiResStruc({jsObject: reset.resObj, json: reset.resJson})
 }


  const [submitFlg, setSubmitFlg] = useState(false)


  //Api Category Lov Starts

  const [apiCatLovData, setApiCatLovData] = useState([]);

  useEffect(() => {
    const apiCatLovObj = {
      apiId: "SUA00290"
      // mst: {

      // }
    }
    const fetchApiCatLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getAllCatMst", apiCatLovObj, { headers })
        .then((res) => {
          setApiCatLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchApiCatLovData();
  }, []);

  const getApiCatCd = (obj) => {
    return apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatCd ? apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatCd :""
  }

  const getApiCatName = (obj) => {
    return apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatNm ? apiCatLovData[Number(Object.keys(obj)[0])]?.apiCatNm:""
  }

  const [selectRowApiCat, setSelectRowApiCat] = useState({});
  const [showModelApiCat, setShowModelApiCat] = useState(false);
  const handleRowClickApiCat = (rowData) => {
    if(openPageData) openPageData.apiCatNm = null
    setSelectRowApiCat(rowData);
    setSelectRow({})
    setSelectRowFormLov({})
    setSelectRowApiLov({})
    setFormData({
      ...formData,
      apiCatCd: getApiCatCd(rowData),
      modId:"",
      modNm:"",
      formId:"",
      formNm:"",
      apiId:  "",
      apiNm:  "",
      apiDesc:  "",
      apiUrl:""

    })
    setApiLovObj({
      apiId : "SUA00274",
      criteria: {
            ...apiLovObj.criteria,
             apiCatCd: getApiCatCd(rowData)
          }
    
        })
  };

  //Module Lov Starts
  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const modLovObj = {
      apiId: "SUA00273"
      // mst: {

      // }
    }
    const fetchModuleLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getAllModMst", modLovObj, { headers })
        .then((res) => {
          setModuleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchModuleLovData();
  }, []);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm : ""
  }

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId : ""
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
      formNm: "",
      apiId:'',
      apiDesc:"",
      apiNm:"",
      apiUrl:""
    })
    setApiLovObj({
      apiId : "SUA00274",
      criteria: {
            ...apiLovObj.criteria,
             modId: getModuleId(rowData)
          }
    
        })
  };

  //Form Lov Starts
  const [selectRow2, setSelectRow2] = useState("");
  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId : "SUA00275",
      criteria: {
           modId: getModuleId(selectRow)
        }
    }
    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/getFormMstByModMst", formLovObj, { headers })
        .then((res) => {
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    selectRow && fetchFormLovData();
  }, [selectRow]);


  const getFormName = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm ? formLovData[Number(Object.keys(obj)[0])]?.formNm:""
  }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId ? formLovData[Number(Object.keys(obj)[0])]?.formId:""
  }

  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    //openPageData.formNm = null
    setSelectRow2(rowData)
    setSelectRowFormLov(rowData);
    setSelectRowApiLov({})
    setFormData({
      ...formData,
      formId: getFormId(rowData),
      formNm: getFormName(rowData),
      apiId:'',
      apiDesc:"",
      apiNm:"",
      apiUrl:""
    })
    setApiLovObj({
      apiId : "SUA00274",
      criteria: {
            ...apiLovObj.criteria,
             formId: getFormId(rowData)
          }
    
        })
  };
  //Form Lov Ends

// SaveApi Start
  console.log("EditFormData"+editFormData?.apiReqStrucSl);
  const submitStruc = async (e) => {
    e.preventDefault();

    const addReqObj = {
      apiId: "SUA00285",
      mst01:
      {
        
        apiId: formData.apiId,
        reqStr: apiReqStruc.json,
        tstCaseNo: formData?.tstCaseNo
      }
    }

    const editReqObj = {
      apiId: "SUA00271",
      mst01:
      {
        apiId: formData.apiId,
        reqStr: apiReqStruc.json,
        tstCaseNo: formData?.tstCaseNo

      }
    }
   console.log("000000REQ",editFormData);
    if (mode === 1)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/saveDataMst/01", addReqObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
        
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          setSaveButton({
            ...saveButton, apiReqStruc: true
          })
          alert("Request Structure Saved Successfully")
        }
      }
    })

    if (mode === 2 && editFormData.apiReqStrucSl===0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/saveDataMst/01", addReqObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
       
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
        setSaveButton({
          ...saveButton, apiReqStruc: true
        })
        alert("Request Structure Saved Successfully")
      }
        setEditFormData({
          ...editFormData, apiReqStrucSl:(res.data.content.mst01.slNo)
        })
      }
    })

    else if (mode === 2 && editFormData.apiReqStrucSl!==0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/editDataMst/01", editReqObj, { headers }).then((res) => {
      if (res.data) {

        // setSubmitFlg(true)
        
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000005") {
          alert("Request Structure Updated Successfully")
        }
      }
    })

   

  }

  const submitResStruc = async (e) => {
    e.preventDefault();

    const addResObj = {
      apiId: "SUA00286",
      mst02:
      {
       
        apiId: formData.apiId,
        resStr: apiResStruc.json,
        tstCaseNo: formData?.tstCaseNo
      }
    }

    const editResObj = {
      apiId: "SUA00272",
      mst02:
      {
        apiId: formData.apiId,
        resStr: apiResStruc.json,
        tstCaseNo: formData?.tstCaseNo
      }
    }

    if (mode === 1)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/saveDataMst/02", addResObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
       
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
        setSaveButton({
          ...saveButton, apiResStruc: true
        })
        set_submit(true)
        alert("Response Structure Saved Successfully")
      }
      }
    })

    if (mode === 2 && editFormData.apiResStrucSl===0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/saveDataMst/02", addResObj, { headers }).then((res) => {

      if (res.data) {
        // setSubmitFlg(true)
      
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
        setSaveButton({
          ...saveButton, apiResStruc: true
        })
        alert("Response Structure Saved Successfully")
      }
        setEditFormData({
          ...editFormData, apiResStrucSl:(res.data.content.mst02.slNo)
        })
      }
    })

    else if (mode === 2 && editFormData.apiResStrucSl!==0)
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/editDataMst/02", editResObj, { headers }).then((res) => {
      if (res.data) {

        // setSubmitFlg(true)
      
       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
       if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000005") {
        alert("Response Structure Updated Successfully")
      }
      }
    })


  }

  const handleStrSubmit = async (e) =>{
set_closeval(true)
    submitResStruc(e);
    submitStruc(e);
    console.log("iii");
  }
// SaveApi Ends.....

// Test Api Start.......
const url = process.env.REACT_APP_API_URL_PREFIX;
console.log(url);
const [test, setTest]=useState("")

const handleRun = async (e)=>{
  
  // if(apiReqStruc.jsObject)
  
  let prevReqStrc = "{}";
  try {
    prevReqStrc = JSON.stringify(apiReqStruc.jsObject);
  } catch (error) {
    console.log(error);
  }

  if(apiReqStruc.jsObject?.apiId !== formData.apiId){
    if(mode === 2) 
      setEditFormData({...editFormData,
        apiResStruc: JSON.stringify({error: "Invalid Request"}) || "{}",
        apiReqStruc: prevReqStrc})
    if(mode === 1) 
      setApiResStruc({jsObject: {error: "Invalid Request"}, json: JSON.stringify({error: "Invalid Request"}) || "{}"})
      return
  }

  const concatenatedUrl = url +"/" + (formData ? formData.apiUrl : '');
  const apiRunObj = {
    apiId: "SUA00288",
    requestBody: apiReqStruc.json ? apiReqStruc?.json: reqDtl?.reqStr || initialReqObj,
    token: getApiToken(),
    url:concatenatedUrl
  }
  
  await axios
    .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00116/testApi", apiRunObj, { headers })
    .then((res) => {
      if(mode===2){
        setEditFormData({...editFormData,
          apiResStruc: res.data?.content?.responseBody || "{}",
          apiReqStruc: prevReqStrc})
      }
      // console.log("101010101",prevReqStrc, {...editFormData,
      //   apiResStruc: res.data?.content?.responseBody || "{}",
      //   apiReqStruc: prevReqStrc});
      
      if(res.data?.code === "1"){
        setEditFormData({...editFormData,
          apiResStruc: JSON.stringify(res.data) || "{}",
          apiReqStruc: prevReqStrc})
          
      }

      if(mode === 1) setResDtl({resStr:  res.data?.content?.responseBody || "{}"});
      

    });
};




    //Api Lov Starts
    const [apiLovObj, setApiLovObj] =useState( {
      apiId : "SUA00274",
      criteria: {
             formId: "",
             modId: "",
             apiCatCd: ""
          }
    
    })
const [apiLovData, setApiLovData] = useState([]);
useEffect(() => {
 
  const fetchApiLovData = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00116/getApiByFormMstAndModMst", apiLovObj, {headers} )
      .then((res) => {
        console.log(res.data);
        setApiLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
      });
  };

  apiLovObj && fetchApiLovData();
}, [apiLovObj]);


// const getApiName = (obj)=>{
//   return apiLovData[Number(Object.keys(obj)[0])]?.apiNm ? apiLovData[Number(Object.keys(obj)[0])]?.apiNm:""
// }

const getApiId = (obj)=>{
  return apiLovData[Number(Object.keys(obj)[0])]?.apiId ? apiLovData[Number(Object.keys(obj)[0])]?.apiId:""
}
const getApiNm = (obj)=>{
  return apiLovData[Number(Object.keys(obj)[0])]?.apiNm ? apiLovData[Number(Object.keys(obj)[0])]?.apiNm:""
}
const getApiDesc = (obj)=>{
  return apiLovData[Number(Object.keys(obj)[0])]?.apiDesc ? apiLovData[Number(Object.keys(obj)[0])]?.apiDesc:""
}
const getApiUrl = (obj)=>{
  return apiLovData[Number(Object.keys(obj)[0])]?.apiUrl ? apiLovData[Number(Object.keys(obj)[0])]?.apiUrl:""
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
console.log(rowData?.apiNm)
setFormData({
  ...formData,
  apiId: getApiId(rowData),
  apiNm: getApiNm(rowData),
  apiDesc: getApiDesc(rowData),
  apiUrl: getApiUrl(rowData)
}) 
};

//Api Lov Ends

  //const [openAcordian, setOpenAcordian] = useState(2)
  //onClick={()=>setOpenAcordian(4)} class={`accordion-collapse ${openAcordian === 4? "": "collapse"}`}
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };




  const [submit, set_submit]= useState(false)
  const apiDetailSubmit = async (e) => {
    console.log(formData);
    e.preventDefault()
    const {formNm, ...data} = formData
    const {apiId, ...addData} = data
    const addObj = {
      apiId: "SUA00284",
      mst: {
        actFlg: formData.actFlg,
        apiId: formData.apiId,
        tstCaseDesc: formData?.tstcaseDesc

      }
    }

    const editObj = {
      apiId: "SUA00270",
      mst: {
        // actFlg: formData?.actFlg||openPageData?.actFlg,
        apiId: formData?.apiId,
        tstCaseNo: formData?.tstCaseNo,
        tstcaseDesc: formData?.tstcaseDesc
      }
    }
    const deleteObj = {
      apiId: "SUA00287",
      mst: {
        apiId: formData.apiId,
         tstCaseNo: formData?.tstCaseNo,
      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00116/saveDataMst/00', addObj, { headers }).then(res => {

        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
          set_closeval(false)
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          setSaveButton({
            ...saveButton, apiDtl: true
          })
        }
        setFormData({
          ...formData,
          apiId: res.data?.content?.mst?.apiId,
          tstCaseNo:res.data?.content?.mst?.tstCaseNo

        })
        set_saveMSt({
          ...saveMst,
          apiId: res.data?.content?.mst?.apiId,
          tstCaseNo:res.data?.content?.mst?.tstCaseNo

        })
        
        

      }).catch(error => {
      });

    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00116/editDataMst/00', editObj, { headers }).then(res => {
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

      }).catch(error => {
        console.log("error")
      });


    if (mode === 3)
      if (window.confirm("Are you sure? The record will be deleted parmanantly"))
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00116/saveDelete', deleteObj, { headers }).then(res => {
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData()

          }
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000006") {
            onClose()
          }


        }).catch(error => {
          console.log("error")
        });

  };


// getReqDtl





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






  return (
    <div>
      <div className="container" >
        {msg && msgTyp === "AI" && <div className="card">

          <Alert variant="success">
            <span className="alert-inner--icon">
              <i className="fa fa-bell-o me-2" aria-hidden="true"></i></span>&nbsp;
            <strong>{msg}</strong>
          </Alert>

        </div>}
        {msg && msgTyp !== "AI" && <div className="card">

          <Alert variant="danger">
            <span className="alert-inner--icon">
              <i className="fe fe-slash"></i></span>&nbsp;
            <strong>{msg}</strong>
          </Alert>

        </div>}
        <h4 className="card-title">
        API Test Case  {getFormTitle(mode)}
        </h4>

        <div className="col-lg-12 col-md-12">
        <form onSubmit={apiDetailSubmit} className="form-horizontal py-3 container">
            <div className="row">
              <div className="col-lg-6 col-md-12">
              <div className="row mb-4">
                 <label className="col-md-3 form-label">API Category:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <div className="input-group">
                     
                    { (mode===1) && <span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={() => setShowModelApiCat(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control col-md-3 rouned"
                        //value={getApiCatCd(selectRowApiCat)? getApiCatCd(selectRowApiCat): "" }
                        name="apiCatCd"
                        value={formData?.apiCatCd}
                        required
                        disabled={mode===2 || mode===3 || mode===4}

                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        //value={getApiCatName(selectRowApiCat)? getApiCatName(selectRowApiCat): "" }
                        name="apiCatNm"
                       value={formData ? 
                        formData?.apiCatNm ? formData.apiCatNm : getApiCatName(selectRowApiCat)
                        : getApiCatName(selectRowApiCat)}
                       //value={formData?.apiCatNm}
                       disabled={mode===2 || mode===3 || mode===4}
                       required

                      />
                      <div className="row-mb-12">
                        {showModelApiCat && <Lov
                          moduleLovData={apiCatLovData}
                          setShowModel={setShowModelApiCat}
                          showModel={showModelApiCat}
                          handleRowClick={handleRowClickApiCat}
                          columns={apiCatLovColumns}
                          currentSelection={selectRowApiCat}
                          setCurrentSelection={setSelectRowApiCat}
                        />}
                      </div>
                    </div>
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
                      { (mode===1) &&<span className="input-group-text bg-primary">
                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  
                                  onClick={()=> setShowModel(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete={false}
                        //className="form-control mx-2"
                        className="form-control col-md-3 rouned"
                        name="modId"
                        required
                        value={formData.modId}
                        disabled={mode===2 || mode===3 || mode===4}

                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        name="modNm"
                        required
                        disabled={mode===2 || mode===3 || mode===4}
                        value={formData ? 
                          formData?.modNm ? formData.modNm : getModuleName(selectRow)
                          :
                           getModuleName(selectRow)}
                      
                        
                        
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
                     {(mode===1) && <span className="input-group-text bg-primary">
                            
                            <i
                                  className = "fa fa-search d-inline text-white"
                                  
                                  onClick = {() => setShowModelFormLov(true)}
                                />
                              </span>}

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control col-md-3 rouned"
                        name="formId"
                        required
                        value={formData.formId}
                        disabled={mode===2 || mode===3 || mode===4}
                        

                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        name="formNm"
                        required
                      //  value={openPageData ? 
                      //   openPageData?.formNm ? openPageData.formNm : getFormName(selectRowFormLov)
                      //   : 
                      //   getFormName(selectRowFormLov)}
                      value={formData.formNm}
                      disabled={mode===2 || mode===3 || mode===4}
                        
                       
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

 

              <div className="row mb-4">
                  <label className="col-md-3 form-label">API:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <div className="input-group">
                      {/* <span className="input-group-text rounded-circle border border-primary">
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ color: "blue" }}
                          onClick={() => setShowModelApiCat(true)}
                        />
                      </span> */}
                     {(mode===1)&& <span className="input-group-text bg-primary">                            
                            <i
                                  className="fa fa-search d-inline text-white"
                                  onClick={() => setShowModelApiLov(true)}
                            />
                            </span>}
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control col-md-3 rouned"
                        //value={getApiCatCd(selectRowApiCat)? getApiCatCd(selectRowApiCat): "" }
                        name="apiId"
                        value={formData?.apiId}
                        required
                        disabled={mode===2 || mode===3 || mode===4}

                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        //value={getApiCatName(selectRowApiCat)? getApiCatName(selectRowApiCat): "" }
                        name="apiNm"
                      /*  value={openPageData ? 
                        openPageData?.apiNm ? openPageData.apiNm : getApiName(setSelectRowApiLov)
                        : getApiName(setSelectRowApiLov)} */
                       value={formData?.apiNm}
                       disabled={mode===2 || mode===3 || mode===4}
                       

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
               
             

              {/*   <div className="row mb-4">
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
                      placeholder="Methodes Name Here"
                    />
                  </div>
                </div> */}
              {/*   <div className=" row mb-4">
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
                </div> */}
              
              </div>
              <div className="col-lg-6 col-md-12">
            
              {/*   <div className="row mb-4">
                  <label className="col-md-3 form-label">API Name:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.apiNm}
                      name={"apiNm"}
                      //onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div> */}
              
                <div className="row mb-3">
                  <label className="col-md-3 form-label">API URL:<span className="text-red">*</span></label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter URL"
                      value={formData?.apiUrl}
                      onChange={handleInputChange}
                      name="apiUrl"
                      required
                      readOnly
                    />
                  </div>
                </div> 

                <div className="row mb-3">
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
                     // onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div>
               

                {/* <div className=" row mb-4">
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
                </div> */} 

                
                <div className="row mb-3">
                  <label className="col-md-3 form-label">
                    API Type:
                  </label>
                  <div className="col-md-8">
                    <select
                        className="form-select col-md-12"
                        name="apiTyp"
                        onChange={handleStatusChange}
                        value={(formData.apiTyp)}
                        placeholder="Select"
                      >
                       <option disabled>--Select--</option>

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

               
                
              </div>
             
            </div>
            <div className="row">
              <div className="row mb-4">
                  <label className="col-md-2 form-label">Test Case:<span className="text-red">*</span></label>
                  <div className="col-md-10">
                    <div className="input-group">
                     
                    

                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control col-md-3 rouned"
                        //value={getApiCatCd(selectRowApiCat)? getApiCatCd(selectRowApiCat): "" }
                        name="tstCaseNo"
                        value={formData?.tstCaseNo}
                        required
                        disabled

                      />
                      <input
                        type="text"
                        autoComplete={false}
                        className="form-control mx-2"
                        //value={getApiCatName(selectRowApiCat)? getApiCatName(selectRowApiCat): "" }
                        name="tstcaseDesc"
                        required
                       /* value={openPageData ? 
                        openPageData?.apiCatNm ? openPageData.apiCatNm : getApiCatName(selectRowApiCat)
                        : getApiCatName(selectRowApiCat)} */
                       value = {formData?.tstcaseDesc}
                       onChange={handleInputChange}
                        
                       

                      />
                    
                    </div>
                  </div>
                </div>
                <div className=" row mb-4">
                  <label className="col-md-2 form-label">
                    Status
                  </label>
                  <div className="col-md-10 ">
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
                       <option disabled>--Select--</option>

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
            <Button disabled={saveButton.apiDtl} type="submit" variant="primary">Save</Button>
          </form>

          <div className="card border-bottom">
            <div className="card-header bg-dark"></div>
            <div className="">
            <div class="accordion accordion-flush" id="accordionFlushExample">
    <div class="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      <h4>Test Case</h4>
                    </button>
                  </h2>
                  <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    <Grid container spacing={2}>
  <Grid item md={6}>
    <Item>

                      <form  onSubmit={submitStruc}>
                        <div className=" col-md-12">
                      
                      {
                        <JSONInput 
                          id='a_unique_id'
                          //colors      = { darktheme }
                          locale={locale}
                          height='550px'
                          width="100%"
                          onChange={(obj) => { console.log(obj,initialReqObj);;setApiReqStruc({...obj, jsObject: obj.lines !==1 ? obj.jsObject : initialReqObj}) }}
                        placeholder={apiReqStruc.jsObject}
                        // placeholder={JSON.parse("{\"apiId\":\"SUA00011\",\"mst\":{\"apiId\":\"FTA00017\",\"apiNm\":\"test api from home1edit\",\"apiDesc\":\"test api from home1edit\",\"apiCatCd\":\"C0001\",\"apiTyp\":\"P\",\"modId\":\"M0003\",\"formId\":\"FTF00003\",\"apiMethodNm\":\" post\",\"totReqRow\":0,\"totResRow\":0,\"apiUrl\":\"/testurl/\",\"actFlg\":\"A\"}}")}
                        />
                      }
                     {/*  <div className="justify-content-end">
                      {mode !== 3 && mode !==4 &&  <Button disabled={saveButton.apiReqStruc} type="submit" variant="primary" style={{ margin:"20px auto", display:"block"}} >Save</Button>}
                     </div> */}
                      </div>
                      </form>
    </Item>
  </Grid>
  <Grid item md={6}>
    <Item>
    
                      <form onSubmit={submitResStruc}>
                        <div className="col-md-12 ">
                       

                        {
                        <JSONInput
                          id='a_unique_id'
                          //colors      = { darktheme }
                          locale={locale}
                          height='550px'
                          width="100%"
                          onChange={(obj) => { setApiResStruc({...obj, jsObject: obj.lines !==1? obj.jsObject : {}}) }}
                        placeholder={apiResStruc.jsObject}
                        />
                      }
                        </div>
                        {/* <div className="justify-content-end">
                        {mode !== 3 && mode !==4 && <Button disabled={saveButton.apiResStruc} type="submit" variant="primary" style={{ margin:"20px auto", display:"block"}} >Save</Button>}
                        </div> */}
                      </form>

    </Item>
  </Grid>
  
</Grid>
      
                    </div>
                  </div>
                </div>
                </div>

          

            
            </div>



            {/* <br></br> */}
          </div>
          <div className="py-4 gap-2 d-md-block d-grid text-center">
          
{mode !== 3 && mode !==4 && 
 <Button disabled={saveButton.apiReqStruc} type="button" variant="" className="btn btn-outline-secondary mx-1" onClick={handleRun} >

  Run
</Button>}
                      {mode !== 3 && mode !==4 &&  <Button disabled={submit} type="button" className="btn btn-primary " onClick={handleStrSubmit} >Submit</Button>}
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
    </div>
  );
};

export default ApiTestCaseForm;

