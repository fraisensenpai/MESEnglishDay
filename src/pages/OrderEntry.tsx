import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { toast } from "sonner";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { useOrders } from "@/hooks/useEventData";

const OrderEntry = () => {
  const orders = useOrders();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Get the last order number to increment it
      const q = query(collection(db, "orders"), orderBy("order_number", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      let nextNumber = 1;
      if (!querySnapshot.empty) {
        nextNumber = (querySnapshot.docs[0].data().order_number || 0) + 1;
      }

      const orderData = {
        customer_name: name.trim() || null,
        status: "preparing",
        order_number: nextNumber,
        created_at: new Date().toISOString() // Using ISO string to match existing logic
      };

      await addDoc(collection(db, "orders"), orderData);
      
      setLastOrderNumber(nextNumber);
      setName("");
      toast.success(`Order #${String(nextNumber).padStart(3, "0")} created`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <ClipboardList className="h-7 w-7 text-neon-orange" />
            <h1 className="text-3xl font-black tracking-tight">Order Entry</h1>
          </div>

          <form onSubmit={submit} className="neon-card p-6 space-y-5">
            <div>
              <Label htmlFor="name" className="mb-2 block text-sm font-medium">
                Customer name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full h-14 text-base font-bold bg-gradient-to-r from-neon-orange to-neon-pink hover:opacity-95 shadow-[var(--glow-orange)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Order
            </Button>
            {lastOrderNumber !== null && (
              <div className="rounded-xl border border-neon-green/40 bg-neon-green/5 p-4 text-center animate-fade-in">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Last order created</div>
                <div className="font-mono text-4xl font-black neon-text-green">
                  #{String(lastOrderNumber).padStart(3, "0")}
                </div>
              </div>
            )}
          </form>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Active orders ({orders.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className={`rounded-xl border px-3 py-3 text-center ${
                    o.status === "ready"
                      ? "border-neon-green/50 bg-neon-green/5"
                      : "border-neon-orange/40 bg-neon-orange/5"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {o.status === "ready" ? "Ready" : "Preparing"}
                  </div>
                  <div
                    className={`font-mono text-2xl font-black ${
                      o.status === "ready" ? "neon-text-green" : "neon-text-orange"
                    }`}
                  >
                    #{String(o.order_number).padStart(3, "0")}
                  </div>
                  {o.customer_name && (
                    <div className="truncate text-xs text-muted-foreground">{o.customer_name}</div>
                  )}
                </div>
              ))}
              {orders.length === 0 && (
                <div className="col-span-full text-center text-sm text-muted-foreground py-8">
                  No active orders.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderEntry;
