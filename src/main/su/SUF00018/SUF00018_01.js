import React, { useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { Box, List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { Modal, ModalTitle } from "react-bootstrap";
import { getApiToken } from "../../common/common";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import { roleLovColumns } from "./columns";
import { Alert } from "react-bootstrap";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const RoleUserMapping = () => {

  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [queryInputObj, setQueryInputObj] = useState({})
const [modLovObj, setModLovObj]=useState({
  modGrpId:''
})
   // Open Form
const [openData, setOpenData] = useState([]);
useEffect(() => {
  const fetchOpenData = async () => {
    let obj={
      apiId:"SUA00043"
    }

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00018/openForm',obj, { headers }).then((res) => {
      console.log(res.data);
      setOpenData(res.data);
      console.log(openData);
      setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
        res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
    set_errExp({status:res.data?.appMsgList?.errorStatus})
    })
  }
  fetchOpenData()
}, [])


// Role Id Lov Start..........................
   
      
const [roleLovData, setRoleLovData] = useState([]);
useEffect(() => {

  const fetchRoleLovData = async () => {
    let obj={
      apiId:"SUA00151"
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00018/getAllRole",obj, {headers} )
      .then((res) => {
        console.log(res.data);
        setRoleLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : [] );
        
      });
  };
  fetchRoleLovData();
}, []);


const getRoleNm = (obj)=>{
  return roleLovData[Number(Object.keys(obj)[0])]?.roleNm
}

const getRoleCd = (obj)=>{
  return roleLovData[Number(Object.keys(obj)[0])]?.roleId
}

const [selectRow, setSelectRow] = useState("");
const [selectRowRoleLov, setSelectRowRoleLov] = useState("");
const [showModelRoleLov, setShowModelRoleLov] = useState(false);
const handleRowClickRoleLov = (rowData) => {
 console.log(rowData)
 setSelectRow(rowData);
  setSelectRowRoleLov(rowData);
  setQueryInputObj({
    apiId: "SUA00045",
    criteria: {
      roleId: getRoleCd(rowData)
    }
  })
  setLeftItems([])
  setRightItems([])
  setApproval(false)
  setMsg("")
  setMsgTyp("")
};
//Rele Lov ends   


// Query API------------
const [approval, setApproval] = useState(false);
const [leftItems, setLeftItems] = useState([
 
]);
const [rightItems, setRightItems] = useState([]);

const postQuery = async (e) => {
  e.preventDefault()

  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00018/getListPageData', queryInputObj, { headers }).then((res) => {

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

// console.log(leftItems);




// Query API ends------------


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
    
       
            roleId: getRoleCd(selectRowRoleLov),
            userId: item.userId
        
       
      }));
      
      const updatedMapObj = {
        apiId: "SUA00047",
        map: requestBody, // Updated map object
      };
      
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + '/SUF00018/saveMap',
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
  
      if (response.data?.appMsgList?.list[0]?.errCd === 'CMAI000011') {
        // resetForm();
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error while making the request:', error);
      // You may want to set an error message or handle the error in some way
    }
    
  };
// Mapping API ends............


// Fetching data After Mapping and UnMappuing start.............
const fetchData = async ()=>{
    
  await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00018/getListPageData', queryInputObj, {headers}).then((res)=>{
    if (res.data?.content?.qryRsltSetAvl?.length) {
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
    
       
      roleId: getRoleCd(selectRowRoleLov),
      userId: item.userId
  
 
}));
    const updatedUnMapObj = {
      apiId: "SUA00050",
      unmap: requestBody, // Updated map object
    };
    console.log(requestBody)
    // Send a POST request to the API
    const response = await axios.post(
      process.env.REACT_APP_API_URL_PREFIX + '/SUF00018/saveUnMap',
      updatedUnMapObj,
      { headers }
    );

    // Handle the response as needed
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

