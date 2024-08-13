import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { divLovColumns, subDivLovColumns, userLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const DivSubMapForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp ,errExp, set_errExp}) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content?.qryRsltSet);
      // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      console.log(data);
    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(edtVal)
// useEffect(() => {
//   if(mode===1)
//   setEdtVal({})
// }, [mode])

  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log("edtVal",edtVal);
   if (mode===1) {
    setFormData({
      id: '',
      subLvlRefCd:  '',
      userId:  '',
      lvlRefCd:  '',
      lvlNm:  '',
      subLvlNm:  '',
      userNm: "",
      actFlg: 'A',
    })
      
    } else {
      setFormData({
        id: rowData ? rowData.id : '',
      subLvlRefCd: edtVal ? edtVal.subLvlRefCd : '',
      userId: edtVal ? edtVal.userId : '',
      lvlRefCd: edtVal ? edtVal.lvlRefCd : '',
      lvlNm: edtVal ? edtVal.lvlNm : '',
      subLvlNm: edtVal ? edtVal.subLvlNm : '',
      userNm: edtVal? edtVal.userNm:"",
      actFlg: edtVal ? edtVal.actFlg : 'A',
      })
      
    }
  }, [mode, edtVal])
  
  console.log("formData",formData);
  // const [formData, setFormData] = useState({})



  const [showCharacterCount, setShowCharacterCount] = useState(false);











 //Division Lov Starts     
      
