import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, '..', 'public');

// Copiar todos los archivos necesarios a la carpeta 'public'
fs.copySync(path.join(srcDir, 'views'), path.join(destDir, 'views'));
fs.copySync(path.join(srcDir, 'src'), path.join(destDir, 'src'));
fs.copySync(path.join(srcDir, 'public'), destDir);

// Renderizar EJS a HTML y colocarlos en la carpeta 'public'
const files = fs.readdirSync(path.join(srcDir, 'views'));

files.forEach(file => {
  if (path.extname(file) === '.ejs') {
    const str = fs.readFileSync(path.join(srcDir, 'views', file), 'utf8');
    const html = ejs.render(str, {});
    fs.writeFileSync(path.join(destDir, path.basename(file, '.ejs') + '.html'), html);
  }
});

console.log('Build completed successfully.');
