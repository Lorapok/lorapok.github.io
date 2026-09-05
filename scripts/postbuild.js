import fs from 'fs';
import path from 'path';

const routes = ['projects', 'agents', 'blog', 'team', 'about', 'changelog', 'contact'];
const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtml)) {
  const content = fs.readFileSync(indexHtml, 'utf8');
  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), content);
  }
  console.log(`✓ Postbuild: generated static index.html for ${routes.length} routes: ${routes.join(', ')}`);
}
