"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type * as THREE from "three";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform float u_isDark;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Smooth interpolation function
  float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
  }

  // Improved fluid motion function with smoother transitions
  float fluid(vec2 uv, float time) {
    // Slower, larger scale movement
    float noise1 = snoise(uv * 1.5 + time * 0.05);
    // Medium scale details
    float noise2 = snoise(uv * 2.5 - time * 0.07) * 0.6;
    // Fine details with very subtle movement
    float noise3 = snoise(uv * 4.0 + time * 0.03) * 0.3;
    
    // Smooth combination
    float base = noise1;
    base = mix(base, base + noise2, 0.7);
    base = mix(base, base + noise3, 0.4);
    
    return base;
  }

  vec3 getDarkThemeColors(float index) {
    if (index < 1.0) return vec3(0.05, 0.1, 0.25);     // Deep royal blue
    if (index < 2.0) return vec3(0.2, 0.05, 0.3);      // Deep purple
    if (index < 3.0) return vec3(0.1, 0.2, 0.4);       // Midnight blue
    if (index < 4.0) return vec3(0.3, 0.1, 0.4);       // Rich purple
    if (index < 5.0) return vec3(0.15, 0.25, 0.45);    // Twilight blue
    return vec3(0.25, 0.15, 0.35);                     // Deep violet
  }

  vec3 getLightThemeColors(float index) {
    if (index < 1.0) return vec3(0.9, 0.95, 1.0);      // Ice blue
    if (index < 2.0) return vec3(0.85, 0.9, 1.0);      // Sky blue
    if (index < 3.0) return vec3(0.8, 0.9, 0.95);      // Powder blue
    if (index < 4.0) return vec3(0.75, 0.85, 1.0);     // Soft azure
    if (index < 5.0) return vec3(0.7, 0.8, 0.95);      // Light steel blue
    return vec3(0.8, 0.85, 0.95);                      // Baby blue
  }

  void main() {
    vec2 uv = vUv;
    float time = u_time * 0.5;  // Increased from 0.3
    
    // Create smooth fluid motion with faster movements
    float flow1 = fluid(uv + time * 0.08, time);  // Increased from 0.05
    float flow2 = fluid(uv - time * 0.1, time);   // Increased from 0.07
    float flow3 = fluid(uv + vec2(time * 0.09, time * -0.07), time);  // Increased from 0.06 and -0.04
    
    // Enhanced swirling effect with faster rotation
    vec2 swirl = vec2(
      sin(time * 0.2 + flow1) + cos(time * 0.25 + flow3 * 0.5),  // Increased from 0.1 and 0.15
      cos(time * 0.2 + flow2) + sin(time * 0.25 + flow3 * 0.5)   // Increased from 0.1 and 0.15
    ) * 0.2;  // Increased from 0.15
    
    // Combine fluid motions with smooth interpolation
    float blend = fluid(uv + swirl, time);
    float blend2 = fluid(uv - swirl, time);
    float blend3 = fluid(uv + swirl * 0.5, time);
    
    // Get theme-based colors with more variety
    vec3 color1 = mix(getDarkThemeColors(0.0), getLightThemeColors(0.0), u_isDark);
    vec3 color2 = mix(getDarkThemeColors(1.0), getLightThemeColors(1.0), u_isDark);
    vec3 color3 = mix(getDarkThemeColors(2.0), getLightThemeColors(2.0), u_isDark);
    vec3 color4 = mix(getDarkThemeColors(3.0), getLightThemeColors(3.0), u_isDark);
    vec3 color5 = mix(getDarkThemeColors(4.0), getLightThemeColors(4.0), u_isDark);
    vec3 color6 = mix(getDarkThemeColors(5.0), getLightThemeColors(5.0), u_isDark);
    
    // Enhanced color transitions
    float t1 = smootherstep(0.0, 1.0, (blend + 1.0) * 0.5);
    float t2 = smootherstep(0.0, 1.0, (blend2 + 1.0) * 0.5);
    float t3 = smootherstep(0.0, 1.0, (blend3 + 1.0) * 0.5);
    
    // Complex color mixing
    vec3 colorA = mix(mix(color1, color2, t1), color3, t3);
    vec3 colorB = mix(mix(color4, color5, t2), color6, t3);
    float mixFactor = smootherstep(0.0, 1.0, sin(time * 0.1) * 0.5 + 0.5);
    vec3 finalColor = mix(colorA, colorB, mixFactor);
    
    // Enhanced brightness variation
    float brightness = 1.0 + 0.08 * sin(time + blend * 2.0) * cos(time * 0.5 + blend2);
    finalColor *= brightness;
    
    // Subtle saturation adjustment
    float saturation = 1.1 + 0.05 * sin(time * 0.2);
    finalColor = mix(vec3(dot(finalColor, vec3(0.299, 0.587, 0.114))), finalColor, saturation);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface FluidMeshBackgroundProps {
  className?: string;
  fixed?: boolean;
}

const FluidMeshBackground = ({
  className,
  fixed = true,
}: FluidMeshBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Import Three.js dynamically to avoid SSR issues
    import("three").then((THREE) => {
      // Setup
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);

      // Create mesh
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: { value: 0 },
          u_isDark: { value: theme === "dark" ? 0.0 : 1.0 },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 1;

      // Store refs
      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      materialRef.current = material;

      // Animation loop
      const animate = (time: number) => {
        if (materialRef.current) {
          materialRef.current.uniforms.u_time.value = time * 0.001;
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        frameRef.current = requestAnimationFrame(animate);
      };

      animate(0);

      // Handle resize
      const handleResize = () => {
        if (rendererRef.current) {
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(frameRef.current);
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        if (containerRef.current?.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      };
    });
  }, [theme]); // Add theme as dependency

  // Update theme
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_isDark.value =
        theme === "dark" ? 0.0 : 1.0;
    }
  }, [theme]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={cn("inset-0 w-full h-full", fixed && "fixed", className)}
    />
  );
};

export default FluidMeshBackground;
