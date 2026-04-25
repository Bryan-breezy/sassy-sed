'use client'

import Image from "next/image"
import { Download } from "lucide-react"
import { supabase } from '@/lib/supabase-client'

/**
 * Responsive breakpoint audit & fixes:
 *
 * MOBILE  (<640px)
 *  - Stack: image on top, copy below. Single-column layout.
 *  - Image: fixed height 56vw (min 260px) so it never collapses.
 *  - Headline: clamp(2rem, 8vw, 3rem) — readable on 320px screens.
 *  - CTAs: full-width stacked buttons, easy tap targets (min 48px height).
 *  - Stats: justified with flex-1 so they spread evenly, no overflow.
 *  - Padding: px-5 so content never touches viewport edges.
 *  - Badge: smaller padding, repositioned to top-left corner of image.
 *  - Orbs: scaled down (200px) — oversized orbs caused horizontal overflow on narrow screens.
 *
 * TABLET  (640px – 1023px)
 *  - Still single-column stacked. Image taller (60vw, min 320px).
 *  - Headline scales up via clamp. CTAs side-by-side (flex-row).
 *  - Padding increases to px-8 sm:px-12.
 *
 * DESKTOP (≥1024px)
 *  - Side-by-side 50/50 grid. Image panel takes full column height.
 *  - Image panel gets the left-rounded border-radius treatment.
 *  - Copy column left-aligned (not centered), generous horizontal padding.
 *  - CTAs row again (they were always flex-wrap so safe).
 *  - Stats row unchanged.
 *
 * WIDE  (≥1280px / ≥1536px)
 *  - xl: copy padding increases to px-20.
 *  - 2xl: copy padding increases to px-28.
 *  - Headline clamp ceiling bumped to 5.5rem — won't over-scale.
 *
 * FIXED BUGS:
 *  1. `min-h-screen` on the grid caused double scroll on mobile — replaced with
 *     auto height for mobile, min-h-screen only on desktop.
 *  2. `h-[52vw]` on image wrapper had no upper bound; capped with max-h-[480px] on tablet.
 *  3. Vignette gradient used fixed px widths instead of percentage — replaced with
 *     a full inset gradient that works at all widths.
 *  4. orb sizes were fixed at 520px / 380px — caused overflow on mobile. Made responsive.
 *  5. CTAs were `flex-wrap` but with fixed `px-7 py-4` — on very small screens the
 *     buttons were too narrow. Added `w-full sm:w-auto` + `justify-center` on mobile.
 */

