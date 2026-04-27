import { Leaf, Shield, Heart, LucideIcon } from "lucide-react"

interface WhyChooseUsItem {
  icon: LucideIcon
  title: string
  description: string
}

interface WhyChooseUsProps {
  items?: WhyChooseUsItem[]
  title?: string
  description?: string
}

const defaultItems: WhyChooseUsItem[] = [
  {
    icon: Leaf,
    title: "100% Natural Ingredients",
    description: "Every ingredient is locally sourced with care to ensure purity, potency, and connection to the land.",
  },
  {
    icon: Shield,
    title: "Dermatologically Tested",
    description: "Clinically verified to be gentle and effective across all skin types — no compromises.",
  },
  {
    icon: Heart,
    title: "Proudly Made in Kenya",
    description: "Crafted with love in Nairobi, supporting local communities and celebrating Kenyan beauty.",
  },
]

export default function WhyChooseUsSection({
  items = defaultItems,
  title = "Why Choose Sassy",
  description = "Our commitment to quality, nature, and your skin's health.",
}: WhyChooseUsProps) {
  return (
    <section className="bg-stone-900 py-20 lg:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="max-w-xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-5 h-[1.5px] bg-emerald-500" />
            <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-500 uppercase">
              Our Promise
            </p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-stone-50 leading-[1.05] mb-5">
            {title}
          </h2>
          <p className="text-stone-400 text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-stone-700/50 rounded-2xl overflow-hidden">
          {items.map((item, i) => (
            <FeatureCard key={item.title} item={item} index={i} />
          ))}
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
    </section>
  )
}

function FeatureCard({ item, index }: { item: WhyChooseUsItem; index: number }) {
  const Icon = item.icon
  const delays = ["0ms", "80ms", "160ms"]

  return (
    <div
      className="group bg-stone-900 hover:bg-stone-800 transition-colors duration-300 p-8 lg:p-10 flex flex-col gap-6"
      style={{ animationDelay: delays[index] }}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-full border border-emerald-700/60 flex items-center justify-center group-hover:border-emerald-500 transition-colors duration-300">
        <Icon className="w-4.5 h-4.5 text-emerald-500 w-[18px] h-[18px]" strokeWidth={1.5} />
      </div>

      {/* Index number — editorial detail */}
      <span className="text-[10px] font-bold tracking-[0.2em] text-stone-600 uppercase">
        0{index + 1}
      </span>

      {/* Copy */}
      <div>
        <h3 className="font-serif text-xl font-medium text-stone-100 mb-3 leading-snug">
          {item.title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="mt-auto pt-6 border-t border-stone-800 group-hover:border-emerald-900 transition-colors duration-300">
        <span className="inline-block w-0 group-hover:w-8 h-[1.5px] bg-emerald-600 transition-all duration-500 ease-out" />
      </div>
    </div>
  )
}
