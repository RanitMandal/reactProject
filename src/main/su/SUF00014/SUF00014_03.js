import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
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
import Lov from "../../common/Lov";
import { developerLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const DevMstForm = () => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
        set_viewMsg(false)
    
    }, [viewMsg])

    // Open Form API
    const [openData, setOpenData] = useState([]);
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
            let obj = {
                apiId: "SUA00504"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ? res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '');
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            })
        }

        fetchOpenData()

    }, [])



     const [developerLovData, setDeveloperLovData] = useState([]);
    // useEffect(() => {

    //     const fetchDeveloperLovData = async () => {
    //         let obj = {
    //             apiId: 'SUA00158'
    //         }
    //         await axios
    //             .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00014/getAllState", obj, { headers })
    //             .then((res) => {
    //                 console.log(res.data);
    //                 setDeveloperLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
    //                 // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
    //                 // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

    //             });
    //     };
    //     fetchDeveloperLovData();
    // }, []);


    const getdevNm = (obj) => {
        return developerLovData[Number(Object.keys(obj)[0])]?.devNm
    }

    const getdevId = (obj) => {
        return developerLovData[Number(Object.keys(obj)[0])]?.devId
    }


    const [selectRowDeveloperLov, setSelectRowDeveloperLov] = useState("");
    const [showModelDeveloperLov, setShowModelDeveloperLov] = useState(false);
    const handleRowClickDeveloperLov = (rowData) => {
        console.log(rowData)
        setSelectRowDeveloperLov(rowData);
    //      setQueryInputObj({ 

    //         devId: getdevId(rowData),


    //      })
    // };
    //Developer Lov ends   
    }
    // TAble
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            devId: '',
            devNm: '',
            actFlg: 'A',
            errors:{
                devId: '',
            devNm: '',
            actFlg: '',
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.distCd || !row.distNm || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    devId: !row.devId ? "Please fill in this field." : '',
                    devNm: !row.devNm ? "Please fill in this field." : '',
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
                    devId: '',
                    devNm: '',
                    actFlg: 'A',
                    errors:{
                        devId: '',
                    devNm: '',
                    actFlg: '',
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

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = tableRow;
    
        // Clear the error message for the corresponding field
        list[index] = {
            ...list[index],
            [name]: value,
            errors: {
                ...list[index].errors,
                [name]: '',  // Clear the error message for this field
            },
        };
    
        setTableRow([...list]);
    
        let rowsCharCount = charCount;
        rowsCharCount[index] = {
            isTyping: true
        };
    
        setCharCount([...rowsCharCount]);
    };

    const handleStatusChange = (e, index) => {
        const { name, value } = e.target;
        let list = [...tableRow]; // Create a copy of the tableRow array
        list[index] = {
            ...list[index],
            [name]: value
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

    const removetableRow = (e, index) => {
        let rows = tableRow
        rows.splice(index, 1)
        setTableRow([...rows])
        let rowsCharCount = charCount
        rowsCharCount.splice(index, 1)
        setCharCount([...rowsCharCount])
    };



    const resetForm = () => {
        setSelectRowDeveloperLov("")
        setTableRow(
            [
                {
                    code: '',
      webSite: '',
      devId: '',
      devNm: '',
      fax: '',
      emailId: '',
      actFlg: 'A',
      addr: '',
      phNo: '',
      pinNo: '',
                    actFlg: 'A',
                    errors:{
                        code: '',
                        webSite: '',
                        devId: '',
                        devNm: '',
                        fax: '',
                        emailId: '',
                        actFlg: '',
                        addr: '',
                        phNo: '',
                        pinNo: '',
                    }
                },
            ]
        )

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        const body = {
            apiId: "SUA00509",
            mst: tableRow.map((row) => ({
     actFlg: row.actFlg,
    addr: row.addr,
    devNm: row.devNm,
    emailId: row.emailId,
    fax: row.fax,
    phNo: row.phNo,
    pinNo: row.pinNo,
    webSite: row.webSite
            }))
        };

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00014/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm();
            }
        })
    }

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        devId: false,
        devNm: false,
        helppath: false,
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevDeveloper) => ({
            ...prevDeveloper,
            [fieldName]: !prevDeveloper[fieldName],
        }));
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Developer Master - Multiple Add</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    Add Multiple
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    SUF00014_03
                                </a>
                            </li>
                        </ol>
                    </nav>
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
                        to={`${process.env.PUBLIC_URL}/SUF00014_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Developer Master List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div> } 
            <Row>

                <Card>
                    <Card.Body>
                        <Row>

                            <form onSubmit={finalSubmit}>
                                {/* <div className="row mb-2 mx-2 ">
                                    <label className="col-sm-3 col-form-label"><b>Developer:<span className="text-red">*</span></b></label>
                                    <div className="col-md-9">
                                        <div className="input-group">
                                            <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDeveloperLov(true)} /></span>

                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control"
                                                required
                                                value={getdevId(selectRowDeveloperLov)?getdevId(selectRowDeveloperLov):''}
                                            />
                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control mx-4"
                                                required
                                                value={getdevNm(selectRowDeveloperLov)?getdevNm(selectRowDeveloperLov):''}
                                            />
                                            <div className="row-mb-12">
                                                {showModelDeveloperLov && <Lov
                                                    moduleLovData={developerLovData}
                                                    setShowModel={setShowModelDeveloperLov}
                                                    showModel={showModelDeveloperLov}
                                                    handleRowClick={handleRowClickDeveloperLov}
                                                    columns={developerLovColumns}
                                                    currentSelection={selectRowDeveloperLov}
                                                    setCurrentSelection={setSelectRowDeveloperLov}
                                                />}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <Card>
                                    <div className="table-responsive table">
                                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                                            <thead>
                                                <tr>
                                                    <th className="sno">Row#</th>
                                                    {/* <th> Id</th> */}
                                                    <th> Code</th>
                                                    <th> Developer Name <span className="text-red">*</span></th>
                                                    <th> Address <span className="text-red">*</span></th>
                                                    <th> Pin No <span className="text-red">*</span></th>
                                                    <th> Phone No <span className="text-red">*</span></th>
                                                    <th> Fax </th>
                                                    <th> Email Id <span className="text-red">*</span></th>
                                                    <th> Website </th>
                                                    <th>Status</th>
                                                    
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableRow.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>



                                                        {/*  <td>
                                            <input

                                                className="table-input border"
                                                type="text"
                                                name="stateCd"
                                                disabled
                                            />
                                            {row.error && <div className="error-message">{row.error}</div>}
                                        </td> */}
                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.devId}
                                                                    className="form-control"
                                                                    type="number"
                                                                    name="devId"
                                                                    readOnly
                                                                    maxLength={3} onFocus={() => toggleCharCountVisibility("devId")}
                                                                    onBlur={() => toggleCharCountVisibility("devId")}

                                                                />
                                                                
                                                                {fieldCharCountVisibility.devId && (
                                                                    {/* <span className="input-group-text">
                                                                        {row?.devId?.length}/3
                                                                    </span> */}
                                                                )}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distCd.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            
                                                            {row?.errors?.devId && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.devId}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.devNm}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="devNm"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("devNm")}
                                                                    onBlur={() => toggleCharCountVisibility("devNm")}

                                                                />
                                                                 {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.devNm && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.devNm}</div>
                                                                )}
                                                        </td>

                                                        <td>
                                                            <div className=" input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.addr}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="addr"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("addr")}
                                                                    onBlur={() => toggleCharCountVisibility("addr")}

                                                                /> 
                                                                {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.addr && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.addr}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className=" input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.pinNo}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="pinNo"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("pinNo")}
                                                                    onBlur={() => toggleCharCountVisibility("pinNo")}

                                                                />
                                                                 {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.pinNo && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.pinNo}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className=" input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.phNo}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="phNo"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("phNo")}
                                                                    onBlur={() => toggleCharCountVisibility("phNo")}

                                                                />
                                                                 {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.phNo && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.phNo}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.fax}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="fax"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("fax")}
                                                                    onBlur={() => toggleCharCountVisibility("fax")}

                                                                />
                                                                 {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.fax && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.fax}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className=" input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.emailId}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="emailId"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("emailId")}
                                                                    onBlur={() => toggleCharCountVisibility("emailId")}

                                                                />
                                                                 {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.emailId && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.emailId}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className=" input-group table-input" >
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.webSite}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="webSite"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("webSite")}
                                                                    onBlur={() => toggleCharCountVisibility("webSite")}

                                                                /> 
                                                                {/* {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )} */}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.webSite && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.webSite}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-control select"
                                                                aria-label=".form-select-lg example"
                                                                id="status"
                                                                value={row.actFlg}
                                                                required
                                                                onChange={(e) => handleStatusChange(e, index)}
                                                                name="actFlg"
                                                            >


                                                                <option disabled>--Select--</option>
                                                                <option> active</option>
                    <option> Inactive</option>


                                                                {openData?.mst?.ddActFlg?.map((item) => (
                                                                    <option value={item.value}>{item.label}</option>
                                                                ))}
                                                            </select>
                                                            {row?.errors?.actFlg && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.actFlg}</div>
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
                                </Card>
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

                        </Row>
                    </Card.Body>
                </Card>


            </Row>
        </>
    )
}

export default DevMstForm;