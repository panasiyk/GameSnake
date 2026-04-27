import { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';

export default function SnakeGame() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let engine = null;
    let cancelled = false;

    GameEngine.create(containerRef.current)
      .then((e) => {
        if (cancelled) {
          e.destroy();
          return;
        }
        engine = e;
      });

    return () => {
      cancelled = true;
      engine?.destroy();
      engine = null;
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a] p-4">
      <div
        ref={containerRef}
        className="shadow-2xl rounded-lg overflow-hidden border-4 border-[#333]"
      />
    </div>
  );
}
