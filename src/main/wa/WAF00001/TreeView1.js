import React, { useState, useEffect } from "react";
import TreeView from "deni-react-treeview";
import {Breadcrumb,Row,Col,Card} from "react-bootstrap"
import {useNavigate} from 'react-router-dom'
//import { treeview1 } from "../../data/Component/treeviews/locationtreedata";
import { Link } from "react-router-dom";
import {getLocationTree} from "./common"
import setLocationTree from "./CMF00000_01"
import { useLocation } from "react-router-dom";
import { isAuthenticated } from "./common";
import MenuCreation from "./SUF00007_01";
import axios from 'axios';

const DynamicTreeMenu = () => {
  
  const location = useLocation();
  const data = treeview1;
   
  console.log(treeview1)
   

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
 return MenuCreation(treeview1);
  };
  
 export default DynamicTreeMenu;