import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "hsl(225,75%,70%)",
  "hsl(225,75%,80%)",
  "hsl(0,74%,75%)",
  "hsl(210,80%,80%)",
  "hsl(225,65%,85%)",
];

export default function CursorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load the clinic image
    const img = new Image();
    img.src = "/image.png";
    img.onload = () => {
      imageRef.current = img;
    };

    const resize = () => {
      // Canvas only covers viewport, not entire page
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles on resize
      const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.5 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "hsl(225,75%,20%)");
      grad.addColorStop(0.5, "hsl(225,70%,25%)");
      grad.addColorStop(1, "hsl(225,75%,18%)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the clinic image as background overlay (only in viewport)
      if (imageRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        
        const imgAspect = imageRef.current.width / imageRef.current.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }
        
        ctx.drawImage(imageRef.current, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
      }

      // Add very subtle medical cross pattern
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
      for (let y = 0; y < canvas.height; y += 200) {
        for (let x = 0; x < canvas.width; x += 200) {
          ctx.fillRect(x + 90, y + 60, 20, 80);
          ctx.fillRect(x + 60, y + 90, 80, 20);
        }
      }
      ctx.restore();

      // Cursor glow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx > 0 && mx < canvas.width && my > 0 && my < canvas.height) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        glow.addColorStop(0, "hsl(0,74%,55%,0.25)");
        glow.addColorStop(0.4, "hsl(225,75%,60%,0.15)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const particles = particlesRef.current;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.1;
          p.vy -= (dy / dist) * force * 0.1;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vx += (Math.random() - 0.5) * 0.015;
        p.vy += (Math.random() - 0.5) * 0.015;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `,${p.opacity})`).replace("hsl(", "hsla(");
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(225,75%,75%,${(1 - d / 120) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none"
    />
  );
}
