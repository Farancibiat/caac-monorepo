const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'utils', 'email', 'templates');
const dest = path.join(__dirname, '..', 'dist', 'utils', 'email', 'templates');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
