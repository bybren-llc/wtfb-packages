# Publishing @wtfb/cli to npm

**Instructions for the Pop-OS team**

---

## Prerequisites

1. **npm account** with access to the `@wtfb` organization
   - Account owner: cheddarfox
   - Organization: https://www.npmjs.com/org/wtfb

2. **Node.js 18+** installed
   ```bash
   node --version  # Should be 18+
   ```

3. **Git clone** of the repository
   ```bash
   git clone https://github.com/cheddarfox/wtfb-packages.git
   cd wtfb-packages
   ```

---

## Step 1: Login to npm

```bash
npm login
```

This opens a browser. Login with the `cheddarfox` account (or an account that's a member of the `@wtfb` org).

Verify login:
```bash
npm whoami
# Should output: cheddarfox
```

---

## Step 2: Install Dependencies

```bash
cd packages/cli
npm install
```

---

## Step 3: Verify Package Configuration

Check `packages/cli/package.json`:

```json
{
  "name": "@wtfb/cli",
  "version": "1.0.0",
  "bin": {
    "wtfb": "./bin/index.js"
  }
}
```

Ensure:
- Name is `@wtfb/cli`
- Version is correct (bump if republishing)
- `bin` maps `wtfb` command to `./bin/index.js`

---

## Step 4: Test Locally (Optional but Recommended)

```bash
# From packages/cli directory
npm link

# Test the CLI
wtfb --help
wtfb info

# Unlink when done testing
npm unlink -g @wtfb/cli
```

---

## Step 5: Publish to npm

```bash
cd /path/to/wtfb-packages/packages/cli

# First-time publish (MUST use --access public for scoped packages)
npm publish --access public
```

You should see output like:
```
npm notice
npm notice 📦  @wtfb/cli@1.0.0
npm notice Tarball Contents
npm notice ...
npm notice Tarball Details
npm notice name:          @wtfb/cli
npm notice version:       1.0.0
npm notice ...
+ @wtfb/cli@1.0.0
```

---

## Step 6: Verify Publication

```bash
# Check npm registry
npm view @wtfb/cli

# Or visit:
# https://www.npmjs.com/package/@wtfb/cli
```

---

## Step 7: Test Global Install

```bash
# Install globally
npm install -g @wtfb/cli

# Verify it works
wtfb --help
wtfb info
wtfb validate
```

---

## Updating the Package (Future Releases)

1. Make code changes
2. Update version in `packages/cli/package.json`:
   ```bash
   npm version patch   # 1.0.0 → 1.0.1
   # or
   npm version minor   # 1.0.0 → 1.1.0
   # or
   npm version major   # 1.0.0 → 2.0.0
   ```
3. Commit the version bump:
   ```bash
   git add package.json
   git commit -m "chore: bump @wtfb/cli to v1.0.1"
   git push origin main
   ```
4. Publish:
   ```bash
   npm publish
   ```
   (No `--access public` needed after first publish)

---

## Troubleshooting

### "You must be logged in to publish"
```bash
npm login
```

### "You do not have permission to publish"
- Ensure you're logged in as `cheddarfox` or a member of `@wtfb` org
- Check org membership: https://www.npmjs.com/org/wtfb/members

### "Package name already exists"
- Someone else owns `@wtfb/cli` (unlikely since we created the org)
- Check: `npm view @wtfb/cli`

### "402 Payment Required"
- Scoped packages default to private
- Add `--access public` flag

### "ENEEDAUTH" error
```bash
npm logout
npm login
```

---

## Package Structure Reference

```
wtfb-packages/
├── packages/
│   └── cli/
│       ├── bin/
│       │   └── index.js        # CLI entry point
│       ├── src/
│       │   ├── commands/
│       │   │   ├── validate.js # wtfb validate
│       │   │   └── export.js   # wtfb export-*
│       │   ├── validators/
│       │   │   ├── fountain.js
│       │   │   ├── markdown.js
│       │   │   └── spelling.js
│       │   ├── exporters/
│       │   │   ├── base.js     # Strategy pattern base
│       │   │   ├── pdf.js
│       │   │   ├── fdx.js
│       │   │   └── html.js
│       │   └── utils/
│       │       └── files.js
│       ├── package.json
│       └── README.md
├── package.json                 # Workspace root
├── .npmrc                       # npm config (access=public)
└── README.md
```

---

## Commands After Install

Users will run:

```bash
# Install
npm install -g @wtfb/cli

# Use
wtfb validate              # Validate Fountain, Markdown, spelling
wtfb export-pdf            # Export to PDF
wtfb export-fdx            # Export to Final Draft XML
wtfb export-html           # Export to HTML
wtfb info                  # Show CLI info
```

---

## Contact

If issues arise, contact:
- GitHub: https://github.com/cheddarfox/wtfb-packages/issues
- Email: scott@wordstofilmby.com

---

*Words To Film By - Your creative AI team, ready to work.*
