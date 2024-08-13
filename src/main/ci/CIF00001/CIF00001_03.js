import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import {
    Tabs,
    Tab,
    OverlayTrigger,

    Breadcrumb,
    Card,
    Row,
    Col,
    Form,

} from "react-bootstrap";
import Lov from "../../common/Lov _new";
import MsgAlert from "../../common/MsgAlert";
import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const CourtDefinitionMulForm = () => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj = {
                apiId: "CIA00003"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content.mst);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.courtNm ? res?.data?.appMsgList?.list[0]?.courtNm + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '')
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })

            })
        }

        fetchOpenData()

    }, [])
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            distCd: "",
            distNm: "",
            stateCd: '',
            stateNm: '',
            courtNm: "",
            errType: "",
            actFlg: 'A',
            errors: {
                distCd: "",
                distNm: "",
                stateCd: '',
                stateNm: '',
                courtNm: "",
                errType: "",
                actFlg: ''
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.courtNm || !row.stateCd || !row.stateNm || !row.distCd || !row.distNm);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    courtNm: !row.courtNm ? "Please fill in this field." : '',
                    stateCd: !row.stateCd ? "Please fill in this field." : '',
                    stateNm: !row.stateNm ? "Please fill in this field." : '',
                    distCd: !row.distCd ? "Please fill in this field." : '',
                    distNm: !row.distNm ? "Please fill in this field." : '',
                   
                   
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        } else {
            setTableRow((prevRows) => [
                ...prevRows,
                {
                    distCd: "",
                    distNm: "",
                    stateCd: '',
                    stateNm: '',
                    courtNm: "",
                    errType: "",
                    actFlg: 'A',
                    errors: {
                        distCd: "",
                        distNm: "",
                        stateCd: '',
                        stateNm: '',
                        courtNm: "",
                        errType: "",
                        actFlg: ''
                    }
                },
            ]);

            setCharCount((prevRows) => [
                ...prevRows,
                {
                    isTyping: false
                },
            ]);
        }


    };

    const [formData, setFormData] = useState({
        distCd: "",
        distNm: "",
        // courtId: rowData ? rowData.courtId : '',
        // courtNm: rowData ? rowData.courtNm : '',
        // actFlg: rowData ? rowData.actFlg : 'A',
        stateCd: '',
        stateNm: ''
    });
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        console.log(name, value);
        let list = tableRow
        list[index] = {
            ...list[index],
            [name]: value,
            errors: {
                ...list[index].errors,
                [name]: '',  // Clear the error message for this field
            },
        }
        setTableRow([...list])
        let rowsCharCount = charCount
        rowsCharCount[index] = {
            isTyping: true
        }
        setCharCount([...rowsCharCount])
    };


    const handleStatusChange = (e, index) => {
        const { name, value } = e.target;
        let list = [...tableRow]; // Create a copy of the tableRow array
        list[index] = {
            ...list[index],
            [name]: value,
            errors: {
                ...list[index].errors,
                [name]: '',  // Clear the error message for this field
            },
        };
        setTableRow(list);
    };



    const handleCharCount = (e, index) => {

        let rowsCharCount = charCount
        rowsCharCount[index] = {
            isTyping: false
        }
        setCharCount([...rowsCharCount])
    };

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        courtNm: false,

        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };

    const removetableRow = (e, index) => {
        let rows = tableRow
        rows.splice(index, 1)
        setTableRow([...rows])
        let rowsCharCount = charCount
        rowsCharCount.splice(index, 1)
        setCharCount([...rowsCharCount])
    };

    //Module Lov Starts     

    // const [modLovData, setModLovData] = useState([]);
    // useEffect(() => {

    //     const fetchModLovData = async () => {
    //         let obj = {
    //             apiId: 'SUA00311'
    //         }
    //         await axios
    //             .post(process.env.REACT_APP_API_URL_PREFIX + "/CIF00001/getAllMdoules", obj, { headers })
    //             .then((res) => {
    //                 console.log(res.data);
    //                 setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

    //             });
    //     };
    //     fetchModLovData();
    // }, []);


    // const getModNm = (obj) => {
    //     return modLovData[Number(Object.keys(obj)[0])]?.modNm
    // }

    // const getModId = (obj) => {
    //     return modLovData[Number(Object.keys(obj)[0])]?.modId
    // }
    // const [rowIndex, setRowIndex] = useState(0);
    // const [selectRow, setSelectRow] = useState("");
    // const [selectRowModLov, setSelectRowModLov] = useState("");
    // const [showModelModLov, setShowModelModLov] = useState(false);
    // const handleRowClickModLov = (rowData) => {
    //     setSelectRow(rowData);
    //     setSelectRowModLov(rowData);

    //     let rows = tableRow
    //     rows[rowIndex] = {
    //         ...rows[rowIndex],
    //         modId: getModId(rowData),
    //         modNm: getModNm(rowData),
    //         errors: {
    //             ...rows[rowIndex].errors,
    //             modId: "",
    //             modNm: ''
    //         }
    //     }
    //     console.log(rows);
    //     setTableRow([...rows])
    //     // setQueryInputObj({
    //     //     ...queryInputObj,
    //     //     criteria: {
    //     //         ...queryInputObj.criteria,
    //     //         errCd: getErrDeffId(rowData)
    //     //     }
    //     // });

    // };

    const [rowIndex, setRowIndex] = useState(0);

    // stateLOv
    const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
    useEffect(() => {
        const modGrpLovObj = {
            apiId: "CIA00038",


        }

        const fetchModuleGrpLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/CIF00001/getAllState", modGrpLovObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    setModuleGrpLovData(
                        res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                    );
                });
        };
        fetchModuleGrpLovData();
    }, []);

    const getstateNm = (obj) => {
        return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm : "";
    };

    const getstateCd = (obj) => {
        return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd : "";
    };

    const [selectRow, setSelectRow] = useState("");
    const [showModel, setShowModel] = useState(false);
    const handleRowClick = (rowData) => {
        setSelectRow(rowData);
       setSelectRowDistLov({});

        // setTableRow({
        //     ...tableRow,
        //     stateCd: getstateCd(rowData),
        //     stateNm: getstateNm(rowData),
        //     distCd: "",
        //     distNm: ""
        // });

        let rows = tableRow
        rows[rowIndex] = {
          ...rows[rowIndex],
          stateCd: getstateCd(rowData),
          stateNm: getstateNm(rowData),
          distCd:"",
          distNm:'',
          errors:{
            ...rows[rowIndex].errors,
            distCd:"",
            distNm:''
          }
        }
        console.log(rows);
        setTableRow([...rows])
    };

    console.log(tableRow);
    //Err_deff Lov ends   
    const open = (index) => {
        setRowIndex(index)
        setSelectRow({})
        setSelectRowDistLov({})
        console.log(rowIndex);
    }


    // distLov 


    const [moduleLovData, setModuleLovData] = useState([]);
    useEffect(() => {
        const formLovObj = {
            apiId: "CIA00002",
            criteria: {
                stateCd: getstateCd(selectRow),
            }
        };

        const fetchModuleLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX +
                    "/CIF00001/getDistByState",
                    formLovObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    setModuleLovData(
                        res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                    );
                });
        };
        if (getstateCd(selectRow)) {
            fetchModuleLovData();
        }

        // selectRow && fetchModuleLovData();
    }, [selectRow]);

    const getdistNm = (obj) => {
        return moduleLovData[Number(Object.keys(obj)[0])]?.distNm ? moduleLovData[Number(Object.keys(obj)[0])]?.distNm : "";
    };

    const getdistCd = (obj) => {
        return moduleLovData[Number(Object.keys(obj)[0])]?.distCd ? moduleLovData[Number(Object.keys(obj)[0])]?.distCd : "";
    };

    const [selectRowModuleLov, setSelectRowDistLov] = useState("");
    const [showModelModuleLov, setShowModelModuleLov] = useState(false);
    const handleRowClickModuleLov = (rowData) => {
        setSelectRowDistLov(rowData);
        // setTableRow({
        //     ...tableRow,
        //     distCd: getdistCd(rowData),
        //     distNm: getdistNm(rowData),
        // });
        // setQueryInputObj({

        //     ...queryInputObj,
        //     distCd: getdistCd(rowData),

        // });
        let rows = tableRow
        rows[rowIndex] = {
          ...rows[rowIndex],
          distCd: getdistCd(rowData),
          distNm: getdistNm(rowData),
          errors:{
            ...rows[rowIndex].errors,
          
          }
        }
        console.log(rows);
        setTableRow([...rows])
    };
 


    const resetForm = () => {
        setMsg("")
        setMsgTyp("")
        setSelectRow({})
        setSelectRowDistLov({})
        setTableRow([
            {
                distCd: "",
                distNm: "",
                stateCd: '',
                stateNm: '',
                courtNm: "",
                errType: "",
                actFlg: 'A',
                errors: {
                    distCd: "",
                    distNm: "",
                    stateCd: '',
                    stateNm: '',
                    courtNm: "",
                    errType: "",
                    actFlg: ''
                }
            }
        ])

    };
    const resetForm1 = () => {
        // setMsg("")
        // setMsgTyp("")
        setSelectRow({})
        setSelectRowDistLov({})
        setTableRow([
            {
                distCd: "",
                distNm: "",
                stateCd: '',
                stateNm: '',
                courtNm: "",
               
                actFlg: 'A',
                errors: {
                    distCd: "",
                        distNm: "",
                        stateCd: '',
                        stateNm: '',
                        courtNm: "",
                       
                        actFlg: ''
                }
            }
        ])

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId: "CIA00008",
            mst: tableRow.map((row) => ({
                // actFlg: row.actFlg || 'A',
                courtNm: row.courtNm,
                distCd: row.distCd,
                stateCd: row.stateCd
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/CIF00001/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm1();
            }
        }).finally(() => {
            set_viewMsg(true)
        });
    }


    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])
    console.log("888", tableRow);

    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }

    return (
        <div openData={openData}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Court Definition - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            CIF00001_03
                        </Breadcrumb.Item>
                    </Breadcrumb>

                </div>
                <div className="ms-auto pageheader-btn">
                    {/* <a
                        className="btn btn-primary btn-icon text-white"
                        onClick={() => setCreateModalOpen({
                            open: true,
                            mode: 1,
                            rowData: null
                        })}

                        variant="contained"
                    >
                        <span>
                            <i className="fe fe-plus" />
                            &nbsp;
                        </span>
                        Add New
                    </a>&nbsp; */}
                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/CIF00001_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                            Court Definition List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
            <Row>
                <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                    <Card>
                        <Card.Body>
                            <Row>
                                <div className="col-lg-12 col-md-12">

                                    <form onSubmit={finalSubmit}>
                                        <div className="table-responsive table">
                                            <table className="table  dta-tabl" style={{ background: 'white' }}>
                                                <thead>
                                                    <tr>
                                                        <th className="sno">Row#</th><th></th>
                                                        {/* <th>Code<span className="text-red">*</span></th> */}
                                                        <th>Name<span className="text-red">*</span></th><th></th>
                                                        <th>State Code<span className="text-red">*</span></th>
                                                        <th>State Name<span className="text-red">*</span></th><th></th>
                                                        <th>District Code<span className="text-red">*</span></th>
                                                        <th>District Name<span className="text-red">*</span></th>
                                                        <th>Status <span className=" text-red">*</span></th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableRow.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td><td></td>
                                                            
                                                          
                                                            {/* name */}
                                                            <td>
                                                                <div className="col-md-12  input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => { handleCharCount(e, index) }}
                                                                        value={row?.courtNm}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="courtNm"
                                                                        required
                                                                        // maxLength={300}
                                                                    // onFocus={() => toggleCharCountVisibility("courtNm")}
                                                                    // onBlur={() => }

                                                                    />
                                                                    {/* {fieldCharCountVisibility.courtNm && (
              <span className="input-group-text">
                {formData?.courtNm?.length}/300
              </span>
            )} */}
                                                                    {/* {charCount[index].isTyping && <span className="input-group-text">{row?.courtNm?.length}/300</span>} */}
                                                                    {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                                </div>
                                                                {row?.errors?.courtNm && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.courtNm}</div>
                                                                )}
                                                            </td>


                                                            {/* lov */}
                                                            <td>
                                                                <span className="table-input  border-primary">
                                                                    <i
                                                                        className="fa fa-search"
                                                                        title=""
                                                                        onClick={() => {
                                                                            setShowModel(true);
                                                                            open(index);
                                                                        }}

                                                                    ></i>
                                                                </span>
                                                            </td>
                                                            {/* stateCd */}
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                                                    value={row?.stateCd}
                                                                    required
                                                                />
                                                                {row?.errors?.stateCd && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.stateCd}</div>
                                                                )}
                                                            </td>
                                                            {/* stateNm */}
                                                            <td>
                                                                {/* Error Deffintion */}


                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModNm(selectRowModLov) ? getModNm(selectRowModLov) : ''}
                                                                    value={row?.stateNm}
                                                                    required
                                                                />
                                                                {row?.errors?.stateNm && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.stateNm}</div>
                                                                )}
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

                                                            </td>

                                                            {/* lov */}
                                                            <td>
                                                                <span className="table-input  border-primary">
                                                                    <i
                                                                        className="fa fa-search"
                                                                        title=""
                                                                        onClick={() => {
                                                                            setShowModelModuleLov(true);
                                                                            open(index);
                                                                        }}

                                                                    ></i>
                                                                </span>
                                                            </td>
                                                            {/* disitCd */}
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                                                    value={row?.distCd}
                                                                    required
                                                                />
                                                                {row?.errors?.distCd && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.distCd}</div>
                                                                )}
                                                            </td>
                                                            {/* disitNm */}
                                                            <td>
                                                                {/* Error Deffintion */}


                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModNm(selectRowModLov) ? getModNm(selectRowModLov) : ''}
                                                                    value={row?.distNm}
                                                                    required
                                                                />
                                                                {row?.errors?.distNm && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.distNm}</div>
                                                                )}
                                                                <div className="row-mb-12">
                                                                    {showModelModuleLov && (
                                                                        <Lov
                                                                            moduleLovData={moduleLovData}
                                                                            setShowModel={setShowModelModuleLov}
                                                                            showModel={showModelModuleLov}
                                                                            handleRowClick={handleRowClickModuleLov}
                                                                            columns={moduleLovColumns}
                                                                            currentSelection={selectRowModuleLov}
                                                                            setCurrentSelection={setSelectRowDistLov}
                                                                        />
                                                                    )}
                                                                </div>

                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-control select"
                                                                    aria-label=".form-select-lg example"
                                                                    id=""
                                                                    value={row.actFlg}
                                                                    required
                                                                    onChange={(e) => handleStatusChange(e, index)}
                                                                    name="actFlg"
                                                                >

                                                                    <option disabled>--Select--</option>


                                                                    {openData?.ddActFlg?.map((item) => (
                                                                        <option value={item.value}>{item.label}</option>
                                                                    ))}

                                                                </select>
                                                                {row.errors.actFlg && (
                                                                    <div className="error-message text-red text-center">{row.errors.actFlg}</div>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {index !== tableRow.length - 1 ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => removetableRow(e, index)}
                                                                        className="action-button"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </button>
                                                                ) : (
                                                                    <div className="d-flex">
                                                                        {index !== 0 && <button
                                                                            type="button"
                                                                            onClick={(e) => removetableRow(e, index)}
                                                                            className="action-button"
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                        </button>}
                                                                        <button type="button" onClick={addtableRow} className="action-button">
                                                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                                        </button>

                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <button className="btn btn-primary" type="submit">Save</button>
                                        <button
                                            className="btn btn-secondary mx-2"
                                            type="reset"
                                            //onClick="resetForm"
                                            onClick={(e) => resetForm()}
                                        >
                                            Reset
                                        </button>
                                    </form>

                                </div>
                            </Row>
                        </Card.Body>
                    </Card>

                </div>
            </Row>
        </div>
    )
}
export default CourtDefinitionMulForm;