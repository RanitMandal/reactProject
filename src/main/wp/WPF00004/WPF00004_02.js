import React, { useState, useRef } from "react";
import { useEffect } from 'react';
import { Modal, ModalTitle, Card } from "react-bootstrap";
import axios from 'axios';
import { getApiToken } from "../../common/common"
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import TreeView from "deni-react-treeview";
import Lov from "../../common/Lov _new";
import { userLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
// import { DistLovColumns } from "./Columns";



export const ArticleCategoryMasterForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, updateEdtVal, }) => {

  const fetchData = async () => {

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/getListPageData', queryInputObj, { headers }).then((res) => {
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
    portalId: '',
    portalTitle: '',
    actFlg: 'A',
    articleCatDesc: '',
    articleCatId: '',
    articleCatTitle: '',
    orderBy: 0,
    parCatId: '',


  });

  useEffect(() => {
    if (mode !== 1) {
      setFormData({
        portalId: edtVal ? edtVal.portalId : '',
        portalTitle: edtVal ? edtVal.portalTitle : '',
        actFlg: edtVal ? edtVal?.actFlg : 'A',
        articleCatDesc: edtVal ? edtVal.articleCatDesc : '',
        articleCatId: edtVal ? edtVal.articleCatId : '',
        articleCatTitle: edtVal ? edtVal.articleCatTitle : '',
        orderBy: edtVal ? edtVal.orderBy : '',
        parCatId: edtVal ? edtVal.parCatId===null? "": edtVal.parCatId  : '',
        parCatIdNm: edtVal ? edtVal.parCatIdNm : '',

      })
    }
  }, [mode, edtVal])



  //Portral Id Lov Starts     

  const [userLovData, setUserLovData] = useState([]);
  useEffect(() => {

    const fetchUserLovData = async () => {
      let obj = {
        apiId: 'WPA00028'
      }
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/getAllPortal', obj, { headers })
        .then((res) => {
          console.log(res.data);
          setUserLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []);

        });
    };
    fetchUserLovData();
  }, []);


  const getportalTitle = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.portalTitle ? userLovData[Number(Object.keys(obj)[0])]?.portalTitle : ""
  }

  const getportalId = (obj) => {
    return userLovData[Number(Object.keys(obj)[0])]?.portalId ? userLovData[Number(Object.keys(obj)[0])]?.portalId : ""
  }

  const [selectRow, setSelectRow] = useState("");
  const [selectRowUserLov, setSelectRowUserLov] = useState("");
  const [showModelUserLov, setShowModelUserLov] = useState(false);
  const handleRowClickUserLov = (rowData) => {
    setSelectRow(rowData);
    setSelectRowUserLov(rowData);
    setFormData({
      ...formData,
      portalId: getportalId(rowData),
      portalTitle: getportalTitle(rowData),

    })

  };
  console.log(queryInputObj);
  //Portral Id Lov ends 





  //Parent Lov Starts
  //TreeLov Api................
  const [dataa, setDataa] = useState([]);
  const [openModal, setOpenModal] = useState(false);


