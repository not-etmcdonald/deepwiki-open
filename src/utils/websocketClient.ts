/**
 * WebSocket client for chat completions
 * This replaces the HTTP streaming endpoint with a WebSocket connection
 */

// Convert HTTP URL to WebSocket URL
const getWebSocketUrl = () => {
  // Replace http:// with ws:// or https:// with wss://
  const wsUrl = `${window.location.origin.replace(/^http/, 'ws')}/ws/chat`;
  return wsUrl;
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  repo_url: string;
  messages: ChatMessage[];
  filePath?: string;
  token?: string;
  type?: string;
  provider?: string;
  model?: string;
  language?: string;
  excluded_dirs?: string;
  excluded_files?: string;
  repository_path?: string;
}

/**
 * Creates a WebSocket connection for chat completions
 * @param request The chat completion request
 * @param onMessage Callback for received messages
 * @param onError Callback for errors
 * @param onClose Callback for when the connection closes
 * @returns The WebSocket connection
 */
export const createChatWebSocket = (
  request: ChatCompletionRequest,
  onMessage: (message: string) => void,
  onError: (error: Event) => void,
  onClose: () => void
): WebSocket => {
  // Create WebSocket connection
  const ws = new WebSocket(getWebSocketUrl());

  console.log(`Public web socket url: ${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`);
  console.log(`final ws url: ${ws}`);
  
  // Set up event handlers
  ws.onopen = () => {
    console.log('WebSocket connection established');
    // Send the request as JSON
    ws.send(JSON.stringify(request));
  };
  
  ws.onmessage = (event) => {
    // Call the message handler with the received text
    onMessage(event.data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket connection closed');
    onClose();
  };
  
  return ws;
};

/**
 * Closes a WebSocket connection
 * @param ws The WebSocket connection to close
 */
export const closeWebSocket = (ws: WebSocket | null): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
};
