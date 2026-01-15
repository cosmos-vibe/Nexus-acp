# Nexus ACP

> AI Coding Agents in VS Code via the Agent Client Protocol (ACP)

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/cosmosjeon.nexus-acp?style=flat-square&label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)
[![Open VSX](https://img.shields.io/open-vsx/v/cosmosjeon/nexus-acp?style=flat-square&label=Open%20VSX)](https://open-vsx.org/extension/cosmosjeon/nexus-acp)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

[한국어](README.ko.md)

**Nexus ACP** lets you chat with AI coding agents directly in VS Code. Use Claude Code, OpenCode, or any ACP-compatible agent without leaving your editor.

![Nexus Screenshot](assets/acp-sidebar.png)

---

## Features

- **Multi-Agent Support** — Connect to Claude Code, OpenCode, or any ACP-compatible agent
- **Native Chat Interface** — Integrated chat that feels like part of VS Code
- **Multi-Tab Chat** — Open multiple chat sessions simultaneously
- **Tool Visibility** — See what commands the AI runs with expandable input/output
- **Rich Markdown** — Code blocks, syntax highlighting, and formatted responses
- **Streaming Responses** — Watch the AI think in real-time
- **ANSI Color Support** — Terminal output colors rendered correctly
- **File & Code Attachments** — Send selected code or files directly to chat

---

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for **"Nexus ACP"**
4. Click **Install**

### From Open VSX (VSCodium, Code-OSS, etc.)

1. Open Extensions panel
2. Search for **"Nexus ACP"**
3. Click **Install**

---

## Requirements

You need at least one ACP-compatible agent installed:

| Agent | Installation | Website |
|-------|-------------|---------|
| **Claude Code** | `npm install -g @anthropic-ai/claude-code` | [claude.ai/code](https://claude.ai/code) |
| **OpenCode** | `npm install -g opencode` | [github.com/sst/opencode](https://github.com/sst/opencode) |

> Nexus ACP automatically detects agents in your system PATH.

---

## Usage

### Getting Started

1. Click the **Nexus** icon in the Activity Bar (left sidebar)
2. Or click the Nexus icon in the editor title bar
3. Select your preferred agent from the dropdown
4. Start chatting!

### Sending Code

**Send selected code:**
1. Select code in the editor
2. Right-click → **"Send to Nexus Chat"**

**Send a file:**
1. Right-click a file in Explorer
2. Select **"Send to Nexus Chat"**

### Multi-Tab Chat

- Click the Nexus icon in the title bar to open a new chat tab
- Each tab maintains its own independent session
- Great for working on multiple tasks in parallel

### Tool Calls

When the AI uses tools, you'll see status icons:

| Icon | Status | Description |
|------|--------|-------------|
| ⋯ | Running | Tool is executing |
| ✓ | Success | Tool completed successfully |
| ✗ | Failed | Tool execution failed |

Click any tool to see its input and output.

---

## FAQ

### Q: Agent not showing in the list?

A: Make sure the agent is installed in your system PATH. Try running `claude --version` or `opencode --version` in terminal.

### Q: Connection dropped?

A: Close and reopen the chat window. If the issue persists, restart the agent.

### Q: Responses are slow?

A: This depends on the AI agent's processing speed. Nexus ACP supports streaming, so responses appear as they're generated.

---

## Contributing

Bug reports, feature requests, and pull requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

---

## Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)
- [Open VSX](https://open-vsx.org/extension/cosmosjeon/nexus-acp)
- [GitHub Repository](https://github.com/cosmos-vibe/Nexus-acp)
- [Issue Tracker](https://github.com/cosmos-vibe/Nexus-acp/issues)
