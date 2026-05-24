import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG, SKIN_COLORS } from '@/types/game';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useGameStore(state => state.snake);
  const food = useGameStore(state => state.food);
  const skinColor = useGameStore(state => state.skinColor);
  const isGameOver = useGameStore(state => state.isGameOver);
  const isPlaying = useGameStore(state => state.isPlaying);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { CELL_SIZE, GRID_SIZE, CANVAS_SIZE } = GAME_CONFIG;
    const colors = SKIN_COLORS[skinColor];

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const foodRadius = CELL_SIZE / 2 - 4;

    const gradient = ctx.createRadialGradient(foodX, foodY, 0, foodX, foodY, foodRadius * 2);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      const isHead = index === 0;

      if (isHead) {
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 12;
        ctx.fillStyle = colors.head;
      } else {
        ctx.shadowBlur = 0;
        const alpha = 1 - (index / snake.length) * 0.4;
        ctx.fillStyle = colors.body;
        ctx.globalAlpha = alpha;
      }

      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (isHead) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('王', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      }
    });

    if (isGameOver) {
      ctx.fillStyle = 'rgba(10, 22, 40, 0.85)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 48px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('游戏结束', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 30);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px "Microsoft YaHei", sans-serif';
      ctx.fillText('点击重新开始', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
    }

    if (!isPlaying && !isGameOver) {
      ctx.fillStyle = 'rgba(10, 22, 40, 0.6)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('贪吃蛇', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '20px "Microsoft YaHei", sans-serif';
      ctx.fillText('点击开始游戏', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
    }
  }, [snake, food, skinColor, isGameOver, isPlaying]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_SIZE}
      height={GAME_CONFIG.CANVAS_SIZE}
      className="rounded-lg shadow-2xl border-2 border-teal-500/20"
    />
  );
}
