import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from 'axios';
import { getScplAdContext } from "../../common/common";
import { portalLovColumns } from "./columns";
import { Modal, ModalTitle } from "react-bootstrap";
import Smalltag from "../../common/SmallTag/smalltag";
import { Delete, Download, Edit } from "@mui/icons-material";
import TreeView from "deni-react-treeview";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import {
    Tabs,
    Tab,
    OverlayTrigger,

    Breadcrumb,
    Card,
    Row,
    Col,
    Form,

} from "react-bootstrap";
import Lov from "../../common/Lov";
import { stateLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ImgUpldMulti = () => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])

    // Open Form API
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj = {
                apiId: "WAA00011"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ? res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '');
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
            })
        }

        fetchOpenData()

    }, [])





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
        // setFormData({
        //   ...formData,
        //   portalId: getportalId(rowData),
        //   portalTitle: getPortalTitle(rowData)
        // })
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
    // console.log(data)

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
        // setFormData({
        //   ...formData,
        //   catId: item.id,
        //   catNm: item.text
        // })

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
        // setFormData({
        //   ...formData,
        //   catId: "",
        //   catNm: ""
        // })
        handleCloseModal()
    }

    // TreeLov API Ends.......................
    const entUserId = getScplAdContext().userId;
    const entUserMobNo = getScplAdContext().entUserMobNo;
    // TAble
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            altitude: 0,
            entUserId: entUserId,
            entUserMobNo: entUserMobNo,
            imgDesc: "",
            imgFileCatCd: "",
            imgFileId: "",
            imgFileNm: "",
            imgFilePath: "",
            imgFileSz: 0,
            imgFileTyp: "",
            imgFileUrl: "",
            imgFlUpldLogNo: "",
            imgTitle: "",
            latitude: 0,
            longitude: 0,
            orderBy: 0,
            actFlg: 'A',
            errors: {
                imgFileId: '',
                orderBy: '',
                actFlg: '',
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.imgFileId || !row.orderBy || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    imgFileId: !row.imgFileId ? "Please Upload File." : '',
                    orderBy: !row.orderBy ? "Please fill in this field." : '',
                    actFlg: !row.actFlg ? "Please select a value." : '',
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        } else {
            setTableRow((prevRows) => [
                ...prevRows,
                {
                    altitude: 0,
                    entUserId: entUserId,
                    entUserMobNo: entUserMobNo,
                    imgDesc: "",
                    imgFileCatCd: "",
                    imgFileId: "",
                    imgFileNm: "",
                    imgFilePath: "",
                    imgFileSz: 0,
                    imgFileTyp: "",
                    imgFileUrl: "",
                    imgFlUpldLogNo: "",
                    imgTitle: "",
                    latitude: 0,
                    longitude: 0,
                    orderBy: 0,
                    actFlg: 'A',
                    errors: {
                        imgFileId: '',
                        orderBy: '',
                        actFlg: '',
                    }
                },
            ]);

            setCharCount((prevRows) => [
                ...prevRows,
                {
                    isTyping: false
                },
            ]);
        }


    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = tableRow;

        // Clear the error message for the corresponding field
        list[index] = {
            ...list[index],
            [name]: value,
            errors: {
                ...list[index].errors,
                [name]: '',  // Clear the error message for this field
            },
        };

        setTableRow([...list]);

        let rowsCharCount = charCount;
        rowsCharCount[index] = {
            isTyping: true
        };

        setCharCount([...rowsCharCount]);
    };

    const handleStatusChange = (e, index) => {
        const { name, value } = e.target;
        let list = [...tableRow]; // Create a copy of the tableRow array
        list[index] = {
            ...list[index],
            [name]: value
        };
        setTableRow(list);
    };


    const handleCharCount = (e, index) => {

        let rowsCharCount = charCount
        rowsCharCount[index] = {
            isTyping: false
        }
        setCharCount([...rowsCharCount])
    };

    const removetableRow = (e, index) => {
        let rows = tableRow
        rows.splice(index, 1)
        setTableRow([...rows])
        let rowsCharCount = charCount
        rowsCharCount.splice(index, 1)
        setCharCount([...rowsCharCount])
    };



    const resetForm = () => {
        setValue({})
        setSelectRowPortalLov({})
        setTableRow(
            [
                {
                    altitude: 0,
                    entUserId: entUserId,
                    entUserMobNo: entUserMobNo,
                    imgDesc: "",
                    imgFileCatCd: "",
                    imgFileId: "",
                    imgFileNm: "",
                    imgFilePath: "",
                    imgFileSz: 0,
                    imgFileTyp: "",
                    imgFileUrl: "",
                    imgFlUpldLogNo: "",
                    imgTitle: "",
                    latitude: 0,
                    longitude: 0,
                    orderBy: 0,
                    actFlg: 'A',
                    errors: {
                        imgFileId: '',
                        orderBy: 0,
                        actFlg: '',
                    }
                },
            ]
        )

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        const body = {
            apiId: "WAA00012",
            mst: tableRow.map((row) => {
                const { errors, ...obj } = row;
                return {
                    ...obj,
                    portalId: getportalId(selectRowPortalLov),
                    catId: value.catId
                }

            })
        };
        console.log("obj==>>>", body);
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WAF00002/saveAdd', body, { headers }).then((res) => {
           let resp = res.data?.content?.mst.map(item =>{
           let obj= tableRow.map(row=>{
                if(row.imgFileNm === item.keyStrVal){
                    return{
                        "colNm": item?.colNm,
                    "flUpldLogNo": row?.imgFlUpldLogNo,
                    "keyStr": item?.keyStr,
                    "keyStrVal": item?.keyStrVal,
                    "tabNm": item?.tabNm
                    }
                }
            })
            return obj;
           })
           console.log(resp);
           
            const conf_obj = {
                "apiId": "SUA00487",
                "mst": tableRow.map((item) => {
                  return {
                    "colNm": res.data?.content?.mst?.colNm,
                    "flUpldLogNo": item?.imgFlUpldLogNo,
                    "keyStr": res.data?.content?.mst?.keyStr,
                    "keyStrVal": res.data?.content?.mst?.keyStrVal,
                    "tabNm": res.data?.content?.mst?.tabNm
                  }
                })
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
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm();
            }
        })
    }

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        distCd: false,
        distNm: false,
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



    // File Related Code...........
    const handle_confirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
          obj,
          { headers })
      }

    const [doc, set_doc] = useState([]);
    // useEffect(() => {
    //   set_doc(
    //     formData.fildetails.map((item, index) => ({
    //       fileUri: item.fileUri,
    //       name: "File " + (index + 1),
    //     }))
    //   );
    // }, []);
    const [fileErr_msg, set_fileErr_msg] = useState("")
    const uploadFiles = async (e, index) => {
        // if (mode > 2) return

        const { files } = e.target;
        const refApiId = "WAA00012"
        let fileArr = [];

        for (let i = 0; i < files.length; i++) {
            let formData = new FormData();
            if (files[i].size > 1000 * 1000 * 1) {
                set_fileErr_msg("File size exceded : 25mb")
                break;
            } else {
                set_fileErr_msg("")
            }
            formData.append("vfile", files[i]);

            //"http://192.168.0.44/SuV4Sa/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00499" + "&appId=" + "" + "&mobRegNo=" + "",
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + refApiId + "&appId=" + "" + "&mobRegNo=" + "" + "&fileCatCd=" + "C0001",
                    formData, { headers }
                )
                .then((res) => {
                    if (res?.data?.appMsgList?.errorStatus === false) {
                        fileArr = [
                            ...fileArr,
                            {
                                ...res.data.content
                                //name: "File "+(doc.length+1+i)
                                // name: files[i].name,
                            },
                        ];
                    }
                    else {
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                        set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        }

        set_doc([...doc, ...fileArr]);
        console.log("doc", doc);
        let list = tableRow;

        // Clear the error message for the corresponding field
        let currentAct = list[index]?.action
        list[index] = {
            ...list[index],
            // fileCat: "",
            imgFileId: fileArr[0].fileId,
            imgFileNm: fileArr[0].fileNm,
            imgFilePath: fileArr[0].filePath,
            imgFileSz: fileArr[0].fileSz,
            imgFileTyp: fileArr[0].fileTyp,
            imgFileUrl: fileArr[0].fileUri,
            imgFlUpldLogNo: fileArr[0].flUpldLogNo,
            imgTitle: fileArr[0].fileNm,
            imgFileCatCd: "C0001"

            //   action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'

        };

        let updateTableRow = tableRow[index].map((row) => {
            return {
                ...row,
                ...list
            }
        })
        setTableRow({ ...updateTableRow })
        console.log("tableRow", tableRow);

    };
    const download_file = async (e, i) => {
        const obj = {
            apiId: "SUA00488",
            mst: {
                fileId: tableRow[i]?.imgFileId,
                fileNm: tableRow[i]?.imgFileNm
            }
        }
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
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/downloadFile", obj, {
            headers: {
                Authorization: headers?.Authorization,
                Accept: "application/zip"
            },
            responseType: 'arraybuffer',
        })
            .then((res) => {
                //fileDownload(res.data, "file.pdf")
                const url = window.URL.createObjectURL(
                    new Blob([res.data]),
                );
                const tempArr = doc[i]?.fileNm?.split(".") || [];
                const extention = tempArr[tempArr?.length - 1] || "pdf"
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download', tableRow[i]?.imgFileId + "." + extention
                );
                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                //link.parentNode.removeChild(link);
            })
    }

    const delete_file = async (e, i) => {
        let obj = {
            apiId: "SUA00489",
            mst: [{
                flUpldLogNo: tableRow[i]?.imgFlUpldLogNo
            }]
        }
        console.log("yyyyyyyy", tableRow[i]);

        if (window.confirm("Are you sure? File cannot be recover once deleted !")) {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00134/forceFileDeletion",
                    obj, { headers }
                    // formData
                )
                .then((res) => {
                    if (res?.data?.appMsgList?.errorStatus === false) {
                        const updatedDtl01 = [...tableRow];

                        updatedDtl01[i] = {
                            ...updatedDtl01[i],
                            imgFileId: "",
                            imgFileNm: "",
                            imgFilePath: "",
                            imgFileSz: 0,
                            imgFileTyp: "",
                            imgFileUrl: "",
                            imgFlUpldLogNo: "",
                            imgTitle: "",
                            imgFileCatCd: "C0001"
                        };

                        setTableRow({
                            ...tableRow,
                            ...updatedDtl01
                        });
                    }
                    else {
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        }
    };


    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Image Upload - Multiple Files Add</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    Add Multiple Files
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    WAF00002_03
                                </a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto pageheader-btn">
                    {/* <a
                        className="btn btn-primary btn-icon text-white"
                        onClick={() => setCreateModalOpen({
                            open: true,
                            mode: 1,
                            rowData: null
                        })}

                        variant="contained"
                    >
                        <span>
                            <i className="fe fe-plus" />
                            &nbsp;
                        </span>
                        Add New
                    </a>&nbsp; */}
                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/WAF00002_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Image Upload List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
            <Row>

                <Card>
                    <Card.Body>
                        <Row>

                            <form onSubmit={finalSubmit}>
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
                                                value={getportalId(selectRowPortalLov) ? getportalId(selectRowPortalLov) : ""}
                                                required
                                            />

                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control mx-4"
                                                value={getPortalTitle(selectRowPortalLov) ? getPortalTitle(selectRowPortalLov) : ""}

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
                                            <input type="text" class="form-control" value={value.catId} required />
                                            <input type="text" class="form-control  mx-4 rounded-3" value={value.catNm} required />
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
                                <Card>
                                    <div className="table-responsive table">
                                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                                            <thead>
                                                <tr>
                                                    <th className="sno">Row#</th>
                                                    {/* <th> Id</th> */}
                                                    <th> File<span className="text-red">*</span></th>
                                                    <th>Order By<span className="text-red">*</span></th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableRow.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>
                                                            <div className="row mb-2">
                                                                {/* <label className="form-label col-md-3">Attach Document<span className="text-red">*</span></label> */}
                                                                <div className="">

                                                                    {(row?.imgFilePath === "") && <div className="file-uploaddd">
                                                                        {/* <div className="input-namedd">Choose File</div> */}
                                                                        <input
                                                                            //   style={{ visibility: (mode === 1 || mode === 2) ? "visible" : "hidden" }}
                                                                            type="file"
                                                                            required
                                                                            className="form-control"
                                                                            id="formFile"
                                                                            onChange={(e) => uploadFiles(e, index)}
                                                                            name="File"
                                                                        //required={!doc.length}
                                                                        // multiple
                                                                        // accept=".pdf"
                                                                        //   disabled={mode === 3 || mode === 4}
                                                                        />
                                                                    </div>}
                                                                    {fileErr_msg && <p style={{ color: "red" }}>{fileErr_msg}</p>}

                                                                    {/* {row?.map((file, index) => ( */}
                                                                    <div className="file-div" key={index}>
                                                                        {(row.imgFilePath) && <Smalltag
                                                                            handleClick={() =>
                                                                                window.open(
                                                                                    process.env.REACT_APP_API_URL_PREFIX +
                                                                                    row.imgFileUrl,
                                                                                    "_blank",
                                                                                    "rel=noopener noreferrer"
                                                                                )
                                                                            }
                                                                            fontAwsmIcon={"fa-file"}
                                                                            lable={row.imgFileNm}
                                                                            key={index}
                                                                        />}

                                                                        {((row?.imgFilePath) &&
                                                                            <>
                                                                                <Delete
                                                                                    onClick={(e) => delete_file(e, index)}
                                                                                    className="cross-icon"
                                                                                />

                                                                                <Download
                                                                                    onClick={(e) => download_file(e, index)}
                                                                                    className="cross-icon"
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {/* ))} */}
                                                                </div>
                                                            </div>

                                                        </td>
                                                        <td>
                                                            <input
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                // onBlur={(e) => handleCharCount(e, index)}
                                                                value={row.orderBy}
                                                                className="form-control"
                                                                type="text"
                                                                name="orderBy"
                                                                required
                                                                maxLength={2}

                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-control select"
                                                                aria-label=".form-select-lg example"
                                                                id="status"
                                                                value={row.actFlg}
                                                                required
                                                                onChange={(e) => handleStatusChange(e, index)}
                                                                name="actFlg"
                                                            >


                                                                <option disabled>--Select--</option>


                                                                {openData?.mst?.ddActFlg?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                ))}
                                                            </select>
                                                            {row?.errors?.actFlg && (
                                                                <div className="error-message text-red text-center">{row?.errors?.actFlg}</div>
                                                            )}
                                                        </td>

                                                        <td>
                                                            {index !== tableRow.length - 1 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => removetableRow(e, index)}
                                                                    className="action-button"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </button>
                                                            ) : (
                                                                <div className="d-flex">
                                                                    {index !== 0 && <button
                                                                        type="button"
                                                                        onClick={(e) => removetableRow(e, index)}
                                                                        className="action-button"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </button>}
                                                                    <button type="button" onClick={addtableRow} className="action-button">
                                                                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                                    </button>

                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                                <button className="btn btn-primary" type="submit">Save</button>
                                <button
                                    className="btn btn-secondary mx-2"
                                    type="reset"
                                    //onClick="resetForm"
                                    onClick={(e) => resetForm()}
                                >
                                    Reset
                                </button>
                            </form>

                        </Row>
                    </Card.Body>
                </Card>


            </Row>
        </>
    )
}
export default ImgUpldMulti;