import React, { useState } from 'react'
import {
    Tabs,
    Tab,
    OverlayTrigger,
    Tooltip,
    Breadcrumb,
    Card,
    Row,
    Col,
    Form,
    Button,
  } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

const NewsForHeader = ({data}) => {
  const navigate = useNavigate()
  console.log(data, "yyyyyyyyyyyyyyy");
  const [showfile, set_showfile] = useState(false)
  const handle_showFile = ()=>{
    set_showfile(!showfile)
    navigate(process.env.REACT_APP_API_URL_PREFIX + data?.fileUrl)
  }
  return (
    <Row>
    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
      <div className=''>
        <Card.Header>
          <h4
           style={{
            textDecoration: "none",
            color: data?.newsColor ? data?.newsColor :"black",
            fontStyle: data?.newsItalicFlg === "Y"? "italic":"normal",
            fontWeight: data?.newsBoldFlg === "Y"? "bold":"normal",
            fontSize: data?.newsFontSz ? data?.newsFontSz+"px" : "inherit",
            fontFamily: data?.newsFont ? data?.newsFont: "inherit",
            marginRight: "5px"
          }}
           className="card-title">{data?.newsTitle} </h4>
           {data?.newsBlinkFlg === "Y" && <img className='blink' src="../../../new.png" width={25} />}
        </Card.Header>
        <Card.Body>
        <div className="col-lg-12">
          <p style={{
            textDecoration: "none",
            color: data?.newsColor ? data?.newsColor :"black",
            fontStyle: data?.newsItalicFlg === "Y"? "italic":"normal",
            fontWeight: data?.newsBoldFlg === "Y"? "bold":"normal",
            fontSize: data?.newsFontSz ? data?.newsFontSz+"px" : "inherit",
            fontFamily: data?.newsFont ? data?.newsFont: "inherit"
          }}>{data?.newsText}</p>
        </div>
          {data?.newsUrl && <div className="col-lg-12"><Link target='_blank' to={data?.newsUrl}>News URL</Link></div>}
          {data?.fileUrl && <div className="col-lg-12"><Link target='_blank' to={process.env.REACT_APP_API_URL_PREFIX +data?.fileUrl}>File URL</Link></div>}
        </Card.Body>
      </div>
    </div>
  </Row>
  )
}

export default NewsForHeader;