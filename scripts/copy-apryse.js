const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../node_modules/@pdftron/webviewer/public');
const destination = path.resolve(__dirname, '../public/lib/webviewer');

console.log('Copying Apryse WebViewer assets...');

try {
    fs.cpSync(source, destination, { recursive: true });
    console.log('✅ Apryse WebViewer assets copied successfully to /public/lib/webviewer!');
} catch (error) {
    console.error('❌ Error copying Apryse WebViewer assets:');
    console.error(error);
    process.exit(1);
}