"use strict"
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamMembers = exports.products = exports.users = void 0;
const products_1 = require("../app/data/products");
exports.users = [
    { name: 'Bryan', password: 'HBOAFM4557' },
    { name: 'EditorUser', password: 'password456' },
];
exports.products = products_1.allProducts.map((product) => ({
    name: product.name,
    image: product.image,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    sizes: product.sizes,
    concerns: product.concerns,
}));
exports.teamMembers = [
    { name: 'Bryan' },
];
