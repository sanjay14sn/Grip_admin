const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

content = content.replace('await apiClient.put(`/admin/chapters/${chapterId}/approve`);', 'await apiClient.put(`/chapters/${chapterId}/approve`);');

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Fixed approve API call');
