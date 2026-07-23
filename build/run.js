const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const { CATEGORIES } = require('./data');
const { buildIndexHTML } = require('./pages/index');
const { buildAboutHTML } = require('./pages/about');
const { buildContactHTML } = require('./pages/contact');
const { buildCategoryHTML } = require('./pages/category');

fs.writeFileSync(path.join(ROOT, 'index.html'), buildIndexHTML());
fs.writeFileSync(path.join(ROOT, 'about.html'), buildAboutHTML());
fs.writeFileSync(path.join(ROOT, 'contact.html'), buildContactHTML());

const catDir = path.join(ROOT, 'category');
fs.mkdirSync(catDir, { recursive: true });
CATEGORIES.forEach(cat => {
  fs.writeFileSync(path.join(catDir, cat.slug + '.html'), buildCategoryHTML(cat));
});

console.log('Generated: index.html, about.html, contact.html, and ' + CATEGORIES.length + ' category pages.');
