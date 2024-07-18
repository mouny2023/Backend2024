import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'index.ejs');
const outputPath = path.join(__dirname, 'public', 'index.html');

ejs.renderFile(templatePath, {}, (err, str) => {
  if (err) {
    console.error('Error rendering EJS:', err);
    process.exit(1);
  } else {
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync(outputPath, str);
    console.log('index.html has been generated successfully.');
  }
});
