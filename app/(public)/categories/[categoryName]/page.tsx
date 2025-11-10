import Link from "next/link"
import { FullWidthProductGrid } from "@/components/ui/full-width-product-grid"
import { getFilteredProducts } from "@/lib/data"

function slugToTitle(slug: string): string {
  try {
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, ' ')           // Replace dashes/underscores with space
      .replace(/\s+/g, ' ')             // Collapse multiple spaces
      .trim()                           // Remove leading/trailing spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
  } catch (e) {
    return slug.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryName: string }> }) {
  const { categoryName } = await params
  const categorySlug = categoryName
  const displayCategoryName = slugToTitle(categorySlug)

  console.log("🧩 categorySlug received in page:", categorySlug)

  const products = await getFilteredProducts({ brand: categorySlug }); 
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-600">
              <Link href="/" className="hover:text-rose-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/categories" className="hover:text-rose-600">Categories</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{displayCategoryName}</span>
            </nav>
          </div>
        </div>
        <FullWidthProductGrid 
          initialProducts={products} 
          categoryName={displayCategoryName} 
        />
      </main>
    </div>
  );
}
