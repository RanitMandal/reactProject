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
const ApiCatMulForm = () => {
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [openData, setOpenData] = useState("");
    useEffect(() => {

        console.log(headers)
        const fetchOpenData = async () => {
           let body={
            apiId:"SUA00246"
           }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00114/openAddForm', body, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                    res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
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
            apiCatNm: '',
            actFlg: 'A',
        },
    ]);

    const addtableRow = () => {

        setTableRow((prevRows) => [
            ...prevRows,
            {
                apiCatNm: '',
                actFlg: 'A',
            },
        ]);

        setCharCount((prevRows) => [
            ...prevRows,
            {
                isTyping: false
            },
        ]);

    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let list = tableRow
        list[index] = {
            ...list[index],
            [name]: value
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

    const handleCharCount= (e, index) => {
        
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

    


    const finalSubmit = async (e) => {
        e.preventDefault()
        let body = {
            apiId:"SUA00251",
            mst: tableRow
            }
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00114/saveAdd', body, { headers }).then((res) => {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            if (res?.data?.appMsgList?.list[0]?.errCd==="CMAI000004") {
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




    const resetForm = () => {
          
        setTableRow(
            [{
        
         apiCatNm: '',
         actFlg:  'A'}]
         )
       setMsg("")
       setMsgTyp("")
        };

        
    const resetForm1 = () => {
          
        setTableRow(
            [{
        
         apiCatNm: '',
         actFlg:  'A'}]
         )
       
        };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">API Category Master - Multiple Add</h1>
                    <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
            Add Multiple
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              SUF00114_03
            </Breadcrumb.Item>
          </Breadcrumb>
                    
                </div>
                <div className="ms-auto pageheader-btn">
                    
                    <Link
                        className="btn btn-success btn-icon text-white"
                        to={`${process.env.PUBLIC_URL}/SUF00114_01`}
                    >
                        <span>
                            <i className="fe fe-log-in" />
                            &nbsp;
                        </span>
                        API Category List
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
                    <div className="table-responsive table">
                        <table className="table  dta-tabl" style={{ background: 'white' }}>
                            <thead>
                                <tr>
                                    <th className="sno">Row#</th>
                                    {/* <th> Id</th> */}
                                    <th> Description</th>
                                    <th> Status </th>
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
                                                    onBlur={(e) => handleCharCount(e, index)}
                                                    value={row.apiCatNm}
                                                    className="form-control"
                                                    type="text"
                                                    name="apiCatNm"
                                                    required
                                                    maxLength={50}
                                                   
                                                />
                                                {charCount[index].isTyping && <span className="input-group-text">{row.apiCatNm.length}/50</span>}
                                                {/* {row.apiCatNm === "" ? <span className="input-group-text d-none">{row.apiCatNm.length}/50</span> : <span className="input-group-text">{row.apiCatNm.length}/50</span>} */}
                                            </div>
                                            {row.error && <div className="error-message">{row.error}</div>}
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

                                                                    <option>--Select--</option>

                                                                    
                                                                      {  openData?.content?.mst?.ddActFlg?.map((item) => (
                                                                            <option value={item.value}>{item.label}</option>
                                                                        ))}
                                                                    
                                                                </select>
                                            {row.error && <div className="error-message">{row.error}</div>}
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
                                                 {index!==0 && <button
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
                onClick={(e)=>resetForm()}
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
export default ApiCatMulForm;