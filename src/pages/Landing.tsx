import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CursorBackground from "@/components/CursorBackground";
import Navbar from "@/components/Navbar";
import StatCounter from "@/components/StatCounter";
import ConsultationForm from "@/components/ConsultationForm";
import { api, getMediaUrl } from "@/lib/api";
import { getTitle, getDescription, getContent } from "@/lib/i18nHelpers";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  Activity,
  Award,
  Send,
  Stethoscope,
  Building2,
  Newspaper,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-subtitle">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title mb-4">{children}</h2>;
}

// ── Modal Component ────────────────────────────────────────────────────
function DetailModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="overflow-y-auto max-h-[95vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Branch Modal ───────────────────────────────────────────────────────
function BranchModal({ branch, onClose }: { branch: any; onClose: () => void }) {
  const { t } = useTranslation();
  const images = branch?.media?.filter((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE")) || [];
  
  return (
    <DetailModal open={!!branch} onClose={onClose}>
      {branch && (
        <div>
          {images.length > 0 && (
            <div className="relative h-72 overflow-hidden">
              <img src={getMediaUrl(images[0].url)} alt={branch.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="font-display font-bold text-4xl text-white">{branch.title}</h2>
              </div>
            </div>
          )}
          <div className="p-6">
            {!images.length && <h2 className="font-display font-bold text-3xl text-primary mb-4">{branch.title}</h2>}
            <p className="text-muted-foreground leading-relaxed mb-6">{branch.description}</p>
            
            {branch.Services?.filter((svc: any) => svc.price > 0).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-primary mb-3">{t("services.label")}</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {branch.Services.filter((svc: any) => svc.price > 0).map((svc: any) => (
                    <div key={svc.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                      <span className="text-sm font-medium">{getTitle(svc)}</span>
                      <span className="text-sm font-bold text-primary">{svc.price} {t("services.currency")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {branch.Branch_techs?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-primary mb-3">{t("branches.equipment")}</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {branch.Branch_techs.map((tech: any) => (
                    <div key={tech.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm font-medium mb-1">{tech.title}</p>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DetailModal>
  );
}

// ── Doctor Modal ───────────────────────────────────────────────────────
function DoctorModal({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  const { t } = useTranslation();
  const img = doctor?.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
  
  return (
    <DetailModal open={!!doctor} onClose={onClose}>
      {doctor && (
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-2 relative bg-muted">
            {img ? (
              <img 
                src={getMediaUrl(img.url)} 
                alt={`${doctor.first_name} ${doctor.second_name}`} 
                className="w-full h-full object-contain min-h-[500px]" 
              />
            ) : (
              <div className="w-full h-full min-h-[500px] bg-muted flex items-center justify-center">
                <Stethoscope className="w-20 h-20 text-primary/30" />
              </div>
            )}
          </div>
          <div className="md:col-span-3 p-6">
            <h2 className="font-display font-bold text-3xl text-primary mb-1">
              {doctor.first_name} {doctor.second_name}
            </h2>
            {doctor.third_name && <p className="text-muted-foreground mb-4">{doctor.third_name}</p>}
            <p className="text-muted-foreground leading-relaxed mb-6">{doctor.description}</p>
            
            {doctor.branch && (
              <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t("branches.label")}</p>
                <p className="text-sm font-semibold text-primary">{doctor.branch.title}</p>
              </div>
            )}
            
            {doctor.awards?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-primary mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t("doctors.awards")}
                </h3>
                <div className="space-y-2">
                  {doctor.awards.map((award: any) => (
                    <div key={award.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm font-medium">{award.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DetailModal>
  );
}

// ── News Modal ─────────────────────────────────────────────────────────
function NewsModal({ newsItem, onClose }: { newsItem: any; onClose: () => void }) {
  const allMedia = newsItem?.media || [];
  const images = allMedia.filter((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
  
  return (
    <DetailModal open={!!newsItem} onClose={onClose}>
      {newsItem && (
        <div>
          {images.length > 0 && (
            <div className="relative h-96 overflow-hidden">
              <img src={getMediaUrl(images[0].url)} alt={getTitle(newsItem)} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <h2 className="font-display font-bold text-3xl text-primary mb-2">{getTitle(newsItem)}</h2>
            <p className="text-muted-foreground text-sm mb-4">{getDescription(newsItem)}</p>
            <p className="text-foreground leading-relaxed mb-6">{getContent(newsItem)}</p>
            
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {images.slice(1).map((m: any) => (
                  <div key={m.id} className="rounded-xl overflow-hidden aspect-square">
                    <img src={getMediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DetailModal>
  );
}

/**
 * ✅ HERO UPGRADE
 * - Uses /image.png from public folder as a “clinic-proof” visual background
 * - Adds glass heading card + highlight underline + small motion
 * - Adds 3 quick trust chips that instantly scream “medical”
 * - Subtle JS: parallax background + mouse glow (minimal)
 */
function HeroSection({ aboutUs }: { aboutUs: any[] }) {
  const { t } = useTranslation();
  const info = aboutUs[0];

  // Tiny “minimal JS”: subtle parallax, no crazy effects
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setMouse({
        x: Math.max(0, Math.min(100, (e.clientX / w) * 100)),
        y: Math.max(0, Math.min(100, (e.clientY / h) * 100)),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] max-h-[980px] overflow-hidden"
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/image.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translate3d(${(mouse.x - 50) / 35}px, ${(mouse.y - 50) / 35}px, 0) scale(1.04)`,
            willChange: "transform",
          }}
        />
        {/* Minimal overlay for contrast */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55" />
      </div>

      {/* PARTICLES / PATTERN ABOVE IMAGE, BELOW CONTENT */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* soft blobs */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 w-[520px] h-[520px] rounded-full bg-red-500/10 blur-3xl" />

        {/* tiny medical grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M56 14h8v92h-8z'/%3E%3Cpath d='M14 56h92v8H14z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-[2] h-full">
        <div className="container mx-auto px-4 h-full">
          {/* Keep everything centered and screen-fit */}
          <div className="h-full grid lg:grid-cols-2 gap-10 items-center pt-24 pb-10">
            {/* LEFT */}
            <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                <Activity className="w-4 h-4 text-red-400" />
                <span className="text-white/90 text-xs font-semibold tracking-wide">
                  {t("hero.badge")}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-center lg:justify-start gap-3">
                <div className="w-11 h-11 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-white/70 text-[11px] uppercase tracking-widest">
                    {t("hero.title")}
                  </p>
                  <p className="text-white font-black tracking-tight text-lg">
                    <span className="text-red-400">MEDLINE</span> {t("hero.subtitle")}
                  </p>
                </div>
              </div>

              {/* Make heading compact so it won’t push down */}
              <h1 className="mt-5 font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-white">
                {t("hero.mainHeadline")}
              </h1>

              <p className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed">
                {info ? getContent(info) : t("hero.description")}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() =>
                    document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-6 py-3 rounded-2xl font-semibold text-white text-sm bg-red-500 hover:bg-red-500/90 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {t("hero.bookAppointment")}
                </button>

                <button
                  onClick={() =>
                    document.querySelector("#branches")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-6 py-3 rounded-2xl font-semibold text-white text-sm bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  {t("hero.ourDepartments")}
                </button>
              </div>

              {/* Small minimal trust row (not 4 big cards) */}
              <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-3 py-1.5 rounded-full text-xs text-white/85 bg-white/10 border border-white/15 backdrop-blur-md">
                  15+ {t("hero.years")}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs text-white/85 bg-white/10 border border-white/15 backdrop-blur-md">
                  50,000+ {t("hero.patients")}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs text-white/85 bg-white/10 border border-white/15 backdrop-blur-md">
                  100+ {t("hero.doctors")}
                </span>
              </div>
            </div>

            {/* RIGHT — REAL “clinic card”, minimal and useful */}
            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                {/* Header strip */}
                <div className="px-6 py-5 bg-gradient-to-r from-white/10 to-white/0 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-white/15 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">ASL MEDLINE</p>
                        <p className="text-white/70 text-xs">{t('common.receptionAppointments')}</p>
                      </div>
                    </div>
                    <div className="text-white/80 text-xs flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      4.9
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="grid gap-3">
                    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p className="text-white/70 text-xs mb-1">{t('common.workingHours')}</p>
                      <p className="text-white font-semibold text-sm">{t('common.schedule')}</p>
                    </div>

                    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p className="text-white/70 text-xs mb-1">{t('common.phone')}</p>
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-300" />
                        +998 (99) 999-99-99
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p className="text-white/70 text-xs mb-1">{t('common.location')}</p>
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-300" />
                        {t('common.locationAddress')}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="mt-2 w-full py-3 rounded-2xl bg-white text-black font-bold text-sm hover:opacity-90 transition"
                    >
                      {t('common.bookConsultation')}
                    </button>

                    <p className="text-white/60 text-xs text-center">
                      {t('common.fastResponse')} • {t('common.modernDiagnostics')} • {t('common.trustedDoctors')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2]">
          <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/70 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Statistics ─────────────────────────────────────────────────────────
function StatsSection({ stats }: { stats: any[] }) {
  const { t } = useTranslation();
  if (!stats.length) return null;
  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat: any) => (
            <StatCounter key={stat.id} target={stat.number} label={getTitle(stat)} suffix={t("stats.suffix")} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About Us ───────────────────────────────────────────────────────────
function AboutSection({ aboutUs }: { aboutUs: any[] }) {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-24 relative z-10" style={{ background: "hsl(210, 80%, 20%)" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t("about.label")}</p>
            <h2 className="font-display font-bold text-3xl text-white mb-4">{t("about.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutUs.map((item: any) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl p-7 shadow-card hover:shadow-hover transition-all duration-300 border border-border"
              >
                <h3 className="text-lg font-display font-bold text-primary mb-3">{getTitle(item)}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{getContent(item)}</p>
              </div>
            ))}
            {!aboutUs.length && (
              <div className="col-span-2 bg-card rounded-2xl p-8 shadow-card flex items-center gap-6">
                <img src={logo} alt="ASL Medline" className="h-16 w-auto" />
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">ASL MEDLINE Klinikasi</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t("hero.description")}</p>
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
function BranchesSection({ branches, onBranchClick }: { branches: any[]; onBranchClick: (branch: any) => void }) {
  const { t } = useTranslation();

  return (
    <section id="branches" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t("branches.label")}</SectionLabel>
          <SectionTitle>{t("branches.title")}</SectionTitle>
        </div>

        {branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch: any) => {
              const img = branch.media?.find(
                (m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE")
              );
              return (
                <div
                  key={branch.id}
                  onClick={() => onBranchClick(branch)}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden bg-muted">
                    {img ? (
                      <img
                        src={getMediaUrl(img.url)}
                        alt={branch.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "hsl(var(--primary) / 0.08)" }}
                      >
                        <Building2 className="w-14 h-14 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-primary text-lg mb-2 group-hover:text-clinic-red transition-colors">
                      {branch.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {branch.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {branch.Services?.filter((svc: any) => svc.price > 0).slice(0, 3).map((svc: any) => (
                        <span
                          key={svc.id}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "hsl(var(--primary)/0.08)", color: "hsl(var(--primary))" }}
                        >
                          {getTitle(svc)}
                        </span>
                      ))}
                      {(branch.Services?.filter((svc: any) => svc.price > 0).length || 0) > 3 && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground">
                          +{branch.Services.filter((svc: any) => svc.price > 0).length - 3}
                        </span>
                      )}
                    </div>
                    {branch.Branch_techs?.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{branch.Branch_techs.length}</span>{" "}
                        {t("branches.equipment")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t("branches.loading")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Doctors ────────────────────────────────────────────────────────────
function DoctorsSection({ doctors, onDoctorClick }: { doctors: any[]; onDoctorClick: (doctor: any) => void }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);

  const displayDoctors = doctors.length > 0 ? [...doctors, ...doctors, ...doctors] : [];

  return (
    <section id="doctors" className="py-24 relative z-10 overflow-hidden" style={{ background: "hsl(210, 80%, 20%)" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t("doctors.label")}</p>
          <h2 className="font-display font-bold text-3xl text-white mb-4">{t("doctors.title")}</h2>
        </div>

        {doctors.length > 0 ? (
          <div className="relative -mx-4 px-4 overflow-hidden">
            <div
              className="flex gap-6 animate-scroll"
              style={{ animationPlayState: isPaused ? "paused" : "running", width: "fit-content" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayDoctors.map((doc: any, idx: number) => {
                const img = doc.media?.find(
                  (m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE")
                );
                return (
                  <div
                    key={`${doc.id}-${idx}`}
                    onClick={() => onDoctorClick(doc)}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border text-center hover:-translate-y-1 flex-shrink-0 w-64 cursor-pointer"
                  >
                    <div className="h-80 overflow-hidden bg-muted">
                      {img ? (
                        <img
                          src={getMediaUrl(img.url)}
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
                          <span className="text-xs text-clinic-red font-medium">
                            {doc.awards.length} {t("doctors.awards")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t("doctors.loading")}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll { animation: scroll 30s linear infinite; }
      `}</style>
    </section>
  );
}

// ── News ───────────────────────────────────────────────────────────────
function NewsSection({ news, onNewsClick }: { news: any[]; onNewsClick: (newsItem: any) => void }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);

  const displayNews = news.length > 0 ? [...news, ...news, ...news] : [];

  return (
    <section id="news" className="py-24 relative z-10 overflow-hidden" style={{ background: "hsl(210, 80%, 20%)" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t("news.label")}</p>
          <h2 className="font-display font-bold text-3xl text-white mb-4">{t("news.title")}</h2>
        </div>

        {news.length > 0 ? (
          <div className="relative -mx-4 px-4 overflow-hidden">
            <div
              className="flex gap-6 animate-scroll-news"
              style={{ animationPlayState: isPaused ? "paused" : "running", width: "fit-content" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayNews.map((item: any, idx: number) => {
                const img = item.media?.find(
                  (m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE")
                );
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => onNewsClick(item)}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1 flex-shrink-0 w-72 cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "4/5" }}>
                      {img ? (
                        <img
                          src={getMediaUrl(img.url)}
                          alt={getTitle(item)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(var(--primary)/0.06)" }}>
                          <Newspaper className="w-12 h-12 text-primary/25" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-primary text-sm mb-2 group-hover:text-clinic-red transition-colors line-clamp-2">
                        {getTitle(item)}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                        {getDescription(item)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t("news.loading")}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scroll-news {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll-news { animation: scroll-news 40s linear infinite; }
      `}</style>
    </section>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────
function GallerySection({ gallery }: { gallery: any[] }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const allMedia = gallery.flatMap((g: any) => g.media || []);
  const displayMedia = allMedia.length > 0 ? [...allMedia, ...allMedia, ...allMedia] : [];

  return (
    <section id="gallery" className="py-24 bg-background relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t("gallery.label")}</SectionLabel>
          <SectionTitle>{t("gallery.title")}</SectionTitle>
        </div>

        {allMedia.length > 0 ? (
          <div className="relative -mx-4 px-4 overflow-hidden">
            <div
              className="flex gap-4 animate-scroll-gallery"
              style={{ animationPlayState: isPaused ? "paused" : "running", width: "fit-content" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayMedia.map((m: any, idx: number) => {
                const mediaUrl = getMediaUrl(m.url);
                return (
                  <div
                    key={`${m.id}-${idx}`}
                    className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-card flex-shrink-0 w-64"
                    onClick={() => setSelected(mediaUrl)}
                  >
                    {m.type?.includes("image") ? (
                      <img src={mediaUrl} alt="" className="w-full h-auto block" />
                    ) : (
                      <video src={mediaUrl} className="w-full h-auto block" muted />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t("gallery.empty")}</p>
          </div>
        )}

        {allMedia.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--clinic-red)) 100%)" }}
            >
              <ImageIcon className="w-5 h-5" />
              {t("common.seeMore")}
            </Link>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <img src={selected} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      <style>{`
        @keyframes scroll-gallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll-gallery { animation: scroll-gallery 50s linear infinite; }
      `}</style>
    </section>
  );
}

// ── Feedback ───────────────────────────────────────────────────────────
function FeedbackSection({ feedbacks }: { feedbacks: any[] }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ full_name: "", phone_number: "", email: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const displayFeedbacks = feedbacks.length > 0 ? [...feedbacks, ...feedbacks, ...feedbacks] : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.leaveFeedback(form);
      setSuccess(true);
      setForm({ full_name: "", phone_number: "", email: "", content: "" });
    } catch {
      alert(t("feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-24 relative z-10 overflow-hidden" style={{ background: "hsl(210, 80%, 20%)" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t("feedback.label")}</p>
          <h2 className="font-display font-bold text-3xl text-white mb-4">{t("feedback.title")}</h2>
        </div>

        {feedbacks.length > 0 && (
          <>
            <div className="relative mb-16 -mx-4 px-4 overflow-hidden">
              <div
                className="flex gap-6 animate-scroll-feedback"
                style={{ animationPlayState: isPaused ? "paused" : "running", width: "fit-content" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {displayFeedbacks.map((fb: any, idx: number) => (
                  <div key={`${fb.id}-${idx}`} className="bg-card rounded-2xl p-6 shadow-card border border-border flex-shrink-0 w-80">
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic line-clamp-4">"{fb.content}"</p>
                    <div className="font-semibold text-primary text-sm">{fb.full_name}</div>
                    <div className="text-xs text-muted-foreground">{fb.phone_number}</div>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes scroll-feedback {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-100% / 3)); }
              }
              .animate-scroll-feedback { animation: scroll-feedback 40s linear infinite; }
            `}</style>
          </>
        )}

        <div className="max-w-xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border">
          <h3 className="font-display font-bold text-primary text-xl mb-6 text-center">{t("feedback.leaveReview")}</h3>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--primary)/0.1)" }}>
                <Send className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-primary mb-2">{t("feedback.thankYou")}</p>
              <p className="text-muted-foreground text-sm">{t("feedback.willBePublished")}</p>
              <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-clinic-red underline">
                {t("feedback.leaveAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                placeholder={t("feedback.fullName")}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="tel"
                placeholder={t("feedback.phone")}
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder={t("feedback.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder={t("feedback.content")}
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
                {loading ? t("feedback.sending") : t("feedback.submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Consultation ───────────────────────────────────────────────────────
function ConsultationSection() {
  const { t } = useTranslation();
  return (
    <section id="consultation" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t("consultation.label")}</SectionLabel>
          <SectionTitle>{t("consultation.title")}</SectionTitle>
        </div>
        <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border">
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}

// ── Contacts ───────────────────────────────────────────────────────────
function ContactsSection({ contacts }: { contacts: any[] }) {
  const { t } = useTranslation();
  const getIcon = (type: string) => {
    const tt = type?.toLowerCase();
    if (tt?.includes("phone") || tt?.includes("tel")) return Phone;
    if (tt?.includes("email") || tt?.includes("mail")) return Mail;
    return MapPin;
  };

  return (
    <section id="contacts" className="py-24 relative z-10" style={{ background: "hsl(var(--primary))" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t("contacts.label")}</p>
          <h2 className="font-display font-bold text-3xl text-white">{t("contacts.title")}</h2>
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
              <p className="text-white/60 text-sm">{t("contacts.loading")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-8 bg-foreground text-center relative z-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={logo} alt="ASL Medline" className="h-8 w-auto" />
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} ASL Medline Klinikasi. {t("footer.rights")}</p>
        <div className="flex gap-4">
          <Link to="/admin/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
            {t("footer.admin")}
          </Link>
          <Link to="/reception/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
            {t("footer.reception")}
          </Link>
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

  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);

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

      {/* ✅ New WOW hero */}
      <HeroSection aboutUs={data.aboutUs} />

      {/* White content below hero */}
      <div className="relative z-10">
        <NewsSection news={data.news} onNewsClick={setSelectedNews} />
        <StatsSection stats={data.stats} />
        <AboutSection aboutUs={data.aboutUs} />
        <BranchesSection branches={data.branches} onBranchClick={setSelectedBranch} />
        <DoctorsSection doctors={data.doctors} onDoctorClick={setSelectedDoctor} />
        <GallerySection gallery={data.gallery} />
        <ConsultationSection />
        <FeedbackSection feedbacks={data.feedbacks} />
        <ContactsSection contacts={data.contacts} />
        <Footer />
      </div>

      {/* Modals */}
      <BranchModal branch={selectedBranch} onClose={() => setSelectedBranch(null)} />
      <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
}