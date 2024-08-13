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
import { userLovColumns } from "./columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ExternalUserTypeMasterMulForm = () => {
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
                apiId: "SUA00621"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/openAddForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data.content.mst);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc ? res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")" : '')
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
            modNm: '',
            modId: "",
            errDesc: "",
            errType: "",
            actFlg: 'A',
            errors: {
                modNm: "",
                modId: "",
                errDesc: "",
                errType: "",
                actFlg: ''
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.userNm || !row.userId || !row.extUserTypDesc || !row.extModPrefix || !row.actFlg);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    userNm: !row.userNm ? "Please fill in this field." : '',
                    userId: !row.userId ? "Please fill in this field." : '',
                    extUserTypDesc: !row.extUserTypDesc ? "Please fill in this field." : '',
                    extModPrefix: !row.extModPrefix ? "Please fill in this field." : '',
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
                    userNm: '',
                    userId: '',
                    extUserTypDesc: "",
                    extModPrefix: "",
                    actFlg: 'A',
                    errors: {
                        userNm: "",
                        userId: '',
                        extUserTypDesc: "",
                        extModPrefix: "",
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
        errDesc: false,

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

    //User Lov Starts     

    const [userLovData, setUserLovData] = useState([]);
    useEffect(() => {

        const fetchModLovData = async () => {
            let obj = {
                apiId: 'SUA00628'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00149/getAllUser", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchModLovData();
    }, []);


    const getUserNm = (obj) => {
        return userLovData[Number(Object.keys(obj)[0])]?.userNm
    }

    const getUserId = (obj) => {
        return userLovData[Number(Object.keys(obj)[0])]?.userId
    }
    const [rowIndex, setRowIndex] = useState(0);
    const [selectRow, setSelectRow] = useState("");
    const [selectRowModLov, setSelectRowModLov] = useState("");
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        setSelectRow(rowData);
        setSelectRowModLov(rowData);

        let rows = tableRow
        rows[rowIndex] = {
            ...rows[rowIndex],
            userId: getUserId(rowData),
            userNm: getUserNm(rowData),
            errors: {
                ...rows[rowIndex].errors,
                userId: "",
                userNm: ''
            }
        }
        console.log(rows);
        setTableRow([...rows])
        // setQueryInputObj({
        //     ...queryInputObj,
        //     criteria: {
        //         ...queryInputObj.criteria,
        //         errCd: getErrDeffId(rowData)
        //     }
        // });

    };
    console.log(tableRow);
    //Err_deff Lov ends   
    const open = (index) => {
        setRowIndex(index)
        setSelectRow({})
        console.log(rowIndex);
    }






    const resetForm = () => {
        setMsg("")
        setMsgTyp("")
        setTableRow([
            {
                userId: '',
                userNm: '',
                extUserTypDesc: '',
                extModPrefix: '',
                actFlg: 'A',
                errors: {
                    userId: '',
                    userNm: '',
                    extUserTypDesc: '',
                    extModPrefix: '',
                    actFlg: ''
                }
            }
        ])

    };
    const resetForm1 = () => {
        // setMsg("")
        // setMsgTyp("")
        setTableRow([
            {
                userId: '',
                userNm: '',
                extUserTypDesc: '',
                extModPrefix: '',
                actFlg: 'A',
                errors: {
                    userId: '',
                    userNm: '',
                    extUserTypDesc: '',
                    extModPrefix: '',
                    actFlg: ''
                }
            }
        ])

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId: "SUA00622",
            mst: tableRow.map((row) => ({
                actFlg: row.actFlg,
                extUserTypDesc: row.extUserTypDesc,
                extModPrefix: row.extModPrefix,
                userId: row.userId
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00149/saveAdd', body, { headers }).then((res) => {
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
                    <h1 className="page-title">External User Type Master - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            SUF00149_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00149_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        External User Type Master List
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
                                                        <th className="sno">Row#</th>
                                                        {/* <th> Id</th> */}
                                                        {/* <th> Code<span className="text-red">*</span></th> */}
                                                        <th></th>
                                                        <th>User Id<span className="text-red">*</span></th>
                                                        <th>User Name<span className="text-red">*</span></th>
                                                        <th>Description<span className="text-red">*</span></th>
                                                        <th>MOd Prefix<span className="text-red">*</span></th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableRow.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <span className="table-input  border-primary">
                                                                    <i
                                                                        className="fa fa-search"
                                                                        title=""
                                                                        onClick={() => {
                                                                            setShowModelModLov(true);
                                                                            open(index);
                                                                        }}

                                                                    ></i>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                                                    value={row.userId}
                                                                    required
                                                                    readOnly
                                                                />
                                                                {row.errors.userId && (
                                                                    <div className="error-message text-red text-center">{row.errors.userId}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {/* Error Deffintion */}


                                                                <input
                                                                    type="text"
                                                                    autoComplete={false}
                                                                    className="form-control mx-4"
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // value={getModNm(selectRowModLov) ? getModNm(selectRowModLov) : ''}
                                                                    value={row.userNm}
                                                                    required
                                                                    readOnly

                                                                />
                                                                {row.errors.userNm && (
                                                                    <div className="error-message text-red text-center">{row.errors.userNm}</div>
                                                                )}
                                                                <div className="row-mb-12">
                                                                    {showModelModLov && <Lov
                                                                        moduleLovData={userLovData}
                                                                        setShowModel={setShowModelModLov}
                                                                        showModel={showModelModLov}
                                                                        handleRowClick={handleRowClickModLov}
                                                                        columns={userLovColumns}
                                                                        currentSelection={selectRow}
                                                                        setCurrentSelection={setSelectRow}
                                                                    />}
                                                                </div>

                                                            </td>

                                                            <td>
                                                                <div className="col-md-12  input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => { handleCharCount(e, index) }}
                                                                        value={row?.extUserTypDesc}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="extUserTypDesc"
                                                                        required
                                                                        maxLength={300}
                                                                    // onFocus={() => toggleCharCountVisibility("errDesc")}
                                                                    // onBlur={() => }

                                                                    />
                                                                    {/* {fieldCharCountVisibility.errDesc && (
              <span className="input-group-text">
                {formData?.errDesc?.length}/300
              </span>
            )} */}
                                                                    {charCount[index].isTyping && <span className="input-group-text">{row?.extUserTypDesc?.length}/300</span>}
                                                                    {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                                </div>
                                                                {row?.errors?.extUserTypDesc && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.extUserTypDesc}</div>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div className="col-md-12  input-group">
                                                                    <input
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        onBlur={(e) => { handleCharCount(e, index) }}
                                                                        value={row?.extModPrefix}
                                                                        className="form-control"
                                                                        type="text"
                                                                        name="extModPrefix"
                                                                        required
                                                                        maxLength={300}
                                                                    // onFocus={() => toggleCharCountVisibility("errDesc")}
                                                                    // onBlur={() => }

                                                                    />
                                                                    {/* {fieldCharCountVisibility.errDesc && (
              <span className="input-group-text">
                {formData?.errDesc?.length}/300
              </span>
            )} */}
                                                                    {charCount[index].isTyping && <span className="input-group-text">{row?.extModPrefix?.length}/300</span>}
                                                                    {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                                </div>
                                                                {row?.errors?.extModPrefix && (
                                                                    <div className="error-message text-red text-center">{row?.errors?.extModPrefix}</div>
                                                                )}
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
export default ExternalUserTypeMasterMulForm;