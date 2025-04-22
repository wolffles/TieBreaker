import React, { useRef, useEffect, useState } from 'react';
import { socket } from './socket.js';
import { RigidBody } from '@react-three/rapier';
import { Html} from '@react-three/drei';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Toss = (objectRef, extraForce = 1) => {
    if (!objectRef.current) return
    // Random impulse upward and in random x/y direction
    const impulse = {
        x: 0,    // Random sideways force
        y: 50 * extraForce,    // Random forward/backward force
        z: 0        // Upward force (always positive)
    }
    // Random rotation (angular velocity)
    const torque = {
        x: (Math.random() ) * 33 * extraForce/2,
        y: (Math.random() ) * 33 * extraForce/2,
        z: (Math.random() ) * 33 * extraForce/2
    }
    // Apply the forces
    objectRef.current.applyImpulse(impulse, true)
    objectRef.current.applyTorqueImpulse(torque, true)
}

const initiateRoll = (diceType) => {
    socket.emit('roll dice', diceType);
  }

 // Function to check if dice is settled
 const checkIfMoving = (objectRef) => {
    if (!objectRef.current) return false

    const linVel = objectRef.current.linvel()
    const angVel = objectRef.current.angvel()

    // Check if the dice is moving significantly
    // You can adjust these threshold values
    const linearThreshold = 0.2
    const angularThreshold = 0.2

    const isStillMoving = 
        Math.abs(linVel.x) > linearThreshold ||
        Math.abs(linVel.y) > linearThreshold ||
        Math.abs(linVel.z) > linearThreshold ||
        Math.abs(angVel.x) > angularThreshold ||
        Math.abs(angVel.y) > angularThreshold ||
        Math.abs(angVel.z) > angularThreshold

    return isStillMoving
}



const ResultLabel = ({result, onClose}) => {
    const labelRef = useRef(null);
    useEffect(() => {
        // Handle clicks outside the label
        const handleClickOutside = (event) => {
            if (labelRef.current && !labelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <>
            <Html
                as="div"
                wrapperClass="dice-result"
                distanceFactor={20}
                style={{
                    pointerEvents: 'auto', // Enable interactions
                    transform: 'translateY(-120%)'
                }}
            >
                <div 
                    id="dice-result"
                    ref={labelRef}
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: 'black',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        minWidth: '24px',
                        minHeight: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}
                >
                    <span>Player rolled a {result}</span>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{
                            padding: '2px',
                            position: 'absolute',
                            right: '-8px',
                            top: '-8px',
                            background: 'rgba(255,255,255,0.9)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                    >
                        <CloseIcon style={{ fontSize: '14px' }} />
                    </IconButton>
                </div>
            </Html>
        </>
    );
};

const applyLabel = (label) => {
    return (
    <>
        {/* Floating Label */}
        <Html
        as="div" // Renders as a div
        wrapperClass="dice-label" // CSS class
        center // Centers the label on position
        distanceFactor={20} // Size relative to distance from camera
        style={{
            pointerEvents: 'none', // Allows clicks to pass through
            transform: 'translateY(120%)' // Positions above the dice
        }}
        >
            <div style={{
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
            }}>
                {label}
            </div>
        </Html>
    </>
    )
}

export function DiceBox() {
    return (
        <RigidBody type="fixed">
            <mesh receiveShadow>
                <boxGeometry args={[20, 1, 20]} />
                <meshStandardMaterial color="saddlebrown" />
            </mesh>
            <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]} >
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="transparent" opacity={0.5} transparent={true} />
            </mesh>
            <mesh receiveShadow position={[-10, 7.5,0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[20, 15]}  />
                <meshStandardMaterial color="skyblue" />
            </mesh>
            <mesh receiveShadow position={[10, 7.5,0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[20, 15]}  />
                <meshStandardMaterial color="skyblue" />
            </mesh>
            <mesh receiveShadow position={[0, 7.5,-10]} rotation={[Math.PI, Math.PI, 0]}>
                <planeGeometry args={[20, 15]}  />
                <meshStandardMaterial color="skyblue" />
            </mesh>
            <mesh receiveShadow position={[0, 7.5,10]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[20, 15]}  />
                <meshStandardMaterial color="skyblue" />
            </mesh>
        </RigidBody>
    )
}

export function D4({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}) {
    const rigidBody = useRef()
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in props.rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D4' && rollingState.setRolling) {
                Toss(rigidBody)
                timeoutId = setTimeout(() => {
                    setShowResult(true)
                    rollingState.setRolling("")
                }, 3000)
            }
            
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling]) // Dependency array includes rolling

    return (
        <RigidBody 
            ref={rigidBody}
            position={position} 
            colliders="hull" 
            mass={1}
            wireFrame={false}
        >
            <mesh 
                castShadow
                rotation={[Math.PI/1.85, Math.PI/3.50, Math.PI/5]}
                // Keep click handler for manual tosses if needed
                onClick={() => initiateRoll(4)}
            >
                <tetrahedronGeometry args={[1.75]} />
                <meshStandardMaterial color={color || "white"} wireframe={false} />
            </mesh>
            {applyLabel('D4')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    );
}
export function D6({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}){
    const rigidBody = useRef()
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in props.rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D6' && rollingState.setRolling) {
                Toss(rigidBody)
                timeoutId = setTimeout(() => {
                    setShowResult(true)
                    rollingState.setRolling("")
                }, 3000)
            }
            
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling])

    return (

        <RigidBody position={position} wireFrame={false} ref={rigidBody}>
            <mesh castShadow onClick={() => initiateRoll(6)}>
                <boxGeometry args={[1.5,1.5,1.5]} />
                <meshStandardMaterial color={color || "white"} wireframe={false} />
            </mesh>
            {applyLabel('D6')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    )
}

