const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

const oldEffect = `  // Sync zoneId with chapterFormData
  useEffect(() => {
    if (zoneId && zones.length > 0) {
      const selectedZone = zones.find((z) => z.value === zoneId);
      if (selectedZone) {
        setChapterFormData((prev) => ({
          ...prev,
          zoneId: zoneId,
          countryName: selectedZone.countryName,
          stateName: selectedZone.stateName,
        }));
      }
    }
  }, [zoneId, zones]);`;

const newEffect = `  // Sync zoneId with chapterFormData
  useEffect(() => {
    const currentZoneId = zoneId || getCurrentUser()?.data?.zoneId;
    if (currentZoneId && zones.length > 0) {
      const selectedZone = zones.find((z) => z.value === currentZoneId);
      if (selectedZone) {
        setChapterFormData((prev) => ({
          ...prev,
          zoneId: currentZoneId,
          countryName: selectedZone.countryName,
          stateName: selectedZone.stateName,
        }));
      }
    }
  }, [zoneId, zones]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed zoneId sync useEffect');
