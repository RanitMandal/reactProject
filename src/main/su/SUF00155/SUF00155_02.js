import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import { log } from "nvd3";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { modLovColumns, appLovColumns, formLovColumns } from "./columns";
import Lov from "../../common/Lov";
export const HelpFrom = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {

  const fetchData = async ()=>{
    
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00155/getListPageData', queryInputObj, {headers}).then((res)=>{
        console.log(res.data); 
        setData(res?.data?.content.qryRsltSet);
        console.log(data);
        // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
        // setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType) 
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
            actFlg: "A",
            contactId: "",
            contactNm: "",
            contactNo: "",
            dispOrdNo: 0,
            emailId: "",
            otherInfo: "",
            pubDispFlg: "Y"
        });

        useEffect(() => {
          if(mode!==1) setFormData({
            actFlg: rowData ? rowData.actFlg:"A",
            contactId: rowData ? rowData.contactId:"",
            contactNm: rowData ? rowData.contactNm:"",
            contactNo: rowData ? rowData.contactNo:"",
            dispOrdNo: rowData ? rowData.dispOrdNo:0,
            emailId: rowData ? rowData.emailId:"",
            otherInfo: rowData ? rowData.otherInfo:"",
            pubDispFlg: rowData ? rowData.pubDispFlg:"Y"
          })
        }, [mode, rowData, edtVal])
        
        


        const handleCheckboxChange = (event) => {
          const { name, value } = event.target;
          console.log("xxxxxxxxx", name, "yyyyyyy", value);
          setFormData({
            ...formData,
            [name]: value === "Y" ? "N" : "Y",
          });
        };

       

        console.log(formData);
    
        // useEffect(() => {
        //   if(mode===1){
        //     setEdtVal({
        //       otpTypCd: '',
        //       otpTypDesc: '',
        //       actFlg: 'A',
        //     })
    
        //   }
        // }, [mode])



        const handleInputChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setCharCount({ ...charCount, [event.target.name]: true });
        };
    
        const handleStatusChange = (event) => {
          setFormData({ ...formData, [event.target.name]: event.target.value });
          // setEdtVal({...edtVal,  [event.target.name]: event.target.value })
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
            actFlg: "A",
            contactId: "",
            contactNm: "",
            contactNo: "",
            dispOrdNo: 0,
            emailId: "",
            otherInfo: "",
            pubDispFlg: "Y"
        })
        
         };
        //  setEdtVal({
        //   modGrpId: '', 
        //   modGrpNm: '',
        //   actFlg:  'A'
        //  })
    
         const [charCount, setCharCount] = useState({

            
            contactId: false,
            contactNm: false,
            contactNo: false,
            dispOrdNo: false,
            emailId: false,
            otherInfo: false,
      })
        
      const handleCharCount= (event) => {
        
        setCharCount({ ...charCount, [event.target.name]: false });
    };


         const handleSubmit = async (e) => {
          e.preventDefault()


          const addObj = 
            {
              apiId: "SUA00557",
              mst: {
                contactNm: formData.contactNm,
                contactNo: formData.contactNo,
                dispOrdNo: parseInt(formData.dispOrdNo),
                emailId: formData.emailId,
                otherInfo: formData.otherInfo,
                pubDispFlg: formData.pubDispFlg
              }
              
            }
            

          const editObj = {
            apiId: "SUA00559",
            mst: {
                actFlg: formData.actFlg,
                contactId: formData.contactId,
                contactNm: formData.contactNm,
                contactNo: formData.contactNo,
                dispOrdNo: parseInt(formData.dispOrdNo),
                emailId: formData.emailId,
                otherInfo: formData.otherInfo,
                pubDispFlg: formData.pubDispFlg
            }
        }
          
              
                if(mode === 1)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00155/saveAdd', addObj, {headers}).then(res => {
                    console.log(res.data)
                    if (!res?.data?.appMsgList?.errorStatus) {
                      fetchData()
                      
                      }
                      setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                      set_errExp({status:res.data?.appMsgList?.errorStatus})
                      if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
                      resetForm();
                      }
            
                }).catch(error => {
                    console.log("error")
                }).finally(() => {
                  set_viewMsg(true)
              });
                
                
                if(mode === 2)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00155/saveEdit', editObj, {headers}).then(res => {
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
            const [delStatus, set_delStatus] = useState(false)
            const handleConfirmation = async () => {
              const deleteObj = {
                apiId: "SUA00558",
                       mst:{
                
                        contactId: formData.contactId,
               
              }
            }
          
          
              await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00155/saveDelete', deleteObj, {headers}).then(res => {
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
            {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}  
                <h4 className="card-title">
                Technical Help Desk Contacts  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                           Contact Id
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                
                                name="contactId"
                                value={formData.contactId}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Conatct Name <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="contactNm"
                                value={formData.contactNm}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder=""
                                required
                                maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.contactNm && <span className="input-group-text">{formData.contactNm?.length}/50</span>}

                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Contact No. <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder=""
                                required
                                maxLength={10}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.contactNo && <span className="input-group-text">{formData.contactNo?.length}/50</span>}

                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            display Order No. <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="dispOrdNo"
                                value={formData.dispOrdNo}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder=""
                                required
                                maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.dispOrdNo && <span className="input-group-text">{formData.dispOrdNo?.length}/50</span>}

                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Email ID <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="email"
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder=""
                                required
                                // maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.emailId && <span className="input-group-text">{formData.emailId?.length}/50</span>}

                        </div>
                    </div>

                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Other Information
                        </label>
                        <div className="col-md-9 input-group">
                            <input
                                className="form-control"
                                type="text"
                                name="otherInfo"
                                value={formData.otherInfo}
                                onChange={handleInputChange}
                                onBlur={handleCharCount}
                                placeholder=""
                                // required
                                maxLength={50}
                                disabled={mode===3 || mode===4}
                                
                            />{charCount.otherInfo && <span className="input-group-text">{formData.otherInfo?.length}/50</span>}

                        </div>
                    </div>
                    <div className="row mb-4">
            <label className="col-md-3 form-label">
              Public Display Flag:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="pubDispFlg"
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData.pubDispFlg}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddPubDispFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddPubDispFlg?.map((item) => (
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

