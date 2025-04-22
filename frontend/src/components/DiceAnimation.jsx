import React, { Suspense, useState, useEffect } from 'react';
import {DiceBox, D4, D6, D8, D10, D12, D20} from '../utility/diceFactory';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Color } from 'three';

export default function DiceAnimation({eventResult, diceType}) {
  const [rolling, setRolling] = useState("");
  const [result, setResult] = useState(undefined);

  function UpdateSceneBackground() {
    const {scene} = useThree();        
    scene.background = new Color('grey');
    return null;
  }
  
  useEffect(() => {
      setResult(eventResult);
      setRolling("D"+diceType);
      console.log('eventResult changed?', eventResult, "D"+diceType);
  }, [eventResult]);

  function rollDice(diceType){
    switch (diceType) {
      case 'D4':
        setResult(Math.floor(Math.random() * 4) + 1);  
        break;
      case 'D6':
        setResult(Math.floor(Math.random() * 6) + 1);
        break;
      case 'D8':
        setResult(Math.floor(Math.random() * 8) + 1);
        break;
      case 'D10':
        setResult(Math.floor(Math.random() * 10) + 1);
        break;
      case 'D12':
        setResult(Math.floor(Math.random() * 12) + 1);
        break;
      case 'D20':
        setResult(Math.floor(Math.random() * 20) + 1);
        break;
    } 
    setRolling(diceType);
  }
  return (
    <div id="dice-page" style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
      {/* <div id="side-container" style={{width: '25%', height: '100%'}}>
      <h1>Dice Game instructions</h1>
      <p>TLDR: Click on the dice or buttons below to roll them</p>
      <p>The buttons will roll and display a result to simulate random values that might come from a backend game server</p>
      <p>clicking on the dice simulates a different function, in this case it tosses the dice but gets no result. A better use case would be sending a request to the server to get a result then tossing the dice.</p>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D4')}>Roll D4</button>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D6')}>Roll D6</button>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D8')}>Roll D8</button>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D10')}>Roll D10</button>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D12')}>Roll D12</button>
      <button style={{margin: '10px', backgroundColor: 'lightcyan', color: 'black'}} onClick={() => rollDice('D20')}>Roll D20</button>
      </div> */}
      {/* <div id="dice-container" style={{width: '75%', height: '100%'}}> */}
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 20, 20]} rotation={[-Math.PI / 4, 0, 0]}/>
          <Suspense>
              <Physics debug={false}>
                  <spotLight position={[2, 20, 1]} angle={0.98} penumbra={0.16} intensity={98} color="red" castShadow />
                  {/* <LightWithHelper /> */}
                  <UpdateSceneBackground />
                  <ambientLight intensity={0.5} />
                  <directionalLight
                      position={[10, 10, 5]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                  />
                  <DiceBox />
                  <D4 position={[-6, 5, 0]} color="khaki" rollingState={{rolling, setRolling}} result={result}/>
                  <D6 position={[-4, 5, 0]} color="white" rollingState={{rolling, setRolling}} result={result}/>
                  <D8 position={[-2, 5, 0]} color="orchid" rollingState={{rolling, setRolling}} result={result} />
                  <D10 position={[0, 5, 2]} rotation={[0, 1, 0]} color="teal" rollingState={{rolling, setRolling}} result={result}/>
                  <D12 position={[2, 5, 0]} color="springgreen" rollingState={{rolling, setRolling}} result={result}/>
                  <D20 position={[4, 5, 0]} color="orange" rollingState={{rolling, setRolling}} result={result}/>
                  {/* <OrbitControls /> */}
              </Physics>
          </Suspense>
        </Canvas>
      {/* </div> */}
    </div>
  )
}
