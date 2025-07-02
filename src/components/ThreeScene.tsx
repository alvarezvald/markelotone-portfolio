import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mountain: THREE.Mesh;
    animationId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0015, 1); // Dark purple background
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create low-poly mountain range
    const createMountain = () => {
      const vertices = [];
      const indices = [];
      const colors = [];
      
      // Create multiple mountain peaks for a range effect
      const peaks = [
        { x: -12, height: 8, width: 6 },
        { x: -4, height: 12, width: 8 },
        { x: 6, height: 10, width: 7 },
        { x: 15, height: 6, width: 5 }
      ];
      
      let vertexIndex = 0;
      
      peaks.forEach((peak, peakIdx) => {
        const baseY = -3;
        const segments = 8;
        
        // Base vertices for this peak
        const baseVertices = [];
        for (let i = 0; i <= segments; i++) {
          const x = peak.x + (i / segments - 0.5) * peak.width;
          const z = Math.random() * 2 - 1; // Add some randomness
          vertices.push(x, baseY, z);
          
          // Purple gradient colors - darker at base
          const purpleIntensity = 0.1 + Math.random() * 0.1;
          colors.push(purpleIntensity, 0.05, purpleIntensity * 1.5);
          baseVertices.push(vertexIndex++);
        }
        
        // Peak vertex
        const peakX = peak.x + (Math.random() - 0.5) * 0.5;
        const peakZ = (Math.random() - 0.5) * 0.5;
        vertices.push(peakX, baseY + peak.height, peakZ);
        
        // Lighter purple for peaks
        const peakPurple = 0.3 + Math.random() * 0.2;
        colors.push(peakPurple, 0.15, peakPurple * 1.8);
        const peakVertex = vertexIndex++;
        
        // Create triangular faces
        for (let i = 0; i < segments; i++) {
          // Connect base segments to peak
          indices.push(baseVertices[i], baseVertices[i + 1], peakVertex);
        }
        
        // Connect adjacent peaks at base level
        if (peakIdx > 0) {
          const prevPeakBaseStart = vertexIndex - segments - 2 - (segments + 1);
          for (let i = 0; i < Math.min(segments, segments); i++) {
            if (prevPeakBaseStart + segments - i >= 0 && baseVertices[i] < vertexIndex) {
              indices.push(prevPeakBaseStart + segments - i, baseVertices[i], baseVertices[i + 1]);
            }
          }
        }
      });
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true, // More angular/low-poly look
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      
      return new THREE.Mesh(geometry, material);
    };

    // Create the mountain range
    const mountain = createMountain();
    mountain.position.set(0, -2, -20);
    scene.add(mountain);

    // Create cosmic nebula background
    const createNebulaBackground = () => {
      const geometry = new THREE.PlaneGeometry(200, 100);
      
      // Create a canvas texture for the nebula effect
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#1a0b3d'); // Dark purple top
      gradient.addColorStop(0.3, '#2d1b69'); // Medium purple
      gradient.addColorStop(0.7, '#4a2c85'); // Lighter purple
      gradient.addColorStop(1, '#0a0015'); // Very dark bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      // Add nebula clouds
      for (let i = 0; i < 50; i++) {
        ctx.globalAlpha = Math.random() * 0.3 + 0.1;
        const size = Math.random() * 80 + 20;
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        
        const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        cloudGradient.addColorStop(0, '#8a4fff');
        cloudGradient.addColorStop(0.5, '#6b46c1');
        cloudGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = cloudGradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(0, 10, -50);
      return nebula;
    };

    const nebula = createNebulaBackground();
    scene.add(nebula);

    // Enhanced lighting for cosmic effect
    const ambientLight = new THREE.AmbientLight(0x4a1a5c, 0.6); // Purple ambient
    scene.add(ambientLight);

    // Main directional light with purple tint
    const directionalLight = new THREE.DirectionalLight(0x9d4edd, 1.5);
    directionalLight.position.set(0, 30, 10);
    scene.add(directionalLight);

    // Additional cosmic lighting
    const purpleLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
    purpleLight.position.set(-20, 15, -10);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 0.6, 80);
    blueLight.position.set(20, 10, -15);
    scene.add(blueLight);

    // Enhanced stars with purple/blue tints
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    const starsColors = [];
    
    for (let i = 0; i < 2000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 400
      );
      
      // Mix of white, purple, and blue stars
      const rand = Math.random();
      if (rand < 0.7) {
        starsColors.push(1, 1, 1); // White
      } else if (rand < 0.85) {
        starsColors.push(0.8, 0.6, 1); // Purple tint
      } else {
        starsColors.push(0.6, 0.8, 1); // Blue tint
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 0.3, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, -10);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mountain,
      animationId: null
    };

    // Mouse move handler for 360-degree mountain rotation
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Touch move handler for mobile devices
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    // Animation loop with cosmic effects
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Full 360-degree mountain rotation based on mouse position
      const targetRotationY = mouseRef.current.x * Math.PI * 2; // Full 360-degree rotation
      const targetRotationX = mouseRef.current.y * Math.PI * 0.5; // Up/down rotation
      
      // Smooth rotation interpolation
      sceneRef.current.mountain.rotation.y += (targetRotationY - sceneRef.current.mountain.rotation.y) * 0.05;
      sceneRef.current.mountain.rotation.x += (targetRotationX - sceneRef.current.mountain.rotation.x) * 0.03;

      // Subtle camera movement for depth
      const targetCameraX = mouseRef.current.x * 1;
      const targetCameraY = mouseRef.current.y * 0.5;
      
      sceneRef.current.camera.position.x += (targetCameraX - sceneRef.current.camera.position.x) * 0.05;
      sceneRef.current.camera.position.y += (targetCameraY - sceneRef.current.camera.position.y) * 0.03;
      sceneRef.current.camera.lookAt(0, 0, -10);

      // Rotate stars slowly
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
      
      nebula.material.opacity = 0.7 + Math.sin(Date.now() * 0.001) * 0.1;
      
      // Animate purple light intensity
      purpleLight.intensity = 0.8 + Math.sin(Date.now() * 0.002) * 0.3;
      blueLight.intensity = 0.6 + Math.cos(Date.now() * 0.0015) * 0.2;

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    // Window resize handler
    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
      sceneRef.current.renderer.setPixelRatio(window.devicePixelRatio);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Dispose of geometries and materials
        sceneRef.current.mountain.geometry.dispose();
        if (sceneRef.current.mountain.material instanceof THREE.Material) {
          sceneRef.current.mountain.material.dispose();
        }
        
        stars.geometry.dispose();
        if (stars.material instanceof THREE.Material) {
          stars.material.dispose();
        }
        
        sceneRef.current.renderer.dispose();
        
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

export default ThreeScene;
