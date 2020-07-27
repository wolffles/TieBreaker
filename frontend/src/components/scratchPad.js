import React, {useContext, useState} from "react";
import { socket, updatePlayerInfo} from '../utility/socket.js';
import '../style/style.css';
import '../style/tools.css';

export default function ScratchPad({ context, toggle }) {
    
    const [userInfo, setUserInfo] = useContext(context);
    // let tableCells = userInfo.chatTools.scratchPad ? userInfo.chatTools.scratchPad : [['hello','world']]

    //local table conent gets saved on the server but is also saved here
    const [localTableContent,setLocalTableContent] = useState(userInfo.scratchPad)

    console.log('localtable', localTableContent )

    function addRow(){
        let updatedState = Object.assign([],localTableContent);
            let size = updatedState[0].length
            updatedState.push(Array(size).fill('new-cell')) 
            setLocalTableContent(updatedState)
            console.log('setlocal', updatedState)
            socket.emit('update player info', {username:userInfo.username, scratchPad:updatedState})  
    }   

    function addColumn(){
        let updatedState = Object.assign([],localTableContent);
            updatedState.map((row) => {
                row.push("new-cell")
            })
            setLocalTableContent(updatedState)
            socket.emit('update player info', {username:userInfo.username, scratchPad:updatedState})
    }

    function handleInput(e){
        e.preventDefault();
        let updatedState = Object.assign([],localTableContent);
        let rowIdx = Number(e.target.id.match(/\d+/)[0])
        let colIdx = Number(e.target.id.match(/\d+$/)[0])
        updatedState[rowIdx][colIdx] = e.target.value
        socket.emit('update player info', {username:userInfo.username, scratchPad:updatedState})
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
        <button onClick={addRow}>addRow</button>
        <button onClick={addColumn}>addColumn</button> 
        <table className="scratch-table">
            <tbody>
                {ta}
            </tbody>
        </table>
    </div>
  );
}