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
const FycForm = () => {
    const [isInvalidRange, setIsInvalidRange] = useState(false);
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
                apiId: "SUA00303"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content.mst);
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
            // finYrCd: '',
            startDt:"",
            endDt:"",
            actFlg: 'A',
            errors: {
                // finYrCd: '',
                startDt:"",
                endDt:"",
                actFlg: ''
            }
        },
    ]);

    const checkDt = (obj, index)=>{
        console.log("ooobbbbjjjjj",obj);
        if(!obj.startDt || !obj.endDt) return
        // let start = new Date(getFormateYYYY_mm_dd(obj?.startDt)).getTime();
        // let end = new Date(getFormateYYYY_mm_dd(obj?.endDt)).getTime();
        //  console.log(obj.startDt <= obj.endDt, start,end);   
        if(obj.startDt <= obj.endDt){
            console.log("Date is OK");
            setIsInvalidRange(false)
            const updatedRows = tableRow
                updatedRows[index] = {
                    ...updatedRows[index] ,
                    errors: {
                        ...updatedRows[index].errors,
                        endDt: ""
                    },
                };
                setTableRow(updatedRows);
        }else{
            console.log("Date is not OK")
            setIsInvalidRange(true)
        }
        console.log("enter");
      
    }

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) =>  !row.startDt || !row.endDt|| !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    // finYrCd: !row.finYrCd ? "Please fill in this field." : '',
                    startDt: !row.startDt ? "Please fill in this field." : '',
                    endDt: !row.endDt ? "Please fill in this field." : '',
                    actFlg: !row.actFlg ? "Please select a value." : '',
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        } else if(isInvalidRange){
            console.log(isInvalidRange);
            const updatedRows = tableRow
            updatedRows[updatedRows.length-1] = {
                ...updatedRows[updatedRows.length-1] ,
                errors: {
                    ...updatedRows[updatedRows.length-1].errors,
                    endDt: "Please insert valid range"
                },
            };
            setTableRow(updatedRows);
            console.log("ppppp", tableRow);
        }
         else {
            console.log(isInvalidRange);
            setTableRow((prevRows) => [
                ...prevRows,
                {
                    // finYrCd: '',
                    startDt:"",
                    endDt:"",
                    actFlg: 'A',
                    errors: {
                        // finYrCd: '',
                        startDt:"",
                        endDt:"",
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
        //     isTyping: true
        // }
        // setCharCount([...rowsCharCount])
        if(name === 'startDt' || name === 'endDt') checkDt(tableRow[index], index)
        console.log(tableRow);
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
        setMsg("")
        setMsgTyp("")
        setTableRow([
            {
                // finYrCd: '',
                startDt:"",
                endDt:"",
                actFlg: 'A',
                errors: {
                    // finYrCd: '',
                    startDt:"",
                    endDt:"",
                    actFlg: ''
                }
            },
        ])

    };
    const resetForm1 = () => {
        // setMsg("")
        // setMsgTyp("")
        setTableRow([
            {
                // finYrCd: '',
                startDt:"",
                endDt:"",
                actFlg: 'A',
                errors: {
                    // finYrCd: '',
                    startDt:"",
                    endDt:"",
                    actFlg: ''
                }
            },
        ])

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        if(tableRow.find((item)=> item.errors.endDt !== "")){
            alert("please insert valid date range")
            return
        }
        let body = {
            apiId: "SUA00304",
            mst: tableRow.map((row) => ({
                actFlg: row.actFlg,
                startDt: row.startDt,
                endDt: row.endDt,
                
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00012/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                resetForm1();
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
        return null; // Don't render the component
    }

    return (
        <div openData={openData}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Financial Year - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            SUF00012_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00012_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Financial Year List
                    </Link>

                </div>
            </div>
            {msg && <div msgRef={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div> }
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
                                                        {/* <th> Financial Year</th> */}
                                                        <th> Start Date <span className="text-red">*</span></th>
                                                        <th> End Date<span className="text-red">*</span></th>
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
                                                                        value={row.startDt}
                                                                        className="form-control"
                                                                        type="date"
                                                                        name="startDt"
                                                                        required
                                                                        maxLength={50}

                                                                    />
                                                                    {/* {charCount[index].isTyping && <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                    {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                                                                </div>
                                                                {row.errors.startDt && (
                                                                    <div className="error-message text-red text-center">{row.errors.startDt}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="col-md-12 input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => handleCharCount(e, index)}
                                                                        value={row.endDt}
                                                                        className="form-control"
                                                                        type="date"
                                                                        name="endDt"
                                                                        required
                                                                        maxLength={50}

                                                                    />
                                                                    {/* {charCount[index].isTyping && <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
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
export default FycForm;