import React, { useState, useEffect } from "react";
import TreeView from "deni-react-treeview";
import {Breadcrumb,Row,Col,Card} from "react-bootstrap"
import {useNavigate} from 'react-router-dom'
//import { treeview1 } from "../../data/Component/treeviews/locationtreedata";
import { Link } from "react-router-dom";


import { useLocation } from "react-router-dom";

import MenuCreation from "./SUF00007_01";
import axios from 'axios';

const DynamicTreeMenu = () => {
  
  const location = useLocation();
  const data = treeview1;
   
  
   

    const idMapping = data.reduce((acc, el, i) => {
      acc[el.menuId] = i;
      return acc;
    }, []);
    
     let treeview1;
    
    data.forEach((el) => {
      // Handle the root element
      if (el.parMenuId === null) {
        treeview1 = [el];
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = data[idMapping[el.parMenuId]];
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl.children || []), el];
    });
    
    
    
    console.log(treeview1);










    const [menuData, setMenuData] = useState([]);
    var datag = null;
    useEffect(() => {
      fetchMenuData();
    }, []);
  
    const fetchMenuData =  () => {
      try {
        //const response =  await fetch('your_api_url');
       // const data = await response.json();
       const data =  treeview1;
       console.log(data);
      // LocationTree(); //setMenuData(data);
      } catch (error) {
        console.log('Error fetching menu data', error);
      }
    };
  
    const renderSubmenu = (children) => {
      return children.map((item) => (
        <li key={item.id}>{item.text}</li>
      ));
    };
  
    const renderMenu = () => {
      return menuData.map((menu) => (
        <li key={menu.id}>
          {menu.text + "dssdfsfd"}
          {menu.children && <ul>{renderSubmenu(menu.children)}</ul>}
        </li>
      ));
    };
  
//    return (
//      <div>
 //       <ul>{renderMenu()}</ul>
 //     </div>
 //   );
 return LocationTree(treeview1);
  };
  
 export default DynamicTreeMenu;
  





export  function LocationTree(treeview1) {
   const navigate = useNavigate ();
   
   const handleItemClick= (item) => {
    const lvlRefCd = item.lvlRefCd;
   
 //   if (item.clickable) {
        navigate ('/CMF00000_05', {state:lvlRefCd});
//    }
   }
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Location Tree</h1>
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
            <Link to="#" className="btn btn-success btn-icon text-white">
              <span>
                <i className="fe fe-log-in"></i>&nbsp;
              </span>
              Export
            </Link>
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
                          items={treeview1}
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