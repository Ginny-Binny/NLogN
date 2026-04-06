import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, ProblemSolution } from '../types';

const PROGRESS_KEY = 'user_progress';
const SOLUTION_PREFIX = 'solution_';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  solvedIds: [],
  bookmarkedIds: [],
  topicProgress: {},
};

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw) as UserProgress;
    }
    return { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export async function getCachedSolution(
  problemId: string
): Promise<ProblemSolution | null> {
  try {
    const raw = await AsyncStorage.getItem(SOLUTION_PREFIX + problemId);
    if (!raw) return null;

    const solution = JSON.parse(raw) as ProblemSolution;
    const age = Date.now() - solution.generatedAt;
    if (age > CACHE_DURATION) return null;

    return solution;
  } catch {
    return null;
  }
}

export async function cacheSolution(solution: ProblemSolution): Promise<void> {
  await AsyncStorage.setItem(
    SOLUTION_PREFIX + solution.problemId,
    JSON.stringify(solution)
  );
}
