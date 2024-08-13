import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { Card } from "react-bootstrap";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {removeApiToken, setApiToken} from "./common"
import {setScplAdContext} from "./common"
import {removeScplAdContext} from "./common"
//import {isAutenticated} from "./common"

export default function Login() {
  removeScplAdContext(); 
  removeApiToken(); 
  sessionStorage.removeItem("modId");
  sessionStorage.removeItem("menuTree");
  sessionStorage.removeItem("modules");
  // sessionStorage.removeItem("currentLvlRef");
  sessionStorage.removeItem("lvlRefCd");
  sessionStorage.removeItem("currentLvlRefNm");
const navigate= useNavigate()
  const [formData, setFormData] = useState({
    ipAddress: "",
    username : "",
    password: "" 
  });
   

    useEffect(() => {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => setFormData({...formData, ipAddress: data.ip }) 
    )
        .catch(error => console.log(error))     
    }, 
    []);
  
  
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }; 

  const [errorVal, setErrorVal] = useState([])
  const [locationTree, setLocationTree] = useState([])
  //const [scplAdContext, setScplAdContext] = useState(null)

  const renderErrorVal = (errs) => {
    return errs.map(err => <li>{err.errorMessage}</li>)
  }
  
 const handleSubmit =async (e) => {
  
  e.preventDefault();
  /* const headers= {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*',
  } */
 
let url= process.env.REACT_APP_API_URL_PREFIX +'/token/generate-token';
await axios.post(url, formData/* , {headers} */)
.then(response => {
  const data = (response.data.content.detailData.listLocation); 
  if ((response.data.code===0)||(response.data.code===400)){
    
  //setData([...data, formData])
  setScplAdContext(response.data.content)
  setApiToken(response.data.content.apiToken)
  setLocationTree(response.data.content.detailData.listLocation)
  if (response.data.content.detailData.forceToChangePwd) navigate(process.env.PUBLIC_URL+"/CMF00000_02");
 
  else if ((response.data.content?.locFlg==="S") && (response.data.content?.detailData?.listLocation?.length > 1)) 
    navigate(process.env.PUBLIC_URL+"/CMF00000_04", {state:data});
 
  else if ((response.data.content?.detailData?.listLocation?.length === 1) && (response.data.content?.detailData?.listModule?.length === 1 && response.data.content?.detailData?.listModule[0]?.modId!=="" )) {
    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
    sessionStorage.setItem("modItem",JSON.stringify({
      item: data,
      modId: response.data.content.detailData.listModule[0].modId
    }))
    navigate(process.env.PUBLIC_URL+"/CMF00000_06")
  }
  else if ((response.data?.content?.detailData?.listLocation?.length === 1) && (response.data?.content?.detailData?.listModule?.length > 1))
  {
    sessionStorage.setItem("currentLvlRefNm", response.data?.content?.detailData?.listLocation[0]?.text);
    sessionStorage.setItem("lvlRefCd", response.data?.content?.detailData?.listLocation[0]?.id)
    navigate(process.env.PUBLIC_URL+"/CMF00000_05");
  }
    
  //else if (!response.data.singleLocation) navigate("/location");
  else navigate(process.env.PUBLIC_URL+"/CMF00000_03");
 //navigate("/dashboard");
   
}
else (console.error("Login Failed. Try Again."))
})
.catch(error => {
  console.error(error);
});
}

  return (
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
                <form className="login100-form validate-form"  onSubmit={handleSubmit}>
                  <span className="login100-form-title">Login</span>
                    <div className="wrap-input100 validate-input">
                    <input
                    required
                      className="input100 form-control"
                      type="text"
                      name="username"
                      id = "userId"
                      placeholder="User Id"
                      //autocomplete="off"
                      size="30"
                      //maxlength="25"
                      path="username"
                     value={formData.username} onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-account" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div className="wrap-input100 validate-input">
                    <input
                    required
                      className="input100 form-control"
                      type="password"
                      name="password"
                      id = "userPassword"
                      placeholder="Password"
                      //autocomplete="off"
                      size="30"
                      //maxlength="25"
                      path="password"
                    value={formData.password} onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div className="text-end pt-1">
                    <p className="mb-0">
                      <Link
                        to={`${process.env.PUBLIC_URL}/custompages/forgotPassword/`}
                        className="text-primary ms-1"
                      >
                        Forgot Password?
                      </Link>
                    </p>
                  </div>
                  <div className="container-login100-form-btn">
                  <button type="submit" className='login100-form-btn btn-primary'>Login</button>
                   {/*  <Link
                      // to={`${process.env.PUBLIC_URL}/dashboard/`}
                      to={`${process.env.PUBLIC_URL}/location/`}
                      className="login100-form-btn btn-primary"
                    >
                      Login
                    </Link> */}
                  </div>
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Not a member?
                      <Link
                        to={`${process.env.PUBLIC_URL}/custompages/register/`}
                        className="text-primary ms-1"
                      >
                        Create an Account
                      </Link>
                    </p>
                  </div>
                  <div className="text-center pt-3">
                    {/* <p className="text-dark mb-0"> </p> */}
                    <ul className="text-danger">
        {renderErrorVal(errorVal)}
      </ul>
                     
                   
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
    </div>
  );
}


