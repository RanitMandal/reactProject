import React, { useEffect, useState } from 'react'
import Smalltag from "../../../common/SmallTag/smalltag";
import axios from 'axios'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { Link } from 'react-router-dom'
import { fillGenInfoFirst_msg } from './commanDummyData';

function FinancialInfo({mode,info}) {
    const [yr1, set_yr1] = useState([])
	const [yr2, set_yr2] = useState([])
	const [yr3, set_yr3] = useState([])
    const [save, setSave] = useState(false)
	const [obj, setObj] = useState(info?.applicationNo ? {...info}:{
		
			applicationNo: localStorage.getItem("applicationNo"),
			findtl: [
				{
					finSLNo: "1",
					finYearCode: "",
					finDataUnit: "3",
					annualTurnoverGovt: "",
					annualTurnoverPvt: "",
					annualTurnoverProduct: "",
					netAsset: "",
					inventories: "",
					currentLiabilities: "",
					annualTurnover: ""
				},
				{
					finSLNo: "2",
					finYearCode: "",
					finDataUnit: "3",
					annualTurnoverGovt: "",
					annualTurnoverPvt: "",
					annualTurnoverProduct: "",
					netAsset: "",
					inventories: "",
					currentLiabilities: "",
					annualTurnover: ""
				},
				{
					finSLNo: "3",
					finYearCode: "",
					finDataUnit: "3",
					annualTurnoverGovt: "",
					annualTurnoverPvt: "",
					annualTurnoverProduct: "",
					netAsset: "",
					inventories: "",
					currentLiabilities: "",
					annualTurnover: ""
				}
			],
			fileDetails: []
		
	})
    const [loading, setLoading] = useState(false);
    const [yearsFiles, setyearsFiles] = useState({
        y1: obj?.fileDetails? obj?.fileDetails?.filter((f)=> f.fileTypeCode === "17").map((item, i)=>({...item, name: "File "+(i+1)})):[],
        y2: obj?.fileDetails? obj?.fileDetails?.filter((f)=> f.fileTypeCode === "18").map((item, i)=>({...item, name: "File "+(i+1)})):[],
        y3: obj?.fileDetails? obj?.fileDetails?.filter((f)=> f.fileTypeCode === "19").map((item, i)=>({...item, name: "File "+(i+1)})):[],
    })
	const getYear = (value)=>{
		console.log(value);
		let min = Number(value?.slice(0,4));
		let max = new Date().getFullYear()
		let arr = [];
		for(let i=0; i<2; i++){
			if(min+i+1 < max)arr = [...arr, min+i+1]
		}
		return arr
		// return []
	  }
	
    useEffect(() => {
        let min = new Date().getFullYear()-5;
        let max = new Date().getFullYear()
        let arr = [];
        for(let i=0; i<max-min; i++){
          arr = [...arr, min+i]
        }
        set_yr1(arr)
		
		info?.findtl && set_yr2(getYear(info?.findtl[0]?.finYearCode))
		info?.findtl && set_yr3(getYear(info?.findtl[1]?.finYearCode))
      }, [])
	  
console.log("rerender");
    const handleYearChange1 =(e, value)=>{
		console.log(value);
		let min = value ? value.slice(0,4) : Number(e?.target?.value.slice(0,4));
		let max = new Date().getFullYear()
		let arr = [];
		for(let i=0; i<2; i++){
			if(min+i+1 < max)arr = [...arr, min+i+1]
		}
		const findtl = obj.findtl
		findtl[0] = {
			...obj.findtl[0],
			finYearCode: e?.target?.value
		}
		setObj({
			...obj,
			findtl: findtl
		})
		set_yr2(arr)
	}
    const handleYearChange2 =(e)=>{
		let min = Number(e.target.value.slice(0,4));
		let max = new Date().getFullYear()
		let arr = [];
		for(let i=0; i<1; i++){
			if(min+i+1 < max)arr = [...arr, min+i+1]
		}
		const findtl = obj.findtl
		findtl[1] = {
			...obj.findtl[1],
			finYearCode: e?.target?.value
		}
		setObj({
			...obj,
			findtl: findtl
		})
		set_yr3(arr)
	}
	const handleYearChange3 =(e)=>{

		const findtl = obj.findtl
		findtl[2] = {
			...obj.findtl[2],
			finYearCode: e?.target?.value
		}
		setObj({
			...obj,
			findtl: findtl
		})
	}
    const handleYearsFileChange=(e)=>{
        const {name, files} = e.target
        setyearsFiles({
            ...yearsFiles,
            [name]: [...files]
        })
    }
    const delete_FI_Files= (i, key)=>{
        let list = yearsFiles[key];
        list.splice(i,1)
        setyearsFiles({
            ...yearsFiles,
            [key]: list
        })
    }


    const reset_FI = (e)=>{
        e.preventDefault()
        document.getElementById("yearCode1").value = ""
        document.getElementById("yearCode2").value = ""
        document.getElementById("yearCode2").value = ""
        set_yr2([])
        set_yr3([])
        setyearsFiles({
            ...yearsFiles,
            y1: [],
            y2: [],
            y3: []
        })
        
        for(let i=0; i<3; i++){
            document.querySelectorAll(".annualTurnover")[i].value = ""
            document.querySelectorAll(".annualTurnoverGovt")[i].value = ""
            document.querySelectorAll(".annualTurnoverProduct")[i].value =""
            document.querySelectorAll(".annualTurnoverPvt")[i].value = ""
            document.querySelectorAll(".currentLiabilities")[i].value =""
            document.querySelectorAll(".inventories")[i].value=""
            document.querySelectorAll(".netAsset")[i].value =""
        }
    }
    const [fin_TableMsg, set_fin_TableMsg] = useState(null);
    const handle_finalcial_table_upload= async ()=>{
        let err = false
        // alert(null);
    
        let obj = {
            applicationNo: localStorage.getItem("applicationNo"),
            fileDetails: [],
            findtl:[]
        }
        
        
        if(yr1.length !== 0){
            let yearCode1 = document.getElementById("yearCode1").value
            if(yearCode1 !== "")
            obj.findtl = [...obj.findtl,{
                annualTurnover: Number(document.querySelectorAll(".annualTurnover")[0].value),
                annualTurnoverGovt: Number(document.querySelectorAll(".annualTurnoverGovt")[0].value),
                annualTurnoverProduct: Number(document.querySelectorAll(".annualTurnoverProduct")[0].value),
                annualTurnoverPvt: Number(document.querySelectorAll(".annualTurnoverPvt")[0].value),
                currentLiabilities: Number(document.querySelectorAll(".currentLiabilities")[0].value),
                finDataUnit: "3",
                finSLNo: "",
                finYearCode: document.getElementById("yearCode1").value,
                inventories: Number(document.querySelectorAll(".inventories")[0].value),
                netAsset: Number(document.querySelectorAll(".netAsset")[0].value)
            }]
            else {
                alert("Please select year 1")
                err = true
            }
        }
        if(yr2.length !== 0){
            let yearCode2 = document.getElementById("yearCode2").value
            if(yearCode2 !== "")
            obj.findtl = [...obj.findtl,{
                annualTurnover: Number(document.querySelectorAll(".annualTurnover")[1].value),
                annualTurnoverGovt: Number(document.querySelectorAll(".annualTurnoverGovt")[1].value),
                annualTurnoverProduct: Number(document.querySelectorAll(".annualTurnoverProduct")[1].value),
                annualTurnoverPvt: Number(document.querySelectorAll(".annualTurnoverPvt")[1].value),
                currentLiabilities: Number(document.querySelectorAll(".currentLiabilities")[1].value),
                finDataUnit: "3",
                finSLNo: "",
                finYearCode: document.getElementById("yearCode2").value,
                inventories: Number(document.querySelectorAll(".inventories")[1].value),
                netAsset: Number(document.querySelectorAll(".netAsset")[1].value)
            }]
        }
        if(yr3.length !== 0){
            let yearCode3 = document.getElementById("yearCode3").value
            if(yearCode3 !== "")
            obj.findtl = [...obj.findtl,{
                annualTurnover: Number(document.querySelectorAll(".annualTurnover")[2].value),
                annualTurnoverGovt: Number(document.querySelectorAll(".annualTurnoverGovt")[2].value),
                annualTurnoverProduct: Number(document.querySelectorAll(".annualTurnoverProduct")[2].value),
                annualTurnoverPvt: Number(document.querySelectorAll(".annualTurnoverPvt")[2].value),
                currentLiabilities: Number(document.querySelectorAll(".currentLiabilities")[2].value),
                finDataUnit: "3",
                finSLNo: "",
                finYearCode: document.getElementById("yearCode3").value,
                inventories: Number(document.querySelectorAll(".inventories")[2].value),
                netAsset: Number(document.querySelectorAll(".netAsset")[2].value)
            }]
        }
    
        //ALL year file validation
        console.log(yearsFiles);
        setLoading(true)
        for(let i=0; i<3; i++){
            
            if(yearsFiles["y"+(i+1)].length){
                
                if(yearsFiles["y"+(i+1)].length > 5){
                    alert("Please check "+obj.findtl[i]?.finYearCode+" files, More than 5 files are not allowed");
                    setLoading(false)
                    return
                }else{
                    for(let j=0; j<yearsFiles["y"+(i+1)].length; j++){
                        if(yearsFiles["y"+(i+1)][j].size > 5*1024*1000){
                            alert("Please check "+obj.findtl[i]?.finYearCode+" file '"+yearsFiles["y"+(i+1)][j].name+"' exceeded 5MB");
                            setLoading(false)
                            return
                        }
                    }
                    //ff
                    for(let j=0; j<yearsFiles["y"+(i+1)].length; j++){
                        let formData = new FormData();
                        formData.append("vfile", yearsFiles["y"+(i+1)][j])
                        await axios.post(process.env.REACT_APP_BASE_URL+"/common/filemgr", formData).then((res)=>{
                            if(res.data.code === 0){ 
                                obj.fileDetails = [...obj.fileDetails, {
                                    fileTypeCode: (i+17),
                                    fileUri: res.data.content.fileUri
                                } ]
                            setLoading(false)
                        }
                        }).catch((err)=>{
                            console.log(err, "err");
                            setLoading(false)
                        })
    
                    }
    
                }
            }
        }
        
        
    
        
        // if(!err)
        //     await axios.post(process.env.REACT_APP_BASE_URL+"/api/v1/financialinformation",obj).then((res)=>{
        //         console.log(res.data)
        //         setLoading(false)
        //         alert("Successfully saved");
        //         if(res.data.code === 0) setSave({...save, FI: true})
        //     }).catch((err)=>{
        //         console.log(err);
        //         setLoading(false)
        //     })
        // else alert("Atleast fill for one year")
        setLoading(false)
    
        console.log(obj);
    }

	const table_input_change = (e, i)=>{
		const {name, value} = e.target;
		const findtl = obj.findtl
		findtl[i] = {
			...obj.findtl[i],
			[name]: e.target.value
		}
		
		setObj({
			...obj,
			findtl: findtl
		})
		
	}

	const add_file = async (e)=>{
		const {name, files} = e.target
		console.log("xxxxx",name);
		let fileArr = []
		
			for(let i=0; i< files.length; i++){
				let formData = new FormData();
				formData.append("vfile", files[i])
				await axios.post(process.env.REACT_APP_BASE_URL+"/common/filemgr", formData).then((res)=>{
					if(res.data.code === 0) {
						if(name === "y1")	fileArr = [...fileArr, {
							fileTypeCode: "17",
							fileUri: res.data.content.fileUri,
							name: "File "+(yearsFiles.y1.length+1+i)
						} ]
						else if(name === "y2")	fileArr = [...fileArr, {
							fileTypeCode: "18",
							fileUri: res.data.content.fileUri,
							name: "File "+(yearsFiles.y2.length+1+i)
						} ]
						else if(name === "y3")	fileArr = [...fileArr, {
							fileTypeCode: "19",
							fileUri: res.data.content.fileUri,
							name: "File "+(yearsFiles.y3.length+1+i)
						} ]
					}
						
				}).catch((err)=>{
					console.log(err, "err");
				})
			}
			console.log(fileArr);
			setyearsFiles({
				...yearsFiles,
				[name]: [...yearsFiles[name], ...fileArr]
			})
			
		
		
	}

	const delete_file = (e, i, fileCode)=>{
		if(fileCode === "17"){
			setyearsFiles({
				...yearsFiles,
				y1: yearsFiles.y1.filter((item, index)=> index !== i )
			})
		}
		if(fileCode === "18"){
			setyearsFiles({
				...yearsFiles,
				y2: yearsFiles.y2.filter((item, index)=> index !== i )
			})
		}
		if(fileCode === "19"){
			setyearsFiles({
				...yearsFiles,
				y3: yearsFiles.y3.filter((item, index)=> index !== i )
			})
		}
	}

	const update_FI = async (e)=>{
		e.preventDefault()
		if(!localStorage.getItem("applicationNo")) {
			setLoading(false)
			alert(fillGenInfoFirst_msg)
			return
		}
		const data = {
			...obj,
			applicationNo: localStorage.getItem("applicationNo"),
			fileDetails: [
				...yearsFiles.y1,
				...yearsFiles.y2,
				...yearsFiles.y3,
			]
		}
		setLoading(true);
		// if (info?.applicationNo && mode === 2) { 
			await axios.put(process.env.REACT_APP_BASE_URL+"/api/v1/finnacialinfo", data).then((res)=>{
			console.log(res.data);
			if (res.data.code === 0){
				//alert("successfully updated");
				console.log("mode====> "+mode);
				if(mode === 3) setSave(true)
				alert("successfully "+(mode === 2 ? 'Update': 'Save'));
				
				
			}
		}).catch((err)=>{
			console.error(err);
		}).finally(()=>{
			setLoading(false);
		})
	// }

	// else{
	// 	const postdata = {
	// 		...data,
	// 		fileDetails: [
	// 			...data.fileDetails.map((item)=>{
	// 				return {
	// 					fileTypeCode: item.fileTypeCode,
	// 					fileUri: item.fileUri,
	// 					fileTypeSlNo: "",
	// 					fileDescription: ""
	// 				}
	// 			})
	// 		]
			
	// 	}
	// 	console.log(postdata);
	// 	await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/financialinformation", postdata).then((res) => {
	// 		if (res.data.code === 0){
	// 			//alert("successfully updated");
	// 			alert("successfully "+(mode === 2 ? 'Update': 'Save'));				//
	// 			if(mode === 3)setSave(true)
	// 		}

	// 	}).catch((err) => {
	// 		console.log(err);
	// 	}).finally(()=>{
	// 		setLoading(false);
	// 	})
	// }
	setLoading(false);


	}


  return (
    <div className="">
                        

                      
                            <div className="">
							<div className='row'>
							<p className='f-note'>NOTE: All figures must in lakhs</p>
							<table className='table w-100 table-bordered dta-tabl'>
								<thead>
									<tr>
										<td rowSpan={2}>S. No</td>
										<td rowSpan={2}>Particulars</td>
										<td colSpan={3}>
										Description/details to be filled in by the Vendor
										</td>
									</tr>
									<tr>
										<td>Year 1 
											<select disabled={mode===1}  value={obj?.findtl[0]?.finYearCode} id='yearCode1' onChange={handleYearChange1} className="yesno w-year">
											<option value={""}>{"select year"}</option>
											{
												yr1.map((yr, i)=>(
													<option value={yr+"-"+(yr+1)}>{yr+"-"+(yr+1)}</option>
												))
											}
											</select>
										</td>
										<td>Year 2 <select disabled={mode===1}  value={obj?.findtl[1]?.finYearCode} id='yearCode2' onChange={handleYearChange2} className="yesno w-year">
										<option value={""}>{"select year"}</option>
                                        {<option value={obj?.findtl[1]?.finYearCode}>{obj?.findtl[1]?.finYearCode}</option> }
										{
											yr2.map((yr, i)=>(
												<option>{yr+"-"+(yr+1)}</option>
											))
										}</select></td>
										<td>Year 3 <select onChange={handleYearChange3} disabled={mode===1}  value={obj?.findtl[2]?.finYearCode} id='yearCode3' className="yesno w-year">
										<option value={""}>{"select year"}</option>
                                        {<option value={obj?.findtl[2]?.finYearCode}>{obj?.findtl[2]?.finYearCode}</option> }
										{
											yr3.map((yr, i)=>(
												<option>{yr+"-"+(yr+1)}</option>
											))
										}
										</select></td>
										
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1.</td>
										<td>As per Last 3 (three) Years audited Balance Sheet (attach report)</td>

										<td>
										{mode ===1 ? <div className='tag-showcase-box-vertical under-table'>
									{
									yearsFiles.y1.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                        
									))
									}
								</div>:
                                <>
									
									<input multiple type="file" name="y1" id="y1" class="inputfile" onChange={add_file} />
<label for="y1"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											yearsFiles.y1.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )}  fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                        
										<CancelOutlinedIcon  onClick={(e)=>delete_file(e, i, "17")}   className='cross-icon' id='categoryOfUnit'  />
										</div>
									))
										}
									</>}

										</td>
										
										
                                        <td>
										{mode ===1 ? <div className='tag-showcase-box-vertical under-table'>
									{
									yearsFiles.y2.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                        
									))
									}
								</div>:
								<>
									
									<input multiple type="file" name="y2" id="y2" class="inputfile" onChange={add_file} />
