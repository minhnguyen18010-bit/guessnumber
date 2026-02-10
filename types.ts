export enum DifficultyLevel {
  EASY = 'EASY',
  HARD = 'HARD',
  HORROR = 'HORROR'
}

export interface GameConfig {
  min: number;
  max: number;
  label: string;
  description: string;
}

export interface GuessRecord {
  value: number;
  proximity: number; // Percentage 0-100
  feedback: string;
  timestamp: number;
}

export type FeedbackType = 'BURNING' | 'HOT' | 'WARM' | 'TEPID' | 'COLD' | 'FREEZING' | 'WIN';

export interface FeedbackData {
  type: FeedbackType;
  message: string;
  color: string;
  icon: string; // lucide icon name reference
}