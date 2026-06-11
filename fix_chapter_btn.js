const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

// 1. Fix the Add New button condition
const oldBtnCondition = '{hasPermission("chapters-create") && zoneId && getCurrentUser()?.data?.role === "zone-admin" && (';
const newBtnCondition = '{hasPermission("chapters-create") && getCurrentUser()?.data?.role === "zone-admin" && (';

content = content.replace(oldBtnCondition, newBtnCondition);

// 2. Ensure submitZoneId falls back to getCurrentUser()?.data?.zoneId
const oldSubmitZoneId = 'let submitZoneId = chapterFormData.zoneId || zoneId;';
const newSubmitZoneId = 'let submitZoneId = chapterFormData.zoneId || zoneId || getCurrentUser()?.data?.zoneId;';

content = content.replace(oldSubmitZoneId, newSubmitZoneId);

// 3. Ensure chapterFormData initializes with zoneId from current user if they are zone admin
const oldInitForm = `const [chapterFormData, setChapterFormData] = useState({
    chapterName: "",
    countryName: "",
    stateName: "",
    zoneId: zoneId || "",
    mentorId: [],`;
const newInitForm = `const [chapterFormData, setChapterFormData] = useState({
    chapterName: "",
    countryName: "",
    stateName: "",
    zoneId: zoneId || getCurrentUser()?.data?.zoneId || "",
    mentorId: [],`;

content = content.replace(oldInitForm, newInitForm);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed Add Chapter button visibility and logic for zone admins.');
