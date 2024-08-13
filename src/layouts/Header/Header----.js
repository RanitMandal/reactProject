import React, { useEffect } from "react";
import { Dropdown, Navbar, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NewsForHeader from "../../main/su/SUF00131/SUF00131_03";
import { getApiToken, getScplAdContext } from "../../main/common/common";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
const headers = { Authorization: "Bearer " + getApiToken() };

export function Header({allNews,currentModuleId, headerProfImgAdd, favLinkList=[], set_favLinkList}) {
const navigate = useNavigate()
const location = useLocation();
 console.log(currentModuleId); 
// const lvlRefCd = location.state;
// console.log(lvlRefCd);
// const locFlg=getScplAdContext().locFlg;
// const forceToChangePwd = getScplAdContext()?.detailData?.forceToChangePwd ? getScplAdContext()?.locFlg: "";  

// const [siteCredential, set_siteCredential] = useState()
// //const currentModuleId = sessionStorage.getItem("modId")
//  useEffect(() => {
//   const body={
//     apiId: "SUA00598"
    
//   }
//    const fetchSiteCredential = async ()=>{
//     await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/CMF00000/jacketInfo/jacketInfoPage", 
//     body, 
//     {headers})
//     .then(res=>{
//       set_siteCredential(res.data)
//     })
//    }
//    fetchSiteCredential()
//  }, [])


//  const [allNews, set_allNews] = useState([])
 const [whatsNew, set_whatsNew] = useState([])
 const [alert, set_alert] = useState([])


 
 
 const locFlg = getScplAdContext()?.locFlg ? getScplAdContext()?.locFlg: "";
  const locLen = getScplAdContext()?.detailData?.listLocation?.length ? getScplAdContext()?.detailData?.listLocation?.length: 0;
  const moduleLen = Number(sessionStorage.getItem("moduleLen")) || 0;
  const data = getScplAdContext().detailData.listLocation
  const lvlRefCd = getScplAdContext().detailData?.listLocation[0]?.id
  const currentLvlRefNm = sessionStorage.getItem("currentLvlRefNm");
  const forceToChangePwd = getScplAdContext().detailData?.forceToChangePwd
  const switchModule = (e)=>{
    if(moduleLen > 1)navigate(process.env.PUBLIC_URL+"/CMF00000_05", {state:lvlRefCd})
  }
  const switchLocation = (e)=>{
    if(locFlg && locFlg === "A") navigate(process.env.PUBLIC_URL+"/CMF00000_03", {state:data})
    else navigate(process.env.PUBLIC_URL+"/CMF00000_04", {state:data})
  }

  //full screen
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  //dark-mode
  const Darkmode = () => {
    document.querySelector(".app").classList.toggle("dark-mode");
  };
  
  //leftsidemenu
  const openCloseSidebar = () => {
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };

  //rightsidebar
  const openCloseSidebarright = () => {
    document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  };

  // responsivesearch
  const responsivesearch = () => {
    document.querySelector(".header-search").classList.toggle("show");
  };

  //swichermainright
  const swichermainright = () => {
    document.querySelector(".demo_changer").classList.toggle("active");
    document.querySelector(".demo_changer").style.right = "0px";
  };

  const [open, setOpen] = useState(false); // State to control the dialogue visibility

  const handleOpen = () => {
    setOpen(true); // Open the dialogue
  };

  const handleClose = () => {
    setOpen(false); // Close the dialogue
  };

  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    data: null,
  });

  return (
    <Navbar expand="md" className="app-header header sticky">
      <Container fluid className="main-container">
        <div className="d-flex align-items-center">
          <div
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          ></div>
          <div className="responsive-logo">
            <Link
              //to={`${process.env.PUBLIC_URL}/dashboard/`}
              className="header-logo"
            >
              <img
                src={require("../../assets/images/brand/logo-3.png")}
                className="mobile-logo logo-1"
                alt="logo"
              />
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="mobile-logo dark-logo-1"
                alt="logo"
              />
            </Link>
          </div>
          <Link
            className="logo-horizontal "
            to={`${process.env.PUBLIC_URL}/dashboard/`}
          >
            <img
              src={require("../../assets/images/brand/logo.png")}
              className="header-brand-img desktop-logo"
              alt="logo"
            />
            <img
              src={require("../../assets/images/brand/logo-3.png")}
              className="header-brand-img light-logo1"
              alt="logo"
            />
          </Link>
          <div className="main-header-center ms-3 d-none d-lg-block" style={{marginTop:"0px"}}>
            <h4>{currentLvlRefNm}</h4>
            
          </div>
          {/* <div className="main-header-center ms-3 d-none d-lg-block">
            <input
              className="form-control"
              placeholder="Search for anything..."
              type="search"
            />
            <Button variant="" className="btn">
              <i className="fa fa-search" aria-hidden="true"></i>
            </Button>
          </div> */}
          <div className="d-flex order-lg-2 ms-auto header-right-icons">
            <Navbar.Toggle
              aria-controls="navbarScroll"
              className="navresponsive-toggler d-lg-none ms-auto"
              type="button"
            >
              <span className="navbar-toggler-icon fe fe-more-vertical text-dark"></span>
            </Navbar.Toggle>

            <div className="navbar navbar-collapse responsive-navbar p-0">
              <Navbar.Collapse
                className="navbar-collapse"
                id="navbarSupportedContent-4"
              >
                <div className="d-flex order-lg-2">
                  <div className="dropdown d-block d-lg-none">
                    <div
                      to="#"
                      className="nav-link icon"
                      onClick={() => responsivesearch()}
                    >
                      <i className="fe fe-search"></i>
                    </div>
                    <div className="dropdown-menu header-search dropdown-menu-start">
                      <div className="input-group w-100 p-2 border">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search...."
                        />
                        <div className="input-group-text btn btn-primary">
                          <i className="fa fa-search" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown d-md-flex">
                    <div
                      to="#"
                      className="nav-link icon theme-layout nav-link-bg layout-setting"
                      onClick={() => Darkmode()}
                    >
                      <span className="dark-layout">
                        <i className={`fe ${"fe-moon"}`}></i>
                      </span>
                      <span className="light-layout">
                        <i className={`fe ${"fe-sun"}`}></i>
                      </span>
                    </div>
                  </div>
                  <div className="dropdown d-md-flex">
                    <div
                      to="#"
                      className="nav-link icon full-screen-link nav-link-bg"
                      onClick={Fullscreen}
                    >
                      <i className="fe fe-minimize fullscreen-button"></i>
                    </div>
                  </div>
                  

<Dropdown className="dropdown d-md-flex message">
                    <Dropdown.Toggle
                      className="nav-link icon text-center d-flex"
                      variant=""
                    >
                      <i className="fe fe-bell"></i>
                      <span className=" pulse"></span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading border-bottom">
                        <div className="d-flex">
                          <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                          You Have Notifications
                          </h6>
                          <div className="ms-auto">
                            <span className="badge bg-danger rounded-pill">
                              {allNews?.filter(item => item.newsTyp === "5").length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="message-menu" style={{ maxHeight: "500px", overflowY: "auto", zIndex:"1" }}>
                        

                      {allNews?.filter(item => item.newsTyp === "5").map((item, index) => (
        <Dropdown.Item
          key={index}
          className="d-flex"
         // href={`${process.env.PUBLIC_URL}/components/defaultChat/`}
         onClick={(e)=>setCreateModalOpen({
          open: true,
          data: item,
          type: "1"
      })}
        >
          <img
            alt=""
            className="avatar avatar-md brround me-3 cover-image"
            src={require("../../assets/images/users/1.jpg")}
          />
          <div className="wd-90p">
            <div className="d-flex">
              {item?.newsTitle && <h5 className="mb-1">{item.newsTitle}</h5> }
             {/*  <small className="text-muted ms-auto text-end">
                {item.newsDispFrDt} 
              </small> */}
              <small className="text-muted ms-auto text-end">
              {item.newsDispFrDt}&nbsp; {item.newsDispFrTm}
              </small>
            </div>
            <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.newsText} .....</span>
          </div>
        </Dropdown.Item>
      ))}
         {/* Dialogue component */}
         
        {/* Dialogue component end */}

                        
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      <div
                        to="#"
                        className=" dropdown-item text-center p-3 text-muted"
                      >
                        See all Messages
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Dropdown className="dropdown d-md-flex message">
                    <Dropdown.Toggle
                      className="nav-link icon text-center d-flex"
                      variant=""
                    >
                      <i className="fe fe-message-square"></i>
                      <span className=" pulse-danger"></span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading border-bottom">
                        <div className="d-flex">
                          <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                          Whats New!
                          </h6>
                          <div className="ms-auto">
                            <span className="badge bg-danger rounded-pill">
                              {allNews?.filter(item => item.newsTyp === "1").length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="message-menu" style={{ maxHeight: "500px", overflowY: "auto", zIndex:"1" }}>
                        

                      {allNews?.filter(item => item.newsTyp === "1").map((item, index) => (
        <Dropdown.Item
          key={index}
          className="d-flex"
         // href={`${process.env.PUBLIC_URL}/components/defaultChat/`}
         onClick={(e)=>setCreateModalOpen({
          open: true,
          data: item,
          type: "1"
      })}
        >
          <img
            alt=""
            className="avatar avatar-md brround me-3 cover-image"
            src={require("../../assets/images/users/1.jpg")}
          />
          <div className="wd-90p">
            <div className="d-flex">
              {item?.newsTitle && <h5 className="mb-1">{item.newsTitle}</h5> }
             {/*  <small className="text-muted ms-auto text-end">
                {item.newsDispFrDt} 
              </small> */}
              <small className="text-muted ms-auto text-end">
              {item.newsDispFrDt}&nbsp; {item.newsDispFrTm}
              </small>
            </div>
            <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.newsText} .....</span>
          </div>
        </Dropdown.Item>
      ))}
         {/* Dialogue component */}
         
        {/* Dialogue component end */}

                        
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      <div
                        to="#"
                        className=" dropdown-item text-center p-3 text-muted"
                      >
                        See all Messages
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>



                  
                  <Dropdown className="d-md-flex notifications">
                    <Dropdown.Toggle className="nav-link icon " variant="">
                      <i className="fe fe-star"></i>
                      <span className=" pulse"></span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className=" dropdown-menu-end dropdown-menu-arrow "
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading border-bottom">
                        <div className="d-flex">
                          <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                            Favourite Links
                          </h6>
                          <div className="ms-auto">
                            <span className="badge bg-success rounded-pill">
                              {favLinkList?.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="notifications-menu">
                        
                      {favLinkList?.map((item)=>(<Dropdown.Item
                          className=" d-flex"
                          href={`${process.env.PUBLIC_URL}/${item?.favUrl}`}
                        >
                          <div className="me-3 notifyimg  bg-secondary-gradient brround box-shadow-primary">
                            <i className="fe fe-star"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              {item?.favNm}
                            </h5>
                            
                          </div>
                        </Dropdown.Item>
        ))}
                        
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      {/* <Link
                        to="#"
                        className=" dropdown-item text-center p-3 text-muted"
                      >
                        View all Notification
                      </Link> */}
                    </Dropdown.Menu>
                  </Dropdown>




                  <Dropdown className=" d-md-flex profile-1">
                    <Dropdown.Toggle
                      className="nav-link profile leading-none d-flex px-1"
                      variant=""
                    >
                      {headerProfImgAdd ? 
                        <span>
                          <img
                            src={headerProfImgAdd}
                            alt="profile-user"
                            className="avatar  profile-user brround cover-image"
                          />
                        </span>:
                        <>
                        <div className="avatar  profile-user brround cover-image mini-prof-text">
                          <span>{getScplAdContext().userNm[0].toUpperCase()}</span>
                        </div>
                        </>
                      }
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading">
                        <div className="text-center">
                          <h5 className="text-dark mb-0">{getScplAdContext().userNm}</h5>
                          <small className="text-muted">{getScplAdContext().userId}</small>
                        </div>
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      {/* <Dropdown.Item
                        href={`${process.env.PUBLIC_URL}/pages/profile/`}
                      >
                        <i className="dropdown-icon fe fe-user"></i> Profile
                      </Dropdown.Item> */}
                      {console.log(moduleLen, forceToChangePwd, "ooooooooooo")}
                      {(moduleLen>1 && !forceToChangePwd)&&
                      <Dropdown.Item
                        
                      >
                        <div onClick={switchModule}>
                        <i className="dropdown-icon fe fe-mail"></i>Switch Module
                        <span className="badge bg-secondary float-end">{moduleLen}</span>
                        </div>
                      </Dropdown.Item>}
                      {(!forceToChangePwd && (locFlg ==="A" || locLen > 1  )) && 
                      <Dropdown.Item
                        
                      >
                        <div onClick={switchLocation}>
                        <i className="dropdown-icon fe fe-mail"></i>Switch Location
                        {locFlg !=="A" && <span className="badge bg-secondary float-end">{locLen}</span>}
                        </div>
                      </Dropdown.Item>}
                      {/* <Dropdown.Item
                        href={`${process.env.PUBLIC_URL}/pages/mailCompose/`}
                      >
                        <i className="dropdown-icon fe fe-settings"></i>
                        Settings
                      </Dropdown.Item> */}
                      {/* <Dropdown.Item
                        href={`${process.env.PUBLIC_URL}/pages/faqs/`}
                      >
                        <i className="dropdown-icon fe fe-alert-triangle"></i>
                        Need help?p??
                      </Dropdown.Item> /CMF00000_13/ */}
                      {!getScplAdContext()?.detailData?.forceToChangePwd &&<Dropdown.Item
                        href={`/SUF00033_03/`}
                      >
                        <i className="dropdown-icon fe fe-user"></i> Enable Mobile Login
                      </Dropdown.Item>}
                      {!getScplAdContext()?.detailData?.forceToChangePwd &&<Dropdown.Item
                        href={`/CMF00000_13/`}
                      >
                        <i className="dropdown-icon fe fe-user"></i> Update Profile
                      </Dropdown.Item>}
                      {!getScplAdContext()?.detailData?.forceToChangePwd &&<Dropdown.Item
                        href={`/CMF00000_02/`}
                      >
                        <i className="dropdown-icon fe fe-user"></i> Change Password
                      </Dropdown.Item>}
                      <Dropdown.Item
                        href={`${process.env.PUBLIC_URL}/`}
                      >
                        <i className="dropdown-icon fe fe-alert-circle"></i>
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div className="dropdown d-md-flex header-settings">
                    <div
                      to="#"
                      className="nav-link icon "
                      onClick={() => openCloseSidebarright()}
                    >
                      <i className="fe fe-menu"></i>
                    </div>
                  </div>
                </div>
              </Navbar.Collapse>
            </div>
            <div
              className="demo-icon nav-link icon border-0"
              onClick={() => swichermainright()}
            >
              <i className="fe fe-settings fa-spin"></i>
            </div>
          </div>
        </div>
      </Container>
      <CreateModal
                    
                    open={createModalOpen.open}
                    data={createModalOpen.data}
                    
                    onClose={() => setCreateModalOpen({
                        open: false,
                        data: null
                    })}
                    
                    
                />
    </Navbar>
  );
}


export const CreateModal = ({ open, onClose, setData, data }) => {











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

     <NewsForHeader data={data}/>
    </DialogContent>
    <DialogActions>

    </DialogActions>
  </Dialog>

  );
};




export default Header;