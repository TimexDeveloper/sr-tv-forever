import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export default function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchVideoUrl();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchVideoUrl = async () => {
    const { data, error } = await supabase
      .from('video_settings')
      .select('video_url')
      .single();

    if (data && !error) {
      setVideoUrl(data.video_url || "");
    }
  };

  const handleSaveVideo = async () => {
    if (!videoUrl.trim()) {
      toast.error("Введите URL видео");
      return;
    }

    const { error } = await supabase
      .from('video_settings')
      .upsert({ id: 1, video_url: videoUrl });

    if (error) {
      toast.error("Ошибка сохранения: " + error.message);
    } else {
      toast.success("URL видео обновлен!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из системы");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-glow-pulse text-4xl">⚡</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary animate-glow-pulse">
            Админ-панель SrTV
          </h1>
          <Button onClick={handleLogout} variant="destructive">
            Выйти
          </Button>
        </div>

        <Card className="p-8 bg-card border-primary shadow-neon">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Настройка видео
              </h2>
              <p className="text-muted-foreground mb-4">
                Введите прямую ссылку на MP4 видео файл
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground mb-2 block">
                  URL видео
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <Button 
                onClick={handleSaveVideo}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"
              >
                Сохранить изменения
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Примеры ссылок:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4</li>
                <li>• https://www.w3schools.com/html/mov_bbb.mp4</li>
              </ul>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10"
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
