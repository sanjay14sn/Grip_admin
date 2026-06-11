const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

// The fallback function
const helperFunc = `
  const getZoneAdminZoneId = () => {
    const user = getCurrentUser()?.data;
    if (user?.role === 'zone-admin') {
       return user.zoneId || user.id;
    }
    return null;
  };
`;

if (!content.includes('getZoneAdminZoneId')) {
    content = content.replace('const ChapterAccessLayer = () => {', 'const ChapterAccessLayer = () => {' + helperFunc);
}

// Replace getCurrentUser()?.data?.zoneId with getZoneAdminZoneId()
content = content.replace(/getCurrentUser\(\)\?\.data\?\.zoneId/g, 'getZoneAdminZoneId()');

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Added fallback to user.id for zone-admin zoneId');
