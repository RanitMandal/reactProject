export const decodeFullForm = (shortForm)=>{
   
    if (shortForm==='Y') return "Yes";
    if (shortForm==='N') return "No";
    if (shortForm==='A') return "Active";
    if (shortForm==='I') return "Inactive";
    if (shortForm==='D') return "Deleted";
    if (shortForm==='P') return "Post";
    if (shortForm==='G') return "Get";
    return  shortForm;  
}


export const decodeMonth = (shortForm)=>{
 
  if (shortForm===1) return "January";
  if (shortForm===2) return "February";
  if (shortForm===3) return "March";
  if (shortForm===4) return "April";
  if (shortForm===5) return "May";
  if (shortForm===6) return "June";
  if (shortForm===7) return "July";
  if (shortForm===8) return "August";
  if (shortForm===9) return "September";
  if (shortForm===10) return "October";
  if (shortForm===11) return "November";
  if (shortForm===12) return "December";
  return  shortForm;  
}