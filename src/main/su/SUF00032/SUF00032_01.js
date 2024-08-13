import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, Row, Card, Col, Form } from "react-bootstrap";
import TreeView from "deni-react-treeview";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Box,
    List,
    ListItem,
    ListItemText,
    Checkbox
} from "@mui/material";
import { Tree } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import MsgAlert from "../../common/MsgAlert";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";


const headers = { Authorization: 'Bearer ' + getApiToken() };
const LocationToModule = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
      status: true,
      content: ""
  })

     // Open Form
  const [openData, setOpenData] = useState([]);
  useEffect(() => {
    const fetchOpenData = async () => {
      let obj={
        apiId:'SUA00012'
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00032/openForm', obj, { headers }).then((res) => {
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

// TreeLov Api................
const [data, setData] = useState([]);

//   const modLovObj = {
//     apiId : "SUA00013",
//     criteria: {
           
//         }
  
// }
  const fetchTreeLovData = async () => {
    let obj={
      apiId:'SUA00221'
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX +"/SUF00032/getAllLocations", obj,  {headers} )
      .then((res) => {
        console.log(res.data);
        if (res.data?.content?.qryRsltSet?.length) {
        
            setData(res.data?.content?.qryRsltSet);
        }
        setOpenModal(true);
      });
  
  };


// console.log(data)

const [qryObj, setQryObj]=useState({})
  const [value, setValue] = useState({
    apiId: "SUA00014",
    criteria:{
      lvlRefCd:''
  }});
    const [title, setTitle] = useState({});

    const onRenderItem = (item, treeview) => {
      console.log(item);
      return (
        <div className="treeview-item-example">
        <span onClick={(e)=>handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
        </div>
      )
    }
const handleItemClick = (item) => {
    const lvlRefCd = item.id;
    console.log(lvlRefCd)
    setValue({
        ...item,
        id:item.id,
        text:item.text,
        
    }) // Assuming `item.text` is the title you want to set
    setOpenModal(false);
    
    setQryObj({
      apiId: "SUA00014",
      criteria:{
        lvlRefCd:item.id
    }})
    setLeftItems([])
    setRightItems([])
    setApproval(false)
    setMsg("")
    setMsgTyp("")
    
};
console.log(qryObj);

// TreeLov API Ends.......................

// Query API------------
const [approval, setApproval] = useState(false);
  const [leftItems, setLeftItems] = useState([
   
  ]);
  const [rightItems, setRightItems] = useState([]);
const postQuery = async (e) => {
  e.preventDefault()
  setLeftItems([])
  setRightItems([])
  await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00032/getListPageData', qryObj, { headers }).then((res) => {

    if (res.data?.content?.qryRsltSetAvl?.length) {
      setApproval(true)
      const newLeftItems = res.data.content.qryRsltSetAvl.map((item) => ({
        ...item,
        checked: item.checked === true,
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

console.log(leftItems);


  

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
         // Get the userId from getUserId function
      lvlRefCd:qryObj.criteria.lvlRefCd, 
      modId: item.modId,// Pass the roleId for the current selected role
      }));
  
      console.log(requestBody)
      let mapObj={
        "apiId": "SUA00015",
        "map":requestBody
      }
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + '/SUF00032/saveMap',
        mapObj,
        { headers }
      );
  
      // Handle the response as needed
      fetchData()
      setRightItems([])
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
    
  await axios.post(process.env.REACT_APP_API_URL_PREFIX +'/SUF00032/getListPageData', qryObj, {headers}).then((res)=>{
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
      modId: item.modId, // Get the userId from getUserId function
      lvlRefCd:qryObj.criteria.lvlRefCd, // Pass the roleId for the current selected role
    }));

    console.log(requestBody)
    let unMapObj={
      "apiId": "SUA00018",
      "unmap":requestBody
    }
    // Send a POST request to the API
    const response = await axios.post(
      process.env.REACT_APP_API_URL_PREFIX + '/SUF00032/saveUnMap',
      unMapObj,
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

    if (response.data?.appMsgList?.List[0]?.errorCode === 'CMAI000011') {
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
        ...selectedItems.map((item) => ({ ...item, selected: false  })),
      ]);
      saveMap(selectedItems)
    }else{
      alert("please select an item")
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
      alert("please select an item")
    }
    }
   
  };





  const handleSelectItem = (item, direction) => {
    const updatedItems =
      direction === "left"
        ? leftItems.map((i) =>
          i.modId === item.modId ? { ...i, selected: !i.selected } : i
        )
        : rightItems.map((i) =>
          i.modId === item.modId ? { ...i, selected: !i.selected } : i
        );

    direction === "left"
      ? setLeftItems(updatedItems)
      : setRightItems(updatedItems);
  };


  
    const [openModal, setOpenModal] = useState(false);
   

    const handleReset = () => {
        setValue('');
        setQryObj({
          apiId: "string",
          criteria:{
            lvlRefCd:''
        }})
        setLeftItems([]);
        setRightItems([]);
        setApproval(false);
        setMsg("")
        setMsgTyp("")
    };

    const handleOpenModal = () => {
        
        fetchTreeLovData();
        
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    if (openData?.appMsgList?.errorStatus === true) {
      return null; // Don't render the component
    }



    return (
        <>
            <div >
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Location Module Mapping</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        Mapping Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00032_01
                                        <FavLink />
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> } 

                <div className="card">
                    <form id="myForm" onSubmit={postQuery}>
                        <div class="row mb-4 ms-4 mt-4">
                            <div className="row my-2">
                                <label
                                    for="exampleFormControlSelect1"
                                    className="col-md-3 col-form-label"
                                >
                                    <b>Location:<span className ="text-red">*</span></b>

                                </label>
                                <div className="col-md-6">
                                    <div class="input-group">
                                        <span class="input-group-text bg-primary" id=""><i className="fa fa-search d-inline text-white" title=""  onClick={() => {
      handleOpenModal();
      
    }} /></span>
                                        <input type="text" className="form-control" value={value.id} placeholder="" required />
                                        <input type="text" className="form-control ms-4" value={value.text} placeholder="" required />
                                    </div>
                                </div>
                                <div className="row-mb-12">
                                    {/* Modal */}
                                    {openModal && (
                                        <Modal show={openModal} onHide={handleCloseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Select</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                            <TreeView
  id="treeview1"
  style={{ height: "auto" }}
  showIcon={false}
  className="branch"
  items={data}
  onSelectItem= {handleItemClick}
  onRenderItem={onRenderItem}
  // items={renderTreeItems(treeview1)}
/>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button onClick={handleCloseModal}>Close</button>
                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                    {/* Input fields */}
                                </div>
                            </div>

                        </div>
                        
                            <div className="container text-end mb-4">
                                <button class="btn btn-primary" type="submit" >
                                    Query
                                </button>

                                <button
                                    className="btn btn-secondary mx-2"
                                    type="reset"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                            </div>
                        
                    </form>

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
                      {
                        leftItems.map((item) => (

                          <ListItem key={item.modId} disablePadding>
                            <Checkbox
                              checked={item.selected}
                              onChange={() => handleSelectItem(item, 'left')}
                              color="primary"
                              defaultChecked={item.mapFlg==='Y'}
                              disabled={item.mapFlg==='Y'}
                              
                            />
                            <ListItemText primary={item.modNm} />
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
                      // justifyContent: 'center', // Center content vertically
                      // alignItems: 'center', // Center content horizontally
                      '@media (max-width: 600px)': {
                        minWidth: '100%', // Adjust the minWidth for mobile devices
                        maxWidth: '100%', // Adjust the maxWidth for mobile devices
                      },
                    }}>
                      {
                        rightItems.map((item) => (
                          <ListItem key={item.modId} disablePadding>
                            <Checkbox
                              checked={item.selected}
                              onChange={() => handleSelectItem(item, 'right')}
                              color="primary"
                            />
                            <ListItemText primary={item.modNm} />
                          </ListItem>
                        ))}
                    </Box>

                  </List>
                </Card>

              </Box>

            </Form.Group>

          </div>}
                </div>


            </div>
        
        </>
    );
};

export default LocationToModule;
//example of creating a mui dialog modal for creating new rows
