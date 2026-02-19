import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getRole, MEDIA_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import { Users, Clock, LogOut, Plus, Trash2, X, Menu, ChevronRight } from "lucide-react";

function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display font-bold text-primary text-lg">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

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

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState<"patients" | "history">("patients");
  const [patients, setPatients] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: "", second_name: "", third_name: "", phone_number: "", problem: "" });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const role = getRole();
    if (role !== "RECEPTION" && role !== "ADMIN") navigate("/reception/login");
  }, [navigate]);

  const loadPatients = useCallback(async () => {
    const r: any = await api.reception.getPatients().catch(() => ({ data: [] }));
    setPatients(r.data || []);
  }, []);

  const loadHistory = useCallback(async () => {
    const r: any = await api.reception.getHistory().catch(() => ({ data: [] }));
    setHistory(r.data || []);
  }, []);

  useEffect(() => { loadPatients(); loadHistory(); }, [loadPatients, loadHistory]);

  const createPatient = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      for (const f of files) fd.append("media", f);
      await api.createPatient(fd);
      setCreateModal(false);
      setForm({ first_name: "", second_name: "", third_name: "", phone_number: "", problem: "" });
      setFiles([]);
      loadPatients(); loadHistory();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const deletePatient = async (item: any) => {
    try { await api.reception.deletePatient(item.id); setConfirm(null); loadPatients(); } catch (err: any) { alert(err.message); }
  };

  const handleLogout = () => { logout(); navigate("/reception/login"); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed left-0 top-0 h-full w-64 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`} style={{ background: "hsl(var(--clinic-red))" }}>
        <div className="p-5 border-b border-white/20">
          <img src={logo} alt="ASL Medline" className="h-10 w-auto" />
          <p className="text-white/60 text-xs mt-2 font-medium uppercase tracking-widest">Регистратура</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {[
            { key: "patients", label: "Пациенты", icon: Users },
            { key: "history", label: "История", icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key as any); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                tab === key ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-xs mb-3 transition-colors">
            <ChevronRight className="w-3 h-3" /> На сайт
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64 flex-1">
        <header className="sticky top-0 z-20 bg-card border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-primary text-lg">
            {tab === "patients" ? "Пациенты" : "История пациентов"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">Регистратура</span>
            {tab === "patients" && (
              <button
                onClick={() => setCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "hsl(var(--clinic-red))" }}
              >
                <Plus className="w-4 h-4" /> Новый пациент
              </button>
            )}
          </div>
        </header>

        <main className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[{ key: "patients", label: "Активные" }, { key: "history", label: "История" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === key ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                style={tab === key ? { background: "hsl(var(--clinic-red))" } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Patients list */}
          {tab === "patients" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {patients.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-card rounded-2xl p-5 shadow-card border border-border cursor-pointer hover:shadow-hover transition-all group hover:-translate-y-0.5"
                  onClick={() => setSelected(p)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-primary text-base">{p.first_name} {p.second_name}</h3>
                      {p.third_name && <p className="text-xs text-muted-foreground">{p.third_name}</p>}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setConfirm(p); }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">📞 {p.phone_number}</p>
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{p.problem}</p>
                  {p.media?.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {p.media.slice(0, 3).map((m: any) => (
                        <div key={m.id} className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {m.type?.startsWith("image") || m.type === "IMAGE" ? (
                            <img src={`${MEDIA_BASE}${m.url}`} alt="" className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full bg-muted" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!patients.length && (
                <div className="col-span-3 text-center py-20 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Нет активных пациентов</p>
                </div>
              )}
            </div>
          )}

          {/* History list */}
          {tab === "history" && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    {["Имя", "Фамилия", "Телефон", "Проблема"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h: any, i: number) => (
                    <tr key={h.id || i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{h.first_name}</td>
                      <td className="px-4 py-3 text-foreground">{h.second_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{h.phone_number}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{h.problem}</td>
                    </tr>
                  ))}
                  {!history.length && (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">История пуста</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Create patient modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Зарегистрировать пациента">
        <div className="space-y-3">
          {[["first_name", "Имя", "text"], ["second_name", "Фамилия", "text"], ["third_name", "Отчество (необяз.)", "text"], ["phone_number", "Номер телефона", "tel"]].map(([k, label, type]) => (
            <div key={k}><label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
              <input type={type} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          ))}
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Жалоба / Проблема</label>
            <textarea value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} rows={4} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Медиафайлы (снимки, результаты)</label>
            <input type="file" multiple accept="image/*,video/*" onChange={e => setFiles(Array.from(e.target.files || []))} className="text-sm text-muted-foreground" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
            <button onClick={createPatient} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: "hsl(var(--clinic-red))" }}>
              {loading ? "Сохранение..." : "Зарегистрировать"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Patient detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Детали пациента">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3"><p className="text-xs text-muted-foreground mb-0.5">Имя</p><p className="font-semibold text-foreground text-sm">{selected.first_name}</p></div>
              <div className="bg-muted/50 rounded-xl p-3"><p className="text-xs text-muted-foreground mb-0.5">Фамилия</p><p className="font-semibold text-foreground text-sm">{selected.second_name}</p></div>
              {selected.third_name && <div className="bg-muted/50 rounded-xl p-3 col-span-2"><p className="text-xs text-muted-foreground mb-0.5">Отчество</p><p className="font-semibold text-foreground text-sm">{selected.third_name}</p></div>}
              <div className="bg-muted/50 rounded-xl p-3 col-span-2"><p className="text-xs text-muted-foreground mb-0.5">Телефон</p><p className="font-semibold text-foreground text-sm">{selected.phone_number}</p></div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4"><p className="text-xs text-muted-foreground mb-2">Жалоба</p><p className="text-sm text-foreground leading-relaxed">{selected.problem}</p></div>
            {selected.media?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Медиафайлы</p>
                <div className="grid grid-cols-3 gap-2">
                  {selected.media.map((m: any) => (
                    <div key={m.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      {m.type === "image" || m.type === "IMAGE" ? (
                        <img src={`${MEDIA_BASE}${m.url}`} alt="" className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">Video</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deletePatient(confirm)} message={`Удалить пациента "${confirm?.first_name}"?`} />
    </div>
  );
}
