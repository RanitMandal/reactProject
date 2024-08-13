import React from 'react'
import { useRef , useEffect, useState} from 'react';
import { Card, Modal, ModalTitle, Alert } from "react-bootstrap";
import axios from 'axios'
import {getApiToken} from "../../common/common"
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

export const LastAutoNumberUpdationForm = ({msg,setMsg, msgTyp, setMsgTyp, mode, edtVal, setEdtVal, setData, queryInputObj, errExp, set_errExp}) => {

    const getFormTitle = (mode) => {
        switch (mode) {
            case 1:
                return "Add New"
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
    const handleInputChange = (e) => {
      setEdtVal({
        ...edtVal,
        [e.target.name]: e.target.value
      })
    }
    const fetchData = async ()=>{
    
        await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00031/getListPageData', queryInputObj, {headers}).then((res)=>{
          console.log(res.data); 
          setData(res?.data?.content?.qryRsltSet);
          
         // console.log(data);
         setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
         setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        
         
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const editObj = {
            apiId: "SUA00227",
            mst:{
            cdId: edtVal? edtVal.cdId:"",
            keyStr: edtVal? edtVal.keyStr:"",
            lastNo: edtVal? parseInt(edtVal.lastNo):0,
            modId:  edtVal? edtVal.modId:""

            //...edtVal
         
        }
      }
      
            
            
              
              
              if(mode === 2)
              await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00031/saveEdit', editObj, {headers}).then(res => {
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
        
        
          
        
        
        
          };
          const msgRef = useRef(null)
          const [viewMsg, set_viewMsg] = useState(false)
          useEffect(() => {
              if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
              set_viewMsg(false)
          
          }, [viewMsg])

  return (
    <div>

    <div className='container'>
    {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }

        <h4 className="card-title">
        Last Auto Number Updation {getFormTitle(mode)}
        </h4>


        <div className="row ">
            <form 
            onSubmit={(e) => handleSubmit(e, mode,)}
            >
                
               
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">
                        Module Group:
                    </label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <input type="text" name="lvlRefCd" className="form-control col-md-3" 
                           value={edtVal?.modGrpId? edtVal?.modGrpId : ""} 
                            disabled={mode === 3 || mode === 4} readOnly 
                            //onChange={handleInputChange} 
                            />
                            <input type="text" name="lvlNm" 
                            value={edtVal?.modGrpNm? edtVal?.modGrpNm : ""} 
                           // onChange={handleInputChange} 
                            disabled
                                className="form-control ms-2"
                                maxLength={100}

                                />
         
                        </div>
                    </div>
                </div>
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">
                        Module:
                    </label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <input type="text" name="lvlRefCd" className="form-control col-md-3" 
                            value={edtVal?.modId? edtVal?.modId : ""} 
                            disabled={mode === 3 || mode === 4} readOnly 
                          //  onChange={handleInputChange} 
                            />
                            <input type="text" name="lvlNm" 
                            value={edtVal?.modNm? edtVal?.modNm : ""} 
                           // onChange={handleInputChange} 
                            disabled
                                className="form-control ms-2"
                                maxLength={100}
          
          />
         
                        </div>
                    </div>
                </div>
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">
                        Code:
                    </label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <input type="text" name="lvlRefCd" className="form-control col-md-3" 
                              value={edtVal?.cdId? edtVal?.cdId : ""} 
                            disabled={mode === 3 || mode === 4} 
                            readOnly 
                           // onChange={handleInputChange} 
                           />
                            <input type="text" name="lvlNm" 
                            value={edtVal?.cdDesc? edtVal?.cdDesc : ""} 
                            //onChange={handleInputChange} 
                            disabled
                                className="form-control ms-2"
                                maxLength={100}
           
          />
       
                        </div>
                    </div>
                </div>
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">
                        Key String:
                    </label>
                    <div className="col-sm-9 input-group">
                        <input
                            className="form-control"
                            type="text"
                           // placeholder="Order By"
                            maxLength={5}
                            name="orderBy"
                            value={edtVal?.keyStr? edtVal?.keyStr : ""} 
                            //onChange={handleInputChange}
                            disabled
                        />
                    </div>
                </div>
                <div className=" row mb-4">
                    <label className="col-md-3 form-label">
                    Last No:<span className='text-red'>*</span>
                    </label>
                    <div className="col-sm-3 input-group">
                        <input
                            className="form-control"
                            type="number"
                           required
                            maxLength={5}
                            name="lastNo"
                            value={edtVal?.lastNo} 
                            onChange={handleInputChange}
                            disabled={mode === 3 || mode === 4}
                        />
                    </div>
                </div>
              

              
             

           

                {mode !== 4 && <button type="submit"  className='btn btn-primary'>
                   { buttonTitle(mode)}
                    </button>}
               


            </form>
        </div>
        </div>
    


</div>
  )
}
