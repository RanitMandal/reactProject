import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import FavLink from "../../common/FavLink"
import Lov from "../../common/Lov _new";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
    fileLovColumns

} from "./columns";
import { getApiToken } from "../../common/common";
import moment from "moment/moment";
import { getScplAdContext } from "../../common/common";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };

const GenerateMemoNumber = () => {

    let lvlRefCd = sessionStorage.getItem("lvlRefCd")
    const userId = getScplAdContext().userId;
    console.log(lvlRefCd);
    console.log(userId);
    // console.log(edtVal?.mst?.dtl);
    // console.log(addVal);

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate);
    const [error, setError] = useState("");
    const [error1, setError1] = useState("");

    //Form open api calling

    const [msg, setMsg] = useState("");
    const [msgTyp, setMsgTyp] = useState("");
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [data, setData] = useState({});

    const [openData, setOpenData] = useState("");
    let openFormObj = {
        apiId: "SUA00010",
    };

    const [showPage, setShowPage] = useState({});
    let openForm_post_obj = {
        apiId: 'MGA00043',
    }
    useEffect(() => {
        const openFrom = async () => {
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/MGF00002/openAddForm", openForm_post_obj, { headers })
                .then(
                    (res) => {
                        setShowPage(res.data?.content)
                        console.log(showPage);
                        setMsg(
                            res.data?.appMsgList?.list[0]?.errDesc
                                ? res.data?.appMsgList?.list[0]?.errDesc +
                                ' (' +
                                res.data?.appMsgList?.list[0]?.errCd +
                                ')'
                                : ''
                        );

                        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        set_errExp({ status: res.data?.appMsgList?.errorStatus })
                    }

                )
        }
        openFrom();
    }, []);

    //Form open api end

    //File lov Starts
    const updateOpenData = (newOpenData) => {
        setOpenData(newOpenData);
    };
    const [fileLovData, setFileLOvData] = useState({});
    let postStateObj = {
        apiId: "MGA00042",
    };
    useEffect(() => {
        const fetchModuleGrpLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/MGF00002/getAllFileInfo",
                    postStateObj,
                    { headers }
                )
                .then((res) => {
                    console.log(res.data);
                    setFileLOvData(
                        res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                    /*   setMsg(
                        res?.data?.appMsgList?.list[0]?.errDesc +
                          " (" +
                          res?.data?.appMsgList?.list[0]?.errCd +
                          ")"
                      );
                      setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
                });
        };
        fetchModuleGrpLovData();
    }, []);

    const getUserFileNo = (obj) => {
        return fileLovData?.[Number(Object.keys(obj)[0])]?.userFileNo ? fileLovData?.[Number(Object.keys(obj)[0])]?.userFileNo : "";
    };

    const getFileId = (obj) => {
        return fileLovData?.[Number(Object.keys(obj)[0])]?.fileId ? fileLovData?.[Number(Object.keys(obj)[0])]?.fileId : "";
    };

    const [selectRow, setSelectRow] = useState("");
    const [showModelModGrpLov, setShowModelModGrpLov] = useState(false);
    const handleRowClickModGrpLov = (rowData) => {
        setSelectRow(rowData);
        // console.log(getFileId(rowData));
        // console.log(getUserFileNo(rowData));
        setSelectRow({});
        setFormData({
            ...formData,
            fileId: getFileId(rowData),
            userFileNo: getUserFileNo(rowData)
        }

        )
        // console.log(formData);

        // updateOpenData({
        //     ...openData,
        //     fileId: getFileId(rowData),
        //     userFileNo: getUserFileNo(rowData),
        //     distCd: "",
        //     distNm: ""
        // });
        // In the rendering section
        // console.log("Rendering with openData:", openData);
        // console.log(openData?.content?.mst.stateCd)
    };

    //File Lov End
    const [tblErr, set_tblErr] = useState("")

    const addtableRow = () => {

        let list = formData?.dtl
        let obj = list[list.length - 1]


        // set_tblLen(tblLen+1)
        setFormData({
            ...formData,
            dtl: [
                ...list,
                {

                    copyToNm: ""
                }
            ],
        })
        console.log(list.length + 1);


        console.log(tblErr);

    };

    const handleDtlInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = formData.dtl;

        // Clear the error message for the corresponding field
        let currentAct = list[index]?.action
        list[index] = {
            ...list[index],
            [name]: value,
            // action: mode === 1 ? "I" : currentAct === 'I' ? 'I' : 'U'

        };

        setFormData({
            ...formData,
            dtl: list
        });


    };


    const [delArr, set_delArr] = useState([])
    const removetableRow = (e, index) => {
        console.log(formData);
        let list = formData.dtl; // Create a copy of the tableRow array
        let currentAct = list[index].action
        if (currentAct === 'I') list.splice(index, 1)
        else {
            list[index] = {
                ...list[index],
                action: "D"
            };
            set_delArr([...delArr, list[index]])
            list.splice(index, 1)
        }

        // set_tblLen(tblLen-1)
        setFormData({
            ...formData,
            dtl: list,
        });

    };

    const [formData, setFormData] = useState({
        fileId: "",
        finYrCd: '',
        userFileNo: "",
        sysFileNo: "",
        lvlRefCd: "",
        memoIssTo: "",
        memoSubj: "",
        memoTyp: "",
        userId: "",
        yr: 0,

        dtl: [{
            copyToNm: ""
        }]


    });


    const msgRef = useRef(null)
    const [viewMsg, set_viewMsg] = useState(false)
    useEffect(() => {
        if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
        set_viewMsg(false)

    }, [viewMsg])

    //sve api for post form data
    


    function postDataToAPI(event) {
        event.preventDefault();
        openData?.maxLoginAttmpt
            ? setError("")
            : setError("This field is required");
        

        let addObj = {
            apiId: "MGA00046",
            mst: {
                dtl: formData.dtl.map(item => {
                    //   const { apiNm, ...data } = item
                    return {
                        ...item,
                        copyToNm: item.copyToNm

                    }
                }),
                lvlRefCd: lvlRefCd,
                memoIssTo: formData ? formData.memoIssTo : "",
                memoSubj: formData ? formData.memoSubj : "",
                memoTyp: formData ? formData.memoTyp : "G",
                sysFileNo: formData ? formData.fileId : "",
                userFileNo: formData ? formData.userFileNo : "",
                userId: userId,

            },
        };

        axios
            .post(
                process.env.REACT_APP_API_URL_PREFIX + '/MGF00002/saveAdd', addObj, { headers },
                { headers }
            )
            .then((res) => {
                console.log(res.data)
                if (!res?.data?.appMsgList?.errorStatus) {
                    // fetchData()
                }
                // setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                // set_errExp({ status: res.data?.appMsgList?.errorStatus })
                if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
                    resetForm();
                }
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({ status: res.data?.appMsgList?.errorStatus })

            })

            .catch(error => {
                console.log("error")
            }).finally(() => {
                set_viewMsg(true)
            });
    }


    //save api end


    //state Lov ends


    //datepicker functions start
    const [startDate, setStartDate] = useState(null);

    // Function to parse the date string and set it as the initial date
    const parseAndSetInitialDate = (dateString) => {
        if (dateString) {
            const parsedDate = new Date(dateString);
            setStartDate(parsedDate);
        }
    };
    console.log(openData?.instDt);
    useEffect(() => {
        const initialDateString = openData?.instDt;
        if (initialDateString) {
            const parsedDate = new Date(initialDateString);
            if (!isNaN(parsedDate.getTime())) {
                console.log("Initial Date:", parsedDate);
                parseAndSetInitialDate(initialDateString);
            } else {
                console.log("Invalid Date String:", initialDateString);
            }
        } else {
            console.log("Initial Date String is null or undefined");
        }
    }, [openData]);

    //datepicker functions end


    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })

    };

    const handleStatusChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData, [event.target.name]: event.target.value,

        });

    };

    //checkbox function start
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);
    const [isLogoDbFlag, setIsLogoDbFlag] = useState(false);

    useEffect(() => {
        const strongPwdFlg = openData?.strongPwdFlg;
        const logoDbFlag = openData?.logoDbFlag;
        setIsPasswordStrong(strongPwdFlg === "Y" ? true : false);
        setIsLogoDbFlag(logoDbFlag === "Y" ? true : false);
    }, [openData]);




    //handle the value of input field when changes happen

    // const handleInputChange = (event) => {
    //     console.log(`Changing ${event.target.name} to: ${event.target.value}`);
    //     console.log(event.target.name, event.target.value);
    //     if (event.target.name === "phNo" && event.target.value.length > 10) return
    //     if (event.target.name === "pinNo" && event.target.value.length > 6) return
    //     if (event.target.name === "faxNo" && event.target.value.length > 50) return
    //     if (event.target.name === "maxLoginAttmpt" && isNaN(event.target.value)) {
    //         setError("Please enter a valid number for maxLoginAttmpt.");
    //         return;
    //     }
    //     setOpenData({
    //         ...openData,
    //         [event.target.name]: event.target.value,
    //     });
    //     // if (event.target.name === "maxLoginAttmpt") {
    //     //   setError(""); // Clear the error whenever there's an input change in maxLoginAttmpt field
    //     // }
    //     if (event.target.name === "addr") {
    //         setError1(""); // Clear the error whenever there's an input change in addr field
    //     }
    // };


    // CharCounter.........
    const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
        phNo: false,
        logoNm: false,
        logoPath: false,
        maxLoginAttmpt: false,
        // Add more fields here as needed
    });

    // Function to toggle character count visibility for a field
    const toggleCharCountVisibility = (fieldName) => {
        setFieldCharCountVisibility((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };

    const resetForm = () => {
        setSelectRow("")
        setFormData({

            lvlRefCd: "",
            memoIssTo: "",
            memoSubj: "",
            memoTyp: "",
            dtl: [{
                copyToNm: ""
            }]


        })
        setMsg("")
        setMsgTyp("")
        set_errExp({
            status: true,
            content: ""
        })

        // console.log(edtVal);
    };


    return (
        <div className="container">

            <div className="page-header">
                <div>
                    <h1 className="page-title"> Generate Memo Number</h1>
                    <nav aria-label="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item breadcrumb-item">
                                <a href="#" role="button" tabIndex={0}>
                                    List Page
                                </a>
                            </li>
                            <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                <a href="#" role="button" tabIndex={0}>
                                    MGF00002_01
                                    <FavLink />
                                </a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
            <form className="form-horizontal card p-4" id="EditPageForm" onSubmit={postDataToAPI}>
                {/* Memo Date & memo Type */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">Memo Date:</label>
                    <div className="col-md-3">
                        <input className="form-control" required value={currentDate} />
                    </div>
                    <label className="form-label col-md-3">Memo Type:<span className="text-red">*</span></label>
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                            // style={err?{border:"1px red solid"}: {border:"1px ebeef2 solid"}}
                                className="form-select"
                                name="memoTyp"
                                value={formData?.memoTyp}
                                onChange={handleStatusChange}
                                required
                            >
                                <option value="">--Select-</option>
                                {showPage?.mst?.ddMemoTypeFlg?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                {/* File Number Lov */}
                <div className="row mb-4 ">
                    <label className="col-sm-3 col-form-label"><b>File Number:<span className="text-red">*</span></b></label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModGrpLov(true)} /></span>

                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="fileId"
                                value={formData.fileId}

                            />&nbsp;&nbsp;&nbsp;
                            <input
                                type="text"
                                autoComplete={false}
                                className="form-control"
                                required
                                name="userFileNo"
                                value={formData.userFileNo}

                            />
                            <div className="row-mb-12">
                                {showModelModGrpLov && <Lov
                                    moduleLovData={fileLovData}
                                    setShowModel={setShowModelModGrpLov}
                                    showModel={showModelModGrpLov}
                                    handleRowClick={handleRowClickModGrpLov}
                                    columns={fileLovColumns}
                                    currentSelection={selectRow}
                                    setCurrentSelection={setSelectRow}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
                {/* subject*/}
                <div className="row mb-4">
                    <label className="form-label col-md-3">Subject:<span className="text-red">*</span></label>
                    <div className="col-md-9">
                        <input className="form-control"
                            required
                            value={formData?.memoSubj}
                            onChange={handleInputChange} name="memoSubj" />
                    </div>

                </div>
                {/* To Whom send */}
                <div className="row mb-4">
                    <label className="form-label col-md-3">To Whom Sent:<span className="text-red">*</span></label>
                    <div className="col-md-9">
                        <textarea className="form-control"
                            required
                            value={formData?.memoIssTo}
                            onChange={handleInputChange} name="memoIssTo" />
                    </div>
                </div>

                {/* Number of memo */}

                <div className="row mb-4">
                    <label className="form-label col-md-3">Number of Memo:</label>
                    <div className="col-md-3">
                        <input className="form-control"
                            //  value={formData?.dmpTotCol} 
                            name="" type="text" onChange={handleInputChange} defaultValue={1} />
                    </div>

                    <label className="form-label col-md-3">Memo Number:</label>
                    <div className="col-md-3">
                        <input className="form-control" name="noOfParam" readOnly onChange={handleInputChange} type="text" />
                    </div>
                </div>

                <div className="card text-center">
                    <div className="card-body">
                        <div className="table-responsive table">
                            <table className="table  dta-tabl" style={{ background: 'white' }}>
                                <thead className="">
                                    <tr className="bg-primary">
                                        <th className="text-white">Row#</th>
                                        <th></th>
                                        <th className="text-white">Copy To <span className="
                                                    text-red">*</span></th>
                                        <th></th>
                                        <th className="text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="">

                                    {formData?.dtl?.map((row, index) =>
                                    (<tr>
                                        <td className="border">{index + 1}</td>
                                        <td className="border-bottom "></td>
                                        <td className="border">
                                            <div>
                                                <div className="row ms-6">
                                                    {/* <label style={{ display: "flex", marginRight: "15px" }} className="form-label">
                                                        Copy To: <span className="text-red">*</span>
                                                    </label> */}
                                                    {/* <div className=""> */}

                                                    <input
                                                        className="form-control col-md-10"
                                                        type="text"
                                                        name="copyToNm"
                                                        value={row.copyToNm}
                                                        onChange={(e) =>
                                                            handleDtlInputChange(e, index, "copyToNm")
                                                        }
                                                        // onBlur={handleCharCount}
                                                        placeholder=" "
                                                        required
                                                        maxLength={50}
                                                        style={{ flexFlow: 1 }}
                                                    />
                                                    {/* {charCount?.blkNm && <span className="input-group-text">{formData?.blkNm?.length}/50</span>} */}
                                                    {/* 
                        </div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-bottom ">

                                        </td>

                                        <td className="border">
                                            {index !== formData.dtl.length - 1 ? (
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
                                                        className="action-button py-3"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>}
                                                    <button type="button" onClick={addtableRow} className="action-button">
                                                        <FontAwesomeIcon icon={faPlus} className="me-2 py-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                            {tblErr && (
                                <p className="error-message text-red d-flex justify-content-center">{tblErr}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div><button type="submit" className='btn btn-primary'>Save</button>
                    <button
                        className="btn btn-secondary mx-2"
                        type="reset"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                </div>

            </form>

            {/* <ConfirmDialog
                title="Confirmation"
                open={open}
                setOpen={set_open}
                onConfirm={handleConfirmation}
                setConfirmStatus={setConfirmStatus}
                confirmStatus={confirmStatus}
            >
                Are you sure you want to delete this record?
            </ConfirmDialog> */}
        </div>
    );

};
export default GenerateMemoNumber;
