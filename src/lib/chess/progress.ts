const STORAGE_KEY = "chess-trainer-progress";

export type ChessProgress = {
  solvedPuzzleIds: string[];
  hintsUsed: number;
  attempts: number;
  correctFirstTry: number;
  lastPlayedAt: string | null;
  currentStreak: number;
};

const defaultProgress = (): ChessProgress => ({
  solvedPuzzleIds: [],
  hintsUsed: 0,
  attempts: 0,
  correctFirstTry: 0,
  lastPlayedAt: null,
  currentStreak: 0,
});

export function loadProgress(): ChessProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: ChessProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markPuzzleSolved(
  puzzleId: string,
  opts: { firstTry: boolean; hintUsed: boolean },
): ChessProgress {
  const progress = loadProgress();
  const alreadySolved = progress.solvedPuzzleIds.includes(puzzleId);

  if (!alreadySolved) {
    progress.solvedPuzzleIds.push(puzzleId);
    progress.currentStreak += 1;
  }

  progress.attempts += 1;
  if (opts.firstTry && !opts.hintUsed) {
    progress.correctFirstTry += 1;
  }
  if (opts.hintUsed) {
    progress.hintsUsed += 1;
  }
  progress.lastPlayedAt = new Date().toISOString();

  saveProgress(progress);
  return progress;
}

export function resetStreakOnFailure(): ChessProgress {
  const progress = loadProgress();
  progress.currentStreak = 0;
  saveProgress(progress);
  return progress;
}
