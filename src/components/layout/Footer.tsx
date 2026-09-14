import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#07080A] border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-serif text-[#D4AF37] mb-6 tracking-[0.2em]">GLAMOURGRID</h3>
          <p className="text-xs text-[#9CA3AF] mb-8 leading-relaxed tracking-wide font-light">
            Elevate Your Beauty. Premium international cosmetics brand for the modern aesthete.
          </p>
          <div className="flex gap-5">
            {["IG", "FB", "X", "YT", "TT"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[10px] font-bold tracking-widest text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-300 uppercase"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#D4AF37] mb-6 tracking-[0.3em] uppercase">Shop</h4>
          <ul className="space-y-4 text-xs text-[#9CA3AF] tracking-wide">
            {[
              { label: "Makeup", href: "/shop/makeup" },
              { label: "Lipsticks", href: "/shop/makeup/lipsticks" },
              { label: "Skincare", href: "/shop/skincare" },
              { label: "Fragrance", href: "/shop/fragrance" },
              { label: "New Arrivals", href: "/shop?sort=newest" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#D4AF37] transition-colors duration-300">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#D4AF37] mb-6 tracking-[0.3em] uppercase">Customer Care</h4>
          <ul className="space-y-4 text-xs text-[#9CA3AF] tracking-wide">
            {[
              { label: "Contact: glomourgrid32@gmail.com", href: "mailto:glomourgrid32@gmail.com" },
              { label: "Track Your Order 📦", href: "/track-order" },
              { label: "Shipping & Returns", href: "/shipping" },
              { label: "FAQs", href: "/faq" },
              { label: "My Account", href: "/orders" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#D4AF37] transition-colors duration-300">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#D4AF37] mb-6 tracking-[0.3em] uppercase">Newsletter</h4>
          <p className="text-xs text-[#9CA3AF] mb-5 leading-relaxed tracking-wide font-light">
            Subscribe for exclusive deals, new arrivals, and beauty insights.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#121316] text-[#F8F9FA] text-xs px-4 py-3 border border-white/10 focus:border-[#D4AF37]/50 rounded outline-none transition-colors duration-300 placeholder:text-[#9CA3AF]/40 tracking-wide"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] text-[#0B0C10] text-[10px] font-bold tracking-[0.25em] uppercase py-3 rounded hover:bg-[#E6CA65] transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-[#9CA3AF]/60 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} GlamourGrid. All Rights Reserved.
        </p>
        <p className="text-[10px] text-[#9CA3AF]/60 tracking-widest uppercase">
          Modern Luxury Haute Parfumerie & Cosmetics
        </p>
      </div>
    </footer>
  );
}