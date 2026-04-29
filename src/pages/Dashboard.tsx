import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy, MapPin, Flame, ChefHat, Bell, Sparkles, Settings, ExternalLink } from "lucide-react";
import { useBooths, useOrders, useScores } from "@/hooks/useEventData";
import { Link } from "react-router-dom";

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

  const topScores = useMemo(() => scores.slice(0, 15), [scores]);

  return (
    <div className="min-h-screen px-4 py-3">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold tracking-tighter leading-none mb-0.5 italic">
                <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase">
                  MES English Day
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                </span>
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black">Control Center · Live Stream</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
            <div className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
              <Link to="/order-entry" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Orders
              </Link>
              <Link to="/score-panel" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Scores
              </Link>
              <Link to="/kitchen-panel" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Kitchen
              </Link>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="font-mono text-2xl md:text-3xl font-black text-white tabular-nums leading-none tracking-tighter">
              {formatClock(now)}
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <div className="h-1 w-1 rounded-full bg-neon-green animate-pulse" />
            <span className="text-[8px] uppercase tracking-[0.25em] text-neon-green font-black">System Nominal</span>
          </div>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-6rem)]">
        {/* LEFT — Top Scorers */}
        <section className="neon-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-neon-blue" />
              <h2 className="text-sm font-bold tracking-wider neon-text-blue uppercase">Top Scorers</h2>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">{scores.length} TOTAL</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-1.5">
            {topScores.length === 0 && (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No scores yet — awaiting results...
              </div>
            )}
            {topScores.map((s, i) => {
              const rank = i + 1;
              const podium = rank <= 3;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 animate-slide-in-up ${
                    podium ? "neon-border-blue bg-neon-blue/5" : "border-border/40 bg-secondary/30"
                  }`}
                >
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-md font-black text-sm ${
                      rank === 1
                        ? "bg-gradient-to-br from-neon-yellow to-neon-orange text-background"
                        : rank === 2
                        ? "bg-gradient-to-br from-neon-blue to-neon-purple text-primary-foreground"
                        : rank === 3
                        ? "bg-gradient-to-br from-neon-purple to-neon-pink text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    {rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold">{s.student_name}</div>
                    <div className="truncate text-[10px] text-muted-foreground uppercase tracking-tight">{s.booth_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-black neon-text-blue tabular-nums">{s.score}</div>
                    <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CENTER — Active Booths */}
        <section className="neon-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-purple" />
              <h2 className="text-sm font-bold tracking-wider neon-text-purple uppercase">Active Booths</h2>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">{booths.length} STATIONS</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-1.5">
            {booths.map((b) => {
              const ongoing = b.status === "Ongoing";
              return (
                <div
                  key={b.id}
                  className={`group rounded-lg border px-3 py-2 transition-all duration-300 animate-slide-in-up ${
                    ongoing
                      ? "border-neon-green/30 bg-neon-green/5"
                      : "border-neon-purple/20 bg-neon-purple/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary/50 text-xl">
                      {b.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold">{b.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{b.location}</span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${
                        ongoing
                          ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                          : "bg-neon-purple/10 text-neon-purple border border-neon-purple/30"
                      }`}
                    >
                      {ongoing ? <Flame className="h-2 w-2" /> : <Bell className="h-2 w-2" />}
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
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-neon-orange" />
              <h2 className="text-sm font-bold tracking-wider neon-text-orange uppercase">Orders</h2>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">{orders.length} TOTAL</span>
          </div>

          <div className="flex-1 overflow-hidden grid grid-rows-2 gap-2 p-2">
            {/* Preparing */}
            <div className="rounded-xl border border-neon-orange/20 bg-neon-orange/5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-neon-orange/15 px-3 py-1.5">
                <div className="flex items-center gap-1.5 text-neon-orange font-bold uppercase tracking-widest text-[10px]">
                  <ChefHat className="h-3 w-3" />
                  Preparing
                </div>
                <span className="text-[10px] font-black text-muted-foreground">{preparing.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {preparing.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-md border border-neon-orange/20 bg-background/30 px-2 py-1.5 text-center animate-slide-in-up"
                    >
                      <div className="text-[8px] uppercase tracking-tighter text-muted-foreground font-bold">Order</div>
                      <div className="font-mono text-lg font-black neon-text-orange leading-tight">
                        #{String(o.order_number).padStart(3, "0")}
                      </div>
                    </div>
                  ))}
                  {preparing.length === 0 && (
                    <div className="col-span-3 py-4 text-center text-[10px] text-muted-foreground font-medium italic">
                      All orders cleared
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ready */}
            <div className="rounded-xl border border-neon-green/30 bg-neon-green/5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-neon-green/20 px-3 py-1.5">
                <div className="flex items-center gap-1.5 text-neon-green font-bold uppercase tracking-widest text-[10px]">
                  <Bell className="h-3 w-3" />
                  Ready
                </div>
                <span className="text-[10px] font-black text-muted-foreground">{ready.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                <div className="grid grid-cols-2 gap-2">
                  {ready.map((o) => (
                    <div
                      key={o.id}
                      className="ready-pulse rounded-lg border border-neon-green bg-gradient-to-br from-neon-green/10 to-transparent px-3 py-2 text-center"
                    >
                      <div className="text-[8px] uppercase tracking-tighter text-neon-green/80 font-bold">Pick up</div>
                      <div className="font-mono text-2xl font-black neon-text-green leading-tight">
                        #{String(o.order_number).padStart(3, "0")}
                      </div>
                      {o.customer_name && (
                        <div className="mt-0.5 truncate text-[9px] font-bold text-foreground/70 uppercase">{o.customer_name}</div>
                      )}
                    </div>
                  ))}
                  {ready.length === 0 && (
                    <div className="col-span-2 py-4 text-center text-[10px] text-muted-foreground font-medium italic">
                      Waiting for orders...
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
