import * as vscode from "vscode";
import { ChatPanelManager } from "./views/chatPanel";

let chatPanelManager: ChatPanelManager | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("Nexus extension is now active");

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.openDevTools", () => {
      vscode.commands.executeCommand(
        "workbench.action.webview.openDeveloperTools"
      );
    })
  );

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = "nexus.startChat";
  statusBarItem.tooltip = "Nexus - Click to open chat";
  updateStatusBar("disconnected");
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const activityBarViewProvider: vscode.TreeDataProvider<never> = {
    getTreeItem: () => {
      throw new Error("No items");
    },
    getChildren: () => [],
  };
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "nexus.welcomeView",
      activityBarViewProvider
    )
  );

  // ChatPanelManager 생성 시 상태 변경 콜백 전달
  chatPanelManager = new ChatPanelManager(
    context.extensionUri,
    context.globalState,
    (state) => updateStatusBar(state)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.startChat", async () => {
      chatPanelManager?.showOrCreatePanel();

      if (!chatPanelManager?.isConnected()) {
        try {
          await chatPanelManager?.connect();
          vscode.window.showInformationMessage("Nexus connected");
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to connect: ${error}`);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.focusChat", async () => {
      if (chatPanelManager?.hasVisiblePanel()) {
        chatPanelManager.createNewPanel();
      } else {
        chatPanelManager?.showOrCreatePanel();
      }

      if (!chatPanelManager?.isConnected()) {
        try {
          await chatPanelManager?.connect();
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to connect: ${error}`);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.newChat", () => {
      chatPanelManager?.newChat();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.newChatWindow", async () => {
      chatPanelManager?.createNewPanel();

      if (!chatPanelManager?.isConnected()) {
        try {
          await chatPanelManager?.connect();
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to connect: ${error}`);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.clearChat", () => {
      chatPanelManager?.clearChat();
    })
  );

  // 에디터 컨텍스트 메뉴: 선택한 코드를 채팅에 첨부
  context.subscriptions.push(
    vscode.commands.registerCommand("nexus.attachSelection", () => {
      chatPanelManager?.showOrCreatePanel();
      chatPanelManager?.attachSelectedCode();
    })
  );

  // 파일 탐색기 컨텍스트 메뉴: 파일을 채팅에 첨부
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "nexus.attachFile",
      async (uri: vscode.Uri) => {
        chatPanelManager?.showOrCreatePanel();
        if (uri) {
          await chatPanelManager?.attachFile(uri);
        }
      }
    )
  );

  context.subscriptions.push({
    dispose: () => {
      chatPanelManager?.dispose();
    },
  });
}

function updateStatusBar(
  state: "disconnected" | "connecting" | "connected" | "error"
): void {
  if (!statusBarItem) return;

  const icons: Record<string, string> = {
    disconnected: "$(debug-disconnect)",
    connecting: "$(sync~spin)",
    connected: "$(check)",
    error: "$(error)",
  };

  const labels: Record<string, string> = {
    disconnected: "Nexus: Disconnected",
    connecting: "Nexus: Connecting...",
    connected: "Nexus: Connected",
    error: "Nexus: Error",
  };

  statusBarItem.text = `${icons[state] || icons.disconnected} Nexus`;
  statusBarItem.tooltip = labels[state] || labels.disconnected;

  if (state === "error") {
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
  } else if (state === "connecting") {
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
  } else {
    statusBarItem.backgroundColor = undefined;
  }
}

export function deactivate() {
  console.log("Nexus extension deactivating");
  chatPanelManager?.dispose();
}
