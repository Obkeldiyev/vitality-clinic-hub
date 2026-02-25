import { useState, useCallback, useEffect } from "react";
import { Plus, X, Trash2, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import FileUploadPreview from "@/components/FileUploadPreview";

// This is an improved version of the Branches Section with proper file upload handling

interface Service {
  id?: number;
  key?: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
  price: string | number;
  _files?: File[];
  _existing?: boolean;
  _new?: boolean;
}

interface Tech {
  id?: number;
  key?: string;
  title: string;
  description: string;
  _files?: File[];
  _existing?: boolean;
  _new?: boolean;
}

export default function BranchesSection() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: "create" | "edit"; item?: any } | null>(null);
  const [confirm, setConfirm] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", description: "" });
  const [services, setServices] = useState<Service[]>([]);
  const [techs, setTechs] = useState<Tech[]>([]);
  const [branchFiles, setBranchFiles] = useState<File[]>([]);

  const load = useCallback(async () => {
    try {
      const res: any = await api.getBranches();
      setItems(res.data || []);
    } catch (error) {
      console.error("Failed to load branches:", error);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ title: "", description: "" });
    setServices([]);
    setTechs([]);
    setBranchFiles([]);
    setModal({ type: "create" });
  };

  const openEdit = (item: any) => {
    setForm({ title: item.title, description: item.description });
    setServices(
      item.Services?.map((s: any) => ({
        ...s,
        _existing: true,
        _files: [],
      })) || []
    );
    setTechs(
      item.Branch_techs?.map((t: any) => ({
        ...t,
        _existing: true,
        _files: [],
      })) || []
    );
    setBranchFiles([]);
    setModal({ type: "edit", item });
  };

  const addService = () => {
    const newKey = `s${services.length}`;
    setServices((prev) => [
      ...prev,
      {
        key: newKey,
        title_en: "",
        title_ru: "",
        title_uz: "",
        price: "",
        _new: true,
        _files: [],
      },
    ]);
  };

  const addTech = () => {
    const newKey = `t${techs.length}`;
    setTechs((prev) => [
      ...prev,
      {
        key: newKey,
        title: "",
        description: "",
        _new: true,
        _files: [],
      },
    ]);
  };

  const updateService = (index: number, field: string, value: any) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const updateTech = (index: number, field: string, value: any) => {
    setTechs((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const removeTech = (index: number) => {
    setTechs((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!form.title || !form.description) {
      alert("Please fill in title and description");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);

      if (modal?.type === "create") {
        // CREATE: Use keys for services and techs
        const servicesData = services.map((s, idx) => ({
          key: s.key || `s${idx}`,
          title_en: s.title_en,
          title_ru: s.title_ru,
          title_uz: s.title_uz,
          price: Number(s.price) || 0,
        }));

        const techsData = techs.map((t, idx) => ({
          key: t.key || `t${idx}`,
          title: t.title,
          description: t.description,
        }));

        fd.append("services", JSON.stringify(servicesData));
        fd.append("techs", JSON.stringify(techsData));

        // Branch media
        for (const f of branchFiles) {
          fd.append("branch_media", f);
        }

        // Service media - use key from servicesData
        services.forEach((s, idx) => {
          const key = s.key || `s${idx}`;
          if (s._files && s._files.length > 0) {
            for (const f of s._files) {
              fd.append(`service_media__${key}`, f);
            }
          }
        });

        // Tech media - use key from techsData
        techs.forEach((t, idx) => {
          const key = t.key || `t${idx}`;
          if (t._files && t._files.length > 0) {
            for (const f of t._files) {
              fd.append(`tech_media__${key}`, f);
            }
          }
        });

        await (api as any).admin.createBranch(fd);
      } else {
        // EDIT: Separate existing and new items
        const existingServices = services.filter((s) => s._existing && s.id);
        const newServices = services.filter((s) => !s._existing || !s.id);

        const existingTechs = techs.filter((t) => t._existing && t.id);
        const newTechs = techs.filter((t) => !t._existing || !t.id);

        // Services upsert
        const servicesUpsert = [
          ...existingServices.map((s) => ({
            id: s.id,
            title_en: s.title_en,
            title_ru: s.title_ru,
            title_uz: s.title_uz,
            price: Number(s.price) || 0,
          })),
          ...newServices.map((s) => ({
            title_en: s.title_en,
            title_ru: s.title_ru,
            title_uz: s.title_uz,
            price: Number(s.price) || 0,
          })),
        ];

        // Techs upsert
        const techsUpsert = [
          ...existingTechs.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
          })),
          ...newTechs.map((t) => ({
            title: t.title,
            description: t.description,
          })),
        ];

        fd.append("services_upsert", JSON.stringify(servicesUpsert));
        fd.append("techs_upsert", JSON.stringify(techsUpsert));

        // Branch media
        for (const f of branchFiles) {
          fd.append("branch_media", f);
        }

        // Service media for existing services (use ID)
        existingServices.forEach((s) => {
          if (s._files && s._files.length > 0 && s.id) {
            for (const f of s._files) {
              fd.append(`service_media__${s.id}`, f);
            }
          }
        });

        // Service media for new services (use index)
        newServices.forEach((s, idx) => {
          if (s._files && s._files.length > 0) {
            for (const f of s._files) {
              fd.append(`service_media__new__${idx}`, f);
            }
          }
        });

        // Tech media for existing techs (use ID)
        existingTechs.forEach((t) => {
          if (t._files && t._files.length > 0 && t.id) {
            for (const f of t._files) {
              fd.append(`tech_media__${t.id}`, f);
            }
          }
        });

        // Tech media for new techs (use index)
        newTechs.forEach((t, idx) => {
          if (t._files && t._files.length > 0) {
            for (const f of t._files) {
              fd.append(`tech_media__new__${idx}`, f);
            }
          }
        });

        await (api as any).admin.editBranch(modal!.item.id, fd);
      }

      setModal(null);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to save branch");
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const del = async (item: any) => {
    try {
      await (api as any).admin.deleteBranch(item.id);
      setConfirm(null);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete branch");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-primary">Отделения</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">ID</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">Название</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">Услуги</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">Оборудование</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">Врачи</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-semibold text-xs uppercase">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3 text-foreground">{row.id}</td>
                <td className="px-4 py-3 text-foreground">{row.title}</td>
                <td className="px-4 py-3 text-foreground">{row.Services?.length || 0}</td>
                <td className="px-4 py-3 text-foreground">{row.Branch_techs?.length || 0}</td>
                <td className="px-4 py-3 text-foreground">{row.doctors?.length || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(row)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirm(row)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-display font-bold text-primary text-lg">
                {modal.type === "create" ? "Создать отделение" : "Редактировать отделение"}
              </h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Название</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Например: Кардиология"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Описание</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Описание отделения..."
                  />
                </div>
              </div>

              {/* Branch Media */}
              <FileUploadPreview
                files={branchFiles}
                onRemove={(idx) => setBranchFiles((prev) => prev.filter((_, i) => i !== idx))}
                onAdd={(fileList) => setBranchFiles((prev) => [...prev, ...Array.from(fileList)])}
                label="Медиа отделения"
                maxFiles={10}
              />

              {/* Services */}
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">Услуги</label>
                  <button
                    onClick={addService}
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                  >
                    + Добавить услугу
                  </button>
                </div>

                <div className="space-y-3">
                  {services.map((s, i) => (
                    <div key={s.key || s.id || i} className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Услуга #{i + 1} {s._existing && `(ID: ${s.id})`}
                        </span>
                        <button
                          onClick={() => removeService(i)}
                          className="text-destructive hover:opacity-70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          placeholder="Название (RU)"
                          value={s.title_ru}
                          onChange={(e) => updateService(i, "title_ru", e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                        />
                        <input
                          placeholder="Title (EN)"
                          value={s.title_en}
                          onChange={(e) => updateService(i, "title_en", e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                        />
                        <input
                          placeholder="Nomi (UZ)"
                          value={s.title_uz}
                          onChange={(e) => updateService(i, "title_uz", e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                        />
                      </div>

                      <input
                        type="number"
                        placeholder="Цена (UZS)"
                        value={s.price}
                        onChange={(e) => updateService(i, "price", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                      />

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Медиа услуги</label>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const newFiles = Array.from(e.target.files);
                              updateService(i, "_files", [...(s._files || []), ...newFiles]);
                              e.target.value = "";
                            }
                          }}
                          className="text-xs text-muted-foreground"
                        />
                        {s._files && s._files.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {s._files.length} файл(ов) выбрано
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {services.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Нет услуг. Нажмите "Добавить услугу" чтобы создать.
                    </p>
                  )}
                </div>
              </div>

              {/* Techs */}
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">Оборудование</label>
                  <button
                    onClick={addTech}
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                  >
                    + Добавить оборудование
                  </button>
                </div>

                <div className="space-y-3">
                  {techs.map((t, i) => (
                    <div key={t.key || t.id || i} className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Оборудование #{i + 1} {t._existing && `(ID: ${t.id})`}
                        </span>
                        <button
                          onClick={() => removeTech(i)}
                          className="text-destructive hover:opacity-70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        placeholder="Название оборудования"
                        value={t.title}
                        onChange={(e) => updateTech(i, "title", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                      />

                      <textarea
                        placeholder="Описание оборудования"
                        value={t.description}
                        onChange={(e) => updateTech(i, "description", e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none resize-none"
                      />

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Медиа оборудования</label>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const newFiles = Array.from(e.target.files);
                              updateTech(i, "_files", [...(t._files || []), ...newFiles]);
                              e.target.value = "";
                            }
                          }}
                          className="text-xs text-muted-foreground"
                        />
                        {t._files && t._files.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t._files.length} файл(ов) выбрано
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {techs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Нет оборудования. Нажмите "Добавить оборудование" чтобы создать.
                    </p>
                  )}
                </div>
              </div>

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
            <p className="text-foreground mb-6 text-center">
              Удалить отделение "{confirm.title}"?
            </p>
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
