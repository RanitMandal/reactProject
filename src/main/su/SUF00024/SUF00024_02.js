import React,  { useEffect, useState, useRef } from "react";
import Lov from "../../common/Lov _new";
import {getApiToken} from "../../common/common"
import { Alert} from "react-bootstrap";
import axios from 'axios';
import { modLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ErrorDefinitionForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal,index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, parMsg, setParMsg , parMsgTyp, setParMsgTyp, errExp, set_errExp}) => {

  const fetchData = async ()=>{
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00024/getListPageData', queryInputObj, {headers}).then((res)=>{
      console.log(res.data); 
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType) 
    })
}
  const headers = { Authorization: 'Bearer ' + getApiToken() };
      console.log(mode);
      console.log(rowData);
      console.log(rowId);
      console.log(addVal);


  const [formData, setFormData] = useState({
    errCd: rowData?rowData.errCd: '',
    errDesc: rowData?rowData.errDesc: '',
    errType: rowData?rowData.errType: '',
    actFlg: rowData?rowData.actFlg: 'A',
  });

  console.log(formData);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setEdtVal({...edtVal,  [event.target.name]: event.target.value })
  };

   //Err_deff Lov Starts     

   const [modLovData, setModLovData] = useState([]);
   useEffect(() => {

       const fetchModLovData = async () => {
           let obj = {
               apiId: 'SUA00311'
           }
           await axios
               .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00024/getAllMdoules", obj, { headers })
               .then((res) => {
                   console.log(res.data);
                   setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

               });
       };
       fetchModLovData();
   }, []);


   const getModNm = (obj) => {
       return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm:""
   }

   const getModId = (obj) => {
       return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId:""
   }

   const [selectRow, setSelectRow] = useState("");
   const [selectRowModLov, setSelectRowModLov] = useState("");
   const [showModelModLov, setShowModelModLov] = useState(false);
   const handleRowClickModLov = (rowData) => {
       setSelectRow(rowData);
       setSelectRowModLov(rowData);
       // setQueryInputObj({
       //     ...queryInputObj,
       //     criteria: {
       //         ...queryInputObj.criteria,
       //         errCd: getErrDeffId(rowData)
       //     }
       // });

   };
   // console.log(queryInputObj);
   //Module Lov ends  
   
   const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj = 
      {
        apiId: "SUA00310",
          mst: [
          {
            actFlg: formData.actFlg,
      errDesc: formData.errDesc,
      errType: formData.errType,
      modId: getModId(selectRow)
          }
        ]
      }
      

    const editObj = {
      apiId: "SUA00323",
           mst:{
      
        ...formData
   
    }
  }
    const deleteObj = {
      apiId: "SUA00321",
             mst:{
      
        errCd:formData.errCd
     
    }
  }
        
          if(mode === 1)
          await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00024/saveAdd', addObj, {headers}).then(res => {
              console.log(res.data)
              if (!res?.data?.appMsgList?.errorStatus) {
                fetchData()
                
                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                set_errExp({status:res.data?.appMsgList?.errorStatus})
                if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
                resetForm1();
                }
      
          }).catch(error => {
              console.log("error")
          }).finally(() => {
            set_viewMsg(true)
        });
          
          
          if(mode === 2)
          await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00024/saveEdit', editObj, {headers}).then(res => {
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
          apiId: "SUA00321",
                 mst:{
          
            errCd:formData.errCd
         
        }
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00024/saveDelete', deleteObj, {headers}).then(res => {
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

const resetForm1 = () => {
          
  setFormData({
   errCd: '', 
   errDesc: '',
   errType:"",
   actFlg:  'A'})
 
  };
  const resetForm = () => {
     setMsg("")
     setMsgTyp("")     
    setFormData({
     errCd: '', 
     errDesc: '',
     errType:"",
     actFlg:  'A'})
   
    };

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
      errDesc: false,
      
      // Add more fields here as needed
    });
  
    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
      setFieldCharCountVisibility((prevState) => ({
        ...prevState,
        [fieldName]: !prevState[fieldName],
      }));
    };

  return (
    <div>
      <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> } 
                <h4 className="card-title">
                    Error Definition  {getFormTitle(mode)}
                </h4>
        <div className="container">
          <div className="row ">
          <form className="form-horizontal" onSubmit={(e)=>handleSubmit(e, mode, data, setData, onClose)}>
              {/* <div className=" row mb-4">
                <label htmlFor="zip" className="col-md-3 form-label">
                  Row#:
                </label>
                <div className="col-md-9">
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    id=""
                    placeholder="1"
                    readOnly
                  />
                </div>
              </div> */}
              <div className=" row mb-4">
                <label for="phone" className="col-md-3 form-label">
                  Code:
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    name="errCd"
                    value={formData.errCd}
                    placeholder="Code"
                    readOnly
                    
                   // maxlength="10"
                   
                  />
                </div>
              </div>

             {mode===1&& <div className="row mb-4 ">
                      <label  className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                      <div className="col-md-9">
                        <div className="input-group">
                       { (mode===1 || mode===2)&&<span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() =>setShowModelModLov(true)} /></span>}
                          
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control"
                            required
                            disabled="true"
                            name="modId"
                            value={getModId(selectRow)}
              //               onChange={(e) => {
              //   // Update edtVal.modGrpId when the input changes
              //   const newValue = e.target.value;
              //   setEdtVal((prevEdtVal) => ({
              //     ...prevEdtVal,
              //     modGrpId: newValue,
              //     setSelectRow:''
              //   }));
              // }}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            name="modNm"
                            disabled="true"
                            value={getModNm(selectRow)}
              //               onChange={(e) => {
              //   // Update edtVal.modGrpId when the input changes
              //   const newValue = e.target.value;
              //   setEdtVal((prevEdtVal) => ({
              //     ...prevEdtVal,
              //     modGrpNm: newValue,
              //     setSelectRow:''
              //   }));
              // }}
                          />
                           <div className="row-mb-12">
                                                                    {showModelModLov && <Lov
                                                                        moduleLovData={modLovData}
                                                                        setShowModel={setShowModelModLov}
                                                                        showModel={showModelModLov}
                                                                        handleRowClick={handleRowClickModLov}
                                                                        columns={modLovColumns}
                                                                        currentSelection={selectRow}
                                                                        setCurrentSelection={setSelectRow}
                                                                    />}
                                                                </div>
                        </div>
                      </div>
                    </div>}

              <div className=" row mb-4">
                <label htmlFor="inputEmail3" className="col-md-3 form-label">
                  Description:<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    type="text"
                    className="form-control"
                    
                    name="errDesc"
                    value={formData.errDesc}
                    onChange={handleInputChange}
                    placeholder="Description"
                    maxLength={300}
                    disabled={mode ===3 || mode ===4}
                    onFocus={() => toggleCharCountVisibility("errDesc")}
              onBlur={() => toggleCharCountVisibility("errDesc")}
            />
            {fieldCharCountVisibility.errDesc && (
              <span className="input-group-text">
                {formData?.errDesc?.length}/300
              </span>
            )}
                </div>
              </div>

             
              <div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Type:<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                        <select
                        className="form-select col-md-12"
                        name="errType"
                        disabled={mode===3 || mode===4}
                        //defaultValue={edtVal.dtlActFlg}
                        onChange={handleStatusChange}
                        value={formData.errType}
                        
                      >
                       <option>--Select--</option>

{(mode===1)?
    (addVal?.ddErrType?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))):(edtVal?.ddErrType?.map((item)=>(
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

          </div>
        </div>

       
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
export default ErrorDefinitionForm;