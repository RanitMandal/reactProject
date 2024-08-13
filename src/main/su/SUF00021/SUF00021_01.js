import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, Row, Card, Col, Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
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
import axios from 'axios';
import FavLink from "../../common/FavLink";
import MsgAlert from "../../common/MsgAlert";

const { DirectoryTree } = Tree;
const headers = { Authorization: 'Bearer ' + getApiToken() };
const LocationUserMapping = () => {

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
      let obj = {
        apiId: "SUA00052"
      }
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00021/openForm', obj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data.content);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
          res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
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
    let obj = {
      apiId: "SUA00154"
    }
    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00021/getAllLocations", obj, { headers })
      .then((res) => {
        console.log(res.data);
        if (res.data?.content?.qryRsltSet?.length) {

          const modifiedData = res.data.content.qryRsltSet.map((item) => ({
            ...item,
            parLvlRefCd: item.parLvlRefCd === "*" ? null : item.parLvlRefCd,
          }));
          let list = modifiedData.map(el => {
            return {
              ...el,
              // lvlNm: el.menuNm,
              lvlNm: el.text,
              lvlRefCd: el.id
            }
          })
          setData(list);
        }
        setOpenModal(true);
      });
  };





  console.log(data)
  // const idMapping = data.reduce((acc, el, i) => {
  //   acc[el.lvlRefCd] = i;
  //   return acc;
  // }, []);

  // let treeview1;

  // data.forEach((el) => {
  //   // Handle the root element
  //   if (el.parLvlRefCd === null) {
  //     treeview1 = [el];
  //     return;
  //   }
  //   // Use our mapping to locate the parent element in our data array
  //   const parentEl = data[idMapping[el.parLvlRefCd]];
  //   // Add our current el to its parent's `children` array
  //   parentEl.children = [...(parentEl.children || []), el];
  // });

  const [qryObj, setQryObj] = useState({
    apiId: "SUA00054",
    criteria: {
      lvlRefCd: ''
    }
  })
  const [value, setValue] = useState({
    id: null,
    text: "",

  });
  const [title, setTitle] = useState({});

  const onRenderItem = (item, treeview) => {
    console.log(item);
    return (
      <div className="treeview-item-example">
        <span onClick={(e) => handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
      </div>
    )
  }

  const handleItemClick = (item) => {
    const lvlRefCd = item.lvlRefCd;
    console.log(lvlRefCd)
    setValue({
      ...item,
      id: item.id,
      text: item.text,

    }) // Assuming `item.text` is the title you want to set
    setOpenModal(false);
    let obj = {
      apiId: "SUA00054",
      criteria: {
        lvlRefCd: item.id
      }
    }
    setQryObj(obj)
    setLeftItems([])
    setRightItems([])
    setApproval(false)
    setMsg("")
    setMsgTyp("")

  };
  console.log(qryObj);

  // TreeLov API Ends.......................





  // Query API------------

  const postQuery = async (e) => {
    e.preventDefault()
    setLeftItems([])
    setRightItems([])
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00021/getListPageData', qryObj, { headers }).then((res) => {

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
  const [leftItems, setLeftItems] = useState([

  ]);
  const [rightItems, setRightItems] = useState([]);

  // Mapping API................
  const [responseData, setResponseData] = useState()
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
        lvlRefCd: qryObj.criteria.lvlRefCd,
        userId: item.userId,// Pass the roleId for the current selected role
      }));

      console.log(requestBody)
      const updatedMapObj = {
        apiId: "SUA00056",
        map: requestBody, // Updated map object
      };
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + '/SUF00021/saveMap',
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
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00021/getListPageData', qryObj, { headers }).then((res) => {
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
        userId: item.userId, // Get the userId from getUserId function
        lvlRefCd: qryObj.criteria.lvlRefCd, // Pass the roleId for the current selected role
      }));

      console.log(requestBody)
      const updatedUnMapObj = {
        apiId: "SUA00059",
        unmap: requestBody, // Updated map object
      };
      // Send a POST request to the API
      const response = await axios.post(
        process.env.REACT_APP_API_URL_PREFIX + '/SUF00021/saveUnMap',
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



  const [openModal, setOpenModal] = useState(false);


  const handleReset = () => {
    setValue('');
    setLeftItems([]);
    setRightItems([]);
    setQryObj({
      apiId: "SUA00054",
      criteria: {
        lvlRefCd: ''
      }
    })
    setApproval(false)
    setMsg("")
    setMsgTyp("")
  };

  const handleOpenModal = () => {

    fetchTreeLovData();

  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClear = ()=>{
    setValue({
      ...value,
      id: "",
      text: "",
  
    })
    // updateEdtVal({
    //   ...edtVal,
    //   parMenuId:"",
    //   parMenuNm:""
    // })
    handleCloseModal()
  }


  // Conditionally render the component based on the value of showPage

  if (openData?.appMsgList?.errorStatus === true) {
    return null; // Don't render the component
  }


  return (
    <>
      <div openData={openData}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Location User Mapping</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}>
                    SUF00021_01
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
              <form id="myForm" onSubmit={postQuery}>
                <div class="">
                  <div className="row my-2">
                    <label
                      for="exampleFormControlSelect1"
                      className="col-md-3 col-form-label"
                    >
                      <b>Location Id:<span className="text-red">*</span></b>

                    </label>
                    <div className="col-md-6">
                      <div class="input-group">
                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>
                        <input type="text" class="form-control col-md-3 " value={value.id} required />
                        <input type="text" class="form-control  mx-2 rounded-3" value={value.text} required />
                      </div>
                    </div>
                    <div className="row-mb-12">
                      {/* Modal */}
                      {openModal && (
                        <Modal show={openModal} onHide={handleCloseModal}>
                          <Modal.Header closeButton>
                            <Modal.Title><b>Select Location</b></Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <TreeView
                              id="treeview1"
                              style={{ height: "auto" }}
                              showIcon={false}
                              className="branch"
                              items={data}
                              onSelectItem={handleItemClick}
                              onRenderItem={onRenderItem}
                            // items={renderTreeItems(treeview1)}
                            />
                          </Modal.Body>
                          <Modal.Footer>
                          <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                          <button className="btn btn-primary" onClick={handleClear}>Clear</button>
                            
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
                    <Card style={{ height: "400px", overflow: "scroll" }} className="border border-primary">
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

                              <ListItem key={item.userId} disablePadding>
                                <Checkbox
                                  checked={item.selected}
                                  onChange={() => handleSelectItem(item, 'left')}
                                  color="primary"
                                  defaultChecked={item.mapFlag === 'Y'}
                                  disabled={item.mapFlag === 'Y'}

                                />
                                <ListItemText primary={item.userNm} />
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
                    <Card style={{ height: "400px", overflow: "scroll" }} className="border border-primary">
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
          </Card>

        </div>


      </div>

    </>
  );
};

export default LocationUserMapping;
//example of creating a mui dialog modal for creating new rows
