# VSCode ACP: React + shadcn/ui 전면 개편 계획

## 목표

Vanilla TypeScript + CSS 기반 webview를 **React 18 + Vite + shadcn/ui + Tailwind CSS**로 전면 개편

## 변경 사항 요약

| 항목       | 현재                 | 변경 후         |
| -------- | ------------------ | ------------ |
| 프레임워크    | Vanilla TypeScript | React 18     |
| 빌드 도구    | esbuild (IIFE)     | Vite         |
| UI 라이브러리 | 없음                 | shadcn/ui    |
| CSS      | 순수 CSS (746줄)      | Tailwind CSS |
| 상태 관리    | 클래스 속성             | Zustand      |
| 컴포넌트     | 단일 파일 (1,059줄)     | 24개+ 분리      |

---

## 프로젝트 구조

```javascript
src/views/webview/
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json          # shadcn/ui 설정
├── src/
│   ├── main.tsx            # React 진입점
│   ├── App.tsx
│   ├── vscode.d.ts
│   │
│   ├── components/
│   │   ├── ui/             # shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── collapsible.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ThinkingIndicator.tsx
│   │   │
│   │   ├── tools/
│   │   │   ├── ToolList.tsx
│   │   │   ├── ToolItem.tsx
│   │   │   └── AnsiRenderer.tsx
│   │   │
│   │   ├── input/
│   │   │   ├── ChatInput.tsx
│   │   │   └── CommandAutocomplete.tsx
│   │   │
│   │   └── layout/
│   │       ├── TopBar.tsx
│   │       ├── OptionsBar.tsx
│   │       └── WelcomeView.tsx
│   │
│   ├── hooks/
│   │   ├── useVsCodeApi.ts
│   │   └── useMessages.ts
│   │
│   ├── store/
│   │   └── index.ts         # Zustand store
│   │
│   ├── lib/
│   │   ├── utils.ts         # cn() helper
│   │   └── ansi.ts
│   │
│   └── styles/
│       └── globals.css      # Tailwind + VSCode 변수
```

---

## 구현 단계

### Phase 1: 프로젝트 설정 (1일)

**1. 의존성 설치**

```bash
cd src/views/webview
npm init -y
npm install react react-dom zustand clsx tailwind-merge class-variance-authority lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer tailwindcss-animate @types/react @types/react-dom
```

**2. 설정 파일 생성**

- `vite.config.ts` - IIFE 빌드, `dist/webview.js` 출력
- `tailwind.config.ts` - VSCode 테마 변수 매핑
- `tsconfig.json` - React JSX 설정
- `components.json` - shadcn/ui 설정

**3. shadcn/ui 초기화**

```bash
npx shadcn@latest init
npx shadcn@latest add button card select textarea scroll-area collapsible tooltip
```

### Phase 2: 핵심 인프라 (1일)

**1. Zustand 스토어 구현**

```typescript
// store/index.ts
interface ChatStore {
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  messages: Message[];
  currentStreamingMessage: Message | null;
  agents: Agent[];
  selectedAgentId: string | null;
  // ... actions
}
```

**2. VSCode API 훅**

```typescript
// hooks/useVsCodeApi.ts
- postMessage 래퍼
- 메시지 수신 핸들러
- 상태 저장/복원
```

**3. 유틸리티 이식**

- `escapeHtml()` 함수
- `ansiToHtml()` 함수
- 도구 아이콘 매핑

### Phase 3: UI 컴포넌트 (3일)

**우선순위 1: 레이아웃**

- `TopBar` - 상태 표시, 연결 버튼, 에이전트 선택
- `WelcomeView` - 초기 환영 화면
- `OptionsBar` - 모드/모델 선택

**우선순위 2: 채팅**

- `ChatContainer` - 메시지 스크롤 영역
- `MessageBubble` - 메시지 버블 (user/assistant/error)
- `ThinkingIndicator` - "Thinking..." 표시
- `ChatInput` - 입력 영역

**우선순위 3: 도구**

- `ToolList` - 도구 목록
- `ToolItem` - 개별 도구 (확장/축소)
- `AnsiRenderer` - ANSI 코드 렌더링

**우선순위 4: 자동완성**

- `CommandAutocomplete` - 슬래시 명령

### Phase 4: 통합 (1일)

**1. Extension 측 수정**

