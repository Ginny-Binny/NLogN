import { TopicMeta } from '../types';

export const TOPICS: TopicMeta[] = [
  { id: 'arrays', displayName: 'Arrays & Hashing', icon: 'code-array', accentColor: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'], targetCount: 25 },
  { id: 'two-pointers', displayName: 'Two Pointers', icon: 'arrow-expand-horizontal', accentColor: '#60A5FA', gradient: ['#60A5FA', '#3B82F6'], targetCount: 15 },
  { id: 'sliding-window', displayName: 'Sliding Window', icon: 'dock-window', accentColor: '#34D399', gradient: ['#34D399', '#059669'], targetCount: 15 },
  { id: 'stack', displayName: 'Stack', icon: 'layers-triple', accentColor: '#FB923C', gradient: ['#FB923C', '#EA580C'], targetCount: 15 },
  { id: 'binary-search', displayName: 'Binary Search', icon: 'magnify', accentColor: '#F472B6', gradient: ['#F472B6', '#DB2777'], targetCount: 15 },
  { id: 'linked-list', displayName: 'Linked List', icon: 'link-variant', accentColor: '#38BDF8', gradient: ['#38BDF8', '#0284C7'], targetCount: 15 },
  { id: 'trees', displayName: 'Trees', icon: 'file-tree', accentColor: '#4ADE80', gradient: ['#4ADE80', '#16A34A'], targetCount: 25 },
  { id: 'tries', displayName: 'Tries', icon: 'alphabetical-variant', accentColor: '#E879F9', gradient: ['#E879F9', '#C026D3'], targetCount: 8 },
  { id: 'heap', displayName: 'Heap / Priority Queue', icon: 'triangle', accentColor: '#FB7185', gradient: ['#FB7185', '#E11D48'], targetCount: 12 },
  { id: 'backtracking', displayName: 'Backtracking', icon: 'undo-variant', accentColor: '#FBBF24', gradient: ['#FBBF24', '#D97706'], targetCount: 12 },
  { id: 'graphs', displayName: 'Graphs', icon: 'graph-outline', accentColor: '#2DD4BF', gradient: ['#2DD4BF', '#0D9488'], targetCount: 20 },
  { id: 'advanced-graphs', displayName: 'Advanced Graphs', icon: 'graph', accentColor: '#818CF8', gradient: ['#818CF8', '#6366F1'], targetCount: 10 },
  { id: 'dp-1d', displayName: '1D Dynamic Programming', icon: 'chart-line', accentColor: '#F97316', gradient: ['#F97316', '#C2410C'], targetCount: 15 },
  { id: 'dp-2d', displayName: '2D Dynamic Programming', icon: 'grid', accentColor: '#A3E635', gradient: ['#A3E635', '#65A30D'], targetCount: 15 },
  { id: 'greedy', displayName: 'Greedy', icon: 'lightning-bolt', accentColor: '#FACC15', gradient: ['#FACC15', '#CA8A04'], targetCount: 15 },
  { id: 'intervals', displayName: 'Intervals', icon: 'arrow-expand', accentColor: '#67E8F9', gradient: ['#67E8F9', '#06B6D4'], targetCount: 8 },
  { id: 'math-bits', displayName: 'Math & Bit Manipulation', icon: 'math-integral', accentColor: '#C084FC', gradient: ['#C084FC', '#9333EA'], targetCount: 10 },
];

export const getTopicById = (id: string): TopicMeta | undefined =>
  TOPICS.find((t) => t.id === id);
