import React, { useEffect, useState } from 'react'
import { getApiToken, getScplAdContext } from './common';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const headers = { Authorization: 'Bearer ' + getApiToken() };
function FavLink() {
    const [saveLoading, set_saveLoading] = useState(false)
    const [saveStatus, set_saveStatus] = useState(false)
    const [current, set_current] = useState(null)
    const {favLinkList, set_favLinkList, set_navHist} = useOutletContext()
    const location = useLocation()
    console.log("fff",location);
    const path = location?.pathname?.slice(1, location?.pathname?.length)


    useEffect(() => {
      let sidebarlinkList = []
      
      let navHist;
      try {
        navHist = JSON.parse(sessionStorage.getItem("navHist"))
      } catch (err) {
        console.log("Err while geting navList", err);
      }

      try {
        sidebarlinkList = JSON.parse(sessionStorage.getItem("sidebarlinkList"))
      } catch (error) {
        console.log(error);
        sidebarlinkList = []
      }

      const found = sidebarlinkList?.find(item=> item?.path === path)
      if(found){ 
        set_current(found)
        
        try {
          if(found){
              navHist = {
                  ...navHist,
                  [found?.title] : found?.path
              }
              sessionStorage.setItem("navHist", JSON.stringify(navHist))
              set_navHist(JSON.stringify(navHist))
          }else{
              console.log("not found navHist && currentForm");
          }  
          } catch (err) {
              console.log("Err while setting navList", err);
          }
        
      
      }

      console.log(location,path, favLinkList,sidebarlinkList, "uuuuuuuuuu");
    }, [location.pathname])
    
    useEffect(() => {
      // const currentPath = JSON.parse(sessionStorage.getItem("currentPath"))
      // const isExist = favLinkList.some((item)=> item.favUrl === currentPath?.path)
      // set_saveStatus(isExist)  

      // let path = window.location.pathname
      // path = path.slice(1, path.length)
      const isExist = favLinkList?.some((item)=> item.favUrl === path)
      set_saveStatus(isExist) 

      
      

    }, [location.pathname, favLinkList?.length])
    

    const handle_savePath = async()=>{
        // let path = window.location.pathname
        // path = path.slice(1, path.length)
        //const currentPath = JSON.parse(sessionStorage.getItem("currentPath"))
        const currentModule = sessionStorage.getItem("modId")
        const userId = getScplAdContext().userId
        //console.log(currentPath);
        const body = {
            "apiId": "SUA00566",
            "mst": {
              "favNm": current?.title,
              "favUrl": current?.path,
              "menuId": current?.menuId,
              "modId": currentModule,
              "ordBy": 0,
              "userCd": userId
            }
        }
        
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00138/saveAdd', 
        body, 
        { headers }
        ).then((res) => {
            if(res.data?.appMsgList?.errorStatus === false){
              set_saveStatus(true)
              set_favLinkList([
                ...favLinkList,
                {
                  ...body.mst
                }
              ])
            }
            
        }).catch(error => {
            console.log(error);
            
        })

    }

    const handle_deletePath = async()=>{
        // let path = window.location.pathname
        // path = path.slice(1, path.length)
        const currentPath = JSON.parse(sessionStorage.getItem("currentPath"))
        const userId = getScplAdContext().userId
        const body = {
            "apiId": "SUA00567",
            "mst": {
              "menuId": current?.menuId,
              "userCd": userId
            }
          }
        
        await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00138/saveDelete', 
        body, 
        { headers }
        ).then((res) => {
            if(res.data?.appMsgList?.errorStatus === false){
              set_saveStatus(false)
              let list = favLinkList.filter((item)=>{
                return item.menuId !== body.mst.menuId
              })
              set_favLinkList([...list])
            }
            
        }).catch(error => {
            console.log(error);
            
        })

    }

  return (
    <div className="start-container">
        {saveStatus?
        <i className="fa fa-star delete" onClick={handle_deletePath}></i>:
        <i className="fa fa-star" onClick={handle_savePath}></i>
        }
    </div>
  )
}

export default FavLink