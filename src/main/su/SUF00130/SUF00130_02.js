import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { modLovColumns, appLovColumns, formLovColumns } from "./columns";
import Lov from "../../common/Lov";
import { act } from "react-dom/test-utils";
export const OptTypMasterFrom = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00130/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      // setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType) 
    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")
  //Module Lov Starts     
  const [formData, setFormData] = useState({
    otpTypCd: "",
    otpTypDesc: "",
    otpCatFlg: "S",
    otpEmailFlg: "N",
    otpMobFlg: "N",
    otpDataTyp: "1",
    otpTxt: "",
    otpSz: 6,
    userOptnSelFlg: "N",
    appId: "",
    appNm: "",
    modId: "",
    modNm: "",
    formId: "",
    formNm: "",
    actFlg: "A"
  });



  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const modLovObj = {
      apiId: "SUA00524"
      //   criteria: {

      //       }

    }
    const fetchModuleLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/getAllModMst", modLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setModuleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchModuleLovData();
  }, []);


  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm:""
  }

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId:""
  }


  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setSelectRowFormLov({});
    setFormData({
      ...formData,
      modId: getModuleId(rowData),
      modNm: getModuleName(rowData),
      formId: "",
      formNm: "",
    })
  };
  //Module Lov ends


  //App Lov Starts

  const [appLovData, setAppLovData] = useState([]);
  useEffect(() => {
    const appLovObj = {
      appId: "SUA00523",


    }
    const fetchAppLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/getAllAppInfo", appLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setAppLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    fetchAppLovData();
  }, []);


  const getAppName = (obj) => {
    return appLovData[Number(Object.keys(obj)[0])]?.appDesc ? appLovData[Number(Object.keys(obj)[0])]?.appDesc:""
  }

  const getAppId = (obj) => {
    return appLovData[Number(Object.keys(obj)[0])]?.appid ? appLovData[Number(Object.keys(obj)[0])]?.appid:""
  }


  const [selectRowAppLov, setSelectRowAppLov] = useState("");
  const [showModelAppLov, setShowModelAppLov] = useState(false);
  const handleRowClickAppLov = (rowData) => {
    setSelectRowAppLov(rowData);
    setFormData({
      ...formData,
      appId: getAppId(rowData),
      appNm: getAppName(rowData),

    })
  };

  //App Lov End



  //Form Lov Starts
  const [formLovObj, setFormLovObj] = useState({})
