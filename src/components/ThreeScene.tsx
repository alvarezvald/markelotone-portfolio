
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
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio); // For sharper rendering
    mountRef.current.appendChild(renderer.domElement);

    // Create a single wide mountain that spans the full width
    const createWideMountain = () => {
      // Create a custom geometry for a wide mountain
      const geometry = new THREE.ConeGeometry(15, 8, 8); // Much wider base, taller
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0.6, 0.7, 0.4),
        transparent: true,
        opacity: 0.9
      });
      return new THREE.Mesh(geometry, material);
    };

    // Create the single wide mountain
    const mountain = createWideMountain();
    mountain.position.set(0, -3, -15);
    mountain.rotation.y = Math.PI * 0.1;
    scene.add(mountain);

    // Enhanced lighting for sharper appearance
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1.2);
    directionalLight.position.set(15, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4444ff, 1.5, 100);
    pointLight.position.set(-15, 15, 15);
    scene.add(pointLight);

    // Add rim lighting for sharper edges
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

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
      mountain,
      animationId: null
    };

    // Mouse move handler for responsive interaction
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

      // Enhanced camera movement based on mouse/touch
      const targetX = mouseRef.current.x * 2;
      const targetY = mouseRef.current.y * 1;
      
      sceneRef.current.camera.position.x += (targetX - sceneRef.current.camera.position.x) * 0.08;
      sceneRef.current.camera.position.y += (targetY - sceneRef.current.camera.position.y) * 0.05;
      sceneRef.current.camera.lookAt(0, 0, -10);

      // Subtle mountain rotation
      sceneRef.current.mountain.rotation.y += 0.0005;

      // Rotate stars slowly
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    // Window resize handler for responsive design
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
