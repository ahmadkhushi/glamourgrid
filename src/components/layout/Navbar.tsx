"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAdminStore } from "@/store/adminStore";

/* ── Social Icons (inline SVGs for zero extra deps) ───────────────────── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.44 3.635 1.407 2.667 2.374 2.358 3.547 2.3 4.825 2.242 6.105 2.228 6.513 2.228 12c0 5.487.014 5.895.072 7.175.059 1.278.368 2.451 1.335 3.418.967.967 2.14 1.276 3.418 1.335C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.059 2.451-.368 3.418-1.335.967-.967 1.276-2.14 1.335-3.418.058-1.28.072-1.688.072-7.175 0-5.487-.014-5.895-.072-7.175-.059-1.278-.368-2.451-1.335-3.418C19.398.44 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.018 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.091 24 18.098 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ADMIN_PASSWORD = "glamour2026";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const cartItems = useCartStore((state) => state.items);
  const { isAdmin, setAdmin, clickCount, incrementClick, resetClicks } = useAdminStore();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 5-click logo to open admin modal */
  const handleLogoClick = () => {
    incrementClick();
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => resetClicks(), 2000);
    if (clickCount + 1 >= 5) {
      resetClicks();
      setShowAdminModal(true);
      setAdminInput("");
      setAdminError("");
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInput === ADMIN_PASSWORD) {
      setAdmin(!isAdmin);
      setShowAdminModal(false);
    } else {
      setAdminError("Galat password. Dobara try karein.");
    }
  };

  return (
    <>
      {/* ── Social Top Bar ─────────────────────────────────── */}
      <div className="w-full bg-[#0a0805] border-b border-[#2a2018] py-1.5 px-6 hidden md:flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89f91]">
          Free shipping on orders over Rs. 2,500
        </p>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded-sm">
              Admin Mode
            </span>
          )}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://wa.me/923299400067?text=Hello%20GlamourGrid"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
          >
            <WhatsAppIcon />
          </a>
          <a
            href="mailto:glomourgrid32@gmail.com"
            aria-label="Email"
            className="text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
          >
            <EmailIcon />
          </a>
        </div>
      </div>

      {/* ── Main Navbar ────────────────────────────────────── */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0f0c08]/95 backdrop-blur-md py-4 border-b border-[#2a2018] mt-0"
            : "bg-transparent py-6 mt-8"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden text-[#d4af37] p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo — 5 clicks = admin modal */}
          <button
            onClick={handleLogoClick}
            className="text-xl md:text-2xl font-serif text-[#d4af37] tracking-[0.2em] hover:opacity-80 transition-opacity"
          >
            GLAMOURGRID
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
            >
              Shop
            </Link>

            {/* Makeup Dropdown */}
            <div className="relative group">
              <Link
                href="/shop/makeup"
                className="nav-link text-[11px] uppercase tracking-[0.2em] text-[#a89f91] group-hover:text-[#d4af37] transition-colors duration-300 py-2 inline-flex items-center gap-1"
              >
                Makeup
                <span className="text-[9px] opacity-60 transition-transform group-hover:rotate-180">▼</span>
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#140f0a] border border-[#d4af37]/30 shadow-2xl rounded-sm p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 grid grid-cols-1 gap-1">
                {[
                  { name: "Eye Lashes", href: "/shop/makeup/eye-lashes" },
                  { name: "Mascara", href: "/shop/makeup/mascara" },
                  { name: "Lipsticks", href: "/shop/makeup/lipsticks" },
                  { name: "Face Powder", href: "/shop/makeup/face-powder" },
                  { name: "BB Cream", href: "/shop/makeup/bb-cream" },
                  { name: "Makeup Kits", href: "/shop/makeup/makeup-kits" },
                  { name: "Makeup Brushes", href: "/shop/makeup/makeup-brushes" },
                  { name: "Lip Oil & Balms", href: "/shop/makeup/lip-oil-balm" },
                  { name: "Face Blush", href: "/shop/makeup/face-blush" },
                  { name: "Eyes Blush", href: "/shop/makeup/eyes-blush" },
                  { name: "Lip Gloss", href: "/shop/makeup/lip-gloss" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs text-[#a89f91] hover:text-[#d4af37] hover:bg-[#1f1710] px-3 py-2 rounded transition-colors duration-200 tracking-wider flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-[#d4af37]/40">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop/skincare"
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
            >
              Skincare
            </Link>

            <Link
              href="/shop?sort=newest"
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
            >
              New Arrivals
            </Link>

            <Link
              href="/about"
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300"
            >
              About
            </Link>

            {/* Sale link — red highlight */}
            <Link
              href="/sale"
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-red-400 hover:text-red-300 transition-colors duration-300 font-bold"
            >
              🔴 Sale
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button className="hidden md:block text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300" aria-label="Search">
              <Search size={18} />
            </button>
            <Link href="/orders" className="hidden md:block text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300" aria-label="My Orders">
              <User size={18} />
            </Link>
            <Link href="/wishlist" className="hidden md:block text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300" aria-label="Wishlist">
              <Heart size={18} />
            </Link>
            <Link href="/cart" className="relative text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300" aria-label="Cart">
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-[#0f0c08] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 bg-[#0f0c08] flex flex-col pt-24 px-8 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-8">
          {[
            { label: "Shop All", href: "/shop" },
            { label: "Makeup", href: "/shop/makeup" },
            { label: "Skincare", href: "/shop/skincare" },
            { label: "Fragrance", href: "/shop/fragrance" },
            { label: "New Arrivals", href: "/shop?sort=newest" },
            { label: "🔴 Sale", href: "/sale" },
            { label: "About", href: "/about" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#FDFBF7] hover:text-[#d4af37] transition-colors border-b border-[#2a2018] pb-6"
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile social icons */}
        <div className="mt-10 flex gap-6 text-[#a89f91]">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors"><InstagramIcon /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors"><FacebookIcon /></a>
          <a href="https://wa.me/923299400067?text=Hello%20GlamourGrid" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors"><WhatsAppIcon /></a>
          <a href="mailto:glomourgrid32@gmail.com" aria-label="Email" className="hover:text-[#d4af37] transition-colors"><EmailIcon /></a>
        </div>
        <div className="mt-8 flex gap-8">
          <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a89f91] hover:text-[#d4af37] flex items-center gap-2 text-sm uppercase tracking-widest">
            <User size={16} /> My Orders
          </Link>
          <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-[#a89f91] hover:text-[#d4af37] flex items-center gap-2 text-sm uppercase tracking-widest">
            <ShoppingCart size={16} /> Cart
          </Link>
        </div>
      </div>

      {/* ── Admin Password Modal ───────────────────────────── */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#16100a] border border-[#d4af37]/30 p-8 w-full max-w-sm">
            <h2 className="text-[#d4af37] font-serif text-xl mb-2 tracking-widest text-center">
              {isAdmin ? "Admin Mode Deactivate?" : "Admin Access"}
            </h2>
            <p className="text-[#a89f91] text-xs text-center mb-6 tracking-wider">
              {isAdmin
                ? "Aap admin mode mein hain. Password daalein to deactivate karein."
                : "Admin panel access ke liye password daalein."}
            </p>
            <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Password daalein..."
                value={adminInput}
                onChange={(e) => { setAdminInput(e.target.value); setAdminError(""); }}
                className="bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm w-full focus:outline-none focus:border-[#d4af37]/50"
                autoFocus
              />
              {adminError && <p className="text-red-400 text-xs">{adminError}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37] text-[#0f0c08] py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 border border-[#2a2018] text-[#a89f91] py-3 text-sm uppercase tracking-widest hover:border-[#d4af37]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}