const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Remove erroneous closing tags at end if any
content = content.replace("  </>\n      )}\n\n      {/* Add / Edit Game Modal */}", "");
content = content.replace("  </>\n      )}", "");

// Find line 919 `</div>\n      {/* Form Dialog Modal */}`
content = content.replace(
  "      </div>\n\n      {/* Form Dialog Modal */}",
  "      </div>\n        </>\n      )}\n\n      {/* Form Dialog Modal */}"
);

fs.writeFileSync('src/app/admin/page.tsx', content, 'utf8');
console.log('Fixed JSX closing fragment in src/app/admin/page.tsx');
