# Nexus ACP

> AI Coding Agents in VS Code via the Agent Client Protocol (ACP)

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/cosmosjeon.nexus-acp?style=flat-square&label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)
[![Open VSX](https://img.shields.io/open-vsx/v/cosmosjeon/nexus-acp?style=flat-square&label=Open%20VSX)](https://open-vsx.org/extension/cosmosjeon/nexus-acp)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=plastic&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/cosmos-vibe/Nexus-acp)

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
