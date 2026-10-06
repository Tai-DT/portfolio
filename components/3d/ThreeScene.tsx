'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { Suspense, useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';

// Enhanced model with more interactive behaviors
function BumblebeeModel({ 
  scrollY = 0, 
  activeSection = '', 
  hoveredElement = null,
  screenSize = { width: 1024, height: 768 },
  modelPosition = 'right'
}: {
  scrollY?: number;
  activeSection?: string;
  hoveredElement?: string | null; // Update type to match what's being passed
  screenSize?: { width: number; height: number };
  modelPosition?: string;
}) {
  const [modelError, setModelError] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  const { viewport, mouse } = useThree();
  
  // Advanced animation controls using springs for smooth motion
  const { positionX, positionY, rotationY, rotationZ } = useSpring({
    positionX: 0,
    positionY: 0,
    rotationY: 0,
    rotationZ: 0,
    config: {
      mass: 1,
      tension: 120, // Lower tension for smoother movement
      friction: 30, // Higher friction to reduce oscillation
      precision: 0.001,
    }
  });
  
  // Check if model exists
  useEffect(() => {
    fetch('/models/bumblebee_2007_model.glb')
      .then(response => {
        if (!response.ok) setModelError(true);
      })
      .catch(() => setModelError(true));
  }, []);

  // Animation and interaction with improved smoothness
  useFrame((state) => {
    if (!modelRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Base position calculation - smoother with better constraints
    let targetX = 0, targetY = 0;
    const isMobile = screenSize.width < 768;
    
    if (isMobile) {
      // Smoother mobile movement
      targetX = Math.sin(time * 0.2) * (viewport.width / 6);
      targetY = -viewport.height / 3 + Math.sin(time * 0.3) * 0.2;
    } else {
      // More responsive but still smooth desktop movement
      const mouseXFactor = modelPosition === 'left' ? -0.8 : 0.8;
      const smoothMouse = {
        x: THREE.MathUtils.lerp(-1, 1, (mouse.x + 1) / 2) * 0.8, // dampen mouse input
        y: THREE.MathUtils.lerp(-1, 1, (mouse.y + 1) / 2) * 0.8,
      };
      
      targetX = (smoothMouse.x * viewport.width / 4) * mouseXFactor;
      
      // Smoother Y position based on section
      switch(activeSection) {
        case 'hero':
          targetY = (smoothMouse.y * viewport.height) / 5;
          break;
        case 'about':
          targetY = viewport.height / 10 + Math.sin(time * 0.4) * 0.2;
          break;
        case 'projects':
          targetY = -viewport.height / 12 + Math.sin(time * 0.3) * 0.15;
          break;
        case 'skills':
          targetY = viewport.height / 14 + Math.sin(time * 0.5) * 0.2;
          break;
        case 'contact':
          targetY = -viewport.height / 8 + Math.sin(time * 0.3) * 0.1;
          break;
        default:
          targetY = (smoothMouse.y * viewport.height) / 5;
      }
      
      // Base rotation based on which side model is on
      const baseRotation = modelPosition === 'left' ? Math.PI * 0.2 : -Math.PI * 0.2;
      
      // Enhanced rotation logic for smoother turning
      let targetRotationY = baseRotation;
      
      // Add breathing animation
      const breathe = Math.sin(time * 0.8) * 0.03;
      modelRef.current.position.z = breathe;
      
      // Special animations based on active section
      if (activeSection === 'hero') {
        // Gentler greeting animation
        targetRotationY = Math.sin(time * 0.8) * 0.25;
      } else if (activeSection === 'about') {
        // Attentive pose
        targetRotationY = THREE.MathUtils.lerp(baseRotation, Math.PI * 0.15, 0.6);
      } else if (activeSection === 'projects') {
        // Add vertical bobbing for excitement
        targetY += Math.sin(time * 1.5) * 0.15;
      }
      
      // Update spring animations for rotation - this makes it very smooth
      rotationY.start({ to: targetRotationY });
      
      // React to user hovering elements with spring animations
      if (hoveredElement === 'skills') {
        rotationZ.start({ to: Math.sin(time * 1.5) * 0.08 });
      } else if (hoveredElement === 'contact') {
        rotationY.start({ to: Math.sin(time * 0.7) * 0.2 });
      } else {
        rotationZ.start({ to: Math.sin(time * 0.4) * 0.03 });
      }
    }
    
    // Update spring animations for position
    positionX.start({ to: targetX });
    positionY.start({ to: targetY });
    
    // Apply spring values to the model
    modelRef.current.position.x = positionX.get();
    modelRef.current.position.y = positionY.get();
    modelRef.current.rotation.y = rotationY.get();
    modelRef.current.rotation.z = rotationZ.get();
    
    // Subtle reaction to scroll - gentler tilt
    const scrollFactor = Math.min(scrollY / 800, 0.7);
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      scrollFactor * (Math.PI / 20),
      0.03 // Very slow interpolation for extra smoothness
    );
  });

  // Try to load the model, use Robot fallback if it fails
  const { scene } = useGLTF('/models/bumblebee_2007_model.glb');
  if (modelError) return <Robot activeSection={activeSection} hoveredElement={hoveredElement} modelPosition={modelPosition} />;
  
  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={0.015} 
        position={[0, -1.5, 0]} 
      />
    </group>
  );
}

