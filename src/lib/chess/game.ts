import { Chess } from "chess.js";
import type { ChessPuzzle } from "./puzzles";

export function createGameFromPuzzle(puzzle: ChessPuzzle): Chess {
  return new Chess(puzzle.fen);
}

export function getPlayerColor(puzzle: ChessPuzzle): "white" | "black" {
  const game = createGameFromPuzzle(puzzle);
  return game.turn() === "w" ? "white" : "black";
}

export function normalizeSan(game: Chess, san: string): string | null {
  try {
    const copy = new Chess(game.fen());
    const move = copy.move(san);
    return move?.san ?? null;
  } catch {
    return null;
  }
}

export function isExpectedMove(game: Chess, san: string, expectedSan: string): boolean {
  const played = normalizeSan(game, san);
  const expected = normalizeSan(game, expectedSan);
  return played !== null && expected !== null && played === expected;
}

export function applySan(game: Chess, san: string): boolean {
  try {
    game.move(san);
    return true;
  } catch {
    return false;
  }
}

export function getLegalSans(game: Chess): string[] {
  return game.moves();
}
