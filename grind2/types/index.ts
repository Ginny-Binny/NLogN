export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Problem = {
  id: string;
  lcNumber: number;
  title: string;
  topicId: string;
  difficulty: Difficulty;
  tags: string[];
};

export type Approach = {
  name: string;
  intuition: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  tradeoffs: string;
};

export type ProblemSolution = {
  problemId: string;
  summary: string;
  description?: string;
  approaches: Approach[];
  bestApproach: string;
  keyInsight: string;
  generatedAt: number;
};

export type UserProgress = {
  xp: number;
  solvedIds: string[];
  bookmarkedIds: string[];
  topicProgress: Record<string, number>;
};

export type TopicMeta = {
  id: string;
  displayName: string;
  icon: string;
  accentColor: string;
  gradient: [string, string];
  targetCount: number;
};
