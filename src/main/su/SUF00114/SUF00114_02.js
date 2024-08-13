import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";


export const ApiCategoryMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, openPageData, setopenPageData, defaultData, setDefaultData,  errExp, set_errExp, }) => {

  const fetchData = async ()=>{
    
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00114/getListPageData', queryInputObj, {headers}).then((res)=>{
        console.log(res.data); 
        setData(res?.data?.content?.qryRsltSet);
        console.log(data); 
      })
  }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
        console.log(mode);
        console.log(rowData);
        console.log(rowId);
        
        // const [msg, setMsg] = useState("")
        // const [msgTyp, setMsgTyp] = useState("")

        const [formData, setFormData] = useState("");

         useEffect(() => {
        setFormData({
          apiCatCd: rowData?rowData.apiCatCd: '',
          apiCatNm: rowData?rowData.apiCatNm: '',
          actFlg: openPageData?openPageData.actFlg: 'A',
        })
      }, [openPageData])
        
    
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
          apiCatCd: '', 
          apiCatNm: '',
          actFlg:  'A'})
        
         };
    
         const [charCount, setCharCount] = useState({

          apiCatNm: false
      })
        
      const handleCharCount= (event) => {     
        setCharCount({ ...charCount, [event.target.name]: false });
    };
         const handleSubmit = async (e) => {
          e.preventDefault()
          
          const addObj = {
            apiId:"SUA00251",
            mst: [
                {
                  apiCatNm:formData.apiCatNm,
                  actFlg:"A"
                }
              ]
            }

          const editObj = {
            apiId:"SUA00253",
            mst:{
              ...formData
            }
          }
          
              
                if(mode === 1)
                 
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00114/saveAdd', addObj, {headers}).then(res => {
                    console.log(res.data)
                    if (!res?.data?.appMsgList?.errorStatus) {
                      fetchData()
                      }
                      setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                     set_errExp({status:res.data?.appMsgList?.errorStatus})
                      if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000011") {
                      resetForm();
                      }
            
                }).catch(error => {
                    console.log("error")
                }).finally(() => {
                  set_viewMsg(true)
              });
                
                
                if(mode === 2)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00114/saveEdit', editObj, {headers}).then(res => {
                  console.log(res.data)
                  if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()
  
                    }
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                    set_errExp({status:res.data?.appMsgList?.errorStatus})
          
              }).catch(error => {
                  console.log("error")
              }).finally(() => {
                set_viewMsg(true)
            });
          
          
              if(mode === 3)
             set_open(true)
             
          
            };


            const [open, set_open] = useState(false)
      const [confirmStatus, setConfirmStatus] = useState(false);
      const [delStatus, set_delStatus] = useState(false);
      const handleConfirmation = async () => {
        const deleteObj = {
          apiId:"SUA00252",
          mst:{
            apiCatCd:formData.apiCatCd
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00114/saveDelete', deleteObj, {headers}).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
            
          }
          set_delStatus(true)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
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

    return (
        <div>


            <div className="container">
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }  
                <h4 className="card-title">
                    API Category Master  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Code
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                
                                name="apiCatCd"
                                value={formData.apiCatCd}
                                readOnly
                            />
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
                                name="apiCatNm"
                                value={formData.apiCatNm}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Name"
                                required
                                maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.apiCatNm && <span className="input-group-text">{formData.apiCatNm.length}/50</span>}

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
                        disabled={mode===3 || mode===4}
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={(formData.actFlg)}
                        placeholder="Select"
                      >
                       <option>--Select--</option>

{
    (defaultData?.ddActFlg?.map((item)=>(
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

