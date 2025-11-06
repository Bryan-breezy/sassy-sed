import { getAllProducts as getProductsFromDB } from '@/lib/data'

export default async function getAllProducts() {
  return await getProductsFromDB()
}
