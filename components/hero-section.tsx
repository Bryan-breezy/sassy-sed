'use client'

import Image from "next/image"
import { Download } from "lucide-react"
import { supabase } from '@/lib/supabase-client'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export function HeroSection() {
  // Fetch image from supabase
  const { data: heroImageData } = supabase.storage
    .from("uploads")
    .getPublicUrl("1757065218649-whatsapp_image_2025_09_05_at_12.16.08_pm.jpeg")

  const heroImageUrl = heroImageData?.publicUrl || "/placeholder.svg"

  return (
    // Background color off-white
    <section className={`${dmSans.className} relative w-full bg-[#F5F2ED] overflow-hidden`}>

      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full opacity-30" style={{
          width: 'clamp(160px, 38vw, 480px)', height: 'clamp(160px, 38vw, 480px)',
          background: 'radial-gradient(circle, #6ee7b7, transparent 70%)',
          filter: 'blur(55px)', top: '-40px', right: '0',
          animation: 'drift 12s ease-in-out infinite alternate',
        }} />
        <div className="absolute rounded-full opacity-25" style={{
          width: 'clamp(120px, 28vw, 340px)', height: 'clamp(120px, 28vw, 340px)',
          background: 'radial-gradient(circle, #d6c9b3, transparent 70%)',
          filter: 'blur(55px)', bottom: '-30px', left: '0',
          animation: 'drift 15s ease-in-out infinite alternate-reverse',
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYOUT
          Mobile/tablet (<1024px): single column, image on top
          Desktop (≥1024px):       two columns, copy left / image right
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 lg:min-h-screen">

        {/* ══ IMAGE ══ */}
        <div className="relative order-1 lg:order-2 w-full hero-image-col">
          <div className="absolute inset-0 overflow-hidden lg:rounded-[2.5rem_0_0_2.5rem]">
            <Image
              src={heroImageUrl}
              alt="Sassy Products Kenya — Natural Cosmetics"
              fill
              priority
              className="object-cover object-top transition-transform duration-[1.4s] ease-out hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 55vw"
              // 400 error fallback — if Supabase path is wrong, show placeholder
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
            />
            {/* Gradient: mobile = none, desktop = left-fade blending into copy column */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#F5F2ED] via-[#F5F2ED]/10 to-transparent" />
          </div>
        </div>

        {/* ══ COPY ══ */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-28 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:py-20 text-center lg:text-left">

          {/* Eyebrow */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
            <span className="inline-block w-5 h-[1.5px] bg-emerald-700 shrink-0" />
            <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
              Proudly Kenyan
            </p>
          </div>

          {/* Headline */}
          <h1 className={`${playfair.className} hero-headline leading-[1.05] text-stone-900 mb-5`}>
            Natural.<br />
            <em className="text-emerald-800 not-italic">Skin-Safe.</em><br />
            <span className="text-stone-400">Cosmetics.</span>
          </h1>

          {/* Body */}
          <p className="text-sm sm:text-base lg:text-lg text-stone-500 leading-relaxed mb-8 mx-auto lg:mx-0 max-w-sm">
            Locally-sourced ingredients, expertly crafted in Kenya — for a glow that's as natural as the land that made it.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 items-center lg:items-start">
            <a
              href="https://sassyproducts.co.ke/wp-content/uploads/2025/05/WIP_Sedoso-Catalog-09092024_compressed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-stone-900 hover:bg-emerald-900 transition-colors duration-300 shadow-lg min-h-[48px]"
            >
              <Download className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Download Catalogue
            </a>
            <a
              href="#products"
              className="flex items-center justify-center w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold text-stone-700 border border-stone-200 hover:border-emerald-300 hover:text-emerald-800 transition-colors duration-300 min-h-[48px]"
            >
              View Products
            </a>
          </div>

          {/* Stats */}
          <dl className="flex items-center justify-center lg:justify-start">
            {[
              { value: "100%", label: "Natural" },
              { value: "Local", label: "Sourced" },
              { value: "Skin",  label: "Safe"    },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 sm:flex-none sm:gap-8">
                {i > 0 && <div className="w-px h-5 bg-stone-200 shrink-0 mx-auto sm:mx-0" />}
                <div className="flex-1 sm:flex-none text-center lg:text-left">
                  <dt className={`${playfair.className} text-xl font-semibold text-stone-800 leading-none`}>
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-400">
                    {s.label}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

      </div>

      <style>{`
        /* Image column height:
           Mobile/tablet — explicit height so image doesn't collapse to 0.
           Desktop (lg)  — no height; the CSS grid row stretches it automatically.
           Using a class here (not inline style) so lg: Tailwind override works. */
        .hero-image-col {
          height: clamp(280px, 65vw, 480px);
        }
        @media (min-width: 1024px) {
          .hero-image-col {
            height: auto;   /* grid row determines height */
          }
        }

        /* Fluid headline — 2.6rem floor keeps it readable on 320px phones */
        .hero-headline {
          font-size: clamp(2.6rem, 5.5vw, 5.5rem);
        }

        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(14px,20px) scale(1.05); }
        }
        .badge-pulse {
          box-shadow: 0 0 0 3px rgba(5,150,105,0.18);
          animation: badge-pulse-anim 2.4s ease-in-out infinite;
        }
        @keyframes badge-pulse-anim {
          0%,100% { box-shadow: 0 0 0 3px rgba(5,150,105,0.18); }
          50%     { box-shadow: 0 0 0 6px rgba(5,150,105,0.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  )
}
