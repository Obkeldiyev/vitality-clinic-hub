import { useState, useCallback, useEffect } from "react";
import { Plus, X, Trash2, Pencil, Newspaper } from "lucide-react";
import { api, getMediaUrl } from "@/lib/api";
import FileUploadPreview from "@/components/FileUploadPreview";

export default function NewsSection() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: "create" | "edit" | "view"; item?: any } | null>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({
    title_uz: "",
    title_ru: "",
    title_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const r: any = await api.getNews();
      setItems(r.data || []);
    } catch (error) {
      console.error("Failed to load news:", error);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({
      title_uz: "",
      title_ru: "",
      title_en: "",
      description_uz: "",
      description_ru: "",
      description_en: "",
    });
    setFiles([]);
    setModal({ type: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      title_uz: item.title_uz,
      title_ru: item.title_ru,
      title_en: item.title_en,
      description_uz: item.description_uz,
      description_ru: item.description_ru,
      description_en: item.description_en,
    });
    setFiles([]);
    setModal({ type: "edit", item });
  };

  const openView = (item: any) => {
    setModal({ type: "view", item });
  };

  const save = async () => {
    if (!form.title_en || !form.title_ru || !form.title_uz) {
      alert("Please fill in all titles");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      
      // Append all form fields
      fd.append("title_uz", form.title_uz);
      fd.append("title_ru", form.title_ru);
      fd.append("title_en", form.title_en);
      fd.append("description_uz", form.description_uz);
      fd.append("description_ru", form.description_ru);
      fd.append("description_en", form.description_en);

      // Append all files with field name "media"
      for (const f of files) {
        fd.append("media", f);
      }

      if (modal?.type === "create") {
        await api.admin.createNews(fd);
      } else {
        await api.admin.updateNews(modal!.item.id, fd);
      }

      setModal(null);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to save news");
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const del = async (item: any) => {
    try {
      await api.admin.deleteNews(item.id);
      setConfirm(null);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete news");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-primary">Новости</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {items.map((item: any) => {
          const img = item.media?.find((m: any) => m.type === "image" || m.type?.includes("image"));
          return (
            <div
              key={item.id}
              className="group relative bg-card rounded-xl overflow-hidden shadow-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openView(item)}
            >
              <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                {img ? (
                  <img
                    src={getMediaUrl(img.url)}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Newspaper className="w-10 h-10 text-muted-foreground/30" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-primary truncate">
                  {item.title_ru || item.title_en}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description_ru || item.description_en}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.media?.length || 0} медиа
                </p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(item);
                  }}
                  className="p-1.5 rounded-lg bg-white/90 text-primary shadow hover:bg-white"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm(item);
                  }}
                  className="p-1.5 rounded-lg bg-white/90 text-destructive shadow hover:bg-white"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Нет новостей. Нажмите "Добавить" чтобы создать.</p>
        </div>
      )}

      {/* View Modal */}
      {modal?.type === "view" && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-display font-bold text-primary text-lg">
                {modal.item.title_ru || modal.item.title_en}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modal.item.media && modal.item.media.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {modal.item.media.map((m: any) =>
                    m ? (
                      <div
                        key={m.id}
                        className="aspect-video rounded-lg overflow-hidden bg-muted border border-border"
                      >
                        {m.type?.includes("image") ? (
                          <img
                            src={getMediaUrl(m.url)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={getMediaUrl(m.url)}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">🇷🇺 Русский</p>
                  <p className="text-base font-semibold mb-2">{modal.item.title_ru}</p>
                  <p className="text-sm text-muted-foreground">{modal.item.description_ru}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary mb-1">🇬🇧 English</p>
                  <p className="text-base font-semibold mb-2">{modal.item.title_en}</p>
                  <p className="text-sm text-muted-foreground">{modal.item.description_en}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary mb-1">🇺🇿 O'zbekcha</p>
                  <p className="text-base font-semibold mb-2">{modal.item.title_uz}</p>
                  <p className="text-sm text-muted-foreground">{modal.item.description_uz}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-display font-bold text-primary text-lg">
                {modal.type === "create" ? "Добавить новость" : "Редактировать новость"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Titles */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Заголовок (RU) *
                  </label>
                  <input
                    value={form.title_ru}
                    onChange={(e) => setForm({ ...form, title_ru: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Заголовок на русском"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Title (EN) *
                  </label>
                  <input
                    value={form.title_en}
                    onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Title in English"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Sarlavha (UZ) *
                  </label>
                  <input
                    value={form.title_uz}
                    onChange={(e) => setForm({ ...form, title_uz: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="O'zbekcha sarlavha"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Текст (RU)
                  </label>
                  <textarea
                    value={form.description_ru}
                    onChange={(e) => setForm({ ...form, description_ru: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Описание на русском..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Description (EN)
                  </label>
                  <textarea
                    value={form.description_en}
                    onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Description in English..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Matn (UZ)
                  </label>
                  <textarea
                    value={form.description_uz}
                    onChange={(e) => setForm({ ...form, description_uz: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="O'zbekcha matn..."
                  />
                </div>
              </div>

              {/* File Upload */}
              <FileUploadPreview
                files={files}
                onRemove={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                onAdd={(fileList) => setFiles((prev) => [...prev, ...Array.from(fileList)])}
                label="Изображения и видео"
                maxFiles={15}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-2 sticky bottom-0 bg-card pb-2">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                  disabled={loading}
                >
                  Отмена
                </button>
                <button
                  onClick={save}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <p className="text-foreground mb-6 text-center">Удалить новость?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => del(confirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-destructive hover:opacity-90 transition-opacity"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
