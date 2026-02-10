import { DifficultyLevel, GameConfig, FeedbackData, FeedbackType } from './types';

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, GameConfig> = {
  [DifficultyLevel.EASY]: {
    min: 1,
    max: 50,
    label: 'NOVICE',
    description: 'Range: 1 - 50. A gentle introduction.'
  },
  [DifficultyLevel.HARD]: {
    min: 1,
    max: 1000,
    label: 'EXPERT',
    description: 'Range: 1 - 1000. Test your skills.'
  },
  [DifficultyLevel.HORROR]: {
    min: 1,
    max: 10000,
    label: 'NIGHTMARE',
    description: 'Range: 1 - 10000. Pure psychological horror.'
  }
};

export const getFeedback = (guess: number, target: number, rangeMax: number): FeedbackData => {
  const diff = Math.abs(guess - target);
  
  if (diff === 0) {
    return { type: 'WIN', message: 'SYSTEM BREACHED - ACCESS GRANTED', color: 'text-neon-green', icon: 'Unlock' };
  }

  // Calculate percentage difference relative to total range
  const percentOff = (diff / rangeMax) * 100;

  if (percentOff <= 1) return { type: 'BURNING', message: 'CRITICAL PROXIMITY!', color: 'text-neon-red', icon: 'Flame' };
  if (percentOff <= 5) return { type: 'HOT', message: 'SIGNAL: VERY HOT', color: 'text-neon-pink', icon: 'Zap' };
  if (percentOff <= 10) return { type: 'WARM', message: 'SIGNAL: WARM', color: 'text-orange-400', icon: 'Activity' };
  if (percentOff <= 20) return { type: 'TEPID', message: 'SIGNAL: MODERATE', color: 'text-yellow-300', icon: 'Radio' };
  if (percentOff <= 40) return { type: 'COLD', message: 'SIGNAL: WEAK', color: 'text-cyan-300', icon: 'Wind' };
  return { type: 'FREEZING', message: 'NO SIGNAL DETECTED', color: 'text-blue-500', icon: 'Snowflake' };
};

export const calculateProximity = (guess: number, target: number, rangeMax: number): number => {
  const diff = Math.abs(guess - target);
  const rawProx = 100 - ((diff / rangeMax) * 100);
  return Math.max(0, Math.min(99.9, rawProx)); // Cap at 99.9 unless won
};