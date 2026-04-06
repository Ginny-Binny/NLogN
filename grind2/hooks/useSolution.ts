import { useState, useEffect, useCallback } from 'react';
import { Problem, ProblemSolution } from '../types';
import { getSolution } from '../lib/claude';

type UseSolutionResult = {
  solution: ProblemSolution | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useSolution(problem: Problem | undefined): UseSolutionResult {
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSolution = useCallback(async () => {
    if (!problem) return;
    setLoading(true);
    setError(null);
    try {
      const sol = await getSolution(problem);
      setSolution(sol);
    } catch (e: any) {
      setError(e.message || 'Failed to generate solution');
    } finally {
      setLoading(false);
    }
  }, [problem?.id, retryCount]);

  useEffect(() => {
    fetchSolution();
  }, [fetchSolution]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { solution, loading, error, retry };
}
