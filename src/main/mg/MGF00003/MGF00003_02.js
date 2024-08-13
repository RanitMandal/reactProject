import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common";
import { Delete, Download, Edit } from "@mui/icons-material";
import Smalltag from "../../common/SmallTag/smalltag";
import { Alert } from "react-bootstrap";
import ConfirmDialog from "../../common/ConfirmDialog";
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";
import { Page } from "@mobiscroll/react-lite";
import { fileLovColumns } from "./columns";
const headers = { Authorization: "Bearer " + getApiToken() };
export const FillUpBlankMemoNumbersEdit = ({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row,
  rowData,
  edtVal,
  setEdtVal,
  updateEdtVal,
  index,
  queryInputObj,
  setQueryInputObj,
  msg,
  setMsg,
  msgTyp,
  setMsgTyp,
  addVal,
  errExp,
  set_errExp,
  COPYTONM
}) => {

  const [buttonDisable, setButtonDisable] = useState(false);
  console.log(addVal);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);

  const [formData, setFormData] = useState({
    sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
    fileNm: "string",
    filePath: "string",
    fileTyp: "string",
    memoNo: rowData?.memoNo,
    genMemoNo: rowData?.genMemoNo || 0,
    lvlRefCd: sessionStorage.getItem("lvlRefCd"),
    memoIssTo: rowData?.memoIssTo || "",
    memoSubj: rowData?.memoSubj || "",
    sysFileNo: rowData?.sysFileNo || "",
    memoDt: rowData?.memoDt || edtVal?.memoDt || "",
    memoTyp: edtVal?.memoTyp || "",
    dtl: edtVal?.dtl01?.length !==0 ? edtVal?.dtl01 : [{
      copyToNm:"",
      copyToSlNo: 0,
      action:"I"
    }],
  });

  useEffect(() => {
    setFormData({
      sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
      fileNm: "string",
      filePath: "string",
      fileTyp: "string",
      memoNo: rowData?.memoNo,
      genMemoNo: rowData?.genMemoNo || 0,
      lvlRefCd: sessionStorage.getItem("lvlRefCd"),
      memoIssTo: rowData?.memoIssTo || "",
      memoSubj: rowData?.memoSubj || "",
      sysFileNo: rowData?.sysFileNo || "",
      userFileNo: edtVal?.userFileNo || "",
      memoDt: rowData?.memoDt || edtVal?.memoDt || "",
      memoTyp: edtVal?.memoTyp || "",
      dtl: edtVal?.dtl01?.length !==0 ? edtVal?.dtl01 : [{
        copyToNm:"",
        copyToSlNo: 0,
        action:"I"
      }],
    });
   /*  if (!edtVal.filePath === null) {
      set_doc([
        {
          fileId: edtVal ? (edtVal.fileId === null ? "" : edtVal.fileId) : "",
          filePath: edtVal
            ? edtVal.filePath === null
              ? ""
              : edtVal.filePath
            : "",
          fileNm: edtVal ? (edtVal.fileNm === null ? "" : edtVal.fileNm) : "",
          fileTyp: edtVal
            ? edtVal.fileTyp === null
              ? ""
              : edtVal.fileTyp
            : "",
          fileSz: edtVal ? (edtVal.fileSz === null ? "" : edtVal.fileSz) : "",
          flUpldLogNo: edtVal
            ? edtVal.flUpldLogNo === null
              ? ""
              : edtVal.flUpldLogNo
            : "",
          fileUri: edtVal
            ? edtVal.fileUrl === null
              ? ""
              : edtVal.fileUrl
            : "",
        },
      ]);
    } else {
      set_doc([]);
    } */
  }, [edtVal]);

 

  // File LOV Start..............
  const [modGrpLovData, setModGrpLovData] = useState([]);

  useEffect(() => {
    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: "MGA00056",
      };
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/MGF00003/getAllFileInfo",
          obj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModGrpLovData(
            res.data?.content?.qryRsltSet?.length
              ? res.data?.content?.qryRsltSet
              : []
          );
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        });
    };
    fetchModGrpLovData();
  }, []);

  const getUserFileNo = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.userFileNo
      ? modGrpLovData[Number(Object.keys(obj)[0])]?.userFileNo
      : "";
  };
