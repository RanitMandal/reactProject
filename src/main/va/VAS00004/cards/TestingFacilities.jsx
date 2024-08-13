import React, { useState } from 'react'
import Smalltag from "../../../common/SmallTag/smalltag";
import axios from 'axios'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { Link } from 'react-router-dom';
import { fillGenInfoFirst_msg } from './commanDummyData';
function TestingFacilities({ mode, info }) {
	const [loading, setLoading] = useState(false);
	const [save, setSave] = useState(false)
	const [info_obj, set_info_obj] = useState(info? {...info}:{
		applicationNo: "APP/2023/211",
		inHouseTestFlag: "N",
		inHouseTestNameRM: "",
		inHouseTestNameProd: "",
		outSourceTestFlag: "N",
		outSourceTestNameRM: "",
		outSourceTestNameProd: "",
		outHouseTestName: "",
		systemOfNCR: "N",
		systemOfdentification: "N",
		stiFlag: "N",
		bisLicenseNo: "",
		bisLicenseValidity: "",
		isoCertificate9001: "N",
		isoCertificate17025: "N",
		testsDtls: [],
		fileDtls: []
	})
	const [Approval, setApproval] = useState({
		inHouseTestFlag: info_obj?.inHouseTestFlag === "Y" ? true : false,
		inHouseTestNameProd: info_obj?.inHouseTestNameProd ? true : false,
		inHouseTestNameRM: info_obj?.inHouseTestNameRM ? true : false,
		outSourceTestFlag: info_obj?.outSourceTestFlag === "Y" ? true : false,
		outSourceTestNameProd: info_obj?.outSourceTestNameProd ? true : false,
		outSourceTestNameRM: info_obj?.outSourceTestNameRM ? true : false,
		systemOfNCR: info_obj.fileDtls.find(e => e.fileTypeCode === "11") ? true : false,
		systemOfdentification: info_obj.fileDtls.find(e => e.fileTypeCode === "12") ? true : false,
		stiFlag: info_obj.fileDtls.find(e => e.fileTypeCode === "13") ? true : false,
		bisLicenseNo: info_obj.fileDtls.find(e => e.fileTypeCode === "14") ? true : false,
		
		isoCertificate9001: info_obj.fileDtls.find(e => e.fileTypeCode === "15") ? true : false,
		isoCertificate17025: info_obj.fileDtls.find(e => e.fileTypeCode === "16") ? true : false,
	})
	

	const [testFiles, settestFiles] = useState({
		testlab: info_obj?.fileDtls ? info_obj?.fileDtls.filter((f) => f.fileTypeCode === "09") : [],
		outsrclab: info_obj?.fileDtls ? info_obj?.fileDtls.filter((f) => f.fileTypeCode === "10") : [],
		otherFiles : info_obj?.fileDtls ? info_obj?.fileDtls.filter((f) => (f.fileTypeCode !== "09" && f.fileTypeCode !== "10" )) : []
	})

	const [testingTable, settestingTable] = useState(
		{
			testName: "",
			testFrequency: "",
			testMode: "I",
			testEquip: "",
			noOfTest: "",
			makeYear: "",
			validityOfCalibration: "",
			testlab: "NA",
			testlabAddress: "NA",
		}
	)
	const [testingTable2, settestingTable2] = useState(
		{
			testlab: "",
			testlabAddress: "",
			testMode: "O",
			testName: "",
			testFrequency: "",
			noOfTest: "",
			validityOfCalibration: "",
			testEquip: "NA",
			makeYear: "2023",

		}
	)
	const [testingTableRow, settestingTableRow] = useState(
	info_obj?.testsDtls?.filter((item) => item?.testMode === "I").length ?
	info_obj?.testsDtls?.filter((item) => item?.testMode === "I"):  
	[{
		testMode: "I",
		testName: "",
		testFrequency: "",
		testEquip: "",
		noOfTest: "",
		makeYear: "",
		validityOfCalibration: "",
		testlab: "NA",
		testlabAddress: "NA",
	}]
	)
	const [testingTableRow2, settestingTableRow2] = useState(
		info_obj?.testsDtls?.filter((item) => item.testMode === "O")?.length ?
		info_obj?.testsDtls.filter((item) => item.testMode === "O"):
		[{
			testMode: "O",
			testlab: "",
			testlabAddress: "",
			testName: "",
			testFrequency: "",
			noOfTest: "",
			validityOfCalibration: "",
			testEquip: "NA",
			makeYear: "2023",
		}]
	)



	const handletestFileChange = (e) => {
		const { name, files } = e.target
		settestFiles({
			...testFiles,
			[name]: [...files]
		})
	}
	const delete_TF_Files = (i, key) => {
		let list = testFiles[key];
		list.splice(i, 1)
		settestFiles({
			...testFiles,
			[key]: list
		})
	}

	const handleTableInputChange = (e, index) => {
		const { name, value } = e.target
		// const obj = testingTable
		// obj[name] = value;
		// settestingTable({ ...obj })
		let list = testingTableRow;
		list[index] = {
			...list[index],
			[name]: value
		}
		console.log(list, index);
		settestingTableRow([...list])
	}
	const handleTableInputChange2 = (e,index) => {
		const { name, value } = e.target
		// const obj = testingTable2
		// obj[name] = value;
		// settestingTable2({ ...obj })
		let list = testingTableRow2;
		list[index] = {
			...list[index],
			[name]: value
		}
		settestingTableRow2([...list])
	}

	const addTestingTableRow = () => {
		// settestingTableRow(prev => [...prev, { ...testingTable }])
		// console.log(testingTableRow);
		// settestingTable({
		// 	testMode: "I",
		// 	testName: "",
		// 	testFrequency: "",
		// 	testEquip: "",
		// 	noOfTest: "",
		// 	makeYear: "",
		// 	validityOfCalibration: "",
		// 	testlab: "NA",
		// 	testlabAddress: "NA",
		// })
		settestingTableRow([
			...testingTableRow,
			{
				testMode: "I",
				testName: "",
				testFrequency: "",
				testEquip: "",
				noOfTest: "",
				makeYear: "",
				validityOfCalibration: "",
				testlab: "NA",
				testlabAddress: "NA",
			}
		])
	}
	const addTestingTableRow2 = () => {
		// settestingTableRow2(prev => [...prev, { ...testingTable2 }])
		// console.log(testingTableRow2);
		// settestingTable2({
		// 	testMode: "O",
		// 	testlab: "",
		// 	testlabAddress: "",
		// 	testName: "",
		// 	testFrequency: "",
		// 	noOfTest: "",
		// 	validityOfCalibration: "",
		// 	testEquip: "NA",
		// 	makeYear: "2023",
		// })
		settestingTableRow2([
			...testingTableRow2,
			{
				testMode: "O",
				testlab: "",
				testlabAddress: "",
				testName: "",
				testFrequency: "",
				noOfTest: "",
				validityOfCalibration: "",
				testEquip: "NA",
				makeYear: "2023",
			}
		])
	}


	const removeTestingTableRow = (index) => {
		const rows = [...testingTableRow]
		rows.splice(index, 1);
		settestingTableRow([...rows])
	}
	const removeTestingTableRow2 = (index) => {
		const rows = [...testingTableRow2]
		rows.splice(index, 1)
		settestingTableRow2([...rows])
	}



	const reset_TF = (e) => {
		e.preventDefault()
		console.log("resetTF");
		document.getElementById("bisLicenseNo").value = ""

		if (document.getElementById("bisLicenseValidity")) document.getElementById("bisLicenseValidity").value = ""

		document.getElementById("inHouseTestFlag").value = "No"
		document.getElementById("inHouseTestNameProd").value = ""
		document.getElementById("inHouseTestNameRM").value = ""

		document.getElementById("isoCertificate17025").value = "No"
		document.getElementById("isoCertificate9001").value = "No"
		document.getElementById("outSourceTestFlag").value = "No"
		document.getElementById("outSourceTestNameProd").value = ""
		document.getElementById("outSourceTestNameRM").value = ""
		document.getElementById("stiFlag").value = "No"
		document.getElementById("systemOfNCR").value = "No"
		document.getElementById("systemOfdentification").value = "No"

		settestFiles({
			testlab: [],
			outsrclab: []
		})

		setApproval({
			...Approval,
			inHouseTestFlag: false,
			inHouseTestNameProd: false,
			inHouseTestNameRM: false,
			outSourceTestFlag: false,
			outSourceTestNameProd: false,
			outSourceTestNameRM: false,
			systemOfNCR: false,
			systemOfdentification: false,
			stiFlag: false,
			bisLicenseNo: false,
			isoCertificate17025: false,
			isoCertificate9001: false
		})

		settestingTableRow([])
		settestingTableRow2([])

	}

	const [testingMsg, setTestingMsg] = useState(null);
	const handle_testing_table_upload = async () => {
		setTestingMsg(null)

		//tfqc
		const obj = {
			applicationNo: localStorage.getItem("applicationNo"),
			bisLicenseNo: document.getElementById("bisLicenseNo").value,
			bisLicenseValidity: document.getElementById("bisLicenseValidity") ?
				document.getElementById("bisLicenseValidity").value : "",
			fileDetails: [],
			inHouseTestFlag: document.getElementById("inHouseTestFlag").value === "Yes" ? "Y" : "N",
			inHouseTestNameProd: document.getElementById("inHouseTestNameProd").value,
			inHouseTestNameRM: document.getElementById("inHouseTestNameRM").value,
			isoCertificate17025: document.getElementById("isoCertificate17025").value === "Yes" ? "Y" : "N",
			isoCertificate9001: document.getElementById("isoCertificate9001").value === "Yes" ? "Y" : "N",
			outSourceTestFlag: document.getElementById("outSourceTestFlag").value === "Yes" ? "Y" : "N",
			outSourceTestNameProd: document.getElementById("outSourceTestNameProd").value,
			outSourceTestNameRM: document.getElementById("outSourceTestNameRM").value,
			stiFlag: document.getElementById("stiFlag").value === "Yes" ? "Y" : "N",
			systemOfNCR: document.getElementById("systemOfNCR").value === "Yes" ? "Y" : "N",
			systemOfdentification: document.getElementById("systemOfdentification").value === "Yes" ? "Y" : "N",
			vendorAppTestDetailInput: []
		}
		console.log("working2");
		//geting table1 data
		for (let i = 0; i < testingTableRow.length; i++) {
			obj.vendorAppTestDetailInput = [...obj.vendorAppTestDetailInput, {
				makeYear: testingTableRow[i].mny,
				noOfTest: testingTableRow[i].nos,
				testEquip: testingTableRow[i].ecap,
				testFrequency: testingTableRow[i].testfreq,
				testMode: "I",
				testName: testingTableRow[i].test,
				testlab: "NA",
				testlabAddress: "NA",
				validityOfCalibration: testingTableRow[i].nvalid
			}]
		}
		console.log("working3");
		// geting table2 data
		for (let i = 0; i < testingTableRow2?.length; i++) {
			obj.vendorAppTestDetailInput = [...obj.vendorAppTestDetailInput, {
				makeYear: "2023",
				noOfTest: testingTableRow2[i].nos,
				testEquip: "NA",
				testFrequency: testingTableRow2[i].testfreq,
				testMode: "O",
				testName: testingTableRow2[i].test,
				// testSLNo: "",
				testlab: testingTableRow2[i].labName,
				testlabAddress: testingTableRow2[i].labAddress,
				validityOfCalibration: testingTableRow2[i].valid,

			}]
		}

		//geting all files
		let files = {
			inHouseTestFiles: testFiles.testlab,
			outHouseTestFiles: testFiles.outsrclab,

			systemOfNCRFiles: document.getElementById("systemOfNCRFiles") ? [...document.getElementById("systemOfNCRFiles").files] : [],

			systemOfdentificationFiles: document.getElementById("systemOfdentificationFiles") ? [...document.getElementById("systemOfdentificationFiles").files] : [],

			stiFiles: document.getElementById("stiFiles") ? [...document.getElementById("stiFiles").files] : [],

			bisLicenseFiles: document.getElementById("bisLicenseFiles") ? [...document.getElementById("bisLicenseFiles").files] : [],
			isoCertificate9001Files: document.getElementById("isoCertificate9001Files") ? [...document.getElementById("isoCertificate9001Files").files] : [],
			isoCertificate17025Files: document.getElementById("isoCertificate17025Files") ? [...document.getElementById("isoCertificate17025Files").files] : []
		}


		console.log("working4");

		// Validating
		console.log(obj);
		if (obj.inHouseTestFlag === "Y") {
			if (!files.inHouseTestFiles.length) {
				setTestingMsg("Please upload in-House Testing files");
				return
			}
			else {
				for (let i = 0; i < files.inHouseTestFiles.length; i++) {
					if (files.inHouseTestFiles[i].size > 1000 * 1000) {
						setTestingMsg("In in-House Testing files '" + files.inHouseTestFiles[i].name + "' file size exceeded 1MB");
						return
					}
				}
			}

		}
		if ((obj.inHouseTestNameProd || obj.inHouseTestNameRM) && !testingTableRow.length) {
			setTestingMsg("Please add In-House Test Detail in table");
			return
		}
		if (obj.outSourceTestFlag === "Y") {
			if (!files.outHouseTestFiles.length) {
				setTestingMsg("Please upload Out-House Testing files");
				return
			}
			else {
				for (let i = 0; i < files.outHouseTestFiles.length; i++) {
					if (files.outHouseTestFiles[i].size > 1000 * 1000) {
						setTestingMsg("In Out House Test Files '" + files.outHouseTestFiles[i].name + "' file size exceeded 1MB");
						return
					}
				}
			}
		}
		if ((obj.outSourceTestNameProd || obj.outSourceTestNameRM) && !testingTableRow2?.length) {
			setTestingMsg("Please add Out-House Test Detail in table");
			return
		}
		if (obj.systemOfNCR === "Y") {
			if (!files.systemOfNCRFiles.length) {
				setTestingMsg("Please upload System Of NCR files");
				return
			}
			else if (files.systemOfNCRFiles[0].size > 1000 * 1000) {
				setTestingMsg("NCR Certificate '" + files.systemOfNCRFiles[0].name + "' file size exceeded 1MB");
				return
			}
		}
		if (obj.systemOfdentification === "Y") {
			if (!files.systemOfdentificationFiles.length) {
				setTestingMsg("Please upload System Of Identification files");
				return
			}
			else if (files.systemOfdentificationFiles[0].size > 1000 * 1000) {
				setTestingMsg("System Of Identification '" + files.systemOfdentificationFiles[0].name + "' file size exceeded 1MB");
				return
			}
		}
		if (obj.stiFlag === "Y") {
			if (!files.stiFiles.length) {
				setTestingMsg("Please upload Testing & Inspection files");
				return
			}
			else if (files.stiFiles[0].size > 1000 * 1000) {
				setTestingMsg("In Testing & Inspection '" + files.stiFiles[0].name + "' file size exceeded 1MB");
				return
			}
		}
		if (obj.bisLicenseNo) {
			if (!files.bisLicenseFiles.length) {
				setTestingMsg("Please upload BIS/International License files");
				return
			}
			else if (files.bisLicenseFiles[0].size > 1000 * 1000) {
				setTestingMsg("In BIS/International License '" + files.bisLicenseFiles[0].name + "' file size exceeded 1MB");
				return
			}
			if (!obj.bisLicenseValidity) {
				setTestingMsg("Please enter Validity of License");
				return
			}
		}
		if (obj.isoCertificate9001 === "Y") {
			if (!files.isoCertificate9001Files.length) {
				setTestingMsg("Please upload ISO-9001:2005 Certificate files");
				return
			}
			else if (files.isoCertificate9001Files[0].size > 1000 * 1000) {
				setTestingMsg("ISO-9001:2005 Certificate '" + files.isoCertificate9001Files[0].name + "' file size exceeded 1MB");
				return
			}
		}
		if (obj.isoCertificate17025 === "Y") {
			if (!files.isoCertificate17025Files.length) {
				setTestingMsg("Please upload ISO-17025 Certificate files");
				return
			}
			else if (files.isoCertificate17025Files[0].size > 1000 * 1000) {
				setTestingMsg("ISO-17025 Certificate '" + files.isoCertificate17025Files[0].name + "' file size exceeded 1MB");
				return
			}
		}

		setLoading(true)
		//uploading file
		const keys = Object.keys(files)
		for (let i = 0; i < keys.length; i++) {
			if (files[keys[i]].length) {
				for (let j = 0; j < files[keys[i]].length; j++) {
					//files[keys[i]][j]
					let formData = new FormData();
					formData.append("vfile", files[keys[i]][j])
					await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
						if (res.data.code === 0) obj.fileDetails = [...obj.fileDetails, {
							fileTypeCode: i === 0 ? "09" : "" + (i + 9),
							fileUri: res.data.content.fileUri
						}]
						else {
							setTestingMsg("Network issue ! while uploading file, please try to save again")
							setLoading(false)
							return
						}
					}).catch((err) => {
						console.log(err, "err");
						setTestingMsg("Something went wrong! while uploading file, please try to save again")
						setLoading(false)
						return
					})
				}
			}
		}

		console.log(obj);
		// uploading testing table with all file path nd table data
		if ((obj.inHouseTestNameProd || obj.inHouseTestNameRM) || (obj.outSourceTestNameProd || obj.outSourceTestNameRM)) {
			await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/test_info", obj).then((res) => {
				console.log(res.data)
				setLoading(false)
				setTestingMsg("Successfully saved");
				
			}).catch((err) => {
				console.log(err);
				setLoading(false)
			})
		} else {
			setTestingMsg("Please enter data first!");
		}
		setLoading(false)
	}


	const add_file = async (e) => {
		const { name, files } = e.target
		let fileArr = []

		for (let i = 0; i < files.length; i++) {
			let formData = new FormData();
			formData.append("vfile", files[i])
			if (files[i].size > 1000*1000*25) {
				setTestingMsg("In in-House Testing files '" + files[i].name + "' file size exceeded 25MB");
				return
			}
			await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
				if (res.data.code === 0) {
					if (name === "testlab") fileArr = [...fileArr, {
						fileTypeCode: "09",
						fileUri: res.data.content.fileUri,
						name: "File " + (testFiles.testlab.length + 1 + i)
					}]
					else if (name === "outsrclab") fileArr = [...fileArr, {
						fileTypeCode: "10",
						fileUri: res.data.content.fileUri,
						name: "File " + (testFiles.outsrclab.length + 1 + i)
					}]
				}

			}).catch((err) => {
				console.log(err, "err");
			}).finally(()=>{
                setLoading(false);
            })
		}
		console.log(fileArr);
		settestFiles({
			...testFiles,
			[name]: [...testFiles[name], ...fileArr]
		})



	}
	const delete_file = (e, i, fileCode) => {
		if (fileCode === "09") {
			settestFiles({
				...testFiles,
				testlab: testFiles.testlab.filter((item, index) => index !== i)
			})
		}
		if (fileCode === "10") {
			settestFiles({
				...testFiles,
				outsrclab: testFiles.outsrclab.filter((item, index) => index !== i)
			})
		}

	}

	const update_test = async (e) => {
		e.preventDefault()

		const data = {
			applicationNo: localStorage.getItem("applicationNo"),
			bisLicenseNo: info_obj.bisLicenseNo,
			bisLicenseValidity: info_obj.bisLicenseValidity,

			inHouseTestFlag: info_obj.inHouseTestFlag,
			inHouseTestNameProd: info_obj.inHouseTestNameProd,
			inHouseTestNameRM: info_obj.inHouseTestNameRM,
			isoCertificate17025: info_obj.isoCertificate17025,
			isoCertificate9001: info_obj.isoCertificate9001,
			outHouseTestName: info_obj.outHouseTestName,
			outSourceTestFlag: info_obj.outSourceTestFlag,
			outSourceTestNameProd: info_obj.outSourceTestNameProd,
			outSourceTestNameRM: info_obj.outSourceTestNameRM,
			stiFlag: info_obj.stiFlag,
			systemOfNCR: info_obj.systemOfNCR,
			systemOfdentification: info_obj.systemOfdentification,
			fileDetails: [
				...testFiles.testlab,
				...testFiles.outsrclab,
				...testFiles.otherFiles
			].map((item) => {
				return {
					fileDescription: "",
					fileTypeCode: item.fileTypeCode,
					fileUri: item.fileUri
				}
			}),
			vendorAppTestDetailInput: [
				...testingTableRow,
				...testingTableRow2
			].map((item) => {
				return {
					makeYear: item.makeYear,
					noOfTest: item.noOfTest,
					testEquip: item.testEquip,
					testFrequency: item.testFrequency,
					testMode: item.testMode,
					testName: item.testName,
					testlab: item.testlab,
					testlabAddress: item.testlabAddress,
					validityOfCalibration: item.validityOfCalibration
				}
			})
		}

		
		setLoading(true);
		if(info && mode === 2){
			await axios.put(process.env.REACT_APP_BASE_URL + "/api/v1/TestingInfoDetails", data).then((res) => {
				if (res.data.code === 0) 
				//setTestingMsg("Successfully update")
				
				alert("successfully updated");
				else setTestingMsg(res.data?.msg)
			}).catch((err) => {
				setTestingMsg("Error occured")
			}).finally(()=>{
                setLoading(false);
            })
		}else{
			if(!localStorage.getItem("applicationNo")) {
				setLoading(false)
				alert(fillGenInfoFirst_msg)
				return
			}
			await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/test_info", data).then((res) => {
				
				if (res.data?.code === 0 && mode === 3){
					setSave(true)
					alert("successfully "+(mode === 2 ? 'Update': 'Save'));
				}
				else setTestingMsg(res.data?.msg)
			}).catch((err) => {
				setTestingMsg("Error occured")
			}).finally(()=>{
                setLoading(false);
            })
		}
		setLoading(false);
	}

	const showFileInput = (name)=>{
		setApproval({
			...Approval,
			[name]: !Approval[name]
		})
	}

	const UploadFile = async (e, fCode)=>{
		const {name, files} = e.target
		console.log(name, files);

		for (let i = 0; i < files.length; i++) {
			let formData = new FormData();
			formData.append("vfile", files[i])
			if (files[i].size > 1000*1000*25) {
				setTestingMsg("In in-House Testing files '" + files[i].name + "' file size exceeded 25MB");
				return
			}
			await axios.post(process.env.REACT_APP_BASE_URL + "/common/filemgr", formData).then((res) => {
				if (res.data.code === 0) {
					// if (name === "testlab") fileArr = [...fileArr, {
					// 	fileTypeCode: "09",
					// 	fileUri: res.data.content.fileUri,
					// 	name: "File " + (testFiles.testlab.length + 1 + i)
					// }]
					console.log(testFiles.otherFiles);
					const filelist = testFiles.otherFiles.filter((item => item.fileTypeCode !== fCode))
					filelist.push({
						fileTypeCode: fCode,
						fileUri: res.data.content.fileUri,
					})
					settestFiles({
						...testFiles,
						otherFiles: filelist
					})
					console.log(filelist);
					
					setApproval({
						...Approval,
						[name]: true
					})
					
				}else{
					setTestingMsg(res.data?.msg)
				}

			}).catch((err) => {
				console.log(err, "err");
			})
		}
	}

	return (
		<div className="">
			
					<div className='row'>


						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Whether in-House Testing Labs are
									accredited by NABL/Other Govt
									Institution?<select value={info_obj?.inHouseTestFlag} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, inHouseTestFlag: e.target.value })} id='inHouseTestFlag' className='yesno'><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								{
									info_obj.inHouseTestFlag === "Y" &&
									(mode === 1 ? <div className='tag-showcase-box-vertical '>
										{
											testFiles.testlab.map((file, i) => (
												
													<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File " + (i + 1)} key={i} />
											
											))
										}
									</div> :
										<>

											<input multiple type="file" name="testlab" id="testlab" class="inputfile" onChange={add_file} />
											<label for="testlab"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
											{

												testFiles.testlab.map((file, i) => (
													<div className='file-div'>
														
															<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File " + (i + 1)} key={i} />

														
														{!save && <CancelOutlinedIcon onClick={(e) => delete_file(e, i, "09")} className='cross-icon' id='categoryOfUnit' name="testlab" />}
													</div>
												))
											}
										</>)
								}
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Name of in-house tests carried out On Raw Material</p>
								<input disabled={mode === 1} value={info_obj?.inHouseTestNameRM} onChange={(e) => set_info_obj({ ...info_obj, inHouseTestNameRM: e.target.value })} id='inHouseTestNameRM' type="text" className="form-control" title='Name of in-house tests carried out on raw material' />
							</div>
						</div>
						<div className="col-md-4">
							<div className="from-each-div">
								<p className="from-label-p">Name of in-house tests carried out on product</p>
								<input disabled={mode === 1} value={info_obj?.inHouseTestNameProd} onChange={(e) => set_info_obj({ ...info_obj, inHouseTestNameProd: e.target.value })} id='inHouseTestNameProd' type="text" className="form-control" title='Name of in-house tests carried out on products' />
							</div>
						</div>

						<div className="col-md-4 d-none">
							<div className="from-each-div">
								<p className="from-label-p">Details of Tests carried out</p>

							</div>
						</div>

						<div className="col-md-12">
							{(info_obj?.inHouseTestNameProd || info_obj?.inHouseTestNameRM) &&
								<div className="from-each-div">
									<p className="from-label-p">Details of in-House Testing Facilities</p>


									<table className='table w-100 table-bordered dta-tabl new-dtatable'>
										<thead>
											<tr>
												<th className='sno'>S. No</th>
												<th>Test Name</th>
												<th>Testing Frequency</th>
												<th>Equipment with Capacities</th>
												<th>Nos</th>
												<th>Make & Year</th>
												<th>Validity of Calibration</th>
												{mode !== 1 && <th>Action</th>}
											</tr>
										</thead>
										<tbody>
											
											{
												testingTableRow?.map((item, index) => (
													<tr key={index}>
														<td>{index + 1}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item?.testName}
														name='testName'
														className='form-control'
														disabled={mode===1}
														 />}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item?.testFrequency}
														name='testFrequency'
														className='form-control'
														disabled={mode===1}
														 />}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item?.testEquip}
														name='testEquip'
														className='form-control'
														disabled={mode===1}
														 />}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item.noOfTest}
														name='noOfTest'
														className='form-control'
														disabled={mode===1}
														 />}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item?.makeYear}
														name='makeYear'
														className='form-control'
														disabled={mode===1}
														 />}</td>
														<td>{<input 
														onChange={(e)=>handleTableInputChange(e,index)}
														value={item?.validityOfCalibration}
														name='validityOfCalibration'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														{mode !== 1 && 
													<td style={{display:"flex"}}>
															
													{(testingTableRow.length>1)&&<button 
													onClick={(e)=>removeTestingTableRow(index)}><i className="fa-regular fa-trash-can"></i></button>}

													{(index===testingTableRow.length-1)&&
														<button onClick={addTestingTableRow} ><i className="fa-solid fa-plus"></i></button>
													}
													
													
														</td>}
													</tr>
												))
											}
											{/* <p>Errr</p> */}
										</tbody>
									</table>
									
								</div>
							}
							<div className='row mb-4'>
								<div className="col-md-4">
									<div className="from-each-div">
										<p className="from-label-p">Whether the outsourced Labs are accredited by NABL/Other Govt Institution?
											<select value={info_obj?.outSourceTestFlag} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, outSourceTestFlag: e.target.value })} id='outSourceTestFlag' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
										{
											info_obj.outSourceTestFlag === "Y" && (mode === 1 ? <div className='tag-showcase-box-vertical'>
												{
													testFiles.outsrclab.map((file, i) => (
														
															<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File " + (i + 1)} key={i} />
														
													))
												}
											</div> :
												<>

													<input multiple type="file" name="outsrclab" id="outsrclab" class="inputfile" onChange={add_file} />
													<label for="outsrclab"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
													{

														testFiles.outsrclab.map((file, i) => (
															<div className='file-div'>
																
																	<Smalltag
																	handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File " + (i + 1)} key={i} />

																
																{!save && <CancelOutlinedIcon onClick={(e) => delete_file(e, i, "10")} className='cross-icon' id='categoryOfUnit' name="outsrclab" />}
															</div>
														))
													}
												</>)
										}
									</div>
								</div>
								<div className="col-md-4">
									<div className="from-each-div">
										<p className="from-label-p">Name of Test carried out from outsourced on Material</p>
										<input disabled={mode === 1} value={info_obj?.outSourceTestNameRM} onChange={(e) => set_info_obj({ ...info_obj, outSourceTestNameRM: e.target.value })} id='outSourceTestNameRM' type="text" className="form-control" title='Whether the outsourced Labs are accredited by NABL/Other Govt Institution?' />
									</div>
								</div>
								<div className="col-md-4">
									<div className="from-each-div">
										<p className="from-label-p">Name of Test carried out from outsourced on product</p>
										<input disabled={mode === 1} value={info_obj?.outSourceTestNameProd} onChange={(e) => set_info_obj({ ...info_obj, outSourceTestNameProd: e.target.value })} id='outSourceTestNameProd' type="text" className="form-control" title='Name of in-house tests carried out on products' />
									</div>
								</div>
							</div>
						</div>

						{(info_obj?.outSourceTestNameProd || info_obj?.outSourceTestNameRM) &&
							<div className="col-md-12">
								<div className="from-each-div">
									<p className="from-label-p">Details of Tests carried out from outsourced Labs :</p>


									{/* //Table */}
									<table className='table w-100 table-bordered dta-tabl'>
										<thead>
											<tr>
												<th className='sno'>S. No</th>
												<th>Lab Name</th>
												<th>Lab Address</th>
												<th>Test</th>
												<th>Testing Frequency</th>
												<th>Nos</th>
												<th>Validity of Calibration</th>
												{mode !== 1 && <th>Action</th>}
											</tr>
										</thead>
										<tbody>										
											{
												testingTableRow2?.map((item, index) => (
													<tr key={index}>
														<td>{index + 1}</td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.testlab}
														name='testlab'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.testlabAddress}
														name='testlabAddress'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.testName}
														name='testName'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.testFrequency}
														name='testFrequency'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.noOfTest}
														name='noOfTest'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														
														<td>{<input 
														onChange={(e)=>handleTableInputChange2(e,index)}
														value={item?.validityOfCalibration}
														name='validityOfCalibration'
														className='form-control'
														disabled={mode===1}
														 />}
														 </td>
														{mode !== 1 && <td style={{display:"flex"}}>
															
															{(testingTableRow.length>1)&&<button 
															onClick={(e)=>removeTestingTableRow2(index)}><i className="fa-regular fa-trash-can"></i></button>}
		
															{(index===testingTableRow.length-1)&&
																<button onClick={addTestingTableRow2} ><i className="fa-solid fa-plus"></i></button>
															}
															
															
																</td>}
													</tr>
												))
											}
										</tbody>
									</table>
								</div>
							</div>}
						<div className='col-md-12'>
							<div className='row mt-3'>
								<div className={info_obj.systemOfNCR === "Y" ? 'col-md-7' : 'col-md-12'}>
									<p className="from-label-p">System of NCR (Non-Conformity Report)Disposal and details of Corrective Actions (Separate Sheet to be attached along withnof NCR. if an)
										<select value={info_obj?.systemOfNCR} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, systemOfNCR: e.target.value })} id='systemOfNCR' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								</div>
								{info_obj.systemOfNCR === "Y" && <div className='col-md-5'>
									{mode === 1 ?
										info_obj?.fileDtls.map((file, i) => (
											file.fileTypeCode === "11" &&
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
											
										))
										:
										 <>
										{Approval.systemOfNCR ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "11" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("systemOfNCR")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div  
										 className="from-each-div"><input onChange={(e)=>UploadFile(e, "11")}
										 name="systemOfNCR" id='systemOfNCRFiles' type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
								</div>}
							</div>
							<div className='row mt-3'>
								<div className={info_obj.systemOfdentification === "Y" ? 'col-md-7' : 'col-md-12'}>
									<p className="from-label-p">System of Identification & Traceability of materials & processed components (Separate Sheet to be attached)<select value={info_obj?.systemOfdentification} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, systemOfdentification: e.target.value })} id='systemOfdentification' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								</div>

								{info_obj.systemOfdentification === "Y" &&
									<div className='col-md-5'>
										{mode === 1 ?
											testFiles.otherFiles.map((file, i) => (
												file.fileTypeCode === "12" &&
												
													<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
												
											))
											: <>
										{Approval.systemOfdentification ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "12" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("systemOfdentification")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div className="from-each-div"><input id='systemOfNCRFiles' onChange={(e)=>UploadFile(e, "12")}
										 name="systemOfdentification" type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
									</div>}

							</div>
							<div className='row mt-3'>
								<div className={info_obj.stiFlag === "Y" ? 'col-md-7' : 'col-md-12'}>
									<p className="from-label-p">Testing & Inspection carried out as per STI (System of Testing and Inspection) of related 15 Standard International Standards (Procedure & Records in this regard to be attached to seperate sheets(s))<select value={info_obj?.stiFlag} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, stiFlag: e.target.value })} id='stiFlag' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								</div>

								{info_obj.stiFlag === "Y" &&
									<div className='col-md-5'>
										{mode === 1 ?
											info_obj?.fileDtls.map((file, i) => (
												file.fileTypeCode === "13" &&
												
													<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											))
											: <>
										{Approval.stiFlag ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "13" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("stiFlag")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div className="from-each-div"><input 
										onChange={(e)=>UploadFile(e, "13")}
										 name="stiFlag" id='systemOfNCRFiles' type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
									</div>}

							</div>
							<div className='row mt-3'>
								<div className='col-md-7'>
									<p className="from-label-p">BIS/International License Numberr(Copy of the certificate(s) to be attached)</p>
								</div>
								<div className='col-md-5'>
									<div className='row'>
										<div className='col-md-5'>
											<div className="from-each-div">
												<input disabled={mode === 1} value={info_obj?.bisLicenseNo} onChange={(e) => set_info_obj({ ...info_obj, bisLicenseNo: e.target.value })} id='bisLicenseNo' type="text" className="form-control" /></div>
										</div>
										{info_obj.bisLicenseNo && <div className='col-md-7'>
											{mode === 1 ?
												info_obj?.fileDtls.map((file, i) => (
													file.fileTypeCode === "14" &&
													
														<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
													
												))
												: <>
										{Approval.bisLicenseNo ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "14" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("bisLicenseNo")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div className="from-each-div"><input onChange={(e)=>UploadFile(e, "14")}
										 name="bisLicenseNo" id='systemOfNCRFiles' type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
										</div>}
									</div>

								</div>
							</div>
							{info_obj.bisLicenseNo &&
								<div className='row mt-3'>
									<div className='col-md-7'>
										<p className="from-label-p">Validity of License</p>
									</div>
									<div className='col-md-5'>
										<div className="from-each-div"><input disabled={mode === 1} value={info_obj?.bisLicenseValidity}
											onChange={(e) => set_info_obj({ ...info_obj, bisLicenseValidity: e.target.value })} id='bisLicenseValidity' type="text" className="form-control" /></div>
									</div>
								</div>}

							<div className='row mt-3'>
								<div className={info_obj.isoCertificate9001 === "Y" ? 'col-md-7' : 'col-md-12'}>
									<p className="from-label-p">ISO-9001:2005 Certificate Quality Management System (if any)(Copy of the certificate to be attached)
										<select value={info_obj?.isoCertificate9001} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, isoCertificate9001: e.target.value })} id='isoCertificate9001' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								</div>
								{info_obj.isoCertificate9001 === "Y" && <div className='col-md-5'>
									{mode === 1 ?
										info_obj?.fileDtls.map((file, i) => (
											file.fileTypeCode === "15" &&
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
											
										))
										: <>
										{Approval.isoCertificate9001 ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "15" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("isoCertificate9001")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div className="from-each-div"><input onChange={(e)=>UploadFile(e, "15")}
										 name="isoCertificate9001" id='systemOfNCRFiles' type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
								</div>}
							</div>
							<div className='row mt-3'>
								<div className={info_obj.isoCertificate17025 === "Y" ? 'col-md-7' : 'col-md-12'}>
									<p className="from-label-p">ISO-17025 Certificate [Testing and Calibration] (if any) Copy of the certificate to be attached)
										<select value={info_obj?.isoCertificate17025} disabled={mode === 1} onChange={(e) => set_info_obj({ ...info_obj, isoCertificate17025: e.target.value })} id='isoCertificate17025' className="yesno"><option value={"N"}>No</option><option value={"Y"}>Yes</option></select></p>
								</div>
								{info_obj.isoCertificate17025 === "Y" &&
									<div className='col-md-5'>
										{mode === 1 ?
											info_obj?.fileDtls.map((file, i) => (
												file.fileTypeCode === "16" &&
												
													<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} wd={"100px"} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											))
											: <>
										{Approval.isoCertificate17025 ?
											testFiles.otherFiles.map((file, i) => (
											file.fileTypeCode === "16" &&
											<div className='file-div'>
											
												<Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL + file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={" File"} key={i} />
												
											
											{!save && <CancelOutlinedIcon  onClick={(e)=>showFileInput("isoCertificate17025")}   className='cross-icon' id='categoryOfUnit'  />}
											</div>
										)):
										<div className="from-each-div"><input onChange={(e)=>UploadFile(e, "16")}
										 name="isoCertificate17025" id='systemOfNCRFiles' type="file" accept="image/*,.pdf, .zip" className="form-control" /></div>}
										</>}
									</div>}
							</div>
						</div>
						{testingMsg && <p style={{ color: "red", textAlign: "center" }}>{testingMsg}</p>}
						
						{mode !== 1 && !save &&  <div className="col-md-12 text-right">

						{/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}
							<button onClick={update_test} className="Enquiry-btn ml-auto mt-2 btn btn-primary">{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>
						</div>}
						{save && <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
					</div>
				
		</div>
	)
}

export default TestingFacilities