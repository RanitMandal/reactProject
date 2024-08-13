import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from 'axios';
import { getApiToken } from "../../common/common"
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
import { cellLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const SubCellMstForm = () => {
    let lvlRefCd = sessionStorage.getItem("lvlRefCd");
    console.log(lvlRefCd);

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
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
                set_errExp({ status: res.data?.appMsgList?.errorStatus })
            })
        }

        fetchOpenData()

    }, [])

    const [errDeffLovData, setErrDeffLovData] = useState([]);
    useEffect(() => {

        const fetchErrDeffLovData = async () => {
            let obj = {
                apiId: 'MGA00010'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/MGF00007/getAllCellMst", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setErrDeffLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchErrDeffLovData();
    }, []);




    const getCellId = (obj) => {
        return errDeffLovData[Number(Object.keys(obj)[0])]?.cellId
    }

    const getCellNm = (obj) => {
        return errDeffLovData[Number(Object.keys(obj)[0])]?.cellDesc
    }

    const [selectRow, setSelectRow] = useState("");
    const [selectRowErrDeffLov, setSelectRowErrDeffLov] = useState("");
    const [showModelErrDeffLov, setShowModuleLov] = useState(false);
    const handleRowClickErrDeffLov = (rowData) => {
        setSelectRow(rowData);
        setSelectRowErrDeffLov(rowData);

    };
    //State Lov ends   

    // Table
    const [charCount, setCharCount] = useState([{

        isTyping: false
    }])
    const [tableRow, setTableRow] = useState([
        {
            distCd: '',
            distNm: '',
            actFlg: 'A',
            errors: {
                distCd: '',
                distNm: '',
                actFlg: '',
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.subCellAbvr || !row.subCellDesc);

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    subCellAbvr: !row.subCellAbvr ? "Please fill in this field." : '',
                    subCellDesc: !row.subCellDesc ? "Please fill in this field" : '',
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        } else {
            setTableRow((prevRows) => [
                ...prevRows,
                {

                    subCellDesc: '',
                    subCellAbvr: '',
                    errors: {

                        subCellAbvr: '',
                        subCellDesc: '',
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

    const removetableRow = (e, index) => {
        let rows = tableRow
        rows.splice(index, 1)
        setTableRow([...rows])
        let rowsCharCount = charCount
        rowsCharCount.splice(index, 1)
        setCharCount([...rowsCharCount])
    };



    const resetForm = () => {
        setSelectRowErrDeffLov("")
        setTableRow(
            [
                {
                    cellId: '',
                    subCellAbvr: '',
                    subCellDesc: '',
                    errors: {
                        cellId: '',
                        subCellAbvr: '',
                        subCellDesc: '',
                    }
                },
            ]
        )

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        const body = {
            apiId: "MGA00007",
            mst:
                tableRow.map((row) => ({
                    subCellAbvr: row.subCellAbvr,
                    subCellDesc: row.subCellDesc,
                    cellId: getCellId(selectRowErrDeffLov),
                    lvlRefCd: sessionStorage ? sessionStorage.lvlRefCd : '',
                }))

        };

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00007/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
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
                    <h1 className="page-title">Subcell Master - Multiple Add</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    Add Multiple
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    MGF00007_03
                                </a>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto pageheader-btn">
                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/MGF00007_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Subcell Master List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}><MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
            <Row>

                <Card>
                    <Card.Body>
                        <Row>

                            <form onSubmit={finalSubmit}>
                                <div className="row mb-2 mx-2 ">
                                    <label className="col-sm-3 col-form-label"><b>Cell:<span className="text-red">*</span></b></label>
                                    <div className="col-md-9">
                                        <div className="input-group">
                                            <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModuleLov(true)} /></span>

                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control"
                                                value={getCellId(selectRowErrDeffLov) ? getCellId(selectRowErrDeffLov) : ''}
                                            />
                                            <input
                                                type="text"
                                                autoComplete={false}
                                                className="form-control mx-4"
                                                required
                                                value={getCellNm(selectRowErrDeffLov) ? getCellNm(selectRowErrDeffLov) : ''}
                                            />
                                            <div className="row-mb-12">
                                                {showModelErrDeffLov && <Lov
                                                    moduleLovData={errDeffLovData}
                                                    setShowModel={setShowModuleLov}
                                                    showModel={showModelErrDeffLov}
                                                    handleRowClick={handleRowClickErrDeffLov}
                                                    columns={cellLovColumns}
                                                    currentSelection={selectRow}
                                                    setCurrentSelection={setSelectRow}
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
                                                    <th> SUbcell Description <span className="text-red">*</span></th>
                                                    <th>Sub Cell Abbreviation<span className="text-red">*</span></th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableRow.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.subCellDesc}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="subCellDesc"
                                                                    required
                                                                    maxLength={50} onFocus={() => toggleCharCountVisibility("subCellDesc")}
                                                                    onBlur={() => toggleCharCountVisibility("subCellDesc")}

                                                                /> {fieldCharCountVisibility.subCellDesc && (
                                                                    <span className="input-group-text">
                                                                        {row?.subCellDesc?.length}/50
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {row?.errors?.subCellDesc && (
                                                                <div className="error-message text-red text-center">{row?.errors?.subCellDesc}</div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="col-md-12 input-group">
                                                                <input
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    // onBlur={(e) => handleCharCount(e, index)}
                                                                    value={row.subCellAbvr}
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="subCellAbvr"
                                                                    required
                                                                    maxLength={5} onFocus={() => toggleCharCountVisibility("subCellAbvr")}
                                                                    onBlur={() => toggleCharCountVisibility("subCellAbvr")}

                                                                /> {fieldCharCountVisibility.subCellAbvr && (
                                                                    <span className="input-group-text">
                                                                        {row?.subCellAbvr?.length}/5
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {row?.errors?.subCellAbvr && (
                                                                <div className="error-message text-red text-center">{row?.errors?.subCellAbvr}</div>
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
export default SubCellMstForm;