const handleTransfer = (direction) => {
    if (direction === "right") {
      const selectedItems = leftItems.filter((item) => item.selected);
      if(selectedItems.length){
      setLeftItems(leftItems.filter((item) => !item.selected));
      setRightItems([
        ...rightItems,
        ...selectedItems.map((item) => ({ ...item, selected: false })),
      ]);
      saveMap(selectedItems)
    }else{
      alert("please select any item first!")
    }
    } else if (direction === "left") {
      const selectedItems = rightItems.filter((item) => item.selected);
      if(selectedItems.length){
      setRightItems(rightItems.filter((item) => !item.selected));
      setLeftItems([
        ...leftItems,
        ...selectedItems.map((item) => ({ ...item, selected: false })),
      ]);
      saveUnMap(selectedItems)
    }else{
      alert("please select any item first!")
    }
    }
   
  };





  const handleSelectItem = (item, direction) => {
    const updatedItems =
      direction === "left"
        ? leftItems.map((i) =>
          i.userId === item.userId ? { ...i, selected: !i.selected } : i
        )
        : rightItems.map((i) =>
          i.userId === item.userId ? { ...i, selected: !i.selected } : i
        );

    direction === "left"
      ? setLeftItems(updatedItems)
      : setRightItems(updatedItems);
  };


  
 
   

    const handleReset = () => {
      setSelectRow("")
      setSelectRowRoleLov("")
      setQueryInputObj({
        apiId: "SUA00045",
        criteria: {
          roleId: ""
        }
      })
        // setValue('');
       
        setLeftItems([]);
        setRightItems([]);
        setApproval(false);
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
            <h1 className="page-title"> Role User Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00018_01
                    <FavLink />
                  </a>
                </li>
              </ol>
            </nav>
          </div>

        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> } 
        <div   className="card">
        <Card.Body>
        <form id="myForm" onSubmit={postQuery}>
          
          <div className="row mb-3 mx-4">
                      <label  className="col-sm-3 col-form-label"><b>Role Id:<span className="text-red">*</span></b></label>
                      <div className="col-md-6">
                        <div className="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelRoleLov(true)} /></span>
                          
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control"
                            required
                            value={getRoleCd(selectRowRoleLov)?getRoleCd(selectRowRoleLov):''}
                          />
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            required
                            value={getRoleNm(selectRowRoleLov)?getRoleNm(selectRowRoleLov):''}
                          />
                           <div className="row-mb-12">
                                {showModelRoleLov && <Lov 
                                moduleLovData={roleLovData} 
                                setShowModel={setShowModelRoleLov} 
                                showModel={showModelRoleLov}
                                handleRowClick={handleRowClickRoleLov}
                                columns={roleLovColumns}
                                currentSelection={selectRow}
                                setCurrentSelection={setSelectRow}
                                />}
                            </div>
                        </div>
                      </div>
                    </div>

           
             
              <div className="container text-end mb-4" >

                <button class="btn btn-primary" type="submit">
                  Query
                </button>

                <button
                  className="btn btn-secondary mx-1"
                  type="reset"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
              {/*  <div className="col-md-1">
            
              </div> */}




        
         
        </form>



        {/*Transfer list select box */}

        {approval&&<div className="container mb-4">

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
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          '@media (max-width: 600px)': {
            minWidth: '100%', // Adjust the minWidth for mobile devices
            maxWidth: '100%', // Adjust the maxWidth for mobile devices
          },
        }}>
        
           { leftItems.map((item) => (

              <ListItem key={item.userId} disablePadding>
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleSelectItem(item, 'left')}
                  color="primary"
                  defaultChecked={item.mapFlag==='Y'}
                  disabled={item.mapFlag==='Y'}
                  
                />
                <ListItemText primary={item.userNm} />
              </ListItem>

            ))}
          
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
      <List >
        <Box sx={{
          width: '100%', // Set the width to 100% to make it responsive
          maxWidth: '400px', // Set a maximum width for larger screens
          minHeight: '300px', // Set a minimum height for the Box
          minWidth: '400px', // Let the height be auto to adjust based on content
          margin: 0, // Remove margin
          padding: 0, // Remove padding
          display: 'flex', // Use flex display to center content vertically
          flexDirection: 'column', // Align items vertically
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          '@media (max-width: 600px)': {
            minWidth: '100%', // Adjust the minWidth for mobile devices
            maxWidth: '100%', // Adjust the maxWidth for mobile devices
          },
        }}>
         
           { rightItems.map((item) => (
              <ListItem key={item.userId} disablePadding>
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleSelectItem(item, 'right')}
                  color="primary"
                />
                <ListItemText primary={item.userNm} />
              </ListItem>
            ))}
        </Box>

      </List>
    </Card>

  </Box>

</Form.Group>

</div>}
        </Card.Body>
        </div>
        
      </div>



      {/* Select Box */}
    </>
  );
};

export default RoleUserMapping;