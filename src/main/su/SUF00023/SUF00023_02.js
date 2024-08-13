import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import {DatePicker} from '@gsebdev/react-simple-datepicker';
import { getYear } from "date-fns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import 'react-datepicker/dist/react-datepicker.css';


export const CalendarYearMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, setEdtVal, edtVal, addVal, setAddVal, parMsgTyp, parMsg, setParMsg, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp,}) => {

  const fetchData = async ()=>{
    
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/getListPageData', queryInputObj, {headers}).then((res)=>{
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
        
        // const [msg, setMsg] = useState("")
        // const [msgTyp, setMsgTyp] = useState("")


        const getDateFormart_ddmmyyyy = (yyyymmdd)=>{
          console.log(yyyymmdd);
          const date = new Date(yyyymmdd);
          const month = Number(date.getMonth()) <10? "0"+(date.getMonth()+1): (date.getMonth()+1);
          const day = Number(date.getDate()) <10? "0"+(date.getDate()): (date.getDate());
          const year = date.getFullYear();
          return `${day}/${month}/${year}`
        }

        const getDateFormart_yyyymmdd = (ddmmyyyy)=>{
          console.log(ddmmyyyy);
          
        
          if(ddmmyyyy){
            const day = ddmmyyyy.slice(0,2)
          const month = ddmmyyyy.slice(3,5)
          const year = ddmmyyyy.slice(6,10)
          console.log(`${year}-${month}-${day}`);
          return `${year}-${month}-${day}`
        }else return ""
        }
       

        let startDt = getDateFormart_yyyymmdd(rowData?.startDt) 
        let endDt = getDateFormart_yyyymmdd(rowData?.endDt) 

        const [formData, setFormData] = useState({
          yearCd: '',
          startDt: '',
          endDt:  '',
         actFlg:  'A',
        });
        
    useEffect(() => {
      if(mode!==1){
        setFormData({
          yearCd: rowData?rowData.yearCd: '',
          startDt: edtVal?edtVal?.startDt: '',
          endDt: edtVal?edtVal?.endDt: '',
         actFlg: rowData?rowData.actFlg: 'A',
        })
      }
     
    }, [mode, edtVal])
    
        const handleInputChange = (event) => {
          console.log(event.target.value)
          setFormData({ ...formData, [event.target.name]: event.target.value });
          setCharCount({ ...charCount, [event.target.name]: true });
        };
    
        const handleStatusChange = (event) => {
          // console.log(event.target.value);
          setFormData({ ...formData, [event.target.name]: event.target.value });
        };




  const [yearCd, setFinYrCd] = useState("");
  const [isInvalidRange, setIsInvalidRange] = useState(false); // New state variable

 

  const getFormateYYYY_mm_dd = (mmddyyyy)=>{
    return mmddyyyy.slice(6,11)+"-"+mmddyyyy.slice(3,5)+"-"+mmddyyyy.slice(0,3)
}

  // useEffect(() => {
  //   if (formData.startDt && formData.endDt ) {

  //         let start = new Date(getFormateYYYY_mm_dd(formData.startDt)).getTime();
  //         let end = new Date(getFormateYYYY_mm_dd(formData.endDt)).getTime();
          
  //         if(start <= end){
  //          console.log("Date is OK");
  //          setIsInvalidRange(false)
  //         }else{
  //           //alert("START date must be lesser than END date")
  //           setIsInvalidRange(true)
  //         }
  //   } 
  // }, [formData.startDt, formData.endDt]);









         const resetForm = () => {
          
         setFormData({
          yearCd: '', 
          startDt: '',
          endDt:  '',
        actFlg:"A"})
        
         };
    
         const [charCount, setCharCount] = useState({

          modGrpNm: false
      })
        
      const handleCharCount= (event) => {
        
        setCharCount({ ...charCount, [event.target.name]: false });
    };


         const handleSubmit = async (e) => {
          e.preventDefault()


          const addObj = {
            apiId:"SUA00292",
            mst: [
                {
                  yearCode:formData.yearCd,
                  // startDt:getDateFormart_ddmmyyyy(formData.startDt),
                  // endDt:getDateFormart_ddmmyyyy(formData.endDt),
                  actFlg:formData.actFlg,
                  startDt:formData.startDt,
                  endDt:formData.endDt,
                }
              ]
            }
console.log(addObj);

          const editObj = {
            apiId:"SUA00300",
            mst:{
                  yearCd:formData.yearCd,
                  // startDt:getDateFormart_ddmmyyyy(formData.startDt),
                  // endDt:getDateFormart_ddmmyyyy(formData.endDt),
                  actFlg:formData.actFlg,
                  startDt:formData.startDt,
                  endDt:formData.endDt,
            }
          }
          
              
                if(mode === 1)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/saveAdd', addObj, {headers}).then(res => {
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
                });
                
                
                if(mode === 2)
                await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/saveEdit', editObj, {headers}).then(res => {
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
              });
          
          
              if(mode === 3)
             set_open(true)
              
          
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
    apiId:"SUA00299",
    mst:{
      yearCd:formData.yearCd
    }
  }

  await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00023/saveDelete', deleteObj, {headers}).then(res => {
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
}
const msgRef = useRef(null)
const [viewMsg, set_viewMsg] = useState(false)
useEffect(() => {
    if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
    set_viewMsg(false)

}, [viewMsg])

    return (
        <div>


            <div className="container" style={{minHeight:"600px"}}>
            {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div> }
  
                <h4 className="card-title">
                    Calendar Year  {getFormTitle(mode)}
                </h4>

               
               
                <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
                   
                    <div className=" row mb-4">
                        <label className="col-md-3 form-label">
                            Calendar Year<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                            <input
                                className="form-control border "
                                type="text"
                                name="yearCd"
                                value={formData.yearCd}
                                //placeholder={formData.yearCd}
                                onChange={handleInputChange}
                                disabled={mode===2||mode===3 ||mode===4}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
              <label className="col-md-3 form-label">
                Start Date <span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
              {/* <DatePicker
                  className="form-control fc-datepicker"
                 // placeholder="DD/MM/YYYY"
                 // selected={getFormate_mmddyyyy(formData.startDt)}
                  //onChange={setEndDate}
                  numberOfMonths={1}
                  required
                  name="startDt"
                  value="1960-04-01"
                  onChange={handleInputChange}
                  disabled={mode===3 || mode===4}
                  
              /> */}

                <input 
                  type="date" 
                  className="form-control" 
                  id="" 
                  name="startDt"
                  value={formData.startDt}
                  onChange={handleInputChange}
                  disabled={mode===3 || mode===4}
                  required
                 
                  />

              </div>
            </div>
            {isInvalidRange && formData.endDt && !formData.startDt && ( // Displaying an error message if the range is invalid
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-9 text-red">
                  First update the Start Date!!
                </div>
              </div>
            )}
            <div className="row mb-4">
              <label className="col-md-3 form-label">
                End Date <span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                
                {/* <DatePicker
                  className="form-control fc-datepicker"
                  placeholder="DD/MM/YYYY"
                  //selected={getFormate_mmddyyyy(formData.endDt)}
                  //onChange={setEndDate}
                  numberOfMonths={1}
                  required
                  name="endDt"
                  value={getFormate_mmddyyyy(formData.endDt)}
                  onChange={handleInputChange}
                  disabled={mode===3 || mode===4}
                  
              /> */}
               <input 
                  type="date" 
                  className="form-control" 
                  id="" 
                  name="endDt"
                  value={formData.endDt}
                  onChange={handleInputChange}
                  disabled={mode===3 || mode===4}
                  required
                 
                  />

                
                {/* <span className="input-group-text fa fa-calendar tx-16 lh-0 op-6" /> */}
              </div>
            </div>
            {isInvalidRange && formData.endDt < formData.startDt && ( // Displaying an error message if the range is invalid
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-9 text-red">
                  End Date cannot be less than Start Date
                </div>
              </div>
            )}
            <div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Status:<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                        <select
                        className="form-select col-md-12"
                        name="actFlg"
                        disabled={mode===3 || mode===4}
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={formData.actFlg}
                        
                      >
                       <option disabled>--Select--</option>

{(mode===1)?
    (addVal?.ddActFlg?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(edtVal?.ddActFlg?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    )))
}
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

