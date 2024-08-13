import React, { useState, useEffect, useRef } from "react";
import { Tree } from 'antd';
import { Modal, ModalTitle } from "react-bootstrap";
// import { DatePicker } from '@gsebdev/react-simple-datepicker';
import { dsgnLovColumns, userTypLovColumns } from "./columns";
import { Alert } from "react-bootstrap";
// import 'react-datepicker/dist/react-datepicker.css';
import TreeView from "deni-react-treeview";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common";
import axios from 'axios';
// import moment from 'moment';
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
//import PolicyDefinationNewEntryPage from './SUF00042_02'
const { DirectoryTree } = Tree;
const headers = { Authorization: 'Bearer ' + getApiToken() };
export const UserMaintenanceNewEntry = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, msg1, setMsg1, msgTyp1, setMsgTyp1, addVal, edtVal, updateEdtVal, setEdtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp }) => {
    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    console.log(edtVal);
    console.log(addVal);

    // Get All List
    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00033/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content?.qryRsltSet);
            console.log(data);
            setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
        })
    }



    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])



    // for display date
    const getDateFormart_yyyymmdd = (ddmmyyyy) => {
        console.log(ddmmyyyy);


        if (ddmmyyyy) {
            const day = ddmmyyyy.slice(8, 10)
            const month = ddmmyyyy.slice(5, 7)
            const year = ddmmyyyy.slice(0, 4)
            console.log(`${year}-${month}-${day}`);
            return `${year}-${month}-${day}`

        } else return ""
    }
    let effDt = getDateFormart_yyyymmdd(edtVal?.effDt);
    let expDt = getDateFormart_yyyymmdd(edtVal?.expDt);
    let dob = getDateFormart_yyyymmdd(edtVal?.dob);





    // for post date
    const getDateFormart_ddmmyyyy = (ddmmyyyy) => {
        console.log(ddmmyyyy);


        if (ddmmyyyy) {
            const day = ddmmyyyy.slice(8, 10)
            const month = ddmmyyyy.slice(5, 7)
            const year = ddmmyyyy.slice(0, 4)
            console.log(`${day}-${month}-${year}`);
            return `${day}-${month}-${year}`

        } else return ""
    }




    const [formData, setFormData] = useState({});

