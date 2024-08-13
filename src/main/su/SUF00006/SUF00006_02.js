import React, {useRef, useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import { moduleLovColumns } from "./columns";
import Lov from "../../common/Lov _new";
import { Alert } from "react-bootstrap";
import { Button, message, Steps, theme } from "antd";
import axios from "axios";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };

const FormM = ({
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
  editVal,
  setEditVal,
  addVal,
  setAddVal,
  updateEditVal,
  queryInputObj,
  setQueryInputObj,
  msg,
  setMsg,
  msgTyp,
  setMsgTyp,
  errExp, set_errExp,
}) => {


console.log(queryInputObj);
console.log(editVal);
useEffect(() => {
  if (mode === 1) {
    setEditVal({
  modId: "",
  modNm: "",
  formId: "",
  formNm: "",
  formDesc: "",
  tempCd: "",
  tempNm: "",
  listFlg: "",
  addFlg: "",
  modFlg: "",
  delFlg: "",
  cancFlg: "",
  viewFlg: "",
  userChk: "",
  finYrChk: "",
  cashFlg: "",
  finImpactFlg: "",
  autoVoucherGenFlg: "",
  otpFlg: "",
  loginFlg: "",
  dataRestc: "",
  techRmks: "",
  actFlg: "",
    });
    
  }
  
  
}, [mode]);


    const fetchData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/getListPageData",
          queryInputObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setData(res.data?.content?.qryRsltSet);
         
          console.log(data);
        });
    };
    


     //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  let getAllModMst_obj = {
    apiId: "SUA00240",
  }
  useEffect(() => {
   
    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/getAllModMst", getAllModMst_obj,
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
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modNm:"";
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modId ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modId:"";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    //setSelectRowModuleLov({});
    updateEditVal({
      ...editVal,
      modId: getModuleGrpId(rowData),
      modNm: getModuleGrpName(rowData),
    });

  };
  //Module Group Lov ends

  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");
    
    let modId = rowData?.modId||""
    let resIndex = moduleGrpLovData.findIndex(item=> item.modId === modId)
    let currentModId = {}
    if(resIndex !== -1) currentModId = {[resIndex]: true}
    setSelectRow(currentModId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);
   
    
    
    
    }, [rowData, editVal, moduleGrpLovData])



  console.log(mode);
  console.log(rowData);
  console.log(rowId);



  const [formData, setFormData] = useState({
    modId: "",
    modNm: "",
    formId: "",
    formNm: "",
    formDesc: "",
    tempCd: "",
    tempNm: "",
    listFlg: "",
    addFlg: "",
    modFlg: "",
    delFlg: "",
    cancFlg: "",
    viewFlg: "",
    userChk: "",
    finYrChk: "",
    cashFlg: "",
    finImpactFlg: "",
    autoVoucherGenFlg: "",
    otpFlg: "",
    loginFlg: "",
    dataRestc: "",
    techRmks: "",
    actFlg: "A",
    ddActFlg: "",
    ddDataRestc: "0",
    dummyFlg: "N",
  });

  useEffect(() => {
    setFormData({
      id: rowData ? rowData.id : "",
      modId: editVal ? editVal.modId : "",
      modNm: editVal ? editVal.modNm : "",
      formId: editVal ? editVal.formId : "",
      formNm: editVal ? editVal.formNm : "",
      formDesc: editVal ? editVal.formDesc : "",
      tempCd: editVal ? editVal.tempCd : "",
      tempNm: editVal ? editVal.tempNm : "",
      // listFlg: editVal ? editVal.listFlg : "",
      addFlg: editVal ? editVal.addFlg : "",
      modFlg: editVal ? editVal.modFlg : "",
      delFlg: editVal ? editVal.delFlg : "",
      cancFlg: editVal ? editVal.cancFlg : "",
      viewFlg: editVal ? editVal.viewFlg : "",
      userChk: editVal ? editVal.userChk : "",
      finYrChk: editVal ? editVal.finYrChk : "",
      cashFlg: editVal ? editVal.cashFlg : "",
      finImpactFlg: editVal ? editVal.finImpactFlg : "",
      autoVoucherGenFlg: editVal ? editVal.autoVoucherGenFlg : "",
      otpFlg: editVal ? editVal.otpFlg : "",
      loginFlg: editVal ? editVal.loginFlg : "",
      dataRestc: editVal ? editVal.dataRestc : "",
      techRmks: editVal ? editVal.techRmks : "",
      actFlg: editVal ? editVal.actFlg : "",
      ddActFlg: editVal ? editVal.ddActFlg : "",
      ddDataRestc: editVal ? editVal.ddDataRestc : "",
      dummyFlg: editVal.dummyFlg ? editVal.dummyFlg : "N",
    });
  }, [rowData]);


 console.log(editVal);
  const handleInputChange = (event) => {
    setEditVal({ ...editVal, [event.target.name]: event.target.value });
    setFormData({ ...formData, [event.target.name]: event.target.value });
    
  };

  const handleStatusChange = (event) => {
    setEditVal({ ...editVal, [event.target.name]: event.target.value });
    setFormData({ ...formData, [event.target.name]: event.target.value });
    
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(editVal.prefixFlg);

    const addObj = {
      apiId: "SUA00023",
      criteria: {
        addFlg: editVal.addFlg ? editVal.addFlg : "N",
        autoVoucherGenFlg: editVal.autoVoucherGenFlg? editVal.autoVoucherGenFlg: "N" ,
        cancFlg: editVal.cancFlg ?  editVal.cancFlg: "N",
        cashFlg: editVal.cashFlg ? editVal.cashFlg: "N",
        dataRestc: editVal.dataRestc?editVal.dataRestc:"0",
        delFlg: editVal.delFlg ? editVal.delFlg : "N",
        finImpactFlg: editVal.finImpactFlg? editVal.finImpactFlg : "N",
        finYrChk: editVal.finYrChk ? editVal.finYrChk: "N",
        formDesc: editVal.formDesc,
        formNm: editVal.formNm,
        listFlg: editVal.listFlg ? editVal.listFlg : "N",
        loginFlg: editVal.loginFlg ? editVal.loginFlg : "N",
        modFlg: editVal.modFlg ? editVal.modFlg: "N",
        modId: editVal.modId,
        otpFlg: editVal.otpFlg ? editVal.otpFlg : "N",
        techRmks: editVal.techRmks,
        tempCd: editVal.tempCd,
        userChk: editVal.userChk ? editVal.userChk : "N",
        viewFlg: editVal.viewFlg ? editVal.viewFlg : "N",
        dummyFlg: editVal.dummyFlg ? editVal.dummyFlg : "N",
      }
    }

    const editObj = {
      
    apiId: "SUA00027",
    criteria: {
      actFlg: editVal.actFlg,
      addFlg: editVal.addFlg,
      autoVoucherGenFlg: editVal?.autoVoucherGenFlg,
      cancFlg: editVal?.cancFlg,
      cashFlg:editVal?.cashFlg ,
      dataRestc: editVal?.dataRestc,
      delFlg: editVal?.delFlg,
      finImpactFlg: editVal?.finImpactFlg,
      finYrChk: editVal?.finYrChk,
      formDesc: editVal?.formDesc,
      formId: editVal?.formId,
      formNm: editVal?.formNm,
      listFlg: editVal.listFlg,
      loginFlg: editVal.loginFlg,
        modFlg: editVal.modFlg,
        modId: editVal.modId,
        otpFlg: editVal.otpFlg,
        techRmks: editVal.techRmks,
        tempCd: editVal.tempCd,
        userChk: editVal.userChk,
        viewFlg: editVal.viewFlg,
        dummyFlg: editVal.dummyFlg ,
      }
    };
 
   

    if (mode === 1)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/saveAdd",
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
          if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
           resetForm();
          }
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 2)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/saveEdit",
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
          }
          // setMsg(res?.data?.appMsgList?.List[0]?.errorMessage +" ("+ res?.data?.appMsgList?.List[0]?.errorCode+")");
          // setMsgTyp(res?.data?.appMsgList?.List[0]?.errorType);
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
        });

    if (mode === 3)
      set_open(true)
       
  };

  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    //setConfirmStatus(true);
    const deleteObj = {
      apiId: "SUA00030",
      criteria: {
      formId: editVal?.formId,
      modId: editVal?.modId,
      }
    };  
      console.log(confirmStatus);
      await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00006/saveDelete",
        deleteObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData();
        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errTyp);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
      .catch((error) => {
        console.log("error");
      });
    
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





  const handleRowClick2 = (rowData2) => {
    setFormData(rowData2);
    setOpen2(false);
  };

  const [searchText2, setSearchText2] = useState("");
  const [filteredData2, setFilteredData2] = useState([]);

  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data);



  const closeModal2 = () => {
    setOpen2(false);
  };

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableData2.filter(
      (row2) =>
        row2.temp_code
          .toString()
          .toLowerCase()
          .includes(searchText2.toLowerCase()) ||
        row2.temp_name.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };


  // Character Count
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    formNm: false,
    formDesc: false,
    techRmks: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    console.log("xxxxxxxxx", name, "yyyyyyy", value);
    setEditVal({
      ...editVal,
      [name]: value === "Y" ? "N" : "Y",
    });
  };
  const resetForm=()=>{

    setEditVal({
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      formDesc: "",
      tempCd: "",
      tempNm: "",
      listFlg: "",
      addFlg: "",
      modFlg: "",
      delFlg: "",
      cancFlg: "",
      viewFlg: "",
      userChk: "",
      finYrChk: "",
      cashFlg: "",
      finImpactFlg: "",
      autoVoucherGenFlg: "",
      otpFlg: "",
      loginFlg: "",
      dataRestc: "0",
      techRmks: "",
      actFlg: "A",
        });
    setFormData({})
    /* setMsg('')
    setMsgTyp('') */
    console.log(formData);
    console.log(editVal);
  }