```typescript
// chatPanel.ts - HTML 템플릿 업데이트
<div id="root"></div>
<script nonce="${nonce}" src="${webviewScriptUri}"></script>
<link href="${webviewStyleUri}" rel="stylesheet">
```

**2. 빌드 스크립트 통합**

```json
{
  "scripts": {
    "build:webview": "cd src/views/webview && vite build",
    "watch:webview": "cd src/views/webview && vite build --watch"
  }
}
```

**3. CSP 설정**

```typescript
content="
  default-src 'none';
  style-src ${webview.cspSource} 'unsafe-inline';
  script-src 'nonce-${nonce}';
  font-src ${webview.cspSource};
  img-src ${webview.cspSource} data:;
"
```

### Phase 5: 테스트 및 정리 (1일)

- 기능 테스트 (모든 현재 기능 동작 확인)
- 기존 `main.ts` 삭제
- 기존 `media/*.css` 삭제
- 문서 업데이트

---

## 수정할 파일

| 파일                          | 작업                |
| --------------------------- | ----------------- |
| `src/views/webview/`        | 새 디렉토리 (React 앱)  |
| `src/views/chatPanel.ts`    | HTML 템플릿 수정       |
| `esbuild.js`                | webview 빌드 제거     |
| `package.json`              | 스크립트 추가           |
| `src/views/webview/main.ts` | 삭제 (React로 대체)    |
| `media/*.css`               | 삭제 (Tailwind로 대체) |

---

## shadcn/ui 컴포넌트 목록

| 컴포넌트          | 용도            |
| ------------- | ------------- |
| `Button`      | 전송, 연결 버튼     |
| `Card`        | 메시지 버블        |
| `Select`      | 에이전트/모드/모델 선택 |
| `Textarea`    | 채팅 입력         |
| `ScrollArea`  | 메시지 스크롤       |
| `Collapsible` | 도구 상세 펼침      |
| `Tooltip`     | 도구 힌트         |
| `Badge`       | 상태 표시         |

---

## Tailwind 설정 (VSCode 테마 통합)

```typescript
// tailwind.config.ts
colors: {
  background: 'var(--vscode-sideBar-background)',
  foreground: 'var(--vscode-foreground)',
  border: 'var(--vscode-panel-border)',
  button: {
    DEFAULT: 'var(--vscode-button-background)',
    foreground: 'var(--vscode-button-foreground)',
  },
  input: {
    DEFAULT: 'var(--vscode-input-background)',
    border: 'var(--vscode-input-border)',
  },
  // ANSI 터미널 색상 매핑
  'ansi-red': 'var(--vscode-terminal-ansiRed)',
  'ansi-green': 'var(--vscode-terminal-ansiGreen)',
  // ...
}
```

---

## 검증 방법

1. **빌드 테스트**
2. **개발 모드**
3. **기능 체크리스트**
   - 에이전트 연결/선택
   - 메시지 전송/수신
   - 스트리밍 텍스트
   - 도구 호출 표시
   - 마크다운 렌더링
   - 슬래시 명령 자동완성
   - 모드/모델 선택
   - 다크 테마 지원
   - 상태 저장/복원
4. **유닛 테스트**

---

## 예상 소요 시간

| Phase  | 작업      | 시간          |
| ------ | ------- | ----------- |
| 1      | 프로젝트 설정 | 4-6시간       |
| 2      | 핵심 인프라  | 6-8시간       |
| 3      | UI 컴포넌트 | 16-20시간     |
| 4      | 통합      | 4-6시간       |
| 5      | 테스트/정리  | 6-8시간       |
| **총계** |         | **36-48시간** |

---

# Part 2: AI 채팅 렌더링 상세 구현 계획

## 현재 구현 분석

### 문제점

| 항목      | 현재 상태                  | 문제                     |
| ------- | ---------------------- | ---------------------- |
| 스트리밍    | plain text → 마지막에 HTML | UX 지연, 깜빡임             |
| 마크다운    | marked.js (기본)         | syntax highlighting 없음 |
| 코드 블록   | 기본 `<pre><code>`       | 복사 버튼, 줄 번호 없음         |
| XSS 방지  | 없음                     | 보안 취약점                 |
| 실시간 렌더링 | 미지원                    | 코드 블록 깨짐               |

---

## 1. 메시지 컴포넌트 구조

