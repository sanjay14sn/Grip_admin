const fs = require('fs');
let content = fs.readFileSync('src/components/AddUserLayer.jsx', 'utf8');

// Ensure getCurrentUser is imported
if (!content.includes('getCurrentUser')) {
    content = content.replace('import { Link, useParams, useNavigate, useLocation } from "react-router-dom";', 'import { Link, useParams, useNavigate, useLocation } from "react-router-dom";\nimport { getCurrentUser } from "../utils/auth";');
}

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
    content = content.replace('const AddUserLayer = () => {', 'const AddUserLayer = () => {' + helperFunc);
}

// 1. Initial State
const oldInitZoneId = `zoneId: initialZoneId || ''`;
const newInitZoneId = `zoneId: initialZoneId || getZoneAdminZoneId() || ''`;
content = content.replace(oldInitZoneId, newInitZoneId);

// 2. Select disabled
const oldSelect = `<select
                                            className="form-control radius-8 form-select"
                                            id="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        >`;
const newSelect = `<select
                                            className="form-control radius-8 form-select"
                                            id="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleInputChange}
                                            disabled={loading || getCurrentUser()?.data?.role === "zone-admin"}
                                        >`;
content = content.replace(oldSelect, newSelect);

fs.writeFileSync('src/components/AddUserLayer.jsx', content);
console.log('Fixed AddUserLayer zoneId default and disabled state');
