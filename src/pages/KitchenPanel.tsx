import { useState } from "react";
import { ChefHat, CheckCircle2, Undo2, Clock } from "lucide-react";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/hooks/useEventData";

const elapsed = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const KitchenPanel = () => {
  const orders = useOrders();
  const [busy, setBusy] = useState<string | null>(null);
  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  const markReady = async (id: string, num: number) => {
    setBusy(id);
    const { error } = await supabase
      .from("orders")
      .update({ status: "ready", ready_at: new Date().toISOString() })
      .eq("id", id);
    setBusy(null);
    if (error) toast.error("Update failed");
    else toast.success(`Order #${String(num).padStart(3, "0")} ready!`);
  };

  const undo = async (id: string) => {
    setBusy(id);
    await supabase.from("orders").update({ status: "preparing", ready_at: null }).eq("id", id);
    setBusy(null);
  };

  const complete = async (id: string) => {
    setBusy(id);
    await supabase.from("orders").update({ status: "completed" }).eq("id", id);
    setBusy(null);
  };

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-8">
        <div className="mb-6 flex items-center gap-3">
          <ChefHat className="h-7 w-7 text-neon-orange" />
          <h1 className="text-3xl font-black tracking-tight">Kitchen Panel</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="neon-card overflow-hidden">
            <div className="border-b border-border/60 px-5 py-3 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-wider text-sm text-neon-orange">
                Preparing ({preparing.length})
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {preparing.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 rounded-xl border border-neon-orange/30 bg-neon-orange/5 p-4"
                >
                  <div className="font-mono text-3xl font-black neon-text-orange w-24">
                    #{String(o.order_number).padStart(3, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{o.customer_name || "Walk-in"}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono">{elapsed(o.created_at)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => markReady(o.id, o.order_number)}
                    disabled={busy === o.id}
                    className="bg-gradient-to-r from-neon-green to-emerald-500 text-background font-bold hover:opacity-95 shadow-[var(--glow-green)]"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Ready
                  </Button>
                </div>
              ))}
              {preparing.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">All caught up! 🎉</p>
              )}
            </div>
          </section>

          <section className="neon-card overflow-hidden">
            <div className="border-b border-border/60 px-5 py-3 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-wider text-sm text-neon-green">
                Ready for Pickup ({ready.length})
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {ready.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-neon-green/60 bg-neon-green/10 p-4"
                >
                  <div className="font-mono text-3xl font-black neon-text-green w-24">
                    #{String(o.order_number).padStart(3, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{o.customer_name || "Walk-in"}</div>
                    <div className="text-xs text-muted-foreground">Ready</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => undo(o.id)} disabled={busy === o.id}>
                    <Undo2 className="mr-1 h-4 w-4" />
                    Undo
                  </Button>
                  <Button size="sm" onClick={() => complete(o.id)} disabled={busy === o.id}>
                    Picked up
                  </Button>
                </div>
              ))}
              {ready.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders ready yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default KitchenPanel;
