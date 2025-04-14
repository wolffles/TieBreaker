import React from 'react';
import '../style/style.css';

export default function AlertModal({ message, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modalBackground" id="modalBackground">
            <div className="modalContent">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
} 