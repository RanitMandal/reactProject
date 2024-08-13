import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
// import "../../../new.png"
import{Row,Col} from "react-bootstrap"
const Footer = ({allNews=[], jacketInfo}) => {
	const [newsStr, set_newsStr] = useState("")
	const [footerDataList, set_footerDataList] = useState([])
	useEffect(() => { 
		set_footerDataList(allNews?.filter(item => item.newsTyp === "3")
		.sort((a,b)=>a.newsDispOrder - b.newsDispOrder))
	}, [allNews])
	
return(
<div className="footer">
			<div className="container">
			{/* <div class="running-paragraph"> */}
            <marquee direction="left" onMouseOver={(e) => {
    e.target.stop();
  }}
  onMouseOut={(e) => {
    e.target.start();
  }} scrollamount="3">
				{footerDataList.map((item, index)=>(
				<span>

					<Link target='_blank' to={`${process.env.REACT_APP_API_URL_PREFIX}${item?.fileUrl}`}>
						<span  style={{
							textDecoration: "none",
							color: item?.newsColor ? item?.newsColor :"black",
							fontStyle: item?.newsItalicFlg === "Y"? "italic":"normal",
							fontWeight: item?.newsBoldFlg === "Y"? "bold":"normal",
							fontSize: item?.newsFontSz ? item.newsFontSz+"px" : "inherit",
							fontFamily: item?.newsFont ? item?.newsFont: "inherit"
						}}>{item?.newsText} </span>
					</Link>  
					{item?.newsBlinkFlg === "Y" ? <img className='blink' src="../../../new.png" width={25} />:""}
					{(index+1) !== footerDataList.length && " || "}
				</span>
			))}</marquee>
        {/* </div> */}
		<div class="smoke"></div>
				<Row className="align-items-center flex-row-reverse">
					<Col className="text-center" sm={12} md={12} lg={12}>
						 Copyright © {new Date().getFullYear()} {jacketInfo?.copyRight}. Designed by <Link to="http://semaphoreindia.com" target="_blank"> SCPL </Link> All rights reserved
					</Col>
				</Row>
			</div>
		</div>
);
}
  
export default Footer;
