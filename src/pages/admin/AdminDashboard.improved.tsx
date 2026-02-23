import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, MEDIA_BASE, getMediaUrl, getRole } from "@/lib/api";
import { getTitle, getDescription } from "@/lib/i18nHelpers";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FileUploadPreview from "@/components/FileUploadPreview";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard, Building2, Stethoscope, Newspaper, Image as ImageIcon,
  BarChart3, MessageSquare, Users, Info, Phone, LogOut, Plus, Pencil,
  Trash2, CheckCircle, X, ChevronDown, ChevronRight, Menu, Check, Award
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
function Modal({ open, onClose, title, children, size = "lg" }: any) {
  if (!open) return null;
  const maxWidth = size === "xl" ? "max-w-4xl" : size === "lg" ? "max-w-lg" : "max-w-md";
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-card rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <p className="text-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            {t('admin.cancel')}
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">
            {t('admin.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────
function SectionHeader({ title, onAdd }: any) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-bold text-2xl text-primary">{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> {t('admin.add')}
        </button>
      )}
    </div>
  );
}

// ── Data Table ─────────────────────────────────────────────────────────
function DataTable({ columns, rows, onEdit, onDelete, onView }: any) {
  const { t } = useTranslation();
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col: any) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row: any, idx: number) => (
              <tr key={row.id || idx} className="hover:bg-muted/30 transition-colors">
                {columns.map((col: any) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <button onClick={() => onView(row)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('admin.view')}>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('admin.edit')}>
                        <Pencil className="w-4 h-4 text-primary" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('admin.delete')}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {t('admin.noData')}
        </div>
      )}
    </div>
  );
}

// ── Doctors Section with Awards ────────────────────────────────────────
function DoctorsSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: string; item?: any } | null>(null);
  const [confirm, setConfirm] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ first_name: "", second_name: "", third_name: "", description: "", branch_id: "" });
  const [doctorFiles, setDoctorFiles] = useState<File[]>([]);
  const [awards, setAwards] = useState<Array<{ tempKey: string; title: string; level: string; files: File[] }>>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [dRes, bRes] = await Promise.allSettled([api.getDoctors(), api.getBranches()]);
    setItems((dRes as any).value?.data || []);
    setBranches((bRes as any).value?.data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addAward = () => {
    setAwards([...awards, { tempKey: `award_${Date.now()}`, title: "", level: "", files: [] }]);
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const updateAward = (index: number, field: string, value: any) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };

  const save = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("first_name", form.first_name);
      fd.append("second_name", form.second_name);
      fd.append("third_name", form.third_name);
      fd.append("description", form.description);
      fd.append("branch_id", form.branch_id);
      
      // Doctor media
      for (const f of doctorFiles) fd.append("doctor_media", f);
      
      // Awards
      const awardsData = awards.map(a => ({ tempKey: a.tempKey, title: a.title, level: a.level }));
      fd.append("awards", JSON.stringify(awardsData));
      
      // Award media with tempKey prefix
      for (const award of awards) {
        for (const file of award.files) {
          const renamedFile = new File([file], `${award.tempKey}_${file.name}`, { type: file.type });
          fd.append("award_media", renamedFile);
        }
      }
      
      if (modal?.type === "create") await api.admin.createDoctor(fd);
      else await api.admin.editDoctor(modal!.item.id, fd);
      setModal(null);
      load();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const del = async (item: any) => {
    try { await api.admin.deleteDoctor(item.id); setConfirm(null); load(); } catch (err: any) { alert(err.message); }
  };

  const openCreate = () => {
    setForm({ first_name: "", second_name: "", third_name: "", description: "", branch_id: "" });
    setDoctorFiles([]);
    setAwards([]);
    setModal({ type: "create" });
  };

  const openEdit = (item: any) => {
    setForm({
      first_name: item.first_name,
      second_name: item.second_name,
      third_name: item.third_name || "",
      description: item.description,
      branch_id: String(item.branch_id)
    });
    setDoctorFiles([]);
    // Load existing awards (without files, as they're already uploaded)
    setAwards((item.awards || []).map((a: any) => ({
      tempKey: `existing_${a.id}`,
      title: a.title,
      level: a.level,
      files: []
    })));
    setModal({ type: "edit", item });
  };

  return (
    <div>
      <SectionHeader title={t('admin.doctors')} onAdd={openCreate} />
      <DataTable
        columns={[
          { key: "id", label: "ID", render: (r: any) => r.id.slice(0, 8) + "..." },
          { key: "first_name", label: t('admin.name'), render: (r: any) => `${r.first_name} ${r.second_name}` },
          { key: "description", label: t('admin.description'), render: (r: any) => (r.description || "").slice(0, 40) + "..." },
          { key: "branch", label: t('admin.branch'), render: (r: any) => r.branch?.title || r.branch_id },
          { key: "awards", label: t('admin.awards'), render: (r: any) => r.awards?.length || 0 },
        ]}
        rows={items}
        onEdit={openEdit}
        onDelete={(r: any) => setConfirm(r)}
      />
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "create" ? t('admin.addDoctor') : t('admin.editDoctor')} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.firstName')}</label>
              <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.lastName')}</label>
              <input value={form.second_name} onChange={e => setForm({ ...form, second_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.middleName')}</label>
            <input value={form.third_name} onChange={e => setForm({ ...form, third_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.specialization')}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.branch')}</label>
            <select value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none">
              <option value="">{t('admin.selectBranch')}</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.doctorPhoto')}</label>
            <FileUploadPreview
              files={doctorFiles}
              onChange={setDoctorFiles}
              accept="image/*,video/*"
              multiple
            />
          </div>

          {/* Awards Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('admin.awards')}
              </label>
              <button onClick={addAward} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                + {t('admin.addAward')}
              </button>
            </div>
            
            {awards.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">{t('admin.noAwards')}</p>
            )}
            
            <div className="space-y-3">
              {awards.map((award, index) => (
                <div key={award.tempKey} className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t('admin.award')} #{index + 1}</span>
                    <button onClick={() => removeAward(index)} className="text-destructive hover:opacity-70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.awardTitle')}</label>
                      <input
                        value={award.title}
                        onChange={e => updateAward(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t('admin.awardTitlePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.awardLevel')}</label>
                      <input
                        value={award.level}
                        onChange={e => updateAward(index, 'level', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t('admin.awardLevelPlaceholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('admin.awardMedia')}</label>
                    <FileUploadPreview
                      files={award.files}
                      onChange={(files) => updateAward(index, 'files', files)}
                      accept="image/*"
                      multiple
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
              {t('admin.cancel')}
            </button>
            <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message={t('admin.confirmDeleteDoctor', { name: `${confirm?.first_name} ${confirm?.second_name}` })} />
    </div>
  );
}
