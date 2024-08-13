import React from "react";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";
import common from "./common"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import {getApiToken} from "./common"
import {getScplAdContext} from "./common"

export default function ModuleHome() {
  sessionStorage.removeItem("modItem");
  const navigate= useNavigate()
  const location = useLocation();
  // const lvlRefCd = location.state;

  const lvlRefCd = sessionStorage.getItem("lvlRefCd");

  //const [lvlRefCd, set_lvlRefCd] = useState(null)
  // useEffect(() => {
  //   console.log("ccccccccccc", location.state);
  //   set_lvlRefCd(location.state)
  // },[] )
  
  const userId = getScplAdContext().userId;
  
  const [module, setModule] = useState([]);
  
    useEffect(() => {
      console.log("dddddddddddd");
      console.log(lvlRefCd);
      console.log(userId);
        const headers = { Authorization: 'Bearer ' + getApiToken() };
        const body = {lvlRefCd: lvlRefCd, userId: userId  }
        console.log(body);
        axios.post(process.env.REACT_APP_API_URL_PREFIX +`/token/modules`, body,  {headers} )
            .then(response => {
              console.log(response.data);
              
              setModule(response.data?.content)
              sessionStorage.setItem("moduleLen", response.data?.content?.length) 
            }
              );      
        
    }, [lvlRefCd, userId]);

    // const menuNavigation = (modId)=>{

    // }
  let colArr = [ "bg-secondary", "bg-info", "bg-success", "bg-warning", "bg-danger", "bg-primary"];
  var colorIndex = 0;
  return (
    <div>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Module Home</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Module Home
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
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
          {module?.map((item,index)=>{
            colorIndex++;
            if(colorIndex > 5) colorIndex = 0;
            return <Col lg={6} md={12} sm={12} xl={4}>
              {/* <Card onClick={()=>{
                sessionStorage.setItem("modItem",JSON.stringify({
                item: item,
                modId: item.modId
              }))
                navigate(process.env.PUBLIC_URL+"/CMF00000_06")}} className="bg-info overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h3 className="mb-2 number-font">
                       
                        {item?.modNm}
                      </h3>
                    
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-settings text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card> */}
              <Card
              style={{minHeight: "110px"}}
              onClick={()=>{
                sessionStorage.setItem("modItem",JSON.stringify({
                item: item,
                modId: item.modId
              }))
              navigate(process.env.PUBLIC_URL+"/CMF00000_06")}} 
              className={"card img-card box-info-shadow "+colArr[colorIndex]}>
            <Card.Body className="">
              <div className="d-flex">
                <div className="text-white">
                  <h3 className="mb-0 number-font">{item?.modNm}</h3>
                </div>
                <div className="ms-auto">
                  <i className={`${item?.modImgPath} text-white fs-30 me-2 mt-2`}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
            </Col>
          })
              
            }
           
          </Row>
        </Col>
      </Row>
    </div>
  );
}
