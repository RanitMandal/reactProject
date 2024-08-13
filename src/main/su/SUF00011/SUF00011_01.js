import React, { useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { Box, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { Modal, ModalTitle } from "react-bootstrap";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import {getApiToken} from "../../common/common"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import Lov from "../../common/Lov _new";
import { UserIdLovColumns } from "./columns";
import { Alert } from "react-bootstrap";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const UserRoleMapping = () => {

  const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
      status: true,
      content: ""
  })
    const [queryInputObj, setQueryInputObj] = useState({
      apiId: "SUA00042",
      criteria:{
        userId: ""
      }
    })
const [modLovObj, setModLovObj]=useState({
    modGrpId:''
})
     // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj = {
        apiId: "SUA00040"
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00011/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
      })
    }
    fetchOpenData()
  }, [])

//UserId Lov Starts     
      
const [userIdLovData, setUserIdLovData] = useState([]);
useEffect(() => {
//   const modLovObj = {
//     apiId : "SUA00013",
//     criteria: {
           
//         }
  
// }
  const fetchUserIdLovData = async () => {
    let obj = {
      apiId: "SUA00150"
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00011/getAllUser", obj, {headers} )
      .then((res) => {
        console.log(res.data);
        setUserIdLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content.qryRsltSet:[] );
        
      });
  };
  fetchUserIdLovData();
}, []);


const getUserNm = (obj)=>{
  return userIdLovData[Number(Object.keys(obj)[0])]?.userNm
}

const getUserId = (obj)=>{
  return userIdLovData[Number(Object.keys(obj)[0])]?.userId
}


const [selectRow, setSelectRow] = useState({});
const [showModelUserIdLov, setShowModelUserIdLov] = useState(false);
const handleRowClickUserIdLov = (rowData) => {
  setSelectRow(rowData);
  // setSelectRowModLov({});
  setQueryInputObj({
    apiId: "SUA00042",
    criteria:{
      userId: getUserId(rowData)
    }
  })
  setLeftItems([])
    setRightItems([])
    setApproval("")
    setMsg("")
    setMsgTyp("")
};
//UserID Lov ends


// Query API------------
const [data, setData]=useState([])
const postQuery = async (e) => {
  e.preventDefault()

  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00011/getListPageData', queryInputObj, { headers }).then((res) => {

    if (res.data?.content?.qryRsltSetAvl?.length) {
      setApproval(true)
      const newLeftItems = res.data.content.qryRsltSetAvl.map((item) => ({
        ...item,
        checked: item.mapFlag === "Y",
      }));
      setLeftItems(newLeftItems)
      setRightItems(res.data?.content?.qryRsltSetMap)
    }
    // if (res.data?.content?.qryRsltSetMap?.length){
      
    // }
    else {
      setLeftItems([])
    }

    setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_errExp({status:res.data?.appMsgList?.errorStatus})
  }).catch(error => {
    console.log(error);
  })
}




  const [approval, setApproval] = useState(false);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

// Mapping API................
const [responseData, setResponseData]=useState()
  const saveMap = async (selectedItems) => {
    // Ensure that at least one role is selected
    if (selectedItems.length === 0) {
      // Handle the case where no roles are selected
      return;
    }
  
    try {
      // Create the request body with userId and selected roleIds
      const requestBody = selectedItems.map((item) => ({
        userId: getUserId(selectRow), // Get the userId from getUserId function
        roleId: item.roleId, // Pass the roleId for the current selected role
      }));
  
      console.log(requestBody)
      const updatedMapObj = {
        apiId: "SUA00044",
        map: requestBody, // Updated map object
      };
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + '/SUF00011/saveMap',
        updatedMapObj,
        { headers }
      );
  
      // Handle the response as needed
      fetchData()
       setResponseData(response.data);
      
       setMsg(
        response.data?.appMsgList?.list[0]?.errDesc +
          ' (' +
          response.data?.appMsgList?.list[0]?.errCd +
          ')'
      );
      setMsgTyp(response.data?.appMsgList?.list[0]?.errType);
      set_errExp({status:response.data?.appMsgList?.errorStatus})
  
      // if (responseData?.appMsgList?.list[0]?.errCd === 'CMAI000011') {
      //   // resetForm();
      // }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error while making the request:', error);
      // You may want to set an error message or handle the error in some way
    }
    
  };
