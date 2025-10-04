import { Background3D } from "@/components/Background3D";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Background3D />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-primary animate-glow-pulse">
              SrTV
            </h1>
            <p className="text-xl text-muted-foreground">
              Добро пожаловать на канал SrTV
            </p>
          </div>

          {/* Video Player */}
          <div className="animate-float">
            <VideoPlayer />
          </div>

          {/* Admin Button */}
          <div className="text-center">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-neon-purple px-8 py-6 text-lg"
            >
              🔐 Админ-панель
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
