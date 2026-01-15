# Nexus ACP

> AI Coding Agents in VS Code via the Agent Client Protocol (ACP)

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/cosmosjeon.nexus-acp?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)

Chat with Claude, OpenCode, and other ACP-compatible AI agents directly in your editor. No context switching, no copy-pasting code.

![Nexus Screenshot](screenshots/acp-sidebar.png)

## Features

- **Multi-Agent Support** — Connect to OpenCode, Claude Code, or any ACP-compatible agent
- **Native Chat Interface** — Integrated chat that feels like part of VS Code
- **Multi-Tab Chat** — Open multiple chat sessions simultaneously
- **Session Management** — Save and restore chat sessions
- **Tool Visibility** — See what commands the AI runs with expandable input/output
- **Rich Markdown** — Code blocks, syntax highlighting, and formatted responses
- **Streaming Responses** — Watch the AI think in real-time
- **Mode & Model Selection** — Switch between agent modes and models on the fly
- **File & Code Attachments** — Send selected code or files directly to chat

## Requirements

You need at least one ACP-compatible agent installed:

- **[OpenCode](https://github.com/sst/opencode)**
- **[Claude Code](https://claude.ai/code)**

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "Nexus ACP"
4. Click Install

## Usage

### Quick Start

1. Click the **Nexus** icon in the Activity Bar (left sidebar)
2. Or click the Nexus icon in the editor title bar
3. Select your preferred agent from the dropdown
4. Start chatting!

### Multi-Tab Chat

- Click the Nexus icon in the title bar to open a new chat tab
- Each tab maintains its own session and connection
- Switch between tabs to context-switch between conversations

### Attaching Code

- **Selected Code**: Right-click on selected code → "Send to Nexus Chat"
- **Files**: Right-click on a file in Explorer → "Send to Nexus Chat"

### Tool Calls

When the AI uses tools (like running commands or reading files), you'll see them in a collapsible section:

- **⋯** — Tool is running
- **✓** — Tool completed successfully
- **✗** — Tool failed

Click on any tool to see the command input and output.

## Supported Agents

The extension auto-detects installed agents:

| Agent       | Command    | Detection      |
| ----------- | ---------- | -------------- |
| OpenCode    | `opencode` | Checks `$PATH` |
| Claude Code | `claude`   | Checks `$PATH` |
