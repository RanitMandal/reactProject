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
const ModGpMulForm = () => {
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
                apiId: "SUA00326"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00120/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content.mst);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ? res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '')
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            })
        }

        fetchOpenData()

    }, [])
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            appCatCd: '',
            actFlg: 'A',
            errors: {
                appCatCd: "",
                actFlg: ''
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.appCatDesc || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    appCatDesc: !row.appCatDesc ? "Please fill in this field." : '',
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
                    appCatCd: '',
                    actFlg: 'A',
                    errors: {
                        appCatCd: '',
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
        // setMsg("")
        // setMsgTyp("")
        setTableRow([
            {
                appCatCd: '',
                appCatDesc: '',
                actFlg: 'A',
                errors: {
                    appCatCd: '',
                    appCatDesc: '',
                    actFlg: ''
                }
            }
        ])

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId: "SUA00328",
            mst: tableRow.map((row) => ({
                actFlg: row.actFlg,
                appCatCd: row.appCatCd,
                appCatDesc:row.appCatDesc
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00120/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm();
                console.log("ccccc");
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

    if (openData?.appMsgList?.errorStatus === true) {
        return null; // Don't render the component
    }

    return (
        <div openData={openData}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">App Category Master - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            SUF00120_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00120_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        App Category Master List
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
                                                        <th> App Category Code<span className="text-red">*</span></th>
                                                        <th> App Category Description<span className="text-red">*</span></th>
                                                        <th> Status <span className="text-red">*</span></th>
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
                                                name="modGrpId"
                                                disabled
                                            />
                                            {row.error && <div className="error-message">{row.error}</div>}
                                        </td> */}
                                                            <td>
                                                                <div className="col-md-12 input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => handleCharCount(e, index)}
                                                                        value={row.appCatCd}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="appCatCd"
                                                                        readOnly
                                                                        maxLength={50}

                                                                    />
                                                                    {charCount[index].isTyping && <span className="input-group-text">{row?.appCatCd?.length}/50</span>}
                                                                    {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                </div>
                                                                {row.errors?.appCatCd && (
                                                                    <div className="error-message text-red text-center">{row.errors?.appCatCd}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="col-md-12 input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => handleCharCount(e, index)}
                                                                        value={row.appCatDesc}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="appCatDesc"
                                                                        required
                                                                        maxLength={50}

                                                                    />
                                                                    {charCount[index].isTyping && <span className="input-group-text">{row.appCatDesc?.length}/50</span>}
                                                                    {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                </div>
                                                                {row.errors?.appCatDesc && (
                                                                    <div className="error-message text-red text-center">{row.errors?.appCatDesc}</div>
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
                                                                    <>
                                                                        {index !== 0 && <button
                                                                            type="button"
                                                                            onClick={(e) => removetableRow(e, index)}
                                                                            className="action-button">
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
export default ModGpMulForm;