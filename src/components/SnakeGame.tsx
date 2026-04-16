import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [gameOver, food, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const cellSize = canvas.width / GRID_SIZE;

      // Clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid (Subtle)
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      ctx.beginPath();
      ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00ffff' : '#008888';
        ctx.shadowBlur = isHead ? 20 : 10;
        ctx.shadowColor = '#00ffff';
        
        // Rounded segments
        const x = segment.x * cellSize + 2;
        const y = segment.y * cellSize + 2;
        const size = cellSize - 4;
        const radius = 4;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      });

      // Reset shadow
      ctx.shadowBlur = 0;
    };

    const animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [snake, food]);

  return (
    <div id="snake-game-wrapper" className="relative flex flex-col items-center gap-4">
      <div id="canvas-border" className="relative border-4 border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <canvas
          id="snake-canvas"
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block"
        />
        {gameOver && (
          <div id="game-over-overlay" className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 id="game-over-title" className="text-4xl font-bold text-cyan-400 mb-2 tracking-tighter uppercase">Game Over</h2>
            <p id="final-score-text" className="text-gray-400 mb-6 font-mono">Final Score: {score}</p>
            <button
              id="restart-button"
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.5)] uppercase tracking-widest text-sm"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      
      <div id="game-status-indicators" className="flex gap-8 font-mono text-xs uppercase tracking-widest text-cyan-500/60">
        <div id="system-active-indicator" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          System Active
        </div>
        <div id="target-indicator" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-magenta-500" style={{ backgroundColor: '#ff00ff' }} />
          Target: {food.x},{food.y}
        </div>
      </div>
    </div>
  );
};
