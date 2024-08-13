
import React, { useEffect, useState, useRef } from "react";
import { Modal, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { modGrpLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const ModuleMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, setQueryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp }) => {

  console.log(edtVal);
  console.log(addVal.ddImgDbFlg);
  // if(mode===1){
  //   setEdtVal({
  //     ...edtVal,
  //     subTreeFlg:"N"
  //   })
  // }


  // Module Group LOV Start..............
  const [modGrpLovData, setModGrpLovData] = useState([]);
  useEffect(() => {

    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: 'SUA00177'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00005/getAllModGrp", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setModGrpLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

        });
    };
    fetchModGrpLovData();
  }, []);


  const getModGrpNm = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm ? modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm : ""
  }

  const getModGrpId = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId ? modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId : ""
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowModGrpLov, setSelectRowModGrpLov] = useState("");
  const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
  const handleRowClickModGrpLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModGrpLov(rowData);
    updateEdtVal({
      ...edtVal, modGrpId: getModGrpId(rowData),
      modGrpNm: getModGrpNm(rowData)
    });
    setFormData({
      ...formData,
      modGrpId: getModGrpId(rowData),
      modGrpNm: getModGrpNm(rowData)
    })
    // setQueryInputObj({
    //   apiId: "SUA00178",
    //   criteria: {
    //     actFlg: "A",
    //     modGrpId: getModGrpId(rowData)
    //   }
    // });
  };
  //Module group Lov ends

  const [formData, setFormData] = useState({
    modGrpId: "",
    modGrpNm: "",
    modId: "",
    modNm: "",
    modPrefix: "",
    imgDbFlg: "N",
    imgPath: "",
    img: 0,
    imgNm: "",
    helppath: "",
    subTreeFlg: "N",
    viewFlg: "N",
    srvUrl: "",
    loginFlg: "N",
    otpFlg: "N",
    actFlg: "A",
  });



  // {
  //   id: rowData?rowData.id: '',

  //   modId: rowData?rowData.modId: '',
  //   modNm: rowData?rowData.modNm: '',
  //   modPrefix: rowData?rowData.modPrefix: '',

  //   imgPath: rowData?rowData.imgPath: '',

  //   actFlg: rowData?(rowData?.actFlg==="A"?"Y":"N"): 'A',
  // }


  useEffect(() => {
    if (mode !== 1) {
      // // Set all properties of edtVal to null
      // setEdtVal({
      //   ...edtVal,
      //   modGrpId: '',
      //   modGrpNm: '',
      //   modId: '',
      //   modNm: '',
      //   modPrefix: '',
      //   imgDbFlg:  'N',
      //   imgPath: '',
      //   img: 0,
      //   imgNm: '',
      //   helppath: '',
      //   srvUrl: '',
      //   subTreeFlg: 'N',
      //   viewFlg: 'N',
      //   otpFlg: 'N',
      //   loginFlg: 'N',

      // });

      setFormData({
        modGrpId: edtVal ? edtVal.modGrpId : "",
        modGrpNm: edtVal ? edtVal.modGrpNm : "",
        modId: rowData ? rowData.modId : "",
        modNm: rowData ? rowData.modNm : "",
        modPrefix: rowData ? rowData.modPrefix : "",
        imgDbFlg: edtVal ? edtVal.imgDbFlg : "N",
        imgPath: rowData ? rowData.imgPath : "",
        img: edtVal ? edtVal.img : 0,
        imgNm: edtVal ? edtVal.imgNm : "",
        helppath: edtVal ? edtVal.helppath : "",
        subTreeFlg: edtVal ? edtVal.subTreeFlg : "N",
        viewFlg: edtVal ? edtVal.viewFlg : "N",
        srvUrl: edtVal ? edtVal.srvUrl : "",
        loginFlg: edtVal ? edtVal.loginFlg : "N",
        otpFlg: edtVal ? edtVal.otpFlg : "N",
        actFlg: rowData ? rowData?.actFlg : "A",
      })
    }
  }, [mode, edtVal]);

  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");

    let modGrpId = edtVal?.modGrpId || ""
    let resIndex = modGrpLovData.findIndex(item => item.modGrpId === modGrpId)
    let currentModGrpId = {}
    if (resIndex !== -1) currentModGrpId = { [resIndex]: true }
    setSelectRow(currentModGrpId)
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);




  }, [rowData, edtVal, modGrpLovData])

  const handleSelectChange = (event) => {
    // setQueryInputObj({
    //   ...queryInputObj,
    //   actFlg: event.target.value,
    // });
  };



  // Get All List
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00005/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    })
  }



  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(formData);





  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'img' && isNaN(value)) {
      // Show error message or handle the error in your preferred way
      console.error(`Please enter only numeric values for ${name}.`);
      // You can also set an error state and display it to the user
    } else {
      // If the entered value is a number or it's not the 'img' field, update the state
      setFormData({ ...formData, [name]: value });
      // setEdtVal({ ...edtVal, [name]: value });
    }


  };

  const handleStatusChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setEdtVal({...edtVal, [event.target.name]: event.target.value})
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? "Y" : "N",
    });
  };

  const validateInput = (formData) => {
    if ((!formData.mod_grp_code.trim()) || (formData.mod_grp_code.trim() === "")) {
      return false;
    }
    if ((!formData.mod_grp_name.trim()) || (formData.mod_grp_name.trim() === "")) {
      return false;
    }
    if ((!formData.mod_code.trim()) || (formData.mod_code.trim() === "")) {
      return false;
    }
    if ((!formData.mod_name.trim()) || (formData.mod_name.trim() === "")) {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {

    setFormData({
      modGrpId: "",
      modGrpNm: "",
      modId: "",
      modNm: "",
      modPrefix: "",
      imgDbFlg: "N",
      imgPath: "",
      img: 0,
      imgNm: "",
      helppath: "",
      subTreeFlg: "N",
      viewFlg: "N",
      srvUrl: "",
      loginFlg: "N",
      otpFlg: "N",
      actFlg: "A",
    })
    // setEdtVal({
    //     ...edtVal,
    //   modGrpId: '',
    //   modGrpNm: '',
    //   modId: '',
    //   modNm: '',
    //   modPrefix: '',
    //   imgDbFlg: 'N',
    //   imgPath: '',
    //   img: 0,
    //   imgNm: '',
    //   helppath: '',
    //   srvUrl: '',
    //   subTreeFlg: 'N',
    //   viewFlg: 'N',
    //   otpFlg: 'N',
    //   loginFlg: 'N',

    // });

    console.log(edtVal);
  };

  //  function resetForm () {
  //   // Get the form element by its ID
  //   const form = document.getElementById("myForm");

  //   // Reset the form fields
  //   form.reset();
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(selectRowModGrpLov);
    console.log(formData)
    const addObj = {
      apiId: "SUA00184",
      mst: {
        // actFlg: formData.actFlg || '', // Set a default value if it's empty or uedtVal
        helppath: formData.helppath || '', // Set a default value if it's empty or undefined
        img: parseInt(formData.img) || 0, // Set a default value if it's empty or undefined
        // imgColor: edtVal.imgColor || '', // Set a default value if it's empty or undefined
        imgDbFlg: formData.imgDbFlg || 'N', // Set a default value if it's empty or undefined
        imgNm: formData.imgNm || '', // Set a default value if it's empty or undefined
        imgPath: formData.imgPath || '', // Set a default value if it's empty or undefined
        loginFlg: formData.loginFlg || 'N', // Set a default value if it's empty or undefined
        modGrpId: formData.modGrpId || '', // Set a default value if it's empty or undefined
        // modId: formData.modId || '', // Set a default value if it's empty or undefined
        modNm: formData.modNm || '', // Set a default value if it's empty or undefined
        modPrefix: formData.modPrefix || '', // Set a default value if it's empty or undefined
        otpFlg: formData.otpFlg || 'N', // Set a default value if it's empty or undefined
        srvUrl: formData.srvUrl || '', // Set a default value if it's empty or undefined
        subTreeFlg: formData.subTreeFlg || 'N', // Set a default value if it's empty or undefined
        viewFlg: formData.viewFlg || 'N', // Set a default value if it's empty or undefined
      }
    }



    const editObj = {
      apiId: "SUA00186",
      mst: {
        actFlg: formData?.actFlg || '', // Set a default value if it's empty or uedtVal
        helppath: formData.helppath || '', // Set a default value if it's empty or undefined
        img: parseInt(formData.img) || 0, // Set a default value if it's empty or undefined
        imgDbFlg: formData.imgDbFlg || 'N', // Set a default value if it's empty or undefined
        imgNm: formData.imgNm || '', // Set a default value if it's empty or undefined
        imgPath: formData.imgPath || '', // Set a default value if it's empty or undefined
        loginFlg: formData.loginFlg || 'N', // Set a default value if it's empty or undefined
        modGrpId: formData.modGrpId || '', // Set a default value if it's empty or undefined
        modId: formData.modId || '', // Set a default value if it's empty or undefined
        modNm: formData.modNm || '', // Set a default value if it's empty or undefined
        modPrefix: formData.modPrefix || '', // Set a default value if it's empty or undefined
        otpFlg: formData.otpFlg || 'N', // Set a default value if it's empty or undefined
        srvUrl: formData.srvUrl || '', // Set a default value if it's empty or undefined
        subTreeFlg: formData.subTreeFlg || 'N', // Set a default value if it's empty or undefined
        viewFlg: formData.viewFlg || 'N', // Set a default value if it's empty or undefined
      }
    }


    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00005/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00005/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

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

  // right: 0 !important;
  //     position: absolute;
  //     padding: 8px;
  //     top: 8px;
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    //setConfirmStatus(true);
    const deleteObj = {
      apiId: "SUA00185",
      mst: {

        modGrpId: formData.modGrpId,
        modId: formData.modId

      }
    }
    console.log(confirmStatus);
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00005/saveDelete', deleteObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
        fetchData()

      }
      set_delStatus(true)
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({ status: res.data?.appMsgList?.errorStatus })



    }).catch(error => {
      console.log("error")
    }).finally(() => {
      set_viewMsg(true)
    });

  };



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
    }
  }




  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    modNm: false,
    modPrefix: false,
    img: false,
    imgNm: false,
    helppath: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };


  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)
