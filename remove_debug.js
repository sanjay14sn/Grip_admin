const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const debugUI1 = `
                  <div className="col-12 text-danger">
                    DEBUG INFO:
                    Role: {getCurrentUser()?.data?.role} <br/>
                    ZoneAdminZoneId: {getZoneAdminZoneId()} <br/>
                    ChapterFormDataZoneId: {chapterFormData.zoneId} <br/>
                    Zones Loaded: {zones.length} <br/>
                    FetchZones Status: {zones.length > 0 ? "Loaded" : "Empty (Check Console)"}
                    Is Zone in Zones Array?: {zones.some(z => z.value === getZoneAdminZoneId()) ? "YES" : "NO"}
                  </div>
`;

// Remove debug UI
let newContent = content.replace(debugUI1, '');
if (newContent === content) {
    // If it failed to replace perfectly, let's use a regex
    newContent = content.replace(/<div className="col-12 text-danger">[\s\S]*?<\/div>/, '');
}

// Remove console logs from fetchZones
newContent = newContent.replace('console.log("fetchZones response:", response);', '');

fs.writeFileSync('src/components/RoleAccessLayer.jsx', newContent);
console.log('Removed debug UI');
