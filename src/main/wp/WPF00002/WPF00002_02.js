import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"

import { portalLovColumns } from "./columns";
import TreeView from "deni-react-treeview";
import { Card, Modal, ModalTitle } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const MenuTypeMasterAdd = ({ editMode, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {
  
  const fetchData = async () => {
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00002/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

 
 
   const [formData, setFormData] = useState({
    "actFlg": "A",
    "menuTypDesc": "",
    "menuTypId": "",
    "menuTypTitle": "",
    "portalId": "",
    "portalTitle": ""
   })
  useEffect(() => {
if(mode!==1){
    setFormData({
    "actFlg": edtVal?.actFlg || "A",
    "menuTypDesc": edtVal?.menuTypDesc || "",
    "menuTypId": edtVal?.menuTypId || "",
    "menuTypTitle": edtVal?.menuTypTitle || "",
    "portalId": edtVal?.portalId || "",
    "portalTitle": edtVal?.portalTitle || ""
    
    })
  }
  }, [edtVal, mode])
  

//portal Id lov calling
const [portalLovData, setPortalLovData] = useState([]);

useEffect(() => {

  const categoryLovData = async () => {
    let obj = {
      apiId: 'WPA00010'
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/WPF00002/getAllPortal", obj, { headers })
      .then((res) => {
        console.log(res.data);
        setPortalLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
        // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

      });
  };
  categoryLovData();
}, []);
const getPortalId = (obj) => {
  return portalLovData[Number(Object.keys(obj)[0])]?.portalId ? portalLovData[Number(Object.keys(obj)[0])]?.portalId : ""
}

const getPortalTitle = (obj) => {
  return portalLovData[Number(Object.keys(obj)[0])]?.portalTitle ? portalLovData[Number(Object.keys(obj)[0])]?.portalTitle : ""
}
const [selectRow, setSelectRow] = useState("");
const [showModelPortalLov, setShowModelPortalLov] = useState(false);
const handleRowClickPortalLov = (rowData) => {
  setSelectRow(rowData);
  setShowModelPortalLov(rowData);
  setFormData({
    ...formData,
    portalId: getPortalId(rowData),
    portalTitle: getPortalTitle(rowData)
   
  })

};
//portal Id lov calling end



 
    

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
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
    setSelectRow({})
    setFormData({
      "actFlg": "A",
    "menuTypDesc": "",
    "menuTypId": "",
    "menuTypTitle": "",
    "portalId": "",
    "portalTitle": ""
    })

  };
 

  const [charCount, setCharCount] = useState({

    menuTypTitle: false,
    menuTypDesc: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      "apiId": "WPA00017",
      "mst": {
    "menuTypDesc": formData?.menuTypDesc,
    "menuTypId": formData?.menuTypId,
    "menuTypTitle":formData?.menuTypTitle,
    "portalId": formData?.portalId,
      
      }
    }


    const editObj = {
      "apiId": "WPA00019",
      "mst": {
        "actFlg": formData?.actFlg,
        "menuTypDesc": formData?.menuTypDesc,
       "menuTypId": formData?.menuTypId,
      "menuTypTitle":formData?.menuTypTitle,
       "portalId": formData?.portalId,
        
      }
    }
    const deleteObj = 
      {
        "apiId": "WPA00018",
        "mst": {
          "menuTypId": formData?.menuTypId,
        }
      }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00002/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
       
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00002/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
       
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

      }).catch(error => {
        console.log("error")
      });


    if (mode === 3) {
      set_open(true)
      // Show confirmation dialog
      // Swal.fire({
      //     title: "Are you sure?",
      //     // text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes, delete it!",
      //     backdrop: true,
      // }).then((result) => {
      // if (result.isConfirmed) {
      // If user confirms, make the delete API call
      // if (window.confirm("Are you sure? The record will be deleted parmanantly")) {
      //   axios
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00001/saveDelete', deleteObj, { headers })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (!res?.data?.appMsgList?.errorStatus) {
      //         fetchData();
      //       }
      //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      //       set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      //     })
      //     .catch((error) => {
      //       console.log("error");
      //     });
      // }
      // });
    }

  };

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

  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj =   {
      "apiId": "WPA00018",
      "mst": {
        "menuTypId": formData?.menuTypId,
      }
    }

   
      axios
        .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00002/saveDelete', deleteObj, { headers })
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData();
          }
          set_delStatus(true)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
        })
        .catch((error) => {
          console.log("error");
        });
    
  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
      set_viewMsg(false)
  
  }, [viewMsg])





  return (
    <div>


      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">
          Menu Type Master   {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          
          <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b> Portal ID:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelPortalLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 3 || mode === 4}
                value={formData?.portalId}

              />
               <input
                type="text"
                autoComplete={false}
                className="form-control mx-3"
                //required
                disabled={mode === 3 || mode === 4}
                value={formData?.portalTitle}

              />
              <div className="row-mb-12">
                {showModelPortalLov && <Lov
                  moduleLovData={portalLovData}
                  setShowModel={setShowModelPortalLov}
                  showModel={showModelPortalLov}
                  handleRowClick={handleRowClickPortalLov}
                  columns={portalLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
               
            </div>
          </div>
        </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Menu Type Title:<span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="menuTypTitle"
                value={formData?.menuTypTitle}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Enter Title Here"
                required
                maxLength={25}
                disabled={mode === 3 || mode === 4}

              />{charCount?.menuTypTitle && <span className="input-group-text">{formData?.menuTypTitle?.length}/25</span>}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Menu Type Description:
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="menuTypDesc"
                value={formData?.menuTypDesc}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Enter Description Here"
                //required
                maxLength={30}
                disabled={mode === 3 || mode === 4}

              />{charCount?.menuTypDesc && <span className="input-group-text">{formData?.menuTypDesc?.length}/30</span>}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Menu Type ID:
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="menuTypId"
                value={formData?.menuTypId}
                //onChange={handleInputChange}
                //onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={50}
                disabled

              />

            </div>
          </div>
      
          
         { mode !==1 && (<div className="row mb-4">
            <label className="col-md-3 form-label">
              Status:
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4 || mode === 1}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.actFlg}

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
          </div>)}
          {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) => {
              resetForm();
              setMsg("");
              setMsgTyp("");
            }
            }
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

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}