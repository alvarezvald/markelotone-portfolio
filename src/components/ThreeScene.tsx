
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    pyramid: THREE.Mesh;
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
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create detailed pyramid
    const createDetailedPyramid = () => {
      // Create pyramid geometry (cone with 4 sides)
      const geometry = new THREE.ConeGeometry(8, 12, 4);
      
      // Create detailed texture using canvas
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Create stone-like texture
      ctx.fillStyle = '#8B7D6B';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add brick lines
      ctx.strokeStyle = '#5D5A52';
      ctx.lineWidth = 2;
      
      // Horizontal lines
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      
      // Vertical lines (offset every other row)
      for (let i = 0; i < 512; i += 64) {
        for (let j = 0; j < 512; j += 32) {
          const offset = (j / 32) % 2 === 0 ? 0 : 32;
          ctx.beginPath();
          ctx.moveTo(i + offset, j);
          ctx.lineTo(i + offset, j + 32);
          ctx.stroke();
        }
      }
      
      // Add random stone details
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(${120 + Math.random() * 40}, ${110 + Math.random() * 30}, ${90 + Math.random() * 20}, 0.3)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      
      // Create material with the detailed texture
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95
      });
      
      return new THREE.Mesh(geometry, material);
    };

    // Create the pyramid
    const pyramid = createDetailedPyramid();
    pyramid.position.set(0, -2, -15);
    pyramid.rotation.y = Math.PI * 0.25; // Start at 45 degrees for better view
    scene.add(pyramid);

    // Enhanced lighting for better texture visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 15, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4444ff, 0.8, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Add side lighting to enhance texture
    const sideLight = new THREE.DirectionalLight(0xffaa44, 0.6);
    sideLight.position.set(-15, 5, -5);
    scene.add(sideLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 1500; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, -10);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      pyramid,
      animationId: null
    };

    // Mouse move handler for 360-degree pyramid rotation
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

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Full 360-degree pyramid rotation based on mouse position
      const targetRotationY = mouseRef.current.x * Math.PI * 2; // Full 360-degree rotation
      const targetRotationX = mouseRef.current.y * Math.PI * 0.5; // Up/down rotation
      
      // Smooth rotation interpolation
      sceneRef.current.pyramid.rotation.y += (targetRotationY - sceneRef.current.pyramid.rotation.y) * 0.05;
      sceneRef.current.pyramid.rotation.x += (targetRotationX - sceneRef.current.pyramid.rotation.x) * 0.03;

      // Subtle camera movement for depth
      const targetCameraX = mouseRef.current.x * 1;
      const targetCameraY = mouseRef.current.y * 0.5;
      
      sceneRef.current.camera.position.x += (targetCameraX - sceneRef.current.camera.position.x) * 0.05;
      sceneRef.current.camera.position.y += (targetCameraY - sceneRef.current.camera.position.y) * 0.03;
      sceneRef.current.camera.lookAt(0, 0, -10);

      // Rotate stars slowly
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

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
        sceneRef.current.pyramid.geometry.dispose();
        if (sceneRef.current.pyramid.material instanceof THREE.Material) {
          sceneRef.current.pyramid.material.dispose();
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
