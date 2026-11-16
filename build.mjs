// Keeps the menu and footer the same on every page. Edit src/menu.json or src/partials/*, then run: node build.mjs
// No dependencies. It rewrites the <header class="site"> and <footer class="site"> blocks in each root .html file.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const menu = JSON.parse(readFileSync('src/menu.json', 'utf8')).items;
const header = readFileSync('src/partials/header.html', 'utf8').trim();
const footer = readFileSync('src/partials/footer.html', 'utf8').trim();
let changed = 0;
for (const file of readdirSync('.').filter(f => f.endsWith('.html'))) {
  const nav = menu.map(m => {
    const current = file === m.href || (m.also || []).includes(file);
    return `<a href="${m.href}"${m.cta ? ' class="nav-cta"' : ''}${current ? ' aria-current="page"' : ''}>${m.label}</a>`;
  }).join('');
  let html = readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/<header class="site">[\s\S]*?<\/header>/, header.replace('{{NAV}}', nav));
  html = html.replace(/<footer class="site">[\s\S]*?<\/footer>/, footer);
  if (html !== before) { writeFileSync(file, html); changed++; }
}
console.log(`menu and footer synced in ${changed} page(s)`);
