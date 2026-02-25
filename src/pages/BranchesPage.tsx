import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CursorBackground from '@/components/CursorBackground';
import { api, MEDIA_BASE, getMediaUrl } from '@/lib/api';
import { getTitle, getDescription } from '@/lib/i18nHelpers';
import { Building2, X, ArrowLeft, Stethoscope, Activity, Wrench, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function BranchesPage() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBranches()
      .then((res: any) => {
        setBranches(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <CursorBackground />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.home')}
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-4">{t('branches.title')}</h1>
          <p className="text-white/70">{t('branches.label')}</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-white/70">{t('branches.loading')}</p>
          </div>
        ) : branches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {branches.map((branch: any) => {
              const img = branch.media?.find((m: any) => m.type?.includes("image"));
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
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
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70">No departments available</p>
          </div>
        )}
      </main>

      <footer className="py-8 bg-foreground/80 backdrop-blur-sm text-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="ASL Medline" className="h-8 w-auto" />
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ASL Medline Klinikasi. {t('footer.rights')}
          </p>
        </div>
      </footer>
      </div>

      {selectedBranch && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => { setSelectedBranch(null); setCurrentImageIndex(0); }}>
          <div className="bg-card rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-primary">{selectedBranch.title}</h2>
                  <p className="text-sm text-muted-foreground">{t('branches.label')}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedBranch(null); setCurrentImageIndex(0); }} className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Image Gallery */}
              {selectedBranch.media && selectedBranch.media.length > 0 && (
                <div className="relative">
                  <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-black">
                    <img
                      src={getMediaUrl(selectedBranch.media[currentImageIndex].url)}
                      alt={selectedBranch.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {selectedBranch.media.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? selectedBranch.media.length - 1 : prev - 1)); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === selectedBranch.media.length - 1 ? 0 : prev + 1)); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {selectedBranch.media.length}
                      </div>
                    </>
                  )}
                  
                  {/* Thumbnails */}
                  {selectedBranch.media.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {selectedBranch.media.map((m: any, idx: number) => (
                        <button
                          key={m.id}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={getMediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {t('branches.about')}
                </h3>
                <p className="text-foreground text-lg leading-relaxed">{selectedBranch.description}</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedBranch.Services?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">{t('services.label')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedBranch.Branch_techs?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">{t('branches.equipment')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedBranch.doctors?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">{t('doctors.label')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctors Section */}
              {selectedBranch.doctors && selectedBranch.doctors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    {t('doctors.title')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedBranch.doctors.map((doc: any) => {
                      const docImg = doc.media?.find((m: any) => m.type?.includes("image"));
                      return (
                        <div key={doc.id} className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-4 border border-border hover:border-primary/30 transition-all">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                              {docImg ? (
                                <img src={getMediaUrl(docImg.url)} alt={`${doc.first_name} ${doc.second_name}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Stethoscope className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-primary text-base mb-1">
                                {doc.first_name} {doc.second_name}
                              </h4>
                              {doc.third_name && (
                                <p className="text-xs text-muted-foreground mb-1">{doc.third_name}</p>
                              )}
                              <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                              {doc.awards && doc.awards.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-clinic-red">
                                  <Users className="w-3 h-3" />
                                  <span>{doc.awards.length} {t('doctors.awards')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {selectedBranch.Services && selectedBranch.Services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {t('services.title')}
                  </h3>
                  <div className="space-y-4">
                    {selectedBranch.Services.map((svc: any) => {
                      const svcImages = svc.media?.filter((m: any) => m.type?.includes("image")) || [];
                      return (
                        <div key={svc.id} className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl p-5 border border-border hover:border-blue-500/30 transition-all">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary text-lg mb-2">{getTitle(svc)}</h4>
                                <div className="flex items-baseline gap-2">
                                  <p className="text-3xl font-bold text-clinic-red">{svc.price?.toLocaleString()}</p>
                                  <p className="text-sm text-muted-foreground">{t('services.currency')}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Service Images Gallery */}
                            {svcImages.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {svcImages.map((img: any) => (
                                  <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer">
                                    <img 
                                      src={getMediaUrl(img.url)} 
                                      alt={getTitle(svc)} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Equipment Section */}
              {selectedBranch.Branch_techs && selectedBranch.Branch_techs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    {t('branches.equipment')}
                  </h3>
                  <div className="space-y-4">
                    {selectedBranch.Branch_techs.map((tech: any) => {
                      const techImages = tech.media?.filter((m: any) => m.type?.includes("image")) || [];
                      return (
                        <div key={tech.id} className="bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl p-5 border border-border hover:border-purple-500/30 transition-all">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h4 className="font-semibold text-primary text-lg mb-2">{tech.title}</h4>
                              <p className="text-base text-foreground leading-relaxed">{tech.description}</p>
                            </div>
                            
                            {/* Equipment Images Gallery */}
                            {techImages.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {techImages.map((img: any) => (
                                  <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer">
                                    <img 
                                      src={getMediaUrl(img.url)} 
                                      alt={tech.title} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
