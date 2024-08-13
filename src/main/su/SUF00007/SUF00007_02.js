import React, { useState, useEffect, useRef } from "react";

import { Modal, ModalTitle, Card } from "react-bootstrap";
import TreeView from "deni-react-treeview";
import { Tree } from 'antd';
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { modGrpLovColumns, modLovColumns, parLovColumns, formRepLovColumns, refModColumns } from "./columns";
import axios from 'axios';
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const { DirectoryTree } = Tree;

// import { TransferList } from '@mui/lab';

const MenuCreationForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, edtVal, setEdtVal, updateEdtVal, addVal, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp , errExp, set_errExp,}) => {

  console.log(rowData);
  console.log(edtVal);
useEffect(() => {
  if (mode === 1) {
    // Set all properties of edtVal to null
    setEdtVal({
      modGrpId: '',
      modGrpNm: '',
      modNm: '',
      menuTyp: 'F',
      pwaMenu: 'N',
      parMenuId: '',
      parMenuNm: '',
      formRepId: '',
      formRepNm: '',
      orderBy: 0,
      refModId:"",
      actFlg: 'A',
      url:""
    });
    setFormRepLovObj({
        apiId: "SUA00141",
      criteria: {

        modId: "",
        menuTyp:"F"
      }
      }
      )

  }
  console.log(formRepLovObj);
}, [mode])

const msgRef = useRef(null)
const [viewMsg, set_viewMsg] = useState(false)
useEffect(() => {
    if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
    set_viewMsg(false)

}, [viewMsg])

  useEffect(() => {
   
    if (mode === 2) {
      setMenuLovObj({
        apiId: "SUA00241",
        criteria: {
          modId: queryInputObj?.criteria?.modId
        }
      })
      setFormRepLovObj({
        apiId: "SUA00141",
      criteria: {

        modId: queryInputObj?.criteria?.modId,
        menuTyp:edtVal?.menuTyp || "F"
      }
      }
      )
    }
  }, [mode, queryInputObj, edtVal]);

    // Module Group LOV Start..............
    const [modGrpLovData, setModGrpLovData] = useState([]);
    useEffect(() => {
  
      const fetchModGrpLovData = async () => {
        let obj = {
          apiId: 'SUA00139'
        }
        await axios
          .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getAllModGrp", obj, { headers })
          .then((res) => {
            console.log(res.data);
            setModGrpLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
  
          });
      };
      fetchModGrpLovData();
    }, []);
  
  
    const getModGrpNm = (obj) => {
      return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm
    }
  
    const getModGrpId = (obj) => {
      return modGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId
    }
  
    const [selectRow, setSelectRow] = useState("");
    const [selectRowModGrpLov, setSelectRowModGrpLov] = useState("");
    const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
    const handleRowClickModGrpLov = (rowData) => {
      setSelectRow(rowData);
  
      setSelectRowModGrpLov(rowData);
      setSelectRowModLov({})
      handleClear()
      updateEdtVal({
        ...edtVal, modGrpId: getModGrpId(rowData),
        modGrpNm: getModGrpNm(rowData),
        formRepId:"",
        formRepNm:""
      });
     
      
    };
    //Module group Lov ends 
  
    //Mod Lov Starts
  
    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {
  
      const modLovObj = {
        apiId: "SUA00140",
        criteria: {
  
          modGrpId: getModGrpId(selectRow)
  
        }
      }
      console.log(modLovObj)
      const fetchModLovData = async () => {
        await axios
          .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getModMstByModGrp", modLovObj, { headers })
          .then((res) => {
            console.log(res.data);
            setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          });
      };
  
      selectRow && fetchModLovData();
    }, [selectRow]);
  
  
    const getModName = (obj) => {
      return modLovData[Number(Object.keys(obj)[0])]?.modNm
    }
  
    const getModId = (obj) => {
      return modLovData[Number(Object.keys(obj)[0])]?.modId
    }
  
  
    const [selectRowModLov, setSelectRowModLov] = useState({});
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
      setSelectRowModLov(rowData);
      setMenuLovObj({
        apiId: "SUA00241",
        criteria: {
          modId: getModId(rowData)
        }
      })
      setFormRepLovObj({
        apiId: "SUA00141",
        criteria: {
  
        ...formRepLovObj.criteria,
        modId: getModId(rowData),
        // menuTyp: edtVal.menuTyp
        }
      })
      console.log("------>"+formRepLovObj);
      updateEdtVal({
        ...edtVal, modId: getModId(rowData),
        modNm: getModName(rowData),
        formRepId:"",
        formRepNm:""
      });
    };
  
    //Mod Lov Ends
  
  
    // refmod LOV Start..............
    const [refModLovData, setRefModLovData] = useState([]);
    useEffect(() => {
  
      const fetchRefModLovData = async () => {
        let obj = {
          apiId: 'SUA00289'
        }
        await axios
          .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getAllRefMdouleInfo", obj, { headers })
          .then((res) => {
            console.log(res.data);
            setRefModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
  
          });
      };
      fetchRefModLovData();
    }, []);
  
  
    const getRefModNm = (obj) => {
      return refModLovData[Number(Object.keys(obj)[0])]?.modNm
    }
  
    const getRefModId = (obj) => {
      return refModLovData[Number(Object.keys(obj)[0])]?.modId
    }
  
    const [selectRowRefMod, setSelectRowRefMod] = useState("");
    const [selectRowRefModLov, setSelectRowRefModLov] = useState("");
    const [showModelRefModLov, setShowModelRefModLov] = useState(false);
    const handleRowClickRefModLov = (rowData) => {
      setSelectRowRefMod(rowData);
  
      setSelectRowRefModLov(rowData);
      // setSelectRowModLov({})
      handleClear()
      updateEdtVal({
        ...edtVal, refModId: getRefModId(rowData),
        refModNm: getRefModNm(rowData),
        formRepId:"",
        formRepNm:""
      });  
    };
    //refmod Lov end

    //FormRep Lov Starts
  useEffect(() => {
    setFormRepLovObj({
      apiId: "SUA00141",
      criteria: {
        // modId: edtVal?.modId||queryInputObj?.criteria?.modId,
        modId:edtVal.refModId? edtVal.refModId:edtVal.modId,
        menuTyp: edtVal.menuTyp

      }
    })
  }, [edtVal])
  
  const [formRepLovObj, setFormRepLovObj] = useState({
    apiId: "SUA00141",
      criteria: {
        // modId: edtVal?.modId||queryInputObj?.criteria?.modId,
        modId:edtVal.refModId? edtVal.refModId:edtVal.modId,
        menuTyp: "F" 
      }
  })
  const [formRepLovData, setFormRepLovData] = useState([]);
