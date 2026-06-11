const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const debugUI = `
                  <div className="col-12 text-danger">
                    DEBUG INFO:
                    Role: {getCurrentUser()?.data?.role} <br/>
                    ZoneAdminZoneId: {getZoneAdminZoneId()} <br/>
                    ChapterFormDataZoneId: {chapterFormData.zoneId} <br/>
                    Zones Loaded: {zones.length} <br/>
                    Is Zone in Zones Array?: {zones.some(z => z.value === getZoneAdminZoneId()) ? "YES" : "NO"}
                  </div>
`;

content = content.replace('<form onSubmit={handleChapterSubmit}>', '<form onSubmit={handleChapterSubmit}>' + debugUI);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Injected debug UI');
