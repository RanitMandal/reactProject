import React, { useState } from 'react'
import "../../assets/css/coustom.css"
import { Alert } from "react-bootstrap";
import {

    IconButton,

} from "@mui/material";


function MsgAlert({errExp, msgTyp, msg }) {

    const [showMsg, set_showMsg] = useState(false)
    const handle_showMsg = ()=>{
        set_showMsg(!showMsg)
    }

  return (
    <div className="card">
    <Alert variant={msgTyp==="AI" ? "success" : "danger"}>
           
      <div className="msg-container">
      <div className="msg-1">
      <span className="alert-inner--icon">
          <i className={`${msgTyp==="AI" ?
          "fa fa-bell-o":"fe fe-slash"} me-2` }aria-hidden="true"></i></span>&nbsp;
            <strong>{msg}</strong>
          </div>

          <div style={{display: showMsg? "block": "none"}}  className="msg-2" >
            <p>{errExp?.content}</p>
          </div>

{ errExp?.content && <IconButton
                  aria-label="close"
                  // onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: "15px",
                    top: "-8px"
                  }}
                  onClick={handle_showMsg}
              >
                  <i
                      className="mdi mdi-alert-octagon fs-100"
                      title="mdi-alert-octagon"
                    ></i>
              </IconButton>}

      </div>
    </Alert>
    </div>
  )
}

export default MsgAlert