// Enhanced robot fallback with interactive behaviors
function Robot({ 
  activeSection = '', 
  hoveredElement = null, 
  modelPosition = 'right' 
}: {
  activeSection?: string;
  hoveredElement?: string | null; // Update type to match what's being passed
  modelPosition?: string;
}) {
  // Use animated group from react-spring for smoother animations
  const modelRef = useRef<THREE.Group>(null);
  const { viewport, mouse } = useThree();
  
  // Spring animations for robot
  const { positionX, positionY, rotationX, rotationY, rotationZ } = useSpring({
    positionX: 0,
    positionY: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    config: {
      mass: 1.2,
      tension: 80,
      friction: 20,
    }
  });
  
  // Interactive animation - enhanced for smoothness
  useFrame((state) => {
    if (!modelRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse following with dampening
    const smoothMouse = {
      x: THREE.MathUtils.lerp(-1, 1, (mouse.x + 1) / 2) * 0.7, 
      y: THREE.MathUtils.lerp(-1, 1, (mouse.y + 1) / 2) * 0.7,
    };
    
    // Calculate target positions with mouse influence
    const mouseXFactor = modelPosition === 'left' ? -0.8 : 0.8;
    const targetX = (smoothMouse.x * viewport.width / 4) * mouseXFactor;
    const targetY = (smoothMouse.y * viewport.height) / 4;
    
    // Base animations with section awareness
    let targetRotationY = 0;
    let targetRotationZ = 0;
    let targetRotationX = 0;
    
    // Different animations based on active section
    switch(activeSection) {
      case 'hero':
        // Welcome animation - smoother sine wave
        targetRotationY = Math.sin(time * 0.7) * 0.25;
        targetRotationZ = Math.sin(time * 0.5) * 0.03;
        break;
      case 'about':
        // Attentive pose with gentle movement
        targetRotationX = Math.sin(time * 0.3) * 0.04;
        targetRotationY = THREE.MathUtils.lerp(0, Math.PI / 8, 0.8 + Math.sin(time * 0.2) * 0.2);
        break;
      case 'projects':
        // Exploring projects with interest
        targetRotationY = Math.sin(time * 0.25) * 0.4;
        targetRotationZ = Math.sin(time * 0.4) * 0.02;
        break;
      case 'skills':
        // Looking at skills with enthusiasm
        targetRotationY = Math.sin(time * 0.3) * 0.2;
        targetRotationZ = Math.sin(time * 0.4) * 0.04;
        break;
      default:
        // Default breathing animation
        targetRotationY = Math.sin(time * 0.4) * 0.15;
        targetRotationZ = Math.sin(time * 0.5) * 0.03;
    }
    
    // Special reactions to user interaction - enhanced
    if (hoveredElement === 'skills') {
      // More complex arm animation
      const armRef = modelRef.current.children.find(child => 
        child.position.x > 0 && Math.abs(child.position.y - 0.5) < 0.1
      );
      if (armRef) {
        armRef.rotation.z = Math.sin(time * 1.5) * 0.4;
      }
    }
    
    // Update spring animations
    positionX.start({ to: targetX });
    positionY.start({ to: targetY + Math.sin(time * 0.8) * 0.1 }); // Add gentle floating
    rotationX.start({ to: targetRotationX });
    rotationY.start({ to: targetRotationY });
    rotationZ.start({ to: targetRotationZ });
    
    // Apply spring values
    modelRef.current.position.x = positionX.get();
    modelRef.current.position.y = positionY.get();
    modelRef.current.rotation.x = rotationX.get();
    modelRef.current.rotation.y = rotationY.get();
    modelRef.current.rotation.z = rotationZ.get();
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]} scale={0.5}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 3, 1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.4, 2.2, 0.7]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="blue" emissive="blue" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.4, 2.2, 0.7]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="blue" emissive="blue" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.5, -2, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.5, -2, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Main component with enhanced interactivity
export default function ThreeScene({ 
  activeSection = 'hero', 
  hoveredElement = null // Update the type by modifying the component's prop type
}: {
  activeSection?: string;
  hoveredElement?: string | null; // Accept string | null type
}) {
  const [scrollY, setScrollY] = useState(0);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });
  const [modelPosition, setModelPosition] = useState('right'); // 'left' or 'right'
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Track scroll position and screen size
  useEffect(() => {
    // Initial sizing
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Track scroll
    const handleScroll = () => setScrollY(window.scrollY);
    
    // Track resize
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Enhanced side switching with transition state
  useEffect(() => {
    // Determine ideal position based on section
    let idealPosition;
    switch(activeSection) {
      case 'hero': idealPosition = 'right'; break;
      case 'about': idealPosition = 'left'; break;
      case 'projects': idealPosition = 'right'; break;
      case 'skills': idealPosition = 'left'; break;
      case 'contact': idealPosition = 'right'; break;
      default: idealPosition = 'right';
    }
    
    // Apply position change with transition flag
    if (modelPosition !== idealPosition) {
      setIsTransitioning(true);
      setTimeout(() => {
        setModelPosition(idealPosition);
        setTimeout(() => setIsTransitioning(false), 1500); // Match transition duration
      }, 200); // Small delay before changing position
    }
    
    // Random position changes - less frequent for smoother experience
    const switchTimer = setInterval(() => {
      if (!isTransitioning && Math.random() > 0.85) {
        setIsTransitioning(true);
        setTimeout(() => {
          setModelPosition(prev => prev === 'left' ? 'right' : 'left');
          setTimeout(() => setIsTransitioning(false), 1500); // Match transition duration
        }, 200);
      }
    }, 12000); // Longer interval between random switches
    
    return () => clearInterval(switchTimer);
  }, [activeSection, modelPosition, isTransitioning]);

  // Enhanced placement with smoother transitions
  const containerStyle = {
    position: 'fixed',
    zIndex: 5,
    pointerEvents: 'none',
    width: screenSize.width < 768 ? '100%' : screenSize.width < 1280 ? '30%' : '40%',
    height: screenSize.width < 768 ? '300px' : '90vh',
    transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)', // Smoother easing curve
    opacity: isTransitioning ? 0.7 : 1, // Fade during transitions
  } as React.CSSProperties;
  
  if (screenSize.width < 768) {
    // Mobile positioning: bottom of screen with gentler constraints
    containerStyle.bottom = 0;
    containerStyle.left = 0;
  } else {
    // Desktop positioning - dynamic left/right with more organic transitions
    containerStyle.top = '50%';
    containerStyle.transform = 'translateY(-50%)';
    
    // More space between content and model
    if (modelPosition === 'left') {
      containerStyle.left = '2%';
      containerStyle.right = 'auto';
    } else {
      containerStyle.right = '2%';
      containerStyle.left = 'auto';
    }
    
    // Refined vertical positioning for each section
    switch(activeSection) {
      case 'hero':
        containerStyle.top = '45%'; // Slightly higher on hero
        break;
      case 'about':
      case 'skills':
        containerStyle.top = '60%'; // Lower for content-heavy sections
        break;
      case 'projects':
        containerStyle.top = '28%'; // Higher for projects
        break;
      case 'contact':
        containerStyle.top = '42%'; // Middle position for contact
        break;
      default:
        containerStyle.top = '50%';
    }
  }

  return (
    <div style={containerStyle}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }} 
        style={{ background: 'transparent' }}
        dpr={[1, 2]} // Better performance on high DPI screens
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <BumblebeeModel 
            scrollY={scrollY} 
            activeSection={activeSection} 
            hoveredElement={hoveredElement}
            screenSize={screenSize}
            modelPosition={modelPosition}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
