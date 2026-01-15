# Architectural Decisions - Cursor Extension Publishing

## Decision 1: Target Open VSX, Not Cursor Directly

**Context:** Cursor does not have a proprietary marketplace.

**Decision:** All extension publishing efforts should target the Open VSX Registry (https://open-vsx.org/).

**Rationale:**

- Cursor officially uses Open VSX as its backend (as of June 2025)
- No separate Cursor-specific publishing process exists
- Publishing to Open VSX automatically makes extensions available in Cursor
- Broader reach: Also available in VSCodium, Theia, and other VS Code forks

**Implications:**

- Use `ovsx` CLI tool instead of looking for Cursor-specific tools
- Follow Open VSX documentation for publishing guidelines
- No need to contact Cursor team for extension listing

## Decision 2: Dual Publishing Strategy Recommended

**Context:** VS Code Marketplace and Open VSX are separate ecosystems.

**Decision:** Publish to BOTH marketplaces for maximum reach.

**Rationale:**

- VS Code Marketplace: ~80,000+ extensions, larger user base
- Open VSX: Required for Cursor, VSCodium, and other forks
- Minimal overhead: Same `.vsix` file works for both
- Can be automated via GitHub Actions

**Implementation:**

```bash
# VS Code Marketplace
vsce publish

# Open VSX
ovsx publish -p <token>
```

**Automation Option:**

- Use `HaaLeo/publish-vscode-extension` GitHub Action
- Publishes to both marketplaces in CI/CD pipeline

## Decision 3: Manual Installation as Fallback

**Context:** Some extensions may not sync immediately or may be rejected.

**Decision:** Always provide manual `.vsix` installation instructions for Cursor users.

**Rationale:**

- Sync delays can be 24+ hours
- Some extensions may have compatibility issues
- Users can test immediately without waiting for marketplace sync
- Useful for private/enterprise extensions

**User Instructions:**

1. Download `.vsix` from GitHub releases or build locally
2. Open Cursor Extensions pane
3. Drag `.vsix` file into Extensions pane
4. Extension installs immediately

## Decision 4: Security Validation Before Publishing

**Context:** Open VSX has lighter moderation than Microsoft Marketplace.

**Decision:** Implement stricter self-validation before publishing to Open VSX.

**Rationale:**

- Open VSX is more open, less automated scanning
- Risk of malicious extensions (typosquatting, etc.)
- Protect users and reputation

**Validation Checklist:**

- [ ] No obfuscated code
- [ ] Clear README with permissions explanation
- [ ] Verified publisher identity (GitHub org/username)
- [ ] No unnecessary permissions requested
- [ ] Source code publicly available (recommended)
- [ ] Clear license (MIT, Apache, etc.)

## Decision 5: Namespace Strategy

**Context:** Open VSX uses namespaces (publisher IDs) that must be claimed.

**Decision:** Claim namespace matching GitHub organization/username.

**Rationale:**

- Consistency across platforms
- Easier for users to verify authenticity
- Prevents namespace squatting by others

**Example:**

- GitHub: `github.com/mycompany`
- Open VSX Namespace: `mycompany`
- Extension ID: `mycompany.my-extension`

## Decision 6: Monitor Anysphere Replacements

**Context:** Cursor (Anysphere) publishes their own versions of popular extensions.

**Decision:** Check if Anysphere has published a replacement before publishing.

**Rationale:**

- Anysphere versions are optimized for Cursor
- May have better integration/performance
- Avoid duplicate/competing extensions

**Check Method:**

- Search Cursor marketplace: `publisher:"Anysphere"`
- Review Anysphere extension list in community forums
- If replacement exists, consider contributing to Anysphere version instead

## Decision 7: Version Parity Across Marketplaces

**Context:** Extensions can be published to multiple marketplaces.

**Decision:** Maintain version parity between VS Code Marketplace and Open VSX.

**Rationale:**

- Avoid user confusion
- Consistent bug reports and support
- Easier to maintain

**Implementation:**

- Use same version number in `package.json`
- Publish to both marketplaces simultaneously
- Automate via CI/CD to prevent drift
