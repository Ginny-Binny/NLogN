import { Difficulty } from '../types';

export const XP_PER_SOLVE: Record<Difficulty, number> = {
  Easy: 20,
  Medium: 40,
  Hard: 70,
};

export const XP_PER_LEVEL = 200;

export function levelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpInCurrentLevel(xp);
}

export function wouldLevelUp(currentXP: number, gainedXP: number): boolean {
  return levelFromXP(currentXP + gainedXP) > levelFromXP(currentXP);
}
