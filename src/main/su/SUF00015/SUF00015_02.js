import React, { useState, useEffect, useRef} from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { stateLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const DistrictMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, errExp, set_errExp, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/getListPageData', queryInputObj, { headers }).then((res) => {
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

  const [formData, setFormData] = useState({});
useEffect(() => {
  if(mode!==1){
    setFormData({
      id: rowData ? rowData.id : '',
      stateCd: rowData ? rowData.stateCd : '',
      stateNm: rowData ? rowData.stateNm : '',
      distCd: rowData ? rowData.distCd : '',
      distNm: rowData ? rowData.distNm : '',
      actFlg: edtVal ? edtVal.actFlg : 'A',
    })
  }else{
    setFormData({
      
      stateCd: '',
      stateNm: '',
      distCd:'',
      distNm:  '',
      actFlg: 'A',
    })
  }
  
}, [mode, edtVal, rowData])

  




  const [showCharacterCount, setShowCharacterCount] = useState(false);











  // State Lov Starts........
  const [stateLovData, setStateLovData] = useState([]);
  useEffect(() => {

    const fetchStateLovData = async () => {
      let obj = {
        apiId: "SUA00158"
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00015/getAllState", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchStateLovData();
  }, []);


  const getStateNm = (obj) => {
    return stateLovData[Number(Object.keys(obj)[0])]?.stateNm
  }

  const getStateCd = (obj) => {
    return stateLovData[Number(Object.keys(obj)[0])]?.stateCd
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowStateLov, setSelectRowStateLov] = useState("");
  const [showModelStateLov, setShowModelStateLov] = useState(false);
  const handleRowClickStateLov = (rowData) => {
    console.log(rowData)
    setSelectRow(rowData);
    setSelectRowStateLov(rowData);
    //   setQueryInputObj({ 

    //         stateCd: getStateCd(rowData),


    // })
  };
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
    setSelectRow('')
    setSelectRowStateLov("")
    setFormData({
      id: '',
      stateCd: '',
      stateNm: '',
      distCd: '',
      distNm: '',
      actFlg: 'A'
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
    console.log(selectRowStateLov);

    const addObj = {
      apiId: "SUA00195",
      mst: [

        {
          distCd: formData.distCd,
          distNm: formData.distNm,
          stateCd: getStateCd(selectRowStateLov),
          actFlg: formData.actFlg
        }

      ]
    }

    const editObj = {
      apiId: "SUA00196",
      mst: {

        distCd: formData.distCd,
        distNm: formData.distNm,
        stateCd: edtVal?.stateCd,
        actFlg: formData.actFlg

      }
    }
   

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveAdd', addObj, { headers }).then(res => {
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveEdit', editObj, { headers }).then(res => {
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
          apiId: "SUA00197",
          mst: {
    
            distCd: formData.distCd
    
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveDelete', deleteObj, { headers }).then(res => {
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
        <h4 className="card-title">District Master {getFormTitle(mode)}</h4>
        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
        {(mode === 1) ? <div className="row mb-2 mx-2 ">
          <label className="col-sm-3 col-form-label"><b>State:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                value={getStateCd(selectRowStateLov) ? getStateCd(selectRowStateLov) : ''}
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"

                value={getStateNm(selectRowStateLov) ? getStateNm(selectRowStateLov) : ''}
              />
              <div className="row-mb-12">
                {showModelStateLov && <Lov
                  moduleLovData={stateLovData}
                  setShowModel={setShowModelStateLov}
                  showModel={showModelStateLov}
                  handleRowClick={handleRowClickStateLov}
                  columns={stateLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>

          </div>
        </div> : <div className="row mb-2 mx-2 ">
          <label className="col-sm-3 col-form-label"><b>State:</b></label>
          <div className="col-md-9">
            <div className="input-group">
              {/* <span className="input-group-text rounded-circle border border-primary">
                            
                            <FontAwesomeIcon
                              icon={faSearch}
                              style={{ color: "blue" }}
                              onClick={()=> setShowModelStateLov(true)}
                            />
                          </span> */}

              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                disabled={mode !== 1}
                value={edtVal?.stateCd}
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                disabled={mode !== 1}
                value={edtVal?.stateNm}
              />
              {/* <div className="row-mb-12">
                                {showModelStateLov && <Lov 
                                moduleLovData={stateLovData} 
                                setShowModel={setShowModelStateLov} 
                                showModel={showModelStateLov}
                                handleRowClick={handleRowClickStateLov}
                                columns={stateLovColumns}
                                />}
                            </div> */}
            </div>
          </div>
        </div>}
        <div className="container border mb-4">

          <div className="">
            

              <div className=" row mb-4">
                <label className="col-md-3 form-label">
                  Code<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type="number"
                    name="distCd"
                    value={formData?.distCd} onChange={handleInputChange}
                    disabled={mode !== 1}
                    placeholder="Code"
                    required
                    maxLength={3}
                  />
                  {formData?.distCd == "" ? <span className="input-group-text d-none">{formData?.distCd?.length}/3</span> : <span className="input-group-text">{formData?.distCd?.length}/2</span>}

                </div>
              </div>
              <div className=" row mb-4 py-4">
                <label className="col-md-3 form-label">
                  District<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control"
                    type=""
                    name="distNm"
                    value={formData?.distNm} onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                    placeholder="District Name"
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
                  {showCharacterCount && (
                    <span className="input-group-text">{formData?.distNm?.length}/100</span>
                  )}
                  {/* {(formData.Dist_name || '').length === 0 ? (
                    <span className="input-group-text d-none">{(formData.Dist_name || '').length}/100</span>
                  ) : (
                    <span className="input-group-text">{(formData.Dist_name || '').length}/100</span>
                  )} */}

                </div>
              </div>
              <div className="row mb-4">
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
                    value={(formData?.actFlg) || edtVal?.actFlg}
                    placeholder="Select"
                  >
                    <option disabled>--Select--</option>

                    {(mode === 1) ?
                      (addVal?.ddActFlg?.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))) : (edtVal?.ddActFlg?.map((item) => (
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

export default DistrictMasterForm;