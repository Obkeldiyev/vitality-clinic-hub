import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CursorBackground from "@/components/CursorBackground";
import Navbar from "@/components/Navbar";
import StatCounter from "@/components/StatCounter";
import ConsultationForm from "@/components/ConsultationForm";
import { api, MEDIA_BASE, getMediaUrl } from "@/lib/api";
import { getTitle, getDescription, getContent } from "@/lib/i18nHelpers";
import { Phone, Mail, MapPin, Star, Activity, Users, Award, Clock, Send, Stethoscope, Building2, Newspaper, Image as ImageIcon } from "lucide-react";
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
  const { t } = useTranslation();
  const info = aboutUs[0];
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center z-10 py-20 overflow-hidden">
      {/* Medical themed background with patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* DNA helix pattern */}
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Heartbeat line pattern */}
        <div className="absolute top-1/4 left-0 w-full h-32 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 L50 5 L60 35 L70 20 L200 20' stroke='%23ff0000' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '200px 40px'
        }} />
        
        {/* Medical cross grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.1'%3E%3Crect x='45' y='20' width='10' height='60'/%3E%3Crect x='20' y='45' width='60' height='10'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
        
        {/* Stethoscope icons scattered */}
        <div className="absolute top-20 right-20 text-white/5 text-9xl">🩺</div>
        <div className="absolute bottom-40 left-20 text-white/5 text-7xl">💊</div>
        <div className="absolute top-1/2 right-1/4 text-white/5 text-6xl">🏥</div>
        <div className="absolute bottom-20 right-1/3 text-white/5 text-8xl">⚕️</div>
      </div>

      {/* Glowing medical orbs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-clinic-red/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      {/* Medical cross pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-white text-9xl font-bold">+</div>
        <div className="absolute top-40 right-20 text-white text-7xl font-bold">+</div>
        <div className="absolute bottom-40 left-1/4 text-white text-6xl font-bold">+</div>
        <div className="absolute bottom-20 right-1/3 text-white text-8xl font-bold">+</div>
      </div>

      <div className="container mx-auto text-center px-4 pt-20 pb-12 relative z-10">
        {/* Medical badge with heartbeat */}
        <div className="inline-flex items-center gap-3 glass rounded-full px-5 py-2 mb-4 animate-fade-in border border-white/10">
          <div className="relative">
            <Activity className="w-4 h-4 text-clinic-red animate-pulse" />
            <div className="absolute inset-0 bg-clinic-red/20 rounded-full animate-ping" />
          </div>
          <span className="text-white/90 text-sm font-semibold tracking-wide">{t('hero.badge')}</span>
        </div>

        {/* Medical symbol with clinic name */}
        <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center border border-white/10">
            <Stethoscope className="w-6 h-6 text-clinic-red" />
          </div>
          <div className="text-left">
            <p className="text-white/60 text-xs uppercase tracking-widest font-medium">{t('hero.title')}</p>
            <h2 className="text-white font-display font-black text-xl tracking-tight">
              <span className="text-clinic-red">MEDLINE</span> {t('hero.subtitle')}
            </h2>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: "0.1s" }}>
          {t('hero.mainHeadline')}
        </h1>

        <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {info ? getContent(info) : t('hero.description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}
            className="group px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2"
            style={{ background: "hsl(var(--clinic-red))" }}
          >
            <Phone className="w-4 h-4" />
            {t('hero.bookAppointment')}
          </button>
          <button
            onClick={() => document.querySelector("#branches")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm glass hover:bg-white/20 transition-all duration-300 border border-white/10 flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            {t('hero.ourDepartments')}
          </button>
        </div>

        {/* Medical features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: Stethoscope, label: t('hero.diagnostics'), desc: t('hero.diagnosticsDesc') },
            { icon: Users, label: t('hero.specialists'), desc: t('hero.specialistsDesc') },
            { icon: Award, label: t('hero.certificates'), desc: t('hero.certificatesDesc') },
            { icon: Clock, label: t('hero.support'), desc: t('hero.supportDesc') },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-xl p-3 flex flex-col items-center text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110" style={{ background: "hsl(var(--clinic-red))" }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-xs mb-0.5">{label}</span>
              <span className="text-white/60 text-xs leading-tight">{desc}</span>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="glass rounded-lg px-4 py-2 border border-white/10">
            <p className="text-white/60 text-xs">{t('hero.experience')}</p>
            <p className="text-white font-bold text-base">15+ {t('hero.years')}</p>
          </div>
          <div className="glass rounded-lg px-4 py-2 border border-white/10">
            <p className="text-white/60 text-xs">{t('hero.patients')}</p>
            <p className="text-white font-bold text-base">50,000+</p>
          </div>
          <div className="glass rounded-lg px-4 py-2 border border-white/10">
            <p className="text-white/60 text-xs">{t('hero.doctors')}</p>
            <p className="text-white font-bold text-base">100+</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-pulse" />
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
            <StatCounter
              key={stat.id}
              target={stat.number}
              label={getTitle(stat)}
              suffix={t('stats.suffix')}
            />
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
    <section id="about" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>{t('about.label')}</SectionLabel>
            <SectionTitle>{t('about.title')}</SectionTitle>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutUs.map((item: any) => (
              <div key={item.id} className="bg-card rounded-2xl p-7 shadow-card hover:shadow-hover transition-all duration-300 border border-border">
                <h3 className="text-lg font-display font-bold text-primary mb-3">{getTitle(item)}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{getContent(item)}</p>
              </div>
            ))}
            {!aboutUs.length && (
              <div className="col-span-2 bg-card rounded-2xl p-8 shadow-card flex items-center gap-6">
                <img src={logo} alt="ASL Medline" className="h-16 w-auto" />
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">ASL MEDLINE Klinikasi</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('hero.description')}
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
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate branches for infinite scroll effect
  const displayBranches = branches.length > 0 ? [...branches, ...branches, ...branches] : [];
  
  return (
    <section id="branches" className="py-24 bg-background relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('branches.label')}</SectionLabel>
          <SectionTitle>{t('branches.title')}</SectionTitle>
        </div>
        
        {branches.length > 0 ? (
          <div className="relative">
            <div 
              className="flex gap-6 animate-scroll-branches"
              style={{ 
                animationPlayState: isPaused ? 'paused' : 'running',
                width: 'fit-content'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayBranches.map((branch: any, idx: number) => {
                const img = branch.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
                return (
                  <div key={`${branch.id}-${idx}`} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1 flex-shrink-0 w-80">
                    <div className="h-48 overflow-hidden bg-muted">
                      {img ? (
                        <img
                          src={getMediaUrl(img.url)}
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
                            {getTitle(svc)}
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
                          <span className="font-medium text-primary">{branch.Branch_techs.length}</span> {t('branches.equipment')}
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
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('branches.loading')}</p>
          </div>
        )}
        
        {branches.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/branches"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--clinic-red)) 100%)" }}
            >
              <Building2 className="w-5 h-5" />
              {t('common.seeMore')}
            </Link>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scroll-branches {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll-branches {
          animation: scroll-branches 35s linear infinite;
        }
      `}</style>
    </section>
  );
}

// ── Doctors ────────────────────────────────────────────────────────────
function DoctorsSection({ doctors }: { doctors: any[] }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate doctors for infinite scroll effect
  const displayDoctors = doctors.length > 0 ? [...doctors, ...doctors, ...doctors] : [];
  
  return (
    <section id="doctors" className="py-24 bg-secondary/30 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('doctors.label')}</SectionLabel>
          <SectionTitle>{t('doctors.title')}</SectionTitle>
        </div>
        
        {doctors.length > 0 ? (
          <div className="relative">
            <div 
              className="flex gap-6 animate-scroll"
              style={{ 
                animationPlayState: isPaused ? 'paused' : 'running',
                width: 'fit-content'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayDoctors.map((doc: any, idx: number) => {
                const img = doc.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
                return (
                  <div key={`${doc.id}-${idx}`} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border text-center hover:-translate-y-1 flex-shrink-0 w-64">
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
                          <span className="text-xs text-clinic-red font-medium">{doc.awards.length} {t('doctors.awards')}</span>
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
            <p>{t('doctors.loading')}</p>
          </div>
        )}
        
        {doctors.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--clinic-red)) 100%)" }}
            >
              <Stethoscope className="w-5 h-5" />
              {t('common.seeMore')}
            </Link>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

// ── Services ───────────────────────────────────────────────────────────
function ServicesSection({ branches }: { branches: any[] }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  
  const allServices = branches.flatMap((b: any) =>
    (b.Services || []).map((s: any) => ({ ...s, branchTitle: b.title }))
  );
  
  // Duplicate services for infinite scroll effect
  const displayServices = allServices.length > 0 ? [...allServices, ...allServices, ...allServices] : [];

  return (
    <section id="services" className="py-24 bg-background relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('services.label')}</SectionLabel>
          <SectionTitle>{t('services.title')}</SectionTitle>
        </div>
        
        {allServices.length > 0 ? (
          <div className="relative">
            <div 
              className="flex gap-5 animate-scroll-services"
              style={{ 
                animationPlayState: isPaused ? 'paused' : 'running',
                width: 'fit-content'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayServices.map((svc: any, idx: number) => {
                const img = svc.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
                return (
                  <div key={`${svc.id}-${idx}`} className="flex gap-4 bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all duration-300 border border-border group flex-shrink-0 w-80">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "hsl(var(--primary)/0.08)" }}>
                      {img ? (
                        <img src={getMediaUrl(img.url)} alt={getTitle(svc)} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Activity className="w-6 h-6 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{svc.branchTitle}</p>
                      <h4 className="font-semibold text-primary text-sm group-hover:text-clinic-red transition-colors leading-tight mb-1">
                        {getTitle(svc)}
                      </h4>
                      <p className="text-clinic-red font-bold text-base">
                        {svc.price?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{t('services.currency')}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('services.loading')}</p>
          </div>
        )}
        
        {allServices.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--clinic-red)) 100%)" }}
            >
              <Activity className="w-5 h-5" />
              {t('common.seeMore')}
            </Link>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scroll-services {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll-services {
          animation: scroll-services 45s linear infinite;
        }
      `}</style>
    </section>
  );
}

// ── News ───────────────────────────────────────────────────────────────
function NewsSection({ news }: { news: any[] }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  
  console.log("NewsSection rendering with news:", news);
  console.log("NewsSection news count:", news.length);
  
  // Duplicate news for infinite scroll effect
  const displayNews = news.length > 0 ? [...news, ...news, ...news] : [];
  
  return (
    <section id="news" className="py-24 bg-secondary/30 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('news.label')}</SectionLabel>
          <SectionTitle>{t('news.title')}</SectionTitle>
        </div>
        
        {news.length > 0 ? (
          <div className="relative">
            <div 
              className="flex gap-6 animate-scroll-news"
              style={{ 
                animationPlayState: isPaused ? 'paused' : 'running',
                width: 'fit-content'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayNews.map((item: any, idx: number) => {
                console.log("NewsSection - Rendering item:", item.id, item);
                console.log("NewsSection - Item media:", item.media);
                const img = item.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
                console.log("NewsSection - Found image:", img);
                if (img) {
                  console.log("NewsSection - Image URL:", img.url);
                  console.log("NewsSection - Full media URL:", getMediaUrl(img.url));
                }
                return (
                  <div key={`${item.id}-${idx}`} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1 flex-shrink-0 w-72">
                    {/* Instagram-style 4:5 aspect ratio */}
                    <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '4/5' }}>
                      {img ? (
                        <img
                          src={getMediaUrl(img.url)}
                          alt={getTitle(item)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => console.error("NewsSection - Image failed to load:", img.url, e)}
                          onLoad={() => console.log("NewsSection - Image loaded successfully:", img.url)}
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
            <p>{t('news.loading')}</p>
          </div>
        )}
        
        {news.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--clinic-red)) 100%)" }}
            >
              <Newspaper className="w-5 h-5" />
              {t('common.seeMore')}
            </Link>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scroll-news {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll-news {
          animation: scroll-news 40s linear infinite;
        }
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
  
  // Duplicate media for infinite scroll effect
  const displayMedia = allMedia.length > 0 ? [...allMedia, ...allMedia, ...allMedia] : [];
  
  console.log("GallerySection rendering with gallery:", gallery);
  console.log("GallerySection gallery count:", gallery.length);
  console.log("GallerySection allMedia:", allMedia);
  console.log("GallerySection allMedia count:", allMedia.length);

  return (
    <section id="gallery" className="py-24 bg-background relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('gallery.label')}</SectionLabel>
          <SectionTitle>{t('gallery.title')}</SectionTitle>
        </div>
        
        {allMedia.length > 0 ? (
          <div className="relative">
            <div 
              className="flex gap-4 animate-scroll-gallery"
              style={{ 
                animationPlayState: isPaused ? 'paused' : 'running',
                width: 'fit-content'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayMedia.map((m: any, idx: number) => {
                console.log("GallerySection - Rendering media:", m);
                const mediaUrl = getMediaUrl(m.url);
                console.log("GallerySection - Media URL:", mediaUrl);
                return (
                  <div
                    key={`${m.id}-${idx}`}
                    className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-card flex-shrink-0 w-64"
                    onClick={() => setSelected(mediaUrl)}
                  >
                    {m.type?.includes("image") ? (
                      <img 
                        src={mediaUrl} 
                        alt="" 
                        className="w-full h-auto block" 
                        onError={(e) => console.error("GallerySection - Image failed to load:", m.url, e)}
                        onLoad={() => console.log("GallerySection - Image loaded successfully:", m.url)}
                      />
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
            <p>{t('gallery.empty')}</p>
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
              {t('common.seeMore')}
            </Link>
          </div>
        )}
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
      
      <style>{`
        @keyframes scroll-gallery {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll-gallery {
          animation: scroll-gallery 50s linear infinite;
        }
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
  
  // Duplicate feedbacks for infinite scroll effect
  const displayFeedbacks = feedbacks.length > 0 ? [...feedbacks, ...feedbacks, ...feedbacks] : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.leaveFeedback(form);
      setSuccess(true);
      setForm({ full_name: "", phone_number: "", email: "", content: "" });
    } catch {
      alert(t('feedback.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-24 bg-secondary/30 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('feedback.label')}</SectionLabel>
          <SectionTitle>{t('feedback.title')}</SectionTitle>
        </div>

        {/* Reviews Carousel */}
        {feedbacks.length > 0 && (
          <>
            <div className="relative mb-16">
              <div 
                className="flex gap-6 animate-scroll-feedback"
                style={{ 
                  animationPlayState: isPaused ? 'paused' : 'running',
                  width: 'fit-content'
                }}
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
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-100% / 3));
                }
              }
              .animate-scroll-feedback {
                animation: scroll-feedback 40s linear infinite;
              }
            `}</style>
          </>
        )}

        {/* Leave feedback form */}
        <div className="max-w-xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border">
          <h3 className="font-display font-bold text-primary text-xl mb-6 text-center">{t('feedback.leaveReview')}</h3>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--primary)/0.1)" }}>
                <Send className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-primary mb-2">{t('feedback.thankYou')}</p>
              <p className="text-muted-foreground text-sm">{t('feedback.willBePublished')}</p>
              <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-clinic-red underline">{t('feedback.leaveAnother')}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                placeholder={t('feedback.fullName')}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="tel"
                placeholder={t('feedback.phone')}
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder={t('feedback.email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder={t('feedback.content')}
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
                {loading ? t('feedback.sending') : t('feedback.submit')}
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
          <SectionLabel>{t('consultation.label')}</SectionLabel>
          <SectionTitle>{t('consultation.title')}</SectionTitle>
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
    const t = type?.toLowerCase();
    if (t?.includes("phone") || t?.includes("tel")) return Phone;
    if (t?.includes("email") || t?.includes("mail")) return Mail;
    return MapPin;
  };

  return (
    <section id="contacts" className="py-24 relative z-10" style={{ background: "hsl(var(--primary))" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-clinic-red font-semibold text-sm uppercase tracking-widest mb-2">{t('contacts.label')}</p>
          <h2 className="font-display font-bold text-3xl text-white">{t('contacts.title')}</h2>
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
              <p className="text-white/60 text-sm">{t('contacts.loading')}</p>
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
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} ASL Medline Klinikasi. {t('footer.rights')}
        </p>
        <div className="flex gap-4">
          <Link to="/admin/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">{t('footer.admin')}</Link>
          <Link to="/reception/login" className="text-muted-foreground hover:text-foreground text-xs transition-colors">{t('footer.reception')}</Link>
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
      console.log("News response:", newsRes);
      console.log("Gallery response:", galRes);
      const newsData = (newsRes as any).value?.data || [];
      const galleryData = (galRes as any).value?.data || [];
      console.log("News data:", newsData);
      console.log("Gallery data:", galleryData);
      if (newsData.length > 0) {
        console.log("First news item:", newsData[0]);
        console.log("First news media:", newsData[0].media);
      }
      if (galleryData.length > 0) {
        console.log("First gallery item:", galleryData[0]);
        console.log("First gallery media:", galleryData[0].media);
      }
      setData({
        aboutUs: (aboutRes as any).value?.data || [],
        stats: (statsRes as any).value?.data || [],
        branches: (branchRes as any).value?.data || [],
        doctors: (docRes as any).value?.data || [],
        news: newsData,
        gallery: galleryData,
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
        <NewsSection news={data.news} />
        <StatsSection stats={data.stats} />
        <AboutSection aboutUs={data.aboutUs} />
        <BranchesSection branches={data.branches} />
        <DoctorsSection doctors={data.doctors} />
        <ServicesSection branches={data.branches} />
        <GallerySection gallery={data.gallery} />
        <ConsultationSection />
        <FeedbackSection feedbacks={data.feedbacks} />
        <ContactsSection contacts={data.contacts} />
        <Footer />
      </div>
    </div>
  );
}
