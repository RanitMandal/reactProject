import React, { Fragment, useEffect, useState } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";
import RightSidebar from "../layouts/RightSidebar/RightSidebar";
import * as Switcherdata from "../data/Switcher/Switcherdata";
import { Outlet } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import { getApiToken, getScplAdContext } from "../main/common/common";
import axios from "axios";
const headers = { Authorization: "Bearer " + getApiToken() };
export default function App() {
  const [sidebarModId, set_sidebarModId] = useState("")
  const [currentLvlRefCd, set_currentLvlRefCd] = useState("")
  const [headerProfImgAdd, set_headerProfImgAdd] = useState("")
  const [favLinkList, set_favLinkList] = useState(null)
  const userId = getScplAdContext().userId;
  const currentModule = sessionStorage.getItem("modId")
  const currentLvlRefCdBySS = sessionStorage.getItem("lvlRefCd");
  const [navHistObj, set_navHistObj] = useState({
    modnames: [],
    modPaths: []
  })

  //navHist is use for triggaring useEffect (using favlink) and getting initial data
  const [navHist, set_navHist] = useState(JSON.parse(sessionStorage.getItem("navHist")))

  useEffect(() => {
    let navData;
    try {
      navData = JSON.parse(sessionStorage.getItem("navHist"))
  
    } catch (err) {
      console.log("Err while geting navList", err);
    }
    if(navData){
    console.log(navData, "navHist")
      set_navHistObj({
        modnames: Object.keys(navData) || [],
        modPaths: Object.values(navData) || []
      })
    }
   }, [navHist])

console.log("app");
   //Form open api calling
   const [jacketInfo, set_jacketInfo] = useState({});
   useEffect(() => {
     // console.log(headers);
     let openFormObj = {
      apiId: "SUA00010",
    };
     const fetchJacketInfo = async () => {
       try {
         const response = await axios.post(
           process.env.REACT_APP_API_URL_PREFIX + "/SUF00027/openForm",
           openFormObj,
           { headers }
         );
         const data = response.data.content.mst;
 
         set_jacketInfo(data);

       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
 
     fetchJacketInfo();
   }, []);
   //Form open api end
 


  const [allNews, set_allNews] = useState([])
  useEffect(() => {
    const body={
      apiId: "SUA00637",
      mst: {
        lvlRefCd: currentLvlRefCd || currentLvlRefCdBySS,
        userId:userId
  
      }
    }
     const fetchAllNews = async ()=>{
      await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00131/getAllNewsByCriteria", 
      body, 
      {headers})
      .then(res=>{
        set_allNews(res.data?.content?.qryRsltSet)
        

      })
     }
     fetchAllNews()
   }, [currentLvlRefCd])

  // const [allNews, set_allNews] = useState({
  //   whatsNew: [],
  //   topnews : [],
  //   scrollnews: [],
  //   flashNews: [],
  //   alertNews: []
  // })
  // useEffect(() => {
  //   const body={
  //     apiId: "SUA00637",
  //     mst: {
  //       lvlRefCd: currentLvlRefCd || currentLvlRefCdBySS,
  //       userId:userId
  
  //     }
  //   }
  //    const fetchAllNews = async ()=>{
  //     await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00131/getAllNewsByCriteria", 
  //     body, 
  //     {headers})
  //     .then(res=>{
  //       set_allNews(res.data?.content?.qryRsltSet)
  //       const list = res.data?.content?.qryRsltSet
  //       list.map((item)=>{

  //       })
        

  //     })
  //    }
  //    fetchAllNews()
  //  }, [currentLvlRefCd])


  useEffect(() => {
    let body = {
      apiId: "SUA00565",
      mst: {
        modId: currentModule,
        userCd: userId
      }
    };
    const fetchFavLinkList=async ()=>{
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00138/getListPageData",
          body,
          {
            headers,
          }
        )
        .then((res) => {
          
          if (res.data?.content?.qryRsltSet?.length) {
            set_favLinkList(res.data?.content.qryRsltSet)

        }
        else {
          set_favLinkList([])
        }

        });

    }
    fetchFavLinkList()
  }, [sidebarModId])


  useEffect(() => {
    let openFormObj = {
      apiId: "SUA00527",
      mst: {
        userId: userId
      }
    };
    const fetchOpenData = async () => {
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + "/SUF00033/openProfileEditForm",
          openFormObj,
          {
            headers,
          }
        )
        .then((res) => {
          
          if(res.data?.content?.mst?.usrImgFileId){
            
            let fileDtl = res.data?.content?.mst
            let ext = fileDtl?.usrImgFileNm?.split(".")[1]
            const imageUrl = `${process.env.REACT_APP_API_URL_PREFIX}${fileDtl?.usrImgFilePath}${fileDtl?.usrImgFileId}.${ext}`;
            set_headerProfImgAdd(imageUrl)
           
          }
        });
    };

    fetchOpenData();
  }, []);


  return ( 
    <Fragment>
      <div className="horizontalMenucontainer">
        <TabToTop />
        <div className="page">
          <div className="page-main">
            <Header jacketInfo={jacketInfo} allNews={allNews} currentModuleId={sidebarModId} headerProfImgAdd={headerProfImgAdd} favLinkList={favLinkList} set_favLinkList={set_favLinkList} />
            <Sidebar sidebarModId={sidebarModId} />
            <div className="main-content app-content ">
              <div className="side-app">
                <div
                  className="main-container container-fluid"
                  onClick={() => {
                    Switcherdata.responsiveSidebarclose();
                    Switcherdata.Horizontalmenudefultclose();
                  }}
                >
                {<Outlet context={{
                  set_sidebarModId ,
                  set_headerProfImgAdd,
                  set_favLinkList,
                  set_currentLvlRefCd,
                  favLinkList,
                  set_navHist
                }} />}
                </div>
              </div>
            </div>
          </div>
          <RightSidebar currentModuleId={sidebarModId} navHistObj={navHistObj}  />
          <Switcher />
          {/* <Footer jacketInfo={jacketInfo} allNews={allNews} /> */}
        </div>
      </div>
    </Fragment>
  );
}

