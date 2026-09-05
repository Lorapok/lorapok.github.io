import React, { useEffect, useState, useRef } from 'react';

export interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  value,
  label,
  suffix = '',
  prefix = ''
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out function
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * value);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-4">
      <div className="text-4xl font-bold text-white mb-2 flex items-center">
        {prefix && <span className="text-3xl text-[#67ff8f] mr-1">{prefix}</span>}
        {count}
        {suffix && <span className="text-3xl text-[#67ff8f] ml-1">{suffix}</span>}
      </div>
      <div className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
};
