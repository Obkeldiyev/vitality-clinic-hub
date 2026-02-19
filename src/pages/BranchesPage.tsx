import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CursorBackground from '@/components/CursorBackground';
import { api, MEDIA_BASE, getMediaUrl } from '@/lib/api';
import { getTitle, getDescription } from '@/lib/i18nHelpers';
import { Building2, X, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function BranchesPage() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedBranch(null)}>
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-primary">{selectedBranch.title}</h2>
              <button onClick={() => setSelectedBranch(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedBranch.media?.find((m: any) => m.type?.includes("image")) && (
                <img
                  src={getMediaUrl(selectedBranch.media.find((m: any) => m.type?.includes("image")).url)}
                  alt={selectedBranch.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              
              <p className="text-muted-foreground leading-relaxed mb-6">{selectedBranch.description}</p>

              {selectedBranch.Services?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-primary mb-3">{t('services.label')}</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedBranch.Services.map((svc: any) => (
                      <div key={svc.id} className="bg-muted rounded-xl p-4">
                        <h5 className="font-semibold text-sm text-primary mb-1">{getTitle(svc)}</h5>
                        <p className="text-clinic-red font-bold">{svc.price?.toLocaleString()} {t('services.currency')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBranch.Branch_techs?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-primary mb-3">{t('branches.equipment')}</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedBranch.Branch_techs.map((tech: any) => (
                      <div key={tech.id} className="bg-muted rounded-xl p-4">
                        <h5 className="font-semibold text-sm text-primary mb-1">{tech.title}</h5>
                        <p className="text-xs text-muted-foreground">{tech.description}</p>
                      </div>
                    ))}
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
