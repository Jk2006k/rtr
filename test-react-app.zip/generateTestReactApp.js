// generateTestReactApp.js
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const rootDir = path.join(process.cwd(), 'test-react-app');

// Create folder structure
if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir, { recursive: true });
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

// Write package.json
fs.writeFileSync(
  path.join(rootDir, 'package.json'),
  JSON.stringify(
    {
      name: 'test-react-app',
      version: '1.0.0',
      private: true,
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
    },
    null,
    2
  )
);

// Write src/App.jsx
fs.writeFileSync(
  path.join(srcDir, 'App.jsx'),
  `import React from "react";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <h1>Hello React App</h1>
      <button className="btn">Click Me</button>
    </div>
  );
}`
);

// Write src/index.css
fs.writeFileSync(
  path.join(srcDir, 'index.css'),
  `.app {
  text-align: center;
  margin-top: 50px;
}
.btn {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border-radius: 5px;
}`
);

// Write public/index.html
fs.writeFileSync(
  path.join(publicDir, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Test React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
);

// Create zip
const output = fs.createWriteStream(path.join(process.cwd(), 'test-react-app.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ test-react-app.zip created, total size: ${archive.pointer()} bytes`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(rootDir, false);
archive.finalize();