<label for="y2"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											yearsFiles.y2.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                        
										<CancelOutlinedIcon  onClick={(e)=>delete_file(e, i, "18")}   className='cross-icon' id='categoryOfUnit'  />
										</div>
									))
										}
									</>}
										</td>


										<td>
										{mode ===1 ? <div className='tag-showcase-box-vertical under-table'>
									{
									yearsFiles.y3.map((file, i)=>(
                                        
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={"File "+(i+1)} key={i}/>
                                       
									))
									}
								</div>:
								<>
									
									<input multiple type="file" name="y3" id="y3" class="inputfile" onChange={add_file} />
<label for="y3"><i className="fa fa-solid fa-arrow-up-from-bracket"></i> Add file</label>
										{
											
											yearsFiles.y3.map((file, i)=>( 
                                        <div className='file-div'>
										
										    <Smalltag handleClick={() =>
                                  window.open(
                                    process.env.REACT_APP_BASE_URL+file.fileUri,
                                    "_blank",
                                    
                                  )} fontAwsmIcon={"fa-solid fa-file"} lable={file.name} key={i}/>
											
                                        
										<CancelOutlinedIcon  onClick={(e)=>delete_file(e, i, "19")}   className='cross-icon' id='categoryOfUnit'  />
										</div>
									))
										}
									</>}
										</td>



									</tr>
									<tr>
										<td>2.</td>
										<td>Annual Turnover</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='annualTurnover' value={obj?.findtl[0]?.annualTurnover} disabled={mode===1 } type="number" className="form-control annualTurnover" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='annualTurnover' value={obj?.findtl[1]?.annualTurnover}  disabled={mode===1 } type="number" className="form-control annualTurnover" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='annualTurnover' value={obj?.findtl[2]?.annualTurnover}  disabled={mode===1 } type="number" className="form-control annualTurnover" />
										</td>
									</tr>
									<tr>
										<td>3.</td>
										<td>In Govt Sector</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='annualTurnoverGovt' value={obj?.findtl[0]?.annualTurnoverGovt} disabled={mode===1 } type="number" className="form-control annualTurnoverGovt" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='annualTurnoverGovt' value={obj?.findtl[1]?.annualTurnoverGovt} disabled={mode===1 } type="number" className="form-control annualTurnoverGovt" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='annualTurnoverGovt' value={obj?.findtl[2]?.annualTurnoverGovt} disabled={mode===1 } type="number" className="form-control annualTurnoverGovt" />
										</td>
									</tr>
									<tr>
										<td>4.</td>
										<td>In Private Sector</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='annualTurnoverPvt' value={obj?.findtl[0]?.annualTurnoverPvt} disabled={mode===1 }  type="number" className="form-control annualTurnoverPvt" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='annualTurnoverPvt' value={obj?.findtl[1]?.annualTurnoverPvt} disabled={mode===1 }  type="number" className="form-control annualTurnoverPvt" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='annualTurnoverPvt' value={obj?.findtl[2]?.annualTurnoverPvt} disabled={mode===1 }  type="number" className="form-control annualTurnoverPvt" />
										</td>
									</tr>
									<tr>
										<td>5.</td>
										<td>Turnover for the Specific Product</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='annualTurnoverProduct' value={obj?.findtl[0]?.annualTurnoverProduct} disabled={mode===1 } type="number" className="form-control annualTurnoverProduct" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='annualTurnoverProduct' value={obj?.findtl[1]?.annualTurnoverProduct} disabled={mode===1 } type="number" className="form-control annualTurnoverProduct" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='annualTurnoverProduct' value={obj?.findtl[2]?.annualTurnoverProduct} disabled={mode===1 } type="number" className="form-control annualTurnoverProduct" />
										</td>
									</tr>
									<tr>
										<td>6.</td>
										<td>Net Current Assets</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='netAsset' value={obj?.findtl[0]?.netAsset} disabled={mode===1 } type="number" className="form-control netAsset" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='netAsset' value={obj?.findtl[1]?.netAsset} disabled={mode===1 } type="number" className="form-control netAsset" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='netAsset' value={obj?.findtl[2]?.netAsset} disabled={mode===1 } type="number" className="form-control netAsset" />
										</td>
									</tr>
									<tr>
										<td>7.</td>
										<td>Inventories</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='inventories' value={obj?.findtl[0]?.inventories} disabled={mode===1 } type="number" className="form-control inventories" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='inventories' value={obj?.findtl[1]?.inventories} disabled={mode===1 } type="number" className="form-control inventories" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='inventories' value={obj?.findtl[2]?.inventories} disabled={mode===1 } type="number" className="form-control inventories" />
										</td>
									</tr>
									<tr>
										<td>8.</td>
										<td>Current Liabilities</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 0)} name='currentLiabilities' value={obj?.findtl[0]?.currentLiabilities} disabled={mode===1 } type="number" className="form-control currentLiabilities" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 1)} name='currentLiabilities' value={obj?.findtl[1]?.currentLiabilities} disabled={mode===1 }  type="number" className="form-control currentLiabilities" />
										</td>
										<td>
										<input onChange={(e)=>table_input_change(e, 2)} name='currentLiabilities' value={obj?.findtl[2]?.currentLiabilities} disabled={mode===1 }  type="number" className="form-control currentLiabilities" />
										</td>
									</tr>
								</tbody>
								
							</table>

							{/* {fin_TableMsg && <p style={{color: "red", textAlign:"center"}}>{fin_TableMsg}</p>} */}
						{/* {mode === 3 &&
						<div className="col-md-12 text-right">
							<button onClick={reset_FI} className="Enquiry-btn mr-3 mt-2 bg-danger color-wh-important cus-sr-button">Reset</button>
							{save.FI ? <button className="Enquiry-btn ml-auto mt-2 bg-important update-btn color-wh-important cus-sr-button">Save</button>:
							<button onClick={handle_finalcial_table_upload} className="Enquiry-btn ml-auto mt-2 bg-important color-wh-important cus-sr-button">{loading ? 'Loading...' : 'Save'}</button>}
										
						</div>} */}
						{
							mode !== 1 &&  !save &&
							<div className="col-md-12 text-right">

							{/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}

							<button onClick={update_FI} className="Enquiry-btn ml-auto mt-2 btn btn-primary">{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>
										
						</div>
						}
						{save&& <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
	  </div>
                            </div>
                        
                    </div>
  )
}

export default FinancialInfo