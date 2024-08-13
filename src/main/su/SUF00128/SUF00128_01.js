import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import Lov from "../../common/Lov _new";
import axios from 'axios';
import FavLink from "../../common/FavLink";
import {  modLovColumns, tempFormLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };
const ExportApi = () => {

    const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [queryExportObj, setQueryExportObj] = useState({
        apiId: "SUA00410",
        mst: [
          {
            modId: "",
            tmpFormId: ""
          }
        ]
    })

    //Form open api calling
    const [showPage, setShowPage] = useState(false);
    useEffect(() => {
        const openFrom = async () => {
            let obj={
                apiId:'SUA00413'
            }
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00128/openForm", obj,  { headers })
                .then((res) => { setShowPage(res.data) 
                    setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                        res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                    setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                    set_errExp({status:res.data?.appMsgList?.errorStatus})
                 })
        }
        openFrom();
    }, []);
    //Form open api end


    //Mod Lov Starts

    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {

        const modLovObj = {
            apiId:'SUA00412',
            

        }
        console.log(modLovObj)
        const fetchModLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00128/getAllModMst", modLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                });
        };

        fetchModLovData();
    }, []);


    const getModName = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modNm
    }

    const getModId = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modId
    }

    const [selectRowModLov, setSelectRowModLov] = useState({});
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        setSelectRowModLov(rowData);
        setSelectRowTempFormLov("")
        setTempFormLovData({})
        setQueryExportObj({

            apiId:'SUA00410',
            mst:[{ 
            modId: getModId(rowData),
            tmpFormId:""
           
        }]


        })
    };

    //Mod Lov Ends

    //TempForm Lov Starts

    const [tempFormLovData, setTempFormLovData] = useState([]);
    useEffect(() => {

        const tempFormLovObj = {
            apiId:'SUA00411',
            criteria: {
                modId: getModId(selectRowModLov)

            }


        }
        console.log()
        const fetchTempFormLovData = async () => {
            await axios
                .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00128/getAllTempformInfo", tempFormLovObj, { headers })
                .then((res) => {
                    console.log(res.data);
                    setTempFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);
                });
        };

        fetchTempFormLovData();
    }, [selectRowModLov]);


    const getTempFormName = (obj) => {
        return tempFormLovData[Number(Object.keys(obj)[0])]?.formNm
    }

    const getTempFormId = (obj) => {
        return tempFormLovData[Number(Object.keys(obj)[0])]?.tmpFormId
    }

    const [selectRowTempFormLov, setSelectRowTempFormLov] = useState({});
    const [showModelTempFormLov, setShowModelTempFormLov] = useState(false);
    const handleRowClickTempFormLov = (rowData) => {
        setSelectRowTempFormLov(rowData);
        setQueryExportObj({
            apiId:'SUA00410',
            mst:[{
            modId: getModId(selectRowModLov),
            tmpFormId: getTempFormId(rowData)
        }]
    })
    };

    //TempForm Lov Ends
    const postExport = async (e) =>{
        e.preventDefault();
        await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00128/exportApi", queryExportObj, { headers })
        .then((res) => {
console.log(res.data);
setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
        set_errExp({status:res.data?.appMsgList?.errorStatus})
        })
    }

const resetForm=()=>{
 setQueryExportObj({
    apiId: "SUA00410",
        mst: [
          {
            modId: "",
            tmpFormId: ""
          }
        ]
 })
    setSelectRowModLov("")
    setModLovData({})
    setSelectRowTempFormLov("")
    setTempFormLovData({})
    setMsg("")
    setMsgTyp("")
}
    
  // Conditionally render the component based on the value of showPage
  if (showPage?.appMsgList?.errorStatus==true) {
    return null; // Don't render the component
  } 
    return (
        <>
            <div showPage={showPage}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Export Api</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item breadcrumb-item">
                                    <a href="#" role="button" tabIndex={0}>
                                        List Page
                                    </a>
                                </li>
                                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                                    <a href="#" role="button" tabIndex={0}>
                                        SUF00128_01
                                        <FavLink />
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }  

                <div className=" card ">
                    <div className="container">
                        <form id="myForm" onSubmit={postExport} className="py-4 mx-2">
                            
                            {/* Module LOV */}
                            <div className="row mb-2">
                                <label className="col-sm-3 col-form-label"><b>Module:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelModLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
                                            required
                                            value={getModId(selectRowModLov) ? getModId(selectRowModLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
                                            value={getModName(selectRowModLov) ? getModName(selectRowModLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelModLov && <Lov
                                                moduleLovData={modLovData}
                                                setShowModel={setShowModelModLov}
                                                showModel={showModelModLov}
                                                handleRowClick={handleRowClickModLov}
                                                columns={modLovColumns}
                                                currentSelection={selectRowModLov}
                                                setCurrentSelection={setSelectRowModLov}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Template Form LOV */}
                            <div className="row mb-2">
                                <label className="col-sm-3 col-form-label"><b>Template Form Id:<span className="text-red">*</span></b></label>
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelTempFormLov(true)} /></span>

                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control"
required
                                            value={getTempFormId(selectRowTempFormLov) ? getTempFormId(selectRowTempFormLov) : ''}
                                        />
                                        <input
                                            type="text"
                                            autoComplete={false}
                                            className="form-control mx-4"
                                            required
                                            value={getTempFormName(selectRowTempFormLov) ? getTempFormName(selectRowTempFormLov) : ''}
                                        />
                                        <div className="row-mb-12">
                                            {showModelTempFormLov && <Lov
                                                moduleLovData={tempFormLovData}
                                                setShowModel={setShowModelTempFormLov}
                                                showModel={showModelTempFormLov}
                                                handleRowClick={handleRowClickTempFormLov}
                                                columns={tempFormLovColumns}
                                                currentSelection={selectRowTempFormLov}
                                                setCurrentSelection={setSelectRowTempFormLov}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container text-end mb-2">
                                <button class="btn btn-primary" type="submit">
                                    Export
                                </button>

                                <button
                                    className="btn btn-secondary mx-1"
                                    type="reset"
                                onClick={resetForm}
                                >
                                    Reset
                                </button>

                                {/*  <div className="col-md-1">
            
              </div> */}
                            </div>
                        </form>
                    </div>
                    
               

                </div>

            </div>


           
        </>
    );
};

export default ExportApi;
