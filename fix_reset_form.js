const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const oldReset = `zoneId: zoneId || "",
          mentorId: [],`;
const newReset = `zoneId: zoneId || getCurrentUser()?.data?.zoneId || "",
          mentorId: [],`;

content = content.replace(oldReset, newReset);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed form reset logic');
