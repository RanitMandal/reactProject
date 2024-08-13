import React, { useState, useEffect , useRef} from "react";

import { Modal, ModalTitle } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import FavLink from "../../common/FavLink"
import Lov from "../../common/Lov _new";
import {
  stateColumns,
  districtColumns,
  DesignationLovColumns,
  CurrencyLovColumns,
} from "./Columns";
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import moment from "moment/moment";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };

const InstallationProfile = () => {
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");

  //Form open api calling

  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [data, setData] = useState({});

  const [openData, setOpenData] = useState("");
  let openFormObj = {
    apiId: "SUA00010",
  };

  
  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
      set_viewMsg(false)
  
  }, [viewMsg])

  useEffect(() => {
    console.log(headers);

    const fetchOpenData = async () => {
      axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/openForm",
          openFormObj,
          {
            headers,
          }
        )
        .then((res) => {
          setOpenData(res.data?.content?.mst);
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? data?.appMsgList?.list[0]?.errDesc +
                  " (" +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ")"
              : ""
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
        });
    };

    fetchOpenData();
  }, []);
  //Form open api end

  //sve api for post form data
  function postDataToAPI(event) {
    event.preventDefault();
    openData?.maxLoginAttmpt
      ? setError("")
      : setError("This field is required");
   

    let postObj = {
      apiId: "SUA00011",
      mst: {
        actFlg: openData?.actFlg,
        addr: openData?.addr? openData?.addr : "" ,
        copyRight: openData?.copyRight ? openData?.copyRight : "",
        curCdBase: openData?.curCdBase,
        curCdFrgn: openData?.curCdFrgn ? openData?.curCdFrgn : "",
        distCd: openData?.distCd ?  openData?.distCd : "",
        //distCd: 0,
        emailId: openData?.emailId||"",
        faxNo: openData?.faxNo ? openData?.faxNo : "",
        hodDsgnRefNo: openData?.hodDsgnRefNo ? openData?.hodDsgnRefNo : "",
        instDt: moment(openData.instDt).format(),
        logoDbFlag: openData?.logoDbFlag,
        logoNm: openData?.logoNm,
        logoPath: openData?.logoPath,
        lvlRefCd: openData?.lvlRefCd,
        lvlTypCd: openData?.lvlTypCd,
        maxLoginAttmpt: parseInt(openData.maxLoginAttmpt),
        maxPwdAge: parseInt(openData?.maxPwdAge),
        minPwdLen: parseInt(openData?.minPwdLen),
        phNo: openData?.phNo,
        pinNo: openData?.pinNo ? openData?.pinNo : "",
        stateCd: openData?.stateCd,
        strongPwdFlg: openData?.strongPwdFlg,
        title: openData?.title ? openData?.title : "",
      },
    };

    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/saveEdit",
        postObj,
        { headers }
      )
      .then((response) => {
        console.log("POST Request Success:", response.data);
        setMsg(
           response.data?.appMsgList?.list[0]?.errDesc +
                ' (' +
                response.data?.appMsgList?.list[0]?.errCd +
                ')'
            
        );
        
        setMsgTyp(response?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:response.data?.appMsgList?.errorStatus})

      })
      .catch((error) => {
        console.error("POST Request Error:", error);
      }).finally(() => {
        set_viewMsg(true)
    });
  }
  //save api end

  //state lov Starts
  const updateOpenData = (newOpenData) => {
    setOpenData(newOpenData);
  };
  const [stateData, setStateData] = useState({});
  let postStateObj = {
    apiId: "SUA00127",
  };
  useEffect(() => {
    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/getAllState",
          postStateObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setStateData(res.data ? res.data : []);
        /*   setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
              " (" +
              res?.data?.appMsgList?.list[0]?.errCd +
              ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getStateName = (obj) => {
    return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.stateNm;
  };

  const getStateId = (obj) => {
    return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.stateCd;
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    console.log(getStateId(rowData));
    console.log(getStateName(rowData));
    setSelectRowModuleLov({});
    
    updateOpenData({
      ...openData,
      stateCd: getStateId(rowData),
      stateNm: getStateName(rowData),
      distCd:"",
      distNm:""
    });
    // In the rendering section
    console.log("Rendering with openData:", openData);
    // console.log(openData?.content?.mst.stateCd)
  };
  //state Lov ends

  //District Lov Starts
  const [districtData, setDistrictData] = useState({});
  useEffect(() => {
    const distLovObj = {
      apiId: "SUA00128",
      criteria: {
        stateCd: openData.stateCd,
      },
    };

    const fetchDistrictLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/getDistByState",
          distLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setDistrictData(
            res.data?.content?.qryRsltSet?.length
              ? res.data?.content?.qryRsltSet
              : []
          );

         /*  setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
              " (" +
              res?.data?.appMsgList?.list[0]?.errCd +
              ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };

    // selectRow && 
    openData.stateCd && fetchDistrictLovData();
  }, [ openData.stateCd]);

  const getDistrictName = (obj) => {
    return districtData[Number(Object.keys(obj)[0])]?.distNm;
  };

  const getDistrictId = (obj) => {
    return districtData[Number(Object.keys(obj)[0])]?.distCd;
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showDistLov, setShowDistLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);
    updateOpenData({
      ...openData,
      distCd: getDistrictId(rowData),
      distNm: getDistrictName(rowData),
    });
    // setQueryInputObj({

    //     ...queryInputObj,
    //     modId: getModuleId(rowData),

    // });
  };
  //District Lov Ends

  //Designation lov Starts

  const [designationData, setDesignationData] = useState({});
  let Designation_Data_PostObj = {
    apiId: "SUA00129",
  };
  useEffect(() => {
    const getAllDesignation = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/getAllDesignation",
          Designation_Data_PostObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setDesignationData(res.data ? res.data : []);
        /*   setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
              " (" +
              res?.data?.appMsgList?.list[0]?.errCd +
              ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };
    getAllDesignation();
  }, []);

  const getDesignationName = (obj) => {
    return designationData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.dsgnNm;
  };

  const getDesignationId = (obj) => {
    return designationData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.dsgnCd;
  };

  const [DesignationSelectRow, setDesignationSelectRow] = useState("");
  const [DesginationshowModel, setDesignationShowModel] = useState(false);
  const DesignationRowClick = (rowData) => {
    setDesignationSelectRow(rowData);
    //console.log(getStateId(rowData));
    // console.log(getStateName(rowData));
    // setSelectRowModuleLov({});
    updateOpenData({
      ...openData,
      hodDsgnRefNo: getDesignationId(rowData),
      hodDsgnNm: getDesignationName(rowData),
    });
  };
  //Designation Lov ends

  //Base Currency Starts
  const [currencyData, setCurrencyData] = useState({});
  let currency_Data_PostObj = {
    apiId: "SUA00222",
  };
  useEffect(() => {
    const getAllCurrency = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/getAllCurrency",
          currency_Data_PostObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setCurrencyData(res.data ? res.data : []);
         /*  setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
              " (" +
              res?.data?.appMsgList?.list[0]?.errCd +
              ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };
    getAllCurrency();
  }, []);

  const getCurrencyName = (obj) => {
    return currencyData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.curncyDesc;
  };

  const getCurrencyId = (obj) => {
    return currencyData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]
      ?.curncyCd;
  };

  const [currencySelectRow, setCurrencySelectRow] = useState("");
  const [currencyShowModel, setCurrencyShowModel] = useState(false);
  const CurrencyRowClick = (rowData) => {
    setCurrencySelectRow(rowData);
    //console.log(getStateId(rowData));
    // console.log(getStateName(rowData));
    // setSelectRowModuleLov({});
    updateOpenData({
      ...openData,
      curCdBase: getCurrencyId(rowData),
      curCdBaseNm: getCurrencyName(rowData),
    });
  };
  //Base Currency ends

  // useEffect(() => {
  //   //const [selectRowMod, setSelectRowMod] = useState("");

  //   let stateCd = openData?.stateCd || ""
  //   let resIndex = stateData?.findIndex(item => item.stateCd === stateCd)
  //   let currentStateCd = {}
  //   if (resIndex !== -1) currentStateCd = { [resIndex]: true }
  //   setSelectRow(currentStateCd)
  //   //   console.log("9999999", resIndex, currentModId, modLovData, modId);

  //   let distCd = openData?.distCd || ""
  //   let resdistCdIndex = districtData?.findIndex(item => item.distCd === distCd)
  //   let currentDistCd = {}
  //   if (resdistCdIndex !== -1) currentDistCd = { [resdistCdIndex]: true }
  //   setSelectRowModuleLov(currentDistCd)
  //   // console.log(appId);
    

  //   let dsgnCd = openData?.dsgnCd || ""
  //   let resDsgnCdIndex = designationData?.findIndex(item => item.dsgnCd === dsgnCd)
  //   let currentDsgnCd = {}
  //   if (resDsgnCdIndex !== -1) currentDsgnCd = { [resDsgnCdIndex]: true }
  //   setDesignationSelectRow(currentDsgnCd)

 
  //   let curncyCd = openData?.curncyCd || ""
  //   let resCurncyCdIndex = currencyData?.findIndex(item => item.curncyCd === curncyCd)
  //   let currentCurncyCd = {}
  //   if (resCurncyCdIndex !== -1) currentCurncyCd= { [resCurncyCdIndex]: true }
  //   setCurrencySelectRow(currentCurncyCd)

  // }, [openData, currencyData,designationData, stateData, districtData])




  //datepicker functions start
  const [startDate, setStartDate] = useState(null);

  // Function to parse the date string and set it as the initial date
  const parseAndSetInitialDate = (dateString) => {
    if (dateString) {
      const parsedDate = new Date(dateString);
      setStartDate(parsedDate);
    }
  };
  console.log(openData?.instDt);
  useEffect(() => {
    const initialDateString = openData?.instDt;
    if (initialDateString) {
      const parsedDate = new Date(initialDateString);
      if (!isNaN(parsedDate.getTime())) {
        console.log("Initial Date:", parsedDate);
        parseAndSetInitialDate(initialDateString);
      } else {
        console.log("Invalid Date String:", initialDateString);
      }
    } else {
      console.log("Initial Date String is null or undefined");
    }
  }, [openData]);

  //datepicker functions end

  //checkbox function start
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [isLogoDbFlag, setIsLogoDbFlag] = useState(false);

  useEffect(() => {
    const strongPwdFlg = openData?.strongPwdFlg;
    const logoDbFlag = openData?.logoDbFlag;
    setIsPasswordStrong(strongPwdFlg === "Y" ? true : false);
    setIsLogoDbFlag(logoDbFlag === "Y" ? true : false);
  }, [openData]);

  const handlePasswordStrongChange = (event) => {
    const { name, value } = event.target;
    console.log("xxxxxxxxx", name, "yyyyyyy", value);
    setOpenData({
      ...openData,
      [name]: value === "Y" ? "N" : "Y",
    });
  };

  const handleLogoDbFlagChange = (event) => {
    setIsLogoDbFlag(event.target.checked);
  };
  //checkbox function end

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setOpenData({
      ...openData,
      [name]: value,
    });
  };

  const [profileValue3, setProfileValue3] = useState(
    "Public Health Engineering Department, Government Of West Bengal"
  );
  const [profileValue4, setProfileValue4] = useState("WBPHED");

  const [profileValue9, setProfileValue9] = useState("12323");

  const [isValid, setIsValid] = useState(true);
  const [isValid2, setIsValid2] = useState(true);
  const [isValid3, setIsValid3] = useState(true);

  const [weight, setWeight] = useState("");
  const [weight2, setWeight2] = useState("");

  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");

  //handle the value of input field when changes happen
  const handleInputChange = (event) => {
    console.log(`Changing ${event.target.name} to: ${event.target.value}`);
    console.log(event.target.name, event.target.value);
    if(event.target.name === "phNo" && event.target.value.length > 10) return
    if(event.target.name === "pinNo" && event.target.value.length > 6) return
    if(event.target.name === "faxNo" && event.target.value.length > 50) return
    if(event.target.name === "maxLoginAttmpt" && isNaN(event.target.value)) {
      setError("Please enter a valid number for maxLoginAttmpt.");
      return;
  }
    setOpenData({
      ...openData,
      [event.target.name]: event.target.value,
    });
    // if (event.target.name === "maxLoginAttmpt") {
    //   setError(""); // Clear the error whenever there's an input change in maxLoginAttmpt field
    // }
    if (event.target.name === "addr") {
      setError1(""); // Clear the error whenever there's an input change in addr field
    }
  };


// CharCounter.........
const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
  phNo: false,
  logoNm: false,
  logoPath: false,
  maxLoginAttmpt: false,
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Installation Profile</h1>
          <nav aria-label="breadcrumb" className="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item breadcrumb-item">
                <a href="#" role="button" tabIndex={0}>
                  List Page
                </a>
              </li>
              <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                <a href="#" role="button" tabIndex={0}>
                  SUF00027_01
                  <FavLink />
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }


      <div className="card">
        <div className="container my-4">
          <form className="px-5" onSubmit={postDataToAPI}>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Location<span className="text-red">*</span>
              </label>
              <div className="col-sm-2 input-group">
                <input
                  className="form-control mb-2"
                  value={openData?.lvlRefCd}
                  placeholder="Location Code"
                  readOnly
                />
              </div>
              <div className="col-sm-7 input-group">
                <input
                  required
                  className="form-control"
                  name="lvlNm"
                  value={openData?.lvlNm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Location Type<span className="text-red">*</span>
              </label>
              <div className="col-sm-2 input-group">
                <input
                  className="form-control mb-2"
                  type="text"
                  // value={"01"}
                  value={openData?.lvlTypCd}
                  placeholder="Location Type Code"
                  readOnly
                />
              </div>
              <div className="col-sm-7 input-group">
                <input
                  required
                  className="form-control"
                  name="lvlTypNm"
                  value={openData?.lvlTypNm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Address
              </label>
              <div className="col-sm-9">
                <div className="input-group">
                <input
                 
                  className="form-control"
                  maxLength={200}
                  name="addr"
                  value={openData?.addr}
                  onChange={handleInputChange}
                />
                {openData?.addr ? (
                  <span className="input-group-text">
                    {openData?.addr.length}/200
                  </span>
                ) : null}
                </div>
                {/*  <div style={{ color: "red" }}>{error1}</div> */}
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                State
              </label>
              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowModel(true)}
                    />
                  </span>
                  <input
                    type="text"
                    aria-label="State Code"
                    value={openData?.stateCd || ""}
                    name="stateCd"
                    className="form-control col-sm-2 rounded-3"
                    // onChange={(e) => {
                    //   {
                    //     console.log(e.target.value);
                    //   }
                    //   setOpenData((e) => ({
                    //     content: {
                    //       ...openData?.content,
                    //       mst: {
                    //         ...openData?.content?.mst,
                    //         stateCd: e.target.value,
                    //       },
                    //     },
                    //   }));
                    // }}
                  />
                  <input
                    type="text"
                    aria-label="State Name"
                    value={openData?.stateNm || ""}
                    name="stateNm"
                    class="form-control col-sm-9 ms-5 rounded-3"
                    /*  onChange={(e) => {
                        // Update the stateNm field when the input changes
                        const newValue = e.target.value;
                        setOpenData((prevOpenData) => ({
                          ...prevOpenData,
                          content: {
                            ...prevOpenData?.content,
                            mst: {
                              ...prevOpenData?.content?.mst,
                              stateNm: newValue,
                            },
                          },
                        }));
                      }} */
                    // onChange= {handleInputChange}
                  />

                  <div className="row-mb-12">
                    {showModel && (
                      <Lov
                        moduleLovData={stateData?.content?.qryRsltSet}
                        setShowModel={setShowModel}
                        showModel={showModel}
                        handleRowClick={handleRowClick}
                        columns={stateColumns}
                        currentSelection={selectRow}
                        setCurrentSelection={setSelectRow}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label"> District </label>
              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowDistLov(true)}
                    />
                  </span>
                  <input
                    type="text"
                    aria-label="District Code"
                    name="distCd"
                    value={openData?.distCd || ""}
                    className="form-control col-sm-2 rounded-3"
                   
                    // onChange={(e) => {
                    //   {
                    //     console.log(e.target.value);
                    //   }
                    //   setOpenData((e) => ({
                    //     ...openData,
                    //     distCd: e.target.value,
                    //   }));
                    // }}
                  />
                  <input
                    type="text"
                    aria-label="District Name"
                    name="distNm"
                    value={openData?.distNm || ""}
                    className="form-control col-sm-9 ms-5 rounded-3"
                    
                  />
                  <div className="row-mb-12">
                    {showDistLov && (
                      <Lov
                        moduleLovData={districtData}
                        setShowModel={setShowDistLov}
                        showModel={showDistLov}
                        handleRowClick={handleRowClickModuleLov}
                        columns={districtColumns}
                        currentSelection={selectRowModuleLov}
                        setCurrentSelection={setSelectRowModuleLov}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <label className="col-md-3 form-label">Pin</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  id="exampleFormControlSelect1"
                  max={6}
                  // value={weight}
                  name="pinNo"
                  value={openData?.pinNo}
                  onChange={handleInputChange}
                  placeholder="Pin No"
                />
                {weight == "" ? (
                  <span className="input-group-text d-none">
                    {weight.length}/6
                  </span>
                ) : (
                  <span className="input-group-text">{weight.length}/6</span>
                )}
              </div>
            </div>
            <div className="row mb-4">
              <label className="col-md-3 form-label">Fax</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  id="exampleFormControlSelect1"
                  maxLength={50}
                  name="faxNo"
                  value={openData?.faxNo}
                  onChange={handleInputChange}
                  //placeholder="Fax No"
                />
                {inputValue2 == "" ? (
                  <span className="input-group-text d-none">
                    {inputValue2.length}/50
                  </span>
                ) : (
                  <span className="input-group-text ">
                    {inputValue2.length}/50
                  </span>
                )}
                <span className="input-group-text d-none">
                  {inputValue2.length}/50
                </span>
              </div>
              {!isValid2 && (
                <p className="text-red text-center">Invalid Fax Number</p>
              )}
            </div>
            <div className="row mb-4">
              <label className="col-md-3 form-label">Phone</label>
              <div className="col-sm-9 input-group">
                <input
                 
                  className="form-control"
                  type="text"
                  id="exampleFormControlSelect1"
                  
                  name="phNo"
                  value={openData?.phNo}
                  onChange={handleInputChange}
                  maxLength={10}
                  placeholder="Phone No"
                  onFocus={() => toggleCharCountVisibility("phNo")}
              onBlur={() => toggleCharCountVisibility("phNo")}
            />
            {fieldCharCountVisibility.phNo && (
              <span className="input-group-text">
                {openData?.phNo?.length}/10
              </span>
            )}
              </div>
              {!isValid && (
                <p className="text-red text-center">Invalid Phone Number</p>
              )}
            </div>
            <div className="row mb-4">
              <label className="col-md-3 form-label">Email</label>
              <div className="col-sm-9 input-group">
                <input
                 
                  className="form-control"
                  type="email"
                  maxLength={100}
                  id="exampleFormControlSelect1"
                  name="emailId"
                  value={openData?.emailId}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                {inputValue3 == "" ? (
                  <span className="input-group-text d-none">
                    {inputValue3.length}/100
                  </span>
                ) : (
                  <span className="input-group-text">
                    {inputValue3.length}/100
                  </span>
                )}
              </div>
              {!isValid3 && (
                <p className="text-red text-center">Invalid Email Id</p>
              )}
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">HOD Dsgn</label>
              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setDesignationShowModel(true)}
                    />
                  </span>
                  <input
                    type="text"
                    aria-label="HOD Code"
                    value={openData?.hodDsgnRefNo || ""}
                    class="form-control col-sm-2 rounded-3"
                    
                  />
                  <input
                    type="text"
                    aria-label="HOD Name"
                    value={openData?.hodDsgnNm || ""}
                    class="form-control col-sm-9 ms-5 rounded-3"
                   
                  />

                  <div className="row-mb-12">
                    {DesginationshowModel && (
                      <Lov
                        moduleLovData={designationData?.content?.qryRsltSet}
                        setShowModel={setDesignationShowModel}
                        showModel={DesginationshowModel}
                        handleRowClick={DesignationRowClick}
                        columns={DesignationLovColumns}
                        currentSelection={DesignationSelectRow}
                        setCurrentSelection={setDesignationSelectRow}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Base currency<span className="text-red">*</span>
              </label>

              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setCurrencyShowModel(true)}
                    />
                  </span>
                  <input
                    type="text"
                    aria-label="State Code"
                    value={openData?.curCdBase || ""}
                    class="form-control col-sm-2 rounded-3"
                    // readOnly
                    required
                  />
                  <input
                    type="text"
                    aria-label="State Name"
                    value={openData?.curCdBaseNm || ""}
                    class="form-control col-sm-9 ms-5 rounded-3"
                    // readOnly
                    required
                  />
                  <div className="row-mb-12">
                    {currencyShowModel && (
                      <Lov
                        moduleLovData={currencyData?.content?.qryRsltSet}
                        setShowModel={setCurrencyShowModel}
                        showModel={currencyShowModel}
                        handleRowClick={CurrencyRowClick}
                        columns={CurrencyLovColumns}
                        currentSelection={currencySelectRow}
                        setCurrentSelection={setCurrencySelectRow}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Foreign Currency</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="curCdFrgn"
                  value={openData?.curCdFrgn}
                  onChange={handleInputChange}
                  //placeholder="Foreign Currency"
                  maxLength={5}
                />
               {/*  {profileValue9 == "" ? (
                  <span className="input-group-text d-none">
                    {profileValue9.length}/5
                  </span>
                ) : (
                  <span className="input-group-text">
                    {profileValue9.length}/5
                  </span>
                )} */}

{openData?.curCdFrgn ? (
                  <span className="input-group-text">
                    {openData?.curCdFrgn?.length}/5
                  </span>
                ) : null}



              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Installation Date <span className="text-red">*</span>
              </label>
              <div className="col-sm-3 input-group">
                <DatePicker
                required
                  className="form-control fc-datepicker"
                  placeholder="MM/DD/YYYY"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    console.log(openData.content.mst.instDt);
                  }}
                  numberOfMonths={1}
                  
                />
              </div>
              <div className="col-md-6">
              <div className="row mb-4">
              <label className="col-md-6 form-label">
                Max Login Attempt<span className="text-red">*</span>
              </label>
              <div className="col-md-6 input-group">
                {/* <div className="input-group" style={{ display: "flex", flexDirection: "column" }}> */}
                  <input
                    required
                    className="form-control col-md-12"
                    type="text"
                    maxLength={2}
                    name="maxLoginAttmpt"
                    value={openData?.maxLoginAttmpt}
                    onChange={handleInputChange}
                    placeholder="Max Login Attempt"
                    onFocus={() => toggleCharCountVisibility("maxLoginAttmpt")}
              onBlur={() => toggleCharCountVisibility("maxLoginAttmpt")}
                />
                {fieldCharCountVisibility.maxLoginAttmpt && (
              <span className="input-group-text">
                {openData?.maxLoginAttmpt?.length}/2
              </span>
            )}
                  {error && <div style={{ color: "red" }}>{error}</div>}
                {/* </div> */}
              </div>
              </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Check User Password is strong or not?
              </label>
              <div className="col-sm-3 input-group">
                {openData.strongPwdFlg === "Y" ? (
                  <input
                    type="checkbox"
                    checked={true}
                    name="strongPwdFlg"
                    value={openData.strongPwdFlg}
                    onChange={handlePasswordStrongChange}
                  />
                ) : (
                  <input
                    type="checkbox"
                    name="strongPwdFlg"
                    value={openData.strongPwdFlg}
                    onChange={handlePasswordStrongChange}
                  />
                )}
              </div>
              <label className="col-md-2 form-label">
                Logo DB Flag(Yes/No)?
              </label>
              <div className="col-sm-3 input-group">
                {openData.logoDbFlag === "Y" ? (
                  <input
                    type="checkbox"
                    checked={true}
                    name="logoDbFlag"
                    value={openData.logoDbFlag}
                    onChange={handlePasswordStrongChange}
                  />
                ) : (
                  <input
                    type="checkbox"
                    name="logoDbFlag"
                    value={openData.logoDbFlag}
                    onChange={handlePasswordStrongChange}
                  />
                )}
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Max User Password Validity Time(In Days){" "}
                <span className="text-red">*</span>
              </label>
              <div className="col-sm-3 input-group">
                <input
                required
                  className="form-control"
                  type="text"
                  name="maxPwdAge"
                  value={openData?.maxPwdAge}
                  onChange={handleInputChange}
                  // placeholder="Max User Password Validity Time(In Days) "
                />
              </div>
              <div className="col-md-6">
              <div className="row mb-4">
              <label className="col-md-6 form-label">
                Logo Path<span className="text-red">*</span>
              </label>
              <div className="col-md-6 input-group">
                <input
                required
                  className="form-control"
                  type="text"
                 
                  maxLength={200}
                  name="logoPath"
                  value={openData?.logoPath}
                  onChange={handleInputChange}
                  placeholder="Logo Path"
                  onFocus={() => toggleCharCountVisibility("logoPath")}
              onBlur={() => toggleCharCountVisibility("logoPath")}
                />
                {fieldCharCountVisibility.logoPath && (
              <span className="input-group-text">
                {openData?.logoPath?.length}/200
              </span>
            )}
              </div>
              </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Minimum Length Of User Password
                <span className="text-red">*</span>
              </label>
              <div className="col-sm-3 input-group">
                <input
                  className="form-control"
                  type="text"
                  required
                  name="minPwdLen"
                  value={openData?.minPwdLen}
                  onChange={handleInputChange}
                  // placeholder="Minimum Length Of User Password"
                />
              </div>
              <div className="col-md-6">
              <div className="row mb-4">
              <label className="col-md-6 form-label">
                Logo Name<span className="text-red">*</span>
              </label>
              <div className="col-md-6 input-group">
                <input
                required
                  className="form-control"
                  type="text"
                  maxLength={30}
                  name="logoNm"
                  value={openData?.logoNm}
                  onChange={handleInputChange}
                  placeholder="Logo Name"
                  onFocus={() => toggleCharCountVisibility("logoNm")}
              onBlur={() => toggleCharCountVisibility("logoNm")}
                />
                {fieldCharCountVisibility.logoNm && (
              <span className="input-group-text">
                {openData?.logoNm?.length}/30
              </span>
            )}
              </div>
              </div>
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Title</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  maxLength={200}
                  name="title"
                  value={openData?.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                 
                />
                 {openData?.title ? (
                  <span className="input-group-text">
                    {openData?.title?.length}/200
                  </span>
                ) : null}
              
               
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Copyright</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  maxLength={200}
                  name="copyRight"
                  value={openData?.copyRight}
                  onChange={handleInputChange}
                  placeholder="Copyright"
                />
                 {openData?.copyRight ? (
                  <span className="input-group-text">
                    {openData?.copyRight?.length}/200
                  </span>
                ) : null}
              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Status <span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  className="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  name="actFlg"
                  value={openData?.actFlg || ""} // Provide a default value if it's undefined
                  onChange={handleSelectChange}
                >
                  <option value="">Select an option</option>{" "}
                  {/* Add a default option */}
                  {openData?.ddActFlg?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="container text-center mb-4">
          <button  type= "submit" className="btn btn-success" 
         // onClick={postDataToAPI}
          >
            Submit
          </button>
        </div>
          </form>
          
        </div>
       
      </div>
    </div>
  );
};
export default InstallationProfile;