//in database fileId  is called SysFileno
  const getSysFileNo = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.fileId
      ? modGrpLovData[Number(Object.keys(obj)[0])]?.fileId
      : "";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
  const handleRowClickModGrpLov = (rowData) => {
    setSelectRow(rowData);
    console.log(rowData);
    setFormData({
      ...formData,
      sysFileNo: getSysFileNo(rowData),
      userFileNo: getUserFileNo(rowData),
    });
  };
  //File Lov ends

  // Module LOV Start..............
  const [modLovData, setModLovData] = useState([]);

  useEffect(() => {
    const fetchModLovData = async () => {
      const modLovObj = {
        apiId: "SUA00574",
        criteria: {
          modGrpId: formData.modGrpId,
        },
      };
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00050/getModMstByModGrp",
          modLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModLovData(
            res.data?.content?.qryRsltSet?.length
              ? res.data?.content?.qryRsltSet
              : []
          );
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        });
    };
    formData.modGrpId && fetchModLovData();
  }, [formData.modGrpId]);

  const getModNm = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modNm
      ? modLovData[Number(Object.keys(obj)[0])]?.modNm
      : "";
  };

  const getModId = (obj) => {
    return modLovData[Number(Object.keys(obj)[0])]?.modId
      ? modLovData[Number(Object.keys(obj)[0])]?.modId
      : "";
  };

  const [selectRowMod, setSelectRowMod] = useState("");
  const [selectRowModLov, setSelectRowModLov] = useState("");
  const [showModelModLov, setShowModelModLov] = useState(false);
  const handleRowClickModLov = (rowData) => {
    setSelectRowMod(rowData);
    setSelectRowModLov(rowData);
    setFormData({
      ...formData,
      modId: getModId(rowData),
      modNm: getModNm(rowData),
    });
  };
  //Module Lov ends

  useEffect(() => {
    //const [selectRowMod, setSelectRowMod] = useState("");

    let modId = rowData?.modId || "";
    let resIndex = modLovData.findIndex((item) => item.modId === modId);
    let currentModId = {};
    if (resIndex !== -1) currentModId = { [resIndex]: true };
    setSelectRowMod(currentModId);
    //   console.log("9999999", resIndex, currentModId, modLovData, modId);
  }, [rowData, edtVal, modLovData]);

  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(formData);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
  };

  const handleStatusChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [tblErr, set_tblErr] = useState("");
  // const [tblLen, set_tblLen] = useState(1)
  const addtableRow = () => {
    let list = formData?.dtl;
    let obj = list[list.length - 1];
    if (!obj.copyToNm) {set_tblErr("please fill up all the filed");}

    // set_tblLen(tblLen+1)
    else{
    setFormData({
      ...formData,
      dtl: [
        ...list,
        {
          copyToNm: "",
          copyToSlNo: 0,
          action: "I",
        },
      ],
    });
    set_tblErr("")
  }
    console.log(list.length + 1);

    console.log(tblErr);
  };

  const handleDtlInputChange = (e, index) => {
    const { name, value } = e.target;
    let list = formData.dtl;

    // Clear the error message for the corresponding field
    let currentAct = list[index]?.action;
    list[index] = {
      ...list[index],
      [name]: value,
      action: mode === 1 ? "I" : currentAct === "I" ? "I" : "U",
    };

    setFormData({
      ...formData,
      dtl: list,
    });
  };

  // const handleDtlStatusChange = (e, index) => {
  //   const { name, value } = e.target;

  //   let list = formData.dtl; // Create a copy of the tableRow array
  //   let currentAct = list[index]?.action
  //   list[index] = {
  //       ...list[index],
  //       [name]: value,
  //       action: mode ===1 ? "I": currentAct === 'I' ? 'I': 'U'
  //   };
  //   console.log(list);
  //   setFormData({
  //     ...formData,
  //     dtl : list
  //   });
  // };

  const handleDtlStatusChange = (e, index) => {
    const { name, value } = e.target;

    let list = formData.dtl.slice(); // Create a copy of the dtl array
    let currentAct = list[index]?.action;

    // For other changes, update the corresponding property
    list[index] = {
      ...list[index],
      [name]: value,
      action: mode === 1 ? "I" : currentAct === "I" ? "I" : "U",
    };

    console.log(list);
    setFormData({
      ...formData,
      dtl: list,
    });
  };

  const [delArr, set_delArr] = useState([]);
  const removetableRow = (e, index) => {
    console.log(formData);
    let list = formData.dtl; // Create a copy of the tableRow array
    let currentAct = list[index].action;
    if (currentAct === "I") list.splice(index, 1);
    else {
      list[index] = {
        ...list[index],
        action: "D",
      };
      set_delArr([...delArr, list[index]]);
      list.splice(index, 1);
    }

    // set_tblLen(tblLen-1)
    setFormData({
      ...formData,
      dtl: list,
    });
  };

  const resetForm = () => {
    setSelectRow("");
    setModGrpLovData([]);
    setSelectRowMod("");
    setModLovData([]);
    setFormData({
      repId: "",
      dmpTotCol: "",
      fileTyp: "P",
      graphCharFlg: "G",
      loginFlg: "Y",
      modId: "",
      noOfParam: "",
      otpFlg: "Y",
      repNm: "",
      repObj: "",
      repRmks: "",
      repTyp: "C",
      action: "I",
      dtl: [
        {
          action: "I",
          dispId: "Y",
          lovHeight: "",
          lovWidth: "",
          nullId: "N",
          parId: "",
          parNm: "",
          parQryStmt: "",
          parSrlNo: "",
          parTyp: "C",
        },
      ],
    });
    setMsg("");
    setMsgTyp("");
    set_errExp({
      status: true,
      content: "",
    });

    console.log(edtVal);
  };

  const resetForm1 = () => {
    setSelectRow("");
    setModGrpLovData([]);
    setSelectRowMod("");
    setModLovData([]);
    setFormData({
      repId: "",
      dmpTotCol: "",
      fileTyp: "P",
      graphCharFlg: "G",
      loginFlg: "Y",
      modId: "",
      noOfParam: "",
      otpFlg: "Y",
      repNm: "",
      repObj: "",
      repRmks: "",
      repTyp: "C",
      action: "I",
      dtl: [
        {
          action: "I",
          dispId: "Y",
          lovHeight: "",
          lovWidth: "",
          nullId: "N",
          parId: "",
          parNm: "",
          parQryStmt: "",
          parSrlNo: "",
          parTyp: "C",
        },
      ],
    });

    console.log(edtVal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { repId, modGrpId, modGrpNm, modNm, actFlg, ...obj } = formData;
    const { ...dtl } = formData.dtl;
    console.log(dtl);

    if (mode === 2) {
      obj.dtl = formData.dtl.filter((item) => item.action);
      obj.dtl = [...obj.dtl, ...delArr];

    } 
   /*   if (obj?.dtl?.length === 1 && obj?.dtl[0]?.copyToNm === "" && COPYTONM  ) {
      obj.dtl[0].action = "D";
     obj.dtl[0].copyToNm = COPYTONM;
      console.log('working');
      
     
    } 
    

      obj.dtl = formData.dtl.filter((item) => item.action);
      obj.dtl = [...obj.dtl, ...delArr]; */

    
    console.log(obj.dtl);
    const editObj = {
      apiId: "MGA00060",
      mst: {
       action: "U",
       "actFlg": "A",
       dtl: (obj?.dtl?.length === 1 && obj.dtl[0].copyToNm ==="" && obj?.dtl[0]?.action==="I") ? [] : [...obj.dtl],
        genMemoNo: formData?.genMemoNo,
        lvlRefCd: formData?.lvlRefCd,
        memoIssTo: formData?.memoIssTo,
        memoSubj: formData?.memoSubj,
        sysFileNo: formData?.sysFileNo,
      },
    };
    

    if (mode === 2) 
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/MGF00003/saveEdit",
        editObj,
        { headers }
      )
      .then((res) => {
        setMsg(
          res?.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res?.data?.appMsgList?.list[0]?.errCd +
            ")"
        );
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus });
        if(res?.data?.appMsgList?.list[0]?.errCd === "CMAI000005"){
          setButtonDisable(true);
        }
      })
      .catch((error) => {
        console.log("error");
      })
      .finally(() => {
        set_viewMsg(true);
      });
  };

  const [open, set_open] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add New";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };
  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };

  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    dataTrnsfrNm: false,
    tempTabNm: false,
    actualTabNm: false,
    spNm: false,
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
    <div className="container">
      {msg && (
        <div ref={msgRef}>
          {" "}
          <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />{" "}
        </div>
      )}
      <h4 className="card-title">Edit Memo Information {getFormTitle(mode)}</h4>

      <form
        className="form-horizontal"
        id="EditPageForm"
        onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}
      >
        {/* Memo Date & memo Type */}
        <div className="row mb-4">
          <label className="form-label col-md-3">Memo Date:</label>
          <div className="col-md-3">
            <input
              className="form-control"
              disabled
              value={formData?.memoDt}
              onChange={handleInputChange}
              name="memoDt"
            />
          </div>
          <label className="form-label col-md-3">Memo Type:</label>
          <div className="col-md-3">
            <div className="form-group">
              <select
                className="form-select"
                name="memoTyp"
                value={formData?.memoTyp}
                onChange={handleStatusChange}
                disabled
              >
                <option disabled>--Select-</option>
                {edtVal?.ddMemoTyp?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* File Number Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label">
            <b>
              File Number:<span className="text-red">*</span>
            </b>
          </label>
          <div className="col-md-9">
            <div className="input-group">
              <span class="input-group-text bg-primary">
                <i
                  className="fa fa-search d-inline text-white"
                  title=""
                  onClick={() => setShowModelModGrpLov(true)}
                />
              </span>
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                name="sysFileNo"
                value={formData.sysFileNo}
              />
              &nbsp;&nbsp;&nbsp;
              <input
                type="text"
                autoComplete={false}
                className="form-control"
                
                name="userFileNo"
                value={formData.userFileNo}
              />
              <div className="row-mb-12">
                {showModelModGrpLov && (
                  <Lov
                    moduleLovData={modGrpLovData}
                    setShowModel={setShowModelModGrpLov}
                    showModel={showModelModGrpLov}
                    handleRowClick={handleRowClickModGrpLov}
                    columns={fileLovColumns}
                    currentSelection={selectRow}
                    setCurrentSelection={setSelectRow}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* subject*/}
        <div className="row mb-4">
          <label className="form-label col-md-3">
            Subject:<span className="text-red">*</span>
          </label>
          <div className="col-md-9">
            <input
              className="form-control"
              required
              disabled={mode === 3 || mode === 4}
              value={formData?.memoSubj}
              onChange={handleInputChange}
              name="memoSubj"
            />
          </div>
        </div>
        {/* To Whom send */}
        <div className="row mb-4">
          <label className="form-label col-md-3">
            To Whom Sent:<span className="text-red">*</span>
          </label>
          <div className="col-md-9">
            <textarea
              className="form-control"
              value={formData?.memoIssTo}
              onChange={handleInputChange}
              name="memoIssTo"
            />
          </div>
        </div>

        {/* 	DMP Total Coulmn & No. Of param */}

        <div className="row mb-4">
          <label className="form-label col-md-3">Memo No:</label>
          <div className="col-md-3">
            <input
              className="form-control"
              value={formData?.memoNo}
              name="memoNo"
              type="text"
              onChange={handleInputChange}
              disabled
            />
          </div>
        </div>
{/* detail part start */}
        <div className="card">
          <div className="table-responsive table">
            <table className="table  dta-tabl" style={{ background: "white" }}>
              <thead className="">
                <tr className="bg-primary">
                  <th className="sno text-white">Row#</th>
                  <th className="text-white">Copy To</th>

                  <th className="text-white">Action</th>
                </tr>
              </thead>
              <tbody className="">
                {formData?.dtl?.map((row, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {/* <label style={{ display: "flex", marginRight: "15px" }} className="form-label">
                                                        Copy To: <span className="text-red">*</span>
                                                    </label> */}
                      {/* <div className=""> */}

                      <input
                        className="form-control col-md-10"
                        type="text"
                        name="copyToNm"
                        value={row.copyToNm}
                        onChange={(e) =>
                          handleDtlInputChange(e, index, "copyToNm")
                        }
                        // onBlur={handleCharCount}
                        placeholder=" "
                        //required
                        maxLength={50}
                        style={{ flexFlow: 1 }}
                      />
                      {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}
                      {/* 
                        </div> */}
                    </td>

                    <td>
                      {index !== formData.dtl.length - 1 ? (
                        <button
                          type="button"
                          onClick={(e) => removetableRow(e, index)}
                          className="action-button"
                          disabled={mode === 3 || mode === 4}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <div className="d-flex">
                           
                            <button
                              type="button"
                              onClick={(e) => removetableRow(e, index)}
                              className="action-button py-3"
                              disabled={mode === 3 || mode === 4}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          
                          <button
                            type="button"
                            onClick={addtableRow}
                            className="action-button"
                            disabled={mode === 3 || mode === 4}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="me-2 py-3"
                            />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tblErr && (
              <p className="error-message text-red d-flex justify-content-center">
                {tblErr}
              </p>
            )}
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary" disabled = {buttonDisable}>
            Update
          </button>
        
        </div>
      </form>
    </div>
  );
};