```javascript
components/chat/
├── ChatContainer.tsx       # 메시지 스크롤 영역
├── MessageList.tsx         # 메시지 목록 (Virtual Scroll)
├── Message/
│   ├── index.tsx          # 메시지 래퍼
│   ├── UserMessage.tsx    # 사용자 메시지
│   ├── AssistantMessage.tsx # AI 응답
│   ├── ErrorMessage.tsx   # 에러
│   └── SystemMessage.tsx  # 시스템
├── Markdown/
│   ├── MarkdownRenderer.tsx  # 마크다운 렌더링
│   ├── CodeBlock.tsx         # 코드 블록
│   ├── InlineCode.tsx        # 인라인 코드
│   └── CopyButton.tsx        # 복사 버튼
├── Streaming/
│   ├── StreamingText.tsx     # 스트리밍 텍스트
│   └── TypingIndicator.tsx   # 타이핑 애니메이션
└── Tools/
    ├── ToolList.tsx
    ├── ToolItem.tsx
    └── AnsiRenderer.tsx
```

---

## 2. 마크다운 렌더링 전략

### 라이브러리 선택

```javascript
react-markdown + rehype-highlight + rehype-sanitize
```

**이유:**

- `react-markdown`: React 컴포넌트로 렌더링 (안전)
- `rehype-highlight`: Shiki 기반 syntax highlighting
- `rehype-sanitize`: XSS 방지

### 설치

```bash
npm install react-markdown rehype-highlight rehype-sanitize remark-gfm
npm install -D @types/hast
```

### 컴포넌트 구현

