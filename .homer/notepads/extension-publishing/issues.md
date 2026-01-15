# Issues & Gotchas - Cursor Extension Publishing

## Issue 1: No Official Cursor Publishing Documentation

**Problem:** Cursor's official documentation does not provide clear publishing guidelines.

**Evidence:**

- Cursor Docs (https://cursor.com/docs/configuration/extensions) shows application errors
- No dedicated "Publishing to Cursor" guide exists
- Community forums are primary source of information

**Impact:**

- Developers waste time looking for non-existent Cursor-specific process
- Confusion about whether to publish to VS Code Marketplace or elsewhere
- Reliance on community knowledge vs official docs

**Workaround:**

- Use Open VSX documentation as primary reference
- Monitor Cursor community forums for updates
- Follow Open VSX publishing guide: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions

## Issue 2: Extension Sync Delays

**Problem:** Extensions published to Open VSX may not appear in Cursor immediately.

**Evidence:**

- Community reports: 24+ hour delays
- No official SLA or sync schedule published
- Some extensions never appear (unknown reasons)

**Impact:**

- Cannot test immediately after publishing
- User frustration when searching for newly published extensions
- Unclear if issue is sync delay or rejection

**Workaround:**

- Use manual `.vsix` installation for immediate testing
- Wait 24-48 hours before reporting sync issues
- Contact Cursor support if extension doesn't appear after 48h

## Issue 3: Marketplace Backend Switching Not Officially Supported

**Problem:** Cursor v1.1.3+ allows switching marketplace backend, but it's unsupported.

**Evidence:**

- Forum announcement: "switching the marketplace is not officially supported"
- Users can switch between Open VSX and VS Code Marketplace
- Potential for bugs or unexpected behavior

**Impact:**

- Users may switch to VS Code Marketplace and not see Open VSX extensions
- Support burden for developers (which marketplace is user using?)
- Inconsistent extension availability

**Recommendation:**

- Publish to BOTH marketplaces to cover all scenarios
- Document which marketplaces extension is available on
- Provide manual installation instructions as fallback

## Issue 4: Anysphere Extension Conflicts

**Problem:** Anysphere publishes their own versions of popular extensions, potentially conflicting with originals.

**Evidence:**

- Anysphere versions of Python, C++, C#, etc.
- Described as "drop-in replacements"
- May cause confusion about which version to install

**Impact:**

- Users may install both Anysphere and original versions
- Potential conflicts or duplicate functionality
- Unclear which version receives updates

**Recommendation:**

- Check if Anysphere version exists before publishing
- Clearly document differences (if any) from Anysphere version
- Consider contributing to Anysphere version instead of publishing separate

## Issue 5: Security Risks in Open VSX

**Problem:** Open VSX has lighter moderation than Microsoft Marketplace.

**Evidence:**

- Community reports of malicious extensions
- Typosquatting attacks (e.g., "I" vs "l" in extension names)
- Less automated security scanning

**Impact:**

- Users at higher risk of installing malicious extensions
- Reputation damage if malicious extension uses similar name
- Need for user education on verification

**Mitigation:**

- Publish with verified GitHub organization
- Use clear, unique extension names
- Provide security documentation in README
- Encourage users to verify publisher before installing

## Issue 6: Missing Extensions from VS Code Marketplace

**Problem:** Not all VS Code Marketplace extensions are available in Open VSX.

**Evidence:**

- Open VSX has fewer extensions than VS Code Marketplace
- Developers must manually publish to Open VSX
- Some popular extensions missing

**Impact:**

- Cursor users have smaller extension library
- Users must manually install `.vsix` files for missing extensions
- Fragmentation of extension ecosystem

**Workaround:**

- Request developers to publish to Open VSX
- Use manual `.vsix` installation
- Switch marketplace backend (unsupported)

## Issue 7: Proprietary API Compatibility

**Problem:** Extensions using Microsoft-only APIs may not work in Cursor.

**Evidence:**

- Open VSX doesn't support all proprietary VS Code APIs
- Examples: Certain Live Share features, telemetry APIs
- No comprehensive compatibility list published

**Impact:**

- Extensions may fail silently or with errors
- Difficult to debug compatibility issues
- Need for testing in Cursor environment

**Testing Strategy:**

- Test extension in Cursor before publishing
- Document known compatibility issues
- Provide fallback functionality for unsupported APIs

## Issue 8: Namespace Claiming Process

**Problem:** Open VSX namespace claiming is not instant or automatic.

**Evidence:**

- Requires GitHub authentication
- May require manual approval for some namespaces
- No clear timeline for approval

**Impact:**

- Cannot publish immediately after account creation
- Potential delays in first-time publishing
- Risk of namespace squatting

**Best Practice:**

- Claim namespace early, before needing to publish
- Use GitHub organization for verified namespaces
- Follow Open VSX namespace access guide: https://github.com/eclipse/openvsx/wiki/Namespace-Access

## Issue 9: CLI Tool Differences (vsce vs ovsx)

**Problem:** `ovsx` CLI has different flags and behavior than `vsce`.

**Evidence:**

- Different command syntax
- Some `vsce` features not available in `ovsx`
- Documentation scattered across different sources

**Impact:**

- Learning curve for developers familiar with `vsce`
- Need to maintain separate publishing scripts
- Potential for errors when switching between tools

**Solution:**

- Use both tools in CI/CD pipeline
- Document differences in publishing guide
- Consider using GitHub Actions for abstraction

## Issue 10: No Extension Analytics in Open VSX

**Problem:** Open VSX provides limited analytics compared to VS Code Marketplace.

**Evidence:**

- No detailed download statistics
- Limited user engagement metrics
- No A/B testing capabilities

**Impact:**

- Harder to measure extension success
- Cannot optimize based on usage data
- Limited insight into user behavior

**Workaround:**

- Implement custom telemetry (with user consent)
- Use GitHub stars/issues as proxy metrics
- Monitor community forum discussions