const [divLovData, setDivLovData] = useState([]);
useEffect(() => {

  const fetchDivLovData = async () => {
    let obj={
        apiId:"SUA00357"
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00104/getAllDivision",obj, {headers} )
      .then((res) => {
        console.log(res.data);
        setDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
        // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
        //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
        //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        
      });
  };
  fetchDivLovData();
}, []);


const getDivNm = (obj)=>{
  return divLovData[Number(Object.keys(obj)[0])]?.lvlNm ? divLovData[Number(Object.keys(obj)[0])]?.lvlNm:""
}

const getDivCd = (obj)=>{
  return divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd:""
}

const [selectRow, setSelectRow] = useState("");
const [selectRowDivLov, setSelectRowDivLov] = useState("");
const [showModelDivLov, setShowModelDivLov] = useState(false);
const handleRowClickDivLov = (rowData) => {
 console.log(rowData)
 setSelectRow(rowData);
  setSelectRowDivLov(rowData);
  setFormData({
    ...formData,
    lvlRefCd:getDivCd(rowData),
    lvlNm:getDivNm(rowData),
    subLvlRefCd:"",
    subLvlNm:"",
    userId:"",
    userNm:""
  
  })
  // setQueryInputObj({
  //   apiId: "SUA00360",
  //   criteria: {
  //       lvlRefCd: getDivCd(rowData)
  //   }
  // })
};
//Division Lov ends   



 //Sub-Division Lov Starts
 const [subDivObj, set_subDivObj]= useState({})  
  useEffect(() => {
    set_subDivObj({
      apiId: "SUA00358",
      criteria: {
        lvlRefCd: formData.lvlRefCd || getDivCd(selectRow)
      }
    })
  }, [formData.lvlRefCd, selectRow])
     
 const [subDivLovData, setSubDivLovData] = useState([]);
 useEffect(() => {
 
   const fetchSubDivLovData = async () => {
     
     await axios
       .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00104/getAllSubDivision",subDivObj, {headers} )
       .then((res) => {
         console.log(res.data);
         setSubDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
         // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
         //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
         //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
         
       });
   };
   subDivObj && fetchSubDivLovData();
 }, [subDivObj]);
 
 
 const getSubDivNm = (obj)=>{
   return subDivLovData[Number(Object.keys(obj)[0])]?.lvlNm ? subDivLovData[Number(Object.keys(obj)[0])]?.lvlNm:""
 }
 
 const getSubDivCd = (obj)=>{
   return subDivLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? subDivLovData[Number(Object.keys(obj)[0])]?.lvlRefCd:""
 }
 
 const [selectRowSubDiv, setSelectRowSubDiv] = useState("");
 const [selectRowSubDivLov, setSelectRowSubDivLov] = useState("");
 const [showModelSubDivLov, setShowModelSubDivLov] = useState(false);
 const handleRowClickSubDivLov = (rowData) => {
  console.log(rowData)
  setSelectRowSubDiv(rowData);
   setSelectRowSubDivLov(rowData);
   setFormData({
    ...formData,
    subLvlRefCd:getSubDivCd(rowData),
    subLvlNm:getSubDivNm(rowData),
    userId:"",
    userNm:""
  
  })
 };
 //Sub-Division Lov ends 
 
  //User Lov Starts     
      
  const [userLovData, setUserLovData] = useState([]);
  useEffect(() => {
  
    const fetchUserLovData = async () => {
      let obj={
       apiId: "SUA00359",
       
     }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00104/getAllUsers",obj, {headers} )
        .then((res) => {
          console.log(res.data);
          setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
          //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
          //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          
        });
    };
    fetchUserLovData();
  }, []);
  
  
  const getUserNm = (obj)=>{
    return userLovData[Number(Object.keys(obj)[0])]?.userNm ? userLovData[Number(Object.keys(obj)[0])]?.userNm:""
  }
  
  const getUserCd = (obj)=>{
    return userLovData[Number(Object.keys(obj)[0])]?.userId ? userLovData[Number(Object.keys(obj)[0])]?.userId:""
  }
  
  const [selectRowUser, setSelectRowUser] = useState("");
  const [selectRowUserLov, setSelectRowUserLov] = useState("");
  const [showModelUserLov, setShowModelUserLov] = useState(false);
  const handleRowClickUserLov = (rowData) => {
   console.log(rowData)
   setSelectRowUser(rowData);
    setSelectRowUserLov(rowData);
    setFormData({
      ...formData,
      userId:getUserCd(rowData),
      userNm:getUserNm(rowData)
    
    })
  };
  //Sub-Division Lov ends 


  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };





  const validateInput = (formData) => {
    if ((!formData.st_code.trim()) || (formData.st_code.trim() === "")) {
      return false;
    }
    if ((!formData.st_desc.trim()) || (formData.st_desc.trim() === "")) {
      return false;
    }
    if ((!formData.code.trim()) || (formData.code.trim() === "")) {
      return false;
    }
    if ((!formData.Dist_name.trim()) || (formData.Dist_name.trim() === "")) {
      return false;
    }
    // other validations

    return true;
  };
  const resetForm = () => {
    setSelectRow('')
    setSelectRowDivLov("")
    setSelectRowSubDivLov({})
    // selectRowSubDiv("")
    // selectRowUser("")
    setSelectRowUserLov({})
    setFormData({
      id: '',
      subLvlRefCd:  '',
      userId:  '',
      lvlRefCd:  '',
      lvlNm:  '',
      subLvlNm:  '',
      userNm: "",
      actFlg: 'A',
    })

  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(selectRowDivLov);

    const addObj = {
      apiId: "SUA00356",
      mst: [

        {
          lvlRefCd: formData.lvlRefCd,
          subLvlRefCd: formData.subLvlRefCd,
          userId: formData.userId
        }

      ]
    }

    const editObj = {
      apiId: "SUA00367",
      mst: {
        lvlRefCd: formData.lvlRefCd,
        subLvlRefCd: formData.subLvlRefCd,
        userId: formData.userId
      }
    }
   

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
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
          apiId: "SUA00366",
          mst: {
            lvlRefCd: formData.lvlRefCd,
            subLvlRefCd: formData.subLvlRefCd,
            userId: formData.userId
          }
        }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/saveDelete', deleteObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})



      }).catch(error => {
        console.log("error")
      }).finally(() => {
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
    }}


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
                    Division SubDivision User Mapping {getFormTitle(mode)}
                </h4>
        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
       
       {/* Division */}
        {(mode === 1) ?  <div className="row mb-3 mx-2">
                      <label  className="col-sm-3 col-form-label"><b>Division:<span className="text-red">*</span></b></label>
                      <div className="col-md-9">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDivLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            
                            className="form-control col-md-2 rouned"
                            // readOnly
                            required
                            value={getDivCd(selectRowDivLov)?getDivCd(selectRowDivLov):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getDivNm(selectRowDivLov)?getDivNm(selectRowDivLov):''}
                          />
                           <div className="row-mb-12">
                                {showModelDivLov && <Lov 
                                moduleLovData={divLovData} 
                                setShowModel={setShowModelDivLov} 
                                showModel={showModelDivLov}
                                handleRowClick={handleRowClickDivLov}
                                columns={divLovColumns}
                                currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                                />}
                            </div>
                        </div>
                      </div>
                    </div> : <div className="row mb-2 mx-2 ">
          <label className="col-sm-3 col-form-label"><b>Division:</b></label>
          <div className="col-md-9">
            <div className="input-group">
           {(mode===2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDivLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                disabled={mode ===3 || mode===4}
                value={formData.lvlRefCd}
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                disabled={mode ===3 || mode===4}
                value={formData.lvlNm}
              />
               {showModelDivLov && <Lov 
                                moduleLovData={divLovData} 
                                setShowModel={setShowModelDivLov} 
                                showModel={showModelDivLov}
                                handleRowClick={handleRowClickDivLov}
                                columns={divLovColumns}
                                currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                                />}
            </div>
          </div>
        </div>}

      
        <div className="container border mb-4">

          <div className="">
            
{/* Sub-Division */}
{(mode === 1) ?  <div className="row mb-3">
                      <label  className="col-sm-3 col-form-label"><b>Sub-Division:<span className="text-red">*</span></b></label>
                      <div className="col-md-9">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelSubDivLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            
                            className="form-control col-md-2 rouned"
                            // readOnly
                            required
                            value={getSubDivCd(selectRowSubDivLov)?getSubDivCd(selectRowSubDivLov):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getSubDivNm(selectRowSubDivLov)?getSubDivNm(selectRowSubDivLov):''}
                          />
                           <div className="row-mb-12">
                                {showModelSubDivLov && <Lov 
                                moduleLovData={subDivLovData} 
                                setShowModel={setShowModelSubDivLov} 
                                showModel={showModelSubDivLov}
                                handleRowClick={handleRowClickSubDivLov}
                                columns={subDivLovColumns}
                                currentSelection={selectRowSubDivLov}
                                setCurrentSelection={setSelectRowSubDivLov}
                                />}
                            </div>
                        </div>
                      </div>
                    </div> : <div className="row mb-2">
          <label className="col-sm-3 col-form-label"><b>Sub-Division:</b></label>
          <div className="col-md-9">
            <div className="input-group">
           {(mode===2) &&<span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelSubDivLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                disabled={mode ===3 || mode===4}
                value={formData.subLvlRefCd}
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                disabled={mode ===3 || mode===4}
                value={formData.subLvlNm}
              />
              {showModelSubDivLov && <Lov 
                                moduleLovData={subDivLovData} 
                                setShowModel={setShowModelSubDivLov} 
                                showModel={showModelSubDivLov}
                                handleRowClick={handleRowClickSubDivLov}
                                columns={subDivLovColumns}
                                currentSelection={selectRowSubDivLov}
                                setCurrentSelection={setSelectRowSubDivLov}
                                />}
            </div>
          </div>
        </div>}

        {/* User */}
{(mode === 1) ?  <div className="row mb-3">
                      <label  className="col-sm-3 col-form-label"><b>User:<span className="text-red">*</span></b></label>
                      <div className="col-md-9">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            
                            className="form-control col-md-2 rouned"
                            // readOnly
                            required
                            value={getUserCd(selectRowUserLov)?getUserCd(selectRowUserLov):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getUserNm(selectRowUserLov)?getUserNm(selectRowUserLov):''}
                          />
                           <div className="row-mb-12">
                                {showModelUserLov && <Lov 
                                moduleLovData={userLovData} 
                                setShowModel={setShowModelUserLov} 
                                showModel={showModelUserLov}
                                handleRowClick={handleRowClickUserLov}
                                columns={userLovColumns}
                                currentSelection={selectRowUserLov}
                                setCurrentSelection={setSelectRowUserLov}
                                />}
                            </div>
                        </div>
                      </div>
                    </div> : <div className="row mb-2 ">
          <label className="col-sm-3 col-form-label"><b>User:</b></label>
          <div className="col-md-9">
            <div className="input-group">
            {(mode===2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                disabled={mode ===3 || mode===4}
                value={formData.userId}
              />
              <input
                type="text"
                autoComplete={false}
                className="form-control  mx-4"
                disabled={mode ===3 || mode===4}
                value={formData.userNm}
              />
               {showModelUserLov && <Lov 
                                moduleLovData={userLovData} 
                                setShowModel={setShowModelUserLov} 
                                showModel={showModelUserLov}
                                handleRowClick={handleRowClickUserLov}
                                columns={userLovColumns}
                                currentSelection={selectRowUserLov}
                                setCurrentSelection={setSelectRowUserLov}
                                />}
            </div>
          </div>
        </div>}
             
              
           
          </div>

        </div>
        {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
              {mode == 1 && <button
                className="btn btn-secondary mx-2"
                type="button"
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
  );
};

export default DivSubMapForm;