import React from "react";
import { Breadcrumb, Col, Row, Card } from "react-bootstrap";
import common, { setScplAdContext } from "./common"
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { OverlayTrigger,Tooltip } from "react-bootstrap";
import moment from "moment/moment";
import axios from 'axios';
import {getApiToken} from "./common"
import {getScplAdContext} from "./common"

export default function ModuleDashboard() {
  // const navigate= useNavigate()
  const location = useLocation();
  //const modItem = location.state;
  let modItem = {}
  try {
    modItem = JSON.parse(sessionStorage.getItem("modItem"));
  } catch (error) {
    console.log(error);
  }
  // const modId = modItem?.modId
  //const modId = sessionStorage.getItem("modId")
  //const modNm = modItem.modNm
  console.log("xxxxxxxxxxModItem", modItem);
  const outletObj =useOutletContext()
  outletObj.set_sidebarModId(modItem?.modId)
  sessionStorage.setItem("modId", modItem?.modId);
  const userId = getScplAdContext().userId;
  console.log(modItem);
  console.log(userId);

  // const columns =[
  //   {
  //     name: "Sl.NO",
  //     selector: row => [modItem.rowNo],
  //     sortable: true,
  //     cell:row=><span className="fw-semibold text-center">{row.rowNo}</span>
  //   },
  //     {
  //     name: "DOCUMENT NAME",
  //     selector: row => [row.reqNo],
  //     sortable: true,
  //     cell:row=><span className="fw-semibold">{row.reqNo}</span>
  //   },
  //   {
  //     name: "UPLOAD DATE",
  //     selector: row => [row.reqDate],
  //     sortable: true,
  //     cell:row=><span className="fw-semibold">{(moment(row.reqDate).format('DD/MM/YYYY'))}</span>
  //   },
  //   {
  //     name: "ACTION",
  //     selector: row => [row.action],
  //     sortable: true,
  //     cell: row =><span className="">
  //     <OverlayTrigger placement="top" overlay={<Tooltip >Edit</Tooltip>}>
  //     <Link to="#"className="btn btn-primary btn-sm rounded-11 me-2" ><i><svg className="table-edit" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/></svg></i></Link>
  //     </OverlayTrigger>
  //     <OverlayTrigger placement="top" overlay={<Tooltip >Delete</Tooltip>}>
  //     <Link to="#" className="btn btn-danger btn-sm rounded-11"><i><svg className="table-delete" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg></i></Link>
  //     </OverlayTrigger>
  //     <OverlayTrigger placement="top" overlay={<Tooltip >View</Tooltip>}>
  //     <Link to="#" className="btn btn-success btn-sm rounded-11"><i><svg className="table-file" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg></i></Link>
  //     </OverlayTrigger>
  // </span>
  //   },
  // ]

  // const data=[
  //   {
  //     id:"1",
  //     sno:1,
  //     name:"Resource Division",
  //     amount:"Request Reason",
  //     email:"jacke123@gmail.com",
  //     date:"20-11-2020",
  //     status:"Approved",
  //     color:"success",
  //   },
  //   {
  //     id:"2",
  //     sno:2,
  //     name:"Alipur Division",
  //     amount:"Request Reason or Remarks",
  //     email:"virginia456@gmail.com",
  //     date:"20-11-2020",
  //     status:"Cancel",
  //     color:"danger",
  //   },
  //   {
  //     id:"3",
  //     sno:3,
  //     name:"Bankura Division",
  //     amount:"$1,56,3654",
  //     amount:"Request Reason",
  //     date:"20-11-2020",
  //     status:"Pending",
  //     color:"primary",
  //   },
  // ]

        // const tableDatas = {
        //   columns,
        // data,
        // };
  return (
    <div>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Module Dashboard</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Module Dashboard
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
      <p></p>
    <p></p>
    <p></p>
    <p></p>
      {/* <p><span>
              <i className="fe fe-book"></i>&nbsp;
            </span>
           <Link to={`${process.env.PUBLIC_URL}/CMF00000_21`}>Help Document</Link>
            Help Document 
            </p> */}
            
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={3}>
            <Link to={`${process.env.PUBLIC_URL}/CMF00000_21`}>
              <Card className=" overflow-hidden">
                
                <Card.Body className="card-body">
                  <Row>
                 
                    <div className="col">
                      <h6 className="">{modItem?.item?.modNm}</h6>
                      <h3 className="mb-2 number-font">
                        {/* <CountUp
                          end={34516}
                          separator=","
                          start={0}
                          duration={2.94}
                        /> */}
                        Help Document
                      </h3>
                    {/*   <p className="text-muted mb-0">
                        <span className="text-primary me-1">
                          <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p> */}
                    </div>
                    
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-file text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
              </Link>
            </Col>
           
          </Row>
        </Col>
      </Row>
      {/* <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h3 className="card-title mb-0">Request Status</h3>
            </Card.Header>
            <Card.Body>
              <div className="salesdatatable">
                <div className="table-responsive">
                <DataTableExtensions {...tableDatas} >
          <DataTable 
           columns={columns}  
         data={data}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          striped={true}
          center={true}
          persistTableHead
          pagination
          highlightOnHover />
          </DataTableExtensions>
               
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
