import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import Lov from "../../common/Lov _new";
import { getApiToken, getScplAdContext } from "../../common/common"
import { Delete, Download, Edit } from "@mui/icons-material";
import TreeView from "deni-react-treeview";
import { Card, Modal, ModalTitle } from "react-bootstrap";
import Swal from "sweetalert2";
import Smalltag from "../../common/SmallTag/smalltag";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { portalLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };

export const ImageUploadMultiAdd = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, }) => {
  const fetchData = async () => {
    
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

    })
  }
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);
const entUserId= getScplAdContext().userId;
const entUserMobNo = getScplAdContext().mobNo;
 
  const [doc, set_doc] = useState([]);
   const [formData, setFormData] = useState({
    "actFlg": "",
    "altitude": 0,
    "catId": "",
    "imgDesc": "",
    "imgFileCatCd": "",
    "imgFileId": "",
    "imgFileNm": "",
    "imgFilePath": "",
    "imgFileSz": 0,
    "imgFileTyp": "",
    "imgFileUrl": "",
    "imgFlUpldLogNo": "",
    "imgId": "",
    "imgTitle": "",
    "latitude": 0,
    "longitude": 0,
    "orderBy": 0,
    "portalId": "",
    "entUserId": entUserId,
    "entUserMobNo": entUserMobNo
  });

  useEffect(() => {

    if(mode !==1)
      {setFormData({
    "actFlg": edtVal?.actFlg ? edtVal?.actFlg : "",
    "altitude": edtVal?.altitude ? edtVal?.altitude : 0,
    "catId": edtVal?.catId ? edtVal?.catId : "",
    "imgDesc": edtVal?.imgDesc ? edtVal?.imgDesc : "",
    "imgFileCatCd": edtVal?.imgFileCatCd ? edtVal?.imgFileCatCd : "",
    "imgFileId": edtVal?.imgFileId ? edtVal?.imgFileId : "",
    "imgFileNm": edtVal?.imgFileNm ? edtVal?.imgFileNm : "",
    "imgFilePath": edtVal?.imgFilePath ? edtVal?.imgFilePath : "",
    "imgFileSz": edtVal?.imgFileSz ? edtVal?.imgFileSz : 0,
    "imgFileTyp": edtVal?.imgFileTyp ? edtVal?.imgFileTyp : "",
    "imgFileUrl": edtVal?.imgFileUrl ? edtVal?.imgFileUrl : "",
    "imgFlUpldLogNo": edtVal?.imgFlUpldLogNo ? edtVal?.imgFlUpldLogNo : "",
    "imgId": edtVal?.imgId ? edtVal?.imgId : "",
    "imgTitle": edtVal?.imgTitle ? edtVal?.imgTitle : "",
    "latitude": edtVal?.latitude ? edtVal?.latitude : 0,
    "longitude":  edtVal?.longitude ? edtVal?.longitude : 0,
    "orderBy": edtVal?.orderBy ? edtVal?.orderBy : 0,
    "portalId": edtVal?.portalId ? edtVal?.portalId : "",
    "entUserId": edtVal?.entUserId ? edtVal?.entUserId : "",
    "entUserMobNo": edtVal?.entUserMobNo ? edtVal?.entUserMobNo : "",
    })
  }
    if(mode !==1){
      set_doc([{
        fileId: edtVal ? edtVal?.imgFileId : "",
        filePath: edtVal ? edtVal.imgFilePath : "",
        fileNm: edtVal ? edtVal.imgFileNm : "",
        fileTyp: edtVal ? edtVal.imgFileTyp : "",
        fileSz: edtVal ? edtVal.imgFileSz : "",
        flUpldLogNo: edtVal ? edtVal.imgFlUpldLogNo : "",
        fileUri: edtVal ? edtVal.imgFileUrl: ""
      }])

    }

   
  }, [edtVal, mode])



  
    //Portal Lov Starts

    const [portalLovData, setPortalLovData] = useState([]);
    useEffect(() => {
        const portalLovObj = {
            apiId: "WAA00023",
        };
        const fetchPortalLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/getAllPortal", portalLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setPortalLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        fetchPortalLovData();
    }, []);

    const getPortalTitle = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalTitle ? portalLovData[Number(Object.keys(obj)[0])]?.portalTitle : "";
    };

    const getportalId = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalId ? portalLovData[Number(Object.keys(obj)[0])]?.portalId : "";
    };

    const [selectRowPortalLov, setSelectRowPortalLov] = useState({});
    const [showModelPortalLov, setShowModelPortalLov] = useState(false);
    const handleRowClickPortalLov = (rowData) => {
        setSelectRowPortalLov(rowData);
        setFormData({
          ...formData,
          portalId: getportalId(rowData),
          portalTitle: getPortalTitle(rowData)
        })
        // setQueryInputObj({
        //     ...queryInputObj,
        //     criteria: {
        //         ...queryInputObj.criteria,
        //         portalId: getportalId(rowData)
        //     }
        // })
    };

    //portal Lov Ends



    // TreeLov Api................
    const [openModal, setOpenModal] = useState(false);
    const [dataa, setDataa] = useState([]);
    const [value, setValue] = useState({})
    const fetchImgCatLovData = async () => {
        let obj = {
            apiId: "WAA00022",
            criteria: {
                portalId: getportalId(selectRowPortalLov)
            }
        }
        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/WAF00002/getAllCategoryInfo", obj, { headers })
            .then((res) => {
                console.log(res.data);
                if (res.data?.content?.qryRsltSet?.length) {

                    const modifiedData = res.data.content.qryRsltSet.map((item) => ({
                        ...item,
                        parentId: item.parentId === "*" ? null : item.parentId,
                    }));
                    let list = modifiedData.map(el => {
                        return {
                            ...el,
                            // lvlNm: el.menuNm,
                            catNm: el.text,
                            catId: el.id
                        }
                    })
                    setDataa(list);
                }
                setOpenModal(true);
            });
    };
    console.log(data)

    const onRenderItem = (item, treeview) => {
        console.log(item);
        return (
            <div className="treeview-item-example">
                <span onClick={(e) => handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
            </div>
        )
    }

    const handleItemClick = (item) => {
        const catId = item.id;
        setValue({
            catId: item.id,
            catNm: item.text
        })
        setFormData({
          ...formData,
          catId: item.id,
          catNm: item.text
        })
       
        setOpenModal(false);

        setMsg("")
        setMsgTyp("")

    };

    const handleOpenModal = () => {

        fetchImgCatLovData();

    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleClear = () => {
        setValue({
            catId: "",
            catNm: ""
        })
        setFormData({
          ...formData,
          catId: "",
          catNm: ""
        })
        handleCloseModal()
    }

    // TreeLov API Ends.......................
  


  console.log(formData);
  console.log(doc[0])

    

  const handleInputChange = (event) => {
    const{ name, value} = event.target;
    if(name==="entUserMobNo" && isNaN(value)){
      return;
    }else{
      setFormData({ ...formData, [event.target.name]: event.target.value });

    }
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

  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    imgTitle: false,
    imgDesc: false,
    entUserId: false,
    entUserMobNo: false
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };







  const resetForm = () => {

    setFormData({
      "actFlg": "A",
      "altitude": 0,
      "catId": "",
      catNm:"",
      "imgDesc": "",
      "imgFileCatCd": "",
      "imgFileId": "",
      "imgFileNm": "",
      "imgFilePath": "",
      "imgFileSz": 0,
      "imgFileTyp": "",
      "imgFileUrl": "",
      "imgFlUpldLogNo": "",
      "imgId": "",
      "imgTitle": "",
      "latitude": 0,
      "longitude": 0,
      "orderBy": 0,
      "portalId": "",
      portalTitle:"",
      "entUserId":"",
      "entUserMobNo":""
    })
set_doc([])
  };
  //  setEdtVal({
  //   modGrpId: '', 
  //   modGrpNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    entUserId: false,
    entUserMobNo: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      "apiId": "WAA00012",
      "mst": [{
        "altitude": formData?.altitude || 0,
        "catId": formData?.catId,
        "entUserId":formData?.entUserId,
        "entUserMobNo": formData?.entUserMobNo || "",
        "imgDesc": formData?.imgDesc|| "",
        "imgFileCatCd": "C0001",
        "imgFileId": doc[0]?.fileId,
        "imgFileNm": doc[0]?.fileNm,
        "imgFilePath": doc[0]?.filePath,
        "imgFileSz": doc[0]?.fileSz,
        "imgFileTyp": doc[0]?.fileTyp,
        "imgFileUrl": doc[0]?.fileUri,
        "imgFlUpldLogNo": doc[0]?.flUpldLogNo || "",
        "imgTitle": formData?.imgTitle,
        "latitude": formData?.latitude || 0,
        "longitude":formData?.longitude || 0,
        "orderBy": formData?.orderBy,
        "portalId": formData?.portalId,
      }]
    }


    const editObj = {
      "apiId": "WAA00018",
      "mst": {
        "actFlg": formData?.actFlg,
        "altitude": formData?.altitude,
        "catId": formData?.catId,
        "imgDesc": formData?.imgDesc,
        "imgFileCatCd": "C0001",
        "imgFileId": doc[0]?.fileId,
        "imgFileNm": doc[0]?.fileNm,
        "imgFilePath":doc[0]?.filePath,
        "imgFileSz": doc[0]?.fileSz,
        "imgFileTyp": doc[0]?.fileTyp,
        "imgFileUrl": doc[0]?.fileUri,
        "imgFlUpldLogNo": doc[0]?.flUpldLogNo,
        "imgId": edtVal?.imgId,
        "imgTitle": formData?.imgTitle,
        "latitude": formData?.latitude,
        "longitude": formData?.longitude,
        "orderBy": formData?.orderBy,
        "portalId": formData?.portalId,
      }
    }
    const deleteObj = 
      {
        "apiId": "WAA00017",
        "mst": {
          "imgId": rowData?.imgId
        }
      }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
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
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/saveEdit', editObj, { headers }).then(res => {
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
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00001/saveDelete', deleteObj, { headers })
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
    const deleteObj =  {
      "apiId": "WAA00017",
      "mst": {
        "imgId": rowData?.imgId
      }
    }

   
      axios
        .post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/saveDelete', deleteObj, { headers })
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
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
      set_viewMsg(false)
  
  }, [viewMsg])



  //file handeling start
  const [fileErr_msg, set_fileErr_msg] = useState("");
  const uploadFiles = async (e) => {
    if (mode > 2) return;

    const { files } = e.target;
    const refApiId = mode===1? "WAA00012" : "WAA00018"
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
  console.log(doc)

  return (
    <div>


      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">
          Image Upload  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

        { mode!==1 && (<div className=" row mb-4">
            <label className="col-md-3 form-label">
              Image Id:
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="imgId"
                value={formData?.imgId}
               disabled
               />
               </div>
          </div>) }

            {/* Portal LOV */}
            <div className="row mb-4 ">
                                <label className="col-sm-3 col-form-label">
                                    <b>
                                        Portal Id:<span className="text-red">*</span>
                                    </b>
                                </label>
                                <div className="col-md-9">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary">
                                            <i
                                                className="fa fa-search d-inline text-white"
                                                title=""
                                                onClick={() => setShowModelPortalLov(true)}
                                            />
                                        </span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
                                            value={formData.portalId}
                                            required
                                        />

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            value={formData.portalTitle}

                                        />
                                        <div className="row-mb-12">
                                            {showModelPortalLov && (
                                                <Lov
                                                    moduleLovData={portalLovData}
                                                    setShowModel={setShowModelPortalLov}
                                                    showModel={showModelPortalLov}
                                                    handleRowClick={handleRowClickPortalLov}
                                                    columns={portalLovColumns}
                                                    currentSelection={selectRowPortalLov}
                                                    setCurrentSelection={setSelectRowPortalLov}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ImgCat Lov */}
                            <div className="row mb-4">
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-3 col-form-label"
                                >
                                    <b>Image Category:<span className="text-red">*</span></b>

                                </label>
                                <div className="col-md-9">
                                    <div class="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>
                                        <input type="text" class="form-control" value={formData.catId} required />
                                        <input type="text" class="form-control  mx-4 rounded-3" value={formData.catNm}  />
                                    </div>
                                </div>
                                <div className="row-mb-12">
                                    {/* Modal */}
                                    {openModal && (
                                        <Modal show={openModal} onHide={handleCloseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title><b>Select Image Category</b></Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <TreeView
                                                    id="treeview1"
                                                    style={{ height: "auto" }}
                                                    showIcon={false}
                                                    className="branch"
                                                    items={dataa}
                                                    onSelectItem={handleItemClick}
                                                    onRenderItem={onRenderItem}
                                                // items={renderTreeItems(treeview1)}
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                                                <button className="btn btn-primary" onClick={handleClear}>Clear</button>

                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                    {/* Input fields */}
                                </div>
                            </div>

          {/* { mode===1 && (<div className=" row mb-4">
            <label className="col-md-3 form-label">
              User Id:<span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="entUserId"
                value={formData?.entUserId}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                //placeholder="Name"
                required
                maxLength={25}
                disabled={mode === 3 || mode === 4}
                onFocus={() => toggleCharCountVisibility("entUserId")}
                onBlur={() => toggleCharCountVisibility("entUserId")}
              />
              {fieldCharCountVisibility.entUserId && (
                <span className="input-group-text">
                  {formData?.entUserId?.length}/25
                </span>
              )}

            </div>
          </div>) } */}
         {/* {mode===1 && (<div className=" row mb-4">
            <label className="col-md-3 form-label">
              User Mobile No:
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="entUserMobNo"
                value={formData?.entUserMobNo}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder="Enter Mobile Number"
                //required
                maxLength={10}
                disabled={mode === 3 || mode === 4}
                onFocus={() => toggleCharCountVisibility("entUserMobNo")}
                onBlur={() => toggleCharCountVisibility("entUserMobNo")}
              />
              {fieldCharCountVisibility.entUserMobNo && (
                <span className="input-group-text">
                  {formData?.entUserMobNo?.length}/10
                </span>
              )}

            </div>
          </div>)} */}

          {/* <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Portal ID:<span className="text-red">*</span>
            </label>
            <div className="col-md-4 input-group">
              <input
                className="form-control"
                type="text"
                name="portalId"
                value={formData?.portalId}
                //onChange={handleInputChange}
                onBlur={handleCharCount}
                //placeholder="Name"
                required
                maxLength={50}
                disabled

              />

            </div>
            <label className="col-md-2 form-label">
              Order By:
            </label>
            <div className="col-md-3 input-group">
              <input
                className="form-control"
                type="text"
                name="orderBy"
                value={formData?.orderBy}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />

            </div>
          </div> */}

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Image Title:<span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="imgTitle"
                value={formData?.imgTitle}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder="Enter Title"
                required
                maxLength={255}
                disabled={mode === 3 || mode === 4}
                onFocus={() => toggleCharCountVisibility("imgTitle")}
                onBlur={() => toggleCharCountVisibility("imgTitle")}
              />
              {fieldCharCountVisibility.imgTitle && (
                <span className="input-group-text">
                  {formData?.imgTitle?.length}/255
                </span>
              )}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Image Description:
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="imgDesc"
                value={formData?.imgDesc}
                onChange={handleInputChange}
                // onBlur={handleCharCount}
                placeholder="Enter description"
                //required
                maxLength={500}
                disabled={mode === 3 || mode === 4}
                onFocus={() => toggleCharCountVisibility("imgDesc")}
                onBlur={() => toggleCharCountVisibility("imgDesc")}
              />
              {fieldCharCountVisibility.imgDesc && (
                <span className="input-group-text">
                  {formData?.imgDesc?.length}/500
                </span>
              )}

            </div>
          </div>

          <div className=" row mb-4">
          <label className="col-md-3 form-label">
              Altitude:
            </label>
            <div className="input-group col-md-3">
              <input
                className="form-control"
                type="text"
                name="altitude"
                value={formData?.altitude}
                onChange={handleInputChange}
               // onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={50}
                readOnly

              />

            </div>

            <label className="col-md-3 form-label">
            longitude:
            </label>
            <div className="input-group col-md-3">
              <input
                className="form-control"
                type="text"
                name="longitude"
                value={formData?.longitude}
                onChange={handleInputChange}
                //onBlur={handleCharCount}
               // placeholder="Name"
                //required
                maxLength={50}
                readOnly

              />

            </div>
          </div>

            <div className="row mb-4">
            <label className="col-md-3 form-label">
            latitude:
            </label>
            <div className="input-group col-md-3">
              <input
                className="form-control"
                type="text"
                name="latitude"
                value={formData?.latitude}
                onChange={handleInputChange}
               // onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={50}
                readOnly

              />

            </div>
            <label className="col-md-3 form-label">
              Order By:
            </label>
            <div className="col-md-3 input-group">
              <input
                className="form-control"
                type="text"
                name="orderBy"
                value={formData?.orderBy}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={2}
                disabled={mode === 3 || mode === 4}
              />
            </div>
            </div>

          {/* file upload filed */}
          <div className="row mb-2">
          <label className="form-label col-md-3">Upload Image Files:<span className="text-red">*</span></label>
          <div className="col-md-9">
            {doc?.length === 0 && (
              <div className="file-upload">
                <div className="input-name">Choose File</div>
                <input
                  style={{
                    visibility: mode === 1 || mode === 2 ? "visible" : "hidden",
                  }}
                  type="file"
                  required={mode === 1}
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
        {/* file upload filed */}
          
        {(mode!==1) && <div className="row mb-4">
            <label className="col-md-3 form-label">
              Status:
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
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