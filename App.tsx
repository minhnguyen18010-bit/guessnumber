import React, { useState, useEffect, useRef } from 'react';
import { DifficultyLevel, GuessRecord, FeedbackData } from './types';
import { DIFFICULTY_SETTINGS, getFeedback, calculateProximity } from './constants';
import { NeonButton } from './components/NeonButton';
import { GameStatus } from './components/GameStatus';
import { RefreshCw, Hash, List, Play, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guessInput, setGuessInput] = useState<string>('');
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<FeedbackData | undefined>(undefined);
  const [lastProximity, setLastProximity] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize game
  const startNewGame = (level: DifficultyLevel) => {
    const config = DIFFICULTY_SETTINGS[level];
    const newTarget = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    setDifficulty(level);
    setTargetNumber(newTarget);
    setHistory([]);
    setGameWon(false);
    setLastFeedback(undefined);
    setLastProximity(0);
    setGuessInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    startNewGame(DifficultyLevel.EASY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (gameWon) return;

    const val = parseInt(guessInput);
    const config = DIFFICULTY_SETTINGS[difficulty];

    if (isNaN(val) || val < config.min || val > config.max) {
      alert(`Please enter a valid number between ${config.min} and ${config.max}`);
      return;
    }

    if (history.some(h => h.value === val)) {
      alert("You've already guessed that number agent!");
      setGuessInput('');
      return;
    }

    const feedback = getFeedback(val, targetNumber, config.max);
    const proximity = calculateProximity(val, targetNumber, config.max);

    const newRecord: GuessRecord = {
      value: val,
      feedback: feedback.type,
      proximity: proximity,
      timestamp: Date.now()
    };

    setHistory([newRecord, ...history]);
    setLastFeedback(feedback);
    setLastProximity(proximity);
    setGuessInput('');

    if (val === targetNumber) {
      setGameWon(true);
    }
  };

  const currentConfig = DIFFICULTY_SETTINGS[difficulty];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-body selection:bg-neon-blue selection:text-black flex flex-col items-center py-8 px-4">
      
      {/* Header */}
      <header className="mb-8 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-neon-blue/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-display font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          NEON<span className="text-neon-blue">GUESS</span>
        </h1>
        <p className="text-neon-pink font-display tracking-[0.5em] text-sm md:text-base mt-2 uppercase opacity-80">
          Cyber-Security Protocol: Active
        </p>
      </header>

      {/* Main Game Interface */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Controls & Input */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Difficulty Select */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-800 backdrop-blur-sm">
            {Object.values(DifficultyLevel).map((level) => (
              <button
                key={level}
                onClick={() => startNewGame(level)}
                className={`py-2 text-xs md:text-sm font-display font-bold uppercase transition-all duration-300 rounded ${
                  difficulty === level 
                    ? level === 'HORROR' 
                      ? 'bg-neon-red text-black shadow-[0_0_15px_rgba(255,0,60,0.5)]'
                      : 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                }`}
              >
                {DIFFICULTY_SETTINGS[level].label}
              </button>
            ))}
          </div>

          <div className="text-center font-display text-slate-500 text-sm tracking-widest border-b border-slate-800 pb-2">
            MISSION: LOCATE TARGET IN RANGE <span className="text-white">[{currentConfig.min} - {currentConfig.max}]</span>
          </div>

          {/* Game Status Display */}
          <GameStatus 
            lastGuess={history[0]?.value}
            proximity={lastProximity}
            feedback={lastFeedback}
            isWon={gameWon}
            targetRange={currentConfig.max}
          />

          {/* Input Area */}
          <form onSubmit={handleGuess} className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${gameWon ? 'hidden' : ''}`}></div>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
                <input
                  ref={inputRef}
                  type="number"
                  disabled={gameWon}
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg py-4 pl-12 pr-4 text-3xl font-display font-bold text-white placeholder-slate-700 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="000"
                  autoFocus
                />
              </div>
              <NeonButton 
                type="submit" 
                disabled={!guessInput || gameWon} 
                className="w-32 flex items-center justify-center"
              >
                {gameWon ? <Trophy className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </NeonButton>
            </div>
          </form>

          {gameWon && (
             <div className="animate-pulse">
               <NeonButton 
                variant="secondary" 
                onClick={() => startNewGame(difficulty)}
                className="w-full flex items-center justify-center gap-2"
               >
                 <RefreshCw className="w-5 h-5" /> REBOOT SYSTEM
               </NeonButton>
             </div>
          )}
        </div>

        {/* Right Col: Stats & History */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Stats Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
               <h3 className="flex items-center gap-2 text-neon-blue font-display font-bold">
                 <List className="w-5 h-5" /> DATA LOG
               </h3>
               <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                 ATTEMPTS: <span className="text-white font-mono text-lg">{history.length}</span>
               </span>
            </div>

            {/* Scrollable List */}
            <div className="h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <Hash className="w-12 h-12 mb-2" />
                  <p>NO DATA ENTRIES FOUND</p>
                </div>
              ) : (
                history.map((record, idx) => (
                  <div 
                    key={record.timestamp}
                    className="group flex items-center justify-between p-3 bg-slate-800/50 border-l-2 border-slate-700 hover:bg-slate-800 hover:border-neon-purple transition-all rounded-r-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 text-sm">#{history.length - idx}</span>
                      <span className="text-xl font-bold font-display text-white">{record.value}</span>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xs font-bold uppercase tracking-wider
                        ${record.feedback === 'BURNING' ? 'text-neon-red' : ''}
                        ${record.feedback === 'HOT' ? 'text-neon-pink' : ''}
                        ${record.feedback === 'WARM' ? 'text-orange-400' : ''}
                        ${record.feedback === 'TEPID' ? 'text-yellow-500' : ''}
                        ${record.feedback === 'COLD' ? 'text-cyan-400' : ''}
                        ${record.feedback === 'FREEZING' ? 'text-blue-500' : ''}
                        ${record.feedback === 'WIN' ? 'text-neon-green' : ''}
                      `}>
                        {record.feedback}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        PROXIMITY: {record.proximity.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800 text-xs text-slate-500 font-mono">
            <p>> SYSTEM READY.</p>
            <p>> WAITING FOR USER INPUT...</p>
            {history.length > 0 && <p className="text-neon-blue">> PROCESSING LAST ENTRY...</p>}
            {gameWon && <p className="text-neon-green">> TARGET ACQUIRED. SEQUENCE COMPLETE.</p>}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;