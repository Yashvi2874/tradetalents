import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '../contexts/ThemeContext';
import * as THREE from 'three';

const FloatingShape = ({ position, rotationSpeed, color, size, shapeType, theme, emissiveIntensity }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;
      meshRef.current.rotation.z += rotationSpeed.z;
      
      // Gentle floating motion with more dynamic movement
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.5;
      meshRef.current.position.x = position[0] + Math.sin(time * 0.3 + position[1]) * 0.3;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.4 + position[2]) * 0.2;
    }
  });

  // Adjust material properties based on theme
  const opacity = theme === 'dark' ? 0.85 : 0.7;
  const metalness = theme === 'dark' ? 0.4 : 0.2;
  const roughness = theme === 'dark' ? 0.1 : 0.4;

  // Create geometry based on shape type
  let geometry;
  switch (shapeType) {
    case 'sphere':
      geometry = <sphereGeometry args={[size, 32, 32]} />;
      break;
    case 'torus':
      geometry = <torusGeometry args={[size * 0.7, size * 0.2, 16, 64]} />;
      break;
    case 'cone':
      geometry = <coneGeometry args={[size, size * 1.5, 16]} />;
      break;
    default: // cube
      geometry = <boxGeometry args={[size, size, size]} />;
  }

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={opacity}
        roughness={roughness}
        metalness={metalness}
        emissive={color.clone().multiplyScalar(emissiveIntensity)}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

const ThreeBackground = () => {
  const { theme } = useTheme();
  
  // Create multiple shapes with different properties
  const shapes = useMemo(() => {
    const shapeArray = [];
    const count = 30; // Increased number of shapes
    
    for (let i = 0; i < count; i++) {
      // Theme-aware colors with better contrast
      let color;
      let emissiveIntensity;
      
      if (theme === 'dark') {
        // Dark theme colors (more vibrant with higher emissive)
        const colors = [
          new THREE.Color(0.5, 0.7, 1),    // Blue
          new THREE.Color(0.8, 0.5, 1),    // Purple
          new THREE.Color(0.4, 0.9, 0.8),  // Teal
          new THREE.Color(1, 0.6, 0.5),    // Orange
          new THREE.Color(0.4, 0.8, 1)     // Sky blue
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
        emissiveIntensity = 0.15;
      } else {
        // Light theme colors (softer and more appropriate for light background)
        const colors = [
          new THREE.Color(0.4, 0.6, 0.9),  // Soft blue
          new THREE.Color(0.7, 0.4, 0.9),  // Soft purple
          new THREE.Color(0.3, 0.8, 0.7),  // Soft teal
          new THREE.Color(0.9, 0.5, 0.4),  // Soft orange
          new THREE.Color(0.3, 0.7, 0.9)   // Soft sky blue
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
        emissiveIntensity = 0.08; // Lower emissive for light theme
      }
      
      // Random shape type
      const shapeTypes = ['cube', 'sphere', 'torus', 'cone'];
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      shapeArray.push({
        position: [
          (Math.random() - 0.5) * 40,  // Wider distribution
          (Math.random() - 0.5) * 25,  // Taller distribution
          (Math.random() - 0.5) * 20 - 25 // Deeper distribution
        ],
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        color,
        size: Math.random() * 1.8 + 0.4, // Slightly larger range
        shapeType,
        emissiveIntensity
      });
    }
    
    return shapeArray;
  }, [theme]);

  return (
    <>
      {/* Ambient light - adjusted for better theme adaptation */}
      <ambientLight intensity={theme === 'dark' ? 0.4 : 0.6} />
      
      {/* Directional light - more balanced for both themes */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={theme === 'dark' ? 1.2 : 1.5} 
        castShadow 
      />
      
      {/* Point lights for more dynamic lighting */}
      <pointLight 
        position={[-25, -15, -25]} 
        intensity={theme === 'dark' ? 0.9 : 0.6} 
        color={theme === 'dark' ? "#4f8bf9" : "#3b82f6"} 
      />
      <pointLight 
        position={[25, 15, 25]} 
        intensity={theme === 'dark' ? 0.9 : 0.6} 
        color={theme === 'dark' ? "#9d6cff" : "#8b5cf6"} 
      />
      
      {/* Additional lights for better illumination */}
      <pointLight 
        position={[0, 20, -20]} 
        intensity={theme === 'dark' ? 0.5 : 0.3} 
        color={theme === 'dark' ? "#60a5fa" : "#93c5fd"} 
      />
      <pointLight 
        position={[0, -20, 20]} 
        intensity={theme === 'dark' ? 0.5 : 0.3} 
        color={theme === 'dark' ? "#a78bfa" : "#c4b5fd"} 
      />
      
      {/* Floating shapes */}
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          position={shape.position}
          rotationSpeed={shape.rotationSpeed}
          color={shape.color}
          size={shape.size}
          shapeType={shape.shapeType}
          theme={theme}
          emissiveIntensity={shape.emissiveIntensity}
        />
      ))}
    </>
  );
};

export default ThreeBackground;