import i18n from '@/i18n/config';

type LanguageCode = 'en' | 'ru' | 'uz';

export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  fieldPrefix: string
): string {
  const lang = i18n.language as LanguageCode;
  const field = `${fieldPrefix}_${lang}`;
  
  if (obj[field]) return obj[field];
  
  if (obj[`${fieldPrefix}_ru`]) return obj[`${fieldPrefix}_ru`];
  if (obj[`${fieldPrefix}_en`]) return obj[`${fieldPrefix}_en`];
  if (obj[`${fieldPrefix}_uz`]) return obj[`${fieldPrefix}_uz`];
  
  return '';
}

export function getTitle(obj: any): string {
  return getLocalizedField(obj, 'title');
}

export function getDescription(obj: any): string {
  return getLocalizedField(obj, 'description');
}

export function getContent(obj: any): string {
  return getLocalizedField(obj, 'content');
}
