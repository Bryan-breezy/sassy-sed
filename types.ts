import type { Role } from '@/lib/auth'

export type Product = {
  id: string
  name: string
  image: string
  brand: string
  category: string
  subcategory?: string 
  updatedAt?: Date | string
  createdAt: Date | string
  sizes: string[]
  concerns: string[]
  authorId?: { name: string }
  featured?: boolean
  description: string
}

export type ProductCardProps = {
  product: Product
  className?: string
}

export type ProductGridProps = {
  products: Product[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

// Category Types
export type Category = {
  name: string
  image: string
  href: string
  description: string
  productCount: number
}

export type CategoryFilter = {
  name: string;
  count: number;
}

export type FeaturedCategoriesProps = {
  categories: Category[]
}

export type LatestProductsSectionProps = {
  title?: string
  backgroundColor?: string
  textColor?: string
}

export interface WhyChooseUsItem {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export interface WhyChooseUsProps {
  items?: WhyChooseUsItem[]
  title?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  iconBackgroundColor?: string
}

export interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  createdAt: string
  author: { name: string }
}

// Add to your existing types file
export type BrandCategory = {
  name: string
  image: string
  href: string
  description: string
}

export interface OurBrandsProps {
  brands?: BrandCategory[]
  title?: string
  description?: string
  backgroundColor?: string
  showExploreButton?: boolean
  exploreButtonText?: string
  exploreButtonHref?: string
  cardBackgroundColor?: string
  buttonBackgroundColor?: string
  buttonTextColor?: string
}

// API Response Types
export type ApiResponse<T> = {
  data: T
  error?: string
  success: boolean
}

export type ProductsResponse = ApiResponse<Product[]>

// Form Types
export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export type NewsletterFormData = {
  email: string
}

// Filter Types
export type ProductFilters = {
  category?: string
  brand?: string[]
  priceRange?: {
    min: number
    max: number
  }
  sizes?: string[]
  concerns?: string[]
  inStock?: boolean
  featured?: boolean
}

export type SortOption = 
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'name-a-z'
  | 'name-z-a'
  | 'rating'

// Cart Types
export type CartItem = {
  product: Product
  quantity: number
  selectedSize?: string
}

export type Cart = {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order Types
export type Order = {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date | string
  shippingAddress: ShippingAddress
  paymentMethod: string
}

export type ShippingAddress = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

// User Types
export type User = {
  id: string
  name: string
  role: Role
  createdAt: Date | string
  updatedAt: Date | string
}

export type CurrentUser = {
  id: string
  name: string
  role: Role
} | null

export type UserForAdminList = {
  id: string
  name: string
  role: Role
  createdAt: Date | string
}

export interface UserActionsProps {
  userId: string
  currentUser: CurrentUser
}

// UI Component Props
export type ButtonProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export type CardProps = {
  children: React.ReactNode
  className?: string
}

// Supabase Storage Types
export type StorageFile = {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, unknown>
}

// Search Types
export type SearchParams = {
  query: string
  category?: string
  sortBy?: SortOption
  page?: number
  limit?: number
}

// Pagination Types
export type PaginationInfo = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Featured Products Props (for the component we just created)
export type FeaturedProductsProps = {
  featuredProducts: Product[]
  title?: string
  description?: string
  showViewAllButton?: boolean
}

export interface SessionData {
  user?: {
    id: string;
    name: string;
    role: string;
  };
  isLoggedIn: boolean;
}
