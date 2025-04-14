import React, {useContext, useState} from "react";
import { updatePlayerInfo} from '../utility/socket.js';
import '../style/style.css';
import '../style/tools.css';
import {userContext} from '../App.jsx';


export default function ScratchPad({ toggle }) {
    const [userInfo] = useContext(userContext);

    //local table conent gets saved on the server but is also saved here
    const [localTableContent,setLocalTableContent] = useState(userInfo.scratchPad)

    function addRow(){
        if(localTableContent.length < 51){
            let updatedState = Object.assign([],localTableContent);
            let size = updatedState[0].length
            updatedState.push(Array(size).fill('')) 
            setLocalTableContent(updatedState)
            updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})  
        }
    }   

    function addColumn(){
        if(localTableContent[0].length < 11){
            let updatedState = Object.assign([],localTableContent);
            updatedState.map((row) => {
                return row.push("")
            })
            setLocalTableContent(updatedState)
            updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})
        }
    }

    function removeRow(){
        let updatedState = Object.assign([],localTableContent);
        console.log(updatedState)
        if (updatedState.length > 1){
            updatedState.pop()
        }
        setLocalTableContent(updatedState)
        updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})
    }

    function removeColumn(){
        let updatedState = Object.assign([],localTableContent);
        updatedState.map((row) => {
            if (row.length > 1){
                return row.pop()
            }
        })
        setLocalTableContent(updatedState)
        updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})
    }

    function handleInput(e){
        e.preventDefault();
        let updatedState = Object.assign([],localTableContent);
        let rowIdx = Number(e.target.id.match(/\d+/)[0])
        let colIdx = Number(e.target.id.match(/\d+$/)[0])
        updatedState[rowIdx][colIdx] = e.target.value
        updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})
    }

       let ta = localTableContent.map((row,index) => {
            let rowIdx = index
            return( <tr key={index}>
                {
                row.map((column,index) => {
                    return (
                        <td key={index} className="cell"><input id={`${rowIdx} ${index}`} className="input" onChange={handleInput} placeholder={column}/></td>
                    )
                })
                }
            </tr>
        )
    }) 
    
  return (
    <div className={`scratch-pad ${toggle === 'scratch-toggle'  ? "" : "hidden"}`}>
        <div className='scratch-tools'>
            <button className={localTableContent.length == 51  ? "second-button-unavailable" : 'second-button'} onClick={addRow}>+ Row</button>
            <button className={localTableContent[0].length == 11  ? "second-button-unavailable" : 'second-button'} onClick={addColumn}>+ Column</button>
            <button className={localTableContent.length <= 1  ? "second-button-unavailable" : 'second-button'} onClick={removeRow}>- Row</button>
            <button className={localTableContent[0].length <= 1 ? "second-button-unavailable" : 'second-button'} onClick={removeColumn}>- Column</button>  
        </div>
        <table className="scratch-table">
            <tbody>
                {ta}
            </tbody>
        </table>
    </div>
  );
}