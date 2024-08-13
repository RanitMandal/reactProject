import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";


export const RoleDefinationForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp,parMsgTyp, parMsg, setParMsg, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, addVal, edtVal, setEdtVal}) => {

  const fetchData = async ()=>{
    
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00002/getListPageData', queryInputObj, {headers}).then((res)=>{
        console.log(res.data); 
        setData(res?.data?.content?.qryRsltSet);
        setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({status:res.data?.appMsgList?.errorStatus})
        console.log(data);
      
       
      })
  }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
        console.log(mode);
        console.log(rowData);
        console.log(rowId);
        console.log(edtVal);


        const [formData, setFormData] = useState({
          roleId: rowData?rowData.roleId: '',
        roleNm: rowData?rowData.roleNm: '',
         actFlg: edtVal?edtVal?.actFlg: 'A',
        });
console.log(formData);
    //     useEffect(() => {
    //    setFormData({
    //     roleId: rowData?rowData.roleId: '',
    //     roleNm: rowData?rowData.roleNm: '',
    //      actFlg: edtVal?edtVal.actFlg: 'A',
    //    })
    //  }, [edtVal])

     useEffect(() => {
      if(mode===1){
        setEdtVal({
          roleId:  '',
        roleNm: '',
         actFlg: 'A',
        })

      }
      if(mode===2){
        setFormData({
         ...formData,
         actFlg: edtVal.actFlg,
        })

      }
    }, [mode, edtVal])
        
    
        const handleInputChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setCharCount({ ...charCount, [event.target.name]: true });
        };
    
        const handleStatusChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
        };
    
      
         const resetForm = () => {
          
         setFormData({
          roleId: '', 
          roleNm: '',
          actFlg:  'A'})
        
         };
    
         const [charCount, setCharCount] = useState({

          roleNm: false
      })
        
      const handleCharCount= (event) => {
        
        setCharCount({ ...charCount, [event.target.name]: false });
    };

const [open, set_open] = useState(false)
const [confirmStatus, setConfirmStatus] = useState(false);

// right: 0 !important;
//     position: absolute;
//     padding: 8px;
//     top: 8px;
const [delStatus, set_delStatus] = useState(false)
const handleConfirmation = async () => {
  //setConfirmStatus(true);
  const deleteObj = {
    apiId: "SUA00115",
    mst:{
  
      roleId:formData.roleId
    
  }}  
    console.log(confirmStatus);
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00002/saveDelete', deleteObj, {headers}).then(res => {
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
  });
  
};
// useEffect(() => {
//   if(confirmStatus===true){
//     handleSubmit( mode, data, setData, onClose)
//   }
// }, [confirmStatus])





         const handleSubmit = async (e) => {
          e.preventDefault()
console.log(888888888);

          const addObj = 
          {
            apiId: "SUA00106",
            mst:[
                {
                  roleNm:formData.roleNm,
                  actFlg:formData.actFlg||edtVal?.actFlg
                  
                }
              ]
            }
            

          const editObj = {
            apiId: "SUA00112",
            mst:{
            
              ...formData
           
          }
        }
          const deleteObj = {
            apiId: "SUA00115",
            mst:{
          
              roleId:formData.roleId
            
          }}
              
                if(mode === 1)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00002/saveAdd', addObj, {headers}).then(res => {
                    console.log(res.data)
                    if (!res?.data?.appMsgList?.errorStatus) {
                      fetchData()
                      }
                      setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                      set_errExp({status:res.data?.appMsgList?.errorStatus})
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
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00002/saveEdit', editObj, {headers}).then(res => {
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
          
          
              if(mode === 3){
              set_open(true)
          //     if(confirmStatus){
          //     console.log(confirmStatus);
          //     await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00002/saveDelete', deleteObj, {headers}).then(res => {
          //       console.log(res.data)
          //       if (!res?.data?.appMsgList?.errorStatus) {
          //         fetchData()
                    
          //         }
          //         setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
          //             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                                   
          
          //   }).catch(error => {
          //       console.log("error")
          //   });
          // }
            //setConfirmStatus(false)
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

      const msgRef = useRef(null)
      const [viewMsg, set_viewMsg] = useState(false)
      useEffect(() => {
          if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
          set_viewMsg(false)
      
      }, [viewMsg])

    return (
        <div>


            <div className="container">
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
 
                <h4 className="card-title">
                    Role Defination  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Role Id
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                
                                name="roleId"
                                value={formData.roleId}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Role Name <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="roleNm"
                                value={formData.roleNm}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder="Name"
                                required
                                maxLength={100}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.roleNm && <span className="input-group-text">{formData.roleNm.length}/100</span>}

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
                    {mode !== 4 && <button disabled={delStatus}  type="submit"  className='btn btn-primary'>{buttonTitle(mode)}</button>}
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