console.log("yyyyy");
  }, [viewMsg])


  return (
    <div className="container">
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
      <h4 className="card-title">Module Master {getFormTitle(mode)}</h4>
      <form className="form-horizontal container" id="EditPageForm" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled="true"
                value={formData.modGrpId}
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
                disabled="true"
                value={(formData.modGrpNm)}
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
                {showModelModGrpLov && <Lov
                  moduleLovData={modGrpLovData}
                  setShowModel={setShowModelModGrpLov}
                  showModel={showModelModGrpLov}
                  handleRowClick={handleRowClickModGrpLov}
                  columns={modGrpLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>
          </div>
        </div>

        <div className=" row mb-4">
          <label className="col-md-3 form-label">Module:<span className="text-red">*</span></label>

          <div className="col-md-9">
            <div className="input-group ">
              <input type="" className="form-control col-md-3 me-3 rounded-3 ui_display_txt_" readOnly name="modId" value={formData.modId} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4} />
              <input type="" className="form-control col-md-9 rounded-3 ui_entry_txt_rc" required name="modNm" value={formData.modNm} onChange={handleInputChange}
                disabled={mode === 3 || mode === 4} maxLength={50} onFocus={() => toggleCharCountVisibility("modNm")}
                onBlur={() => toggleCharCountVisibility("modNm")}
              />
              {fieldCharCountVisibility.modNm && (
                <span className="input-group-text">
                  {formData?.modNm?.length}/50
                </span>
              )}
            </div>

          </div>
        </div>

        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              Module Prefix:<span className="text-red">*</span>
            </label>
          </div>
          <div className="col-md-2 input-group">
            <input
              type=""
              min="0"
              className="form-control ui_entry_txt_r"
              id=""
              required
              placeholder=""
              name="modPrefix"
              maxLength={2}
              value={formData.modPrefix} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              onFocus={() => toggleCharCountVisibility("modPrefix")}
              onBlur={() => toggleCharCountVisibility("modPrefix")}
            />
            {fieldCharCountVisibility.modPrefix && (
              <span className="input-group-text">
                {formData?.modPrefix?.length}/2
              </span>
            )}
          </div>
          <label className="col-md-2 form-label mx-4">	Image DB:</label>
          <div className="col-md-3">

            <select
              className="form-select"
              name="imgDbFlg"
              value={formData?.imgDbFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >


              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddImgDbFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddImgDbFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }


            </select>

          </div>


        </div>
        <div className=" row mb-4">
          <div className="col-md-3">
            <label for="" className=" form-label">
              Image Icon:
            </label>
          </div>

          <div className="col-md-9 input-group">
            <input
              type=""
              className="form-control ui_entry_txt_"

              name="imgPath"
              placeholder="Image Path"
              value={formData.imgPath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              // pattern="\d{10}"
              maxlength={200}
              //onInput={validatePhoneNumber}
              onFocus={() => toggleCharCountVisibility("imgPath")}
              onBlur={() => toggleCharCountVisibility("imgPath")}
            />
            {fieldCharCountVisibility.imgPath && (
              <span className="input-group-text">
                {formData?.imgPath?.length}/200
              </span>
            )}



          </div>
        </div>

        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className="form-label">
              Image:
            </label>
          </div>
          <div className="col-md-9 input-group">
            <input
              type="text"
              className="form-control ui_entry_txt_"
              id=""

              placeholder="enter Only Digit"
              name="img"
              value={formData.img} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              maxlength={8}
              //onInput={validatePhoneNumber}
              onFocus={() => toggleCharCountVisibility("img")}
              onBlur={() => toggleCharCountVisibility("img")}
            />
            {fieldCharCountVisibility.img && (
              <span className="input-group-text">
                {formData?.img?.length}/8
              </span>
            )}
          </div>
        </div>

        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className=" form-label">
              Image Name:<span className="text-red">*</span>
            </label>
          </div>

          <div className="col-md-9 input-group">
            <input
              type=""
              className="form-control ui_entry_txt_rc"
              id=""
              required
              placeholder="Image Name"
              name="imgNm"
              value={formData.imgNm} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              maxLength={30} onFocus={() => toggleCharCountVisibility("imgNm")}
              onBlur={() => toggleCharCountVisibility("imgNm")}
            />
            {fieldCharCountVisibility.imgNm && (
              <span className="input-group-text">
                {formData?.imgNm?.length}/30
              </span>
            )}
          </div>
        </div>

        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="" className="form-label">
              Help Path:<span className="text-red">*</span>
            </label>
          </div>

          <div className="col-md-9 input-group">
            <input
              type=""
              className="form-control ui_entry_txt_rc"
              id=""
              required
              placeholder="Enter link here.."
              name="helppath"
              value={formData.helppath} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              maxLength={100} onFocus={() => toggleCharCountVisibility("help_path")}
              onBlur={() => toggleCharCountVisibility("help_path")}
            />
            {fieldCharCountVisibility.helppath && (
              <span className="input-group-text">
                {formData?.helppath?.length}/100
              </span>
            )}
          </div>
        </div>

        <div className=" row mb-4">
          <div className="col-md-3">
            <label htmlFor="serverUrl" className="form-label">
              Server URL:
            </label>
          </div>

          <div className="col-md-9">
            <input
              type="text"
              className="form-control ui_entry_txt_"
              id="serverUrl"
              placeholder="Enter link here.."
              name="srvUrl"
              value={formData.srvUrl} onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <label className=" form-label">	Sub Tree:</label>
          </div>
          <div className="col-md-2">

            <select
              className="form-select"
              name="subTreeFlg"
              value={formData?.subTreeFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled >--Select--</option>

              {(mode === 1) ?
                (addVal?.ddSubTreeFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddSubTreeFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>

          </div>





          <div className="col-md-1">
            <label className="form-label">	View:</label>
          </div>

          <div className="col-md-2">

            <select
              className="form-select"
              name="viewFlg"
              value={formData.viewFlg}
              onChange={handleStatusChange}
              disabled={mode === 3 || mode === 4}
            >
              <option disabled>--Select--</option>

              {(mode === 1) ?
                (addVal?.ddViewFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                ))) : (edtVal?.ddViewFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }
            </select>
          </div>
          <label className="custom-control col-md-1 mx-1 custom-radio">
            <input
              type="checkbox"
              className="custom-control-input ui_entry_ckbox_"
              name="otpFlg"
              // defaultValue="N"

              checked={(formData?.otpFlg === "Y") ? true : false}
              // defaultChecked={formData.otpFlg==="Y"}
              onChange={handleCheckboxChange}
              // value={formData.otpFlg} 
              disabled={mode === 3 || mode === 4}
            />
            <span className="custom-control-label">
              Otp
            </span>
          </label>
          <label className="custom-control col-md-2 ms-1 custom-radio">
            <input
              type="checkbox"
              className="custom-control-input ui_entry_ckbox_"
              // defaultValue={edtVal.loginFlg}
              checked={formData?.loginFlg === "Y"}
              // defaultChecked={formData?.loginFlg==="Y"}
              name="loginFlg"
              // value={edtVal.loginFlg}
              onChange={handleCheckboxChange}
              disabled={mode === 3 || mode === 4}
            />
            <span className="custom-control-label">
              Login
            </span>
          </label>
        </div>
        {mode !== 1 && (
          <div className="row mb-4">
            <label className="col-md-3 form-label">Status</label>
            <div className="col-md-2 col-lg-2">
              <div className="form-group">
                <select
                  className="form-select"
                  name="actFlg"
                  value={formData.actFlg}
                  onChange={handleStatusChange}
                  disabled={mode === 3 || mode === 4}
                >
                  {edtVal?.ddActFlg?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
        {mode == 1 && <button
          className="btn btn-secondary mx-2"
          type=" button"
          //onClick="resetForm"
          onClick={(e) => resetForm()}
        >
          Reset
        </button>}
      </form>


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


