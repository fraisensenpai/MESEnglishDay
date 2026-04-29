import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy, MapPin, Flame, ChefHat, Bell, Sparkles } from "lucide-react";
import { useBooths, useOrders, useScores } from "@/hooks/useEventData";

const formatClock = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const Dashboard = () => {
  const booths = useBooths();
  const scores = useScores();
  const orders = useOrders();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  // Sound when a new ready order appears
  const prevReadyIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    const currentIds = new Set(ready.map((r) => r.id));
    const newOnes = [...currentIds].filter((id) => !prevReadyIds.current.has(id));
    if (newOnes.length > 0 && prevReadyIds.current.size > 0) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(880, ctx.currentTime);
        o.frequency.setValueAtTime(1320, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        o.start();
        o.stop(ctx.currentTime + 0.6);
      } catch {}
    }
    prevReadyIds.current = currentIds;
  }, [ready]);

  const topScores = useMemo(() => scores.slice(0, 12), [scores]);

  return (
    <div className="min-h-screen px-6 py-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink text-3xl font-black shadow-[var(--glow-purple)]">
            🇬🇧
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                MES ENGLISH DAY
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">May 5–6 · High School Campus · Live Event Dashboard</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl md:text-4xl font-bold neon-text-blue tabular-nums">
            {formatClock(now)}
          </div>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Live · Real-time</div>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-7rem)]">
        {/* LEFT — Top Scorers */}
        <section className="neon-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-neon-blue" />
              <h2 className="text-lg font-bold tracking-wide neon-text-blue">TOP SCORERS</h2>
            </div>
            <span className="text-xs text-muted-foreground">{scores.length} students</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2">
            {topScores.length === 0 && (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                No scores yet — they will appear live.
              </div>
            )}
            {topScores.map((s, i) => {
              const rank = i + 1;
              const podium = rank <= 3;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 animate-slide-in-up ${
                    podium ? "neon-border-blue bg-neon-blue/5" : "border-border/60 bg-secondary/40"
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg font-black ${
                      rank === 1
                        ? "bg-gradient-to-br from-neon-yellow to-neon-orange text-background"
                        : rank === 2
                        ? "bg-gradient-to-br from-neon-blue to-neon-purple text-primary-foreground"
                        : rank === 3
                        ? "bg-gradient-to-br from-neon-purple to-neon-pink text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{s.student_name}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.booth_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-black neon-text-blue tabular-nums">{s.score}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CENTER — Active Booths */}
        <section className="neon-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon-purple" />
              <h2 className="text-lg font-bold tracking-wide neon-text-purple">ACTIVE BOOTHS</h2>
            </div>
            <span className="text-xs text-muted-foreground">{booths.length} stations</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2">
            {booths.map((b) => {
              const ongoing = b.status === "Ongoing";
              return (
                <div
                  key={b.id}
                  className={`group rounded-xl border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 animate-slide-in-up ${
                    ongoing
                      ? "border-neon-green/40 bg-neon-green/5 hover:shadow-[var(--glow-green)]"
                      : "border-neon-purple/30 bg-neon-purple/5 hover:shadow-[var(--glow-purple)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary text-2xl">
                      {b.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{b.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{b.location}</span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        ongoing
                          ? "bg-neon-green/15 text-neon-green border border-neon-green/40"
                          : "bg-neon-purple/15 text-neon-purple border border-neon-purple/40"
                      }`}
                    >
                      {ongoing ? <Flame className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                      {b.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT — Waffle Order System */}
        <section className="neon-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-neon-orange" />
              <h2 className="text-lg font-bold tracking-wide neon-text-orange">WAFFLE ORDERS</h2>
            </div>
            <span className="text-xs text-muted-foreground">{orders.length} active</span>
          </div>

          <div className="flex-1 overflow-hidden grid grid-rows-2 gap-3 p-3">
            {/* Preparing */}
            <div className="rounded-xl border border-neon-orange/30 bg-neon-orange/5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-neon-orange/20 px-4 py-2">
                <div className="flex items-center gap-2 text-neon-orange font-bold uppercase tracking-wider text-sm">
                  <ChefHat className="h-4 w-4" />
                  Preparing
                </div>
                <span className="text-xs text-muted-foreground">{preparing.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
                <div className="grid grid-cols-3 gap-2">
                  {preparing.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-lg border border-neon-orange/30 bg-background/40 px-3 py-2 text-center animate-slide-in-up"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Order</div>
                      <div className="font-mono text-2xl font-black neon-text-orange">
                        #{String(o.order_number).padStart(3, "0")}
                      </div>
                    </div>
                  ))}
                  {preparing.length === 0 && (
                    <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">
                      No orders being prepared.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ready */}
            <div className="rounded-xl border border-neon-green/40 bg-neon-green/5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-neon-green/30 px-4 py-2">
                <div className="flex items-center gap-2 text-neon-green font-bold uppercase tracking-wider text-sm">
                  <Bell className="h-4 w-4" />
                  Ready for Pickup
                </div>
                <span className="text-xs text-muted-foreground">{ready.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
                <div className="grid grid-cols-2 gap-3">
                  {ready.map((o) => (
                    <div
                      key={o.id}
                      className="ready-pulse rounded-xl border-2 border-neon-green bg-gradient-to-br from-neon-green/20 to-neon-green/5 px-4 py-3 text-center"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-neon-green/80">Pick up</div>
                      <div className="font-mono text-4xl font-black neon-text-green">
                        #{String(o.order_number).padStart(3, "0")}
                      </div>
                      {o.customer_name && (
                        <div className="mt-1 truncate text-xs text-foreground/80">{o.customer_name}</div>
                      )}
                    </div>
                  ))}
                  {ready.length === 0 && (
                    <div className="col-span-2 py-6 text-center text-sm text-muted-foreground">
                      No orders ready yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
