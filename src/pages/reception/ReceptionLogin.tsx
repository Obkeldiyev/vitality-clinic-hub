import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, setToken, setRefreshToken, setRole, setUser } from "@/lib/api";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function ReceptionLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Attempting login with:", form);
      const res: any = await api.receptionLogin(form);
      console.log("Login response:", res);
      
      if (res.success && res.data && Array.isArray(res.data) && res.data.length >= 2) {
        const [access_token, refresh_token] = res.data;
        setToken(access_token);
        setRefreshToken(refresh_token);
        setRole("RECEPTION");
        console.log("Login successful, navigating to /reception");
        navigate("/reception");
      } else {
        console.error("Invalid response format:", res);
        throw new Error(res.message || "Invalid response format");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Неверные данные");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--clinic-red))" }}>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="ASL Medline" className="h-14 w-auto mb-4" />
            <h1 className="font-display font-bold text-2xl text-primary">{t('admin.receptions')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.loginPrompt')}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('admin.username')}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Пароль"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-60"
              style={{ background: "hsl(var(--clinic-red))" }}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Войти как администратор →
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
