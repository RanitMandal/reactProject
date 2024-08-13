import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { fillGenInfoFirst_msg } from './commanDummyData';

function AfterSaleService({info, mode}) {
    
    const [row, setRow] = useState(info?.noOfServiceCenter ? Number(info.noOfServiceCenter): 0)
	const [row2, setRow2] = useState(info?.floatingServiceIndia ? Number(info.floatingServiceIndia) : 0)
    const [afterSaleService, setAfterSaleService] = useState(info?.vendorServiceCenterDetails ? info?.vendorServiceCenterDetails.filter((item)=>{
        return item.serviceCenterType === "1";
    }): []);
	const [afterSaleService2, setAfterSaleService2] = useState(info?.vendorServiceCenterDetails ? info?.vendorServiceCenterDetails.filter((item)=>{
        return item.serviceCenterType === "2";
    }): []);
    const [loading, setLoading] = useState(false);
    const [save, setSave] = useState(false)

    // useEffect(() => {
    //     if(info?.vendorServiceCenterDetails?.length){
    //             setAfterSaleService(info?.vendorServiceCenterDetails.filter((item)=>{
    //             return item.serviceCenterType === "1";
    //         }))
    //             setAfterSaleService2(info?.vendorServiceCenterDetails.filter((item)=>{
    //             return item.serviceCenterType === "2";
    //         }))
    //     }

    // }, [])
    

    useEffect(()=>{
        let list = [...afterSaleService]
		if(row > list.length){
			let range = row - list.length
			for(let i=0; i<range; i++){
				list = [
					...list, 
					{
                        address: "",
                        landLineNo: "",
                        serviceCenterEmail: "",
                        serviceCenterMobileNo: "",
                        serviceCenterName: "",
                        serviceCenterType: "1"
                    }
				]
			}
            
			setAfterSaleService(list)
		}else if((row < list.length) && row){
            setAfterSaleService(list.slice(0, row))
        }
    
	}, [row])
    // const rowChannge1 = (e)=>{
    //     const num = Number(e.target.value)
        
    //     let list = [...afterSaleService]
    //     if(e.target.value)
    //     if(num > row){
			
	// 		for(let i=0; i<row; i++){
	// 			list = [
	// 				...list, 
	// 				{
    //                     address: "",
    //                     landLineNo: "",
    //                     serviceCenterEmail: "",
    //                     serviceCenterMobileNo: "",
    //                     serviceCenterName: "",
    //                     serviceCenterType: "1"
    //                 }
	// 			]
	// 		}
	// 		setAfterSaleService(list)
    //         setRow(Number(e.target.value))
	// 	}else{
    //         setAfterSaleService(list.slice(0, num))
    //         setRow(Number(e.target.value))
    //     }

        
    // }
	useEffect(()=>{
		let list = [...afterSaleService2]
		if(row2 > list.length){
			let range = row2 - list.length
			for(let i=0; i<range; i++){
				list = [
					...list, 
					{
                        address: "",
                        landLineNo: "",
                        serviceCenterEmail: "",
                        serviceCenterMobileNo: "",
                        serviceCenterName: "",
                        serviceCenterType: "2"
                    }
				]
			}
            
			setAfterSaleService2(list)
		}else if((row2 < list.length) && row2){
            setAfterSaleService2(list.slice(0, row2))
        }
	}, [row2])

    const handle_rowChange = (e)=>{
        // let newRow = e.target.value
        // if(row < newRow)
        // setAfterSaleService([...afterSaleService,{

        // }])
    }


    // const [afterSale_Msg, set_afterSale_Msg] = useState(null);


    const validate_ASS = (dataObj)=>{
        for(let i=0; i<dataObj.length; i++){
            if(dataObj[i].landLineNo.length >10 ){
                if(i<row)
                alert("Check After Sales Service Centers: Landline number must be in 10 digit")
                else
                alert("Check Floating service Unit: Landline number must be in 10 digit")
                return false
            }
            if( dataObj[i].serviceCenterMobileNo.length !== 10 ){
                if(i<row)
                alert("Check After Sales Service Centers: Mobile Number number must be in 10 digit")
                else
                alert("Check Floating service Unit: Mobile Number number must be in 10 digit")
                return false
            }
        }
        return true
    }

    const ass_update = async (e)=>{
        e.preventDefault()
        let obj = {
            applicationNo: localStorage.getItem("applicationNo"),
            noOfServiceCenter: afterSaleService.length,
            floatingServiceIndia: afterSaleService2.length,
            vendorServiceCenterDetails: [
                ...afterSaleService,
                ...afterSaleService2
            ]
        }

        if(!validate_ASS(obj?.vendorServiceCenterDetails) ) return 
        setLoading(true)
       if (info && mode === 2) { 
        await axios.put(process.env.REACT_APP_BASE_URL+"/api/v1/assinfo", obj).then((res)=>{
            if(res.data.code === 0){
                //alert("successfully updated");
                alert("successfully updated");
                console.log("done")
                console.log(res.data)
            }else{
                console.log("sww")
                console.log(res.data)
            }
        }).catch((err)=>{
            console.log("err")
        }).finally(()=>{
            setLoading(false)
        })
    }

    else{
        const postdata = {
            ...obj,
           
        }
        if(!localStorage.getItem("applicationNo")) {
			setLoading(false)
            alert(fillGenInfoFirst_msg)
            return
        }
        await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/aftersalesservice_info", postdata).then((res) => {
            
            if (res.data.code === 0){
                //alert("successfully updated");
                alert("successfully "+(mode === 2 ? 'Update': 'Save'));
                if(mode === 3)setSave(true)
            }

        }).catch((err) => {
            console.log(err);
            setLoading(false)
        }).finally(()=>{
            setLoading(false)
        })
        setLoading(false)
    }
        
    }
    const ass1_inputChange = (e, i)=>{
        const {name, value} = e.target
        const list = afterSaleService;
        console.log(value, name);
        list[i] = {
            ...list[i],
            [name]: value
        }
        setAfterSaleService([...list])
    }
    const ass2_inputChange = (e, i)=>{
        const {name, value} = e.target
        const list = afterSaleService2;
        list[i] = {
            ...list[i],
            [name]: value
        }
        setAfterSaleService2([...list])
    }
  return (
    <div className="">
                       

                            <div className="">
							<form onSubmit={ass_update} >
								<div className="from-each-div cenNum-div-box ">
									<p className="from-label-p cenNum-p"><b>Number of After Sales Service Centers </b></p>
									<input disabled={(mode===1 || save )} type="number" 
									onChange={(e)=> setRow(e.target.value)}
									value={row}
									className="form-control col-md-1" 
									title='Number of After Sales Service Centers
									available in India '/>
								</div>
								{
									afterSaleService.map((item, index)=>(
								<div className='row' key={index}>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p">Service Center Name </p>
										<input disabled={mode===1} value={item.serviceCenterName} name='serviceCenterName' required
                                        onChange={(e)=>ass1_inputChange(e,index)}
                                        type="text" className="form-control serviceCenterName" title='Number of After Sales Service Centers
										available in India '
										/></div>
									</div>
									<div className='col-md-3'>
										<div className="from-each-div"><p className="from-label-p">Address</p>
										<input disabled={mode===1} value={item.address} name='address' 
                                        onChange={(e)=>ass1_inputChange(e,index)} required type="text" className="form-control address" title='Location and Communication Details(Address, Telephone, Mobile Numbers, E-mail etc) of After Sales Service Centers'
										/></div>
									</div>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p ">Mobile No</p>
										<input disabled={mode===1} value={item.serviceCenterMobileNo} 
                                        onChange={(e)=>ass1_inputChange(e,index)}name='serviceCenterMobileNo' maxLength={"10"} min={"10"} required type="number" className="form-control serviceCenterMobileNo"
										/></div>
									</div>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p ">land No</p>
										<input disabled={mode===1}
                                        onChange={(e)=>ass1_inputChange(e,index)} value={item.landLineNo} name='landLineNo' type="number" className="form-control landLineNo"
										/></div>
									</div>
									<div className='col-md-3'>
										<div className="from-each-div"><p className="from-label-p">Email Id</p>
										<input disabled={mode===1}
                                        onChange={(e)=>ass1_inputChange(e,index)} value={item.serviceCenterEmail} name='serviceCenterEmail' type="text" className="form-control serviceCenterEmail"
										/></div>
									</div>
								</div>
									))
								}

<div className="from-each-div cenNum-div-box mt-4">
									<p className="from-label-p cenNum-p"><b>Number of Floating service Unit </b></p>
									<input disabled={(mode===1 || save )} type="text" 
									onChange={(e)=> setRow2(e.target.value)}
									value={row2}
									className="form-control col-md-1" 
									title='Number of After Sales Service Centers
									available in India '/>
								</div>
								{
									afterSaleService2.map((item, index)=>(
										<div className='row' key={index}>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p">Service Center Name </p>
										<input disabled={mode===1} value={item.serviceCenterName} onChange={(e)=>ass2_inputChange(e,index)}  name='serviceCenterName' required type="text" className="form-control serviceCenterName" title='Number of After Sales Service Centers
										available in India '
										/></div>
									</div>
									<div className='col-md-3'>
										<div className="from-each-div"><p className="from-label-p">Address</p>
										<input disabled={mode===1} onChange={(e)=>ass2_inputChange(e,index)}  value={item.address} name='address' required type="text" className="form-control address" title='Location and Communication Details(Address, Telephone, Mobile Numbers, E-mail etc) of After Sales Service Centers'
										/></div>
									</div>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p ">Mobile No</p>
										<input disabled={mode===1} onChange={(e)=>ass2_inputChange(e,index)}  value={item.serviceCenterMobileNo} name='serviceCenterMobileNo' required type="number" className="form-control serviceCenterMobileNo"
										/></div>
									</div>
									<div className='col-md-2'>
										<div className="from-each-div"><p className="from-label-p ">land No</p>
										<input disabled={mode===1} value={item.landLineNo} onChange={(e)=>ass2_inputChange(e,index)}  name='landLineNo' type="number" className="form-control landLineNo"
										/></div>
									</div>
									<div className='col-md-3'>
										<div className="from-each-div"><p className="from-label-p">Email Id</p>
										<input disabled={mode===1 } onChange={(e)=>ass2_inputChange(e,index)}  value={item.serviceCenterEmail} name='serviceCenterEmail' type="text" className="form-control serviceCenterEmail"
										/></div>
									</div>
								</div>
									))
								}
								{/* afterSale_Msg && <p style={{color: "red", textAlign:"center"}}>{afterSale_Msg}</p> */}
								
								{mode !== 1 && !save && 
                                <div className="col-md-12 text-right p-0">
                                {/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}
							
								<button type='submit' className="Enquiry-btn ml-auto mt-2 btn btn-primary" >{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>
								
							
						    	</div>}
                                {save && <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
								</form>
                            </div>
                       
                    </div>
  )
}

export default AfterSaleService