// Mapping API ends............


// Fetching data After Mapping and UnMappuing start.............

const fetchData = async ()=>{
    
  await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00011/getListPageData', queryInputObj, {headers}).then((res)=>{
    console.log(res.data);
    if (res.data?.content?.qryRsltSetAvl?.length) {
      const newLeftItems = res.data.content.qryRsltSetAvl.map((item) => ({
        ...item,
        
      }));
      
      setLeftItems(newLeftItems)
      setRightItems(res.data?.content?.qryRsltSetMap)
    }
    // if (res.data?.content?.qryRsltSetMap?.length){
     
    // }
    else {
      setLeftItems([])
    }

    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
  }).catch(error => {
    console.log(error);
  })
}
console.log(leftItems);



// Fetching Data After Mapping And UnMapping Ends.............



// UnMapping API ...................
const saveUnMap = async (selectedItems) => {
  // Ensure that at least one role is selected
  if (selectedItems.length === 0) {
    // Handle the case where no roles are selected
    return;
  }

  try {
    // Create the request body with userId and selected roleIds
    const requestBody = selectedItems.map((item) => ({
      userId: getUserId(selectRow), // Get the userId from getUserId function
      roleId: item.roleId, // Pass the roleId for the current selected role
    }));

    console.log(requestBody)
    const updatedUnMapObj = {
      apiId: "SUA00048",
      unmap: requestBody, // Updated map object
    };
    // Send a POST request to the API
    const response = await axios.post(
      process.env.REACT_APP_API_URL_PREFIX + '/SUF00011/saveUnMap',
      updatedUnMapObj,
      { headers }
    );

    // Handle the response as needed
   
    //setLeftItems()
    fetchData()
    setLeftItems([])
    const responseData = response.data;
    setMsg(
      response.data?.appMsgList?.list[0]?.errDesc +
        ' (' +
        response.data?.appMsgList?.list[0]?.errCd +
        ')'
    );
    setMsgTyp(response.data?.appMsgList?.list[0]?.errType);
    set_errExp({status:response.data?.appMsgList?.errorStatus})


    if (response.data?.appMsgList?.list[0]?.errCd === 'CMAI000011') {
      // resetForm();
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error while making the request:', error);
    // You may want to set an error message or handle the error in some way
  }
 
};

// Update the handleTransfer function to set mapFlag to 'N' before calling saveUnMap
const handleTransfer = (direction) => {
  
  if (direction === "right") {
    const selectedItems = leftItems.filter((item) => item.selected);
    if(selectedItems.length){
    setLeftItems(leftItems.filter((item) => !item.selected));
    setRightItems([
      ...rightItems,
      ...selectedItems.map((item) => ({ ...item, selected: false, mapFlag: 'N' })), // Set mapFlag to 'N'
    ]);
    saveMap(selectedItems);
  }else{
    alert("please select any item first!")
  } 
}else if (direction === "left") {
    const selectedItems = rightItems.filter((item) => item.selected);
    if(selectedItems.length){
    setRightItems(rightItems.filter((item) => !item.selected));
    setLeftItems([
      ...leftItems,
      ...selectedItems.map((item) => ({ ...item, selected: false ,mapFlag: 'N'})),
    ]);
    saveUnMap(selectedItems); // Call saveUnMap here
  }else{
    alert("please select any item first!")
  }}

};


// Update the handleSelectItem function to uncheck transferred items in the left box
const handleSelectItem = (item, direction) => {
  if (direction === "left") {
    const updatedItems = leftItems.map((i) =>
      i.roleId === item.roleId ? { ...i, selected: !i.selected } : i
    );
    setLeftItems(updatedItems);
  } else if (direction === "right") {
    const updatedItems = rightItems.map((i) =>
      i.roleId === item.roleId ? { ...i, selected: !i.selected } : i
    );
    setRightItems(updatedItems);
  
  }
};


  //modal functions
  const handleFormReset = () => {
    setSelectRow('');
    setQueryInputObj({
      apiId: "SUA00042",
      criteria:{
        userId: ""
      }
    })
    setLeftItems([])
    setRightItems([])
    setApproval("")
    setMsg("")
    setMsgTyp("")
  };
  
  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }
 
  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">User Role Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00011_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>

        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }
        <div className="">
        <Card>
          <Card.Body>
          <form id="myForm" onSubmit={postQuery} >
          <div className="row mb-2 mx-2 ">
              <label className="col-sm-3 col-form-label"><b>User Id:<span className="text-red">*</span></b></label>
              <div className="col-md-6">
                <div className="input-group">
                <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() =>setShowModelUserIdLov(true)} /></span>

                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control"
