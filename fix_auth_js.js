const fs = require('fs');
let content = fs.readFileSync('src/utils/auth.js', 'utf8');

const targetStr = `      const allowedForZoneAdmin = [
        "dashboard-list",
        "users-list",    // Needed to show Admin Users
        "roles-list",    // Needed to show Role menu
        "chapters-list", // Needed to show Chapters under this menu
        "performers-list",
        "payments-list"
      ];`;

const replacementStr = `      const allowedForZoneAdmin = [
        "dashboard-list",
        "users-list",    // Needed to show Admin Users
        "roles-list",    // Needed to show Role menu
        "chapters-list", // Needed to show Chapters under this menu
        "performers-list",
        "payments-list",
        // New permissions added
        "meeting-list", "meeting-create", "meeting-update", "meeting-delete",
        "events-list", "events-create", "events-update", "events-delete",
        "training-list", "training-create", "training-update", "training-delete",
        "121s-list", "121s-create", "121s-update", "121s-delete",
        "referrals-list", "referrals-create", "referrals-update", "referrals-delete",
        "thank-you-slip-list", "thank-you-slip-create", "thank-you-slip-update", "thank-you-slip-delete",
        "testimonial-list", "testimonial-create", "testimonial-update", "testimonial-delete",
        "visitor-guest-list", "visitor-guest-create", "visitor-guest-update", "visitor-guest-delete",
        "expected-visitors-list", "expected-visitors-create", "expected-visitors-update", "expected-visitors-delete"
      ];`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('src/utils/auth.js', content);
    console.log('Successfully updated auth.js');
} else {
    console.log('Target string not found in auth.js. Using regex fallback.');
    content = content.replace(/const allowedForZoneAdmin = \[[\s\S]*?\];/, replacementStr);
    fs.writeFileSync('src/utils/auth.js', content);
    console.log('Successfully updated auth.js via regex');
}
