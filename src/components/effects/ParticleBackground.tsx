import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  color: string;
  pulsePhase: number;
}

const PARTICLE_COLORS = [
  'rgba(249, 115, 22, 0.7)',   // primary-500 orange
  'rgba(251, 146, 60, 0.6)',   // primary-400 orange
  'rgba(253, 186, 116, 0.5)',  // primary-300 orange
  'rgba(234, 88, 12, 0.6)',    // primary-600 orange
  'rgba(194, 65, 12, 0.5)',    // primary-700 orange
];

const createParticle = (width: number, height: number, x?: number, y?: number): Particle => {
  const baseRadius = Math.random() * 4 + 2;
  return {
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    radius: baseRadius,
    baseRadius,
    opacity: Math.random() * 0.6 + 0.3,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    pulsePhase: Math.random() * Math.PI * 2,
  };
};

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 10000);
    particlesRef.current = Array.from({ length: Math.min(particleCount, 150) }, () =>
      createParticle(width, height)
    );
  }, []);

  const createBurst = useCallback((x: number, y: number, count: number = 12) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 3;
      const particle = createParticle(canvas.width, canvas.height, x, y);
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.radius = Math.random() * 3 + 2;
      particle.baseRadius = particle.radius;
      particlesRef.current.push(particle);
    }

    // Remove excess particles to maintain performance
    const maxParticles = 200;
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }
  }, []);

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
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      mouseRef.current.isPressed = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
    };

    const handleClick = (e: MouseEvent) => {
      createBurst(e.clientX, e.clientY, 15);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
        createBurst(touch.clientX, touch.clientY, 12);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    const animate = () => {
      timeRef.current += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Pulsing effect
        const pulse = Math.sin(timeRef.current * 2 + particle.pulsePhase) * 0.3 + 1;
        particle.radius = particle.baseRadius * pulse;

        // Mouse interaction - attraction when pressed, repulsion otherwise
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 200;
          if (mouseRef.current.isPressed) {
            // Attract to cursor when pressed
            particle.vx += (dx / distance) * force * 0.05;
            particle.vy += (dy / distance) * force * 0.05;
          } else {
            // Repel from cursor
            particle.vx -= (dx / distance) * force * 0.03;
            particle.vy -= (dy / distance) * force * 0.03;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Add slight random movement
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

        // Boundary check with wrap-around
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Fade out fast-moving particles (burst particles)
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > 2) {
          particle.opacity -= 0.02;
          if (particle.opacity <= 0) return false;
        }

        // Draw particle with glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`));
        gradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, `${particle.opacity * 0.5})`));
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = 0.2 * (1 - dist / 150);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Draw connection to mouse when nearby
      if (mouseRef.current.x > 0) {
        particlesRef.current.forEach((particle) => {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const opacity = 0.3 * (1 - dist / 180);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, createBurst]);

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
    { size: 350, x: '10%', y: '15%', duration: 20, delay: 0 },
    { size: 250, x: '85%', y: '55%', duration: 25, delay: 5 },
    { size: 300, x: '45%', y: '75%', duration: 22, delay: 2 },
    { size: 200, x: '15%', y: '65%', duration: 28, delay: 8 },
    { size: 280, x: '75%', y: '20%', duration: 24, delay: 4 },
    { size: 180, x: '55%', y: '35%', duration: 26, delay: 6 },
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
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.04) 50%, transparent 70%)`,
            filter: 'blur(50px)',
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 40, -15, 0],
            scale: [1, 1.15, 0.9, 1.08, 1],
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
