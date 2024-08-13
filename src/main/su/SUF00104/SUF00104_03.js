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
import { userLovColumns, divLovColumns, subDivLovColumns, } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const SubDivMapForm = () => {
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
                apiId: "SUA00202"
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/openAddForm', obj, { headers }).then((res) => {
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
            lvlRefCd:"",
            lvlNm:"",
            subLvlRefCd: "",
            subLvlRefNm: "",
            userId: "",
            userNm: "",
            errors: {
                subLvlRefCd: "",
                subLvlRefNm: "",
                userId: "",
                userNm: "",
            }
        },
    ]);

    const addtableRow = () => {
        const hasBlankFields = tableRow.some((row) => !row.subLvlRefCd || !row.subLvlRefCd || !row.userId || !row.userNm );

        if (hasBlankFields) {

            const updatedRows = tableRow.map((row) => ({
                ...row,
                errors: {
                    subLvlRefCd: !row.subLvlRefCd ? "Please fill in this field." : '',
                    subLvlRefNm: !row.subLvlRefNm ? "Please fill in this field." : '',
                    userId: !row.userId ? "Please select a value." : '',
                    userNm: !row.userNm ? "Please select a value." : '',
                },
            }));

            setTableRow(updatedRows);

            // You can also show a global error message if needed
            // alert("Please fill in all fields for each row before adding a new row.");
        } else {
            setTableRow((prevRows) => [
                ...prevRows,
                {
                    lvlRefCd:getDivId(selectRowDivLov),
                    lvlNm:getDivNm(selectRowDivLov),
                    subLvlRefCd: "",
                    subLvlRefNm: "",
                    userId: "",
                    userNm: "",
                    errors: {
                        subLvlRefCd: "",
                        subLvlRefNm: "",
                        userId: "",
                        userNm: "",
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

    const removetableRow = (e, index) => {
        let rows = tableRow
        rows.splice(index, 1)
        setTableRow([...rows])
        let rowsCharCount = charCount
        rowsCharCount.splice(index, 1)
        setCharCount([...rowsCharCount])
    };

    //division Lov Starts     

    const [divLovData, setDivLovData] = useState([]);
    useEffect(() => {

        const fetchDivLovData = async () => {
            let obj = {
                apiId: 'SUA00357'
            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00104/getAllDivision", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

                });
        };
        fetchDivLovData();
    }, []);


    const getDivNm = (obj) => {
        return divLovData[Number(Object.keys(obj)[0])]?.lvlNm ? divLovData[Number(Object.keys(obj)[0])]?.lvlNm : ""
    }

    const getDivId = (obj) => {
        return divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ?  divLovData[Number(Object.keys(obj)[0])]?.lvlRefCd : ""
    }
    const [rowIndex, setRowIndex] = useState(0);
    const [selectRow, setSelectRow] = useState("");
    const [selectRowDivLov, setSelectRowDivLov] = useState("");
    const [showModelDivLov, setShowModelDivLov] = useState(false);
    const handleRowClickDivLov = (rowData) => {
        setSelectRow(rowData);
        setSelectRowDivLov(rowData);
        setTableRow([{...tableRow,
        lvlRefCd:getDivId(rowData),
        lvlNm:getDivNm(rowData),
        errors:{
            ...tableRow.errors
        }
        }])

        // let rows = tableRow
        // rows[rowIndex] = {
        //     ...rows[rowIndex],
        //     lvlRefCd: getDivId(rowData),
        //     lvlRefNm: getDivNm(rowData),
        //     errors: {
        //         ...rows[rowIndex].errors,
        //         lvlRefCd: "",
        //         lvlRefNm: ''
        //     }
        // }
        // console.log(rows);
        // setTableRow([...rows])
        // setQueryInputObj({
        //     ...queryInputObj,
        //     criteria: {
        //         ...queryInputObj.criteria,
        //         errCd: getErrDeffId(rowData)
        //     }
        // });

    };
    console.log(tableRow);
    //Division Lov ends  

    //Sub-Division Lov Starts
    const [subDivObj, set_subDivObj] = useState({})
    useEffect(() => {
        set_subDivObj({
            apiId: "SUA00358",
            criteria: {
                lvlRefCd:  getDivId(selectRow)
            }
        })
    }, [selectRow])

    const [subDivLovData, setSubDivLovData] = useState([]);
    useEffect(() => {

        const fetchSubDivLovData = async () => {

            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00104/getAllSubDivision", subDivObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setSubDivLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        subDivObj && fetchSubDivLovData();
    }, [subDivObj]);


    const getSubDivNm = (obj) => {
        return subDivLovData[Number(Object.keys(obj)[0])]?.lvlNm ? subDivLovData[Number(Object.keys(obj)[0])]?.lvlNm : ""
    }

    const getSubDivCd = (obj) => {
        return subDivLovData[Number(Object.keys(obj)[0])]?.lvlRefCd ? subDivLovData[Number(Object.keys(obj)[0])]?.lvlRefCd : ""
    }
    const openSubDiv = (index) => {
        setRowIndex(index)
        setSelectRowSubDivLov({})
        console.log(rowIndex);
    }

    const [selectRowSubDiv, setSelectRowSubDiv] = useState("");
    const [selectRowSubDivLov, setSelectRowSubDivLov] = useState("");
    const [showModelSubDivLov, setShowModelSubDivLov] = useState(false);
    const handleRowClickSubDivLov = (rowData) => {
        console.log(rowData)
        setSelectRowSubDiv(rowData);
        setSelectRowSubDivLov(rowData);
        let rows = tableRow
        rows[rowIndex] = {
            ...rows[rowIndex],
            subLvlRefCd: getSubDivCd(rowData),
            subLvlRefNm: getSubDivNm(rowData),
            errors: {
                ...rows[rowIndex].errors,
                subLvlRefCd: "",
                subLvlRefNm: ''
            }
        }
        console.log(rows);
        setTableRow([...rows])
    };
    //Sub-Division Lov ends 

    //User Lov Starts     

    const [userLovData, setUserLovData] = useState([]);
    useEffect(() => {

        const fetchUserLovData = async () => {
            let obj = {
                apiId: "SUA00359",

            }
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00104/getAllUsers", obj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    // setMsg(res?.data?.appMsgList?.list[0]?.errDesc
                    //     +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                    //    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);

                });
        };
        fetchUserLovData();
    }, []);


    const getUserNm = (obj) => {
        return userLovData[Number(Object.keys(obj)[0])]?.userNm ? userLovData[Number(Object.keys(obj)[0])]?.userNm : ""
    }

    const getUserCd = (obj) => {
        return userLovData[Number(Object.keys(obj)[0])]?.userId ? userLovData[Number(Object.keys(obj)[0])]?.userId : ""
    }
     const openUser = (index) => {
        setRowIndex(index)
        setSelectRowUserLov({})
        console.log(rowIndex);
    }

    const [selectRowUser, setSelectRowUser] = useState("");
    const [selectRowUserLov, setSelectRowUserLov] = useState("");
    const [showModelUserLov, setShowModelUserLov] = useState(false);
    const handleRowClickUserLov = (rowData) => {
        console.log(rowData)
        setSelectRowUser(rowData);
        setSelectRowUserLov(rowData);
        let rows = tableRow
        rows[rowIndex] = {
            ...rows[rowIndex],
            userId: getUserCd(rowData),
            userNm: getUserNm(rowData),
            errors: {
                ...rows[rowIndex].errors,
                userId: "",
                userNm: ''
            }
        }
        console.log(rows);
        setTableRow([...rows])
    };
    //Sub-Division Lov ends 






   





    const resetForm = () => {
        setMsg("")
        setMsgTyp("")
        setSelectRowDivLov({})
        setTableRow([
            {
                lvlRefCd:"",
                lvlNm:"",
                subLvlRefCd: "",
                subLvlRefNm: "",
                userId: "",
                userNm: "",
                errors: {
                    subLvlRefCd: "",
                    subLvlRefNm: "",
                    userId: "",
                    userNm: "",
                }
            },
        ])

    };
    const resetForm1 = () => {
        // setMsg("")
        // setMsgTyp("")
        setSelectRowDivLov({})
        setTableRow([
            {
                lvlRefCd:"",
                lvlNm:"",
                subLvlRefCd: "",
                subLvlRefNm: "",
                userId: "",
                userNm: "",
                errors: {
                    
                    subLvlRefCd: "",
                    subLvlRefNm: "",
                    userId: "",
                    userNm: "",
                }
            },
        ])

    };

    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId: "SUA00356",
            mst: tableRow.map((row) => ({
                lvlRefCd: row.lvlRefCd,
                subLvlRefCd: row.subLvlRefCd,
                userId: row.userId
            })),
        }

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00104/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
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
        if(viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth"});
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
                    <h1 className="page-title">Division SubDivision User Mapping - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item className="breadcrumb-item" href="#">
                            Add Multiple
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            SUF00104_03
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
                        to={`${process.env.PUBLIC_URL}/SUF00104_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        Division SubDivision User Mapping List
                    </Link>

                </div>
            </div>
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div> }
            <Row>
                <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                    <Card>
                        <Card.Body>
                            <Row>
                                <div className="col-lg-12 col-md-12">

                                    <form onSubmit={finalSubmit}>
                                        <div className="row mb-3 mx-2">
                                            <label className="col-sm-3 col-form-label"><b>Division:<span className="text-red">*</span></b></label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelDivLov(true)} /></span>

                                                    <input
                                                        type="text"
                                                        autoComplete={false}

                                                        className="form-control col-md-2 rouned"
                                                        // readOnly
                                                        required
                                                        value={getDivId(selectRowDivLov) ? getDivId(selectRowDivLov) : ''}
                                                    />
                                                    <input
                                                        type="text"
                                                        autoComplete={false}
                                                        className="form-control mx-4"
                                                        required
                                                        value={getDivNm(selectRowDivLov) ? getDivNm(selectRowDivLov) : ''}
                                                    />
                                                    <div className="row-mb-12">
                                                        {showModelDivLov && <Lov
                                                            moduleLovData={divLovData}
                                                            setShowModel={setShowModelDivLov}
                                                            showModel={showModelDivLov}
                                                            handleRowClick={handleRowClickDivLov}
                                                            columns={divLovColumns}
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
                                                            {/* <th> Id</th> */}
                                                            {/* <th> Code<span className="text-red">*</span></th> */}
                                                            <th></th>
                                                            <th>SubDivision Code<span className="text-red">*</span></th>
                                                            <th>SubDivision Name<span className="text-red">*</span></th>
                                                            <th></th>
                                                            <th>User Id<span className="text-red">*</span></th>
                                                            <th>User Name<span className="text-red">*</span></th>

                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableRow.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>



                                                                <td>
                                                                    <span className="table-input  border-primary">
                                                                        <i className="fa fa-search d-inline" title="" onClick={() => {
                                                                            setShowModelSubDivLov(true);
                                                                            openSubDiv(index);
                                                                        }} />
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        autoComplete={false}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        className="form-control"
                                                                        // readOnly
                                                                        required
                                                                        value={row.subLvlRefCd}
                                                                    />
                                                                    {row.errors.subLvlRefCd && (
                                                                        <div className="error-message text-red text-center">{row.errors.subLvlRefCd}</div>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {/* Error Deffintion */}


                                                                    <input
                                                                        type="text"
                                                                        autoComplete={false}
                                                                        className="form-control"
                                                                        required
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        value={row.subLvlRefNm}
                                                                    />
                                                                    {row.errors.subLvlRefNm && (
                                                                        <div className="error-message text-red text-center">{row.errors.subLvlRefCd}</div>
                                                                    )}
                                                                    <div className="row-mb-12">
                                                                        {showModelSubDivLov && <Lov
                                                                            moduleLovData={subDivLovData}
                                                                            setShowModel={setShowModelSubDivLov}
                                                                            showModel={showModelSubDivLov}
                                                                            handleRowClick={handleRowClickSubDivLov}
                                                                            columns={subDivLovColumns}
                                                                            currentSelection={selectRowSubDivLov}
                                                                            setCurrentSelection={setSelectRowSubDivLov}
                                                                        />}
                                                                    </div>

                                                                </td>
                                                                <td>
                                                                    <i className="fa fa-search d-inline" title="" onClick={() => {
                                                                            setShowModelUserLov(true);
                                                                            openUser(index);
                                                                        }} />
                                                                </td>
                                                                <td>
                                                                    <div className="col-md-12  input-group">
                                                                        <input
                                                                            type="text"
                                                                            autoComplete={false}
                                                                            onChange={(e) => handleInputChange(e, index)}
                                                                            className="form-control"
                                                                            // readOnly
                                                                            required
                                                                            value={row.userId}
                                                                        />
                                                                        {/* {charCount[index].isTyping && <span className="input-group-text">{row?.errDesc?.length}/300</span>} */}
                                                                        {/* {row.stateNm === "" ? <span className="input-group-text d-none">{row.stateNm.length}/50</span> : <span className="input-group-text">{row.stateNm.length}/50</span>} */}
                                                                    </div>
                                                                    {row?.errors?.userId && (
                                                                        <div className="error-message text-red text-center">{row?.errors?.userId}</div>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        autoComplete={false}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        className="form-control"
                                                                        required
                                                                        value={row.userNm}
                                                                    />
                                                                    <div className="row-mb-12">
                                                                        {showModelUserLov && <Lov
                                                                            moduleLovData={userLovData}
                                                                            setShowModel={setShowModelUserLov}
                                                                            showModel={showModelUserLov}
                                                                            handleRowClick={handleRowClickUserLov}
                                                                            columns={userLovColumns}
                                                                            currentSelection={selectRowUserLov}
                                                                            setCurrentSelection={setSelectRowUserLov}
                                                                        />}
                                                                        {row?.errors?.userNm && (
                                                                        <div className="error-message text-red text-center">{row?.errors?.userNm}</div>
                                                                    )}
                                                                    </div>
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

                                </div>
                            </Row>
                        </Card.Body>
                    </Card>

                </div>
            </Row>
        </div>
    )
}
export default SubDivMapForm;