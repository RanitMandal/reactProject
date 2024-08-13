import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Lov from "../../common/Lov _new";
import { userLovColumns } from "./columns";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const ExternalUserTypeMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/getListPageData', queryInputObj, { headers }).then((res) => {
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

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")

  const [formData, setFormData] = useState({
    extUserTypCd: rowData ? rowData.extUserTypCd : '',
    extUserTypDesc: rowData ? rowData.extUserTypDesc : '',
    actFlg: rowData ? rowData.actFlg : 'A',
    extModPrefix: rowData ? rowData.extModPrefix : '',
    userId: rowData ? rowData.userId : '',
     userNm: rowData ? rowData.userNm : '',
  });



  console.log(formData);

  useEffect(() => {
    if (mode === 1) {
      setEdtVal({
        extUserTypCd: '',
        extUserTypDesc: '',
        actFlg: 'A',
      })

    }
  }, [mode])


   //User Lov Starts     

   const [userLovData, setUserLovData] = useState([]);
   useEffect(() => {
 
     const fetchUserLovData = async () => {
       let obj = {
         apiId: 'SUA00628'
       }
       await axios
         .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/getAllUser', obj, { headers })
         .then((res) => {
           console.log(res.data);
           setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
 
         });
     };
     fetchUserLovData();
   }, []);
 
 
   const getUserNm = (obj) => {
     return userLovData[Number(Object.keys(obj)[0])]?.userNm ? userLovData[Number(Object.keys(obj)[0])]?.userNm : ""
   }
 
   const getUserId = (obj) => {
     return userLovData[Number(Object.keys(obj)[0])]?.userId ? userLovData[Number(Object.keys(obj)[0])]?.userId : ""
   }
 
   const [selectRow, setSelectRow] = useState("");
   const [selectRowUserLov, setSelectRowUserLov] = useState("");
   const [showModelUserLov, setShowModelUserLov] = useState(false);
   const handleRowClickUserLov = (rowData) => {
     setSelectRow(rowData);
     setSelectRowUserLov(rowData);
     setFormData({
       ...formData,
       userId:  getUserId(rowData), 
       userNm:  getUserNm(rowData),
      
     })
 
   };
   console.log(queryInputObj);
   //User Lov ends 



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

    setFormData({
      extUserTypCd: '',
      extUserTypDesc: '',
      actFlg: 'A',
      extModPrefix: '',
      userId:'',
      userNm: '',

    })

  };
  //  setEdtVal({
  //   modGrpId: '', 
  //   modGrpNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    extUserTypDesc: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    const{userNm,...obj}=formData
    


    const addObj =
    {
      apiId: "SUA00622",
      mst: [
        {
          userId: formData.userId,
          extModPrefix: formData.extModPrefix,
          extUserTypDesc: formData.extUserTypDesc,
          actFlg: formData.actFlg || edtVal.actFlg || "A"
        }
      ]
    }


    const editObj = {
      apiId: "SUA00625",
      mst: {

        ...obj

      }
    }
    const deleteObj = {
      apiId: "SUA00099",
      mst: {

        extUserTypCd: formData.extUserTypCd

      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/saveAdd', addObj, { headers }).then(res => {
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/saveEdit', editObj, { headers }).then(res => {
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
    const deleteObj = {
      apiId: "SUA00627",
      mst: {

        extUserTypCd: formData.extUserTypCd

      }
    }

   
      axios
        .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/saveDelete', deleteObj, { headers })
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
        External User Type Master  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

         {/* User Lov */}
         <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>User Id:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 3 || mode === 4}
                value={formData?.userId}

              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                required
                name="userNm"
                disabled={mode === 3 || mode === 4}
                value={formData?.userNm}

              />
              <div className="row-mb-12">
                {showModelUserLov && <Lov
                  moduleLovData={userLovData}
                  setShowModel={setShowModelUserLov}
                  showModel={showModelUserLov}
                  handleRowClick={handleRowClickUserLov}
                  columns={userLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>
          </div>
        </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Description <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="extUserTypDesc"
                value={formData.extUserTypDesc}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Description"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.extUserTypDesc && <span className="input-group-text">{formData.extUserTypDesc.length}/50</span>}

            </div>
          </div>

          
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Mod Prefix <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="extModPrefix"
                value={formData.extModPrefix}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Mod Prefix"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.extModPrefix && <span className="input-group-text">{formData.extModPrefix.length}/50</span>}

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
                value={edtVal.actFlg}

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
          {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) =>{
               resetForm();
               setMsg("");
               setMsgTyp("");
               }}
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