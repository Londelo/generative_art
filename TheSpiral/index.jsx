import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpiralArt() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Central sphere - the anchor point of our piece
    const centralGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const centralMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralSphere);
    
    // Generate the spiral path with a random starting angle
    // This randomness means each load creates a unique piece
    const randomStartAngle = Math.random() * Math.PI * 2;
    const spiralPoints = [];
    const numPoints = 800;
    const spiralTurns = 12;
    const startRadius = 5;
    const endRadius = 0.5;
    const startZ = 0;  // Spiral starts at z=0 with the central point
    const endZ = 6;    // Spiral descends into positive z as it winds inward
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      // Interpolate radius from outer to inner as we progress
      const radius = startRadius + (endRadius - startRadius) * t;
      // Angle increases as we spiral inward
      const angle = randomStartAngle + t * spiralTurns * Math.PI * 2;
      // Z depth increases as we spiral inward
      const z = startZ + (endZ - startZ) * t;
      
      spiralPoints.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: z,
        baseDistance: radius, // Store original distance for wave animation
        index: i
      });
    }
    
    // Create small spheres at each spiral point and lines to center
    const spheres = [];
    const lines = [];
    const sphereGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.15 
    });
    
    spiralPoints.forEach((point, index) => {
      // Create the sphere marker
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(point.x, point.y, point.z);
      sphere.userData = { 
        basePos: new THREE.Vector3(point.x, point.y, point.z),
        index: index 
      };
      scene.add(sphere);
      spheres.push(sphere);
      
      // Create line connecting to central point
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(point.x, point.y, point.z)
      ]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);
    });
    
    // Orbit controls implementation (manual since we can't import OrbitControls)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position);
    
    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      // Rotate camera around center based on mouse movement
      spherical.theta -= deltaX * 0.01;
      spherical.phi -= deltaY * 0.01;
      
      // Clamp phi to prevent flipping
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onWheel = (e) => {
      e.preventDefault();
      // Zoom by adjusting the spherical radius
      spherical.radius += e.deltaY * 0.01;
      spherical.radius = Math.max(3, Math.min(20, spherical.radius));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
    };
    
    // Attach event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    
    // Animation loop - this creates the wave effect
    let time = 0;
    const animate = () => {
      time += 0.02;
      
      // Update each sphere position to create wave effect
      spheres.forEach((sphere, index) => {
        const basePos = sphere.userData.basePos;
        
        // Wave propagates from outer spiral to inner
        // Each sphere oscillates along the line to center
        const wavePhase = time - index * 0.02;
        const waveAmplitude = 0.25 + Math.sin(time * 0.5) * 0.08;
        const wave = Math.sin(wavePhase) * waveAmplitude;
        
        // Direction from center to base position (normalized)
        const direction = basePos.clone().normalize();
        
        // New position = base position + wave offset along direction to center
        const newPos = basePos.clone().add(direction.multiplyScalar(wave));
        sphere.position.copy(newPos);
        
        // Update the corresponding line
        const linePositions = lines[index].geometry.attributes.position.array;
        linePositions[3] = newPos.x;
        linePositions[4] = newPos.y;
        linePositions[5] = newPos.z;
        lines[index].geometry.attributes.position.needsUpdate = true;
      });
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="p-4 text-center text-gray-600 text-sm">
        Click and drag to rotate • Scroll to zoom
      </div>
      <div ref={containerRef} className="flex-1 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
