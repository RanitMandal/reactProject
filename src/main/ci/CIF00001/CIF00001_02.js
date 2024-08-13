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
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import Lov from "../../common/Lov _new";

export const CourtDefinitionForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, updateEdtVal, }) => {
  
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/getListPageData', queryInputObj, { headers }).then((res) => {
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
    distCd: '',
    distNm: '',
    courtId:  '',
    courtNm:  '',
    actFlg: 'A',
    stateCd: '',
    stateNm:  '',
    
  });

  useEffect(() => {
   if(mode!==1){
    setFormData({
      distCd:  rowData ? rowData.distCd : '',
      distNm: rowData ? rowData.distNm : '',
      courtId: rowData ? rowData.courtId : '',
      courtNm: rowData ? rowData.courtNm : '',
      actFlg: rowData ? rowData?.actFlg : 'A',
      stateCd:  rowData ? rowData.stateCd : '',
      stateNm:  rowData ? rowData?.stateNm : '',
      
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
  //         process.env.REACT_APP_API_URL_PREFIX + "/CIF00001/getAllState",
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
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  useEffect(() => {
    const modGrpLovObj = {
      apiId: "CIA00038",


    }

    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/CIF00001/getAllState", modGrpLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleGrpLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getstateNm = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm : "";
  };

  const getstateCd = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd : "";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    // setSelectRowModuleLov({});
    setFormData({
      ...formData,
      stateCd: getstateCd(rowData),
      stateNm: getstateNm(rowData),
      distCd: "",
      distNm: ""
    });
  };
  //state Group Lov ends

  //district Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "CIA00002",
      criteria: {
        stateCd: formData.stateCd,
      }
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/CIF00001/getDistByState",
          formLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };

    formData.stateCd && fetchModuleLovData();
  }, [formData?.stateCd]);

  const getdistNm = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.distNm ? moduleLovData[Number(Object.keys(obj)[0])]?.distNm : "";
  };

  const getdistCd = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.distCd ? moduleLovData[Number(Object.keys(obj)[0])]?.distCd : "";
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    setFormData({
      ...formData,
      distCd: getdistCd(rowData),
      distNm: getdistNm(rowData),
    });
    // setQueryInputObj({

    //     ...queryInputObj,
    //     distCd: getdistCd(rowData),

    // });
  };

  //district Lov Ends

  console.log(formData);


  useEffect(() => {
    if (mode === 1) {
      setEdtVal({
        courtId: '',
        courtNm: '',
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
      courtId: '',
      courtNm: '',
      actFlg: 'A'
    })

  };
  //  setEdtVal({
  //   courtId: '', 
  //   courtNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({
    courtNm: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "CIA00008",
      mst: [
        {
          courtNm: formData.courtNm,
          distCd: formData?.distCd,
          stateCd: formData?.stateCd
        }


      ]
    }


    const editObj = {
      apiId: "CIA00010",
      mst: {

        actFlg: formData.actFlg,
        courtId: formData.courtId,
        courtNm: formData.courtNm,
        distCd: formData.distCd

      }
    }
    const deleteObj = {
      apiId: "CIA00009",
      mst: {

        courtId: formData.courtId

      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/saveAdd', addObj, { headers }).then(res => {
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/saveEdit', editObj, { headers }).then(res => {
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
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/saveDelete', deleteObj, { headers })
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
      apiId: "CIA00009",
      mst: {

        courtId: formData.courtId

      }
    }


    axios
      .post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/saveDelete', deleteObj, { headers })
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
          Court Defination  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Code
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="courtId"
                value={formData.courtId}
                readOnly
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Name <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="courtNm"
                value={formData.courtNm}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Name"
                required
                maxLength={200}
                disabled={mode === 3 || mode === 4}

              />{charCount.courtNm && <span className="input-group-text">{formData.courtNm.length}/200</span>}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              State<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                  <i
                    className="fa fa-search d-inline text-white"

                    onClick={() => setShowModel(true)}
                  />
                </span>}
                <input
                  type="text"
                  aria-label="First name"
                  className="form-control  col-md-2 rounded-3"
                  value={formData?.stateCd}
                  // onChange={(e) => {
                  //   // Update edtVal.stateCd when the input changes
                  //   const newValue = e.target.value;
                  //   setEditVal((prevEditVal) => ({
                  //     ...prevEditVal,
                  //     stateCd: newValue,
                  //     setSelectRow: "",
                  //   }));
                  // }}
                  disabled={mode === 3 || mode === 4}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  className="form-control col-md-9 mx-4 rounded-3"
                  // value={formData?.modGrpName || ''}
                  value={formData?.stateNm}
                  // onChange={(e) => {
                  //   // Update edtVal.stateCd when the input changes
                  //   const newValue = e.target.value;
                  //   setEditVal((prevEditVal) => ({
                  //     ...prevEditVal,
                  //     stateCd: newValue,
                  //     setSelectRow: "",
                  //   }));
                  // }}
                  disabled={mode === 3 || mode === 4}
                />
                <div className="row-mb-12">
                  {showModel && (
                    <Lov
                      moduleLovData={moduleGrpLovData}
                      setShowModel={setShowModel}
                      showModel={showModel}
                      handleRowClick={handleRowClick}
                      columns={moduleGrpLovColumns}
                      currentSelection={selectRow}
                      setCurrentSelection={setSelectRow}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" row mb-4">
            <div className="col-md-3">
              <label className="form-label">
                District<span className="text-red">*</span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary">
                  <i
                    className="fa fa-search d-inline text-white"

                    onClick={() => setShowModelModuleLov(true)}

                  />
                </span>}
                <input
                  type=""
                  aria-label="First name"
                  className="form-control  col-md-2 rounded-3"
                  required
                  value={formData?.distCd}

                  // onChange={(e) => {
                  //   // Update edtVal.stateCd when the input changes
                  //   const newValue = e.target.value;
                  //   setEditVal((prevEditVal) => ({
                  //     ...prevEditVal,
                  //     distCd: newValue,
                  //     setSelectRowModuleLov: "",
                  //   }));
                  // }}
                  //value={getdistCd(selectRowModuleLov)? getdistCd(selectRowModuleLov): "" }

                  disabled={mode === 3 || mode === 4}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  className="form-control col-md-9 mx-4 rounded-3"
                  value={formData?.distNm}

                  // onChange={(e) => {
                  //   // Update edtVal.stateCd when the input changes
                  //   const newValue = e.target.value;
                  //   setEditVal((prevEditVal) => ({
                  //     ...prevEditVal,
                  //     distCd: newValue,
                  //     setSelectRowModuleLov: "",
                  //   }));
                  // }}
                  //va
                  // value={getdistNm(selectRowModuleLov)? getdistNm(selectRowModuleLov): "" }
                  required
                  disabled={mode === 3 || mode === 4}
                />
                <div className="row-mb-12">
                  {showModelModuleLov && (
                    <Lov
                      moduleLovData={moduleLovData}
                      setShowModel={setShowModelModuleLov}
                      showModel={showModelModuleLov}
                      handleRowClick={handleRowClickModuleLov}
                      columns={moduleLovColumns}
                      currentSelection={selectRowModuleLov}
                      setCurrentSelection={setSelectRowModuleLov}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* <div className="row mb-3 mx-4">
                      <label  className="col-sm-3 col-form-label"><b>District:<span className="text-red">*</span></b></label>
                      <div className="col-md-6">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            
                            className="form-control col-md-2 rouned"
                            required
                            value={getdistCd(selectRow)?getdistCd(selectRow):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getdistNm(selectRow)?getdistNm(selectRow):''}
                          />
                           <div className="row-mb-12">
                                {showModelStateLov && <Lov 
                                moduleLovData={stateData} 
                                setShowModel={setShowModelStateLov} 
                                showModel={showModelStateLov}
                                handleRowClick={handleRowClickStateLov}
                                columns={DistLovColumns}
                                currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                                />}
                            </div>
                        </div>
                      </div>
                    </div> */}
          <div className="row mb-4">
            <label className="col-md-3 form-label">
              Status:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4}
                //  defaultValue={edtVal.dtlactFlg}
                onChange={handleStatusChange}
                value={formData?.actFlg}

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