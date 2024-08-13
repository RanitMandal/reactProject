import React, { useState, useEffect , useRef} from "react";
import { Tree } from 'antd';
import { Alert} from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common";
import axios from 'axios';
// import moment from 'moment';
import { userLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
//import PolicyDefinationNewEntryPage from './SUF00042_02'
const { DirectoryTree } = Tree;
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const Form = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, msg1, setMsg1, msgTyp1, setMsgTyp1, addVal, edtVal, updateEdtVal, setEdtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp ,  errExp, set_errExp, parErrExp, set_parErrExp,}) => {
    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    console.log(edtVal);
    console.log(addVal);

      // Get All List
  const fetchData = async ()=>{
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00078/getListPageData', queryInputObj, {headers}).then((res)=>{
      console.log(res.data); 
      setData(res?.data?.content?.qryRsltSet);
      console.log(data); 
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      set_parErrExp({status:res.data?.appMsgList?.errorStatus})
    })
}

useEffect(() => {
    if(mode===1){
        setEdtVal({
            userId: "",
            userNm: "",
            effDt: "",
            expDt: null,
            userPwd: "",
            addr:"",
            dob: null,
            mailId: null,
            mobNo: null,
            actFlg: "A",
        })
    }
  
}, [mode])


// for display date
    const getDateFormart_yyyymmdd = (ddmmyyyy)=>{
        console.log(ddmmyyyy);
        
      
        if(ddmmyyyy){
          const day = ddmmyyyy.slice(8,10)
        const month = ddmmyyyy.slice(5,7)
        const year = ddmmyyyy.slice(0,4)
        console.log(`${year}-${month}-${day}`);
        return `${year}-${month}-${day}`
        
      }else return ""
      }
let effDt = getDateFormart_yyyymmdd(edtVal?.effDt);
let expDt = getDateFormart_yyyymmdd(edtVal?.expDt);
let dob = getDateFormart_yyyymmdd(edtVal?.dob);
 




// for post date
const getDateFormart_ddmmyyyy = (ddmmyyyy)=>{
    console.log(ddmmyyyy);
    
  
    if(ddmmyyyy){
      const day = ddmmyyyy.slice(8,10)
    const month = ddmmyyyy.slice(5,7)
    const year = ddmmyyyy.slice(0,4)
    console.log(`${day}-${month}-${year}`);
    return `${day}-${month}-${year}`
    
  }else return ""
  }

// dsgn Group LOV Start..............
const [userLovData, setUserLovData] = useState([]);
useEffect(() => {

    const fetchUserLovData = async () => {
        let obj={
            apiId:'SUA00369'
        }
        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00078/getAllUser", obj, { headers })
            .then((res) => {
                console.log(res.data);
                setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

            });
    };
    fetchUserLovData();
}, []);


const getUserNm = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.userNm ?userLovData[Number(Object.keys(obj)[0])]?.userNm:""
}

const getUserId = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.userId ? userLovData[Number(Object.keys(obj)[0])]?.userId:""
}

const [selectRow, setSelectRow] = useState("");
const [selectRowUserLov, setSelectRowUserLov] = useState("");
const [showModelUserLov, setShowModelUserLov] = useState(false);
const handleRowClickUserLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowUserLov(rowData);
    // updateEdtVal({
    //     ...edtVal,userId: getUserId(rowData),
    //     dsgnNm: getUserNm(rowData)
    // });
    // setQueryInputObj({
    //   ...queryInputObj,
    //   modGrpId: getModGrpId(rowData),

    // });
};
//dsgn group Lov ends 
  

    const [formData, setFormData] = useState({

        id: rowData ? rowData.id : '',
        likeUserId: "",
        userId: rowData ? rowData.userId : '',
        userNm: rowData ? rowData.userNm : '',
        effDt: effDt || '',
        expDt: expDt || '',
        userPwd: edtVal ? edtVal.userPwd : '',
        addr: edtVal ? edtVal.addr:"",
        dob: edtVal ? dob : '',
        mailId: edtVal ? edtVal.mailId : '',
        mobNo: edtVal ? edtVal.mobNo : '',
        actFlg: edtVal ? edtVal.actFlg : 'A',
    });

    console.log(formData);
    console.log(formData.effDt);
    const handleInputChange = (event) => {
       
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setEdtVal({...edtVal, [event.target.name]: event.target.value})
        
      };
    const handleStatusChange = (event) => {
        // const {name, value}=event.target;
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setEdtVal({...edtVal, [event.target.name]: event.target.value})
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value,
        //     alertFlg:value?(value==="Y"?"A":"I"):"",  });
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEdtVal({
          ...edtVal,
          [name]: checked ? "A" : "S",
        });
      };


    const validateInput = (formData) => {
        if ((!formData.dev_nm.trim()) || (formData.dev_nm.trim() === "")) {
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
          
            userId: '',
            userName: '',
           
        })
        setEdtVal({
            userId: "",
            userNm: "",
            effDt: "",
            expDt: null,
            userPwd: "",
            addr:"",
            dob: null,
            mailId: null,
            mobNo: null,
            actFlg: "A",
        })
        

    };

