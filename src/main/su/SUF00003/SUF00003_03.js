import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Modal, ModalTitle, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DynamicTreeMenu from "./Tree.js";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import { getApiToken, isAuthenticated } from "../../common/common";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };

const Evnt_Mst_Form = () => {
  const [showCharacterCount, setShowCharacterCount] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [openData, setOpenData] = useState([]);
  let body = {
    apiId: "SUA00132",
  };
  useEffect(() => {
    console.log(headers);
    const fetchOpenData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/openAddForm",
          body,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setOpenData(res.data?.content?.mst);
          console.log(openData);
          setMsg(
            data?.appMsgList?.list[0]?.errDesc
              ? data?.appMsgList?.list[0]?.errDesc +
              " (" +
              data?.appMsgList?.list[0]?.errCd +
              ")"
              : ""
          );
          setMsgTyp(data?.appMsgList?.list[0]?.errType);
          set_errExp({status:res.data?.appMsgList?.errorStatus})
        });
    };

    fetchOpenData();
  }, []);


  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
      if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
      set_viewMsg(false)
  
  }, [viewMsg])

  //Module Group Lov Starts
  const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
  useEffect(() => {
    const modGrpLovObj = {
      apiId: "SUA00173",
    };
    const fetchModuleGrpLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/getAllModGrp",
          modGrpLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleGrpLovData(
            res.data?.content?.qryRsltSet?.length
              ? res.data?.content?.qryRsltSet
              : []
          );
          /*   setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };
    fetchModuleGrpLovData();
  }, []);

  const getModuleGrpName = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpNm:"";
  };

  const getModuleGrpId = (obj) => {
    return moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.modGrpId:"";
  };

  const [selectRow, setSelectRow] = useState("");
  const [showModel, setShowModel] = useState(false);
  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setSelectRowModuleLov({});
    /* setQueryInputObj({ 
        criteria: {
            ...queryInputObj.criteria,
            modGrpId: getModuleGrpId(rowData),
            
        }
    })  */
  };
  //Module Group Lov ends

  //module Lov Starts

  const [moduleLovData, setModuleLovData] = useState([]);
  useEffect(() => {
    const formLovObj = {
      apiId: "SUA00174",
      criteria: {
        modGrpId: getModuleGrpId(selectRow),
      },
    };

    const fetchModuleLovData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/getModMstByModGrp",
          formLovObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          setModuleLovData(
            res.data?.content?.qryRsltSet?.length
              ? res.data?.content?.qryRsltSet
              : []
          );
          /*   setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
              ? res.data?.appMsgList?.list[0]?.errDesc +
                  ' (' +
                  res.data?.appMsgList?.list[0]?.errCd +
                  ')'
              : ''
          );
          
          setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
        });
    };

    selectRow && fetchModuleLovData();
  }, [selectRow]);

  const getModuleName = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modNm ? moduleLovData[Number(Object.keys(obj)[0])]?.modNm:"";
  };

  const getModuleId = (obj) => {
    return moduleLovData[Number(Object.keys(obj)[0])]?.modId ? moduleLovData[Number(Object.keys(obj)[0])]?.modId:"";
  };

  const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
  const [showModelModuleLov, setShowModelModuleLov] = useState(false);
  const handleRowClickModuleLov = (rowData) => {
    setSelectRowModuleLov(rowData);

  };
  useEffect(() => {
    setQueryInputObj1({
      apiId: "SUA00130",
      criteria: {
        ...queryInputObj1?.criteria,
        modId: getModuleId(selectRowModuleLov),
      },
    });
  }, [selectRowModuleLov])


  const [queryInputObj1, setQueryInputObj1] = useState({
    apiId: "SUA00130",
    criteria: {
      modId: "",
      actFlg: "L",
    },
  });

  //module Lov Ends
  const [treeObj, setTreeObj] = useState([
    {
      menuId: "",
      menuNm: "",
    },
  ]);

  const [addVal, setAddVal] = useState([
    {
      actFlg: "",
      evtDesc: "",
      evtNm: "",
      menuId: "",
      modId: "",
      orderBy: 0,
    },
  ]);

  /*   const addObj = 
  [
    {
      actFlg: tableRow.actFlg,
      evtDesc: tableRow.evtDesc,
      evtNm: addVal.evtNm,
      menuId: addVal.menuId,
      modId: addVal.modId,
      orderBy: 0
    }
  ] */

  /* const fetchOpenData = async () => {

    await axios.get(process.env.REACT_APP_API_URL_PREFIX + "/su/SUF00003/getList", addObj, { headers }).then((res) => {
        console.log(res.data);
        setOpenData(res.data);
        console.log(openData);
        setMsg(res?.data?.appMsgList?.List[0]?.errorMessage + " (" + res?.data?.appMsgList?.List[0]?.errorCode + ")");
        setMsgTyp(res?.data?.appMsgList?.List[0]?.errorType);
    })
} */

  const data = [
    {
      id: "",
      mod_grp_code: "1",
      mod_grp_name: "d",
      mod_code: "2",
      mod_name: "c",
      evnt_code: "",
      evtNm: "",
      evtDesc: "",
      menu_code: "3",
      menu_name: "b",
      evnt_post: "",
      actFlg: "A",
    },
  ];
  const [tableRow, setTableRow] = useState([
    {
      modId: queryInputObj1?.criteria?.modId,

      evtNm: "",
      evtDesc: "",
      menuId: "",
      menuNm: "",
      actFlg: "A",
      error: {
        evtNm: "",
        evtDesc: "",
        menuId: "",
        menuNm: "",

        actFlg: "",
      },
    },
  ]);

  const addTableRow = () => {
    const hasBlankFields = tableRow.some((row) => !row.evtNm || !row.evtDesc || !row.menuId || !row.menuNm || !row.actFlg);

    if (hasBlankFields) {

      const updatedRows = tableRow.map((row) => ({
        ...row,
        error: {
          evtNm: !row.evtNm ? "Please fill in this field." : '',
          evtDesc: !row.evtDesc ? "Please select a value." : '',
          menuId: !row.menuId ? "Please select a value." : '',
          menuNm: !row.menuNm ? "Please select a value." : '',
          actFlg: !row.actFlg ? "Please select a value." : '',
        },
      }));

      setTableRow(updatedRows);

      // You can also show a global error message if needed
      // alert("Please fill in all fields for each row before adding a new row.");
    } else {
      setTableRow((prevRows) => [
        ...prevRows,
        {
          /*  mod_code: '',
                    mod_name: '', */
          //evnt_code: '',
          modId: queryInputObj1?.criteria?.modId,
          evtNm: "",
          evtDesc: "",
          menuId: "",
          menuNm: "",
          /*   evnt_post: '', */
          actFlg: "A",
          error: {
            evtNm: "",
            evtDesc: "",
            menuId: "",
            menuNm: "",

            actFlg: "",
          },
        },
      ]);
    }


  };

  const handleTableInputChange2 = (e, index, name) => {
    const { value } = e.target;
    console.log("9999999999999");
    // setTableRow((prevRows) =>
    //     prevRows.map((row) => {
    //         if (row.id === id) {
    //             return {
    //                 ...row,
    //                 [name]: value,
    //                 error: {
    //                     ...row.error,
    //                     [name]: "",
    //                 },
    //             };
    //         }
    //         return row;
    //     })
    // );
    let rows = tableRow;
    rows[index] = {
      ...rows[index],
      modId: queryInputObj1?.criteria?.modId,
      [name]: value,
      error: {
        ...rows[index].error,
        [name]: "",
      },
    };
    setTableRow([...rows]);
  };


  const removeTableRow = (index) => {
    //setTableRow((prevRows) => prevRows.filter((row) => row.id !== id));
    console.log(index);
    const list = tableRow;
    list.splice(index, 1)
    setTableRow([...list])
  };

  const validateInputs = () => {
    let isValid = true;
    const updatedRows = tableRow.map((row) => {
      const errors = {};

      /*  if (row.evnt_code.trim() === "") {
                errors.evnt_code = "This field is required";
                isValid = false;
            } */

      if (row.evtNm.trim() === "") {
        errors.evtNm = "This field is required";
        isValid = false;
      }
      if (row.evtDesc.trim() === "") {
        errors.evtDesc = "This field is required";
        isValid = false;
      }
      if (treeObj.menuId.trim() === "") {
        errors.menuId = "This field is required";
        isValid = false;
      }
      if (treeObj.menuNm.trim() === "") {
        errors.menuNm = "This field is required";
        isValid = false;
      }
      /*  if (row.evnt_post.trim() === "") {
                errors.evnt_post = "This field is required";
                isValid = false;
            } */

      if (row.actFlg.trim() === "") {
        errors.actFlg = "This field is required";
        isValid = false;
      }

      return { ...row, error: errors };
    });

    setTableRow(updatedRows);
    console.log("");
    console.log(tableRow);
    return isValid;
  };

  /*  const handleRowClick = (rowData) => {
        setSelectRow(rowData);
        setOpen(false);
    };  */

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  //const [selectRow, setSelectRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);

  const handleClear = () => {
    const updatedRows = tableRow.map((row) => ({
      ...row,
      menuId: "",
      menuNm: "",

    }));

    setTableRow(updatedRows);
    // setEditVal({
    //   ...editVal,
    //   menuId:"",
    //   menuNm:""
    // })
    setOpen(false)
  }
  const openModal = (index) => {

    setRowIndex(index);

    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setSelectRow(null);
    setSearchText("");
  };

  // Module Group LOV
  const handleRowClick2 = (rowData3) => {
    setSelectRow2(rowData3);
    setOpen2(false);
  };

  const [searchText2, setSearchText2] = useState("");
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectRow2, setSelectRow2] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [tableDat2, setTableDat2] = useState(data);

  // const handleRowClick = (rowData) => {
  //   setSelectRow(rowData);
  // };
  const openModal2 = () => {
    setTableDat2(data);
    setOpen2(true);
  };

  const closeModal2 = () => {
    setOpen2(false);
  };

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableDat2.filter(
      (row2) =>
        row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
        row2.mod_grp_name.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };

  // *****Module LOV*******/
  const handleRowClick3 = (rowData3) => {
    setSelectRow3(rowData3);
    setOpen3(false);
  };

  const [searchText3, setSearchText3] = useState("");
  const [filteredData3, setFilteredData3] = useState([]);
  const [selectRow3, setSelectRow3] = useState(null);
  const [open3, setOpen3] = useState(false);
  const [tableDat3, setTableDat3] = useState(data);

  // const handleRowClick = (rowData) => {
  //   setSelectRow(rowData);
  // };
  const openModal3 = () => {
    setTableDat3(data);
    setOpen3(true);
  };

  const closeModal3 = () => {
    setOpen3(false);
  };

  const handleSearch3 = () => {
    // Filter the table data based on the search text
    const filteredData3 = tableDat3.filter(
      (row3) =>
        row3.id.toString().toLowerCase().includes(searchText3.toLowerCase()) ||
        row3.name.toLowerCase().includes(searchText3.toLowerCase())
    );
    setFilteredData3(filteredData3);
  };

  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    evtNm: false,
    evtDesc: false,
    helppath: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const finalSubmit = async (e) => {
    e.preventDefault();
    const add = {
      apiId: "SUA00133",
      mst: tableRow.map((item) => {
        const { error, ...rest } = item;
        return {
          ...rest,
        };
      }),
    };

    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00003/saveAdd", add, {
        headers,
      })
      .then((res) => {
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res.data?.appMsgList?.list[0]?.errCd +
            ")"
            : ""
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000011") {
          // resetForm();
        }
      });
  };
  const resetForm = () => {
    setSelectRow("");
    setSelectRowModuleLov({});
    setQueryInputObj1(
      {
        apiId: "SUA00130",
        criteria: {
          modId: "",
          actFlg: "A",
        },
      }

    )
    setTableRow(

      [
        {
          modId: queryInputObj1?.criteria?.modId,

          evtNm: "",
          evtDesc: "",
          menuId: "",
          menuNm: "",

          actFlg: "A",
          error: {
            evtNm: "",
            evtDesc: "",
            menuId: "",
            menuNm: "",

            actFlg: "",
          },
        },
      ]

    )
  }
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Master</h1>
          <nav aria-label="breadcrumb" className="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item breadcrumb-item">
                <a href="#" role="button" tabIndex={0}>
                  Add Multiple
                </a>
              </li>
              <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                <a href="#" role="button" tabIndex={0}>
                  SUF00003_03
                </a>
              </li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto pageheader-btn">
          <Link
            className="btn btn-success btn-icon text-white"
            to={`${process.env.PUBLIC_URL}/SUF00003_01`}
          >
            <span>
              <i className="fe fe-log-in" />
              &nbsp;
            </span>
            Event Master
          </Link>
        </div>
      </div>
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
      <Card>
        <Card.Body className="px-0">
          <form onSubmit={finalSubmit}>
            <div className="row my-2 mx-2">
              <label
                for="exampleFormControlSelect1"
                className="col-sm-3 col-form-label"
              >
                <b>
                  Module Group:<span className="text-red">*</span>
                </b>
              </label>
              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowModel(true)}
                    />
                  </span>

                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control"
                    required
                    value={
                      getModuleGrpId(selectRow) ? getModuleGrpId(selectRow) : ""
                    }
                  />
                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control mx-4"
                    required
                    value={
                      getModuleGrpName(selectRow)
                        ? getModuleGrpName(selectRow)
                        : ""
                    }
                  />

                  <div className="row-mb-12">
                    {showModel && (
                      <Lov
                        moduleLovData={moduleGrpLovData}
                        setShowModel={setShowModel}
                        showModel={showModel}
                        handleRowClick={handleRowClick}
                        columns={moduleGrpLovColumns}
                        currentSelection={selectRow}
                        setCurrentSelection={setSelectRow}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row my-2 mx-2">
              <label
                for="exampleFormControlSelect1"
                className="col-sm-3 col-form-label"
              >
                <b>
                  Module:<span className="text-red">*</span>
                </b>
              </label>
              <div className="col-md-9">
                <div class="input-group">
                  <span className="input-group-text bg-primary">
                    <i
                      className="fa fa-search d-inline text-white"
                      onClick={() => setShowModelModuleLov(true)}
                    />
                  </span>

                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control "
                    required
                    value={
                      getModuleId(selectRowModuleLov)
                        ? getModuleId(selectRowModuleLov)
                        : ""
                    }
                  />
                  <input
                    type="text"
                    autoComplete={false}
                    className="form-control mx-4"
                    required
                    value={
                      getModuleName(selectRowModuleLov)
                        ? getModuleName(selectRowModuleLov)
                        : ""
                    }
                  />
                  <div className="row-mb-12">
                    {showModelModuleLov && (
                      <Lov
                        moduleLovData={moduleLovData}
                        setShowModel={setShowModelModuleLov}
                        showModel={showModelModuleLov}
                        handleRowClick={handleRowClickModuleLov}
                        columns={moduleLovColumns}
                        currentSelection={selectRowModuleLov}
                        setCurrentSelection={setSelectRowModuleLov}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className=" border-top" style={{ background: "white" }}>
              <div className="table-responsive">
                <Table striped hover responsive="lg" className="mb-2">
                  <thead>
                    <tr>
                      <th className="sno">Row#</th>

                      <th>Event Name<span className="text-red">*</span></th>
                      <th>Event Description<span className="text-red">*</span></th>
                      <th></th>
                      <th>Menu Id<span className="text-red">*</span></th>
                      <th>Name</th>

                      <th style={{ paddingLeft: "19px", paddingRight: "19px" }}>
                        Status<span className="text-red">*</span>
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRow.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>

                        <td>
                        <div className="input-group">
                          <input
                            type=""
                            aria-label="Last name"
                            value={row.evtNm}
                            required
                            className="table-input border ui_entryd_txt_rc"
                            name="evtNm"
                            onChange={(e) =>
                              handleTableInputChange2(e, index, "evtNm")
                            }
                            maxLength={200}
                            onFocus={() => toggleCharCountVisibility("evtNm")}
                            onBlur={() => toggleCharCountVisibility("evtNm")}
                          />
                          {fieldCharCountVisibility.evtNm && (
                            <span className="input-group-text">
                              {row.evtNm.length}/200
                            </span>
                          )}
                          </div>
                          {row.error.evtNm && (
                            <div className="error-message text-red text-center">{row.error.evtNm}</div>
                          )}
                        </td>
                        <td>
                        <div className="input-group">
                          <input
                            type=""
                            aria-label="Last name"
                            value={row.evtDesc}
                            required
                            className="table-input border ui_entryd_txt_rc"
                            name="evtDesc"
                            onChange={(e) =>
                              handleTableInputChange2(e, index, "evtDesc")
                            }
                            maxLength={1000}
                            onFocus={() => toggleCharCountVisibility("evtDesc")}
                            onBlur={() => toggleCharCountVisibility("evtDesc")}
                          />
                          {fieldCharCountVisibility.evtDesc && (
                            <span className="input-group-text">
                              {row.evtDesc.length}/1000
                            </span>
                          )}
                          </div>
                          {row.error.evtDesc && (
                            <div className="error-message text-red">
                              {row.error.evtDesc}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="table-input  border-primary">
                            <i
                              className="fa fa-search"
                              title=""
                              onClick={() => openModal(index)}
                            ></i>
                          </span>
                        </td>
                        <td>
                          <div className="input-group">
                            <input
                              type=""
                              aria-label="First name"
                              value={row.menuId}
                              className="table-input border"
                              readOnly
                              required
                              name="menuId"
                              onInput={(e) => handleTableInputChange2(e, index, "menuId")}
                            />
                          </div>

                          {!row.menuId && (
                            <div className="error-message text-red">{row?.error?.menuId}</div>
                          )}
                        </td>
                        <td>
                          <input
                            type=""
                            aria-label="Last name"
                            value={row.menuNm}
                            className="form_control  border ui_entryd_txt_rc"
                            readOnly
                            name="menuNm"
                            onChange={(e) =>
                              handleTableInputChange2(e, index, "menuNm")
                            }
                          />

                          {!row.menuNm && (
                            <div className="error-message text-red">{row.error.menuNm}</div>
                          )}
                        </td>

                        <td>
                          <select
                            className="form-control select"
                            aria-label="form-select-lg example"
                            id="status"
                            required
                            value={row.actFlg}

                            onChange={(e) =>
                              handleTableInputChange2(e, index, "actFlg")
                            }
                            name="actFlg"
                          >
                            <option disabled>--Select--</option>

                            {openData?.ddActFlg?.map((item) => (
                              <option value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          {row.error.actFlg && (
                            <div className="error-message text-red">
                              {row.error.actFlg}
                            </div>
                          )}
                        </td>
                        <td>
                          {index !== tableRow.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => removeTableRow(index)}
                              className="action-button"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          ) : (
                            <div className="d-flex">
                              {index !== 0 && <button
                                type="button"
                                onClick={(e) => removeTableRow(index)}
                                className="action-button"
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>}
                              <button type="button" onClick={addTableRow} className="action-button">
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                              </button>

                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {open && (
                      <Modal
                        show={open}
                        onHide={closeModal}
                        style={{ zIndex: 9999 }}
                        scrollable
                      >
                        <Modal.Header closeButton>
                          <ModalTitle>Select A Menu</ModalTitle>
                        </Modal.Header>
                        <Modal.Body>
                          {/* <div className="table-responsive">
                                                    <h2>Search Modal</h2>
                                                    <div className="input-group mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Search"
                                                            value={searchText}
                                                            onChange={(e) => setSearchText(e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-primary"
                                                            type="button"
                                                            onClick={handleSearch}
                                                        >
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
                                                            {filteredData.map((row) => (
                                                                <tr
                                                                    key={row.id}
                                                                    onClick={() => handleRowClick(row)}
                                                                >
                                                                    <td>{row.menu_code}</td>
                                                                    <td>{row.menu_name}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div> */}
                          <DynamicTreeMenu
                            closeModal={closeModal}
                            setTreeObj={setTreeObj}
                            handleTableInputChange2={handleTableInputChange2}
                            rowIndex={rowIndex}
                            tableRow={tableRow}
                            setTableRow={setTableRow}
                            queryInputObj1={queryInputObj1}
                          />
                        </Modal.Body>
                        {/* Close modal button */}
                        <Modal.Footer>
                          <button className="btn btn-primary" onClick={() => setOpen(false)}>Close</button>
                          <button className="btn btn-primary" onClick={handleClear}>Clear</button>
                        </Modal.Footer>
                      </Modal>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  className="btn btn-secondary mx-2"
                  type="reset"
                  //onClick="resetForm"
                  onClick={(e) => resetForm()}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </Card.Body>
      </Card>
    </>
  );
};

export default Evnt_Mst_Form;
