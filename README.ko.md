# Nexus ACP

> VS Code에서 Agent Client Protocol (ACP)를 통한 AI 코딩 에이전트

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/cosmosjeon.nexus-acp?style=flat-square&label=VS%20Code%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)
[![Open VSX](https://img.shields.io/open-vsx/v/cosmosjeon/nexus-acp?style=flat-square&label=Open%20VSX)](https://open-vsx.org/extension/cosmosjeon/nexus-acp)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

[English](README.md)

**Nexus ACP**는 VS Code에서 AI 코딩 에이전트와 직접 대화할 수 있게 해주는 익스텐션입니다. Claude Code, OpenCode 등 ACP 호환 에이전트를 에디터 안에서 바로 사용하세요.

![Nexus Screenshot](assets/acp-sidebar.png)

---

## 주요 기능

- **Multi-Agent Support** — Claude Code, OpenCode 등 다양한 ACP 호환 에이전트 지원
- **Native Chat Interface** — VS Code에 자연스럽게 통합된 채팅 인터페이스
- **Multi-Tab Chat** — 여러 채팅 세션을 동시에 열어서 사용
- **Tool Visibility** — AI가 실행하는 명령어와 결과를 실시간으로 확인
- **Rich Markdown** — 코드 블록, 구문 강조, 테이블 등 마크다운 렌더링
- **Streaming Responses** — AI 응답을 실시간 스트리밍으로 확인
- **ANSI Color Support** — 터미널 출력의 ANSI 색상 지원
- **File & Code Attachments** — 선택한 코드나 파일을 채팅에 바로 전송

---

## 설치 방법

### VS Code Marketplace에서 설치

1. VS Code를 엽니다
2. Extensions 패널을 엽니다 (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. **"Nexus ACP"** 를 검색합니다
4. **Install** 버튼을 클릭합니다

### Open VSX에서 설치 (VSCodium, Code-OSS 등)

1. Extensions 패널을 엽니다
2. **"Nexus ACP"** 를 검색합니다
3. **Install** 버튼을 클릭합니다

---

## 요구 사항

최소 하나의 ACP 호환 에이전트가 설치되어 있어야 합니다:

| Agent | 설치 방법 | 공식 사이트 |
|-------|----------|------------|
| **Claude Code** | `npm install -g @anthropic-ai/claude-code` | [claude.ai/code](https://claude.ai/code) |
| **OpenCode** | `npm install -g opencode` | [github.com/sst/opencode](https://github.com/sst/opencode) |

> Nexus ACP는 시스템 PATH에서 에이전트를 자동으로 감지합니다.

---

## 사용 방법

### 시작하기

1. **Activity Bar**에서 Nexus 아이콘을 클릭합니다 (왼쪽 사이드바)
2. 또는 에디터 상단의 Nexus 아이콘을 클릭합니다
3. 드롭다운에서 사용할 에이전트를 선택합니다
4. 채팅을 시작합니다!

### 코드 보내기

**선택한 코드 보내기:**
1. 에디터에서 코드를 선택합니다
2. 우클릭 → **"Send to Nexus Chat"** 선택

**파일 보내기:**
1. Explorer에서 파일을 우클릭합니다
2. **"Send to Nexus Chat"** 선택

### 멀티 탭 사용하기

- 에디터 타이틀바의 Nexus 아이콘을 클릭하면 새 채팅 탭이 열립니다
- 각 탭은 독립적인 세션을 유지합니다
- 여러 작업을 동시에 진행할 때 유용합니다

### Tool Call 이해하기

AI가 도구를 사용할 때 다음 상태 아이콘이 표시됩니다:

| 아이콘 | 상태 | 설명 |
|-------|------|------|
| ⋯ | 실행 중 | 도구가 실행되고 있습니다 |
| ✓ | 성공 | 도구가 성공적으로 완료되었습니다 |
| ✗ | 실패 | 도구 실행이 실패했습니다 |

도구를 클릭하면 입력과 출력을 자세히 볼 수 있습니다.

---

## FAQ

### Q: 에이전트가 목록에 나타나지 않아요

A: 에이전트가 시스템 PATH에 설치되어 있는지 확인하세요. 터미널에서 `claude --version` 또는 `opencode --version`을 실행해 보세요.

### Q: 연결이 끊어졌어요

A: 채팅 창을 닫고 다시 열어보세요. 문제가 지속되면 에이전트를 재시작해 보세요.

### Q: 응답이 느려요

A: 이는 AI 에이전트의 처리 속도에 따라 다릅니다. Nexus ACP 자체는 스트리밍을 지원하므로 응답이 생성되는 대로 바로 표시됩니다.

---

## 기여하기

버그 리포트, 기능 제안, Pull Request 모두 환영합니다!

1. 이 저장소를 Fork합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

---

## 라이선스

이 프로젝트는 [Apache License 2.0](LICENSE) 하에 배포됩니다.

---

## 링크

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=cosmosjeon.nexus-acp)
- [Open VSX](https://open-vsx.org/extension/cosmosjeon/nexus-acp)
- [GitHub Repository](https://github.com/cosmos-vibe/Nexus-acp)
- [Issue Tracker](https://github.com/cosmos-vibe/Nexus-acp/issues)
