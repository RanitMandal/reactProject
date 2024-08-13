
/* // return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('userId');
    if (userStr) return JSON.parse(userStr);
    else return null;
} */

// set the scplAdContext object to the session storage
export const  setScplAdContext = (obj) => {
    sessionStorage.setItem("scplAdContext", JSON.stringify(obj));
    
}
export const  setApiToken = (apiToken) => {
    sessionStorage.setItem("apiToken", apiToken);
    console.log("apiToken");
    
}




// return the user data from the session storage
export const getScplAdContext = () => {
    const scplAdContext = sessionStorage.getItem('scplAdContext');
    if (scplAdContext) return JSON.parse(scplAdContext);
    else return null;
} 

// return the token from the session storage
export const getApiToken = () => {
    const apiToken = sessionStorage.getItem("apiToken"); 
    return apiToken || "";
    // const scplAdContext = getScplAdContext();
    // return (scplAdContext? scplAdContext.apiToken: "")
}

export const  setLocationTree = (obj) => {
    sessionStorage.setItem("detailData", JSON.stringify(obj));
    
}

export const  getLocationTree = (obj) => {
    sessionStorage.getItem("detailData.listLocation", JSON.stringify(obj));
    
}





/* // remove the token and user from the session storage
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
} */

// set the token and user from the session storage
/* export const setUserSession = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user)); 
    
   
}*/

// // set the user deails to the session storage
// export const setUserSession = (sessJson) => {
//     sessionStorage.setItem("scplAdContext", sessJson);
    
// }




// remove the token and user deails from the session storage
export const removeScplAdContext = () => {
    sessionStorage.removeItem("scplAdContext");
}

export const removeApiToken = () => {
    sessionStorage.removeItem("apiToken");
}

// // is auth
//  export const isAutenticated = () => {
//     let scplAdContext= JSON.parse(sessionStorage.getItem("scplAdContext"))
//     if (scplAdContext.appLogNo) {
//         return true;
//     }
//     else return false
    
// }


// // is auth
export const isAuthenticated = () => {
    const scplAdContext = getApiToken();
    if ((scplAdContext===null)||(scplAdContext==="")) {
        return false;
    }
    return true;
}


