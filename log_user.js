const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const effectCode = `
  useEffect(() => {
    console.log("Current User from auth:", getCurrentUser());
    console.log("Is Zone Admin?", getCurrentUser()?.data?.role === 'zone-admin');
    console.log("getZoneAdminZoneId:", getZoneAdminZoneId());
    console.log("Zones array:", zones);
  }, [zones]);
`;

if (!content.includes('Current User from auth')) {
    content = content.replace('useEffect(() => {\n    fetchCountries();', effectCode + '\n  useEffect(() => {\n    fetchCountries();');
}

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Injected console logs');
