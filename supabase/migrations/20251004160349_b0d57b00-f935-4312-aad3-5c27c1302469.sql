-- Fix function search path security issue
DROP TRIGGER IF EXISTS update_video_settings_updated_at ON public.video_settings;
DROP FUNCTION IF EXISTS public.update_video_settings_timestamp();

-- Recreate function with proper security settings
CREATE OR REPLACE FUNCTION public.update_video_settings_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_video_settings_updated_at
  BEFORE UPDATE ON public.video_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_settings_timestamp();