import { useState } from "react";
import { Sparkles, Plus, Trash2, Edit2, Check, X } from "lucide-react";
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
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useBooths } from "@/hooks/useEventData";
import Footer from "@/components/Footer";

const BoothManagement = () => {
  const booths = useBooths();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [icon, setIcon] = useState("🎮");
  const [status, setStatus] = useState("Ongoing");
  const [busy, setBusy] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const addBooth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "booths"), {
        name: name.trim(),
        location: location.trim(),
        icon,
        status,
        created_at: new Date().toISOString(),
      });
      toast.success("Event added successfully");
      setName("");
      setLocation("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add event");
    } finally {
      setBusy(false);
    }
  };

  const deleteBooth = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "booths", id));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const startEdit = (booth: any) => {
    setEditingId(booth.id);
    setEditName(booth.name);
    setEditLocation(booth.location);
    setEditIcon(booth.icon);
    setEditStatus(booth.status);
  };

  const saveEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, "booths", id), {
        name: editName,
        location: editLocation,
        icon: editIcon,
        status: editStatus,
      });
      setEditingId(null);
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-neon-purple" />
            <h1 className="text-3xl font-black tracking-tight">Event Management</h1>
          </div>

          <form onSubmit={addBooth} className="neon-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <Label className="mb-2 block text-sm">Event Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Scavenger Hunt"
                className="h-11"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 102"
                className="h-11"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">Icon (Emoji)</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🎮"
                className="h-11 text-center text-xl"
              />
            </div>
            <div className="md:col-span-4">
              <Button
                type="submit"
                disabled={busy}
                className="w-full h-12 font-bold bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:opacity-95"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Event
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Current Events ({booths.length})
            </h2>
            {booths.map((b) => (
              <div key={b.id} className="neon-card p-4 flex items-center gap-4 group">
                {editingId === b.id ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1">
                      <Input value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="text-center" />
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="md:col-span-1" />
                      <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => saveEdit(b.id)} className="text-neon-green">
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="text-neon-pink">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">{b.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold flex items-center gap-2">
                        {b.name}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                          b.status === "Ongoing" ? "bg-neon-green/10 text-neon-green" : "bg-muted text-muted-foreground"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{b.location}</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(b)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteBooth(b.id)} className="hover:text-neon-pink">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoothManagement;
