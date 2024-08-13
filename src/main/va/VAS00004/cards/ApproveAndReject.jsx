import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ApproveAndReject({approve, set_approve, reasonData, disabledStatus}) {
    const userType = localStorage.getItem("userType")
    // const disabledStatus = (userType!=="H" || userType!=="N" || userType!=="A") || (checkStatus==="A" || checkStatus==="R")


  const handleChange = (event) => {
    set_approve(event.target.value);
  };

  const [reason, setReason] = useState(reasonData)
  const controlProps = (item) => ({
    checked: approve === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });
    return (
        <div className="">
           

            <div>
                <div className="">

                    <FormControl sx={{width: "100%"}}>
                        {/* <FormLabel id="demo-radio-buttons-group-label">Select</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                        >
                            <FormControlLabel  value="A" control={
                                <Radio {...controlProps("A")} disabled={disabledStatus} color="success" />
                            } label="Approve" />

                            <FormControlLabel  value="R" control={
                                <Radio {...controlProps("R")} disabled={disabledStatus} 
                                sx={{color: "#D81B60",'&.Mui-checked': {color: "#D81B60",},}} />
                            } label="Reject" />
                            
                        </RadioGroup>

                        {approve === "A" &&  
                        <div>
                        {!disabledStatus && <FormLabel style={{ color: "red"}} id="demo-radio-buttons-group-label">Please give Approval Memo Number and Date</FormLabel>}
                        <textarea value={reason} onChange={(e)=>setReason(e.target.value)} style={{ minWidth: "100%", minHeight: "100px" }}
                id='rejDtl' placeholder='Give Approval Memo Number and Date' className="form-control d-inline-block w-auto align-top courtCases" disabled={disabledStatus} /></div>}
                  {approve === "R" && 
                  <div>
                  {!disabledStatus && <FormLabel style={{ color: "red"}} id="demo-radio-buttons-group-label">Please give reason as per decission of the committee. This will be notified to the vendor.</FormLabel>}
                  <textarea value={reason} onChange={(e)=>setReason(e.target.value)} style={{ minWidth: "100%", minHeight: "100px" }}
                id='rejDtl' placeholder='Give Reason' className="form-control d-inline-block w-auto align-top courtCases" disabled={disabledStatus} /></div>}
                
                    </FormControl> 

                  


                </div>
            </div>
        </div>
    )
}

export default ApproveAndReject