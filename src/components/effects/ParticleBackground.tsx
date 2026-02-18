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
  radarGlow: number;
}

// Military green palette
const PARTICLE_COLORS = [
  'rgba(34, 197, 94, 0.6)',    // emerald green
  'rgba(74, 222, 128, 0.5)',   // lighter emerald
  'rgba(22, 163, 74, 0.55)',   // deeper green
  'rgba(134, 239, 172, 0.4)',  // pale green
  'rgba(21, 128, 61, 0.5)',    // dark military green
];

const createParticle = (width: number, height: number, x?: number, y?: number): Particle => {
  const baseRadius = Math.random() * 3.5 + 1.5;
  return {
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: baseRadius,
    baseRadius,
    opacity: Math.random() * 0.5 + 0.2,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    pulsePhase: Math.random() * Math.PI * 2,
    radarGlow: 0,
  };
};

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const radarAngleRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 12000);
    particlesRef.current = Array.from({ length: Math.min(particleCount, 120) }, () =>
      createParticle(width, height)
    );
  }, []);

  const createBurst = useCallback((x: number, y: number, count: number = 10) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2.5 + Math.random() * 2.5;
      const particle = createParticle(canvas.width, canvas.height, x, y);
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.radius = Math.random() * 2.5 + 1.5;
      particle.baseRadius = particle.radius;
      particlesRef.current.push(particle);
    }

    const maxParticles = 180;
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
      createBurst(e.clientX, e.clientY, 12);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
        createBurst(touch.clientX, touch.clientY, 10);
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
      radarAngleRef.current += 0.008; // Slow radar rotation
      if (radarAngleRef.current > Math.PI * 2) radarAngleRef.current -= Math.PI * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;

      // --- Radar grid rings ---
      for (let r = 1; r <= 4; r++) {
        const ringRadius = (maxRadius / 4) * r;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.04 - r * 0.005})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Crosshair lines ---
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();

      // --- Radar sweep (conic gradient) ---
      const sweepAngle = radarAngleRef.current;
      const sweepGradient = ctx.createConicGradient(sweepAngle - 0.5, centerX, centerY);
      sweepGradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
      sweepGradient.addColorStop(0.05, 'rgba(34, 197, 94, 0)');
      sweepGradient.addColorStop(0.12, 'rgba(34, 197, 94, 0.06)');
      sweepGradient.addColorStop(0.14, 'rgba(74, 222, 128, 0.1)');
      sweepGradient.addColorStop(0.15, 'rgba(34, 197, 94, 0)');
      sweepGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sweep leading-edge line
      const edgeX = centerX + Math.cos(sweepAngle) * maxRadius;
      const edgeY = centerY + Math.sin(sweepAngle) * maxRadius;
      const lineGrad = ctx.createLinearGradient(centerX, centerY, edgeX, edgeY);
      lineGrad.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
      lineGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
      lineGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(edgeX, edgeY);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Update & draw particles ---
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Pulsing
        const pulse = Math.sin(timeRef.current * 2 + particle.pulsePhase) * 0.25 + 1;
        particle.radius = particle.baseRadius * pulse;

        // Radar glow: light up when sweep passes
        const pAngle = Math.atan2(particle.y - centerY, particle.x - centerX);
        let angleDiff = sweepAngle - pAngle;
        while (angleDiff < 0) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
        if (angleDiff < 0.35) {
          particle.radarGlow = Math.max(particle.radarGlow, 1.0 - angleDiff / 0.35);
        }
        particle.radarGlow *= 0.97;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 200;
          if (mouseRef.current.isPressed) {
            particle.vx += (dx / distance) * force * 0.05;
            particle.vy += (dy / distance) * force * 0.05;
          } else {
            particle.vx -= (dx / distance) * force * 0.03;
            particle.vy -= (dy / distance) * force * 0.03;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.vx += (Math.random() - 0.5) * 0.08;
        particle.vy += (Math.random() - 0.5) * 0.08;

        // Boundary wrap
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Fade burst particles
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > 2) {
          particle.opacity -= 0.02;
          if (particle.opacity <= 0) return false;
        }

        // Draw
        const glowBoost = particle.radarGlow * 0.8;
        const effectiveOpacity = Math.min(particle.opacity + glowBoost, 1);
        const effectiveRadius = particle.radius * (1 + particle.radarGlow * 0.5);

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, effectiveRadius * 3
        );

        if (particle.radarGlow > 0.1) {
          gradient.addColorStop(0, `rgba(74, 222, 128, ${effectiveOpacity})`);
          gradient.addColorStop(0.4, `rgba(34, 197, 94, ${effectiveOpacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        } else {
          gradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${effectiveOpacity})`));
          gradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, `${effectiveOpacity * 0.4})`));
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, effectiveRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Bright core on radar-lit particles
        if (particle.radarGlow > 0.3) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, effectiveRadius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(187, 247, 208, ${particle.radarGlow * 0.8})`;
          ctx.fill();
        }

        return true;
      });

      // --- Tactical network connections ---
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const radarBoost = Math.max(particle.radarGlow, other.radarGlow);
            const baseOpacity = 0.12 * (1 - dist / 140);
            const opacity = baseOpacity + radarBoost * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.lineWidth = radarBoost > 0.3 ? 1.5 : 0.8;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // --- Mouse connections ---
      if (mouseRef.current.x > 0) {
        particlesRef.current.forEach((particle) => {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const opacity = 0.25 * (1 - dist / 180);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
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

// Floating orbs — military green/khaki tones
export function FloatingOrbs() {
  const orbs = [
    { size: 350, x: '10%', y: '15%', duration: 20, delay: 0, color: 'rgba(34, 197, 94, 0.08)' },
    { size: 250, x: '85%', y: '55%', duration: 25, delay: 5, color: 'rgba(22, 163, 74, 0.07)' },
    { size: 300, x: '45%', y: '75%', duration: 22, delay: 2, color: 'rgba(74, 222, 128, 0.06)' },
    { size: 200, x: '15%', y: '65%', duration: 28, delay: 8, color: 'rgba(161, 161, 0, 0.06)' },
    { size: 280, x: '75%', y: '20%', duration: 24, delay: 4, color: 'rgba(34, 197, 94, 0.07)' },
    { size: 180, x: '55%', y: '35%', duration: 26, delay: 6, color: 'rgba(101, 163, 13, 0.06)' },
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
            background: `radial-gradient(circle, ${orb.color} 0%, ${orb.color.replace(/[\d.]+\)$/, '0.02)')} 50%, transparent 70%)`,
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
