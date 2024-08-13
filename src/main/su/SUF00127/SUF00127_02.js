import React, { useRef, useEffect, useState } from "react";

import { moduleLovColumns, tempModLovColumns, tempMenuLovColumns } from "./columns";
import Lov from "../../common/Lov _new";
import axios from "axios";
import { getApiToken } from "../../common/common";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };

const FormM = ({
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
  index,
  editVal,
  setEditVal,
  addVal,
  setAddVal,
  updateEditVal,
  queryInputObj,
  setQueryInputObj,
  msg,
  setMsg,
  msgTyp,
  setMsgTyp, errExp, set_errExp,
}) => {


  console.log(queryInputObj);
  console.log(editVal);



  const fetchData = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/getListPageData",
        queryInputObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data?.content?.qryRsltSet);

        console.log(data);
      });
  };



  //Module  Lov Starts
  const [moduleLovData, setModuleLovData] = useState([]);
  let getAllModMst_obj = {
    apiId: "SUA00407",
  }
  useEffect(() => {

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/getAllModMst", getAllModMst_obj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };
    fetchModuleLovData();
  }, []);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm : "";
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId : "";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    //setSelectRowModuleLov({});
    setFormData({
      ...formData,
      modId: getModuleId(rowData),
      modNm: getModuleName(rowData),
    });

  };
  //Module Lov ends


  //TempMod Lov Starts
  const [tempModLovData, setTempModLovData] = useState([]);
  let obj = {
    apiId: "SUA00240",
  }
  useEffect(() => {

    const fetchTempModLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/getAllTemplateModules", obj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data?.content?.qryRsltSet?.length) {
            const modM0007 = res.data.content.qryRsltSet.find(
              (item) => item.modId === "M0007"
            );
            if (modM0007) {
              const { modId, modNm } = modM0007;
              setTempModLovData([{ modId: modId, modNm: modNm }]);
            }
          }

          console.log(tempModLovData);
          //  setTempModLovData(
          //    res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          //  );
        });
    };
    fetchTempModLovData();
  }, []);

  const getTempModName = (obj) => {
    return tempModLovData[Number(Object.keys(obj)[0])]?.modNm ? tempModLovData[Number(Object.keys(obj)[0])]?.modNm : "";
  };

  const getTempModId = (obj) => {
    return tempModLovData[Number(Object.keys(obj)[0])]?.modId ? tempModLovData[Number(Object.keys(obj)[0])]?.modId : "";
  };

  const [selectRowTempMod, setSelectRowTempMod] = useState("");
  const [showModelTempMod, setShowModelTempMod] = useState(false);
  const handleRowClickTempMod = (rowData) => {
    setSelectRowTempMod(rowData);
    setSelectRow({});
    setSelectRowTempMenu({})
    setTempMenuLovData({})
    setFormData({
      ...formData,
      refModId: getTempModId(rowData),
      refModNm: getTempModName(rowData),
      menuId: "",
      menuNm: "",
      formRepId: "",
      modId: "",
      modNm: ""
    });

  };
  //TempMod Lov ends

  //TempMenu Lov Starts
  const [tempMenuLovData, setTempMenuLovData] = useState([]);

  useEffect(() => {
    let obj = {
      apiId: "SUA00240",
      criteria: {
        modId: getTempModId(selectRowTempMod)
        // modId: "M0007"
      }
    }
    const fetchTempMenuLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/getAllMenuWithFormInfo", obj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setTempMenuLovData(
            res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
          );
        });
    };
    fetchTempMenuLovData();
  }, [selectRowTempMod]);

  const getTempMenuName = (obj) => {
    return tempMenuLovData[Number(Object.keys(obj)[0])]?.menuNm ? tempMenuLovData[Number(Object.keys(obj)[0])]?.menuNm : "";
  };

  const getTempMenuId = (obj) => {
    return tempMenuLovData[Number(Object.keys(obj)[0])]?.menuId ? tempMenuLovData[Number(Object.keys(obj)[0])]?.menuId : "";
  };
  const getTempFormRepName = (obj) => {
    return tempMenuLovData[Number(Object.keys(obj)[0])]?.formRepNm ? tempMenuLovData[Number(Object.keys(obj)[0])]?.formRepNm : "";
  };

  const getTempFormRepId = (obj) => {
    return tempMenuLovData[Number(Object.keys(obj)[0])]?.formRepId ? tempMenuLovData[Number(Object.keys(obj)[0])]?.formRepId : "";
  };

  const [selectRowTempMenu, setSelectRowTempMenu] = useState("");
  const [showModelTempMenu, setShowModelTempMenu] = useState(false);
  const handleRowClickTempMenu = (rowData) => {
    setSelectRowTempMenu(rowData);
    //setSelectRowModuleLov({});
    setFormData({
      ...formData,
      tempMenuId: getTempMenuId(rowData),
      tempMenuNm: getTempMenuName(rowData),
      // refModId: getTempRefModIdName(rowData),
      formRepId: getTempFormRepId(rowData)
    });

  };
  //TempMenu Lov ends



  console.log(mode);
  console.log(rowData);
  console.log(rowId);

  const [formData, setFormData] = useState({
    modId: "",
    modNm: "",
    tmpFormId: "",
    formNm: "",
    formDesc: "",
    tempCd: "",
    tempNm: "",
    loginFlg: "N",
    listFlg: "N",
    addFlg: "N",
    modFlg: "N",
    delFlg: "N",
    cancFlg: "N",
    viewFlg: "N",
    userChk: "N",
    finYrChk: "N",
    cashFlg: "N",
    finImpactFlg: "N",
    autoVoucherGenFlg: "N",
    otpFlg: "N",
    dataRestc: "0",
    techRmks: "",
    refModId: "",
    refModNm: "",
    tempMenuId: "",
    tempMenuNm: "",
    formRepId: "",
    actFlg: "A",
  });

  useEffect(() => {
    if (mode !== 1) {
      setFormData({
        id: rowData ? rowData.id : "",
        modId: editVal ? editVal.modId : "",
        modNm: editVal ? editVal.modNm : "",
        tmpFormId: editVal ? editVal.tmpFormId : "",
        formNm: editVal ? editVal.formNm : "",
        formDesc: editVal ? editVal.formDesc : "",
        tempCd: editVal ? editVal.tempCd : "",
        tempNm: editVal ? editVal.tempNm : "",
        listFlg: editVal ? editVal.listFlg : "",
        addFlg: editVal ? editVal.addFlg : "",
        modFlg: editVal ? editVal.modFlg : "",
        delFlg: editVal ? editVal.delFlg : "",
        cancFlg: editVal ? editVal.cancFlg : "",
        viewFlg: editVal ? editVal.viewFlg : "",
        userChk: editVal ? editVal.userChk : "",
        finYrChk: editVal ? editVal.finYrChk : "",
        cashFlg: editVal ? editVal.cashFlg : "",
        finImpactFlg: editVal ? editVal.finImpactFlg : "",
        autoVoucherGenFlg: editVal ? editVal.autoVoucherGenFlg : "",
        otpFlg: editVal ? editVal.otpFlg : "",
        loginFlg: editVal ? editVal.loginFlg : "",
        dataRestc: editVal ? editVal.dataRestc : "",
        techRmks: editVal ? editVal.techRmks : "",
        tempMenuId: editVal ? editVal.tempMenuId : "",
        tempMenuNm: editVal ? editVal.tempMenuNm : "",
        refModId: editVal ? editVal.refModId : "",
        refModNm: editVal ? editVal.refModNm : "",
        formRepId: editVal ? editVal.formRepId : "",
        actFlg: editVal ? editVal.actFlg : "",
      });
    }
  }, [mode, rowData, editVal]);

  console.log(editVal);
  const handleInputChange = (event) => {
    // setEditVal({ ...editVal, [event.target.name]: event.target.value });
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    // setEditVal({ ...editVal, [event.target.name]: event.target.value });
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if (!formData.dev_nm.trim() || formData.dev_nm.trim() === "") {
      return false;
    }
    if (!formData.addr.trim() || formData.addr.trim() === "") {
      return false;
    }
    // other validations
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(editVal.prefixFlg);

    const addObj = {
      apiId: "SUA00399",
      mst: {
        actFlg: formData.actFlg,
        addFlg: formData.addFlg,
        autoVoucherGenFlg: formData.autoVoucherGenFlg,
        cancFlg: formData.cancFlg,
        cashFlg: formData.cashFlg,
        dataRestc: formData.dataRestc,
        delFlg: formData.delFlg,
        finImpactFlg: formData.finImpactFlg,
        finYrChk: formData.finYrChk,
        formDesc: formData.formDesc,
        formNm: formData.formNm,
        formRepId: getTempFormRepId(selectRowTempMenu),
        listFlg: formData.listFlg,
        loginFlg: formData.loginFlg,
        modFlg: formData.modFlg,
        modId: formData.modId,
        otpFlg: formData.otpFlg,
        refModId: formData.refModId,
        techRmks: formData.techRmks,
        tempMenuId: formData.tempMenuId,
        userChk: formData.userChk,
        viewFlg: formData.viewFlg,
      }
    }

    const editObj = {

      apiId: "SUA00402",
      mst: {
        actFlg: formData?.actFlg,
        addFlg: formData?.addFlg,
        autoVoucherGenFlg: formData?.autoVoucherGenFlg,
        cancFlg: formData?.cancFlg,
        cashFlg: formData?.cashFlg,
        dataRestc: formData?.dataRestc,
        delFlg: formData?.delFlg,
        finImpactFlg: formData?.finImpactFlg,
        finYrChk: formData?.finYrChk,
        formDesc: formData?.formDesc,
        tmpFormId: formData?.tmpFormId,
        formNm: formData?.formNm,
        listFlg: formData?.listFlg,
        loginFlg: formData?.loginFlg,
        modFlg: formData?.modFlg,
        modId: formData?.modId,
        otpFlg: formData?.otpFlg,
        techRmks: formData?.techRmks,
        // tempCd: formData?.tempCd,
        userChk: formData?.userChk,
        viewFlg: formData?.viewFlg
      }
    };



    if (mode === 1)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/saveAdd",
          addObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData();
          }
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
              ' (' +
              res.data?.appMsgList?.list[0]?.errCd +
              ')'
              : ''
          );

          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({ status: res.data?.appMsgList?.errorStatus })
          if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
            resetForm1();
          }
        })
        .catch((error) => {
          console.log("error");
        }).finally(() => {
          set_viewMsg(true)
        });

    if (mode === 2)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/saveEdit",
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
          }
          // setMsg(res?.data?.appMsgList?.List[0]?.errorMessage +" ("+ res?.data?.appMsgList?.List[0]?.errorCode+")");
          // setMsgTyp(res?.data?.appMsgList?.List[0]?.errorType);
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
              ' (' +
              res.data?.appMsgList?.list[0]?.errCd +
              ')'
              : ''
          );

          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({ status: res.data?.appMsgList?.errorStatus })
        })
        .catch((error) => {
          console.log("error");
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
      apiId: "SUA00404",
      mst: {
        tmpFormId: formData?.tmpFormId,
        modId: editVal?.modId,
      }
    };
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00127/saveDelete",
        deleteObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          // fetchData();
        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errTyp);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      })
      .catch((error) => {
        console.log("error");
      }).finally(() => {
        set_viewMsg(true)
      });
  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])




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


  const [searchText2, setSearchText2] = useState("");
  const [filteredData2, setFilteredData2] = useState([]);

  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data);



  // Character Count
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    formNm: false,
    formDesc: false,
    techRmks: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    console.log("xxxxxxxxx", name, "yyyyyyy", value);
    setFormData({
      ...formData,
      [name]: value === "Y" ? "N" : "Y",
    });
  };
  const resetForm = () => {
    setSelectRowTempMod({})
    setTempModLovData({})
    setTempMenuLovData({})
    setSelectRowTempMenu({})
    setSelectRow({})
    setModuleLovData({})
    setFormData({
      refModId: "",
      refModNm: "",
      tempMenuId: "",
      tempMenuNm: "",
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      formDesc: "",
      tempCd: "",
      tempNm: "",
      listFlg: "N",
      addFlg: "N",
      modFlg: "N",
      delFlg: "N",
      cancFlg: "N",
      viewFlg: "N",
      userChk: "N",
      finYrChk: "N",
      cashFlg: "N",
      finImpactFlg: "N",
      autoVoucherGenFlg: "N",
      otpFlg: "N",
      loginFlg: "N",
      dataRestc: "0",
      techRmks: "",
      actFlg: "A",
    });

    setMsg('')
    setMsgTyp('')
    console.log(formData);
    console.log(editVal);
  }

  const resetForm1 = () => {
    setSelectRowTempMod({})
    setTempModLovData({})
    setTempMenuLovData({})
    setSelectRowTempMenu({})
    setSelectRow({})
    setModuleLovData({})
    setFormData({
      refModId: "",
      refModNm: "",
      tempMenuId: "",
      tempMenuNm: "",
      modId: "",
      modNm: "",
      formId: "",
      formNm: "",
      formDesc: "",
      tempCd: "",
      tempNm: "",
      listFlg: "N",
      addFlg: "N",
      modFlg: "N",
      delFlg: "N",
      cancFlg: "N",
      viewFlg: "N",
      userChk: "N",
      finYrChk: "N",
      cashFlg: "N",
      finImpactFlg: "N",
      autoVoucherGenFlg: "N",
      otpFlg: "N",
      loginFlg: "N",
      dataRestc: "0",
      techRmks: "",
      actFlg: "A",
    });

    //  setMsg('')
    //   setMsgTyp('') 
    console.log(formData);
    console.log(editVal);
  }

  return (
    <>

      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

        <h4 className="card-title">Temporary Form by Copying Template {getFormTitle(mode)}</h4>
        <form onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <div className="col-md-3">
              <label for="exampleFormControlSelect1" className="col-form-label">
                <b>Template Module:</b>
                <span className="text-red">*</span>
              </label>
            </div>

            {/* <div className="col-md-11 col-form-label d-inline"> */}

            <div className="col-md-9">
              <div className="input-group">

                {(mode === 1) && <span className="input-group-text bg-primary">

                  <i
                    className="fa fa-search d-inline text-white"
                    title=""
                    onClick={() => setShowModelTempMod(true)}
                  ></i>
                </span>}


                <input
                  type="text"
                  aria-label="First name"
                  name="refModId"
                  // value={formData?.refModId}
                  value={formData.refModId}
                  // readOnly
                  required
                  className="form-control col-md-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  name="refModNm"
                  // value={formData?.refModNm}
                  value={formData.refModNm}
                  // readOnly
                  required
                  className="form-control col-md-9 mx-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <div className="row-mb-12">
                  {showModelTempMod && (
                    <Lov
                      moduleLovData={tempModLovData}
                      setShowModel={setShowModelTempMod}
                      showModel={showModelTempMod}
                      handleRowClick={handleRowClickTempMod}
                      columns={tempModLovColumns}
                      currentSelection={selectRowTempMod}
                      setCurrentSelection={setSelectRowTempMod}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Template Ref Form */}
          <div className=" row mb-4">
            <div className="col-md-3">
              <label for="exampleFormControlSelect1" className="col-form-label">
                <b>Select Template:</b>
                <span className="text-red">*</span>
              </label>
            </div>

            {/* <div className = "col-md-11 col-form-label d-inline"> */}

            <div className="col-md-9">
              <div className="input-group">
                {mode === 1 && (
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowModelTempMenu(true)}
                    />
                  </span>
                )}

                <input
                  type="text"
                  aria-label="First name"
                  name="tempMenuId"
                  value={formData?.tempMenuId}
                  // readOnly
                  required
                  className="form-control col-md-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  name="tempMenuNm"
                  value={formData?.tempMenuNm}
                  // readOnly
                  required
                  className="form-control col-md-9 mx-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <div className="row-mb-12">
                  {showModelTempMenu && (
                    <Lov
                      moduleLovData={tempMenuLovData}
                      setShowModel={setShowModelTempMenu}
                      showModel={showModelTempMenu}
                      handleRowClick={handleRowClickTempMenu}
                      columns={tempMenuLovColumns}
                      currentSelection={selectRowTempMenu}
                      setCurrentSelection={setSelectRowTempMenu}
                    />
                  )}
                </div>
              </div>
            </div>


          </div>

          <div className=" row mb-4">
            <div className="col-md-3">
              <label for="exampleFormControlSelect1" className="col-form-label">
                <b>Module :</b>
                <span className="text-red">*</span>
              </label>
            </div>

            {/* <div className = "col-md-11 col-form-label d-inline"> */}

            <div className="col-md-9">
              <div className="input-group">
                {mode === 1 && (
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowModel(true)}
                    />
                  </span>
                )}

                <input
                  type="text"
                  aria-label="First name"
                  name="modId"
                  value={formData?.modId}
                  // readOnly
                  required
                  className="form-control col-md-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <input
                  type="text"
                  aria-label="Last name"
                  name="modNm"
                  value={formData?.modNm}
                  // readOnly
                  required
                  className="form-control col-md-9 mx-2 rounded-3"
                  // onChange={handleInputChange}
                  disabled={mode !== 1}
                />
                <div className="row-mb-12">
                  {showModel && (
                    <Lov
                      moduleLovData={moduleLovData}
                      setShowModel={setShowModel}
                      showModel={showModel}
                      handleRowClick={handleRowClick}
                      columns={moduleLovColumns}
                      currentSelection={selectRow}
                      setCurrentSelection={setSelectRow}
                    />
                  )}
                </div>
              </div>
            </div>


          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Form:<span className="text-red">*</span></label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                <input
                  required
                  className="form-control col-md-3 me-3 rounded-3"
                  type=""
                  name="tmpFormId"
                  value={formData?.tmpFormId}
                  readOnly
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                />
                <input
                  className="form-control col-md-9 rounded-3"
                  type="text"
                  name="formNm"
                  value={formData?.formNm}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder="Enter Form Name"
                  required
                  maxLength={100}
                  onFocus={() => toggleCharCountVisibility("formNm")}
                  onBlur={() => toggleCharCountVisibility("formNm")}
                />
                {fieldCharCountVisibility.formNm && (
                  <span className="input-group-text">
                    {formData?.formNm?.length}/100
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">
                Form Description:<span className="text-red">*</span>
              </label>
            </div>
            <div className="col-md-9 input-group">
              <textarea
                className="form-control"
                type="text"
                name="formDesc"
                value={formData.formDesc}
                onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                // placeholder="form_desc"
                required
                maxLength={2000}
                onFocus={() => toggleCharCountVisibility("formDesc")}
                onBlur={() => toggleCharCountVisibility("formDesc")}
              />
              {fieldCharCountVisibility.formDesc && (
                <span className="input-group-text">
                  {formData?.formDesc?.length}/2000
                </span>
              )}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="listFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.listFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                  {formData?.listFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="listFlg"
                      value={formData?.listFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="listFlg"
                      value={formData?.listFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">List</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="addFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.addFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                  {formData.addFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="addFlg"
                      value={formData.addFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="addFlg"
                      value={formData.addFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Addittion</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="modFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.modFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                  {formData.modFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="modFlg"
                      value={formData.modFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="modFlg"
                      value={formData.modFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">MOdification</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="delFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.delFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                  {formData.delFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="delFlg"
                      value={formData.delFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="delFlg"
                      value={formData.delFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Deletetion</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="cancFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.cancFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}
                  {formData.cancFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="cancFlg"
                      value={formData.cancFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="cancFlg"
                      value={formData.cancFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Cancellation</span>
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="viewFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value = {editVal.viewFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData.viewFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="viewFlg"
                      value={formData.viewFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="viewFlg"
                      value={formData.viewFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">view</span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "userChk"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.userChk}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData?.userChk === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="userChk"
                      value={formData?.userChk}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="userChk"
                      value={formData?.userChk}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">
                    Check User Authentication
                  </span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "finYrChk"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.finYrChk}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData?.finYrChk === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="finYrChk"
                      value={formData?.finYrChk}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="finYrChk"
                      value={formData?.finYrChk}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">
                    Check Financial Year
                  </span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/* <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "cashFlg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.cashFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData?.cashFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="cashFlg"
                      value={formData?.cashFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="cashFlg"
                      value={formData?.cashFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Cash Transaction</span>
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*   <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "finImpactFlg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {editVal.finImpactFlg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData?.finImpactFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="finImpactFlg"
                      value={formData?.finImpactFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="finImpactFlg"
                      value={formData?.finImpactFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Financial Impact</span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control custom-checkbox">
                  {/*  <input
                    type = "checkbox"
                    className = "custom-control-input"
                    name = "auto_vou_gen_flg"
                    defaultValue = "Y"
                    defaultChecked = "Y"
                    value = {formData.auto_vou_gen_flg}
                    onChange = {handleInputChange}
                    disabled = {mode === 3 || mode === 4}
                  /> */}
                  {formData?.autoVoucherGenFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="autoVoucherGenFlg"
                      value={formData?.autoVoucherGenFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="autoVoucherGenFlg"
                      value={formData?.autoVoucherGenFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">
                    Auto Voucher Generate
                  </span>
                </label>
              </div>
              <div className="form-check col-md-3 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="otpFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.otpFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}

                  {formData?.otpFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="otpFlg"
                      value={formData?.otpFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="otpFlg"
                      value={formData?.otpFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}


                  <span className="custom-control-label">OTP</span>
                </label>
              </div>
              <div className="form-check col-md-2 form-check-inline">
                <label className="custom-control  custom-checkbox">
                  {/*   <input
                    type="checkbox"
                    className="custom-control-input"
                    name="loginFlg"
                    defaultValue="Y"
                    defaultChecked="Y"
                    value={editVal.loginFlg}
                    onChange={handleInputChange}
                    disabled={mode === 3 || mode === 4}
                  /> */}

                  {formData?.loginFlg === "Y" ? (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      checked={true}
                      name="loginFlg"
                      value={formData?.loginFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  ) : (
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      name="loginFlg"
                      value={formData?.loginFlg}
                      onChange={handleCheckboxChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  )}
                  <span className="custom-control-label">Login</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Check Data Restriction:<span className="text-red">*</span></label>
            </div>
            <div className="col-sm-9 input-group">
              <select
                required
                className="from-group col-md-12 rounded-3 border"
                // aria-label="Default select example"
                name="dataRestc"
                value={(formData?.dataRestc)}
                onChange={handleStatusChange}

                disabled={mode === 3 || mode === 4}
              >
                <option disabled>--Select--</option>
                {mode === 1
                  ? (addVal?.ddDataRestc?.map((item) => (
                    <option key={item?.value} value={item?.value}>
                      {item.label}
                    </option>
                  )))
                  : (editVal?.ddDataRestc?.map((item) => (
                    <option key={item?.value} value={item?.value}>
                      {item.label}
                    </option>
                  )))
                }
              </select>


            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Technical Remarks :</label>
            </div>
            <div className="col-md-9 input-group">
              <textarea
                className="form-control"
                type="text"
                name="techRmks"
                value={formData.techRmks}
                onChange={handleInputChange}
                disabled={mode === 3 || mode === 4}
                placeholder="Name"
                maxLength={500}
                onFocus={() => toggleCharCountVisibility("techRmks")}
                onBlur={() => toggleCharCountVisibility("techRmks")}
              />
              {fieldCharCountVisibility.techRmks && (
                <span className="input-group-text">
                  {formData?.techRmks?.length}/500
                </span>
              )}
            </div>
          </div>

          {<div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Status:</label>
            </div>
            <div className="col-sm-9 input-group">
              <select
                required
                className="from-group col-md-12 rounded-3 border"
                //aria-label="Default select example"
                name="actFlg"
                value={(formData.actFlg)}
                onChange={handleStatusChange}
                // defaultValue="NA"
                disabled={mode === 3 || mode === 4}
              >
                <option disabled>--Select--</option>
                {(mode === 1) ?
                  (addVal?.ddActFlg?.map((item) => (
                    <option value={item?.value}>{item?.label}</option>
                  ))) : (editVal?.ddActFlg?.map((item) => (
                    <option value={item?.value}>{item?.label}</option>
                  )))
                }
              </select>


            </div>
          </div>}



          {mode !== 4 && (
            <button
              type="submit"
              disabled={delStatus}
              className="btn btn-primary"
            >
              {buttonTitle(mode)}
            </button>
          )}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
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
    </>
  );
};
export default FormM;