const fetchTreeLovData = async () => {
  let parCatIdObj = {
    apiId: "WPA00029",
    criteria: {
      portalId: formData?.portalId
    }
  }
  await axios
    .post(process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/getAllParCatId", parCatIdObj, { headers })
    .then((res) => {
      console.log(res.data);

      if (res.data?.content?.qryRsltSet?.length) {

        const modifyData = (items) => {
          return items.map((item) => {
            const newItem = {
              ...item,
              CatNm: item.text,
              CatId: item.id,
              parCatId: item.parentId,
            };
            if (item.children) {
              newItem.children = modifyData(item.children);
            }
            return newItem;
          });
        };

        const modifiedData = modifyData(res.data.content.qryRsltSet);

        setDataa(modifiedData);
      }

      else {
        setDataa([])
      }
      setOpenModal(true);
    });
};

console.log(dataa)

const handleOpenModal = () =>{
  fetchTreeLovData();
}

const onRenderItem = (item, treeview) => {
  console.log(item);
  return (
    <div className="treeview-item-example">
      <span onClick={(e) => handleItemClick(item)} className="treeview-item-example-text">{item.text}</span>
    </div>
  )
}

const handleItemClick = (item) => {
  const menuId = item.id;
  console.log(menuId)
  setFormData({
    ...formData,
    parCatId: item.CatId,
    parCatIdNm: item.CatNm,

  }) // Assuming `item.text` is the title you want to set
  setOpenModal(false);



};
const handleCloseModal = () => {
  setOpenModal(false);
};
const handleClear = ()=>{
  setFormData({
    ...formData,
    parCatId: "",
    parCatIdNm: "",

  })
  handleCloseModal()
}


//ParEnt Lov Ends


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
//         process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/getAllState",
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



//state Lov Starts
// const [moduleGrpLovData, setModuleGrpLovData] = useState([]);
// useEffect(() => {
//   const modGrpLovObj = {
//     apiId: "CIA00038",


//   }

//   const fetchModuleGrpLovData = async () => {
//     await axios
//       .post(
//         process.env.REACT_APP_API_URL_PREFIX + "/WPF00004/getAllState", modGrpLovObj,
//         { headers }
//       )
//       .then((res) => {
//         console.log(res.data);
//         setModuleGrpLovData(
//           res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
//         );
//       });
//   };
//   fetchModuleGrpLovData();
// }, []);

// const getstateNm = (obj) => {
//   return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateNm : "";
// };

// const getstateCd = (obj) => {
//   return moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd ? moduleGrpLovData[Number(Object.keys(obj)[0])]?.stateCd : "";
// };

// const [selectRow, setSelectRow] = useState("");
// const [showModel, setShowModel] = useState(false);
// const handleRowClick = (rowData) => {
//   setSelectRow(rowData);
//   // setSelectRowModuleLov({});
//   setFormData({
//     ...formData,
//     stateCd: getstateCd(rowData),
//     stateNm: getstateNm(rowData),
//     distCd: "",
//     distNm: ""
//   });
// };
//state Group Lov ends

//district Lov Starts

// const [moduleLovData, setModuleLovData] = useState([]);
// useEffect(() => {
//   const formLovObj = {
//     apiId: "CIA00002",
//     criteria: {
//       stateCd: formData.stateCd,
//     }
//   };

//   const fetchModuleLovData = async () => {
//     await axios
//       .post(
//         process.env.REACT_APP_API_URL_PREFIX +
//         "/WPF00004/getDistByState",
//         formLovObj,
//         { headers }
//       )
//       .then((res) => {
//         console.log(res.data);
//         setModuleLovData(
//           res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
//         );
//       });
//   };

//   formData.stateCd && fetchModuleLovData();
// }, [formData?.stateCd]);

// const getdistNm = (obj) => {
//   return moduleLovData[Number(Object.keys(obj)[0])]?.distNm ? moduleLovData[Number(Object.keys(obj)[0])]?.distNm : "";
// };

// const getdistCd = (obj) => {
//   return moduleLovData[Number(Object.keys(obj)[0])]?.distCd ? moduleLovData[Number(Object.keys(obj)[0])]?.distCd : "";
// };

// const [selectRowModuleLov, setSelectRowModuleLov] = useState("");
// const [showModelModuleLov, setShowModelModuleLov] = useState(false);
// const handleRowClickModuleLov = (rowData) => {
//   setSelectRowModuleLov(rowData);
//   setFormData({
//     ...formData,
//     distCd: getdistCd(rowData),
//     distNm: getdistNm(rowData),
//   });
// setQueryInputObj({

//     ...queryInputObj,
//     distCd: getdistCd(rowData),

// });
// };

//district Lov Ends

console.log(formData);


useEffect(() => {
  if (mode === 1) {
    setEdtVal({
      portalId: '',
      portalTitle: '',
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
    portalId: '',
    portalTitle: '',
    actFlg: 'A',
    articleCatDesc: '',
    articleCatId: '',
    articleCatTitle: '',
    orderBy: 0,
    parCatId: '',
    parCatIdNm: '',

  })

};
//  setEdtVal({
//   portalId: '', 
//   portalTitle: '',
//   actFlg:  'A'
//  })

const [charCount, setCharCount] = useState({

  portalTitle: false
})

const handleCharCount = (event) => {

  setCharCount({ ...charCount, [event.target.name]: false });
};


const handleSubmit = async (e) => {
  e.preventDefault()


  const addObj =
  {
    apiId: "WPA00022",
    mst:
    {
      articleCatDesc: formData.articleCatDesc,
      articleCatTitle: formData.articleCatTitle,
      orderBy: parseInt(formData.orderBy),
      parCatId: formData.parCatId,
      portalId: formData.portalId
    }



  }


  const editObj = {
    apiId: "WPA00020",
    mst: {
      actFlg: formData.actFlg,
      articleCatDesc: formData.articleCatDesc,
      articleCatId: formData.articleCatId,
      articleCatTitle: formData.articleCatTitle,
      orderBy: parseInt(formData.orderBy),
      parCatId: formData.parCatId,
      portalId: formData.portalId
    }
  }


  if (mode === 1)
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/saveAdd', addObj, { headers }).then(res => {
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
    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/saveEdit', editObj, { headers }).then(res => {
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
    //     .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/saveDelete', deleteObj, { headers })
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
    apiId: "WPA00021",
    mst: {

      articleCatId: formData.articleCatId

    }
  }


  axios
    .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00004/saveDelete', deleteObj, { headers })
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
        Article Category Master  {getFormTitle(mode)}
      </h4>



      <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

        <div className=" row mb-4">
          <label className="col-md-3 form-label">
            article category Id <span className="text-red">*</span>
          </label>
          <div className="col-md-9 input-group">
            <input
              className="form-control"
              type="text"
              name="articleCatId"
              value={formData.articleCatId}
              onChange={handleInputChange}
              onBlur={handleCharCount}
              placeholder="article category Id"
              required
              readOnly
              maxLength={50}
              disabled={mode === 3 || mode === 4}

            />
            {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

          </div>
        </div>

        <div className=" row mb-4">
          <label className="col-md-3 form-label">
            article category Description <span className="text-red">*</span>
          </label>
          <div className="col-md-9 input-group">
            <input
              className="form-control"
              type="text"
              name="articleCatDesc"
              value={formData.articleCatDesc}
              onChange={handleInputChange}
              onBlur={handleCharCount}
              placeholder="portal Title"
              required
              maxLength={50}
              disabled={mode === 3 || mode === 4}

            />
            {/* {charCount.portalTitle && <span className="input-group-text">{formData.portalTitle.length}/50</span>} */}

          </div>
        </div>

        <div className=" row mb-4">
          <label className="col-md-3 form-label">
            article category Title <span className="text-red">*</span>
          </label>
          <div className="col-md-9 input-group">
            <input
              className="form-control"
              type="text"
              name="articleCatTitle"
              value={formData.articleCatTitle}
              onChange={handleInputChange}
              onBlur={handleCharCount}
              placeholder="article category Title"
              required
              maxLength={50}
              disabled={mode === 3 || mode === 4}

            />
            {/* {charCount.portalDesc && <span className="input-group-text">{formData.portalDesc.length}/50</span>} */}

          </div>
        </div>


        {/* User Lov */}
        <div className="row mb-4 ">
          <label className="col-sm-3 col-form-label"><b>Portal Id :<span className="text-red">*</span></b></label>
          <div className="col-md-9">
            <div className="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => setShowModelUserLov(true)} /></span>}

              <input
                type="text"
                autoComplete={false}
                className="form-control"
                required
                disabled={mode === 3 || mode === 4}
                value={formData?.portalId}

              />
              <input
                type="text"
                autoComplete={false}
                className="form-control mx-4"
                required
                name="portalTitle"
                disabled={mode === 3 || mode === 4}
                value={formData?.portalTitle}

              />
              <div className="row-mb-12">
                {showModelUserLov && <Lov
                  moduleLovData={userLovData}
                  setShowModel={setShowModelUserLov}
                  showModel={showModelUserLov}
                  handleRowClick={handleRowClickUserLov}
                  columns={userLovColumns}
                  currentSelection={selectRow}
                  setCurrentSelection={setSelectRow}
                />}
              </div>
            </div>
          </div>
        </div>


        {/* Parent LOV */}
        <div class="row mb-4 ">

          <label
            for="exampleFormControlSelect1"
            className="col-md-3 col-form-label"
          >
            <b>Parent category Id:</b>

          </label>
          <div className="col-md-9">
            <div class="input-group">
              {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>}
              <input type="text" class="form-control " value={formData?.parCatId}

                readOnly disabled={mode === 3 || mode === 4} />
              <input type="text" class="form-control  mx-4" value={formData?.parCatIdNm}

                readOnly disabled={mode === 3 || mode === 4} />
            </div>
          </div>
          <div className="row-mb-12">
            {/* Modal */}
            {openModal && (
              <Modal scrollable show={openModal} onHide={handleCloseModal} style={{ zIndex: 9999 }}>
                <Modal.Header closeButton>
                  <Modal.Title><b>Select Parent Cat Id</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <TreeView
                    id="treeview1"
                    style={{ height: "auto" }}
                    showIcon={false}
                    className="branch"
                    items={dataa}
                    onSelectItem={handleItemClick}
                    onRenderItem={onRenderItem}
                    
                  />
                </Modal.Body>
                <Modal.Footer>
                  <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                  <button className="btn btn-primary" onClick={handleClear}>Clear</button>
                </Modal.Footer>
              </Modal>
            )}

          </div>
        </div>
        {/*  parent lov */}





        <div className=" row mb-4">
          <label className="col-md-3 form-label">
            order By <span className="text-red">*</span>
          </label>
          <div className="col-md-9 input-group">
            <input
              className="form-control"
              type="text"
              name="orderBy"
              value={formData.orderBy}
              onChange={handleInputChange}
              onBlur={handleCharCount}
              placeholder="order By"
              required
              maxLength={50}
              disabled={mode === 3 || mode === 4}

            />
            {/* {charCount.portalLogoUrl &&
               <span className="input-group-text">{formData.portalLogoUrl.length}/50</span>
               } */}

          </div>
        </div>











       

        

        {(mode !== 1) && <div className="row mb-4">
          <label className="col-md-3 form-label">
            Status:
          </label>
          <div className="col-md-9">
            <select
              className="form-select col-md-12"
              name="actFlg"
              //defaultValue={edtVal.dtlActFlg}
              onChange={handleStatusChange}
              value={formData?.actFlg}
              placeholder="Select"
              disabled={mode === 3 || mode === 4}
            >
              <option>--Select--</option>

              {(mode !== 1) &&
                (edtVal?.ddActFlg?.map((item) => (
                  <option value={item.value}>{item.label}</option>
                )))
              }


            </select>
          </div>
        </div>}
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
)
        }

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}