import React from 'react';
import { FeedbackData } from '../types';
import { Flame, Snowflake, Zap, Activity, Radio, Wind, Unlock, AlertTriangle } from 'lucide-react';

interface GameStatusProps {
  lastGuess?: number;
  proximity: number;
  feedback?: FeedbackData;
  isWon: boolean;
  targetRange: number;
}

const IconMap: Record<string, React.FC<any>> = {
  Flame, Snowflake, Zap, Activity, Radio, Wind, Unlock
};

export const GameStatus: React.FC<GameStatusProps> = ({ lastGuess, proximity, feedback, isWon, targetRange }) => {
  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50 p-6">
        <AlertTriangle className="w-12 h-12 text-slate-700 mb-2" />
        <p className="font-display text-slate-500 tracking-widest animate-pulse">AWAITING INPUT_</p>
      </div>
    );
  }

  const Icon = IconMap[feedback.icon] || Radio;

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 bg-slate-900/80 p-6 transition-all duration-500 ${isWon ? 'border-neon-green shadow-[0_0_50px_rgba(10,255,10,0.2)]' : 'border-slate-700'}`}>
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className={`p-4 rounded-full border-2 mb-4 transition-all duration-300 ${isWon ? 'bg-neon-green/20 border-neon-green animate-bounce' : `bg-slate-800 ${feedback.color.replace('text-', 'border-')}`}`}>
          <Icon className={`w-12 h-12 ${feedback.color} ${feedback.type === 'BURNING' ? 'animate-pulse-fast' : ''}`} />
        </div>
        
        <h2 className={`text-4xl md:text-5xl font-display font-black tracking-tighter mb-2 ${feedback.color} drop-shadow-lg`}>
          {isWon ? 'CORRECT' : feedback.message}
        </h2>
        
        <div className="text-xl font-body text-slate-400 mb-6">
          Input Analysis: <span className="text-white font-bold">{lastGuess}</span>
        </div>

        {/* Proximity Meter */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs font-display text-slate-500 uppercase">
            <span>Signal Strength (Proximity)</span>
            <span>{isWon ? '100' : proximity.toFixed(1)}%</span>
          </div>
          <div className="h-6 w-full bg-slate-950 rounded-sm border border-slate-700 relative overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-black
                ${feedback.type === 'BURNING' ? 'bg-gradient-to-r from-orange-500 to-neon-red' : ''}
                ${feedback.type === 'HOT' ? 'bg-gradient-to-r from-pink-500 to-neon-pink' : ''}
                ${feedback.type === 'WARM' ? 'bg-gradient-to-r from-yellow-600 to-orange-400' : ''}
                ${feedback.type === 'TEPID' ? 'bg-gradient-to-r from-yellow-800 to-yellow-600' : ''}
                ${feedback.type === 'COLD' ? 'bg-gradient-to-r from-cyan-900 to-cyan-600' : ''}
                ${feedback.type === 'FREEZING' ? 'bg-gradient-to-r from-blue-950 to-blue-800' : ''}
                ${isWon ? 'bg-neon-green' : ''}
              `}
              style={{ width: `${isWon ? 100 : proximity}%` }}
            >
              {proximity > 10 && <span className="opacity-50">///</span>}
            </div>
            {/* Grid lines on bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_20%,rgba(0,0,0,0.5)_20%)] bg-[size:10%_100%] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};