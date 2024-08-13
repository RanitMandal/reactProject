import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Tabs, Tab } from "react-bootstrap";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { removeApiToken, setApiToken } from "./common"
import { setScplAdContext } from "./common"
import { removeScplAdContext } from "./common"
import ReplayIcon from '@mui/icons-material/Replay';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MsgAlert from "./MsgAlert";
import Countdown from "react-countdown";

//import {isAutenticated} from "./common"
let chngLogNo = ""
export default function VMSLogin() {
    const [resendOtpFlag, set_resendOtpFlag] = useState(false)

    // const Completionist = () => {
    //   set_resendOtpFlag(true);
    //   setMsg('Previous OTP got expired, please click on "Resend OTP" button to get new one')
    // }

    // Renderer callback with condition
    // const renderer = ({ minutes, seconds, completed }) => {
    //   // if(otpOptn.timer){
    //   if (completed) {
    //     // Render a complete state
    //     return <Completionist />;
    //   } else {
    //     // Render a countdown
    //     return (
    //       <span>
    //         {minutes}:{seconds}
    //       </span>
    //     );
    //   }
    // // }
    // };

    // useEffect(() => {
    //   console.log("33333",otpOptn.otpTimer);
    // }, [otpOptn?.otpTimer])


    //  const renderer = useCallback(
    //   ({ minutes, seconds, completed }) => {
    //     if (completed) {
    //       // Render a complete state
    //       return <Completionist />;
    //     } else {
    //       // Render a countdown
    //       return (
    //         <span>
    //           {minutes}:{seconds}
    //         </span>
    //       );
    //     }
    //   },
    //   [otpOptn?.otpTimer===true],
    // )
    //kor
    // const ResendRenderer = ({ minutes, seconds, completed }) => {
    //   if (completed) {
    //     // Render a complete state
    //     return <Completionist />;
    //   } else {
    //     // Render a countdown
    //     return (
    //       <span>
    //         {minutes}:{seconds}
    //         {/* ( {seconds} sec) */}
    //       </span>
    //     );
    //   }
    // };



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
    const [seconds, set_seconds] = useState(59);
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



    const [errorMsgUserId, set_errorMsgUserId] = useState("")
    const [evntMsg, set_evntMsg] = useState(false)
    const [changeBtn, set_changeBtn] = useState({
        vldtCheck: false,
        emailOtp: false,
        mobOtp: false
    })

    removeScplAdContext();
    removeApiToken();
    sessionStorage.removeItem("modId");
    sessionStorage.removeItem("menuTree");
    sessionStorage.removeItem("modules");
    // sessionStorage.removeItem("currentLvlRef");
    sessionStorage.removeItem("lvlRefCd");
    sessionStorage.removeItem("currentLvlRefNm");
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        ipAddress: "",
        username: "",
        password: "",
        emailId: "",
        mobNo: "",
        optnChngLogNo: "",
        emailOtp: "",
        mobileOtp: "",
        emailOtpLogNo: "",
        mobOtpLogNo: "",
        validateMobOtp: "",
        validateEmailOtp: ""
    });

    const [loading, setLoading] = useState({
        otpOptn: true,
        genOtp: false,
    })

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setFormData({ ...formData, ipAddress: data.ip })
            )
            .catch(error => console.log(error))
    },
        []);







    // For Mobile Otp Login Code Start...............................
    const [otpOptn, set_otpOptn] = useState({
        genOpt: false,
        choosValue: false,
        resendEnbl: false,
        resendTimer: false,
        otpTimer: false,
        vldbtn: true,
        // otpEmailFlg: "N",
        process: false
    })


    //Form open api calling
    const [showPage, setShowPage] = useState(true);
    const [otpTypCd, setOtpTypCd] = useState("T0002");
    useEffect(() => {

        const getOtpOptnChngDtl = async () => {
            // setLoading({...loading, otpOptn:true})
            let obj = {
                apiId: "SUA00517",
                mst: {
                    otpTypCd: otpTypCd
                }
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/getOtpOptnChngDtl", obj)
                .then((res) => {
                    if (res.data?.content?.mst) {
                        // setShowPage(res.data.content.mst)
                        set_otpOptn({ ...otpOptn, ...res.data?.content?.mst })
                        setShowPage(false)
                        setLoading({ ...loading, otpOptn: false })
                        if (res.data?.content?.mst?.otpMobFlg === "Y" && res.data?.content?.mst?.otpEmailFlg === "Y") {
                            set_msgCase(3)
                        } else if (res.data?.content?.mst?.otpEmailFlg === "Y") {
                            set_msgCase(2)
                        } else if (res.data?.content?.mst?.otpMobFlg === "Y") {
                            set_msgCase(1)
                        }
                    }
                })

        }
        showPage && getOtpOptnChngDtl();
    }, [showPage, otpTypCd]);


    //Form open api end
    const handleFlgChng = async (e, type, name) => {
        console.log(e.target.checked);
        if (name === "otpEmailFlg") {
            if ((formData.mobNo.length === 10)) {
                set_otpOptn({
                    ...otpOptn,
                    otpEmailFlg: e.target.checked ? "Y" : "N"
                });
            } else {
                return;
            }
        } else if (name === "otpMobFlg") {
            set_otpOptn({
                ...otpOptn,
                otpMobFlg: e.target.checked ? "Y" : "N"
            }); // Disable Secret Question
        }




    }

    const [dialogOpen, setDialogOpen] = useState(false);


    const closeDialog = () => {
        setDialogOpen(false);
        set_changeBtn(false)
        set_msgCase(0)
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
                return "OTP Is Invalid";
            case 6:
                return "Network Error";
            default:
                return "Unknown";
        }
    };


    const handle_confirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/UA/generateOtp',
            obj,)
    }
    const handle_Emailconfirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/UA/generateEmailOtpConf',
            obj,)
    }
    const handle_Mobconfirmation = async (obj) => {
        return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00135/Web/UA/generateMobOtpConf',
            obj,)
    }

    const buttonTitle = () => {
        // Dynamically determine button title based on case state
        switch (caseState) {
            case 0:
                return "Proceed";
            case 1:
                return "Generate OTP";
            case 2:
                return "Validate OTP";
            case 3:
                return "Login";
            default:
                return "Unknown";
        }
    };





    const [caseState, set_caseState] = useState(0)
    const [msgCase, set_msgCase] = useState(0)

    const [errorMsg, set_errorMsg] = useState({ mobNo: "", VldtMsg: "" })
    const handleSendOtp = async (e, name) => {
        set_otpOptn({ ...otpOptn, otpTimer: false, resendTimer: false })
        console.log("llllll", otpOptn);
        if (otpOptn?.otpMobFlg === "Y" && otpOptn?.otpEmailFlg === "Y") {
            set_msgCase(3)
        } else if (otpOptn?.otpEmailFlg === "Y") {
            set_msgCase(2)
        } else if (otpOptn?.otpMobFlg === "Y") {
            set_msgCase(1)
        }
        set_evntMsg(false)

        if (!formData.mobNo) {
            set_errorMsg({ ...errorMsg, mobNo: "First Fill Mobile No" })
            return;
        } else if (formData.mobNo.length !== 10) {
            set_errorMsg({ ...errorMsg, mobNo: "your given mobile number is less than 10 digit" })
            return;
        }

        if (caseState === 0) {

            let obj = {
                apiId: "SUA00657",
                mst: {
                    mobNo: name === "IU" ? formData.mobNo : undefined,
                    regMobNo: name === "EU" ? formData.mobNo : undefined,
                }
            }
            let formId =  "SUF00150"
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + `/${formId}/${name}/getUserEmailByMobNo`, obj)
                .then((res) => {
                    if (res.data?.appMsgList?.errorStatus === false) {
                        if (name === "EU") {
                            setFormData({
                                ...formData,
                                emailId: res.data?.content?.mst?.emailId
                            })
                        } else {
                            setFormData({
                                ...formData,
                                emailId: res.data?.content?.mst?.mailId,
                                dummyUserFlg: res.data?.content?.mst?.dummyUserFlg
                            })
                        }
                        if (res.data?.content?.mst?.dummyUserFlg === "Y") {

                            return setMsg("Login Not Allowed For Dummy User")
                        } else {
                            set_otpOptn({
                                ...otpOptn,
                                process: true
                            })
                            if (res.data?.content?.mst?.mailId || res.data?.content?.mst?.emailId) {
                                set_caseState(1)
                            }
                        }


                    }
                    if (res.data?.appMsgList?.errorStatus) {
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                        set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    } else {
                        setMsg("");
                        setMsgTyp("")
                        set_errExp({ status: "" })
                    }
                })



        }

        if (caseState === 1) {

            let otpChngLogObj =
            {
                apiId: "SUA00518",
                mst: {
                    appId: "",
                    emailId: formData.emailId,
                    mobNo: formData.mobNo,
                    otpEmailFlg: otpOptn?.otpEmailFlg,
                    otpMobFlg: otpOptn?.otpMobFlg,
                    otpOptnChngFlg: otpOptn?.userOptnSelFlg,
                    otpTypCd: otpTypCd,
                    refApiId:  "SUA00635" //saveEdit
                }
            }
            setLoading({
                ...loading,
                genOtp: true
            });



            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/getOtpOptnChngLogNo", otpChngLogObj).then((res) => {
                // const modifiedData = { ...res.data.content.mst };
                if (res.data?.appMsgList?.errorStatus) {
                    set_errorMsg({ ...errorMsg, VldtMsg: "Please Check OTP Options.One Option Need to be On for generate OTP" })
                }
                if (res.data?.appMsgList?.errorStatus === false) {
                    // setFormData({...formData, "optnChngLogNo":res.data?.content?.mst?.optnChngLogNo})
                    chngLogNo = res.data?.content?.mst?.optnChngLogNo
                    const genOtp_obj = {
                        apiId: "SUA00513",
                        mst: {
                            appId: "",
                            mobRegNo: "",
                            optnChngLogNo: chngLogNo,
                            refApiId: "SUA00635",
                            toMailId: formData.emailId,
                            toMobNo: formData.mobNo
                        }
                    }

                    handle_confirmation(genOtp_obj).then((res) => {
                        if (res?.data?.appMsgList?.errorStatus === false) {
                            setMsg("");
                            setMsgTyp("")
                            set_errExp({ status: "" })
                            setFormData({ ...formData, ...res.data?.content?.mst })
                            set_otpOptn({ ...otpOptn, genOpt: true, otpTimer: true, resendTimer: true })
                            set_caseState(2);
                            set_evntMsg(true)
                            set_resendOtpFlag(true)
                            set_otpSeconds(59);
                            set_otpMinutes(4);
                            set_seconds(60);
                            set_minutes(0)

                            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
                                setLoading({
                                    ...loading,
                                    genOtp: false
                                });
                            }

                            if (res.data?.appMsgList?.errorStatus) {
                                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                                set_errExp({ status: res.data?.appMsgList?.errorStatus })
                            }
                        }
                    })

                }
            });
        }

        if (caseState === 2) {
            set_changeBtn({ ...changeBtn, vldtCheck: true })

            console.log("mmmmmmmm");
            let otpValid = {
                "apiId": "SUA00516",
                "mst": {
                    "refApiId": "SUA00635", //saveEdit
                    "appId": "",
                    "mobRegNo": "",
                    "optnChngLogNo": chngLogNo,
                    "toMailId": formData.emailId,
                    "toMobNo": formData.mobNo,
                    "validateEmailOtp": formData?.validateEmailOtp || "",
                    "validateMobOtp": formData?.validateMobOtp || ""
                }
            }
            setLoading({
                ...loading,
                genOtp: true
            });
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/validateOtp", otpValid).then((res) => {
                if (res.data?.code === 0) {

                    if (res.data?.appMsgList?.errorStatus) {
                        set_errorMsg({ ...errorMsg, VldtMsg: "Please Provide Correct OTP" });
                        setLoading({ ...loading, genOtp: false })
                    }
                    if (!res.data?.appMsgList?.errorStatus) {
                        setMsg("");
                        setMsgTyp("")
                        set_errExp({ status: "" })
                        set_errorMsg({ ...errorMsg, VldtMsg: "" });
                        set_caseState(3)
                        set_msgCase(4)
                        set_evntMsg(true)
                        set_changeBtn({
                            vldtCheck: true,
                            // ...changeBtn,
                            emailOtp: otpOptn.otpEmailFlg === "Y" ? true : false,
                            mobOtp: otpOptn.otpMobFlg === "Y" ? true : false
                        })
                        set_resendOtpFlag(false)
                        set_otpSeconds(59);
                        set_otpMinutes(4);
                        set_seconds(60);
                        set_minutes(0)
                        set_otpOptn({ ...otpOptn, vldbtn: false })
                        setLoading({
                            ...loading,
                            genOtp: false
                        });

                    } else {
                    }
                }
                if (res.data?.appMsgList?.errorStatus) {
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    set_errExp({ status: res.data?.appMsgList?.errorStatus })
                }
            });
            console.log(changeBtn);
        }


        if (caseState === 3) {
            let logingObj = {
                apiId: "SUA00635",
                mst: {
                    ipAddress: name === "IU" ? formData.ipAddress : undefined,
                    mobNo: formData.mobNo,
                    optnChngLogNo: chngLogNo
                }
            }
            let url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00150/EU/Login";
            await axios.post(url, logingObj/* , {headers} */)
                .then(response => {
                    let emailconf_obj = {
                        apiId: "SUA00519",
                        mst: {
                            colNm: response.data?.content?.transInfo?.colNm,
                            emailOtpLogNo: formData.emailOtpLogNo,
                            keyStr: response.data?.content?.transInfo?.keyStr,
                            keyStrVal: response.data?.content?.transInfo?.keyStrVal,
                            tbNm: response.data?.content?.transInfo?.tabNm
                        }
                    }
                    let mobconf_obj = {
                        apiId: "SUA00520",
                        mst: {
                            colNm: response.data?.content?.transInfo?.colNm,
                            keyStr: response.data?.content?.transInfo?.keyStr,
                            keyStrVal: response.data?.content?.transInfo?.keyStrVal,
                            mobOtpLogNo: formData.mobOtpLogNo,
                            tbNm: response.data?.content?.transInfo?.tabNm
                        }
                    }
                    if (otpOptn.otpEmailFlg === "Y") {
                        handle_Emailconfirmation(emailconf_obj).then((res) => {
                            const data = (response.data.content?.detailData?.listLocation);
                            if ((response.data.code === 0) || (response.data.code === 400)) {

                                //setData([...data, formData])
                                setScplAdContext(response.data.content)
                                setApiToken(response.data.content.apiToken)
                                setLocationTree(response.data.content.detailData.listLocation)
                                if (response.data.content.detailData.forceToChangePwd) navigate(process.env.PUBLIC_URL + "/CMF00000_02");

                                else if ((response.data.content?.locFlg === "S") && (response.data.content?.detailData?.listLocation?.length > 1))
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_04", { state: data });

                                else if ((response.data.content?.detailData?.listLocation?.length === 1) && (response.data.content?.detailData?.listModule?.length === 1 && response.data.content?.detailData?.listModule[0]?.modId !== "")) {
                                    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
                                    sessionStorage.setItem("modItem", JSON.stringify({
                                        item: data,
                                        modId: response.data.content.detailData.listModule[0].modId
                                    }))
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_06")
                                }
                                else if ((response.data?.content?.detailData?.listLocation?.length === 1) && (response.data?.content?.detailData?.listModule?.length > 1)) {
                                    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
                                    sessionStorage.setItem("lvlRefCd", response.data?.content?.detailData?.listLocation[0]?.id)
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_05");
                                }

                                //else if (!response.data.singleLocation) navigate("/location");
                                else navigate(process.env.PUBLIC_URL + "/CMF00000_03");
                                //navigate("/dashboard");

                            }
                            else (console.error("Login Failed. Try Again."))
                        })
                    }

                    if (otpOptn.otpMobFlg === "Y") {
                        handle_Mobconfirmation(mobconf_obj).then((res) => {
                            const data = (response.data.content.detailData.listLocation);
                            if ((response.data.code === 0) || (response.data.code === 400)) {

                                //setData([...data, formData])
                                setScplAdContext(response.data.content)
                                setApiToken(response.data.content.apiToken)
                                setLocationTree(response.data.content.detailData.listLocation)
                                if (response.data.content.detailData.forceToChangePwd) navigate(process.env.PUBLIC_URL + "/CMF00000_02");

                                else if ((response.data.content?.locFlg === "S") && (response.data.content?.detailData?.listLocation?.length > 1))
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_04", { state: data });

                                else if ((response.data.content?.detailData?.listLocation?.length === 1) && (response.data.content?.detailData?.listModule?.length === 1 && response.data.content?.detailData?.listModule[0]?.modId !== "")) {
                                    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
                                    sessionStorage.setItem("modItem", JSON.stringify({
                                        item: data,
                                        modId: response.data.content.detailData.listModule[0].modId
                                    }))
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_06")
                                }
                                else if ((response.data?.content?.detailData?.listLocation?.length === 1) && (response.data?.content?.detailData?.listModule?.length > 1)) {
                                    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
                                    sessionStorage.setItem("lvlRefCd", response.data?.content?.detailData?.listLocation[0]?.id)
                                    navigate(process.env.PUBLIC_URL + "/CMF00000_05");
                                }

                                //else if (!response.data.singleLocation) navigate("/location");
                                else navigate(process.env.PUBLIC_URL + "/CMF00000_03");
                                //navigate("/dashboard");

                            }
                            else (console.error("Login Failed. Try Again."))
                        })
                    }
                    if (response.data?.appMsgList?.errorStatus) {
                        setMsg(response?.data?.appMsgList?.list[0]?.errDesc + " (" + response?.data?.appMsgList?.list[0]?.errCd + ")");
                        setMsgTyp(response?.data?.appMsgList?.list[0]?.errType)
                        set_errExp({ status: response.data?.appMsgList?.errorStatus })
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }


    }


    const resendOTP = (name) => {
        console.log("hhhhhhhhh");
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

        const genOtp_obj = {
            apiId: "SUA00513",
            mst: {
                appId: "",
                mobRegNo: "",
                optnChngLogNo: chngLogNo,
                refApiId: name === "IU" ? "SUA00636" : "SUA00635",
                toMailId: formData.emailId,
                toMobNo: formData.mobNo
            }
        }

        handle_confirmation(genOtp_obj).then((res) => {
            if (res?.data?.appMsgList?.errorStatus === false) {
                setFormData({ ...formData, ...res.data?.content?.mst })
                set_otpOptn({ ...otpOptn, genOpt: true })
                set_caseState(2);
                set_evntMsg(true)
                set_resendOtpFlag(true)
                set_otpSeconds(59);
                set_otpMinutes(4);
                set_seconds(60);
                set_minutes(0)
                // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                // set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000015") {
                    // setDialogOpen(true);
                    // resetForm();
                    // setMinutes(2);
                    // setSeconds(59);
                    // setSeconds(60)
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    setLoading({
                        ...loading,
                        genOtp: false
                    });
                }
            }
        })

    };
    // For Mobile Otp Login Code End...............................




    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(value);
        // validateMobOtp
        if ((name === "validateEmailOtp" || name === "validateMobOtp") && isNaN(value)) {
            return;
        }
        if (name === "mobNo" && isNaN(value)) {
            return;
        } else {
            set_errorMsg({ ...errorMsg, mobNo: "" })
        }
        if (name === "mobNo" && otpOptn.process) {
            return;
        }
        setFormData({ ...formData, [name]: value });

        if (formData.validateMobOtp || formData.validateEmailOtp) {
            set_otpOptn({ ...otpOptn, vldbtn: false })
        }
    };

    const [errorVal, setErrorVal] = useState([])
    const [locationTree, setLocationTree] = useState([])

    const renderErrorVal = (errs) => {
        return errs.map(err => <li>{err.errorMessage}</li>)
    }



    return (

        <div className="login-img">
            <div className="page">
                <div className="dropdown float-end custom-layout">
                    <div className="demo-icon nav-link icon mt-4 bg-primary" onClick={() => custompagesswitcherdata.Swichermainright()}>
                        <i className="fe fe-settings fa-spin text_primary"></i>
                    </div>
                </div>
                <div className="" onClick={() => custompagesswitcherdata.Swichermainrightremove()}>
                    <div className="col col-login mx-auto">
                        <div className="text-center">
                            <img
                                src={require("../../assets/images/brand/logo.png")}
                                className="header-brand-img"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="container-login100">
                        <div className="wrap-login100 p-0">
                            <Card.Body>
                                <span className="login100-form-title">Login</span>
                                <form >
                                    <div className="tab-pane" id="tab21">
                                        {/* Mobile No */}
                                        {
                                            <div className="wrap-input100 validate-input">
                                                <input
                                                    required={otpOptn?.otpMobFlg === "Y"}
                                                    className="input100 form-control"
                                                    type="text"
                                                    name="mobNo"
                                                    id="mobNo"
                                                    placeholder="Mobile No"
                                                    autocomplete="off"
                                                    size="30"
                                                    maxlength={10}
                                                    // path="username"
                                                    value={formData.mobNo} onChange={handleInputChange}
                                                />
                                                <span className="focus-input100"></span>
                                                <span className="symbol-input100">
                                                    <i className="zmdi zmdi-smartphone" aria-hidden="true"></i>
                                                </span>
                                            </div>}

                                        {/* Email Id */}
                                        {(otpOptn.otpEmailFlg === "Y" && otpOptn.process) && <div className="wrap-input100 validate-input">
                                            <input
                                                //required={otpOptn?.otpEmailFlg === "Y"}
                                                className="input100 form-control"
                                                type="text"
                                                name="emailId"
                                                id="emailId"
                                                placeholder="Email ID"
                                                //autocomplete="off"
                                                size="30"
                                                //maxlength="25"
                                                // path="emaiId"
                                                // readOnly
                                                value={formData.emailId}
                                            />
                                            <span className="focus-input100"></span>
                                            <span className="symbol-input100">
                                                <i className="zmdi zmdi-mail-send" aria-hidden="true"></i>
                                            </span>
                                        </div>}

                                        {loading.otpOptn ? "Loading...." : otpOptn && otpOptn.userOptnSelFlg === "Y" && <div className="row mb-4 mt-0">

                                            {otpOptn.process && <div className="row mb-4 d-flex justify-content-center">
                                                <label className="Col-md-6 form-label">Choose Options to get OTP</label>
                                                <div className="form-check form-switch col-md-6 mt-1">
                                                    <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpMobFlg" checked={otpOptn.otpMobFlg === "Y"} onChange={(e) => handleFlgChng(e, "EU", "otpMobFlg")} />
                                                    <label className="form-check-label" style={{ marginLeft: "30%" }} >Mobile OTP</label>
                                                </div>
                                                <div className="form-check form-switch col-md-6 mt-1">
                                                    <input disabled={otpOptn?.genOpt} className="form-check-input mx-1" type="checkbox" role="switch" name="otpEmailFlg" checked={otpOptn.otpEmailFlg === "Y"} onChange={(e) => handleFlgChng(e, "EU", "otpEmailFlg")} />
                                                    <label className="form-check-label" style={{ marginLeft: "30%" }} >Email OTP</label>
                                                </div>

                                            </div>}

                                        </div>}

                                        {otpOptn?.genOpt && <>
                                            {/* Mobile otp input */}
                                            {otpOptn.otpMobFlg === "Y" && <div className="row mb-4">
                                                <div className="wrap-input100 validate-input">
                                                    <input className="form-control input100" name="validateMobOtp" type="text" autoComplete="off" placeholder="Mobile OTP" maxLength={6} value={formData.validateMobOtp} onChange={handleInputChange} disabled={changeBtn.mobOtp} />
                                                    <span className="focus-input100"></span>
                                                    <span className="symbol-input100">
                                                        <i className="zmdi zmdi-key"></i>
                                                    </span>

                                                    {changeBtn.vldtCheck ? (changeBtn.mobOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""}
                                                </div>
                                            </div>}
                                            {otpOptn.otpEmailFlg === "Y" && <div className="row mb-4">
                                                {/* <label className="col-md-3 form-label">Email OTP:</label> */}
                                                <div className="wrap-input100 validate-input">
                                                    <input className="form-control input100" name="validateEmailOtp" autoComplete="off" type="text" value={formData.validateEmailOtp} maxLength={6} placeholder="Email OTP" onChange={handleInputChange} disabled={changeBtn.emailOtp} />
                                                    <span className="focus-input100"></span>
                                                    <span className="symbol-input100">
                                                        <i className="zmdi zmdi-key"></i>
                                                    </span>
                                                    {changeBtn.vldtCheck ? (changeBtn.emailOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""}
                                                </div>
                                            </div>}
                                        </>}
                                        {errorMsg && (errorMsg.mobNo) ? <div className="text-red text-center mb-4">{errorMsg.mobNo}</div> : <div className="text-red text-center mb-4">{errorMsg.VldtMsg}</div>}
                                        {evntMsg && <div className="text-red text-center mb-4">{dialogMsg()}</div>}
                                        {(resendOtpFlag) && <div className="text-center"><span className="text-red">OTP will be Expired in</span> {otpMinutes < 10 ? "0" + otpMinutes : otpMinutes}:{otpSeconds < 10 ? "0" + otpSeconds : otpSeconds}</div>}

                                        <div className="container-login100-form-btn mb-4">
                                            <button className="login100-form-btn btn-primary" type="button" disabled={caseState === 2 ? otpOptn.vldbtn : false} onClick={(e) => handleSendOtp(e, "EU")}>{loading.genOtp ? "Loading....." : buttonTitle()}</button>
                                        </div>
                                        {caseState === 2 && <button className="login100-form-btn btn-primary"
                                            onClick={() => resendOTP("EU")} type="button"><ReplayIcon />&nbsp; Resend &nbsp; {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                                        </button>}
                                    </div>
                                </form>
                                <div className="text-center pt-3">
                                    <p className="text-dark mb-0">
                                        Don't Have an Account?
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/SUF00150_03/`}
                                            className="text-primary ms-1"
                                        >
                                            Register Now
                                        </Link>
                                    </p>

                                </div>
                                <div className="text-center pt-3">
                                    {/* <p className="text-dark mb-0"> </p> */}
                                    <ul className="text-danger">
                                        {renderErrorVal(errorVal)}

                                    </ul>
                                    {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}

                                </div>
                                {/* </form> */}
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex justify-content-center my-3">
                                    <Link to="#" className="social-login  text-center me-4">
                                        <i className="fa fa-google"></i>
                                    </Link>
                                    <Link to="#" className="social-login  text-center me-4">
                                        <i className="fa fa-facebook"></i>
                                    </Link>
                                    <Link to="#" className="social-login  text-center">
                                        <i className="fa fa-twitter"></i>
                                    </Link>
                                </div>
                            </Card.Footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



