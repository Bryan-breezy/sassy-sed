import { WhyChooseUsItem } from '@/types'

interface FeatureCardProps {
  item: WhyChooseUsItem
}

export function FeatureCard({ item }: FeatureCardProps) {
  const IconComponent = item.icon
  
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <IconComponent className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-4">{item.title}</h3>
      <p className="text-gray-600">{item.description}</p>
    </div>
  )
}
