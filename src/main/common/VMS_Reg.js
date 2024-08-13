import {React, useState, useEffect, useRef} from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata"
import { Avatar, makeStyles } from '@material-ui/core';
import Countdown from "react-countdown";
import MsgAlert from "./MsgAlert";
import ConfirmDialog from "./ConfirmDialog";
import {
  Button

} from "@mui/material";
import { ReportRounded } from "@mui/icons-material";






export default function VMS_Reg() {
  const [formData, setFormData] = useState({
    userEmailOTP: "",
    userMobileOTP: ""
  })
  const handleChange = (event) =>{
    const name = event.target.name;
   const value = event.target.value;
   console.log(value);
  setFormData({
    ...formData,
    [name]: value
  }
  );
  }
   const navigate = useNavigate()
 const [showAlert, setShowAlert] = useState(false);
  const [showOptions, setShowOptions] = useState(false)
  const [proceedClicked, setProceedClicked] = useState(false);
  const [optnChngLogNo, setOptnChngLogNo] = useState('')
  const [emailOtpLogNo, setEmailOtpLogNo] = useState('')
  const [mobOtpLogNo, setMobOtpLogNo] = useState('')
  const [loading, setLoading] = useState({
		register: false,
		generate_otp: false,
    validate_otp: false
	});
  
  const [otpFlag, setsotpFlag] = useState(false)
  const [msg, setMsg] = useState("")
  const [msgCountdownTimer, setMsgCountdownTimer] = useState(false)
  const [resendOtpFlag, set_resendOtpFlag] = useState(false)
  const [crossIcon, setCrossIcon] = useState(false)
  const emailId = useFormInput('');
  const extUserTypCd = useFormInput('T0001');
const landLineNo = useFormInput('');
  //const optnChngLogNo = useFormInput('');	
  const gstNo = useFormInput('');
const pan = useFormInput('');
const regMobNo= useFormInput('');
const regNm= useFormInput('');
const regOffAddr= useFormInput('');
const regScndAddr= useFormInput('');
const webSite= useFormInput('');
const MobileOTP = useCheckbox('')
const EmailOTP = useCheckbox('')
const userEmailOTP= useFormInput('');
const userMobOTP= useFormInput('');
const [error, setError] = useState("");
const [msgTyp, setMsgTyp] = useState("")
const [errExp, set_errExp] = useState({
  status: true,
  content: ""
})

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
          set_resendOtpFlag(true);
          clearInterval(timer)
        }
      }
    }, 1000)
    return () => clearInterval(timer);

  }, [seconds, minutes])
  const handle_resendTimmer = ()=>{
    set_resendOtpFlag(true)
    // const timer = setInterval(() => {
    //   if (seconds > 0) {
    //     set_seconds(seconds - 1)
    //   } else {
    //     if (minutes > 0) {
    //       set_minutes(minutes - 1)
    //       set_seconds(59)
    //     } else {
    //       set_resendOtpFlag(false)
    //       clearInterval(timer)
    //     }
    //   }
    // }, 1000)
    
  }

//code for alert
// const closeAlert = () => {
//   setShowAlert(false);
//   navigate(`${process.env.PUBLIC_URL}/CMF00000/login`) 
// };
// useEffect(() => {
//   const audio = new Audio(alertSound); // Create a new Audio eleme
//   if (showAlert) {
//     audio.play();
//     // Add the active class to the overlay when the alert is shown
//     document.body.classList.add('alert-active');
//   } else {
//     // Remove the active class when the alert is hidden
//     document.body.classList.remove('alert-active');
//   }
// }, [showAlert]);
//code for alert end


