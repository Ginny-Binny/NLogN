import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UserProgress, Difficulty } from '../types';
import { loadProgress, saveProgress } from '../lib/storage';
import { XP_PER_SOLVE, wouldLevelUp, levelFromXP } from '../lib/xp';

type SolveResult = { xpGained: number; leveledUp: boolean };

type ProgressContextType = {
  progress: UserProgress;
  loading: boolean;
  toggleBookmark: (problemId: string) => void;
  markSolved: (problemId: string, difficulty: Difficulty) => SolveResult;
  isSolved: (problemId: string) => boolean;
  isBookmarked: (problemId: string) => boolean;
  levelUpShown: boolean;
  setLevelUpShown: (v: boolean) => void;
  newLevel: number;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    solvedIds: [],
    bookmarkedIds: [],
    topicProgress: {},
  });
  const [loading, setLoading] = useState(true);
  const [levelUpShown, setLevelUpShown] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
  }, []);

  const persistProgress = useCallback((p: UserProgress) => {
    if (saveTimeout.current !== null) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveProgress(p), 500);
  }, []);

  const toggleBookmark = useCallback(
    (problemId: string) => {
      setProgress((prev) => {
        const isBookmarked = prev.bookmarkedIds.includes(problemId);
        const next = {
          ...prev,
          bookmarkedIds: isBookmarked
            ? prev.bookmarkedIds.filter((id) => id !== problemId)
            : [...prev.bookmarkedIds, problemId],
        };
        persistProgress(next);
        return next;
      });
    },
    [persistProgress]
  );

  const markSolved = useCallback(
    (problemId: string, difficulty: Difficulty): SolveResult => {
      const xpGained = XP_PER_SOLVE[difficulty];
      const leveledUp = wouldLevelUp(progress.xp, xpGained);

      setProgress((prev) => {
        if (prev.solvedIds.includes(problemId)) {
          return prev;
        }
        const topicId = problemId.split('-').slice(0, -1).join('-');
        const next: UserProgress = {
          ...prev,
          xp: prev.xp + xpGained,
          solvedIds: [...prev.solvedIds, problemId],
          topicProgress: {
            ...prev.topicProgress,
            [topicId]: (prev.topicProgress[topicId] || 0) + 1,
          },
        };
        persistProgress(next);
        return next;
      });

      if (leveledUp) {
        setNewLevel(levelFromXP(progress.xp + xpGained));
        setTimeout(() => setLevelUpShown(true), 1000);
      }

      return { xpGained, leveledUp };
    },
    [progress.xp, persistProgress]
  );

  const isSolved = useCallback(
    (problemId: string) => progress.solvedIds.includes(problemId),
    [progress.solvedIds]
  );

  const isBookmarked = useCallback(
    (problemId: string) => progress.bookmarkedIds.includes(problemId),
    [progress.bookmarkedIds]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        toggleBookmark,
        markSolved,
        isSolved,
        isBookmarked,
        levelUpShown,
        setLevelUpShown,
        newLevel,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
