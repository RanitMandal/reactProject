import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import Dropzone from "react-dropzone-uploader";
import { useDropzone } from "react-dropzone";
import Smalltag from "../../common/SmallTag/smalltag";
import { Delete, Edit } from "@mui/icons-material";
import { ToWords } from "to-words";
import Lov from "../../common/Lov _new";
import { docLovColumns } from "./columns";
import { faTimes, faSearch, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlert } from 'react-alert'
import { getApiToken } from "../../common/common"
const headers = { Authorization: 'Bearer ' + getApiToken() };

var selectedDivValueStr = "";
var selectedVenCodeStr = "";
var selectedRaBillNoValueStr = "";

const UploadBill = ({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row,
  rowData,
  index,
  fetchTableData,
}) => {
  console.log(rowData);



  const [doc, set_doc] = useState([]);
  const [docChk, setDocChk] = useState([]);
  const toWords = new ToWords();
  const [saveFlag, set_saveFlag] = useState(false);
  const [EditsaveFlag, set_EditsaveFlag] = useState(false);
  let navigate = useNavigate();
  const alert = useAlert()
  const openFile = (uri) => {
    navigate(process.env.REACT_APP_API_URL_PREFIX + uri);
  };
  // alert.show("Something Went Wrong | Contact Adinistrator")

  const getDateInFormart_ddmmyyyy = (yyyymmdd) => {
    console.log(yyyymmdd);
    const date = new Date(yyyymmdd);
    const month =
      Number(date.getMonth()) < 9
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day =
      Number(date.getDate()) < 9 ? "0" + date.getDate() : date.getDate();
    const year = date.getFullYear();
    console.log(`${day}-${month}-${year}`);
    return `${day}-${month}-${year}`;
  };
  const getDateInFormart_yyyymmdd = (ddmmyyyy) => {
    console.log(ddmmyyyy);

    if (ddmmyyyy) {
      const day = ddmmyyyy.slice(0, 2);
      const month = ddmmyyyy.slice(3, 5);
      const year = ddmmyyyy.slice(6, 10);
      console.log(`${year}-${month}-${day}`);
      return `${year}-${month}-${day}`;
    } else return "";
  };

  let date = getDateInFormart_yyyymmdd(rowData?.vendBillDt);

  const [formData, setFormData] = useState({
    divCd: rowData ? rowData.divCd : "",
    iBillNo: rowData ? rowData.iBillNo : "",
    manOrdNo: rowData ? rowData.manOrdNo : "",
    ordDt: rowData ? rowData.ordDt : "",
    ordNo: rowData ? rowData.ordNo : "",
    ordVal: rowData ? rowData.ordVal : "",
    phyProgPc: rowData ? rowData.phyProgPc : null,
    //raBillSlNo: rowData?rowData?.raBillSlNo+"": null,
    raBillSlNo: rowData ? rowData.selectedRaBillNoValueStr : null,
    regNo: rowData ? rowData.regNo : "",
    rejectionReason: rowData ? rowData.rejectionReason : "",
    //uptoBillVal: rowData?rowData.uptoBillVal: '',
    vchTyp: rowData ? rowData.vchTyp : "",
    vendBillDt: rowData ? date : "",
    vendBillNo: rowData ? rowData.vendBillNo : "",
    vendBillVal: rowData ? rowData?.vendBillVal : null,
    vendCd: rowData ? rowData.vendCd : "",
    workNm: rowData ? rowData.workNm : "",
    vendName: rowData ? rowData.vendName : "",
    divNm: rowData ? rowData.divNm : "",
    fildetails: rowData ? rowData.fildetails : [],
    billdocDtl: [],
  });



  //Doc Lov Starts

  // const [docLovData, setDocLovData] = useState([]);
  // useEffect(() => {

  //   const fetchDocLovData = async () => {
  //     await axios
  //       .get(process.env.REACT_APP_API_URL_PREFIX +
  //         "/BillDocController/GetAllBillDoc")
  //       .then((res) => {
  //         console.log("DocLov:" +res.data);
  //         setDocLovData(res.data.content.length ? res.data.content : [] );
  //       });
  //   };

  //   fetchDocLovData();
  // }, []);


  const getDocName = (obj) => {
    return formData?.billdocDtl[Number(Object.keys(obj)[0])]?.iBillDocNm
  }

  const getDocCode = (obj) => {
    return formData?.billdocDtl[Number(Object.keys(obj)[0])]?.iBillDocCd
  }




  const [selectRowDocLov, setSelectRowDocLov] = useState("");
  const [showModelDocLov, setShowModelDocLov] = useState(false);
  // const handleRowClickDocLov = (rowData) => {
  //   setSelectRowDocLov(rowData);

  // let flg = false;
  // let flg2 = false;
  // let list = tableRow
  //   let objKey = Object.keys(rowData);
  //   for(let i=0; i<objKey.length; i++){
  //     // debugger
  //     flg = false
  //     for(let j=0; j<list.length; j++){
  //       if(list[j].key === objKey[i]){ 
  //         flg = true
  //         break
  //       }
  //       else{
  //         if(list[j].isLovSelect ){
  //           flg2 = false;
  //           for(let k=0; k<objKey.length; k++){
  //             for(let l=0; l<list.length; l++)
  //               if(objKey[k] === list[l].key){ 
  //                 flg2 = true
  //                 break
  //               }
  //           }
  //           !flg2 && list.splice(j,1)
  //         }
  //       }
  //     }
  //     !flg && list.push({
  //       iBillDocCd: "",
  //       submitFlag: "Y",
  //       iBillDocNm: docList[Number(objKey[i])]?.iBillDocNm,
  //       docRmks: "",
  //       isLovSelect: true,
  //       key: objKey[i]
  //     })
  //   }


  //   setTableRow([...list])
  // };
  const handleRowClickDocLov = (lovRowData) => {
    setSelectRowDocLov(lovRowData);
    console.log("xxxxxxxxx");

    let flg = false;
    let flg2 = false;
    let list = tableRow
    let objKey = Object.keys(lovRowData);
    for (let i = 0; i < objKey.length; i++) {
      flg = false;
      for (let j = 0; j < list.length; j++) {
        if (objKey[i] === list[j].key) {
          flg = true
          break
        }
      }
      !flg && list.push({
        iBillDocCd: docList[Number(objKey[i])]?.iBillDocCd,
        submitFlag: "Y",
        iBillDocNm: docList[Number(objKey[i])]?.iBillDocNm,
        docRmks: "",
        isLovSelect: true,
        key: objKey[i],
        ibillDocSlNo: 0
      })
    }
    for (let i = 0; i < list.length; i++) {
      flg2 = false
      if (list[i].isLovSelect) {
        if (!objKey.includes(list[i].key)) {
          if(mode === 2) removetableRow ("e", i)
          else list.splice(i, 1)
          flg2 = true
        }
      }
      
        if (!flg2 && !list[i].docRmks && !list[i].iBillDocNm) {
          list.splice(i, 1)
        }
      
    }
    if (!list.length) list.push({
      iBillDocCd: "",
      iBillDocNm: "",
      docRmks: "",
      isLovSelect: false,
      key: "-1"
    })
    setTableRow([...list])
  };

  //Doc Lov Ends


  const [charCount, setCharCount] = useState([{

    isTyping: false
  }])

  const [docList, setDocList] = useState([]);
  useEffect(() => {
    const getDocList = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL_PREFIX +
          "/BillDocController/GetAllBillDoc"
        )
        .then((res) => {
          // !rowData &&
          // setFormData({
          //   ...formData,

          //   billdocDtl: res.data.content.map((item) => {
          //     return {
          //       iBillDocCd: item.iBillDocCd,
          //       submitFlag: "N",
          //       iBillDocNm: item.iBillDocNm,
          //     };
          //   }),
          // });

          let list = res.data.content.map((item,) => {
            return {
              iBillDocCd: item.iBillDocCd,
              iBillDocNm: item.iBillDocNm,
              docRmks: item.docRmks,
              // ibillDocSlNo: item.ibillDocSlNo
            };
          })
          let codeArr = list.map(item => item.iBillDocCd)
          let cs = {}
          let csIndex = -1


          if (mode === 2) {
            for (let i = 0; i < rowData.billdocDtl.length; i++) {
              csIndex = codeArr.indexOf(rowData.billdocDtl[i].iBillDocCd)
              if (csIndex !== -1) {
                cs = {
                  ...cs,
                  [csIndex]: true
                }
                rowData.billdocDtl[i] = {
                  ...rowData.billdocDtl[i],
                  iBillDocNm: rowData.billdocDtl[i].ibillDocNm,
                  isLovSelect: true,
                  key: (csIndex) + ""
                }
              } else {
                rowData.billdocDtl[i] = {
                  ...rowData.billdocDtl[i],
                  iBillDocNm: rowData.billdocDtl[i].ibillDocNm,
                  isLovSelect: false,
                  key: "-1"
                }
              }

            }
            console.log("cs", cs);
            setSelectRowDocLov(cs)
          }
          setDocList([...list])

          console.log("docdata", res.data.content);

        });
    };

    getDocList();
  }, [rowData]);
  const [tableRow, setTableRow] = useState(rowData?.billdocDtl.length ? rowData.billdocDtl : [
    {
      iBillDocCd: "",
      iBillDocNm: "",
      docRmks: "",
      isLovSelect: false,
      key: "-1",
      ibillDocSlNo:0
    },
  ]);






  const addtableRow = () => {

    setTableRow((prevRows) => [
      ...prevRows,
      {
        iBillDocCd: "",
        submitFlag: "Y",
        iBillDocNm: "",
        docRmks: "",
        isLovSelect: false,
        ibillDocSlNo:0
      },
    ]);

    // setCharCount((prevRows) => [
    //     ...prevRows,
    //     {
    //         isTyping: false
    //     },
    // ]);

  };

  const handleTableInputChange = (e, index) => {
    const { name, value } = e.target;
    let list = tableRow
    list[index] = {
      ...list[index],
      [name]: value
    }
    setTableRow([...list])
    // let rowsCharCount = charCount
    // rowsCharCount[index] = {
    //    isTyping: true
    // }
    // setCharCount([...rowsCharCount])
  };

  const handleCharCount =  (e, index) => {

    let rowsCharCount = charCount
    rowsCharCount[index] = {
      isTyping: false
    }
    setCharCount([...rowsCharCount])
  };

  const removetableRow = async (e, index) => {
    let rows = tableRow
    let obj
    let err = false
    if (mode === 2 && rows[index].ibillDocSlNo) {
      await axios.delete(
        process.env.REACT_APP_API_URL_PREFIX +
        "/BillController/DeleteiBillDocDtl?ibillDocSlNo="+rows[index].ibillDocSlNo+"&iBillNo="+rowData.iBillNo
      ).then(res => {
        console.log(res.data);
        if(res.data.code === "1"){ 
          err = true
          alert.show("Something Went Wrong | Contact Adinistrator")
          
        }
      }).catch(err=>{
        alert.show(err)
        
      })
    }
    if(!err){
      if (rows[index].isLovSelect) {
      obj = selectRowDocLov
      delete obj[rows[index].key]
      setSelectRowDocLov({ ...obj })
      console.log(obj);
      }
      rows.splice(index, 1)
      setTableRow([...rows])
      // let rowsCharCount = charCount
      // rowsCharCount.splice(index, 1)
      // setCharCount([...rowsCharCount])
    }


  };










  console.log("rowdata" + docChk);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (event.target.value === "3") setSelectedRaBillNoValue("");
  };

  const handleCheckBoxChange = (event, index) => {
    let list = formData.billdocDtl;
    list[index] = {
      ...list[index],
      submitFlag: event.target.checked ? "Y" : "N",
    };
    console.log(list);
    // setDocChk([...list])
    setFormData({
      ...formData,
      billdocDtl: list,
    });
  };

  const resetForm = () => {
    setFormData({
      divCd: "",
      //iBillNo: '',
      manOrdNo: "",
      ordDt: "",
      ordNo: "",
      ordVal: "",
      phyProgPc: null,
      raBillSlNo: null,
      regNo: "",
      rejectionReason: "",
      //uptoBillVal: '',
      vchTyp: "",
      vendBillDt: "",
      vendBillNo: "",
      vendBillVal: null,
      vendCd: "",
      workNm: "",
    });
  };

  const [iBillNo, setIBillNo] = useState(mode === 2 ? formData?.iBillNo : null);

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    const billDoc = tableRow.map((item) => {
      return {
        docRmks: item.docRmks,
        iBillDocCd: item.iBillDocCd ? item.iBillDocCd : "",
        ibillDocNm: item.iBillDocNm ? item.iBillDocNm : item.ibillDocNm,
        ibillDocSlNo: item.ibillDocSlNo? item.ibillDocSlNo : 0
      };
    });
    const billObjOld = {
      apiId:"VMA00032",
          mst: {
          actFlg:"A",
          divCd: selectedDivValueStr,
          //iBillNo: formData.iBillNo,
          manOrdNo: selectRow?.manOrdNo,
          ordDt: selectRow?.ordDt,
          ordNo: selectRow?.ordNo,
          ordVal: parseInt(selectRow?.ordVal) || 0,
          phyProgPc: parseInt(formData.phyProgPc) || 0,
          raBillSlNo: parseInt(selectedRaBillNoValueStr) || 0,
          // regNo: localStorage.getItem("registrationNo"),
          regNo: "REG/2023/2",
          rejectionReason: formData.rejectionReason,
          uptoBillVal: parseInt(formData.uptoBillVal) || 0,
          vchTyp: formData.vchTyp,
          vendBillDt: getDateInFormart_ddmmyyyy(formData.vendBillDt),
          vendBillNo: formData.vendBillNo,
          vendBillVal: parseInt(formData.vendBillVal) || 0,
          vendCd: selectedVenCodeStr,
          workNm: selectRow?.workNm,
          dtl01: [
            {
              docRmks: 'string',
              iBillDocCd: 'string',
              ibillDocNm: 'string'
            }
          ],
          dtl02: [
            {
              fileCatCd: 'string',
              fileId: 'string',
              fileNm: 'string',
              fileSz: 0,
              fileTyp: 'string',
              fileUri: 'string',
              flUpldLogNo: 'string'
            }
          ],
          },
      // dtl02: doc,
      // dtl01: billDoc,
      
    };

    const billObj =  {
      apiId: 'VMA00032',
      mst: {
        actFlg: 'A',
        divCd: selectedDivValueStr,
        dtl01: [
          {
            docRmks: 'string',
            iBillDocCd: 'string',
            ibillDocNm: 'string'
          }
        ],
        dtl02: [
          {
            fileCatCd: 'string',
            fileId: 'string',
            fileNm: 'string',
            fileSz: 0,
            fileTyp: 'string',
            fileUri: 'string',
            flUpldLogNo: 'string'
          }
        ],
        manOrdNo: selectRow?.manOrdNo,
        ordDt: selectRow?.ordDt,
        ordNo: selectRow?.ordNo,
        ordVal: 0,
        phyProgPc: 0,
        raBillSlNo: 0,
        regNo: "REG/2023/2",
        rejRson: "test",
        uptoBillVal: 0,
        vchTyp: formData.vchTyp,
        vendBillDt: getDateInFormart_ddmmyyyy(formData.vendBillDt),
        vendBillNo: formData.vendBillNo,
        vendBillVal: 0,
        vendCd: selectedVenCodeStr,
        workNm: selectRow?.workNm,
      }
    }

    const billEditObj = {
      divCd: formData.divCd,
      iBillNo: formData.iBillNo,
      manOrdNo: formData?.manOrdNo,
      ordDt: formData?.ordDt,
      ordNo: formData?.ordNo,
      ordVal: formData?.ordVal,
      phyProgPc: formData.phyProgPc,
      raBillSlNo: selectedRaBillNoValue,
      regNo: localStorage.getItem("registrationNo"),
      rejectionReason: formData.rejectionReason,
      //uptoBillVal: formData.uptoBillVal,
      vchTyp: formData.vchTyp,
      vendBillDt: getDateInFormart_ddmmyyyy(formData.vendBillDt),
      vendBillNo: formData.vendBillNo,
      vendBillVal: formData.vendBillVal,
      vendCd: formData.vendCd,
      workNm: formData?.workNm,
      fildetails: doc,
      billdocDtl: billDoc,
    };

    if (checkString(formData.vendBillVal, ".")) {
      alert.show("Please Select Integer Value in Vendor Bill Value");
      return;
    }
    if (checkString(formData.phyProgPc, ".")) {
      alert.show("Please Select Integer Value in Physical Progress %");
      return;
    }
    if (Number(formData.vendBillVal) <= 0) {
      alert.show("Please Enter Greater than 0 Value in Vendor Bill Value");
      return;
    }
    if (Number(formData.phyProgPc) <= 0) {
      alert.show("Please Enter Greater than 0 Value in Physical Progress %");
      return;
    }

    if (mode === 1 && !billObj?.mst?.divCd) {
      alert.show("Please Select Division");
      return;
    }
    if (mode === 1 && !billObj?.mst?.vendCd) {
      alert.show("Please Select Vendor Code");
      return;
    }
    if (mode === 1 && !billObj?.mst?.ordNo) {
      alert.show("Please Select Order No.");
      return;
    }
    if (
      new Date(formData.vendBillDt).getTime() >
      new Date().getTime() + 24 * 60 * 60 * 1000
    ) {
      alert.show("Please Select Valid Date");
      return;
    }

    if (mode === 1)
    
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/VMF00004/saveAdd",
          billObj
        )
        .then((res) => {
          
          console.log(res.data);
          if (res.data.code === 0) {
            set_saveFlag(true);
            alert.show("Bill Saved Successfully");
            setIBillNo(res.data?.content?.iBillNo);
            fetchTableData();
            
            //navigate(`${process.env.PUBLIC_URL}/BillList`);
          } else {
            alert.show(res.data.msg);
          }
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 2)
      await axios
        .put(
          process.env.REACT_APP_API_URL_PREFIX + "/BillController/EditBillInfo",
          billEditObj
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.code === 0) {
            set_saveFlag(true);

            fetchTableData();
            alert.show("Bill Updated Successfully");
            //navigate(`${process.env.PUBLIC_URL}/BillList`);
          } else {
            alert.show(res.data.msg);
          }
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 3)
      if (
        window.confirm("Are you sure? The record will be deleted parmanantly")
      )
        await axios
          .delete(
            process.env.REACT_APP_API_URL_PREFIX +
            "/BillController/DeleteiBillInfo?iBillNo=" +
            formData.iBillNo
          )
          .then((res) => {
            console.log(res.data);
            if (res.data.code === 0) {
              fetchTableData();
              alert.show("Bill Deleted Successfully");
              onClose();
              navigate(`${process.env.PUBLIC_URL}/BillList`);
            } else {
              alert.show(res.data.msg);
            }
          })
          .catch((error) => {
            console.log("error");
          });
  };

  const checkString = (text, x) => {
    for (let i = 0; i < text.length; i++) {
      if (text[i] === x) return true;
    }
    return false;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!iBillNo) {
      alert.show("Please Save the form First");

      return;
    }
    if (
      window.confirm(
        "Are you sure? After submission you cannot edit the application!"
      )
    )
      await axios
        .put(
          process.env.REACT_APP_API_URL_PREFIX +
          "/BillController/SubmitBillInfo?iBillNo=" +
          iBillNo
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.code === 0) {
            //set_saveFlag(true)
            
            fetchTableData();
            alert.show("Bill Submitted Successfully");
            onClose();
           navigate(`${process.env.PUBLIC_URL}/BillList`);
            
          } else {
            alert(res.data.msg);
          }
        })
        .catch((error) => {
          console.log("error");
        });
  };

  const handleSubmit = (e) => {
    //e.preventDefault();
    //if (validateInput(data)==false)
    //return;
    let url =
      process.env.REACT_APP_API_URL_PREFIX + "/BillController/SaveBillInfo";
    if (mode !== 1) {
      url = url + "/" + formData.iBillNo;
    }

    //console.log(url);
    //   let datax = {
    //     id : formData.id,
    //      dev_nm: formData.dev_nm,
    //      addr: formData.addr,
    //      ph_no: formData.ph_no,
    //      email_id: formData.email_id,
    //      act_flg: formData.act_flg,

    //  }
    //alert(url);
    // alert(formData);
    switch (mode) {
      case 1:
        {
          axios
            .post(url, formData)
            .then((response) => {
              console.log(response.data);
              // setData([...data, formData])
              setData([...data, response.data]);
              if (response.data.code === 0) {
                alert.show("Successfully Added");
                //navigate(`${process.env.PUBLIC_URL}/BillList`);
              } else {
                alert(response.data.msg);
              }
              onClose();
              // Perform any further actions upon successful insertion
            })
            .catch((error) => {
              console.error(error);
              // Handle any error that occurred during insertion
            });
          console.log("case1");
        }
        break;
      case 2:
        axios
          .put(url, formData)
          .then((response) => {
            let i = 0;
            for (; i < data.length; i++) {
              if (data[i].id === formData.id) break;
            }

            let arr = data;
            arr.splice(i, 1, response.data);
            setData([...arr]);
            onClose();
            // Perform any further actions upon successful insertion
          })
          .catch((error) => {
            console.error(error);
            // Handle any error that occurred during insertion
          });
        break;
      case 3:
        axios
          .delete(url)
          .then((response) => {
            console.log(response.data);
            let i = 0;
            for (; i < data.length; i++) {
              if (data[i].id === formData.id) break;
            }

            let arr = data;
            arr.splice(i, 1);
            setData([...arr]);
            onClose();
            // Perform any further actions upon successful insertion
          })
          .catch((error) => {
            console.error(error);
            // Handle any error that occurred during insertion
          });
        break;
      default:
        break;
    }
  };

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };
  // const buttonTitle = getFormTitle(mode);

  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save";
        break;
      case 2:
        return "Save";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };

  //Select Division

  const [selectedDivValue, setSelectedDivValue] = useState(
    mode === 1 ? "" : rowData?.divCd
  );
  const [venCd, setVenCd] = useState();

  const handleSelectChange = (event) => {
    setSelectedDivValue(event.target.value);
    selectedDivValueStr = `${event.target.value ? event.target.value : "None"}`;
    setSelectRow(null);
    setVenCode([]);
    setSelectedVenCodeValue(null);
    setVenCd("");
  };

  const [selectedVenCodeValue, setSelectedVenCodeValue] = useState(
    mode === 1 ? "" : rowData?.vendCd
  );

  const handleVenSelectChange = (event) => {
    console.log(venCode[event.target.value]);
    setVenCd(event.target.value);
    setSelectedVenCodeValue(event.target.value);
    selectedVenCodeStr = `${event.target.value ? event.target.value : "None"}`;
    setSelectRow(null);
  };

  const [selectedRaBillNoValue, setSelectedRaBillNoValue] = useState(
    mode === 1 ? "" : rowData?.raBillSlNo
  );
  const handleRaBillNoChange = (event) => {
    setSelectedRaBillNoValue(event.target.value);
    selectedRaBillNoValueStr = `${event.target.value ? event.target.value : "None"
      }`;
  };

  const [divOptions, setDivOptions] = useState([]);

  useEffect(() => {
    const getDivData = async () => {
      const arr = [];
      const body = {
        apiId: 'VMA00015',
        criteria: {
          regNo: 'REG/2023/2'
        }
      }
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/VMF00002/getTaggedDivisionList",
          body,
          {headers}
        )
        .then((res) => {
          console.log(res.data.content.qryRsltSet);
          let result = res.data.content.qryRsltSet;
          result.map((item) => {
            return arr.push({ value: item.divCd, label: item.divNm });
          });
          // setFormData({
          //   ...formData,
          //   divCd: arr[0].value || 
          // })
          // setSelectedDivValue(arr[0]?.value || "")
          if(arr.length === 1)
          selectedDivValueStr = arr[0]?.value || ""
          setDivOptions(arr);
          // setDivOptions([{value: "dummy1", label: "dummy2"}])
        });
    };
    getDivData();
  }, []);
  
  useEffect(() => {
    set_doc(
      formData.fildetails.map((item, index) => ({
        fileUri: item.fileUri,
        name: "File " + (index + 1),
      }))
    );
  }, []);

  //Select Vendor Code

  const [venCode, setVenCode] = useState([""]);

  useEffect(() => {
    const getVenCodeData = async () => {
      const arr = [];
      const body = {
        apiId: 'VMA00017',
        criteria: {
          divCd: selectedDivValue,
           regNo: 'REG/2023/2'
        }
      }
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +"/VMF00002/GetTaggedVendorList", body, {headers}
        )
        .then((res) => {
          
          console.log(res.data.content.qryRsltSet);
          const result = res.data.content.qryRsltSet;
          result.map((item) => {
            return arr.push({ value: item.vendCd, label: item.vendName });
          });

          setVenCode(arr);
          if(arr.length === 1){ 
            let cd = arr[0].value
            setVenCd(cd);
            setSelectedVenCodeValue(cd);
            selectedVenCodeStr = `${cd ? cd : "None"}`;
            setSelectRow(null);
          }
          // setVenCode([{value: "dummy3", label: "dummy4"}]);
        });
    };
    getVenCodeData();
  }, [selectedDivValue, selectedDivValueStr]);

  const [ordData, setOrdData] = useState([]);
  useEffect(() => {
    const fetchOrdData = async () => {
      const body = {
        apiId: 'VMA00016',
        criteria: {
          divCd: selectedDivValue,
          regNo: 'REG/2023/2',
          vendCd: selectedVenCodeStr
        }
      }
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +"/VMF00002/getTaggedOrderList", body, {headers}
        )
        .then((res) => {
          console.log(res.data);
          setOrdData(res.data.content.qryRsltSet);
        });
    };
    fetchOrdData();
  }, [selectedDivValue, selectedVenCodeValue]);
  console.log(ordData);

  //Select RA Code

  const [raBillNo, setRaBillNo] = useState([""]);

  useEffect(() => {
    const getRaBillNoData = async () => {
      const arr = [];
      const body = {
        apiId: 'VMA00014'
      }
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +
          "/VMF00002/getRaBillNoList",
          body,
          {headers}
        )

        .then((res) => {
          const result = res.data.content.qryRsltSet;
          result.map((item) => {
            return arr.push({ value: item.raBillSlNo, label: item.raBillNo });
          });

          setRaBillNo(arr);
        });
    };
    getRaBillNoData();
  }, []);

  //file post appi
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const [selectRow, setSelectRow] = useState(mode !== 1 ? rowData?.manOrdNo : "");

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    //  console.log("this"+selectedTdData(rowData));

    //console.log(table);
  };

  function OpenModal({ selectRow }) {
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState(ordData);

    // const handleRowClick = (rowData) => {
    //   setSelectRow(rowData);
    // };
    const openModal = () => {
      setTableData(ordData);
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    };

    const handleSearch = () => {
      // Filter the table data based on the search text
      const filteredData = tableData.filter(
        (row) =>
          row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
          row.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filteredData);
    };

    useEffect(() => {
      // Update the filtered data when the table data changes
      setFilteredData(tableData);
    }, [tableData]);

    useEffect(() => {
      // Reset the table data when the modal is closed
      if (!open) {
        setTableData(ordData);
        setFilteredData(ordData);
        setSearchText("");
      }
    }, [open]);
    
    return (
      <>
        <div className="row-mb-12">
          <div className="col-md-2 d-inline">
            <i
              className="fa fa-search d=inline"
              title=""
              onClick={() => openModal()}
            ></i>
          </div>

          {/* Modal */}
          {open && (
            <Modal show={open} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Select Work Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-responsive">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                  <table className="table table-bordered dta-tabl">
                    <thead>
                      <tr>
                        <th>Work Order No</th>
                        <th>Work Order Date</th>
                        <th>Name of Work</th>
                        <th>Work Order Value(₹)</th>
                        <th>System Order No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row) => {
                        //handleTdClick(row.workName)

                        return (
                          <tr key={row.id} onClick={() => handleRowClick(row)}>
                            <td>{row.manOrdNo}</td>
                            <td>{row.ordDt}</td>
                            <td>{row.workNm}</td>
                            <td> {row.ordVal} </td>
                            <td>{row.ordNo}</td>
                            {/* <td className="hidden-td">
                              {row.orderValueInWords}
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                { }
              </Modal.Body>
              {/* Close modal button */}
              <Modal.Footer>
                <button onClick={() => setOpen(false)}>Close</button>
              </Modal.Footer>
            </Modal>
          )}

          <div className="col-md-auto d-inline">
            <input
              className="form-control col-md-5 mx-2 d-inline "
              type="text"
              name="ordNo"
              value={formData.manOrdNo || ""}
              placeholder={selectRow?.manOrdNo || ""}
              onChange={handleInputChange}
              disabled={mode === 3 || mode === 4}
              readOnly
              required
            />
            {/* <input
              className="form-control col-md-5 mx-2 d-inline"
              type="text"

              value={selectRow?.workName || ""}
              readOnly
            /> */}
          </div>
        </div>
      </>
    );
  }

  const uploadFiles = async (e) => {
    const { files } = e.target;

    let fileArr = [];

    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append("vfile", files[i]);
      if (files[i].size > 1000 * 1000 * 25) {
        //set_mf_msg("File '"+files[i].name+"' size Exceeded 25MB !");
        break;
      }

      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/common/filemgr",
          formData
        )
        .then((res) => {
          if (res.data.code === 0) {
            fileArr = [
              ...fileArr,
              {
                fileUri: res.data.content.fileUri,
                //name: "File "+(doc.length+1+i)
                name: files[i].name,
              },
            ];
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }

    set_doc([...doc, ...fileArr]);
  };

  const delete_file = async (e, i, uri) => {
    if (window.confirm("Are you sure? File cannot be recover once deleted !"))
      await axios
        .delete(
          process.env.REACT_APP_API_URL_PREFIX +
          "/common/filemgr?fileUri=" +
          uri,
          formData
        )
        .then((res) => {
          if (res.data.code === 0) {
            set_doc(doc.filter((item, index) => index !== i));
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
  };
  function handlePrint() {
    let body = document.getElementById("body")?.innerHTML;
    let printArea = document.getElementById("printArea")?.innerHTML;
    document.getElementById("body").innerHTML = printArea;
    //document.querySelector(".btn-on-print").style.display = "none";
    window.print();
    document.getElementById("body").innerHTML = body;
    window.location.reload(true);  
  }

  return (
    <div  >
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload Proforma Bill- {getFormTitle(mode)}</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Upload Proforma Bill
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {/* {mode === 1 && (
          <div className="ms-auto pageheader-btn">
            <Link
              to={`${process.env.PUBLIC_URL}/BillList`}
              className="btn btn-success btn-icon text-white me-3"
            >

              Proforma Bill List
            </Link>
          </div>
        )}  */}
      </div>

      <Row>
        <div className="Card mb-3" id="body">
          <Card.Body className="bg-white">
            <form
              onSubmit={handleBillSubmit}
              className="form-horizontal py-3 container"
              id="EditPageForm"
            >
              <div id="printArea">
                <div className=" row mb-4">
                  <label htmlFor="zip" className="col-md-2 form-label">
                    Division:<span className="text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    {mode === 1 ? (
                      <select
                        className="form-select"
                        name="divCd"
                        value={divOptions?.length === 1? divOptions[0].value : selectedDivValue}
                        disabled={divOptions?.length === 1? true : false}
                        onChange={handleSelectChange}
                        placeholder="Select"
                      >
                        <option value={""}>Select</option>
                        {divOptions.map((item, index) => (
                          <option value={item.value}>{item.label}</option>
                          
                        ))}
                        {console.log("division"+divOptions.value)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={formData?.divNm}
                        readOnly
                      />
                    )}
                  </div>
                </div>
                <div className=" row mb-4">
                  <label for="phone" className="col-md-2 form-label">
                  Agency Name :<span className="text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    {/* <Select
                    className="input-cont"
                    placeholder="Select"
                    options={venCode}
                    value={selectedVenCodeValue}
                    onChange={handleVenSelectChange}
                    name="divCd"
                    disabled={mode===3 || mode===4}
                    //isMulti
                    noOptionsMessage={() => "--Choose division first--"}
                    required={true}
                    // onChange={(e) => setDivOptions(e.target.value)}
                  /> */}
                    {mode === 1 ? (
                      <select
                        className="form-select"
                        name="vendCd"
                        value={venCode?.length === 1 ? venCode[0].value:selectedVenCodeValue}
                        disabled={venCode?.length === 1 ? true: false}
                        onChange={handleVenSelectChange}
                        placeholder="Select"
                      >
                        <option value={""}>Select</option>
                        {venCode.map((item, index) => (
                          <option value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={formData?.vendName}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  Agency Code:
                  </label>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      name="vendCd"
                      placeholder={venCd}
                      value={formData.vendCd}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                      readOnly
                    />
                  </div>
                </div>

                <div className=" row mb-4">
                  <label for="phone" className="col-md-2 form-label">
                    Work Order Number:<span className="text-red">*</span>
                  </label>

                  <div className="col-md-9">
                    {mode === 1 ? (
                      <OpenModal selectRow={selectRow} />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        name="manOrdNo"
                        value={formData.manOrdNo}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  Work Order Date:
                  </label>
                  <div className="col-md-9">
                    {mode === 1 ? (
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        name="ordDt"
                        value={selectRow?.ordDt || ""}
                        placeholder={selectRow?.ordDt || ""}
                        readOnly
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        name="ordDt"
                        value={formData?.ordDt}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  System Order Number:
                  </label>
                  <div className="col-md-9">
                    <input
                      //key={index}
                      type="text"
                      className="form-control"
                      /* value={ordData[filteredIndex]?.manOrderNo || ""} */

                      name="ordNo"
                      placeholder={selectRow?.ordNo || ""}
                      value={formData.ordNo}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                      readOnly
                    />
                  </div>
                </div>

               

                <div className=" row mb-4">
                  <label htmlFor="" className="col-md-2 form-label">
                  Name of Work:
                  </label>
                  <div className="col-md-9">
                    {mode === 1 ? (
                      <textarea
                        readOnly
                        className="form-control"
                        name="workNm"
                        value={selectRow?.workNm || ""}
                        rows={3}
                        placeholder={selectRow?.workNm || ""}
                        disabled={mode === 3 || mode === 4}
                      />
                    ) : (
                      <textarea
                        readOnly
                        className="form-control"
                        name="workNm"
                        value={formData?.workNm}
                        rows={3}
                      />
                    )}
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  Work Order Value(₹):
                  </label>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      name="ordVal"
                      value={formData.ordVal}
                      placeholder={selectRow?.ordVal || ""}
                      disabled={mode === 3 || mode === 4}
                      readOnly
                    />
                    <p>
                      {selectRow?.ordVal &&
                        toWords.convert(selectRow?.ordVal)}
                    </p>
                  </div>
                  {/* <p>{selectRow?.orderValueInWords || ""}</p> */}
                  
                </div>

                {/* <div className=" row mb-4">
                <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  Cumulative Bill Value:
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    id=""
                    placeholder="in words..."
                    readOnly
                  />
                </div>
              </div> */}

                <div className=" row mb-4">
                  <label htmlFor="inputEmail3" className="col-md-2 form-label">
                  Bill Type:<span className="text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      size=""
                      aria-label=""
                      name="vchTyp"
                      value={formData.vchTyp}
                      onChange={handleStatusChange}
                      disabled={mode === 3 || mode === 4}
                      required
                    >
                      <option value="00">
                        <b>--Choose--</b>
                      </option>
                      <option value="01">RA Bill</option>
                      <option value="02">RA & Final</option>
                      <option value="03">First & Final</option>
                    </select>
                  </div>
                </div>

                {(formData.vchTyp === "01" || formData.vchTyp === "02") && (
                  <div className=" row mb-4">
                    <label
                      htmlFor="inputEmail3"
                      className="col-md-2 form-label"
                    >
                      RA Bill No:
                    </label>
                    <div className="col-md-9">
                      {/* <Select
                    className="input-cont"
                    placeholder="Select"
                    options={raBillNo}
                    name="raBillSlNo"
                    value={selectedRaBillNoValue}
                    onChange={handleRaBillNoChange}
                    //isMulti
                    noOptionsMessage={() => "name not found"}
                    
                          disabled={mode===3 || mode===4}
                    
                  /> */}

                      <select
                        className="form-control"
                        name="raBillSlNo"
                        value={selectedRaBillNoValue}
                        onChange={handleRaBillNoChange}
                        placeholder="Select"
                      >
                        <option value={""}>Select</option>
                        {raBillNo.map((item, index) => (
                          <option value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className=" row mb-4">
                  <label htmlFor="website" className="col-md-2 form-label">
                    Physical Progress %:
                  </label>
                  <div className="col-md-9">
                    <input
                      type="number"
                      className="form-control"
                      id=""
                      placeholder="Don't put percentage sign..."
                      name="phyProgPc"
                      value={formData?.phyProgPc}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                    />
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="website" className="col-md-2 form-label">
                  Agency Reference Number:<span className="text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      id=""
                      placeholder=""
                      name="vendBillNo"
                      value={formData.vendBillNo}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                      required
                    />
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="website" className="col-md-2 form-label">
                  Agency Reference Date:<span className="text-red">*</span>
                  </label>
                  <div className="col-md-4">
                    <input
                      type="date"
                      className="form-control"
                      id=""
                      name="vendBillDt"
                      value={formData.vendBillDt}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                      required
                    //max={new Date()}
                    // max={new Date(new Date().getTime()+48*60*60*1000)}
                    />
                  </div>
                </div>

                <div className=" row mb-4">
                  <label htmlFor="website" className="col-md-2 form-label">
                  Amount(₹):<span className="text-red">*</span>
                  </label>
                  <div className="col-md-9">
                    <input
                      type="number"
                      className="form-control"
                      id=""
                      placeholder="Enter Amount"
                      name="vendBillVal"
                      value={formData.vendBillVal}
                      onChange={handleInputChange}
                      disabled={mode === 3 || mode === 4}
                      required
                      pattern="[0-9]"
                    />
                    <p>
                      {formData.vendBillVal &&
                        toWords.convert(formData.vendBillVal)}
                    </p>
                  </div>
                </div>

                <div className=" row mb-6">
                  <label htmlFor="website" className="col-md-6 form-label">
                    Document Submitted :
                    <span className="text-red">*</span>
                  </label>
                  {/* <div className="col-md-9">
                    <table
                      className="table w-100 table-bordered dta-tabl new-dtatable"
                      style={{ height: "auto" }}
                    >
                      <thead>
                        <tr>
                          <th width="20%">Document Code</th>
                          <th width="60%">Document Name</th>
                          <th width="20%">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRow?.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>

                            <td>
                              {item?.iBillDocNm
                                ? item?.iBillDocNm
                                : item?.ibillDocNm}
                            </td>
                            <td>
                              <div className="form-group m-0">
                                <div className="custom-controls-stacked">
                                  <input
                                    checked={item.submitFlag === "Y"}
                                    type="checkbox"
                                    id="billdoc"
                                    name={item.iBillDocCd}
                                    onChange={(e) =>
                                      handleCheckBoxChange(e, index)
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div> */}
                </div>







                <table className="table  dta-tabl" style={{ background: 'white' }}>
                  <thead>
                    <tr>
                      <th className="sno">Row#</th>
                      <th> Document Name</th>
                      <th>Remarks</th>
                      <th style={{ width: "150px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRow.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>



                        {/*  <td>
                                            <input

                                                className="table-input border"
                                                type="text"
                                                name="modGrpId"
                                                disabled
                                            />
                                            {row.error && <div className="error-message">{row.error}</div>}
                                        </td> */}
                        <td>
                          <input
                            type="text"
                            autoComplete={false}
                            className="form-control mx-4"
                            name={row.iBillDocNm ? "iBillDocNm" : "ibillDocNm"}
                            // value={getDocCode(selectRowDocLov)? getDocCode(selectRowDocLov): "" }
                            onChange={(e) => handleTableInputChange(e, index)}
                            value={row?.iBillDocNm
                              ? row?.iBillDocNm ? row?.iBillDocNm : ""
                              : row?.ibillDocNm ? row?.ibillDocNm : ""}
                            // value={row?.ibillDocNm}
                            readOnly={row.isLovSelect}
                            required={tableRow.length? true:false}
                          />
                        </td>


                        <td>
                          <div className="col-md-12 input-group">
                            <input
                              onChange={(e) => handleTableInputChange(e, index)}
                              onBlur={(e) => handleCharCount(e, index)}
                              value={row?.docRmks}
                              className="form-control"
                              type="text"
                              name="docRmks"
                              // required
                              maxLength={50}

                            />
                            {/* {charCount[index].isTyping && <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                            {/* {row.modGrpNm === "" ? <span className="input-group-text d-none">{row.modGrpNm.length}/50</span> : <span className="input-group-text">{row.modGrpNm.length}/50</span>} */}
                          </div>
                          {row.error && <div className="error-message">{row.error}</div>}
                        </td>


                        <td style={{ width: "150px" }}>
                        {mode !== 4 && mode !== 3 && <div>
                          {index !== tableRow.length - 1 ? (
                            <button
                              type="button"
                              onClick={(e) => removetableRow(e, index)}
                              className="action-button"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          ) : (
                            <>
                              {index !== 0 && <button
                                type="button"
                                onClick={(e) => removetableRow(e, index)}
                                className="action-button"
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>}

                              <button type="button" onClick={addtableRow}
                                className="action-button "> <FontAwesomeIcon
                                  // style={{ color: "blue" }} 
                                  icon={faPlus}
                                  className="me-1" />
                              </button>

                              <button type="button" className="action-button">

                                <FontAwesomeIcon
                                  icon={faSearch}
                                  onClick={() => setShowModelDocLov(true)}
                                />
                              </button>

                            </>
                          )}
                          </div>}
                        </td>
                        {row.error && <div className="error-message">{row.error}</div>}
                      </tr>

                    ))}
                  </tbody>
                </table>
                <div className="row-mb-12">
                  {showModelDocLov && <Lov
                    enableMultiRowSelection={true}
                    moduleLovData={docList}
                    setShowModel={setShowModelDocLov}
                    showModel={showModelDocLov}
                    handleRowClick={handleRowClickDocLov}
                    columns={docLovColumns}
                    currentSelection={selectRowDocLov}
                    setCurrentSelection={setSelectRowDocLov}
                  />}
                </div>


                <div className=" row mb-4">
                  <label htmlFor="formFile" className="col-md-2 form-label">
                    Attach File:
                    {(mode!==1 && mode !==2) && (!doc.length) && <span style={{marginLeft:"15px"}}> None</span>}
                  </label>
                  
                  <div className="col-md-9">
                    <input
                      style={{visibility: (mode===1 || mode ===2)? "visible": "hidden"}}
                      type="file"
                      className="form-control"
                      id="formFile"
                      onChange={uploadFiles}
                      name="billFile"
                      //required={!doc.length}
                      multiple
                      accept=".pdf"
                      disabled={mode === 3 || mode === 4}
                    />
                    
                    {doc.map((file, i) => (
                      <div className="file-div">
                        <Smalltag
                          handleClick={() =>
                            window.open(
                              process.env.REACT_APP_API_URL_PREFIX +
                              file.fileUri,
                              "_blank",
                              "rel=noopener noreferrer"
                            )
                          }
                          fontAwsmIcon={"fa-solid fa-file"}
                          lable={file.name}
                          key={i}
                        />

                        {mode !== 4 && (
                          <Delete
                            onClick={(e) => delete_file(e, i, file.fileUri)}
                            className="cross-icon"
                            id="categoryOfUnit"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-0 mt-4 row justify-content-end">
                <div className="col-md-10">
                  {mode !== 4 && (
                    <button
                      type="submit"
                      disabled={mode === 1 ? saveFlag : false}
                      className="btn btn-primary me-2"
                    // onClick={handleBillSubmit}
                    >
                      {buttonTitle(mode)}
                    </button>
                  )}
                  {/* {mode !== 4 && mode !== 3 && (
                    <button
                      className="btn btn-secondary me-2"
                      type="button"
                      onClick={handleFinalSubmit}
                    >
                      Submit
                    </button>
                  )} */}
                   {/* <button
                    className="btn btn-secondary me-2"
                    type="button"
                    onClick={handlePrint}
                  >
                    Print
                  </button> */}
                </div>
              </div>
            </form>
          </Card.Body>
          <Card.Footer className=""></Card.Footer>
        </div>
      </Row>
    </div>
  );
};

UploadBill.defaultProps = {
  editMode: false,
  post: {
    title: "",
    body: "",
  },
};

export default UploadBill;
