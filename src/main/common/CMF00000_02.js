import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./common";
import axios from "axios";
import MsgAlert from "./MsgAlert";
import { getApiToken } from "./common"
import { getScplAdContext } from "./common"
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
import * as formelement from "../../data/Form/formelement/formelement";
import { Dialog, DialogContent, DialogTitle, DialogContentText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const headers = { Authorization: "Bearer " + getApiToken() };
let chngLogNo = ""
export default function ChangePassword() {
  const appLogNo= getScplAdContext().appLogNo;

  const navigate = useNavigate()
  // const [otp, set_otp] = useState({
  //   otp:true,
  //   secretQues:true
  // })

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
    genOpt: false,
    choosValue: false,
    resendEnbl: false,
    resendTimer: null,
    vldbtn: true
  })
  const [caseState, set_caseState] = useState(0)
  const [msgCase, set_msgCase] = useState(0)
  const [changeBtn, set_changeBtn] = useState(true)
  const [evntMsg, set_evntMsg] = useState({
    msgView: false,
    fieldDisbl: false
  })
  const [openData, setOpenData] = useState({
    userId: "",
    qustId1: "",
    qustId2: "",
    emailId: "",
    mobNo: "",
    newPwd: "",
    confpass: "",
    validateEmailOtp: "",
    validateMobOtp: ""

  });
  const [resendOtpFlag, set_resendOtpFlag] = useState(false)


  // Expire Msg timer
  const [otpSeconds, set_otpSeconds] = useState(59);
  const [otpMinutes, set_otpMinutes] = useState(4);

  var otpTimer;
  useEffect(() => {
    const otpTimer = setInterval(() => {
      if (otpSeconds > 0) {
        set_otpSeconds(otpSeconds - 1);
      } else {
        if (otpMinutes > 0) {
          set_otpMinutes(otpMinutes - 1);
          set_otpSeconds(59);
        } else {
          // Timer reached 00:00, stop the timer
          clearInterval(otpTimer);
        }
      }
    }, 1000);

    return () => clearInterval(otpTimer);
  }, [otpSeconds, otpMinutes]);




  // Resend Button Timer
  const [seconds, set_seconds] = useState(0);
  const [minutes, set_minutes] = useState(0);

  var timer;
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        set_seconds(seconds - 1)
      } else {
        if (minutes > 0) {
          set_minutes(minutes - 1)
          set_seconds(59)
        } else {
          clearInterval(timer)
        }
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [seconds, minutes])







  let openFormObj = {
    apiId: "SUA00528",
    mst: {

      userId: userId
    }
  };
  useEffect(() => {
    console.log(headers);

    const fetchOpenData = async () => {
      axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/pwdChgOpenEditForm",
          openFormObj,
          {
            headers,
          }
        )
        .then((res) => {
          if (res.data?.content?.mst) {
            const updatedOpenData = {
              ...res.data.content.mst,
              newPwd: "",
              confpass: "",
              oldPwd: ""
            };
            setOpenData(updatedOpenData);
          } else {
            // modifiedData.dob = "";
          }
          setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
              " (" +
              res.data?.appMsgList?.list[0]?.errCd +
              ")"
              : ""
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({ status: res.data?.appMsgList?.errorStatus })
        });
    };

    fetchOpenData();
  }, [userId]);
  //Form open api end

  // dropDownTest.....
  useEffect(() => {
    if (openData.qustId1) {
      const selectedQuestion = openData.ddSecretQuesInfo.find(item => item.value === openData.qustId1);
      if (selectedQuestion) {
        setOpenData({
          ...openData,
          qustId1: openData.qustId1,
          quesDesc1: selectedQuestion.label
        });
      }
    } else if (openData.qustId2) {
      const selectedQuestion = openData.ddSecretQuesInfo.find(item => item.value === openData.qustId2);
      if (selectedQuestion) {
        setOpenData({
          ...openData,
          qustId2: openData.qustId2,
          quesDesc2: selectedQuestion.label
        });
      }
    }
  }, [openData.qustId1, openData.qustId2, openData.ddSecretQuesInfo])






  const buttonTitle = () => {
    // Dynamically determine button title based on case state
    switch (caseState) {
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
      case 6:
        return "OTP is Invalid!";
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


  const handleOtp = async (e) => {
    console.log("wwwww", openData);
    if (openData.newPwd === "" || openData.confpass === "") {
      setPasswordMatchError("Please fill in both password fields");
      console.log("ggggg");
      return; // Prevent form submission if password fields are empty
    } else if (openData.newPwd !== openData.confpass) {
      setPasswordMatchError("Passwords do not match");
      console.log("hhhh");
      return; // Prevent form submission if passwords don't match
    } else {

      set_caseState(1);
      setOtp(!otp);
      let otpChngDtlObj =
      {
        apiId: "SUA00651",
        mst: {
          otpTypCd: "T0006"
        }
      }

      axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/getOtpOptnChngDtl",
          otpChngDtlObj,
          {
            headers,
          }
        )
        .then((res) => {
          const modifiedData = { ...res.data.content.mst };
          if (res.data?.content?.mst) {
            // modifiedData.dob = getDateFormart_ddmmyyyy(res.data?.content?.mst?.dob);
            set_otpOptn({ ...otpOptn, ...res.data?.content?.mst })
            set_msgCase(0)
          } else {
            // modifiedData.dob = "";
          }
          // setMsg(
          //   res.data?.appMsgList?.list[0]?.errDesc
          //     ? res.data?.appMsgList?.list[0]?.errDesc +
          //     " (" +
          //     res.data?.appMsgList?.list[0]?.errCd +
          //     ")"
          //     : ""
          // );
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          // set_errExp({ status: res.data?.appMsgList?.errorStatus })
        });
    }
  }


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
    handleSignOut()

  };

