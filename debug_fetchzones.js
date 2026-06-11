const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const oldFetchZones = `  const fetchZones = async () => {
    const response = await chapterApiProvider.getZones({ limit: 1000 });
    if (response && response.status) {`;

const newFetchZones = `  const fetchZones = async () => {
    const response = await chapterApiProvider.getZones({ limit: 1000 });
    console.log("fetchZones response:", response);
    if (response && response.status) {`;

content = content.replace(oldFetchZones, newFetchZones);

const debugUI = `<br/>
                    FetchZones Status: {zones.length > 0 ? "Loaded" : "Empty (Check Console)"}`;

content = content.replace('Zones Loaded: {zones.length} <br/>', 'Zones Loaded: {zones.length} <br/>' + debugUI);

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Injected fetchZones debug');
