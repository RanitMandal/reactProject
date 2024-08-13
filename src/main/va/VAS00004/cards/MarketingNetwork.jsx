import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { fillGenInfoFirst_msg } from './commanDummyData';

function MarketingNetwork({ info, mode }) {
    const [loading, setLoading] = useState(false);
    const [marketingNetwork, setMarketingNetwork] = useState(info?.mrkList?.length? info?.mrkList :[{
        address: "",
        contactNumber: "",
        dealerDistributerName: "",
        location: "",
        mktSLNo: ""
    }])
    const [save, setSave] = useState(false)
    
    const addMoreMarketingNetworkRow = () => {
        let arr = marketingNetwork;
        setMarketingNetwork([...arr, {
            dealerDistributerName: "",
            location: "",
            contactNumber: "",
            address: ""
        }])
    }

    const removeMarketingNetworkRow = (index) => {
        const list = [...marketingNetwork]
        list.splice(index, 1)
        setMarketingNetwork(list)
    }


    const [marketingTableMsg, set_MarketingTableMsg] = useState(null);
    const reset_MN = () => {
        console.log("reser_MN");
        setMarketingNetwork([
            {
                distributor: "",
                location: "",
                contactNumber: "",
                address: ""
            },
        ])
    }


    const upldate_MN = async (e) => {
        e.preventDefault();
        let err = false;
        let obj = {
            applicationNo: localStorage.getItem("applicationNo"),
            mrkList: []
        }
        for (let i = 0; i < marketingNetwork.length; i++) {
            if (marketingNetwork[i].address && marketingNetwork[i].contactNumber
                && marketingNetwork[i].dealerDistributerName && marketingNetwork[i].location) {
                obj.mrkList = [...obj.mrkList, {
                    address: marketingNetwork[i].address,
                    contactNumber: marketingNetwork[i].contactNumber,
                    dealerDistributerName: marketingNetwork[i].dealerDistributerName,
                    location: marketingNetwork[i].location,
                    
                }]
            } else {
                err = true
            }

        }
        setLoading(true)
        console.log(obj);
        if (!err && obj?.mrkList?.length) {
          if (info?.applicationNo) {
            await axios.put(process.env.REACT_APP_BASE_URL + "/api/v1/MarketingDetails", obj).then((res) => {
                console.log(res.data);
                if (res.data.code === 0) {
                    //set_MarketingTableMsg("Successfully Saved");
                    alert("successfully updated");
                }
            }).catch((err) => {
                console.log(err);
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
            await axios.post(process.env.REACT_APP_BASE_URL + "/api/v1/marketingnetwork", postdata).then((res) => {
                if (res.data.code === 0){
                    //set_MarketingTableMsg("Successfully Saved");
                    alert("successfully updated");
                    if(mode === 3)setSave(true)
                }
    
            }).catch((err) => {
                console.log(err);
            }).finally(()=>{
                setLoading(false)
            })

        }

        }
        else {
            alert("Please fill all the fields !")
        }
        setLoading(false)
    }

    const handleMarketingNetworkChange = (e, index) => {
        const { name, value } = e.target
        const list = [...marketingNetwork]
        list[index][name] = value;
        setMarketingNetwork(list)
    }
    return (
        <div className="">
            
            
                <div className="">
                    {(mode !== 1 && !save ) && <div className='col-md-12 text-right'><button className="addtag contact-btn ml-0" onClick={addMoreMarketingNetworkRow}><i className="fa fa-plus-circle fsize16" aria-hidden="true"></i> Add</button></div>}
                    <form onSubmit={upldate_MN}>
                        {

                            marketingNetwork.map((item, index) => (
                                <div className='row myrow' key={index}>
                                    <div className='col-md-3'>
                                        <div className="from-each-div"><p className="from-label-p">Dealers/Distributors Name </p>
                                            <input disabled={mode===1} required type="text"
                                                name={'dealerDistributerName'}
                                                onChange={(e) => { handleMarketingNetworkChange(e, index) }}
                                                value={marketingNetwork[index].dealerDistributerName}
                                                className="form-control" /></div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className="from-each-div"><p className="from-label-p">Location</p>
                                            <input disabled={mode===1} required type="text"
                                                name={'location'}
                                                onChange={(e) => { handleMarketingNetworkChange(e, index) }}
                                                value={marketingNetwork[index].location}
                                                className="form-control" /></div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className="from-each-div"><p className="from-label-p">Address</p>
                                            <input disabled={mode===1} required type="text"
                                                name={'address'}
                                                className="form-control"
                                                onChange={(e) => { handleMarketingNetworkChange(e, index) }}
                                                value={marketingNetwork[index].address} /></div>
                                    </div>
                                    <div className='col-md-2'>
                                        <div className="from-each-div"><p className="from-label-p">Mobile</p>
                                            <input disabled={mode===1} required type="number"
                                                name={'contactNumber'}
                                                onChange={(e) => { handleMarketingNetworkChange(e, index) }}
                                                value={marketingNetwork[index].contactNumber}
                                                className="form-control" />
                                        </div>
                                    </div>
                                    {(mode !== 1 && !save )&& <div className='col-md-1 pl-0'>
                                        <button type='button' className="remove-btn" onClick={() => { removeMarketingNetworkRow(index) }}><i className="fa fa-minus-circle" aria-hidden="true"></i></button>
                                    </div>}
                                </div>
                            ))

                        }

                        {mode !== 1 && !save && <div className="col-md-12 text-right">

                            {/* <p style={{ color: "red", textAlign: "center" }}>{marketingTableMsg}</p> */}
                            {/* <button type='button' className="Enquiry-btn mr-3 mt-2 btn btn-secondary mx-1">Reset</button> */}
							{
								<button type='submit' className="Enquiry-btn ml-auto mt-2 btn btn-primary" >{loading ? 'Loading...' : mode === 2 ? 'Update': 'Save'}</button>
								
							}
                        </div>}
                        {save&& <p className="col-md-12 vist-msg text-right" >For futher change, visit edit page</p>}
                    </form>


                </div>
            
        </div>
    )
}

export default MarketingNetwork