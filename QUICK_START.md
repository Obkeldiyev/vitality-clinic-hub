# Quick Start Guide - ASL MEDLINE Frontend

## ✅ What's Done

1. **Lovable AI removed** - All references cleaned up
2. **3 languages working** - EN, RU, UZ with language switcher
3. **JSON parse error fixed** - App loads without errors
4. **Consultation form ready** - Connects to `/patient` endpoint
5. **Most sections translated** - Hero, Stats, About, Branches, Doctors, Services

## 🚀 Run the App

```bash
cd vitality-clinic-hub
npm install  # if needed
npm run dev
```

Open http://localhost:8080

## 🌍 How Language Works

### For Users:
- Click language switcher (top right): EN | RU | UZ
- All text changes automatically
- Choice saved in browser

### For Developers:
```typescript
// In any component:
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('hero.title')}</h1>;
}
```

### For Backend Data:
```typescript
import { getTitle, getDescription, getContent } from '@/lib/i18nHelpers';

// Automatically picks title_en, title_ru, or title_uz based on current language
const title = getTitle(newsItem);
const desc = getDescription(newsItem);
const content = getContent(aboutItem);
```

## 📝 Complete Remaining Sections

Open `src/pages/Landing.tsx` and update these sections:

### 1. News Section (~line 318)
```typescript
function NewsSection({ news }: { news: any[] }) {
  const { t } = useTranslation();  // ADD THIS
  return (
    <section id="news" className="py-24 bg-secondary/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('news.label')}</SectionLabel>  {/* CHANGE */}
          <SectionTitle>{t('news.title')}</SectionTitle>  {/* CHANGE */}
        </div>
        {/* ... */}
        <h3>{getTitle(item)}</h3>  {/* CHANGE from item.title_ru */}
        <p>{getDescription(item)}</p>  {/* CHANGE from item.description_ru */}
        {/* ... */}
        <p>{t('news.loading')}</p>  {/* CHANGE */}
```

### 2. Gallery Section (~line 370)
```typescript
<SectionLabel>{t('gallery.label')}</SectionLabel>
<SectionTitle>{t('gallery.title')}</SectionTitle>
<p>{t('gallery.empty')}</p>
```

### 3. Feedback Section (~line 400)
```typescript
<SectionLabel>{t('feedback.label')}</SectionLabel>
<SectionTitle>{t('feedback.title')}</SectionTitle>
<h3>{t('feedback.leaveReview')}</h3>
<input placeholder={t('feedback.fullName')} />
<input placeholder={t('feedback.phone')} />
<input placeholder={t('feedback.email')} />
<textarea placeholder={t('feedback.content')} />
<button>{loading ? t('feedback.sending') : t('feedback.submit')}</button>
```

### 4. Add Consultation Section (NEW - before Contacts)
```typescript
// Add this function:
function ConsultationSection() {
  const { t } = useTranslation();
  return (
    <section id="consultation" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <SectionLabel>{t('consultation.label')}</SectionLabel>
          <SectionTitle>{t('consultation.title')}</SectionTitle>
        </div>
        <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card border border-border">
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}

// Add to render (around line 600):
<FeedbackSection feedbacks={data.feedbacks} />
<ConsultationSection />  {/* ADD THIS */}
<ContactsSection contacts={data.contacts} />
```

### 5. Contacts Section (~line 500)
```typescript
<SectionLabel>{t('contacts.label')}</SectionLabel>
<SectionTitle>{t('contacts.title')}</SectionTitle>
<p>{t('contacts.loading')}</p>
```

### 6. Footer Section (~line 540)
```typescript
<p>{new Date().getFullYear()} ASL Medline Klinikasi. {t('footer.rights')}</p>
<Link to="/admin/login">{t('footer.admin')}</Link>
<Link to="/reception/login">{t('footer.reception')}</Link>
```

## 🎯 Test Checklist

- [ ] Language switcher works (EN/RU/UZ)
- [ ] All sections show correct language
- [ ] Consultation form submits to backend
- [ ] Feedback form submits to backend
- [ ] Backend data (news, services, etc.) shows in correct language
- [ ] Mobile menu works with language switcher
- [ ] No console errors

## 📚 Translation Files

All translations are in:
- `src/i18n/locales/en.json`
- `src/i18n/locales/ru.json`
- `src/i18n/locales/uz.json`

To add new translations, just add the key to all 3 files.

## 🔧 Backend Connection

Make sure your backend is running on `http://localhost:9007` (configured in `src/lib/api.ts`)

### Endpoints Used:
- `POST /patient` - Consultation form (with file upload)
- `POST /feedback` - Feedback form
- `GET /about/us` - About content
- `GET /statistics` - Statistics
- `GET /branch` - Branches/Departments
- `GET /doctor` - Doctors
- `GET /news` - News
- `GET /gallery` - Gallery
- `GET /feedback/approved` - Approved feedbacks
- `GET /contact` - Contact information

## 🎨 Customization

### Change Default Language
Edit `src/i18n/config.ts`:
```typescript
fallbackLng: 'ru',  // Change to 'en' or 'uz'
```

### Add More Languages
1. Create `src/i18n/locales/[lang].json`
2. Add to `src/i18n/config.ts` resources
3. Add to `LanguageSwitcher.tsx` languages array

## 🐛 Common Issues

### "undefined" is not valid JSON
✅ Fixed in `src/lib/api.ts` getUser() function

### Language not changing
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh page

### Backend data not showing correct language
- Make sure backend has `title_en`, `title_ru`, `title_uz` fields
- Check `getTitle()`, `getDescription()`, `getContent()` helpers are used

## 📞 Support

Check these files for reference:
- `IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `UPDATE_INSTRUCTIONS.md` - Step-by-step update guide
- Translation files in `src/i18n/locales/`

Happy coding! 🚀
