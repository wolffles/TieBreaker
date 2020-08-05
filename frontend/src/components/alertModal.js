import React, {useState} from "react";
import '../style/tools.css';
import '../style/style.css';

export default function AlertModal({ showAlert, alertText}) {
  const [show, setShowAlert] = useState(showAlert)

  const closeAlert = () => {
    setShowAlert(false)
  }

  function modalRender(){
      return (
        <div className={`${show ? "alert-modal" : "hidden"}`}>
            <span onClick={closeAlert}>x</span>
            <p >{alertText}</p>
        </div>
      );
    
  }
    return (
      <div id="alertModalBackground" className={`${show ? "modal-background" : "hidden"}`}>
         <div className={`${show ? "alert-modal" : "hidden"}`}>
            {/* <span onClick={closeAlert}>x</span> */}
            <p >{alertText}</p>
        </div>

      </div>
  );
}