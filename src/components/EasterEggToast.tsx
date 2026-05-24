import { useEffect, useState } from 'react';
import { EasterEggMessage } from '@/types/game';

interface EasterEggToastProps {
  message: EasterEggMessage;
  onComplete: () => void;
}

export default function EasterEggToast({ message, onComplete }: EasterEggToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setIsVisible(false);
    }, 2500);

    const removeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 pointer-events-none
        transition-all duration-500 ease-out
        ${isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
      `}
    >
      <div className="relative">
        <div 
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{ 
            background: 'linear-gradient(135deg, #ff6b7a, #ffd700, #00ff88)',
            opacity: 0.5 
          }}
        />
        <div className="relative bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/50 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {message.emoji}
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-2">
              {message.title}
            </div>
            <div className="text-lg text-gray-300">
              {message.subtitle}
            </div>
            <div className="mt-4 text-2xl font-bold text-yellow-400">
              🎉 {message.score} 分 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
