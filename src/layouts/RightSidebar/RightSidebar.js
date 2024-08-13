import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { getApiToken, getScplAdContext } from "../../main/common/common";
import axios from "axios";
import face6 from "../../assets/images/faces/6.jpg";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeReqstForm } from "../../main/su/SUF00137/SUF00137_02";
import ReportProblem from "../../main/su/SUF00137/SUF00137_03";
import ChangeRequestTracking from "../../main/su/SUF00151/SUF00151_01";

const headers = { Authorization: "Bearer " + getApiToken() };


export function RightSidebar({currentModuleId, navHistObj}) {
  const navigate = useNavigate()
  const [rightsidebartoogle, setSidebartoogleright] = useState(true);
  function Outhover(toggle) {
    setSidebartoogleright(!toggle);
    document.querySelector(".sidebar-right").classList.remove("sidebar-open");
  }
   
//custom code
  const [contacts, set_contacts] = useState([])
  const currentModule = sessionStorage.getItem("modId")

 useEffect(() => {
  const body={
    apiId: "SUA00598",
    criteria: {
      modId: currentModule
    }
  }
   const fetchContacts = async ()=>{
    await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00156/getAllDataByModId", 
    body, 
    {headers})
    .then(res=>{
      set_contacts(res.data?.content?.qryRsltSet)
    })
   }
   fetchContacts()
 }, [currentModule])

 

 const [createModalOpen, setCreateModalOpen] = useState({
  open: false,
  data: null,
});

const [reportTrackModalOpen, set_reportTrackModalOpen] = useState(false);

const handle_OpenReportModle = (e)=>{
  e.preventDefault()
  setCreateModalOpen({
    open: true,
  data: null,
  })
}

