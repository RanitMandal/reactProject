
import React, { useEffect, useState, useRef } from "react";
import { Modal, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { appCatLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const AppMstForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal,  errExp, set_errExp, }) => {

  console.log(edtVal);
  console.log(addVal.ddImgDbFlg);
  // if(mode===1){
  //   setEdtVal({
  //     ...edtVal,
  //     subTreeFlg:"N"
  //   })
  // }

  const [formData, setFormData] = useState({
   appId:"",
   
    actFlg: "A",
  androidFlg: "Y",
  appCatCd: "",
  appCatDesc:"",
  appDesc: "",
  appLogoNm: "",
  appLogoPath: "",
  filePath: "",
  fileSz: 0,
  forceLogoutAfter: 0,
  forceLogoutFlg: "N",
  imagePath:"",
  imageSz: 0,
  iosFlg: "Y",
  offLineFlag: "N",
  videoPath: "",
  videoSz: 0,
  voicePath: "",
  voiceSz: 0,
  
});

  useEffect(() => {
    
    if (mode !== 1) {
      // Set all properties of edtVal to null
      setFormData({
        actFlg: edtVal ? edtVal.actFlg:"",
        androidFlg: rowData ? rowData.androidFlg:"",
        appCatCd: edtVal ? edtVal.appCatCd:"",
        appCatDesc:edtVal? edtVal.appCatDesc:"",
        appId:rowData ? rowData.appId:"",
        appDesc: rowData ? rowData.appDesc:"",
        appLogoNm: rowData ? rowData.appLogoNm:"",
        appLogoPath: rowData ? rowData.appLogoPath:"",
        filePath: edtVal ? edtVal?.filePath:null,
        fileSz: edtVal ? edtVal.fileSz:0,
        forceLogoutAfter: edtVal ? edtVal.forceLogoutAfter:0,
        forceLogoutFlg: edtVal ? edtVal.forceLogoutFlg:"",
        imagePath: edtVal ? edtVal.imagePath:"",
        imageSz: edtVal ? edtVal.imageSz:0,
        iosFlg: rowData ? rowData.iosFlg:"",
        offLineFlag: rowData ? rowData.offLineFlag:"",
        videoPath: edtVal ? edtVal.videoPath:"",
        videoSz: edtVal ? edtVal.videoSz:0,
        voicePath: edtVal ? edtVal.voicePath:"",
        voiceSz: edtVal ? edtVal.voiceSz:"",
      });
      console.log(formData);
    }
  }, [mode, edtVal, rowData]);

  //   useEffect(() => {
  //     if(mode!==1){
  // setFormData({
  //       id: rowData ? rowData.id : "",
  //       modGrpId: edtVal ? edtVal.modGrpId : "",
  //       modGrpNm: edtVal ? edtVal.modGrpNm : "",
  //       modId: rowData ? rowData.modId : "",
  //       modNm: rowData ? rowData.modNm : "",
  //       modPrefix: rowData ? rowData.modPrefix : "",
  //       imgDbFlg: edtVal ? edtVal.imgDbFlg : "N",
  //       imgPath: rowData ? rowData.imgPath : "",
  //       img: edtVal ? edtVal.img : 0,
  //       imgNm: edtVal ? edtVal.imgNm : "",
  //       helppath: edtVal ? edtVal.helppath : "",
  //       srvUrl: edtVal ? edtVal.srvUrl : "",
  //       subTreeFlg: edtVal ? edtVal.subTreeFlg : "N",
  //       viewFlg: edtVal ? edtVal.viewFlg : "N",
  //       otpFlg: edtVal ? edtVal.otpFlg : "N",
  //       loginFlg: edtVal ? edtVal.loginFlg : "N",
  //       actFlg: rowData ? rowData.actFlg : "A"
  //     });
  //     }

  //   }, [mode]);

  const handleSelectChange = (event) => {
    // setQueryInputObj({
    //   ...queryInputObj,
    //   actFlg: event.target.value,
    // });
  };



  // Get All List
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00121/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    })
  }

  //App Lov Starts     

  const [appCatLovData, setAppCatLovData] = useState([]);
  useEffect(() => {

    const fetchAppCatLovData = async () => {
      let obj = {
        apiId: 'SUA00330'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00121/getAllAppCatInfo", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setAppCatLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchAppCatLovData();
  }, []);


  const getAppCatNm = (obj) => {
    return appCatLovData[Number(Object.keys(obj)[0])]?.appCatDesc ? appCatLovData[Number(Object.keys(obj)[0])]?.appCatDesc : ""
  }

  const getAppCatId = (obj) => {
    return appCatLovData[Number(Object.keys(obj)[0])]?.appCatCd ? appCatLovData[Number(Object.keys(obj)[0])]?.appCatCd : ""
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowAppCatLov, setSelectRowAppCatLov] = useState("");
  const [showModelAppCatLov, setShowModelAppCatLov] = useState(false);
  const handleRowClickAppCatLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowAppCatLov(rowData);
    setFormData({
      ...formData,
      appCatCd: getAppCatId(rowData),
      appCatDesc: getAppCatNm(rowData)
    })

  };
  console.log(queryInputObj);
  //App Lov ends  


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
    // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    // setEdtVal({
    //   ...edtVal,
    //   [name]: checked ? "Y" : "N",
    // });
  };

  const validateInput = (formData) => {
    if ((!formData.mod_grp_code.trim()) || (formData.mod_grp_code.trim() === "")) {
      return false;
    }
    if ((!formData.mod_grp_name.trim()) || (formData.mod_grp_name.trim() === "")) {
      return false;
    }
    if ((!formData.mod_code.trim()) || (formData.mod_code.trim() === "")) {
      return false;
    }
    if ((!formData.mod_name.trim()) || (formData.mod_name.trim() === "")) {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
setSelectRowAppCatLov({})
    setFormData({
      appId:"",
   
      actFlg: "A",
    androidFlg: "Y",
    appCatCd: "",
    appCatDesc:"",
    appDesc: "",
    appLogoNm: "",
    appLogoPath: "",
    filePath: "",
    fileSz: 0,
    forceLogoutAfter: 0,
    forceLogoutFlg: "N",
    imagePath:"",
    imageSz: 0,
    iosFlg: "Y",
    offLineFlag: "N",
    videoPath: "",
    videoSz: 0,
    voicePath: "",
    voiceSz: 0,
    })
   setMsg("")
   setMsgTyp("")

    console.log(edtVal);
  };

  const resetForm1 = () => {
    setSelectRowAppCatLov({})
        setFormData({
          appId:"",
       
          actFlg: "A",
        androidFlg: "Y",
        appCatCd: "",
        appCatDesc:"",
        appDesc: "",
        appLogoNm: "",
        appLogoPath: "",
        filePath: "",
        fileSz: 0,
        forceLogoutAfter: 0,
        forceLogoutFlg: "N",
        imagePath:"",
        imageSz: 0,
        iosFlg: "Y",
        offLineFlag: "N",
        videoPath: "",
        videoSz: 0,
        voicePath: "",
        voiceSz: 0,
        })
      //  setMsg({})
      //  setMsgTyp({})
    
        console.log(edtVal);
      };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowModGrpLov);
    console.log(formData)
    const addObj = {
      apiId: "SUA00327",
      mst: {
        actFlg: formData.actFlg,
    androidFlg: formData.androidFlg,
    appCatCd: formData.appCatCd,
    appCatDesc:formData.appCatDesc,
    appDesc: formData.appDesc,
    appLogoNm: formData.appLogoNm,
    appLogoPath: formData.appLogoPath,
    filePath: formData.filePath,
    fileSz: formData.fileSz,
    forceLogoutAfter: formData.forceLogoutAfter,
    forceLogoutFlg: formData.forceLogoutFlg,
    imagePath: formData.imagePath,
    imageSz: formData.imageSz,
    iosFlg: formData.iosFlg,
    offLineFlag: formData.offLineFlag,
    videoPath: formData.videoPath,
    videoSz: formData.videoSz,
    voicePath: formData.voicePath,
    voiceSz: formData.voiceSz
      }
    }



    const editObj = {
      apiId: "SUA00341",
      mst: {
        actFlg: formData.actFlg,
    androidFlg: formData.androidFlg,
    appCatCd: formData.appCatCd,
    appCatDesc:formData.appCatDesc,
    appDesc: formData.appDesc,
    appId: formData.appId,
    appLogoNm: formData.appLogoNm,
    appLogoPath: formData.appLogoPath,
    filePath: formData.filePath,
    fileSz: formData.fileSz,
    forceLogoutAfter: formData.forceLogoutAfter,
    forceLogoutFlg: formData.forceLogoutFlg,
    imagePath: formData.imagePath,
    imageSz: formData.imageSz,
    iosFlg: formData.iosFlg,
    offLineFlag: formData.offLineFlag,
    videoPath: formData.videoPath,
    videoSz: formData.videoSz,
    voicePath: formData.voicePath,
    voiceSz: formData.voiceSz
      }
    }
    

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00121/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm1();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00121/saveEdit', editObj, { headers }).then(res => {
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
          apiId: "SUA00340",
          mst: {
            appId: formData.appId,
    
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00121/saveDelete', deleteObj, { headers }).then(res => {
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
    appDesc: false,
    appLogoNm: false,
    appLogoPath: false,
    filePath: false,
    imagePath: false,
    videoPath: false,
    voicePath: false,
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

      <h4 className="card-title">App Master {getFormTitle(mode)}</h4>
      <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

        {/* App Id */}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">App Id:<span className="text-red">*</span></label>

          <div className="col-md-9 ">
            <div className="input-group ">
              <input type="" className="form-control col-md-3 me-3 rounded-3 ui_display_txt_" readOnly name="appId" value={formData.appId} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4} />
              <input type="" className="form-control col-md-9 rounded-3 ui_entry_txt_rc" maxLength={8}  name="appDesc" value={formData.appDesc} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                required
                 onFocus={() => toggleCharCountVisibility("appDesc")}
                onBlur={() => toggleCharCountVisibility("appDesc")}
              />
              {fieldCharCountVisibility.appDesc && (
              <span className="input-group-text">
                {formData.appDesc.length}/8
              </span>
            )}
            </div>

          </div>
        </div>

        {/* App Cat */}
        <div className="row mb-2">
          <label className="col-md-3 col-form-label"><b>App Category:<span className="text-red">*</span></b></label>
          <div className="col-md-9 p-0">
            <div className="input-group mx-2">
              {(mode===1 || mode===2)&&<span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelAppCatLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                disabled={mode === 3 || mode === 4}
                value={formData.appCatCd}
                required
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                disabled={mode === 3 || mode === 4}
                value={formData.appCatDesc}
                required
              />
              <div className="row-mb-12">
                {showModelAppCatLov && <Lov
                  moduleLovData={appCatLovData}
                  setShowModel={setShowModelAppCatLov}
                  showModel={showModelAppCatLov}
                  handleRowClick={handleRowClickAppCatLov}
                  columns={appCatLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>
          </div>
        </div>



        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              App Logo Name:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-3 input-group ">

            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="appLogoNm"
              maxLength={100}
              value={formData.appLogoNm} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("appLogoNm")}
                onBlur={() => toggleCharCountVisibility("appLogoNm")}
              />
              {fieldCharCountVisibility.appLogoNm && (
              <span className="input-group-text">
                {formData.appLogoNm.length}/100
              </span>
            )}
          
          </div>
          <label className="col-md-3 form-label">	App Logo Path:<span className="text-red">*</span></label>
          <div className="col-md-3  input-group">

            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="appLogoPath"
              maxLength={100}
              value={formData.appLogoPath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("appLogoPath")}
                onBlur={() => toggleCharCountVisibility("appLogoPath")}
              />
              {fieldCharCountVisibility.appLogoPath && (
              <span className="input-group-text">
                {formData.appLogoPath.length}/100
              </span>
            )}

          </div>


        </div>
        {/* file */}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">	File Path:</label>
          <div className="col-md-5  input-group">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                // required
              placeholder=""
              name="filePath"
              maxLength={100}
              value={formData.filePath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("filePath")}
                onBlur={() => toggleCharCountVisibility("filePath")}
              />
              {fieldCharCountVisibility.filePath && (
              <span className="input-group-text">
                {formData?.filePath?.length}/100
              </span>
            )}

          </div>
          <div className="col-md-2">
            <label htmlFor="" className=" form-label">
              File Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-2">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="fileSz"
              // maxLength={2}
              value={formData.fileSz} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
            />
          </div>
        </div>

        {/* Image*/}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">	Image Path:</label>
          <div className="col-md-5  input-group">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                // required
              placeholder=""
              name="imagePath"
              maxLength={100}
              value={formData.imagePath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("imagePath")}
                onBlur={() => toggleCharCountVisibility("imagePath")}
              />
              {fieldCharCountVisibility.imagePath && (
              <span className="input-group-text">
                {formData?.imagePath?.length}/100
              </span>
            )}

          </div>
          <div className="col-md-2">
            <label htmlFor="" className=" form-label">
              Image Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-2">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="imageSz"
              // maxLength={2}
              value={formData.imageSz} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
            />
          </div>
        </div>

        {/* Video*/}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">	Video Path:</label>
          <div className="col-md-5  input-group">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                // required
              placeholder=""
              name="videoPath"
              maxLength={100}
              value={formData.videoPath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("videoPath")}
                onBlur={() => toggleCharCountVisibility("videoPath")}
              />
              {fieldCharCountVisibility.videoPath && (
              <span className="input-group-text">
                {formData?.videoPath?.length}/100
              </span>
            )}

          </div>
          <div className="col-md-2">
            <label htmlFor="" className=" form-label">
              Video Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-2">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="videoSz"
              // maxLength={2}
              value={formData.videoSz} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
            />
          </div>
        </div>

        {/* Voice*/}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">	Voice Path:</label>
          <div className="col-md-5  input-group">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                // required
              placeholder=""
              name="voicePath"
              maxLength={100}
              value={formData.voicePath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("voicePath")}
                onBlur={() => toggleCharCountVisibility("voicePath")}
              />
              {fieldCharCountVisibility.voicePath && (
              <span className="input-group-text">
                {formData?.voicePath?.length}/100
              </span>
            )}

          </div>
          <div className="col-md-2">
            <label htmlFor="" className=" form-label">
              Voice Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-2">
            <input
              type=""
              className="form-control ui_entry_txt_r"
                required
              placeholder=""
              name="voiceSz"
              // maxLength={2}
              value={formData.voiceSz} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
            />
          </div>
        </div>

        {/*Flags  */}
        <div className="row mb-4">
          <div className="col-md-3">
            <label className=" form-label">	Android Flag:<span className="text-red">*</span></label>
          </div>
          <div className="col-md-3">

            <select
              className="form-select"
              name="androidFlg"
              required
              value={formData?.androidFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled >--Select--</option>

              {(mode === 1) ?
                (addVal?.ddAndroidFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddAndroidFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>

          </div>
          <div className="col-md-3">
            <label className="form-label">IOS Flag:<span className="text-red">*</span></label>
          </div>

          <div className="col-md-3">

            <select
              className="form-select"
              name="iosFlg"
              required
              value={formData.iosFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddIosFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddIosFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>
          </div>

        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <label className=" form-label">	Force Logout:<span className="text-red">*</span></label>
          </div>
          <div className="col-md-3">

            <select
              className="form-select"
              name="forceLogoutFlg"
              required
              value={formData?.forceLogoutFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled >--Select--</option>

              {(mode === 1) ?
                (addVal?.ddForceLogoutFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddForceLogoutFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>

          </div>
          <div className="col-md-3">
            <label className="form-label">Off-Line:<span className="text-red">*</span></label>
          </div>

          <div className="col-md-3">

            <select
              className="form-select"
              name="offLineFlag"
              required
              value={formData.offLineFlag}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddOfflineFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddOfflineFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>
          </div>

        </div>

        {(formData.forceLogoutFlg==="Y")&&<div className="row mb-4">
        <label className="col-md-3 form-label">Force Logout:<span className="text-red">*</span></label>
          <div className="col-md-9">
            <div className="form-group">
              <input type="text" value={formData.forceLogoutAfter} onChange={handleInputChange} name="forceLogoutAfter" className="form-control" required/>
            </div>
          </div>
        </div>}

        {/* Status */}
        <div className="row mb-4">
          <div className="col-md-3">
            <label className="form-label">Status:<span className="text-red">*</span></label>
          </div>
          <div className="col-md-9">

            <select
              className="form-select"
              name="actFlg"
              required
              value={formData.actFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
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


