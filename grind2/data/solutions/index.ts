import { ProblemSolution } from '../../types';
import { BATCH1_SOLUTIONS } from './batch1';
import { BATCH2_SOLUTIONS } from './batch2';
import { BATCH3_SOLUTIONS } from './batch3';
import { BATCH4_SOLUTIONS } from './batch4';

export const SOLUTIONS: Record<string, ProblemSolution> = {
  ...BATCH1_SOLUTIONS,
  ...BATCH2_SOLUTIONS,
  ...BATCH3_SOLUTIONS,
  ...BATCH4_SOLUTIONS,
};
