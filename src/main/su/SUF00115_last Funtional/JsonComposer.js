import React from "react";

import { Dropdown } from "react-bootstrap";
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
import { Link } from "react-router-dom";

import JSONInput from 'react-json-editor-ajrm/index';
import locale    from 'react-json-editor-ajrm/locale/en';
import { Component } from "react";
import ReactDOM from "react-dom";

// constructor=()=>{
//   this.onJsonChange = this.onJsonChange.bind(this);
// }
 
// onJsonChange=(key, value, parent, data)=>{
//   console.log(key, value, parent, data);
// }


//export default function JsonComposer() {
  export function JsonComposer ({setApiReqStruc, initialObj}) {

    

  return (
    <div>

      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Body>
              <Row>
                <div className="col-lg-12 col-md-12">
   
                <JSONInput
                  id          = 'a_unique_id'
                  placeholder = { initialObj.jsObject }
                  //colors      = { darktheme }
                  locale      = { locale }
                  height      = '550px'
                  width="100%"
                  onChange={(obj)=>setApiReqStruc(obj)}
                  />


                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Row>
      
    </div>
  );
}