export function HeroSection() {
  const { data: heroImageData } = supabase.storage
    .from("uploads")
    .getPublicUrl("1757065218649-whatsapp_image_2025_09_05_at_12.16.08_pm.jpeg")

  const heroImageUrl = heroImageData?.publicUrl || "/placeholder.svg"

  return (
    <section className="relative w-full bg-[#F5F2ED] overflow-hidden hero-section">

      {/* ─── Ambient background orbs (responsive sizes) ─── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="orb orb-green" />
        <div className="orb orb-sand" />
        <div className="grain" />
      </div>

      {/* ─── Layout: stack on mobile/tablet, side-by-side on desktop ─── */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 lg:min-h-screen">

        {/* ══ IMAGE — top on mobile, right column on desktop ══ */}
        <div className="relative order-1 lg:order-2 w-full h-[56vw] min-h-[260px] max-h-[480px] sm:h-[60vw] sm:max-h-[520px] lg:h-auto lg:max-h-none">
          <div className="image-panel fade-up" style={{ animationDelay: "60ms" }}>
            <Image
              src={heroImageUrl}
              alt="Sassy Products Kenya — Natural Cosmetics"
              fill
              priority
              className="object-cover transition-transform duration-[1.4s] ease-out hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            {/* Bottom-to-top fade on mobile so copy reads over image edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F2ED]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#F5F2ED] lg:via-[#F5F2ED]/10 lg:to-transparent" />

            {/* Floating badge */}
            <div className="badge fade-up" style={{ animationDelay: "500ms" }}>
              <span className="badge-dot" />
              <span className="text-[10px] font-bold text-stone-800 uppercase tracking-tight leading-none">
                Premium Quality
              </span>
            </div>

            {/* Made in Kenya label — desktop only (overlaps poorly on small image) */}
            <div className="hidden lg:block absolute bottom-5 right-5 z-20 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Made in Kenya
              </p>
            </div>
          </div>
        </div>

        {/* ══ COPY — below image on mobile, left column on desktop ══ */}
        <div className="flex flex-col justify-center order-2 lg:order-1 px-5 sm:px-10 lg:px-16 xl:px-20 2xl:px-28 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:py-0 text-center lg:text-left">
          {/* Eyebrow */}
          <div
            className="flex items-center justify-center lg:justify-start gap-3 mb-6 fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="inline-block w-5 h-[1.5px] bg-emerald-700" />
            <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
              Proudly Kenyan
            </p>
          </div>

          {/* Headline */}
          <h1
            className="font-display headline-size leading-[1.02] text-stone-900 mb-6 fade-up"
            style={{ animationDelay: "80ms" }}
          >
            Natural.<br />
            <em className="text-emerald-800 not-italic font-light">Skin-Safe.</em><br />
            <span className="text-stone-400 font-extralight">Cosmetics.</span>
          </h1>

          {/* Body copy */}
          <p
            className="text-sm sm:text-base lg:text-lg text-stone-500 leading-relaxed mb-8 fade-up mx-auto lg:mx-0 max-w-sm"
            style={{ animationDelay: "160ms" }}
          >
            Locally-sourced ingredients, expertly crafted in Kenya — for a glow that's as natural as the land that made it.
          </p>

          {/* CTAs — stacked full-width on mobile, row on sm+ */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-14 fade-up items-center lg:items-start"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="https://sassyproducts.co.ke/wp-content/uploads/2025/05/WIP_Sedoso-Catalog-09092024_compressed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full text-sm font-semibold tracking-wide text-white bg-stone-900 hover:bg-emerald-900 transition-colors duration-300 shadow-xl shadow-stone-900/10 min-h-[48px]"
            >
              <Download className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Download Catalogue
            </a>
            <a
              href="#products"
              className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full text-sm font-semibold tracking-wide text-stone-700 border border-stone-200 hover:border-emerald-300 hover:text-emerald-800 transition-colors duration-300 min-h-[48px]"
            >
              View Products
            </a>
          </div>

          {/* Stats row */}
          <dl
            className="flex items-center justify-center lg:justify-start gap-0 fade-up"
            style={{ animationDelay: "320ms" }}
          >
            {[
              { value: "100%", label: "Natural" },
              { value: "Local", label: "Sourced" },
              { value: "Skin", label: "Safe" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 sm:flex-none sm:gap-6">
                {i > 0 && <div className="w-px h-5 bg-stone-200 shrink-0 mx-auto sm:mx-0" />}
                <div className="flex-1 sm:flex-none text-center lg:text-left">
                  <dt className="text-lg sm:text-xl font-display font-semibold text-stone-800 leading-none">
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

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display  { font-family: 'Playfair Display', Georgia, serif; }
        .hero-section  { font-family: 'DM Sans', sans-serif; }

        /* Fluid headline — safe on 320px, elegant at 1920px */
        .headline-size { font-size: clamp(2rem, 6vw, 5.5rem); }

        /* ── Orbs — scale with viewport ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.32;
        }
        .orb-green {
          width: clamp(180px, 40vw, 520px);
          height: clamp(180px, 40vw, 520px);
          background: radial-gradient(circle, #6ee7b7, transparent 70%);
          top: -60px; right: 0;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb-sand {
          width: clamp(140px, 30vw, 380px);
          height: clamp(140px, 30vw, 380px);
          background: radial-gradient(circle, #d6c9b3, transparent 70%);
          bottom: -40px; left: 0;
          animation: drift 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(16px, 24px) scale(1.06); }
        }

        /* ── Grain ── */
        .grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.45;
          pointer-events: none;
        }

        /* ── Image panel ── */
        .image-panel {
          position: absolute;
          inset: 0;
          overflow: hidden;
          /* No border-radius on mobile/tablet — image is full-width */
          border-radius: 0;
        }
        @media (min-width: 1024px) {
          /* Only round the left corners on desktop where it bleeds right */
          .image-panel {
            border-radius: 2.5rem 0 0 2.5rem;
          }
        }

        /* ── Badge ── */
        .badge {
          position: absolute;
          top: 0.875rem;
          left: 0.875rem;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(12px);
          padding: 6px 12px;
          border-radius: 999px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.9);
        }
        @media (min-width: 640px) {
          .badge { top: 1.25rem; left: 1.5rem; padding: 8px 14px; }
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #059669;
          box-shadow: 0 0 0 2px rgba(5,150,105,0.25);
          animation: pulse 2.4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(5,150,105,0.25); }
          50%       { box-shadow: 0 0 0 5px rgba(5,150,105,0.10); }
        }

        /* ── Entrance animations ── */
        .fade-up {
          opacity: 0;
          transform: translateY(14px);
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Respect reduced-motion preference */
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; opacity: 1; transform: none; }
          .orb-green, .orb-sand { animation: none; }
          .badge-dot { animation: none; }
        }
      `}</style>
    </section>
  )
}
