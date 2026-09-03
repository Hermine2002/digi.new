"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function DigibaseModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 2.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Soft Lighting (Bnakakan luys)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(5, 8, 5);
    scene.add(directionalLight);

    // 3. Server / Device Core Group
    const deviceGroup = new THREE.Group();

    // Main Body - Zhamanakakic matte-moxraguyn korpus (bazar, bnakakan tesq)
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.7, 2.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Zinc-900 (shat ardiakan web dizayni guyun)
      roughness: 0.3,
      metalness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    deviceGroup.add(body);

    // Front Panel - Barak shert
    const frontPanelGeo = new THREE.BoxGeometry(2.42, 0.72, 0.05);
    const frontPanelMat = new THREE.MeshStandardMaterial({
      color: 0x27272a, // Zinc-800
      roughness: 0.4,
      metalness: 0.5,
    });
    const frontPanel = new THREE.Mesh(frontPanelGeo, frontPanelMat);
    frontPanel.position.z = 1.11;
    deviceGroup.add(frontPanel);

    // --- SHAT QICH #00c050 (Miayn statusi ev aknarki hamar) ---
    const brandGreen = 0x00c050;
    const greenMat = new THREE.MeshBasicMaterial({ color: brandGreen });

    // 1. Mi hat poqrik status LED klorik arjevi aknarkum
    const ledGeo = new THREE.CircleGeometry(0.04, 16);
    const ledMesh = new THREE.Mesh(ledGeo, greenMat);
    ledMesh.position.set(-1.0, 0, 1.14);
    deviceGroup.add(ledMesh);

    // 2. Minimalist shoxacox gic (Power line accent)
    const lineGeo = new THREE.BoxGeometry(0.3, 0.02, 0.01);
    const lineMesh = new THREE.Mesh(lineGeo, greenMat);
    lineMesh.position.set(-0.7, 0, 1.14);
    deviceGroup.add(lineMesh);

    // Simvolik ventilyacia (Air vents - moxraguyn / anvtang)
    const ventMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    for(let i = 0; i < 4; i++) {
      const ventGeo = new THREE.BoxGeometry(0.8, 0.04, 0.02);
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(0.5, 0.15 - (i * 0.1), 1.14);
      deviceGroup.add(vent);
    }

    scene.add(deviceGroup);

    // 4. Smooth floating & rotation (Shata dandagh u bnakakan)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Dandagh, havasarakcvac pttum
      deviceGroup.rotation.y += 0.005;
      deviceGroup.position.y = Math.sin(Date.now() * 0.001) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // 5. Resize Listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.innerHTML = "";
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[450px] relative" />;
}