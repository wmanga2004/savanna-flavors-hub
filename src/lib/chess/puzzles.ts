export type PuzzleDifficulty = "beginner" | "intermediate" | "advanced";

export type ChessPuzzle = {
  id: string;
  fen: string;
  /** SAN moves: player move, opponent reply, player move, ... */
  solution: string[];
  hint: string;
  theme: string;
  difficulty: PuzzleDifficulty;
  description: string;
};

export const PUZZLES: ChessPuzzle[] = [
  {
    id: "scholar-pattern",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    solution: ["Qxf7#"],
    hint: "The f7 pawn is the only thing guarding Black's king.",
    theme: "Mate",
    difficulty: "beginner",
    description: "Punish an undefended f7 square.",
  },
  {
    id: "fork-knight",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Bxf7+", "Kxf7", "Ng5+"],
    hint: "Sacrifice on f7, then bring a knight into the attack.",
    theme: "Fork",
    difficulty: "beginner",
    description: "Open the king, then fork king and queen.",
  },
  {
    id: "back-rank",
    fen: "7k/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    hint: "The king has no escape squares on the back rank.",
    theme: "Back rank mate",
    difficulty: "beginner",
    description: "Deliver a classic back-rank checkmate.",
  },
  {
    id: "pin-win-piece",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 2 4",
    solution: ["Bxf7+", "Kxf7", "Ng5+"],
    hint: "Same idea as the fork puzzle — strike f7 first.",
    theme: "Discovery",
    difficulty: "intermediate",
    description: "Sacrifice, then win material with a knight fork.",
  },
  {
    id: "queen-trap",
    fen: "rnbqkb1r/pppp1ppp/5n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 3 3",
    solution: ["Qxf7#"],
    hint: "Black's king is exposed on f7 again.",
    theme: "Mate",
    difficulty: "beginner",
    description: "Spot the one-move mate.",
  },
  {
    id: "smothered-setup",
    fen: "6k1/5ppp/8/8/8/5N2/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    hint: "Use the rook to seal off the back rank.",
    theme: "Mate",
    difficulty: "beginner",
    description: "Mate with a rook on the eighth rank.",
  },
  {
    id: "discovered-attack",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Bxf7+", "Kxf7", "Ng5+"],
    hint: "Remove the defender, then attack two targets at once.",
    theme: "Fork",
    difficulty: "intermediate",
    description: "Classic bishop sacrifice on f7.",
  },
  {
    id: "corner-mate",
    fen: "6k1/5ppp/8/8/8/5Q2/5PPP/6K1 w - - 0 1",
    solution: ["Qa8#"],
    hint: "The king is trapped on the back rank — use a long diagonal.",
    theme: "Mate",
    difficulty: "intermediate",
    description: "Checkmate a cornered king in one move.",
  },
  {
    id: "rook-endgame",
    fen: "8/8/8/8/8/4k3/8/4K2R w - - 0 1",
    solution: ["Rh3+", "Kd4", "Rh4+"],
    hint: "Cut the enemy king off with lateral rook checks.",
    theme: "Endgame",
    difficulty: "intermediate",
    description: "Learn to restrict the king with rook checks.",
  },
  {
    id: "queen-fork",
    fen: "4k3/8/8/8/3n4/8/4Q3/4K3 w - - 0 1",
    solution: ["Qe4+", "Kd8", "Qxd4"],
    hint: "Give a check that attacks the knight at the same time.",
    theme: "Fork",
    difficulty: "beginner",
    description: "Win a knight with a queen fork.",
  },
  {
    id: "deflection",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["Re8#"],
    hint: "Nothing can stop the back-rank mate.",
    theme: "Mate",
    difficulty: "beginner",
    description: "Simple but essential mating pattern.",
  },
  {
    id: "advanced-sacrifice",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["Bxf7+", "Kxf7", "Ng5+"],
    hint: "Calculate the whole line before sacrificing.",
    theme: "Calculation",
    difficulty: "advanced",
    description: "Calculate a forcing line three moves deep.",
  },
];

export function getPuzzlesByDifficulty(difficulty: PuzzleDifficulty | "all"): ChessPuzzle[] {
  if (difficulty === "all") return PUZZLES;
  return PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getPuzzleById(id: string): ChessPuzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}
