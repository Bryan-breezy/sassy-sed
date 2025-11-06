const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const users = [
  { 
    name: 'Bryan', 
    password: process.env.BRYAN_PASSWORD || 'defaultPassword' 
  },
]

const prisma = new PrismaClient()

// Function to parse CSV content into an array of objects
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0]
                      .split(',')
                      .map(h => h.trim().replace(/"/g, ''))
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = lines[i]
                      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                      .map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
    if (values.length !== headers.length) continue; // Skip malformed rows
    
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = values[index]
    },
    data.push(obj)
  )}
  
  return data
}

// Function to find file with case-insensitive fallback
function findFile(fileName, baseDir) {
  const possibleCases = [
    fileName,
    fileName.toLowerCase(),
    fileName.toUpperCase(),
    fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase(),
  ]
  for (const name of possibleCases) {
    const filePath = path.join(baseDir, name)
    if (fs.existsSync(filePath)) {
      console.log(`Found file: ${filePath}`)
      return filePath
    }
  }
  return null
}

// Read and parse CSV files with error handling
let productCSV, mediaCSV

const productFilePath = findFile('Product.csv', __dirname) || findFile('Product.csv', path.join(__dirname, '..'))
const mediaFilePath = findFile('Media.csv', __dirname) || findFile('Media.csv', path.join(__dirname, '..'))

try {
  productCSV = fs.readFileSync(productFilePath, 'utf8')
  mediaCSV = fs.readFileSync(mediaFilePath, 'utf8')
} catch (err) {
  process.exit(1)
}

// Transform CSV data to match Prisma schema
const products = parseCSV(productCSV).map(p => ({
  id: p.id,
  name: p.name,
  image: p.image,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  concerns: p.concerns ? p.concerns
    .replace(/^{|}$/g, '')
    .split(',')
    .map(c => c.trim().replace(/""/g, '"').replace(/"/g, '')) : [],
  createdAt: new Date(p.createdAt),
  updatedAt: new Date(p.updatedAt),
  authorId: p.authorId, // Will override later
  sizes: p.sizes ? p.sizes.replace(/^{|}$/g, '').split(',').map(s => s.trim()) : [],
  featured: p.featured === 'True',
  description: p.description,
}))

const media = parseCSV(mediaCSV).map(m => ({
  id: m.id,
  name: m.name,
  url: m.url,
  size: parseInt(m.size, 10),
  type: m.type,
  createdAt: new Date(m.createdAt),
  updatedAt: new Date(m.updatedAt),
  authorId: m.authorId, // Will override later
}))

async function main() {
  // Seed users
  const createdUsers = []

  for (const u of users) {
    if (!u.password) {
      process.exit(1)
    }
    const hashedPassword = await bcrypt.hash(u.password, 10)

    const user = await prisma.user.upsert({
      where: { name: u.name },
      update: {},
      create: {
        name: u.name,
        passwordHash: hashedPassword,
        role: u.name === 'Bryan' ? "ADMIN" : "EDITOR",
      },
    })
    createdUsers.push(user)
  }

  const author = createdUsers[0]

  // Seed Media
  await prisma.media.createMany({
    data: media.map(m => ({
      id: m.id,
      name: m.name,
      url: m.url,
      size: m.size,
      type: m.type,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      authorId: author.id, // Override with seeded author
    })),
    skipDuplicates: true,
  })

  // Seed Products
  await prisma.product.createMany({
    data: products.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      concerns: p.concerns,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      authorId: author.id, // Override with seeded author
      sizes: p.sizes,
      featured: p.featured,
      description: p.description,
    })),
    skipDuplicates: true,
  })
  console.log(`📦 Seeded ${products.length} products for ${author.name}.`);

  console.log('✅ Seeding finished.');
}

// Run the main function and handle exit
main()
  .catch((e) => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })