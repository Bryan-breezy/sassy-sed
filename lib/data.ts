import { Product, User, UserForAdminList } from '@/types'
import { supabase } from './supabase-client'
import type { Role } from "@/lib/auth"

function getSupabaseImageUrl(imagePath: string): string {
  try {
    // /uploads/img.jpeg -> uploads/img.jpeg
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "uploads"

    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.replace(/^uploads\//, '')
    }

    // getPublicUrl -> {data: {...}, ...
    const { data: publicUrlData } = supabase.storage // renames data into publicUrlData
      .from(bucketName) // Points to supabase bucket(uploads)
      .getPublicUrl(cleanPath) //get public link to the bucket ie https://xy.supabase.co/storage/v1/object/public/uploads/curl.jpg

    return publicUrlData.publicUrl
  } catch (error) {
    console.error(`Error generating URL for image: ${imagePath}`, error)
    return imagePath // Fallback to original path
  }
}

// Main products fetching function
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product') // Product table
      .select(`
        *,
        User:authorId (name)
      `)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error("Supabase Error: Failed to fetch products.", error)
      return []
    }

    // Process images - convert file paths to Supabase URLs
    const productsWithImageUrls = products?.map(product => { // products? -> only map if not null or undefined
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: getSupabaseImageUrl(product.image),
        category: product.category,
        subcategory: product.subcategory,
        sizes: product.sizes || [],
        concerns: product.concerns || [],
        description: product.description,
        featured: product.featured || false,
        author: { name: product.User?.name || 'Unknown' }, // From joined User table
        updatedAt: new Date(product.updatedAt),
        createdAt: new Date(product.createdAt)
      }
    }) || []

    return productsWithImageUrls

  } catch (error) {
    console.error('Failed to fetch all products:', error)
    return []
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select(`
        *,
        User:authorId (name)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      console.error("Supabase Error: Failed to fetch product by ID.", error)
      return null
    }

    return {
      id: product.id,
      name: product.name,
      image: getSupabaseImageUrl(product.image),
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      concerns: product.concerns || [],
      sizes: product.sizes || [],
      description: product.description,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
      featured: product.featured || false,
      authorId: { name: product.User?.name || 'Unknown' }, // From joined User table
      createdAt: new Date(product.createdAt)
    }

  } catch (error) {
    console.error("Error: Failed to fetch product by ID.", error)
    return null
  }
}

// Get filtered products
export async function getFilteredProducts(filters: { category?: string, brand?: string }): Promise<Product[]> {
  console.log('🔍 Filters received:', filters)
  try {
    let query = supabase
      .from('Product') 
      .select(`*`)

    // Apply filters
    if (filters.category) {
      console.log('📁 Filtering by category:', filters.category)
      query = query.ilike('brand', `%${filters.category.trim()}%`)
    }

    if (filters.brand) {
      console.log('🏷️ Filtering by brand:', filters.brand)
      query = query.ilike('brand', `%${filters.brand.trim()}%`)
    }

    const { data: products, error } = await query
    console.log('📊 Query result:', { count: products?.length, error })

    if (error) {
      console.error("Supabase Error: Failed to fetch filtered products", error)
      return []
    }

    console.log(`✅ Found ${products?.length || 0} products`)

    // Process images - convert file paths to Supabase URLs
    return products?.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: getSupabaseImageUrl(product.image),
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes || [],
      concerns: product.concerns || [],
      description: product.description,
      featured: product.featured || false,
      author: { name: product.User?.name || 'Unknown' },
      createdAt: new Date(product.createdAt)
    })) || []

  } catch (error) {
    console.error("Error: Failed to fetch filtered products", error)
    return []
  }
}

// User management functions
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      console.error("Supabase Error: Failed to fetch user.", error)
      return null
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role as Role,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }

  } catch (error) {
    console.error("Error: Failed to fetch user.", error)
    return null
  }
}

export async function getAllUsers(): Promise<UserForAdminList[]> {
  try {
    console.log("Fetching all users from Supabase...")

    const { data: users, error } = await supabase
      .from('User')
      .select('id, name, role, createdAt')
      .order('name', { ascending: true })

    if (error) {
      console.error("Supabase Error: Failed to fetch users.", error)
      return []
    }

    console.log(`Fetched ${users?.length || 0} users.`)

    return users?.map(user => ({
      id: user.id,
      name: user.name,
      role: user.role as Role,
      createdAt: new Date(user.createdAt)
    })) || []

  } catch (error) {
    console.error("Error: Failed to fetch users.", error)
    return []
  }
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select(`
        *,
        User:authorId (name)
      `)
      .ilike('brand', `%${brand}%`)
      .order('name', { ascending: true })

    if (error) {
      console.error("Supabase Error: Failed to fetch products by brand.", error)
      return []
    }

    // Process images - convert file paths to Supabase URLs
    return products?.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: getSupabaseImageUrl(product.image),
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes || [],
      concerns: product.concerns || [],
      description: product.description,
      featured: product.featured || false,
      author: { name: product.User?.name || 'Unknown' }, // From joined User table
      createdAt: new Date(product.createdAt)
    })) || []

  } catch (error) {
    console.error("Error: Failed to fetch products by brand.", error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product') // Your Product table
      .select(`
        *,
        User:authorId (name)
      `)
      .eq('featured', true)
      .order('createdAt', { ascending: false })
      .limit(8)

    if (error) {
      console.error("Supabase Error: Failed to fetch featured products.", error)
      return []
    }

    // Process images - convert file paths to Supabase URLs
    return products?.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: getSupabaseImageUrl(product.image),
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes || [],
      concerns: product.concerns || [],
      description: product.description,
      featured: product.featured || false,
      author: { name: product.User?.name || 'Unknown' }, // From joined User table
      createdAt: new Date(product.createdAt)
    })) || []

  } catch (error) {
    console.error("Error: Failed to fetch featured products.", error)
    return []
  }
}

// Get unique brands for filters
export async function getUniqueBrands(): Promise<string[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select('brand')
      .not('brand', 'is', null)

    if (error) {
      console.error("Supabase Error: Failed to fetch unique brands.", error)
      return []
    }

    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[]
    return brands.sort()

  } catch (error) {
    console.error("Error: Failed to fetch unique brands.", error)
    return []
  }
}

// Get unique categories for filters
export async function getUniqueCategories(): Promise<string[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product') // Your Product table
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error("Supabase Error: Failed to fetch unique categories.", error)
      return []
    }

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[]
    return categories.sort()

  } catch (error) {
    console.error("Error: Failed to fetch unique categories.", error)
    return []
  }
}