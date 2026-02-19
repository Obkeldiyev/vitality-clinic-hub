import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Send, Upload, X } from 'lucide-react';

export default function ConsultationForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    first_name: '',
    second_name: '',
    third_name: '',
    phone_number: '',
    problem: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Add single file to existing files array
      setFiles([...files, e.target.files[0]]);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      for (const f of files) fd.append('media', f);
      
      await api.createPatient(fd);
      setSuccess(true);
      setForm({ first_name: '', second_name: '', third_name: '', phone_number: '', problem: '' });
      setFiles([]);
    } catch (err: any) {
      alert(t('consultation.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(var(--primary)/0.1)' }}>
          <Send className="w-7 h-7 text-primary" />
        </div>
        <p className="font-semibold text-primary mb-2">{t('consultation.thankYou')}</p>
        <p className="text-muted-foreground text-sm">{t('consultation.willContact')}</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-clinic-red underline">
          {t('consultation.bookAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t('consultation.firstName')}
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="text"
          placeholder={t('consultation.secondName')}
          value={form.second_name}
          onChange={(e) => setForm({ ...form, second_name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <input
        type="text"
        placeholder={t('consultation.thirdName')}
        value={form.third_name}
        onChange={(e) => setForm({ ...form, third_name: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <input
        type="tel"
        placeholder={t('consultation.phone')}
        value={form.phone_number}
        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <textarea
        placeholder={t('consultation.problem')}
        value={form.problem}
        onChange={(e) => setForm({ ...form, problem: e.target.value })}
        required
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
      
      <div>
        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border bg-muted/30 text-foreground text-sm cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="w-4 h-4" />
          <span>{t('consultation.addFile')}</span>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
        </label>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">{files.length} {t('consultation.filesSelected')}</p>
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
                <span className="flex-1 truncate text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                <button type="button" onClick={() => removeFile(i)} className="text-destructive hover:text-destructive/80 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: 'hsl(var(--primary))' }}
      >
        {loading ? t('consultation.sending') : t('consultation.submit')}
      </button>
    </form>
  );
}
