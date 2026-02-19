import { useState, useEffect } from "react";
import CursorBackground from "@/components/CursorBackground";
import Navbar from "@/components/Navbar";
import StatCounter from "@/components/StatCounter";
import { api, MEDIA_BASE } from "@/lib/api";
import { Phone, Mail, MapPin, Star, ChevronRight, Activity, Users, Award, Clock, Send, Stethoscope, Building2, Newspaper, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-subtitle">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title mb-4">{children}</h2>;
}

// ── Hero ──────────────────────────────────────────────────────────────
function HeroSection({ aboutUs }: { aboutUs: any[] }) {
  const info = aboutUs[0];
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center z-10">
      <div className="container mx-auto text-center px-4 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8 animate-fade-in">
          <Activity className="w-4 h-4 text-clinic-red animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Современная медицина для вас</span>
        </div>

        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
          ASL <span className="text-clinic-red">MEDLINE</span>
          <br />
          <span className="text-white/80 text-3xl sm:text-4xl lg:text-5xl font-bold">Klinikasi</span>
        </h1>

        <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {info?.content_ru || "Передовая клиника с современным оборудованием и высококвалифицированными специалистами. Ваше здоровье — наш приоритет."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => document.querySelector("#contacts")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-primary"
            style={{ background: "hsl(var(--clinic-red))" }}
          >
            Записаться на приём
          </button>
          <button
            onClick={() => document.querySelector("#branches")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-xl font-semibold text-white text-base glass hover:bg-white/20 transition-all duration-300"
          >
            Наши отделения
          </button>
        </div>

        {/* Floating cards */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { icon: Stethoscope, label: "Диагностика" },
            { icon: Users, label: "Специалисты" },
            { icon: Award, label: "Сертификаты" },
            { icon: Clock, label: "24/7 Поддержка" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass rounded-xl px-5 py-3 flex items-center gap-2">
              <Icon className="w-4 h-4 text-clinic-red" />
              <span className="text-white/90 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 rounded-full bg-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ── Statistics ─────────────────────────────────────────────────────────
function StatsSection({ stats }: { stats: any[] }) {
  if (!stats.length) return null;
  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat: any) => (
            <StatCounter
              key={stat.id}
              target={stat.number}
              label={stat.title_ru || stat.title_en || stat.title_uz}
              suffix="+"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About Us ───────────────────────────────────────────────────────────
function AboutSection({ aboutUs }: { aboutUs: any[] }) {
  return (
    <section id="about" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>О клинике</SectionLabel>
            <SectionTitle>ASL Medline — Ваш надёжный партнёр в здоровье</SectionTitle>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutUs.map((item: any) => (
              <div key={item.id} className="bg-card rounded-2xl p-7 shadow-card hover:shadow-hover transition-all duration-300 border border-border">
                <h3 className="text-lg font-display font-bold text-primary mb-3">{item.title_ru || item.title_en}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.content_ru || item.content_en}</p>
              </div>
            ))}
            {!aboutUs.length && (
              <div className="col-span-2 bg-card rounded-2xl p-8 shadow-card flex items-center gap-6">
                <img src={logo} alt="ASL Medline" className="h-16 w-auto" />
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">ASL MEDLINE Klinikasi</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Современная многопрофильная клиника с передовым оборудованием и командой опытных специалистов. 
                    Мы предоставляем полный спектр медицинских услуг для всей семьи.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Branches ───────────────────────────────────────────────────────────
function BranchesSection({ branches }: { branches: any[] }) {
  return (
    <section id="branches" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Наши отделения</SectionLabel>
          <SectionTitle>Специализированные центры</SectionTitle>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {branches.map((branch: any) => {
            const img = branch.media?.find((m: any) => m.type === "image" || m.type === "IMAGE");
            return (
              <div key={branch.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1">
                <div className="h-48 overflow-hidden bg-muted">
                  {img ? (
                    <img
                      src={`${MEDIA_BASE}${img.url}`}
                      alt={branch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <Building2 className="w-14 h-14 text-primary/30" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-primary text-lg mb-2 group-hover:text-clinic-red transition-colors">{branch.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{branch.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {branch.Services?.slice(0, 3).map((svc: any) => (
                      <span key={svc.id} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "hsl(var(--primary)/0.08)", color: "hsl(var(--primary))" }}>
                        {svc.title_ru || svc.title_en}
                      </span>
                    ))}
                    {(branch.Services?.length || 0) > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground">
                        +{branch.Services.length - 3}
                      </span>
                    )}
                  </div>
                  {branch.Branch_techs?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-primary">{branch.Branch_techs.length}</span> единиц оборудования
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!branches.length && (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Загрузка отделений...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Doctors ────────────────────────────────────────────────────────────
function DoctorsSection({ doctors }: { doctors: any[] }) {
  return (
    <section id="doctors" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Наша команда</SectionLabel>
          <SectionTitle>Опытные специалисты</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 8).map((doc: any) => {
            const img = doc.media?.find((m: any) => m.type === "image" || m.type === "IMAGE");
            return (
              <div key={doc.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border text-center hover:-translate-y-1">
                <div className="h-56 overflow-hidden bg-muted">
                  {img ? (
                    <img
                      src={`${MEDIA_BASE}${img.url}`}
                      alt={`${doc.first_name} ${doc.second_name}`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(var(--primary)/0.06)" }}>
                      <Stethoscope className="w-14 h-14 text-primary/25" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-primary text-base mb-1">
                    {doc.first_name} {doc.second_name}
                  </h3>
                  {doc.third_name && <p className="text-xs text-muted-foreground mb-2">{doc.third_name}</p>}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{doc.description}</p>
                  {doc.awards?.length > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5 text-clinic-red" />
                      <span className="text-xs text-clinic-red font-medium">{doc.awards.length} наград</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!doctors.length && (
            <div className="col-span-4 text-center py-20 text-muted-foreground">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Загрузка врачей...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Services ───────────────────────────────────────────────────────────
function ServicesSection({ branches }: { branches: any[] }) {
  const allServices = branches.flatMap((b: any) =>
    (b.Services || []).map((s: any) => ({ ...s, branchTitle: b.title }))
  );

  return (
    <section id="services" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Услуги</SectionLabel>
          <SectionTitle>Медицинские услуги и цены</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allServices.slice(0, 12).map((svc: any) => {
            const img = svc.media?.find((m: any) => m.type === "image" || m.type === "IMAGE");
            return (
              <div key={svc.id} className="flex gap-4 bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all duration-300 border border-border group">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "hsl(var(--primary)/0.08)" }}>
                  {img ? (
                    <img src={`${MEDIA_BASE}${img.url}`} alt={svc.title_ru} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{svc.branchTitle}</p>
                  <h4 className="font-semibold text-primary text-sm group-hover:text-clinic-red transition-colors leading-tight mb-1">
                    {svc.title_ru || svc.title_en}
                  </h4>
                  <p className="text-clinic-red font-bold text-base">
                    {svc.price?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">сум</span>
                  </p>
                </div>
              </div>
            );
          })}
          {!allServices.length && (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Загрузка услуг...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── News ───────────────────────────────────────────────────────────────
function NewsSection({ news }: { news: any[] }) {
  return (
    <section id="news" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Новости</SectionLabel>
          <SectionTitle>Последние новости клиники</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-7">
          {news.slice(0, 6).map((item: any) => {
            const img = item.media?.find((m: any) => m.type === "image" || m.type === "IMAGE");
            return (
              <div key={item.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1">
                <div className="h-48 overflow-hidden bg-muted">
                  {img ? (
                    <img
                      src={`${MEDIA_BASE}${img.url}`}
                      alt={item.title_ru}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(var(--primary)/0.06)" }}>
                      <Newspaper className="w-12 h-12 text-primary/25" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-primary text-base mb-2 group-hover:text-clinic-red transition-colors line-clamp-2">
                    {item.title_ru || item.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {item.description_ru || item.description_en}
                  </p>
                </div>
              </div>
            );
          })}
          {!news.length && (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Загрузка новостей...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────
function GallerySection({ gallery }: { gallery: any[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const allMedia = gallery.flatMap((g: any) => g.media || []);

  return (
    <section id="gallery" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Галерея</SectionLabel>
          <SectionTitle>Наша клиника</SectionTitle>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {allMedia.slice(0, 16).map((m: any) => (
            <div
              key={m.id}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-card"
              onClick={() => setSelected(`${MEDIA_BASE}${m.url}`)}
            >
              {m.type === "image" || m.type === "IMAGE" ? (
                <img src={`${MEDIA_BASE}${m.url}`} alt="" className="w-full h-auto block" />
              ) : (
                <video src={`${MEDIA_BASE}${m.url}`} className="w-full h-auto block" muted />
              )}
            </div>
          ))}
          {!allMedia.length && (
            <div className="col-span-4 text-center py-20 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Галерея пока пуста</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
}

// ── Feedback ───────────────────────────────────────────────────────────
function FeedbackSection({ feedbacks }: { feedbacks: any[] }) {
  const [form, setForm] = useState({ full_name: "", phone_number: "", email: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.leaveFeedback(form);
      setSuccess(true);
      setForm({ full_name: "", phone_number: "", email: "", content: "" });
    } catch {
      alert("Ошибка при отправке. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>Отзывы</SectionLabel>
          <SectionTitle>Что говорят наши пациенты</SectionTitle>
        </div>

        {/* Reviews */}
        {feedbacks.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {feedbacks.slice(0, 6).map((fb: any) => (
              <div key={fb.id} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{fb.content}"</p>
                <div className="font-semibold text-primary text-sm">{fb.full_name}</div>
                <div className="text-xs text-muted-foreground">{fb.phone_number}</div>
              </div>
            ))}
          </div>
        )}

        {/* Leave feedback form */}
        <div className="max-w-xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border">
          <h3 className="font-display font-bold text-primary text-xl mb-6 text-center">Оставить отзыв</h3>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--primary)/0.1)" }}>
                <Send className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-primary mb-2">Спасибо за отзыв!</p>
              <p className="text-muted-foreground text-sm">Он будет опубликован после проверки.</p>
              <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-clinic-red underline">Оставить ещё</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="tel"
                placeholder="Номер телефона"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder="Ваш отзыв..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "hsl(var(--primary))" }}
              >
                {loading ? "Отправка..." : "Отправить отзыв"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Contacts ───────────────────────────────────────────────────────────
function ContactsSection({ contacts }: { contacts: any[] }) {
  const getIcon = (type: string) => {
    const t = type?.toLowerCase();
    if (t?.includes("phone") || t?.includes("tel")) return Phone;
    if (t?.includes("email") || t?.includes("mail")) return Mail;
    return MapPin;
  };

  return (
    <section id="contacts" className="py-24 relative z-10" style={{ background: "hsl(var(--primary))" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">Связаться с нами</p>
          <h2 className="font-display font-bold text-3xl text-white">Контактная информация</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {contacts.map((c: any) => {
            const Icon = getIcon(c.type);
            return (
              <div key={c.id} className="glass rounded-2xl p-6 flex items-center gap-4 min-w-64">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--clinic-red))" }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">{c.type}</p>
                  <p className="text-white font-semibold text-sm">{c.contact}</p>
                </div>
              </div>
            );
          })}
          {!contacts.length && (
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <Phone className="w-6 h-6 text-white/50" />
              <p className="text-white/60 text-sm">Загрузка контактов...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 bg-foreground text-center relative z-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={logo} alt="ASL Medline" className="h-8 w-auto" />
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} ASL Medline Klinikasi. Все права защищены.
        </p>
        <div className="flex gap-4">
          <Link to="/admin/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Администратор</Link>
          <Link to="/reception/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Регистратура</Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main Landing Page ──────────────────────────────────────────────────
export default function Landing() {
  const [data, setData] = useState({
    aboutUs: [] as any[],
    stats: [] as any[],
    branches: [] as any[],
    doctors: [] as any[],
    news: [] as any[],
    gallery: [] as any[],
    feedbacks: [] as any[],
    contacts: [] as any[],
  });

  useEffect(() => {
    Promise.allSettled([
      api.getAboutUs(),
      api.getStatistics(),
      api.getBranches(),
      api.getDoctors(),
      api.getNews(),
      api.getGallery(),
      api.getApprovedFeedbacks(),
      api.getContacts(),
    ]).then(([aboutRes, statsRes, branchRes, docRes, newsRes, galRes, fbRes, contactRes]) => {
      setData({
        aboutUs: (aboutRes as any).value?.data || [],
        stats: (statsRes as any).value?.data || [],
        branches: (branchRes as any).value?.data || [],
        doctors: (docRes as any).value?.data || [],
        news: (newsRes as any).value?.data || [],
        gallery: (galRes as any).value?.data || [],
        feedbacks: (fbRes as any).value?.data || [],
        contacts: (contactRes as any).value?.data || [],
      });
    });
  }, []);

  return (
    <div className="relative">
      {/* Animated background only for hero */}
      <div className="fixed inset-0 z-0">
        <CursorBackground />
      </div>

      <Navbar />

      <HeroSection aboutUs={data.aboutUs} />

      {/* White content below hero */}
      <div className="relative z-10">
        <StatsSection stats={data.stats} />
        <AboutSection aboutUs={data.aboutUs} />
        <BranchesSection branches={data.branches} />
        <DoctorsSection doctors={data.doctors} />
        <ServicesSection branches={data.branches} />
        <NewsSection news={data.news} />
        <GallerySection gallery={data.gallery} />
        <FeedbackSection feedbacks={data.feedbacks} />
        <ContactsSection contacts={data.contacts} />
        <Footer />
      </div>
    </div>
  );
}
