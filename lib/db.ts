// lib/db.ts
import { PrismaClient } from '@prisma/client'


declare global {
  var prisma: PrismaClient | undefined
}

// Instantiate the PrismaClient.
// In a production environment, a new instance is always created.
// In a development environment, it checks if an instance already exists on the global object.
// If it does, it uses that instance; otherwise, it creates a new one.
export const db = globalThis.prisma || new PrismaClient()

// If we are in a development environment, we assign the PrismaClient instance to the global variable.
// This ensures that the same instance is reused across hot reloads.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}