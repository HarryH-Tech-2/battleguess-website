import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const PARTICLE_COLORS = [
  'rgba(249, 115, 22, 0.6)',   // primary-500 orange
  'rgba(251, 146, 60, 0.5)',   // primary-400 orange
  'rgba(253, 186, 116, 0.4)',  // primary-300 orange
  'rgba(254, 215, 170, 0.3)',  // primary-200 orange
  'rgba(255, 237, 213, 0.2)',  // primary-100 orange
];

const createParticle = (width: number, height: number): Particle => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  };
};

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  const initParticles = (width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 15000);
    particlesRef.current = Array.from({ length: Math.min(particleCount, 100) }, () =>
      createParticle(width, height)
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - particles gently move away from cursor
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx -= (dx / distance) * force * 0.02;
          particle.vy -= (dy / distance) * force * 0.02;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Add slight random movement
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;

        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}

// Floating orbs that move slowly in the background
export function FloatingOrbs() {
  const orbs = [
    { size: 300, x: '10%', y: '20%', duration: 20, delay: 0 },
    { size: 200, x: '80%', y: '60%', duration: 25, delay: 5 },
    { size: 250, x: '50%', y: '80%', duration: 22, delay: 2 },
    { size: 180, x: '20%', y: '70%', duration: 28, delay: 8 },
    { size: 220, x: '70%', y: '20%', duration: 24, delay: 4 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
