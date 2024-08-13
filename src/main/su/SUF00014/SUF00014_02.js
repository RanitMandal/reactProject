import React, { useState, useEffect, useRef} from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { developerLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const DeveloperMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp,setTableData2 }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      if(res.data?.content?.qryRsltSet[0]?.length){
      setTableData2(res?.data?.content?.qryRsltSet);
      }else{
        setTableData2([])
      }
      // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      console.log(data);
    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
useEffect(() => {
  if(mode===1)
  setEdtVal({})
}, [mode])

  const [formData, setFormData] = useState({
    fax: rowData ? rowData.fax : '',
    phNo: rowData ? rowData.phNo : '',
    devId: rowData ? rowData.devId : '',
    devNm: rowData ? rowData.devNm : '',
    addr: rowData ? rowData.addr : '',
    webSite: rowData ? rowData.webSite : '',
    pinNo: rowData ? rowData.pinNo : '',
    emailId: rowData ? rowData.emailId : '',
    actFlg: rowData ? rowData.actFlg : 'A',
  });


  const [showCharacterCount, setShowCharacterCount] = useState(false);











  // State Lov Starts........
  // const [stateLovData, setStateLovData] = useState([]);
  // useEffect(() => {

  //   const fetchStateLovData = async () => {
  //     let obj = {
  //       apiId: "SUA00158"
  //     }
  //     await axios
  //       .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00014/getAllState", obj, { headers })
  //       .then((res) => {
  //         console.log(res.data);
  //         setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

  //       });
  //   };
  //   fetchStateLovData();
  // }, []);


  // const getdevNm = (obj) => {
  //   return stateLovData[Number(Object.keys(obj)[0])]?.devNm
  // }

  // const getdevId = (obj) => {
  //   return stateLovData[Number(Object.keys(obj)[0])]?.devId
  // }

  // const [selectRow, setSelectRow] = useState("");
  // const [selectRowStateLov, setSelectRowStateLov] = useState("");
  // const [showModelStateLov, setShowModelStateLov] = useState(false);
  // const handleRowClickStateLov = (rowData) => {
  //   console.log(rowData)
  //   setSelectRow(rowData);
  //   setSelectRowStateLov(rowData);
  //   //   setQueryInputObj({ 

  //   //         stateCd: getStateCd(rowData),


  //   // })
  // };
  //State Lov ends   

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
    // setSelectRow('')
    // setSelectRowStateLov("")
    setFormData({
      code: '',
      webSite: '',
      devId: '',
      devNm: '',
      fax: '',
      emailId: '',
      actFlg: 'A',
      addr: '',
      phNo: '',
      pinNo: '',

    })

  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowStateLov);

    const addObj = {
      apiId: "SUA00509",
      mst: 

        {
          actFlg: formData.actFlg,
          addr: formData.addr,
          devNm: formData.devNm,
          emailId: formData.emailId,
          fax: formData.fax,
          phNo: formData.phNo,
          pinNo: formData.pinNo,
          webSite: formData.webSite,
          // devId: formData.devId
        }

      
    }

    const editObj = {
      apiId: "SUA00511",
      mst: {
    actFlg: formData.actFlg,
    addr: formData.addr,
    devId: formData.devId,
    devNm:formData.devNm,
    emailId: formData.emailId,
    fax: formData.fax,
    phNo: formData.phNo,
    pinNo: formData.pinNo,
    webSite: formData.webSite,
      }
    }
   

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/saveEdit', editObj, { headers }).then(res => {
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
      });


    if (mode === 3)
      set_open(true)
       

  };

  const [open, set_open] = useState(false)
      const [confirmStatus, setConfirmStatus] = useState(false);
      const [delStatus, set_delStatus] = useState(false);
      const handleConfirmation = async () => {
        const deleteObj = {
          apiId: "SUA00510",
          mst: {
    
            devId: formData.devId
    
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/saveDelete', deleteObj, { headers }).then(res => {
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
    }}
  return (
    <div>
      <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
        <h4 className="card-title">Developer Master {getFormTitle(mode)}</h4>
        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
       
        <div className=" mb-4">

          <div className="">
            

              <div className=" row mb-4">
                <label className="col-md-3 form-label">
                  Code
                  
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="devId"
                    value={formData.devId} onChange={handleInputChange}
                    disabled={mode !== 1}
                    placeholder="Code"
                    // required
                    readOnly
                    maxLength={3}
                  />
                  {/* {formData.distCd == "" ? <span className="input-group-text d-none">{formData?.distCd?.length}/3</span> : <span className="input-group-text">{formData.distCd.length}/2</span>} */}

                </div>
              </div>
              <div className=" row mb-4 ">
                <label className="col-md-3 form-label">
                  Developer Name<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="devNm"
                    value={formData.devNm} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Developer Name"
                    required
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/100</span>
                  )} */}
                  {/* {(formData.Dist_name || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.Dist_name || '').length}/100</span>
                  ) : (
                    <span className="input-group-text">{(formData.Dist_name || '').length}/100</span>
                  )} */}

                </div>
              </div>
              <div className=" row mb-4 ">
                <label className="col-md-3 form-label">
                  Address<span className="text-red">*</span>
                </label>
                <div className="col-md-9">
                
                  
                  <textarea required="" rows="5" cols="28" class="form-control" password="true" name="addr" placeholder="Enter Address"
                   value={formData.addr} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}></textarea>
                    {/* // className="form-control"
                    // type="text"
                    // name="addr"
                    // value={formData.addr} onChange={handleInputChange}
                    // disabled={mode === 3 || mode === 4}
                    // placeholder="Address"
                    required */}
                    {/* onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100} */}
                  
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/100</span>
                  )} */}
                  {/* {(formData.Dist_name || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.Dist_name || '').length}/100</span>
                  ) : (
                    <span className="input-group-text">{(formData.Dist_name || '').length}/100</span>
                  )} */}

                </div>
              </div>
              <div className=" row mb-4 ">
                <label className="col-md-3 form-label">
                  Pin No<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="pinNo"
                    value={formData.pinNo} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Pin No"
                    required
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/10</span>
                  )}
                   {(formData.pinNo || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.pinNo || '').length}/10</span>
                  ) : (
                    <span className="input-group-text">{(formData.pinNo || '').length}/10</span>
                  )}  */}

                </div>
              </div>
            
              <div className=" row mb-4 ">
                <label className="col-md-3 form-label">
                  Phone no<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="phNo"
                    value={formData.phNo} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Phone no"
                    required
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/10</span>
                  )}
                  {(formData.phNo || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.phNo || '').length}/10</span>
                  ) : (
                    <span className="input-group-text">{(formData.phNo || '').length}/10</span>
                  )} */}

                </div>
              </div>
              <div className=" row mb-4 ">
                <label className="col-md-3 form-label">
                  Fax
                  {/* <span className="text-red">*</span> */}
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="fax"
                    value={formData.fax} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Fax"
                    required
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/10</span>
                  )} */}
                  {/* {(formData.fax || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.fax || '').length}/10</span>
                  ) : (
                    <span className="input-group-text">{(formData.fax || '').length}/10</span>
                  )} */}

                </div>
              </div>
              <div className=" row mb-4">
                <label className="col-md-3 form-label">
                  Email Id<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="emailId"
                    value={formData.emailId} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Email Id"
                    required
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/100</span>
                  )} */}
                  {/* {(formData.emailId || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.emailId || '').length}/10</span>
                  ) : (
                    <span className="input-group-text">{(formData.emailId || '').length}/10</span>
                  )} */}

                </div>
              </div>
              <div className=" row mb-4">
                <label className="col-md-3 form-label">
                  Website
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="webSite"
                    value={formData.webSite} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="Website"
                    
                    onFocus={() => {
                      // Show character count when input is focused
                      setShowCharacterCount(true);
                    }}
                    onBlur={() => {
                      // Hide character count when input loses focus
                      setShowCharacterCount(false);
                    }}
                    maxLength={100}
                  />
                  {/* {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/100</span>
                  )} */}
                  {/* {(formData.webSite || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.webSite || '').length}/10</span>
                  ) : (
                    <span className="input-group-text">{(formData.webSite || '').length}/10</span>
                  )} */}

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
                    disabled={mode === 3 || mode === 4}
                    //defaultValue={edtVal.dtlActFlg}
                    onChange={handleStatusChange}
                    value={formData.actFlg}
                    placeholder="Select"
                  >
                    <option disabled>--Select--</option>
                    {/* <option> active</option>
                    <option> Inactive</option> */}

                    {(mode === 1) ?
                      (addVal?.ddActFlg?.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))) : (edtVal?.ddActFlg?.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      )))
                    }


                    {
    edtVal?.ddLongTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))
}
                  </select>
                </div>
              </div>
              {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
              {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="button"
                //onClick="resetForm"
                onClick={(e) => resetForm()}
              >
                Reset
              </button>}
           
          </div>

        </div>
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

export default DeveloperMasterForm;