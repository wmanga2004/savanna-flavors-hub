import { useCallback, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Check, ChevronRight, Lightbulb, RotateCcw, X } from "lucide-react";
import type { ChessPuzzle } from "@/lib/chess/puzzles";
import {
  applySan,
  createGameFromPuzzle,
  getPlayerColor,
  isExpectedMove,
} from "@/lib/chess/game";
import { markPuzzleSolved, resetStreakOnFailure } from "@/lib/chess/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PuzzleStatus = "playing" | "correct" | "wrong";

type TacticsPuzzleProps = {
  puzzle: ChessPuzzle;
  puzzleIndex: number;
  totalPuzzles: number;
  onNext: () => void;
  onProgressChange: () => void;
};

export function TacticsPuzzle({
  puzzle,
  puzzleIndex,
  totalPuzzles,
  onNext,
  onProgressChange,
}: TacticsPuzzleProps) {
  const [game, setGame] = useState(() => createGameFromPuzzle(puzzle));
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<PuzzleStatus>("playing");
  const [hintShown, setHintShown] = useState(false);
  const [attemptsOnPuzzle, setAttemptsOnPuzzle] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const orientation = getPlayerColor(puzzle);
  const isComplete = moveIndex >= puzzle.solution.length;

  useEffect(() => {
    setGame(createGameFromPuzzle(puzzle));
    setMoveIndex(0);
    setStatus("playing");
    setHintShown(false);
    setAttemptsOnPuzzle(0);
    setFeedback(null);
    setSelectedSquare(null);
  }, [puzzle.id]);

  const playOpponentReplies = useCallback(
    (currentGame: Chess, fromIndex: number): { game: Chess; index: number } => {
      let g = new Chess(currentGame.fen());
      let idx = fromIndex;

      while (idx < puzzle.solution.length) {
        const isPlayerTurn =
          (g.turn() === "w" && orientation === "white") ||
          (g.turn() === "b" && orientation === "black");

        if (isPlayerTurn) break;

        const reply = puzzle.solution[idx];
        if (!applySan(g, reply)) break;
        idx += 1;
      }

      return { game: g, index: idx };
    },
    [orientation, puzzle.solution],
  );

  const resetPuzzle = useCallback(() => {
    setGame(createGameFromPuzzle(puzzle));
    setMoveIndex(0);
    setStatus("playing");
    setFeedback(null);
    setSelectedSquare(null);
  }, [puzzle]);

  const tryMove = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      if (status === "correct") return false;

      const copy = new Chess(game.fen());
      let move;
      try {
        move = copy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
      } catch {
        return false;
      }

      if (!move) return false;

      const expected = puzzle.solution[moveIndex];
      if (!isExpectedMove(game, move.san, expected)) {
        setStatus("wrong");
        setAttemptsOnPuzzle((n) => n + 1);
        setFeedback(`Not quite — look for ${puzzle.theme.toLowerCase()} ideas.`);
        resetStreakOnFailure();
        onProgressChange();
        setSelectedSquare(null);
        return false;
      }

      const afterPlayer = new Chess(copy.fen());
      const nextIndex = moveIndex + 1;
      const { game: afterReplies, index: finalIndex } = playOpponentReplies(
        afterPlayer,
        nextIndex,
      );

      setGame(afterReplies);
      setMoveIndex(finalIndex);
      setSelectedSquare(null);

      if (finalIndex >= puzzle.solution.length) {
        setStatus("correct");
        setFeedback("Excellent — puzzle solved!");
        markPuzzleSolved(puzzle.id, {
          firstTry: attemptsOnPuzzle === 0,
          hintUsed: hintShown,
        });
        onProgressChange();
      } else {
        setFeedback(null);
      }

      return true;
    },
    [
      attemptsOnPuzzle,
      game,
      hintShown,
      moveIndex,
      onProgressChange,
      playOpponentReplies,
      puzzle,
      status,
    ],
  );

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      piece: { pieceType: string };
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      return tryMove(sourceSquare, targetSquare);
    },
    [tryMove],
  );

  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (status === "correct") return;

      if (!selectedSquare) {
        const piece = game.get(square as Parameters<Chess["get"]>[0]);
        if (!piece) return;
        const isPlayerPiece =
          (piece.color === "w" && orientation === "white") ||
          (piece.color === "b" && orientation === "black");
        if (isPlayerPiece) setSelectedSquare(square);
        return;
      }

      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      tryMove(selectedSquare, square);
    },
    [game, orientation, selectedSquare, status, tryMove],
  );

  const squareStyles = useMemo(() => {
    if (!selectedSquare) return {};
    return {
      [selectedSquare]: {
        backgroundColor: "rgba(184, 137, 47, 0.55)",
      },
    };
  }, [selectedSquare]);

  const difficultyColor = useMemo(() => {
    switch (puzzle.difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800";
      case "intermediate":
        return "bg-amber-100 text-amber-900";
      case "advanced":
        return "bg-rose-100 text-rose-900";
    }
  }, [puzzle.difficulty]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-[min(100%,480px)] rounded-lg shadow-lg ring-1 ring-border/60">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop,
              onSquareClick,
              boardOrientation: orientation,
              allowDragging: status !== "correct",
              squareStyles,
              boardStyle: {
                borderRadius: "0.5rem",
              },
              darkSquareStyle: { backgroundColor: "#769656" },
              lightSquareStyle: { backgroundColor: "#eeeed2" },
            }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {orientation === "white" ? "You play White" : "You play Black"} — click or drag
          to move
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("capitalize", difficultyColor)}>
              {puzzle.difficulty}
            </Badge>
            <Badge variant="secondary">{puzzle.theme}</Badge>
            <span className="text-xs text-muted-foreground">
              Puzzle {puzzleIndex + 1} of {totalPuzzles}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-medium text-foreground">
            {puzzle.description}
          </h2>
        </div>

        {feedback && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
              status === "correct"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : status === "wrong"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-border bg-muted/50",
            )}
          >
            {status === "correct" ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
            ) : status === "wrong" ? (
              <X className="mt-0.5 h-4 w-4 shrink-0" />
            ) : null}
            <span>{feedback}</span>
          </div>
        )}

        {hintShown && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{puzzle.hint}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!hintShown && status !== "correct" && (
            <Button variant="outline" size="sm" onClick={() => setHintShown(true)}>
              <Lightbulb className="mr-1.5 h-4 w-4" />
              Show hint
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={resetPuzzle}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
          {status === "correct" && (
            <Button size="sm" onClick={onNext}>
              Next puzzle
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>

        {status === "wrong" && (
          <Button size="sm" onClick={resetPuzzle}>
            Try again
          </Button>
        )}

        {!isComplete && status === "playing" && (
          <p className="text-xs text-muted-foreground">
            Move {Math.floor(moveIndex / 2) + 1} — select a piece, then click its destination.
          </p>
        )}
      </div>
    </div>
  );
}
