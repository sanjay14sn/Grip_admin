const fs = require('fs');

let content = fs.readFileSync('src/masterLayout/MasterLayout.jsx', 'utf8');

// Replace performers sub-items
content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/121-list"[\s\S]*?121's\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("121s-list") && ($1<li>$2<NavLink to="/121-list" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="mdi:format-list-bulleted-type" className="menu-icon" />$2  121's$2</NavLink>$1</li>$1)}`
);

content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/referral"[\s\S]*?Referral's\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("referrals-list") && ($1<li>$2<NavLink to="/referral" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="material-symbols:person-add-outline" className="menu-icon" />$2  Referral's$2</NavLink>$1</li>$1)}`
);

content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/thankyou"[\s\S]*?Thank you Slip\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("thank-you-slip-list") && ($1<li>$2<NavLink to="/thankyou" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="mdi:hand-heart-outline" className="menu-icon" />$2  Thank you Slip$2</NavLink>$1</li>$1)}`
);

content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/testimoniall"[\s\S]*?Testimonial\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("testimonial-list") && ($1<li>$2<NavLink to="/testimoniall" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="mdi:message-star-outline" className="menu-icon" />$2  Testimonial$2</NavLink>$1</li>$1)}`
);

content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/visitor"[\s\S]*?Visitor \/Guest\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("visitor-guest-list") && ($1<li>$2<NavLink to="/visitor" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="mdi:eye-outline" className="menu-icon" />$2  Visitor /Guest$2</NavLink>$1</li>$1)}`
);

content = content.replace(
/(\s*)<li>(\s*)<NavLink\s*to="\/expected-visitors"[\s\S]*?Expected Visitors\s*<\/NavLink>\s*<\/li>/,
`$1{hasPermission("expected-visitors-list") && ($1<li>$2<NavLink to="/expected-visitors" className={(navData) => navData.isActive ? "active-page" : "" }>$2  <Icon icon="mdi:account-clock-outline" className="menu-icon" />$2  Expected Visitors$2</NavLink>$1</li>$1)}`
);

// For Payments group which contains Meeting, Events, Training
const paymentsReplacement = 
`            {hasPermission("payments-list") && (
              <li>
                <NavLink to="/payments" className={(navData) => navData.isActive ? "active-page" : "" }>
                  <Icon icon="mdi:credit-card-outline" className="menu-icon" />
                  Payments
                </NavLink>
              </li>
            )}
            {hasPermission("meeting-list") && (
                <li>
                  <NavLink to="/payment-list" className={(navData) => navData.isActive ? "active-page" : "" }>
                    <Icon icon="mdi:credit-card-plus-outline" className="menu-icon" />
                    Meeting
                  </NavLink>
                </li>
            )}
            {hasPermission("events-list") && (
                <li>
                  <NavLink to="/attedence-list" className={(navData) => navData.isActive ? "active-page" : "" }>
                    <Icon icon="mdi:credit-card-plus-outline" className="menu-icon" />
                    Events
                  </NavLink>
                </li>
            )}
            {hasPermission("training-list") && (
                <li>
                  <NavLink to="/training-list" className={(navData) => navData.isActive ? "active-page" : "" }>
                    <Icon icon="mdi:book-open-variant" className="menu-icon" />
                    Training
                  </NavLink>
                </li>
            )}`;

content = content.replace(
/(\s*)\{hasPermission\("payments-list"\) && \(\s*<>\s*<li>\s*<NavLink\s*to="\/payment-list"[\s\S]*?Training\s*<\/NavLink>\s*<\/li>\s*<\/>\s*\)/,
paymentsReplacement
);

fs.writeFileSync('src/masterLayout/MasterLayout.jsx', content);
console.log("Done");
