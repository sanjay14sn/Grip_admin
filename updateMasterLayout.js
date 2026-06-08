const fs = require('fs');
const path = '/Users/sanjaynaveen/Grip_admin/src/masterLayout/MasterLayout.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// 1. Add imports
const importIndex = lines.findIndex(l => l.includes('import userApiProvider'));
lines.splice(importIndex + 1, 0, 'import notificationApiProvider from "../apiProvider/notificationApi";');
lines.splice(importIndex + 1, 0, 'import moment from "moment";');

// 2. Add state and fetch
const stateIndex = lines.findIndex(l => l.includes('const [userData, setUserData] = useState(null);'));
lines.splice(stateIndex + 1, 0, `
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApiProvider.getNotifications();
      if (res && res.success) {
        setNotifications(res.data);
        setUnreadCount(res.meta.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const res = await notificationApiProvider.markAllAsRead();
      if (res && res.success) {
        setUnreadCount(0);
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "onetoone": return "lucide:users";
      case "referral": return "lucide:briefcase";
      case "testimonial": return "lucide:star";
      case "visitor": return "lucide:user-plus";
      case "expectedvisitor": return "lucide:calendar-clock";
      case "thankyou": return "lucide:heart";
      default: return "lucide:bell";
    }
  };
`);

// 3. Replace dropdown block
const startIdx = lines.findIndex(l => l.includes('{/* <div className="dropdown">') && lines[lines.indexOf(l) - 1].includes('Message dropdown end'));
let endIdx = startIdx;
while (endIdx < lines.length && !lines[endIdx].includes('</div> */}')) {
    endIdx++;
}
if (endIdx < lines.length) endIdx++; // include the closing comment line

const dropdownCode = `
                {/* Notification Dropdown Start */}
                <div className="dropdown">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    onClick={markAllAsRead}
                  >
                    <Icon
                      icon="iconoir:bell"
                      className="text-primary-light text-xl"
                    />
                    {unreadCount > 0 && (
                      <span className="indicator bg-danger text-white rounded-circle position-absolute top-0 end-0 translate-middle" style={{ width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                      </div>
                      <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                        {unreadCount}
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={\`px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between \${notif.isRead ? "bg-base" : "bg-neutral-50"}\`}
                          >
                            <div className="text-black d-flex align-items-center gap-3">
                              <span className="w-44-px h-44-px bg-primary-subtle text-primary-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                                <Icon
                                  icon={getNotificationIcon(notif.type)}
                                  className="icon text-xl"
                                />
                              </span>
                              <div>
                                <h6 className="text-md fw-semibold mb-1 text-capitalize">
                                  {notif.type.replace("expectedvisitor", "expected visitor")}
                                </h6>
                                <p className="mb-0 text-sm text-secondary-light">
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-secondary-light flex-shrink-0">
                              {moment(notif.createdAt).fromNow()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-secondary-light">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
`;

lines.splice(startIdx, endIdx - startIdx, dropdownCode);

fs.writeFileSync(path, lines.join('\\n'));
console.log('MasterLayout.jsx updated successfully.');
