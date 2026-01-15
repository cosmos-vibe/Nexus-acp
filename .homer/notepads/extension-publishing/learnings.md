# Publishing VS Code Extensions to Cursor - Research Findings

**Date:** 2026-01-15  
**Research Type:** Official Documentation & Community Sources

## Key Discovery: Cursor Uses Open VSX Registry

Cursor does **NOT** have a proprietary marketplace. As of June 2025, Cursor officially transitioned to using the **Open VSX Registry** (https://open-vsx.org/) as its extension backend.

## Required Accounts & Tokens

### Open VSX Registration

- **GitHub Account:** Required to sign in to Open VSX
- **Namespace Claim:** Must claim a namespace (publisher ID) - typically matches GitHub username/org
- **Personal Access Token (PAT):** Generated from Open VSX profile settings for CLI publishing

### No Cursor-Specific Registration

- No separate "Cursor Developer Portal"
- No Cursor-specific tokens or accounts needed
- Publishing to Open VSX automatically makes extensions available in Cursor

## Publishing Process

### Method 1: CLI (Recommended for Automation)

```bash
# Install Open VSX CLI tool
npm install -g ovsx

# Package extension (using vsce)
vsce package

# Publish to Open VSX
ovsx publish path/to/extension.vsix -p <your-access-token>
```

### Method 2: Web Interface

1. Visit https://open-vsx.org/
2. Sign in with GitHub
3. Click "Publish" button
4. Upload `.vsix` file directly

### Sync Timeline

- Extensions typically appear in Cursor within **hours** after Open VSX publication
- Some users report up to **24 hours** for indexing
- No manual action required - automatic sync

## VSIX Acceptance Criteria

### Compatibility

- **Standard VSIX files:** Fully accepted (same format as VS Code Marketplace)
- **Most extensions:** Work out-of-the-box without modification
- **Proprietary APIs:** Extensions using Microsoft-only APIs may have compatibility issues
  - Example: Certain Live Share features
  - Example: Some telemetry/analytics APIs

### Manual Installation Fallback

- Users can always manually install `.vsix` files in Cursor
- Method: Drag `.vsix` file into Extensions pane
- Useful for testing or private extensions

## Differences: VS Code Marketplace vs Cursor (Open VSX)

| Aspect              | VS Code Marketplace            | Cursor (Open VSX)                     |
| ------------------- | ------------------------------ | ------------------------------------- |
| **Owner**           | Microsoft (Proprietary)        | Eclipse Foundation (Open Source)      |
| **Moderation**      | Tighter automated scans        | More open, community-driven           |
| **CLI Tool**        | `vsce`                         | `ovsx`                                |
| **API Support**     | All Microsoft proprietary APIs | May lack MS-only APIs                 |
| **Default For**     | VS Code                        | Cursor, VSCodium, Theia, others       |
| **Extension Count** | ~80,000+                       | Smaller but growing                   |
| **Security**        | Stricter validation            | Less strict - requires user vigilance |

## Anysphere Extensions

Cursor's parent company (Anysphere) publishes and maintains their own versions of popular extensions:

- **Publisher Name:** "Anysphere"
- **Purpose:** Ensure compatibility with Cursor
- **Examples:** Python, C++, C#, SSH, DevContainers, WSL
- **Search:** Use `publisher:"Anysphere"` in Cursor's extension search

These are drop-in replacements for core extensions, hosted via Open VSX integration.

## Security Considerations

### Open VSX vs Microsoft Marketplace

- **Less Moderation:** Open VSX has lighter review processes
- **Malicious Extensions:** Community reports of scam extensions (e.g., name typosquatting)
- **Best Practices for Users:**
  - Verify publisher name carefully
  - Check download counts and reviews
  - Be cautious of single-character name differences (e.g., "I" vs "l")

## Developer Workflow Summary

To make your extension available in Cursor:

1. **Develop** extension using standard VS Code Extension API
2. **Package** using `vsce package` (creates `.vsix`)
3. **Register** on Open VSX (https://open-vsx.org/) with GitHub
4. **Claim** namespace (publisher ID)
5. **Generate** Personal Access Token
6. **Publish** using `ovsx publish` or web upload
7. **Wait** for automatic sync to Cursor (hours to 24h)
8. **Verify** by searching in Cursor's Extensions pane

## Additional Notes

- **Dual Publishing:** Many developers publish to BOTH VS Code Marketplace AND Open VSX for maximum reach
- **GitHub Actions:** Can automate dual publishing using `HaaLeo/publish-vscode-extension` action
- **Marketplace Switching:** Cursor v1.1.3+ allows users to switch marketplace backend (not officially supported)
- **Extension Updates:** Auto-update works for Open VSX extensions in Cursor

## Sources

- Cursor Community Forum: Extension Marketplace Changes announcement (June 2025)
- Open VSX Wiki: Publishing Extensions guide
- GitHub Issues: cursor/cursor #2461 (extension visibility)
- Developer blogs: Multiple sources on dual marketplace publishing
- Cursor Docs: Extensions configuration (limited official docs)

## Patterns Observed

1. **No Official Cursor Publishing Docs:** Cursor relies entirely on Open VSX documentation
2. **Community-Driven Support:** Most information comes from forum posts and developer experiences
3. **Automatic Sync:** No manual submission to Cursor required - Open VSX publication is sufficient
4. **Anysphere Curation:** Cursor team actively maintains popular extensions under "Anysphere" publisher
