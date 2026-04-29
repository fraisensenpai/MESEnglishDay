import { Link, useLocation } from "react-router-dom";
import { Monitor, ClipboardList, ChefHat, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: Monitor },
  { to: "/order-entry", label: "Order Entry", icon: ClipboardList },
  { to: "/kitchen-panel", label: "Kitchen", icon: ChefHat },
  { to: "/score-panel", label: "Scores", icon: Trophy },
  { to: "/booth-management", label: "Events", icon: Sparkles },
];

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/40 backdrop-blur-2xl">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex flex-col group">
          <div className="text-sm font-black tracking-tighter text-white uppercase group-hover:text-neon-blue transition-colors">
            MES English Day
          </div>
          <div className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground font-black -mt-0.5">
            Admin · System
          </div>
        </Link>
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-wider transition-all",
                  active
                    ? "bg-white text-background shadow-lg"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-3 w-3", active ? "text-background" : "text-white/40")} />
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
