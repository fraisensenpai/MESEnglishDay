import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Booth = {
  id: string;
  name: string;
  status: string;
  location: string;
  icon: string;
  created_at: string;
};

export type Score = {
  id: string;
  student_name: string;
  booth_name: string;
  score: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: number;
  customer_name: string | null;
  status: string;
  created_at: string;
  ready_at: string | null;
};

export function useBooths() {
  const [booths, setBooths] = useState<Booth[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("booths")
        .select("*")
        .order("status", { ascending: true })
        .order("name", { ascending: true });
      if (active && data) setBooths(data as Booth[]);
    };
    load();
    const channel = supabase
      .channel("booths-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "booths" }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return booths;
}

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(50);
      if (active && data) setScores(data as Score[]);
    };
    load();
    const channel = supabase
      .channel("scores-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return scores;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["preparing", "ready"])
        .order("created_at", { ascending: true });
      if (active && data) setOrders(data as Order[]);
    };
    load();
    const channel = supabase
      .channel("orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return orders;
}
