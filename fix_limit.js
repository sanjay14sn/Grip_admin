const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

content = content.replace('await chapterApiProvider.getZones({ limit: 1000 });', 'await chapterApiProvider.getZones({ limit: 100 });');

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed limit constraint');
