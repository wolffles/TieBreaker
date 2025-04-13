import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';


export default function CoinAnimation({ totalFlips }) {
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
  const flipStartingFace = (totalFlips % 2 === 0) ? StartingFace ? "Heads": "Tails": !StartingFace ? "Tails": "Heads";

  // Function to check if the component is visible
  const isVisible = () => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    return !(rect.width === 0 || rect.height === 0);
  };

  const flipCoin = () => {
    
    setIsFlipping(true);
    if (animationStateRef.current.isAnimating || !coinRef.current) return;
    
    animationStateRef.current.isAnimating = true;
    animationStateRef.current.flipCount = 0;
    
    // Random number of flips 5,6,7,8,9,10
    // const totalFlips = Math.floor(Math.random() * 6) + 5;
    // const totalFlips = 1
    
    // Set initial rotation based on current face
    animationStateRef.current.currentRotation = StartingFace ? 0 : Math.PI;
    coinRef.current.rotation.z = animationStateRef.current.currentRotation;
    
    // Result is opposite of starting state if odd number of flips
    const willBeHeads = StartingFace === (totalFlips % 2 === 0);
    
    const animateFlip = () => {
      if (!isActiveRef.current) return;
      
      // Check if component is visible before continuing animation
      if (!isVisible()) {
        animationFrameRef.current = requestAnimationFrame(animateFlip);
        return;
      }
      
      if (animationStateRef.current.flipCount < totalFlips) {
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
        }
        
        animationFrameRef.current = requestAnimationFrame(animateFlip);
      } else {
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
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Store the container reference for cleanup
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

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

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffbb, .5);
    directionalLight.position.set(1, 50, 10);
    // directionalLight.rotation.set(-1.57, 0, -1.5);
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

    // Add textures for heads and tails
    const textureLoader = new THREE.TextureLoader();
    const headsTexture = textureLoader.load('/images/coin-heads.png');
    const tailsTexture = textureLoader.load('/images/coin-tails.png');
    console.log(headsTexture);
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

    // Controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(-1, -1, -1);
    // controls.update()
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;

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
      if (!isActiveRef.current) return;
      
      // Check if component is visible before rendering
      if (isVisible()) {
        renderer.render(scene, camera);
        // console.log("Rendering frame, coin position:", coin.position);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    console.log("component mounted and rendered")
    
    // Cleanup
    return () => {
      isActiveRef.current = false; // Stop the animation loop
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
    };
  }, []);

  // Add effect to trigger coin flip once on mount
  useEffect(() => {
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      console.log('componenet mounted')
      flipCoin();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      isActiveRef.current = false; // Ensure flip animation stops too
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Removed flipCoin from dependency array to avoid infinite loop

  // Add effect to watch for changes in totalFlips
  useEffect(() => {
    // Only trigger if totalFlips has changed and component is already mounted
    if (prevTotalFlipsRef.current !== totalFlips && coinRef.current) {
      console.log('totalFlips changed from', prevTotalFlipsRef.current, 'to', totalFlips);
      prevTotalFlipsRef.current = totalFlips;
      
      // Small delay to ensure the component is ready
      const timer = setTimeout(() => {
        flipCoin();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [totalFlips]);

  return (
    <div className="bg-gray-800 rounded-lg p-6" style={{ position: 'relative' }}>
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
        style={{ minHeight: '384px', height: '100%' }}
      />
    </div>
  );
}
