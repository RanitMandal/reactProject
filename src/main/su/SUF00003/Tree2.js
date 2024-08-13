import React, { useState, useEffect } from "react";
import TreeView from "deni-react-treeview";
import { Breadcrumb, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import { getApiToken } from "../../common/common";
import axios from "axios";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const Tree = ({ editVal, setEditVal, closeModal }) => {

  //api calling start
  const [data, setData] = useState([]);

  const [treeview1, set_treeview1] = useState([])
  let temp = []



  console.log(editVal.modId)
  useEffect(() => {
    // Define the URL
    const url =
      process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/getAllMenuByModMst";

    // Define the data you want to send in the POST request
    const body = {
      apiId: "SUA00175",
      criteria: {
        modId: editVal?.modId,
      }
      // modId: "M0002"
    };
    console.log(headers);
    // Make the POST request
    console.log("ok")
    axios.post(url, body, { headers })

      .then((response) => {
        console.log("33")
        // Handle the successful response here
        console.log("Response data:", response.data);


        const modifiedData = response.data?.content?.qryRsltSet?.map((item) => ({
          ...item,
          parMenuId: item.parentId === "*" ? null : item.parentId,
        }));
        //setData(modifiedData)

        const idMapping = modifiedData.reduce((acc, el, i) => {
          acc[el.menuId] = i;
          return acc;
        }, []);

        modifiedData.forEach((el) => {
          // Handle the root element
          if (el.parMenuId === null) {
            temp = [...temp, el];
            return;
          }
          // Use our mapping to locate the parent element in our data array
          const parentEl = modifiedData[idMapping[el.parMenuId]];
          // Add our current el to its parent's `children` array
          parentEl.children = [...(parentEl.children || []), el];
        });
        console.log(temp);
        set_treeview1([...temp])

      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  }, []);
  //api calling end

  // useEffect(() => {

  //   console.log(headers)
  //   const body = {
  //     modId: "M0002",
  //   };
  //   const fetchOpenData = async ()=>{

  //       await axios.post(process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00003/getAllMenuByModMst", body , {headers} ).then((res)=>{
  //         console.log(res.data);
  //         setData(res.data);
  //         console.log(data);

  //       })
  //   }

  //   fetchOpenData()

  // }, []) 



  console.log(data);







  // useEffect(() => {
  //   data.forEach((el) => {
  //     // Handle the root element
  //     if (el.parMenuId === null) {
  //       set_treeview1([...treeview1, el]);
  //       return;
  //     }
  //     // Use our mapping to locate the parent element in our data array
  //     const parentEl = data[idMapping[el.parMenuId]];
  //     // Add our current el to its parent's `children` array
  //     parentEl.children = [...(parentEl.children || []), el];
  //   });
  // }, [data])


  console.log(treeview1);

  const [menuData, setMenuData] = useState([]);
  //var datag = null;
  // useEffect(() => {
  //   fetchMenuData();
  // }, []);

  // const fetchMenuData = () => {
  //   try {
  //     //const response =  await fetch('your_api_url');
  //     // const data = await response.json();
  //     const data = treeview1;
  //     console.log(data);
  //     // LocationTree(); //setMenuData(data);
  //   } catch (error) {
  //     console.log("Error fetching menu data", error);
  //   }
  // };

  // const renderSubmenu = (children) => {
  //   return children.map((item) => <li key={item.id}>{item.text}</li>);
  // };

  // const renderMenu = () => {
  //   return menuData.map((menu) => (
  //     <li key={menu.id}>
  //       {menu.text + "dssdfsfd"}
  //       {menu.children && <ul> {renderSubmenu(menu.children)}</ul>}
  //     </li>
  //   ));
  // };

  //    return (
  //      <div>
  //       <ul>{renderMenu()}</ul>
  //     </div>
  //   );

  const handleSelect = (item) => {
    setEditVal({
      ...editVal,
      menuId: item.id,
      menuNm: item.text
    })
    closeModal()
  }

  return (
    <>
      <TreeView
        id="treeview1"
        style={{ height: "auto" }}
        showIcon={false}
        className="branch"
        items={treeview1}
        onSelectItem={handleSelect}
      // onCheckItem={handleSelect}
      />
    </>
  );
};

export default Tree;

export function Tree1(treeview1) {
  const navigate = useNavigate();
  /* 
    const handleItemClick = (item) => {
     // const menuId = item.menuId;
  
      //   if (item.clickable) {
      // navigate("/CMF00000_05", { state: menuId });
      //    }
  
    }; */
  // const [value, setValue] = useState({
  //   id:null,
  //   text:"",

  // });

  // const handleItemClick = (item) => {
  //   const menuId = item.parMenuId;
  //   // console.log(lvlRefCd)
  //   setValue({
  //       ...item,
  //       id:item.id,
  //       text:item.text,

  //   }) // Assuming `item.text` is the title you want to set
  //setOpenModal(false);

  /* setQryObj({
      menuId:lvlRefCd
  })  */

  //};
  return (
    <div>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <div className="main-content-label mg-b-5">
                Available Locations
              </div>
              <p className="mg-b-20 card-sub-title tx-12 text-muted">
                Select Your Location
              </p>
              <Row>
                <Col className=" mt-4 mt-lg-0" lg={12} xl={12}>
                  <ul id="tree2" className="tree">
                    <li className="branch">
                      <TreeView
                        id="treeview1"
                        style={{ height: "auto" }}
                        showIcon={true}
                        //showCheckbox={true}
                        className="branch"
                        items={treeview1}
                      //onSelectItem={handleItemClick}
                      />
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
}
