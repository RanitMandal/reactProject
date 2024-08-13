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
import { stateLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const DistMstForm = () => {
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
                apiId: "SUA00190"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/openAddForm', obj, { headers }).then((res) => {
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



    const [stateLovData, setStateLovData] = useState([]);
    useEffect(() => {

        const fetchStateLovData = async () => {
            let obj = {
                apiId: 'SUA00158'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00015/getAllState", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setStateLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                    // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)

                });
        };
        fetchStateLovData();
    }, []);


    const getStateNm = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateNm
    }

    const getStateCd = (obj) => {
        return stateLovData[Number(Object.keys(obj)[0])]?.stateCd
    }


    const [selectRowStateLov, setSelectRowStateLov] = useState("");
    const [showModelStateLov, setShowModelStateLov] = useState(false);
    const handleRowClickStateLov = (rowData) => {
        console.log(rowData)
        setSelectRowStateLov(rowData);
        //   setQueryInputObj({ 

        //         stateCd: getStateCd(rowData),


        // })
    };
    //State Lov ends   

    // TAble
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            distCd: '',
            distNm: '',
            actFlg: 'A',
            errors:{
                distCd: '',
            distNm: '',
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
                    distCd: !row.distCd ? "Please fill in this field." : '',
                    distNm: !row.distNm ? "Please fill in this field." : '',
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
                    distCd: '',
                    distNm: '',
                    actFlg: 'A',
                    errors:{
                        distCd: '',
                    distNm: '',
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
        setSelectRowStateLov("")
        setTableRow(
            [
                {
                    distCd: '',
                    distNm: '',
                    actFlg: 'A',
                    errors:{
                        distCd: '',
                    distNm: '',
                    actFlg: '',
                    }
                },
            ]
        )

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        const body = {
            apiId: "SUA00195",
            mst: tableRow.map((row) => ({
                distCd: row.distCd,
                distNm: row.distNm,
                stateCd: getStateCd(selectRowStateLov),
                actFlg: row.actFlg,
            }))
        };

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00015/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm();
            }
        })
    }

    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        distCd: false,
        distNm: false,
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

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">District Master - Multiple Add</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    Add Multiple
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    SUF00015_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00015_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        District Master List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div> } 
            <Row>

                <Card>
                    <Card.Body>
                        <Row>

                            <form onSubmit={finalSubmit}>
                                <div className="row mb-2 mx-2 ">
                                    <label className="col-sm-3 col-form-label"><b>State:<span className="text-red">*</span></b></label>
                                    <div className="col-md-9">
                                        <div className="input-group">
                                            <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelStateLov(true)} /></span>

                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control"
                                                required
                                                value={getStateCd(selectRowStateLov)?getStateCd(selectRowStateLov):''}
                                            />
                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control mx-4"
                                                required
                                                value={getStateNm(selectRowStateLov)?getStateNm(selectRowStateLov):''}
                                            />
                                            <div className="row-mb-12">
                                                {showModelStateLov && <Lov
                                                    moduleLovData={stateLovData}
                                                    setShowModel={setShowModelStateLov}
                                                    showModel={showModelStateLov}
                                                    handleRowClick={handleRowClickStateLov}
                                                    columns={stateLovColumns}
                                                    currentSelection={selectRowStateLov}
                                                    setCurrentSelection={setSelectRowStateLov}
                                                />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Card>
                                    <div className="table-responsive table">
                                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                                            <thead>
                                                <tr>
                                                    <th className="sno">Row#</th>
                                                    {/* <th> Id</th> */}
                                                    <th> Code<span className="text-red">*</span></th>
                                                    <th> Dristrict Name <span className="text-red">*</span></th>
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
                                                                    value={row.distCd}
                                                                    className="form-control"
                                                                    type="number"
                                                                    name="distCd"
                                                                    required
                                                                    maxLength={3} onFocus={() => toggleCharCountVisibility("distCd")}
                                                                    onBlur={() => toggleCharCountVisibility("distCd")}

                                                                />
                                                                {fieldCharCountVisibility.distCd && (
                                                                    <span className="input-group-text">
                                                                        {row?.distCd?.length}/3
                                                                    </span>
                                                                )}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distCd.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.distCd && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.distCd}</div>
                                                                )}
                                                        </td>
                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.distNm}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="distNm"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("distNm")}
                                                                    onBlur={() => toggleCharCountVisibility("distNm")}

                                                                /> {fieldCharCountVisibility.distNm && (
                                                                    <span className="input-group-text">
                                                                        {row?.distNm?.length}/50
                                                                    </span>
                                                                )}
                                                                {/* {charCount[index].isTyping && <span className="input-group-text">{row.distNm.length}/50</span>} */}
                                                                {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                            </div>
                                                            {row?.errors?.distNm && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.distNm}</div>
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
export default DistMstForm;