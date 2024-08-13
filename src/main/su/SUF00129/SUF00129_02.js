
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { formLovColumns, moduleLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const FormFileUpldForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  console.log(edtVal);
  console.log(addVal.ddImgDbFlg);

  const [formData, setFormData] = useState({
    modId: "",
    modNm: "",
    formId: "",
    formNm: "",
    actFlg: "A",
    filePath: "",
    fileSz: 0,
    imageSz: 0,
    videoSz: 0,
    voiceSz: 0,
  });

  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const moduleLovObj = {
      apiId: "SUA00431",
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/SUF00129/getAllModMst",
          moduleLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res?.data);
          setModuleLovData(res.data.content ? res.data.content.qryRsltSet : []);
          /*  setMsg(
             res?.data?.appMsgList?.list[0]?.errDesc +
             " (" +
             res?.data?.appMsgList?.list[0]?.errCd +
             ")"
           );
           setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */

        });
    };

    fetchModuleLovData();
  }, []);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm : "";
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId : "";
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    setFormData({
      ...formData,
      modId: getModuleId(rowData),
      modNm: getModuleName(rowData),
      formId: "",
      formNm: ""
    })
  };

  //module Lov Ends

  //Form Lov Starts

  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00259",
      criteria: {
        modId: formData.modId
      }

    }
    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00129/getFormMstByModMst", formLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    formData.modId && fetchFormLovData();
  }, [formData.modId]);


  const getFormName = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm
  }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId
  }


  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    setSelectRowFormLov(rowData);
    setFormData({
      ...formData,
      formId: getFormId(rowData),
      formNm: getFormName(rowData)
    })
  };

  //Form Lov Ends







  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");
    
    let modId = rowData?.modId||""
    let resIndex = moduleLovData.findIndex(item=> item.modId === modId)
    let currentModId = {}
    if(resIndex !== -1) currentModId = {[resIndex]: true}
    setSelectRowModuleLov(currentModId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);
    let formId = rowData?.formId||""
    let resFormIndex = formLovData.findIndex(item=> item.formId === formId)
    let currentFormId = {}
    if(resFormIndex !== -1) currentFormId = {[resFormIndex]: true}
    setSelectRowFormLov(currentFormId)
    
    
    
    }, [rowData, edtVal, moduleLovData, formLovData])




  useEffect(() => {

    if (mode !== 1) {
      // Set all properties of edtVal to null
      setFormData({
        actFlg: edtVal ? edtVal.actFlg : "A",
        modId: rowData ? rowData.modId : "",
        modNm: edtVal ? edtVal.modNm : "",
        formId: rowData ? rowData.formId : "",
        formNm: edtVal ? edtVal.formNm : "",
        filePath: edtVal ? edtVal?.filePath : null,
        fileSz: edtVal ? edtVal.fileSz : 0,
        imageSz: edtVal ? edtVal.imageSz : 0,
        videoSz: edtVal ? edtVal.videoSz : 0,
        voiceSz: edtVal ? edtVal.voiceSz : 0,
      });
      console.log(formData);
    }
  }, [mode, edtVal, rowData]);

  // Get All List
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00129/getListPageData', queryInputObj, { headers }).then((res) => {
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

    setFormData({
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      actFlg: "A",
      filePath: "",
      fileSz: 0,
      imageSz: 0,
      videoSz: 0,
      voiceSz: 0,
    })
    setMsg("")
    setMsgTyp("")

    console.log(edtVal);
  };

  const resetForm1 = () => {

    setFormData({
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      actFlg: "A",
      filePath: "",
      fileSz: 0,
      imageSz: 0,
      videoSz: 0,
      voiceSz: 0,
    })
    //  setMsg({})
    //  setMsgTyp({})

    console.log(edtVal);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowModGrpLov);
    console.log(formData)
    const {modNm,formNm, ...obj} = formData
    console.log(formData)
    const addObj = {
      apiId: "SUA00444",
      mst: {        
        ...obj,
        fileSz: parseInt(obj.fileSz),
        imageSz: parseInt(obj.imageSz),
        videoSz: parseInt(obj.videoSz),
        voiceSz: parseInt(obj.voiceSz),
      }
    }



    const editObj = {
      apiId: "SUA00446",
      mst: { ...obj,
        fileSz: parseInt(obj.fileSz),
        imageSz: parseInt(obj.imageSz),
        videoSz: parseInt(obj.videoSz),
        voiceSz: parseInt(obj.voiceSz), }
    }


    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00129/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm1();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00129/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})

      }).catch(error => {
        console.log("error")
      });


    if (mode === 3)
      set_open(true)


  };


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



  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "SUA00445",
      mst: {

        // appCatCd: formData.appCatCd,
        formId: formData.formId,

      }
    }


    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00129/saveDelete', deleteObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
        fetchData()

      }
      set_delStatus(true)
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      set_errExp({status:res.data?.appMsgList?.errorStatus})



    }).catch(error => {
      console.log("error")
    });
  }



  return (
    <div className="container">
      {msg && <div><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

      <h4 className="card-title">Form File Upload Defination {getFormTitle(mode)}</h4>
      <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>


        <div className="row mb-2">
          <label
            for="exampleFormControlSelect1"
            className="col-md-3 col-form-label"
          >
            <b>
              Module:<span className="text-red">*</span>
            </b>
          </label>
          <div className="col-md-9">
            <div className="input-group">
              <span className="input-group-text bg-primary">
                <i
                  className="fa fa-search d-inline text-white"
                  onClick={() => setShowModelModuleLov(true)}
                />
              </span>
              <input
                type="text"
                aria-label="First name"
                value={formData?.modId}
                required
                className="form-control"
                disabled={mode===3 || mode===4}
              />
              <input
                type="text"
                aria-label="Last name"
                value={formData?.modNm
                }
                // required
                disabled={mode===3 || mode===4}
                className="form-control mx-2"
              />

              <div className="row-mb-12">
                {showModelModuleLov && (
                  <Lov
                    moduleLovData={moduleLovData}
                    setShowModel={setShowModelModuleLov}
                    showModel={showModelModuleLov}
                    handleRowClick={handleRowClickModuleLov}
                    columns={moduleLovColumns}
                    currentSelection={selectRowModuleLov}
                    setCurrentSelection={setSelectRowModuleLov}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <label
            for="exampleFormControlSelect1"
            className="col-md-3 col-form-label"
          >
            <b>
              Form:<span className="text-red">*</span>
            </b>
          </label>
          <div className="col-md-9">
            <div className="input-group">
              <span className="input-group-text bg-primary">
                <i
                  className="fa fa-search d-inline text-white"
                  // style={{ color: "blue" }}
                  onClick={() => setShowModelFormLov(true)}
                />
              </span>
              <input
                type="text"
                autoComplete="false"
                //className="form-control-lov-cd"
                className="form-control  rouned"
                value={formData?.formId}
                required
                disabled={mode===3 || mode===4}
              />
              <input
                type="text"
                autoComplete="false"
                className="form-control mx-2"
                value={formData?.formNm}
                // required
                disabled={mode===3 || mode===4}

              />

              <div className="row-mb-12">
                {showModelFormLov && (
                  <Lov
                    moduleLovData={formLovData}
                    setShowModel={setShowModelFormLov}
                    showModel={showModelFormLov}
                    handleRowClick={handleRowClickFormLov}
                    columns={formLovColumns}
                    currentSelection={selectRowFormLov}
                    setCurrentSelection={setSelectRowFormLov}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* file */}
        <div className=" row mb-4">
          <label className="col-md-3 form-label">	File Path:</label>
          <div className="col-md-9  input-group">
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

        </div>

        {/* File & Image*/}
        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              File Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-3">
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

          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              Image Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-3">
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

        {/* Video & Voice*/}
        <div className=" row mb-4">

          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              Video Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-3">
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

          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              Voice Size:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-3">
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