```tsx
// components/chat/Markdown/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import { CodeBlock } from './CodeBlock';
import { InlineCode } from './InlineCode';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, isStreaming }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
      components={{
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          if (inline) {
            return <InlineCode {...props}>{children}</InlineCode>;
          }

          return (
            <CodeBlock
              language={language}
              code={String(children).replace(/\n$/, '')}
            />
          );
        },
        // 기타 커스텀 컴포넌트...
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

---

## 3. 코드 블록 상세 구현

### CodeBlock 컴포넌트

```tsx
// components/chat/Markdown/CodeBlock.tsx
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ language, code, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group my-4">
      {/* 언어 표시 */}
      {language && (
        <div className="absolute top-2 left-3 text-xs text-muted uppercase tracking-wider">
          {language}
        </div>
      )}

      {/* 복사 버튼 */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded",
          "bg-button text-button-foreground",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-button"
        )}
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>

      {/* 코드 영역 */}
      <pre className="bg-code rounded-md p-4 pt-8 overflow-x-auto">
        <code className={`language-${language}`}>
          {showLineNumbers ? (
            lines.map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 text-right text-muted select-none w-8">
                  {i + 1}
                </span>
                <span className="table-cell">{line}</span>
              </div>
            ))
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}
```

### Syntax Highlighting 테마 (Tailwind)

```css
/* globals.css */
/* highlight.js VS Code Dark+ 테마 호환 */
.hljs {
  color: var(--vscode-editor-foreground);
  background: var(--vscode-textCodeBlock-background);
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-section,
.hljs-link {
  color: var(--vscode-terminal-ansiBlue);
}

.hljs-string,
.hljs-title,
.hljs-name,
.hljs-type,
.hljs-attribute,
.hljs-symbol,
.hljs-bullet,
.hljs-addition,
.hljs-variable,
.hljs-template-tag,
.hljs-template-variable {
  color: var(--vscode-terminal-ansiGreen);
}

.hljs-comment,
.hljs-quote,
.hljs-deletion,
.hljs-meta {
  color: var(--vscode-terminal-ansiBlack);
}

.hljs-number {
  color: var(--vscode-terminal-ansiCyan);
}

.hljs-function {
  color: var(--vscode-terminal-ansiYellow);
}
```

---

## 4. 스트리밍 텍스트 렌더링

### 전략: 청크 누적 + 디바운스 렌더링

```tsx
// components/chat/Streaming/StreamingText.tsx
import { useEffect, useRef, useState } from 'react';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';

interface StreamingTextProps {
  chunks: string[];
  isComplete: boolean;
  onComplete?: (fullText: string) => void;
}

export function StreamingText({ chunks, isComplete, onComplete }: StreamingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const bufferRef = useRef('');
  const rafRef = useRef<number>();

  useEffect(() => {
    // 청크를 버퍼에 누적
    bufferRef.current = chunks.join('');

    // RAF로 디바운스 (60fps)
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setDisplayText(bufferRef.current);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chunks]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete(bufferRef.current);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="streaming-text">
      {isComplete ? (
        // 완료 시 전체 마크다운 렌더링
        <MarkdownRenderer content={displayText} />
      ) : (
        // 스트리밍 중엔 plain text + 커서
        <>
          <span className="whitespace-pre-wrap">{displayText}</span>
          <span className="animate-pulse text-button">▋</span>
        </>
      )}
    </div>
  );
}
```

### 상태 관리 (Zustand)

```tsx
// store/index.ts
interface StreamingState {
  isStreaming: boolean;
  chunks: string[];

  startStreaming: () => void;
  addChunk: (chunk: string) => void;
  endStreaming: () => string;
}

export const useStreamingStore = create<StreamingState>((set, get) => ({
  isStreaming: false,
  chunks: [],

  startStreaming: () => set({ isStreaming: true, chunks: [] }),

  addChunk: (chunk) => set((state) => ({
    chunks: [...state.chunks, chunk]
  })),

  endStreaming: () => {
    const fullText = get().chunks.join('');
    set({ isStreaming: false, chunks: [] });
    return fullText;
  },
}));
```

---

## 5. 도구 출력 렌더링 (ANSI)

### AnsiRenderer 컴포넌트

```tsx
// components/chat/Tools/AnsiRenderer.tsx
import { useMemo } from 'react';

interface AnsiRendererProps {
  text: string;
  maxLength?: number;
}

// ANSI 코드 → Tailwind 클래스 매핑
const ANSI_CLASSES: Record<number, string> = {
  // 전경색
  30: 'text-ansi-black',
  31: 'text-ansi-red',
  32: 'text-ansi-green',
  33: 'text-ansi-yellow',
  34: 'text-ansi-blue',
  35: 'text-ansi-magenta',
  36: 'text-ansi-cyan',
  37: 'text-ansi-white',
  // Bright 전경색
  90: 'text-ansi-bright-black',
  91: 'text-ansi-bright-red',
  // ... 생략
  // 스타일
  1: 'font-bold',
  3: 'italic',
  4: 'underline',
};

export function AnsiRenderer({ text, maxLength = 500 }: AnsiRendererProps) {
  const elements = useMemo(() => {
    const truncated = text.length > maxLength
      ? text.slice(0, maxLength) + '...'
      : text;

    return parseAnsi(truncated);
  }, [text, maxLength]);

  return (
    <pre className="bg-code p-3 rounded text-sm overflow-x-auto max-h-[150px] overflow-y-auto">
      {elements}
    </pre>
  );
}

function parseAnsi(text: string): React.ReactNode[] {
  const REGEX = /\x1b\[([0-9;]*)m/g;
  const result: React.ReactNode[] = [];
  let currentClasses: string[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = REGEX.exec(text)) !== null) {
    // 이전 텍스트 추가
    if (match.index > lastIndex) {
      const content = text.slice(lastIndex, match.index);
      result.push(
        <span key={key++} className={currentClasses.join(' ')}>
          {content}
        </span>
      );
    }

    // ANSI 코드 해석
    const codes = match[1].split(';').map(Number);
    for (const code of codes) {
      if (code === 0) {
        currentClasses = [];
      } else if (ANSI_CLASSES[code]) {
        currentClasses.push(ANSI_CLASSES[code]);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // 나머지 텍스트
  if (lastIndex < text.length) {
    result.push(
      <span key={key++} className={currentClasses.join(' ')}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return result;
}
```

---

## 6. 메시지 컴포넌트 통합

### AssistantMessage 컴포넌트

```tsx
// components/chat/Message/AssistantMessage.tsx
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';
import { StreamingText } from '../Streaming/StreamingText';
import { ToolList } from '../Tools/ToolList';
import { AgentPlan } from '../Plan/AgentPlan';
import type { Message, Tool, PlanEntry } from '@/types';

interface AssistantMessageProps {
  message: Message;
  isStreaming?: boolean;
  streamChunks?: string[];
  tools?: Record<string, Tool>;
  plan?: PlanEntry[];
  onCopy?: (text: string) => void;
}

export function AssistantMessage({
  message,
  isStreaming,
  streamChunks = [],
  tools,
  plan,
  onCopy,
}: AssistantMessageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onCopy?.(message.content);
  };

  return (
    <div
      className="message assistant bg-background border border-border rounded-lg p-4 animate-fade-in"
      role="article"
      aria-label="Assistant message"
      onContextMenu={handleContextMenu}
    >
      {/* 스트리밍 또는 완료된 메시지 */}
      {isStreaming ? (
        <StreamingText
          chunks={streamChunks}
          isComplete={false}
        />
      ) : (
        <MarkdownRenderer content={message.content} />
      )}

      {/* 도구 실행 목록 */}
      {tools && Object.keys(tools).length > 0 && (
        <ToolList tools={tools} />
      )}

      {/* 실행 계획 */}
      {plan && plan.length > 0 && (
        <AgentPlan entries={plan} />
      )}
    </div>
  );
}
```

---

## 7. 접근성 (a11y) 체크리스트

### ARIA 속성

```tsx
// 메시지 컨테이너
<div role="log" aria-live="polite" aria-label="Chat messages">
  {messages.map(msg => (
    <article
      key={msg.id}
      role="article"
      aria-label={`${msg.type} message`}
      tabIndex={0}
    >
      ...
    </article>
  ))}
</div>

// 스트리밍 중
<div aria-busy="true" aria-live="polite">
  <span className="sr-only">Agent is typing</span>
  ...
</div>

// 코드 블록
<pre
  role="region"
  aria-label={`Code in ${language}`}
  tabIndex={0}
>
  ...
</pre>
```

### 키보드 네비게이션

```tsx
// hooks/useMessageNavigation.ts
export function useMessageNavigation() {
  const handleKeyDown = (e: KeyboardEvent, messages: Message[]) => {
    const currentIndex = messages.findIndex(m =>
      document.activeElement?.getAttribute('data-message-id') === m.id
    );

    switch (e.key) {
      case 'ArrowUp':
        focusMessage(messages[currentIndex - 1]?.id);
        break;
      case 'ArrowDown':
        focusMessage(messages[currentIndex + 1]?.id);
        break;
      case 'c':
        if (!e.ctrlKey && !e.metaKey) {
          copyCurrentMessage();
        }
        break;
      case 'Home':
        focusMessage(messages[0]?.id);
        break;
      case 'End':
        focusMessage(messages[messages.length - 1]?.id);
        break;
    }
  };

  return { handleKeyDown };
}
```

---

## 8. 성능 최적화

### Virtual Scrolling (긴 대화용)

```tsx
// components/chat/MessageList.tsx
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export function MessageList({ messages }: { messages: Message[] }) {
  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <Message message={messages[index]} />
    </div>
  );

  // 100개 이상 메시지면 Virtual Scroll 사용
  if (messages.length > 100) {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={150} // 평균 메시지 높이
          >
            {rowRenderer}
          </List>
        )}
      </AutoSizer>
    );
  }

  // 일반 렌더링
  return (
    <div className="space-y-4">
      {messages.map(msg => <Message key={msg.id} message={msg} />)}
    </div>
  );
}
```

### React.memo 적용

```tsx
// 메시지는 변경되지 않으면 리렌더 안 함
export const Message = React.memo(({ message }: MessageProps) => {
  // ...
}, (prev, next) => prev.message.id === next.message.id);

// 코드 블록도 마찬가지
export const CodeBlock = React.memo(({ code, language }: CodeBlockProps) => {
  // ...
});
```

---

## 9. 의존성 목록 (추가)

```json
{
  "dependencies": {
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-sanitize": "^6.0.0",
    "react-window": "^1.8.10",
    "react-virtualized-auto-sizer": "^1.0.20"
  },
  "devDependencies": {
    "@types/react-window": "^1.8.8"
  }
}
```

---

## 10. 테스트 체크리스트

### 마크다운 렌더링

- 헤딩 (h1-h6)
- 볼드, 이탤릭, 취소선
- 순서/비순서 리스트
- 링크, 이미지
- 테이블
- 코드 블록 (다양한 언어)
- 인라인 코드
- 인용구
- 수평선

### 코드 블록

- Syntax highlighting (JS, TS, Python, Bash, JSON)
- 복사 버튼 동작
- 줄 번호 표시
- 긴 코드 가로 스크롤
- 언어 표시

### 스트리밍

- 청크 단위 텍스트 표시
- 커서 애니메이션
- 완료 시 마크다운 렌더링
- 자동 스크롤

### 도구 출력

- ANSI 색상 렌더링
- 긴 출력 truncation
- 펼침/접힘 동작

### 접근성

- 스크린 리더 테스트
- 키보드만으로 전체 탐색
- 색상 대비 (WCAG AA)
