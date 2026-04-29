import { Link, useLocation } from "react-router-dom";
import { Monitor, ClipboardList, ChefHat, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: Monitor },
  { to: "/order-entry", label: "Order Entry", icon: ClipboardList },
  { to: "/kitchen-panel", label: "Kitchen", icon: ChefHat },
  { to: "/score-panel", label: "Scores", icon: Trophy },
];

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple text-primary-foreground font-black shadow-[var(--glow-blue)]">
            E
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wide">MES ENGLISH DAY</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Control Center</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-secondary text-foreground shadow-[var(--glow-blue)] border border-neon-blue/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default AdminNav;
