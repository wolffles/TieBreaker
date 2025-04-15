import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';


export default function CoinAnimation({ totalFlips }) {
  console.log('CoinAnimation render - totalFlips:', totalFlips);
  
  const containerRef = useRef(null);
  const coinRef = useRef(null);
  const animationStateRef = useRef({
    flipCount: 0,
    targetRotation: 0,
    currentRotation: 0,
    flipSpeed: 0.2,
    isAnimating: false
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [StartingFace, setStartingFace] = useState(true);
  const isActiveRef = useRef(true);
  const animationFrameRef = useRef(null);
  const prevTotalFlipsRef = useRef(totalFlips);
  const startingFaceRef = useRef(StartingFace);
  const totalFlipsRef = useRef(totalFlips);
  
  // Update refs when props/state change
  useEffect(() => {
    console.log('Updating refs - StartingFace:', StartingFace, 'totalFlips:', totalFlips);
    startingFaceRef.current = StartingFace;
    totalFlipsRef.current = totalFlips;
  }, [StartingFace, totalFlips]);
  
  const flipStartingFace = (totalFlips % 2 === 0) ? StartingFace ? "Heads": "Tails": !StartingFace ? "Tails": "Heads";

  // Function to check if the component is visible
  const isVisible = () => {
    if (!containerRef.current) {
      console.log('Container ref is null');
      return false;
    }
    const rect = containerRef.current.getBoundingClientRect();
    console.log('Container dimensions:', rect.width, rect.height);
    return !(rect.width === 0 || rect.height === 0);
  };


  const flipCoin = useCallback(() => {
    console.log('flipCoin function called with totalFlips:', totalFlipsRef.current);
    
    setIsFlipping(true);
    if (animationStateRef.current.isAnimating || !coinRef.current) {
      console.log('Animation blocked:', {
        isAnimating: animationStateRef.current.isAnimating,
        coinRefExists: !!coinRef.current
      });
      return;
    }
    
    console.log('Starting animation with totalFlips:', totalFlipsRef.current);
    animationStateRef.current.isAnimating = true;
    animationStateRef.current.flipCount = 0;
  
    
    // Set initial rotation based on current face
    animationStateRef.current.currentRotation = startingFaceRef.current ? 0 : Math.PI;
    coinRef.current.rotation.z = animationStateRef.current.currentRotation;
    
    // Result is opposite of starting state if odd number of flips
    const willBeHeads = startingFaceRef.current === (totalFlipsRef.current % 2 === 0);
    console.log('Will be heads:', willBeHeads);
    
    const animateFlip = () => {
      if (!isActiveRef.current) {
        console.log('Animation stopped: isActiveRef is false');
        return;
      }
      
      // Check if component is visible before continuing animation
      if (!isVisible()) {
        console.log('Component not visible, continuing animation in background');
        animationFrameRef.current = requestAnimationFrame(animateFlip);
        return;
      }
      
      if (animationStateRef.current.flipCount < totalFlipsRef.current) {
        // Flip animation - continuous rotation without resets
        animationStateRef.current.currentRotation += animationStateRef.current.flipSpeed;
        coinRef.current.rotation.z = animationStateRef.current.currentRotation;
        
        // Count a flip when we've rotated 180 degrees (Math.PI)
        // We use modulo to track complete rotations
        // flipspeed accumlation is currentRotation / Math.PI wich is the value of 1 180% flip
        const completeRotations = Math.floor(animationStateRef.current.currentRotation / Math.PI);
        // keep flipping until completerotations is greater than flipcount
        if (completeRotations > animationStateRef.current.flipCount) {
          animationStateRef.current.flipCount = completeRotations;
          // console.log('Flip count updated:', animationStateRef.current.flipCount);
        }
        
        animationFrameRef.current = requestAnimationFrame(animateFlip);
      } else {
        console.log('Animation complete, setting final rotation');
        // Set the final rotation to match the result
        // We use modulo to get the final position within a single rotation
        const finalRotation = willBeHeads ? 0 : Math.PI;
        coinRef.current.rotation.z = finalRotation;
        
        // Update the state to match the new position
        setStartingFace(willBeHeads);
        
        setIsFlipping(false);
        animationStateRef.current.isAnimating = false;
      }
    };
    
    animateFlip();
  }, []); // No dependencies needed since we're using refs

  useEffect(() => {
    console.log('Initial setup effect running');
    if (!containerRef.current) {
      console.log('No container ref, returning early');
      return;
    }

    // Store the container reference for cleanup
    const container = containerRef.current;
    console.log('Container found, setting up scene');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    console.log('Scene created');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.lookAt(0, -.5, 0);
    camera.position.set(0, 3, 0);
    camera.rotation.set(-1.57, 0, -1.5);
    console.log('Camera setup complete');

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    console.log('Renderer setup complete');

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffbb, .5);
    directionalLight.position.set(1, 50, 10);
    scene.add(directionalLight);
    
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(hemisphereLight);

    // Coin creation
    const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: "#d9d9d9",
      metalness: 0.8,
      roughness: 0.2,
    });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    scene.add(coin);
    coinRef.current = coin;
    console.log('Coin created and added to scene');

    // Add textures for heads and tails
    const textureLoader = new THREE.TextureLoader();
    const headsTexture = textureLoader.load('/images/coin-heads.png');
    const tailsTexture = textureLoader.load('/images/coin-tails.png');
    console.log('Textures loaded:', { headsTexture, tailsTexture });
    
    const headsMaterial = new THREE.MeshStandardMaterial({
      map: headsTexture,
      metalness: 0.8,
      roughness: 0.2,
    });

    const tailsMaterial = new THREE.MeshStandardMaterial({
      map: tailsTexture,
      metalness: 0.8,
      roughness: 0.2,
    });

    coin.material = [
        new THREE.MeshStandardMaterial({ color: "#d9d9d9" }), // edge material
        headsMaterial,  // top face (heads)
        tailsMaterial   // bottom face (tails)
    ];
    console.log('Materials applied to coin');

    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      if (!isActiveRef.current) {
        console.log('Animation loop stopped: isActiveRef is false');
        return;
      }
      
      // Check if component is visible before rendering
      if (isVisible()) {
        renderer.render(scene, camera);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    console.log("Initial setup complete, animation loop started");
    
    // Start the flip animation after a short delay to ensure everything is ready
    const startTimer = setTimeout(() => {
      console.log('Starting initial flip');
      flipCoin();
    }, 100);

    // Cleanup
    return () => {
      console.log('Cleanup function running');
      clearTimeout(startTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.remove(coin);
      coinGeometry.dispose();
      coinMaterial.dispose();
      headsMaterial.dispose();
      tailsMaterial.dispose();
      renderer.dispose();
      console.log('Cleanup complete');
    };
  }, [flipCoin]);


  // Add effect to watch for changes in totalFlips
  useEffect(() => {
    // Only trigger if totalFlips has changed and component is already mounted
    if (prevTotalFlipsRef.current !== totalFlips && coinRef.current) {
      console.log('totalFlips changed from', prevTotalFlipsRef.current, 'to', totalFlips);
      prevTotalFlipsRef.current = totalFlips;
      
      // Small delay to ensure the component is ready
      const timer = setTimeout(() => {
        console.log('flipping coin due to totalFlips change');
        flipCoin();
      }, 100);
      
      return () => {
        console.log('totalFlips change cleanup running');
        clearTimeout(timer);
      };
    }
  }, [totalFlips, flipCoin]);


  return (
    <div className="bg-gray-800 rounded-lg" style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        {!isFlipping ? 
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'transparent',
            height: '30px',
            paddingBottom: '10px'
          }}> 
            {flipStartingFace}
          </h1>
          :
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'transparent',
            height: '30px',
            paddingBottom: '10px'
          }}> </h1>
        }
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-96 bg-gray-700 rounded-lg mb-4"
        style={{ minHeight: '384px', height: '100%'}}
      />
    </div>
  );
}
