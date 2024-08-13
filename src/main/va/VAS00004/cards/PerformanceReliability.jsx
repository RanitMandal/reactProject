import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Smalltag from "../../../common/SmallTag/smalltag";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { fillGenInfoFirst_msg } from './commanDummyData';
function PerformanceReliability({mode, info}) {
    const [loading, setLoading] = useState(false);
    const [save, setSave] = useState(false)
    const [obj, setObj] = useState(info ? {...info} : 
        {
            applicationNo: localStorage.getItem("applicationNo"),
            approvalFlag: "N",
            approvedVendor: "N",
            performanceReport: "N",
            isiFlag: "N",
            isiCancellationReason: "",
            pendingCourtCase: "",
            
            pendingCourtCaseFlag: "N",
            fileDtls: []
        })
    // const [Approval, setApproval] = useState({
    //     statutory: info?.approvalFlag ==="Y"? true:false,
    //     WhetherEnlisted: info?.approvedVendor ==="Y"? true:false,
    //     performanceReports: info?.performanceReport ==="Y"? true:false,
    //     courtCases: info?.pendingCourtCaseFlag ==="Y"? true:false,
    //     isiCertification: info?.isiFlag ==="Y"? true:false,
    // })
    



    const [perf_TableRow, set_perf_TableRow] = useState([{
        fileDescription: "",
        files: [],
        edit: false
    }])
    const [perf2_TableRow, set_perf2_TableRow] = useState([{
        fileDescription: "",
        files: [],
        edit: false
    }])
    const [perf3_TableRow, set_perf3_TableRow] = useState([{
        fileDescription: "",
        files: [],
        edit: false
    }])

    useEffect(() => {
        if(mode !== 3){
            obj.fileDtls = obj?.fileDtls.map((item)=>{
                return{
                    ...item,
                    edit : true
                }
            })
            set_perf_TableRow(obj?.fileDtls.filter((item)=>{
                return item.fileTypeCode === "20"
            }))
            set_perf2_TableRow(obj?.fileDtls.filter((item)=>{
                return item.fileTypeCode === "21"
            }))
            set_perf3_TableRow(obj?.fileDtls.filter((item)=>{
                return item.fileTypeCode === "22"
            }))
        }
      
    }, [])
    

    const add_perf_TableRow = () => {
        set_perf_TableRow([...perf_TableRow, {
            fileDescription: "",
            files: [{}],
            edit: false
        }])
    }
    const add_perf2_TableRow = () => {
        set_perf2_TableRow([...perf2_TableRow, {
            fileDescription: "",
            files: [{}],
            edit: false
        }])
    }
    const add_perf3_TableRow = () => {
        set_perf3_TableRow([...perf3_TableRow, {
            fileDescription: "",
            files: [{}],
            edit: false
        }])
    }
    const remove_perf_TableRow = (e, index) => {
        const rows = [...perf_TableRow]
        console.log(rows);
        rows.splice(index, 1)
        console.log(rows);
        set_perf_TableRow([...rows])
    }
    const remove_perf2_TableRow = (index) => {
        const rows = [...perf2_TableRow]
        console.log(rows);
        rows.splice(index, 1)
        set_perf2_TableRow([...rows])
        console.log(rows);
    }
    const remove_perf3_TableRow = (index) => {
        const rows = [...perf3_TableRow]
        rows.splice(index, 1)
        set_perf3_TableRow([...rows])
    }

    const handle_pr_Change = (e, index) => {
        const { name, files, type, value } = e.target
        // setprFiles({
        // 	...prFiles,
        // 	[name]: [...files]
        // })
        console.log(files);
        console.log(type, value, index);
        let list = [...perf_TableRow]
        if (type === "file") {
            list[index] = {
                ...list[index],
                files: files
            }
            set_perf_TableRow(list)
        } else {
            list[index] = {
                ...list[index],
                fileDescription: value
            }
            set_perf_TableRow(list)
        }
    }

    const handle_pr2_Change = (e, index) => {
        const { name, files, type, value } = e.target
        // setprFiles({
        // 	...prFiles,
        // 	[name]: [...files]
        // })
        console.log(type, value, index);
        let list = [...perf2_TableRow]
        if (type === "file") {
            list[index] = {
                ...list[index],
                files: files
            }
            set_perf2_TableRow(list)
        } else {
            list[index] = {
                ...list[index],
                fileDescription: value
            }
            set_perf2_TableRow(list)
        }
    }
    

    const handle_pr3_Change = (e, index) => {
        const { name, files, type, value } = e.target
        // setprFiles({
        // 	...prFiles,
        // 	[name]: [...files]
        // })
        console.log(type, value, index);
        let list = [...perf3_TableRow]
        if (type === "file") {
            list[index] = {
                ...list[index],
                files: files
            }
            set_perf3_TableRow(list)
        } else {
            list[index] = {
                ...list[index],
                fileDescription: value
            }
            set_perf3_TableRow(list)
        }
    }

    const field_nd_file_validation = ()=>{
        if (obj.approvalFlag === "Y") {
            if (!perf_TableRow.length) {
                alert("Please Enter Data In table")
                return false
            } else {
                for (let i = 0; i < perf_TableRow.length; i++) {
                    if (!perf_TableRow[i].fileDescription) {
                        alert("Please insert all data in table");
                        return false
                    }
                    if (!perf_TableRow[i].edit && perf_TableRow[i].files[0].size > 1000 * 1000*25) {
                        alert("Approval of Statutory Table '" + perf_TableRow[i].files[0].name + "' file size exceeded 1MB");
                        return false
                    }
                }
            }
        }
        if (obj.approvedVendor === "Y") {
            if (!perf2_TableRow.length) {
                alert("Please Enter Data In table")
                return false
            } else {
                for (let i = 0; i < perf2_TableRow.length; i++) {
                    if (!perf2_TableRow[i].fileDescription) {
                        alert("Please insert all data in table");
                        return false
                    }
                    if (!perf2_TableRow[i].edit && perf2_TableRow[i].files[0].size > 1000 * 1000*25) {
                        alert("Approved Vendor Table '" + perf2_TableRow[i].files[0].name + "' file size exceeded 25MB");
                        return false
                    }
                }
            }
        }
        console.log(perf3_TableRow);
        if (obj.performanceReport === "Y") {
            if (!perf3_TableRow.length) {
                alert("Please Enter Data In table")
                return false
            } else {
                for (let i = 0; i < perf3_TableRow.length; i++) {
                    if (!perf3_TableRow[i].fileDescription) {
                        alert("Please insert all data in table");
                        return false
                    }
                    if (!perf3_TableRow[i].edit && perf3_TableRow[i].files[0].size > 1000 * 1000*25) {
                        alert("Performance Report Table '" + perf2_TableRow[i].files[0].name + "' file size exceeded 25MB");
                        return false
                    }
                }
            }
        }
        
        if (obj.isiFlag === "Y" && !obj.isiCancellationReason) {
            alert("Please give ISI Cancellation Detail with Reason.");
            return false
        }
        
        if (obj.pendingCourtCaseFlag === "Y" && !obj.pendingCourtCase) {
            alert("Please give Pending CourtCase Detail.");
            return false
        }

        return true
    }


    const reset_PR = (e) => {
        //r-pr
        e.preventDefault()
        
        set_perf_TableRow([{
            fileDescription: "",
            files: [{}],
            edit: false
        }])
        set_perf2_TableRow([{
            fileDescription: "",
            files: [{}],
            edit: false
        }])
        set_perf3_TableRow([{
            fileDescription: "",
            files: [{}],
            edit: false
        }])
        setObj({
            applicationNo: localStorage.getItem("applicationNo"),
            approvalFlag: "N",
            approvedVendor: "N",
            performanceReport: "N",
            isiFlag: "N",
            isiCancellationReason: "",
            pendingCourtCase: "",
            
            pendingCourtCaseFlag: "N",
            fileDtls: []
        })
    }
    // const [pr_TableMsg, set_pr_TableMsg] = useState(null);
    // const handle_prTable_upload = async (e) => {
    //     e.preventDefault();
    //     //pr
    //     console.log("1");
    //     let err = false
    //     const obj = {
    //         applicationNo: localStorage.getItem("applicationNo"),
    //         approvalFlag: document.getElementById("statutory").value === "Yes" ? "Y" : "N",
    //         approvedVendor: document.getElementById("WhetherEnlisted").value === "Yes" ? "Y" : "N",
    //         isiFlag: document.getElementById("isiCertification").value === "Yes" ? "Y" : "N",
    //         isiCancellationReason: document.getElementById("isiCancellationReason") ? document.getElementById("isiCancellationReason").value : "",
    //         performanceReport: document.getElementById("performanceReports").value === "Yes" ? "Y" : "N",
    //         pendingCourtCaseFlag: document.getElementById("courtCases").value === "Yes" ? "Y" : "N",
    //         pendingCourtCase: document.getElementById("pendingCourtCase") ? document.getElementById("pendingCourtCase").value : "",
    //         fileDtls: []
    //     }
    //     if (obj.approvalFlag === "Y") {
    //         if (!perf_TableRow.length) {
    //             alert("Please Enter Data In table")
    //             return
    //         } else {
    //             for (let i = 0; i < perf_TableRow.length; i++) {
    //                 if (!perf_TableRow[i].fileDescription) {
    //                     alert("Please insert all data in table");
    //                     return
    //                 }
    //                 if (perf_TableRow[i].files[0].size > 1000 * 1000*25) {
    //                     alert("Approval of Statutory Table '" + perf_TableRow[i].files[0].name + "' file size exceeded 1MB");
    //                     return
    //                 }
    //             }
    //         }
    //     }
    //     if (obj.approvedVendor === "Y") {
    //         if (!perf2_TableRow.length) {
    //             alert("Please Enter Data In table")
    //             return
    //         } else {
    //             for (let i = 0; i < perf2_TableRow.length; i++) {
    //                 if (!perf2_TableRow[i].fileDescription) {
    //                     alert("Please insert all data in table");
    //                     return
    //                 }
    //                 if (perf2_TableRow[i].files[0].size > 1000 * 1000*25) {
    //                     alert("Approved Vendor Table '" + perf2_TableRow[i].files[0].name + "' file size exceeded 25MB");
    //                     return
    //                 }
    //             }
    //         }
    //     }
    //     if (obj.performanceReport === "Y") {
    //         if (!perf3_TableRow.length) {
    //             alert("Please Enter Data In table")
    //             return
    //         } else {
    //             for (let i = 0; i < perf3_TableRow.length; i++) {
    //                 if (!perf3_TableRow[i].fileDescription) {
    //                     alert("Please insert all data in table");
    //                     return
    //                 }
    //                 if (perf3_TableRow[i].files[0].size > 1000 * 1000*25) {
    //                     alert("Performance Report Table '" + perf2_TableRow[i].files[0].name + "' file size exceeded 25MB");
    //                     return
    //                 }
    //             }
    //         }
    //     }
        
    //     if (obj.isiFlag === "Y" && !obj.isiCancellationReason) {
    //         alert("Please give ISI Cancellation Detail with Reason.");
    //         return
    //     }
        
    //     if (obj.pendingCourtCaseFlag === "Y" && !obj.pendingCourtCase) {
    //         alert("Please give Pending CourtCase Detail.");
    //         return
    //     }

    //     //uploading files
    //     setLoading(true)
    //     for (let i = 0; i < perf_TableRow.length; i++) {
    //         let formData = new FormData();
    //         if(!perf_TableRow[i].edit){
    //             formData.append("vfile", perf_TableRow[i].files[0])
    //         await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
    //             if (res.data.code === 0) obj.fileDtls = [...obj.fileDtls, {
    //                 fileTypeCode: "20",
    //                 fileUri: res.data.content.fileUri,
    //                 fileDescription: perf_TableRow[i].org
    //             }]
    //             else {
    //                 alert("Something went wrong, while uploading files. Please try again to save");
    //                 setLoading(false)
    //                 return
    //             }
    //         }).catch((err) => {
    //             console.log(err, "err");
    //         })
    //         }
            
    //     }

    //     for (let i = 0; i < perf2_TableRow.length; i++) {
    //         if(!perf2_TableRow[i].edit){
    //             let formData = new FormData();
    //         formData.append("vfile", perf2_TableRow[i].files[0])
    //         await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
    //             if (res.data.code === 0) obj.fileDtls = [...obj.fileDtls, {
    //                 fileTypeCode: "21",
    //                 fileUri: res.data.content.fileUri,
    //                 fileDescription: perf2_TableRow[i].org
    //             }]
    //             else {
    //                 alert("Something went wrong, while uploading files. Please try again to save");
    //                 setLoading(false)
    //                 return
    //             }
    //         }).catch((err) => {
    //             console.log(err, "err");
    //         })}
    //     }

    //     for (let i = 0; i < perf3_TableRow.length; i++) {
    //         if(!perf3_TableRow[i].edit){
    //             let formData = new FormData();
    //         formData.append("vfile", perf3_TableRow[i].files[0])
    //         await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
    //             if (res.data.code === 0) obj.fileDtls = [...obj.fileDtls, {
    //                 fileTypeCode: "22",
    //                 fileUri: res.data.content.fileUri,
    //                 fileDescription: perf3_TableRow[i].org
    //             }]
    //             else {
    //                 alert("Something went wrong, while uploading files. Please try again to save");
    //                 setLoading(false)
    //                 return
    //             }
    //         }).catch((err) => {
    //             console.log(err, "err");
    //         })}
    //     }

    //     // 
    //     console.log(obj);
    //     await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/performance_info", obj).then((res) => {
    //         setLoading(false)
    //         if (res.data.code === 0) {
    //             alert("successfully saved");
    //         }

    //     }).catch((err) => {
    //         console.log(err);
    //         setLoading(false)
    //     })
    //     console.log(obj);
    // }
    const handle_ass_Change = (e)=>{
        const {id, value} = e.target
        setObj({
            ...obj,
            [id]: value
        })
    }
    const handle_input_change = (e)=>{
        const {name, value} = e.target
        setObj({
            ...obj,
            [name]: value
        })
    }







    const handle_PR_update = async (e)=>{
        e.preventDefault()
        if(!field_nd_file_validation()) return
        // else alert("")
        let data = {
            ...obj,
            applicationNo: localStorage.getItem("applicationNo"),
            fileDtls: [
                ...perf_TableRow.filter(item=> item?.edit !== false),
                ...perf2_TableRow.filter(item=> item?.edit !== false),
                ...perf3_TableRow.filter(item=> item?.edit !== false)
            ]
        }
        setLoading(true);
        //uploading files
        console.log(perf_TableRow);
        for (let i = 0; i < perf_TableRow.length; i++) {
            if(!perf_TableRow[i].edit && perf_TableRow[i].files.length){
            let formData = new FormData();
            
            formData.append("vfile", perf_TableRow[i].files[0])
            if(!perf_TableRow[i].edit)
            await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
                if (res.data.code === 0) data.fileDtls = [...data?.fileDtls, {
                    fileTypeCode: "20",
                    fileUri: res.data.content.fileUri,
                    fileDescription: perf_TableRow[i].fileDescription
                }]
                else {
                    alert("Something went wrong, while uploading files. Please try again to save 1");
                    setLoading(false)
                    return
                }
            }).catch((err) => {
                console.log(err, "err");
            })}
        }
        console.log(perf2_TableRow);
        for (let i = 0; i < perf2_TableRow.length; i++) {
            if(!perf2_TableRow[i].edit && perf2_TableRow[i].files.length){
                let formData = new FormData();
            formData.append("vfile", perf2_TableRow[i].files[0])
            if(!perf2_TableRow[i].edit)
            await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
                if (res.data.code === 0) data.fileDtls = [...data.fileDtls, {
                    fileTypeCode: "21",
                    fileUri: res.data.content.fileUri,
                    fileDescription: perf2_TableRow[i].fileDescription
                }]
                else {
                    alert("Something went wrong, while uploading files. Please try again to save 2");
                    setLoading(false)
                    return
                }
            }).catch((err) => {
                console.log(err, "err");
            })}
        }
        console.log(perf3_TableRow);
        for (let i = 0; i < perf3_TableRow.length; i++) {
            if(!perf3_TableRow[i].edit && perf3_TableRow[i].files.length){
                let formData = new FormData();
            formData.append("vfile", perf3_TableRow[i].files[0])
            if(!perf3_TableRow[i].edit)
            await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
                if (res.data.code === 0) data.fileDtls = [...data?.fileDtls, {
                    fileTypeCode: "22",
                    fileUri: res.data.content.fileUri,
                    fileDescription: perf3_TableRow[i].fileDescription
                }]
                else {
                    alert("Something went wrong, while uploading files. Please try again to save 3");
                    return
                }
            }).catch((err) => {
                console.log(err, "err");
            })
		}
        }
        

        if(info && mode === 2){
            await axios.put(process.env.REACT_APP_BASE_URL + "/api/v1/PerformaceInfoDettails", data).then((res) => {
            if (res.data.code === 0){
                set_perf_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "20").map(item => {return {...item, edit:true}}))
                set_perf2_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "21").map(item => {return {...item, edit:true}}))
                set_perf3_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "22").map(item => {return {...item, edit:true}}))
                // alert("successfully updated");
                alert("successfully updated")
                
            }

        }).catch((err) => {
            console.log(err);

        }).finally(()=>{
            setLoading(false);
        })
    
    }
        else{
            const postdata = {
                ...data,
                fileDtls: [
                    ...data.fileDtls.map((item)=>{
                        return {
                            fileDescription: item.fileDescription,
                            fileTypeCode: item.fileTypeCode,
                            fileUri: item.fileUri
                        }
                    })
                ]
            }
            if(!localStorage.getItem("applicationNo")) {
                setLoading(false)
                alert(fillGenInfoFirst_msg)
                return
            }
            await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/performance_info", postdata).then((res) => {
                if (res.data.code === 0){
                    set_perf_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "20").map(item => {return {...item, edit:true}}))
                set_perf2_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "21").map(item => {return {...item, edit:true}}))
                set_perf3_TableRow(data.fileDtls.filter(item => item.fileTypeCode === "22").map(item => {return {...item, edit:true}}))
                    alert("successfully "+(mode === 2 ? 'Update': 'Save'));
                    
                    if(mode === 3)setSave(true)
                }
    
            }).catch((err) => {
                console.log(err);
                
            }).finally(()=>{
                setLoading(false);
            })
        }
        
    }




    return (
        
        <div className="mytable">
       
        
            <div className="">
            <form onSubmit={handle_PR_update}>
                <div className='row'>

                    <div className='col-md-12'>
                        <div className="from-each-div">
                            <div className='d-inline-block'><p className="from-label-p"><b>Approval of Statutory and/or other Inspection Agency</b>
                                <select disabled={mode===1} value={obj?.approvalFlag}  id='approvalFlag' 
                                onChange={handle_ass_Change}
                                className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option>
                                </select>
                            </p></div>
                            
                            {obj.approvalFlag === "Y" &&
                                <div>

                                    <table className='table w-100 table-bordered dta-table'>
                                        <thead>
                                            <tr>
                                                <td>S no.</td>
                                                <td style={{width: "60%"}}>Name of Certificate issuing organization</td>
                                                <td>Files</td>
                                                {(mode !== 1 && !save ) && <td>
                                                    <button type='button' onClick={add_perf_TableRow}><i className="fa-solid fa-plus"></i></button>
                                                </td>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                perf_TableRow.map((item, index) => (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td><input required  disabled={mode===1} value={item.fileDescription} onChange={e => handle_pr_Change(e, index)} type="text" className="form-control" /></td>
                                       {mode === 1? 
                                       <td>
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                    </td>: 
                                    <td>
                                    {   item.edit?
                                        <div className='file-div'>
                                        
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                        
                                   
                                    {/* <CancelOutlinedIcon  className='cross-icon' id='pan'  /> */}
                                        </div>
                                    :
                                        <input required files={item.files} name='statutory' onChange={e => handle_pr_Change(e, index)} type="file" accept="image/*,.pdf, .zip" multiple className="form-control d-inline-block w-auto" />

                                    }
                                    </td>}
                                                        {(mode !== 1 && !save ) && <td>
                                                            <button type='button' onClick={(e) => remove_perf_TableRow(e, index)}>
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                </div>

                            }</div>
                    </div>

                    <div className='col-md-12'>
                        <div className="from-each-div"><div className='d-inline-block'><p className="from-label-p"><b>Whether enlisted as approved Vendor in any Govt, Govt Undertaking or in Public Sector bodies</b>
                            <select disabled={mode===1}value={obj?.approvedVendor} onChange={handle_ass_Change} id='approvedVendor' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select>
                        </p></div>
                            
                            {obj.approvedVendor ==="Y" &&
                                <div>
                                    <table className='table w-100 table-bordered dta-table'>
                                        <thead>
                                            <tr>
                                                <td>S no.</td>
                                                <td style={{width: "60%"}}>Name of the organization</td>
                                                <td>Files</td>
                                                {(mode !== 1 && !save ) && <td>
                                                    <button type='button' onClick={add_perf2_TableRow}><i className="fa-solid fa-plus"></i></button>
                                                </td>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                perf2_TableRow.map((item, index) => (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td><input required disabled={mode===1} onChange={e => handle_pr2_Change(e, index)} type="text" value={item.fileDescription} className="form-control" /></td>
                                       {mode === 1? 
                                       <td>
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                    </td> :  <td>
                                    {   item.edit?
                                        <div className='file-div'>
                                        
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                        
                                  
                                    {/* <CancelOutlinedIcon  className='cross-icon' id='pan'  /> */}
                                        </div>
                                    :
                                        <input required files={item.files} name='statutory' onChange={e => handle_pr2_Change(e, index)} type="file" accept="image/*,.pdf, .zip" multiple className="form-control d-inline-block w-auto" />

                                    }
                                    </td>}
                                                        {(mode !== 1 && !save ) && <td>
                                                            <button type='button' onClick={() => remove_perf2_TableRow(index)}>
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                </div>



                            }</div>
                    </div>

                    <div className='col-md-12'>
                        <div className="from-each-div"><div className='d-inline-block'><p className="from-label-p"><b>Performance Reports from clients </b>
                            <select disabled={mode===1}value={obj?.performanceReport} onChange={handle_ass_Change} id='performanceReport' className="yesno">
                            <option value={"N"}>No</option>
                            <option value={"Y"}>Yes</option>
                            </select></p>
                        </div>

                            {obj.performanceReport === "Y" &&
                                <div>

                                    <table className='table w-100 table-bordered dta-table'>
                                        <thead>
                                            <tr>
                                                <td>S no.</td>
                                                <td style={{width: "60%"}}>Name of the Client </td>
                                                <td>Files</td>
                                                {(mode !== 1 && !save ) && <td>
                                                    <button type='button' onClick={add_perf3_TableRow}><i className="fa-solid fa-plus"></i></button>
                                                </td>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                perf3_TableRow.map((item, index) => (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td><input required disabled={mode===1} value={item.fileDescription} onChange={e => handle_pr3_Change(e, index)} type="text" className="form-control" /></td>
                                            {mode === 1? 
                                       <td>
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                    </td> : 
                                    <td>
                                    {   item?.edit?
                                        <div className='file-div'>
                                        
                                        <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+item.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} />
                                        
                                
                                    {/* <CancelOutlinedIcon  className='cross-icon' id='pan'  /> */}
                                        </div>
                                    :
                                        <input required files={item.files} name='statutory' onChange={e => handle_pr3_Change(e, index)} type="file" accept="image/*,.pdf, .zip" multiple className="form-control d-inline-block w-auto" />

                                    }
                                    </td>}
                                                        {(mode !== 1 && !save ) && <td>
                                                            <button type='button' onClick={() => remove_perf3_TableRow(index)}>
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                </div>


                            }</div>
                    </div>

                    <div className='col-md-12'>
                        <div className="from-each-div"><div className='d-inline-block'><p className="from-label-p"><b>Whether the ISI Certification Mark License ever suspended/cancelled :</b>
                            <select disabled={mode===1} value={obj?.isiFlag} onChange={handle_ass_Change} id='isiFlag' className="yesno">
                            <option value={"N"}>No</option>
                            <option value={"Y"}>Yes</option>
                            </select>
                        </p></div>

                        </div>
                        <div className='col-md-12'>
                            {obj.isiFlag === "Y" &&
                                <textarea required disabled={mode===1} value={obj?.isiCancellationReason} style={{ minWidth: "100%", minHeight: "100px" }} id='isiCancellationReason'
                                onChange={handle_input_change} 
                                name='isiCancellationReason'
                                placeholder='Give details with reason.' className="form-control d-inline-block w-auto align-top courtCases" />}
                        </div>
                    </div>

                    <div className='col-md-12'>
                        <div className="from-each-div"><div className='d-inline-block'><p className="from-label-p"><b>Records of pending Court Cases/Litigations/Arbitration issues with WBPHED or any other Govt. organisations:</b>
                            <select disabled={mode===1} value={obj?.pendingCourtCaseFlag} onChange={handle_ass_Change} id='pendingCourtCaseFlag' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select>
                        </p></div>
                            

                        </div>
                        <div className='col-md-12'>
                            {obj.pendingCourtCaseFlag === "Y" &&
                                <textarea required disabled={mode===1} value={obj?.pendingCourtCase}
                                onChange={handle_input_change} style={{ minWidth: "100%",
                                minHeight: "100px" }}
                                    id='pendingCourtCase'
                                    name='pendingCourtCase'
                                    placeholder='Give detailes' className="form-control d-inline-block w-auto align-top courtCases" />}
                        </div>
                    </div>

                    {/* {pr_TableMsg && <p style={{ color: "red", textAlign: "center" }}>{pr_TableMsg}</p>} */}

                    {mode !== 1 && !save && <div className="col-md-12 text-right p-0">
                        {/* <button type='button' onClick={reset_PR} className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}

                        <button type='submit' className="Enquiry-btn ml-auto mt-2 btn btn-primary">{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>

                    </div>}
                    
                    {save && <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
                </div>
                </form>
            </div>
        
    </div>
        
    )
}

export default PerformanceReliability