const fs = require('fs');
const path = require('path');

function validateChangelog() {
  // Read package.json
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );
  const packageVersion = packageJson.version;

  // Read CHANGELOG.md
  const changelog = fs.readFileSync(
    path.join(process.cwd(), 'CHANGELOG.MD'),
    'utf8'
  );

  // Extract the latest version from changelog
  const versionMatch = changelog.match(/## \[(.*?)\] - (\d{4}-\d{2}-\d{2})/);
  
  if (!versionMatch) {
    console.error('❌ No valid version entry found in CHANGELOG.MD');
    process.exit(1);
  }

  const [, changelogVersion, changelogDate] = versionMatch;

  // Validate version
  if (changelogVersion !== packageVersion) {
    console.error(
      `❌ Version mismatch:\n` +
      `   package.json: ${packageVersion}\n` +
      `   CHANGELOG.MD: ${changelogVersion}`
    );
    process.exit(1);
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(changelogDate)) {
    console.error('❌ Invalid date format in CHANGELOG.MD');
    process.exit(1);
  }

  // Validate that the date is not in the future
  const changelogDateTime = new Date(changelogDate);
  const now = new Date();
  if (changelogDateTime > now) {
    console.error('❌ Changelog date is in the future');
    process.exit(1);
  }

  console.log('✅ Changelog validation passed!');
  console.log(`   Version: ${changelogVersion}`);
  console.log(`   Date: ${changelogDate}`);
}

validateChangelog(); 