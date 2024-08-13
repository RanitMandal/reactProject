import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
// import { DistLovColumns } from "./Columns";

import Lov from "../../common/Lov _new";

export const WebPortalMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, updateEdtVal, }) => {
  
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00001/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

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
    portalId: '',
    portalTitle: '',
    actFlg: 'A',
    portalDesc: "",
    portalFaviconUrl: "",
    portalLogoDarkUrl: "",
    portalLogoMobDarkUrl: "",
    portalLogoMobUrl: "",
    portalLogoUrl: "",
    portalPubIp: "",
    portalPvtIp: "",
    portalUrl: ""
    
  });

  useEffect(() => {
   if(mode!==1){
    setFormData({
      distCd:  rowData ? rowData.distCd : '',
      distNm: rowData ? rowData.distNm : '',
      portalId: rowData ? rowData.portalId : '',
      portalTitle: rowData ? rowData.portalTitle : '',
      actFlg: rowData ? rowData?.actFlg : 'A',
      stateCd:  rowData ? rowData.stateCd : '',
      stateNm:  rowData ? rowData?.stateNm : '',



      portalId: rowData ? rowData.portalId : '',
      portalTitle: rowData ? rowData.portalTitle : '',
      actFlg: 'A',
      portalDesc:rowData ? rowData.portalDesc : '',
      portalFaviconUrl:rowData ? rowData.portalFaviconUrl : '',
      portalLogoDarkUrl:rowData ? rowData.portalLogoDarkUrl : '',
      portalLogoMobDarkUrl:rowData ? rowData.portalLogoMobDarkUrl : '',
      portalLogoMobUrl:rowData ? rowData.portalLogoMobUrl : '',
      portalLogoUrl: rowData ? rowData.portalLogoUrl : '',
      portalPubIp: rowData ? rowData.portalPubIp : '',
      portalPvtIp: rowData ? rowData.portalPvtIp : '',
      portalUrl:rowData ? rowData.portalUrl : '',
      
    })
   }
  }, [mode, edtVal])
  
  // //state lov Starts
  // const updateOpenData = (newOpenData) => {
  //   newOpenData(newOpenData);
  // };
  // const [stateData, setStateData] = useState({});
  // let postStateObj = {
  //   apiId: "CIA00038",
  // };
  // useEffect(() => {
  //   const fetchStateNameLovData = async () => {
  //     await axios
  //       .post(
  //         process.env.REACT_APP_API_URL_PREFIX + "/WPF00001/getAllState",
  //         postStateObj,
  //         { headers }
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //         setStateData(res.data ? res.data : []);
  //         /*   setMsg(
  //             res?.data?.appMsgList?.list[0]?.errDesc +
  //               " (" +
  //               res?.data?.appMsgList?.list[0]?.errCd +
  //               ")"
  //           );
  //           setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
  //       });
  //   };
  //   fetchStateNameLovData();
  // }, []);

  // const getStateName = (obj) => {
  //   return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.distNm;
  // };

  // const getStateId = (obj) => {
  //   return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.distCd;
  // };

  // const [selectRow, setSelectRow] = useState("");
  // const [showModelStateLov, setShowModelStateLov] = useState(false);
  // const handleRowClickStateLov = (rowData) => {
  //   setSelectRow(rowData);
  //   setFormData({
  //     ...formData,
  //     distCd:getdistCd(rowData),
  //     distNm:getdistNm(rowData)
  //   }
  //   )
  //   // console.log(getStateId(rowData));
  //   // console.log(getStateName(rowData));
  //   // setSelectRowModuleLov({});

  //   // updateOpenData({
  //   //   ...formData,
  //   //   stateCd: getStateCd(rowData),
  //   //   stateNm: getStateNm(rowData),
  //   //   distCd: "",
  //   //   distNm: ""
  //   // });
  //   // In the rendering section
  //   // console.log("Rendering with openData:", openData);
  //   // console.log(openData?.content?.mst.stateCd)
  // };
  // //state Lov ends



  //state Lov Starts
  // const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  // useEffect(() => {
  //   const modGrpLovObj = {
  //     apiId: "CIA00038",


  //   }

  //   const fetchModuleGrpLovData = async () => {
  //     await axios
  //       .post(
  //         process.env.REACT_APP_API_URL_PREFIX + "/WPF00001/getAllState", modGrpLovObj,
  //         { headers }
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //         setModuleGrpLovData(
  //           res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
  //         );
  //       });
  //   };
  //   fetchModuleGrpLovData();
  // }, []);

  // const getstateNm = (obj) => {
  //   return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm : "";
  // };

  // const getstateCd = (obj) => {
  //   return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd : "";
  // };

  // const [selectRow, setSelectRow] = useState("");
  // const [showModel, setShowModel] = useState(false);
  // const handleRowClick = (rowData) => {
  //   setSelectRow(rowData);
  //   // setSelectRowModuleLov({});
  //   setFormData({
  //     ...formData,
  //     stateCd: getstateCd(rowData),
  //     stateNm: getstateNm(rowData),
  //     distCd: "",
  //     distNm: ""
  //   });
  // };
  //state Group Lov ends

  //district Lov Starts

  // const [moduleLovData, setModuleLovData] = useState([]);
  // useEffect(() => {
  //   const formLovObj = {
  //     apiId: "CIA00002",
  //     criteria: {
  //       stateCd: formData.stateCd,
  //     }
  //   };

  //   const fetchModuleLovData = async () => {
  //     await axios
  //       .post(
  //         process.env.REACT_APP_API_URL_PREFIX +
  //         "/WPF00001/getDistByState",
  //         formLovObj,
  //         { headers }
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //         setModuleLovData(
  //           res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
  //         );
  //       });
  //   };

  //   formData.stateCd && fetchModuleLovData();
  // }, [formData?.stateCd]);

  // const getdistNm = (obj) => {
  //   return moduleLovData[Number(Object.keys(obj)[0])]?.distNm ? moduleLovData[Number(Object.keys(obj)[0])]?.distNm : "";
  // };

  // const getdistCd = (obj) => {
  //   return moduleLovData[Number(Object.keys(obj)[0])]?.distCd ? moduleLovData[Number(Object.keys(obj)[0])]?.distCd : "";
  // };

  // const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  // const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  // const handleRowClickModuleLov = (rowData) => {
  //   setSelectRowModuleLov(rowData);
  //   setFormData({
  //     ...formData,
  //     distCd: getdistCd(rowData),
  //     distNm: getdistNm(rowData),
  //   });
    // setQueryInputObj({

    //     ...queryInputObj,
    //     distCd: getdistCd(rowData),

    // });
  // };

  //district Lov Ends

  console.log(formData);


  useEffect(() => {
    if (mode === 1) {
      setEdtVal({
        portalId: '',
        portalTitle: '',
        actFlg: 'A',
      })

    }
  }, [mode])



  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
  };

  const validateInput = (formData) => {
    if ((!formData.name.trim()) || (formData.dev_nm.trim() === "")) {
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
      portalId: '',
      portalTitle: '',
      actFlg: 'A',
      portalDesc: "",
      portalFaviconUrl: "",
      portalLogoDarkUrl: "",
      portalLogoMobDarkUrl: "",
      portalLogoMobUrl: "",
      portalLogoUrl: "",
      portalPubIp: "",
      portalPvtIp: "",
      portalUrl: ""
    })

  };
  //  setEdtVal({
  //   portalId: '', 
  //   portalTitle: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    portalTitle: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "WPA00007",
      mst: 
        {
          portalDesc: formData.portalDesc,
          portalFaviconUrl: formData.portalFaviconUrl,
          portalLogoDarkUrl: formData.portalLogoDarkUrl,
          portalLogoMobDarkUrl: formData.portalLogoMobDarkUrl,
          portalLogoMobUrl: formData.portalLogoMobUrl,
          portalLogoUrl: formData.portalLogoUrl,
          portalPubIp: formData.portalPubIp,
          portalPvtIp: formData.portalPvtIp,
          portalTitle: formData.portalTitle,
          portalUrl: formData.portalUrl
        }


      
    }


    const editObj = {
      apiId: "WPA00009",
      mst: {
        actFlg: formData.actFlg,
    portalDesc: formData.portalDesc,
    portalFaviconUrl: formData.portalFaviconUrl,
    portalId: formData.portalId,
    portalLogoDarkUrl:formData.portalLogoDarkUrl,
    portalLogoMobDarkUrl: formData.portalLogoMobDarkUrl,
    portalLogoMobUrl: formData.portalLogoMobUrl,
    portalLogoUrl:formData.portalLogoUrl,
    portalPubIp: formData.portalPubIp,
    portalPvtIp: formData.portalPvtIp,
    portalTitle: formData.portalTitle,
    portalUrl:formData.portalUrl

      }
    }
 

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00001/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00001/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

      }).catch(error => {
        console.log("error")
      });


    if (mode === 3) {
      set_open(true)
      // Show confirmation dialog
      // Swal.fire({
      //     title: "Are you sure?",
      //     // text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes, delete it!",
      //     backdrop: true,
      // }).then((result) => {
      // if (result.isConfirmed) {
      // If user confirms, make the delete API call
      // if (window.confirm("Are you sure? The record will be deleted parmanantly")) {
      //   axios
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00001/saveDelete', deleteObj, { headers })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (!res?.data?.appMsgList?.errorStatus) {
      //         fetchData();
      //       }
      //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      //       set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      //     })
      //     .catch((error) => {
      //       console.log("error");
      //     });
      // }
      // });
    }

  };

  const pageTitle = editMode ? 'Edit Post' : 'Create Post';

  const getFormTitle = (mode) => {
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

  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "WPA00008",
      mst: {

        portalId: formData.portalId

      }
    }


    axios
      .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00001/saveDelete', deleteObj, { headers })
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData();
        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      })
      .catch((error) => {
        console.log("error");
      });

  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])


  return (
    <div>


      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">
        Web Portal Master  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Portal Id
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="portalId"
                value={formData.portalId}
                readOnly
              />
            </div>
          </div>
        

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Title <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalTitle"
                value={formData.portalTitle}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Title"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal description 
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalDesc"
                value={formData.portalDesc}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Portal description"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalDesc && <span className="input-group-text">{formData.portalDesc.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Logo Url 
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalLogoUrl"
                value={formData.portalLogoUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Logo Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalLogoUrl &&
               <span className="input-group-text">{formData.portalLogoUrl.length}/50</span>
               } */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Logo Mobile Url 
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalLogoMobUrl"
                value={formData.portalLogoMobUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Logo Mobile Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Logo Dark Url
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalLogoDarkUrl"
                value={formData.portalLogoDarkUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Logo Dark Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Logo Mobile Dark Url
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalLogoMobDarkUrl"
                value={formData.portalLogoMobDarkUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Logo Mobile Dark Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Favicon Url
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalFaviconUrl"
                value={formData.portalFaviconUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Favicon Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Url
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalUrl"
                value={formData.portalUrl}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Url"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Public IP 
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalPubIp"
                value={formData.portalPubIp}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Public IP"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
            Portal Private IP 
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="portalPvtIp"
                value={formData.portalPvtIp}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="portal Private IP"
                // required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />
              {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

            </div>
          </div>
          {(mode !==1) && <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Status:
                            </label>
                            <div className="col-md-9">
                                <select
                                    className="form-select col-md-12"
                                    name="actFlg"
                                    //defaultValue={edtVal.dtlActFlg}
                                    onChange={handleStatusChange}
                                    value={formData?.actFlg}
                                    placeholder="Select"
                                    disabled={mode === 3 || mode === 4}
                                >
                                    <option>--Select--</option>

                                    {(mode !== 1) &&
                                        (edtVal?.ddActFlg?.map((item) => (
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
          {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
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

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}