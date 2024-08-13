import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Smalltag from "../../../common/SmallTag/smalltag";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { financialDummyData } from './commanDummyData';
import axios from 'axios';
function GeneralInfoCard({ info, disabled, vendorInfo, mode, selectedProduct, setSubmitCond, submitCond }) {
    const [obj, setObj] = useState(mode === 3 ? {
        applicationNo: "",
        applicationType: "",
        brandName: "",
        categoryOfUnit: "",
        estbYear: "",
        fileDetails: [],
        gstNo: "",
        gstState: "",
        natureOfCompany: "",
        pan: "",
        productCode: "",
        registrationNo: "",
        vendorName: "",
        productName: "",
        brandName: "",
        officeAddress: "",
        landLineNo: "",
        mobileNo: "",
        emailId: "",
        webSite: "",
        registrationNo: localStorage.getItem("registrationNo")
    } : { ...info, ...vendorInfo });

    const [save, setSave] = useState(false)

    useEffect(() => {
        if (selectedProduct?.desc) setObj({
            ...obj,
            productName: selectedProduct.desc,
            productCode: selectedProduct.code,
            vendorName: localStorage.getItem("name"),
            officeAddress: localStorage.getItem("offAddress"),
            landLineNo: localStorage.getItem("landlineno"),
            mobileNo: localStorage.getItem("mobileno"),
            emailId: localStorage.getItem("email"),
            webSite: localStorage.getItem("webside"),

        })
    }, [selectedProduct?.desc])
    console.log("GeneralInfoCard");

    const [loading, setLoading] = useState(false);
    const [msg, set_msg] = useState("");
    const [show, setShow] = useState({
        gstNo: true,
        pan: true,
        natureOfCompany: true,
        categoryOfUnit: true
    });
    const [check, set_check] = useState({
        gstNo: false,
        pan: false,
        natureOfCompany: false,
        categoryOfUnit: false
    });
    const [GI_Files, set_GI_Files] = useState({
        natureOfCompany: null,
        categoryOfUnit: null,
        gstNo: null,
        pan: null,
    });

    const handle_field_Change = (e) => {
        let { id, value } = e.target;
        console.log(id, value);
        let temp = obj
        setObj({
            ...temp,
            [id]: value
        })
        if (id === "pan" && !hanldeCheckPan(value)) {
            value = ""
        }
        set_check({
            ...check,
            [id]: value ? true : false
        })
    }

    const hanldeCheckPan = (val) => {
        var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        if (!regpan.test(val)) return false
        return true
    }

    const validate = () => {
        let objkeys = Object.keys(GI_Files);
        for (let i = 0; i < objkeys.length; i++) {
            if (GI_Files[objkeys[i]]) {
                console.log(GI_Files[objkeys[i]]);
                if (GI_Files[objkeys[i]][0].size > 1000 * 1000) {
                    if (i === 0) alert("Nature Of Company file size Exceeded 1MB");
                    if (i === 1) alert("Category Of Unit file size Exceeded 1MB");
                    if (i === 2) alert("GST Number file size Exceeded 1MB");
                    if (i === 3) alert("PAN Number file size Exceeded 1MB");
                    return false
                }
            }
        }
        if (!hanldeCheckPan(obj.pan)) {
            alert('Invalid Pan No.')
            return false
        }
        if (mode === 3 && !selectedProduct.code && !selectedProduct.desc) {
            alert('Please select both Product and its category')
            return false
        }
        // console.log("oooo",Number(obj.estbYear) ,new Date().getFullYear());
        if (Number(obj.estbYear) > new Date().getFullYear() || obj.estbYear.length !== 4) {
            alert('Please enter valid Year')
            return false
        }
        return true
    }

    const postFinacialInfo = async () => {
        let obj;
        try {
            obj = {
                ...financialDummyData,
                applicationNo: localStorage.getItem("applicationNo")
            }
        } catch (err) {
            alert(err)
        }

        await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/financialinformation", obj).then((res) => {
            if (res.data.code === 0) {
                return true
            }

        }).catch((err) => {
            console.log(err);
            return false
        })
        return false
    }



    const update_GI = async (e) => {
        //File validation
        e.preventDefault()
        let objkeys = Object.keys(GI_Files);
        if (!validate()) return

        setLoading(true);
        let fileList = mode === 2 ? obj.fileDtls : obj.fileDetails
        //file upload
        for (let i = 0; i < objkeys.length; i++) {
            let formData = new FormData();
            if (GI_Files[objkeys[i]]) {
                console.log(GI_Files[objkeys[i]]);
                formData.append("vfile", GI_Files[objkeys[i]][0])
                await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
                    if (res.data.code === 0) {
                        if (mode === 2) fileList.splice(i, 1, {
                            fileTypeCode: "0" + (i + 1),
                            fileUri: res.data.content.fileUri,
                            fileTypeSlNo: i + 1,
                        })
                        if (mode === 3) fileList = [
                            ...fileList,
                            {
                                fileTypeCode: "0" + (i + 1),
                                fileUri: res.data.content.fileUri,
                                fileTypeSlNo: i + 1,
                            }
                        ]
                    }
                }).catch((err) => {
                    console.log(err, "err");
                })
            }
        }

        const putObj = {
            apiId: "string",
            mst: {
                applicationNo: obj.applicationNo,
                applicationType: "N",
                brandName: obj.brandName,
                categoryOfUnit: obj.categoryOfUnit,
                estbYear: Number(obj.estbYear),
                fileDetails: fileList,
                gstNo: obj.gstNo,
                gstState: obj.gstState,
                natureOfCompany: obj.natureOfCompany,
                pan: obj.pan,
                productCode: obj.productCode,
                registrationNo: obj.registrationNo
            }
        }



        if (mode === 2)
            await axios.put(process.env.REACT_APP_BASE_URL + "/VAF00004/generaldetails", putObj).then((res) => {
                if (res.data.code === 0) {

                    alert("successfully updated");
                }
                setShow({
                    gstNo: true,
                    pan: true,
                    natureOfCompany: true,
                    categoryOfUnit: true
                })

            })

        const postObj = {
            applicationType: "N",
            brandName: obj.brandName,
            categoryOfUnit: obj.categoryOfUnit,
            estbYear: obj.estbYear,
            fileDetails: fileList,
            gstNo: obj.gstNo,
            gstState: obj.gstState,
            natureOfCompany: obj.natureOfCompany,
            pan: obj.pan,
            productCode: obj.productCode,
            registrationNo: obj.registrationNo
        }
        console.log(postObj);
        if (mode === 3) {
            await axios.post(process.env.REACT_APP_BASE_URL + '/api/v1/generalinformation', postObj).then(response => {
                console.log(response.data);

                if (response.data.code === 0) {
                    localStorage.setItem("applicationNo", response.data.content.applicationNo);

                    if (postFinacialInfo()) {
                        setSave(true)
                        setSubmitCond({ ...submitCond, GI: true })
                        alert("successfully saved");

                    } else {
                        alert("Something went wrong | Code: FINUP");
                    }

                }
                else {

                    if (response.data.code === '1006')
                        alert(response.data.msg);
                    else alert(response.data?.msg);

                }
            }).catch(error => {
                alert(error);
            }).finally(() => {
                setLoading(false);
            })
        }
        setLoading(false);

    }

    const handleShowFileInput = (e) => {
        const { id } = e.target
        console.log(id);
        setShow({
            ...show,
            [id]: false
        })
    }


    const handleFileChange = (e) => {
        const { name, files } = e.target

        set_GI_Files({
            ...GI_Files,
            [name]: [...files]
        })


        // if(!GI_Files[name]) setShow({...show,[name]:true})

    }
    const cancel_fileChange = (e) => {
        const { id } = e.target
        setShow({
            ...show,
            [id]: true
        })
    }
    const [error, set_error] = useState({

        natureOfCompany: {
            status: false,
            msg: ""
        },
        gstNo: {
            status: false,
            msg: ""
        },
        pan: {
            status: false,
            msg: ""
        },
        categoryOfUnit: {
            status: false,
            msg: ""
        },

    })




    return (

        <form onSubmit={update_GI}>
            <div className='row'>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Name of the Vendor</p>
                        <input value={obj?.vendorName} disabled type="text" className="form-control" />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Descriptive Name of Item </p>
                        <input type="text" id='productName' onChange={handle_field_Change} className="form-control" disabled value={obj?.productName} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Brand Name of Item</p>
                        <input required disabled={mode === 1} id='brandName' type="text" onChange={handle_field_Change} className="form-control" value={obj?.brandName} />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="from-each-div">
                        <p className="from-label-p">Registered Office Address</p>
                        <input type="text" className="form-control" value={obj?.officeAddress} disabled />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Telephone Landline </p>
                        <input value={obj?.landLineNo} type="text" className="form-control" disabled />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Mobile</p>
                        <input type="text" disabled className="form-control" value={obj?.mobileNo} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">E-mail </p>
                        <input type="email" disabled className="form-control" value={obj?.emailId} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Web Address </p>
                        <input type="text" className="form-control" value={obj?.webSite} disabled />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Nature of Company<span className='text-danger fs-5'>*</span>
                            {(mode === 3 ? check?.natureOfCompany : !show?.natureOfCompany) && <span>File: Please upload Factory License</span>}</p>

                        <select required onChange={(e) => handle_field_Change(e)} className="form-control" value={obj?.natureOfCompany} id='natureOfCompany' >
                            <option value={""}>-- Select --</option>
                            <option value={1}>Sole Proprietorship</option>
                            <option value={2}>Partnership</option>
                            <option value={3}>Private Limited</option>
                            <option value={4}>Public Sector</option>
                        </select>
                        {(mode !== 3 && show.natureOfCompany) ?
                            <div className='file-div'>

                                <Smalltag handleClick={() =>
                                    window.open(
                                        process.env.REACT_APP_BASE_URL + obj.fileDtls[0]?.fileUri,
                                        "_blank",

                                    )} fontAwsmIcon={"fa-solid fa-file"} lable={" File "} />

                                {mode === 2 && <CancelOutlinedIcon onClick={handleShowFileInput} className='cross-icon' id='natureOfCompany' />
                                }
                            </div> :
                            <>
                                {mode === 3 ?
                                    check.natureOfCompany ?
                                        <input required name='natureOfCompany' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" />
                                        :
                                        ""
                                    :
                                    <input required name='natureOfCompany' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" />}
                                {(mode !== 3) && <ClearIcon className='cross-icon' id="natureOfCompany" onClick={cancel_fileChange} />}
                            </>
                        }


                    </div>
                </div>


                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Category of the Unit<span className='text-danger fs-5'>*</span>
                            {(mode === 3 ? check?.categoryOfUnit : !show?.categoryOfUnit) && <span>File: Please upload Registration Certificate</span>}
                        </p>

                        <select required disabled={mode === 1} value={obj.categoryOfUnit} className="form-control" id="categoryOfUnit" onChange={(e) => handle_field_Change(e)}>
                            <option value={""}>--select--</option>
                            <option value={1}>Micro</option>
                            <option value={2}>Small</option>
                            <option value={3}>Medium</option>
                            <option value={4}>Large</option>
                        </select>
                        {(mode !== 3 && show.categoryOfUnit) ? <div className='file-div'>

                            <Smalltag handleClick={() =>
                                window.open(
                                    process.env.REACT_APP_BASE_URL + obj.fileDtls[1]?.fileUri,
                                    "_blank",

                                )} fontAwsmIcon={"fa-solid fa-file"} lable={" File "} />

                            {mode === 2 && <CancelOutlinedIcon onClick={handleShowFileInput} className='cross-icon' id='categoryOfUnit' />
                            }
                        </div> :
                            <>
                                {mode === 3 ? check.categoryOfUnit ? <input required name='categoryOfUnit' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" /> : ""
                                    : <input required name='categoryOfUnit' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" />}
                                {mode !== 3 && <ClearIcon id='categoryOfUnit' className='cross-icon' onClick={cancel_fileChange} />}
                            </>
                        }

                    </div>

                </div>


                <div className="col-md-4">
                    <div className="from-each-div">
                        <div style={{ display: "flex" }}>
                            <p style={{ marginRight: "10px" }} className="from-label-p">Pan<span className='text-danger fs-5'>*</span> </p>
                            <div className="tooltip"><i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span className="tooltiptext">Please enter pan no then file upload visible</span>
                            </div>
                        </div>

                        <input required id='pan' onChange={(e) => handle_field_Change(e)} value={obj?.pan} type='text' className="form-control" disabled={mode === 1} />
                        {(mode !== 3 && show.pan) ? <div className='file-div'>

                            <Smalltag handleClick={() =>
                                window.open(
                                    process.env.REACT_APP_BASE_URL + obj.fileDtls[3]?.fileUri,
                                    "_blank",

                                )} fontAwsmIcon={"fa-solid fa-file"} lable={" File "} />

                            {mode === 2 && <CancelOutlinedIcon onClick={handleShowFileInput} className='cross-icon' id='pan' />
                            }
                        </div> :
                            <>
                                {mode === 3 ? check.pan ? <input required name='pan' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" /> : ""
                                    : <input required name='pan' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" />}
                                {mode !== 3 && <ClearIcon className='cross-icon' id='pan' onClick={cancel_fileChange} />}
                            </>

                        }

                    </div>

                </div>
                <div className="col-md-4">
                    <div className="from-each-div" name="state">
                        <p className="from-label-p">Select state :<span className='text-danger fs-5'>*</span></p>
                        {/* <input value={obj?.gstState} type="text" className="form-control" disabled={mode=1} /> */}
                        <select required disabled={mode === 1} value={obj?.gstState} className="form-control" id="gstState" onChange={(e) => handle_field_Change(e)} >
                            <option value="">--Select--</option>
                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                            <option value="Daman and Diu">Daman and Diu</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Puducherry">Puducherry</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">GST Registration Number<span className='text-danger fs-5'>*</span></p>

                        <input required onChange={(e) => handle_field_Change(e)} id='gstNo' value={obj?.gstNo} type='text' className="form-control" disabled={mode === 1} />

                        {(mode !== 3 && show.gstNo) ? <div className='file-div'>

                            <Smalltag handleClick={() =>
                                window.open(
                                    process.env.REACT_APP_BASE_URL + obj.fileDtls[2]?.fileUri,
                                    "_blank",

                                )} fontAwsmIcon={"fa-solid fa-file"} lable={" File "} />

                            {mode === 2 && <CancelOutlinedIcon onClick={handleShowFileInput} className='cross-icon' id='gstNo' />
                            }
                        </div> :
                            <>
                                {mode === 3 ? check.gstNo ? <input required name='gstNo' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" /> : ""
                                    : <input required name='gstNo' onChange={handleFileChange} type="file" accept="image/*,.pdf" className="form-control d-inline-block w-auto" />}
                                {mode !== 3 && <ClearIcon id='gstNo' className='cross-icon' onClick={cancel_fileChange} />}
                            </>
                        }

                    </div>

                </div>
                <div className="col-md-4">
                    <div className="from-each-div">
                        <p className="from-label-p">Year of Establishment of the factory<span className='text-danger fs-5'>*</span></p>

                        <input required placeholder='YYYY' onChange={(e) => handle_field_Change(e)} id='estbYear' value={obj?.estbYear} disabled={mode === 1} type='number' className="form-control" />


                    </div>
                </div>
                {msg && <p className='msg'>{msg}</p>}
            </div>
            {mode !== 1 && !save && <div className="col-md-12 text-right">
                {/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}

                <button type='submit' className="Enquiry-btn ml-auto mt-2 btn btn-primary" >{loading ? 'Loading...' : mode === 2 ? 'Update' : 'Save'}</button>




            </div>}
            {save && <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
        </form>



    )
}

export default GeneralInfoCard