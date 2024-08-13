import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../common/common"
import axios from "axios";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken } from "../../common/common"
import { getScplAdContext } from "../../common/common"
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip,
  Breadcrumb,
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import * as formelement from "../../data/Form/formelement/formelement";
import { Dialog, DialogContent, DialogTitle, DialogContentText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const headers = { Authorization: "Bearer " + getApiToken() };
let chngLogNo = ""
const EnblMobLogin = () => {

  const navigate = useNavigate()
  // const [otp, set_otp] = useState({
  //   otp:true,
  //   secretQues:true
  // })
  const [loading, setLoading] = useState({
    genOtp: false,
  })
  //Form open api calling
  const [showPage, setShowPage] = useState(false);
  useEffect(() => {
    const getOtpOptnChngDtl = async () => {
      let obj = {
        apiId: "SUA00651",
        mst: {
          otpTypCd: "T0004"
        }
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/getOtpOptnChngDtl", obj, { headers })
        .then((res) => {
          if (res.data.content.mst) {
            // setShowPage(res.data.content.mst)
            set_otpOptn({ ...otpOptn, ...res.data.content.mst })
            if (res.data?.content?.mst?.otpMobFlg === "Y") {
              set_msgCase(1)
            } else if (res.data?.content?.mst?.otpEmailFlg === "Y") {
              set_msgCase(2)
            } else if (res.data?.content?.mst?.otpMobFlg === "Y" && res.data?.content?.mst?.otpEmailFlg === "Y") {
              set_msgCase(3)
            }
          }
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          //     res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          // set_errExp({ status: res.data?.appMsgList?.errorStatus });
        })

    }
    getOtpOptnChngDtl();
  }, [showPage]);
  //Form open api end

  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const userId = getScplAdContext().userId;
  const [otp, setOtp] = useState(false);
  const [secretQues, setSecretQues] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [otpOptn, set_otpOptn] = useState({
    process: false,
    genOpt: false,
    choosValue: false,
    resendEnbl: false,
    resendTimer: null,
    vldbtn: true
  })
  const [caseState, set_caseState] = useState(0)
  const [msgCase, set_msgCase] = useState(0)
  const [changeBtn, set_changeBtn] = useState(true)

  const [openData, setOpenData] = useState({
    userId: "",
    userPwd: "",
    emailId: "",
    mobNo: "",
    optnChngLogNo: "",
    validateEmailOtp: "",
    validateMobOtp: ""

  });

  useEffect(() => {
    setOpenData({
      ...openData,
      userId: userId
    })
  }, [userId])









  const buttonTitle = () => {
    // Dynamically determine button title based on case state
    switch (caseState) {
      case 0:
        return "Proceed";
      case 1:
        return "Send OTP";
      case 2:
        return "Validate OTP";
      default:
        return "Unknown";
    }
  };

  const dialogMsg = () => {
    // Dynamically determine button title based on case state
    switch (msgCase) {
      case 1:
        return "OTP Send To Your Registerd Mobile Number";
      case 2:
        return "OTP Send To Your Registerd Email ID";
      case 3:
        return "OTP Send To Your Registerd Email ID And Mobile Number";
      case 4:
        return "OTP Validation Successful!";
      case 5:
        return "Password Change Successful!";
      default:
        return "Unknown";
    }
  };


  const handleQuestion = (e) => {
    // console.log(e.target.checked);
    // console.log("111111111111", openData);
    if (openData.qustId1 && openData.qustId2) {
      setSecretQues(!secretQues)
    } else {
      return;
    }

  }


  //   const handleOtp = async (e) => {
  //     console.log("wwwww",openData);
  //     if (openData.newPwd === "" || openData.confpass === "") {
  //       setPasswordMatchError("Please fill in both password fields");
  //       console.log("ggggg");
  //       return; // Prevent form submission if password fields are empty
  //     }else if (openData.newPwd !== openData.confpass) {
  //       setPasswordMatchError("Passwords do not match");
  //       console.log("hhhh");
  //       return; // Prevent form submission if passwords don't match
  //     }else{

  //     set_caseState(1);
  //     setOtp(!otp);
  //     let otpChngDtlObj =
  //     {
  //       apiId: "SUA00517",
  //       mst: {
  //         otpTypCd: "T0003"
  //       }
  //     }

  //     axios
  //       .post(
  //         process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/getOtpOptnChngDtl",
  //         otpChngDtlObj,
  //         {
  //           headers,
  //         }
  //       )
  //       .then((res) => {
  //         const modifiedData = { ...res.data.content.mst };
  //         if (res.data?.content?.mst) {
  //           // modifiedData.dob = getDateFormart_ddmmyyyy(res.data?.content?.mst?.dob);
  //           set_otpOptn({ ...otpOptn, ...res.data?.content?.mst })
  //         } else {
  //           // modifiedData.dob = "";
  //         }
  //         // setMsg(
  //         //   res.data?.appMsgList?.list[0]?.errDesc
  //         //     ? res.data?.appMsgList?.list[0]?.errDesc +
  //         //     " (" +
  //         //     res.data?.appMsgList?.list[0]?.errCd +
  //         //     ")"
  //         //     : ""
  //         // );
  //         // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
  //         // set_errExp({ status: res.data?.appMsgList?.errorStatus })
  //       });
  //     }
  //   }


  const handleFlgChng = (e, name) => {
    console.log(e.target.checked);
    if (name === "otpEmailFlg") {
      set_otpOptn({
        ...otpOptn,
        otpEmailFlg: e.target.checked ? "Y" : "N"
      }); // Disable OTP
    } else if (name === "otpMobFlg") {
      set_otpOptn({
        ...otpOptn,
        otpMobFlg: e.target.checked ? "Y" : "N"
      }); // Disable Secret Question
    }

  }

  function handleToggle(e, name) {
    console.log(e);
    if (openData.newPwd === "" || openData.confpass === "") {
      setPasswordMatchError("Please fill in both password fields");
      return; // Prevent form submission if password fields are empty
    }
    if (openData.newPwd !== openData.confpass) {
      setPasswordMatchError("Passwords do not match");
      return; // Prevent form submission if passwords don't match
    }
    if (name === "secretQues") {
      setOtp(false); // Disable OTP
    } else if (name === "Otp") {
      setSecretQues(false); // Disable Secret Question
    }
  }




  const [dialogOpen, setDialogOpen] = useState(false);


  const closeDialog = () => {
    setDialogOpen(false);
    set_changeBtn(false)
    set_msgCase(0)
  };



  const handle_confirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/AU/generateOtp',
      obj,
      { headers })
  }
  const handle_Emailconfirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/AU/generateEmailOtpConf',
      obj,
      { headers })
  }
  const handle_Mobconfirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135//Web/AU/generateMobOtpConf',
      obj,
      { headers })
  }

  const handle_getOtpOptnChngLogNo = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/AU/getOtpOptnChngLogNo', obj, { headers })
  }



  const resendOTP = () => {
    // setMinutes(2);
    // setSeconds(59);
    if (otpOptn.otpMobFlg === "Y") {
      set_msgCase(1)
    } else if (otpOptn.otpEmailFlg === "Y") {
      set_msgCase(2)
    } else if (otpOptn.otpMobFlg === "Y" && otpOptn.otpEmailFlg === "Y") {
      set_msgCase(3)
    }
    const conf_obj = {
      "apiId": "SUA00649",
      "mst": {
        "appId": "",
        "mobRegNo": "",
        "optnChngLogNo": chngLogNo,
        "refApiId": "SUA00636",
        "toMailId": openData.emailId,
        "toMobNo": openData.mobNo
      }
    }
    handle_confirmation(conf_obj).then((res) => {
      if (res?.data?.appMsgList?.errorStatus === false) {
        setOpenData({ ...openData, ...res.data?.content?.mst })
        // set_otpOptn({ ...otpOptn, genOpt: true })
        set_caseState(2);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
          set_otpOptn({ ...otpOptn, vldbtn: false })
          setDialogOpen(true)
          // resetForm();
          // setMinutes(2);
          // setSeconds(59);
        }
      }
    })
  };

  const [errorMsg, set_errorMsg] = useState("")
  const handleSendOtp = async (e) => {
    // console.log(caseState);
    // console.log(otpOptn);
    // set_caseState(2)
    // return;
    if ((!openData.emailId) && (!openData.mobNo)) {
      set_errorMsg("First Fill Mobile No")
      return;
    }

if (caseState=== 0){
  let obj = {
    apiId: "SUA00651",
    mst: {
      otpTypCd: "T0004"
    }
  }
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/getOtpOptnChngDtl", obj, { headers })
    .then((res) => {
      if (res.data.content.mst) {
        // setShowPage(res.data.content.mst)
        set_otpOptn({ ...otpOptn, ...res.data.content.mst })
        if (res.data?.content?.mst?.otpMobFlg === "Y") {
          set_msgCase(1)
          set_caseState(1)
          set_otpOptn({...otpOptn, process:true})
        } else if (res.data?.content?.mst?.otpEmailFlg === "Y") {
          set_msgCase(2)
          set_caseState(1)
          set_otpOptn({...otpOptn, process:true})
        } else if (res.data?.content?.mst?.otpMobFlg === "Y" && res.data?.content?.mst?.otpEmailFlg === "Y") {
          set_msgCase(3)
          set_caseState(1)
          set_otpOptn({...otpOptn, process:true})
        }
      }
      // setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
      //     res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
      // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      // set_errExp({ status: res.data?.appMsgList?.errorStatus });
    })
}




    if (caseState === 1) {
      let checkUserObj =
      {
        apiId: "SUA00629",
        mst: {
          emailId: openData.emailId,
          mobNo: openData.mobNo,
          userId: openData.userId,
          userPwd: openData.userPwd
        }
      }

      axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/IU/checkUserForEnableMobileLogin", checkUserObj, { headers, }).then((res) => {
        // const modifiedData = { ...res.data.content.mst };
        if (res.data?.appMsgList?.errorStatus === false) {

          let otpChngLogObj =
          {
            apiId: "SUA00652",
            mst: {
              appId: "",
              emailId: openData.emailId,
              mobNo: openData.mobNo,
              otpEmailFlg: otpOptn?.otpEmailFlg,
              otpMobFlg: otpOptn?.otpMobFlg,
              otpOptnChngFlg: otpOptn?.userOptnSelFlg,
              otpTypCd: "T0004",
              refApiId: "SUA00636" //saveEdit
            }
          }
          handle_getOtpOptnChngLogNo(otpChngLogObj).then((res1) => {
            if (res1.data?.content?.mst) {
              chngLogNo = res1.data?.content?.mst?.optnChngLogNo
              const genOtp_obj = {
                apiId: "SUA00649",
                mst: {
                  appId: "",
                  mobRegNo: "",
                  optnChngLogNo: chngLogNo,
                  refApiId: "SUA00636",
                  toMailId: openData.emailId,
                  toMobNo: openData.mobNo
                }
              }
              setLoading({
                ...loading,
                genOtp: true
              });
              console.log(genOtp_obj, chngLogNo, "mmmmmmmmmmm");
              handle_confirmation(genOtp_obj).then((res) => {
                if (res?.data?.appMsgList?.errorStatus === false) {
                  setOpenData({ ...openData, ...res.data?.content?.mst })
                  set_otpOptn({ ...otpOptn, genOpt: true })
                  set_caseState(2);
                  setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                  setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                  set_errExp({ status: res.data?.appMsgList?.errorStatus })
                  if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
                    setDialogOpen(true);
                    // resetForm();
                    // setMinutes(2);
                    // setSeconds(59);
                    // setSeconds(60)
                    setLoading({
                      ...loading,
                      genOtp: false
                    });
                  }
                }
              })

            }
          })

        }
      });
    }





    if (caseState === 2) {
      let otpValid = {
        "apiId": "SUA00650",
        "mst": {
          "refApiId": "SUA00636", //saveEdit
          "appId": "",
          "mobRegNo": "",
          "optnChngLogNo": chngLogNo,
          "toMailId": openData.emailId,
          "toMobNo": openData.mobNo,
          "validateEmailOtp": openData?.validateEmailOtp || "",
          "validateMobOtp": openData?.validateMobOtp || ""
        }
      }
      setLoading({
        ...loading,
        genOtp: true
      });
      axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/validateOtp", otpValid, { headers, }).then((res) => {
        if (!res.data?.appMsgList?.list[0]?.errorStatus) {
          setDialogOpen(true);
          set_msgCase(4)
          set_otpOptn({ ...otpOptn, vldbtn: true })
          setLoading({
            ...loading,
            genOtp: false
          });

        } else {
        }
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc ? res.data?.appMsgList?.list[0]?.errDesc + " (" + res.data?.appMsgList?.list[0]?.errCd + ")" : "");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      });
    }
  }







  const handleSelectChange = (event) => {
    console.log(event.target);
    const { name, value, selectedIndex } = event.target;
    const selectedLabel = event.target[selectedIndex].text;
    setOpenData({
      ...openData,
      [name]: value,
      [name.replace("Id", "Desc")]: selectedLabel // Update the label state
    });

  };
  console.log(openData);

  //handle the value of input field when changes happen
  const handleInputChange = (event) => {
    console.log(event.target.name, event.target.value);
    const { name, value } = event.target;
    if (name === "mobNo") {
      set_errorMsg("")
    }
    setOpenData({
      ...openData,
      [event.target.name]: event.target.value,
    });
    // if (name === "confpass" && value && value === openData.newPwd) {
    //     set_otpOptn({ ...otpOptn, choosValue: true });
    // }
    if (openData.validateMobOtp || openData.validateEmailOtp) {
      set_otpOptn({ ...otpOptn, vldbtn: false })
    }
  };

  // useEffect(() => {
  //     if (openData.ansDesc1 && openData.ansDesc2) {
  //         set_changeBtn(false)
  //     }


  // }, [openData])

  console.log(openData);

  function postDataToAPI(event) {
    event.preventDefault();

    let postObj = {
      apiId: "SUA00630",
      mst: {
        emailId: openData.emailId,
        mobNo: openData.mobNo,
        optnChngLogNo: chngLogNo,
        userId: openData.userId,
        userPwd: openData.userPwd
      }
    };
    axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/IU/saveEnableMobileLogin", postObj, { headers })
      .then((res) => {
        console.log("POST Request Success:", res.data);
        if (res.data?.appMsgList?.errorStatus === false) {
          let emailconf_obj = {
            apiId: "SUA00654",
            mst: {
              colNm: res.data?.content?.mst?.colEmailOtp,
              emailOtpLogNo: openData.emailOtpLogNo,
              keyStr: res.data?.content?.mst?.keyStr,
              keyStrVal: res.data?.content?.mst?.keyStrVal,
              tbNm: res.data?.content?.mst?.tabNm
            }
          }
          let mobconf_obj = {
            apiId: "SUA00653",
            mst: {
              colNm: res.data?.content?.mst?.colMobOtp,
              keyStr: res.data?.content?.mst?.keyStr,
              keyStrVal: res.data?.content?.mst?.keyStrVal,
              mobOtpLogNo: openData.mobOtpLogNo,
              tbNm: res.data?.content?.mst?.tabNm
            }
          }
          if (otpOptn.otpEmailFlg === "Y") {
            handle_Emailconfirmation(emailconf_obj).then((res) => {
              if (res?.data?.appMsgList?.errorStatus === false) {
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
                  // resetForm();
                }
              }
            })
          }

          if (otpOptn.otpMobFlg === "Y") {
            handle_Mobconfirmation(mobconf_obj).then((res) => {
              if (res?.data?.appMsgList?.errorStatus === false) {
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000005") {
                  // resetForm();
                }
              }
            })
          }
          if (res.data?.appMsgList?.list[0]?.errCd === "CMAI000005") {
            set_msgCase(5);
            setDialogOpen(true)
          }
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
      })
      .catch((error) => {
        console.error("POST Request Error:", error);
      }).finally(() => {
        set_viewMsg(true);
        resetForm()
      });
  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])


  const resetForm = () => {
    setOpenData({
      userPwd: "",
      emailId: "",
      mobNo: "",
      optnChngLogNo: "",
      validateEmailOtp: "",
      validateMobOtp: ""
    })
    setSecretQues(false)
    setOtp(false)
    set_otpOptn({
      ...otpOptn,
      process:false,
      genOpt: false,
      choosValue: false,
      resendEnbl: false,
      resendTimer: null,
      vldbtn: true
    })
    set_caseState(0)
    
    // fetchOpenData()
  }


  return (

    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enable Mobile Login</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Enable Page
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              SUF00033_03
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          {/* <Link to="#" className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add Account
          </Link>
          <Link to="#" className="btn btn-success btn-icon text-white">
            <span>
              <i className="fe fe-log-in"></i>&nbsp;
            </span>
            Export
          </Link> */}
        </div>
      </div>
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Body>

              <Row>
                <div className="col-lg-12 col-md-12">
                  <form className="form-horizontal" onSubmit={postDataToAPI}>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        User Id:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="text"
                          className="form-control ui_entry_pwd_r"
                          // password="true"
                          name="userId"
                          placeholder=""
                          //   required
                          readOnly
                          onChange={handleInputChange}
                          value={openData.userId}
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        User Password:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="password"
                          className="form-control"
                          autocomplete="off"
                          // password="true"
                          name="userPwd"
                          placeholder=""
                          required
                          onChange={handleInputChange}
                          value={openData.userPwd}
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        Email Id:
                      </label>
                      <div className="col-md-9">
                        <input
                          type="email"
                          className="form-control"
                          // password="true"
                          name="emailId"
                          placeholder=""
                          //   required
                          onChange={handleInputChange}
                          value={openData.emailId}
                        />
                        {/* {passwordMatchError && <span className="text-danger">{passwordMatchError}</span>} */}

                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        Mobile No:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input style={{ border: errorMsg ? "1px solid red" : "" }}
                          type="text"
                          className="form-control"
                          // password="true"
                          name="mobNo"
                          placeholder=""
                          //   required
                          onChange={handleInputChange}
                          value={openData.mobNo}
                        />
                        {/* {passwordMatchError && <span className="text-danger">{passwordMatchError}</span>} */}

                      </div>
                    </div>

                    {otpOptn && otpOptn.userOptnSelFlg === "Y" && <div className="row mb-4 mt-0">
                      {/* <div className="card-body mt-0"> */}
                      {otpOptn.process && <div className="row mb-4 d-flex justify-content-center">
                        <div className="form-check form-switch col-md-3 mt-1">
                          <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpEmailFlg" checked={otpOptn.otpEmailFlg === "Y"} onChange={(e) => handleFlgChng(e, "otpEmailFlg")} />
                          <label className="form-check-label" style={{ marginLeft: "30%" }} >Email OTP</label>
                        </div>
                        <div className="form-check form-switch col-md-3 mt-1">
                          <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpMobFlg" checked={otpOptn.otpMobFlg === "Y"} onChange={(e) => handleFlgChng(e, "otpMobFlg")} />
                          <label className="form-check-label" style={{ marginLeft: "30%" }} >Mobile OTP</label>
                        </div>
                      </div>}





                    </div>}

                    {otpOptn?.genOpt && <>
                      {otpOptn.otpEmailFlg === "Y" && <div className="row mb-4">
                        <label className="col-md-3 form-label">Email OTP:</label>
                        <div className="col-md-9">
                          <input className="form-control" name="validateMobOtp" type="password" value={openData.validateEmailOtp} onChange={handleInputChange} />
                        </div>
                      </div>}


                      {/* Mobile otp input */}
                      {otpOptn.otpMobFlg === "Y" && <div className="row mb-4">
                        <label className="col-md-3 form-label">Mobile OTP:</label>
                        <div className="col-md-9">
                          <input className="form-control" name="validateMobOtp" type="password" value={openData.validateMobOtp} onChange={handleInputChange} />
                        </div>
                      </div>}
                    </>}


                    {errorMsg && <div className="text-red text-center mb-4">{errorMsg}</div>}
                    <div className="text-center">
                      <button className="btn btn-primary" type="button" disabled={caseState === 2 ? otpOptn.vldbtn : false} onClick={(e) => handleSendOtp(e)}>{loading.genOpt ? "...Loading" : buttonTitle()}</button>
                    </div>
                    {caseState === 2 && <button className="btn btn-primary d-md-flex mx-auto justify-content-md-center col-md-5" disabled={otpOptn.vldbtn}
                      onClick={resendOTP} type="button"><ReplayIcon />&nbsp; Resend &nbsp;

                    </button>}


                    <button className="btn btn-primary me-2" disabled={changeBtn} type="submit">Save</button>
                    <button className="btn btn-secondary me-2" type="button" onClick={resetForm}>Cancel</button>
                  </form>
                </div>
              </Row>

            </Card.Body>
          </Card>
        </div>
      </Row>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle sx={{ m: 1, p: 2 }} >


          <IconButton
            aria-label="close"
            onClick={closeDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="text-center">
              <i className="fe fe-check-circle fs-100 text-success lh-1 mb-4 d-inline-block"></i>
              <h4 className="text-success text-center mb-4">{dialogMsg()}</h4>
            </div>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
export default EnblMobLogin;