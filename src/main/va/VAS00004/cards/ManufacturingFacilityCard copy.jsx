import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Smalltag from "../../../common/SmallTag/smalltag";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle  } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { fillGenInfoFirst_msg } from "./commanDummyData";



function ManufacturingFacilityCard({ mode, info, setSubmitCond, submitCond }) {
  console.log("mf_rendered");
	// const [mf_msg, set_mf_msg] = useState(null)
	const formatDate = (month, year)=>{
		if(month <10) return year+"-0"+month
		else return year+"-"+month
	}
	const [loading, setLoading] = useState(false); 
	const [obj, setObj] = useState(info?{...info,
		date: formatDate(info?.prodStartMonth, info?.prodStartYear)}:{
			applicationNo: localStorage.getItem("applicationNo"),
			factoryAddress: "",
			landLineNo: "",
			emailId: "",
			prodStartYear: 0,
			prodStartMonth: 0,
			factLoad: "",
			yearlyProductionCapacity: "",
			contactDtls: [],
			fileDtls: []
		})
	const [arr, setArr] = useState({
		MR_file: [],
		AM_file: [],
		DE_file: [],
		contactDtls: []
	});

	const [save, setSave] = useState(false)
	let MR_file = useMemo(() => obj?.fileDtls?.filter((item)=>item.fileTypeCode === "06"), []);
	let AM_file = useMemo(() => obj?.fileDtls?.filter((item)=>item.fileTypeCode === "07"), []);
	let DE_file = useMemo(() => obj?.fileDtls?.filter((item)=>item.fileTypeCode === "08"), []);

	useEffect(() => {
		MR_file = MR_file.map((item, i)=>{
			return item = {
				...item,
				name : "File "+(i+1)
			}
		})
		AM_file = AM_file.map((item, i)=>{
			return item = {
				...item,
				name : "File "+(i+1)
			}
		})
		DE_file = DE_file.map((item, i)=>{
			return item = {
				...item,
				name : "File "+(i+1)
			}
		})
	  setArr({
		...arr,
		MR_file,
		AM_file,
		DE_file,
		contactDtls: obj?.contactDtls ? obj.contactDtls : []
	  })
	  
	}, [])
	

	const handle_input_change = (e)=>{
		const {id, value} = e.target;
		setObj({
			...obj,
			[id]: value
		})
	}

	const validate_MF = (dataObj)=>{
		if(!dataObj.factoryAddress){
			alert("Enter Factory Address !")
			return false
		}
		
		if(!dataObj.emailId){
			alert("Enter Email Id !")
			return false
		}
		if(!dataObj.prodStartMonth ){
			alert("Enter Month & Year of Commencement !")
			return false
		}
		if(!dataObj.prodStartYear ){
			alert("Enter Month & Year of Commencement !")
			return false
		}
		console.log(dataObj.factLoad);
		if(!dataObj.factLoad){
			alert("Enter Present Factory Loading !")
			return false
		}
		console.log(dataObj.yearlyProductionCapacity);
		if(!dataObj.yearlyProductionCapacity ){
			alert("Enter Yearly Production Capacity !")
			return false
		}
		console.log(dataObj.vendorAppContactDetailInput.length);
		if(!dataObj.vendorAppContactDetailInput.length){
			alert("Enter Cantact Name and Number !")
			return false
		}
		return true
		

		
	}

	const update_MF = async ()=>{
		
		let dataObj = {
			applicationNo: localStorage.getItem("applicationNo"),
			emailId: obj.emailId,
			factLoad: obj.factLoad,
			factoryAddress: obj.factoryAddress,
			fileDetails: [
				...arr.MR_file,
				...arr.AM_file, 
				...arr.DE_file
			],
			landLineNo: obj.landLineNo,
			prodStartMonth: Number(document.getElementById("date").value.slice(5,7)),
			prodStartYear: Number(document.getElementById("date").value.slice(0,4)),
			vendorAppContactDetailInput: [
				...arr.contactDtls
			],
			yearlyProductionCapacity: obj.yearlyProductionCapacity
		}
		//Field validation
		if(!validate_MF(dataObj)) return
		
		setLoading(true);
		
		if (info && mode === 2) {
			await axios.put(process.env.REACT_APP_BASE_URL+"/api/v1/Manufacility", dataObj).then((res)=>{
			if(res.data.code === 0){
				alert("successfully updated");
				console.log("done");
				setSubmitCond({...submitCond, MF: true})
			}else{
				console.log("sww");
			}
		}).catch((err)=>{
			console.log(err);
		}).finally(()=>{
			setLoading(false);
		})
	}
	else{
		const postdata = {
			...dataObj,
			
			
		}
		if(!localStorage.getItem("applicationNo")) {
			setLoading(false)
            alert(fillGenInfoFirst_msg)
            return
        }
		await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/manufacturingfacility", postdata).then((res) => {
			if (res.data.code === 0){
				setSubmitCond({...submitCond, MF: true})
				if(mode === 3)setSave(true)
				alert("successfully"+(mode === 2 ? 'Update': 'Save'));
				
				
			}

		}).catch((err) => {
			console.log(err);
		}).finally(()=>{
			setLoading(false);
		})
		setLoading(false);
	}
}

	const delete_file = (e, i, fileCode)=>{
		if(fileCode === "06"){
			setArr({
				...arr,
				MR_file: arr.MR_file.filter((item, index)=> index !== i )
			})
		}
		if(fileCode === "07"){
			setArr({
				...arr,
				AM_file: arr.AM_file.filter((item, index)=> index !== i )
			})
		}
		if(fileCode === "08"){
			setArr({
				...arr,
				DE_file: arr.DE_file.filter((item, index)=> index !== i )
			})
		}
	}

	const add_file = async (e)=>{
		//xx
		
		const {name, files} = e.target

		let fileArr = []
		
			for(let i=0; i< files.length; i++){
				let formData = new FormData();
				formData.append("vfile", files[i])
				if(files[i].size > 1000*1000*25 ){
					alert("File '"+files[i].name+"' size Exceeded 25MB !");
					break;
				}
				await axios.post(process.env.REACT_APP_BASE_URL+"/common/filemgr", formData).then((res)=>{
					if(res.data.code === 0) {
						if(name === "MR_file")	fileArr = [...fileArr, {
							fileTypeCode: "06",
							fileUri: res.data.content.fileUri,
							name: "File "+(arr.MR_file.length+1+i)
						} ]
						else if(name === "AM_file")	fileArr = [...fileArr, {
							fileTypeCode: "07",
							fileUri: res.data.content.fileUri,
							name: "File "+(arr.AM_file.length+1+i)
						} ]
						else if(name === "DE_file")	fileArr = [...fileArr, {
							fileTypeCode: "08",
							fileUri: res.data.content.fileUri,
							name: "File "+(arr.DE_file.length+1+i)
						} ]
					}
						
				}).catch((err)=>{
					console.log(err, "err");
				})
			}
			console.log(fileArr);
			setArr({
				...arr,
				[name]: [...arr[name], ...fileArr]
			})
			
		
		
	}
	const addContact = (e)=>{
		let err = false
		const contactPerson = document.getElementById("contactPerson").value
		const contactMobileNo = document.getElementById("contactMobileNo").value
		console.log(contactMobileNo.length);
		if(!contactPerson){ 
			err = true
			alert("Please enter Person Name")
		}
		if(!contactMobileNo || contactMobileNo.length !== 10){
			err = true
			alert("Please enter valid Contact Number")
			
		}
		!err && setArr({
			...arr,
			contactDtls: [...arr.contactDtls, {
				contactPerson: contactPerson,
				contactMobileNo: contactMobileNo,
				contactSrNo: (arr.contactDtls.length+1)+""
			}]
		})
	}

	const delContact = (i)=>{
		let list = arr.contactDtls
		list.splice(i,1)
		setArr({
			...arr,
			contactDtls: [...list]
		})
	}

  return (
    
      <>
       
       <div className="">
			

			
				<div className="">
					<div className='row'>
						<div className="col-md-8">
							<div className="from-each-div">
								<p className="from-label-p">Factory Address<spna className='text-danger fs-5'>*</spna> </p>
								<input onChange={handle_input_change} id='factoryAddress' disabled={mode === 1} value={obj?.factoryAddress} type="text"  className="form-control" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Telephone Landline </p>
								<input onChange={handle_input_change} value={obj?.landLineNo} disabled={mode === 1} id='landLineNo' type="text" className="form-control" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">E-mail </p>
								<input onChange={handle_input_change} id='emailId' value={obj?.emailId} disabled={mode === 1} type="text" className="form-control" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Month & Year of Commencement<spna className='text-danger fs-5'>*</spna> </p>
								{mode === 1 ? <input className="form-control" disabled type='text' value={obj?.prodStartMonth + "/" + obj?.prodStartYear} /> : <input value={obj.date}  onChange={handle_input_change} id="date" type="month" />}
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<div className='mf-factloading'>
									<p className="from-label-p">{"Present Factory Loading (%)"}<spna className='text-danger fs-5'>*</spna></p>
									<div className="tooltip"> <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
										<span className="tooltiptext">{"(Present Capacity / Installed Capacity)*100"}</span>
									</div>
								</div>
								<input onChange={handle_input_change} id='factLoad'  value={obj?.factLoad} disabled={mode === 1} type="number" className="form-control" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Yearly Production Capacity<spna className='text-danger fs-5'>*</spna> </p>
								<input onChange={handle_input_change} id='yearlyProductionCapacity' value={obj?.yearlyProductionCapacity} disabled={mode === 1} type="text" className="form-control" />
							</div>
						</div>


						<div className='col-md-8'>
							<div className="row">
								<table className='table w-100 table-bordered dta-tabl new-dtatable'>
									<thead>
										<tr>
											<th>Name of contact person(s) in Factory<spna className='text-danger fs-5'>*</spna></th>
											<th>Mobile Number(s)<spna className='text-danger fs-5'>*</spna></th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
									<tr >
													<td>
													<input 
											  className='form-control' type='text' id='contactPerson'/>
													</td>
													<td><input 
											  className='form-control' type='text' id='contactMobileNo'/></td>
													
													<td>
											<button onClick={addContact} className='contact-action-btn'><i className="fa-solid fa-plus"></i></button>
										</td>
													
												</tr>
										{
											
											arr?.contactDtls?.map((item, i)=>(
												<tr key={i}>
													<td>{item?.contactPerson}</td>
													<td>{item?.contactMobileNo}</td>
													<td><button 
													onClick={(e)=>delContact(i)}className='contact-action-btn'><i className="fa-regular fa-trash-can"></i></button></td>
												</tr>
											))
										}
										
									</tbody>
								</table>

							</div>


						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Manufacturing Range:
									Item wise List of different sizes and
									classes with production capacities to be
									attached as separate sheet</p>
									<div className='tag-showcase-box-vertical '>
									{mode ===1 ?
									MR_file.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                       
									)):
									<>
									
									<input multiple type="file" accept='.pdf' name="MR_file" id="MR_file" class="inputfile" onChange={add_file} />
