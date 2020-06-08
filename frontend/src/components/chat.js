import React, {useContext} from "react";
import './App.css';
import './style.css';

export default function Chat({ context }) {
   // const [userInfo, setUserInfo] = useContext(context);
    

 

    return (
        <div className="pages" id="pages">
        <div className="chat page">
            <button id="bellbtn">bell</button>
            <div className="chatArea">
                <div className="messages"></div>
            </div>
            <input className="inputMessage" placeholder="Type here..."/>
        </div>
        <div className="login page">
            <div id="entername" className="form" onsubmit="playForm" >
                <h3 className="title">What's your nickname?</h3>
                <input className="usernameInput" type="text" maxLength="14" />
            </div>
        </div> 
    </div>
      
    );
  }