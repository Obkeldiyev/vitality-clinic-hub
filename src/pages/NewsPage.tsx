import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CursorBackground from '@/components/CursorBackground';
import { api, MEDIA_BASE, getMediaUrl } from '@/lib/api';
import { getTitle, getDescription } from '@/lib/i18nHelpers';
import { Newspaper, X, ArrowLeft, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function NewsPage() {
  const { t } = useTranslation();
  const [news, setNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNews()
      .then((res: any) => {
        console.log("NewsPage - Full response:", res);
        console.log("NewsPage - Data:", res.data);
        if (res.data && res.data.length > 0) {
          console.log("NewsPage - First item:", res.data[0]);
          console.log("NewsPage - First item media:", res.data[0].media);
        }
        setNews(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("NewsPage - Error:", err);
        setLoading(false);
      });
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
            <h1 className="font-display font-bold text-4xl text-white mb-4">{t('news.title')}</h1>
            <p className="text-white/70">{t('news.label')}</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-white/70">{t('news.loading')}</p>
            </div>
          ) : news.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-7">
            {news.map((item: any) => {
              console.log("NewsPage - Rendering item:", item.id, item);
              console.log("NewsPage - Item media:", item.media);
              const img = item.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
              console.log("NewsPage - Found image:", img);
              if (img) {
                console.log("NewsPage - Image URL:", img.url);
                console.log("NewsPage - Full media URL:", getMediaUrl(img.url));
              }
              return (
                <div
                  key={item.id}
                  onClick={() => { setSelectedNews(item); setCurrentMediaIndex(0); }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border hover:-translate-y-1 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden bg-muted">
                    {img ? (
                      <img
                        src={getMediaUrl(img.url)}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => console.error("NewsPage - Image failed to load:", img.url, e)}
                        onLoad={() => console.log("NewsPage - Image loaded successfully:", img.url)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(var(--primary)/0.06)" }}>
                        <Newspaper className="w-12 h-12 text-primary/25" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-primary text-base mb-2 group-hover:text-clinic-red transition-colors line-clamp-2">
                      {getTitle(item)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {getDescription(item)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70">No news available</p>
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

      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => { setSelectedNews(null); setCurrentMediaIndex(0); }}>
          <div className="bg-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
              <h2 className="font-display font-bold text-3xl text-primary pr-4">{getTitle(selectedNews)}</h2>
              <button onClick={() => { setSelectedNews(null); setCurrentMediaIndex(0); }} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Media Slider */}
              {selectedNews.media && selectedNews.media.length > 0 && (
                <div className="relative mb-6 bg-black rounded-xl overflow-hidden">
                  <div className="aspect-video flex items-center justify-center">
                    {selectedNews.media[currentMediaIndex].type?.includes("image") ? (
                      <img
                        src={getMediaUrl(selectedNews.media[currentMediaIndex].url)}
                        alt={getTitle(selectedNews)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={getMediaUrl(selectedNews.media[currentMediaIndex].url)}
                          className="w-full h-full object-contain"
                          controls
                          controlsList="nodownload"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {selectedNews.media.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex((prev) => (prev === 0 ? selectedNews.media.length - 1 : prev - 1)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex((prev) => (prev === selectedNews.media.length - 1 ? 0 : prev + 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Media Counter */}
                  {selectedNews.media.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentMediaIndex + 1} / {selectedNews.media.length}
                    </div>
                  )}

                  {/* Thumbnails */}
                  {selectedNews.media.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-lg">
                      {selectedNews.media.map((m: any, idx: number) => (
                        <button
                          key={m.id}
                          onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex(idx); }}
                          className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                            idx === currentMediaIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          {m.type?.includes("image") ? (
                            <img src={getMediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Description */}
              <div>
                <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">{getDescription(selectedNews)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
