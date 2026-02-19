import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
  { code: 'uz', name: "O'zbek", flag: 'UZ' },
];

export default function LanguageSwitcher({ openUpward = false }: { openUpward?: boolean }) {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/20 transition-all">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === i18n.language)?.flag || 'EN'}
        </span>
      </button>
      
      <div className={`absolute right-0 w-40 glass rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50 ${
        openUpward ? 'bottom-full mb-2' : 'mt-2'
      }`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-white/10 transition-colors text-white"
          >
            <span className="font-semibold">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
