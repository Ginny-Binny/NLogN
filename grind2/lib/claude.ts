import { Problem, ProblemSolution } from '../types';
import { SOLUTIONS } from '../data/solutions';

export async function getSolution(
  problem: Problem
): Promise<ProblemSolution> {
  // All solutions are pre-generated and bundled in the app
  const solution = SOLUTIONS[problem.id];
  if (solution) {
    return solution;
  }

  // Fallback for any missing solutions
  return {
    problemId: problem.id,
    summary: `Solve LC #${problem.lcNumber} — ${problem.title}`,
    keyInsight: 'Solution coming soon!',
    bestApproach: 'Optimal',
    generatedAt: Date.now(),
    approaches: [
      {
        name: 'Brute Force',
        intuition: 'Try all possibilities.',
        code: '// Solution coming soon',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        tradeoffs: 'Simple but slow.',
      },
      {
        name: 'Better',
        intuition: 'Optimize with a data structure.',
        code: '// Solution coming soon',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        tradeoffs: 'Better but not optimal.',
      },
      {
        name: 'Optimal',
        intuition: 'Use the key insight.',
        code: '// Solution coming soon',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        tradeoffs: 'Best possible approach.',
      },
    ],
  };
}