useEffect(() => {
  setFormLovObj({
    apiId: "SUA00525",
    criteria: {
      modId: formData?.modId
    }

  })
}, [formData?.modId])

  const [formLovData, setFormLovData] = useState([]);
  useEffect(() => {
   
    const fetchFormLovData = async () => {
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00130/getFormMstByModMst", formLovObj, { headers })
        .then((res) => {
          console.log(res.data);
          setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        });
    };

    formLovObj && fetchFormLovData();
  }, [formLovObj]);


  const getFormName = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formNm ? formLovData[Number(Object.keys(obj)[0])]?.formNm:""
  }

  const getFormId = (obj) => {
    return formLovData[Number(Object.keys(obj)[0])]?.formId ? formLovData[Number(Object.keys(obj)[0])]?.formId:""
  }


  const [selectRowFormLov, setSelectRowFormLov] = useState("");
  const [showModelFormLov, setShowModelFormLov] = useState(false);
  const handleRowClickFormLov = (rowData) => {
    setSelectRowFormLov(rowData);
    setFormData({
      ...formData,
      formId: getFormId(rowData),
      formNm: getFormName(rowData),
    })
  };

  //Form Lov End



  

  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");

    let modId = edtVal?.modId || ""
    let resIndex = moduleLovData.findIndex(item => item.modId === modId)
    let currentModId = {}
    if (resIndex !== -1) currentModId = { [resIndex]: true }
    setSelectRow(currentModId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);

    let appId = edtVal?.appId || ""
    let resAppIndex = appLovData.findIndex(item => item.appId === appId)
    let currentAppId = {}
    if (resAppIndex !== -1) currentAppId = { [resAppIndex]: true }
    setSelectRow(currentAppId)
    console.log(appId);

    let formId = edtVal?.formId || ""
    let resFormIndex = formLovData.findIndex(item => item.formId === formId)
    let currentFormId = {}
    if (resFormIndex !== -1) currentFormId = { [resFormIndex]: true }
    setSelectRow(currentFormId)
    console.log(formId);
  

  }, [rowData, edtVal, moduleLovData, appLovData, formLovData])

  useEffect(() => {
    if (mode !== 1) setFormData({
      otpTypCd: rowData ? rowData.otpTypCd : "",
      otpTypDesc: rowData ? rowData.otpTypDesc : "",
      otpCatFlg: edtVal ? edtVal.otpCatFlg : "S",
      otpEmailFlg: rowData ? rowData.otpEmailFlg : "N",
      otpMobFlg: rowData ? rowData.otpMobFlg : "N",
      otpDataTyp: edtVal ? edtVal.otpDataTyp : "1",
      otpTxt: edtVal ? edtVal.otpTxt : "",
      otpSz: edtVal ? edtVal.otpSz : 6,
      userOptnSelFlg: edtVal ? edtVal.userOptnSelFlg : "N",
      appId: edtVal ? edtVal.appId : "",
      appNm: edtVal ? edtVal.appNm : "",
      modId: edtVal ? edtVal.modId : "",
      modNm: edtVal ? edtVal.modNm : "",
      formId: edtVal ? edtVal.formId : "",
      formNm: edtVal ? edtVal.formNm : "",
      actFlg: rowData ? rowData?.actFlg : "A"
    })
  }, [mode, rowData, edtVal])




  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    console.log("xxxxxxxxx", event.target);
    console.log("xxxxxxxxx", name, "yyyyyyy", value);
    if(name==="userOptnSelFlg"){
      setFormData({
        ...formData,
        [name]: value === "Y" ? "N" : "Y",
      });
    }
    else{
      setFormData({
        ...formData,
        [name]: value === "Y" ? "N" : "Y",
      });
    }
  };

  console.log(formData);

  // useEffect(() => {
  //   if(mode===1){
  //     setEdtVal({
  //       otpTypCd: '',
  //       otpTypDesc: '',
  //       actFlg: 'A',
  //     })

  //   }
  // }, [mode])



  const handleInputChange = (event) => {

    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if ((!formData.name.trim()) || (formData.dev_nm.trim() === "")) {
      return false;
    }
    if ((!formData.addr.trim()) || (formData.addr.trim() === "")) {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {

    setFormData({
      otpTypCd: "",
      otpTypDesc: "",
      otpCatFlg: "S",
      otpEmailFlg: "N",
      otpMobFlg: "Y",
      otpDataTyp: "1",
      otpTxt: "",
      otpSz: 6,
      userOptnSelFlg: "N",
      appId: "",
      appNm: "",
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      actFlg: "A"
    })

  };
  //  setEdtVal({
  //   modGrpId: '', 
  //   modGrpNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    otpTypDesc: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "SUA00437",
      mst: {
        appId: formData.appId,
        formId: formData.formId,
        modId: formData.modId,
        otpDataTyp: formData.otpDataTyp,
        otpEmailFlg: formData.otpEmailFlg,
        otpMobFlg: formData.otpMobFlg,
        otpSz: parseInt(formData.otpSz),
        otpTxt: formData.otpTxt,
        otpTypDesc: formData.otpTypDesc,
        userOptnSelFlg: formData.userOptnSelFlg,
        otpCatFlg: formData.otpCatFlg,
        actFlg: formData.actFlg
      }

    }


    const editObj = {
      apiId: "SUA00439",
      mst: {
        appId: formData.appId,
        formId: formData.formId,
        modId: formData.modId,
        otpDataTyp: formData.otpDataTyp,
        otpEmailFlg: formData.otpEmailFlg,
        otpMobFlg: formData.otpMobFlg,
        otpSz: parseInt(formData.otpSz),
        otpTxt: formData.otpTxt,
        otpTypDesc: formData.otpTypDesc,
        otpTypCd: formData.otpTypCd,
        userOptnSelFlg: formData.userOptnSelFlg,
        otpCatFlg: formData.otpCatFlg,
        actFlg:formData.actFlg
      }
    }


    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00130/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00130/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
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


  };


  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "SUA00438",
      mst: {

        otpTypCd: formData.otpTypCd

      }
    }


    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00130/saveDelete', deleteObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
        fetchData()

      }
      set_delStatus(true)
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      set_errExp({ status: res.data?.appMsgList?.errorStatus })



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


  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])

  return (
    <div>


      <div className="container">
        {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
        <h4 className="card-title">
          OTP Type Master  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Code
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="otpTypCd"
                value={formData.otpTypCd}
                readOnly
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              OTP Type Description <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="otpTypDesc"
                value={formData.otpTypDesc}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="OTP Type Description"
                required
                maxLength={100}
                disabled={mode === 3 || mode === 4}

              />{charCount.otpTypDesc && <span className="input-group-text">{formData.otpTypDesc?.length}/100</span>}

            </div>
          </div>

          <div className="row mb-2">
            <label className="col-md-3 form-label">Choose Options For OTP:</label>
            <div className="col-md-9 pt-1 input-group">
              <div className="form-check m-0 p-0 col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {formData?.userOptnSelFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="userOptnSelFlg"
                      value={formData?.userOptnSelFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="userOptnSelFlg"
                      value={formData?.userOptnSelFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                <span className="custom-control-label">Do You Want To Choose OTP Options?</span>
                </label>
              </div>
              {/* <div className="form-check form-switch col-md-6 mt-1">
                                    <input onChange={handleCheckboxChange} disabled={mode === 3 || mode === 4} className="form-check-input mx-1" type="checkbox" role="switch" name="userOptnSelFlg"
                      value={formData?.userOptnSelFlg} checked={formData?.userOptnSelFlg==="Y"}/>
                                    <label className="form-check-label" style={{ marginLeft: "30%" }} >Do You Want To Choose OTP Options?</label>
                                  </div> */}
                                  {/* (formData?.userOptnSelFlg === "Y") && */}
              { <div className="col-md-6 pt-1">
                <div className="form-check col-md-3 form-check-inline">
                  <label className="custom-control custom-checkbox">
                    {formData?.otpEmailFlg === "Y" ? (
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={true}
                        name="otpEmailFlg"
                        value={formData?.otpEmailFlg}
                        onChange={handleCheckboxChange}
                        disabled={mode === 3 || mode === 4}
                      />
                    ) : (
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="otpEmailFlg"
                        value={formData?.otpEmailFlg}
                        onChange={handleCheckboxChange}
                        disabled={mode === 3 || mode === 4}
                      />
                    )}
                    <span className="custom-control-label">OTP Email Flag</span>
                  </label>
                </div>
                <div className="form-check col-md-3 p-0 form-check-inline">
                  <label className="custom-control custom-checkbox">
                    {/*  <input
                  type="checkbox"
                  className="custom-control-input"
                  name="addFlg"
                  defaultValue="Y"
                  defaultChecked="Y"
                  value={editVal.addFlg}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                /> */}
                    {formData.otpMobFlg === "Y" ? (
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        checked={true}
                        name="otpMobFlg"
                        // required
                        value={formData.otpMobFlg}
                        onChange={handleCheckboxChange}
                        disabled={mode === 3 || mode === 4}
                      />
                    ) : (
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        name="otpMobFlg"
                        // required
                        value={formData.otpMobFlg}
                        onChange={handleCheckboxChange}
                        disabled={mode === 3 || mode === 4}
                      />
                    )}
                    <span className="custom-control-label"></span>OTP Mobile Flag
                  </label>
                </div>



              </div>}



            </div>
          </div>

          <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                OTP Category:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <select required
                                    class="from-group col-md-12 rounded-3 border"
                                    aria-label="Default select example"
                                    value={formData.otpCatFlg}
                                    name="otpCatFlg"
                                    onChange={handleStatusChange}
                                    disabled={mode === 3 || mode === 4}
                                // defaultValue="A"
                                >
                                    <option disabled>--Select--</option>
                                    {(mode === 1) ?
                                        (addVal?.ddOtpCatFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.ddOtpCatFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }
                                </select>
                            </div>
                        </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              OTP Size:<span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="number"
                name="otpSz"
                value={formData.otpSz}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="OTP Size"
                required
                maxLength={2}
                disabled={mode === 3 || mode === 4}

              />{charCount.otpSz && <span className="input-group-text">{formData.otpSz?.length}/2</span>}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              OTP Text
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="otpTxt"
                value={formData.otpTxt}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="OTP Text"
                // required
                maxLength={100}
                disabled={mode === 3 || mode === 4}

              />{charCount.otpTxt && <span className="input-group-text">{formData.otpTxt?.length}/100</span>}

            </div>
          </div>

          <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                OTP Data Type:
                            </label>
                            <div className="col-md-9 input-group">
                                <select 
                                // required
                                    class="from-group col-md-12 rounded-3 border"
                                    aria-label="Default select example"
                                    value={formData.otpDataTyp}
                                    name="otpDataTyp"
                                    onChange={handleStatusChange}
                                    disabled={mode === 3 || mode === 4}
                                // defaultValue="A"
                                >
                                    <option disabled>--Select--</option>
                                    {(mode === 1) ?
                                        (addVal?.ddDataTyp?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.ddDataTyp?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }
                                </select>
                            </div>
                        </div>

          <div className="row mb-2">
            <label className="col-sm-3 col-form-label"><b>App:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                  <i
                    className="fa fa-search d-inline text-white"
                    onClick={() => setShowModelAppLov(true)}
                  />
                </span>}
                <input
                  type="text"
                  autoComplete="false"
                  //className="form-control-lov-cd"
                  className="form-control col-md-2 rouned"
                  value={formData.appId}
                  disabled={mode === 3 || mode === 4}

                />
                <input
                  type="text"
                  autoComplete="false"
                  className="form-control mx-4"
                  disabled={mode === 3 || mode === 4}
                  value={formData.appNm}


                />
                <div className="row-mb-12">
                  {showModelAppLov && <Lov
                    moduleLovData={appLovData}
                    setShowModel={setShowModelAppLov}
                    showModel={showModelAppLov}
                    handleRowClick={handleRowClickAppLov}
                    columns={appLovColumns}
                    currentSelection={selectRowAppLov}
                    setCurrentSelection={setSelectRowAppLov}
                  />}
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-3 col-form-label"><b>Module:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                  <i
                    className="fa fa-search d-inline text-white"
                    onClick={() => setShowModel(true)}
                  />
                </span>}
                <input
                  type="text"
                  autoComplete="false"
                  //className="form-control-lov-cd"
                  className="form-control col-md-2 rouned"
                  value={formData.modId}
                  disabled={mode === 3 || mode === 4}
                // required
                />
                <input
                  type="text"
                  autoComplete="false"
                  className="form-control mx-4"
                  disabled={mode === 3 || mode === 4}
                  value={formData.modNm}


                />
                <div className="row-mb-12">
                  {showModel && <Lov
                    moduleLovData={moduleLovData}
                    setShowModel={setShowModel}
                    showModel={showModel}
                    handleRowClick={handleRowClick}
                    columns={modLovColumns}
                    currentSelection={selectRow}
                    setCurrentSelection={setSelectRow}
                  />}
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-3 col-form-label"><b>Form:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">

                  <i
                    className="fa fa-search d-inline text-white"

                    onClick={() => setShowModelFormLov(true)}
                  />
                </span>}

                <input
                  type="text"
                  autoComplete="false"
                  //className="form-control-lov-cd"
                  className="form-control col-md-2 rouned"
                  value={formData.formId}
                  disabled={mode === 3 || mode === 4}

                />
                <input
                  type="text"
                  autoComplete="false"
                  className="form-control mx-4"
                  value={formData.formNm}
                  disabled={mode === 3 || mode === 4}

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

          {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
          >
            Reset
          </button>}
        </form>

        {/* <div className="container text-center">
                    <input
                        className="btn btn-success"
                        type="submit"
                        defaultValue="Submit"
                    />
                </div> */}
        {/* </div> */}
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

