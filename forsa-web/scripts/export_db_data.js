import fs from 'fs';
import { categories } from '../src/data.js';

const dbCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    icon_name: c.icon,
    color_hex: c.color
}));

const dbSubcategories = categories.flatMap(c =>
    c.subs ? c.subs.map(s => ({
        id: s.id,
        category_id: c.id,
        name: s.name,
        icon_name: s.icon
    })) : []
);

fs.writeFileSync('categories.json', JSON.stringify(dbCategories, null, 2));
fs.writeFileSync('subcategories.json', JSON.stringify(dbSubcategories, null, 2));

console.log(`Exported ${dbCategories.length} categories and ${dbSubcategories.length} subcategories.`);
