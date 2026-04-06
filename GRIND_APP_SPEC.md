# GRIND — DSA Revision App (Expo + React Native)

## Project Overview

A personal mobile app for revising DSA and System Design using a curated list of ~300 classic LeetCode-style problems. For each problem, Claude AI generates a full multi-approach breakdown (Brute → Better → Optimal) with C++ code and complexity analysis. Includes XP/leveling, bookmarks, and topic-wise browsing.

---

## Tech Stack

- **Framework**: Expo (SDK 51+), React Native
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage (`@react-native-async-storage/async-storage`)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`) via direct fetch
- **Code rendering**: `react-native-syntax-highlighter` or `react-native-highlight-words`
- **Icons**: `@expo/vector-icons` (MaterialCommunityIcons)
- **Fonts**: Expo Google Fonts — `useFonts` with `JetBrains Mono` (code) + `Inter` (UI)

---

## Project Structure

```
grind/
├── app/
│   ├── _layout.tsx               # Root layout, tab navigator
│   ├── index.tsx                 # Redirects to /topics
│   ├── topics/
│   │   ├── index.tsx             # Topic browser screen
│   │   └── [topicId].tsx         # Problems list for a topic
│   ├── problem/
│   │   └── [problemId].tsx       # Problem detail screen
│   └── bookmarks/
│       └── index.tsx             # Saved/bookmarked problems
├── components/
│   ├── ProblemCard.tsx
│   ├── ApproachCard.tsx
│   ├── ComplexityBadge.tsx
│   ├── XPBar.tsx
│   └── CodeBlock.tsx
├── data/
│   └── problems.ts               # Full curated problem list
├── lib/
│   ├── claude.ts                 # Claude API wrapper
│   ├── storage.ts                # AsyncStorage helpers
│   └── xp.ts                    # XP/level logic
├── constants/
│   └── colors.ts                 # Theme tokens
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Data Model

### `types/index.ts`

```ts
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
  name: string;           // e.g. "Brute Force", "Better (Sorting)", "Optimal (Hash Map)"
  intuition: string;      // 2-3 lines plain english
  code: string;           // full C++ code
  timeComplexity: string; // e.g. "O(n²)"
  spaceComplexity: string;
  tradeoffs: string;      // why this is worse/better than adjacent approach
};

export type ProblemSolution = {
  problemId: string;
  summary: string;        // 1-line problem restatement
  approaches: Approach[]; // always 3: brute, better, optimal
  bestApproach: string;   // name of the recommended approach
  keyInsight: string;     // the "aha" moment that unlocks optimal
  generatedAt: number;    // timestamp for cache
};

export type UserProgress = {
  xp: number;
  solvedIds: string[];
  bookmarkedIds: string[];
  topicProgress: Record<string, number>; // topicId → solved count
};
```

---

## Problem Dataset (`data/problems.ts`)

Hardcode exactly **300 problems** as a typed array of `Problem[]`. Organize by the following topics (topicId → display name):

| topicId | Display Name | Target Count |
|---|---|---|
| `arrays` | Arrays & Hashing | 25 |
| `two-pointers` | Two Pointers | 15 |
| `sliding-window` | Sliding Window | 15 |
| `stack` | Stack | 15 |
| `binary-search` | Binary Search | 15 |
| `linked-list` | Linked List | 15 |
| `trees` | Trees | 25 |
| `tries` | Tries | 8 |
| `heap` | Heap / Priority Queue | 12 |
| `backtracking` | Backtracking | 12 |
| `graphs` | Graphs | 20 |
| `advanced-graphs` | Advanced Graphs | 10 |
| `dp-1d` | 1D Dynamic Programming | 15 |
| `dp-2d` | 2D Dynamic Programming | 15 |
| `greedy` | Greedy | 15 |
| `intervals` | Intervals | 8 |
| `math-bits` | Math & Bit Manipulation | 10 |

Include the following classic problems (fill remaining slots with other well-known LC problems at similar difficulty levels):

