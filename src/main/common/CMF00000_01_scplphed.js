import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata"
import { useEffect, useState } from 'react';
import axios from 'axios';
import {setScplAdContext} from "./common"
import {removeScplAdContext} from "./common"
//import {isAutenticated} from "./common"

export default function Login() {
removeScplAdContext(); 
const navigate= useNavigate()

  
  const [formData, setFormData] = useState({
    userId : "",
    password: "",
    ipAddress:"",
  });
  
    const [ipAddress, setIPAddress] = useState('')
    console.log(formData);
    useEffect(() => {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => setFormData({...formData, ipAddress: data.ip}) 
    )
        .catch(error => console.log(error))
        
    }, 
    []);
  
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

  }; 

  const [errorVal, setErrorVal] = useState([])
  const [locationTree, setLocationTree] = useState([])

  const renderErrorVal = (errs) => {
    return errs.map(err => <li>{err.errorMessage}</li>)
  }

 const handleSubmit =async (e) => {
  
  e.preventDefault();
  /* const headers= {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*',
  } */
  console.log(formData);
 
let url= process.env.REACT_APP_API_URL_PREFIX +'/CMF00000/getSignIn.json';
console.log(url+":URL");
await axios.post(url, formData/* , {headers} */)

.then(response => {
  console.log(response.data);
  const data = (response.data.detailData.listLocation);
  if ((response.data.statusCode==="200")||(response.data.statusCode==="400")){
    if (response.data.errorInfoList.length > 0){
      setErrorVal(response.data.errorInfoList);
      removeScplAdContext();      
    //   for (let i = 0; i < response.data.errorInfoList.length; i++) {
    //     errorVal.push(response.data.errorInfoList[i].errorMessage);
    // }  
  }
  else {

  //setData([...data, formData])
  // set_scplAdContext(response.data.scplAdContext)
  setScplAdContext(response.data.scplAdContext)
  setLocationTree(response.data.detailData.listLocation)
 
  if (response.data.detailData.forceToChangePwd) navigate(process.env.PUBLIC_URL+"/CMF00000_02");
 
  else if ((response.data.scplAdContext.locFlg==="S") && (response.data.detailData.listLocation.length !== 1)) navigate(process.env.PUBLIC_URL+"/CMF00000_04", {state:data});
 
  else if ((response.data.detailData.listLocation.length === 1) && (response.data.detailData.listModule.length === 1)) navigate(process.env.PUBLIC_URL+"/CMF00000_06", {state:data});
  else if ((response.data.detailData.listLocation.length === 1) && (response.data.detailData.listModule.length > 1))navigate(process.env.PUBLIC_URL+"/CMF00000_05", {state:data});
  //else if (!response.data.singleLocation) navigate("/location");
  else navigate(process.env.PUBLIC_URL+"/CMF00000_03", {state:data});
}
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
                      name="userId"
                      id = "userId"
                      placeholder="User Id"
                      //autocomplete="off"
                      size="30"
                      //maxlength="25"
                      path="userId"
                     value={formData.userId} onChange={handleInputChange}
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


