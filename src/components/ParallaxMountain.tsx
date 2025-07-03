
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ParallaxMountain = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mountains: THREE.Group;
    stars: THREE.Points;
    clouds: THREE.Group;
    animationId: number | null;
  } | null>(null);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Create mountain range
    const createMountainRange = () => {
      const mountainGroup = new THREE.Group();
      
      // Create multiple mountain layers for parallax effect
      const layers = [
        { peaks: 8, height: 30, width: 100, z: -80, color: 0x4A5568 },
        { peaks: 6, height: 25, width: 80, z: -60, color: 0x5A6B7C },
        { peaks: 5, height: 20, width: 60, z: -40, color: 0x6B7C8D },
        { peaks: 4, height: 15, width: 40, z: -20, color: 0x7C8D9E }
      ];

      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.peaks; i++) {
          const geometry = new THREE.ConeGeometry(
            Math.random() * 8 + 4,
            layer.height + Math.random() * 10,
            8
          );
          
          const material = new THREE.MeshLambertMaterial({
            color: layer.color,
            transparent: true,
            opacity: 0.8 - layerIndex * 0.1
          });
          
          const mountain = new THREE.Mesh(geometry, material);
          mountain.position.x = (i - layer.peaks / 2) * (layer.width / layer.peaks);
          mountain.position.y = -5;
          mountain.position.z = layer.z + Math.random() * 10 - 5;
          mountain.castShadow = true;
          mountain.receiveShadow = true;
          
          mountainGroup.add(mountain);
        }
      });

      // Add snow caps
      layers.forEach((layer, layerIndex) => {
        if (layerIndex < 2) { // Only front mountains get snow
          for (let i = 0; i < layer.peaks; i++) {
            const snowGeometry = new THREE.SphereGeometry(2 + Math.random() * 2, 8, 6);
            const snowMaterial = new THREE.MeshLambertMaterial({
              color: 0xFFFFFF,
              transparent: true,
              opacity: 0.9
            });
            
            const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
            snowCap.position.x = (i - layer.peaks / 2) * (layer.width / layer.peaks);
            snowCap.position.y = layer.height / 2 + 5;
            snowCap.position.z = layer.z + Math.random() * 10 - 5;
            
            mountainGroup.add(snowCap);
          }
        }
      });

      return mountainGroup;
    };

    // Create floating clouds
    const createClouds = () => {
      const cloudGroup = new THREE.Group();
      
      for (let i = 0; i < 15; i++) {
        const cloudGeometry = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6);
        const cloudMaterial = new THREE.MeshLambertMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.3 + Math.random() * 0.2
        });
        
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.x = (Math.random() - 0.5) * 100;
        cloud.position.y = Math.random() * 20 + 10;
        cloud.position.z = Math.random() * -60 - 20;
        cloud.scale.setScalar(Math.random() * 0.5 + 0.5);
        
        cloudGroup.add(cloud);
      }
      
      return cloudGroup;
    };

    // Create enhanced starfield
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsVertices = [];
      const starsColors = [];
      
      for (let i = 0; i < 2000; i++) {
        starsVertices.push(
          (Math.random() - 0.5) * 400,
          Math.random() * 200 + 50,
          (Math.random() - 0.5) * 400
        );
        
        // Varying star colors
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.3, 0.7 + Math.random() * 0.3);
        starsColors.push(color.r, color.g, color.b);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
      
      const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      return new THREE.Points(starsGeometry, starsMaterial);
    };

    const mountains = createMountainRange();
    const clouds = createClouds();
    const stars = createStars();
    
    scene.add(mountains);
    scene.add(clouds);
    scene.add(stars);

    // Enhanced lighting for mountain scene
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xB0C4DE, 1.2);
    moonLight.position.set(20, 40, 10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    scene.add(moonLight);

    const fillLight = new THREE.DirectionalLight(0x4169E1, 0.3);
    fillLight.position.set(-20, 20, -10);
    scene.add(fillLight);

    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, -20);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mountains,
      stars,
      clouds,
      animationId: null
    };

    // Animation loop with parallax effects
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0005;
      const scrollFactor = scrollY * 0.001;

      // Parallax camera movement based on scroll
      sceneRef.current.camera.position.z = 30 - scrollFactor * 20;
      sceneRef.current.camera.position.y = 10 + scrollFactor * 5;
      sceneRef.current.camera.lookAt(0, scrollFactor * -5, -20);

      // Animate mountains with subtle movement
      sceneRef.current.mountains.rotation.y = Math.sin(time) * 0.02;
      
      // Animate clouds
      sceneRef.current.clouds.children.forEach((cloud, index) => {
        cloud.position.x += Math.sin(time + index) * 0.01;
        cloud.rotation.y += 0.002;
      });

      // Gentle star rotation
      sceneRef.current.stars.rotation.y += 0.0002;
      sceneRef.current.stars.rotation.x += 0.0001;

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

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Dispose of geometries and materials
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
        
        sceneRef.current.renderer.dispose();
        
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [scrollY]);

  return <div ref={mountRef} className="fixed inset-0 w-full h-full -z-10" />;
};

export default ParallaxMountain;
