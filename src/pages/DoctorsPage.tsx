import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CursorBackground from '@/components/CursorBackground';
import { api, getMediaUrl } from '@/lib/api';
import { Stethoscope, Award, X, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function DoctorsPage() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDoctors()
      .then((res: any) => {
        setDoctors(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
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
            <h1 className="font-display font-bold text-4xl text-white mb-4">{t('doctors.title')}</h1>
            <p className="text-white/70">{t('doctors.label')}</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-white/70">{t('doctors.loading')}</p>
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc: any) => {
                const img = doc.media?.find((m: any) => m.type?.toUpperCase().includes("IMAGE"));
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border text-center hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="h-56 overflow-hidden bg-muted">
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
          ) : (
            <div className="text-center py-20">
              <Stethoscope className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/70">No doctors available</p>
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

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedDoctor(null)}>
          <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-primary">
                    {selectedDoctor.first_name} {selectedDoctor.second_name}
                  </h2>
                  {selectedDoctor.third_name && (
                    <p className="text-sm text-muted-foreground">{selectedDoctor.third_name}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedDoctor(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Doctor Photo - Full Size */}
              {selectedDoctor.media?.find((m: any) => m.type?.toUpperCase().includes("IMAGE")) && (
                <div className="relative">
                  <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-black">
                    <img
                      src={getMediaUrl(selectedDoctor.media.find((m: any) => m.type?.toUpperCase().includes("IMAGE")).url)}
                      alt={`${selectedDoctor.first_name} ${selectedDoctor.second_name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  {t('doctors.specialization')}
                </h3>
                <p className="text-foreground text-lg leading-relaxed">{selectedDoctor.description}</p>
              </div>

              {/* Branch Info */}
              {selectedDoctor.branch && (
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border border-blue-500/20">
                  <h3 className="text-base font-semibold text-primary mb-2">{t('admin.branch')}</h3>
                  <p className="text-foreground text-lg">{selectedDoctor.branch.title}</p>
                  {selectedDoctor.branch.description && (
                    <p className="text-sm text-muted-foreground mt-2">{selectedDoctor.branch.description}</p>
                  )}
                </div>
              )}

              {/* Awards Section */}
              {selectedDoctor.awards && selectedDoctor.awards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-clinic-red" />
                    {t('doctors.awards')} ({selectedDoctor.awards.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedDoctor.awards.map((award: any) => (
                      <div key={award.id} className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-5 border border-yellow-500/20">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base text-primary mb-1">{award.title}</h4>
                            <p className="text-sm text-muted-foreground">{award.level}</p>
                          </div>
                        </div>
                        {/* Award Media */}
                        {award.media && award.media.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {award.media.map((media: any) => (
                              <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <img 
                                  src={getMediaUrl(media.url)} 
                                  alt={award.title} 
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        )}
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
