import React from "react";
// import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footerSuper">

      {/* <div className="bubbles">
        {[...Array(128)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              "--size": `${2 + Math.random() * 4}rem`,
              "--distance": `${6 + Math.random() * 4}rem`,
              "--position": `${-5 + Math.random() * 110}%`,
              "--time": `${2 + Math.random() * 2}s`,
              "--delay": `${-1 * (2 + Math.random() * 2)}s`
            }}
          />
        ))}
      </div> */}
      
    <footer id="footer">

      



      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        {/* <img src={playStore} alt="playstore" /> */}
        {/* <img src={appStore} alt="Appstore" /> */}
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>Bla Bla Bla Bla</p>

        <p>Copyrights 2023 &copy; Nikhil</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/meabhisingh">Instagram</a>
        <a href="http://youtube.com/6packprogramemr">Youtube</a>
        <a href="http://instagram.com/meabhisingh">Facebook</a>
      </div>
    </footer>
    </div>
  );
};

export default Footer;