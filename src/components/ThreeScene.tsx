
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
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create low-poly mountain
    const createMountain = () => {
      // Create vertices for a low-poly mountain shape
      const vertices = [];
      const indices = [];
      const colors = [];
      
      // Mountain base vertices (octagon shape)
      const baseRadius = 8;
      const baseVertices = 8;
      const height = 12;
      
      // Center point at base
      vertices.push(0, -2, 0);
      colors.push(0.2, 0.3, 0.6); // Darker blue for base
      
      // Base perimeter vertices
      for (let i = 0; i < baseVertices; i++) {
        const angle = (i / baseVertices) * Math.PI * 2;
        const x = Math.cos(angle) * baseRadius;
        const z = Math.sin(angle) * baseRadius;
        vertices.push(x, -2, z);
        colors.push(0.2, 0.3, 0.6); // Darker blue for base
      }
      
      // Peak vertex
      vertices.push(0, height - 2, 0);
      colors.push(0.4, 0.6, 0.9); // Lighter blue for peak
      
      // Mid-level vertices for more geometric detail
      const midHeight = (height - 2) * 0.6;
      const midRadius = baseRadius * 0.4;
      for (let i = 0; i < baseVertices; i++) {
        const angle = (i / baseVertices) * Math.PI * 2;
        const x = Math.cos(angle) * midRadius;
        const z = Math.sin(angle) * midRadius;
        vertices.push(x, midHeight, z);
        colors.push(0.3, 0.45, 0.75); // Mid-tone blue
      }
      
      // Create faces for the mountain
      const peakIndex = baseVertices + 1;
      const midStartIndex = baseVertices + 2;
      
      // Base faces (connecting center to perimeter)
      for (let i = 1; i <= baseVertices; i++) {
        const next = i === baseVertices ? 1 : i + 1;
        indices.push(0, i, next);
      }
      
      // Lower mountain faces (base to mid-level)
      for (let i = 0; i < baseVertices; i++) {
        const baseNext = i === baseVertices - 1 ? 1 : i + 2;
        const midCurrent = midStartIndex + i;
        const midNext = i === baseVertices - 1 ? midStartIndex : midStartIndex + i + 1;
        
        // Two triangles per face
        indices.push(i + 1, baseNext, midCurrent);
        indices.push(baseNext, midNext, midCurrent);
      }
      
      // Upper mountain faces (mid-level to peak)
      for (let i = 0; i < baseVertices; i++) {
        const midCurrent = midStartIndex + i;
        const midNext = i === baseVertices - 1 ? midStartIndex : midStartIndex + i + 1;
        
        indices.push(midCurrent, midNext, peakIndex);
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      // Create material with vertex colors and smooth shading
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: false,
        transparent: true,
        opacity: 0.95
      });
      
      return new THREE.Mesh(geometry, material);
    };

    // Create the mountain
    const mountain = createMountain();
    mountain.position.set(0, -2, -15);
    mountain.rotation.y = Math.PI * 0.25; // Start at 45 degrees for better view
    scene.add(mountain);

    // Enhanced lighting for the mountain
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main directional light from above (as specified)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(0, 20, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Additional side lighting for depth
    const sideLight = new THREE.DirectionalLight(0x6699ff, 0.6);
    sideLight.position.set(-15, 10, -5);
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

    // Animation loop
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
