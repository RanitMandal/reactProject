import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { modLovColumns } from "./columns";
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-router-dom";
import Smalltag from "../../common/SmallTag/smalltag";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import fileDownload from 'js-file-download'
import { Delete, Download, Edit } from "@mui/icons-material";


const NewsEntryForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content?.qryRsltSet);
      // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      console.log(data);
    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(edtVal)

//set default date
const getFormattedTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (`0${today.getMonth() + 1}`).slice(-2);
  const day = (`0${today.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};
const [date, setDate] = useState(getFormattedTodayDate());
//set default date end

  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log("edtVal",edtVal);
   if (mode===1) {
    setFormData({
      "fileId": "",
      "fileNm": "",
      "filePath": "",
      "fileSz": 0,
      "fileTyp": "",
      "flUpldLogNo": "",
      "lvlRefCd": "",
      refNewsNo:"",
      "newsBlinkFlg": "N",
      "newsBoldFlg": "N",
      "newsColor": "",
      "newsDispFrDt": date,
      "newsDispFrTm": "",
      "newsDispMode": "V",
      "newsDispOrder": 0,
      "newsDispTyp": "N",
      "newsDispUptoDt": "",
      "newsDispUptoTm": "",
      "newsEntryMode": "U",
      "newsFont": "",
      "newsFontSz": "",
      "newsItalicFlg": "N",
      "newsScrollTyp": "N",
      "newsText": "",
      "newsTitle": "",
      "newsTyp": "",
      "newsUrl": "",
      "refNewsNo": "",
      "specLocFlg": "N",
      "specUsrFlg": "N",
      "fileUrl": ""
    })
      
    } else {
      setFormData({
      "fileId":edtVal ? edtVal.fileId : '',
      "fileNm": edtVal ? edtVal.fileNm : '',
      "filePath": edtVal ? edtVal.filePath : '',
      "fileSz": edtVal ? edtVal.fileSz : '',
      "fileTyp": edtVal ? edtVal.fileTyp : '',
      "flUpldLogNo":edtVal ? edtVal.flUpldLogNo : '',
      "lvlRefCd": edtVal ? edtVal.lvlRefCd : '',
      refNewsNo:edtVal ? edtVal.refNewsNo:"",
      "newsBlinkFlg": edtVal ? edtVal.newsBlinkFlg : '',
      "newsBoldFlg": edtVal ? edtVal.newsBoldFlg : '',
      "newsColor":edtVal ? edtVal.newsColor : '',
      "newsDispFrDt": edtVal ? edtVal.newsDispFrDt : '',
      "newsDispFrTm": edtVal ? edtVal.newsDispFrTm : '',
      "newsDispMode":edtVal ? edtVal.newsDispMode : '',
      "newsDispOrder": edtVal ? edtVal.newsDispOrder : '',
      "newsDispTyp": edtVal ? edtVal.newsDispTyp : '',
      "newsDispUptoDt": edtVal ? edtVal.newsDispUptoDt : '',
      "newsDispUptoTm": edtVal ? edtVal.newsDispUptoTm : '',
      "newsEntryMode": edtVal ? edtVal.newsEntryMode : '',
      "newsFont": edtVal ? edtVal.newsFont : '',
      "newsFontSz":edtVal ? edtVal.newsFontSz : '',
      "newsItalicFlg":edtVal ? edtVal.newsItalicFlg : '',
      "newsScrollTyp":edtVal ? edtVal.newsScrollTyp : '',
      "newsText":edtVal ? edtVal.newsText : '',
      "newsTitle": edtVal ? edtVal.newsTitle : '',
      "newsTyp": edtVal ? edtVal.newsTyp : '',
      "newsUrl": (edtVal && edtVal?.newsUrl) ? edtVal?.newsUrl : '',
      "newsNo":edtVal ? edtVal.newsNo : '',
      "specLocFlg": edtVal ? edtVal.specLocFlg : '',
      "specUsrFlg": edtVal ? edtVal.specUsrFlg : '',
      //"url": edtVal ? edtVal.url : '',
      })
      if(edtVal.flUpldLogNo && edtVal.filePath){
      set_doc([{ 
        "fileId":edtVal ? edtVal.fileId : '',
      "fileNm": edtVal ? edtVal.fileNm : '',
      "filePath": edtVal ? edtVal.filePath : '',
      "fileSz": edtVal ? edtVal.fileSz : '',
      "fileTyp": edtVal ? edtVal.fileTyp : '',
      "flUpldLogNo":edtVal ? edtVal.flUpldLogNo : '',
      "fileUri": edtVal ? edtVal.fileUrl : '',
       
      }])
    }
      
    }
    console.log("formData",doc);
  }, [mode, edtVal])
  
  console.log("formData",formData);
  // const [formData, setFormData] = useState({})

 

 



  const [showCharacterCount, setShowCharacterCount] = useState(false);

 


 


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
    setFormData({
      "fileId": "",
      "fileNm": "",
      "filePath": "",
      "fileSz": 0,
      "fileTyp": "",
      "flUpldLogNo": "",
      "lvlRefCd": "",
      refNewsNo:"",
      "newsBlinkFlg": "N",
      "newsBoldFlg": "N",
      "newsColor": "",
      "newsDispFrDt": "",
      "newsDispFrTm": "",
      "newsDispMode": "V",
      "newsDispOrder": 0,
      "newsDispTyp": "N",
      "newsDispUptoDt": "",
      "newsDispUptoTm": "",
      "newsEntryMode": "U",
      "newsFont": "",
      "newsFontSz": "",
      "newsItalicFlg": "N",
      "newsScrollTyp": "N",
      "newsText": "",
      "newsTitle": "",
      "newsTyp": "",
      "newsUrl": "",
      "refNewsNo": "",
      "specLocFlg": "",
      "specUsrFlg": "",
      "fileUrl": ""
    })
    set_doc([])

  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }
  const handle_confirmation = async (obj)=>{
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
     obj, 
    { headers })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowDivLov);

    const addObj = {
      "apiId": "SUA00476",
      "mst": {
        "fileCat": "C0001",
        "fileId": doc[0]?.fileId || "",
        "fileNm":  doc[0]?.fileNm|| "",
        "filePath":  doc[0]?.filePath|| "",
        "fileSz": doc[0]?.fileSz ? doc[0].fileSz : 0,
        "fileTyp":  doc[0]?.fileTyp|| "",
        "flUpldLogNo":  doc[0]?.flUpldLogNo|| "",
        "lvlRefCd": sessionStorage.getItem('lvlRefCd') || "",
        refNewsNo: formData?.refNewsNo,
        "newsBlinkFlg": formData?.newsBlinkFlg,
        "newsBoldFlg":  formData?.newsBoldFlg,
        "newsColor":  formData?.newsColor,
        "newsDispFrDt":  formData?.newsDispFrDt,
        "newsDispFrTm":  formData?.newsDispFrTm,
        "newsDispMode":  formData?.newsDispMode,
        "newsDispOrder":formData?.newsDispOrder ?  parseInt(formData?.newsDispOrder) : 0,
        "newsDispTyp": formData?.newsDispTyp,
        "newsDispUptoDt":  formData?.newsDispUptoDt,
        "newsDispUptoTm":  formData?.newsDispUptoTm,
        "newsEntryMode":  formData?.newsEntryMode,
        "newsFont":  formData?.newsFont,
        "newsFontSz":  formData?.newsFontSz,
        "newsItalicFlg":  formData?.newsItalicFlg,
        "newsScrollTyp":  formData?.newsScrollTyp,
        "newsText":  formData?.newsText,
        "newsTitle": formData?.newsTitle,
        "newsTyp":  formData?.newsTyp,
        "newsUrl":  formData?.newsUrl,
        "newsNo":  formData?.newsNo,
        "specLocFlg":  formData?.specLocFlg,
        "specUsrFlg":  formData?.specUsrFlg,
        "fileUrl":  doc[0]?.fileUri || "",
      }
      
    }

    const editObj = {
      "apiId": "SUA00479",
      "mst": {
        "actFlg": "A",
        "fileId": doc[0]?.fileId||"",
        "fileNm": doc[0]?.fileNm||"",
        "filePath": doc[0]?.filePath||"",
        "fileSz": doc[0]?.fileSz||0,
        "fileTyp": doc[0]?.fileTyp||"",
        "fileUrl": doc[0]?.fileUri||"",
        "flUpldLogNo":doc[0]?.flUpldLogNo||"",
        "lvlRefCd": formData?.lvlRefCd,
        refNewsNo: formData?.refNewsNo,
        "newsBlinkFlg": formData?.newsBlinkFlg,
        "newsBoldFlg": formData?.newsBoldFlg,
        "newsColor": formData?.newsColor,
        "newsDispFrDt": formData?.newsDispFrDt,
        "newsDispFrTm": formData?.newsDispFrTm,
        "newsDispMode":formData?.newsDispMode,
        "newsDispOrder": parseInt(formData?.newsDispOrder),
        "newsDispTyp": formData?.newsDispTyp,
        "newsDispUptoDt": formData?.newsDispUptoDt,
        "newsDispUptoTm": formData?.newsDispUptoTm,
        "newsEntryMode": formData?.newsEntryMode,
        "newsFont": formData?.newsFont,
        "newsFontSz": formData?.newsFontSz,
        "newsItalicFlg": formData?.newsItalicFlg,
        "newsNo":formData?.newsNo,
        "newsScrollTyp": formData?.newsScrollTyp,
        "newsText": formData?.newsText,
        "newsTitle": formData?.newsTitle,
        "newsTyp":formData?.newsTyp,
        "newsUrl": formData?.newsUrl,
        "refNewsNo":formData?.refNewsNo,
        "specLocFlg": formData?.specLocFlg,
        "specUsrFlg": formData?.specUsrFlg,
      }
    }
    const deleteObj = {
      "apiId": "SUA00478",
      "mst": {
        "newsNo": rowData?.newsNo
      }
    }

   
    if (mode === 1)
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/saveAdd', addObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
        fetchData()
      }
      console.log("res|||||||||",res);
      const conf_obj = {
        "apiId": "SUA00487",
        "mst": [{
          "colNm": res.data?.content?.mst?.colNm,
          "flUpldLogNo": doc[0]?.flUpldLogNo ||"",
          "keyStr": res.data?.content?.mst?.keyStr,
          "keyStrVal": res.data?.content?.mst?.keyStrVal,
          "tabNm": res.data?.content?.mst?.tabNm
        }]
      }
      if(res?.data?.appMsgList?.errorStatus === false)
    (doc[0]?.flUpldLogNo && handle_confirmation(conf_obj).then((res)=>{
        if(res?.data?.appMsgList?.errorStatus === true){
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                   setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                  set_errExp({status:res.data?.appMsgList?.errorStatus})
                    
        }
      }))
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({status:res.data?.appMsgList?.errorStatus})
      if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
          resetForm();
      }
      

    }).catch(error => {
      console.log("error")
    }).finally(() => {
      set_viewMsg(true)
  });


  if (mode === 2)
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/saveEdit', editObj, { headers }).then(res => {
    console.log(res.data)
    if (!res?.data?.appMsgList?.errorStatus) {
      //TRUE OPERATION
      fetchData()

    }
    const conf_obj = {
      "apiId": "SUA00487",
      "mst": [{
        "colNm": res.data?.content?.mst?.colNm,
        "flUpldLogNo": doc[0]?.flUpldLogNo,
        "keyStr": res.data?.content?.mst?.keyStr,
        "keyStrVal": res.data?.content?.mst?.keyStrVal,
        "tabNm": res.data?.content?.mst?.tabNm
      }]
    }
    if(res?.data?.appMsgList?.errorStatus === false)
    (doc[0]?.flUpldLogNo && handle_confirmation(conf_obj).then((res)=>{
        if(res?.data?.appMsgList?.errorStatus === true){
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                  setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                  set_errExp({status:res.data?.appMsgList?.errorStatus})
                    
        }
      }))
 
    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)


   
    

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
      "apiId": "SUA00478",
      "mst": {
        "newsNo": rowData?.newsNo
      }
    }
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00131/saveDelete', deleteObj, { headers }).then(res => {
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
    }}

    

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        modNm: false,
        modPrefix:false,
        img:false,
        imgNm: false,
        helppath: false,
        // Add more fields here as needed
      });
    
      // Function to toggle character count visibility for a field
      const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
          ...prevState,
          [fieldName]: !prevState[fieldName],
        }));
      };


      //fil handeling start
      const [close, set_close] = useState(mode !== 1 ? true : false)
      const handle_fileClear = ()=>{
        set_close(false)
      }
      const handle_fileChange = async (e)=>{
        const {files} = e.target;
  
        set_close(true)
      }
  
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
      const uploadFiles = async (e) => {
        if(mode > 2) return 
  
        const { files } = e.target;
        const refApiId = mode === 1 ? "SUA00476" : "SUA00479"
        let fileArr = [];
    
        for (let i = 0; i < files.length; i++) {
          let formData = new FormData();
          if (files[i].size > 1000 * 1000 * 1) {
            set_fileErr_msg("File size exceded : 25mb")
            break;
          }else{
            set_fileErr_msg("")
          }
          formData.append("vfile", files[i]);
          
    //"http://192.168.0.44/SuV4Sa/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00499" + "&appId=" + "" + "&mobRegNo=" + ""+"&fileCatCd=" + "C0001",
          await axios
            .post(
              process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + refApiId + "&appId=" + "" + "&mobRegNo=" + ""+"&fileCatCd=" + "C0001",
              formData, {headers}
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
              else{
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({status:res.data?.appMsgList?.errorStatus})
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });
        }
    
        set_doc([...doc, ...fileArr]);
      };
      const download_file = async(e, i)=>{
        const obj = {
          apiId: "SUA00488",
          mst: {
            fileId: doc[i]?.fileId,
            fileNm: doc[i]?.fileNm
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
        await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",obj, {
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
              const extention = tempArr[tempArr?.length-1] || "pdf"
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute(
                'download', doc[i]?.fileId+"."+extention
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
        let obj={
          apiId: "SUA00489",
          mst: [{
            flUpldLogNo: doc[i]?.flUpldLogNo
          }]
        }
        console.log("yyyyyyyy", doc[i]);
        if 
        (window.confirm("Are you sure? File cannot be recover once deleted !"))
          await axios
            .post(
              process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/forceFileDeletion" ,
              obj, {headers}
              // formData
            )
            .then((res) => {
              if (res?.data?.appMsgList?.errorStatus === false) {
                set_doc(doc.filter((item, index) => index !== i));
              }
              else {
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });
      };

      
  return (
    <div>
      <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
        <h4 className="card-title">
        News Entry(Private) {getFormTitle(mode)}
                </h4>
        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
       {/* News No*/}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>News No:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="newsNo" type="text" readOnly value={formData?.newsNo}/>
        </div>
        </div>
        
          {/*Reference News No*/}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Reference News No:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="refNewsNo" type="text" value={formData?.refNewsNo} onChange={handleInputChange} disabled={mode === 3 || mode === 4}/>
        </div>
        </div>

        {/* News Typ */}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            News Type:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newsTyp"
                disabled={mode === 3 || mode === 4}
                required
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsTyp}

              >
                <option value="">---Select---</option>
                

                {(mode === 1) ?
                  (addVal?.ddNewsTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        {/* <label className="col-md-3 form-label"><b>News Date:<span className="text-red">*</span></b></label>
        <div className="col-md-3">
            <input className="form-control" required name="newsDispFrDt" type="date" value={formData?.newsDispFrDt} onChange={handleInputChange}/>
        </div> */}
        </div>
              {/* Reference No
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Reference No:<span className="text-red">*</span></b></label>
        <div className="col-md-9">
            <input className="form-control" name="" required type="text" />
        </div>
        </div> */}
  {/* title  */}
<div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Title:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="newsTitle" type="text" value={formData?.newsTitle} onChange={handleInputChange}   disabled={mode === 3 || mode === 4}/>
        </div>
        </div>
        {/* desCription  */}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Description:<span className="text-red">*</span></b></label>
        <div className="col-md-9">
            <textarea className="form-control" 
            name="newsText" 
            value={formData?.newsText}
            type="text"
            required
            disabled={mode === 3 || mode === 4}
            onChange={handleInputChange}
            maxLength={1000} 
            onFocus={() => toggleCharCountVisibility("newsText")}
            onBlur={() => toggleCharCountVisibility("newsText")}
            />
           {/*  {fieldCharCountVisibility.newsText && (
              <span className="input-group-text">
                {formData?.newsText?.length}/1000
              </span>
            )} */}
        </div>
        </div>
        
        {/* Heading
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Heading:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="" type="text" />
        </div>
        </div> */}

        

        {/* URL */}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>URL:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="newsUrl" type="text" value={formData?.newsUrl} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
        </div>
        </div>

        {/* Scroll Type */}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            Scroll Type:<span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <select
                className="form-select col-md-12"
                name="newsScrollTyp"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsScrollTyp}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsScrollTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsScrollTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        <label className="col-md-3 form-label"><b>Display Order:<span className="text-red">*</span></b></label>
        <div className="col-md-3">
            <input className="form-control" name="newsDispOrder" type="text" value={formData?.newsDispOrder} onChange={handleInputChange}  required disabled={mode === 3 || mode === 4}/>
        </div>
        </div>

        {/* color */}
<div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Color:</b></label>
        <div className="col-md-3 input-group">
            <input className="form-control custom-color-input custom-color-input1 col-md-4" name="newsColor" type="color" value={formData?.newsColor} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
            <input className="form-control custom-color-input1"  value={formData?.newsColor}  disabled={mode === 3 || mode === 4}/>
            
        </div>
        </div>

          {/* Font */}
<div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Font:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="newsFont" type="text" value={formData?.newsFont} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
        </div>
        </div>

          {/* Font Size */}
<div className="row mb-2 mx-2 ">
        <label className="col-md-3 col-form-label"><b>Font Size:</b></label>
        <div className="col-md-9">
            <input className="form-control" name="newsFontSz" type="text" value={formData?.newsFontSz} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
        </div>
        </div>

         {/* News Bold*/}
         <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            Bold:<span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <select
                className="form-select col-md-12"
                name="newsBoldFlg"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsBoldFlg}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsBoldFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsBoldFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>

            <label className="col-md-3 form-label">
            Italic:<span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <select
                className="form-select col-md-12"
                name="newsItalicFlg"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsItalicFlg}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsItalicFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsItalicFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        </div>


         {/* display start and upto */}

        <div className="row mb-2 mx-2 ">
         <label className="col-md-3 form-label"><b>Display Start Date:<span className="text-red">*</span></b></label>
        <div className="col-md-3">
            <input className="form-control" name="newsDispFrDt" type="date" value={formData?.newsDispFrDt} onChange={handleInputChange} required  disabled={mode === 3 || mode === 4}/>
        </div>
        <label className="col-md-3 form-label">
            Display End Date:
            </label>
            <div className="col-md-3">
            <input className="form-control" name="newsDispUptoDt" type="date" value={formData?.newsDispUptoDt} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
        </div>
       
        </div>

        

        {/* display time */}
         <div className="row mb-2 mx-2 ">
         <label className="col-md-3 form-label"><b>Display Start Time:<span className="text-red">*</span></b></label>
        <div className="col-md-3">
            <input className="form-control" name="newsDispFrTm" type="time" value={formData?.newsDispFrTm} onChange={handleInputChange} required  disabled={mode === 3 || mode === 4}/>
        </div>
        <label className="col-md-3 form-label">
            Display End Time:
            </label>
            <div className="col-md-3">
            <input className="form-control" name="newsDispUptoTm" type="time" value={formData?.newsDispUptoTm} onChange={handleInputChange}  disabled={mode === 3 || mode === 4}/>
        </div>
       
        </div>

        {/* Display Type */}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            Display Type:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newsDispTyp"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsDispTyp}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsDispTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsDispTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        </div>

         {/* Display Mode */}
         <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            Display Mode:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newsDispMode"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsDispMode}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsDispMode?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsDispMode?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        </div>

         {/* News blink */}
         <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
             News Blink:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newsBlinkFlg"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsBlinkFlg}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsBlinkFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsBlinkFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        </div>


         {/* Entry Mode*/}
         <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            News Entry Mode:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newsEntryMode"
                disabled
                required
                
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.newsEntryMode}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddNewsEntryMode?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddNewsEntryMode?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
             </div>

        {/* SPec Loc*/}
        <div className="row mb-2 mx-2 ">
        <label className="col-md-3 form-label">
            Spec Location:<span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <select
                className="form-select col-md-12"
                name="specLocFlg"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.specLocFlg}

              >
                <option value="" disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddSpecLocFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddSpecLocFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>

            <label className="col-md-3 form-label">
            Spec User:<span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <select
                className="form-select col-md-12"
                name="specUsrFlg"
                required
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.specUsrFlg}

              >
                <option value="" disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddSpecUsrFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddSpecUsrFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }
              </select>
            </div>
        </div>

        {/* <input className="form-control" type="file" id="formFile" /> */}
        <div className="row mb-2 mx-2">
             <label className="form-label col-md-3">Attach Document</label>
              <div className="col-md-9">
              
                  {(doc?.length === 0) && <div className="file-upload">
                  <div className="input-name">Choose File</div>
                  <input
                    style={{visibility: (mode===1 || mode ===2)? "visible": "hidden"}}
                    type="file"
                   // required={mode === 1}
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
                  {fileErr_msg && <p style={{color: "red"}}>{fileErr_msg}</p>}
                    
                   {doc.map((file, i) => (
                      <div className="file-div">
                       {(file?.filePath)&&  <Smalltag
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

                        {mode !== 4  && ((file?.filePath)&&
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
       
       
        {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
              {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="button"
                //onClick="resetForm"
                onClick={(e)=>{
                  resetForm();
                  setMsg("");
                  setMsgTyp("");
                }}
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

export default NewsEntryForm;

