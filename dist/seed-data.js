"use strict"

Object.defineProperty(exports, "__esModule", { value: true })
exports.teamMembers = exports.products = exports.users = void 0
var products_1 = require("@/app/data/products")

exports.users = [
    { name: 'Bryan', password: process.env.USER_PASSWORD },
]

exports.products = products_1.allProducts.map(function (product) { return ({
    name: product.name,
    image: product.image,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    sizes: product.sizes,
    concerns: product.concerns,
})
 })
exports.teamMembers = [
    { name: 'Bryan' },
]
