import React, { useState, useEffect } from "react";
import TreeView from "deni-react-treeview";
import {Breadcrumb,Row,Col,Card} from "react-bootstrap"
import {useNavigate} from 'react-router-dom'
//import { treeview1 } from "../../data/Component/treeviews/locationtreedata";
import { Link } from "react-router-dom";
import {getLocationTree} from "./common"
import setLocationTree from "./CMF00000_01"
import { useLocation } from "react-router-dom";
import { isAuthenticated } from "./common";
import axios from 'axios';



export default function LocationList() {
   const navigate = useNavigate ();
   const location = useLocation();
    const data = location.state;

   const handleItemClick= (item) => {
    const lvlRefCd = item.id;
    sessionStorage.setItem("currentLvlRefNm", item?.text);
    sessionStorage.setItem("lvlRefCd", lvlRefCd)
        navigate ('/CMF00000_05');
   }
   
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Location List</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item className="breadcrumb-item" href="#">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Location Tree
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            {/* <Link to="#" className="btn btn-primary btn-icon text-white me-3">
              <span>
                <i className="fe fe-plus"></i>&nbsp;
              </span>
              Add Account
            </Link> */}
            {/* <Link to="#" className="btn btn-success btn-icon text-white">
              <span>
                <i className="fe fe-log-in"></i>&nbsp;
              </span>
              Export
            </Link> */}
          </div>
        </div>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <div className="main-content-label mg-b-5">Available Locations</div>
                <p className="mg-b-20 card-sub-title tx-12 text-muted">
                 Select Your Location
                </p>
                <Row>
                  <Col className=" mt-4 mt-lg-0" lg={12} xl={12}>
                    <ul id="tree2" className="tree">
                   
                    <li className="branch">
                        <TreeView
                          id="treeview1"
                          style={{ height: "auto" }}
                          showIcon={true}
                          //showCheckbox={true}
                          className="branch"
                          items={data}
                          onSelectItem= {handleItemClick}
                        />
                      </li> 
                                                 
                    </ul>
                  </Col>
             
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }