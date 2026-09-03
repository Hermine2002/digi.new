import React, { useEffect, useRef } from 'react';

interface GalaxyAnimationOrbitProps {
  particleCount?: number;
  starColor?: string;
  orbitRadius?: number;
  className?: string;
}

export const GalaxyAnimationOrbit: React.FC<GalaxyAnimationOrbitProps> = ({
  particleCount = 800,
  starColor = '#8a2be2',
  orbitRadius = 250,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Մասնիկների (Particles) ստեղծում
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * orbitRadius + 20;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * orbitRadius,
        angle,
        radius,
        speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
      };
    });

    let rotationAngle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 12, 0.2)'; // Smooth trail effect
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      rotationAngle += 0.002;

      particles.forEach((p) => {
        p.angle += p.speed;

        // Օրբիտալ պտույտի հաշվարկ
        const currRadius = p.radius + Math.sin(rotationAngle * 2 + p.angle) * 10;
        const x3d = Math.cos(p.angle) * currRadius;
        const y3d = Math.sin(p.angle) * currRadius;
        const z3d = p.z;

        // 3D-ից 2D պրոյեկցիա (Perspective)
        const fov = 300;
        const scale = fov / (fov + z3d + 100);
        const x2d = centerX + x3d * scale;
        const y2d = centerY + y3d * scale * 0.5; // Թեքված օրբիտալ էֆեկտ

        ctx.beginPath();
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.globalAlpha = p.alpha * scale;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = starColor;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, starColor, orbitRadius]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default GalaxyAnimationOrbit;