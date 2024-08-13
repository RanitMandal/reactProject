import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import MsgAlert from "../../common/MsgAlert";
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
const headers = { Authorization: 'Bearer ' + getApiToken() };
const CalYrMulForm = () => {
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

            let body = {
                apiId: "SUA00294"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00023/openAddForm', body, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
                    res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                set_errExp({ status: res.data?.appMsgList?.errorStatus });
            })
        }

        fetchOpenData()

    }, [])

    const getDateFormart_ddmmyyyy = (yyyymmdd) => {
        console.log(yyyymmdd);
        const date = new Date(yyyymmdd);
        const month = Number(date.getMonth()) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        const day = Number(date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate());
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    const getDateFormart_yyyymmdd = (ddmmyyyy) => {
        console.log(ddmmyyyy);


        if (ddmmyyyy) {
            const day = ddmmyyyy.slice(0, 2)
            const month = ddmmyyyy.slice(3, 5)
            const year = ddmmyyyy.slice(6, 10)
            console.log(`${year}-${month}-${day}`);
            return `${year}-${month}-${day}`
        } else return ""
    }

    //   let startDt = getDateFormart_yyyymmdd(tableRow?.startDt) 
    //   let endDt = getDateFormart_yyyymmdd(tableRow?.endDt) 


    const [isInvalidRange, setIsInvalidRange] = useState(false); // New state variable   
    const getFormateYYYY_mm_dd = (mmddyyyy) => {
        return mmddyyyy.slice(6, 11) + "-" + mmddyyyy.slice(3, 5) + "-" + mmddyyyy.slice(0, 3)
    }

    //   useEffect(() => {
    //     console.log("oooo",tableRow?.startDt , tableRow?.endDt);
    //     if (tableRow?.startDt && tableRow?.endDt ) {

    //           let start = new Date(getFormateYYYY_mm_dd(tableRow?.startDt)).getTime();
    //           let end = new Date(getFormateYYYY_mm_dd(tableRow?.endDt)).getTime();

    //           if(start <= end){
    //            console.log("Date is OK");
    //            setIsInvalidRange(false)
    //           }else{
    //             //alert("START date must be lesser than END date")
    //             setIsInvalidRange(true)
    //           }
    //     } 
    //   }, [tableRow?.startDt, tableRow?.endDt]);

    const checkDt = (obj, index) => {
        console.log("oooobbbbjjj", obj);
        if (!obj.startDt || !obj.endDt) return;
        
        if (obj.startDt <= obj.endDt) {
            console.log("Date is OK");
            setIsInvalidRange(false);
            const updatedRows = [...tableRow];
            updatedRows[index] = {
                ...updatedRows[index],
                errors: {
                    ...updatedRows[index].errors,
                    endDt: ""
                },
            };
            setTableRow(updatedRows);
        } else {
            console.log("Date is not OK");
            setIsInvalidRange(true);
            // You might want to update the error state for endDt here as well
            const updatedRows = [...tableRow];
            updatedRows[index] = {
                ...updatedRows[index],
                errors: {
                    ...updatedRows[index].errors,
                    endDt: "End Date must be greater than Start Date"
                },
            };
            setTableRow(updatedRows);
        }
    };
    



    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            startDt: '',
            endDt: '',
            yearCd: "",
            actFlg: "A",
            errors: {
                startDt: '',
                endDt: '',
                yearCd: "",
                actFlg: "",
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.yearCd || !row.startDt || !row.endDt || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    yearCd: !row.yearCd ? "Please fill in this field." : '',
                    startDt: !row.startDt ? "Please fill in this field." : '',
                    endDt: !row.endDt ? "Please fill in this field." : '',
                    actFlg: !row.actFlg ? "Please select a value." : '',
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        }
        else if (isInvalidRange) {
            console.log(isInvalidRange);
            const updatedRows = tableRow
            updatedRows[updatedRows.length - 1] = {
                ...updatedRows[updatedRows.length - 1],
                errors: {
                    ...updatedRows[updatedRows.length - 1].errors,
                    endDt: "Please insert valid range"
                },
            };
            setTableRow(updatedRows);
            console.log(tableRow);
        }
        else {
            console.log(isInvalidRange);
            setTableRow((prevRows) => [
                ...prevRows,
                {
                    startDt: '',
                    endDt: '',
                    yearCd: "",
                    actFlg: "A",
                    errors: {
                        startDt: '',
                        endDt: '',
                        yearCd: "",
                        actFlg: "",
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
        // setIsInvalidRange(false)

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
        // let rowsCharCount = charCount
        // rowsCharCount[index] = {
        //    isTyping: true
        // }
        // setCharCount([...rowsCharCount])
        if (name === 'startDt' || name === 'endDt') checkDt(tableRow[index], index)
        console.log(tableRow);
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
                startDt: '',
                endDt: '',
                yearCd: "",
                actFlg: "A",
                errors: {
                    startDt: '',
                    endDt: '',
                    yearCd: "",
                    actFlg: "",
                }
            },]
        )

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        if (tableRow.find((item) => item.errors.endDt !== "")) {
            alert("please insert valid date range")
            return
        }
        let body = {
            apiId: "SUA00292",
            mst: tableRow.map((row) => ({
                actFlg: row.actFlg,
                startDt: row.startDt,
                endDt: row.endDt,
                yearCode: row.yearCd

            }))
        }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00023/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc ?
                res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : "");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({ status: res.data?.appMsgList?.errorStatus });
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000011") {
                resetForm();
            }
        })
    }

    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
        set_viewMsg(false)
    
    }, [viewMsg])

    if (openData?.appMsgList?.errorStatus === true) {
        return null;
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendar Year - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            SUF00023_03
                        </Breadcrumb.Item>
                    </Breadcrumb>

                </div>
                <div className="ms-auto pageheader-btn">

                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/SUF00023_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Calendar Year List
                    </Link>

                </div>
            </div>
            {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}

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
                                                        <th> Year<span className="text-red">*</span></th>
                                                        <th> Start Date<span className="text-red">*</span></th>
                                                        <th> End Date<span className="text-red">*</span></th>
                                                        <th> Status<span className="text-red">*</span></th>

                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableRow.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>



                                                            <td>
                                                                <input

                                                                    className="table-input border"
                                                                    type="number"
                                                                    name="yearCd"
                                                                    value={row.yearCd}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // disabled
                                                                    required
                                                                />

                                                                {row.errors.yearCd && (
                                                                    <div className="error-message text-red text-center">{row.errors.yearCd}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="col-md-12 input-group">

                                                                    <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        id=""
                                                                        name="startDt"
                                                                        value={row.startDt}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required

                                                                    />
                                                                    {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                </div>
                                                                {/* {isInvalidRange && row.endDt && !row.startDt && ( // Displaying an error message if the range is invalid
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-9 text-red">
                  First update the Start Date!!
                </div>
              </div>
            )} */}
                                                                {row.errors.startDt && (
                                                                    <div className="error-message text-red text-center">{row.errors.startDt}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="col-md-12 input-group">

                                                                    <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        id=""
                                                                        name="endDt"
                                                                        value={row.endDt}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required

                                                                    />
                                                                    {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                </div>
                                                                {(row.startDt && row.endDt && row.startDt >= row.endDt && !tableRow[index].errors.endDt) && ( // Displaying an error message if the range is invalid
                                                                    <div className="row">
                                                                        <div className="col-md-2"></div>
                                                                        <div className="col-md-9 text-red">
                                                                            End Date cannot be less than Start Date
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {row.errors.endDt && (
                                                                    <div className="error-message text-red text-center">{row.errors.endDt}</div>
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


                                                                    {openData?.content?.mst?.ddActFlg?.map((item) => (
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
        </>
    )
}
export default CalYrMulForm;