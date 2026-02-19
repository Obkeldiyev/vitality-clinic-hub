import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CursorBackground from '@/components/CursorBackground';
import { api, MEDIA_BASE, getMediaUrl } from '@/lib/api';
import { ImageIcon, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [gallery, setGallery] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then((res: any) => {
        setGallery(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allMedia = gallery.flatMap((g: any) => g.media || []);

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
          <h1 className="font-display font-bold text-4xl text-white mb-4">{t('gallery.title')}</h1>
          <p className="text-white/70">{t('gallery.label')}</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-white/70">{t('gallery.loading')}</p>
          </div>
        ) : allMedia.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {allMedia.map((m: any) => (
              <div
                key={m.id}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-card"
                onClick={() => setSelected(getMediaUrl(m.url))}
              >
                {m.type?.includes("image") ? (
                  <img src={getMediaUrl(m.url)} alt="" className="w-full h-auto block" />
                ) : (
                  <video src={getMediaUrl(m.url)} className="w-full h-auto block" muted />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/70">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('gallery.empty')}</p>
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

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <img src={selected} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
