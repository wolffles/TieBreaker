import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CoinAnimation = ({ totalFlips, StartingFace }) => {
  const mountRef = useRef(null);
  const coinRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isActiveRef = useRef(true);
  const startingFaceRef = useRef(StartingFace);
  const totalFlipsRef = useRef(totalFlips);
  const [flipCount, setFlipCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationStateRef = useRef({
    isAnimating: false,
    currentRotation: 0,
    targetRotation: 0,
    flipSpeed: 0.1,
    flipCount: 0,
  });

  // Update refs when props change
  useEffect(() => {
    startingFaceRef.current = StartingFace;
    totalFlipsRef.current = totalFlips;
  }, [StartingFace, totalFlips]);

  const flipCoin = useCallback(() => {
    console.log('flipCoin called with totalFlips:', totalFlipsRef.current);
    if (animationStateRef.current.isAnimating || !coinRef.current) {
      console.log('Animation blocked - isAnimating:', animationStateRef.current.isAnimating, 'coinRef exists:', !!coinRef.current);
      return;
    }

    console.log('Starting coin flip animation');
    animationStateRef.current.isAnimating = true;
    setIsAnimating(true);

    const currentRotation = coinRef.current.rotation.x;
    const targetRotation = currentRotation + (Math.PI * 2 * totalFlipsRef.current);
    animationStateRef.current.currentRotation = currentRotation;
    animationStateRef.current.targetRotation = targetRotation;
    animationStateRef.current.flipCount = 0;

    console.log('Animation state:', {
      currentRotation,
      targetRotation,
      totalFlips: totalFlipsRef.current
    });
  }, []);

  useEffect(() => {
    console.log('CoinAnimation render - totalFlips:', totalFlips);
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load coin model
    const loader = new GLTFLoader();
    loader.load(
      '/coin.glb',
      (gltf) => {
        console.log('Coin model loaded');
        const coin = gltf.scene;
        coin.scale.set(1, 1, 1);
        scene.add(coin);
        coinRef.current = coin;

        // Initial flip
        flipCoin();
      },
      undefined,
      (error) => {
        console.error('Error loading coin model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      if (!isActiveRef.current) return;

      if (animationStateRef.current.isAnimating) {
        const { currentRotation, targetRotation, flipSpeed } = animationStateRef.current;
        
        if (Math.abs(currentRotation - targetRotation) > 0.01) {
          coinRef.current.rotation.x += flipSpeed;
          animationStateRef.current.currentRotation = coinRef.current.rotation.x;
          animationStateRef.current.flipCount++;
          
          console.log('Animation frame:', {
            currentRotation: coinRef.current.rotation.x,
            targetRotation,
            flipCount: animationStateRef.current.flipCount
          });
        } else {
          console.log('Animation complete');
          animationStateRef.current.isAnimating = false;
          setIsAnimating(false);
          setFlipCount(prev => prev + 1);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('Cleaning up CoinAnimation');
      isActiveRef.current = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mount && renderer) {
        mount.removeChild(renderer.domElement);
      }
      if (controls) {
        controls.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [flipCoin]);

  return (
    <div 
      ref={mountRef} 
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
};

export default CoinAnimation; 