
-- Create places table for heritage locations
CREATE TABLE public.places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description_en TEXT,
  description_hi TEXT,
  description_kn TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'monument',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Public read access (heritage data is public)
CREATE POLICY "Anyone can view places" ON public.places FOR SELECT USING (true);

-- Create index on category for filtering
CREATE INDEX idx_places_category ON public.places(category);

-- Create index on name for search
CREATE INDEX idx_places_name ON public.places USING gin(to_tsvector('english', name));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Allow anyone to insert places" ON public.places FOR INSERT WITH CHECK (true);