const Completionist = () => {
  setMsgCountdownTimer(false)
  set_resendOtpFlag(true);
  setMsg('Previous OTP got expired, please click on "Resend OTP" button to get new one')
}

	// Renderer callback with condition
	const renderer = ({minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
      <span>
        {minutes}:{seconds}
      </span>
      );
    }
    };
    const [key, setKey] = useState(0);
    const buttonDisabledRef = useRef(false);
    const handleRenderer =({minutes, seconds, completed }) => {
      //e.preventDefault
      
      if (completed) {
        buttonDisabledRef.current = true;
        console.log(buttonDisabledRef.current)
        //GlobalUpdateVeriable = false;
        //set_resendOtpFlag(true);
       // setButtonDisabled(false)
       return (
        <span>
         {"0:00"}
        </span>
        );
      } else {
        return (
        <span>
          {minutes}:{seconds}
        </span>
        );
      }
       }; 
    const countdownTime = <Countdown date={Date.now() + 1000 * 60 * 5} renderer={renderer} />;
    
   // const { minutes, seconds } = countdownTime.props.children.props;
    //const formattedCountdown = `${minutes}:${seconds}`;
    const handleProceedClick = () => {
      
      /* if (!regNm.value || !regOffAddr.value || !extUserTypCd.value) {
        setMsg('Please fill all the fields');
        return;
      } */
      const fieldsToCheck = [
        { field: regNm.value, message: 'Please enter your Name' },
        { field: extUserTypCd.value, message: 'Please choose user type' },
        { field: emailId.value, message: 'Please Enter your email Id' },
        { field: regMobNo.value, message: 'Please Enter Valid Mobile Number' },
        { field: regOffAddr.value, message: 'Please enter your address' },
        { field: pan.value, message: 'Please enter your PAN No.' }
        
      ];
      
      for (const { field, message } of fieldsToCheck) {
        if (!field) {
          setMsg(message);
          return;
        }
      }
      if(regMobNo.value?.length !== 10){ 
        setMsg("Please Enter Valid Mobile Number")
        console.log('return')
        return
      } 
      
      setProceedClicked(true);
      setShowOptions(true);
      setMsg('')
      //setShowAlert(true)
     
    };
  



  const [allUser, setAllUser] = useState([]);
    useEffect(() => {

        //console.log(headers)
        const fetchUserData = async () => {
            let obj =
            {
                apiId: "SUA00644"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00150/getAllExtUserType', obj).then((res) => {
                console.log(res.data);
                setAllUser(res.data?.content?.qryRsltSet);
                console.log(allUser);
                /* setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                    res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus}) */
            })
        }

        fetchUserData()

    }, [])



    const [getOtpOptnChngDtlRes, setGetOtpOptnChngDtlRes] = useState({});
    useEffect(() => {
      const getOtpOptnChngDtlObj = {
        "apiId": "SUA00517",
        "mst": {
          "otpTypCd":  "T0003"
        }
      }
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL_PREFIX}/SUF00135/Web/UA/getOtpOptnChngDtl`,
            getOtpOptnChngDtlObj
          );
          setGetOtpOptnChngDtlRes(response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData(); // Call fetchData when the component mounts
    }, []);
    useEffect(() => {
      if (getOtpOptnChngDtlRes && getOtpOptnChngDtlRes.data && getOtpOptnChngDtlRes.data.content) {
        const otpMobFlg = getOtpOptnChngDtlRes.data.content.mst.otpMobFlg;
        const otpEmailFlg = getOtpOptnChngDtlRes.data.content.mst.otpEmailFlg;
      
        MobileOTP.setChecked(otpMobFlg);
    EmailOTP.setChecked(otpEmailFlg);
      }
    }, [getOtpOptnChngDtlRes]);
   /* const otpMobFlg = getOtpOptnChngDtlRes?.data?.content?.mst?.otpMobFlg;
   const otpEmailFlg = getOtpOptnChngDtlRes?.data?.content?.mst?.otpEmailFlg
   MobileOTP.onChange({ target: { value: otpMobFlg } });
    EmailOTP.onChange({ target: { value: otpEmailFlg } }); */
    
    


  const handleRegistration= async (e)=>
	{
    e?.preventDefault();

		const vendorObj = {
      
        "apiId": "SUA00634",
        "mst": { 
      "emailId": emailId.value,
      "extUserTypCd": extUserTypCd.value,
      "gstNo": gstNo.value,
      "landLineNo": landLineNo.value,
      "optnChngLogNo": optnChngLogNo,
      "pan": pan.value,
      "regMobNo": regMobNo.value,
      "regNm": regNm.value,
      "regOffAddr": regOffAddr.value,
      "regScndAddr": regScndAddr.value,
      "webSite": webSite.value
        }
		}
			
        setLoading({
			...loading,
			register: true
		}); 
        await axios.post(process.env.REACT_APP_API_URL_PREFIX+'/SUF00150/EU/Registration', vendorObj).then(async res => {
				console.log(vendorObj);
      if (res?.data?.appMsgList?.errorStatus ){
          setError(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({ status: res.data?.appMsgList?.errorStatus });
      }
      else if (res?.data?.code ==="1"){
        setError(res?.data?.msg);
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus });
      }
      
        
         const  EmailOtpConfirmObj = {
      "apiId": "SUA00519",
      "mst": {
        "colNm": res?.data?.content?.mst?.colNm || "",
        "emailOtpLogNo": emailOtpLogNo || "",
        "keyStr": res.data?.content?.mst?.keyStr || "",
        "keyStrVal":res?.data?.content?.mst?.keyStr || "",
        "tbNm": res?.data?.content?.mst?.tabNm || ""
      }
    }
    const  MobileOtpConfirmObj = {
      "apiId": "SUA00520",
      "mst": {
        "colNm":  res.data?.content?.mst?.colNm || "",
        "keyStr": res.data?.content?.mst?.keyStr || "",
        "keyStrVal": res.data?.content?.mst?.keyStrVal || "",
        "mobOtpLogNo":  mobOtpLogNo || "",
        "tbNm":  res.data?.content?.mst?.tabNm || ""
      }
    }
    if(EmailOTP.checked==="Y"){  
    const EmailOtpConfirm = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/generateEmailOtpConf", EmailOtpConfirmObj) || "";
    }
    if(MobileOTP.checked==="Y"){
    const MobileOtpConfirm = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/generateMobOtpConf", MobileOtpConfirmObj) || "";
    }
			 setMsg(res.data?.appMsgList?.list[0]?.errDesc)	
		   	setLoading(false);
			//setsotpFlag(false)
			//setRegisterFlag(false)
			if(res?.data?.appMsgList?.errorStatus === false) 
			{
				//alert("Registered successfully");
        setShowAlert(true)
       
       //navigate(`${process.env.PUBLIC_URL}/CMF00000/login`) 
} 
			
        }).catch(error => {
            setLoading(false);
            setMsg("Wrong credentials. Please check and try again");
        }).finally(()=>{
			setLoading({
				...loading,
				register: false
			}) ;
		});

  
    // const EmailOtpConfirm = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/generateEmailOtpConf", EmailOtpConfirmObj);
    //const MobileOtpConfirm = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/generateMobOtpConf", MobileOtpConfirmObj);
		console.log("register");
	}

  const ValidateOTP_register = async (e)=>{
		e.preventDefault()
   
		const validateObj = {
      "apiId": "SUA00516",
    mst:{
      "appId": "",
      "mobRegNo": "",
      "optnChngLogNo": optnChngLogNo,
      "refApiId": "SUA00634",
      "toMailId": emailId.value,
      "toMobNo": regMobNo.value,
			validateEmailOtp: formData?.userEmailOTP || "",
			validateMobOtp: formData?.userMobileOTP || "",
		}
  }
		await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00135/Web/UA/validateOtp", validateObj).then((res)=>{
   
			if(res?.data?.appMsgList?.errorStatus === false){
				console.log("Validated");
        setMsgCountdownTimer(false)
        setShowRegisterButton(true)
        set_resendOtpFlag(true)
        setCrossIcon(false)
				//handleRegistration()
        setMsg('OTP Validated Successfully. Click Register Button to Continue')
        setError("");
    setMsgTyp("");
				
			}else{
        setError(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus });
        if(MobileOTP?.checked==='N' && EmailOTP?.checked==='N'){
          setMsgCountdownTimer(false);
          setMsg('You have to Choose an option to continue. Reload page and start again')

        }
        else{
        msgCountdownTimer === false ? setMsg('Previous Otp got Expired. please enter Resend OTP to continue'): setMsg("Enter valid OTP. OTP Will Expired in ")}
				setCrossIcon(true)
			}
		}).catch((err)=>{
			console.log(err);
		}).finally(()=>{

		})
		
	
	}
  


  const OtpResults = () => (
    <div>
      {MobileOTP.checked === "Y" && (
        <>
          <p>Enter Mobile OTP</p>
          <div style={{ position: 'relative' }}>
          <input type="text" id="MobileOTP" className="form-control" name='userMobileOTP' value={formData?.userMobileOTP} onChange={handleChange} required disabled={showRegisterButton} />
         {showRegisterButton && (<span 
    className="right-check-icon" 
    style={{ color: 'green', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
    &#x2714; {/* Unicode for the check mark icon */}
  </span>)}
  {crossIcon && (<span 
    className="right-check-icon" 
    style={{ color: 'red', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
   &#10005; {/* Unicode for the check mark icon */}
  </span>)}

  </div>

        </>
      )}
  
      {EmailOTP.checked === "Y" && (
        <>
          <p>Enter Email OTP</p>
          <div style={{ position: 'relative' }}>
          <input type="text" id="EmailOTP" className="form-control" name='userEmailOTP' value={formData?.userEmailOTP} onChange={handleChange} required disabled={showRegisterButton} />
          { showRegisterButton &&(<span 
    className="right-check-icon" 
    style={{ color: 'green', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
    &#x2714; {/* Unicode for the check mark icon */}
  </span>)}
  {crossIcon && (<span 
    className="right-check-icon" 
    style={{ color: 'red', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
   &#10005; {/* Unicode for the check mark icon */}
  </span>)}
          </div>
        </>
      )}
    </div>
  );

    


 
  const generateOTP = async (e)=>{
		e?.preventDefault()
    buttonDisabledRef.current = false;
   setKey(prevKey => prevKey + 1);
		if(regMobNo.value?.length !== 10){ 
			setMsg("Please Enter valid phone number")
      console.log('return')
			return
		}
		//setValidationFlag(false)
		set_resendOtpFlag(false)
		
		setMsg('')
		if(regNm?.value && regOffAddr.value && regMobNo.value && emailId.value && extUserTypCd?.value){
      
     // const getOtpOptnChngDtlRes = await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00135/Web/UA/getOtpOptnChngDtl", getOtpOptnChngDtlObj);
    
console.log(MobileOTP.value)
      const getOtpOptnChngLogNoObj = {
        "apiId": "SUA00518",
        "mst": {
          "appId": "",
          "emailId": emailId.value,
          "mobNo": regMobNo.value,
          //"otpEmailFlg": getOtpOptnChngDtlRes.data.content.mst.otpEmailFlg,
          "otpEmailFlg": EmailOTP.checked,
        //  "otpMobFlg":getOtpOptnChngDtlRes.data.content.mst.otpMobFlg,
           "otpMobFlg": MobileOTP.checked,
          "otpOptnChngFlg": getOtpOptnChngDtlRes.data.content.mst.userOptnSelFlg,
          "otpTypCd": "T0003",
          "refApiId": "SUA00634"
        }
      }
      const getOtpOptnChngLogNoRes = await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00135/Web/UA/getOtpOptnChngLogNo",getOtpOptnChngLogNoObj);
      setOptnChngLogNo(getOtpOptnChngLogNoRes.data?.content?.mst?.optnChngLogNo)
			const genarateObj = {
        "apiId": "SUA00513",
        "mst": {
          "appId": "",
          "mobRegNo": "",
          "optnChngLogNo": getOtpOptnChngLogNoRes.data?.content?.mst?.optnChngLogNo,
          "refApiId": "SUA00634",
          "toMailId": emailId.value,
          "toMobNo": regMobNo.value
        }
      }
		 	setLoading({
				...loading,
				generate_otp: true
			}) 
			await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00135/Web/UA/generateOtp", genarateObj ).then((res)=>{
        setEmailOtpLogNo(res.data?.content?.mst?.emailOtpLogNo)
        setMobOtpLogNo(res.data?.content?.mst?.mobOtpLogNo)
				setsotpFlag(true)
        setShowRegisterButton(false)
       if(res?.data?.appMsgList?.errorStatus ){
          setError(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_errExp({ status: res.data?.appMsgList?.errorStatus })
}
else{
  setError('')
  setMsgTyp('')
}
                
				//setMsg("Otp sent to your registered mobile number and email. check your mobile and email. Mobile OTP : "+ res.data.content.mobileNoOtp +" Email OTP :  "+ res.data.content.emailIdOtp )
		//	MobileOTP.checked ==='Y' ? setMsg("Otp sent to your registered mobile number. check your mobile ") ? EmailOTP.checked ==='Y' ? setMsg("Otp sent to your registered Email. check your Email Id ") ? MobileOTP.checked==='': setMsg("Otp sent to your registered mobile number and email. check your mobile and email")
      //EmailOTP.checked ==='Y' ? setMsg("Otp sent to your registered Email. check your Email Id ") : setMsg("Otp sent to your registered mobile number and email. check your mobile and email")
      if(MobileOTP?.checked==='Y' && EmailOTP?.checked==='Y'){
       setMsg("OTP sent to your registered mobile number and email. check your mobile and email. OTP Will Expired in")
       setMsgCountdownTimer(true);
      
      //  resendOtpFlag(false)
        
      }
      else if(MobileOTP?.checked==='Y'){
        setMsg("OTP sent to your registered mobile number. check your mobile. OTP Will Expired in ")
        setMsgCountdownTimer(true);
      }
      else if(EmailOTP?.checked==='Y'){
        setMsg("OTP sent to your registered Email. check your Email Id. OTP Will Expired in ")
        setMsgCountdownTimer(true);
      }
      else{
        
        setMsg("choose One Option ")
        
        
        //setMsgCountdownTimer(true);
      }
      set_minutes(0)
      set_seconds(59)
      set_otpMinutes(4);
       set_otpSeconds(59);
      
				console.log(+ res.data.content.emailIdOtp)
			}).catch((err)=>{
				console.log(err);
			}).finally(()=>{
				 setLoading({
					...loading,
					generate_otp: false
				}) 
        console.log("finally reached")
			})
			
		}
		else{
			setMsg("Please fill all the feilds");
		}
	  }
 

    const [showRegisterButton, setShowRegisterButton] = useState(false);


  return (
    <>
    
    <div className="login-img">
      <div className="page">
        <div className="dropdown float-end custom-layout">
                <div className="demo-icon nav-link icon mt-4 bg-primary" onClick={()=>custompagesswitcherdata.Swichermainright()}>
                    <i className="fe fe-settings fa-spin text_primary"></i>
                </div>
            </div>
        <div className="" onClick={()=>custompagesswitcherdata.Swichermainrightremove()}>
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
                <form className="login100-form validate-form" onSubmit={ValidateOTP_register}>
                  <span className="login100-form-title">Registration</span>
                  <div
                    className="wrap-input100 validate-input"

                  >
                    <input
                      className="input100"
                      type="text"
                      name="regNm"
                      placeholder="Register Name"
                      maxLength={200}
                      disabled={otpFlag}
                      {...regNm}
                      required
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="mdi mdi-account" aria-hidden="true"></i>
                    </span>
                  </div>
                  {/* <div
                    className="wrap-input100 validate-input"

                  >
                    <select
                      className="input100"
                      type=""
                      name="extUserTypCd"
                      disabled={otpFlag}
                      {...extUserTypCd}
                     
                      
                      >
                        <option> Choose User Type </option>
             {allUser &&
        allUser.map((item) => (
          <option key={item.extUserTypCd} value={item.extUserTypCd}>
            {item.extUserTypDesc}
          </option>
        ))}


        </select>
        
                   
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="mdi mdi-account" aria-hidden="true"></i>
                    </span>
                  </div> */}
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="emailId"
                      placeholder="Email"
                      maxLength={200}
                      disabled={otpFlag}
                      {...emailId}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-email" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="regMobNo"
                      placeholder="Mobile No"
                      maxLength={10}
                      disabled={otpFlag}
                      {...regMobNo}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                     
                      <i className="zmdi zmdi-smartphone-android" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="landLineNo"
                      placeholder="Landline No"
                      maxLength={12}
                      disabled={otpFlag}
                      {...landLineNo}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                    <i className="mdi mdi-phone" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="regOffAddr"
                      placeholder="Register Office Adress"
                      maxLength={200}
                      disabled={otpFlag}
                      {...regOffAddr}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                     
                      <i class="zmdi zmdi-home" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="regScndAddr"
                      placeholder="Aditional Adress"
                      maxLength={200}
                      disabled={otpFlag}
                      {...regScndAddr}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                     
                      <i class="zmdi zmdi-home" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="webSite"
                      placeholder="Website"
                      maxLength={200}
                      disabled={otpFlag}
                      {...webSite}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                    <i className="zmdi zmdi-globe-alt" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="gstNo"
                      placeholder="GST No"
                      maxLength={15}
                      disabled={otpFlag}
                      {...gstNo}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                     
                     <i class="zmdi zmdi-balance"  aria-hidden="true"></i>
                      
{/* <div className="logo"></div> */}
{/* <Avatar className={classes.logo}>
     
      L
    </Avatar> */}
                    </span>
                  </div>
                  <div
                    className="wrap-input100 validate-input"
 
                  >
                    <input
                      className="input100"
                      type="text"
                      name="pan"
                      placeholder="PAN"
                      maxLength={10}
                      disabled={otpFlag}
                      {...pan}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      
                      <i class="zmdi zmdi-card" aria-hidden="true"></i>
                    </span>
                  </div> 
                 {/*  <div
                    className="wrap-input100 validate-input"
                  
                  >
                    <input
                      className="input100"
                      type="password"
                      name="pass"
                      password="true"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                  </div> */}
                 { getOtpOptnChngDtlRes.data?.content?.mst?.userOptnSelFlg ==="Y" && showOptions &&
                 <div className="row mb-4 mt-0">
                  <label>Choose Options to get Otp:</label>
                 <div className="row d-flex justify-content-center">
                 {MobileOTP.checked =="Y" ?(<div className="form-check form-switch col-md-6 mt-1">
                  <input type="checkbox" role="switch" className="form-check-input mx-1" checked disabled={otpFlag} onChange={MobileOTP.onChange} />
                  <label className="form-check-label" style={{ marginLeft: "30%" }} >Mobile OTP</label>
                </div>
                ): (<div className="form-check form-switch col-md-6 mt-1">
                 <input type="checkbox" role="switch" className="form-check-input mx-1" disabled={otpFlag} onChange={MobileOTP.onChange}  />
                <label className="form-check-label" style={{ marginLeft: "30%" }} >Mobile OTP</label>
              </div>
               )}

                 { EmailOTP.checked ==="Y" ? (<div className="form-check form-switch col-md-6 mt-1">
                 <input type="checkbox" role="switch" className="form-check-input mx-1" checked disabled={otpFlag} onChange={EmailOTP.onChange} />
                <label className="form-check-label" style={{ marginLeft: "30%" }} >Email OTP</label>
              </div>) : (<div className="form-check form-switch col-md-6 mt-1">
              <input type="checkbox" role="switch" className="form-check-input mx-1" disabled={otpFlag} onChange={EmailOTP.onChange}  />
                <label className="form-check-label" style={{ marginLeft: "30%" }} >Email OTP</label>
              </div>) }
                  </div>
                  </div>
}
                 {/*  <div className="container-login100-form-btn">
                    <Link
                      to={`${process.env.PUBLIC_URL}/dashboard/`}
                      className="login100-form-btn btn-primary"
                    >
                      Register
                    </Link>
                  </div> */}
                  {/* <div className="container-login100-form-btn">
        <button type="submit" className="login100-form-btn btn-primary">Genarate Otp</button>
      </div> */}
       {otpFlag &&	<div>
      {MobileOTP.checked === "Y" && (
        <>
          <p>Enter Mobile OTP</p>
          <div style={{ position: 'relative' }}>
          <input type="text" id="MobileOTP" className="form-control" name='userMobileOTP' value={formData?.userMobileOTP} onChange={handleChange} required disabled={showRegisterButton} />
         {showRegisterButton && (<span 
    className="right-check-icon" 
    style={{ color: 'green', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
    &#x2714; {/* Unicode for the check mark icon */}
  </span>)}
  {crossIcon && (<span 
    className="right-check-icon" 
    style={{ color: 'red', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
   &#10005; {/* Unicode for the check mark icon */}
  </span>)}

  </div>

        </>
      )}
  
      {EmailOTP.checked === "Y" && (
        <>
          <p>Enter Email OTP</p>
          <div style={{ position: 'relative' }}>
          <input type="text" id="EmailOTP" className="form-control" name='userEmailOTP' value={formData?.userEmailOTP} onChange={handleChange} required disabled={showRegisterButton} />
          { showRegisterButton &&(<span 
    className="right-check-icon" 
    style={{ color: 'green', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
    &#x2714; {/* Unicode for the check mark icon */}
  </span>)}
  {crossIcon && (<span 
    className="right-check-icon" 
    style={{ color: 'red', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} 
  >
   &#10005; {/* Unicode for the check mark icon */}
  </span>)}
          </div>
        </>
      )}
    </div>}	
       {msgCountdownTimer ? (
  <p style={{color: "red"}}>
    
    
    {msg && <span> {msg} {otpMinutes < 10 ? "0" + otpMinutes : otpMinutes}:{otpSeconds < 10 ? "0" + otpSeconds : otpSeconds}</span>}
  </p>
) : (
  <p style={{color: "red"}}>{msg}</p>
)}
           
      <div className="container-login100-form-btn">
                 {/*  {error && <><small style={{ color: 'green' }}>{error}</small><br /></>} */}
                  {error && <MsgAlert errExp={errExp} msg={error} msgTyp={msgTyp} />}
                  &nbsp;
                  <div></div>


                  {
  otpFlag ? (
    <>
    {showRegisterButton ?(
      <button
        type="button"
        className="mb-1 login100-form-btn btn-primary"
        disabled={loading.register}
        onClick={() => handleRegistration()}
      >
        {loading.register ? 'Loading...' : 'Register'}
      </button>
     ) :  <button
            type="submit"
            className="mb-1 login100-form-btn btn-primary"
            disabled={loading.validate_otp}
           // onClick={() => setShowRegisterButton(true)}
          >
            {loading.validate_otp ? 'Loading...' : 'Validate OTP'}
          </button>}
       
       
        {/* <button
          type="button"
         // disabled={buttonDisabledRef.current}
        // disabled = {GlobalUpdateVeriable}  
          className="login100-form-btn btn-secondary"
          id="getotpBtn"
          onClick={() => { handle_resendTimmer()}}
        >
          Resend OTP 
          {resendOtpFlag && 
          <span>in  {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</span>}
        </button> */}
        {!showRegisterButton && <button
        disabled={!resendOtpFlag}
          type="button"
         // disabled={buttonDisabledRef.current}
        // disabled = {GlobalUpdateVeriable}  
          className="login100-form-btn btn-secondary"
          id="getotpBtn"
          onClick={() => { generateOTP()}}
        >
         { loading.generate_otp ? 'Please Wait...' : `Resend OTP in ${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}` } 
        </button>}
      
    </>
  ) : (
    <>
      {proceedClicked ? (
        <Link
          to={`${process.env.PUBLIC_URL}/CustomPages/Login/`}
          className="login100-form-btn btn-primary"
          type="button"
          onClick={generateOTP}
          disabled={loading.generate_otp}
        >
          {loading.generate_otp ? 'Loading...' : 'Generate OTP'}
        </Link>
      ) : (
        <button
          className="login100-form-btn btn-primary"
          type="button"
          onClick={handleProceedClick}
          //disabled={loading.generate_otp}
        >
         Proceed
        </button>
      )}
    </>
  )
}

                  
                  </div>
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Already have account?
                      <Link
                        to={`${process.env.PUBLIC_URL}/VMS_login`}
                        className="text-primary ms-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
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
      <ConfirmDialog type={"alert"} open={showAlert} setOpen={()=>setShowAlert(false)}>
        
          <div>
          <h3>Registered Successfully!!</h3>
          <div style={{width: "100%", display:"flex", justifyContent: "flex-end"}}>
          <Button  variant="contained"  onClick={()=>{
            setShowAlert(false)
            navigate(`${process.env.PUBLIC_URL}/VMS_login`) }} 
            className="btn btn-primary ">
                   
                   ok
               </Button>
          </div>

          </div>

      </ConfirmDialog>
    </div>
    </>
  );
}


const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
      setValue(e.target.value);
  }
  return {
      value,
      onChange: handleChange
  }
}


const useCheckbox = initialValue => {
  const [checked, setChecked] = useState(initialValue);

  const handleChange = e => {
  
   setChecked(e.target.checked ? "Y" : "N");
  };

  const setCheckbox = value => {
    setChecked(value);
  };

  return {
    checked,
    onChange: handleChange,
    setChecked: setCheckbox // Expose setChecked function
  };
};


