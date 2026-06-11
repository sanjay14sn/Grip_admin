const fs = require('fs');
let content = fs.readFileSync('src/components/RoleAccessLayer.jsx', 'utf8');

// 1. Add getCurrentUser
content = content.replace('import { hasPermission } from "../utils/auth";', 'import { hasPermission, getCurrentUser } from "../utils/auth";');

// 2. Add handleApproveChapter function
const handleApproveCode = `
  const handleApproveChapter = async (chapterId) => {
    try {
      const response = await apiClient.put(\`/admin/chapters/\${chapterId}/approve\`);
      if (response && response.status === 200) {
        toast.success("Chapter approved successfully!");
        fetchChapters();
      } else {
        toast.error("Failed to approve chapter.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve chapter.");
    }
  };
`;
if (!content.includes('handleApproveChapter')) {
    content = content.replace('const handleSearchChange', handleApproveCode + '\n  const handleSearchChange');
}

// 3. Hide Add New button for non zone admins
content = content.replace(
    '{hasPermission("chapters-create") && zoneId && (',
    '{hasPermission("chapters-create") && zoneId && getCurrentUser()?.data?.role === "zone-admin" && ('
);

// 4. Update filter logic
content = content.replace(
    'chapters.filter((chapter) => chapter.isActive === 1).length === 0',
    'chapters.filter((chapter) => chapter.isActive === 1 || chapter.approvalStatus === "waiting_for_approval").length === 0'
);
content = content.replace(
    'chapters.filter((chapter) => chapter.isActive === 1).map((chapter) => (',
    'chapters.filter((chapter) => chapter.isActive === 1 || chapter.approvalStatus === "waiting_for_approval").map((chapter) => ('
);

// 5. Update Status display
const oldStatusDisplay = `Status:{" "}
                        <span
                          className={
                            chapter.isActive == 1
                              ? "text-success-600"
                              : "text-danger-600"
                          }
                        >
                          {chapter.isActive == 1 ? "Active" : "Inactive"}
                        </span>`;

const newStatusDisplay = `Status:{" "}
                        {chapter.approvalStatus === 'waiting_for_approval' ? (
                            <span className="text-warning-600">Pending Approval</span>
                        ) : (
                            <span className={chapter.isActive == 1 ? "text-success-600" : "text-danger-600"}>
                              {chapter.isActive == 1 ? "Active" : "Inactive"}
                            </span>
                        )}`;
content = content.replace(oldStatusDisplay, newStatusDisplay);

// 6. Add Approve button
const approveBtnCode = `
                        {chapter.approvalStatus === 'waiting_for_approval' && getCurrentUser()?.data?.role !== 'zone-admin' && (
                          <button
                            type="button"
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => handleApproveChapter(chapter._id)}
                            title="Approve Chapter"
                          >
                            <Icon icon="mdi:check-circle" className="menu-icon" />
                          </button>
                        )}
`;
if (!content.includes('handleApproveChapter(chapter._id)')) {
    content = content.replace('<div className="d-flex align-items-center gap-2">', '<div className="d-flex align-items-center gap-2">' + approveBtnCode);
}

fs.writeFileSync('src/components/RoleAccessLayer.jsx', content);
console.log('Successfully patched RoleAccessLayer.jsx');
