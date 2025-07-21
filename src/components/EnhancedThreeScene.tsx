import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Text,
  Float,
  MeshWobbleMaterial,
  Sparkles
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Enhanced Pyramid Component
const EnhancedPyramid = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Create detailed texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create mystical stone texture
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#8B7D6B');
    gradient.addColorStop(0.5, '#A0927B');
    gradient.addColorStop(1, '#6B5B4D');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add hieroglyphic-like patterns
    ctx.strokeStyle = '#4A3B2A';
    ctx.lineWidth = 3;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 30 + 10;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add inner details
      ctx.beginPath();
      ctx.moveTo(x - size/2, y);
      ctx.lineTo(x + size/2, y);
      ctx.moveTo(x, y - size/2);
      ctx.lineTo(x, y + size/2);
      ctx.stroke();
    }
    
    // Add golden highlights
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const length = Math.random() * 20 + 5;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + length);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Smooth floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      
      // Smooth rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Pulsing scale effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <coneGeometry args={[3, 4, 4]} />
          <MeshWobbleMaterial
            map={texture}
            factor={0.1}
            speed={0.5}
            roughness={0.8}
            metalness={0.2}
            emissive="#221100"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Mystical glow effect */}
        <mesh position={[0, 0, 0]} scale={1.2}>
          <coneGeometry args={[3, 4, 4]} />
          <meshBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>
      
      {/* Floating hieroglyphic text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/ancient.woff"
        maxWidth={10}
      >
        ⚱ ANCIENT WISDOM ⚱
      </Text>
    </group>
  );
};

// Particle System
const MysticalParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    const colors = new Float32Array(300 * 3);
    
    for (let i = 0; i < 300; i++) {
      const i3 = i * 3;
      // Create particles in a sphere around the pyramid
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Golden mystical colors
      colors[i3] = 1; // R
      colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
      colors[i3 + 2] = Math.random() * 0.3; // B
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Animate particle positions
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={300}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Enhanced Lighting Setup
const EnhancedLighting = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#4A3B2A" />
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        intensity={1}
        color="#FFD700"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FF6B35" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#FFD700"
        castShadow
      />
    </>
  );
};

// Interactive Camera Controller
const CameraController = () => {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    // Smooth camera movement based on mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Main Enhanced Scene Component
const EnhancedThreeScene: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 w-full h-full"
    >
      <Canvas
        camera={{ position: [0, 5, 8], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows
      >
        {/* Enhanced Lighting */}
        <EnhancedLighting />
        
        {/* Main Pyramid */}
        <EnhancedPyramid />
        
        {/* Particle Systems */}
        <MysticalParticles />
        <Sparkles 
          count={50} 
          scale={[20, 20, 20]} 
          size={2} 
          speed={0.3}
          color="#FFD700"
        />
        
        {/* Enhanced Background */}
        <Stars 
          radius={50} 
          depth={50} 
          count={2000} 
          factor={4} 
          saturation={0.5}
          fade
          speed={0.5}
        />
        
        {/* Interactive Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
        
        {/* Camera Controller */}
        <CameraController />
        
        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </motion.div>
  );
};

export default EnhancedThreeScene;