import React, {useContext, useState, useEffect} from "react";
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';

export default function ScratchPad({ context }) {
    const [userInfo, setUserInfo] = useContext(context);
    const [scratchPad, setScratchPad] = useState(userInfo.scratchPad || '');

    useEffect(() => {
        setScratchPad(userInfo.scratchPad || '');
    }, [userInfo.scratchPad]);

    function handleChange(e) {
        setScratchPad(e.target.value);
    }

    function handleBlur() {
        let updatedState = Object.assign({}, userInfo);
        updatedState.scratchPad = scratchPad;
        updatePlayers({players:updatedState.players, action:'setScratchPad', noRender:false});
    }

    return (
        <div className="scratchPad">
            <textarea 
                value={scratchPad} 
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Scratch Pad"
            />
        </div>
    );
} 