import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu, X, Phone } from "lucide-react";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Главная", href: "#hero" },
  { label: "О нас", href: "#about" },
  { label: "Отделения", href: "#branches" },
  { label: "Врачи", href: "#doctors" },
  { label: "Услуги", href: "#services" },
  { label: "Новости", href: "#news" },
  { label: "Галерея", href: "#gallery" },
  { label: "Отзывы", href: "#feedback" },
  { label: "Контакты", href: "#contacts" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    api.getContacts().then((res: any) => {
      const contacts = res?.data || [];
      const phoneContact = contacts.find((c: any) =>
        c.type?.toLowerCase().includes("phone") || c.type?.toLowerCase().includes("tel")
      );
      if (phoneContact) setPhone(phoneContact.contact);
    }).catch(() => {});
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ASL Medline" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => scrollTo(item.href)}
                className="nav-link text-white/90 hover:text-white text-sm font-medium tracking-wide"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium"
            >
              <Phone className="w-4 h-4 text-clinic-red" />
              {phone}
            </a>
          )}
          <Link
            to="/admin/login"
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
          >
            Войти
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass-dark border-t border-white/10 mt-2 py-4">
          <ul className="flex flex-col gap-1 px-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollTo(item.href)}
                  className="w-full text-left py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10 mt-2 flex gap-2">
              <Link
                to="/admin/login"
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
                onClick={() => setOpen(false)}
              >
                Войти
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
