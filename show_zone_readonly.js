const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

// Revert hiding the Zone dropdown
const hiddenZoneCond = '{!(zoneId || getCurrentUser()?.data?.role === "zone-admin") && (';
const showZoneCond = '{!zoneId && (';
content = content.replace(hiddenZoneCond, showZoneCond);

// Now inside the select element, make it disabled if they are a zone-admin
// We also need to make sure the value is correctly selected. 
// chapterFormData.zoneId is already initialized to getCurrentUser()?.data?.zoneId in the useState.
const selectElement = `<select
                        className={\`form-control form-select \${chaptererror.zoneId ? "is-invalid" : ""}\`}
                        name="zoneId"
                        value={chapterFormData.zoneId}
                        onChange={handleChapterZoneChange}
                      >`;

const disabledSelectElement = `<select
                        className={\`form-control form-select \${chaptererror.zoneId ? "is-invalid" : ""}\`}
                        name="zoneId"
                        value={chapterFormData.zoneId}
                        onChange={handleChapterZoneChange}
                        disabled={getCurrentUser()?.data?.role === "zone-admin"}
                      >`;

content = content.replace(selectElement, disabledSelectElement);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Restored Zone dropdown but made it disabled for zone-admin');
