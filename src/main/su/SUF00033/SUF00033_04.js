import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form } from "react-bootstrap"
import ReplayIcon from '@mui/icons-material/Replay';
import axios from "axios";
import {
    Tabs,
    Tab,
    OverlayTrigger,
    Tooltip,
    Breadcrumb,
    Button,
} from "react-bootstrap";
// import * as formelement from "../../data/Form/formelement/formelement";
import { Dialog, DialogContent, DialogTitle, DialogContentText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as custompagesswitcherdata from "../../../data/Switcher/Custompagesswitcherdata"
let chngLogNo = ""
export default function ForgotPassword() {
    const navigate = useNavigate()

    const [msg, setMsg] = useState("");
    const [msgTyp, setMsgTyp] = useState("");
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [formData, setFormData] = useState({
        ipAddress: "",
        userId: "",
        newPwd: "",
        confpass: "",
        emailId: "",
        mobNo: "",
        optnChngLogNo: "",
        emailOtp: "",
        mobileOtp: "",
        "emailOtpLogNo": "",
        "mobOtpLogNo": "",
        validateMobOtp: "",
        validateEmailOtp: ""
    });



    // For Mobile Otp Login Code Start...............................
    const [resendOtpFlag, set_resendOtpFlag] = useState(false)
    const [loading, setLoading] = useState({
        otpOptn: true,
        genOtp: false,
    })
    // Expire Msg timer
    const [otpSeconds, set_otpSeconds] = useState(0);
    const [otpMinutes, set_otpMinutes] = useState(0);

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

    const [errorMsgUserId, set_errorMsgUserId] = useState("")
    const [evntMsg, set_evntMsg] = useState(false)
    const [changeBtn, set_changeBtn] = useState({
        vldtCheck: false,
        emailOtp: false,
        mobOtp: false,
        change: true
    })

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
    const [showPage, setShowPage] = useState(false);
    const [otpTypCd, setOtpTypCd] = useState("T0007");
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
        getOtpOptnChngDtl();
    }, [showPage, otpTypCd]);


    //Form open api end
    const handleFlgChng = async (e, type, name) => {
        // console.log(e.target.checked);
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
            case 7:
                return "Password is changed Successfully";
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
                return "Submit";
            default:
                return "Unknown";
        }
    };





    const [caseState, set_caseState] = useState(0)
    const [msgCase, set_msgCase] = useState(0)

    const [errorMsg, set_errorMsg] = useState({ mobNo: "", VldtMsg: "" })
    const handleSendOtp = async (e, name) => {
        console.log(otpOptn);
        if (!formData.userId || !formData.newPwd || !formData.confpass) {
            set_errorMsg({ ...errorMsg, mobNo: "Fill the necessary field" })
            return;
        }
        set_otpOptn({ ...otpOptn, otpTimer: false, resendTimer: false })
        // console.log("llllll", otpOptn);
        if (otpOptn?.otpMobFlg === "Y" && otpOptn?.otpEmailFlg === "Y") {
            set_msgCase(3)
        } else if (otpOptn?.otpEmailFlg === "Y") {
            set_msgCase(2)
        } else if (otpOptn?.otpMobFlg === "Y") {
            set_msgCase(1)
        }
        // set_evntMsg(false)



        if (caseState === 0) {
            if (formData.newPwd === "" || formData.confpass === "") {
                set_errorMsg({ ...errorMsg, mobNo: "Please fill in both password fields" });
                // console.log("ggggg");
                return; // Prevent form submission if password fields are empty
            } else if (formData.newPwd !== formData.confpass) {
                set_errorMsg({ ...errorMsg, mobNo: "Passwords do not match" });
                console.log("hhhh");
                return; // Prevent form submission if passwords don't match
            }

            let obj = {
                apiId: "SUA00661",
                mst: {
                    userId: formData.userId
                }
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/forgetPassOpenEdit", obj)
                .then((res) => {
                    if (res.data?.appMsgList?.errorStatus === false) {
                        setFormData({
                            ...formData,
                            emailId: res.data?.content?.mst?.emailId,
                            mobNo: res.data?.content?.mst?.mobNo
                        })
                        console.log(loading);
                        set_otpOptn({
                            ...otpOptn,
                            process: true
                        })
                        setShowPage(true)
                        if (res.data?.content?.mst?.mailId || res.data?.content?.mst?.emailId) {
                            set_caseState(1)
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
                    refApiId: "SUA00662" //saveEdit
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
                            refApiId: "SUA00662",
                            toMailId: formData.emailId,
                            toMobNo: formData.mobNo
                        }
                    }

                    handle_confirmation(genOtp_obj).then((res) => {
                        if (res?.data?.appMsgList?.errorStatus === false) {
                            setFormData({ ...formData, ...res.data?.content?.mst })
                            set_otpOptn({ ...otpOptn, genOpt: true, otpTimer: true, resendTimer: true })
                            set_caseState(2);
                            // set_evntMsg(true)
                            set_resendOtpFlag(true)
                            set_otpSeconds(59);
                            set_otpMinutes(4);
                            set_seconds(60);
                            set_minutes(0)
                            setDialogOpen(true)
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

            console.log("mmmmmmmm", chngLogNo, otpOptn);
            let otpValid = {
                "apiId": "SUA00516",
                "mst": {
                    "refApiId": "SUA00662", //saveEdit
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
                        // setDialogOpen(true)
                        // set_msgCase(5)
                        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                        set_errExp({ status: res.data?.appMsgList?.errorStatus })
                        return;
                    }
                    if (!res.data?.appMsgList?.errorStatus) {
                        set_errorMsg({ ...errorMsg, VldtMsg: "" });
                        // set_caseState(2)
                        set_caseState(3)
                        set_msgCase(4)
                        // set_evntMsg(true)
                        set_changeBtn({
                            ...changeBtn,
                            vldtCheck: true,
                            change: false,
                            emailOtp: true,
                            mobOtp: true
                        })
                        set_resendOtpFlag(false)
                        set_otpOptn({ ...otpOptn, vldbtn: false })
                        setLoading({
                            ...loading,
                            genOtp: false
                        });
                        setDialogOpen(true)
                    } else {
                    }
                }

            });
            console.log(changeBtn);
        }


        // if (caseState === 3) {
        //     let logingObj = {
        //         apiId: name === "IU" ? "SUA00636" : "SUA00635",
        //         mst: {
        //             ipAddress: name === "IU" ? formData.ipAddress : undefined,
        //             mobNo: formData.mobNo,
        //             optnChngLogNo: chngLogNo
        //         }
        //     }
        //     let url = process.env.REACT_APP_API_URL_PREFIX + (name === "IU" ? "/SUF00033/IU/internalUserLogin" : "/SUF00150/EU/Login");
        //     await axios.post(url, logingObj/* , {headers} */)
        //         .then(response => {
        //             let emailconf_obj = {
        //                 apiId: "SUA00654",
        //                 mst: {
        //                     colNm: response.data?.content?.transInfo?.colNm,
        //                     emailOtpLogNo: formData.emailOtpLogNo,
        //                     keyStr: response.data?.content?.transInfo?.keyStr,
        //                     keyStrVal: response.data?.content?.transInfo?.keyStrVal,
        //                     tbNm: response.data?.content?.transInfo?.tabNm
        //                 }
        //             }
        //             let mobconf_obj = {
        //                 apiId: "SUA00653",
        //                 mst: {
        //                     colNm: response.data?.content?.transInfo?.colNm,
        //                     keyStr: response.data?.content?.transInfo?.keyStr,
        //                     keyStrVal: response.data?.content?.transInfo?.keyStrVal,
        //                     mobOtpLogNo: formData.mobOtpLogNo,
        //                     tbNm: response.data?.content?.transInfo?.tabNm
        //                 }
        //             }
        //             if (otpOptn.otpEmailFlg === "Y") {
        //                 handle_Emailconfirmation(emailconf_obj).then((res) => {
        //                     (console.error("Login Failed. Try Again."))
        //                 })
        //             }

        //             if (otpOptn.otpMobFlg === "Y") {
        //                 handle_Mobconfirmation(mobconf_obj).then((res) => {
        //                     (console.error("Login Failed. Try Again."))
        //                 })
        //             }
        //         })
        //         .catch(error => {
        //             console.error(error);
        //         });
        // }

        if(caseState ===3){
            let postObj = {
                apiId: "SUA00662",
                mst: {
                    emailOtpLogNo: formData.emailOtpLogNo,
                    mobOtpLogNo: formData.mobOtpLogNo,
                    newPwd: formData.newPwd,
                    userId: formData.userId
                }
            };
    
    
    
    
            axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/forgetPassSaveEdit",
                    postObj,
    
                )
                .then((res) => {
                    // console.log("POST Request Success:", res.data);
                    if (res.data?.appMsgList?.errorStatus === false) {
                        let emailconf_obj = {
                            apiId: "SUA00519",
                            mst: {
                                colNm: res.data?.content?.mst?.colEmailOtp,
                                emailOtpLogNo: formData.emailOtpLogNo,
                                keyStr: res.data?.content?.mst?.keyStr,
                                keyStrVal: res.data?.content?.mst?.keyStrVal,
                                tbNm: res.data?.content?.mst?.tabNm
                            }
                        }
                        let mobconf_obj = {
                            apiId: "SUA00520",
                            mst: {
                                colNm: res.data?.content?.mst?.colMobOtp,
                                keyStr: res.data?.content?.mst?.keyStr,
                                keyStrVal: res.data?.content?.mst?.keyStrVal,
                                mobOtpLogNo: formData.mobOtpLogNo,
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
                            // setDialogOpen(true)
                            navigate()
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
                    // console.error("POST Request Error:", error);
                }).finally(() => {
                    // set_viewMsg(true);
                    resetForm()
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
                refApiId: "SUA00662",
                toMailId: formData.emailId,
                toMobNo: formData.mobNo
            }
        }

        handle_confirmation(genOtp_obj).then((res) => {
            if (res?.data?.appMsgList?.errorStatus === false) {
                setFormData({ ...formData, ...res.data?.content?.mst })
                set_otpOptn({ ...otpOptn, genOpt: true })
                set_caseState(2);
                // set_evntMsg(true)
                set_resendOtpFlag(true)
                set_otpSeconds(59);
                set_otpMinutes(4);
                set_seconds(60);
                set_minutes(0)
                setDialogOpen(true)
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







    const handleSelectChange = (event) => {
        console.log(event.target);
        const { name, value, selectedIndex } = event.target;
        const selectedLabel = event.target[selectedIndex].text;
        setFormData({
            ...formData,
            [name]: value,
            [name.replace("Id", "Desc")]: selectedLabel // Update the label state
        });

    };
    // console.log(formData);

    //handle the value of input field when changes happen
    const handleInputChange = (event) => {
        console.log(event.target.name, event.target.value);

        const { name, value } = event.target;
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
        if (name === "confpass") {
            set_errorMsg({ ...errorMsg, mobNo: "" })

        }
        if (formData.validateMobOtp || formData.validateEmailOtp) {
            set_otpOptn({ ...otpOptn, vldbtn: false })
        }
    };



    // console.log(formData);
    function postDataToAPI(event) {
        event.preventDefault();
        if (formData.newPwd !== formData.confpass) {
            set_errorMsg({ ...errorMsg, mobNo: "Password not match" });
            return; // Prevent form submission if passwords don't match
        }
        let postObj = {
            apiId: "SUA00662",
            mst: {
                emailOtpLogNo: formData.emailOtpLogNo,
                mobOtpLogNo: formData.mobOtpLogNo,
                newPwd: formData.newPwd,
                userId: formData.userId
            }
        };




        axios
            .post(
                process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/forgetPassSaveEdit",
                postObj,

            )
            .then((res) => {
                // console.log("POST Request Success:", res.data);
                if (res.data?.appMsgList?.errorStatus === false) {
                    let emailconf_obj = {
                        apiId: "SUA00654",
                        mst: {
                            colNm: res.data?.content?.mst?.colEmailOtp,
                            emailOtpLogNo: formData.emailOtpLogNo,
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
                            mobOtpLogNo: formData.mobOtpLogNo,
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
                        // setDialogOpen(true)
                        navigate(process.env.PUBLIC_URL + "/CMF00000/login")
                        
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
                // console.error("POST Request Error:", error);
            }).finally(() => {
                // set_viewMsg(true);
                resetForm()
            });
    }





    const resetForm = () => {
        setShowPage(false);
        set_errorMsg({
            mobNo: "",
            VldtMsg: "",
        })
        set_changeBtn({
            ...changeBtn,
            vldtCheck: false,
            emailOtp: false,
            mobOtp: false,
        })

        set_caseState(0)
        set_resendOtpFlag(false)
        setFormData({
            userId: "",
            emailId: "",
            mobNo: "",
            confpass: "",
            validateEmailOtp: "",
            validateMobOtp: "",
            newPwd: "",
        })
        // setSecretQues(false)
        // setOtp(false)
        set_otpOptn({
            otpEmailFlg: "",
            otpMobFlg: "",
            userOptnSelFlg: "",
            genOpt: false,
            choosValue: false,
            resendEnbl: false,
            resendTimer: null,
            vldbtn: true,
            process: false
        })
        // fetchformData()
    }








    return (
        <div className="login-img">
            <div className="page">
                <div className="dropdown float-end custom-layout">
                    <div
                        className="demo-icon nav-link icon mt-4 bg-primary"
                        onClick={() => custompagesswitcherdata.Swichermainright()}
                    >
                        <i className="fe fe-settings fa-spin text_primary"></i>
                    </div>
                </div>
                <div className="">
                    <div
                        className="col col-login mx-auto"
                        onClick={() => custompagesswitcherdata.Swichermainrightremove()}
                    >
                        <div className="text-center">
                            <img
                                src={require("../../../assets/images/brand/logo.png")}
                                className="header-brand-img"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="container-login100">
                        <Row>
                            <Col className=" col-login mx-auto">
                                <Form className="card shadow-none" method="post">
                                    <Card.Body>
                                        <div className="text-center">
                                            <span className="login100-form-title">
                                                Reset Password
                                            </span>
                                            <p className="text-muted">
                                                Enter the email address registered on your account
                                            </p>
                                        </div>
                                        <div className="pt-3" id="forgot">
                                            <div className="wrap-input100 validate-input">
                                                {/* <label className="form-label">E-Mail</label> */}
                                                <input
                                                    type="text"
                                                    className="form-control input100"
                                                    // password="true"
                                                    autoComplete="off"
                                                    name="userId"
                                                    disabled={otpOptn.process}
                                                    placeholder="User Id"
                                                    required
                                                    onChange={handleInputChange}
                                                    value={formData.userId}
                                                />
                                                <span className="focus-input100"></span>
                                                <span className="symbol-input100">
                                                    <i className="zmdi zmdi-account" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                            <div className="wrap-input100 validate-input">
                                                {/* <label className="form-label">E-Mail</label> */}
                                                <input
                                                    type="text"
                                                    className="input100 form-control"
                                                    // password="true"
                                                    disabled={otpOptn.process}
                                                    autoComplete="off"
                                                    name="newPwd"
                                                    placeholder="New Password"
                                                    required
                                                    onChange={handleInputChange}
                                                    value={formData.newPwd}
                                                />
                                                <span className="focus-input100"></span>
                                                <span className="symbol-input100">
                                                    <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                            <div className="wrap-input100 validate-input">
                                                {/* <label className="form-label">E-Mail</label> */}
                                                <input
                                                    type="text"
                                                    className="input100 form-control"
                                                    // password="true"
                                                    autoComplete="off"
                                                    name="confpass"
                                                    disabled={otpOptn.process}
                                                    placeholder="Confirm Password"
                                                    required
                                                    onChange={handleInputChange}
                                                    value={formData.confpass}
                                                />
                                                <span className="focus-input100"></span>
                                                <span className="symbol-input100">
                                                    <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                                                </span>
                                                {/* {changeBtn.vldtCheck ? (changeBtn.mobOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""} */}

                                            </div>


                                            {/* OTP CODE */}

                                            {/* otpOptn.choosValue && */}
                                            {loading.otpOptn ? "Loading...." : otpOptn && otpOptn.userOptnSelFlg === "Y" && <div className="row mb-4 mt-0">

                                                {otpOptn.process && <div className="row mb-4 d-flex justify-content-center">
                                                    <label className="Col-md-6 form-label">Choose Options to get OTP:</label>
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
                                                    {/* <label className="col-md-3 form-label">Mobile OTP:</label> */}
                                                    {/* style={errorMsg ? { borderColor: "red" } : { borderColor: " #ecf0fa" }} */}
                                                    <div className=" row mb-4">
                                                        {/* <label className="form-label col-md-3">Mobile OTP:</label> */}
                                                        <div className="wrap-input100 validate-input">
                                                            <input className="form-control input100" name="validateMobOtp" type="text" autoComplete="off" placeholder="Mobile OTP" maxLength={6} disabled={changeBtn.mobOtp} value={formData.validateMobOtp} onChange={handleInputChange} />
                                                            <span className="focus-input100"></span>
                                                            <span className="symbol-input100">
                                                                <i className="zmdi zmdi-key"></i>
                                                            </span>

                                                            {changeBtn.vldtCheck ? (changeBtn.mobOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""}
                                                        </div>
                                                    </div>
                                                    {/* {errorMsg && <div className="text-red text-center">{errorMsg}</div>} */}
                                                </div>}





                                                {otpOptn.otpEmailFlg === "Y" && <div className="row mb-4">
                                                    {/* <label className="col-md-3 form-label">Email OTP:</label> */}
                                                    <div className="row mb-4">
                                                        {/* <label className="form-label col-md-3">Email OTP:</label> */}
                                                        <div className="wrap-input100 validate-input">
                                                            <input className="form-control input100" name="validateEmailOtp" autoComplete="off" type="text" value={formData.validateEmailOtp} maxLength={6} disabled={changeBtn.emailOtp} placeholder="Email OTP" onChange={handleInputChange} />
                                                            <span className="focus-input100"></span>
                                                            <span className="symbol-input100">
                                                                <i className="zmdi zmdi-key"></i>
                                                            </span>
                                                            {changeBtn.vldtCheck ? (changeBtn.emailOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""}
                                                        </div>
                                                    </div>

                                                </div>}




                                            </>}


                                            {errorMsg && (errorMsg.mobNo) ? <div className="text-red text-center mb-4">{errorMsg.mobNo}</div> : <div className="text-red text-center mb-4">{errorMsg.VldtMsg}</div>}
                                            {/* {evntMsg && <div className="text-red text-center mb-4">{dialogMsg()}</div>} */}
                                            {(resendOtpFlag) && <div className="text-center"><span className="text-red">OTP will be Expired in</span> {otpMinutes < 10 ? "0" + otpMinutes : otpMinutes}:{otpSeconds < 10 ? "0" + otpSeconds : otpSeconds}</div>}

                                            {<div className="container-login100-form-btn mb-4">
                                                {(!evntMsg) && <button className="login100-form-btn btn-primary" type="button" disabled={caseState === 2 ? otpOptn.vldbtn : false} onClick={(e) => handleSendOtp(e, "EU")}>{loading.genOtp ? "Loading....." : buttonTitle()}</button>}

                                                {caseState === 2 && (resendOtpFlag && <button className="login100-form-btn btn-primary mt-2"
                                                    onClick={() => resendOTP("EU")} type="button"><ReplayIcon />&nbsp; Resend &nbsp; {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}

                                                </button>)}
                                            </div>}























                                            <div className="submit">
                                                {/* <Link
                                                    to={`${process.env.PUBLIC_URL}/dashboard/`}
                                                    className="btn btn-primary d-grid"
                                                >
                                                    Submit
                                                </Link> */}
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className="text-dark mb-0">
                                                    Forgot It?
                                                    <Link className="text-primary ms-1" to={`${process.env.PUBLIC_URL}/CMF00000/login`}>
                                                        Login
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
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
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}