const resetForm1=()=>{

  setEditVal({
    modId: "",
    modNm: "",
    formId: "",
    formNm: "",
    formDesc: "",
    tempCd: "",
    tempNm: "",
    listFlg: "",
    addFlg: "",
    modFlg: "",
    delFlg: "",
    cancFlg: "",
    viewFlg: "",
    userChk: "",
    finYrChk: "",
    cashFlg: "",
    finImpactFlg: "",
    autoVoucherGenFlg: "",
    otpFlg: "",
    loginFlg: "",
    dataRestc: "0",
    techRmks: "",
    actFlg: "A",
      });
  setFormData({})
  console.log(formData);
  console.log(editVal);
}


const msgRef = useRef(null)
const [viewMsg, set_viewMsg] = useState(false)
useEffect(() => {
    if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
    set_viewMsg(false)

}, [viewMsg])

  return (
    <>
  
      <div className="container">
      {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }

        <h4 className="card-title">Form Master With Page Definition {getFormTitle(mode)}</h4>
        <form onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
          <div className=" row mb-4">
            <div className="col-md-3">
              <label for="exampleFormControlSelect1" className="col-form-label">
                <b>Module :</b>
                <span className="text-red">*</span>
              </label>
            </div>

            {/* <div className = "col-md-11 col-form-label d-inline"> */}

            <div className="col-md-9">
              <div className="input-group">
              {mode ===1 && (
   <span className="input-group-text bg-primary">
   <i
     className="fa fa-search d-inline text-white"
     onClick={() => setShowModel(true)}
   />
 </span>
)}
            
                <input
                  type="text"
                  aria-label="First name"
                  name="modId"
                  value={  editVal?.modId || ""}
                  // readOnly
                  required
                  className="form-control col-md-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode === 2|| mode === 3 || mode === 4}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  name="modNm"
                  value={editVal?.modNm || ""}
                  // readOnly
                  required
                  className="form-control col-md-9 mx-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode === 2|| mode === 3 || mode === 4}
                />
                 <div className="row-mb-12">
                    {showModel && (
                      <Lov
                        moduleLovData = {moduleGrpLovData}
                        setShowModel = {setShowModel}
                        showModel = {showModel}
                        handleRowClick = {handleRowClick}
                        columns = {moduleLovColumns}
                        currentSelection = {selectRow}
                        setCurrentSelection = {setSelectRow}
                      />
                    )}
                  </div>
              </div>
            </div>

         
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Form:<span className="text-red">*</span></label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                <input
                 required
                  className="form-control col-md-3 me-3 rounded-3"
                  type=""
                  name="formId"
                 value={editVal?.formId}
                  readOnly
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                />
                <input
                  className="form-control col-md-9 rounded-3"
                  type="text"
                  name="formNm"
                 value={editVal?.formNm}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder=""
                  required
                  maxLength={100}
                  onFocus={() => toggleCharCountVisibility("formNm")}
                  onBlur={() => toggleCharCountVisibility("formNm")}
                />
                {fieldCharCountVisibility.formNm && (
                  <span className="input-group-text">
                    {formData?.formNm?.length}/100
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">
                Form Description:<span className="text-red">*</span>
              </label>
            </div>
            <div className="col-md-9 input-group">
              <textarea
                className="form-control"
                type="text"
                name="formDesc"
                value={editVal?editVal.formDesc:''}
                onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
               // placeholder="form_desc"
                required
                maxLength={2000}
                onFocus={() => toggleCharCountVisibility("formDesc")}
                onBlur={() => toggleCharCountVisibility("formDesc")}
              />
              {fieldCharCountVisibility.formDesc && (
                <span className="input-group-text">
                 {formData?.formDesc?.length}/2000 
                </span>
              )}
            </div>
          </div>
          {(mode!==1)&&<div className=" row mb-4">
            <div className="col-md-3">
              <label for="exampleFormControlSelect1" className="col-form-label">
                <b>Template:</b>
                <span className="text-red">*</span>
              </label>
            </div>

            {/* <div className="col-md-11 col-form-label d-inline"> */}

            <div className="col-md-9">
              <div className="input-group">
            {/*   {mode !== 3 && mode !== 4 && (
   <span className="input-group-text bg-primary">
   {" "}
   <i
     className="fa fa-search d-inline text-white"
     title=""
     onClick={() => openModal2()}
   ></i>
 </span>
)} */}
               
                <input
                  type="text"
                  aria-label="First name"
                  name = "tempCd"
                  required
                  value={editVal?.tempCd || ""}
                  readOnly
                  className="form-control col-md-2 rounded-3"
                  onChange = {handleInputChange}
                  disabled = {mode === 3 || mode === 4}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  name = "tempNm"
                  required
                  value={editVal?.tempNm || ""}
                  readOnly
                  className="form-control col-md-9 mx-2 rounded-3"
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                />
              </div>
            </div>

            {/* Modal */}

            {open2 && (
              <Modal show={open2} onHide={closeModal2} style={{ zIndex: 9999 }}>
                <Modal.Header closeButton>
                  <ModalTitle>Create New Account</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                  <div className="table-responsive">
                    <h2>Search Modal</h2>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        value={searchText2}
                        onChange={(e) => setSearchText2(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearch2}
                      >
                        Search
                      </button>
                    </div>
                    <table className="table table-bordered dta-tabl">
                      <thead>
                        <tr>
                          <th>Column 1</th>
                          <th>Column 2</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData2.map((row2) => (
                          <tr
                            key={row2.id}
                            onClick={() => handleRowClick2(row2)}
                          >
                            <td>{row2.temp_code}</td>
                            <td>{row2.temp_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Modal.Body>
                {/* Close modal button */}
                <Modal.Footer>
                  <button onClick={() => setOpen2(false)}>Close</button>
                </Modal.Footer>
              </Modal>
            )}
            {/* Input fields */}

            {/* </div> */}
          </div>}
          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="listFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.listFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                     {editVal?.listFlg === "Y" ? (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="listFlg"
                    value={editVal?.listFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    name="listFlg"
                    value={editVal?.listFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">List</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
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
                    {editVal.addFlg === "Y" ? (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="addFlg"
                    value={editVal.addFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    name="addFlg"
                    value={editVal.addFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Addittion</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="modFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.modFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                         {editVal.modFlg === "Y" ? (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="modFlg"
                    value={editVal.modFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    name="modFlg"
                    value={editVal.modFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Modification</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="delFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.delFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                   {editVal.delFlg === "Y" ? (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="delFlg"
                    value={editVal.delFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                    className="custom-control-input"
                    type="checkbox"
                    name="delFlg"
                    value={editVal.delFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Deletetion</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="cancFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.cancFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                   {editVal.cancFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="cancFlg"
                    value={editVal.cancFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="cancFlg"
                    value={editVal.cancFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Cancellation</span>
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="viewFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value = {editVal.viewFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                    {editVal.viewFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="viewFlg"
                    value={editVal.viewFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="viewFlg"
                    value={editVal.viewFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">view</span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                 {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "userChk"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.userChk}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                    {editVal?.userChk=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="userChk"
                    value={editVal?.userChk}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="userChk"
                    value={editVal?.userChk}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">
                    Check User Authentication
                  </span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                 {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "finYrChk"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.finYrChk}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                     {editVal?.finYrChk=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="finYrChk"
                    value={editVal?.finYrChk}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="finYrChk"
                    value={editVal?.finYrChk}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">
                    Check Financial Year
                  </span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/* <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "cashFlg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.cashFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                    {editVal?.cashFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="cashFlg"
                    value={editVal?.cashFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="cashFlg"
                    value={editVal?.cashFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className = "custom-control-label">Cash Transaction</span>
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                {/*   <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "finImpactFlg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.finImpactFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                     {editVal?.finImpactFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="finImpactFlg"
                    value={editVal?.finImpactFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="finImpactFlg"
                    value={editVal?.finImpactFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className = "custom-control-label">Financial Impact</span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                 {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "auto_vou_gen_flg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {formData.auto_vou_gen_flg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                    {editVal?.autoVoucherGenFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="autoVoucherGenFlg"
                    value={editVal?.autoVoucherGenFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="autoVoucherGenFlg"
                    value={editVal?.autoVoucherGenFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">
                    Auto Voucher Generate
                  </span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                 {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="otpFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.otpFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}

{editVal?.otpFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="otpFlg"
                    value={editVal?.otpFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="otpFlg"
                    value={editVal?.otpFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}


                  <span className="custom-control-label">OTP</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                {/*   <input
                    type="checkbox"
                    className="custom-control-input"
                    name="loginFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.loginFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}

{editVal?.loginFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="loginFlg"
                    value={editVal?.loginFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="loginFlg"
                    value={editVal?.loginFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Login</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                {/*   <input
                    type="checkbox"
                    className="custom-control-input"
                    name="loginFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.loginFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}

{editVal?.dummyFlg=== "Y" ? (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    checked={true}
                    name="dummyFlg"
                    value={editVal?.dummyFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                ) : (
                  <input
                  className="custom-control-input"
                    type="checkbox"
                    name="dummyFlg"
                    value={editVal?.dummyFlg}
                    onChange={handleCheckboxChange}
                    disabled={mode === 3 || mode === 4}
                  />
                )}
                  <span className="custom-control-label">Dummy</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Check Data Restriction:</label>
            </div>
            <div className="col-sm-9 input-group">
              <select
                required
                className="from-group col-md-12 rounded-3 border"
               // aria-label="Default select example"
                name="dataRestc"
                value={(formData?.dataRestc)||(editVal?.dataRestc)}
                onChange={handleStatusChange}
              
                disabled={mode === 3 || mode === 4}
              >
                 <option disabled>--Select--</option>
                 {mode === 1
    ? (addVal?.ddDataRestc?.map((item) => (
        <option key={item?.value} value={item?.value}>
          {item.label}
        </option>
      )))
    : (editVal?.ddDataRestc?.map((item) => (
        <option key={item?.value} value={item?.value}>
          {item.label}
        </option>
      )))
  } 
              </select>
             

            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Technical Remarks :</label>
            </div>
            <div className="col-md-9 input-group">
              <textarea
                className="form-control"
                type = "text"
                name = "techRmks"
                value = {editVal?editVal.techRmks:""}
                onChange = {handleInputChange}
                disabled={mode === 3 || mode === 4}
                placeholder = ""
                maxLength={500}
                onFocus={() => toggleCharCountVisibility("techRmks")}
                onBlur={() => toggleCharCountVisibility("techRmks")}
              />
              {fieldCharCountVisibility.techRmks && (
                <span className="input-group-text">
                  {editVal?.techRmks?.length}/500
                </span>
              )}
            </div>
          </div>

         {(mode !==1) && <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Status:</label>
            </div>
            <div className="col-sm-9 input-group">
              <select
                required
                className="from-group col-md-12 rounded-3 border"
                //aria-label="Default select example"
                name="actFlg"
                value={(formData.actFlg)||editVal.actFlg}
                onChange={handleStatusChange}
               // defaultValue="NA"
                disabled={mode === 3 || mode === 4}
              >
                 <option disabled>--Select--</option>
              {(mode===1)?
    (addVal?.ddActFlg?.map((item)=>(
        <option value={item?.value}>{item?.label}</option>
    ))):(editVal?.ddActFlg?.map((item)=>(
        <option value={item?.value}>{item?.label}</option>
    )))
} 
              </select>
             

            </div>
          </div>}

          {mode !== 4 && (
          <button
            type="submit"
            disabled={delStatus}
            className="btn btn-primary"
          >
            {buttonTitle(mode)}
          </button>
        )}
        {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="reset"
                //onClick="resetForm"
                onClick={(e)=>resetForm()}
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
    </>
  );
};
export default FormM;
