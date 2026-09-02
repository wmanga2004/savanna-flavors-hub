import { createFileRoute } from "@tanstack/react-router";
import { ChessTrainer } from "@/components/chess/ChessTrainer";

export const Route = createFileRoute("/chess")({
  head: () => ({
    meta: [
      { title: "Chess Trainer | Tactics & Lessons" },
      {
        name: "description",
        content:
          "Improve at chess with daily tactics puzzles, opening lessons, and a structured training plan.",
      },
    ],
  }),
  component: ChessPage,
});

function ChessPage() {
  return <ChessTrainer />;
}
