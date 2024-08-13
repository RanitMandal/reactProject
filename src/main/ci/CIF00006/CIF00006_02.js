import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const OtherAdvocateDefinitionForm = ({ editMode, post,  dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {
  const lvlRefCd = sessionStorage.getItem("lvlRefCd")
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00006/getListPageData', queryInputObj, { headers }).then((res) => {
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
  console.log("lllllllllllllllllllllll",rowData);
  console.log(rowId);
  console.log(addVal);

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")

  const [formData, setFormData] = useState({
    othAdvocateCd: '',
    othAdvocateNm:  '',
    othEmailId:  '',
    othMobNo: '',
    othOffAddr:  '',
    othPhNo: '', 
    actFlg: 'A',
  });



  console.log(formData);

  useEffect(() => {
    if (mode !== 1) {
      setFormData({
        othAdvocateCd: rowData ? rowData.othAdvocateCd : '',
    othAdvocateNm: rowData ? rowData.othAdvocateNm : '',
    othEmailId: rowData ? rowData.othEmailId : '',
    othMobNo: rowData ? rowData.othMobNo : '',
    othOffAddr: edtVal ? edtVal.othOffAddr : '',
    othPhNo: edtVal ? edtVal.othPhNo : '',
    actFlg: rowData ? rowData.actFlg : 'A',
      })

    }
  }, [mode, edtVal])



  const handleInputChange = (event) => {
    
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
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
      othAdvocateCd: '',
      othAdvocateNm: '',
      actFlg: 'A'
    })

  };
  //  setEdtVal({
  //   othAdvocateCd: '', 
  //   othAdvocateNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    othAdvocateNm: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "CIA00026",
      mst: 
        {
          othAdvocateNm: formData.othAdvocateNm,
          othEmailId: formData.othEmailId,
          lvlRefCd: lvlRefCd,
          othMobNo: formData.othMobNo,
          othOffAddr: formData.othOffAddr,
          othPhNo: formData.othPhNo
          // actFlg: formData.actFlg || edtVal.actFlg || "A"
        }
      
    }


    const editObj = {
      apiId: "CIA00028",
      mst: {
        "actFlg": formData.actFlg,
        "othAdvocateCd":formData.othAdvocateCd,
        "othAdvocateNm":formData.othAdvocateNm,
        "othEmailId": formData.othEmailId,
        "lvlRefCd": lvlRefCd,
        "othMobNo": formData.othMobNo,
        "othOffAddr": formData.othOffAddr,
        "othPhNo": formData.othPhNo

      }
    }
    const deleteObj = {
      apiId: "SUA00099",
      mst: {

        othAdvocateCd: formData.othAdvocateCd

      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00006/saveAdd', addObj, { headers }).then(res => {
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00006/saveEdit', editObj, { headers }).then(res => {
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
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00006/saveDelete', deleteObj, { headers })
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
      apiId: "CIA00027",
      mst: {

        othAdvocateCd: formData.othAdvocateCd

      }
    }

   
      axios
        .post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00006/saveDelete', deleteObj, { headers })
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
    {console.log(">>>>>>>>>>>>>>Aditya", formData)}


      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">
        Other Advocate Definition  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Other Advocate Code
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="othAdvocateCd"
                value={formData.othAdvocateCd}
                readOnly
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
           Other Advocate Name <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="othAdvocateNm"
                value={formData.othAdvocateNm}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Other Advocate Name"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.othAdvocateNm && <span className="input-group-text">{formData.othAdvocateNm.length}/200</span>}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
           Other Chamber Address:
            {/* <span className="text-red">*</span> */}
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="othOffAddr"
                value={formData.othOffAddr}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder= "Other Address"
                
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.othOffAddr && <span className="input-group-text">{formData.othOffAddr.length}/50</span>}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
           Other Phone No:
            {/* <span className="text-red">*</span> */}
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="othPhNo"
                value={formData.othPhNo}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder= "Other Phone no "
                
                maxLength={12}
                disabled={mode === 3 || mode === 4}

              />{charCount?.othPhNo && <span className="input-group-text">{formData?.othPhNo?.length}/12</span>}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
             Other Mobile No:
            {/* <span className="text-red">*</span> */}
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="othMobNo"
                value={formData.othMobNo}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder= "Other Mobile No."
                
                maxLength={10}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount?.othMobNo && <span className="input-group-text">{formData?.othMobNo?.length}/10</span>} */}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
           Other Email Id:
            {/* <span className="text-red">*</span> */}
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="othEmailId"
                value={formData.othEmailId}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder= "Other Email Id"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount?.othEmailId && <span className="input-group-text">{formData?.othEmailId?.length}/10</span>} */}

            </div>
          </div>




          <div className="row mb-4">
            <label className="col-md-3 form-label">
            Other Status:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData.actFlg}

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