import React, { useEffect, useRef, useState } from 'react';
//vendor3@gmail.com gg
import "../../../assets/css/coustom_va.css";
import Smalltag from '../../common/SmallTag/smalltag.js';
import GeneralInfoCard from "../VAS00004/cards/GeneralInfoCard.jsx";
import ManufacturingFacilityCard from "../VAS00004/cards/ManufacturingFacilityCard.jsx";
import TestingFacilities from "../VAS00004/cards/TestingFacilities.jsx";
import FinancialInfo from "../VAS00004/cards/FinancialInfo.jsx";
import MarketingNetwork from "../VAS00004/cards/MarketingNetwork.jsx";
import AfterSaleService from "../VAS00004/cards/AfterSaleService.jsx";
import PerformanceReliability from "../VAS00004/cards/PerformanceReliability.jsx";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Breadcrumb, Row, Card } from "react-bootstrap";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeaderCard from '../VAS00004/cards/HeaderCard.jsx';
import moment from 'moment';
import { getApiToken, getScplAdContext } from "../../common/common"
const headers = { Authorization: 'Bearer ' + getApiToken() };


function NewApplication() {
  const navigate = useNavigate()
  const [activeDate, set_activeDate] = useState({
    from: "",
    to: "",
    today: new Date().getTime(),
    status: false
  })
  const getActiveDate = async () => {
    let obj ={
        apiId: "VAA00009"
    }
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/VAF00001/getActivePeriod", obj, {headers} ).then((res) => {
      if (res.data?.content?.fromDate && res.data?.content?.toDate)
        set_activeDate({
          ...activeDate,
          from: new Date(res.data.content.fromDate).getTime(),
          to: new Date(res.data.content.toDate).getTime(),
          status: true
        })
      console.log('====================================');
      console.log(new Date(res.data.content.toDate).getTime());
      console.log('====================================');
    })

  }
  useEffect(() => {
    localStorage.setItem("applicationNo", "");
  }, [])

  useEffect(() => {

    getActiveDate()

  }, [])



  const [selectedProduct, setSelectedProduct] = useState({
    code: "",
    desc: "",
    index: -1
  })

  const [submitCond, setSubmitCond] = useState({
    category: false,
    product: false,
    GI: false,
    MF: false
  })

  const submitApplicaton = async () => {
    //sa
    if (!submitCond.GI) {
      alert("Plese fill General Information")
    }
    else if (!submitCond.MF) {
      alert("Plese fill Manufacturing Facility")
    }

    else {
      if (window.confirm("Are you sure? After submission you cannot edit the application!")) {
        await axios.put(process.env.REACT_APP_BASE_URL + "/api/v1/submit?appNo=" + localStorage.getItem("applicationNo")).then((res) => {
          if (res.data.code === 0) {
            alert("submitted Successfully")
            navigate(`${process.env.PUBLIC_URL}/Dashboard`)
          }
        })
      }
    }
  }






  return (
    <>
      {/* <Header></Header> */}

      <div className="page-header">
        <div>
          <h1 className="page-title">New Application</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              New Application
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <div style={{ padding: "10px", borderRadius: "15px" }} className='col-md-12 bg-white pd-15'>
            {(activeDate?.status) ?
              <b className='imp-msg'>{`Portal will be active from ${moment(activeDate.from).format('DD/MM/YYYY')}  to  ${moment(activeDate.to).format('DD/MM/YYYY')}`}</b>
              :
              <b>Portal is Closed</b>
            }


          </div>
        </div>
      </div>

      <div className="main-body-pannel card bg-light">
        <div className='card-body'>

          <div className="right-pannel-div">
            <div className="right-pannel-div-inner">
              <div className="row">
                <div className="col-md-12">

                  <HeaderCard lable="New Application" mode={3} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />

                </div>
                <div className='col-md-12'>
                  <div id="main" >
                    <div className="" >
                      <div className="accordion" id="faq" >

                        <Accordion defaultExpanded="true">
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            cl="accordian_header1"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead1">General Information </div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div>

                                <GeneralInfoCard mode={3} setSubmitCond={setSubmitCond} submitCond={submitCond} selectedProduct={selectedProduct} />


                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}

                          >
                            <Typography><div id="faqhead2">Manufacturing Facility</div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div>
                                {/* <div className="" id="faqhead2">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq2"
                            aria-expanded="true" aria-controls="faq2">Manufacturing Facility</Link>
                        </div> */}

                                <ManufacturingFacilityCard submitCond={submitCond} setSubmitCond={setSubmitCond} mode={3} />
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead2">Testing Facilities & Quality Control</div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div>
                                {/* <div className="card-header" id="faqhead3">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq3"
                            aria-expanded="true" aria-controls="faq3">Testing Facilities & Quality Control</Link>
                        </div> */}


                                <TestingFacilities mode={3} />

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4a-content"
                            id="panel4a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead2">Financial Information</div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div>
                                {/* <div className="card-header" id="faqhead4">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq4"
                            aria-expanded="true" aria-controls="faq4">Financial Information</Link>
                        </div> */}


                                <FinancialInfo mode={3} />

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel5a-content"
                            id="panel5a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead2">Marketing Network (Availability in Market) </div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div>
                                {/*  <div className="card-header" id="faqhead5">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq5"
                            aria-expanded="true" aria-controls="faq5">Marketing Network (Availability in Market) </Link>
                        </div> */}


                                <MarketingNetwork mode={3} />

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>


                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel6a-content"
                            id="panel6a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead2">After Sales Service </div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div >
                                {/*   <div className="card-header" id="faqhead6">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq6"
                            aria-expanded="true" aria-controls="faq6">After Sales Service</Link>
                        </div> */}


                                <AfterSaleService mode={3} />

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion className='mb-1'>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel7a-content"
                            id="panel7a-header"
                            style={{ backgroundColor: "#eaedf7", marginTop: "20px" }}
                          >
                            <Typography><div id="faqhead2">Performance Reliability </div></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div className="mytable">
                                {/*  <div className="" id="faqhead7">
                            <Link to="#" className="btn btn-header-link collapsed" data-toggle="collapse" data-target="#faq7"
                            aria-expanded="true" aria-controls="faq7">Performance Reliability </Link>
                        </div> */}
                                {/* yy */}

                                <PerformanceReliability mode={3} />

                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>







                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {console.log("xxxxxxxxx", activeDate?.today, activeDate?.to)}
              {(activeDate.status && activeDate?.today < activeDate?.to) && <div class="text-center">


                <button onClick={submitApplicaton} className="Enquiry-btn ml-auto mt-2 bg-important btn  btn-success">Submit</button>
              </div>}
            </div>

          </div>

        </div>
      </div>


    </>
  );
}

export default NewApplication;
