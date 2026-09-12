const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');

async function main() {
  console.log('Initializing Git repository at:', dir);
  await git.init({ fs, dir });

  console.log('Reading status and staging files (respecting .gitignore)...');
  
  // List of files to ignore explicitly just in case
  const ignoredPatterns = ['node_modules', '.next', '.env', 'mingit.zip', 'git-portable', '.git'];

  async function addFilesRecursively(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');

      if (ignoredPatterns.some(p => relPath === p || relPath.startsWith(p + '/'))) {
        continue;
      }

      if (entry.isDirectory()) {
        await addFilesRecursively(fullPath);
      } else {
        try {
          const ignored = await git.isIgnored({ fs, dir, filepath: relPath });
          if (!ignored) {
            await git.add({ fs, dir, filepath: relPath });
          }
        } catch (e) {
          // ignore error if file check fails
        }
      }
    }
  }

  await addFilesRecursively(dir);
  console.log('All project files staged successfully!');

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'ahmadkhushi',
      email: 'ahmadkhushi@users.noreply.github.com',
    },
    message: 'Initial commit: GlamourGrid full-stack cosmetics e-commerce platform',
  });

  console.log('SUCCESS_COMMITTED_SHA:', sha);
}

main().catch((err) => {
  console.error('Git error:', err);
  process.exit(1);
});
