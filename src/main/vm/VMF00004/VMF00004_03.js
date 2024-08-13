import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

//import Smalltag from '../SmallTag/smalltag';
import moment from "moment/moment";
import axios, { Axios } from "axios";
import { ToWords } from "to-words";
import { Hidden } from "@mui/material";

function BillPrint({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row, 
  index,
}) {
  let navigate = useNavigate();
  let sno = 1;
  const toWords = new ToWords();
  const location = useLocation();
  const rowData = location.state;
  //print function
  function handlePrint() {
    let body = document.getElementById("body")?.innerHTML;
    let printArea = document.getElementById("printArea")?.innerHTML;
    document.getElementById("body").innerHTML = printArea;
    //document.querySelector(".btn-on-print").style.display = "none";
    window.print();
    document.getElementById("body").innerHTML = body;
    window.location.reload(true);  
  }
 

  //const {  year, num } = useParams();
  //let applicationNum = `APP/${year}/${num}`
  
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const get_All_info_by_iBillNo = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL_PREFIX +
            "/BillController/GetBillByIbillNo?iBillNo=" +
            rowData.iBillNo
        )
        .then((res) => {
          setInfo(res.data.content);
          console.log("info", res.data.content);
        });
    };

    get_All_info_by_iBillNo();
  }, []);

  const getFilesCount = (fileList, fileType) => {
    let count = 0;
    for (let i = 0; i < fileList?.length; i++) {
      if (fileList[i].fileTypeCode === fileType) {
        count++;
      }
    }
    return count;
  };

  const getFinYearCode = (arr, indx) => {
    if (indx >= arr.length) return "NA";
    else return arr[indx].finYearCode;
  };

  const decodeFullForm = (shortForm) => {
    if (shortForm === "Y") return "Yes";
    if (shortForm === "N") return "No";
    return shortForm;
  };

  const decodeBillType = (shortForm) => {
    if (shortForm === "01") return "RA Bill";
    if (shortForm === "02") return "RA & Final";
    if (shortForm === "03") return "First & Final";
    if (shortForm === "1") return "RA Bill";
    if (shortForm === "2") return "RA & Final";
    if (shortForm === "3") return "First & Final";
    return shortForm;
  };

  const decodeMonth = (shortForm) => {
    if (shortForm === 1) return "January";
    if (shortForm === 2) return "February";
    if (shortForm === 3) return "March";
    if (shortForm === 4) return "April";
    if (shortForm === 5) return "May";
    if (shortForm === 6) return "June";
    if (shortForm === 7) return "July";
    if (shortForm === 8) return "August";
    if (shortForm === 9) return "September";
    if (shortForm === 10) return "October";
    if (shortForm === 11) return "November";
    if (shortForm === 12) return "December";
    return shortForm;
  };

  
  return (
    info && (
      <>
         <div id="body" className="print" style={{
      height:"auto", 
      margin:" 0 !important" ,
      padding: "0 !important",
      overflow:"hidden",
      
    }}>
                  <div id="printArea" style={{
      height:"auto",
      width:"1000px",
      margin:"20px auto" ,
      padding: "50px",
      overflow:"hidden",
      backgroundColor:"white"
    }}  >
                  <div style={{marginBottom:"30px", height:"170px"}}>
            <p style={{textAlign:"center"}}>
              {/* <img
                src={require("../../assets/images/brand/logo-3.png")}
                className="mobile-logo logo-1"
                alt="logo"
              /> */}
              </p>
          </div>
                  <div className="row">
                  <h2 className="text-center mb-4">PROFORMA BILL</h2>
                </div>
                    <table className="table w-100 table-nobordered dta-table">
                      <thead>
                        <tr>
                          <td style={{ width: "60%" }}>
                            <b>IPBill No : {info?.iBillNo}</b>
                          </td>
                          <td style={{ width: "40%" }}>
                          { info?.submitedDate &&
                          <p>
                            <b>Date of Submission : </b>
                            {moment(info?.submitedDate).format("DD/MM/YYYY")}
                            </p>}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <b>Division :</b> {info?.divName}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <b>Agency Name : {info?.vendName}</b>
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <b>Agency Code :</b> {info?.vendCd}
                          </td>
                          <td></td>
                        </tr>
                         <tr>
                          <td>
                            <b>Work Order No :</b> {info?.manOrdNo}
                          </td>
                          <td>
                            <b>Work Order Date :</b> {info?.ordDt}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>System Order No :</b> {info?.ordNo}
                          </td>
                          <td></td>
                        </tr>
                       
                        <tr>
                          <td colspan="12">
                            <b>Name of Work :</b> {info?.workNm}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Work Order Value (₹) :</b> {info?.ordVal}
                            <br></br>(
                            {info?.ordVal && toWords.convert(info?.ordVal)})
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <b>Bill Type :</b> {decodeBillType(info?.vchTyp)}
                          </td>
                          <td>
                            <b>RA Bill No : </b> 
                            {info?.vchTyp !== "03" && info?.vchTyp !== "3"
                              ? info?.raBillNo
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Agency Reference Number :</b> {info?.vendBillNo}
                          </td>
                          <td>
                            <b>Agency Reference Date : </b> {info?.vendBillDt} 
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Amount (₹) : </b> {info?.vendBillVal}
                            <br></br>(
                            {info?.vendBillVal &&
                              toWords.convert(info?.vendBillVal)}
                            )
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <b>Physical Progress(%) :</b> {info?.phyProgPc}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table w-100 table-bordered dta-table">
                      <thead>
                        <tr>
                          <td colspan="12">
                            <b>Document Submitted :</b>
                          </td>
                        </tr>
                        <tr>
                          <th>Sl No.</th>
                          <th>Document Name</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {info?.billdocDtl?.map(
                          (item, index) =>
                              <tr key={index}>
                                <td>{sno++}</td>
                                <td>{item.ibillDocNm}</td>
                                <td>{item.docRmks}</td>
                              </tr>
                        )}
                      </tbody>
                    </table>
                    <table className="table w-100 table-nobordered dta-table">
                      <thead>
                         <tr>
                          <td colSpan={12}>
                            <b>File Attached : </b> 
                            {info?.fildetails.length ? "Yes" : ""} 
                          </td>
                        </tr> 
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {getFilesCount(info?.fildetails) + " Attachment(s)"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <b>Signature of Agency with date :</b>
                            </p>
                            <p>
                            <br></br>
                            <br></br>
                          
                            </p>
                            <p style={{textAlign:"center"}}>
                              <b>-------------End of the Report-------------</b>
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* print button */}
              <div className="text-center" style={{marginBottom:"50px"}}>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  onClick={handlePrint}
                >
                  Print
                </button>
                <button
                  className="btn btn-secondary me-2" 
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/BillList` )}
                  type="button"
                 
                >
                  Close
                </button>
              </div>
              
            </div>
        
      </>
    )
  );
}

export default BillPrint;

//components/VendorApplation
