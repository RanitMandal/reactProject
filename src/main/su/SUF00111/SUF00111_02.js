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
import { Delete, Download, Edit } from "@mui/icons-material";
import Smalltag from "../../common/SmallTag/smalltag";
import fileDownload from 'js-file-download'
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

const UpldDocumentsForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const [uploadDt, setuploadDt] = useState('');

  useEffect(() => {
    if (mode === 1) {
      const tempDate = new Date().toJSON().slice(0, 10);
      // const year = tempDate.getFullYear();
      // const month = String(tempDate.getMonth() + 1).padStart(2, '0'); // Zero-padding month
      // const day = String(tempDate.getDate()).padStart(2, '0'); // Zero-padding day
      // const date = `${year}-${month}-${day}`;
      setuploadDt(tempDate);
    } else {
      let uploadDt = getDateFormart_yyyymmdd(rowData?.uploadDt)
      setuploadDt(uploadDt)
    }
  }, [mode]);
  console.log(uploadDt);


  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/getListPageData', queryInputObj, { headers }).then((res) => {
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
  // useEffect(() => {
  //   if(mode===1)
  //   setEdtVal({})
  // }, [mode])


  // Date converting ddmmyyyy to yyyymmdd for view
  const getDateFormart_yyyymmdd = (ddmmyyyy) => {
    console.log(ddmmyyyy);


    if (ddmmyyyy) {
      const day = ddmmyyyy.slice(0, 2)
      const month = ddmmyyyy.slice(3, 5)
      const year = ddmmyyyy.slice(6, 10)
      console.log(`${year}-${month}-${day}`);
      return `${year}-${month}-${day}`
    } else return ""
  }




  // var tempDate = new Date();
  //   var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();
  //   const currDate = date;
  // console.log(currDate);



  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log("edtVal", edtVal);
    if (mode === 1) {
      setFormData({
        docId: '',
        docNm: '',
        modId: '',
        dispOrder: 0,
        uploadDt: uploadDt,
        newDoc: "N",
        actFlg: 'A',
      })

    } else {
      setFormData({
        docId: edtVal ? edtVal.docId : '',
        docNm: edtVal ? edtVal.docNm : '',
        modId: edtVal ? edtVal.modId : '',
        modNm: edtVal ? edtVal.modNm : '',
        dispOrder: edtVal ? edtVal.dispOrder : 0,
        uploadDt: uploadDt ? uploadDt : '',
        newDoc: edtVal ? edtVal.newDoc : "",
        actFlg: edtVal ? edtVal.actFlg : 'A',
      })
      set_doc([{
        fileId: edtVal ? edtVal.fileId : "",
        filePath: edtVal ? edtVal.filePath : "",
        fileNm: edtVal ? edtVal.fileNm : "",
        fileTyp: edtVal ? edtVal.fileTyp : "",
        fileSz: edtVal ? edtVal.fileSz : "",
        flUpldLogNo: edtVal ? edtVal.flUpldLogNo : "",
        fileUri: edtVal ? edtVal.fileUrl: ""
      }])

    }
  }, [mode, edtVal, uploadDt])

  console.log("formData", formData);
  // const [formData, setFormData] = useState({})



  const [showCharacterCount, setShowCharacterCount] = useState(false);


  //Mod Lov Starts

  const [modLovData, setModLovData] = useState([]);
  useEffect(() => {

    const modLovObj = {
      apiId: "SUA00140",
      criteria: {

        //   modGrpId: getModGrpId(selectRow)

      }
    }
    console.log(modLovObj)
    const fetchModLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00111/getAllModId", modLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          if (res.data?.content?.qryRsltSet?.length) {
            setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          }
          //   if(res.data?.appMsgList?.errorStatus){
          //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          //   }
        });


    };

    fetchModLovData();
  }, []);


  const getModName = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm : ""
  }

  const getModId = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId : ""
  }


  const [selectRowModLov, setSelectRowModLov] = useState({});
  const [showModelModLov, setShowModelModLov] = useState(false);
  const handleRowClickModLov = (rowData) => {
    setSelectRowModLov(rowData);
    //    setData([])
    setFormData({
      ...formData,
      modId: getModId(rowData),
      modNm: getModName(rowData)
    })
    setMsg("")
    setMsgTyp("")
    set_errExp("")
  };

  //Mod Lov Ends





  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    console.log("handleStatusChange called");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      newDoc: checked ? "Y" : "N"
    })
  }





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
  const [fileToggle, set_fileToggle] = useState(true)
  const resetForm = () => {
    // setSelectRow('')
    // setSelectRowDivLov("")
    // setSelectRowSubDivLov({})
    // // selectRowSubDiv("")
    // // selectRowUser("")
    // setSelectRowUserLov({})
    setFormData({
      docId: '',
      docNm: '',
      modId: '',
      modNm: '',
      dispOrder: 0,
      uploadDt: uploadDt,
      newDoc: "N",
      actFlg: 'A',
    })
    setSelectRowModLov({});
    set_doc([])
    set_fileToggle(!fileToggle)


  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const handle_confirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
      obj,
      { headers })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowDivLov);

    const addObj = {
      "apiId": "SUA00512",
      "mst": {
        dispOrder: parseInt(formData.dispOrder),
        docNm: formData.docNm,
        modId: formData.modId,
        newDoc: formData.newDoc,
        //uploadDt: formData.uploadDt,
        fileId: doc[0].fileId,
        fileNm: doc[0].fileNm,
        filePath: doc[0].filePath,
        fileSz: doc[0].fileSz,
        fileTyp: doc[0].fileTyp,
        flUpldLogNo: doc[0].flUpldLogNo,
        fileUrl: doc[0].fileUri
      }
    }
    console.log("addObj|||||", addObj, formData);

    const editObj = {
      apiId: "SUA00499",
      mst: {
        actFlg: formData.actFlg,
        dispOrder: parseInt(formData.dispOrder),
        docId: formData.docId,
        docNm: formData.docNm,
        fileId: doc[0].fileId,
        fileNm: doc[0].fileNm,
        filePath: doc[0].filePath,
        fileTyp: doc[0].fileTyp,
        fileSz: doc[0].fileSz,
        flUpldLogNo: doc[0].flUpldLogNo,
        modId: formData.modId,
        newDoc: formData.newDoc,
        fileUrl: doc[0].fileUri
      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        console.log("res|||||||||", res);
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/saveEdit', editObj, { headers }).then(res => {
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
      apiId: "SUA00498",
      mst: {
        docId: formData.docId
      }
    }
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00111/saveDelete', deleteObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
        fetchData()

      }
      set_delStatus(true)
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

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

  const [close, set_close] = useState(mode !== 1 ? true : false)
  const handle_fileClear = () => {
    set_close(false)
  }
  const handle_fileChange = async (e) => {
    const { files } = e.target;

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
    if (mode > 2) return

    const { files } = e.target;
    const refApiId = mode === 1 ? "SUA00512" : "SUA00499"
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
  };
  const download_file = async (e, i) => {
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
          'download', doc[i]?.fileId + "." + extention
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
        flUpldLogNo: doc[i]?.flUpldLogNo
      }]
    }
    console.log("yyyyyyyy", doc[i]);
    if
      (window.confirm("Are you sure? File cannot be recover once deleted !"))
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/forceFileDeletion",
          obj, { headers }
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

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])

  return (
    <div>
      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}

        <h4 className="card-title">
          Upload Documents {getFormTitle(mode)}
        </h4>
        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
          {/* document Id */}
          <div className="row mb-2 mx-2 ">
            <label className="col-md-3 col-form-label"><b>Document Id:</b></label>
            <div className="col-md-9">
              <input className="form-control" name="docId" value={formData?.docId} type="text" readOnly />
            </div>
          </div>

          {/* document Upload Date */}
          <div className="row mb-2 mx-2 ">
            <label className="col-md-3 col-form-label"><b>Document Upload Date:</b></label>
            <div className="col-md-9">
              <input className="form-control" name="uploadDt" value={formData?.uploadDt} readOnly type="date" />
            </div>
          </div>

          {/* Highlight as new ? */}
          <div className="row mb-2 mx-2">
            <label className="col-md-3 form-label">
              Highlight as new ?:
            </label>
            {/* <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="newDoc"
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData.newDoc}

              >
                <option disabled>--Select--</option>
                <option value='Y'>Yes</option>
                <option value='N'>No</option>
              </select>
            </div>  */}
            <div className="form-check form-switch col-md-3 ms-6 mt-2">
              <input onChange={handleCheckboxChange} className="form-check-input" type="checkbox" role="switch" name="newDoc" />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{formData?.newDoc === "N" ? "No" : "Yes"}</label>
            </div>
          </div>

          {/* Module */}
          <div className="row mb-2 mx-2 ">
            <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>}
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  name="modId"
                  disabled={mode === 3 || mode === 4}
                  value={formData.modId}
                  required
                />&nbsp;&nbsp;
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-2"
                  name="modNm"
                  disabled={mode === 3 || mode === 4}
                  value={formData?.modNm}
                  required
                />
                <div className="row-mb-12">
                  {showModelModLov && <Lov
                    moduleLovData={modLovData}
                    setShowModel={setShowModelModLov}
                    showModel={showModelModLov}
                    handleRowClick={handleRowClickModLov}
                    columns={modLovColumns}
                    currentSelection={selectRowModLov}
                    setCurrentSelection={setSelectRowModLov}
                  />}
                </div>
              </div>
            </div>
          </div>


          {/* document Name */}
          <div className="row mb-2 mx-2 ">
            <label className="col-md-3 col-form-label"><b>Document Name:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <input className="form-control" name="docNm"
                value={formData?.docNm} type="text" onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                required
              />
            </div>
          </div>

          <div className="row mb-2 mx-2 ">
            <label className="col-md-3 col-form-label"><b>display Order:</b></label>
            <div className="col-md-9">
              <input className="form-control" name="dispOrder"
                value={formData?.dispOrder} type="text" onChange={handleInputChange}
                disabled={mode === 3 || mode === 4} />
            </div>
          </div>

          {/* status */}
          <div className="row mb-2 mx-2">
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
                value={formData.actFlg}

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
          </div>

          {/* <input className="form-control" type="file" id="formFile" /> */}
          {/* <div className="row mb-2 mx-2">
        
                <label className="form-label col-md-3">Attach Document</label>
                <div style={{display: "flex", alignItems:"center", cursor: "pointer"}} className="col-md-9">
                {close ? "showFile" : <input onChange={handle_fileChange} className="form-control  mx-1" type="file" id="formFile" />}
                {close && <CloseIcon onClick={handle_fileClear} style={{color: "black"}}/>}
                </div>
                
            
              </div> */}
          <div className="row mb-2 mx-2">
            <label className="form-label col-md-3">Attach Document<span className="text-red">*</span></label>
            <div className="col-md-9">

              {doc?.length === 0 && <div className="file-upload">
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

              {doc.map((file, i) => (
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

          {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="button"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
          >
            Reset
          </button>}
        </form>
      </div>
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

export default UpldDocumentsForm;

