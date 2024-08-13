import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

import Accordian from "./Accordian";

const AddPage = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  return (
    <>
      <style>
        {`

.custom-modal .close-icon {
  font-size: 1.2rem;
} 

.custom-modal .modal-dialog {
        max-width: 90% !important;
        width: 90% !important;
        margin-top: 2rem;
        margin-buttom: auto;
        
        }
        
 `}
      </style>

      <Modal show={open} onHide={onClose} className="custom-modal">
        <ModalHeader
          closeButton={false}
          className="d-flex justify-content-between align-items-center"
        >
          <ModalTitle>
            <b>SUF00024_02</b>
          </ModalTitle>
          <Button
            variant="link"
            onClick={onClose}
            className="close-icon-container"
          >
            <FontAwesomeIcon icon={faTimes} className="close-icon" />
          </Button>
        </ModalHeader>
        <ModalBody>
          <div className="container bg-white">
            <div className="">
              <form className="form-horizontal py-3 container">
                <div className="row">
                  <div className="col-lg-5 col-md-12">
                    <div className="row mb-4">
                      <label className="col-md-3 form-label">
                        API Category:
                      </label>
                      <div className="col-md-8">
                        <select className="form-select">
                          <option value="" disabled selected>
                            --Select--
                          </option>
                          <option value="1">Bill No. 1</option>
                          <option value="2">Bill No. 2</option>
                          <option value="3">Bill No. 3</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-3 form-label">
                        API Type:<span className="text-red">*</span>
                      </label>
                      <div className="col-md-8">
                        <select className="form-select">
                          <option value="" disabled selected>
                            --Select--
                          </option>
                          <option value="1">Get</option>
                          <option value="2">Post</option>
                          <option value="3">Put</option>
                          <option value="4">Delete</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-3 form-label">API URL:</label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          placeholder="Enter URL"
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-3 form-label">
                        API Method Name:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          placeholder="Methodes Name Here"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="row mb-2">
                      <label className="col-md-4 form-label">API Name:</label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          placeholder="Name Here"
                          type=""
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-md-4 form-label">
                        API Description:
                      </label>
                      <div className="col-md-8">
                        <textarea
                          className="form-control"
                          rows={2}
                          defaultValue={"Write Description Here....."}
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-md-4 form-label">Module:</label>
                      <div className="col-md-8">
                        <div className="input-group">
                          <span className="input-group-text rounded-circle border border-primary">
                            {" "}
                            <FontAwesomeIcon
                              icon={faSearch}
                              style={{ color: "blue" }}
                            />
                          </span>
                          <input
                            type="text"
                            aria-label="First name"
                            className="form-control mx-2"
                          />
                          <input
                            type="text"
                            aria-label="Last name"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-md-4 form-label ">
                        Active:
                      </label>
                      <div className="col-md-8">
                        <div className="row ps-5 pt-3">
                          <label className="custom-control custom-radio col-md-2 ">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="example-radios"
                              defaultValue="option1"
                              defaultChecked=""
                            />
                            <span className="custom-control-label">Yes</span>
                          </label>
                          <label className="custom-control custom-radio col-md-1">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="example-radios"
                              defaultValue="option2"
                            />
                            <span className="custom-control-label">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card border border-primary bg-light">
                
                  
                 
                  <div className="container card-body">
                    {" "}
                    <Accordian />
                  </div>

                  <br></br>
                </div>

                {/*   <div className="row mb-4 d-flex justify-content-center ">
                  <button className="btn btn-secondary col-md-1 " type="submit">
                    Save
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">Sumbit</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddPage;
