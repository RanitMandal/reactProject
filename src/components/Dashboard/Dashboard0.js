import React, { useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Modal, Breadcrumb, Col, Row, Card, Form, Button, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import * as dashboard from "../../data/dashboard/dashboard";
import TreeView from "deni-react-treeview";
//import { treeview1 } from "../../main/su/SUF00003/treeview1";
import { Link } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import TextField from "@mui/material/TextField";
import DatePicker from "react-multi-date-picker";
import IntlTelInput from "react-intl-tel-input";




import { Box, List, ListItem, ListItemText, Checkbox } from '@mui/material';

import { styled } from '@mui/system';
// import { TransferList } from '@mui/lab';



export function FullscreenModal() {
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button
          className="btn btn-primary btn-icon text-white me-3"
          key={idx}
          variant="warning"
          onClick={() => handleShow(v)}
        >
          Add Account
          {typeof v === "string" && `below ${v.split("-")[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={fullscreen} >
        <Modal.Header >
          <Modal.Title>Modal title</Modal.Title>
          <Button
            onClick={() => setShow(false)}
            className="btn-close"
            variant=""
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>Modal body text goes here.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShow(false)}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



// const options = [
//   { id: 1, label: 'Option 1' },
//   { id: 2, label: 'Option 2' },
//   { id: 3, label: 'Option 3' },
//   { id: 4, label: 'Option 4' },
// ];

export default function Dashboard0() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [value, setValue] = React.useState(new Date());
  const [dates, setDates] = useState();

  const [leftItems, setLeftItems] = useState([
    { id: 1, label: 'Option 1', selected: false },
    { id: 2, label: 'Option 2', selected: false },
    { id: 3, label: 'Option 3', selected: false },
    { id: 4, label: 'Option 4', selected: false },
  ]);
  const [rightItems, setRightItems] = useState([]);




  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTransfer = (direction) => {
    if (direction === 'right') {
      const selectedItems = leftItems.filter((item) => item.selected);
      setLeftItems(leftItems.filter((item) => !item.selected));
      setRightItems([...rightItems, ...selectedItems.map(item => ({ ...item, selected: false }))]);
    } else if (direction === 'left') {
      const selectedItems = rightItems.filter((item) => item.selected);
      setRightItems(rightItems.filter((item) => !item.selected));
      setLeftItems([...leftItems, ...selectedItems.map(item => ({ ...item, selected: false }))]);
    }
  };

  const handleSelectItem = (item, direction) => {
    const updatedItems =
      direction === 'left'
        ? leftItems.map((i) => (i.id === item.id ? { ...i, selected: !i.selected } : i))
        : rightItems.map((i) => (i.id === item.id ? { ...i, selected: !i.selected } : i));

    direction === 'left' ? setLeftItems(updatedItems) : setRightItems(updatedItems);
  };

  // const handleSelectItem = (item) => {
  //   setSelectedItem(item);
  //   // Perform any additional actions with the selected item
  // };

  const handleDeleteItemClick = (item) => {
    // Perform delete action for the selected item
    console.log("Deleting item:", item);
  };

  // const Selectbox = () => {
  //   let [value, setValue] = useState(["PDF - Swap Valuation"]);
  //   function handleChange(selected) {
  //     setValue(selected);
  //     console.log(selected);
  //   }
  //   const options = [
  //     {
  //       label: "Software Side",
  //       options: [
  //         { value: "Web designer", label: "Web designer" },
  //         { value: "Web Developer", label: "Web Developer" },
  //         {
  //           value: "Application Developer",
  //           label: "Application Developer",
  //         },
  //         { value: "App Designer", label: "App Designer" },
  //       ],
  //     },
  //     {
  //       label: "Voice Side",
  //       options: [
  //         { value: "Tell Caller", label: "Tell Caller" },
  //         {
  //           value: "Recruiter",
  //           label: "Recruiter",
  //         },
  //         {
  //           value: "HR",
  //           label: "HR",
  //         },
  //         {
  //           value: "Data Entry",
  //           label: "Data Entry",
  //         },
  //         {
  //           value: "Mapping",
  //           label: "Mapping",
  //         },
  //         {
  //           value: "US Recruiter",
  //           label: "US Recruiter",
  //         },
  //       ],
  //     },
  //   ];}
  const [selectRow, setSelectRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
  };

  function OpenModal({ selectRow }) {

    const [searchText, setSearchText] = useState('');

    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState([
      { id: 1, column1: 'Value 1A', column2: 'Value 1B' },
      { id: 2, column1: 'Value 2A', column2: 'Value 2B' },
      { id: 3, column1: 'Value 3A', column2: 'Value 3B' },
      // Add more rows as needed
    ]);

    // const handleRowClick = (rowData) => {
    //   setSelectRow(rowData);
    // };
    const openModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    };

    const handleSearch = () => {
      // Filter the table data based on the search text
      const filteredData = tableData.filter(
        (row) =>
          row.column1.toLowerCase().includes(searchText.toLowerCase()) ||
          row.column2.toLowerCase().includes(searchText.toLowerCase())
      );
      setTableData(filteredData);
    };


    return (
      <>
        <div className="row-mb-12">
          <div className="col-md-2 d-inline">
            <i className="fa fa-search d=inline" title="" onClick={() => openModal()}></i>
          </div>

          {/* Modal */}
          {open && (
            <Modal show={open} onHide={closeModal} >
              <Modal.Header closeButton>
                <ModalTitle>Create New Account</ModalTitle>
              </Modal.Header>
              <Modal.Body>
                <div className="table-responsive">"
                  <h2>Search Modal</h2>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="btn btn-primary" type="button" onClick={handleSearch}>
                      Search
                    </button>
                  </div>
                  <table className="table table-bordered dta-tabl">
                    <thead>
                      <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.id} onClick={() => handleRowClick(row)}>
                          <td>{row.column1}</td>
                          <td>{row.column2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Modal.Body>
              {/* Close modal button */}
              <Modal.Footer>
                <button onClick={() => setOpen(false)}>Close</button>
              </Modal.Footer>
            </Modal>

          )}
          {/* Input fields */}

          <div className="col-md-12 d-inline">
            <input className="form-control col-md-2 mx-2 d-inline " type="text" value={selectRow?.column1 || ''} readOnly />
            <input className="form-control col-md-6 mx-2 d-inline" type="text" value={selectRow?.column2 || ''} readOnly />
          </div>

        </div>

      </>
    )
  }


  return (
    <div>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Dashboard 02</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Dashboard 01
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Link to="#" className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>

            <FullscreenModal />
          </Link>
          <Link to="#" className="btn btn-success btn-icon text-white">
            <span>
              <i className="fe fe-log-in"></i>&nbsp;
            </span>
            Export
          </Link>
        </div>
      </div>
      {/*Date Picker */}
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Card className=" mg-b-20">
            <Card.Body>
              <div className="main-content-label mg-b-5">DatePicker</div>
              <Row>
                <Col lg={12} xl={12}>

                  <div className="wd-200 mg-b-30">
                    <div className="input-group">
                      <div className="input-group-text">
                        <span className="fa fa-calendar tx-16 lh-0 op-6"></span>
                      </div>
                      <DatePicker
                        className="form-control fc-datepicker"
                        placeholder="MM/DD/YYYY"
                        value={dates}
                        onChange={setDates}

                        numberOfMonths={1}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*Tree view style*/}
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Card className=" mg-b-20">
            <Card.Body>
              <div className="main-content-label mg-b-5">Tree View Styles</div>
              <Row>
                <Col lg={12} xl={0}>
                  <ul id="tree1" className="tree">
                    <li className="branch">
                      <TreeView
                        id="treeview1"
                        style={{ height: "auto" }}
                        className="branch"
                        //items={treeview1}
                        // onSelectItem={handleSelectItem}
                        // Added onSelectItem prop
                        renderItem={(item) => (
                          <div className="item-container">
                            <i className="fa fa-trash" title="fa fa-trash"
                              onClick={() => handleDeleteItemClick(item)} />
                            <span className="item-title">{item.title}</span>
                          </div>
                        )}
                      />
                    </li>
                  </ul>
                </Col>
              </Row>
              {selectedItem && (
                <div>
                  <h2>Selected Item:</h2>
                  <p>Title: {selectedItem.title}</p>
                  <p>Description: {selectedItem.description}</p>
                  {/* Render other properties as needed */}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>




      {/* Localization Time */}
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Card className=" mg-b-20">
            <Card.Body>
              <div className="main-content-label mg-b-5">Localization Time</div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Set Time"
                  placeholder="Set time"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="form-control"
                      id="tp1"
                      placeholder="Set time"
                      type="text"
                    />
                  )}
                />
              </LocalizationProvider>

            </Card.Body>
          </Card>
        </Col>
      </Row>



      {/*Phone number field with country selector */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Country selctor</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <IntlTelInput
                  containerClassName="intl-tel-input me-1 mb-5 mb-sm-0"
                  inputClassName="form-control"
                />
                <Button className="btn btn-primary ">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*Transfer list select box */}
      <Row>
        <Card>
          <Card.Header>
            <Card.Title>Select Box</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={6} md={12}>
                <Form.Group className="from-group mb-5 mb-lg-0">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                    <List class="border border-primary mh-100">
                      {leftItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                          <Checkbox
                            checked={item.selected}
                            onChange={() => handleSelectItem(item, 'left')}
                            color="primary"
                          />
                          <ListItemText primary={item.label} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('right')}>
                        &gt;
                      </Button>
                      <br></br>
                      <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('left')}>
                        &lt;
                      </Button>
                    </Box>
                    <List class="border border-primary mh-100">
                      {rightItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                          <Checkbox
                            checked={item.selected}
                            onChange={() => handleSelectItem(item, 'right')}
                            color="primary"
                          />
                          <ListItemText primary={item.label} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      {/* Select Box */}

      <Row>
        <Card>
          <Card.Header>
            <Card.Title>Select Box</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col >
                <div>
                  <label htmlFor="select">Select an option:</label>
                  <select id="select" onChange={handleSelectChange}>
                    <option value="">Select</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>

                  <input
                    type="text"
                    value={selectedOption}
                    onChange={(event) => setSelectedOption(event.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>



      {/* select item from modal and put into input field */}
      <Row>
        <Card>
          <Card.Header>
            <Card.Title>select item from modal and put into input field</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col ><OpenModal selectRow={selectRow} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>



      {/* Tap to search icon */}




    </div>

  );
}
