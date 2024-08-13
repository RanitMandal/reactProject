import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import { log } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";



export const ResetPasswordForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const fetchData = async ()=>{
    
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00029/getListPageData', queryInputObj, {headers}).then((res)=>{
        console.log(res.data); 
        setData(res?.data?.content.qryRsltSet);
        console.log(data);
        setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
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

        const [formData, setFormData] = useState({
        //   userId: rowData?rowData.userId: '',
        //   userNm: rowData?rowData.userNm: '',
        //   newPwd: edtVal?edtVal.newPwd:"",
        //   actFlg: edtVal?edtVal.actFlg: 'A',
        });

       

        console.log(formData);
    
        useEffect(() => {
          if(mode===2){
            setFormData({
                userId: rowData?rowData.userId: '',
                userNm: rowData?rowData.userNm: '',
                newPwd: edtVal?edtVal.newPwd:"",
                actFlg: edtVal?edtVal.actFlg: 'A',
              
            })
    
          }
        }, [mode, edtVal.actFlg])



        const handleInputChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setCharCount({ ...charCount, [event.target.name]: true });
        };
    
        const handleStatusChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setEdtVal({...edtVal,  [event.target.name]: event.target.value })
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
          userId: '', 
          userNm: '',
          newPwd:"",
          actFlg:  'A'})
        
         };
        //  setEdtVal({
        //   modGrpId: '', 
        //   modGrpNm: '',
        //   actFlg:  'A'
        //  })
    
         const [charCount, setCharCount] = useState({

          modGrpNm: false
      })
        
      const handleCharCount= (event) => {
        
        setCharCount({ ...charCount, [event.target.name]: false });
    };


         const handleSubmit = async (e) => {
          e.preventDefault()


        //   const addObj = 
        //     {
        //       apiId: "SUA00090",
        //         mst: [
        //         {
        //           modGrpNm:formData.modGrpNm,
        //           actFlg:formData.actFlg||edtVal.actFlg||"A"
        //         }
        //       ]
        //     }
            

          const editObj = {
            apiId: "SUA00322",
            mst:{
            
              ...formData
         
          }
        }
        //   const deleteObj = {
        //     apiId: "SUA00099",
        //            mst:{
            
        //       modGrpId:formData.modGrpId
           
        //   }
        // }
              
                // if(mode === 1)
                // await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00001/saveAdd', addObj, {headers}).then(res => {
                //     console.log(res.data)
                //     if (!res?.data?.appMsgList?.errorStatus) {
                //       fetchData()
                      
                //       }
                //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                //       if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
                //       resetForm();
                //       }
            
                // }).catch(error => {
                //     console.log("error")
                // });
                
                
                if(mode === 2)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00029/saveEdit', editObj, {headers}).then(res => {
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
          
          
            //   if(mode === 3)
            //   if(window.confirm("Are you sure? The record will be deleted parmanantly"))
            //   await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00001/saveDelete', deleteObj, {headers}).then(res => {
            //     console.log(res.data)
            //     if (!res?.data?.appMsgList?.errorStatus) {
            //       fetchData()
                    
            //       }
            //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
            //           setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                                   
          
            // }).catch(error => {
            //     console.log("error")
            // });
          
            };
    

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
                    Reset Password  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Id
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                
                                name="userNm"
                                value={formData.userId}
                                disabled={mode===2}
                            />
                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Name 
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="userNm"
                                value={formData.userNm}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Name"
                                maxLength={50}
                                disabled={mode===2}
                                
                            />

                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            New Password<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="newPwd"
                                required
                                value={formData.newPwd}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Enter New Password"
                                
                                disabled={mode===3 || mode===4}
                                
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
                        disabled={mode===2}
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={edtVal.actFlg}
                        
                      >
                       <option disabled>--Select--</option>

{(edtVal?.ddActFlg?.map((item)=>(
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
                    {mode !== 4 && <button  type="submit"  className='btn btn-primary'>{buttonTitle(mode)}</button>}
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


        </div>
    );
};

