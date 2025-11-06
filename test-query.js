
import { PrismaClient } from '@prisma/client'

// Initialize the Prisma client
const prisma = new PrismaClient();

// async function runTest() {
//   console.log("--- Starting database query test ---");

//   // These are the exact values from your URL
//   const testBrand = 'Sedoso';
//   const testCategory = 'Cleaning';

//   console.log(`Searching for products with BRAND = "${testBrand}" AND CATEGORY = "${testCategory}"`);

//   try {
//     const whereClause = {
//       brand: {
//         equals: testBrand,
//         mode: 'insensitive',
//       },
//       category: {
//         equals: testCategory,
//         mode: 'insensitive',
//       },
//     };

//     const products = await prisma.product.findMany({
//       where: whereClause,
//       select: { // Select only what we need to see
//         id: true,
//         name: true,
//         brand: true,
//         category: true,
//       },
//     });

//     console.log("\n--- QUERY COMPLETE ---");
//     console.log(`Found ${products.length} products.`);

//     if (products.length > 0) {
//       console.log("Here they are:");
//       console.table(products);
//     } else {
//       console.log("The query returned an empty array. This is why the page shows 404.");
//       console.log("ACTION: Please check Prisma Studio to confirm that a product exists with these exact brand and category values.");
//     }

//   } catch (error) {
//     console.error("\n--- A CRITICAL ERROR OCCURRED DURING THE QUERY ---");
//     console.error(error);
//   } finally {
//     await prisma.$disconnect();
//     console.log("\n--- Test finished. Disconnected from database. ---");
//   }
// }

async function runTest() {
  console.log("--- Starting database query test ---");

  // --- CHANGE THESE VALUES ---
  const testBrand = 'Sedoso';
  const testCategory = 'Personal'; // Use the category from the failing URL

  console.log(`Searching for products with BRAND = "${testBrand}" AND CATEGORY = "${testCategory}"`);

  try {
    const whereClause = {
      brand: { equals: testBrand, mode: 'insensitive' },
      category: { equals: testCategory, mode: 'insensitive' },
    };

    const products = await prisma.product.findMany({ where: whereClause });

    console.log("\n--- QUERY COMPLETE ---");
    console.log(`Found ${products.length} products.`);

    if (products.length > 0) {
      console.log("Here they are:");
      console.table(products);
    } else {
      console.log("The query returned an empty array. This is why the page shows a 404.");
      console.log("ACTION: Open Prisma Studio and check the exact spelling and wording of the 'brand' and 'category' columns for these products.");
    }

  } catch (error) {
    console.error("\n--- A CRITICAL ERROR OCCURRED ---", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n--- Test finished. ---");
  }
}


// Run the test
runTest();