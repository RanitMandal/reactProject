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
import { portalLovColumns, menuTypLovColumns, formLovColumns, modLovColumns, artLovColumns, artCatLovColumns } from "./columns";
import MsgAlert from "../../common/MsgAlert";
import { orderBy } from "@progress/kendo-react-all";
// import { DistLovColumns } from "./Columns";
const headers = { Authorization: 'Bearer ' + getApiToken() };



export const MenuTreeForm = ({ editMode, post, dispatch, mode, rowId, setData, data, onClose, row, rowData, index, queryInputObj, msg, setMsg, msgTyp, setMsgTyp, addVal, setEdtVal, edtVal, parMsg, setParMsg, parMsgTyp, setParMsgTyp, errExp, set_errExp, parErrExp, set_parErrExp, updateEdtVal, }) => {

    const fetchData = async () => {

        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00003/getListPageData', queryInputObj, { headers }).then((res) => {
            console.log(res.data);
            setData(res?.data?.content.qryRsltSet);
            console.log(data);
            setParMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setParMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_parErrExp({ status: res.data?.appMsgList?.errorStatus })

        })
    }
    console.log(mode);
    console.log(rowData);
    console.log(rowId);
    console.log(addVal);

    // const [msg, setMsg] = useState("")
    // const [msgTyp, setMsgTyp] = useState("")

    const [formData, setFormData] = useState({
        // menuId: '',
        menuTypId: '',
        menuTypTitle: '',
        menuTitle: '',
        // menuAlias: '',
        // routePath: '',
        // menuLink: '',
        linkTyp: 'A',
        modId: '',
        modNm: '',
        formId: '',
        formNm: '',
        articleId: '',
        articleTitle: '',
        articleCatId: '',
        articleCatTitle: '',
        parMenuId: '',
        parMenuTitle: '',
        // treeLevel: 0,
        orderBy: 0,
        menuImgUrl: '',
        menuIcon: '',
        menuParams: '',
        portalHome: 'N',
        portalId: '',
        portalTitle: '',
        // actFlg: 'A',


    });

    useEffect(() => {
        if (mode !== 1) {
            setFormData({
                menuId: edtVal ? edtVal.menuId : '',
                menuTypId: edtVal ? edtVal.menuTypId : '',
                menuTypTitle: edtVal ? edtVal.menuTypTitle : '',
                menuTitle: edtVal ? edtVal.menuTitle : '',
                // menuAlias: edtVal ? edtVal.menuAlias : '',
                // routePath: edtVal ? edtVal.routePath : '',
                menuLink: edtVal ? edtVal.menuLink : '',
                linkTyp: edtVal ? edtVal.linkTyp : 'A',
                modId: edtVal ? edtVal.modId : '',
                modNm: edtVal ? edtVal.modNm : '',
                formId: edtVal ? edtVal.formId : '',
                formNm: edtVal ? edtVal.formNm : '',
                articleId: edtVal ? edtVal.articleId : '',
                articleTitle: edtVal ? edtVal.articleCatTitle : '',
                articleCatId: edtVal ? edtVal.articleCatId : '',
                articleCatTitle: edtVal ? edtVal.articleCatTitle : '',
                parMenuId: edtVal ? edtVal.parMenuId : '',
                parMenuTitle: edtVal ? edtVal.parMenuTitle : '',
                // treeLevel: edtVal ? edtVal.treeLevel : 0,
                orderBy: edtVal ? edtVal.orderBy : 0,
                menuImgUrl: edtVal ? edtVal.menuImgUrl : '',
                menuIcon: edtVal ? edtVal.menuIcon : '',
                menuParams: edtVal ? edtVal.menuParams : '',
                portalHome: edtVal ? edtVal.portalHome : 'N',
                portalId: edtVal ? edtVal.portalId : '',
                portalTitle: edtVal ? edtVal.portalTitle : '',
                actFlg: edtVal ? edtVal.actFlg : 'A',

            })
        }
    }, [mode, edtVal])




    //Portal Lov Starts

    const [portalLovData, setPortalLovData] = useState([]);
    useEffect(() => {
        const portalLovObj = {
            apiId: "WPA00051",
        };
        const fetchPortalLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllPortal", portalLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setPortalLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        fetchPortalLovData();
    }, []);

    const getPortalTitle = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalTitle ? portalLovData[Number(Object.keys(obj)[0])]?.portalTitle : "";
    };

    const getPortalId = (obj) => {
        return portalLovData[Number(Object.keys(obj)[0])]?.portalId ? portalLovData[Number(Object.keys(obj)[0])]?.portalId : "";
    };

    const [selectRowPortalLov, setSelectRowPortalLov] = useState({});
    const [showModelPortalLov, setShowModelPortalLov] = useState(false);
    const handleRowClickPortalLov = (rowData) => {
        setSelectRowPortalLov(rowData);
        setFormData({
            ...formData,
            portalId: getPortalId(rowData),
            portalTitle: getPortalTitle(rowData),
            menuTypId: "",
            menuTypTitle: "",
            articleCatId: "",
            articleCatTitle: "",
            articleId: "",
            articleTitle: "",
            parMenuId: "",
            parMenuTitle: ""
        })
    };

    //portal Lov Ends



    //Menu Typ Lov Starts

    const [menuTypLovData, setMenuTypLovData] = useState([]);
    useEffect(() => {
        const menuTypLovObj = {
            apiId: "WPA00054",
            criteria: {
                portalId: formData.portalId
            }
        };
        const fetchMenuTypLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllMenuType", menuTypLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setMenuTypLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        formData.portalId && fetchMenuTypLovData();
    }, [formData?.portalId]);

    const getMenuTypTitle = (obj) => {
        return menuTypLovData[Number(Object.keys(obj)[0])]?.menuTypTitle ? menuTypLovData[Number(Object.keys(obj)[0])]?.menuTypTitle : "";
    };

    const getMenuTypId = (obj) => {
        return menuTypLovData[Number(Object.keys(obj)[0])]?.menuTypId ? menuTypLovData[Number(Object.keys(obj)[0])]?.menuTypId : "";
    };

    const [selectRowMenuTypLov, setSelectRowMenuTypLov] = useState({});
    const [showModelMenuTypLov, setShowModelMenuTypLov] = useState(false);
    const handleRowClickMenuTypLov = (rowData) => {
        setSelectRowMenuTypLov(rowData);
        setFormData({
            ...formData,
            menuTypId: getMenuTypId(rowData),
            menuTypTitle: getMenuTypTitle(rowData)

        })
    };

    //Menu Typ Lov Ends



    //Article Lov Starts

    const [artLovData, setArtLovData] = useState([]);
    useEffect(() => {
        const artLovObj = {
            apiId: "WPA00057",
            criteria: {
                portalId: formData.portalId,
                articleCatId: formData.articleCatId,
            }
        };
        const fetchArtLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllArticle", artLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setArtLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        formData.articleCatId && fetchArtLovData();
    }, [formData?.articleCatId]);

    const getArtTitle = (obj) => {
        return artLovData[Number(Object.keys(obj)[0])]?.articleTitle ? artLovData[Number(Object.keys(obj)[0])]?.articleTitle : "";
    };

    const getArtId = (obj) => {
        return artLovData[Number(Object.keys(obj)[0])]?.articleId ? artLovData[Number(Object.keys(obj)[0])]?.articleId : "";
    };

    const [selectRowArtLov, setSelectRowArtLov] = useState({});
    const [showModelArtLov, setShowModelArtLov] = useState(false);
    const handleRowClickArtLov = (rowData) => {
        setSelectRowArtLov(rowData);
        setFormData({
            ...formData,
            articleId: getArtId(rowData),
            articleTitle: getArtTitle(rowData)
        })
    };

    //Article Lov Ends


    //ArtCat Starts
    //TreeLov Api................
    const [dataaArtCat, setDataaArtCat] = useState([]);
    const [openModalArtCat, setOpenModalArtCat] = useState(false);


    const fetchTreeLovDataArtCat = async () => {
        let artCatObj = {
            apiId: "WPA00056",
            criteria: {
                portalId: formData?.portalId,

            }
        }
        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllArticleCat", artCatObj, { headers })
            .then((res) => {
                console.log(res.data);

                if (res.data?.content?.qryRsltSet?.length) {

                    const modifyData = (items) => {
                        return items.map((item) => {
                            const newItem = {
                                ...item,
                                // CatNm: item.text,
                                // CatId: item.id,
                                // parCatId: item.parentId,
                            };
                            if (item.children) {
                                newItem.children = modifyData(item.children);
                            }
                            return newItem;
                        });
                    };

                    const modifiedData = modifyData(res.data.content.qryRsltSet);

                    setDataaArtCat(modifiedData);
                }

                else {
                    setDataaArtCat([])
                }
                setOpenModalArtCat(true);
            });
    };

    console.log(dataa)

    const handleOpenModalArtCat = () => {
        fetchTreeLovDataArtCat();
    }

    const onRenderItemArtCat = (item, treeview) => {
        console.log(item);
        return (
            <div className="treeview-item-example">
                <span onClick={(e) => handleItemClickArtCat(item)} className="treeview-item-example-text">{item.text}</span>
            </div>
        )
    }

    const handleItemClickArtCat = (item) => {
        const menuId = item.id;
        console.log(menuId)
        setFormData({
            ...formData,
            articleCatId: item.id,
            articleCatTitle: item.text,
            articleId: "",
            articleTitle: ""

        }) // Assuming `item.text` is the title you want to set
        setOpenModalArtCat(false);



    };
    const handleCloseModalArtCat = () => {
        setOpenModalArtCat(false);
    };
    const handleClearArtCat = () => {
        setFormData({
            ...formData,
            articleCatId: "",
            articleCatTitle: "",

        })
        handleCloseModalArtCat()
    }


    //ArtCat Lov Ends



    //Mod Lov Starts

    const [modLovData, setModLovData] = useState([]);
    useEffect(() => {
        const modLovObj = {
            apiId: "WPA00053",

        };
        const fetchModLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllModule", modLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setModLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        fetchModLovData();
    }, []);

    const getModTitle = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modNm ? modLovData[Number(Object.keys(obj)[0])]?.modNm : "";
    };

    const getModId = (obj) => {
        return modLovData[Number(Object.keys(obj)[0])]?.modId ? modLovData[Number(Object.keys(obj)[0])]?.modId : "";
    };

    const [selectRowModLov, setSelectRowModLov] = useState({});
    const [showModelModLov, setShowModelModLov] = useState(false);
    const handleRowClickModLov = (rowData) => {
        setSelectRowModLov(rowData);
        setFormData({
            ...formData,
            modId: getModId(rowData),
            modNm: getModTitle(rowData),
            formId: "",
            formNm: ""
        })
    };

    //Mod Lov Ends

    //Form Lov Starts

    const [formLovData, setFormLovData] = useState([]);
    useEffect(() => {
        const formLovObj = {
            apiId: "WPA00055",
            criteria: {
                modId: formData.modId
            }
        };
        const fetchFormLovData = async () => {
            await axios
                .post(
                    process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllForm", formLovObj, { headers }).then((res) => {
                        console.log(res.data);
                        if (res.data?.content?.qryRsltSet?.length) {
                            setFormLovData(res.data?.content?.qryRsltSet?.length ? res.data?.content?.qryRsltSet : []
                            );
                        }
                        //   if(res.data?.appMsgList?.errorStatus){
                        //     setMsg(res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")");
                        // setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
                        //   }
                    });
        };

        formData.modId && fetchFormLovData();
    }, [formData?.modId]);

    const getFormNm = (obj) => {
        return formLovData[Number(Object.keys(obj)[0])]?.formNm ? formLovData[Number(Object.keys(obj)[0])]?.formNm : "";
    };

    const getFormId = (obj) => {
        return formLovData[Number(Object.keys(obj)[0])]?.formId ? formLovData[Number(Object.keys(obj)[0])]?.formId : "";
    };

    const [selectRowFormLov, setSelectRowFormLov] = useState({});
    const [showModelFormLov, setShowModelFormLov] = useState(false);
    const handleRowClickFormLov = (rowData) => {
        setSelectRowFormLov(rowData);
        setFormData({
            ...formData,
            formId: getFormId(rowData),
            formNm: getFormNm(rowData)
        })
    };

    //Form Lov Ends






    //Parent Lov Starts
    //TreeLov Api................
    const [dataa, setDataa] = useState([]);
    const [openModal, setOpenModal] = useState(false);


    const fetchTreeLovData = async () => {
        let parCatIdObj = {
            apiId: "WPA00052",
            criteria: {
                portalId: formData?.portalId,
                menuTypId: formData.menuTypId,
            }
        }
        await axios
            .post(process.env.REACT_APP_API_URL_PREFIX + "/WPF00003/getAllParMenuId", parCatIdObj, { headers })
            .then((res) => {
                console.log(res.data);

                if (res.data?.content?.qryRsltSet?.length) {

                    const modifyData = (items) => {
                        return items.map((item) => {
                            const newItem = {
                                ...item,
                                // CatNm: item.text,
                                // CatId: item.id,
                                // parCatId: item.parentId,
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

    const handleOpenModal = () => {
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
            parMenuId: item.id,
            parMenuTitle: item.text,

        }) // Assuming `item.text` is the title you want to set
        setOpenModal(false);



    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleClear = () => {
        setFormData({
            ...formData,
            parMenuId: "",
            parMenuTitle: "",

        })
        handleCloseModal()
    }


    //ParEnt Lov Ends



    console.log(formData);


    // useEffect(() => {
    //     if (mode === 1) {
    //         setEdtVal({
    //             portalId: '',
    //             portalTitle: '',
    //             actFlg: 'A',
    //         })

    //     }
    // }, [mode])



    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setCharCount({ ...charCount, [event.target.name]: true });
    };

    const handleStatusChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // setEdtVal({ ...edtVal, [event.target.name]: event.target.value })
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
            menuId: '',
            menuTypId: '',
            menuTypTitle: '',
            menuTitle: '',
            // menuAlias: '',
            // routePath: '',
            menuLink: '',
            linkTyp: 'A',
            modId: '',
            modNm: '',
            formId: '',
            formNm: '',
            articleId: '',
            articleTitle: '',
            articleCatId: '',
            articleCatTitle: '',
            parMenuId: '',
            parMenuTitle: '',
            // treeLevel: 0,
            orderBy: 0,
            menuImgUrl: '',
            menuIcon: '',
            menuParams: '',
            portalHome: 'N',
            portalId: '',
            portalTitle: '',
            actFlg: 'A',


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


        const { menuLink, modNm, articleCatTitle, articleTitle, parMenuTitle, formNm,  portalTitle, menuTypTitle, ...obj } = formData

        const addObj =
        {
            apiId: "WPA00045",
            mst:
            {
                ...obj,
                orderBy: parseInt(obj.orderBy)
            }



        }


        const editObj = {
            apiId: "WPA00047",
            mst: {
                ...obj,
                // actFlg: formData.actFlg,
                orderBy: parseInt(obj.orderBy),
                
            }
        }


        if (mode === 1)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00003/saveEdit', addObj, { headers }).then(res => {
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
            }).finally(() => {
                set_viewMsg(true)
            });


        if (mode === 2)
            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00003/saveEdit', editObj, { headers }).then(res => {
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
            }).finally(() => {
                set_viewMsg(true)
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
            apiId: "WPA00050",
            mst: {

                menuId: formData.menuId

            }
        }


        axios
            .post(process.env.REACT_APP_API_URL_PREFIX + '/WPF00003/saveDelete', deleteObj, { headers })
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
            }).finally(() => {
                set_viewMsg(true)
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
                    Menu Tree  {getFormTitle(mode)}
                </h4>



                <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>

                    {/* menu id */}
                    {<div className="row mb-4">
                        <label className="col-md-3 form-label">Menu:<span className="text-red">*</span></label>
                        <div className="input-group col-md-9">

                            <input
                                type="text"
                                autoComplete={false}
                                name="menuId"
                                className="form-control col-md-3"
                                value={formData.menuId}
                                readOnly
                            /> &nbsp;&nbsp;&nbsp;

                            <input
                                type="text"
                                autoComplete={false}
                                name="menuTitle"
                                className="form-control"
                                value={formData.menuTitle}
                                onChange={handleInputChange}
                                disabled={mode===3 || mode===4}
                                required
                            />
                        </div>
                    </div>}



                    {/* Portal LOV */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label">
                            <b>
                                Portal Id:<span className="text-red">*</span>
                            </b>
                        </label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <span class="input-group-text bg-primary">
                                    <i
                                        className="fa fa-search d-inline text-white"
                                        title=""
                                        onClick={() => setShowModelPortalLov(true)}
                                    />
                                </span>

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData.portalId}
                                    required
                                />

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    value={formData.portalTitle}

                                />
                                <div className="row-mb-12">
                                    {showModelPortalLov && (
                                        <Lov
                                            moduleLovData={portalLovData}
                                            setShowModel={setShowModelPortalLov}
                                            showModel={showModelPortalLov}
                                            handleRowClick={handleRowClickPortalLov}
                                            columns={portalLovColumns}
                                            currentSelection={selectRowPortalLov}
                                            setCurrentSelection={setSelectRowPortalLov}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* menuType LOV */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label">
                            <b>
                                Menu Type:<span className="text-red">*</span>
                            </b>
                        </label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <span class="input-group-text bg-primary">
                                    <i
                                        className="fa fa-search d-inline text-white"
                                        title=""
                                        onClick={() => setShowModelMenuTypLov(true)}
                                    />
                                </span>

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData.menuTypId}
                                    required
                                />

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    value={formData.menuTypTitle}

                                />
                                <div className="row-mb-12">
                                    {showModelMenuTypLov && (
                                        <Lov
                                            moduleLovData={menuTypLovData}
                                            setShowModel={setShowModelMenuTypLov}
                                            showModel={showModelMenuTypLov}
                                            handleRowClick={handleRowClickMenuTypLov}
                                            columns={menuTypLovColumns}
                                            currentSelection={selectRowMenuTypLov}
                                            setCurrentSelection={setSelectRowMenuTypLov}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ArtCat LOV */}
                    <div class="row mb-4 ">

                        <label
                            for="exampleFormControlSelect1"
                            className="col-md-3 col-form-label"
                        >
                            <b>Article Category:</b>

                        </label>
                        <div className="col-md-9">
                            <div class="input-group">
                                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModalArtCat()} /></span>}
                                <input type="text" class="form-control " value={formData?.articleCatId}

                                    disabled={mode === 3 || mode === 4} />
                                <input type="text" class="form-control  mx-4" value={formData?.articleCatTitle}

                                    disabled={mode === 3 || mode === 4} />
                            </div>
                        </div>
                        <div className="row-mb-12">
                            {/* Modal */}
                            {openModalArtCat && (
                                <Modal scrollable show={openModalArtCat} onHide={handleCloseModalArtCat} style={{ zIndex: 9999 }}>
                                    <Modal.Header closeButton>
                                        <Modal.Title><b>Select Article Cat Id</b></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <TreeView
                                            id="treeview1"
                                            style={{ height: "auto" }}
                                            showIcon={false}
                                            className="branch"
                                            items={dataaArtCat}
                                            onSelectItem={handleItemClickArtCat}
                                            onRenderItem={onRenderItemArtCat}

                                        />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className="btn btn-primary" onClick={handleCloseModalArtCat}>Close</button>
                                        <button className="btn btn-primary" onClick={handleClearArtCat}>Clear</button>
                                    </Modal.Footer>
                                </Modal>
                            )}

                        </div>
                    </div>

                    {/* Article LOV */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label">
                            <b>
                                Article:<span className="text-red">*</span>
                            </b>
                        </label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <span class="input-group-text bg-primary">
                                    <i
                                        className="fa fa-search d-inline text-white"
                                        title=""
                                        onClick={() => setShowModelArtLov(true)}
                                    />
                                </span>

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData.articleId}
                                    required
                                />

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    value={formData.articleTitle}

                                />
                                <div className="row-mb-12">
                                    {showModelArtLov && (
                                        <Lov
                                            moduleLovData={artLovData}
                                            setShowModel={setShowModelArtLov}
                                            showModel={showModelArtLov}
                                            handleRowClick={handleRowClickArtLov}
                                            columns={artLovColumns}
                                            currentSelection={selectRowArtLov}
                                            setCurrentSelection={setSelectRowArtLov}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mod LOV */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label">
                            <b>
                                Module:<span className="text-red">*</span>
                            </b>
                        </label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <span class="input-group-text bg-primary">
                                    <i
                                        className="fa fa-search d-inline text-white"
                                        title=""
                                        onClick={() => setShowModelModLov(true)}
                                    />
                                </span>

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData.modId}
                                    required
                                />

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    value={formData.modNm}

                                />
                                <div className="row-mb-12">
                                    {showModelModLov && (
                                        <Lov
                                            moduleLovData={modLovData}
                                            setShowModel={setShowModelModLov}
                                            showModel={showModelModLov}
                                            handleRowClick={handleRowClickModLov}
                                            columns={modLovColumns}
                                            currentSelection={selectRowModLov}
                                            setCurrentSelection={setSelectRowModLov}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form LOV */}
                    <div className="row mb-4 ">
                        <label className="col-sm-3 col-form-label">
                            <b>
                                Form:<span className="text-red">*</span>
                            </b>
                        </label>
                        <div className="col-md-9">
                            <div className="input-group">
                                <span class="input-group-text bg-primary">
                                    <i
                                        className="fa fa-search d-inline text-white"
                                        title=""
                                        onClick={() => setShowModelFormLov(true)}
                                    />
                                </span>

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control"
                                    value={formData.formId}
                                    required
                                />

                                <input
                                    type="text"
                                    autoComplete={false}
                                    className="form-control mx-4"
                                    value={formData.formNm}

                                />
                                <div className="row-mb-12">
                                    {showModelFormLov && (
                                        <Lov
                                            moduleLovData={formLovData}
                                            setShowModel={setShowModelFormLov}
                                            showModel={showModelFormLov}
                                            handleRowClick={handleRowClickFormLov}
                                            columns={formLovColumns}
                                            currentSelection={selectRowFormLov}
                                            setCurrentSelection={setSelectRowFormLov}
                                        />
                                    )}
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
                            <b>Parent Menu:</b>

                        </label>
                        <div className="col-md-9">
                            <div class="input-group">
                                {(mode === 1 || mode === 2) && <span class="input-group-text bg-primary" ><i className="fa fa-search d-inline text-white" title="" onClick={() => handleOpenModal()} /></span>}
                                <input type="text" class="form-control " value={formData?.parMenuId}

                                    disabled={mode === 3 || mode === 4} />
                                <input type="text" class="form-control  mx-4" value={formData?.parMenuTitle}

                                    disabled={mode === 3 || mode === 4} />
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

                    {/* Menu ICon */}
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Menu Icon</label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" onChange={handleInputChange} name="menuIcon" value={formData.menuIcon} disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>

                    {/* Menu Params */}
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Menu Parameter</label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" onChange={handleInputChange} name="menuParams" value={formData.menuParams} disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>

                    {/* Menu Image Url */}
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Menu Image Url</label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" onChange={handleInputChange} name="menuImgUrl" value={formData.menuImgUrl} disabled={mode === 3 || mode === 4} />
                        </div>
                    </div>
                    {/* Order By */}
                    <div className="row mb-4">
                        <label className="col-md-3 form-label">Order By:<span className="text-red">*</span></label>
                        <div className="col-md-9">
                            <input className="form-control" type="text" onChange={handleInputChange} name="orderBy" value={formData.orderBy} disabled={mode === 3 || mode === 4} required />
                        </div>
                    </div>


                    {/* Portal Home */}
                    {<div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Portal Home:<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                            <select
                                className="form-select col-md-12"
                                name="portalHome"
                                //defaultValue={edtVal.dtlActFlg}
                                onChange={handleStatusChange}
                                value={formData?.portalHome}
                                placeholder="Select"
                                required
                                disabled={mode === 3 || mode === 4}
                            >
                                <option>--Select--</option>

                                {(mode === 1) ?
                                    (addVal?.ddHomeFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.ddHomeFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }


                            </select>
                        </div>
                    </div>}

                    {/* Link Type */}
                    {<div className="row mb-4">
                        <label className="col-md-3 form-label">
                            Link Type:<span className="text-red">*</span>
                        </label>
                        <div className="col-md-9">
                            <select
                                className="form-select col-md-12"
                                name="linkTyp"
                                //defaultValue={edtVal.dtlActFlg}
                                onChange={handleStatusChange}
                                value={formData?.linkTyp}
                                placeholder="Select"
                                required
                                disabled={mode === 3 || mode === 4}
                            >
                                <option>--Select--</option>

                                {(mode === 1) ?
                                    (addVal?.ddLinkTypFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    ))) : (edtVal?.ddLinkTypFlg?.map((item) => (
                                        <option value={item.value}>{item.label}</option>
                                    )))
                                }


                            </select>
                        </div>
                    </div>}

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