useEffect(() => {
  const fetchFormRepLovData = async () => {
        await axios
          .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getFormReportInfo", formRepLovObj, { headers })
          .then((res) => {
            console.log(res.data);
            setFormRepLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
  
          });
      };
      formRepLovObj && fetchFormRepLovData()
}, [formRepLovObj])




  const getFormRepName = (obj) => {
    return formRepLovData[Number(Object.keys(obj)[0])]?.formNm ? formRepLovData[Number(Object.keys(obj)[0])]?.formNm:""
  }

  const getFormRepId = (obj) => {
    return formRepLovData[Number(Object.keys(obj)[0])]?.formId ?  formRepLovData[Number(Object.keys(obj)[0])]?.formId : ""
  }




  const [selectRowFormRepLov, setSelectRowFormRepLov] = useState({});
  const [showModelFormRepLov, setShowModelFormRepLov] = useState(false);
  const handleRowClickFormRepLov = (rowData) => {
    setSelectRowFormRepLov(rowData);
    updateEdtVal({
      ...edtVal, formRepId: getFormRepId(rowData),
      formRepNm: getFormRepName(rowData)
    });
    console.log(edtVal);
    //   setQueryInputObj({ 


    //         modId: getModId(selectRowModLov)

    // })
  };

  //FormRep Lov Ends


    useEffect(() => {
      //const [selectRowMod, setSelectRowMod] = useState("");
      
      let formId = edtVal?.formRepId||""
      let resIndex = formRepLovData.findIndex(item=> item.formId === formId)
      let currentFormId = {}
      if(resIndex !== -1) currentFormId = {[resIndex]: true}
      setSelectRowFormRepLov(currentFormId)
      //   console.log("9999999", resIndex, currentModId, modLovData, modId);
  
      // let modId = edtVal?.modId||""
      // let resModIndex = modLovData.findIndex(item=> item.modId === modId)
      // let currentModId = {}
      // if(resModIndex !== -1) currentModId = {[resModIndex]: true}
      // setSelectRowModLov(currentModId)
    
      
     
      
      }, [rowData, edtVal, formRepLovData])

  const [formData, setFormData] = useState({
    id: rowData ? rowData.id : '',

    modId: queryInputObj.criteria ? queryInputObj.criteria.modId : '',
    menuId: rowData ? rowData.id : '',
    menuNm: rowData ? rowData.menuNm : '',
    formRepNm: '',
    formRepId: edtVal ? edtVal.formRepId : '',
    parMenuNm: value ? value.id : '',
    parMenuId: value ? value.title : '',
    menuTyp: edtVal ? edtVal.menuTyp : 'F',
    pwaMenu: edtVal ? edtVal.pwaMenu : 'N',
    url: edtVal ? edtVal.pwaMenu :''
  });
  console.log(formData);


  // Get All List
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/getListPageData', queryInputObj, { headers }).then((res) => {
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
      console.log(data);
    })
  }






  //Parent Lov Starts
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

    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00007/getAllMenuByModMst", menuLovObj, { headers })
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

          setDataa(modifiedData);
        }

        else {
          setDataa([])
        }
        setOpenModal(true);
      });
  };

  console.log(dataa)




  const [value, setValue] = useState({
    id: null,
    text: "",

  });

  const onRenderItem = (item, treeview) => {
    console.log(item);
    return (
      <div className="treeview-item-example">
        <span onClick={(e) => handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }

  const handleItemClick = (item) => {
    const menuId = item.id;
    console.log(menuId)
    setValue({
      ...value,
      id: item.menuId,
      text: item.text,

    }) // Assuming `item.text` is the title you want to set
    setOpenModal(false);
    updateEdtVal({
      ...edtVal, parMenuId: item.menuId,
      parMenuNm: item.text
    });


  };


  //ParEnt Lov Ends

  

  const [weight, setWeight] = useState("0");
  const [isValid, setIsValid] = useState(true);

  function handleChange(event) {
    const value = event.target.value;
    setWeight(value);
    const pattern = /^\d+(\.\d{1,2})?$/;
    const isValid = pattern.test(value);
    setIsValid(isValid);
    if (value === '') {
      setIsValid(true);
    }
  }

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    updateEdtVal({ ...edtVal, [event.target.name]: event.target.value })

  };

  const handleSelectChange = (event) => {
  
    setFormData({ ...formData, [event.target.name]: event.target.value })
    // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
    updateEdtVal({ ...edtVal, [event.target.name]: event.target.value })
    setFormRepLovObj({
    apiId: "SUA00141",
      criteria: {
        ...formRepLovObj.criteria,
        [event.target.name]:event.target.value 
      }
  })
    // setFormRepLovObj({
    //   ...formRepLovObj,
    //   menuTyp:event.target.value,
    // })
    if(event.target.name==="menuTyp"){
      console.log("7777777777");
    updateEdtVal({
      ...edtVal, [event.target.name]:event.target.value, formRepId: "",
      formRepNm: ""
    });}
    console.log("yyyy",formData);
    console.log("ttttt",edtVal);
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEdtVal({
      ...edtVal,
      [name]: checked ? "Y" : "N",
    });
  };

  const validateInput = (formData, selectRow) => {
    if ((!formData.modGrpId.trim()) || (formData.modGrpId.trim() === "")) {
      return false;
    }
    // if ((!formData.mod_grp_name.trim()) || (formData.mod_grp_name.trim() === "")) {
    //   return false;
    // }
    // if ((!formData.mod_code.trim()) || (formData.mod_code.trim() === "")) {
    //   return false;
    // }
    // if ((!formData.mod_name.trim()) || (formData.mod_name.trim() === "")) {
    //   return false;
    // }

    // other validations

    return true;
  };
  const resetForm1 = () => {
    setSelectRow("")
setSelectRowModLov("")
setSelectRowFormRepLov("")
setSelectRowRefMod("")
setValue("")
    setFormData({
      id: '',
      modId: '',
      menuId: '',
      menuNm:'',
      url:""
    })
    setEdtVal({
      modGrpId: '',
      modGrpNm: '',
      
      modNm: '',
      menuTyp: 'F',
      pwaMenu: 'N',
      parMenuId: '',
      parMenuNm: '',
      formRepId: '',
      formRepNm: '',
      refModId:"",
      orderBy: 0,
      actFlg: 'A',
url:""
    });
      setFormRepLovObj({
    apiId: "SUA00141",
      criteria: {
        modId:"",
        menuTyp:"F"
      }
  })
  // setMsg("")
  // setMsgTyp("")

  };
  const resetForm = () => {
    setSelectRow("")
setSelectRowModLov("")
setSelectRowFormRepLov("")
setSelectRowRefMod("")
setValue("")
    setFormData({
      id: '',
      modId: '',
      menuId: '',
      menuNm:'',
      url:""
    })
    setEdtVal({
      modGrpId: '',
      modGrpNm: '',
      url:"",
      modNm: '',
      menuTyp: 'F',
      pwaMenu: 'N',
      parMenuId: '',
      parMenuNm: '',
      formRepId: '',
      formRepNm: '',
      refModId:"",
      orderBy: 0,
      actFlg: 'A'
    });
      setFormRepLovObj({
    apiId: "SUA00141",
      criteria: {
        modId:"",
        menuTyp:"F"
      }
  })
  setMsg("")
  setMsgTyp("")

  };






  const [openModal, setOpenModal] = useState(false);

  const handleReset = () => {
    setValue('');

    // setLeftItems(originalLeftItems);
    // setRightItems(originalRightItems);
    // setApproval(false);
  };

  const handleOpenModal = () => {

    fetchTreeLovData();

  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClear = ()=>{
    setValue({
      ...value,
      id: "",
      text: "",
  
    })
    updateEdtVal({
      ...edtVal,
      parMenuId:"",
      parMenuNm:""
    })
    handleCloseModal()
  }


  // Char Counter
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    modNm: false,
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


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(selectRowModGrpLov);
    console.log(formData)
    const addObj = {
      apiId: "SUA00234",
      mst: {
        formRepId: getFormRepId(selectRowFormRepLov) || '',
        menuNm: formData.menuNm || '',
        menuTyp: edtVal.menuTyp || '',
        modId: getModId(selectRowModLov) || '',
        orderBy: parseInt(edtVal.orderBy) || 0,
        parMenuId: value.id || '',
        pwaMenu: formData.pwaMenu || 'N',
        refModId: getRefModId(selectRowRefModLov) || getModId(selectRowModLov),
        url: formData.url || ''
      }
    }



    const editObj = {
      apiId: "SUA00236",
      mst: {
        actFlg: edtVal.actFlg || '',
        formRepId: edtVal.formRepId || '',
        menuId: formData.menuId || '',
        menuNm: formData.menuNm || '',
        menuTyp: edtVal.menuTyp || '',
        modId: formData.modId || '',
        orderBy: parseInt(edtVal.orderBy) || 0,
        parMenuId: edtVal.parMenuId || '',
        pwaMenu: edtVal.pwaMenu || 'N',
        refModId: edtVal.refModId || "",
        url: formData.url || edtVal.url

      }
    }
    

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()
        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm1();
        }

      }).catch(error => {
        console.log("error")
      }).finally(() => {
        set_viewMsg(true)
    });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/saveEdit', editObj, { headers }).then(res => {
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
      set_open(true)
      

  };


  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "SUA00235",
      mst: {
        menuId: formData?.menuId,
        modId: formData.modId
      }
    }
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00007/saveDelete', deleteObj, { headers }).then(res => {
      console.log(res.data)
      if (!res?.data?.appMsgList?.errorStatus) {
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

useEffect(() => {
  const disableMouseWheel = () => {
    const ordr = document.getElementById("ordr");

    // Add event listener for mousewheel
    ordr.addEventListener("mousewheel", function (event) {
      this.blur(); // Blur the input to disable the mouse wheel
    });
  };
 disableMouseWheel();
}, [])




  // Call the function to disable mouse wheel
 





  return (
    <>

      <Card.Body >
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> } 
        <h4 className="card-title">
          Menu Creation  {getFormTitle(mode)}
        </h4>

        <form className="form-horizontal container" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
          {/* Module Group */}
          {(mode === 1) ? <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  required
                  name="modGrpId"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={getModGrpId(selectRow)?getModGrpId(selectRow):''}
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  required
                  name="modGrpNm"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={getModGrpNm(selectRow)?getModGrpNm(selectRow):''}
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
          </div> : <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Module Group:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                {/* {(mode === 1) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>} */}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  name="modGrpId"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={(edtVal) ? (edtVal.modGrpId) : ''}
                  
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={(edtVal) ? (edtVal.modGrpNm) : ''}
                  
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
          </div>}

          {/* Module LOV */}
          {(mode === 1) ? <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control "
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
required
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  required
                  value={getModName(selectRowModLov) ? getModName(selectRowModLov) : ''}
                />
                <div className="row-mb-12">
                  {showModelModLov && <Lov
                    moduleLovData={modLovData}
                    setShowModel={setShowModelModLov}
                    showModel={showModelModLov}
                    handleRowClick={handleRowClickModLov}
                    columns={modLovColumns}
                    currentSelection={selectRowModLov}
                    setCurrentSelection={setSelectRowModLov}
                  />}
                </div>
              </div>
            </div>
          </div> : <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                {/* <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span> */}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control "
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={formData.modId}

                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={edtVal ? edtVal.modNm : ''}
                />
                <div className="row-mb-12">
                  {showModelModLov && <Lov
                    moduleLovData={modLovData}
                    setShowModel={setShowModelModLov}
                    showModel={showModelModLov}
                    handleRowClick={handleRowClickModLov}
                    columns={modLovColumns}
                    currentSelection={selectRowModLov}
                    setCurrentSelection={setSelectRowModLov}
                  />}
                </div>
              </div>
            </div>
          </div>}

            {/* Reference Module */}
            {(mode === 1) ? <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Reference Module:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelRefModLov(true)} /></span>

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  
                  name="refModId"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={getRefModId(selectRowRefMod)?getRefModId(selectRowRefMod):''}
               
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  
                  name="refModNm"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={getRefModNm(selectRowRefMod)?getRefModNm(selectRowRefMod):''}
               
                />
                <div className="row-mb-12">
                  {showModelRefModLov && <Lov
                    moduleLovData={refModLovData}
                    setShowModel={setShowModelRefModLov}
                    showModel={showModelRefModLov}
                    handleRowClick={handleRowClickRefModLov}
                    columns={refModColumns}
                    currentSelection={selectRowRefMod}
                    setCurrentSelection={setSelectRowRefMod}
                  />}
                </div>
              </div>
            </div>
          </div> : <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b>Reference Module:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                {/* {(mode === 1) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>} */}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  name="refModId"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={(edtVal) ? (edtVal.refModId) : ''}
                  
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  name="refModNm"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={(edtVal) ? (edtVal.refModNm) : ''}
                  
                />
                <div className="row-mb-12">
                {showModelRefModLov && <Lov
                    moduleLovData={refModLovData}
                    setShowModel={setShowModelRefModLov}
                    showModel={showModelRefModLov}
                    handleRowClick={handleRowClickRefModLov}
                    columns={refModColumns}
                    currentSelection={selectRowRefMod}
                    setCurrentSelection={setSelectRowRefMod}
                  />}
                </div>
              </div>
            </div>
          </div>}

          {/* Parent LOV */}
          <div class="row mb-4 ">

            <label
              for="exampleFormControlSelect1"
              className="col-md-3 col-form-label"
            >
              <b>Parent Menu:</b>

            </label>
            <div className="col-md-9">
              <div class="input-group">
                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>}
                <input type="text" class="form-control " value={(value ? (value.id) : (edtVal.parMenuId)) || (edtVal.parMenuId)}
                  
                  readOnly disabled={mode === 3 || mode === 4} />
                <input type="text" class="form-control  mx-4" value={(value ? (value.text) : (edtVal.parMenuNm)) || (edtVal.parMenuNm)}
                  
                  readOnly disabled={mode === 3 || mode === 4} />
              </div>
            </div>
            <div className="row-mb-12">
              {/* Modal */}
              {openModal && (
                <Modal scrollable show={openModal} onHide={handleCloseModal} style={{ zIndex: 9999 }}>
                  <Modal.Header closeButton>
                    <Modal.Title><b>Select Parent Menu</b></Modal.Title>
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

          <div className=" row mb-4 ">
            <div className="col-md-3">
              <label className="form-label">
                Menu:<span className="text-red">*</span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                <input
                  className="form-control ui_display_txt_"
                  type="text"
                  name="menuId"
                  required
                  placeholder="Menu Code"
                  disabled={mode === 2 || mode === 3 || mode === 4}
                  value={formData.menuId}
                  onChange={handleInputChange}
                  readOnly
                />
                <div className="input-group col-md-9">
                  <input
                    className="form-control ui_entry_txt_c"
                    type="text"
                    name="menuNm"
                    required
                    disabled={mode === 3 || mode === 4}
                    value={formData.menuNm}
                    onChange={handleInputChange}
                    placeholder="Menu Name"
                    maxLength={100}
                    onFocus={() => toggleCharCountVisibility("menuNm")}
                    onBlur={() => toggleCharCountVisibility("menuNm")}
                  />
                  {fieldCharCountVisibility.menuNm && (
                    <span className="input-group-text">
                      {formData?.menuNm?.length}/50
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
          <div className=" row mb-4 me-2">
            <div className="col-md-3">
              <label className="form-label">
                Menu Type:
              </label>
            </div>
            <div className="col-md-9 input-group">
              <select
                class="form-select-lg col-md-12 mx-2 border rounded-3"
                aria-label="Default select example"
                name="menuTyp"
                required
                // defaultValue="F"
                disabled={mode === 3 || mode === 4}
                value={edtVal? edtVal.menuTyp:""}
                onChange={handleSelectChange}
              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddMenuTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddMenuTyp?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }

              </select>
            </div>
          </div>
          <div className=" row mb-4 me-2">
            <div className="col-md-3">
              <label className="form-label">
                PWA:
              </label>
            </div>

            <div className="col-md-9 input-group">
              <select
                class="form-select-lg col-md-12 mx-2 border rounded-3"
                aria-label="Default select example"
                name="pwaMenu"
                required
                defaultValue=""
                disabled={mode === 3 || mode === 4}
                value={edtVal? edtVal.pwaMenu:"N"}
                onChange={handleSelectChange}
              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddPwaMenu?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddPwaMenu?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }

              </select>
            </div>
          </div>
          {/* FormRep LOV */}
          <div className="row mb-4">
            <label className="col-sm-3 col-form-label"><b>Form/Report Id:</b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelFormRepLov(true)} /></span>}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control "
                  name="formRepId"
                  // required
                  disabled={mode === 3 || mode === 4}
                  value={(edtVal.formRepId)}
                />
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control mx-4"
                  // required
                  disabled={mode === 3 || mode === 4}
                  value={(edtVal.formRepNm)}
                />
                <div className="row-mb-12">
                  {showModelFormRepLov && <Lov
                    moduleLovData={formRepLovData}
                    setShowModel={setShowModelFormRepLov}
                    showModel={showModelFormRepLov}
                    handleRowClick={handleRowClickFormRepLov}
                    columns={formRepLovColumns}
                    currentSelection={selectRowFormRepLov}
                    setCurrentSelection={setSelectRowFormRepLov}
                  />}
                </div>
              </div>
            </div>
          </div>
          <div className=" row mb-4 me-2">
            <div className="col-md-3">
              <label className="form-label">
                Menu Position:
              </label>
            </div>

            <div className="col-md-9 input-group rounded-0">
              <input
                className="form-control ui_entry_int_p"
                id="ordr"
                type="number"
                name="orderBy"
                placeholder="Please enter only numbers"
                maxLength={5}
                value={edtVal ? edtVal.orderBy : ''}
                onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
              />
            </div>
          </div>
          {!isValid && <p className="text-red">Invalid Position</p>}
        { <div className=" row mb-4 me-2">
            <div className="col-md-3">
              <label className="form-label">
                Url:
              </label>
            </div>

            <div className="col-md-9 input-group rounded-0">
              <input
                className="form-control ui_entry_int_p"
                type="text"
                name="url"
                placeholder=""
                
                value={formData.url||edtVal.url}
                onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                maxLength={100}
                    onFocus={() => toggleCharCountVisibility("url")}
                    onBlur={() => toggleCharCountVisibility("url")}
                  />
                  {fieldCharCountVisibility.url && (
                    <span className="input-group-text">
                      {formData?.url?.length}/100
                    </span>
                  )}
            </div>
          </div>}
          {(mode !== 1) && <div className="row mb-4">
            <label className="col-md-3 form-label">
              Status:
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={edtVal.actFlg}
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
            type="button"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
          >
            Reset
          </button>}
        </form>
      </Card.Body>

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

    </>
  );
}

export default MenuCreationForm;