import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0704] border-t border-[#2a2018] pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-serif text-[#d4af37] mb-6 tracking-[0.2em]">GLAMOURGRID</h3>
          <p className="text-xs text-[#a89f91] mb-8 leading-relaxed tracking-wide font-light">
            Elevate Your Beauty. Premium international cosmetics brand for the modern aesthete.
          </p>
          <div className="flex gap-5">
            {["IG", "FB", "X", "YT", "TT"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[10px] font-bold tracking-widest text-[#a89f91] hover:text-[#d4af37] transition-colors duration-300 uppercase"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#d4af37] mb-6 tracking-[0.3em] uppercase">Shop</h4>
          <ul className="space-y-4 text-xs text-[#a89f91] tracking-wide">
            {[
              { label: "Makeup", href: "/shop/makeup" },
              { label: "Lipsticks", href: "/shop/lipsticks" },
              { label: "Skincare", href: "/shop/skincare" },
              { label: "Haircare", href: "/shop/haircare" },
              { label: "Fragrance", href: "/shop/fragrance" },
              { label: "Beauty Tools", href: "/shop/beauty-tools" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#d4af37] transition-colors duration-300">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#d4af37] mb-6 tracking-[0.3em] uppercase">Customer Care</h4>
          <ul className="space-y-4 text-xs text-[#a89f91] tracking-wide">
            {[
              { label: "Contact: glomourgrid32@gmail.com", href: "mailto:glomourgrid32@gmail.com" },
              { label: "Track Your Order 📦", href: "/track-order" },
              { label: "Shipping & Returns", href: "/shipping" },
              { label: "FAQs", href: "/faq" },
              { label: "My Account", href: "/account" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#d4af37] transition-colors duration-300">{label}</Link>
              </li>
            ))}

          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[10px] font-semibold text-[#d4af37] mb-6 tracking-[0.3em] uppercase">Newsletter</h4>
          <p className="text-xs text-[#a89f91] mb-5 leading-relaxed tracking-wide">
            Subscribe for exclusive deals, new arrivals, and beauty insights.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#16100a] text-[#FDFBF7] text-xs px-4 py-3 border border-[#2a2018] focus:border-[#d4af37] outline-none transition-colors duration-300 placeholder:text-[#4a4035] tracking-wide"
            />
            <button
              type="submit"
              className="bg-[#d4af37] text-[#0f0c08] text-[10px] font-bold tracking-[0.25em] uppercase py-3 hover:bg-[#e8c84a] transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-[#2a2018] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-[#4a4035] tracking-widest uppercase">
          &copy; {new Date().getFullYear()} GlamourGrid. All Rights Reserved.
        </p>
        <p className="text-[10px] text-[#4a4035] tracking-widest uppercase">
          Premium Cosmetics & Beauty
        </p>
      </div>
    </footer>
  );
}