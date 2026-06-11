const fs = require('fs');
let content = fs.readFileSync('src/utils/auth.js', 'utf8');

const replacementStr = `        "roles-list", "roles-create", "roles-update", "roles-delete",    // Needed to show Role menu and manage roles`;
content = content.replace(/"roles-list",\s*\/\/\s*Needed to show Role menu/, replacementStr);

fs.writeFileSync('src/utils/auth.js', content);
console.log('Successfully updated auth.js');