<label for="MR_file"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											arr.MR_file.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                        
										{!save && <CancelOutlinedIcon onClick={(e)=>delete_file(e, i, "06")}  className='cross-icon' id='categoryOfUnit'  />}
										</div>
									))
										}
									</>
									}
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Adequacy of Manufacturing Facilities:
									List of major machinery installed for
									production to be attached as separate
									sheet (with certification)</p>
									<div className='tag-showcase-box-vertical '>
									{mode ===1 ?
									AM_file.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                        
									)):
									<>
									
									<input multiple type="file" accept='.pdf' name="AM_file" id="AM_file" class="inputfile" onChange={add_file} />
<label for="AM_file"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											arr.AM_file.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                      
										{!save && <CancelOutlinedIcon onClick={(e)=>delete_file(e, i, "07")}   className='cross-icon' id='categoryOfUnit'  />}
										</div>
									))
										}
									</>
									}
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Details of Engineers & other technical
									staffs engaged to be attached as
									separate sheet </p>


									<div className='tag-showcase-box-vertical '>
									{mode ===1 ?
									DE_file.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                       
									)):
									<>
									
									<input type="file" accept='.pdf' name="DE_file" id="DE_file" class="inputfile" multiple onChange={add_file} />
<label for="DE_file"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											arr.DE_file.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                     
										{!save && <CancelOutlinedIcon onClick={(e)=>delete_file(e, i, "08")}  className='cross-icon' id='categoryOfUnit'  />}
										</div>
									))
										}
									</>
									}
								</div>


							</div>
						</div>
						<div className="col-md-12 text-center">

						</div>



					</div>
					{mode !==1 && !save &&  <div className="col-md-12 text-right">
					
					{/* {mf_msg && <p style={{color: "red", textAlign:"center"}}>{mf_msg}</p>} */}
          {/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}
							<button onClick={update_MF} className="Enquiry-btn ml-auto mt-2 btn btn-primary" >{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>
								
							
					</div>}
					{save && <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
				</div>
			
		</div>
       
      </>
    
  );
}

export default ManufacturingFacilityCard;