**Must-include problems (lcNumber, title, topicId, difficulty)**:
- 1, Two Sum, arrays, Easy
- 49, Group Anagrams, arrays, Medium
- 128, Longest Consecutive Sequence, arrays, Medium
- 125, Valid Palindrome, two-pointers, Easy
- 15, 3Sum, two-pointers, Medium
- 11, Container With Most Water, two-pointers, Medium
- 121, Best Time to Buy and Sell Stock, sliding-window, Easy
- 3, Longest Substring Without Repeating Characters, sliding-window, Medium
- 76, Minimum Window Substring, sliding-window, Hard
- 20, Valid Parentheses, stack, Easy
- 155, Min Stack, stack, Medium
- 84, Largest Rectangle in Histogram, stack, Hard
- 704, Binary Search, binary-search, Easy
- 74, Search a 2D Matrix, binary-search, Medium
- 4, Median of Two Sorted Arrays, binary-search, Hard
- 206, Reverse Linked List, linked-list, Easy
- 143, Reorder List, linked-list, Medium
- 23, Merge K Sorted Lists, linked-list, Hard
- 226, Invert Binary Tree, trees, Easy
- 102, Binary Tree Level Order Traversal, trees, Medium
- 124, Binary Tree Maximum Path Sum, trees, Hard
- 208, Implement Trie, tries, Medium
- 23, Find Median from Data Stream, heap, Hard
- 39, Combination Sum, backtracking, Medium
- 51, N-Queens, backtracking, Hard
- 200, Number of Islands, graphs, Medium
- 133, Clone Graph, graphs, Medium
- 269, Alien Dictionary, advanced-graphs, Hard
- 70, Climbing Stairs, dp-1d, Easy
- 322, Coin Change, dp-1d, Medium
- 300, Longest Increasing Subsequence, dp-1d, Medium
- 1143, Longest Common Subsequence, dp-2d, Medium
- 312, Burst Balloons, dp-2d, Hard
- 55, Jump Game, greedy, Medium
- 45, Jump Game II, greedy, Medium
- 56, Merge Intervals, intervals, Medium
- 57, Insert Interval, intervals, Medium
- 191, Number of 1 Bits, math-bits, Easy
- 268, Missing Number, math-bits, Easy
- 287, Find the Duplicate Number, math-bits, Medium

---

## Claude API Integration (`lib/claude.ts`)

```ts
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

export async function generateSolution(problem: Problem): Promise<ProblemSolution> {
  const systemPrompt = `You are an elite competitive programming coach specializing in C++.
For any given problem, you produce exactly 3 approaches: Brute Force, a Better intermediate approach, and the Optimal solution.
All code is in C++ using #include <bits/stdc++.h> and using namespace std;
Be concise but technically precise. Target audience: competitive programmers preparing for FAANG.
Return ONLY valid JSON — no markdown fences, no extra text.`;

  const userPrompt = `Problem: LC #${problem.lcNumber} — ${problem.title}
Topic: ${problem.topicId}, Difficulty: ${problem.difficulty}

Return this exact JSON structure:
{
  "summary": "one-line restatement of what the problem actually asks",
  "keyInsight": "the single aha-moment or observation that unlocks the optimal solution",
  "bestApproach": "name of the optimal approach",
  "approaches": [
    {
      "name": "Brute Force",
      "intuition": "plain english, 2-3 sentences max",
      "code": "complete working C++ solution with main logic, comments on key lines",
      "timeComplexity": "O(...) with brief reason",
      "spaceComplexity": "O(...) with brief reason",
      "tradeoffs": "why this is suboptimal and what bottleneck exists"
    },
    {
      "name": "Better — <technique name>",
      "intuition": "...",
      "code": "...",
      "timeComplexity": "...",
      "spaceComplexity": "...",
      "tradeoffs": "improvement over brute, still not optimal because..."
    },
    {
      "name": "Optimal — <technique name>",
      "intuition": "...",
      "code": "...",
      "timeComplexity": "...",
      "spaceComplexity": "...",
      "tradeoffs": "why this is the best possible and any remaining space/time tradeoffs"
    }
  ]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

  return {
    problemId: problem.id,
    generatedAt: Date.now(),
    ...parsed
  };
}
```

**Cache strategy**: Before calling Claude, check AsyncStorage for `solution_${problem.id}`. If found and `generatedAt` is within 30 days, return cached. Otherwise call API and store result.

---

## Storage Helpers (`lib/storage.ts`)

```ts
// Keys
const PROGRESS_KEY = 'user_progress';
const SOLUTION_PREFIX = 'solution_';

// Load/save full UserProgress object
export async function loadProgress(): Promise<UserProgress>
export async function saveProgress(p: UserProgress): Promise<void>

// Solution cache
export async function getCachedSolution(problemId: string): Promise<ProblemSolution | null>
export async function cacheSolution(sol: ProblemSolution): Promise<void>
```

---

## XP Logic (`lib/xp.ts`)

```ts
export const XP_PER_SOLVE = {
  Easy: 20,
  Medium: 40,
  Hard: 70
};

export function levelFromXP(xp: number): number {
  return Math.floor(xp / 200) + 1;
}

export function xpInCurrentLevel(xp: number): number {
  return xp % 200;
}

