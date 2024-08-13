import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const FinancialYearMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_parErrExp({status:res.data?.appMsgList?.errorStatus})
    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")

// for display date
// const getDateFormart_yyyymmdd = (yyyymmdd)=>{
//   console.log(yyyymmdd);
  

//   if(yyyymmdd){
//     const day = yyyymmdd.slice(8,10)
//   const month = yyyymmdd.slice(5,7)
//   const year = yyyymmdd.slice(0,4)
//   console.log(`${year}-${month}-${day}`);
//   return `${day}-${month}-${year}`
  
// }else return ""
// }
// let startDt = getDateFormart_yyyymmdd(rowData.startDt);
// let endDt = getDateFormart_yyyymmdd( rowData.endDt );
// // let dob = getDateFormart_yyyymmdd(edtVal?.dob);


  const [formData, setFormData] = useState({
    finYrCd:"",
    startDt: '',
    endDt: '',
    actFlg: 'A',
  });

useEffect(() => {
  if(mode!==1){
    setFormData({
      finYrCd: rowData ? rowData.finYrCd:"",
      startDt: edtVal ? edtVal.startDt : '',
      endDt: edtVal ? edtVal.endDt : '',
      actFlg: rowData ? rowData.actFlg : 'A',
    })
  }
}, [mode, edtVal])


  console.log(formData);

  // useEffect(() => {
  //   if (mode === 1) {
  //     setEdtVal({
  //       modGrpId: '',
  //       modGrpNm: '',
  //       actFlg: 'A',
  //     })

  //   }
  // }, [mode])



  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setCharCount({ ...charCount, [event.target.name]: true });
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
      finYrCd:"",
    startDt:  '',
    endDt:  '',
    actFlg:  'A',
    })

  };
  //  setEdtVal({
  //   modGrpId: '', 
  //   modGrpNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    modGrpNm: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "SUA00304",
      mst: [
        {
          actFlg: formData.actFlg,
          endDt: formData.endDt,
          startDt: formData.startDt
        }
      ]
    }


    const editObj = {
      apiId: "SUA00307",
      mst: {

        actFlg:formData.actFlg,
    endDt: formData.endDt,
    finYrCd: formData.finYrCd,
    startDt:formData.startDt

      }
    }
    

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
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
    apiId: "SUA00309",
    mst: {

      finYrCd: formData.finYrCd

    }
  }
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/saveDelete', deleteObj, { headers }).then(res => {
    console.log(res.data)
    if (!res?.data?.appMsgList?.errorStatus) {
      fetchData()

    }
    set_delStatus(true)
    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
    set_errExp({status:res.data?.appMsgList?.errorStatus})


  }).catch(error => {
    console.log("error")
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
      {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
        <h4 className="card-title">
          Financial Year Master  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Financial Year
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="finYrCd"
                value={formData.finYrCd}
                readOnly
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Start Date <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="date"
                name="startDt"
                value={formData.startDt}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder="startDt"
                required
                // maxLength={50}
                disabled={mode === 3 || mode === 4}

              />

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              End Date <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="date"
                name="endDt"
                value={formData?.endDt}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder="endDt"
                required
                // maxLength={}
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

