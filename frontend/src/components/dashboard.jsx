import React, {useContext, createContext, useState, useEffect, useRef} from "react";
import PlayerArea from './playerArea.jsx'
import EventModal from './eventModal.jsx'
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';
import {userContext} from '../App.jsx';

export default function Dashboard() {
    const [userInfo, setUserInfo] = useContext(userContext);

    const [localUserInfo, setLocalUserInfo] = useState(userInfo)
    let inputContext = createContext('');

    let [inputValue, setInputContext] = useState(inputContext);

    let [showEvent, setShowEvent] = useState(false);

    let [eventValue, setEventValue] = useState('');

    let [modalType, setModalType] = useState('');
    const modalRef = useRef(null);
    const hasSentReadyRef = useRef(false);

    function changeInput(e){
      e.preventDefault();
      setInputContext(e.target.value);
    }

    function handleSubmit(e){
      e.preventDefault();
      let updatedState = Object.assign({}, userInfo);
      let input = inputValue;       
       e.target.children[0].value = ''


      if (typeof inputValue === 'object'){ 
        //possible bug settting lifepoints to zero.
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds(); 
        console.log('blank input was submitted ', time)
        input = '0';
        setInputContext(input);
      }
      console.log('updatedState.players', updatedState.players)
      for (let username in updatedState.players){
        updatedState.players[username].points[0][1] = input;
      }
      //setUserInfo(updatedState)
      //this needs to send specifics or find a way to not replace the object
      updatePlayers({players:updatedState.players, action:'setPoints', noRender:false});
    }

    //this is the dice code
    function showEventModal(e, newType){    
      e.preventDefault();
      setEventValue('');
      setModalType(newType);
      setShowEvent(true);

      }
  
    function flipCoin(numberOfFlips){
      setEventValue(numberOfFlips)
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
      console.log("userInfo", userInfo)
      if (!hasSentReadyRef.current) {
        console.log("Sending playerDashboardReady signal");
        socket.emit('playerDashboardReady');
        hasSentReadyRef.current = true;
      }

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
      
      socket.on('coin is flipping', numberOfFlips =>{
        if(!showEvent){setShowEvent(true)};
        setModalType('flip');
        flipCoin(numberOfFlips)
      });
      
      socket.on('choosing player', flip =>{
        if(!showEvent){setShowEvent(true)};
        setModalType('choose');
        displayingEvent(flip, 'choose')
      });

      // 'update game state' listener moved to App.js to ensure it's always active
      socket.on('update game state', (data) => {
        console.log("client update game state", data)
        setUserInfo(prevState => ({
          ...prevState,
          connectedPlayersList: [...data.connectedPlayersList],
          playersList: [...data.savedPlayersList],
          players: {...data.savedPlayers},
          password: data.password,
          scratchPad: [...data.savedPlayers[userInfo.username].scratchPad],
          messages: [...data.savedPlayers[userInfo.username].messages],
          chatToggle: data.savedPlayers[userInfo.username].chatToggle
        }));
        if(data.broadcast){
          console.log("requesting server messages")
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
    },[]);
    
    useEffect(() => {
      console.log('dashboard rerendered ', userInfo.players)
    },[userInfo])

    useEffect(() => {
      function handleClickOutside(event) {
        if (showEvent && modalRef.current && !modalRef.current.contains(event.target)) {
          setShowEvent(false);
        }
      }
      // Add event listener
      document.addEventListener('mousedown', handleClickOutside);
      // Cleanup
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showEvent])

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
            <EventModal showEvent={showEvent} eventValue={eventValue} modalType={modalType} modalRef={modalRef} />
            <PlayerArea players={userInfo.players} roomName={userInfo.roomName} playersList={userInfo.playersList}/>
      </div>
    );
}