required
                    value={getUserId(selectRow)? getUserId(selectRow):''}
                  />
                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control  mx-4"
required
                    value={getUserNm(selectRow)? getUserNm(selectRow):''}
                  />
                  <div className="row-mb-12">
                    {showModelUserIdLov && <Lov
                      moduleLovData={userIdLovData}
                      setShowModel={setShowModelUserIdLov}
                      showModel={showModelUserIdLov}
                      handleRowClick={handleRowClickUserIdLov}
                      columns={UserIdLovColumns}
                      currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                    />}
                  </div>
                </div>
              </div>
            </div>
            <div className="container text-end mb-4">
              <button class="btn btn-primary " type="submit">
                Query
              </button>

              <button
  className="btn btn-secondary mx-2"
  type="button" // Set the button type to "button" to prevent form submission
  onClick={handleFormReset}
>
  Reset
</button>
            </div>
          </form>
          {/*Transfer list select box */}

         {approval && <div className="container mb-4">

            <Form.Group className="from-group ">
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                <Card style={{height:"400px", overflow:"scroll"}} className="border border-primary">
                  <List  >
                    <Box sx={{
                      width: '100%', // Set the width to 100% to make it responsive
                      maxWidth: '400px', // Set a maximum width for larger screens
                      minHeight: '300px', // Set a minimum height for the Box
                      minWidth: '400px', // Let the height be auto to adjust based on content
                      margin: 0, // Remove margin
                      padding: 0, // Remove padding
                      display: 'flex', // Use flex display to center content vertically
                      flexDirection: 'column', // Align items vertically
                      // justifyContent: 'center', // Center content vertically
                      // alignItems: 'center', // Center content horizontally
                      '@media (max-width: 600px)': {
                        minWidth: '100%', // Adjust the minWidth for mobile devices
                        maxWidth: '100%', // Adjust the maxWidth for mobile devices
                      },
                    }}>
                    
                       { leftItems.map((item) => (

                          <ListItem key={item.roleId} disablePadding>
                            <Checkbox
                              checked={item.selected}
                              onChange={() => handleSelectItem(item, 'left')}
                              color="primary"
                              defaultChecked={item.mapFlag==='Y'}
                              disabled={item.mapFlag==='Y'}
                              
                              
                            />
                            <ListItemText primary={item.roleNm} />
                          </ListItem>

                        ))
                       }
                    </Box>
                  </List>
                </Card>



                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('right')}>
                    &gt;
                  </Button>
                  <br></br>
                  <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('left')}>
                    &lt;
                  </Button>
                </Box>
                <Card style={{height:"400px", overflow:"scroll"}} className="border border-primary">
                  <List>
                    <Box sx={{
                      width: '100%', // Set the width to 100% to make it responsive
                      maxWidth: '400px', // Set a maximum width for larger screens
                      minHeight: '300px', // Set a minimum height for the Box
                      minWidth: '400px', // Let the height be auto to adjust based on content
                      margin: 0, // Remove margin
                      padding: 0, // Remove padding
                      display: 'flex', // Use flex display to center content vertically
                      flexDirection: 'column', // Align items vertically
                      // justifyContent: 'center', // Center content vertically
                      // alignItems: 'center', // Center content horizontally
                      '@media (max-width: 600px)': {
                        minWidth: '100%', // Adjust the minWidth for mobile devices
                        maxWidth: '100%', // Adjust the maxWidth for mobile devices
                      },
                    }}>
                      {
                        rightItems.map((item) => (
                          <ListItem key={item.roleId} disablePadding>
                            <Checkbox
                              checked={item.selected}
                              onChange={() => handleSelectItem(item, 'right')}
                              color="primary"
                            />
                            <ListItemText primary={item.roleNm} />
                          </ListItem>
                        ))}
                    </Box>

                  </List>
                </Card>

              </Box>

            </Form.Group>

          </div>}
          </Card.Body>
        </Card>
          
        </div>

      </div>



      {/* Select Box */}
    </>
  );
};

export default UserRoleMapping