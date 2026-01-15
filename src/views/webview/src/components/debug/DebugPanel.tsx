import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store";

interface DebugStats {
  messageCount: number;
  thinkingChunks: number;
  streamChunks: number;
  renders: number;
  thinkingTextLen: number;
  toolCount: number;
  lastUpdate: number;
}

// Global debug stats (survives re-renders)
const globalStats: DebugStats = {
  messageCount: 0,
  thinkingChunks: 0,
  streamChunks: 0,
  renders: 0,
  thinkingTextLen: 0,
  toolCount: 0,
  lastUpdate: Date.now(),
};

// Export functions to update stats from other components
export function debugIncrementMessage() {
  globalStats.messageCount++;
  globalStats.lastUpdate = Date.now();
}

export function debugIncrementThinkingChunk() {
  globalStats.thinkingChunks++;
  globalStats.lastUpdate = Date.now();
}

export function debugIncrementStreamChunk() {
  globalStats.streamChunks++;
  globalStats.lastUpdate = Date.now();
}

export function debugIncrementRender() {
  globalStats.renders++;
}

export function DebugPanel() {
  const { streaming, isThinking } = useChatStore();
  const [stats, setStats] = useState<DebugStats>({ ...globalStats });
  const frameRef = useRef(0);

  // Update stats every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      globalStats.thinkingTextLen = streaming.thinkingText.length;
      globalStats.toolCount = Object.keys(streaming.tools).length;
      setStats({ ...globalStats });
    }, 500);

    return () => clearInterval(interval);
  }, [streaming.thinkingText.length, streaming.tools]);

  // Count frames per second
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const countFrame = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        frameRef.current = frameCount;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFrame);
    };

    const handle = requestAnimationFrame(countFrame);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="fixed top-2 right-2 z-[99999] bg-black/90 text-green-400 font-mono text-[10px] p-2 rounded shadow-lg max-w-[200px]">
      <div className="font-bold text-yellow-400 mb-1">DEBUG</div>
      <div>FPS: {frameRef.current}</div>
      <div>Messages: {stats.messageCount}</div>
      <div>Think chunks: {stats.thinkingChunks}</div>
      <div>Stream chunks: {stats.streamChunks}</div>
      <div>Renders: {stats.renders}</div>
      <div className={stats.thinkingTextLen > 10000 ? "text-red-400" : ""}>
        ThinkingText: {(stats.thinkingTextLen / 1000).toFixed(1)}k
      </div>
      <div>Tools: {stats.toolCount}</div>
      <div>isThinking: {isThinking ? "YES" : "no"}</div>
    </div>
  );
}
