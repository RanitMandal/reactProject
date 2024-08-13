import React, { useState, useEffect, useRef } from "react";

import { Modal, ModalTitle } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faSearch } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import axios from "axios";
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
// import { TransferList } from '@mui/lab';

const AutoNumberDefinitionForm = ({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row,
  rowData,
  index,
  queryInputObj,
  headers,
  editVal,
  setEditVal,
  updateEditVal,
  addVal,
  msg ,
        setMsg ,
        msgTyp,
        setMsgTyp ,
        errExp, set_errExp,
}) => {
  //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  useEffect(() => {
    const modGrpLovObj = {
      apiId : "SUA00159",
    
    
  }
   
    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00030/getAllModGrp", modGrpLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleGrpLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getModuleGrpName = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm:"";
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId:"";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModuleLov({});
    updateEditVal({
      ...editVal,
      modGrpId: getModuleGrpId(rowData),
      modGrpNm: getModuleGrpName(rowData),
      modId:"",
      modNm:""
    });
  };
  //Module Group Lov ends

  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00160",
      criteria: {
      modGrpId: getModuleGrpId(selectRow),
      }
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
            "/SUF00030/getModMstByModGrp",
          formLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
            );
        });
    };

    selectRow && fetchModuleLovData();
  }, [selectRow]);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm:"";
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId:"";
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
      updateEditVal({
      ...editVal,
      modId: getModuleId(rowData),
      modNm: getModuleName(rowData),
    });
    // setQueryInputObj({

    //     ...queryInputObj,
    //     modId: getModuleId(rowData),

    // });
  };

  //module Lov Ends

  const fetchData = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00030/getListPageData",
        queryInputObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data?.content?.qryRsltSet);
        console.log(data);
      });
  };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);

   useEffect(() => {
    if (mode === 1) {
      setEditVal({
        modGrpId: "",
        modGrpNm: "",
        modId: "",
        modNm: "",
        cdId: "",
        cdDesc: "",
        noTyp: "U",
        length: 0,
        prefixFlg: "",
        prefixTyp: "",
        prefixLength: 0,
        prefix: '',
        suffixFlg: "N",
        suffixTyp: "",
        suffixLength: 0,
        suffix: '',
        keyStr: '',
        actFlg: "A",
      });
    }
  }, [mode]); 

   const [formData, setFormData] = useState({
    id: rowData ? rowData.id : "",
    modGrpId: "",
    modGrpNm: "",
    modId: "",
    modNm: "",
    cdId: rowData ? rowData.cdId : "",
    cdDesc: rowData ? rowData.cdDesc : "",
    keyStr: rowData ? rowData.keyStr : "",
    noTyp: rowData ? rowData.noTyp : "U",
    length: "",
    prefixFlg: "",
    suffixFlg: "",
    prefixTyp: "N",
    suffixTyp: "N",
    prefixLength: 0,
    suffixLength: 0,
    prefix: "",
    suffix: "",
    actFlg: "A",
  });
 
  useEffect(() => {
    setFormData ({
      id: rowData ? rowData.id : "",
      modGrpId: editVal ? editVal.modGrpId : "",
      modGrpNm: editVal ? editVal.modGrpNm : "",
      modId: editVal ? editVal.modId : "",
      modNm: editVal ? editVal.modNm : "",
      cdId: rowData ? rowData.cdId : "",
      cdDesc: rowData ? rowData.cdDesc : "",
      keyStr: rowData ? rowData.keyStr : "",
      noTyp: rowData ? rowData.noTyp : "U",
      length: editVal ? editVal.length : "",
      prefixFlg: editVal ? editVal.prefixFlg : "",
      suffixFlg: editVal ? editVal.suffixFlg : "",
      prefixTyp: editVal ? editVal.prefixTyp : "",
      suffixTyp: editVal ? editVal.suffixTyp : "",
      prefixLength: editVal ? editVal.prefixLength : 0,
      suffixLength: editVal ? editVal.suffixLength : 0,
      prefix: editVal ? editVal.prefix : "",
      suffix: editVal ? editVal.suffix : "",
      actFlg: editVal ? editVal.actFlg : "A",
    })
  },[rowData])
   
  

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
   setEditVal({...editVal, [event.target.name]: event.target.value})
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
   setEditVal({...editVal, [event.target.name]: event.target.value})
  };
  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setEditVal({
      ...editVal,
      [name]: value === "Y" ? "N" : "Y",
    });
  }; 

  const validateInput = (formData) => {
    if (!formData.dev_nm.trim() || formData.dev_nm.trim() === "") {
      return false;
    }
    if (!formData.addr.trim() || formData.addr.trim() === "") {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
    setFormData({
      id: "",
      modGrpId: "",
      modGrpNm: "",
      modId: "",
      modNm: "",
      cdId: "",
      cdDesc: "",
      noTyp: "U",
      length: 0,
      prefixFlg: "",
      prefixTyp: "N",
      prefixLength: 0,
      prefix: '',
      suffixFlg: "N",
      suffixTyp: "N",
      suffixLength: 0,
      suffix: '',
      keyStr: '',
      actFlg: "A",
    })
    
    setEditVal({
      modGrpId: "",
      modGrpNm: "",
      modId: "",
      modNm: "",
      cdId: "",
      cdDesc: "",
      noTyp: "U",
      length: 0,
      prefixFlg: "",
      prefixTyp: "N",
      prefixLength: 0,
      prefix: '',
      suffixFlg: "N",
      suffixTyp: "N",
      suffixLength: 0,
      suffix: '',
      keyStr: '',
      actFlg: "A",
    });
    const Form = document.getElementById('myForm')
    Form.reset();
  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    cdDesc: false,
    modPrefix:false,
    suffix:false,
    prefix: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(editVal.prefixFlg);

    const addObj = {
    apiId: "SUA00072",
    mst:{
         cdDesc: formData.cdDesc,
        //cdId: formData.cdId,
        keyStr: formData?.keyStr ? formData?.keyStr : "",
        length: parseInt(editVal?.length),
        modId: editVal.modId,
        noTyp: formData?formData.noTyp:"U",
        prefix: editVal.prefix,
        prefixFlg: editVal.prefixFlg?editVal.prefixFlg:'N',
        prefixLength: parseInt(editVal?.prefixLength),
        prefixTyp: editVal.prefixTyp||"N",
        suffix: editVal.suffix,
        suffixFlg: editVal.suffixFlg,
        suffixLength: parseInt(editVal?.suffixLength),
        suffixTyp: editVal. suffixTyp||"N", 
      }
    }

    const editObj = {
      
        apiId: "SUA00079",
        mst:{
      actFlg: editVal?.actFlg ,
      cdDesc: formData.cdDesc,
      cdId: formData.cdId,
      keyStr: formData?.keyStr ? formData.keyStr : "",
      length: parseInt(editVal?.length),
      modId: editVal?.modId,
      noTyp: formData.noTyp,
      prefix: editVal.prefix ? editVal.prefix: "" ,
      prefixFlg: editVal?.prefixFlg,
      prefixLength: parseInt(editVal?. prefixLength),
      prefixTyp: editVal.prefixTyp,
      suffix: editVal.suffix ? editVal.suffix : "",
      suffixFlg: editVal?.suffixFlg,
      suffixLength: parseInt(editVal?.suffixLength),
      suffixTyp: editVal.suffixTyp,
        }
    };
   

    if (mode === 1)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00030/saveAdd",
          addObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData();
          }
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
          if (res?.data?.appMsgList?.List[0]?.errCd === "CMAI000011") {
            resetForm();
          }
        })
        .catch((error) => {
          console.log("error");
        }).finally(() => {
          set_viewMsg(true)
      });

    if (mode === 2)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00030/saveEdit",
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
          }
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
        })
        .catch((error) => {
          console.log("error");
        }).finally(() => {
          set_viewMsg(true)
      });

    if (mode === 3)
    set_open(true)
     
  };

 

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add New";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };
  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };

  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: 'SUA00083',
     mst: {
      cdId: formData.cdId,
      modId: editVal.modId,
      }
    };
  await axios
  .post(
    process.env.REACT_APP_API_URL_PREFIX + "/SUF00030/saveDelete",
    deleteObj,
    { headers }
  )
  .then((res) => {
    console.log(res.data);
    if (!res?.data?.appMsgList?.errorStatus) {
      fetchData();
    }
    set_delStatus(true)
    setMsg(
      res.data?.appMsgList?.list[0]?.errDesc
        ? res.data?.appMsgList?.list[0]?.errDesc +
            ' (' +
            res.data?.appMsgList?.list[0]?.errCd +
            ')'
        : ''
    );
    
    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
    set_errExp({status:res.data?.appMsgList?.errorStatus})
  })
  .catch((error) => {
    console.log("error");
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



  const [isValid, setIsValid] = useState(true);

  return (
    <div>
      <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
        <h4 className="card-title">Auto Number Definition {getFormTitle(mode)}</h4>
        <div className="row ">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Module Group<span className="text-red">*</span>
              </label>
              <div className="col-md-9">
                <div className="input-group">
                  {(mode===1||mode===2)&&<span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                   
                      onClick={() => setShowModel(true)}
                    />
                  </span>}
                  <input
                    type="text"
                    aria-label="First name"
                    className="form-control  col-md-2 rounded-3"
                    value={editVal.modGrpId}
                    // onChange={(e) => {
                    //   // Update edtVal.modGrpId when the input changes
                    //   const newValue = e.target.value;
                    //   setEditVal((prevEditVal) => ({
                    //     ...prevEditVal,
                    //     modGrpId: newValue,
                    //     setSelectRow: "",
                    //   }));
                    // }}
                    disabled={mode === 3 || mode === 4}
                  />
                  <input
                    type="text"
                    aria-label="Last name"
                    className="form-control col-md-9 mx-4 rounded-3"
                    // value={formData?.modGrpName || ''}
                    value={editVal.modGrpNm}
                    // onChange={(e) => {
                    //   // Update edtVal.modGrpId when the input changes
                    //   const newValue = e.target.value;
                    //   setEditVal((prevEditVal) => ({
                    //     ...prevEditVal,
                    //     modGrpId: newValue,
                    //     setSelectRow: "",
                    //   }));
                    // }}
                    disabled={mode === 3 || mode === 4}
                  />
                  <div className="row-mb-12">
                    {showModel && (
                      <Lov
                        moduleLovData = {moduleGrpLovData}
                        setShowModel ={setShowModel}
                        showModel={showModel}
                        handleRowClick={handleRowClick}
                        columns={moduleGrpLovColumns}
                        currentSelection={selectRow}
                        setCurrentSelection={setSelectRow}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" row mb-4">
              <div className="col-md-3">
                <label className="form-label">
                  Module<span className="text-red">*</span>
                </label>
              </div>
              <div className="col-md-9">
                <div className="input-group">
                 {(mode===1||mode===2)&& <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                     
                      onClick={() => setShowModelModuleLov(true)}
                     
                    />
                  </span>}
                  <input
                    type="text"
                    aria-label="First name"
                    className="form-control  col-md-2 rounded-3"
                    required
                    value={editVal.modId}
                     
                    // onChange={(e) => {
                    //   // Update edtVal.modGrpId when the input changes
                    //   const newValue = e.target.value;
                    //   setEditVal((prevEditVal) => ({
                    //     ...prevEditVal,
                    //     modId: newValue,
                    //     setSelectRowModuleLov: "",
                    //   }));
                    // }}
                    //value={getModuleId(selectRowModuleLov)? getModuleId(selectRowModuleLov): "" }
                 
                    disabled={mode === 3 || mode === 4}
                  />
                  <input
                    type="text"
                    aria-label="Last name"
                    className="form-control col-md-9 mx-4 rounded-3"
                    value={editVal.modNm}
                     
                    // onChange={(e) => {
                    //   // Update edtVal.modGrpId when the input changes
                    //   const newValue = e.target.value;
                    //   setEditVal((prevEditVal) => ({
                    //     ...prevEditVal,
                    //     modId: newValue,
                    //     setSelectRowModuleLov: "",
                    //   }));
                    // }}
                    //va
                   // value={getModuleName(selectRowModuleLov)? getModuleName(selectRowModuleLov): "" }
                    required
                    disabled={mode === 3 || mode === 4}
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
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Code</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="cdId"
                 // placeholder="Code"
                  readOnly
                  value={formData.cdId}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                />
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Description<span className="text-red">*</span></label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="cdDesc"
                  value={formData.cdDesc}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder=""
                  maxLength={300}
                  onFocus={() => toggleCharCountVisibility("cdDesc")}
              onBlur={() => toggleCharCountVisibility("cdDesc")}
            />
            {fieldCharCountVisibility.cdDesc && (
              <span className="input-group-text">
                {formData?.cdDesc?.length}/300
              </span>
            )}
                
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Length<span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="length"
                  placeholder="Length"
                  maxLength={2}
                  value={editVal?.length}
                  onChange = {handleInputChange}
                  disabled = {mode === 3 || mode === 4}
                  required
                />
              </div>
              {!isValid && <p className="text-red">Invalid Length</p>}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label"> Type </label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  class="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  value={formData?.noTyp}
                  name="noTyp"
                  onChange={handleStatusChange}
                  disabled={mode === 3 || mode === 4}
                  defaultValue="U"
                >
                 
      <option disabled>--Select--</option>

{(mode===1)?
    (addVal?.ddnoTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(editVal?.ddnoTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    )))
}
                </select>
              </div>
            </div>
            <div className=" row mb-4 custom-controls-stacked">
              <label className="col-sm-4 form-label custom-control custom-radio">
              {editVal?.prefixFlg=== "Y" ? (
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name="prefixFlg"
                  //defaultValue="N"
                  checked={true}
                 //defaultChecked = {editVal.prefixFlg}
                  value = {editVal.prefixFlg}
                  onChange = {handleCheckboxChange}
                  disabled = {mode === 3 || mode === 4}
                />
                ) : (
                 <input
                  type="checkbox"
                  className="custom-control-input"
                  name="prefixFlg"
                  //defaultValue="N"
                 //defaultChecked = {editVal.prefixFlg}
                  value = {editVal.prefixFlg}
                  onChange = {handleCheckboxChange}
                  disabled = {mode === 3 || mode === 4}
                />
                )}

                <span className="custom-control-label">Prefix Flag</span>
              </label>
              <label className="col-sm-4 form-label custom-control custom-radio">
              {editVal?.suffixFlg=== "Y" ? (
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name="suffixFlg"
                  checked = {true}
                 // defaultValue="Y"
                 // defaultChecked = {editVal.suffixFlg}
                  value = {editVal.suffixFlg}
                  onChange = {handleCheckboxChange}
                  disabled = {mode === 3 || mode === 4}
                />
              ) : (
                 <input
                  type="checkbox"
                  className="custom-control-input"
                  name="suffixFlg"
                 // defaultValue="Y"
                 // defaultChecked = {editVal.suffixFlg}
                  value = {editVal.suffixFlg}
                  onChange = {handleCheckboxChange}
                  disabled = {mode === 3 || mode === 4}
                />
              )}
                <span className="custom-control-label">Suffix Flag</span>
              </label>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Prefix Type<span className="text-red">*</span></label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  class="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  value={editVal.prefixTyp}
                  name="prefixTyp"
                  onChange={handleStatusChange}
                  disabled={mode === 3 || mode === 4}
                  defaultValue="N"
                >
                   <option disabled>--Select--</option>
                  {/* {editVal?.ddprefixTyp?.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))} */}

{(mode===1)?
    (addVal?.ddprefixTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(editVal?.ddprefixTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    )))
}
                </select>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Suffix Type<span className="text-red">*</span></label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  class="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  value={editVal.suffixTyp}
                  name="suffixTyp"
                  onChange={handleStatusChange}
                  disabled={mode === 3 || mode === 4}
                  defaultValue="N"
                >
                  <option disabled>--Select--</option>
                 {/*     {editVal?.ddsuffixTyp?.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))} */}
      {(mode===1)?
    (addVal?.ddsuffixTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(editVal?.ddsuffixTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    )))
}
                </select>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Prefix Length<span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Length"
                  maxLength={2}
                  name="prefixLength"
                  value={editVal.prefixLength}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  required
                />
              </div>
              {!isValid && <p className="text-red">Invalid Length</p>}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Suffix Length<span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Length"
                  name="suffixLength"
                  maxLength={2}
                  value={editVal.suffixLength}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  required
                />
              </div>
              {!isValid && <p className="text-red">Invalid Length</p>}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Prefix</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                 // placeholder=""
                  name="prefix"
                  value={editVal.prefix}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  maxLength={10}
                  onFocus={() => toggleCharCountVisibility("prefix")}
              onBlur={() => toggleCharCountVisibility("prefix")}
            />
            {fieldCharCountVisibility.prefix && (
              <span className="input-group-text">
                {formData?.prefix?.length}/10
              </span>
            )}
              </div>
              {!isValid && <p className="text-red">Invalid Length</p>}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Suffix</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  //placeholder="Suffix"
                  name="suffix"
                  value={editVal.suffix}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  maxLength={10}
                  onFocus={() => toggleCharCountVisibility("suffix")}
              onBlur={() => toggleCharCountVisibility("suffix")}
            />
            {fieldCharCountVisibility.suffix && (
              <span className="input-group-text">
                {formData?.suffix?.length}/10
              </span>
            )}
              </div>
              {!isValid && <p className="text-red">Invalid Length</p>}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Key String</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="keyStr"
                 // placeholder=""
                  value={formData.keyStr}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  maxLength={100}
                  onFocus={() => toggleCharCountVisibility("keyStr")}
              onBlur={() => toggleCharCountVisibility("keyStr")}
            />
            {fieldCharCountVisibility.keyStr && (
              <span className="input-group-text">
                {formData?.keyStr?.length}/100
              </span>
            )}
              </div>
              <div className='mb-2'></div>
              {mode !== 1 && ( <div className=" row mb-4">
                <label className="col-md-3 form-label">Status <span className="text-red">*</span></label>
                <div className="col-md-8 col-lg-8 mx-1">
                <div className="form-group">

    <select
      className="form-select"
      name="actFlg"
      value={editVal?.actFlg}
      onChange={handleStatusChange}
      disabled={mode === 3 || mode === 4}
    >
      {editVal?.ddActFlg?.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
 
</div>







                </div>
              </div>)}
            </div>
             {mode !== 4 && (
          <button
            type="submit"
            //onClick={(e) => handleSubmit(e, mode, data, setData, onClose)}
            className="btn btn-primary"
          >
            {buttonTitle(mode)}
          </button>
        )}
        {mode == 1 && (
          <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
          >
            Reset
          </button>
        )}
          </form>
        </div>
       
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

export default AutoNumberDefinitionForm;
