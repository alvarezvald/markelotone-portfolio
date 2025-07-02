
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mountainRange: THREE.Group;
    fog: THREE.Fog;
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
    renderer.setClearColor(0x1a0b3d, 1); // Deep purple background
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Add atmospheric fog
    const fog = new THREE.Fog(0x2d1b69, 20, 100);
    scene.fog = fog;

    // Create comprehensive mountain range that spans full width
    const createMountainRange = () => {
      const mountainGroup = new THREE.Group();
      
      // Define multiple mountain peaks with varying characteristics
      const mountainPeaks = [
        // Background layer (furthest)
        { x: -45, height: 15, width: 12, type: 'jagged', distance: -40, color: 0x1a0b2e },
        { x: -25, height: 18, width: 15, type: 'rounded', distance: -38, color: 0x1a0b2e },
        { x: -5, height: 22, width: 18, type: 'jagged', distance: -42, color: 0x1a0b2e },
        { x: 20, height: 16, width: 14, type: 'rounded', distance: -39, color: 0x1a0b2e },
        { x: 40, height: 12, width: 10, type: 'jagged', distance: -41, color: 0x1a0b2e },
        
        // Middle layer
        { x: -35, height: 20, width: 16, type: 'rounded', distance: -25, color: 0x2d1b45 },
        { x: -10, height: 25, width: 20, type: 'jagged', distance: -28, color: 0x2d1b45 },
        { x: 15, height: 23, width: 18, type: 'rounded', distance: -26, color: 0x2d1b45 },
        { x: 35, height: 18, width: 14, type: 'jagged', distance: -27, color: 0x2d1b45 },
        
        // Foreground layer (closest and most detailed)
        { x: -20, height: 28, width: 22, type: 'jagged', distance: -15, color: 0x4a2c85 },
        { x: 5, height: 32, width: 25, type: 'rounded', distance: -12, color: 0x4a2c85 },
        { x: 30, height: 26, width: 20, type: 'jagged', distance: -14, color: 0x4a2c85 }
      ];

      mountainPeaks.forEach((peak, index) => {
        const mountain = createSingleMountain(peak);
        mountain.position.set(peak.x, -8, peak.distance);
        
        // Add subtle random rotation for variety
        mountain.rotation.y = (Math.random() - 0.5) * 0.2;
        
        mountainGroup.add(mountain);
      });

      return mountainGroup;
    };

    const createSingleMountain = (peakData: any) => {
      const vertices = [];
      const indices = [];
      const colors = [];
      
      const segments = peakData.type === 'jagged' ? 12 : 16;
      const baseY = 0;
      const heightVariation = peakData.type === 'jagged' ? 0.3 : 0.1;
      
      let vertexIndex = 0;
      
      // Create base vertices in a more complex pattern
      const baseVertices = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI;
        let x = Math.cos(angle) * peakData.width * 0.5;
        let z = (Math.random() - 0.5) * peakData.width * 0.3;
        
        // Add more randomness for jagged mountains
        if (peakData.type === 'jagged' && i > 0 && i < segments) {
          x += (Math.random() - 0.5) * peakData.width * 0.2;
        }
        
        vertices.push(x, baseY, z);
        
        // Color gradient from base to peak
        const baseColor = new THREE.Color(peakData.color);
        const lightnessFactor = 0.7 + Math.random() * 0.2;
        colors.push(baseColor.r * lightnessFactor, baseColor.g * lightnessFactor, baseColor.b * lightnessFactor);
        
        baseVertices.push(vertexIndex++);
      }
      
      // Create multiple peak points for more interesting silhouettes
      const peakCount = peakData.type === 'jagged' ? 3 : 1;
      const peakVertices = [];
      
      for (let p = 0; p < peakCount; p++) {
        const peakOffset = (p - (peakCount - 1) / 2) * peakData.width * 0.3;
        const peakHeight = peakData.height * (0.8 + Math.random() * 0.4);
        const heightMod = p === Math.floor(peakCount / 2) ? 1 : 0.7 + Math.random() * 0.3;
        
        vertices.push(
          peakOffset + (Math.random() - 0.5) * peakData.width * 0.1,
          baseY + peakHeight * heightMod,
          (Math.random() - 0.5) * peakData.width * 0.1
        );
        
        // Lighter colors for peaks
        const peakColor = new THREE.Color(peakData.color);
        const peakLightness = 1.2 + Math.random() * 0.3;
        colors.push(peakColor.r * peakLightness, peakColor.g * peakLightness, peakColor.b * peakLightness);
        
        peakVertices.push(vertexIndex++);
      }
      
      // Create triangular faces connecting base to peaks
      const segmentSize = Math.floor(segments / Math.max(peakCount, 1));
      
      for (let p = 0; p < peakCount; p++) {
        const startSeg = p * segmentSize;
        const endSeg = Math.min((p + 1) * segmentSize, segments);
        
        for (let i = startSeg; i < endSeg; i++) {
          if (baseVertices[i] !== undefined && baseVertices[i + 1] !== undefined) {
            indices.push(baseVertices[i], baseVertices[i + 1], peakVertices[p]);
          }
        }
      }
      
      // Connect adjacent segments at base for solid foundation
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % (segments + 1);
        if (baseVertices[i] !== undefined && baseVertices[next] !== undefined) {
          // Add base triangles to create solid foundation
          const centerIndex = vertexIndex;
          vertices.push(0, baseY - 2, 0);
          colors.push(0.1, 0.05, 0.15);
          indices.push(baseVertices[i], baseVertices[next], centerIndex);
          vertexIndex++;
        }
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      return mesh;
    };

    // Create the comprehensive mountain range
    const mountainRange = createMountainRange();
    scene.add(mountainRange);

    // Enhanced atmospheric background with gradient
    const createAtmosphericBackground = () => {
      const geometry = new THREE.PlaneGeometry(200, 120);
      
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Create atmospheric gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#0a0015'); // Very dark purple top
      gradient.addColorStop(0.2, '#1a0b3d'); // Dark purple
      gradient.addColorStop(0.4, '#2d1b69'); // Medium purple
      gradient.addColorStop(0.7, '#4a2c85'); // Lighter purple
      gradient.addColorStop(0.9, '#6b46c1'); // Light purple
      gradient.addColorStop(1, '#8b5cf6'); // Lightest purple bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add atmospheric fog effect
      for (let i = 0; i < 100; i++) {
        ctx.globalAlpha = Math.random() * 0.1 + 0.02;
        const size = Math.random() * 120 + 40;
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        
        const fogGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        fogGradient.addColorStop(0, '#ffffff');
        fogGradient.addColorStop(0.3, '#e0e7ff');
        fogGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = fogGradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const background = new THREE.Mesh(geometry, material);
      background.position.set(0, 20, -80);
      return background;
    };

    const atmosphericBg = createAtmosphericBackground();
    scene.add(atmosphericBg);

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x4a1a5c, 0.4);
    scene.add(ambientLight);

    // Primary directional light (warm sunset glow from top left)
    const mainLight = new THREE.DirectionalLight(0xff7b7b, 1.2);
    mainLight.position.set(-30, 40, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 200;
    scene.add(mainLight);

    // Secondary purple lighting for atmosphere
    const purpleLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
    purpleLight.position.set(-40, 25, -10);
    scene.add(purpleLight);

    // Blue accent lighting
    const blueLight = new THREE.PointLight(0x3b82f6, 0.6, 80);
    blueLight.position.set(40, 20, -15);
    scene.add(blueLight);

    // Rim lighting for mountain edges
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 10, 50);
    scene.add(rimLight);

    // Enhanced star field
    const createStarField = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsVertices = [];
      const starsColors = [];
      
      for (let i = 0; i < 3000; i++) {
        starsVertices.push(
          (Math.random() - 0.5) * 600,
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 500
        );
        
        const rand = Math.random();
        if (rand < 0.6) {
          starsColors.push(1, 1, 1); // White stars
        } else if (rand < 0.8) {
          starsColors.push(0.9, 0.7, 1); // Purple tint
        } else {
          starsColors.push(0.7, 0.9, 1); // Blue tint
        }
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
      
      const starsMaterial = new THREE.PointsMaterial({ 
        size: 0.4, 
        vertexColors: true,
        transparent: true,
        opacity: 0.9
      });
      
      return new THREE.Points(starsGeometry, starsMaterial);
    };

    const stars = createStarField();
    scene.add(stars);

    // Position camera for optimal mountain range viewing
    camera.position.set(0, 8, 25);
    camera.lookAt(0, 5, -20);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mountainRange,
      fog,
      animationId: null
    };

    // Enhanced mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    // Animation loop with atmospheric effects
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Smooth mountain range rotation
      const targetRotationY = mouseRef.current.x * Math.PI * 0.3;
      const targetRotationX = mouseRef.current.y * Math.PI * 0.1;
      
      sceneRef.current.mountainRange.rotation.y += (targetRotationY - sceneRef.current.mountainRange.rotation.y) * 0.02;
      sceneRef.current.mountainRange.rotation.x += (targetRotationX - sceneRef.current.mountainRange.rotation.x) * 0.01;

      // Dynamic camera movement
      const targetCameraX = mouseRef.current.x * 2;
      const targetCameraY = 8 + mouseRef.current.y * 1;
      
      sceneRef.current.camera.position.x += (targetCameraX - sceneRef.current.camera.position.x) * 0.02;
      sceneRef.current.camera.position.y += (targetCameraY - sceneRef.current.camera.position.y) * 0.01;
      sceneRef.current.camera.lookAt(0, 5, -20);

      // Atmospheric effects
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;
      
      atmosphericBg.material.opacity = 0.8 + Math.sin(time * 0.5) * 0.1;
      
      // Dynamic lighting
      purpleLight.intensity = 0.8 + Math.sin(time * 0.8) * 0.4;
      blueLight.intensity = 0.6 + Math.cos(time * 0.6) * 0.3;
      mainLight.intensity = 1.2 + Math.sin(time * 0.3) * 0.2;

      // Subtle fog animation
      sceneRef.current.fog.near = 20 + Math.sin(time * 0.2) * 3;
      sceneRef.current.fog.far = 100 + Math.cos(time * 0.15) * 10;

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
        
        sceneRef.current.mountainRange.children.forEach((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        
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
