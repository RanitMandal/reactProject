import React, { useRef, useEffect, useState } from "react";
import DynamicTreeMenu from './Tree2.js'
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };


export const EventMasterForm = ({ editMode, editVal, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, queryInputObj, index, addVal, setEditVal,  updateEditVal,msg, msgTyp, setMsg, setMsgTyp, setQueryInputObj, errExp, set_errExp, parErrExp, set_parErrExp, }) => {
  const fetchData = async ()=>{
      
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00003/getListPageData', queryInputObj, {headers}).then((res)=>{
      console.log(res.data); 
      setData(res.data?.content?.qryRsltSet);
     
      console.log(data); 
    })
}
  console.log(mode);
  // console.log(rowData.evtId);
  console.log(rowId);


  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
      set_viewMsg(false)
  
  }, [viewMsg])

   //Module Group Lov Starts
   const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
   useEffect(() => {
    const modGrpLovObj = {
      apiId : "SUA00173",
     
  } 
    
     const fetchModuleGrpLovData = async () => {
       await axios
         .post(
           process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/getAllModGrp", modGrpLovObj,
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
     return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId ?moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId:"";
   };
 
   const [selectRow, setSelectRow] = useState("");
   const [selectRowModGrp, setSelectRowModGrp] = useState("");
   const [showModel, setShowModel] = useState(false);
   const handleRowClick = (rowData) => {
     setSelectRow(rowData);
     setSelectRowModGrp(rowData)
     setSelectRowModuleLov({});
    //  setEditVal({...editVal,modGrpId:""})
     updateEditVal({
       ...editVal,
       modGrpId: getModuleGrpId(rowData),
       modGrpNm: getModuleGrpName(rowData),
       modId:"",
       modNm:"",
     });
    
   };
   //Module Group Lov ends
 
   //module Lov Starts
 
   const [moduleLovData, setModuleLovData] = useState([]);
   useEffect(() => {
    const formLovObj = {
      apiId: "SUA00174",
      criteria: {
      modGrpId: getModuleGrpId(selectRow)||editVal.modGrpId,
      }
    };
     const fetchModuleLovData = async () => {
       await axios
         .post(
           process.env.REACT_APP_API_URL_PREFIX +
             "/SUF00003/getModMstByModGrp",
           formLovObj,
           { headers }
         )
         .then((res) => {
           console.log(res.data);
           setModuleLovData( res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
         
         });
     };
 
     (editVal||selectRowModGrp) && fetchModuleLovData();
   }, [selectRowModGrp, editVal.modGrpId]);
 
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
       menuId:"",
       menuNm:""
     });

 
    
     
   };
 
   //module Lov Ends

   
   useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");
    
    let modGrpId = editVal?.modGrpId||""
    let resIndex = moduleGrpLovData.findIndex(item=> item.modGrpId === modGrpId)
    let currentModGrpId = {}
    if(resIndex !== -1) currentModGrpId = {[resIndex]: true}
    setSelectRow(currentModGrpId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);

    let modId = editVal?.modId||""
    let resModIndex = moduleLovData.findIndex(item=> item.modId === modId)
    let currentModId = {}
    if(resModIndex !== -1) currentModId = {[resModIndex]: true}
    setSelectRowModuleLov(currentModId)
  
    
   
    
    }, [rowData, editVal, moduleGrpLovData, moduleLovData])




   useEffect(() => {
    if (mode === 1) {
      setEditVal({
        modGrpId: "",
        modGrpNm: "",
        modId: "",
        modNm: "",
        evtId: "",
        evtNm: "",
        evtDesc: "",
        menuId: "",
        menuNm: "",
        orderBy: 0,
        actFlg: "",
      });
    }
  }, [mode]); 

  const [formData, setFormData] = useState({
    id: '',
    evtId: '',
    evtNm: '',
    evtDesc: '',
    menuNm: '',
    orderBy: 0,
    modGrpId: '',
    modGrpNm: '',
    modId: '',
    modNm: '',
    menuId: '',
    
    actFlg: 'A',
  });


  useEffect(() => {
    setFormData({
      id: rowData ? rowData.id : '',
      evtId: rowData ? rowData.evtId : '',
      evtNm: rowData ? rowData.evtNm : '',
      evtDesc: rowData ? rowData.evtDesc : '',
      menuNm: editVal ? editVal.menuNm : '',
      orderBy: editVal ? editVal.orderBy : 0,
      modGrpId: editVal ? editVal.modGrpId : '',
      modGrpNm: editVal ? editVal.modGrpNm : '',
      modId: editVal ? editVal.modId : '',
      modNm: editVal ? editVal.modNm : '',
      menuId: editVal ? editVal.menuId : '',
      
      actFlg: rowData ? editVal.actFlg : 'A',
    });
  }, [rowData]);
  




  const handleInputChange = (event) => {
    // const { name, value } = event.target;
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEditVal({ ...editVal, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEditVal({ ...editVal, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if ((!formData.dev_nm.trim()) || (formData.dev_nm.trim() === "")) {
      return false;
    }
    if ((!formData.addr.trim()) || (formData.addr.trim() === "")) {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
    setMsg("")
    setMsgTyp("")
    setFormData({
      id: '',
      evtId: '',
      evtNm: '',
      evtDesc: '',
      menuNm: '',
      evnt_code: '',
      evnt_name: '',
      evnt_desc: '',
      evnt_post: '',
      menu_code: '',
      menu_name: '',
      act_flg: 'A'
    })
    setEditVal({
      modGrpId: "",
      modGrpNm: "",
      modId: "",
      modNm: "",
      evtId: "",
      evtNm: "",
      evtDesc: "",
      menuId: "",
      menuNm: "",
      orderBy: 0,
      actFlg: "A",
    })

  };
  const resetForm1 = () => {
   /*  setMsg("")
    setMsgTyp("") */
    setSelectRow({})
    setSelectRowModuleLov({})
    setFormData({
      id: '',
      evtId: '',
      evtNm: '',
      evtDesc: '',
      menuNm: '',
      evnt_code: '',
      evnt_name: '',
      evnt_desc: '',
      evnt_post: '',
      menu_code: '',
      menu_name: '',
      act_flg: 'A'
    })
    setEditVal({
      modGrpId: "",
      modGrpNm: "",
      modId: "",
      modNm: "",
      evtId: "",
      evtNm: "",
      evtDesc: "",
      menuId: "",
      menuNm: "",
      orderBy: 0,
      actFlg: "A",
    })

  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(editVal.prefixFlg);
    const addObj ={ 
    apiId: "SUA00133",
   mst: [
      {
        actFlg: formData?.actFlg||editVal.actFlg,
        evtDesc: editVal.evtDesc,
        evtNm: editVal.evtNm,
        menuId: editVal.menuId,
        modId: editVal.modId,
        orderBy: editVal.orderBy,
      }
    ]
  }
  
   
    

    const editObj = {
      apiId: "SUA00135",
      mst: {
  actFlg: formData.actFlg? formData.actFlg : 'A',
    evtDesc: formData.evtDesc,
    evtId: formData.evtId,
      evtNm: formData.evtNm,
      menuId: editVal.menuId,
      menuNm: editVal.menuNm,
    modId: editVal.modId,
    orderBy: editVal.orderBy,
      }
    };
    

    if (mode === 1)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/saveAdd",
          addObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
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
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData();
          }
          // setMsg(res?.data?.appMsgList?.List[0]?.errorMessage +" ("+ res?.data?.appMsgList?.List[0]?.errorCode+")");
          // setMsgTyp(res?.data?.appMsgList?.List[0]?.errorType);
          if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
            resetForm1();
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
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/saveEdit",
          editObj,
          { headers }
        )
        .then((res) => {
          
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
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
          }
          // setMsg(res?.data?.appMsgList?.List[0]?.errorMessage +" ("+ res?.data?.appMsgList?.List[0]?.errorCode+")");
          // setMsgTyp(res?.data?.appMsgList?.List[0]?.errorType);
        })
        .catch((error) => {
          console.log("error");
        }).finally(() => {
          set_viewMsg(true)
      });

    if (mode === 3)
     set_openDel(true)
       
  };

  const [openDel, set_openDel] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "SUA00138",
      mst: {
      evtId: formData.evtId,
      modId: editVal.modId,
      }
    };
  await axios
  .post(
    process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/saveDelete",
    deleteObj,
    { headers }
  )
  .then((res) => {
   
    
    if (!res?.data?.appMsgList?.errType) {
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
  const buttonTitle =(mode) => {
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
    evtNm: false,
    evtDesc: false,
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

  const [open, setOpen] = useState(false);
  const [tableDat, setTableDat] = useState(data);

  // const handleRowClick = (rowData) => {
  //   setSelectRow(rowData);
  // };
  const openModal = () => {
  
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  const handleClear = ()=>{
    // setValue({
    //   ...value,
    //   id: "",
    //   text: "",
  
    // })
    setEditVal({
      ...editVal,
      menuId:"",
      menuNm:""
    })
    setOpen(false)
  }
  console.log(formData.menuNm);



  return (
    <>
      <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> } 
        <h4 className="card-title">Event Master {getFormTitle(mode)}</h4>
        <form id="myForm" onSubmit = {(e) => handleSubmit(e, mode, data, setData, onClose)} >
          <div class="row mb-2 ms-2 ">
          <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Module Group<span className="text-red">*</span>
              </label>
              <div className="col-md-9">
                <div className="input-group">
                {mode !== 3 && mode !== 4 && (
  <span className="input-group-text bg-primary">
    <i
      className="fa fa-search d-inline text-white"
      onClick={() => setShowModel(true)}
    />
  </span>
)}

                  <input
                    type="text"
                    required
                    aria-label="First name"
                    className="form-control  col-md-2"
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
                    required
                    aria-label="Last name"
                    className="form-control col-md-9 mx-2  mx-4"
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
                        moduleLovData={moduleGrpLovData}
                        setShowModel={setShowModel}
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
              

                    {mode !== 3 && mode !== 4 && (
  <span className="input-group-text bg-primary">
    <i
      className="fa fa-search d-inline text-white"
      onClick={() => setShowModelModuleLov(true)}
    />
  </span>
)}


                  <input
                    type="text"
                    aria-label="First name"
                    className="form-control col-md-2 "
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
                    className="form-control col-md-9 mx-2  mx-4"
                    value={editVal.modNm}
                     required
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
                    // readOnly
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
          </div>
          <div className="container border border-2">
            {/* <div className=" row mb-4 my-2 ">
            <div className="col-md-3">
              <label htmlFor="zip" className="form-label">
                Row#:<span className="text-red">*</span>
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="number"
                min="0"
                className="form-control"
                id="zip"
                placeholder="Enter your pin code"
              />
            </div>
          </div> */}
            <div className=" row mb-4">
              <div className="col-md-3">
                <label for="eventid" className="form-label">
                  EventId:
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type=""
                  className="form-control ui_displayd_txt_"
                  id="evtId"
                  name="evtId"
                  //placeholder="Event Id"
                  value={formData.evtId} onChange={handleInputChange}
                  disabled

                // pattern="\d{10}"

                //onInput={validatePhoneNumber}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <div className="col-md-3">
                <label htmlFor="eventname" className="form-label">
                  Event Name:<span className="text-red">*</span>
                </label>
              </div>
              <div className="col-md-9 input-group">
                <input
                  type="text"
          required

                  className="form-control ui_entryd_txt_rc"
                  name="evtNm"
                  placeholder=""
                  value={formData.evtNm} onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  maxLength={200} onFocus={() => toggleCharCountVisibility("evtNm")}
              onBlur={() => toggleCharCountVisibility("evtNm")}
            />
            {fieldCharCountVisibility.evtNm && (
              <span className="input-group-text">
                {formData.evtNm.length}/200
              </span>
            )}
              </div>
            </div>

            <div className=" row mb-4">
              <div className="col-md-3">
                <label htmlFor="eventdesc" className="form-label ">
                  Event Description:<span className="text-red">*</span>
                </label>
              </div>
              <div className="col-md-9 input-group">
                <input
                  type="text"
required

                  className="form-control ui_entryd_txt_rc"
                  name="evtDesc"
                  placeholder="Event Description"
                  value = {formData.evtDesc} onChange={handleInputChange}
                  disabled = {mode === 3 || mode === 4}
                  maxLength={1000} onFocus={() => toggleCharCountVisibility("evtDesc")}
              onBlur={() => toggleCharCountVisibility("evtDesc")}
            />
            {fieldCharCountVisibility.evtDesc && (
              <span className="input-group-text">
                {formData.evtDesc.length}/1000
              </span>
            )}
              </div>
            </div>

            <div className=" row mb-4">
              <label
                for="exampleFormControlSelect1"
                className="col-md-3 col-form-label"
              >
                <b>Menu Id:</b>
                <span className="text-red">*</span>
              </label>
              {/* <div className="col-md-11 col-form-label d-inline"> */}
              <div className="col-md-9">
                <div className="input-group">
               
                    {mode !== 3 && mode !== 4 && (
  <span className="input-group-text bg-primary">
    <i
      className="fa fa-search d-inline text-white"
      onClick={() => openModal(true)}
    />
  </span>
)}
                  <input type="text" aria-label="First name" value = {editVal?.menuId || ""} required
                 className="form-control col-md-12 rounded-3 ui_entryd_txt_rl" onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  />

                </div>
              </div>

              {/* Modal */}

              {open && (
                <Modal scrollable show={open} onHide={closeModal} style={{zIndex:9999}}>
                  <Modal.Header closeButton>
                    <ModalTitle>select a Menu</ModalTitle>
                  </Modal.Header>
                  <Modal.Body>
            
                    <DynamicTreeMenu  editVal ={editVal} setEditVal = {setEditVal} closeModal = {closeModal}/>
                  </Modal.Body>
                  {/* Close modal button */}
                  <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => setOpen(false)}>Close</button>
                    <button className="btn btn-primary" onClick={handleClear}>Clear</button>

                  </Modal.Footer>
                </Modal>
              )}
              {/* Input fields */}


            </div>

            <div className=" row mb-4">
              <div className="col-md-3">
                <label htmlFor="name" className=" form-label">
                  Name:
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control ui_displayd_txt_"
                  name="menuNm"
                  placeholder="Name"
                  value={editVal.menuNm || ""} 
                  disabled={mode === 3 || mode === 4}
                />
              </div>
            </div>

            <div className=" row mb-4">
              <div className="col-md-3 ">
                <label htmlFor="eventpost" className="form-label">
                  Event Position:
                </label>
              </div>

              <div className="col-md-9">
                <input
                  type="number"
                  className="form-control ui_entry_int_p"
                  name="orderBy"
                  placeholder="Event Position"
                  maxLength={3}
                  value = {editVal.orderBy} onChange = {handleInputChange}
                  disabled={mode === 3 || mode === 4}
                />
              </div>
            </div>

            <div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Status:<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                        <select
                        className="form-select col-md-12"
                        name="actFlg"
                        required
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={(formData.actFlg)||editVal.actFlg}
                        placeholder="Select"
                        disabled={mode===3 || mode===4}
                      >
                       <option disabled>--Select--</option>

{(mode===1)?
    (addVal?.ddActFlg?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(editVal?.ddActFlg?.map((item)=>(
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

            {mode !== 4 && <button disabled={delStatus} type="submit" className = 'btn btn-primary'>{buttonTitle(mode)}</button>}
            {mode == 1 && <button
              className="btn btn-secondary mx-2"
              type="reset"
              //onClick="resetForm"
              onClick = {(e) => resetForm()}
            >
              Reset
            </button>}
          </div>
        </form>

        <ConfirmDialog
  title="Confirmation" 
  open={openDel} 
  setOpen={set_openDel} 
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

//example of creating a mui dialog modal for creating new rows
