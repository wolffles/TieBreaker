import React from "react";
import '../style/tools.css';
import '../style/style.css';
export default function AlertModal({ showAlert, alertText}) {


  function modalRender(){
      return (
        <div className={`${showAlert ? "modalLogin" : "hidden"}`}>
            <p >{alertText}</p>
      </div>
      );
    
  }
    return (
      <div id="modalBackgroundLogin" className={`${showAlert ? "modal-background" : "hidden"}`}>{modalRender()}</div>
  );
}