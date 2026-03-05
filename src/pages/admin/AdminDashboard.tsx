import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, MEDIA_BASE, getMediaUrl, getRole } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard, Building2, Stethoscope, Newspaper, Image as ImageIcon,
  BarChart3, MessageSquare, Users, Info, Phone, LogOut, Plus, Pencil,
  Trash2, CheckCircle, X, ChevronDown, ChevronRight, Menu, Check
} from "lucide-react";

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout, sidebarOpen, setSidebarOpen }: any) {
  const { t } = useTranslation();
  
  const SECTIONS = [
    { key: "overview", label: t('admin.overview'), icon: LayoutDashboard },
    { key: "branches", label: t('admin.branches'), icon: Building2 },
    { key: "doctors", label: t('admin.doctors'), icon: Stethoscope },
    { key: "news", label: t('admin.news'), icon: Newspaper },
    { key: "gallery", label: t('admin.gallery'), icon: ImageIcon },
    { key: "statistics", label: t('admin.statistics'), icon: BarChart3 },
    { key: "feedback", label: t('admin.feedback'), icon: MessageSquare },
    { key: "receptions", label: t('admin.receptions'), icon: Users },
    { key: "about", label: t('admin.about'), icon: Info },
    { key: "contacts", label: t('admin.contacts'), icon: Phone },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed left-0 top-0 h-full w-64 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`} style={{ background: "hsl(var(--sidebar-background))" }}>
        <div className="p-5 border-b border-sidebar-border">
          <img src={logo} alt="ASL Medline" className="h-10 w-auto" />
          <p className="text-sidebar-foreground/60 text-xs mt-2 font-medium uppercase tracking-widest">{t('admin.dashboard')}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActive(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                active === key
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <LanguageSwitcher openUpward={true} />
          <Link to="/" className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground text-xs transition-colors">
            <ChevronRight className="w-3 h-3" /> {t('admin.toWebsite')}
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Generic Modal ──────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display font-bold text-primary text-lg">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, message }: any) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <p className="text-foreground mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-destructive hover:opacity-90 transition-opacity">{t('admin.delete')}</button>
        </div>
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────
function DataTable({ columns, rows, onEdit, onDelete, onCustom, onView }: any) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border" style={{ background: "hsl(var(--muted))" }}>
            {columns.map((c: any) => (
              <th key={c.key} className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{c.label}</th>
            ))}
            <th className="text-right px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr 
              key={row.id || i} 
              className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => onView && onView(row)}
            >
              {columns.map((c: any) => (
                <td key={c.key} className="px-4 py-3 text-foreground">
                  {c.render ? c.render(row) : String(row[c.key] ?? "-").slice(0, 60)}
                </td>
              ))}
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-2">
                  {onCustom && onCustom(row)}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">{t('admin.noData')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────
function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-bold text-2xl text-primary">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> {t('admin.add')}
        </button>
      )}
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────────────────
function OverviewSection() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ branches: 0, doctors: 0, news: 0, gallery: 0, stats: 0, feedback: 0, receptions: 0, contacts: 0 });
  useEffect(() => {
    Promise.allSettled([
      api.getBranches(), api.getDoctors(), api.getNews(), api.getGallery(),
      api.getStatistics(), api.admin.getAllFeedbacks(), api.admin.getReceptions(), api.getContacts()
    ]).then(([b, d, n, g, s, f, r, c]) => {
      setCounts({
        branches: ((b as any).value?.data?.length || 0),
        doctors: ((d as any).value?.data?.length || 0),
        news: ((n as any).value?.data?.length || 0),
        gallery: ((g as any).value?.data?.length || 0),
        stats: ((s as any).value?.data?.length || 0),
        feedback: ((f as any).value?.data?.length || 0),
        receptions: ((r as any).value?.data?.length || 0),
        contacts: ((c as any).value?.data?.length || 0),
      });
    });
  }, []);

  const cards = [
    { label: t('admin.branches'), count: counts.branches, icon: Building2, color: "hsl(225,75%,28%)" },
    { label: t('admin.doctors'), count: counts.doctors, icon: Stethoscope, color: "hsl(200,80%,40%)" },
    { label: t('admin.news'), count: counts.news, icon: Newspaper, color: "hsl(160,60%,40%)" },
    { label: t('admin.gallery'), count: counts.gallery, icon: ImageIcon, color: "hsl(280,60%,50%)" },
    { label: t('admin.statistics'), count: counts.stats, icon: BarChart3, color: "hsl(30,80%,50%)" },
    { label: t('admin.feedbacks'), count: counts.feedback, icon: MessageSquare, color: "hsl(0,74%,55%)" },
    { label: t('admin.receptions'), count: counts.receptions, icon: Users, color: "hsl(180,60%,40%)" },
    { label: t('admin.contacts'), count: counts.contacts, icon: Phone, color: "hsl(240,60%,55%)" },
  ];

  return (
    <div>
      <SectionHeader title={t('admin.overview')} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-2xl p-5 shadow-card border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "22" }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-display font-black" style={{ color }}>{count}</p>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Branches Section ───────────────────────────────────────────────────
function BranchesSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: "create" | "edit" | "view"; item?: any } | null>(null);
  const [confirm, setConfirm] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Branch form state
  const [form, setForm] = useState({ title: "", description: "" });
  const [services, setServices] = useState<any[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [branchFiles, setBranchFiles] = useState<File[]>([]);

  const load = useCallback(async () => {
    const res: any = await api.getBranches().catch(() => ({ data: [] }));
    setItems(res.data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ title: "", description: "" });
    setServices([]);
    setTechs([]);
    setBranchFiles([]);
    setModal({ type: "create" });
  };

  const openEdit = (item: any) => {
    setForm({ title: item.title, description: item.description });
    setServices(item.Services?.map((s: any) => ({ ...s, _existing: true })) || []);
    setTechs(item.Branch_techs?.map((t: any) => ({ ...t, _existing: true })) || []);
    setBranchFiles([]);
    setModal({ type: "edit", item });
  };

  const addService = () => setServices(prev => [...prev, { key: `s${Date.now()}`, title_en: "", title_ru: "", title_uz: "", price: "", _new: true }]);
  const addTech = () => setTechs(prev => [...prev, { key: `t${Date.now()}`, title: "", description: "", _new: true }]);

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);

      if (modal?.type === "create") {
        // For CREATE: backend expects services and techs arrays WITHOUT keys
        const svcData = services.map(s => ({ 
          title_en: s.title_en, 
          title_ru: s.title_ru, 
          title_uz: s.title_uz, 
          price: Number(s.price) 
        }));
        const techData = techs.map(t => ({ 
          title: t.title, 
          description: t.description 
        }));
        
        fd.append("services", JSON.stringify(svcData));
        fd.append("techs", JSON.stringify(techData));
        
        // Branch media
        for (const f of branchFiles) fd.append("branch_media", f);
        
        // Service media - use INDEX not key
        services.forEach((s, index) => {
          if (s._files) {
            for (const f of s._files) {
              fd.append(`service_media__${index}`, f);
            }
          }
        });
        
        // Tech media - use INDEX not key
        techs.forEach((t, index) => {
          if (t._files) {
            for (const f of t._files) {
              fd.append(`tech_media__${index}`, f);
            }
          }
        });
        
        await api.admin.createBranch(fd);
      } else {
        // For EDIT: different logic
        const svcUpsert = services.map(s => s._existing ? { 
          id: s.id, 
          title_en: s.title_en, 
          title_ru: s.title_ru, 
          title_uz: s.title_uz, 
          price: Number(s.price) 
        } : { 
          title_en: s.title_en, 
          title_ru: s.title_ru, 
          title_uz: s.title_uz, 
          price: Number(s.price) 
        });
        
        const techUpsert = techs.map(t => t._existing ? { 
          id: t.id, 
          title: t.title, 
          description: t.description 
        } : { 
          title: t.title, 
          description: t.description 
        });
        
        fd.append("services_upsert", JSON.stringify(svcUpsert));
        fd.append("techs_upsert", JSON.stringify(techUpsert));
        
        // Branch media
        for (const f of branchFiles) fd.append("branch_media", f);
        
        // Service media
        let newServiceIndex = 0;
        services.forEach((s) => {
          if (s._files && s._files.length > 0) {
            if (s._existing) {
              // Existing service: use service ID
              for (const f of s._files) {
                fd.append(`service_media__${s.id}`, f);
              }
            } else {
              // New service: use new index
              for (const f of s._files) {
                fd.append(`service_media__new__${newServiceIndex}`, f);
              }
              newServiceIndex++;
            }
          } else if (!s._existing) {
            // Count new services even without files
            newServiceIndex++;
          }
        });
        
        // Tech media
        let newTechIndex = 0;
        techs.forEach((t) => {
          if (t._files && t._files.length > 0) {
            if (t._existing) {
              // Existing tech: use tech ID
              for (const f of t._files) {
                fd.append(`tech_media__${t.id}`, f);
              }
            } else {
              // New tech: use new index
              for (const f of t._files) {
                fd.append(`tech_media__new__${newTechIndex}`, f);
              }
              newTechIndex++;
            }
          } else if (!t._existing) {
            // Count new techs even without files
            newTechIndex++;
          }
        });
        
        await api.admin.editBranch(modal!.item.id, fd);
      }
      setModal(null);
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const del = async (item: any) => {
    try {
      await api.admin.deleteBranch(item.id);
      setConfirm(null);
      load();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div>
      <SectionHeader title={t('admin.branches')} onAdd={openCreate} />
      <DataTable
        columns={[
          { 
            key: "photo", 
            label: t('admin.photo'), 
            render: (r: any) => {
              const img = r.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
              return img ? (
                <img src={getMediaUrl(img.url)} alt={r.title} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary/30" />
                </div>
              );
            }
          },
          { key: "title", label: t('admin.title') },
          { key: "Services", label: t('admin.services'), render: (r: any) => r.Services?.length || 0 },
          { key: "Branch_techs", label: t('admin.equipment'), render: (r: any) => r.Branch_techs?.length || 0 },
          { key: "doctors", label: t('admin.doctors'), render: (r: any) => r.doctors?.length || 0 },
        ]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onEdit={openEdit}
        onDelete={(r: any) => setConfirm(r)}
      />

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.createBranch') : t('admin.editBranchTitle')}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('admin.branchTitle')}</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('admin.branchDescription')}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('admin.branchMediaLabel')}</label>
            <div className="space-y-2">
              {/* Show existing photos in edit mode */}
              {modal?.type === "edit" && modal.item?.media?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {modal.item.media.filter((m: any) => m.type?.includes("image")).map((m: any) => (
                    <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setBranchFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {branchFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{branchFiles.length} {t('admin.filesSelectedCount')}</p>
                  {branchFiles.map((f, idx) => f && (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded text-xs">
                      <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => setBranchFiles(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">{t('admin.services')}</label>
              <button onClick={addService} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">{t('admin.addServiceBtn')}</button>
            </div>
            {services.map((s, i) => (
              <div key={s.key || s.id} className="bg-muted/50 rounded-xl p-3 mb-2 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="RU" value={s.title_ru} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_ru: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input placeholder="EN" value={s.title_en} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_en: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input placeholder="UZ" value={s.title_uz} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_uz: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder={t('admin.price')} value={s.price} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    multiple
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files);
                        setServices(prev => prev.map((x, j) => j === i ? { ...x, _files: [...(x._files || []), ...newFiles] } : x));
                        e.target.value = '';
                      }
                    }} 
                    className="text-xs text-muted-foreground flex-1" 
                  />
                  <button onClick={() => setServices(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
                {s._files && s._files.length > 0 && (
                  <p className="text-xs text-muted-foreground">{s._files.length} {t('admin.filesCount')}</p>
                )}
              </div>
            ))}
          </div>

          {/* Techs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">{t('admin.equipment')}</label>
              <button onClick={addTech} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">{t('admin.addEquipmentBtn')}</button>
            </div>
            {techs.map((t, i) => (
              <div key={t.key || t.id} className="bg-muted/50 rounded-xl p-3 mb-2 space-y-2">
                <div className="flex gap-2">
                  <input placeholder={t('admin.branchTitle')} value={t.title} onChange={e => setTechs(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <button onClick={() => setTechs(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
                <input placeholder={t('admin.description')} value={t.description} onChange={e => setTechs(prev => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      const newFiles = Array.from(e.target.files);
                      setTechs(prev => prev.map((x, j) => j === i ? { ...x, _files: [...(x._files || []), ...newFiles] } : x));
                      e.target.value = '';
                    }
                  }} 
                  className="text-xs text-muted-foreground" 
                />
                {t._files && t._files.length > 0 && (
                  <p className="text-xs text-muted-foreground">{t._files.length} {t('admin.filesCount')}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={modal?.item?.title || ""}>
        {modal?.item && (
          <div className="space-y-4">
            {modal.item.media?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {modal.item.media.filter((m: any) => m.type?.includes("image")).map((m: any) => (
                  <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-full h-32 object-cover rounded-xl" />
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">{modal.item.description}</p>
            {modal.item.Services?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-primary mb-2">{t('admin.services')} ({modal.item.Services.length})</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {modal.item.Services.map((s: any) => (
                    <div key={s.id} className="text-xs p-2 bg-muted/50 rounded">{s.title_uz || s.title_en} - {s.price} {t('services.currency')}</div>
                  ))}
                </div>
              </div>
            )}
            {modal.item.Branch_techs?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-primary mb-2">{t('admin.equipment')} ({modal.item.Branch_techs.length})</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {modal.item.Branch_techs.map((t: any) => (
                    <div key={t.id} className="text-xs p-2 bg-muted/50 rounded">{t.title}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`${t('admin.deleteBranchConfirm')} "${confirm?.title}"?`} />
    </div>
  );
}

// ── Doctors Section ────────────────────────────────────────────────────
function DoctorsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: string; item?: any } | null>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ first_name: "", second_name: "", third_name: "", description: "", branch_id: "" });
  const [doctorFiles, setDoctorFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [dRes, bRes] = await Promise.allSettled([api.getDoctors(), api.getBranches()]);
    setItems((dRes as any).value?.data || []);
    setBranches((bRes as any).value?.data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("first_name", form.first_name);
      fd.append("second_name", form.second_name);
      fd.append("third_name", form.third_name);
      fd.append("description", form.description);
      fd.append("branch_id", form.branch_id);
      for (const f of doctorFiles) fd.append("doctor_media", f);
      if (modal?.type === "create") await api.admin.createDoctor(fd);
      else await api.admin.editDoctor(modal!.item.id, fd);
      setModal(null);
      load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => {
    try { await api.admin.deleteDoctor(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div>
      <SectionHeader title={t('admin.doctors')} onAdd={() => { setForm({ first_name: "", second_name: "", third_name: "", description: "", branch_id: "" }); setDoctorFiles([]); setModal({ type: "create" }); }} />
      <DataTable
        columns={[
          { 
            key: "photo", 
            label: t('admin.photo'), 
            render: (r: any) => {
              const img = r.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
              return img ? (
                <img src={getMediaUrl(img.url)} alt={`${r.first_name} ${r.second_name}`} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary/30" />
                </div>
              );
            }
          },
          { key: "first_name", label: t('admin.name'), render: (r: any) => `${r.first_name} ${r.second_name}` },
          { key: "description", label: t('admin.description'), render: (r: any) => (r.description || "").slice(0, 40) + "..." },
          { key: "branch", label: t('admin.branch'), render: (r: any) => r.branch?.title || r.branch_id },
        ]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onEdit={(r: any) => { setForm({ first_name: r.first_name, second_name: r.second_name, third_name: r.third_name || "", description: r.description, branch_id: String(r.branch_id) }); setDoctorFiles([]); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.createDoctor') : t('admin.editDoctor')}>
        <div className="space-y-3">
          {[["first_name", t('admin.firstName')], ["second_name", t('admin.lastName')], ["third_name", t('admin.middleNameOptional')]].map(([k, label]) => (
            <div key={k}>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.descriptionSpecialization')}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.branch')}</label>
            <select value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
              <option value="">{t('admin.selectDepartment')}</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.doctorPhotoLabel')}</label>
            <div className="space-y-2">
              {/* Show existing photos in edit mode */}
              {modal?.type === "edit" && modal.item?.media?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {modal.item.media.filter((m: any) => m.type?.includes("image")).map((m: any) => (
                    <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setDoctorFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {doctorFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{doctorFiles.length} {t('admin.filesSelectedCount')}</p>
                  {doctorFiles.map((f, idx) => f && (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded text-xs">
                      <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => setDoctorFiles(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={modal?.item ? `${modal.item.first_name} ${modal.item.second_name}` : ""}>
        {modal?.item && (
          <div className="space-y-4">
            {modal.item.media?.length > 0 && (
              <div className="flex justify-center">
                {modal.item.media.filter((m: any) => m.type?.includes("image")).slice(0, 1).map((m: any) => (
                  <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-48 h-48 object-cover rounded-full border-4 border-primary/20" />
                ))}
              </div>
            )}
            {modal.item.third_name && <p className="text-sm text-muted-foreground text-center">{modal.item.third_name}</p>}
            <p className="text-sm text-muted-foreground">{modal.item.description}</p>
            {modal.item.branch && (
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">{t('admin.branch')}</p>
                <p className="text-sm font-semibold text-primary">{modal.item.branch.title}</p>
              </div>
            )}
            {modal.item.awards?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-primary mb-2">{t('admin.awards')} ({modal.item.awards.length})</p>
                <div className="space-y-1">
                  {modal.item.awards.map((a: any) => (
                    <div key={a.id} className="text-xs p-2 bg-muted/50 rounded">{a.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`${t('admin.deleteDoctorConfirm')} "${confirm?.first_name} ${confirm?.second_name}"?`} />
    </div>
  );
}

// ── News Section ───────────────────────────────────────────────────────
function NewsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ title_uz: "", title_ru: "", title_en: "", description_uz: "", description_ru: "", description_en: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.getNews().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      for (const f of files) fd.append("media", f);
      if (modal?.type === "create") await api.admin.createNews(fd);
      else await api.admin.updateNews(modal.item.id, fd);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => { try { await api.admin.deleteNews(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  const openCreate = () => { setForm({ title_uz: "", title_ru: "", title_en: "", description_uz: "", description_ru: "", description_en: "" }); setFiles([]); setModal({ type: "create" }); };
  const openEdit = (item: any) => { setForm({ title_uz: item.title_uz, title_ru: item.title_ru, title_en: item.title_en, description_uz: item.description_uz, description_ru: item.description_ru, description_en: item.description_en }); setFiles([]); setModal({ type: "edit", item }); };
  const openView = (item: any) => { setModal({ type: "view", item }); };

  return (
    <div>
      <SectionHeader title={t('admin.newsTitle')} onAdd={openCreate} />
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {items.map((item: any) => {
          const img = item.media?.find((m: any) => m.type === "image" || m.type?.includes("image"));
          return (
            <div key={item.id} className="group relative bg-card rounded-xl overflow-hidden shadow-card border border-border cursor-pointer" onClick={() => openView(item)}>
              <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                {img ? (
                  <img src={getMediaUrl(img.url)} alt="" className="w-full h-full object-cover" />
                ) : <Newspaper className="w-10 h-10 text-muted-foreground/30" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-primary truncate">{item.title_ru || item.title_en}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description_ru || item.description_en}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.media?.length || 0} {t('admin.mediaCount')}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="p-1.5 rounded-lg bg-white/90 text-primary shadow"><Pencil className="w-3 h-3" /></button>
                <button onClick={(e) => { e.stopPropagation(); setConfirm(item); }} className="p-1.5 rounded-lg bg-white/90 text-destructive shadow"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {modal?.type === "view" && (
        <Modal open={true} onClose={() => setModal(null)} title={modal.item.title_ru || modal.item.title_en}>
          <div className="space-y-4">
            {modal.item.media && modal.item.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {modal.item.media.map((m: any) => m && (
                  <div key={m.id} className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {m.type?.includes("image") ? (
                      <img src={getMediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={getMediaUrl(m.url)} className="w-full h-full object-cover" controls />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-primary mb-2">RU: {modal.item.title_ru}</p>
              <p className="text-sm text-muted-foreground mb-3">{modal.item.description_ru}</p>
              <p className="text-sm font-semibold text-primary mb-2">EN: {modal.item.title_en}</p>
              <p className="text-sm text-muted-foreground mb-3">{modal.item.description_en}</p>
              <p className="text-sm font-semibold text-primary mb-2">UZ: {modal.item.title_uz}</p>
              <p className="text-sm text-muted-foreground">{modal.item.description_uz}</p>
            </div>
          </div>
        </Modal>
      )}

      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addNewsTitle') : t('admin.editNewsTitle')}>
        <div className="space-y-3">
          {[["title_ru", t('admin.headerRU')], ["title_en", t('admin.headerEN')], ["title_uz", t('admin.headerUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          {[["description_ru", t('admin.textRU')], ["description_en", t('admin.textEN')], ["description_uz", t('admin.textUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <textarea value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.images')}</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} {t('admin.filesSelectedCount')}</p>
                  {files.map((f, idx) => f && (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded text-xs">
                      <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.save')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteNewsConfirm')} />
    </div>
  );
}

// ── Gallery Section ────────────────────────────────────────────────────
function GalleryAdminSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ title_uz: "", title_ru: "", title_en: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.getGallery().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      for (const f of files) fd.append("media", f);
      if (modal?.type === "create") await api.admin.createGallery(fd);
      else await api.admin.updateGallery(modal.item.id, fd);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => { try { await api.admin.deleteGallery(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  const openView = (item: any) => { setModal({ type: "view", item }); };
  const openEdit = (item: any) => { setForm({ title_uz: item.title_uz, title_ru: item.title_ru, title_en: item.title_en }); setFiles([]); setModal({ type: "edit", item }); };

  return (
    <div>
      <SectionHeader title={t('admin.galleryTitle')} onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "" }); setFiles([]); setModal({ type: "create" }); }} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {items.map((g: any) => (
          <div key={g.id} className="group relative bg-card rounded-xl overflow-hidden shadow-card border border-border cursor-pointer" onClick={() => openView(g)}>
            <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
              {g.media?.[0] ? (
                <img src={getMediaUrl(g.media[0].url)} alt="" className="w-full h-full object-cover" />
              ) : <ImageIcon className="w-10 h-10 text-muted-foreground/30" />}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-primary truncate">{g.title_ru || g.title_en}</p>
              <p className="text-xs text-muted-foreground">{g.media?.length || 0} {t('admin.mediaCount')}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); openEdit(g); }} className="p-1.5 rounded-lg bg-white/90 text-primary shadow"><Pencil className="w-3 h-3" /></button>
              <button onClick={(e) => { e.stopPropagation(); setConfirm(g); }} className="p-1.5 rounded-lg bg-white/90 text-destructive shadow"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {modal?.type === "view" && (
        <Modal open={true} onClose={() => setModal(null)} title={modal.item.title_uz || modal.item.title_ru || modal.item.title_en}>
          <div className="space-y-4">
            {modal.item.media && modal.item.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {modal.item.media.map((m: any) => m && (
                  <div key={m.id} className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {m.type?.includes("image") ? (
                      <img src={getMediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={getMediaUrl(m.url)} className="w-full h-full object-cover" controls />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">UZ</p>
              <p className="text-sm font-semibold text-primary">{modal.item.title_uz}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">RU</p>
              <p className="text-sm font-semibold text-primary">{modal.item.title_ru}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">EN</p>
              <p className="text-sm font-semibold text-primary">{modal.item.title_en}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit/Create Modal */}
      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addGalleryTitle') : t('admin.editGalleryTitle')}>
        <div className="space-y-3">
          {[["title_ru", t('admin.nameRU')], ["title_en", t('admin.nameEN')], ["title_uz", t('admin.nameUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.mediaFiles')}</label>
            <div className="space-y-2">
              {/* Show existing photos in edit mode */}
              {modal?.type === "edit" && modal.item?.media?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {modal.item.media.filter((m: any) => m.type?.includes("image")).map((m: any) => (
                    <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} {t('admin.filesSelectedCount')}</p>
                  {files.map((f, idx) => f && (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded text-xs">
                      <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.save')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteGalleryConfirm')} />
    </div>
  );
}

// ── Statistics Section ─────────────────────────────────────────────────
function StatisticsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ title_uz: "", title_ru: "", title_en: "", number: "" });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.getStatistics().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      const data = { ...form, number: Number(form.number) };
      if (modal?.type === "create") await api.admin.createStat(data);
      else await api.admin.editStat(modal.item.id, data);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => { try { await api.admin.deleteStat(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title={t('admin.statisticsTitle')} onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "", number: "" }); setModal({ type: "create" }); }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-4">
        {items.map((s: any) => (
          <div key={s.id} className="stat-card relative group">
            <div className="text-4xl font-display font-black text-primary mb-1">{s.number?.toLocaleString()}<span className="text-clinic-red">+</span></div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.title_ru || s.title_en}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({ title_uz: s.title_uz, title_ru: s.title_ru, title_en: s.title_en, number: String(s.number) }); setModal({ type: "edit", item: s }); }} className="p-1.5 rounded-lg bg-white text-primary shadow"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setConfirm(s)} className="p-1.5 rounded-lg bg-white text-destructive shadow"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addStatisticTitle') : t('admin.editTitle')}>
        <div className="space-y-3">
          {[["title_ru", t('admin.nameRU')], ["title_en", t('admin.nameEN')], ["title_uz", t('admin.nameUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.numberLabel')}</label>
            <input type="number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.save')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteStatisticConfirm')} />
    </div>
  );
}

// ── Feedback Section ───────────────────────────────────────────────────
function FeedbackAdminSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);

  const load = useCallback(async () => { const r: any = await api.admin.getAllFeedbacks().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const approve = async (id: number) => { try { await api.admin.approveFeedback(id); load(); } catch (err: any) { alert(err.message); } };
  const del = async (item: any) => { try { await api.admin.deleteFeedback(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title={t('admin.feedbackTitle')} />
      <DataTable
        columns={[
          { key: "full_name", label: t('admin.name') },
          { key: "phone_number", label: t('admin.phoneNumber') },
          { key: "content", label: t('admin.review'), render: (r: any) => r.content?.slice(0, 50) + "..." },
          { key: "isApproved", label: t('admin.statusLabel'), render: (r: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.isApproved ? t('admin.approved') : t('admin.waiting')}</span> },
        ]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onDelete={(r: any) => setConfirm(r)}
        onCustom={(r: any) => !r.isApproved && (
          <button onClick={() => approve(r.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      />

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={t('admin.feedbackDetails')}>
        {modal?.item && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.name')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.full_name}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.phoneNumber')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.phone_number}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.review')}</p>
              <p className="text-sm text-foreground">{modal.item.content}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.statusLabel')}</p>
              <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${modal.item.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {modal.item.isApproved ? t('admin.approved') : t('admin.waiting')}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteFeedbackConfirm')} />
    </div>
  );
}

// ── Receptions Section ─────────────────────────────────────────────────
function ReceptionsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ first_name: "", second_name: "", username: "", password: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.admin.getReceptions().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      for (const f of files) fd.append("media", f);
      await api.admin.createReception(fd);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => { try { await api.admin.deleteReception(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title={t('admin.receptionistsTitle')} onAdd={() => { setForm({ first_name: "", second_name: "", username: "", password: "" }); setFiles([]); setModal({ type: "create" }); }} />
      <DataTable
        columns={[
          { 
            key: "photo", 
            label: t('admin.photo'), 
            render: (r: any) => {
              const img = r.media?.find((m: any) => m.type?.includes("image") || m.type?.toUpperCase().includes("IMAGE"));
              return img ? (
                <img src={getMediaUrl(img.url)} alt={`${r.first_name} ${r.second_name}`} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary/30" />
                </div>
              );
            }
          },
          { key: "first_name", label: t('admin.name'), render: (r: any) => `${r.first_name} ${r.second_name}` },
          { key: "username", label: t('admin.loginLabel') },
        ]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onDelete={(r: any) => setConfirm(r)}
      />

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={modal?.item ? `${modal.item.first_name} ${modal.item.second_name}` : ""}>
        {modal?.item && (
          <div className="space-y-4">
            {modal.item.media?.length > 0 && (
              <div className="flex justify-center">
                {modal.item.media.filter((m: any) => m.type?.includes("image")).slice(0, 1).map((m: any) => (
                  <img key={m.id} src={getMediaUrl(m.url)} alt="" className="w-32 h-32 object-cover rounded-full border-4 border-primary/20" />
                ))}
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.name')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.first_name} {modal.item.second_name}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.loginLabel')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.username}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="text-sm font-mono text-foreground">{modal.item.id}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal open={modal?.type === "create"} onClose={() => setModal(null)} title={t('admin.addReceptionistTitle')}>
        <div className="space-y-3">
          {[["first_name", t('admin.firstName')], ["second_name", t('admin.lastName')], ["username", t('admin.loginLabel')], ["password", t('admin.password')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input type={k === "password" ? "password" : "text"} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.photoLabel')}</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setFiles(prev => [...prev, ...newFiles]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} {t('admin.filesSelectedCount')}</p>
                  {files.map((f, idx) => f && (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded text-xs">
                      <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.create')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`${t('admin.deleteReceptionistConfirm')} "${confirm?.first_name}"?`} />
    </div>
  );
}

// ── About Section ──────────────────────────────────────────────────────
function AboutAdminSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ title_uz: "", title_ru: "", title_en: "", content_uz: "", content_ru: "", content_en: "" });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.getAboutUs().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      if (modal?.type === "create") await api.admin.createAbout(form);
      else await api.admin.editAbout(modal.item.id, form);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };
  const del = async (item: any) => { try { await api.admin.deleteAbout(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title={t('admin.aboutTitle')} onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "", content_uz: "", content_ru: "", content_en: "" }); setModal({ type: "create" }); }} />
      <DataTable
        columns={[{ key: "id", label: "ID" }, { key: "title_ru", label: t('admin.headerLabel') }, { key: "content_ru", label: t('admin.textLabel'), render: (r: any) => r.content_ru?.slice(0, 60) + "..." }]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onEdit={(r: any) => { setForm({ title_uz: r.title_uz, title_ru: r.title_ru, title_en: r.title_en, content_uz: r.content_uz, content_ru: r.content_ru, content_en: r.content_en }); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={modal?.item?.title_uz || modal?.item?.title_ru || modal?.item?.title_en || ""}>
        {modal?.item && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">UZ</p>
              <p className="text-sm font-semibold text-primary mb-2">{modal.item.title_uz}</p>
              <p className="text-sm text-foreground">{modal.item.content_uz}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-1">RU</p>
              <p className="text-sm font-semibold text-primary mb-2">{modal.item.title_ru}</p>
              <p className="text-sm text-foreground">{modal.item.content_ru}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-1">EN</p>
              <p className="text-sm font-semibold text-primary mb-2">{modal.item.title_en}</p>
              <p className="text-sm text-foreground">{modal.item.content_en}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit/Create Modal */}
      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addSectionTitle') : t('admin.editTitle')}>
        <div className="space-y-3">
          {[["title_ru", t('admin.headerRU')], ["title_en", t('admin.headerEN')], ["title_uz", t('admin.headerUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          {[["content_ru", t('admin.textRU')], ["content_en", t('admin.textEN')], ["content_uz", t('admin.textUZ')]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <textarea value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} rows={4} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.save')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteSectionConfirm')} />
    </div>
  );
}

// ── Contacts Admin Section ─────────────────────────────────────────────
function ContactsAdminSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<any>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [form, setForm] = useState({ type: "", contact: "" });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => { const r: any = await api.getContacts().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setLoading(true);
    try {
      if (modal?.type === "create") await api.admin.createContact(form);
      else await api.admin.editContact(modal.item.id, form);
      setModal(null); load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };
  const del = async (item: any) => { try { await api.admin.deleteContact(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title={t('admin.contactsTitle')} onAdd={() => { setForm({ type: "", contact: "" }); setModal({ type: "create" }); }} />
      <DataTable
        columns={[{ key: "id", label: "ID" }, { key: "type", label: t('admin.typeLabel') }, { key: "contact", label: t('admin.valueLabel') }]}
        rows={items}
        onView={(r: any) => setModal({ type: "view", item: r })}
        onEdit={(r: any) => { setForm({ type: r.type, contact: r.contact }); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />

      {/* View Modal */}
      <Modal open={modal?.type === "view"} onClose={() => setModal(null)} title={t('admin.contactDetails')}>
        {modal?.item && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.typeLabel')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.type}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">{t('admin.valueLabel')}</p>
              <p className="text-sm font-semibold text-primary">{modal.item.contact}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="text-sm font-mono text-foreground">{modal.item.id}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit/Create Modal */}
      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addContactTitle') : t('admin.editTitle')}>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.typeLabel')}</label>
            <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.valueLabel')}</label>
            <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{t('admin.cancel')}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : t('admin.save')}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.deleteContactConfirm')} />
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = getRole();
    if (role !== "ADMIN") navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const SECTIONS = [
    { key: "overview", label: t('admin.overview'), icon: LayoutDashboard },
    { key: "branches", label: t('admin.branches'), icon: Building2 },
    { key: "doctors", label: t('admin.doctors'), icon: Stethoscope },
    { key: "news", label: t('admin.news'), icon: Newspaper },
    { key: "gallery", label: t('admin.gallery'), icon: ImageIcon },
    { key: "statistics", label: t('admin.statistics'), icon: BarChart3 },
    { key: "feedback", label: t('admin.feedback'), icon: MessageSquare },
    { key: "receptions", label: t('admin.receptions'), icon: Users },
    { key: "about", label: t('admin.about'), icon: Info },
    { key: "contacts", label: t('admin.contacts'), icon: Phone },
  ];

  const sections: Record<string, React.ReactNode> = {
    overview: <OverviewSection />,
    branches: <BranchesSection />,
    doctors: <DoctorsSection />,
    news: <NewsSection />,
    gallery: <GalleryAdminSection />,
    statistics: <StatisticsSection />,
    feedback: <FeedbackAdminSection />,
    receptions: <ReceptionsSection />,
    about: <AboutAdminSection />,
    contacts: <ContactsAdminSection />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-primary text-lg">
            {SECTIONS.find(s => s.key === active)?.label || t('admin.panelTitle')}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">{t('admin.administrator')}</span>
          </div>
        </header>

        <main className="p-6">
          {sections[active]}
        </main>
      </div>
    </div>
  );
}
