import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  target: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export default function StatCounter({ target, label, suffix = "+", duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    const delay = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, delay);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="stat-card text-center group hover:shadow-hover transition-all duration-300">
      <div className="text-5xl font-display font-black mb-2 text-primary">
        {count.toLocaleString()}
        <span className="text-clinic-red">{suffix}</span>
      </div>
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">{label}</p>
    </div>
  );
}
