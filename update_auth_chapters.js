const fs = require('fs');
let content = fs.readFileSync('src/utils/auth.js', 'utf8');

const replacementStr = `        "chapters-list", "chapters-create", // Needed to show Chapters under this menu and create new ones`;
content = content.replace(/"chapters-list",\s*\/\/\s*Needed to show Chapters under this menu/, replacementStr);

fs.writeFileSync('src/utils/auth.js', content);
console.log('Successfully updated auth.js for chapters-create');
