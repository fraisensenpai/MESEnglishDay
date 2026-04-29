
-- Booths
CREATE TABLE public.booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Starting Soon',
  location TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎯',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scores
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  booth_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'preparing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ready_at TIMESTAMPTZ
);

-- Auto-incrementing order number sequence
CREATE SEQUENCE public.orders_number_seq START 1;
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT nextval('public.orders_number_seq');

-- RLS
ALTER TABLE public.booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public access policies (event-wide screens, no auth)
CREATE POLICY "public read booths" ON public.booths FOR SELECT USING (true);
CREATE POLICY "public write booths" ON public.booths FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "public write scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "public write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER TABLE public.booths REPLICA IDENTITY FULL;
ALTER TABLE public.scores REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.booths;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Seed booths
INSERT INTO public.booths (name, status, location, icon) VALUES
  ('Spelling Bee', 'Ongoing', 'Room A12', '🔤'),
  ('Word Hunt', 'Ongoing', 'Garden Area', '🔍'),
  ('Fast Translator', 'Starting Soon', 'Room B05', '⚡'),
  ('Karaoke', 'Ongoing', 'Auditorium', '🎤'),
  ('English Quiz', 'Starting Soon', 'Room C01', '🧠'),
  ('Storytelling', 'Ongoing', 'Library', '📖');
