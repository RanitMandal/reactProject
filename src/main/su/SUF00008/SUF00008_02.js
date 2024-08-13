import React, { useState, useEffect, useRef } from "react";
import TreeView from "deni-react-treeview";
// import { Tree } from 'antd';
import { Card, Modal, ModalTitle } from "react-bootstrap";
import reactSelect from "react-select";
import 'react-datepicker/dist/react-datepicker.css';
import { getApiToken } from "../../common/common";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import { Alert } from "react-bootstrap";
import { typeLovColumns, stateLovColumns, distLovColumns, hodLovColumns } from "./columns";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

export const LocationTreeForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setAddVal, errExp, set_errExp }) => {
    const [parLovData, setParLovData] = useState([]);

    const fetchData = async () => {
        let obj = {
            apiId: "SUA00001"
        }

        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/openForm", obj, {
                headers,
            }).then((res) => {
                console.log(res.data);
                setData(res?.data?.content?.qryRsltSet);
                console.log(data);
            })
    }
    const headers = { Authorization: 'Bearer ' + getApiToken() };
    //   console.log(mode);
    console.log(rowData);
    //   console.log(rowId);
    //   console.log(edtVal);
    console.log(edtVal);


    
const msgRef = useRef(null)
const [viewMsg, set_viewMsg] = useState(false)
useEffect(() => {
    if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
    set_viewMsg(false)

}, [viewMsg])

    //Type Lov Starts     

    const [typeLovData, setTypeLovData] = useState([]);
    useEffect(() => {
        //   const modLovObj = {
        //     apiId : "SUA00013",
        //     criteria: {

        //         }

        // }
        const fetchTypeLovData = async () => {
            let obj = {
                apiId: "SUA00124"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/getOrgTypes", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setTypeLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchTypeLovData();
    }, []);


    const getTypeNm = (obj) => {
        return typeLovData[Number(Object.keys(obj)[0])]?.lvlTypNm ? typeLovData[Number(Object.keys(obj)[0])]?.lvlTypNm :''
    }

    const getTypeId = (obj) => {
        return typeLovData[Number(Object.keys(obj)[0])]?.lvlTypCd ? typeLovData[Number(Object.keys(obj)[0])]?.lvlTypCd:""
    }


    const [selectRow, setSelectRow] = useState({});
    const [showModelTypeLov, setShowModelTypeLov] = useState(false);
    const handleRowClickTypeLov = (rowData) => {
        setSelectRow(rowData);
        setFormData({
            ...formData,
            lvlTypCd: getTypeId(rowData),
            lvlTypNm: getTypeNm(rowData)
        })
        updateEdtVal({
            ...edtVal, lvlTypCd: getTypeId(rowData),
            lvlTypNm: getTypeNm(rowData)
        });
        //   setSelectRowUserLov({});
        // setQueryInputObj({


        //     userId: getTypeId(rowData),


        // })
    };
    //Type Lov ends


    // State Lov Starts........
    const [stateLovData, setStateLovData] = useState([]);
    useEffect(() => {

        const fetchStateLovData = async () => {
            let obj = {
                apiId: "SUA00125"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/getAllState", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchStateLovData();
    }, []);


    const getStateNm = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateNm ? stateLovData[Number(Object.keys(obj)[0])]?.stateNm : ""
    }

    const getStateCd = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateCd ? stateLovData[Number(Object.keys(obj)[0])]?.stateCd : ""
    }

    const [selectRowState, setSelectRowState] = useState("");
    const [selectRowStateLov, setSelectRowStateLov] = useState("");
    const [showModelStateLov, setShowModelStateLov] = useState(false);
    const handleRowClickStateLov = (rowData) => {
        console.log(rowData)
        setSelectRowState(rowData);
        setSelectRowStateLov(rowData);
        setFormData({
            ...formData,
            stateCd: getStateCd(rowData),
            stateNm: getStateNm(rowData)
        })
        updateEdtVal({
            ...edtVal, stateCd: getStateCd(rowData),
            stateNm: getStateNm(rowData),
            distCd:"",
            distNm:""
        });
        //   setQueryInputObj({ 

        //         stateCd: getStateCd(rowData),


        // })
    };
    //State Lov ends 

    // Dist Lov Starts........
    const [distLovData, setDistLovData] = useState([]);
    useEffect(() => {
        console.log("---------------",edtVal.stateCd);
        let distLovOvj = {
            apiId: "SUA00126",
            criteria: {
                stateCd: getStateCd(selectRowStateLov) || edtVal?.stateCd
            }
        }
        const fetchDistLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/getDistByState", distLovOvj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDistLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
      (selectRowStateLov || edtVal) &&  fetchDistLovData();
    }, [selectRowStateLov, edtVal]);


    const getDistNm = (obj) => {
        return distLovData[Number(Object.keys(obj)[0])]?.distNm ? distLovData[Number(Object.keys(obj)[0])]?.distNm :""
    }

    const getDistCd = (obj) => {
        return distLovData[Number(Object.keys(obj)[0])]?.distCd ? distLovData[Number(Object.keys(obj)[0])]?.distCd :""
    }

    const [selectRowDist, setSelectRowDist] = useState("");
    const [selectRowDistLov, setSelectRowDistLov] = useState("");
    const [showModelDistLov, setShowModelDistLov] = useState(false);
    const handleRowClickDistLov = (rowData) => {
        console.log(rowData)
        setSelectRowDist(rowData);
        setSelectRowDistLov(rowData);
        setFormData({
            ...formData,
            distCd: getDistCd(rowData),
            distNm: getDistNm(rowData)
        })
        updateEdtVal({
            ...edtVal, distCd: getDistCd(rowData),
            distNm: getDistNm(rowData)
        });
        //   setQueryInputObj({ 

        //         stateCd: getStateCd(rowData),


        // })
    };
    //Dist Lov ends 


    // Hod Lov Starts........
    const [hodLovData, setHodLovData] = useState([]);
    useEffect(() => {

        const fetchHodLovData = async () => {
            let obj = {
                apiId: "SUA00237"
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/getAllDesignation", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setHodLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchHodLovData();
    }, []);


    const getHodNm = (obj) => {
        return hodLovData[Number(Object.keys(obj)[0])]?.dsgnNm ? hodLovData[Number(Object.keys(obj)[0])]?.dsgnNm : ""
    }

    const getHodCd = (obj) => {
        return hodLovData[Number(Object.keys(obj)[0])]?.dsgnCd ? hodLovData[Number(Object.keys(obj)[0])]?.dsgnCd : ""
    }

    const [selectRowHod, setSelectRowHod] = useState("");
    const [selectRowHodLov, setSelectRowHodLov] = useState("");
    const [showModelHodLov, setShowModelHodLov] = useState(false);
    const handleRowClickHodLov = (rowData) => {
        console.log(rowData)
        setFormData({
            ...formData,
            hodDsgnRefNo: getHodCd(rowData),
            hodDsgnNm: getHodNm(rowData)
        })
        updateEdtVal({
            ...edtVal, hodDsgnRefNo: getHodCd(rowData),
            hodDsgnNm: getHodNm(rowData)
        });
        setSelectRowHod(rowData);
        setSelectRowHodLov(rowData);


        console.log(formData);
        //   setQueryInputObj({ 

        //         stateCd: getStateCd(rowData),


        // })
    };
    //HOD Lov ends 

    useEffect(() => {
        //const [selectRowMod, setSelectRowMod] = useState("");
        
        let typeId = edtVal?.lvlTypCd||""
        let resIndex = typeLovData.findIndex(item=> item.lvlTypCd === typeId)
        let currentTypeId = {}
        if(resIndex !== -1) currentTypeId = {[resIndex]: true}
        setSelectRow(currentTypeId)
        //   console.log("9999999", resIndex, currentModId, modLovData, modId);
    
        let stateId = edtVal?.stateCd||""
        let resStateIndex = stateLovData.findIndex(item=> item.stateCd === stateId)
        let currentStateId = {}
        if(resStateIndex !== -1) currentStateId = {[resStateIndex]: true}
        setSelectRowState(currentStateId)

        let distId = edtVal?.distCd||""
        let resDistIndex = distLovData.findIndex(item=> item.distCd === distId)
        let currentDistId = {}
        if(resDistIndex !== -1) currentDistId = {[resDistIndex]: true}
        setSelectRowDist(currentDistId)

        let hodId = edtVal?.dsgnNm||""
        let resHodIndex = hodLovData.findIndex(item=> item.dsgnNm === hodId)
        let currentHodId = {}
        if(resHodIndex !== -1) currentHodId = {[resHodIndex]: true}
        setSelectRowHod(currentHodId)
      
        
       
        
        }, [rowData, edtVal, typeLovData, stateLovData, distLovData, hodLovData])
    
    const [formData, setFormData] = useState({
        lvlNm: rowData ? rowData.lvlNm : '',
        parLvlRefCd: rowData ? rowData.parLvlRefCd : '',
        mapUrl: rowData ? rowData.mapUrl : '',
        lvlRefCd: edtVal ? edtVal.lvlRefCd : "",
        lvlTypCd: edtVal ? edtVal.lvlTypCd : "",
        lvlTypNm: edtVal ? edtVal.lvlTypNm : "",

        parLvlRefNm: edtVal ? edtVal.parLvlRefNm : "",
        orderBy: edtVal ? edtVal.orderBy : 0,
        addr: edtVal ? edtVal.addr : "",
        stateCd: edtVal ? edtVal.stateCd : "",
        stateNm: edtVal ? edtVal.stateNm : "",
        distCd: edtVal ? edtVal.distCd : "",
        distNm: edtVal ? edtVal.distNm : "",
        pinNo: edtVal ? edtVal.phNo : "",
        phNo: edtVal ? edtVal.pinNo : "",
        faxNo: edtVal ? edtVal.faxNo : "",
        emailId: edtVal ? edtVal.emailId : "",
        hodDsgnRefNo: edtVal ? edtVal.hodDsgnRefNo : '',
        hodDsgnNm: edtVal ? edtVal.hodDsgnNm : "",
        designation: edtVal ? edtVal.designation : "",
        longValDegree: edtVal ? edtVal.longValDegree : 0,
        longTyp: edtVal ? edtVal.longTyp : "E",
        latValDegree: edtVal ? edtVal.latValDegree : 0,
        latTyp: edtVal ? edtVal.latTyp : 'N',
        mstActFlg: edtVal ? edtVal.mstActFlg : "A",
        dtlActFlg: edtVal ? edtVal.dtlAactFlg : "A",
        // actFlg: rowData?rowData.actFlg: 'A',
    });

    useEffect(() => {
        if (mode === 1) {
            // Set all properties of edtVal to null
            setEdtVal({
                "lvlRefCd": "",
                "lvlNm": "",
                "lvlTypCd": "",
                "lvlTypNm": "",
                "parLvlRefCd": "",
                "parLvlRefNm": "",
                "orderBy": 0,
                "addr": "",
                "stateCd": "",
                "stateNm": "",
                "distCd": "",
                "distNm": "",
                "pinNo": "",
                "phNo": "",
                "faxNo": "",
                "emailId": "",
                "hodDsgnRefNo": "",
                "hodDsgnNm": "",
                "designation": "",
                "longValDegree": 0,
                "longTyp": "E",
                "latValDegree": 0,
                "latTyp": "N",
                "mstActFlg": "A",
                "dtlAactFlg": "A",
            });
            setFormData({});
        }

    }, [mode]);




    const handleInputChange = (event) => {
        const {name, value}=event.target
        if((name === "pinNo" || name === "phNo" || name === "faxNo") && isNaN(value)){
            console.error(`Please enter only numeric values for ${name}.`);
        }else{
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setCharCount({ ...charCount, [event.target.name]: true });
        setEdtVal({...edtVal, [event.target.name]: event.target.value })
        }
        
    };



    const handleStatusChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setEdtVal({...edtVal, dtlActFlg: event.target.value })
        console.log(event.target.name, event.target.value);
        // setEdtVal({
        //     ...edtVal,
        //     [event.target.name]: event.target.value
        // })
        // setAddVal({...addVal, [event.target.name]: event.target.value})
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
        setValue("")
setSelectRow('')
setSelectRowState("")
setSelectRowDist("")
setSelectRowHod("")
setEdtVal({
    lvlRefCd: "",
    parLvlRefCd:"",
    lvlTypCd: "",
    lvlTypNm: "",
    lvlNm:"",
    mapUrl:"",
    parLvlRefNm: "",
    orderBy: 0,
    addr: "",
    stateCd: "",
    stateNm: "",
    distCd: "",
    distNm: "",
    pinNo: "",
    phNo: "",
    faxNo: "",
    emailId: "",
    hodDsgnRefNo: "",
    hodDsgnNm: "",
    designation: "",
    longValDegree: 0,
    longTyp: "E",
    latValDegree: 0,
    latTyp: "N",
    mstActFlg: "A",
    dtlAactFlg: "A",
});
setFormData({
    parLvlRefCd: "",
    lvlNm: "",
    addr:"",
    mapUrl:""

});

    };

    const [charCount, setCharCount] = useState({

        modGrpNm: false
    })

    const handleCharCount = (event) => {

        setCharCount({ ...charCount, [event.target.name]: false });
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
console.log(mode);

        const addObj ={
            apiId: "SUA00004",
            mst:{
            addr: formData.addr||edtVal.addr||"",
            distCd: formData.distCd||edtVal.distCd||"",
            emailId: formData.emailId||edtVal.emailId||"",
            faxNo: formData.faxNo||edtVal.faxNo||"",
            hodDsgnRefNo: formData.hodDsgnRefNo||edtVal.hodDsgnRefNo||"",
            latTyp: formData.latTyp||edtVal.latTyp||"",
            latValDegree: parseInt(formData.latValDegree||edtVal.latValDegree||0),
            longTyp: formData.longTyp||edtVal.longTyp||"",
            longValDegree: parseInt(formData.longValDegree||edtVal.longValDegree||0),
            lvlNm: formData.lvlNm||edtVal.lvlNm||"",
            lvlTypCd: formData.lvlTypCd||edtVal.lvlTypCd||"",
            mapUrl: formData.mapUrl||edtVal.mapUrl||"",
            orderBy: parseInt(formData.orderBy||edtVal.orderBy||0),
            parLvlRefCd: value.id||edtVal.parLvlRefCd||"",
            phNo: formData.phNo||edtVal.phNo||"",
            pinNo: formData.pinNo||edtVal.pinNo||"",
            stateCd: formData.stateCd||edtVal.stateCd||""
        }
    }


        const editObj ={
            apiId: "SUA00007",
            mst: {
            addr: formData.addr||edtVal.addr||"",
            distCd: formData.distCd || edtVal.distCd||"",
            dtlActFlg: formData.dtlActFlg || edtVal.dtlAactFlg||"",
            emailId: formData.emailId || edtVal.emailId||"",
            faxNo: formData.faxNo || edtVal.faxNo||"",
            hodDsgnRefNo: formData.hodDsgnRefNo || edtVal.hodDsgnRefNo||"",
            latTyp: formData.latTyp || edtVal.latTyp||"",
            latValDegree: parseInt(formData.latValDegree || edtVal.latValDegree || 0),
            longTyp: formData.longTyp || edtVal.longTyp||"",
            longValDegree: parseInt(formData.longValDegree || edtVal.longValDegree || 0),
            lvlNm: formData.lvlNm || edtVal.lvlNm||"",
            lvlRefCd: formData.lvlRefCd || edtVal.lvlRefCd||"",
            lvlTypCd: formData.lvlTypCd || edtVal.lvlTypCd||"",
            mstActFlg: formData.mstActFlg || edtVal.mstActFlg||"",
            orderBy: parseInt(formData.orderBy || edtVal.orderBy||0),
            parLvlRefCd: formData.parLvlRefCd || edtVal.parLvlRefCd||"",
            phNo: formData.phNo || edtVal.phNo||"",
            pinNo: formData.pinNo || edtVal.pinNo||"",
            stateCd: formData.stateCd || edtVal.stateCd||""
        }
    }
        

        if (mode === 1) {
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00008/saveAdd', addObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    fetchData()
                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                set_errExp({status:res.data?.appMsgList?.errorStatus})
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm();
                }

            }).catch(error => {
                console.log("error")
            }).finally(() => {
                set_viewMsg(true)
            });
        }


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00008/saveEdit', editObj, { headers }).then(res => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    //TRUE OPERATION
                    fetchData()

                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                set_errExp({status:res.data?.appMsgList?.errorStatus})
            }).catch(error => {
                console.log("error")
            }).finally(() => {
                set_viewMsg(true)
            });


        if (mode === 3)
            set_openDel(true)
               

    };



    
  const [openDel, set_openDel] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {
    const deleteObj = {
        apiId: "SUA00009",
        mst:{

        lvlRefCd: rowData?.id? rowData?.id:''

    }
}
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00008/saveDelete', deleteObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
            fetchData()

        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
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

    // AllLocation Lov(Tree)------------------------------------------
    const fetchTreeLovData = async () => {
        let obj = {
            apiId: "SUA00238"
        }

        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00008/getAllLocations", obj, { headers })
            .then((res) => {
                console.log(res.data);
                if (res.data?.content?.qryRsltSet?.length) {

                    const modifyData = (items) => {
                        return items.map((item) => {
                          const newItem = {
                            ...item,
                            lvlNm: item.text,
                            lvlRefCd: item.id,
                            parLvlRefCd: item.parentId,
                          };
                          if (item.children) {
                            newItem.children = modifyData(item.children);
                          }
                          return newItem;
                        });
                      };
              
                      const modifiedData = modifyData(res.data.content.qryRsltSet);
              
                      setParLovData(modifiedData);
                }
                setOpenModal(true);
            });
    };

    console.log(parLovData)
    const [treeview1, setTreeview1] = useState([])
    // const idMapping = parLovData.reduce((acc, el, i) => {
    //     acc[el.lvlRefCd] = i;
    //     return acc;
    // }, []);

    // //  let treeview1=[];

    // useEffect(() => {

    //     parLovData.forEach((el) => {
    //         // Handle the root element
    //         if (el.parLvlRefCd === null) {
    //             setTreeview1([...treeview1, el]);
    //             return;
    //         }
    //         // Use our mapping to locate the parent element in our data array
    //         const parentEl = parLovData[idMapping[el.parLvlRefCd]];
    //         // Add our current el to its parent's `children` array
    //         parentEl.children = [...(parentEl.children || []), el];
    //     });
    // }, [parLovData])

    const [qryObj, setQryObj] = useState({
        lvlRefCd: ""
    })
    const [value, setValue] = useState({
        id: null,
        text: "",

    });
    const [title, setTitle] = useState({});
    console.log(treeview1);
    const onRenderItem = (item, treeview) => {
        console.log(item);
        return (
          <div className="treeview-item-example">
            
            {/* <span className="actionButton edit" onClick={() => setCreateModalOpen({
                    open: true,
                    mode: 2,
                    rowData:item
                  })}><Edit color="success" size="15" /></span>&nbsp;&nbsp;
                  <span className="actionButton view" onClick={() => setCreateModalOpen({
                    open: true,
                    mode: 4,
                    rowData:item
                  })}>
            <Visibility color="warning" size="15" />
          </span>&nbsp;&nbsp;
            <span className="actionButton trash" onClick={() => setCreateModalOpen({
                    open: true,
                    mode: 3,
                    rowData:item
                  })}><Delete color="error" size="15" /></span> */}
         
                   &nbsp;&nbsp;
          <span onClick={(e)=>handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
          </div>
        )
      }
    

    const handleItemClick = (item) => {

        const lvlRefCd = item?.id;
        console.log(lvlRefCd)
        setValue({
            ...item,
            id: item.id,
            text: item.text,

        }) // Assuming `item.text` is the title you want to set
        setOpenModal(false);

        setQryObj({
            lvlRefCd: lvlRefCd
        })

    };
    console.log(qryObj);




    const [openModal, setOpenModal] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState(data);
    const [filteredData, setFilteredData] = useState([]);

    const handleOpenModal = () => {
        fetchTreeLovData();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };  const handleClear = ()=>{
        setValue({
          ...value,
          id: "",
          text: "",
      
        })
        updateEdtVal({
          ...edtVal,
          parLvlRefCd:"",
          parLvlRefNm:""
        })
        handleCloseModal()
      }

    useEffect(() => {
        // Reset the table data when the modal is closed
        if (!open) {
            setTableData(data);
            setFilteredData(data);
            setSearchText('');
        }
    }, [open]);
    const [weight, setWeight] = useState("0.00");


     // Char Counter
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    lvlNm: false,
    addr: false,
    phNo: false,
    faxNo:false
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
        <div>

            <Card.Body>
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> } 
                <h4 className="card-title">
                    Loaction Tree  {getFormTitle(mode)}
                </h4>


                <div className="row ">
                    <form onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
                        <h4 className="card-title">
                            LOCATION TREE INFO
                        </h4>
                        <div class="row mb-4">

                            <label
                                for="exampleFormControlSelect1"
                                className="col-md-3 col-form-label"
                            >
                                <b>Parent Node:</b>

                            </label>
                            <div className="col-md-9">
                                <div class="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>}
                                    <input type="text" class="form-control col-md-3 " name="parLvlRefCd" onChange={handleInputChange} disabled={mode === 3 || mode === 4} value={(value ? (value.id) : (edtVal.parLvlRefCd)) || (edtVal.parLvlRefCd)} readOnly />
                                    <input type="text" class="form-control  mx-2 rounded-3" name="parLvlRefNm" onChange={handleInputChange} disabled={mode === 3 || mode === 4} value={(value ? (value.text) : (edtVal.parLvlRefNm)) || (edtVal.parLvlRefNm)} readOnly />
                                </div>
                            </div>
                            <div className="row-mb-12">
                                {/* Modal */}
                                {openModal && (
                                    <Modal scrollable show={openModal} onHide={handleCloseModal} style={{ zIndex: 9999 }}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Select</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <TreeView
                                                id="treeview1"
                                                style={{ height: "auto" }}
                                                showIcon={false}
                                                className="branch"
                                                items={parLovData}
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
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>Type: <span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelTypeLov(true)} /></span>}

                                    <input
                                        type="number"
                                        autoComplete={false}
                                        className="form-control col-md-3"
                                        // onChange={handleInputChange}
                                        value={(formData.lvlTypCd) || edtVal.lvlTypCd}
                                        disabled={mode === 3 || mode === 4}
                                        required
                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-2"
                                        name="lvlTypNm"
                                        // onChange={handleInputChange}
                                        value={(formData.lvlTypNm) || edtVal.lvlTypNm}
                                        disabled={mode === 3 || mode === 4}
                                        required
                                    />
                                    <div className="row-mb-12">
                                        {showModelTypeLov && <Lov
                                            moduleLovData={typeLovData}
                                            setShowModel={setShowModelTypeLov}
                                            showModel={showModelTypeLov}
                                            handleRowClick={handleRowClickTypeLov}
                                            columns={typeLovColumns}
                                            currentSelection={selectRow}
                                            setCurrentSelection={setSelectRow}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Node<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    <input type="number" name="lvlRefCd" className="form-control col-md-3" value={(formData.lvlRefCd) || edtVal.lvlRefCd} disabled={mode === 3 || mode === 4} readOnly onChange={handleInputChange} />
                                    <input type="text" name="lvlNm" value={(formData.lvlNm) || edtVal.lvlNm} onChange={handleInputChange} disabled={mode === 3 || mode === 4}
                                        className="form-control ms-2"
                                        maxLength={100}
                                        required
                    onFocus={() => toggleCharCountVisibility("lvlNm")}
                    onBlur={() => toggleCharCountVisibility("lvlNm")}
                  />
                  {fieldCharCountVisibility.lvlNm && (
                    <span className="input-group-text">
                      {edtVal?.lvlNm?.length}/100
                    </span>
                  )}
                                    {/* {showCharacterCount && (
                    <span className="input-group-text">{formData.desc.length}/50</span>
                  )} */}
                                    {/* <span className="input-group-text">{inputValue.length}/100</span> */}
                                </div>
                            </div>
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Order By
                            </label>
                            <div className="col-sm-9 input-group">
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Order By"
                                    maxLength={5}
                                    name="orderBy"
                                    value={(formData.orderBy) || edtVal.orderBy}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>
                        {(mode === 2) && <div className="row mb-4">
                            <label className="col-md-3">
                                Status:
                            </label>
                            <select
                                className="form-select col-md-9"
                                name="mstActFlg"
                                value={(formData.mstActFlg) || edtVal.mstActFlg}
                                onChange={handleStatusChange}
                                disabled={mode === 3 || mode === 4}
                                placeholder="Select"
                            >
                                <option disabled>--Select--</option>
                                <option value="A">Active</option>
                                <option value="I">Inactive</option>


                            </select>

                        </div>}
                        <h4 className="card-title">
                            LOCATION TREE OTHER INFO
                        </h4>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Address<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <textarea
                                    required
                                    className="form-control"
                                    name="addr"
                                    maxLength={200}
                                    value={ edtVal.addr || (formData.addr)}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                    onFocus={() => toggleCharCountVisibility("addr")}
                    onBlur={() => toggleCharCountVisibility("addr")}
                  />
                  {fieldCharCountVisibility.addr && (
                    <span className="input-group-text">
                      {edtVal?.addr?.length}/200
                    </span>
                  )}
                                {/* {inputValue && (
                    <span className="input-group-text">{formData.desc.length}/50</span>
                  )} */}


                            </div>

                        </div>
                        {/* State Lov */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>State:<span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>}

                                    <input
                                        type="number"
                                        autoComplete={false}
                                        className="form-control"
                                        value={(formData.stateCd) || edtVal.stateCd}
                                        name="stateCd"
                                        onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                        required
                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-2"
                                        value={(formData.stateNm) || edtVal.stateNm}
                                        name="stateNm"
                                        onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                        required
                                    />
                                    <div className="row-mb-12">
                                        {showModelStateLov && <Lov
                                            moduleLovData={stateLovData}
                                            setShowModel={setShowModelStateLov}
                                            showModel={showModelStateLov}
                                            handleRowClick={handleRowClickStateLov}
                                            columns={stateLovColumns}
                                            currentSelection={selectRowState}
                                            setCurrentSelection={setSelectRowState}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dist Lov */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>District:</b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 2 || mode === 1) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDistLov(true)} /></span>}

                                    <input
                                        type="number"
                                        autoComplete={false}
                                        className="form-control"
                                        value={(formData.distCd) || edtVal.distCd}
                                        onChange={handleInputChange}
                                        name="distCd"
                                        disabled={mode === 3 || mode === 4}

                                    />
                                    <input
                                        type="text"
                                        autoComplete={false}
                                        className="form-control mx-2"
                                        value={(formData.distNm) || edtVal.distNm}
                                        name="distNm"
                                        onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                    />
                                    <div className="row-mb-12">
                                        {showModelDistLov && <Lov
                                            moduleLovData={distLovData}
                                            setShowModel={setShowModelDistLov}
                                            showModel={showModelDistLov}
                                            handleRowClick={handleRowClickDistLov}
                                            columns={distLovColumns}
                                            currentSelection={selectRowDist}
                                            setCurrentSelection={setSelectRowDist}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pin */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Pin No:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="pinNo"
                                    maxLength={6}
                                    value={(formData.pinNo) || edtVal.pinNo}
                                    onChange={handleInputChange}
                                    placeholder="Pin No"
                                    disabled={mode === 3 || mode === 4}
                                    onFocus={() => toggleCharCountVisibility("pinNo")}
                    onBlur={() => toggleCharCountVisibility("pinNo")}
                  />
                  {fieldCharCountVisibility.pinNo && (
                    <span className="input-group-text">
                      {edtVal?.pinNo?.length}/6
                    </span>
                  )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Phone No:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="phNo"
                                    maxLength={10}
                                    value={(formData.phNo) || edtVal.phNo}
                                    onChange={handleInputChange}
                                    placeholder="Phone No"
                                    disabled={mode === 3 || mode === 4}
                                    onFocus={() => toggleCharCountVisibility("phNo")}
                    onBlur={() => toggleCharCountVisibility("phNo")}
                  />
                  {fieldCharCountVisibility.phNo && (
                    <span className="input-group-text">
                      {edtVal?.phNo?.length}/10
                    </span>
                  )}

                            </div>

                        </div>

                        {/* Fax No */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Fax No:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="faxNo"
                                    maxLength={15}
                                    value={(formData.faxNo) || edtVal.faxNo}
                                    onChange={handleInputChange}
                                    placeholder="Fax No"
                                    disabled={mode === 3 || mode === 4}
                                    onFocus={() => toggleCharCountVisibility("faxNo")}
                    onBlur={() => toggleCharCountVisibility("faxNo")}
                  />
                  {fieldCharCountVisibility.faxNo && (
                    <span className="input-group-text">
                      {edtVal?.faxNo?.length}/15
                    </span>
                  )}

                            </div>

                        </div>

                        {/* Email */}
                        <div className="row mb-4">
                            <label className="col-md-3 form-label">
                                Email:
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="emailId"
                                    value={(formData.emailId) || edtVal.emailId}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    disabled={mode === 3 || mode === 4}
                                    maxLength={100}
                                    onFocus={() => toggleCharCountVisibility("emailId")}
                    onBlur={() => toggleCharCountVisibility("emailId")}
                  />
                  {fieldCharCountVisibility.emailId && (
                    <span className="input-group-text">
                      {edtVal?.emailId?.length}/100
                    </span>
                  )}
                            </div>

                        </div>

                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Latitude:
                            </label>
                            <div className="col-sm-3 input-group">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="latValDegree"
                                    value={(formData.latValDegree) || edtVal.latValDegree}
                                    placeholder="Latitude"
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                            <label className="col-md-3 form-label">
                                Direction:
                            </label>
                            <div className="col-sm-3 input-group">
                                <select required
                                    class="from-group rounded-3 border"
                                    aria-label="Default select example"
                                    value={(formData.latTyp) || edtVal.latTyp}
                                    name="latTyp"
                                    // option={edtVal.ddLatTyp}
                                    onChange={handleStatusChange}
                                    disabled={mode === 3 || mode === 4}
                                >
                                    <option disabled >--Select--</option>

                                    {(mode === 1) ?
                                        (addVal?.ddNorthTyp?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        ))) : (edtVal?.ddLatTyp?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }

                                </select>
                            </div>
                            {/* {!isValid4 && <p className="text-red text-center">Invalid Latitude</p>} */}
                        </div>
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Longitude:
                            </label>
                            <div className="col-sm-3 input-group">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="longValDegree"
                                    value={(formData.longValDegree) || edtVal.longValDegree}
                                    placeholder="Longitude"
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                            <label className="col-md-3 form-label">
                                Direction:
                            </label>
                            <div className="col-sm-3 input-group">
                                <select required
                                    class="from-group rounded-3 border"
                                    aria-label="Default select example"
                                    value={(formData.longTyp) || edtVal.longTyp}
                                    name="longTyp"
                                    onChange={handleStatusChange}
                                    disabled={mode === 3 || mode === 4}
                                >
                                    <option disabled>--Select--</option>

                                    {(mode === 1) ? (addVal?.ddEastTyp?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) :
                                        (edtVal?.ddLongTyp?.map((item) => (
                                            <option value={item.value}>{item.label}</option>
                                        )))
                                    }
                                </select>
                            </div>
                            {/* {!isValid5 && <p className="text-red text-center">Invalid Longitude</p>} */}
                        </div>

                        {/* HOD Lov */}
                        <div className="row mb-4 ">
                            <label className="col-sm-3 col-form-label"><b>HOD:<span className="text-red">*</span></b></label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelHodLov(true)} /></span>}

                                    <input
                                        type="number"
                                        // autoComplete={false}
                                        className="form-control"
                                        name="hodDsgnRefNo"
                                        value={(formData.hodDsgnRefNo) || edtVal.hodDsgnRefNo}
                                        onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}
                                    />
                                    <input
                                        type="text"
                                        // autoComplete={false}
                                        className="form-control mx-2"
                                        name="hodDsgnNm"
                                        value={(formData.hodDsgnNm) || edtVal.hodDsgnNm}
                                        onChange={handleInputChange}
                                        disabled={mode === 3 || mode === 4}

                                    />
                                    <div className="row-mb-12">
                                        {showModelHodLov && <Lov
                                            moduleLovData={hodLovData}
                                            setShowModel={setShowModelHodLov}
                                            showModel={showModelHodLov}
                                            handleRowClick={handleRowClickHodLov}
                                            columns={hodLovColumns}
                                            currentSelection={selectRowHod}
                                            setCurrentSelection={setSelectRowHod}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Designation */}
                        <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Designation
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    readOnly
                                    className="form-control"
                                    type="text"
                                    placeholder="Designation"
                                />
                            </div>
                        </div>

                        {/* Map URl */}
                       {(mode===1)&& <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Map Url<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    name="mapUrl"
                                    className="form-control"
                                    type="text"
                                    required
                                    placeholder="Map URL"
                                    value={(formData.mapUrl) || edtVal.mapUrl}
                                    onChange={handleInputChange}
                                    disabled={mode === 3 || mode === 4}
                                />
                            </div>
                        </div>}
                        {(mode === 2) && <div className="row mb-4">
                            <label className="col-md-3">
                                Status:
                            </label>
                            <select
                                className="form-select col-md-9"
                                name="dtlActFlg"
                                //defaultValue={edtVal.dtlActFlg}
                                onChange={handleStatusChange}
                                value={(formData.dtlActFlg) || edtVal.dtlAactFlg}
                                placeholder="Select"
                                disabled={mode === 3 || mode === 4}
                            >
                                <option>--Select--</option>

                                {
                                    edtVal?.ddActFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))
                                }

                            </select>

                        </div>}

                        {mode !== 4 && <button type="submit"  className='btn btn-primary'>{buttonTitle(mode)}</button>}
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

            </Card.Body>

            <ConfirmDialog
  title="Confirmation" 
  open={openDel} 
  setOpen={set_openDel} 
  onConfirm={handleConfirmation} 
  setConfirmStatus={setConfirmStatus}
  confirmStatus={confirmStatus}
>
  Are you sure you want to delete this record? 
</ConfirmDialog>
        </div>
    );
}