import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
// import { DistLovColumns } from "./Columns";
// import { moduleGrpLovColumns, moduleLovColumns } from "./Columns";
import Lov from "../../common/Lov _new";

export const PostDefinitionForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, updateEdtVal, }) => {
  
  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00013/getListPageData', queryInputObj, { headers }).then((res) => {
      console.log(res.data);
      setData(res?.data?.content.qryRsltSet);
      console.log(data);
      setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
      setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
      set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

    })
  }
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")

  const [formData, setFormData] = useState({
    postCd:  '',
    postNm:  '',
    actFlg: 'A',
    officerTyp: '',
    rankCd: ''
    
  });

  useEffect(() => {
   if(mode!==1){
    setFormData({
      officerTyp:  rowData ? rowData.officerTyp : '',
      rankCd: rowData ? rowData.rankCd : '',
      postCd: rowData ? rowData.postCd : '',
      postNm: rowData ? rowData.postNm : '',
      actFlg: rowData ? rowData?.actFlg : 'A',
      
    })
   }
  }, [mode, edtVal])
  
  // //state lov Starts
  // const updateOpenData = (newOpenData) => {
  //   newOpenData(newOpenData);
  // };
  // const [stateData, setStateData] = useState({});
  // let postStateObj = {
  //   apiId: "CIA00038",
  // };
  // useEffect(() => {
  //   const fetchStateNameLovData = async () => {
  //     await axios
  //       .post(
  //         process.env.REACT_APP_API_URL_PREFIX + "/HRF00013/getAllState",
  //         postStateObj,
  //         { headers }
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //         setStateData(res.data ? res.data : []);
  //         /*   setMsg(
  //             res?.data?.appMsgList?.list[0]?.errDesc +
  //               " (" +
  //               res?.data?.appMsgList?.list[0]?.errCd +
  //               ")"
  //           );
  //           setMsgTyp(res?.data?.appMsgList?.list[0]?.errType); */
  //       });
  //   };
  //   fetchStateNameLovData();
  // }, []);

  // const getStateName = (obj) => {
  //   return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.distNm;
  // };

  // const getStateId = (obj) => {
  //   return stateData?.content?.qryRsltSet[Number(Object.keys(obj)[0])]?.distCd;
  // };

  // const [selectRow, setSelectRow] = useState("");
  // const [showModelStateLov, setShowModelStateLov] = useState(false);
  // const handleRowClickStateLov = (rowData) => {
  //   setSelectRow(rowData);
  //   setFormData({
  //     ...formData,
  //     distCd:getdistCd(rowData),
  //     distNm:getdistNm(rowData)
  //   }
  //   )
  //   // console.log(getStateId(rowData));
  //   // console.log(getStateName(rowData));
  //   // setSelectRowModuleLov({});

  //   // updateOpenData({
  //   //   ...formData,
  //   //   stateCd: getStateCd(rowData),
  //   //   stateNm: getStateNm(rowData),
  //   //   distCd: "",
  //   //   distNm: ""
  //   // });
  //   // In the rendering section
  //   // console.log("Rendering with openData:", openData);
  //   // console.log(openData?.content?.mst.stateCd)
  // };
  // //state Lov ends




  console.log(formData);


  useEffect(() => {
    if (mode === 1) {
      setEdtVal({
        postCd: '',
        postNm: '',
        actFlg: 'A',
      })

    }
  }, [mode])



  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
  };

  const validateInput = (formData) => {
    if ((!formData.name.trim()) || (formData.dev_nm.trim() === "")) {
      return false;
    }
    if ((!formData.addr.trim()) || (formData.addr.trim() === "")) {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {

    setFormData({
      postCd: '',
      postNm: '',
      actFlg: 'A'
    })

  };
  //  setEdtVal({
  //   postCd: '', 
  //   postNm: '',
  //   actFlg:  'A'
  //  })

  const [charCount, setCharCount] = useState({

    postNm: false
  })

  const handleCharCount = (event) => {

    setCharCount({ ...charCount, [event.target.name]: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault()


    const addObj =
    {
      apiId: "HRA00022",
      mst: [
        {
          postNm: formData.postNm,
          officerTyp: formData?.officerTyp,
          rankCd: parseInt(formData.rankCd)
        }


      ]
    }


    const editObj = {
      apiId: "HRA00024",
      mst: {

        actFlg: formData.actFlg,
        postCd: formData.postCd,
        postNm: formData.postNm,
        officerTyp: formData.officerTyp,
        rankCd:parseInt(formData.rankCd)

      }
    }
    const deleteObj = {
      apiId: "CIA00009",
      mst: {

        postCd: formData.postCd

      }
    }

    if (mode === 1)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00013/saveAdd', addObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

        if (res?.data?.appMsgList?.list[0]?.errCd === "CMAI000004") {
          resetForm();
        }

      }).catch(error => {
        console.log("error")
      });


    if (mode === 2)
      await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00013/saveEdit', editObj, { headers }).then(res => {
        console.log(res.data)
        if (!res?.data?.appMsgList?.errorStatus) {
          //TRUE OPERATION
          fetchData()

        }
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

      }).catch(error => {
        console.log("error")
      });


    if (mode === 3) {
      set_open(true)
      // Show confirmation dialog
      // Swal.fire({
      //     title: "Are you sure?",
      //     // text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes, delete it!",
      //     backdrop: true,
      // }).then((result) => {
      // if (result.isConfirmed) {
      // If user confirms, make the delete API call
      // if (window.confirm("Are you sure? The record will be deleted parmanantly")) {
      //   axios
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00013/saveDelete', deleteObj, { headers })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (!res?.data?.appMsgList?.errorStatus) {
      //         fetchData();
      //       }
      //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      //       set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      //     })
      //     .catch((error) => {
      //       console.log("error");
      //     });
      // }
      // });
    }

  };

  const pageTitle = editMode ? 'Edit Post' : 'Create Post';

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add"
        break;
      case 2:
        return "Update"
        break;
      case 3:
        return "Delete"
        break;
      case 4:
        return "View"
        break;

      default:
        return "Unknown"
        break;
    }
  }
  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save"
        break;
      case 2:
        return "Update"
        break;
      case 3:
        return "Delete"
        break;
      case 4:
        return "View"
        break;

      default:
        return "Unknown"
        break;
    }
  }

  const [open, set_open] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false)
  const handleConfirmation = async () => {
    const deleteObj = {
      apiId: "HRA00023",
      mst: {

        postCd: formData.postCd

      }
    }


    axios
      .post(process.env.REACT_APP_API_URL_PREFIX + '/HRF00013/saveDelete', deleteObj, { headers })
      .then((res) => {
        console.log(res.data);
        if (!res?.data?.appMsgList?.errorStatus) {
          fetchData();
        }
        set_delStatus(true)
        setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      })
      .catch((error) => {
        console.log("error");
      });

  }

  const msgRef = useRef(null)
  const [viewMsg, set_viewMsg] = useState(false)
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false)

  }, [viewMsg])


  return (
    <div>


      <div className="container">
        {msg && <div ref={msgRef}> <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /></div>}
        <h4 className="card-title">
          Court Defination  {getFormTitle(mode)}
        </h4>



        <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
             Post Code:
            </label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"

                name="postCd"
                value={formData.postCd}
                readOnly
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
             Post Name: <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="postNm"
                value={formData.postNm}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Post Name"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.postNm && <span className="input-group-text">{formData.postNm.length}/50</span>}

            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
             Rank Code: <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="rankCd"
                value={formData.rankCd}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Rank Name"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.rankCd && <span className="input-group-text">{formData.rankCd.length}/50</span>}

            </div>
          </div>

          <div className=" row mb-4">
            <label className="col-md-3 form-label">
             Officer Type: <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="Integer"
                name="officerTyp"
                value={formData.officerTyp}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Officer Type"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}

              />{charCount.officerTyp && <span className="input-group-text">{formData.officerTyp.length}/50</span>}

            </div>
          </div>


          <div className="row mb-4">
            <label className="col-md-3 form-label">
              Status:
              {/* <span className="text-red">*</span> */}
            </label>
            <div className="col-md-9">
              <select
                className="form-select col-md-12"
                name="actFlg"
                disabled={mode === 3 || mode === 4}
                //  defaultValue={edtVal.dtlactFlg}
                onChange={handleStatusChange}
                value={formData?.actFlg}

              >
                <option disabled>--Select--</option>

                {(mode === 1) ?
                  (addVal?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))) : (edtVal?.ddActFlg?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  )))
                }

              </select>
            </div>
          </div>
          {mode !== 4 && <button type="submit" disabled={delStatus} className='btn btn-primary'>{buttonTitle(mode)}</button>}
          {mode == 1 && <button
            className="btn btn-secondary mx-2"
            type="reset"
            //onClick="resetForm"
            onClick={(e) => resetForm()}
          >
            Reset
          </button>}
        </form>



      </div>

      <ConfirmDialog
        title="Confirmation"
        open={open}
        setOpen={set_open}
        onConfirm={handleConfirmation}
        setConfirmStatus={setConfirmStatus}
        confirmStatus={confirmStatus}
      >
        Are you sure you want to delete this record?
      </ConfirmDialog>
    </div>
  );
};

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}