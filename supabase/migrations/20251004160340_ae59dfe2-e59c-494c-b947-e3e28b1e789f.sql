-- Create video settings table
CREATE TABLE IF NOT EXISTS public.video_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  video_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.video_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read video settings
CREATE POLICY "Anyone can view video settings"
  ON public.video_settings
  FOR SELECT
  USING (true);

-- Only authenticated users can update video settings
CREATE POLICY "Authenticated users can update video settings"
  ON public.video_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can insert video settings
CREATE POLICY "Authenticated users can insert video settings"
  ON public.video_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default row
INSERT INTO public.video_settings (id, video_url)
VALUES (1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for video settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_settings;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_video_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_settings_updated_at
  BEFORE UPDATE ON public.video_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_settings_timestamp();