export function D8({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}){
    const rigidBody = useRef()
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D8' && rollingState.setRolling) {
                Toss(rigidBody, 1.5)
                timeoutId = setTimeout(() => {
                    setShowResult(true)
                    rollingState.setRolling("")
                }, 3000)
            }
            
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling])

    return (
        <RigidBody position={position} colliders="hull" mass={1} wireFrame={false} ref={rigidBody}>
            <mesh castShadow onClick={() => initiateRoll(8)}>
                <octahedronGeometry args={[1.5]} />
                <meshStandardMaterial color={color || "white"} wireframe={false} />
            </mesh>
            {applyLabel('D8')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    )
}

export function D10({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}) {
    // Give credit where credit is due Got it from a stack overflow post https://stackoverflow.com/questions/76832939/deterministic-dice-roller-with-react-three-fiber
    const rigidBody = useRef()
    const sides = 10
    const verticesPerFace = 6 // A quadrilateral is made of 2 triangles
    const radiusScale = 1.5 // We'll use this to Scale all vertices
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D10' && rollingState.setRolling) {
                Toss(rigidBody, 2)
                timeoutId = setTimeout(() => {
                setShowResult(true)
                    rollingState.setRolling("")
                }, 3000)
            }
            
            return () => {
                if (timeoutId) {
                        clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling])

    // Scale the top and bottom vertices
    const vertices = [
        [0, 0, radiusScale],  // Top point Scaled
        [0, 0, -radiusScale]  // Bottom point Scaled
    ].flat()
    
    // https://github.com/byWulf/threejs-dice/blob/master/lib/dice.js#L499
    // Scale the middle vertices
    for (let i = 0; i < sides; ++i) {
        const b = (i * Math.PI * 2) / sides
        vertices.push(
            -Math.cos(b) * radiusScale,      // x Scaled
            -Math.sin(b) * radiusScale,      // y Scaled
            0.105 * (i % 2 ? 1 : -1) * radiusScale  // z Scaled
        )
    }
    
    const faces = [
        [0, 11, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5],
        [0, 5, 6], [0, 6, 7], [0, 7, 8], [0, 8, 9],
        [0, 9, 10], [0, 10, 11],
        [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 6, 5],
        [1, 7, 6], [1, 8, 7], [1, 9, 8], [1, 10, 9],
        [1, 11, 10], [1, 2, 11]
    ].flat()

    const args = [vertices, faces, radiusScale, 0]

    return (
        <RigidBody 
            position={position} 
            colliders="hull" 
            mass={1}
            ref={rigidBody}
        >
            <mesh castShadow onClick={() => initiateRoll(10)}>
                <polyhedronGeometry args={args} />
                <meshStandardMaterial 
                    color={color || "white"} 
                    wireframe={false}
                />
            </mesh>
            {applyLabel('D10')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    )
}   



export function D12({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}){
    const rigidBody = useRef()
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D12' && rollingState.setRolling) {
                Toss(rigidBody, 3)
            timeoutId = setTimeout(() => {
                    setShowResult(true)
                    rollingState.setRolling("")
                }, 4000)
            }
            
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling])

    return (
        <RigidBody position={position} colliders="hull" mass={1} wireFrame={false} ref={rigidBody}>
            <mesh castShadow onClick={() => initiateRoll(12)}>
                <dodecahedronGeometry args={[1.5]} />
                <meshStandardMaterial 
                    color={color || "white"} 
                    wireframe={false}
                />
            </mesh> 
            {applyLabel('D12')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    )
}   

export function D20({rollingState = {}, result = undefined, position = [0,0,0], color = "white"}){
    const rigidBody = useRef()
    const [showResult, setShowResult] = useState(false)
    // Watch for changes in rolling
    useEffect(() => {
        if (Object.keys(rollingState).length > 0){
            let timeoutId;
            // Only toss if rolling state matches this dice type
            if (rollingState.setRolling === false) {
            }
            if (rollingState.rolling === 'D20' && rollingState.setRolling) {
                Toss(rigidBody, 3)
                timeoutId = setTimeout(() => {
                    setShowResult(true)
                    rollingState.setRolling("")
                }, 4000)
            }
        
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }
    }, [rollingState.rolling])
    return (
        <RigidBody position={position} colliders="hull" mass={1} wireFrame={false} ref={rigidBody}>
            <mesh castShadow onClick={() => initiateRoll(20)}>
                <icosahedronGeometry args={[1.5]} />
                <meshStandardMaterial 
                    color={color || "white"} 
                    wireframe={false}
                />
            </mesh>
            {applyLabel('D20')}
            {result !== undefined && showResult && (
                <ResultLabel 
                    result={result}
                    onClose={() => setShowResult(false)}
                />
            )}
        </RigidBody>
    )
}       