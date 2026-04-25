import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          
          {/* Brand & Socials */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-8 block">
               <Image 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
                alt="Sassy Logo" 
                width={120}
                height={40}
                className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </Link>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com/sassy_products" icon={FaInstagram} label="Instagram" />
              <SocialLink href="https://tiktok.com/@sedoso_cosmetics" icon={FaTiktok} label="TikTok" />
              <SocialLink href="https://youtube.com/@sassycosmetics" icon={FaYoutube} label="YouTube" />
              <SocialLink href="https://wa.me/254706238579" icon={FaWhatsapp} label="WhatsApp" />
            </div>
          </div>
          
          {/* Navigation Columns */}
          <FooterColumn title="Products" links={[
            { label: "Sedoso", href: "/categories/sedoso" },
            { label: "Saa", href: "/categories/saa" },
            { label: "Dr Mehos", href: "/categories/dr-mehos" },
            { label: "All Products", href: "/products" },
          ]} />

          <FooterColumn title="Company" links={[
            { label: "About Us", href: "/about" },
            { label: "Our Stores", href: "/stores" },
            { label: "Wholesale", href: "/wholesale" },
          ]} />

          <FooterColumn title="Support" links={[
            { label: "Contact Us", href: "/contacts" },
          ]} />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-[13px] font-medium uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Sassy Products. Made in Kenya.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-emerald-600 uppercase mb-8">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[15px] text-zinc-500 hover:text-emerald-600 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-600 transition-all"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}
