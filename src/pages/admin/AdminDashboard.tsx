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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <p className="text-foreground mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-destructive hover:opacity-90 transition-opacity">Удалить</button>
        </div>
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────
function DataTable({ columns, rows, onEdit, onDelete, onCustom }: any) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border" style={{ background: "hsl(var(--muted))" }}>
            {columns.map((c: any) => (
              <th key={c.key} className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{c.label}</th>
            ))}
            <th className="text-right px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr key={row.id || i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
              {columns.map((c: any) => (
                <td key={c.key} className="px-4 py-3 text-foreground">
                  {c.render ? c.render(row) : String(row[c.key] ?? "-").slice(0, 60)}
                </td>
              ))}
              <td className="px-4 py-3">
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
              <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">Нет данных</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────
function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-bold text-2xl text-primary">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      )}
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────────────────
function OverviewSection() {
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
    { label: "Отделения", count: counts.branches, icon: Building2, color: "hsl(225,75%,28%)" },
    { label: "Врачи", count: counts.doctors, icon: Stethoscope, color: "hsl(200,80%,40%)" },
    { label: "Новости", count: counts.news, icon: Newspaper, color: "hsl(160,60%,40%)" },
    { label: "Галерея", count: counts.gallery, icon: ImageIcon, color: "hsl(280,60%,50%)" },
    { label: "Статистика", count: counts.stats, icon: BarChart3, color: "hsl(30,80%,50%)" },
    { label: "Отзывы", count: counts.feedback, icon: MessageSquare, color: "hsl(0,74%,55%)" },
    { label: "Регистраторы", count: counts.receptions, icon: Users, color: "hsl(180,60%,40%)" },
    { label: "Контакты", count: counts.contacts, icon: Phone, color: "hsl(240,60%,55%)" },
  ];

  return (
    <div>
      <SectionHeader title="Обзор" />
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
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: "create" | "edit"; item?: any } | null>(null);
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
        const svcData = services.map(s => ({ key: s.key, title_en: s.title_en, title_ru: s.title_ru, title_uz: s.title_uz, price: Number(s.price) }));
        const techData = techs.map(t => ({ key: t.key, title: t.title, description: t.description }));
        fd.append("services", JSON.stringify(svcData));
        fd.append("techs", JSON.stringify(techData));
        for (const f of branchFiles) fd.append("branch_media", f);
        for (const s of services) {
          if (s._files) for (const f of s._files) fd.append(`service_media__${s.key}`, f);
        }
        for (const t of techs) {
          if (t._files) for (const f of t._files) fd.append(`tech_media__${t.key}`, f);
        }
        await api.admin.createBranch(fd);
      } else {
        const svcUpsert = services.map(s => s._existing ? { id: s.id, title_en: s.title_en, title_ru: s.title_ru, title_uz: s.title_uz, price: Number(s.price) } : { key: s.key, title_en: s.title_en, title_ru: s.title_ru, title_uz: s.title_uz, price: Number(s.price) });
        const techUpsert = techs.map(t => t._existing ? { id: t.id, title: t.title, description: t.description } : { key: t.key, title: t.title, description: t.description });
        fd.append("services_upsert", JSON.stringify(svcUpsert));
        fd.append("techs_upsert", JSON.stringify(techUpsert));
        for (const f of branchFiles) fd.append("branch_media", f);
        for (const s of services) {
          if (s._files) for (const f of s._files) {
            const key = s._existing ? `service_media__${s.id}` : `service_media__${s.key}`;
            fd.append(key, f);
          }
        }
        for (const t of techs) {
          if (t._files) for (const f of t._files) {
            const key = t._existing ? `tech_media__${t.id}` : `tech_media__${t.key}`;
            fd.append(key, f);
          }
        }
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
      <SectionHeader title="Отделения" onAdd={openCreate} />
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Название" },
          { key: "Services", label: "Услуги", render: (r: any) => r.Services?.length || 0 },
          { key: "Branch_techs", label: "Оборудование", render: (r: any) => r.Branch_techs?.length || 0 },
          { key: "doctors", label: "Врачи", render: (r: any) => r.doctors?.length || 0 },
        ]}
        rows={items}
        onEdit={openEdit}
        onDelete={(r: any) => setConfirm(r)}
      />

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Создать отделение" : "Редактировать отделение"}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Название</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Медиа отделения</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setBranchFiles(prev => [...prev, e.target.files![0]]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {branchFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{branchFiles.length} файлов выбрано</p>
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
              <label className="text-sm font-semibold text-foreground">Услуги</label>
              <button onClick={addService} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+ Услуга</button>
            </div>
            {services.map((s, i) => (
              <div key={s.key || s.id} className="bg-muted/50 rounded-xl p-3 mb-2 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="RU" value={s.title_ru} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_ru: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input placeholder="EN" value={s.title_en} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_en: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input placeholder="UZ" value={s.title_uz} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, title_uz: e.target.value } : x))} className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Цена" value={s.price} onChange={e => setServices(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setServices(prev => prev.map((x, j) => j === i ? { ...x, _files: [...(x._files || []), e.target.files![0]] } : x));
                        e.target.value = '';
                      }
                    }} 
                    className="text-xs text-muted-foreground flex-1" 
                  />
                  <button onClick={() => setServices(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
                {s._files && s._files.length > 0 && (
                  <p className="text-xs text-muted-foreground">{s._files.length} файлов</p>
                )}
              </div>
            ))}
          </div>

          {/* Techs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Оборудование</label>
              <button onClick={addTech} className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+ Техника</button>
            </div>
            {techs.map((t, i) => (
              <div key={t.key || t.id} className="bg-muted/50 rounded-xl p-3 mb-2 space-y-2">
                <div className="flex gap-2">
                  <input placeholder="Название" value={t.title} onChange={e => setTechs(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                  <button onClick={() => setTechs(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
                <input placeholder="Описание" value={t.description} onChange={e => setTechs(prev => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none" />
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setTechs(prev => prev.map((x, j) => j === i ? { ...x, _files: [...(x._files || []), e.target.files![0]] } : x));
                      e.target.value = '';
                    }
                  }} 
                  className="text-xs text-muted-foreground" 
                />
                {t._files && t._files.length > 0 && (
                  <p className="text-xs text-muted-foreground">{t._files.length} файлов</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`Удалить отделение "${confirm?.title}"?`} />
    </div>
  );
}

// ── Doctors Section ────────────────────────────────────────────────────
function DoctorsSection() {
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
      <SectionHeader title="Врачи" onAdd={() => { setForm({ first_name: "", second_name: "", third_name: "", description: "", branch_id: "" }); setDoctorFiles([]); setModal({ type: "create" }); }} />
      <DataTable
        columns={[
          { key: "id", label: "ID", render: (r: any) => r.id.slice(0, 8) + "..." },
          { key: "first_name", label: "Имя", render: (r: any) => `${r.first_name} ${r.second_name}` },
          { key: "description", label: "Описание", render: (r: any) => (r.description || "").slice(0, 40) + "..." },
          { key: "branch", label: "Отделение", render: (r: any) => r.branch?.title || r.branch_id },
        ]}
        rows={items}
        onEdit={(r: any) => { setForm({ first_name: r.first_name, second_name: r.second_name, third_name: r.third_name || "", description: r.description, branch_id: String(r.branch_id) }); setDoctorFiles([]); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить врача" : "Редактировать врача"}>
        <div className="space-y-3">
          {[["first_name", "Имя"], ["second_name", "Фамилия"], ["third_name", "Отчество (необяз.)"]].map(([k, label]) => (
            <div key={k}>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Описание / Специализация</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Отделение</label>
            <select value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
              <option value="">Выберите отделение</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Фото врача</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setDoctorFiles(prev => [...prev, e.target.files![0]]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {doctorFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{doctorFiles.length} файлов выбрано</p>
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
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`Удалить врача "${confirm?.first_name} ${confirm?.second_name}"?`} />
    </div>
  );
}

// ── News Section ───────────────────────────────────────────────────────
function NewsSection() {
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
      <SectionHeader title="Новости" onAdd={openCreate} />
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
                <p className="text-xs text-muted-foreground mt-1">{item.media?.length || 0} медиа</p>
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

      <Modal open={modal?.type === "create" || modal?.type === "edit"} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить новость" : "Редактировать новость"}>
        <div className="space-y-3">
          {[["title_ru", "Заголовок RU"], ["title_en", "Заголовок EN"], ["title_uz", "Заголовок UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          {[["description_ru", "Текст RU"], ["description_en", "Текст EN"], ["description_uz", "Текст UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <textarea value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Изображения</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setFiles(prev => [...prev, e.target.files![0]]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} файлов выбрано</p>
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
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Сохранить"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`Удалить новость?`} />
    </div>
  );
}

// ── Gallery Section ────────────────────────────────────────────────────
function GalleryAdminSection() {
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

  return (
    <div>
      <SectionHeader title="Галерея" onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "" }); setFiles([]); setModal({ type: "create" }); }} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {items.map((g: any) => (
          <div key={g.id} className="group relative bg-card rounded-xl overflow-hidden shadow-card border border-border">
            <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
              {g.media?.[0] ? (
                <img src={getMediaUrl(g.media[0].url)} alt="" className="w-full h-full object-cover" />
              ) : <ImageIcon className="w-10 h-10 text-muted-foreground/30" />}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-primary truncate">{g.title_ru || g.title_en}</p>
              <p className="text-xs text-muted-foreground">{g.media?.length || 0} медиа</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({ title_uz: g.title_uz, title_ru: g.title_ru, title_en: g.title_en }); setFiles([]); setModal({ type: "edit", item: g }); }} className="p-1.5 rounded-lg bg-white/90 text-primary shadow"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setConfirm(g)} className="p-1.5 rounded-lg bg-white/90 text-destructive shadow"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить галерею" : "Редактировать галерею"}>
        <div className="space-y-3">
          {[["title_ru", "Название RU"], ["title_en", "Название EN"], ["title_uz", "Название UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Медиафайлы</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setFiles(prev => [...prev, e.target.files![0]]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} файлов выбрано</p>
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
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Сохранить"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Удалить элемент галереи?" />
    </div>
  );
}

// ── Statistics Section ─────────────────────────────────────────────────
function StatisticsSection() {
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
      <SectionHeader title="Статистика" onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "", number: "" }); setModal({ type: "create" }); }} />
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
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить статистику" : "Редактировать"}>
        <div className="space-y-3">
          {[["title_ru", "Название RU"], ["title_en", "Название EN"], ["title_uz", "Название UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Число</label>
            <input type="number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Сохранить"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Удалить показатель статистики?" />
    </div>
  );
}

// ── Feedback Section ───────────────────────────────────────────────────
function FeedbackAdminSection() {
  const [items, setItems] = useState<any[]>([]);
  const [confirm, setConfirm] = useState<any>(null);

  const load = useCallback(async () => { const r: any = await api.admin.getAllFeedbacks().catch(() => ({ data: [] })); setItems(r.data || []); }, []);
  useEffect(() => { load(); }, [load]);

  const approve = async (id: number) => { try { await api.admin.approveFeedback(id); load(); } catch (err: any) { alert(err.message); } };
  const del = async (item: any) => { try { await api.admin.deleteFeedback(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); } };

  return (
    <div>
      <SectionHeader title="Отзывы" />
      <DataTable
        columns={[
          { key: "full_name", label: "Имя" },
          { key: "phone_number", label: "Телефон" },
          { key: "content", label: "Отзыв", render: (r: any) => r.content?.slice(0, 50) + "..." },
          { key: "isApproved", label: "Статус", render: (r: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.isApproved ? "Одобрен" : "Ожидание"}</span> },
        ]}
        rows={items}
        onDelete={(r: any) => setConfirm(r)}
        onCustom={(r: any) => !r.isApproved && (
          <button onClick={() => approve(r.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      />
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Удалить отзыв?" />
    </div>
  );
}

// ── Receptions Section ─────────────────────────────────────────────────
function ReceptionsSection() {
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
      <SectionHeader title="Регистраторы" onAdd={() => { setForm({ first_name: "", second_name: "", username: "", password: "" }); setFiles([]); setModal({ type: "create" }); }} />
      <DataTable
        columns={[
          { key: "id", label: "ID", render: (r: any) => r.id.slice(0, 8) + "..." },
          { key: "first_name", label: "Имя", render: (r: any) => `${r.first_name} ${r.second_name}` },
          { key: "username", label: "Логин" },
        ]}
        rows={items} onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title="Добавить регистратора">
        <div className="space-y-3">
          {[["first_name", "Имя"], ["second_name", "Фамилия"], ["username", "Логин"], ["password", "Пароль"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input type={k === "password" ? "password" : "text"} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Фото</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setFiles(prev => [...prev, e.target.files![0]]);
                    e.target.value = '';
                  }
                }} 
                className="text-sm text-muted-foreground" 
              />
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{files.length} файлов выбрано</p>
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
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Создать"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={`Удалить регистратора "${confirm?.first_name}"?`} />
    </div>
  );
}

// ── About Section ──────────────────────────────────────────────────────
function AboutAdminSection() {
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
      <SectionHeader title="О нас" onAdd={() => { setForm({ title_uz: "", title_ru: "", title_en: "", content_uz: "", content_ru: "", content_en: "" }); setModal({ type: "create" }); }} />
      <DataTable
        columns={[{ key: "id", label: "ID" }, { key: "title_ru", label: "Заголовок" }, { key: "content_ru", label: "Текст", render: (r: any) => r.content_ru?.slice(0, 60) + "..." }]}
        rows={items}
        onEdit={(r: any) => { setForm({ title_uz: r.title_uz, title_ru: r.title_ru, title_en: r.title_en, content_uz: r.content_uz, content_ru: r.content_ru, content_en: r.content_en }); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить раздел" : "Редактировать"}>
        <div className="space-y-3">
          {[["title_ru", "Заголовок RU"], ["title_en", "Заголовок EN"], ["title_uz", "Заголовок UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          {[["content_ru", "Текст RU"], ["content_en", "Текст EN"], ["content_uz", "Текст UZ"]].map(([k, label]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <textarea value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} rows={4} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Сохранить"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Удалить раздел?" />
    </div>
  );
}

// ── Contacts Admin Section ─────────────────────────────────────────────
function ContactsAdminSection() {
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
      <SectionHeader title="Контакты" onAdd={() => { setForm({ type: "", contact: "" }); setModal({ type: "create" }); }} />
      <DataTable
        columns={[{ key: "id", label: "ID" }, { key: "type", label: "Тип" }, { key: "contact", label: "Значение" }]}
        rows={items}
        onEdit={(r: any) => { setForm({ type: r.type, contact: r.contact }); setModal({ type: "edit", item: r }); }}
        onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? "Добавить контакт" : "Редактировать"}>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Тип (phone, email, address...)</label>
            <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Значение</label>
            <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">{loading ? "..." : "Сохранить"}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Удалить контакт?" />
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
            {SECTIONS.find(s => s.key === active)?.label || "Панель"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">Администратор</span>
          </div>
        </header>

        <main className="p-6">
          {sections[active]}
        </main>
      </div>
    </div>
  );
}
