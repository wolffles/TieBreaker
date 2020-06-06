
import React, {useContext} from "react";

export default function ShowData({ context }) {
    const [userInfo, setUserInfo] = useContext(context);

    function updateInfo(){
        setUserInfo('Wolf');
    }

    return (
      <div>
          <p>The child component shows {userInfo}</p>
        <p>
            <button onClick={updateInfo}>Update to Wolf</button>
        </p>
      
      </div>
      
    );
  }