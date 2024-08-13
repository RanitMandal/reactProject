import React, { useState, useEffect } from "react";
import TreeView from "deni-react-treeview";
import {Breadcrumb,Row,Col,Card} from "react-bootstrap"
import {useNavigate, useOutletContext} from 'react-router-dom'
//import { treeview } from "../../data/Component/treeviews/locationtreedata";
import { Link } from "react-router-dom";
import {getLocationTree, getScplAdContext} from "./common"
import setLocationTree from "./CMF00000_01"
import { useLocation } from "react-router-dom";
import { isAuthenticated } from "./common";
import axios from 'axios';

const LocationTree = () => {
  const navigate = useNavigate ();
  const location = useLocation();
  const data = getScplAdContext().detailData.listLocation
  const outletObj = useOutletContext()
  
  // const [treeview, set_treeview] = useState([])
  // let temp = []
    

  //   useEffect(() => {
  //     const idMapping = data.reduce((acc, el, i) => {
  //       acc[el.lvlRefCd] = i;
  //       return acc;
  //     }, []);

      // data.forEach((el) => {
      //   // Handle the root element
      //   if (el.parLvlRefCd === null) {
      //     temp = [...temp, el];
      //     return;
      //   }
      //   // Use our mapping to locate the parent element in our data array
      //   const parentEl = data[idMapping[el.parLvlRefCd]];
      //   // Add our current el to its parent's `children` array
      //   parentEl.children = [...(parentEl.children || []), el];
      // });

    //   set_treeview([...temp])
      
    // }, [])


    const handleItemClick= (item) => {
      const lvlRefCd = item.id;
      sessionStorage.setItem("currentLvlRefNm", item?.text);
      sessionStorage.setItem("lvlRefCd", lvlRefCd)
      outletObj.set_currentLvlRefCd(lvlRefCd)
      navigate(process.env.PUBLIC_URL+'/CMF00000_05')
     }


     const onRenderItem = (item, treeview) => {
      // const lvlRefCd = item.id;
      // sessionStorage.setItem("lvlRefCd", lvlRefCd);
      
      return (
        <div className="treeview-item-example">
          <span onClick={()=>handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
        </div>
      )
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
                      {data && <TreeView
                        id="treeview"
                        style={{ height: "auto" }}
                        showIcon={true}
                        //showCheckbox={true}
                        className="branch"
                        items={data}
                        onRenderItem={onRenderItem}
                        //onSelectItem= {handleItemClick}
                      />}
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
  };
  
 export default LocationTree;
  