const handle_OpenReportTrackModule = (e)=>{
  e.preventDefault()
  set_reportTrackModalOpen(true)
}

  return (
    <div className="sidebar sidebar-right sidebar-animate">
      <div className="panel panel-primary card mb-0 shadow-none border-0">
        <div className="tab-menu-heading border-0 d-flex p-3">
          <div className="card-title mb-0">More</div>
          <div className="card-options ms-auto">
            <Link
              to="#"
              className="sidebar-icon text-end float-end me-1"
              onClick={() => Outhover(rightsidebartoogle)}
            >
              <i className="fe fe-x text-white"></i>
            </Link>
          </div>
        </div>
        <div className="panel-body tabs-menu-body latest-tasks p-0 border-0">
          <div className="tabs-menu border-bottom"></div>
          <Tabs
            defaultActiveKey="side1"
            className="nav panel-tabs tab-content rightside flex-nowrap"
            variant=""
          >
            <Tab eventKey="side1"  title="Utility">
              <div className="tab-pane active" id="side1">
                {/* <div className="card-body text-center">
                  <div className="dropdown user-pro-body">
                    <div className="">
                      <img
                        alt="user-img"
                        className="avatar avatar-xl brround mx-auto text-center"
                        src={face6}
                      />
                      <span className="avatar-status profile-status bg-green"></span>
                    </div>
                    <div className="user-info mg-t-20">
                      <h6 className="fw-semibold  mt-2 mb-0">
                        Mintrona Pechon
                      </h6>
                      <span className="mb-0 text-muted fs-12">
                        Premium Member
                      </span>
                    </div>
                  </div>
                </div> */}
                
                
                
                <Link
                onClick={handle_OpenReportModle}
                  className="dropdown-item d-flex border-bottom"
                  //to={`${process.env.PUBLIC_URL}/pages/mailInbox/`}
                >
                  <div className="d-flex">
                    <i className="fe fe-mail me-3 tx-20 text-muted"></i>
                    <div className="pt-1">
                      <h6 className="mb-0">Report Problem</h6>
                      <p className="tx-12 mb-0 text-muted">
                        Report Problem / Change Request
                      </p>
                    </div>
                  </div>
                </Link>
                {/* <Link
                //onClick={handle_OpenReportTrackModule}
                  className="dropdown-item d-flex border-bottom"
                  to={`${process.env.PUBLIC_URL}/SUF00151_01/`}
                >
                  <div className="d-flex">
                    <i className="fe fe-settings me-3 tx-20 text-muted"></i>
                    <div className="pt-1">
                      <h6 className="mb-0">Track Request</h6>
                      <p className="tx-12 mb-0 text-muted">
                        Track your Request Status
                      </p>
                    </div>
                  </div>
                </Link> */}
                <Link
                //onClick={handle_OpenReportTrackModule}
                  className="dropdown-item d-flex border-bottom"
                  to={`${process.env.PUBLIC_URL}/SUF00137_04/`}
                >
                  <div className="d-flex">
                    <i className="fe fe-settings me-3 tx-20 text-muted"></i>
                    <div className="pt-1">
                      <h6 className="mb-0">Track Request</h6>
                      <p className="tx-12 mb-0 text-muted">
                        Close Your Request
                      </p>
                    </div>
                  </div>
                </Link>
              
              </div>
            </Tab>

            <Tab eventKey="side2" title="Contacts">
              <div className="tab-pane" id="side2">
               <div className="list-group list-group-flush">
  {contacts?.map((item) => (
    <div className="list-group-item d-flex align-items-center">
      <div className="me-2">
      <div style={{backgroundColor: "#6259ca"}} className="avatar avatar-md brround cover-image">
                          <span>{item.contactNm[0].toUpperCase()}</span>
                        </div>
        {/* <span className="avatar-status bg-success rcontacts"></span> */}
      </div>
    
      <div>
        <div className="fw-semibold">{item.contactNm}</div>
        <p className="mb-0 tx-12 text-muted">
        {item.contactNo}
        </p>
        <p className="mb-0 tx-12 text-muted">
        {item.emailId}
        </p>
      </div>
    </div>
  ))}
</div>

              </div>
            </Tab>

            <Tab eventKey="side3" title="Navigation">
              <div className="tab-pane" id="side3">
                <Link className="dropdown-item bg-gray-100 pd-y-10" to="#">
                  Navigation History
                </Link>
                <div className="card-body">
                  {
                    navHistObj?.modnames?.map((item, index) => (
                      <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      
                      <span onClick={()=>navigate("/"+navHistObj.modPaths[index])} className="custom-switch-description mg-l-10">
                      <i className="fe fe-link"></i> {item}
                      </span>
                    </label>
                  </div>
                    ))
                  }
                  {/* <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Allow Location Map
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show Contacts
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show Notication
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show Tasks Statistics
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show Email Notification
                      </span>
                    </label>
                  </div> */}
                </div>
                {/* <Link className="dropdown-item bg-gray-100 pd-y-10" to="#">
                  General Settings
                </Link>
                <div className="card-body">
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show User Online
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Website Notication
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Show Recent activity
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Logout Automatically
                      </span>
                    </label>
                  </div>
                  <div className="form-group mg-b-10">
                    <label className="custom-switch ps-0">
                      <input
                        type="checkbox"
                        name="custom-switch-checkbox"
                        className="custom-switch-input"
                      />
                      <span className="custom-switch-indicator"></span>
                      <span className="custom-switch-description mg-l-10">
                        Aloow All Notifications
                      </span>
                    </label>
                  </div>
                </div> */}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>

      <CreateModal
                    
                    open={createModalOpen.open}
                    data={createModalOpen.data}
                    
                    onClose={() => setCreateModalOpen({
                        open: false,
                        data: null
                    })}
                    
                    
                />

      <CreateReportTrackModal 
      open={reportTrackModalOpen}
      onClose={() => set_reportTrackModalOpen(false)} />
    </div>
  );
}
export const CreateModal = ({ open, onClose, mode=1 }) => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
      status: true,
      content: ""
  })
  const [addVal, setAddVal] = useState([])


  const call_formOpen_api = async (url, headers) => {
      let obj = {
          apiId: "SUA00538"
      }
      await axios.post(url, obj, { headers }).then(res => {
          setAddVal(res.data.content.mst)
          setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
          set_errExp({status:res.data?.appMsgList?.errorStatus})

      }).catch(error => {
          console.log(error);
      })
  }




  useEffect(() => {
      let url = "";
      let body = {}

      if (mode === 1) {
          url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00137/openAddForm";
      }
      

      { (mode === 1) && open && call_formOpen_api(url, headers) }
      
  }, [mode])










  const handleClose = () => {
      onClose();
      setAddVal([])
          setMsg("")
          setMsgTyp("")
          set_errExp({
            status: true,
            content: ""
        })
  }


  return (


    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
    <DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon style={{ color: "black" }} />
        </IconButton>
      
    </DialogTitle>
    <DialogContent>

    <ChangeReqstForm mode={1}  
                    msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} 
                    
                    errExp={errExp} set_errExp={set_errExp} />
    </DialogContent>
    <DialogActions>

    </DialogActions>
  </Dialog>

  );
};

export const CreateReportTrackModal = ({ open, onClose }) => {



  const handleClose = () => {
      onClose();

  }


  return (


    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
    <DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon style={{ color: "black" }} />
        </IconButton>
      
    </DialogTitle>
    <DialogContent>
          <ReportProblem />
    
    </DialogContent>
    <DialogActions>

    </DialogActions>
  </Dialog>

  );
};
export default RightSidebar;
