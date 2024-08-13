import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { getApiToken, getScplAdContext } from "./common"
import { Alert } from "react-bootstrap";
import moment from "moment/moment";
import MsgAlert from "./MsgAlert";
// import { Avatar } from "@files-ui/react";
import Avatar from '@mui/material/Avatar';

import { useOutletContext } from "react-router-dom";

const headers = { Authorization: "Bearer " + getApiToken() };

const UserProfile = () => {
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const {set_headerProfImgAdd} = useOutletContext();
  //Form open api calling

  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
  })
  const [data, setData] = useState({});
  // const [profile, setprofile] = useState(second)
  const [profileText, set_profileText] = useState("")
  const [openData, setOpenData] = useState("");

  // let userId = localStorage.getItem('userId');
  const userId = getScplAdContext().userId;
  
  const fetchOpenData = async () => {
    let openFormObj = {
      apiId: "SUA00527",
      mst: {
        userId: userId
      }
    };
    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/openProfileEditForm",
        openFormObj,
        {
          headers,
        }
      )
      .then((res) => {
        const modifiedData = { ...res.data.content.mst };
        if (res.data?.content?.mst?.dob) {
          modifiedData.dob = getDateFormart_ddmmyyyy(res.data?.content?.mst?.dob);

        } else {
          modifiedData.dob = "";
        }
        setOpenData(modifiedData);
        set_profileText(modifiedData.userNm[0]?.toUpperCase())
        if(res.data?.content?.mst?.usrImgFileId){
          set_doc([{
            "flUpldLogNo": res.data?.content?.mst? res.data?.content?.mst?.usrImgFlUpldLogNo:"",
            "fileId": res.data?.content?.mst? res.data?.content?.mst?.usrImgFileId:"",
            "filePath": res.data?.content?.mst? res.data?.content?.mst?.usrImgFilePath:"",
            "fileSz":res.data?.content?.mst? res.data?.content?.mst?.usrImgFileSz:"",
            "fileNm":res.data?.content?.mst? res.data?.content?.mst?.usrImgFileNm:"",
            "fileTyp": res.data?.content?.mst? res.data?.content?.mst?.usrImgFileTyp:"",
            // "fileUri": openData.usrImgFileUri
          }])
          let fileDtl = res.data?.content?.mst
          let ext = fileDtl?.usrImgFileNm?.split(".")[1]
          const imageUrl = `${process.env.REACT_APP_API_URL_PREFIX}${fileDtl?.usrImgFilePath}${fileDtl?.usrImgFileId}.${ext}`;
          console.log(imageUrl, "gggggggg");
          set_headerProfImgAdd(imageUrl)
          setFile(imageUrl)
         
        }
        
        
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            " (" +
            res.data?.appMsgList?.list[0]?.errCd +
            ")"
            : ""
        );
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
      });
  };
  useEffect(() => {
    console.log(headers);
    
    

    fetchOpenData();
  }, [userId]);
  //Form open api end

  const [formData, setFormData] = useState({})
   useEffect(() => {
     setFormData({...openData})
   }, [openData])
   

  const getDateFormart_ddmmyyyy = (ddmmyyyy) => {
    console.log(ddmmyyyy);


    if (ddmmyyyy) {
      const day = ddmmyyyy.slice(0, 2)
      const month = ddmmyyyy.slice(3, 5)
      const year = ddmmyyyy.slice(6, 10)
      console.log(`${day}-${month}-${year}`);
      return `${year}-${month}-${day}`

    } else return ""
  }

  let dob = getDateFormart_ddmmyyyy(formData?.dob)
  //"../../../logo192.png"
  const [file, setFile] = useState()

  const [doc, set_doc] = useState([]);
  const uploadFiles = async (e) => {
    const { files } = e.target;
    setFile(URL.createObjectURL(e.target.files[0]));
    let fileArr = [];

    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      if (files[i].size > 1000 * 1000 * 25) {
        //set_mf_msg("File '"+files[i].name+"' size Exceeded 25MB !");
        break;
      }
      formData.append("vfile", files[i]);


      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX +"/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00530" + "&appId=" + "" + "&mobRegNo=" + ""+"&fileCatCd=" + "C0002",
          formData, { headers }
        )
        .then((res) => {
          if (res.data.code === 0) {
            fileArr = [
              ...fileArr,
              {
                ...res.data.content
                //name: "File "+(doc.length+1+i)
                // name: files[i].name,
              },
            ];
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }

    set_doc([ ...fileArr]);
  };

  const handle_confirmation = async (obj) => {
    return await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00134/fileUploadConf',
      obj,
      { headers })
  }
  console.log("doc",doc);
  //sve api for post form data
  function postDataToAPI(event) {
    event.preventDefault();

    let postObj = {
      apiId: "SUA00530",
      mst: {
        actFlg: formData?.actFlg,
        addr: formData?.addr,
        usrSqansDtlInfo: [
          {
            ans: formData?.ansDesc1,
            quesDesc: formData?.quesDesc1,
            qustId: formData?.quesId1,
            quesSlNo: 1
          },
          {
            ans: formData?.ansDesc2,
            quesDesc: formData?.quesDesc2,
            qustId: formData?.quesId2,
            quesSlNo: 2
          }
        ],
        dob: formData?.dob,
        mailId: formData?.mailId ||"",
        mobNo: formData?.mobNo,
        userId: formData?.userId,
        userNm: formData?.userNm,
        usrImgFileId: doc[0].fileId,
        usrImgFileNm: doc[0].fileNm,
        usrImgFilePath: doc[0].filePath,
        usrImgFileSz: doc[0].fileSz,
        usrImgFileTyp: doc[0].fileTyp,
        usrImgFlUpldLogNo: doc[0].flUpldLogNo,
        fileUri:doc[0].fileUri
      },
    };

    axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/saveProfileEdit",
        postObj,
        { headers }
      )
      .then((res) => {
        console.log("POST Request Success:", res.data);
       if(res.data?.appMsgList?.list[0]?.errCd==="CMAI000005") {
        const conf_obj = {
          "apiId": "SUA00487",
          "mst": [{
            "colNm": res.data?.content?.mst?.colNm,
            "flUpldLogNo": doc[0]?.flUpldLogNo,
            "keyStr": res.data?.content?.mst?.keyStr,
            "keyStrVal": res.data?.content?.mst?.keyStrVal,
            "tabNm": res.data?.content?.mst?.tabNm
          }]
        }
        handle_confirmation(conf_obj).then((res) => {
          if (res?.data?.appMsgList?.errorStatus === false) {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({ status: res.data?.appMsgList?.errorStatus })
            if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
              // resetForm();
            }
          }
        })}
        setMsg(
          res.data?.appMsgList?.list[0]?.errDesc
            ? res.data?.appMsgList?.list[0]?.errDesc +
            ' (' +
            res.data?.appMsgList?.list[0]?.errCd +
            ')'
            : ''
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })

        if(res?.data?.appMsgList?.errorStatus === false){
          fetchOpenData()
        }
      })
      .catch((error) => {
        console.error("POST Request Error:", error);
      }).finally(() => {
        set_viewMsg(true)
      });
  }
  //save api end


  // //datepicker functions start
  // const [startDate, setStartDate] = useState(null);

  // // Function to parse the date string and set it as the initial date
  // const parseAndSetInitialDate = (dateString) => {
  //   if (dateString) {
  //     const parsedDate = new Date(dateString);
  //     setStartDate(parsedDate);
  //   }
  // };
  // console.log(openData?.instDt);
  // useEffect(() => {
  //   const initialDateString = openData?.instDt;
  //   if (initialDateString) {
  //     const parsedDate = new Date(initialDateString);
  //     if (!isNaN(parsedDate.getTime())) {
  //       console.log("Initial Date:", parsedDate);
  //       parseAndSetInitialDate(initialDateString);
  //     } else {
  //       console.log("Invalid Date String:", initialDateString);
  //     }
  //   } else {
  //     console.log("Initial Date String is null or undefined");
  //   }
  // }, [openData]);

  // //datepicker functions end

  // //checkbox function start
  // const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  // const [isLogoDbFlag, setIsLogoDbFlag] = useState(false);

  // useEffect(() => {
  //   const strongPwdFlg = openData?.strongPwdFlg;
  //   const logoDbFlag = openData?.logoDbFlag;
  //   setIsPasswordStrong(strongPwdFlg === "Y" ? true : false);
  //   setIsLogoDbFlag(logoDbFlag === "Y" ? true : false);
  // }, [openData]);


  //checkbox function end

  const handleSelectChange = (event) => {
    console.log(event.target);
    const { name, value, selectedIndex } = event.target;
    const selectedLabel = event.target[selectedIndex].text;
    setFormData({
      ...formData,
      [name]: value,
      [name.replace("Id", "Desc")]: selectedLabel // Update the label state
    });

  };
  console.log(openData);


  const [isValid, setIsValid] = useState(true);


  //handle the value of input field when changes happen
  const handleInputChange = (event) => {
    console.log(`Changing ${event.target.name} to: ${event.target.value}`);
    console.log(event.target.name, event.target.value);
    if (event.target.name === "phNo" && event.target.value.length > 10) return
    if (event.target.name === "pinNo" && event.target.value.length > 6) return
    if (event.target.name === "faxNo" && event.target.value.length > 50) return

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "addr") {
      setError1(""); // Clear the error whenever there's an input change in addr field
    }
  };


  // CharCounter.........
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    phNo: false,
    imgNm: false,
    helppath: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };
  const Loaderimg = () => {
    return (
      <div id="global-loader">
        <img
          src={require("../../assets/images/loader.svg").default}
          className="loader-img"
          alt="Loader"
        />
      </div>
    );
  };
  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])






  return (
    <div fallback={Loaderimg()}>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <nav aria-label="breadcrumb" className="breadcrumb">
            <ol className="breadcrumb">
              {/* <li className="breadcrumb-item breadcrumb-item">
                <a href="#" role="button" tabIndex={0}>
                 
                </a>
              </li> */}
              <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                <a href="#" role="button" tabIndex={0}>
                  CMF00000_13
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> </div>}
{/*  style={{width:"50%", alignItems:"center", margin:"auto", display:"flex"}} */}
      <div className="card">
        <div className="row mb-4 mt-2">

          <div className="userfile-upload">
         
         { file ? <img className="img" src={file}></img>
        : <div className="char-img"><span>{profileText}</span></div>}
            <i className="fa fa-camera fs-5" >
                    
              <input type="file" style={{ "visible": "hidden" }} onChange={uploadFiles} ></input>
            </i>
           
            
            
          </div>

          {/* <Avatar className="img" alt="Remy Sharp" src={file} sx={{ width: 100, height: 100 }} /> */}

        </div>

        <div className="container my-4">
          <form className="px-5" onSubmit={postDataToAPI}>
            {/* <div className="row mb-4">
              <label className="form-label col-md-3">Profile Picture</label>
              <div className="col-md-9">
                <div className="file-upload">
                  <div className="input-name">Choose File</div>
                  <input
                    style={{ "visible": "hidden" }}
                    type="file"
                    className="form-control"
                    id="formFile"
                    onChange={uploadFiles}
                    name="billFile"
                  //required={!doc.length}
                  // multiple
                  // accept=".pdf"
                  // disabled={mode === 3 || mode === 4}
                  />
                </div>
              </div>
            </div> */}
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                User Id:
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control mb-2"
                  name="userId"
                  value={formData?.userId}
                  placeholder=""
                  readOnly
                />
              </div>

            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                User Name:
              </label>
              <div className="col-md-9 input-group">
                <input
                  required
                  className="form-control"
                  name="userNm"
                  value={formData?.userNm}
                  onChange={handleInputChange}
                />
              </div>

            </div>
            <div className="row mb-4">
              <label className="col-md-3 form-label">
                Date Of Birth:
              </label>
              <div className="col-md-9 input-group">
                <input
                  type="date"
                  className="form-control fc-datepicker"
                  placeholder="MM/DD/YYYY"
                  name="dob"
                  value={formData?.dob}
                  onChange={handleInputChange}
                  // disabled={mode === 3 || mode === 4}
                  numberOfMonths={1}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <label className="col-md-3 form-label">Mail Id:</label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="email"
                  maxLength={100}
                  id="exampleFormControlSelect1"
                  name="mailId"
                  value={formData?.mailId}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="row mb-4">
              <label className="col-md-3 form-label">Mobile No.:</label>
              <div className="col-sm-9 input-group">
                <input

                  className="form-control"
                  type="number"
                  id="exampleFormControlSelect1"

                  name="mobNo"
                  value={formData?.mobNo}
                  onChange={handleInputChange}
                  maxLength={10}
                  placeholder="Phone No"
                  onFocus={() => toggleCharCountVisibility("phNo")}
                  onBlur={() => toggleCharCountVisibility("phNo")}
                />
                {fieldCharCountVisibility.phNo && (
                  <span className="input-group-text">
                    {openData?.phNo?.length}/10
                  </span>
                )}
              </div>
              {!isValid && (
                <p className="text-red text-center">Invalid Phone Number</p>
              )}
            </div>

            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Address
              </label>
              <div className="col-sm-9">
                <div className="input-group">
                  <input

                    className="form-control"
                    maxLength={200}
                    name="addr"
                    value={formData?.addr}
                    onChange={handleInputChange}
                  />
                  {openData?.addr ? (
                    <span className="input-group-text">
                      {openData?.addr.length}/200
                    </span>
                  ) : null}
                </div>
                {/*  <div style={{ color: "red" }}>{error1}</div> */}
              </div>
            </div>

            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Question(1): <span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  className="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  name="quesId1"
                  value={formData?.quesId1 || ""} // Provide a default value if it's undefined
                  onChange={handleSelectChange}
                >
                  <option value="">Select an option</option>{" "}
                  {/* Add a default option */}
                  {openData?.ddSecretQuesInfo?.map((item) => (
                    <option key={item.value} value={item.value} label={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <label className="col-md-3 form-label">Answer<span className="text-red">*</span></label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  id="exampleFormControlSelect1"
                  max={6}
                  // value={weight}
                  name="ansDesc1"
                  value={formData?.ansDesc1}
                  onChange={handleInputChange}
                  placeholder=""
                />

              </div>
            </div>
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Question(2): <span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  className="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  name="quesId2"
                  value={formData?.quesId2 || ""} // Provide a default value if it's undefined
                  onChange={handleSelectChange}
                >
                  <option value="">Select an option</option>{" "}
                  {/* Add a default option */}
                  {openData?.ddSecretQuesInfo?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <label className="col-md-3 form-label">Answer<span className="text-red">*</span></label>
              <div className="col-sm-9 input-group">
                <input
                  className="form-control"
                  type="text"
                  id="exampleFormControlSelect1"
                  max={6}
                  // value={weight}
                  name="ansDesc2"
                  value={formData?.ansDesc2}
                  onChange={handleInputChange}
                  placeholder=""
                />

              </div>
            </div>




            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Status <span className="text-red">*</span>
              </label>
              <div className="col-sm-9 input-group">
                <select
                  required
                  className="from-group col-md-12 rounded-3 border"
                  aria-label="Default select example"
                  name="actFlg"
                  value={formData?.actFlg || ""} // Provide a default value if it's undefined
                  onChange={handleSelectChange}
                >
                  <option disabled>Select an option</option>
                  {openData?.ddActFlg?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="container text-center mb-4">
              <button type="submit" className="btn btn-primary mx-2"
              // onClick={postDataToAPI}
              >
                Change
              </button>
              <button type="reset" className="btn btn-secondary"
              // onClick={postDataToAPI}
              >
                Reset
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
export default UserProfile;
