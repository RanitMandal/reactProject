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
export const ImportantFileAddForm = ({
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
  let lvlRefCd = sessionStorage.getItem('lvlRefCd')
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

  const [doc, set_doc] = useState([]);
  console.log(addVal);

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00009/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      // setParMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
      //   setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    })
  }

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);

  // const [formData, setFormData] = useState({
  //   sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
  //   fileNm: "string",
  //   filePath: "string",
  //   fileTyp: "string",
  //   memoNo: rowData?.memoNo,
  //   genMemoNo: rowData?.genMemoNo || 0,
  //   lvlRefCd: sessionStorage.getItem("lvlRefCd"),
  //   memoIssTo: rowData?.memoIssTo || "",
  //   memoSubj: rowData?.memoSubj || "",
  //   sysFileNo: rowData?.sysFileNo || "",
  //   memoDt: rowData?.memoDt || edtVal?.memoDt || "",
  //   memoTyp: edtVal?.memoTyp || "L",
  //   memoFileTyp: edtVal?.memoFileTyp || "",
  //   dtl: edtVal?.dtl01,
  // });

  // useEffect(() => {
  //   setFormData({
  //     sysFileNo: rowData?.sysFileNo || edtVal?.sysFileNo || "",
  //     fileNm: "string",
  //     filePath: "string",
  //     fileTyp: "string",
  //     memoNo: rowData?.memoNo,
  //     genMemoNo: rowData?.genMemoNo || 0,
  //     lvlRefCd: sessionStorage.getItem("lvlRefCd"),
  //     memoIssTo: rowData?.memoIssTo || "",
  //     memoSubj: rowData?.memoSubj || "",
  //     sysFileNo: rowData?.sysFileNo || "",
  //     memoDt: rowData?.memoDt || edtVal?.memoDt || "",
  //     memoTyp: edtVal?.memoTyp || "",
  //     dtl: edtVal?.dtl01,
  //   });
  //   if (!edtVal.filePath === null) {
  //     set_doc([
  //       {
  //         fileId: edtVal ? (edtVal.fileId === null ? "" : edtVal.fileId) : "",
  //         filePath: edtVal
  //           ? edtVal.filePath === null
  //             ? ""
  //             : edtVal.filePath
  //           : "",
  //         fileNm: edtVal ? (edtVal.fileNm === null ? "" : edtVal.fileNm) : "",
  //         fileTyp: edtVal
  //           ? edtVal.fileTyp === null
  //             ? ""
  //             : edtVal.fileTyp
  //           : "",
  //         fileSz: edtVal ? (edtVal.fileSz === null ? "" : edtVal.fileSz) : "",
  //         flUpldLogNo: edtVal
  //           ? edtVal.flUpldLogNo === null
  //             ? ""
  //             : edtVal.flUpldLogNo
  //           : "",
  //         fileUri: edtVal
  //           ? edtVal.fileUrl === null
  //             ? ""
  //             : edtVal.fileUrl
  //           : "",
  //       },
  //     ]);
  //   } else {
  //     set_doc([]);
  //   }
  // }, [edtVal]);

  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log("edtVal", edtVal);
    if (mode === 1) {
      setFormData({
        fileSubj: "",
        lvlRefCd: "",
        refDt: "",
        refNo: "",
        refText: "",
        actFlg: 'A',
      })

    } else {
      setFormData({
        fileSubj: rowData ? rowData.fileSubj : "",
        lvlRefCd: "",
        refDt: rowData ? rowData.refDt : '',
        refNo: rowData ? rowData.refNo : '',
        refText: rowData ? rowData.refText : '',
        fileNo: rowData ? rowData.fileNo : "",
        // docId: edtVal ? edtVal.docId : '',
        // docNm: edtVal ? edtVal.docNm : '',
        // modId: edtVal ? edtVal.modId : '',
        // modNm: edtVal ? edtVal.modNm : '',
        // dispOrder: edtVal ? edtVal.dispOrder : 0,
        // // uploadDt: uploadDt ? uploadDt : '',
        // newDoc: edtVal ? edtVal.newDoc : "",
        actFlg: edtVal ? edtVal.actFlg : 'A',
      })
      set_doc([{
        fileId: edtVal ? edtVal.fileId : "",
        filePath: edtVal ? edtVal.filePath : "",
        fileNm: edtVal ? edtVal.fileNm : "",
        fileTyp: edtVal ? edtVal.fileTyp : "",
        fileSz: edtVal ? edtVal.fileSz : "",
        flUpldLogNo: edtVal ? edtVal.flUpldLogNo : "",
        fileUri: edtVal ? edtVal.fileUrl : ""
      }])

    }
  }, [mode, edtVal])

  console.log("formData", formData);


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
    if (!obj.copyToNm) { set_tblErr("please fill up all the filed"); }
    // set_tblLen(tblLen+1)
    else {
      setFormData({
        ...formData,
        dtl: [
          ...list,
          {
            copyToNm: "",
            copyToSlNo: edtVal?.dtl01[0]?.copyToSlNo || 0,
            action: "U",
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
      docId: '',
      docNm: '',
      fileSubj: "",
      refDt: "",
      refNo: "",
      refText: "",
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



  const [open, set_open] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "MGA00027",
      mst: {

        fileNo: formData.fileNo

      }
    }
    axios
      .post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00009/saveDelete', deleteObj, { headers })
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData();
        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      })
      .catch((error) => {
        console.log("error");
      });

  }

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(selectRowDivLov);

    const addObj = {
      "apiId": "MGA00026",
      "mst": {
        fileId: doc[0].fileId,
        fileNm: doc[0].fileNm,
        filePath: doc[0].filePath,
        fileTyp: doc[0].fileTyp,
        flUpldLogNo: doc[0].flUpldLogNo,
        fileUrl: doc[0].fileUri,
        fileSz: doc[0].fileSz,
        fileSubj: formData ? formData.fileSubj : "",
        lvlRefCd: lvlRefCd,
        refDt: formData ? formData.refDt : "",
        refNo: formData ? formData.refNo : "",
        refText: formData ? formData.refText : "",
      }
    }
    console.log("addObj|||||", addObj, formData);

    const editObj = {
      apiId: "MGA00028",
      mst: {
        actFlg: formData.actFlg,
        fileNo: formData.fileNo,
        fileSubj: formData.fileSubj,
        lvlRefCd: lvlRefCd,
        refNo: formData.refNo,
        refText: formData.refText,
        fileId: doc[0].fileId,
        fileNm: doc[0].fileNm,
        filePath: doc[0].filePath,
        fileTyp: doc[0].fileTyp,
        fileSz: doc[0].fileSz,
        flUpldLogNo: doc[0].flUpldLogNo,
        fileUrl: doc[0].fileUri
      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00009/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        console.log("res|||||||||", res);
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
        if (res?.data?.appMsgList?.errorStatus === false)
          handle_confirmation(conf_obj).then((res) => {
            if (res?.data?.appMsgList?.errorStatus === true) {
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
              set_errExp({ status: res.data?.appMsgList?.errorStatus })

            }
          })
        
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })


      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00009/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
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
        if (res?.data?.appMsgList?.errorStatus === false)
          handle_confirmation(conf_obj).then((res) => {
            if (res?.data?.appMsgList?.errorStatus === true) {
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
              set_errExp({ status: res.data?.appMsgList?.errorStatus })

            }
          })

        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)





      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
      });


    if (mode === 3)
      set_open(true)

  };

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
    const refApiId = mode === 1 ? "MGA00026" : "MGA00028";
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
          "C0002",
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
    <div>
      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">Important File {getFormTitle(mode)}</h4>

        <form
          className="form-horizontal"
          id="EditPageForm"
          onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}
        >
          {/* Number*/}
          <div className="card">
            <div className="card-header ">
             <h5><b>Reference:</b> </h5>
            </div>
            <div className="card-body">


            <div className="row mb-4">
            <label className="form-label col-md-3">Number:</label>
            <div className="col-md-3">
              <input
                className="form-control"
                value={formData?.refNo}
                onChange={handleInputChange}
                name="refNo"
                disabled={mode === 3 || mode === 4}
              />
            </div>
            <label
              for="exampleFormControlSelect1"
              className="col-md-3 col-form-label"
            >
              <b>Date:</b><span className="text-red">*</span>
            </label>
            <div className="col-md-3">
              <input className="form-control" type="Date" name="refDt" onChange={handleInputChange} value={formData?.refDt} required disabled={mode === 3 || mode === 4} />
              {/* {!isValidRange && <p className="text-red">Invalid Year Range</p>} */}
            </div>

          </div>
          {/* From */}
          <div className="row mb-4">
            <label className="form-label col-md-3">
              From:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <input
                className="form-control"
                disabled={mode === 3 || mode === 4}
                value={formData?.refText}
                onChange={handleInputChange}
                name="refText"
