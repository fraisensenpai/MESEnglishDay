import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit, 
  where 
} from "firebase/firestore";

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
    const q = query(
      collection(db, "booths"), 
      orderBy("status", "asc"), 
      orderBy("name", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booth[];
      setBooths(data);
    });

    return () => unsubscribe();
  }, []);

  return booths;
}

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "scores"), 
      orderBy("score", "desc"), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Score[];
      setScores(data);
    });

    return () => unsubscribe();
  }, []);

  return scores;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "in", ["preparing", "ready"]),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  return orders;
}
