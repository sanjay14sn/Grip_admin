const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

// 1. Fix fetchMentors to use current user's zoneId if available
const oldFetchMentors = 'const fetchMentors = async (zoneIdParam = zoneId) => {';
const newFetchMentors = 'const fetchMentors = async (zoneIdParam = zoneId || getCurrentUser()?.data?.zoneId) => {';
content = content.replace(oldFetchMentors, newFetchMentors);

// 2. Hide Zone dropdown if user is zone-admin
const oldZoneCond = '{!zoneId && (';
const newZoneCond = '{!(zoneId || getCurrentUser()?.data?.role === "zone-admin") && (';
content = content.replace(oldZoneCond, newZoneCond);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed auto fetch zone for zone owners');
