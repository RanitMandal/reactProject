import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    // MenuItem,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
//import { ModuleGroupForm } from "./SUF00001_02";
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from "react-bootstrap";
import { useEffect } from 'react';
import axios from 'axios';
import MsgAlert from "../../common/MsgAlert";
import { getApiToken, getScplAdContext } from "../../common/common"
import FavLink from "../../common/FavLink";
import { Select } from "antd";
const headers = { Authorization: 'Bearer ' + getApiToken() };

const CreateBlankMemoNumbers = () => {
   
    const  [formData, setFormData] = useState({});
    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })

    const [openData, setOpenData] = useState([]);
    useEffect(() => {
        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "MGA00040"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00001/openForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                setFormData({
                    "blankMemoFlg": res?.data?.content?.qryRsltSet?.blankMemoFlg || "",
                    "blankMemoNo": res?.data?.content?.qryRsltSet?.blankMemoNo || "",
                    "lvlRefCd": res?.data?.content?.qryRsltSet?.lvlRefCd || "",
                    "memoTyp": res?.data?.content?.qryRsltSet?.memoTyp || ""
                  })
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                    res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            })
        }

        fetchOpenData()

    }, [])

 


    const handleSubmit = async(e) => {
        e.preventDefault()
        const addObj =  {
            "apiId": "MGA00041",
            "mst": {
              "blankMemoFlg": "Y",
              "blankMemoNo": parseFloat(formData?.blankMemoNo) || 0,
              "lvlRefCd": sessionStorage.getItem('lvlRefCd'),
              "memoTyp": formData?.memoTyp || "G"
            }
          }
          try {
            const res = await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/MGF00001/saveAdd', addObj, { headers })
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})
            console.log(msg + "" + msgTyp);
          } catch (error) {
            console.error('Error occurred while submitting:', error);
          }

    }

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
    
      const handleStatusChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };


      /* const resetForm = () => {
        setFormData
      } */

    
  

   //set default date
const getFormattedTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (`0${today.getMonth() + 1}`).slice(-2);
    const day = (`0${today.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
   };
  const [date, setDate] = useState(getFormattedTodayDate());
  //set default date end
   
    
    
    return (
        <>

            <div openData={openData}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Create Blank Memo Numbers</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item className="breadcrumb-item" href="#">
                                List Page
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                MGF00001_01
                                <FavLink />
                            </Breadcrumb.Item>

                        </Breadcrumb>
                    </div>
                    {/* <div className="ms-auto pageheader-btn">
                        <a
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
                        </a>
                        &nbsp;
                        <Link
                            className="btn btn-success btn-icon text-white"
                            to={`${process.env.PUBLIC_URL}/SUF00001_03`}
                        >
                            <span>
                                <i className="fe fe-log-in" />
                                &nbsp;
                            </span>
                            Add Multiple
                        </Link>

                    </div> */}

                </div>
                {msg &&  <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }




                <div className="card">
                    <div className="container-fluid mb-4 py-3">
                        <form onSubmit={ (e) => handleSubmit(e)}>
                  <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Memo Type:<span className="text-red">*</span></label>
                        <select className="form-select"  name = "memoTyp" value = {formData?.memoTyp} onChange={handleStatusChange}>
                           
                       { openData?.content?.criteria?.ddMemoType.map((item) => (
    <option key={item.value} value={item.value}>{item.label}</option>
))}

                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Memo Date:</label>
                        <input className="form-control" type="date" disabled value={date}/>
                       
                       
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Number of Blank Memo:<span className="text-red">*</span></label>
                        <input className="form-control" name= "blankMemoNo" value={formData?.blankMemoNo} onChange={handleInputChange} required/>
                        
                       
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Memo Number :</label>
                        <input className="form-control" disabled/>
                       
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
            <button type="submit" className='btn btn-primary'>save</button>
        </div>
        </form>
                    </div>

                </div>


               
            </div>
        </>

    );
};

export default CreateBlankMemoNumbers;



