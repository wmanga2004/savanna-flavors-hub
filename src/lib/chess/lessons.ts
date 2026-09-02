export type ChessLesson = {
  id: string;
  title: string;
  category: "opening" | "middlegame" | "endgame" | "mindset";
  summary: string;
  points: string[];
  example?: string;
};

export const LESSONS: ChessLesson[] = [
  {
    id: "opening-center",
    title: "Control the Center",
    category: "opening",
    summary: "Pieces in the center reach more squares and support attacks on both flanks.",
    points: [
      "Open with e4 or d4 (or c4/Nf3) to fight for central squares.",
      "Don't move the same piece twice in the opening unless you gain something concrete.",
      "Develop knights before bishops when possible — knights have fewer good squares.",
      "Castle early so your king isn't stuck in the center.",
    ],
    example: "1.e4 e5 2.Nf3 Nc6 3.Bc4 — classic development with central pressure.",
  },
  {
    id: "opening-tempo",
    title: "Don't Waste Tempo",
    category: "opening",
    summary: "Every move in the opening should develop a piece, control space, or prepare castling.",
    points: [
      "Avoid moving pawns that don't help development (like h3 or a3 without reason).",
      "Don't bring your queen out too early — opponents will chase it and gain tempo.",
      "Connect your rooks by finishing development before launching attacks.",
    ],
  },
  {
    id: "tactics-forks",
    title: "Forks & Double Attacks",
    category: "middlegame",
    summary: "One move that attacks two targets at once often wins material.",
    points: [
      "Knights are fork masters — look for checks that also hit a rook or queen.",
      "Pawn forks on d5/e5/f5 can be surprisingly powerful.",
      "Before every move, ask: does this create a fork? Does it allow one?",
    ],
    example: "Ng5+ forking king and queen after a bishop sacrifice on f7.",
  },
  {
    id: "tactics-pins",
    title: "Pins & Skewers",
    category: "middlegame",
    summary: "Line pieces (bishop, rook, queen) can paralyze enemy pieces.",
    points: [
      "A pin: a piece can't move without exposing a more valuable piece behind it.",
      "A skewer is the reverse — attack the valuable piece first, win what's behind it.",
      "Absolute pins to the king are the strongest — the pinned piece is completely stuck.",
    ],
  },
  {
    id: "calculation",
    title: "Calculate Forcing Moves First",
    category: "middlegame",
    summary: "Checks, captures, and threats narrow the opponent's options and make calculation easier.",
    points: [
      "When you see a tactic, play the line in your head: move, reply, move, reply.",
      "If a line doesn't work, look for a different forcing move — don't give up after one try.",
      "Solve puzzles daily — 10–15 minutes of tactics is the fastest way to improve.",
    ],
  },
  {
    id: "endgame-king",
    title: "Activate Your King in the Endgame",
    category: "endgame",
    summary: "When most pieces are traded, the king becomes a fighting piece.",
    points: [
      "Centralize your king in pawn endgames — it supports pawn advances and blocks the enemy.",
      "In rook endgames, cut off the enemy king with your rook.",
      "Passed pawns must be pushed — they often decide the game.",
    ],
  },
  {
    id: "endgame-rook",
    title: "Rook Behind Passed Pawns",
    category: "endgame",
    summary: "A classic rule that wins countless rook endgames.",
    points: [
      "Place your rook behind your passed pawn to support its advance.",
      "Place your rook behind the enemy passed pawn to harass it.",
      "Keep your rook active — passive rooks lose endgames.",
    ],
  },
  {
    id: "mindset-blunder",
    title: "Blunder Check Before You Move",
    category: "mindset",
    summary: "Most rating points are lost to one-move oversights, not deep strategy.",
    points: [
      "Before clicking or releasing a piece, ask: what is my opponent's best reply?",
      "Look for checks, captures, and threats against your king and hanging pieces.",
      "If you're winning, trade pieces — if you're losing, complicate.",
      "Play longer time controls while learning — blitz hides bad habits.",
    ],
  },
];

export const TRAINING_TIPS = [
  "Solve 5–10 tactics puzzles every day before playing.",
  "Review your losses — one analyzed game teaches more than five quick wins.",
  "Learn 1–2 openings for White and 1–2 replies as Black; depth beats breadth early on.",
  "Practice endgames: king + pawn vs king, rook endgames, and basic mates.",
  "Play with at least 10 minutes per side while you're building fundamentals.",
];
