import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    fetchVideoUrl();
    
    // Subscribe to changes in video URL
    const channel = supabase
      .channel('video_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_settings'
        },
        () => {
          fetchVideoUrl();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideoUrl = async () => {
    const { data, error } = await supabase
      .from('video_settings')
      .select('video_url')
      .single();

    if (data && !error) {
      setVideoUrl(data.video_url);
    }
  };

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error("Auto-play failed:", err);
      });
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-card rounded-lg border-4 border-primary shadow-neon flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-glow-pulse">📺</div>
          <p className="text-muted-foreground">Видео не настроено</p>
          <p className="text-sm text-muted-foreground">Войдите в админ-панель для настройки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-4 border-primary shadow-neon">
      {/* CRT effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scanline" />
      </div>
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        playsInline
        muted={false}
        controls={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{ pointerEvents: 'none' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
};
