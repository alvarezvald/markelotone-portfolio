
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mountains: THREE.Mesh[];
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
    mountRef.current.appendChild(renderer.domElement);

    // Create mountain geometry
    const createMountain = (vertices: number, radius: number, height: number) => {
      const geometry = new THREE.ConeGeometry(radius, height, vertices);
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0.6, 0.6, 0.3 + Math.random() * 0.3),
        transparent: true,
        opacity: 0.8
      });
      return new THREE.Mesh(geometry, material);
    };

    // Create multiple mountains
    const mountains: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const mountain = createMountain(
        6 + Math.floor(Math.random() * 4),
        2 + Math.random() * 3,
        4 + Math.random() * 6
      );
      
      mountain.position.x = (Math.random() - 0.5) * 30;
      mountain.position.z = -10 - Math.random() * 20;
      mountain.position.y = -2;
      
      mountain.rotation.y = Math.random() * Math.PI * 2;
      
      mountains.push(mountain);
      scene.add(mountain);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4444ff, 1, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 5;
    camera.position.y = 2;

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mountains,
      animationId: null
    };

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Camera movement based on mouse
      const targetX = mouseRef.current.x * 0.5;
      const targetY = mouseRef.current.y * 0.3;
      
      sceneRef.current.camera.position.x += (targetX - sceneRef.current.camera.position.x) * 0.05;
      sceneRef.current.camera.position.y += (targetY - sceneRef.current.camera.position.y) * 0.05;
      sceneRef.current.camera.lookAt(0, 0, -10);

      // Rotate mountains slowly
      sceneRef.current.mountains.forEach((mountain, index) => {
        mountain.rotation.y += 0.001 * (index + 1);
      });

      // Rotate stars
      stars.rotation.y += 0.0005;

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    // Window resize handler
    const handleResize = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.camera.aspect = window.innerWidth / window.innerHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Dispose of geometries and materials
        sceneRef.current.mountains.forEach(mountain => {
          mountain.geometry.dispose();
          if (mountain.material instanceof THREE.Material) {
            mountain.material.dispose();
          }
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

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ThreeScene;
