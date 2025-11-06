import { Leaf, Shield, Heart } from "lucide-react"
import { WhyChooseUsProps, WhyChooseUsItem } from "@/types"

const defaultItems = [
  { 
    icon: Leaf, 
    title: "100% Natural Ingredients", 
    description: "Sourced with care to ensure purity and potency." 
  },
  { 
    icon: Shield, 
    title: "Dermatologically Tested", 
    description: "Gentle and effective for all skin types." 
  },
  { 
    icon: Heart, 
    title: "Proudly Made in Kenya", 
    description: "Crafted with love, supporting our community." 
  },
]

export default function WhyChooseUsSection({ 
  items = defaultItems,
  title = "Why Choose Sassy",
  description = "Our commitment to quality, nature, and your skin's health.",
  backgroundColor = "bg-green-400",
  textColor = "text-gray-900",
  iconColor = "text-green-600",
  iconBackgroundColor = "bg-green-100"
}: WhyChooseUsProps) {
  return (
    <section className={`py-20 px-4 ${backgroundColor}`}> 
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-extrabold ${textColor} mb-6`}> 
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <FeatureCard 
              key={item.title} 
              item={item}
              iconColor={iconColor}
              iconBackgroundColor={iconBackgroundColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  item: WhyChooseUsItem
  iconColor?: string
  iconBackgroundColor?: string
}

function FeatureCard({ item, iconColor = "text-green-600", iconBackgroundColor = "bg-green-100" }: FeatureCardProps) {
  const IconComponent = item.icon
  
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      <div className={`w-20 h-20 ${iconBackgroundColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm`}>
        <IconComponent className={`w-10 h-10 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
      <p className="text-gray-600">{item.description}</p>
    </div>
  )
}
