import React, { useState , useRef, useEffect } from "react";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert} from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const AppCategoryMasterAdd = ({  msg, setMsg, msgTyp, setMsgTyp, edtVal, addVal, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp }) => {

  const headers = { Authorization: 'Bearer ' + getApiToken() };
  const fetchData = async ()=>{
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00120/getListPageData', queryInputObj, {headers}).then((res)=>{
      console.log(res.data); 
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType) 
    })
}

  const [formData, setFormData] = useState({
    appCatCd: rowData?.appCatCd,
    appCatDesc: rowData?.appCatDesc,
    actFlg: rowData?.actFlg,

  });

  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "SUA00328",
      mst: [
        {
          appCatDesc: formData.appCatDesc,
          actFlg: formData.actFlg || edtVal.actFlg || "A"
        }
      ]
    }


    const editObj = {
      apiId: "SUA00335",
      mst: {

        ...formData

      }
    }
   

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00120/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm1();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00120/saveEdit', editObj, { headers }).then(res => {
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
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 3)
     set_open(true)
       
  };


  const [open, set_open] = useState(false)
      const [confirmStatus, setConfirmStatus] = useState(false);
      const [delStatus, set_delStatus] = useState(false);
      const handleConfirmation = async () => {
        const deleteObj = {
          apiId: "SUA00342",
          mst: {
    
            appCatCd: formData?.appCatCd
    
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00120/saveDelete', deleteObj, { headers }).then(res => {
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

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

  };

  const resetForm = () => {

    setFormData({
      appCatCd: '',
    appCatDesc: '',
    actFlg: '',
  })
  setMsg('')
  setMsgTyp('')

  };
  const resetForm1 = () => {
    console.log('caall')

    setFormData({
      appCatCd: '',
    appCatDesc: '',
    actFlg: '',
  })
  console.log(formData)

  };
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
  return (
    <>
      <div className="container"></div>

      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> } 



      <h4 className="card-title">
        App Category Master  {getFormTitle(mode)}
      </h4>


      <form onSubmit = {handleSubmit}>
        <div className="row mb-4 ">
          <label
            htmlFor="exampleFormControlSelect1"
            className="col-md-3 form-label"
          >
            <b>App Category Code:</b>
            {/* <span className="text-red">*</span> */}
          </label>
          <div className="col-sm-9 mb-2">

            <input value={formData.appCatCd} readOnly name="appCatCd" className="form-control" type="text" id="exampleFormControlSelect1" placeholder="App category Code" />

          </div>

        </div>
        <div className="row mb-4 ">
          <label
            htmlFor="exampleFormControlSelect1"
            className="col-md-3 form-label"
          >
            App Category Description:<span className="text-red">*</span>
            {/* <span className="text-red">*</span> */}
          </label>
          <div className="col-md-9">
            <input value={formData.appCatDesc} name="appCatDesc" className="form-control" type="text" id="exampleFormControlSelect1" onChange={handleInputChange} placeholder="App category Description" disabled={mode===3 || mode===4}/>

          </div>
          <div className="col-sm-4"></div>
        </div>

        <div className="row mb-4">
          <label className="col-md-3 form-label">
            Status:<span className="text-red">*</span>
          </label>
          <div className="col-md-9">
            <select
              className="form-select col-md-12" onChange={handleStatusChange}
              name="actFlg"
              value={formData?.actFlg}
            disabled={mode===3 || mode===4}
            //defaultValue={edtVal.dtlActFlg}
            // onChange={handleStatusChange}
            // value={edtVal.actFlg}

            >
              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddActFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddActFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }



            </select>
          </div>
        </div>
        <div className="col-sm-4">
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
    </>
  );
}
// return (
//     <form>
//       <label>
//         Username:
//         <input type="text" name="username" />
//       </label>
//       <label>
//         Password:
//         <input type="password" name="password" />
//       </label>
//       <input type="submit" value="Submit" />
//     </form>
//   );
// }

export default AppCategoryMasterAdd;

