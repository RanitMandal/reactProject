import React, { useState, useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import Lov from "../../common/Lov _new";
import { getApiToken } from "../../common/common";
import { Delete, Download, Edit } from "@mui/icons-material";
import { portalLovColumns } from "./columns";
import TreeView from "deni-react-treeview";
import { Card, Modal, ModalTitle } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Smalltag from "../../common/SmallTag/smalltag";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const ImageCategoryFormAdd = ({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row,
  rowData,
  index,
  queryInputObj,
  msg,
  setMsg,
  msgTyp,
  setMsgTyp,
  addVal,
  setEdtVal,
  edtVal,
  parMsg,
  setParMsg,
  parMsgTyp,
  setParMsgTyp,
  errExp,
  set_errExp,
  parErrExp,
  set_parErrExp,
}) => {

  const [parLovData, setParLovData] = useState([]);
  function convertIfString(input) {
    if (input === "" || null || undefined) {
      return 0;
    }
    if (typeof input === '') {
      const convertedNumber = Number(input);
      // Check if the conversion result is a valid number
      if (!isNaN(convertedNumber)) {
        return convertedNumber;
      }
    }
    // If input is not a string or conversion fails, return the original input
    return input;
  }
  const fetchData = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/getListPageData",
        queryInputObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        setData(res?.data?.content.qryRsltSet);
        console.log(data);
        setParMsg(
          res?.data?.appMsgList?.list[0]?.errDesc +
          " (" +
          res?.data?.appMsgList?.list[0]?.errCd +
          ")"
        );
        setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus });
      });
  };
  const headers = { Authorization: "Bearer " + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

  const [doc, set_doc] = useState([]);
  const [formData, setFormData] = useState({
    actFlg: "A",
    catNm: "",
    catTypFlg: "L",
    orderBy: 0,
    parCatId: "",
    portalId: "",
  });

  useEffect(() => {
    if (mode !== 1) {
      setFormData({
        actFlg: edtVal?.actFlg ? edtVal?.actFlg : "",
        catNm: edtVal?.catNm ? edtVal?.catNm : "",
        catId: edtVal?.catNm ? edtVal?.catId : "",
        catTypFlg: edtVal?.catTypFlg ? edtVal?.catTypFlg : "L",
        orderBy: edtVal?.orderBy ? edtVal?.orderBy : 0,
        parCatId: edtVal?.parCatId ? edtVal?.parCatId : "",
        parCatNm: edtVal?.parCatId ? edtVal?.parCatNm : "",
        portalId: edtVal?.portalId ? edtVal?.portalId : "",
        portalTitle: edtVal?.portalTitle ? edtVal?.portalTitle : "",
      });
    }



  }, [edtVal, mode]);


  //portal Id lov calling
  const [portalLovData, setPortalLovData] = useState([]);

  useEffect(() => {

    const portalLovData = async () => {
      let obj = {
        apiId: 'WAA00021'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/getAllPortal", obj, { headers })
        .then((res) => {
          console.log(res.data);
          setPortalLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
          // setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")")
          // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

        });
    };
    portalLovData();
  }, []);
  const getPortalId = (obj) => {
    return portalLovData[Number(Object.keys(obj)[0])]?.portalId ? portalLovData[Number(Object.keys(obj)[0])]?.portalId : ""
  }

  const getPortlName = (obj) => {
    return portalLovData[Number(Object.keys(obj)[0])]?.portalTitle ? portalLovData[Number(Object.keys(obj)[0])]?.portalTitle : ""
  }
  const [selectRow, setSelectRow] = useState("");
  const [showModelPortalLov, setShowModelPortalLov] = useState(false);
  const handleRowClickPortalLov = (rowData) => {
    setSelectRow(rowData);
    setShowModelPortalLov(rowData);
    setFormData({
      ...formData,
      portalId: getPortalId(rowData),
      portalTitle: getPortlName(rowData)

    })

  };
  //portal Id lov calling end


  //Parent category Id lov tree calling
  // AllLocation Lov(Tree)------------------------------------------
  const fetchTreeLovData = async () => {
    let obj = {
      apiId: "WAA00019",
      criteria: {
        portalId: formData?.portalId
      }
    };

    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/getAllCategoryInfo",
        obj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.content?.qryRsltSet?.length) {
          const modifyData = (items) => {
            return items.map((item) => {
              const newItem = {
                ...item,
                // lvlNm: item.text,
                // lvlRefCd: item.id,
                // parLvlRefCd: item.parentId,
              };
              if (item.children) {
                newItem.children = modifyData(item.children);
              }
              return newItem;
            });
          };

          const modifiedData = modifyData(res.data.content.qryRsltSet);

          setParLovData(modifiedData);
        }
        setOpenModal(true);
      });
  };

  console.log(parLovData);
  const [treeview1, setTreeview1] = useState([]);
  // const idMapping = parLovData.reduce((acc, el, i) => {
  //     acc[el.lvlRefCd] = i;
  //     return acc;
  // }, []);

  // //  let treeview1=[];

  // useEffect(() => {

  //     parLovData.forEach((el) => {
  //         // Handle the root element
  //         if (el.parLvlRefCd === null) {
  //             setTreeview1([...treeview1, el]);
  //             return;
  //         }
  //         // Use our mapping to locate the parent element in our data array
  //         const parentEl = parLovData[idMapping[el.parLvlRefCd]];
  //         // Add our current el to its parent's `children` array
  //         parentEl.children = [...(parentEl.children || []), el];
  //     });
  // }, [parLovData])


  console.log(treeview1);
  const onRenderItem = (item, treeview) => {
    console.log(item);
    return (
      <div className="treeview-item-example">
        {/* <span className="actionButton edit" onClick={() => setCreateModalOpen({
              open: true,
              mode: 2,
              rowData:item
            })}><Edit color="success" size="15" /></span>&nbsp;&nbsp;
            <span className="actionButton view" onClick={() => setCreateModalOpen({
              open: true,
              mode: 4,
              rowData:item
            })}>
      <Visibility color="warning" size="15" />
    </span>&nbsp;&nbsp;
      <span className="actionButton trash" onClick={() => setCreateModalOpen({
              open: true,
              mode: 3,
              rowData:item
            })}><Delete color="error" size="15" /></span> */}
        &nbsp;&nbsp;
        <span
          onClick={(e) => handleItemClick(item)}
          className="treeview-item-example-text"
        >
          {item.text}
        </span>
      </div>
    );
  };

  const handleItemClick = (item) => {
    // const lvlRefCd = item?.id;
    // console.log(lvlRefCd);
    setFormData({
      ...formData,
      parCatId: item.id,
      parCatNm: item.text
    }); // Assuming `item.text` is the title you want to set
    setOpenModal(false);

    // setQryObj({
    //   lvlRefCd: lvlRefCd,
    // });
  };
  // console.log(qryObj);

  const [openModal, setOpenModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  //const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);

  const handleOpenModal = () => {
    fetchTreeLovData();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClear = () => {
    /* setValue({
    ...value,
    id: "",
    text: "",

  }) */
    setFormData({
      ...formData,
      parCatId: "",
      parCatNm: ""

    });
    handleCloseModal();
  };

  console.log(formData);
  console.log(doc[0]);



  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if (!formData.name.trim() || formData.dev_nm.trim() === "") {
      return false;
    }
    if (!formData.addr.trim() || formData.addr.trim() === "") {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
    setFormData({
      actFlg: "A",
      catNm: "",
      catTypFlg: "L",
      orderBy: 0,
      parCatId: "",
      parCatNm: "",
      portalId: "",
      portalTitle: ""
    });
  };
  //  setEdtVal({
  //   modGrpId: '',
  //   modGrpNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({
    entUserId: false,
    entUserMobNo: false,
  });

  const handleCharCount = (event) => {
    setCharCount({ ...charCount, [event.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('running')
    const addObj = {
      "apiId": "WAA00003",
      "mst": {
        "catNm": formData?.catNm,
        "catTypFlg": formData?.catTypFlg ? formData?.catTypFlg : "L",
        "entUserId": formData?.entUserId,
        "entUserMobNo": formData?.entUserMobNo,
        "orderBy": parseInt(formData?.orderBy) || 0,
        "parCatId": formData?.parCatId,
        "portalId": formData?.portalId,
      }
    }
    console.log('running1')
    console.log(formData?.catNm)
    const editObj = {
      "apiId": "WAA00003",
      "mst": {
        "catNm": formData?.catNm,
        "catId": formData?.catId,
        "catTypFlg": formData?.catTypFlg || "L",
        "entUserId": formData?.entUserId,
        "entUserMobNo": formData?.entUserMobNo,
        "orderBy": convertIfString(formData?.orderBy),
        "parCatId": formData?.parCatId,
        "portalId": formData?.portalId,
      }
    }
    console.log('running2' + mode)

    if (mode === 1)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/saveAdd",
          addObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            fetchData();
          }


          setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res?.data?.appMsgList?.list[0]?.errCd +
            ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_parErrExp({ status: res.data?.appMsgList?.errorStatus });

          if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
            resetForm();
          }
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 2)
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/saveEdit",
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
          }

          setMsg(
            res?.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res?.data?.appMsgList?.list[0]?.errCd +
            ")"
          );
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
          set_parErrExp({ status: res.data?.appMsgList?.errorStatus });
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 3) {
      set_open(true);
      // Show confirmation dialog
      // Swal.fire({
      //     title: "Are you sure?",
      //     // text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes, delete it!",
      //     backdrop: true,
      // }).then((result) => {
      // if (result.isConfirmed) {
      // If user confirms, make the delete API call
      // if (window.confirm("Are you sure? The record will be deleted parmanantly")) {
      //   axios
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00001/saveDelete', deleteObj, { headers })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (!res?.data?.appMsgList?.errorStatus) {
      //         fetchData();
      //       }
      //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      //       set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      //     })
      //     .catch((error) => {
      //       console.log("error");
      //     });
      // }
      // });
    }
  };

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };
  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };

  const [open, set_open] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "WAA00017",
      mst: {
        imgId: rowData?.imgId,
      },
    };

    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/WAF00001/saveDelete",
        deleteObj,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData();
        }
        set_delStatus(true);
        setMsg(
          res?.data?.appMsgList?.list[0]?.errDesc +
          " (" +
          res?.data?.appMsgList?.list[0]?.errCd +
          ")"
        );
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus });
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);


  console.log(doc);

  return (
    <div>
      <div className="container">
        {msg && (
          <div ref={msgRef}>
            {" "}
            <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />
          </div>
        )}
        <h4 className="card-title">Image Category {getFormTitle(mode)}</h4>

        <form
          className="form-horizontal"
          onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}
        >

          <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label"><b> Portal ID:<span className="text-red">*</span></b></label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && <span className="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelPortalLov(true)} /></span>}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  required
                  disabled={mode === 3 || mode === 4}
                  value={formData?.portalId}

                />&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  required
                  disabled={mode === 3 || mode === 4}
                  value={formData?.portalTitle}

                />
                <div className="row-mb-12">
                  {showModelPortalLov && <Lov
                    moduleLovData={portalLovData}
                    setShowModel={setShowModelPortalLov}
                    showModel={showModelPortalLov}
                    handleRowClick={handleRowClickPortalLov}
                    columns={portalLovColumns}
                    currentSelection={selectRow}
                    setCurrentSelection={setSelectRow}
                  />}
                </div>

              </div>
            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">Category Name:<span className="text-red">*</span></label>
            <div className="col-md-9 input-group">
              <input
                className="form-control col-md-3"
                type="text"
                name="catId"
                value={formData?.catId}
                placeholder=""
                onChange={handleInputChange}
                readOnly

              />&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                className="form-control col-md-9"
                type="text"
                name="catNm"
                value={formData?.catNm}
                disabled={mode === 3 || mode === 4}
                placeholder="Write category Name Here"
                onChange={handleInputChange}
                required

              />
            </div>
          </div>


          <div className="row mb-4 ">
            <label className="col-sm-3 col-form-label">
              <b>
                {" "}
                Parent Category ID:<span className="text-red">*</span>
              </b>
            </label>
            <div className="col-md-9">
              <div className="input-group">
                {(mode === 1 || mode === 2) && (
                  <span class="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      title=""
                      onClick={() => handleOpenModal()}
                    />
                  </span>
                )}

                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  required
                  disabled={mode === 3 || mode === 4}
                  value={formData?.parCatId}
                />&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  autoComplete={false}
                  className="form-control"
                  required
                  disabled={mode === 3 || mode === 4}
                  value={formData?.parCatNm}
                />
                {/* <div className="row-mb-12">
                {showModelCategoryLov && <Lov
                  moduleLovData={categoryLovData}
                  setShowModel={setShowModelCategoryLov}
                  showModel={showModelCategoryLov}
                  handleRowClick={handleRowClickCategoryLov}
                  columns={categoryLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div> */}
                <div className="row-mb-12">
                  {/* Modal */}
                  {openModal && (
                    <Modal
                      scrollable
                      show={openModal}
                      onHide={handleCloseModal}
                      style={{ zIndex: 9999 }}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Select</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <TreeView
                          id="treeview1"
                          style={{ height: "auto" }}
                          showIcon={false}
                          className="branch"
                          items={parLovData}
                          onSelectItem={handleItemClick}
                          onRenderItem={onRenderItem}
                        // items={renderTreeItems(treeview1)}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <button
                          className="btn btn-primary"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={handleClear}
                        >
                          Clear
                        </button>
                      </Modal.Footer>
                    </Modal>
                  )}
                  {/* Input fields */}
                </div>
              </div>
            </div>
          </div>

          {/* {mode === 1 && (
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                User Id:<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="entUserId"
                  value={formData?.entUserId}
                  onChange={handleInputChange}
                  onBlur={handleCharCount}
                  //placeholder="Name"
                  required
                  maxLength={25}
                  disabled={mode === 3 || mode === 4}
                />
                {charCount?.entUserId && (
                  <span className="input-group-text">
                    {formData?.entUserId?.length}/25
                  </span>
                )}
              </div>
            </div>
          )}
          {mode === 1 && (
            <div className=" row mb-4">
              <label className="col-md-3 form-label">User Mobile No:</label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  name="entUserMobNo"
                  value={formData?.entUserMobNo}
                  onChange={handleInputChange}
                  onBlur={handleCharCount}
                  placeholder="Enter Mobile Number"
                  //required
                  maxLength={10}
                  disabled={mode === 3 || mode === 4}
                />
                {charCount?.entUserMobNo && (
                  <span className="input-group-text">
                    {formData?.entUserMobNo?.length}/10
                  </span>
                )}
              </div>
            </div>
          )} */}

          <div className=" row mb-4">
            <label className="col-md-3 form-label">Order By:</label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="orderBy"
                value={formData?.orderBy}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                //placeholder="Name"
                //required
                maxLength={50}
                disabled={mode === 3 || mode === 4}
              />
            </div>
          </div>


          {/*  category Type */}
          <div className="row mb-4">
            <label className="col-md-3 form-label">Category Type:</label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="catTypFlg"
                disabled={mode === 3 || mode === 4}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.catTypFlg}
              >
                <option disabled>---Choose Category Type---</option>

                {mode === 1
                  ? addVal?.ddCatTypFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))
                  : edtVal?.ddCatTypFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}

                {/* {
    edtVal?.ddLongTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))
} */}
              </select>
            </div>
          </div>



          {/*status*/}
          {mode !== 1 && (<div className="row mb-4">
            <label className="col-md-3 form-label">Status:</label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4 || mode === 1}
                //defaultValue={edtVal.dtlActFlg}
                onChange={handleStatusChange}
                value={formData?.actFlg}
              >
                <option disabled>--Select--</option>

                {mode === 1
                  ? addVal?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))
                  : edtVal?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}

                {/* {
    edtVal?.ddLongTyp?.map((item)=>(
        <option value={item.value}>{item.label}</option>
    ))
} */}
              </select>
            </div>
          </div>)}
          {mode !== 4 && (
            <button
              type="submit"
              disabled={delStatus}
              className="btn btn-primary"
            >
              {buttonTitle(mode)}
            </button>
          )}
          {mode == 1 && (
            <button
              className="btn btn-secondary mx-2"
              type="reset"
              //onClick="resetForm"
              onClick={(e) => resetForm()}
            >
              Reset
            </button>
          )}
        </form>

        {/* <div className="container text-center">
                    <input
                        className="btn btn-success"
                        type="submit"
                        defaultValue="Submit"
                    />
                </div> */}
        {/* </div> */}
      </div>

      <ConfirmDialog
        title="Confirmation"
        open={open}
        setOpen={set_open}
        onConfirm={handleConfirmation}
        setConfirmStatus={setConfirmStatus}
        confirmStatus={confirmStatus}
      >
        Are you sure you want to delete this record?
      </ConfirmDialog>
    </div>
  );
};

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}
