"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useScroll, useMotionValueEvent } from "framer-motion";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uPortalR;
  uniform float uChromatic;
  uniform float uDissolve;
  uniform float uPulse;
  uniform vec3  uColorInner;
  uniform vec3  uColorMid;
  uniform vec3  uColorOuter;
  varying vec2  vUv;

  // Hash + value noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0; a *= 0.5;
    }
    return v;
  }

  // Distance-to-ring with displacement
  float ring(vec2 uv, vec2 c, float r, float w) {
    float d = length(uv - c);
    return smoothstep(r - w, r, d) - smoothstep(r, r + w, d);
  }

  void main() {
    // Aspect-correct UV centered at 0
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    vec2 m  = (uMouse * 2.0 - 1.0);
    m.x *= uResolution.x / uResolution.y;

    // Cursor warp: pull uv toward cursor with falloff
    float d2cursor = length(uv - m);
    uv += (m - uv) * 0.08 * smoothstep(0.6, 0.0, d2cursor);

    // Portal pulse
    float r  = uPortalR + uPulse * 0.012 + sin(uTime * 1.5) * 0.008;

    // Domain-warp noise drives the ring's flame edge
    vec2 q = uv * 2.5 + vec2(uTime * 0.15, uTime * 0.1);
    float n = fbm(q + fbm(q + uTime * 0.2));
    float displaced = r + (n - 0.5) * 0.06;

    // 3 channels offset by chromatic amount
    float ringR = ring(uv, vec2(0.0,  uChromatic), displaced, 0.020);
    float ringG = ring(uv, vec2(0.0,         0.0), displaced, 0.020);
    float ringB = ring(uv, vec2(0.0, -uChromatic), displaced, 0.020);
    vec3 ringCol = vec3(ringR, ringG, ringB) * 1.6;

    // Inner glow inside the ring
    float dCenter = length(uv);
    float inside  = smoothstep(displaced + 0.05, displaced - 0.10, dCenter);
    vec3  inner   = mix(uColorOuter, uColorMid,   smoothstep(0.6, 0.0, dCenter));
    inner         = mix(inner,       uColorInner, inside);

    // God-rays from center using radial sin
    float angle  = atan(uv.y, uv.x);
    float rays   = pow(0.5 + 0.5 * sin(angle * 18.0 + uTime * 0.6), 12.0);
    rays *= smoothstep(displaced + 0.5, displaced, dCenter) * inside * 0.7;

    vec3 col = inner + ringCol + rays * uColorInner;

    // Dissolve mask: noise-driven step
    float mask = step(uDissolve, fbm(vUv * 8.0 + uTime * 0.05));
    col *= mask;

    // Vignette
    col *= 1.0 - smoothstep(0.7, 1.6, length(uv) * 0.9);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function PortalMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, mouse } = useThree();
  const { scrollYProgress } = useScroll();

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uResolution:  { value: new THREE.Vector2(1, 1) },
      uMouse:       { value: new THREE.Vector2(0.5, 0.5) },
      uPortalR:     { value: 0.0 },
      uChromatic:   { value: 0.0 },
      uDissolve:    { value: 0.0 },
      uPulse:       { value: 0.0 },
      uColorInner:  { value: new THREE.Color("#fde7c5") },
      uColorMid:    { value: new THREE.Color("#7c3aed") },
      uColorOuter:  { value: new THREE.Color("#0a0014") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms as {
      uTime:       { value: number };
      uResolution: { value: THREE.Vector2 };
      uMouse:      { value: THREE.Vector2 };
      uPortalR:    { value: number };
      uChromatic:  { value: number };
      uDissolve:   { value: number };
      uPulse:      { value: number };
    };
    u.uTime.value += delta;
    u.uResolution.value.set(size.width, size.height);
    u.uMouse.value.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);

    const scroll = scrollYProgress.get();
    const target = THREE.MathUtils.smoothstep(scroll, 0, 0.08) * 0.5
                 + THREE.MathUtils.smoothstep(scroll, 0.08, 1) * 0.18;
    u.uPortalR.value = THREE.MathUtils.lerp(u.uPortalR.value, target, 0.05);

    const sectionFreq = Math.abs(Math.sin(scroll * Math.PI * 5));
    u.uChromatic.value = THREE.MathUtils.lerp(
      u.uChromatic.value,
      0.004 + sectionFreq * 0.022,
      0.08,
    );

    const dissolvePhase = Math.max(0, Math.sin(scroll * Math.PI * 5) - 0.6);
    u.uDissolve.value = THREE.MathUtils.lerp(u.uDissolve.value, dissolvePhase * 0.4, 0.15);

    u.uPulse.value = Math.sin(state.clock.elapsedTime * 0.8);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function PortalShader() {
  return (
    <Canvas
      className="!fixed inset-0 z-0"
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <PortalMesh />
    </Canvas>
  );
}
