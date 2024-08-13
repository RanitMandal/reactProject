import React, { Fragment, useState, useEffect } from "react";
import { MENUITEMS } from "./SideMenu";
import { Link, NavLink } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import axios from 'axios';
import {getApiToken} from "../../main/common/common"
import {getScplAdContext} from "../../main/common/common"
import { logDOM } from "@testing-library/react";

const Sidebar = ({sidebarModId}) => {
  const modId = sessionStorage.getItem("modId");
  const userId = getScplAdContext().userId;
  let menuData=[];
  if(sessionStorage.getItem("menuTree")){
    menuData = JSON.parse(sessionStorage.getItem("menuTree"))
  }
  const [sideMenuItems, setSideMenuItems] = useState(menuData);

  useEffect(() => {
   
      const headers = { Authorization: 'Bearer ' + getApiToken() };
      const body = {
        modId: sidebarModId, 
        userId: userId  
      }
      // let a = `${process.env.PUBLIC_URL}/abs`
      // console.log(a);
      axios.post(process.env.REACT_APP_API_URL_PREFIX +`/token/menuTree`, body,  {headers} )
          .then(response => {
            console.log(response.data);

            if(sidebarModId) {
              setSideMenuItems(response.data?.content?.menuItems) 
              sessionStorage.setItem("menuTree", JSON.stringify(response.data?.content?.menuItems));
              const resData = response.data?.content?.menuItems[0].items.map(obj=>{
                obj.children.map(item=>{
                  if(item.type === 'link')
                    item.path = `${process.env.PUBLIC_URL}/${item.path}`
                  console.log(item.path, item.type);
                  return item
                })
                return obj
              })

              
              console.log("7777777777777777",resData);
              console.log(response.data?.content?.menuItems);
            }
          }
      );      
          
  }, [sidebarModId]);

  const sidebarList = sideMenuItems
  //const sidebarList = MENUITEMS

//   const [sidebarList, setSidebarList] = useState([]);
//   if (getScplAdContext()?.detailData.listModule.length === 1){
//     setSidebarList (getScplAdContext()?.detailData?.menuItems)
//     }
//   else if (getScplAdContext()?.detailData.listModule.length === 0){
//     setSidebarList ([])
//     }
//     else if (getScplAdContext()?.detailData.listModule.length === 0 && sessionStorage.getItem("modId")) {
//       setSidebarList (sideMenuItems)
//       }
// else  {
//   setSidebarList ([])
// }
  

  
  const [mainmenu, setMainMenu] = useState(sidebarList);
  useEffect(() => {
    const currentUrl = window.location.pathname.slice(0, -1);
    sidebarList.map((items) => {
      items.items.filter((items) => {
        if (items.path === currentUrl) setNavActive(items);
        if (!items.children) return false;
        items.children.filter((subitems) => {
          if (subitems.path === currentUrl) setNavActive(subitems);
          if (!subitems.children) return false;
          subitems.children.filter((subSubitems) => {
            if (subSubitems.path === currentUrl) {
              setNavActive(subSubitems);
              return true;
            } else {
              return false;
            }
          });
          return subitems;
        });
        return items;
      });
      return items;
    });
  }, []);

  const setNavActive = (item) => {
    sidebarList.map((menuitems) => {
      menuitems.items.filter((items) => {
        if (items !== item) {
          items.active = false;
        }
        if (items.children && items.children.includes(item)) {
          items.active = true;
        }
        if (items.children) {
          items.children.filter((submenuitems) => {
            if (submenuitems.children && submenuitems.children.includes(item)) {
              items.active = true;
              submenuitems.active = true;
              return true;
            } else {
              return false;
            }
          });
        }
        return items;
      });
      return menuitems;
    });
    item.active = !item.active;
    setMainMenu({ mainmenu: sidebarList });
  };

  const toggletNavActive = (item) => {
    if (window.innerWidth <= 991) {
      if (item.type === "sub") {
      }
    }
    if (!item.active) {
      sidebarList.map((a) => {
        a.items.filter((items) => {
          if (a.items.includes(item)) items.active = false;
          if (!items.children) return false;
          items.children.forEach((b) => {
            if (items.children.includes(item)) {
              b.active = false;
            }
            if (!b.children) return false;
            b.children.forEach((c) => {
              if (b.children.includes(item)) {
                c.active = false;
              }
            });
          });
          return items;
        });
        return a;
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: sidebarList });
    console.log(mainmenu)
  };

  //Hover effect
  function Onhover() {
    if (document.querySelector(".app").classList.contains("sidenav-toggled"))
      document.querySelector(".app").classList.add("sidenav-toggled-open");

  }
  function Outhover() {
    document.querySelector(".app").classList.remove("sidenav-toggled-open");
  }

  return (
    <div className="sticky">
      <div className="app-sidebar__overlay"></div>
      <aside
        className="app-sidebar"
        onMouseOver={() => Onhover()}
        onMouseOut={() => Outhover()}
      >
        <Scrollbars >
          <div className="header side-header">
            <Link
              to={`${process.env.PUBLIC_URL}/dashboard/`}
              className="header-brand1"
            >
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="header-brand-img desktop-logo"
                alt={"logo"}
              />
              <img
                src={require("../../assets/images/brand/logo-1.png")}
                className="header-brand-img toggle-logo"
                alt={"logo-1"}
              />
              <img
                src={require("../../assets/images/brand/govt2.png")}
                className="header-brand-img light-logo"
                alt={"logo-2"}
              />
              <img
                src={require("../../assets/images/brand/logo-6.png")}
                className="header-brand-img light-logo1"
                alt={"logo-3"}
              />
            </Link>
          </div>
          <div className="main-sidemenu">
            <div className="slide-left disabled" id="slide-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            <div className="slide-leftRTL disabled" id="slide-leftRTL">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            <ul className="side-menu" id="sidebar-main">
              {sidebarList.map((Item, i) => (
                <Fragment key={i}>
                  <li className="sub-category">
                    <h3>{Item.menuTitle}</h3>
                  </li>
                  {Item.items.map((menuItem, i) => (
                    <li
                      className={`slide ${
                        menuItem.active ? "is-expanded" : ""
                      }`}
                      key={i}
                    >
                      {menuItem.type === "link" ? (
                        <NavLink
                          to={menuItem.path + ""}
                          className={`side-menu__item ${
                            menuItem.active ? "active" : ""
                          }`}
                          onClick={() => {
                            setNavActive(menuItem);
                            toggletNavActive(menuItem);
                          }}
                        >
                          <i
                            className={`side-menu__icon fe fe-${menuItem.icon}`}
                          ></i>
                          <span className="side-menu__label">
                            {menuItem.title}
                          </span>
                          {menuItem.badge ? (
                            <label className={`${menuItem.badge} side-badge`}>
                              {menuItem.badgetxt}
                            </label>
                          ) : (
                            ""
                          )}
                        </NavLink>
                      ) : (
                        ""
                      )}

                      {menuItem.type === "sub" ? (
                        <NavLink
                          to={menuItem.path + ""}
                          className={`side-menu__item ${
                            menuItem.active ? "active" : ""
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            setNavActive(menuItem);
                          }}
                        >
                          <i
                            className={`side-menu__icon fe fe-${menuItem.icon}`}
                          ></i>
                          <span className="side-menu__label">
                            {menuItem.title}
                          </span>
                          {menuItem.badge ? (
                            <label className={`${menuItem.badge} side-badge`}>
                              {menuItem.badgetxt}
                            </label>
                          ) : (
                            ""
                          )}
                          <i
                            className={`${menuItem.background} fa angle fa-angle-right `}
                          ></i>
                        </NavLink>
                      ) : (
                        ""
                      )}
                      {menuItem.children.length ? (
                        <ul
                          className="slide-menu"
                          style={
                            menuItem.active
                              ? {
                                  opacity: 1,
                                  transition: "opacity 500ms ease-in",
                                  display: "block",
                                }
                              : { display: "none" }
                          }
                        >
                          {menuItem.children.map((childrenItem, index) => {
                            return (
                              <li key={index}>
                                {childrenItem.type === "sub" ? (
                                  <a
                                    href="javascript"
                                    className="sub-side-menu__item"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      toggletNavActive(childrenItem);
                                    }}
                                  >
                                    <span className="sub-side-menu__label">
                                      {childrenItem.title}
                                    </span>
                                    {childrenItem.active ? (
                                      <i className="sub-angle  fa fa-angle-down"></i>
                                    ) : (
                                      <i className="sub-angle fa fa-angle-right"></i>
                                    )}
                                  </a>
                                ) : (
                                  ""
                                )}
                                {childrenItem.type === "link" ? (
                                  <NavLink
                                    to={childrenItem.path + ""}
                                    className="slide-item"
                                    onClick={() =>
                                      toggletNavActive(childrenItem)
                                    }
                                  >
                                    {childrenItem.title}
                                  </NavLink>
                                ) : (
                                  ""
                                )}
                                {childrenItem.children ? (
                                  <ul
                                    className="sub-slide-menu"
                                    style={
                                      childrenItem.active
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    {childrenItem.children.map(
                                      (childrenSubItem, key) => (
                                        <li key={key}>
                                          {childrenSubItem.type === "link" ? (
                                            <NavLink
                                              to={childrenSubItem.path + ""}
                                              className={`${"sub-slide-item"}`}
                                              onClick={() =>
                                                toggletNavActive(
                                                  childrenSubItem
                                                )
                                              }
                                            >
                                              {childrenSubItem.title}
                                            </NavLink>
                                          ) : (
                                            ""
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  ""
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
            <div className="slide-right" id="slide-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
            <div className="slide-rightRTL" id="slide-rightRTL">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
          </div>
        </Scrollbars>
      </aside>
    </div>
  );
};

export default Sidebar;
