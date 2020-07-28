import React, {useContext, useState} from "react";
import { socket, updatePlayerInfo} from '../utility/socket.js';
import '../style/style.css';
import '../style/tools.css';

export default function ScratchPad({ context, toggle }) {
    
    const [userInfo, setUserInfo] = useContext(context);

    //local table conent gets saved on the server but is also saved here
    const [localTableContent,setLocalTableContent] = useState(userInfo.scratchPad)

    function addRow(){
        let updatedState = Object.assign([],localTableContent);
            let size = updatedState[0].length
            updatedState.push(Array(size).fill('new-cell')) 
            setLocalTableContent(updatedState)
<<<<<<< HEAD
            console.log('setlocal', updatedState)
            updatePlayerInfo({username:userInfo.username, scratchPad:updatedState, action:'scratch-pad'})
=======
            socket.emit('update player info', {username:userInfo.username, scratchPad:updatedState})  
>>>>>>> added title and multiple points feature
    }   

    function addColumn(){
        let updatedState = Object.assign([],localTableContent);
            updatedState.map((row) => {
                row.push("new-cell")
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
    <div className={`scratch-pad ${toggle == 'scratch-toggle'  ? "" : "hidden"}`}>
        <div className='scratch-tools'>
            <button className='second-button' onClick={addRow}>+ Row</button>
            <button className='second-button' onClick={addColumn}>+ Column</button> 
        </div>
        <table className="scratch-table">
            <tbody>
                {ta}
            </tbody>
        </table>
    </div>
  );
}