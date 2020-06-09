import React, {useContext, useState, createContext, useEffect} from "react";

export default function Chat({ context }) {
    const [userInfo, setUserInfo] = useContext(context);

    let inputContext = createContext('')
    let [message, setMessage] = useState(inputContext);

    function changeInput(e){
        e.preventDefault();
        setMessage(e.target.value);
    }

    function handleSubmit(e){
        debugger;
        e.preventDefault();
        let updatedState = Object.assign({},userInfo);
        console.log('userInfo', userInfo)
        console.log('updatedstate', updatedState)
        updatedState.messages = updatedState.messages ? [...updatedState.messages, ...message] : [message]
        setUserInfo(updatedState)
        console.log('updatedstate', updatedState)
    }
    useEffect(() => {
        console.log('userInfo', userInfo);
        console.log('messages', userInfo.messages)
      });

    return (
        <div className="pages" id="pages">
        <div className="chat page">
            <button id="bellbtn">bell</button>
            <div className="chatArea">
                <div className="messages">
                    {/* <Messages />  */}
                </div>
            </div>
            <form className="form" onSubmit={handleSubmit}> 
                <input className="inputMessage" placeholder="Type here..." onChange={changeInput} />
            </form>
        </div>
    </div>
      
    );
  }