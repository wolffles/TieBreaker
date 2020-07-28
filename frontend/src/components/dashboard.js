import React, {useContext, createContext, useState, useEffect} from "react";
import PlayerArea from './playerArea.js'
import EventModal from './eventModal.js'
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';


export default function Dashboard({ context }) {
    const [userInfo, setUserInfo] = useContext(context);

    const [localUserInfo,setlocalUserInfo] = useState(userInfo)
    let inputContext = createContext('');

    let [inputValue, setInputContext] = useState(inputContext);

    let [showEvent, setShowEvent] = useState(false);

    let [eventValue, setEventValue] = useState('');

    let [modalType, setModalType] = useState('');

    function changeInput(e){
      e.preventDefault();
      setInputContext(e.target.value);
    }

    function handleSubmit(e){
      e.preventDefault();
      let updatedState = Object.assign({}, localUserInfo);
      let input = inputValue;

      if (typeof inputValue === 'object'){ 
        input = '0';
        setInputContext(input);
      }

      for (let username in updatedState.players){
        updatedState.players[username].points[0][1] = input;
      }
      setlocalUserInfo(updatedState)
      //this needs to send specifics or find a way to not replace the object
      updatePlayers({players:updatedState.players, action:'setPoints', noRender:true});
    }

    //this is the dice code
    function showEventModal(e, newType){    
      e.preventDefault();
      setEventValue('');
      setModalType(newType);
      setShowEvent(true);

      }
  
      

    function displayingEvent(roll, type) {
      roll.forEach((face, i) => {
        let side;
        if(type === 'flip') {
          side = face === 1 ? 'Heads' : 'Tails'
        }else{
          side = face
        }
        setTimeout(() => {
          setEventValue(side)
        }, i*i*10);
      });
    }

    useEffect(() => {

      window.onclick = function(event) {

      let modalElement = document.getElementById('modalBackground');

      if (showEvent && event.target === modalElement) {
          setShowEvent(false)
        }
      }

      
      socket.on('dice is rolling', roll =>{
        if(!showEvent){setShowEvent(true)};
        setModalType('dice');
        displayingEvent(roll)
      });
      
      socket.on('coin is flipping', flip =>{
        if(!showEvent){setShowEvent(true)};
        setModalType('flip');
        displayingEvent(flip, 'flip')
      });
      
      socket.on('choosing player', flip =>{
        if(!showEvent){setShowEvent(true)};
        setModalType('choose');
        displayingEvent(flip, 'choose')
      });
      
      // socket.on('update player data', (data) =>{
      //     let updatedState = Object.assign({}, userInfo);
      //     updatedState.players = data.players;
      //     setUserInfo(updatedState);
      // });

      socket.on('update game state', (data) => {
      let updatedState = Object.assign({},userInfo);
      updatedState.connectedPlayersList = data.connectedPlayersList
      updatedState.playersList = data.savedPlayersList
      updatedState.players = data.savedPlayers
      updatedState.password = data.password
      updatedState.scratchPad = data.savedPlayers[userInfo.username].scratchPad
      updatedState.messages = data.savedPlayers[userInfo.username].messages
      updatedState.chatToggle = data.savedPlayers[userInfo.username].chatToggle
      setUserInfo(updatedState)
      if(data.broadcast){
        socket.emit('request server messages', data)
      }
    })

     
      return function cleanup() {
          socket.off('dice is rolling');
          // socket.off('update player data');
          socket.off('update game state');
          socket.off('coin is flipping');
          socket.off('choosing player');
        };
    });
    
  

    return (
        <div className="dashboard">
          <div className="menubar">
            <form className="setPoints" onSubmit={handleSubmit}>
                <input className="setPoints input"type="number" maxLength="10" placeholder="Set Points" onChange={changeInput}/>
            </form>
            <div className="buttons">
              <button onClick={(e) => showEventModal(e, 'dice')} className="button showDie"> Roll Die </button>
              <button onClick={(e) => showEventModal(e,'flip')} className="button flipCoin"> Flip Coin </button>
              <button onClick={(e) => showEventModal(e, 'choose')} className="button chooser">Choose Player</button>
            </div>
          </div>
          {/* <span className="roomName">Username: {userInfo.username} | Game Name: {userInfo.roomName} | Password: {userInfo.password}</span> */}
            <EventModal showEvent={showEvent} eventValue={eventValue} modalType={modalType}/>
            <PlayerArea players={userInfo.players} roomName={userInfo.roomName} playersList={userInfo.playersList} context={context}/>
      </div>
    );
}
