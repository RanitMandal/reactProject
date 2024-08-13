import React, { useState , useRef} from "react";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import Swal from "sweetalert2";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";


export const CurrencyMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp,edtVal, addVal, parMsgTyp, parMsg, setParMsg, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp,}) => {

  const fetchData = async ()=>{
      
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00016/getListPageData', queryInputObj, {headers}).then((res)=>{
        console.log(res.data); 
        setData(res?.data?.content?.qryRsltSet);
        setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
        setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_parErrExp({status:res.data?.appMsgList?.errorStatus})
        console.log(data); 
      })
  }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
        console.log(mode);
        console.log(rowData);
        console.log(rowId);
        
        // const [msg, setMsg] = useState("")
        // const [msgTyp, setMsgTyp] = useState("")

        const [formData, setFormData] = useState({
          curncyCd: rowData?rowData.curncyCd: '',
          curncyDesc: rowData?rowData.curncyDesc: '',
          actFlg: rowData?rowData.actFlg: 'A',
        });
        
    
        const handleInputChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setCharCount({ ...charCount, [event.target.name]: true });
        };
    
        const handleStatusChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
        };
    
        const validateInput = (formData) => {
            if ((!formData.name.trim()) ||(formData.dev_nm.trim()===""))  {
             return false;
           }
           if ((!formData.addr.trim()) ||(formData.addr.trim()===""))  {
             return false;
           } 
         
           // other validations
         
           return true;
         };
         const resetForm = () => {
          
         setFormData({
          curncyCd: '', 
          curncyDesc: '',
          actFlg:  'A'})
          
        
         };
    
         const [charCount, setCharCount] = useState({

          curncyDesc: false
      })
        
      const handleCharCount= (event) => {
        
        setCharCount({ ...charCount, [event.target.name]: false });
    };

    // const Secondaryalertbutton = () => {
    //   return Swal.fire({ 
    //     position: "top-center",
    //     title: "Are you sure?",
    //     text: "The record will be deleted permanently.",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "OK",
    //     cancelButtonText: "Cancel",
       
    //   }).then((result) => {
    //     return result.isConfirmed;
    //   });
    // };
         const handleSubmit = async (e) => {
          e.preventDefault()


          const addObj = {
            apiId: "SUA00111",
          mst:[{
                  actFlg:formData.actFlg,
                  curncyDesc:formData.curncyDesc
                  
               
            }]
          }

          const editObj = {
            apiId:'SUA00117',
          mst: {
           
              ...formData
           
          }
        }
         
              
                if(mode === 1)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00016/saveAdd', addObj, {headers}).then(res => {
                    console.log(res.data)
                    if (!res?.data?.appMsgList?.errorStatus) {
                      fetchData()
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
                      if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
                      resetForm();
                      }
            
                }).catch(error => {
                    console.log("error")
                });
                
                
                if(mode === 2)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00016/saveEdit', editObj, {headers}).then(res => {
                  console.log(res.data)
                  if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()
  
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
          
              }).catch(error => {
                  console.log("error")
              });
          
          
              if(mode === 3){
              set_open(true)
              // const confirmed = await Secondaryalertbutton();
              // if (confirmed)
             
              }
            };
    
      const pageTitle = editMode ? 'Edit Post' : 'Create Post';
 
      const getFormTitle = (mode)=>{
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
      const buttonTitle = (mode)=>{
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
    apiId:'SUA00119',
  mst:{
   
      curncyCd:formData.curncyCd
    
  }
}
  await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00016/saveDelete', deleteObj, {headers}).then(res => {
    console.log(res.data)
    if (!res?.data?.appMsgList?.errorStatus) {
      fetchData()
        
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
            {msg && <div msgRef={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>} 
                <h4 className="card-title">
                    Currency Master  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Currency Code
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                
                                name="curncyCd"
                                value={formData.curncyCd}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Currency Description <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="curncyDesc"
                                value={formData.curncyDesc}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Name"
                                required
                                maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.curncyDesc && <span className="input-group-text">{formData.curncyDesc.length}/50</span>}

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
                        value={(formData.actFlg)||edtVal.actFlg}
                        placeholder="Select"
                        disabled={mode===3 || mode===4}
                      >
                       <option disabled>--Select--</option>

{(mode===1)?
    (addVal?.ddActFlg?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(edtVal?.ddActFlg?.map((item)=>(
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
                    {mode !== 4 && <button disabled={delStatus} type="submit"  className='btn btn-primary'>{buttonTitle(mode)}</button>}
    {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="reset"
                //onClick="resetForm"
                onClick={(e)=>resetForm()}
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

