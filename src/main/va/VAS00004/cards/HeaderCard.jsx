import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getApiToken, getScplAdContext } from "../../../common/common"
const headers = { Authorization: 'Bearer ' + getApiToken() };
function HeaderCard({mode,vDeatail,lable, applicationNum, info, setProductCode, disabled, setSelectedProduct, selectedProduct}) {
    const [categoryFlag, setsCategoryFlag] = useState(false);
    const [ProductList, setProductList] = useState([]);
    const [filterProductList, setFilterProductList] = useState([]);
    const [search, setSearch] = useState("")
    console.log("-----------",selectedProduct);

    // useEffect(() => {
    //     let res = ProductList.filter((product)=>{
    //       if(product.productDesc.toLowerCase().match(search.toLowerCase())) return true;
    //       return false
    //     })
    //     setFilterProductList(res)
      
    // }, [search, ProductList])

    const show_product_List = ()=>{
        document.querySelector(".display-list").style.display = "inline-block"
    }

    const handle_select_product = (e)=>{
        let arr = ProductList
        let index = e.target.value
        setSelectedProduct({
            code: arr[index].productCode,
            desc: arr[index].productDesc,
            index: e.target.value
        })
        console.log(e.target.value,arr[index].productDesc);
        //document.querySelector(".display-list").style.display = "none"
        //setSearch(arr[index].productDesc) 
        
    }


    const onChangeCategory= async (e)=>{
        console.log(e.target.value);
		setsCategoryFlag(true);
        let prodCatObj={
            apiId: "VAA00022",
            mst: {
              prodCd: e.target.value
            }
          }
        //setSearch("")
		await axios.post(process.env.REACT_APP_API_URL_PREFIX+'/VAF00002/getProductByProdCd', prodCatObj, {headers}).then(response => {
			if (!response?.data?.appMsgList?.errorStatus){	
                setProductList(response.data.content);
                setSelectedProduct({
                    code: "",
                    desc: "",
                    index: -1
                })
				//setFilterProductList(response.data.content)
			}else{
				console.log("err");
                setProductList([])
			}
        }).catch(error => {
            console.log(error);
        });
        
		
	}
    
  return (

<div className='vendor-box py-2'>
							<div className='row'>
							<div className='col-md-12'> 
							<div className='from-each-div mb-0'>

	    {/* <h2 className='text-center mb-4'>{lable}</h2> */}
	    {/* <p className='vend-name'> Vendor Name : {vDeatail?.vendorName}</p> */}
	    <div className='vendor-box'>					
            <div className='row'>
            
            {mode !== 3 && <div className='col-md-4'> 
                    <div className='from-each-div mb-0'>
                        <p className='from-label-p'>Application No.</p>
                        <div className='p-list'>
                            <input disabled type='text' className='form-control' 
                            value={applicationNum} />
                        </div>
                    </div>                    
                </div>}
                <div className='col-md-4'>  
                    <div className='from-each-div mb-0'>
                        <p className='from-label-p'>Select the product category</p>
                        {
                            disabled?
                            <input disabled={disabled} type='text' className='form-control' 
                            value={info?.productCategory === "C"? "Civil": "Mechanical/Electrical"} />
                            :
                            <select className="form-control" 
							name='category' id='category'
								onChange={onChangeCategory}>
								<option>--Select--</option>
								<option value='C'>Civil</option>
								<option value='M'>Mechanical/Electrical</option>
							</select>
                        }
                    </div>	
                </div>

                <div className='col-md-4'> 
                    <div className='from-each-div mb-0'>
                        <p className='from-label-p'>Applying for which Product</p>
                        <div className='p-list'>
                            {disabled?
                            <input disabled={disabled} type='text' className='form-control' 
                            value={info?.productName} />
                            :
                            <select required disabled={mode===1} value={selectedProduct?.index} className="form-control" id="gstState" onChange={handle_select_product} >
							<option value={-1}>--Select--</option>
							{
                                ProductList?.map((prod,i)=>(
                                    <option value={i}>{prod?.productDesc}</option>
                                ))

                            }
							</select>
                            }
                        </div>
                        
                        {/* <div className='display-list col-md-11'>
                        {
                            filterProductList.map((result, i)=>(
                                <div key={i}>
                                <p className='p-option' onClick={(e)=>handle_select_product(e, i)} name={result.productCode} >{result.productDesc}</p>
                                <hr></hr>
                                </div>
                            ))
                            }
                        </div> */}
                    </div>                    
                </div>
            </div>
		</div>

        </div>	
        </div>
        </div>
        </div>			
  )
}

export default HeaderCard