useEffect(() => {
if(mode !==1){
    setFormData({
        // id: rowData ? rowData.id : '',
        userId: rowData ? rowData.userId : '',
        userNm: rowData ? rowData.userNm : '',
        effDt: effDt===null? "": effDt || '',
        expDt: expDt===null? "": expDt || '',
        userPwd: edtVal ? edtVal.userPwd : '',
        locFlg: edtVal ? edtVal.locFlg : 'A',
        ipChk: edtVal ? edtVal.ipChk : 'A',
        dob: edtVal ? dob : '',
        mailId: edtVal ? edtVal.mailId : '',
        mobNo: edtVal ? edtVal.mobNo : '',
        addr: edtVal ? edtVal.addr : '',
        dsgnCd: edtVal ? edtVal.dsgnCd : '',
        dsgnNm: edtVal ? edtVal.dsgnNmt : '',
        desgLvlRefCd: edtVal ? edtVal.desgLvlRefCd=== null? "":edtVal.desgLvlRefCd: '',
        desgLvlRefNm: edtVal ? edtVal.desgLvlRefNm=== null? "":edtVal.dsgnLvlRefNm : '',
        alertFlg: edtVal ? edtVal.alertFlg : 'Y',
        actFlg: edtVal ? edtVal.actFlg : 'A',
        userTypCd:edtVal ? edtVal.userTypCd=== null? "":edtVal.userTypCd:"",
        userTypDesc: edtVal? edtVal.userTypDesc:"",
        dummyUserId: edtVal ? edtVal.dummyUserId:"N"
    })
}else{
    setFormData({
        // id: '',
        userId: '',
        userNm:  '',
        effDt: '',
        expDt: '',
        userPwd:  '',
        locFlg:  'A',
        ipChk: 'A',
        dob: '',
        mailId:'',
        mobNo:  '',
        addr:  '',
        dsgnCd:'',
        dsgnNm: '',
        desgLvlRefCd: '',
        desgLvlRefNm:'',
        alertFlg:  'Y',
        actFlg:  'A',
        userTypCd:"",
        userTypDesc: "",
        dummyUserId: "N"
    })
}
}, [mode, edtVal])




    console.log(formData);
    console.log(formData.effDt);
    const handleInputChange = (event) => {

        const { name, value } = event.target
        if (name === 'mobNo' && isNaN(value)) {
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
        // const {name, value}=event.target;
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value,
        //     alertFlg:value?(value==="Y"?"A":"I"):"",  });
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if(name==="ipChk"){
        setFormData({
            ...formData,
            [name]: checked ? "A" : "S",
        })}else{
            setFormData({
                ...formData,
                [name]: checked ? "Y" : "N",
            }) 
        }
    };


    const validateInput = (formData) => {
        if ((!formData.dev_nm.trim()) || (formData.dev_nm.trim() === "")) {
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
            userId: "",
            userNm: "",
            effDt: "",
            expDt: "",
            userPwd: "",
            locFlg: "A",
            ipChk: "A",
            dob: "",
            mailId: "",
            mobNo: "",
            addr: "",
            dsgnCd: "",
            dsgnNm: "",
            desgLvlRefCd: "",
            desgLvlRefNm: "",
            alertFlg: "A",
            actFlg: "",
            userTypDesc:"",
            userTypCd:"",
            dummyUserId:"N"
        })
       
        setValue({})

    };



    // dsgn Group LOV Start..............
    const [dsgnLovData, setDsgnLovData] = useState([]);
    useEffect(() => {

        const fetchDsgnLovData = async () => {
            let obj = {
                apiId: 'SUA00148'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/getAllDesignation", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDsgnLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchDsgnLovData();
    }, []);


    const getDsgnNm = (obj) => {
        return dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnNm
    }

    const getDsgnId = (obj) => {
        return dsgnLovData[Number(Object.keys(obj)[0])]?.dsgnCd
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowDsgnLov, setSelectRowDsgnLov] = useState("");
    const [showModelDsgnLov, setShowModelDsgnLov] = useState(false);
    const handleRowClickDsgnLov = (rowData) => {
        setSelectRow(rowData);
        setSelectRowDsgnLov(rowData);
       setFormData({
        ...formData,
        dsgnCd: getDsgnId(rowData),
        dsgnNm: getDsgnNm(rowData)
       })
        // setQueryInputObj({
        //   ...queryInputObj,
        //   modGrpId: getModGrpId(rowData),

        // });
    };
    //dsgn group Lov ends 


       // User Type LOV Start..............
       const [userTypLovData, setUserTypLovData] = useState([]);
       useEffect(() => {
   
           const fetchUserTypLovData = async () => {
               let obj = {
                   apiId: 'SUA00631'
               }
               await axios
                   .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/getAllUserType", obj, { headers })
                   .then((res) => {
                       console.log(res.data);
                       setUserTypLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
   
                   });
           };
           fetchUserTypLovData();
       }, []);
   
   
       const getUserTypNm = (obj) => {
           return userTypLovData[Number(Object.keys(obj)[0])]?.userTypDesc
       }
   
       const getUserTypId = (obj) => {
           return userTypLovData[Number(Object.keys(obj)[0])]?.userTypCd
       }
   
       const [selectRowUserTyp, setSelectRowUserTyp] = useState("");
       const [selectRowUserTypLov, setSelectRowUserTypLov] = useState("");
       const [showModelUserTypLov, setShowModelUserTypLov] = useState(false);
       const handleRowClickUserTypLov = (rowData) => {
           setSelectRowUserTyp(rowData);
           setSelectRowUserTypLov(rowData);
           setFormData({
            ...formData,
            userTypCd: getUserTypId(rowData),
            userTypDesc: getUserTypNm(rowData)
           })
           // setQueryInputObj({
           //   ...queryInputObj,
           //   modGrpId: getModGrpId(rowData),
   
           // });
       };
       //User Type Lov ends 
    //Designation Location Lov Starts

    // TreeLov Api................
    const [dataa, setDataa] = useState([]);

    //   const modLovObj = {
    //     apiId : "SUA00013",
    //     criteria: {

    //         }

    // }
    const [menuLovObj, setMenuLovObj] = useState({
        modId: ''
    })
    console.log(menuLovObj);

    const fetchTreeLovData = async () => {
        let obj = {
            apiId: 'SUA00149'
        }

        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/getAllLocations", obj, { headers })
            .then((res) => {
                console.log(res.data);

                if (res.data?.content?.qryRsltSet?.length) {
                    const modifyData = (items) => {
                        return items.map((item) => {
                            const newItem = {
                                ...item,
                                menuNm: item.text,
                                menuId: item.id,
                                parMenuId: item.parentId,
                            };
                            if (item.children) {
                                newItem.children = modifyData(item.children);
                            }
                            return newItem;
                        });
                    };

                    const modifiedData = modifyData(res.data.content.qryRsltSet);

                    setData(modifiedData);

                }

                else {
                    setDataa([])
                }
                setOpenModal(true);
            });
    };

    console.log(dataa)
    const [treeview1, setTreeview1] = useState([])

    // Tree Populate
    // const idMapping = dataa.reduce((acc, el, i) => {
    //     acc[el.lvlRefCd] = i;
    //     return acc;
    // }, []);

    // //  let treeview1=[];

    // useEffect(() => {

    //     dataa.forEach((el) => {
    //         // Handle the root element
    //         if (el.parLvlRefCd === null) {
    //             setTreeview1([...treeview1, el]);
    //             return;
    //         }
    //         // Use our mapping to locate the parent element in our data array
    //         const parentEl = dataa[idMapping[el.parLvlRefCd]];
    //         // Add our current el to its parent's `children` array
    //         parentEl.children = [...(parentEl.children || []), el];
    //     });
    // }, [dataa])


    const [value, setValue] = useState({
        id: null,
        text: "",

    });
    const [title, setTitle] = useState({});
    console.log(treeview1);


    const handleItemClick = (item) => {
        const menuId = item.id;
        console.log(menuId)
        setValue({
            ...item,
            id: item.id,
            text: item.text,

        }) // Assuming `item.text` is the title you want to set
        setFormData({
            ...formData,
            desgLvlRefCd: item.id,
            desgLvlRefNm: item.text
        })
        setOpenModal(false);
        // updateEdtVal({
        //     ...edtVal, desgLvlRefCd: item.desgLvlRefCd,
        //     desgLvlRefNm: item.desgLvlRefNm
        // });
      


    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [setMsg])
    //Designation Location Lov Ends

    const handleSubmit = async (e) => {
        e.preventDefault()
    const {actFlg, userTypDesc, desgLvlRefNm, dsgnNm, ...obj}= formData;
        console.log(formData)
        const addObj =

        {
            apiId: "SUA00073",
            mst: {
                ...obj,
                effDt: getDateFormart_yyyymmdd(formData.effDt),
                expDt: getDateFormart_yyyymmdd(formData.expDt),
                dob: getDateFormart_yyyymmdd(formData.dob)
            }
        }



        const editObj = {
            apiId: "SUA00078",
            mst: {
                ...obj, 
                actFlg: formData.actFlg,
                effDt: getDateFormart_yyyymmdd(formData.effDt),
                expDt: getDateFormart_yyyymmdd(formData.expDt),
                dob: getDateFormart_yyyymmdd(formData.dob)
            }
        }
        const deleteObj = {
            apiId: "SUA00082",
            mst: {
                userId: formData.userId
            }
        }

        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00033/saveAdd', addObj, { headers })
                .then(res => {
                    console.log(res.data)
                    if (res.data?.appMsgList?.errorStatus === false) {
                        fetchData()
                        //   window. scrollTo( { top: 0, left: 0, behavior: 'smooth'} ) 

                    }
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                    set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                        // window.scrollTo(0, 0); 
                        resetForm();
                    }

                }).catch(error => {
                    console.log("error")
                })
                .finally(() => {
                    set_viewMsg(true)
                });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00033/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (res.data?.appMsgList?.errorStatus === false) {
                    //TRUE OPERATION
                    fetchData()

                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
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
    const [delStatus, set_delStatus] = useState(false)
    const handleConfirmation = async () => {
        const deleteObj = {
            apiId: "SUA00082",
            mst: {
                userId: formData.userId
            }
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00033/saveDelete', deleteObj, { headers }).then(res => {
            console.log(res.data)
            if (res.data?.appMsgList?.errorStatus === false) {
                fetchData()

            }
            set_delStatus(true)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({ status: res.data?.appMsgList?.errorStatus })



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
        }
    }

    // Character Counter
    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        userId: false,
        userNm: false,
        userPwd: false,
        mailId: false,
        addr: false,
        mobNo: false
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };


    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [isInvalidRange, setIsInvalidRange] = useState(false);



    const [isValid, setIsValid] = useState(true);
    const [isValid3, setIsValid3] = useState(true);




    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (startDate && endDate && startDate <= endDate) {
            setIsInvalidRange(false);
        } else {
            setIsInvalidRange(endDate < startDate || endDate && !startDate);
        }
    }, [startDate, endDate]);



    const handleOpenModal = () => {
        fetchTreeLovData()

    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleClear = () => {
        setValue({
            ...value,
            id: "",
            text: "",

        })
        setFormData({
            ...formData,
            desgLvlRefCd:"",
            desgLvlRefNm:""
        })
        handleCloseModal()
    }


    return (
        <div>
            <div className="container">
                {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
                <h4 className="card-title">User Maintenance {getFormTitle(mode)}</h4>

                <div className="row ">
                    <form onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                User Id:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    maxLength={25}
                                    name="userId"
                                    value={formData?.userId} onChange={handleInputChange}
                                    disabled={mode !== 1}
                                    placeholder="User Id"
                                    onFocus={() => toggleCharCountVisibility("userId")}
                                    onBlur={() => toggleCharCountVisibility("userId")}
                                />
                                {fieldCharCountVisibility.userId && (
                                    <span className="input-group-text">
                                        {formData?.userId?.length}/25
                                    </span>
                                )}

                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                User Name:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    type=""
                                    name="userNm"

                                    maxLength={50}
                                    value={formData?.userNm} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="User Name"
                                    onFocus={() => toggleCharCountVisibility("userNm")}
                                    onBlur={() => toggleCharCountVisibility("userNm")}
                                />
                                {fieldCharCountVisibility.userNm && (
                                    <span className="input-group-text">
                                        {formData?.userNm?.length}/50
                                    </span>
                                )}

                            </div>
                        </div>

                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>User Type Code:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserTypLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        name="userTypCd"
                                        readOnly
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.userTypCd}
                                        // onChange={(e) => {
                                        //     // Update edtVal.modGrpId when the input changes
                                        //     const newValue = e.target.value;
                                        //     setEdtVal((prevEdtVal) => ({
                                        //         ...prevEdtVal,
                                        //         userTypCd: newValue,
                                        //         setSelectRowUserTyp: ''
                                        //     }));
                                        // }}
                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-4"
                                        name="userTypDesc"
                                        readOnly
                                        disabled={mode === 3 || mode === 4}
                                        value={(formData.userTypDesc)}
                                        // onChange={(e) => {
                                        //     // Update edtVal.modGrpId when the input changes
                                        //     const newValue = e.target.value;
                                        //     setEdtVal((prevEdtVal) => ({
                                        //         ...prevEdtVal,
                                        //         userTypDesc: newValue,
                                        //         setSelectRowUserTyp: ''
                                        //     }));
                                        // }}
                                    />
                                    <div className="row-mb-12">
                                        {showModelUserTypLov && <Lov
                                            moduleLovData={userTypLovData}
                                            setShowModel={setShowModelUserTypLov}
                                            showModel={showModelUserTypLov}
                                            handleRowClick={handleRowClickUserTypLov}
                                            columns={userTypLovColumns}
                                            currentSelection={selectRowUserTyp}
                                            setCurrentSelection={setSelectRowUserTyp}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Effective From:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    type="date"
                                    className="form-control"
                                    id=""
                                    name="effDt"
                                    value={formData?.effDt}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    required

                                />
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Valid Upto:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control "
                                    type="date"
                                    // placeholder="YYYY/MM/DD"
                                    name="expDt"
                                    value={formData?.expDt} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}

                                   
                                />
                            </div>
                        </div>
                        {isInvalidRange && endDate && !startDate && (
                            <div className="row">
                                <div className="col-md-2"></div>
                                <div className="col-md-9 text-red">
                                    First update the Start Date!!
                                </div>
                            </div>
                        )}
                        {isInvalidRange && endDate < startDate && (
                            <div className="row">
                                <div className="col-md-2"></div>
                                <div className="col-md-9 text-red">
                                    End Date cannot be less than Start Date
                                </div>
                            </div>
                        )}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Password:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    type="password"
                                    name="userPwd"
                                    id="exampleFormControlSelect1"
                                    maxLength={100}
                                    value={formData.userPwd} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Password"
                                    onFocus={() => toggleCharCountVisibility("userPwd")}
                                    onBlur={() => toggleCharCountVisibility("userPwd")}
                                />
                                {fieldCharCountVisibility.userPwd && (
                                    <span className="input-group-text">
                                        {formData?.userPwd?.length}/100
                                    </span>
                                )}

                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Location:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <select required
                                    class="from-group col-md-12 rounded-3 border"
                                    aria-label="Default select example"
                                    value={formData.locFlg}
                                    name="locFlg"
                                    onChange={handleStatusChange}
                                    disabled={mode === 3 || mode === 4}
                                // defaultValue="A"
                                >
                                    <option disabled>--Select--</option>
                                    {(mode === 1) ?
                                        (addVal?.ddLocFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.ddLocFlg?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                IP Address checking required?:
                            </label>
                            <div className="col-md-3 input-group">
                                <input
                                    type="checkbox"

                                    name="ipChk"
                                    //   defaultValue={edtVal.ipChk}
                                    checked={formData?.ipChk === "A"}
                                    onChange={handleCheckboxChange}
                                    // value={formData.otpFlg} 
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>

                            <label className="col-md-3 form-label">
                                Dummy User ID:
                            </label>
                            <div className="col-md-3 input-group">
                                <input
                                    type="checkbox"

                                    name="dummyUserId"
                                    //   defaultValue={edtVal.ipChk}
                                    checked={formData?.dummyUserId === "Y"}
                                    onChange={handleCheckboxChange}
                                    // value={formData.otpFlg} 
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                DOB:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    type="date"
                                    className="form-control fc-datepicker"
                                    placeholder="MM/DD/YYYY"
                                    name="dob"
                                    value={formData.dob} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    numberOfMonths={1}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Email Id:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    required
                                    className="form-control"
                                    type="text"
                                    maxLength={100}
                                    name="mailId"
                                    value={formData?.mailId} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Mail Id"
                                    onFocus={() => toggleCharCountVisibility("mailId")}
                                    onBlur={() => toggleCharCountVisibility("mailId")}
                                />
                                {fieldCharCountVisibility.mailId && (
                                    <span className="input-group-text">
                                        {formData?.mailId?.length}/100
                                    </span>
                                )}

                            </div>
                            {!isValid3 && <p className="text-red">Invalid Mail Id</p>}
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Mobile No:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="mobNo"
                                    maxLength={10}
                                    required
                                    value={formData?.mobNo} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Mobile No"
                                    onFocus={() => toggleCharCountVisibility("mobNo")}
                                    onBlur={() => toggleCharCountVisibility("mobNo")}
                                />
                                {fieldCharCountVisibility.mobNo && (
                                    <span className="input-group-text">
                                        {formData?.mobNo?.length}/10
                                    </span>
                                )}
                            </div>
                            {!isValid && <p className="text-red">Invalid Mobile No</p>}
                        </div>
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Address:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    maxLength={200}
                                    name="addr"
                                    value={formData?.addr} onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    placeholder="Address"
                                    onFocus={() => toggleCharCountVisibility("addr")}
                                    onBlur={() => toggleCharCountVisibility("addr")}
                                />
                                {fieldCharCountVisibility.addr && (
                                    <span className="input-group-text">
                                        {formData?.addr?.length}/200
                                    </span>
                                )}

                            </div>
                        </div>
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Designation:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDsgnLov(true)} /></span>}

                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control"
                                        name="dsgnCd"
                                        readOnly
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnCd}
                                        // onChange={(e) => {
                                        //     // Update edtVal.modGrpId when the input changes
                                        //     const newValue = e.target.value;
                                        //     setEdtVal((prevEdtVal) => ({
                                        //         ...prevEdtVal,
                                        //         dsgnCd: newValue,
                                        //         setSelectRow: ''
                                        //     }));
                                        // }}
                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-4"
                                        name="dsgnNm"
                                        readOnly
                                        disabled={mode === 3 || mode === 4}
                                        value={formData.dsgnNm}
                                        // onChange={(e) => {
                                        //     // Update edtVal.modGrpId when the input changes
                                        //     const newValue = e.target.value;
                                        //     setEdtVal((prevEdtVal) => ({
                                        //         ...prevEdtVal,
                                        //         dsgnNm: newValue,
                                        //         setSelectRow: ''
                                        //     }));
                                        // }}
                                    />
                                    <div className="row-mb-12">
                                        {showModelDsgnLov && <Lov
                                            moduleLovData={dsgnLovData}
                                            setShowModel={setShowModelDsgnLov}
                                            showModel={showModelDsgnLov}
                                            handleRowClick={handleRowClickDsgnLov}
                                            columns={dsgnLovColumns}
                                            currentSelection={selectRow}
                                            setCurrentSelection={setSelectRow}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Parent LOV */}
                        <div class="row mb-4 ">

                            <label
                                for="exampleFormControlSelect1"
                                className="col-md-3 col-form-label"
                            >
                                <b>Designation Location:</b>

                            </label>
                            <div className="col-md-9">
                                <div class="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>}
                                    <input type="text" class="form-control "
                                    value={formData.desgLvlRefCd}
                                        //               onChange={(e) => {
                                        //   // Update edtVal.modGrpId when the input changes
                                        //   const newValue = e.target.value;
                                        //   setEdtVal((prevEdtVal) => ({
                                        //     ...prevEdtVal,
                                        //     parMenuId: newValue,
                                        //     // setSelectRowFormRepLov:''
                                        //   }));
                                        // }} 
                                        disabled={mode === 3 || mode === 4} />
                                    <input type="text" class="form-control  mx-4"
                                    value={formData.desgLvlRefNm}
                                        //               onChange={(e) => {
                                        //   // Update edtVal.modGrpId when the input changes
                                        //   const newValue = e.target.value;
                                        //   setEdtVal((prevEdtVal) => ({
                                        //     ...prevEdtVal,
                                        //     text: newValue,
                                        //     // setSelectRowFormRepLov:''
                                        //   }));
                                        // }} 
                                        disabled={mode === 3 || mode === 4} />
                                </div>
                            </div>
                            <div className="row-mb-12">
                                {/* Modal */}
                                {openModal && (
                                    <Modal show={openModal} onHide={handleCloseModal} style={{ zIndex: 9999 }}>
                                        <Modal.Header closeButton>
                                            <Modal.Title><b>Select Location</b></Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <TreeView
                                                id="treeview1"
                                                style={{ height: "auto" }}
                                                showIcon={false}
                                                className="branch"
                                                items={data}
                                                onSelectItem={handleItemClick}
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
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Alert Flag:<span className="text-red">*</span>
                            </label>
                            <div className="col-md-6 col-lg-6">
                                <div className="form-group ">

                                    <div className="custom-controls-stacked">
                                        <label className="custom-control custom-radio">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                name="alertFlg"
                                                defaultValue='Y'
                                                // defaultChecked='true'
                                                checked={formData.alertFlg === 'Y'}
                                                value='Y' onChange={handleStatusChange}
                                                disabled={mode === 3 || mode === 4}
                                            />
                                            <span className="custom-control-label">Yes</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                name="alertFlg"
                                                checked={formData.alertFlg === 'N'}
                                                value='N' onChange={handleStatusChange}
                                                disabled={mode === 3 || mode === 4}
                                            />
                                            <span className="custom-control-label">No</span>
                                        </label>

                                    </div>
                                </div>


                            </div>
                        </div>

                        {(mode === 2 || mode === 3 || mode === 4) && <div className="row mb-4">
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

                        {mode !== 4 && <button disabled={delStatus} type="submit" className='btn btn-primary'>{buttonTitle(mode)}</button>}
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
        </div>
    );
}