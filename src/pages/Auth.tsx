import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export default function Auth() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/admin");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (error) throw error;
        toast.success("Регистрация успешна! Проверьте почту для подтверждения.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Вход выполнен успешно!");
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-primary shadow-neon">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary animate-glow-pulse mb-2">
            SrTV
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Создать аккаунт администратора" : "Вход в админ-панель"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@srtv.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-2 block">
                Пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border focus:border-primary"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"
          >
            {loading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-muted-foreground hover:text-primary"
          >
            {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full border-primary text-primary hover:bg-primary/10"
          >
            Вернуться на главную
          </Button>
        </form>
      </Card>
    </div>
  );
}
