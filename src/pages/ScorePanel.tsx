import { useState } from "react";
import { Trophy, Plus } from "lucide-react";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useBooths, useScores } from "@/hooks/useEventData";

const ScorePanel = () => {
  const booths = useBooths();
  const scores = useScores();

  const [student, setStudent] = useState("");
  const [booth, setBooth] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.trim() || !booth || !score) {
      toast.error("Please fill in all fields");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("scores").insert({
      student_name: student.trim(),
      booth_name: booth,
      score: parseInt(score, 10),
    });
    setBusy(false);
    if (error) {
      toast.error("Failed to save score");
      return;
    }
    toast.success(`Score added for ${student}`);
    setStudent("");
    setScore("");
  };

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-7 w-7 text-neon-blue" />
            <h1 className="text-3xl font-black tracking-tight">Score Panel</h1>
          </div>

          <form onSubmit={submit} className="neon-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label className="mb-2 block text-sm">Student name</Label>
              <Input
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                placeholder="e.g. Mark Doe"
                className="h-11"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">Booth</Label>
              <Select value={booth} onValueChange={setBooth}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select booth" />
                </SelectTrigger>
                <SelectContent>
                  {booths.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.icon} {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-sm">Score</Label>
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0"
                className="h-11"
              />
            </div>
            <div className="md:col-span-4">
              <Button
                type="submit"
                disabled={busy}
                size="lg"
                className="w-full h-12 font-bold bg-gradient-to-r from-neon-blue to-neon-purple text-primary-foreground hover:opacity-95 shadow-[var(--glow-blue)]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Submit Score
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Live leaderboard
            </h2>
            <div className="neon-card divide-y divide-border/60">
              {scores.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 text-center font-mono font-bold text-muted-foreground">#{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{s.student_name}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.booth_name}</div>
                  </div>
                  <div className="font-mono text-xl font-black neon-text-blue">{s.score}</div>
                </div>
              ))}
              {scores.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No scores yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScorePanel;