// scroll to top for displaying message..........
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [setMsg])
   
  

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        console.log(formData)
        const addObj =
    
        {
            apiId: "SUA00368",
            mst: {
                actFlg: formData.actFlg||edtVal.actFlg,
                addr:formData.addr||edtVal.addr,
                dob: formData.dob||edtVal.dob,
              effDt:  formData.effDt||edtVal.effDt,
              expDt: formData.expDt||edtVal.expDt,
              likeUserId:getUserId(selectRow),
              mailId: formData.mailId||"",
              mobNo: formData.mobNo||"",
              userId: formData.userId||"",
              userNm: formData.userNm||"",
              userPwd: formData.userPwd||""
            }
          }
    
    
    
        const editObj = {
            apiId: "SUA00377",
            mst: {
              actFlg: formData.actFlg||edtVal.actFlg,
              dob: formData.dob||edtVal.dob,
              effDt: formData.effDt||edtVal.effDt,
              expDt: formData.expDt||edtVal.expDt,
             addr:formData.addr||edtVal.addr,
              mailId: formData.mailId||edtVal.mailId,
              mobNo: formData.mobNo||edtVal.mobNo,
              userId: formData.userId||edtVal.userId,
              userNm: formData.userNm||edtVal.userNm,
              userPwd: formData.userPwd||edtVal.userPwd
            }
          }
      
    
        if (mode === 1)
          await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00078/saveAdd', addObj, { headers }).then(res => {
            console.log(res.data)
            if (res.data?.appMsgList?.errorStatus===false) {
              fetchData()
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
              resetForm();
            }
    
          }).catch(error => {
            console.log("error")
          }).finally(()=>{
            set_viewMsg(true)
      });
    
    
        if (mode === 2)
          await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00078/saveEdit', editObj, { headers }).then(res => {
            console.log(res.data)
            if (res.data?.appMsgList?.errorStatus===false) {
              //TRUE OPERATION
              fetchData()
    
            }
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
          }).catch(error => {
            console.log("error")
          }).finally(()=>{
            set_viewMsg(true)
      });
    
    
        if (mode === 3)
          set_open(true)
          
      };


      const [open, set_open] = useState(false)
      const [confirmStatus, setConfirmStatus] = useState(false);
      const [delStatus, set_delStatus] = useState(false)
      const handleConfirmation = async () => {

        const deleteObj = {
            apiId: "SUA00376",
            mst: {
              userId: formData.userId
            }
          }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00078/saveDelete', deleteObj, { headers }).then(res => {
            console.log(res.data)
            if (res.data?.appMsgList?.errorStatus===false) {
              fetchData()
  
            }
            set_delStatus(true)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
  
  
  
          }).catch(error => {
            console.log("error")
          }).finally(()=>{
            set_viewMsg(true)
      });
  
      }



    const pageTitle = editMode ? 'Edit Post' : 'Create Post';

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
    const buttonTitle =  (mode) => {
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

    // Character Counter
    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        userId: false,
        userNm: false,
        userPwd: false,
        mailId: false,
        addr: false
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };


    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [isInvalidRange, setIsInvalidRange] = useState(false);

    

    const [isValid, setIsValid] = useState(true);
    const [isValid3, setIsValid3] = useState(true);






    useEffect(() => {
        if (startDate && endDate && startDate <= endDate) {
            setIsInvalidRange(false);
        } else {
            setIsInvalidRange(endDate < startDate || endDate && !startDate);
        }
    }, [startDate, endDate]);

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
        set_viewMsg(false)
    
    }, [viewMsg])


  

    return (
        <div>
            <div className="container">
                        {msg  && <div ref={msgRef}><MsgAlert  errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

              <h4 className="card-title">
                    Like User Creation {getFormTitle(mode)}
                </h4>

                <div className="row ">
                    <form onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                   {(mode===1) && <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Like User Creation <span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    { <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        name="likeUserId"
                                        // readOnly
                                        required
                                        disabled={mode === 3 || mode === 4}
                                        value={getUserId(selectRow)}
                                        
                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-4"
                                        name="likeUserNm"
                                        readOnly
                                        disabled={mode === 3 || mode === 4}
                                        value={getUserNm(selectRow)}
                                       
                                    />
                                    <div className="row-mb-12">
                                        {showModelUserLov && <Lov
                                            moduleLovData={userLovData}
                                            setShowModel={setShowModelUserLov}
                                            showModel={showModelUserLov}
                                            handleRowClick={handleRowClickUserLov}
                                            columns={userLovColumns}
                                            currentSelection={selectRow}
                                            setCurrentSelection={setSelectRow}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>}


                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                User Id:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    maxLength={25}
                                    name="userId"
                                    value={formData.userId} onChange={handleInputChange}
                                    disabled={mode !== 1}
                                    placeholder="User Id"
                                    onFocus={() => toggleCharCountVisibility("userId")}
                                    onBlur={() => toggleCharCountVisibility("userId")}
                                />
                                {fieldCharCountVisibility.userId && (
                                    <span className="input-group-text">
                                        {formData?.userId?.length}/25
                                    </span>
                                )}

                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                User Name:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    type=""
                                    name="userNm"

                                    maxLength={100}
                                    value={formData.userNm} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="User Name"
                                    onFocus={() => toggleCharCountVisibility("userNm")}
                                    onBlur={() => toggleCharCountVisibility("userNm")}
                                />
                                {fieldCharCountVisibility.userNm && (
                                    <span className="input-group-text">
                                        {formData?.userNm?.length}/100
                                    </span>
                                )}

                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Effective From:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                            <input 
                  type="date" 
                  className="form-control" 
                  id="" 
                  name="effDt"
                  value={edtVal?effDt:''}
                  onChange={handleInputChange}
                  disabled={mode===3 || mode===4}
                  required
                 
                  />
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Valid Upto:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control "
                                    type="date"
                                    // placeholder="YYYY/MM/DD"
                                    name="expDt"
                                    value={edtVal?expDt:''} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    
                                    // required
                                />
                            </div>
                        </div>
                        {isInvalidRange && endDate && !startDate && (
                            <div className="row">
                                <div className="col-md-2"></div>
                                <div className="col-md-9 text-red">
                                    First update the Start Date!!
                                </div>
                            </div>
                        )}
                        {isInvalidRange && endDate < startDate && (
                            <div className="row">
                                <div className="col-md-2"></div>
                                <div className="col-md-9 text-red">
                                    End Date cannot be less than Start Date
                                </div>
                            </div>
                        )}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Password:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    type="password"
                                    name="userPwd"
                                    id="exampleFormControlSelect1"
                                    maxLength={100}
                                    value={edtVal.userPwd||''} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Password"
                                    onFocus={() => toggleCharCountVisibility("userPwd")}
                                    onBlur={() => toggleCharCountVisibility("userPwd")}
                                />
                                {fieldCharCountVisibility.userPwd && (
                                    <span className="input-group-text">
                                        {edtVal?.userPwd?.length}/100
                                    </span>
                                )}

                            </div>
                        </div>
                       
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                DOB:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                type="date"
                                    className="form-control fc-datepicker"
                                    placeholder="MM/DD/YYYY"
                                    name="dob"
                                    value={edtVal?dob:''} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    numberOfMonths={1}
                                    
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Mail Id:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    maxLength={100}
                                    name="mailId"
                                    value={edtVal.mailId||''} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Mail Id"
                                    onFocus={() => toggleCharCountVisibility("mailId")}
                                    onBlur={() => toggleCharCountVisibility("mailId")}
                                />
                                {fieldCharCountVisibility.mailId && (
                                    <span className="input-group-text">
                                        {edtVal?.mailId?.length}/100
                                    </span>
                                )}

                            </div>
                            {!isValid3 && <p className="text-red">Invalid Mail Id</p>}
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Mobile No:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"

                                    name="mobNo"
                                    maxLength={10}
                                    value={edtVal.mobNo||''} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Mobile No"
                                />
                            </div>
                            {!isValid && <p className="text-red">Invalid Mobile No</p>}
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Address:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    // required
                                    className="form-control"
                                    maxLength={200}
                                    name="addr"
                                    value={edtVal.addr||""} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Address"
                                    onFocus={() => toggleCharCountVisibility("addr")}
                                    onBlur={() => toggleCharCountVisibility("addr")}
                                />
                                {fieldCharCountVisibility.addr && (
                                    <span className="input-group-text">
                                        {formData?.addr?.length}/200
                                    </span>
                                )}

                            </div>
                        </div>
                        { <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Status:
                            </label>
                            <div className="col-md-9">
                                <select
                                    className="form-select col-md-12"
                                    name="actFlg"
                                    //defaultValue={edtVal.dtlActFlg}
                                    onChange={handleStatusChange}
                                    value={edtVal.actFlg}
                                    placeholder="Select"
                                    disabled={mode === 3 || mode === 4}
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
                        </div>}

                        {mode !== 4 && <button disabled={delStatus} type="submit"  className='btn btn-primary'>{buttonTitle(mode)}</button>}
                        {mode == 1 && <button
                            className="btn btn-secondary mx-2"
                            type="reset"
                            //onClick="resetForm"
                            onClick={(e) => resetForm()}
                        >
                            Reset
                        </button>}
                    </form>
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
        </div>
    );
}