required
              />
            </div>
          </div>

            </div>
          </div>
         


          {/* Subject */}
          <div className="row mb-4">
            <label className="form-label col-md-3">
              Subject:<span className="text-red">*</span>
            </label>
            <div className="col-md-9">
              <textarea
                className="form-control"
                value={formData?.fileSubj}
                onChange={handleInputChange}
                name="fileSubj"
                required
                disabled={mode === 3 || mode === 4}
              />
            </div>
          </div>
          {/* Upload File */}
          <div className="row mb-4">
            <label className="form-label col-md-3">Attach Document: <span className="text-red">*</span></label>
            <div className="col-md-9">
              {doc?.length === 0 && (
                <div className="file-upload">
                  <div className="input-name">Upload File</div>
                  <input
                    style={{
                      visibility: mode === 1 || mode === 2 ? "visible" : "hidden",
                    }}
                    type="file"
                    // required={mode === 1}
                    className="form-control"
                    id="formFile"
                    onChange={uploadFiles}
                    name="File"
                    required
                    // required={!doc.length}
                    // multiple
                    // accept=".pdf"
                    // disabled={mode === 3 || mode === 4}
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

          {/* 	File No*/}

          <div className="row mb-4">
            <label className="form-label col-md-3">File No:</label>
            <div className="col-md-3">
              <input
                className="form-control"
                value={formData?.fileNo}
                name="fileNo"
                type="text"
                onChange={handleInputChange}
                disabled
              />
            </div>

            {/* status */}
        
              <label className="col-md-3 form-label">
                Status:
              </label>
              <div className="col-md-3">
                <select
                  className="form-select col-md-12"
                  name="actFlg"
                  disabled={mode === 3 || mode === 4}
                  //defaultValue={edtVal.dtlActFlg}
                  onChange={handleStatusChange}
                  value={formData.actFlg}

                >
                  <option disabled>--Select--</option>
                  {(mode === 1) ?
                    (addVal?.ddActFlg?.map((item) => (
                      <option value={item.value}>{item.label}</option>
                    ))) : (edtVal?.ddActFlg?.map((item) => (
                      <option value={item.value}>{item.label}</option>
                    )))
                  }



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