const handleSignOut = async()=>{
  let obj={
    appLogNo: appLogNo
  }
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/token/saveLogoutInfo", obj)
  .then((res) => {
      if (res.data?.appMsgList?.errorStatus === false) {
        navigate(process.env.PUBLIC_URL + "/")

      }
      
  })
}

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
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/AU/generateMobOtpConf',
      obj,
      { headers })
  }



  const resendOTP = () => {
    // setMinutes(2);
    // setSeconds(59);
    if (seconds > 0) {
      return;
    }
    if (otpOptn.otpMobFlg === "Y" && otpOptn.otpEmailFlg === "Y") {
      set_msgCase(3)
    } else if (otpOptn.otpEmailFlg === "Y") {
      set_msgCase(2)
    } else if (otpOptn.otpMobFlg === "Y") {
      set_msgCase(1)
    }
    const conf_obj = {
      "apiId": "SUA00649",
      "mst": {
        "appId": "",
        "mobRegNo": "",
        "optnChngLogNo": chngLogNo,
        "refApiId": "SUA00530",
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
        set_resendOtpFlag(true)
        set_otpSeconds(59);
        set_otpMinutes(4);
        set_seconds(60);
        set_minutes(0)
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
          set_otpOptn({ ...otpOptn, vldbtn: false })
          // setDialogOpen(true)
          set_evntMsg({ ...evntMsg, msgView: true })

          // resetForm();
          // setMinutes(2);
          // setSeconds(59);
        }
      }
    })
  };


  const handleSendOtp = async (e) => {
    console.log(caseState);
    console.log(otpOptn);
    set_caseState(2)
    // return;

    if (otpOptn.otpMobFlg === "Y" && otpOptn.otpEmailFlg === "Y") {
      set_msgCase(3)
    } else if (otpOptn.otpEmailFlg === "Y") {
      set_msgCase(2)
    } else if (otpOptn.otpMobFlg === "Y") {
      set_msgCase(1)
    }


    let otpChngLogObj =
    {
      apiId: "SUA00652",
      mst: {
        appId: "",
        emailId: openData.emailId,
        mobNo: openData.mobNo,
        otpEmailFlg: otpOptn.otpEmailFlg,
        otpMobFlg: otpOptn.otpMobFlg,
        otpOptnChngFlg: otpOptn.userOptnSelFlg,
        otpTypCd: "T0006",
        refApiId: "SUA00530" //saveEdit
      }
    }

    let otpValid = {
      "apiId": "SUA00650",
      "mst": {
        "refApiId": "SUA00530", //saveEdit
        "appId": "",
        "mobRegNo": "",
        "optnChngLogNo": chngLogNo,
        "toMailId": openData.emailId,
        "toMobNo": openData.mobNo,
        "validateEmailOtp": openData?.validateEmailOtp || "",
        "validateMobOtp": openData?.validateMobOtp || ""
      }
    }

    if (caseState === 1) {
      const res1 = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/getOtpOptnChngLogNo", otpChngLogObj, { headers });
      if (res1.data?.content?.mst) {
        chngLogNo = res1.data?.content?.mst?.optnChngLogNo
        //set_getValidOtp(chngLogNo)


        const conf_obj = {
          "apiId": "SUA00649",
          "mst": {
            "appId": "",
            "mobRegNo": "",
            "optnChngLogNo": chngLogNo,
            "refApiId": "SUA00530",
            "toMailId": openData.emailId,
            "toMobNo": openData.mobNo
          }
        }
        console.log(conf_obj, chngLogNo, "mmmmmmmmmmm");
        handle_confirmation(conf_obj).then((res) => {
          if (res?.data?.appMsgList?.errorStatus === false) {
            setOpenData({ ...openData, ...res.data?.content?.mst })
            set_otpOptn({ ...otpOptn, genOpt: true })
            set_caseState(2);
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
            set_resendOtpFlag(true)
            set_otpSeconds(59);
            set_otpMinutes(4);
            set_seconds(60);
            set_minutes(0)
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
              // setDialogOpen(true);
              set_evntMsg({ ...evntMsg, msgView: true })
              // resetForm();
              // setMinutes(2);
              // setSeconds(59);
              // setSeconds(60)
            }
          }
        })

      } else {
      }



    }

    if (caseState === 2) {
      axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/AU/validateOtp", otpValid, { headers, }).then((res) => {
        if (res.data?.appMsgList?.errorStatus) {
          // setDialogOpen(true);
          set_msgCase(6)
          set_evntMsg({ ...evntMsg, fieldDisbl: true })
        }
        if (!res.data?.appMsgList?.errorStatus) {
          // setDialogOpen(true);
          set_msgCase(4)
          set_otpOptn({ ...otpOptn, vldbtn: true })
          set_evntMsg({ ...evntMsg, fieldDisbl: true })
          set_resendOtpFlag(false)
          set_changeBtn(false)

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
    setOpenData({
      ...openData,
      [event.target.name]: event.target.value,
    });
    if (name === "confpass" ) {
      setPasswordMatchError("")
    }
    if (openData.validateMobOtp || openData.validateEmailOtp) {
      set_otpOptn({ ...otpOptn, vldbtn: false })
    }
  };

  useEffect(() => {
    if (openData.ansDesc1 && openData.ansDesc2) {
      set_changeBtn(false)
    }


  }, [openData])

  console.log(openData);
  function postDataToAPI(event) {
    event.preventDefault();
    if (openData.newPwd !== openData.confpass) {
      setPasswordMatchError("Passwords do not match");
      return; // Prevent form submission if passwords don't match
    }
    let postObj = {
      apiId: "SUA00529",
      mst: {
        // otpOptlChngLogNo: chngLogNo,
        imgCd: "",
        loginFlg: "1",
        newPwd: openData.newPwd,
        oldPwd: openData.oldPwd,
        userId: userId,
        emailOtpLogNo: openData.emailOtpLogNo,
        mobOtpLogNo: openData.mobOtpLogNo,
      }
    };

    if (secretQues) {
      postObj.mst.usrSqansDtlInfo = [
        {
          ans: openData?.ansDesc1,
          quesDesc: openData?.quesDesc1,
          qustId: openData?.qustId1,
          quesSlNo: openData?.quesSlNo1
        },
        {
          ans: openData?.ansDesc2,
          quesDesc: openData?.quesDesc2,
          qustId: openData?.qustId2,
          quesSlNo: openData?.quesSlNo2
        }
      ];
      postObj.mst.vldTyp = "Q"
    } else {
      postObj.mst.usrSqansDtlInfo = [
        {
          ans: "",
          // quesDesc: openData?.quesDesc1,
          qustId: "",
          // quesSlNo: openData?.quesSlNo1
        },
      ];
      postObj.mst.vldTyp = setOtp ? "O" : "Q"
    }


    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/pwdChgSaveEdit",
        postObj,
        { headers }
      )
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

  const fetchOpenData = async () => {
    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/pwdChgOpenEditForm",
        openFormObj,
        {
          headers,
        }
      )
      .then((res) => {
        if (res.data?.content?.mst) {
          // modifiedData.dob = getDateFormart_ddmmyyyy(res.data?.content?.mst?.dob);
          setOpenData(res.data?.content?.mst)
        } else {
          // modifiedData.dob = "";
        }
        // setMsg(
        //   res.data?.appMsgList?.list[0]?.errDesc
        //     ? res.data?.appMsgList?.list[0]?.errDesc +
        //     " (" +
        //     res.data?.appMsgList?.list[0]?.errCd +
        //     ")"
        //     : ""
        // );
        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        // set_errExp({ status: res.data?.appMsgList?.errorStatus })
      });
  };
  const resetForm = () => {
    setPasswordMatchError("")
    setOpenData({
      userId: "",
      qustId1: "",
      qustId2: "",
      emailId: "",
      mobNo: "",
      confpass: "",
      validateEmailOtp: "",
      validateMobOtp: "",
      newPwd: "",
      oldPwd: "",


    })
    setSecretQues(false)
    setOtp(false)
    set_otpOptn({
      otpEmailFlg: "",
      otpMobFlg: "",
      userOptnSelFlg: "",
      genOpt: false,
      choosValue: false,
      resendEnbl: false,
      resendTimer: null,
      vldbtn: true
    })
    fetchOpenData()
    set_resendOtpFlag(true)
    set_otpSeconds(0);
    set_otpMinutes(0);
    set_seconds(0);
    set_minutes(0)
    set_evntMsg({
      fieldDisbl:false,
      msgView:false
    })
    // set_msgCase(0)
    setMsg("")
    setMsgTyp("")
    set_errExp({...errExp, status:""})
  }


  return (

    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Change Password</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Common
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Change Password
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
                        Old Password:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="password"
                          className="form-control ui_entry_pwd_r"
                          // password="true"
                          name="oldPwd"
                          placeholder="Old Password"
                          required
                          onChange={handleInputChange}
                          value={openData.oldPwd}
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        New Password:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="password"
                          className="form-control"
                          // password="true"
                          name="newPwd"
                          placeholder="New Password"
                          required
                          onChange={handleInputChange}
                          value={openData.newPwd}
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">
                        Confirm Password:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-9">
                        <input
                          type="password"
                          className="form-control"
                          // password="true"
                          name="confpass"
                          placeholder="Confirm Password"
                          required
                          onChange={handleInputChange}
                          value={openData.confpass}
                        />
                        {passwordMatchError && <span className="text-danger">{passwordMatchError}</span>}

                      </div>
                    </div>
                    {/* otpOptn.choosValue && */}
                    <div className="row mb-4">
                      <label className="col-md-3 form-label me-2 pr-2 pl-0">Choose an option to Verify it's you:</label>&nbsp;&nbsp;
                      {<><div className="form-check form-switch col-md-4 mt-1 pl-4">
                        <input className="form-check-input mx-1" type="checkbox" role="switch" name="secretQues" checked={secretQues} disabled={otp} onChange={(e) => { handleQuestion(e); handleToggle(e, "secretQues"); }} />
                        <label className="form-check-label" style={{ marginLeft: "20%" }} htmlFor="flexSwitchCheckDefault">Secret Question Answer</label>
                      </div>
                        <div className="form-check form-switch col-md-4 mt-1">
                          <input className="form-check-input mx-1" type="checkbox" role="switch" name="Otp" checked={otp} disabled={secretQues} onChange={(e) => { handleOtp(e); handleToggle(e, "Otp"); }} />
                          <label className="form-check-label" style={{ marginLeft: "20%" }} htmlFor="flexSwitchCheckChecked">OTP</label>
                        </div></>}
                    </div>

                    <div className="card-body">
                      {/* Secret Question  */}
                      {secretQues &&
                        <><div className=" row mb-4">
                          <label className="col-md-3 form-label">
                            Question(1): <span className="text-red">*</span>
                          </label>
                          <div className="col-sm-9 input-group">
                            <select
                              // required
                              className="from-group col-md-12 rounded-3 border"
                              aria-label="Default select example"
                              name="qustId1"
                              value={openData?.qustId1 || ""} // Provide a default value if it's undefined
                              onChange={handleSelectChange}
                            >
                              <option value="">Select an option</option>{" "}

                              {openData?.ddSecretQuesInfo?.map((item) => (
                                <option key={item.qustId} value={item.qustId} label={item.qustDesc}>
                                  {item.qustDesc}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                          <div className="row mb-4">
                            <label className="col-md-3 form-label">Answer<span className="text-red">*</span></label>
                            <div className="col-sm-9 input-group">
                              <input
                                className="form-control"
                                type="text"
                                id="exampleFormControlSelect1"
                                max={6}
                                // value={weight}
                                name="ansDesc1"
                                value={openData?.ansDesc1}
                                onChange={handleInputChange}
                                placeholder=""
                              />

                            </div>
                          </div>
                          <div className=" row mb-4">
                            <label className="col-md-3 form-label">
                              Question(2): <span className="text-red">*</span>
                            </label>
                            <div className="col-sm-9 input-group">
                              <select
                                // required
                                className="from-group col-md-12 rounded-3 border"
                                aria-label="Default select example"
                                name="qustId2"
                                value={openData?.qustId2 || ""} // Provide a default value if it's undefined
                                onChange={handleSelectChange}
                              >
                                <option value="">Select an option</option>{" "}

                                {openData?.ddSecretQuesInfo?.map((option) => (
                                  <option key={option.qustId} value={option.qustId}>
                                    {option.qustDesc}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row mb-4">
                            <label className="col-md-3 form-label">Answer<span className="text-red">*</span></label>
                            <div className="col-sm-9 input-group">
                              <input
                                className="form-control"
                                type="text"
                                id="exampleFormControlSelect1"
                                max={6}
                                // value={weight}
                                name="ansDesc2"
                                value={openData?.ansDesc2}
                                onChange={handleInputChange}
                                placeholder=""
                              />

                            </div>
                          </div></>}

                      {/* OTP optin choose */}
                      {otp && otpOptn.userOptnSelFlg === "Y" && <div className="row mb-4 mt-0">
                        {/* <div className="card-body mt-0"> */}
                        <div className="row mb-4 d-flex justify-content-center">
                          <div className="form-check form-switch col-md-3 mt-1">
                            <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpEmailFlg" checked={otpOptn.otpEmailFlg === "Y"} onChange={(e) => handleFlgChng(e, "otpEmailFlg")} />
                            <label className="form-check-label" style={{ marginLeft: "30%" }} >Email OTP</label>
                          </div>
                          <div className="form-check form-switch col-md-3 mt-1">
                            <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpMobFlg" checked={otpOptn.otpMobFlg === "Y"} onChange={(e) => handleFlgChng(e, "otpMobFlg")} />
                            <label className="form-check-label" style={{ marginLeft: "30%" }} >Mobile OTP</label>
                          </div>
                        </div>





                      </div>}
                      {/* Mobile otp input */}
                      {otpOptn?.genOpt && <>
                        {otpOptn.otpMobFlg === "Y" && <div className="row mb-4">
                          <label className="col-md-3 form-label">Mobile OTP:</label>
                          <div className="col-md-9">
                            <input className="form-control" name="validateMobOtp" type="text" max={6} value={openData.validateMobOtp} disabled={evntMsg.fieldDisbl} onChange={handleInputChange} />
                          </div>
                        </div>}


                        {/* Email otp input */}

                        {otpOptn.otpEmailFlg === "Y" && <div className="row mb-4">
                          <label className="col-md-3 form-label">Email OTP:</label>
                          <div className="col-md-9">
                            <input className="form-control" name="validateEmailOtp" type="text" max={6} value={openData.validateEmailOtp} disabled={evntMsg.fieldDisbl} onChange={handleInputChange} />
                          </div>
                        </div>}
                      </>}



                      {otp && <div className="row mb-4 mx-auto">
                        {evntMsg.msgView && <div className="text-red text-center mb-4">{dialogMsg()}</div>}
                        {(resendOtpFlag) && <div className="text-center"><span className="text-red">OTP will be Expired in</span> {otpMinutes < 10 ? "0" + otpMinutes : otpMinutes}:{otpSeconds < 10 ? "0" + otpSeconds : otpSeconds}</div>}
                        {(!evntMsg.fieldDisbl) && <button className="btn btn-primary d-md-flex justify-content-md-center col-md-5 mx-auto" disabled={caseState === 2 ? otpOptn.vldbtn : false} type="button" onClick={(e) => { handleSendOtp(e) }} ><i className="fe fe-upload fa-2x " />&nbsp; {buttonTitle()}</button>} &nbsp;&nbsp;
                        {caseState === 2 && ((!evntMsg.fieldDisbl) && <button className="btn btn-primary d-md-flex mx-auto justify-content-md-center col-md-5" 
                          // style={{
                          //   color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630"
                          // }}
                          onClick={resendOTP} type="button"><ReplayIcon />&nbsp; Resend &nbsp; {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                          {/* {seconds > 0 || minutes > 0 && (minutes < 10 ? `0${minutes}` : minutes + ":")}
                            {seconds > 0 || minutes > 0 && (seconds < 10 ? `0${seconds}` : seconds)} */}

                        </button>)}
                      </div>}
                    </div>


                    {/* <div className="row mb-4  d-md-flex justify-content-md-center">
                      <button className="btn btn-primary col-md-2">Verification</button>
                    </div> */}

                    <button className="btn btn-primary me-2" disabled={changeBtn} type="submit">Change</button>
                    <button className="btn btn-secondary me-2" type="reset" onClick={resetForm}>Cancel</button>
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
