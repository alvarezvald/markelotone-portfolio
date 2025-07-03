
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParallaxMountain = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mountains: THREE.Group;
    snow: THREE.Points;
    animationId: number | null;
    scrollY: number;
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

    // Create mountain geometry
    const createMountain = (baseWidth: number, height: number, segments: number) => {
      const geometry = new THREE.ConeGeometry(baseWidth, height, segments);
      
      // Create snow texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Create gradient from snow white at top to dark grey at bottom
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#f0f8ff');
      gradient.addColorStop(0.6, '#778899');
      gradient.addColorStop(1, '#2f4f4f');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add snow texture details
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256; // Snow mostly at top
        const size = Math.random() * 4 + 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      });
      
      return new THREE.Mesh(geometry, material);
    };

    // Create mountain range
    const mountains = new THREE.Group();
    
    // Background mountains (smaller, further)
    const backMountain1 = createMountain(15, 20, 8);
    backMountain1.position.set(-25, -5, -40);
    backMountain1.rotation.y = Math.PI * 0.1;
    mountains.add(backMountain1);
    
    const backMountain2 = createMountain(12, 18, 8);
    backMountain2.position.set(20, -6, -35);
    backMountain2.rotation.y = Math.PI * -0.2;
    mountains.add(backMountain2);
    
    // Mid-ground mountains
    const midMountain1 = createMountain(20, 25, 8);
    midMountain1.position.set(-15, -3, -25);
    midMountain1.rotation.y = Math.PI * 0.15;
    mountains.add(midMountain1);
    
    const midMountain2 = createMountain(18, 28, 8);
    midMountain2.position.set(25, -4, -30);
    midMountain2.rotation.y = Math.PI * -0.1;
    mountains.add(midMountain2);
    
    // Foreground mountains (larger, closer)
    const frontMountain1 = createMountain(25, 35, 8);
    frontMountain1.position.set(-10, 0, -15);
    frontMountain1.rotation.y = Math.PI * 0.05;
    mountains.add(frontMountain1);
    
    const frontMountain2 = createMountain(30, 40, 8);
    frontMountain2.position.set(15, -2, -20);
    frontMountain2.rotation.y = Math.PI * -0.08;
    mountains.add(frontMountain2);
    
    scene.add(mountains);

    // Create falling snow particles - REDUCED from 1000 to 300
    const snowGeometry = new THREE.BufferGeometry();
    const snowVertices = [];
    const snowVelocities = [];
    
    for (let i = 0; i < 300; i++) {
      snowVertices.push(
        (Math.random() - 0.5) * 100, // x
        Math.random() * 50 + 10,     // y
        (Math.random() - 0.5) * 100  // z
      );
      snowVelocities.push(
        (Math.random() - 0.5) * 0.1, // x velocity
        Math.random() * 0.15 + 0.05,   // y velocity (falling) - REDUCED speed
        (Math.random() - 0.5) * 0.1  // z velocity
      );
    }
    
    snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowVertices, 3));
    snowGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(snowVelocities, 3));
    
    const snowMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.2, // REDUCED size from 0.3 to 0.2
      transparent: true,
      opacity: 0.6 // REDUCED opacity from 0.8 to 0.6
    });
    
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);

    // Enhanced lighting for mountain visibility
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Cool blue light from the left
    const leftLight = new THREE.DirectionalLight(0x87ceeb, 0.6);
    leftLight.position.set(-15, 10, 10);
    scene.add(leftLight);

    // Warm light from the right
    const rightLight = new THREE.DirectionalLight(0xffa500, 0.4);
    rightLight.position.set(15, 8, 5);
    scene.add(rightLight);

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, -20);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mountains,
      snow,
      animationId: null,
      scrollY: 0
    };

    // Scroll handler for parallax effect - FIXED to prevent mountain disappearing
    const handleScroll = () => {
      if (!sceneRef.current) return;
      
      const scrolled = window.pageYOffset;
      const heroHeight = window.innerHeight;
      const scrollProgress = Math.min(scrolled / heroHeight, 1);
      
      sceneRef.current.scrollY = scrolled;
      
      // Parallax effect - different layers move at different speeds - SUBTLE movement
      sceneRef.current.mountains.children.forEach((mountain, index) => {
        const speed = (index + 1) * 0.0001; // REDUCED from 0.0003
        mountain.position.y += scrolled * speed * 0.1; // REDUCED effect
        
        // Zoom effect based on scroll - GENTLE zoom
        const baseScale = 1 + scrollProgress * 0.1; // REDUCED from 0.3
        mountain.scale.setScalar(baseScale);
      });
      
      // Camera movement for immersive feel - SUBTLE movement
      sceneRef.current.camera.position.z = 10 + scrollProgress * 2; // REDUCED from 5
      sceneRef.current.camera.position.y = 5 + scrollProgress * 1; // REDUCED from 3
      sceneRef.current.camera.lookAt(0, scrollProgress * -1, -20); // REDUCED from -2
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Animate falling snow
      const positions = sceneRef.current.snow.geometry.attributes.position;
      const velocities = sceneRef.current.snow.geometry.attributes.velocity;
      
      for (let i = 0; i < positions.count; i++) {
        // Update position based on velocity
        positions.setY(i, positions.getY(i) - velocities.getY(i));
        positions.setX(i, positions.getX(i) + velocities.getX(i));
        positions.setZ(i, positions.getZ(i) + velocities.getZ(i));
        
        // Reset particle if it falls below the ground
        if (positions.getY(i) < -10) {
          positions.setY(i, Math.random() * 20 + 30);
          positions.setX(i, (Math.random() - 0.5) * 100);
          positions.setZ(i, (Math.random() - 0.5) * 100);
        }
      }
      positions.needsUpdate = true;

      // Very subtle mountain animation
      sceneRef.current.mountains.children.forEach((mountain, index) => {
        mountain.rotation.y += Math.sin(Date.now() * 0.001 + index) * 0.00005; // REDUCED from 0.0001
      });

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Dispose of geometries and materials
        sceneRef.current.mountains.children.forEach((mountain) => {
          if (mountain instanceof THREE.Mesh) {
            mountain.geometry.dispose();
            if (mountain.material instanceof THREE.Material) {
              mountain.material.dispose();
            }
          }
        });
        
        sceneRef.current.snow.geometry.dispose();
        if (sceneRef.current.snow.material instanceof THREE.Material) {
          sceneRef.current.snow.material.dispose();
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

export default ParallaxMountain;
