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
export const EditMemoInformationEdit = ({
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
}) => {
  console.log(edtVal?.mst?.dtl);
  console.log(edtVal);
  // setEdtVal({
  //     ...edtVal,
  //     dtl01: edtVal?.dtl01?.map((item) => {
  //         return {
  //             ...item,
  //             action: "U"
  //         };
  //     })
  // });
  const [buttonDisable, setButtonDisable] = useState(false);
  const [doc, set_doc] = useState([]);
  console.log(addVal);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);

  const [formData, setFormData] = useState({
    sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
    userFileNo: rowData?.userFileNo || edtVal?.userFileNo || "",
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
    memoTyp: edtVal?.memoTyp || "L",
    memoFileTyp: edtVal?.memoFileTyp || "",
    dtl: edtVal?.dtl01?.length !==0 ? edtVal?.dtl01 : [{
      copyToNm:"",
      copyToSlNo: 0,
      action:"I"
    }],
  });

  useEffect(() => {
    setFormData({
      sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
      userFileNo: rowData?.userFileNo || edtVal?.userFileNo || "",
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
    if (!edtVal.filePath === null) {
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
    }
  }, [edtVal]);

  console.log(formData.dtl);
  console.log(edtVal.dtl01);
  console.log(doc);

  // File LOV Start..............
  const [modGrpLovData, setModGrpLovData] = useState([]);

  useEffect(() => {
    const fetchModGrpLovData = async () => {
      let obj = {
        apiId: "MGA00048",
      };
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/MGF00005/getAllFileNo",
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

  const getSysFileNo = (obj) => {
    return modGrpLovData[Number(Object.keys(obj)[0])]?.sysFileNo
      ? modGrpLovData[Number(Object.keys(obj)[0])]?.sysFileNo
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
    console.log(formData);
    const { repId, modGrpId, modGrpNm, modNm, actFlg, ...obj } = formData;
    const { ...dtl } = formData.dtl;
    console.log(dtl);

    if (mode === 2) {
      obj.dtl = formData.dtl.filter((item) => item.action);
      obj.dtl = [...obj.dtl, ...delArr];
    }
    console.log(obj.dtl);
    const editObj = {
      apiId: "MGA00052",
      mst: {
        action: "U",
        dtl01: (obj?.dtl?.length === 1 && obj.dtl[0].copyToNm ==="" && obj?.dtl[0]?.action==="I") ? [] : [...obj.dtl],
        fileId: doc[0]?.fileId || "",
        fileNm: doc[0]?.fileNm || "",
        filePath: doc[0]?.filePath || "",
        fileTyp: doc[0]?.fileTyp || "",
        fileSz: doc[0]?.fileSz?.toString() || "",
        fileUrl: doc[0]?.fileUri || "",
        flUpldLogNo: doc[0]?.flUpldLogNo || "",
        genMemoNo: formData?.genMemoNo,
        lvlRefCd: formData?.lvlRefCd,
        memoFileTyp: formData?.memoFileTyp || "L",
        memoIssTo: formData?.memoIssTo,
        memoSubj: formData?.memoSubj,
        sysFileNo: formData?.sysFileNo,
      },
    };
    console.log("489");

    if (mode === 2) console.log("492");
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/MGF00005/saveEdit",
        editObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
      


        const conf_obj = {
          "apiId": "SUA00487",
          "mst": [{
            "colNm": res.data?.content?.mst?.colNm,
            "flUpldLogNo": doc[0]?.flUpldLogNo,
            "keyStr": res.data?.content?.mst?.keyStr,
            "keyStrVal": res.data?.content?.mst?.keyStrVal,
            "tabNm": res.data?.content?.mst?.tabNm
          }]
        }
console.log(doc[0]?.fileId)
        if (res?.data?.appMsgList?.errorStatus === false && doc[0]?.fileId) {
          console.log(doc[0]?.fileId)
          
          handle_confirmation(conf_obj).then((res) => {
           
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
              set_errExp({ status: res.data?.appMsgList?.errorStatus })
              if(res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004"){
                setButtonDisable(true);
              }

            
          })
        }  else{
           setMsg(
          res?.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res?.data?.appMsgList?.list[0]?.errCd +
            ")"
        );
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })}
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

  const [fileErr_msg, set_fileErr_msg] = useState("");
  const uploadFiles = async (e) => {
    if (mode > 2) return;

    const { files } = e.target;
    const refApiId = "MGA00052"
    let fileArr = [];

    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      if (files[i].size > 1000 * 1000 * 1) {
        set_fileErr_msg("File size exceded : 25mb");
        break;
      } else {
        set_fileErr_msg("");
      }
      formData.append("vfile", files[i]);

      //"http://192.168.0.44/SuV4Sa/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00499" + "&appId=" + "" + "&mobRegNo=" + "",
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
            "/SUF00134/fileUpload?apiId=" +
            "SUA00486" +
            "&refApiId=" +
            refApiId +
            "&appId=" +
            "" +
            "&mobRegNo=" +
            "" +
            "&fileCatCd=" +
            "C0001",
          formData,
          { headers }
        )
        .then((res) => {
          if (res?.data?.appMsgList?.errorStatus === false) {
            fileArr = [
              ...fileArr,
              {
                ...res.data.content,
                //name: "File "+(doc.length+1+i)
                // name: files[i].name,
              },
            ];
          } else {
            setMsg(
              res?.data?.appMsgList?.list[0]?.errDesc +
                " (" +
                res?.data?.appMsgList?.list[0]?.errCd +
                ")"
            );
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({ status: res.data?.appMsgList?.errorStatus });
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }

    set_doc([...doc, ...fileArr]);
  };
  const download_file = async (e, i) => {
    const obj = {
      apiId: "SUA00488",
      mst: {
        fileId: doc[i]?.fileId,
        fileNm: doc[i]?.fileNm,
      },
    };
    // await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",
    // obj, {headers})
    // .then((res) => {
    //  await fetch(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",
    //  {
    //     method: 'POST',
    //     headers: {
    //       ...headers,
    //       'Content-Type': 'application/octet-stream',
    //     },
    //     body: JSON.stringify(obj)

    //   })
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //   // Create blob link to download
    //   const url = window.URL.createObjectURL(
    //     new Blob([blob]),
    //   );
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute(
    //     'download'
    //   );

    //   // Append to html link element page
    //   document.body.appendChild(link);

    //   // Start download
    //   link.click();

    //   // Clean up and remove the link
    //   link.parentNode.removeChild(link);
    // })
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/downloadFile",
        obj,
        {
          headers: {
            Authorization: headers?.Authorization,
            Accept: "application/zip",
          },
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        //fileDownload(res.data, "file.pdf")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const tempArr = doc[i]?.fileNm?.split(".") || [];
        const extention = tempArr[tempArr?.length - 1] || "pdf";
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc[i]?.fileId + "." + extention);
        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        //link.parentNode.removeChild(link);
      });
  };

  const delete_file = async (e, i) => {
    let obj = {
      apiId: "SUA00489",
      mst: [
        {
          flUpldLogNo: doc[i]?.flUpldLogNo,
        },
      ],
    };
    console.log("yyyyyyyy", doc[i]);
    if (window.confirm("Are you sure? File cannot be recover once deleted !"))
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/forceFileDeletion",
          obj,
          { headers }
          // formData
        )
        .then((res) => {
          if (res?.data?.appMsgList?.errorStatus === false) {
            set_doc(doc.filter((item, index) => index !== i));
          } else {
            setMsg(
              res?.data?.appMsgList?.list[0]?.errDesc +
                " (" +
                res?.data?.appMsgList?.list[0]?.errCd +
                ")"
            );
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
  };


  const handle_confirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
      obj,
      { headers })
  }

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
        <div className="row mb-1">
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
        {/*Memo file Type */}
        <div className="row mb-4">
          <label className="form-label col-md-3">
            Memo File Type:
          </label>
          <div className="col-md-9">
          <select
                className="form-select"
                name="memoFileTyp"
                value={formData?.memoFileTyp}
                onChange={handleStatusChange}
                
              >
                <option disabled>--Select-</option>
                {edtVal?.ddMemoFileTyp?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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

        <div className="row mb-2">
          <label className="form-label col-md-3">Upload Memo Files:</label>
          <div className="col-md-9">
            {doc?.length === 0 && (
              <div className="file-upload">
                <div className="input-name">Choose File</div>
                <input
                  style={{
                    visibility: mode === 1 || mode === 2 ? "visible" : "hidden",
                  }}
                  type="file"
                  //   required={mode === 1}
                  className="form-control"
                  id="formFile"
                  onChange={uploadFiles}
                  name="File"
                  //required={!doc.length}
                  // multiple
                  // accept=".pdf"
                  //   disabled={mode === 3 || mode === 4}
                />
              </div>
            )}
            {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

            {doc.map((file, i) => (
              <div className="file-div">
                {file.filePath && (
                  <Smalltag
                    handleClick={() =>
                      window.open(
                        process.env.REACT_APP_API_URL_PREFIX + file.fileUri,
                        "_blank",
                        "rel=noopener noreferrer"
                      )
                    }
                    fontAwsmIcon={"fa-file"}
                    lable={file.fileNm}
                    key={i}
                  />
                )}

                {file?.filePath && (
                  <>
                    <Delete
                      onClick={(e) => delete_file(e, i)}
                      className="cross-icon"
                    />

                    <Download
                      onClick={(e) => download_file(e, i)}
                      className="cross-icon"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="table-responsive table">
            <table className="table  dta-tabl" style={{ background: "white" }}>
              <thead className="">
                <tr className="bg-primary">
                  <th className="sno text-white">Row#</th>
                  <th className="text-white">Copy To:</th>

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
          <button type="submit" className="btn btn-primary" disabled ={buttonDisable}>
            Update
          </button>

        </div>
      </form>
    </div>
  );
};
