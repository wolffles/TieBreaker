import React, {useContext} from "react";
import './App.css';
import './style.css';

export default function Login() {
    //const [userInfo, setUserInfo] = useContext(context);

  

    return (
        <div class="login page">
            <div id="entername" class="form" onsubmit="playForm" >
                <h3 class="title">What's your nickname?</h3>
                <input class="usernameInput" type="text" maxlength="14" />
            </div>
        </div>
      
    );
  }