export function xpToNextLevel(xp: number): number {
  return 200 - xpInCurrentLevel(xp);
}
```

---

## Screens

### 1. Topic Browser (`app/topics/index.tsx`)

- Header: "GRIND" title + XP bar component showing Level N, current XP progress bar
- Grid of topic cards (2 columns), each showing:
  - Topic name
  - `X / Y solved` count
  - Difficulty color distribution bar (green/yellow/red segments)
  - Tap → navigates to `topics/[topicId]`
- Bottom tab: Topics | Bookmarks

### 2. Problem List (`app/topics/[topicId].tsx`)

- Header: topic name + back button
- Filter row: All | Easy | Medium | Hard (pill toggles)
- FlatList of `ProblemCard` components
- `ProblemCard` shows:
  - LC number + title
  - Difficulty badge (color coded)
  - Solved checkmark (green) if in `solvedIds`
  - Bookmark icon (filled if bookmarked)
  - Tap → navigates to `problem/[problemId]`

### 3. Problem Detail (`app/problem/[problemId].tsx`)

This is the core screen. Layout:

```
┌─────────────────────────────────┐
│ ← Back    LC #1 · Two Sum       │
│           Easy  [Bookmark icon] │
├─────────────────────────────────┤
│ Key Insight                     │
│ "Using a hash map lets us check │
│  complement existence in O(1)." │
├─────────────────────────────────┤
│ [Brute] [Better] [Optimal] ← tabs│
├─────────────────────────────────┤
│ Intuition                       │
│ Check every pair...             │
│                                 │
│ Complexity                      │
│ Time: O(n²)  Space: O(1)       │
│                                 │
│ Tradeoffs                       │
│ Nested loop is the bottleneck.  │
│                                 │
│ Code                            │
│ ┌───────────────────────────┐  │
│ │ vector<int> twoSum(...) { │  │
│ │   for(int i=0;...){       │  │
│ └───────────────────────────┘  │
├─────────────────────────────────┤
│ [  Mark as Solved  (+40 XP)  ]  │
└─────────────────────────────────┘
```

- On first load: show skeleton loader while Claude generates solution
- If cached: load instantly
- Approach tabs: Brute → Better → Optimal (default: Optimal tab)
- Each tab shows: Intuition, Complexity (Time + Space as badges), Tradeoffs, then Code block
- "Mark as Solved" button at bottom — disabled + green checkmark if already solved
- On solve: trigger XP animation (+XP toast), update progress

### 4. Bookmarks (`app/bookmarks/index.tsx`)

- Same card list as problem list, filtered to `bookmarkedIds`
- Empty state: "No bookmarks yet. Star problems to save them here."

---

## Components

### `XPBar`
```
Level 4  ████████░░░░  160 / 200 XP
```
Props: `xp: number`. Derives level + progress internally.

### `ComplexityBadge`
Pill badge. Color logic:
- `O(1)`, `O(log n)` → green background
- `O(n)`, `O(n log n)` → yellow background
- `O(n²)` and worse → red background

### `CodeBlock`
Scrollable, horizontally scrollable code view using monospace font (JetBrains Mono). Syntax highlighted. Copy-to-clipboard button in top-right corner.

### `ApproachCard`
Contains the full approach view — intuition text, complexity badges, tradeoffs text, code block.

---

## Theme (`constants/colors.ts`)

Dark theme only (easier on eyes for code reading).

```ts
export const colors = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  border: '#2A2A2A',
  text: '#F0F0F0',
  textMuted: '#888888',
  textDim: '#555555',
  green: '#4ADE80',
  yellow: '#FACC15',
  red: '#F87171',
  blue: '#60A5FA',
  accent: '#A78BFA',   // purple — primary accent
  codeBg: '#141414',
};
```

---

## Environment Setup

Create `.env` at project root:
```
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

In `app.json` / `app.config.js`, ensure `extra.anthropicKey` is not needed since `EXPO_PUBLIC_` prefix exposes it to client automatically in Expo SDK 49+.

---

## `package.json` dependencies to install

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "^3.5.0",
    "expo-font": "~12.0.0",
    "@expo-google-fonts/jetbrains-mono": "^0.2.3",
    "@expo-google-fonts/inter": "^0.2.3",
    "@react-native-async-storage/async-storage": "^2.0.0",
    "@expo/vector-icons": "^14.0.0",
    "react-native-syntax-highlighter": "^2.1.0",
    "react-native-safe-area-context": "^4.10.0",
    "react-native-screens": "^3.31.0"
  }
}
```

---

## Build & Run

```bash
npx create-expo-app grind --template blank-typescript
cd grind
npx expo install @react-native-async-storage/async-storage expo-router @expo/vector-icons react-native-syntax-highlighter @expo-google-fonts/jetbrains-mono @expo-google-fonts/inter react-native-safe-area-context react-native-screens
# add your .env file with EXPO_PUBLIC_ANTHROPIC_API_KEY
npx expo start
```

---

## Notes for Claude Code

1. Implement all 300 problems in `data/problems.ts` — use the must-include list above and fill remaining slots with other well-known LC problems distributed across topics per the target counts table.
2. The Claude API call happens client-side. The API key is exposed via `EXPO_PUBLIC_` — this is intentional for personal use only (not a production/public app).
3. Solution cache in AsyncStorage means each problem only hits the API once per 30 days.
4. Always default to the **Optimal** tab when a problem detail screen loads.
5. The `CodeBlock` component must support horizontal scroll — C++ solutions can be wide.
6. XP and solved state must persist across app restarts via AsyncStorage.
7. Bookmark toggle must be instant (optimistic update) — no loading state needed.
8. Keep the entire UI dark theme — no light mode needed.
