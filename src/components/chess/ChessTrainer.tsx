import { useMemo, useState } from "react";
import { BookOpen, Brain, Target, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TacticsPuzzle } from "@/components/chess/TacticsPuzzle";
import { LESSONS, TRAINING_TIPS } from "@/lib/chess/lessons";
import { PUZZLES, getPuzzlesByDifficulty, type PuzzleDifficulty } from "@/lib/chess/puzzles";
import { loadProgress } from "@/lib/chess/progress";
import { cn } from "@/lib/utils";

const DIFFICULTIES: Array<PuzzleDifficulty | "all"> = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

export function ChessTrainer() {
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty | "all">("all");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [progressTick, setProgressTick] = useState(0);

  const filteredPuzzles = useMemo(
    () => getPuzzlesByDifficulty(difficulty),
    [difficulty],
  );

  const currentPuzzle = filteredPuzzles[puzzleIndex % filteredPuzzles.length];

  const progress = useMemo(() => loadProgress(), [progressTick]);
  const solvePercent = Math.round((progress.solvedPuzzleIds.length / PUZZLES.length) * 100);

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as PuzzleDifficulty | "all");
    setPuzzleIndex(0);
  };

  const handleNextPuzzle = () => {
    setPuzzleIndex((i) => (i + 1) % filteredPuzzles.length);
  };

  return (
    <div className="min-h-screen bg-[#1a1510] text-[#f5f0e6]">
      <div className="border-b border-[#3d3428] bg-[#211a10]/90">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:px-6 md:py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#b8892f] text-[#211a10]">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8892f]">
                Chess Academy
              </p>
              <h1 className="font-display text-3xl font-medium md:text-4xl">
                Train smarter, play stronger
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-[#c9bfb0]">
            Daily tactics and core principles — the fastest path to a higher rating. Solve
            puzzles, study patterns, and build habits that stick.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={Target}
              label="Puzzles solved"
              value={`${progress.solvedPuzzleIds.length} / ${PUZZLES.length}`}
            />
            <StatCard icon={Trophy} label="Current streak" value={String(progress.currentStreak)} />
            <StatCard
              icon={BookOpen}
              label="First-try accuracy"
              value={
                progress.attempts > 0
                  ? `${Math.round((progress.correctFirstTry / progress.attempts) * 100)}%`
                  : "—"
              }
            />
          </div>
          <div className="max-w-md">
            <div className="mb-1 flex justify-between text-xs text-[#c9bfb0]">
              <span>Course progress</span>
              <span>{solvePercent}%</span>
            </div>
            <Progress value={solvePercent} className="h-2 bg-[#3d3428]" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:px-6">
        <Tabs defaultValue="puzzles" className="gap-8">
          <TabsList className="bg-[#2a2218] text-[#c9bfb0]">
            <TabsTrigger
              value="puzzles"
              className="data-[state=active]:bg-[#b8892f] data-[state=active]:text-[#211a10]"
            >
              Tactics puzzles
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              className="data-[state=active]:bg-[#b8892f] data-[state=active]:text-[#211a10]"
            >
              Lessons
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              className="data-[state=active]:bg-[#b8892f] data-[state=active]:text-[#211a10]"
            >
              Training plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="puzzles" className="mt-0">
            <div className="rounded-xl border border-[#3d3428] bg-[#f7f1e3] p-6 text-foreground md:p-8">
              <div className="mb-6 flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDifficultyChange(d)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                      difficulty === d
                        ? "bg-espresso text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {currentPuzzle && (
                <TacticsPuzzle
                  key={`${currentPuzzle.id}-${puzzleIndex}`}
                  puzzle={currentPuzzle}
                  puzzleIndex={puzzleIndex}
                  totalPuzzles={filteredPuzzles.length}
                  onNext={handleNextPuzzle}
                  onProgressChange={() => setProgressTick((n) => n + 1)}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {LESSONS.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="border-[#3d3428] bg-[#f7f1e3] text-foreground"
                >
                  <CardHeader>
                    <CardDescription className="capitalize text-gold-deep">
                      {lesson.category}
                    </CardDescription>
                    <CardTitle className="font-display text-xl">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                    <ul className="space-y-2 text-sm">
                      {lesson.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-gold-deep">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    {lesson.example && (
                      <p className="rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">
                        {lesson.example}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plan" className="mt-0">
            <Card className="border-[#3d3428] bg-[#f7f1e3] text-foreground">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Your improvement routine</CardTitle>
                <CardDescription>
                  Consistency beats cramming. Follow this simple daily plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ol className="space-y-4">
                  <PlanStep
                    step={1}
                    title="Warm up with tactics (10 min)"
                    detail="Solve 5–10 puzzles on this page before playing a game."
                  />
                  <PlanStep
                    step={2}
                    title="Study one lesson (5 min)"
                    detail="Read one card from the Lessons tab and look for it in your next game."
                  />
                  <PlanStep
                    step={3}
                    title="Play one thoughtful game (15–30 min)"
                    detail="Use at least 10+ minutes per side. Apply the blunder-check habit before every move."
                  />
                  <PlanStep
                    step={4}
                    title="Review losses (10 min)"
                    detail="Find one mistake per game. Ask: what was the last safe move I could have played?"
                  />
                </ol>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-deep">
                    Pro tips
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {TRAINING_TIPS.map((tip) => (
                      <li key={tip} className="flex gap-2">
                        <span className="text-gold-deep">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#3d3428] bg-[#2a2218] px-4 py-3">
      <div className="flex items-center gap-2 text-[#b8892f]">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-medium">{value}</p>
    </div>
  );
}

function PlanStep({
  step,
  title,
  detail,
}: {
  step: number;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b8892f] font-display text-sm font-semibold text-[#211a10]">
        {step}
      </span>
      <div>
        <p className="font-medium text-[#f5f0e6]">{title}</p>
        <p className="mt-1 text-sm text-[#c9bfb0]">{detail}</p>
      </div>
    </li>
  );
}
