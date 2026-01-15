# Antigravity Editor Extension Publishing Documentation

## Overview

Google Antigravity (launched Nov 2025) is an agent-first IDE based on the VS Code codebase. It maintains high compatibility with VS Code extensions but uses a different primary marketplace ecosystem.

## 1. Marketplace & VSIX Acceptance

- **Primary Marketplace:** Antigravity uses the **Open VSX Registry** (open-vsx.org) as its default extension source.
- **VSIX Support:** Antigravity supports manual installation of `.vsix` files. Users can download VSIX packages from the VS Code Marketplace or other sources and install them directly via the "Install from VSIX..." command in the Extensions view.
- **Acceptance Criteria:** Since it is a VS Code fork, standard VS Code extension APIs are supported. However, extensions relying on proprietary Microsoft APIs (like certain Live Share or Remote Development features) may have limited functionality.

## 2. Required Accounts & Tokens

- **Open VSX Account:** To publish to the default registry, developers need an account on [open-vsx.org](https://open-vsx.org/).
- **GitHub Account:** Open VSX typically uses GitHub for authentication.
- **Access Tokens:**
  - **Open VSX Token:** Required for CLI publishing. Generated in the Open VSX user settings.
  - **Google Account:** Required for using the Antigravity editor itself and accessing its agentic features (Gemini 3 Pro).

## 3. Publishing Process

The process mirrors the standard VS Code extension workflow but targets a different registry:

1. **Package:** Use `vsce package` to create a `.vsix` file.
2. **Publish to Open VSX:**
   - Install the Open VSX CLI: `npm install -g ovsx`
   - Publish using: `ovsx publish <path-to-vsix> -p <token>`
3. **Manual Distribution:** Developers can also host `.vsix` files on GitHub Releases or personal sites for manual installation.

## 4. Differences from VS Code Marketplace

| Feature                    | VS Code Marketplace         | Antigravity (Open VSX)            |
| -------------------------- | --------------------------- | --------------------------------- |
| **Owner**                  | Microsoft                   | Eclipse Foundation (Open VSX)     |
| **Default in Antigravity** | No (Licensing restrictions) | Yes                               |
| **CLI Tool**               | `vsce`                      | `ovsx` (or `vsce` for packaging)  |
| **Proprietary APIs**       | Supported                   | Limited/Unsupported               |
| **Sign-in Sync**           | Microsoft/GitHub            | Google Account (for IDE features) |

## 5. Key URLs

- **Official Docs:** [antigravity.google/docs/editor](https://antigravity.google/docs/editor)
- **Registry:** [open-vsx.org](https://open-vsx.org/)
- **Support:** antigravity-support@google.com

## 6. Community Findings

- Users often "hack" Antigravity to point to the Microsoft Marketplace by editing `product.json`, but this is not officially supported and may violate terms.
- The `antigravity-claude-proxy` and `antigravity-panel` are popular community extensions/tools for monitoring quotas and integrating other models.
