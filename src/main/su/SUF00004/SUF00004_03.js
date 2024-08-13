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
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const LocTypMulForm = () => {
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
                "apiId": "SUA00089"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00004/openAddForm', obj, { headers }).then((res) => {

                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ? res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '')
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({status:res.data?.appMsgList?.errorStatus})
            })
        }

        fetchOpenData()

    }, [])
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            lvlTypNm: '',
            actFlg: 'A',
            errors: {
                lvlTypNm: '',
                actFlg: '',
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.lvlTypNm || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    lvlTypNm: !row.lvlTypNm ? "Please fill in this field." : '',
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
                    lvlTypNm: '',
                    actFlg: 'A',
                    errors:{
                        lvlTypNm: '',
                        actFlg: '', 
                    }
                },
            ]);

            setCharCount((prevRows) => [
                ...prevRows,
                {
                    isTyping: false,
                   
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

        setTableRow(
            [{

                lvlTypNm: '',
                actFlg: 'A',
                errors: {
                    lvlTypNm: '',
                    actFlg: '',
                }
            }]
        )
            // setMsg("")
            // setMsgTyp("")
    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId: "SUA00091",
            mst: tableRow.map((row) => ({
                actFlg: row.actFlg,
                lvlTypNm: row.lvlTypNm,
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00004/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm();
            }
        }).finally(() => {
            set_viewMsg(true)
        });
    }

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
        set_viewMsg(false)
    
    }, [viewMsg])

    if (openData?.appMsgList?.errorStatus == true) {
        return null; // Don't render the component
    }

    return (
        <div >
            <div className="page-header">
                <div>
                    <h1 className="page-title">Location Type - Multiple Add</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    Add Multiple
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    SUF00004_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00004_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Location Type List
                    </Link>

                </div>
            </div>
            {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}

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
                                                        <th className="sno">Row#</th>
                                                        {/* <th> Id</th> */}
                                                        <th> Location Type Name <span className="text-red">*</span></th>
                                                        <th> Status </th>
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
                                                name="lvlTypCd"
                                                disabled
                                            />
                                            {row.error && <div className="error-message">{row.error}</div>}
                                        </td> */}
                                                            <td>
                                                                <div className="col-md-12 input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => handleCharCount(e, index)}
                                                                        value={row?.lvlTypNm}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="lvlTypNm"
                                                                        required
                                                                        maxLength={50}

                                                                    />
                                                                    {charCount[index].isTyping && <span className="input-group-text">{row.lvlTypNm.length}/50</span>}
                                                                    {/* {row.lvlTypNm === "" ? <span className="input-group-text d-none">{row.lvlTypNm.length}/50</span> : <span className="input-group-text">{row.lvlTypNm.length}/50</span>} */}
                                                                </div>
                                                                {row.errors.lvlTypNm && (
                                                                    <div className="error-message text-red text-center">{row.errors.lvlTypNm}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-control select"
                                                                    aria-label=".form-select-lg example"
                                                                    id="status"
                                                                    value={row.actFlg}
                                                                    required
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    name="actFlg"
                                                                >
                                                                    <option disabled>--Select--</option>

                                                                    {openData?.content?.mst?.ddActFlg?.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
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
                                                                    <>
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

                                                                    </>
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
export default LocTypMulForm;