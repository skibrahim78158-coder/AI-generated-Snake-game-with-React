/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Trophy, Activity, Zap, Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Grid */}
      <div id="bg-grid" className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Header */}
      <header id="main-header" className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div id="header-logo-container" className="flex items-center gap-3">
          <div id="logo-icon" className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <div id="logo-text-container">
            <h1 id="app-title" className="text-xl font-black tracking-tighter uppercase italic leading-none">Neon Rhythm</h1>
            <p id="app-version" className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] mt-1">Neural Interface v2.4</p>
          </div>
        </div>

        <div id="header-stats-container" className="flex gap-12">
          <div id="current-score-display" className="text-right">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Current Score</p>
            <p id="score-value" className="text-2xl font-black font-mono text-cyan-400 tabular-nums leading-none">
              {score.toString().padStart(5, '0')}
            </p>
          </div>
          <div id="high-score-display" className="text-right">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">High Score</p>
            <p id="high-score-value" className="text-2xl font-black font-mono text-magenta-500 tabular-nums leading-none" style={{ color: '#ff00ff' }}>
              {highScore.toString().padStart(5, '0')}
            </p>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Stats & Info */}
        <div id="left-sidebar" className="lg:col-span-3 space-y-8">
          <section id="system-status-panel" className="bg-[#151619] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-cyan-500">
              <Activity className="w-4 h-4" />
              <h2 className="text-xs font-mono uppercase tracking-widest">System Status</h2>
            </div>
            
            <div id="status-metrics" className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/40 uppercase font-mono">Core Load</span>
                <span className="text-xs font-mono">42%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  id="core-load-bar"
                  initial={{ width: 0 }}
                  animate={{ width: '42%' }}
                  className="h-full bg-cyan-500" 
                />
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/40 uppercase font-mono">Sync Rate</span>
                <span className="text-xs font-mono">98.2%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  id="sync-rate-bar"
                  initial={{ width: 0 }}
                  animate={{ width: '98.2%' }}
                  className="h-full bg-magenta-500" 
                  style={{ backgroundColor: '#ff00ff' }}
                />
              </div>
            </div>
          </section>

          <section id="instructions-panel" className="bg-[#151619] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/60 mb-6">
              <Terminal className="w-4 h-4" />
              <h2 className="text-xs font-mono uppercase tracking-widest">Instructions</h2>
            </div>
            <ul id="instructions-list" className="space-y-4 text-xs font-mono text-white/40">
              <li className="flex gap-3">
                <span className="text-cyan-500">01</span>
                Use arrow keys to navigate the neural grid.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500">02</span>
                Collect magenta nodes to increase sync score.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500">03</span>
                Avoid grid boundaries and self-collision.
              </li>
            </ul>
          </section>
        </div>

        {/* Center Column: Game */}
        <div id="game-container" className="lg:col-span-6 flex flex-col items-center">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Column: Music Player */}
        <div id="right-sidebar" className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8">
          <MusicPlayer />
          
          <div id="leaderboard-panel" className="w-full bg-[#151619] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-yellow-500 mb-6">
              <Trophy className="w-4 h-4" />
              <h2 className="text-xs font-mono uppercase tracking-widest">Leaderboard</h2>
            </div>
            <div id="leaderboard-entries" className="space-y-4">
              {[
                { name: 'CYBER_PUNK', score: '12,450' },
                { name: 'NEO_GHOST', score: '10,200' },
                { name: 'GRID_RUNNER', score: '8,900' }
              ].map((entry, i) => (
                <div key={i} id={`leaderboard-entry-${i}`} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                  <span className="text-[10px] font-mono text-white/40">0{i+1} {entry.name}</span>
                  <span className="text-xs font-mono text-white/80">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer id="app-footer" className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center pointer-events-none opacity-20">
        <div id="footer-left" className="font-mono text-[8px] uppercase tracking-[0.5em]">Neural Link Established // 2026</div>
        <div id="footer-right" className="font-mono text-[8px] uppercase tracking-[0.5em]">Packet Loss: 0.000%</div>
      </footer>
    </div>
  );
}
