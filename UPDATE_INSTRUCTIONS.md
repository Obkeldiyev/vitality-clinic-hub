# Landing Page i18n Update Instructions

The following sections in `src/pages/Landing.tsx` need to be updated with i18n support.

## News Section (line ~318)
Replace hardcoded Russian text with:
- `t('news.label')` for "Новости"
- `t('news.title')` for "Последние новости клиники"
- `getTitle(item)` instead of `item.title_ru || item.title_en`
- `getDescription(item)` instead of `item.description_ru || item.description_en`
- `t('news.loading')` for "Загрузка новостей..."

## Gallery Section (line ~370)
- `t('gallery.label')` for "Галерея"
- `t('gallery.title')` for "Наша клиника"
- `t('gallery.empty')` for "Галерея пока пуста"

## Feedback Section (line ~400)
- `t('feedback.label')` for "Отзывы"
- `t('feedback.title')` for "Что говорят наши пациенты"
- `t('feedback.leaveReview')` for "Оставить отзыв"
- All form fields with t('feedback.*')

## Add NEW Consultation Section (before Contacts)
```tsx
// ── Consultation ───────────────────────────────────────────────────────
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
```

## Contacts Section (line ~500)
- `t('contacts.label')` for "Связаться с нами"
- `t('contacts.title')` for "Контактная информация"
- `t('contacts.loading')` for "Загрузка контактов..."

## Footer Section (line ~540)
- `t('footer.rights')` for "Все права защищены."
- `t('footer.admin')` for "Администратор"
- `t('footer.reception')` for "Регистратура"

## Main Landing Component
Add ConsultationSection before ContactsSection in the render:
```tsx
<ConsultationSection />
<ContactsSection contacts={data.contacts} />
```
