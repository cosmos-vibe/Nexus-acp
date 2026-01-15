export interface VsCodeApi {
  postMessage(message: unknown): void;
  getState<T>(): T | undefined;
  setState<T>(state: T): T;
}

declare global {
  function acquireVsCodeApi(): VsCodeApi;
}

export {};
