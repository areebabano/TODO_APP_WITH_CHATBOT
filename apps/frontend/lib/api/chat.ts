/**
 * Chat API client for the custom SSE streaming chat interface.
 */

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  title: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StreamEvent =
  | { event: "conversation_id"; data: { conversation_id: string } }
  | { event: "text_delta"; data: { content: string } }
  | { event: "tool_call"; data: { name: string; arguments: string } }
  | { event: "tool_output"; data: { name: string; output: string } }
  | { event: "done"; data: { content: string } }
  | { event: "error"; data: { content: string } };

// ---------------------------------------------------------------------------
// LocalStorage helpers – persist active conversation across navigation
// ---------------------------------------------------------------------------

const CHAT_CONVERSATION_KEY = "todo-chat-conversation-id";

export function saveActiveConversationId(id: string): void {
  try {
    localStorage.setItem(CHAT_CONVERSATION_KEY, id);
  } catch {
    // localStorage unavailable (SSR / quota exceeded)
  }
}

export function getSavedConversationId(): string | null {
  try {
    return localStorage.getItem(CHAT_CONVERSATION_KEY);
  } catch {
    return null;
  }
}

export function clearSavedConversationId(): void {
  try {
    localStorage.removeItem(CHAT_CONVERSATION_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// REST helpers
// ---------------------------------------------------------------------------

export async function getConversations(): Promise<ChatConversation[]> {
  const res = await fetch("/api/chat/conversations", {
    credentials: "same-origin",
  });
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function getMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}/messages`,
    { credentials: "same-origin" }
  );
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

// ---------------------------------------------------------------------------
// SSE streaming
// ---------------------------------------------------------------------------

/**
 * Parse complete SSE lines from buffer, dispatch events, return leftover.
 */
function processSSEBuffer(
  buffer: string,
  onEvent: (event: StreamEvent) => void,
  onTerminal: () => void
): string {
  const lines = buffer.split("\n");
  const remaining = lines.pop() || "";

  let currentEvent = "";
  for (const line of lines) {
    if (line.startsWith("event: ")) {
      currentEvent = line.slice(7).trim();
    } else if (line.startsWith("data: ") && currentEvent) {
      try {
        const data = JSON.parse(line.slice(6));
        onEvent({ event: currentEvent, data } as StreamEvent);
        if (currentEvent === "done" || currentEvent === "error") {
          onTerminal();
        }
      } catch {
        // Skip malformed JSON
      }
      currentEvent = "";
    }
  }

  return remaining;
}

/**
 * Send a chat message and stream the response via SSE.
 *
 * Includes a 60-second safety timeout, proper stream flushing after the
 * reader finishes, and guaranteed terminal-event delivery so the UI never
 * gets stuck in a permanent loading state.
 */
export function sendMessage(
  message: string,
  conversationId: string | null,
  onEvent: (event: StreamEvent) => void
): AbortController {
  const controller = new AbortController();
  let terminated = false;

  /** Fire a terminal event exactly once. */
  function fireTerminal(event: StreamEvent) {
    if (terminated) return;
    terminated = true;
    onEvent(event);
  }

  // Safety timeout – prevents infinite "Thinking…" if the backend hangs
  const timeoutId = setTimeout(() => {
    if (!terminated) {
      fireTerminal({
        event: "error",
        data: { content: "Request timed out. Please try again." },
      });
      controller.abort();
    }
  }, 60_000);

  const body: Record<string, string> = { message };
  if (conversationId) {
    body.conversation_id = conversationId;
  }

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (res.status === 429) {
        fireTerminal({
          event: "error",
          data: {
            content:
              "Too many requests. Please wait a moment and try again.",
          },
        });
        return;
      }
      if (!res.ok) {
        let detail = "Chat service unavailable. Please try again.";
        try {
          const errBody = await res.json();
          if (errBody.detail) detail = errBody.detail;
        } catch {
          // use default
        }
        fireTerminal({ event: "error", data: { content: detail } });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        fireTerminal({
          event: "error",
          data: { content: "No response stream" },
        });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          buffer = processSSEBuffer(buffer, onEvent, () => {
            terminated = true;
          });
        }

        // Flush remaining decoder bytes and process any leftover buffer.
        // This is the critical fix – previously the last SSE chunk (often
        // containing the "done" event) was silently discarded.
        buffer += decoder.decode();
        if (buffer.trim()) {
          processSSEBuffer(buffer + "\n", onEvent, () => {
            terminated = true;
          });
        }
      } finally {
        reader.releaseLock();
      }

      // If the stream ended without a terminal event, fire a synthetic one
      // so the UI always exits the loading state.
      if (!terminated) {
        fireTerminal({ event: "done", data: { content: "" } });
      }
    })
    .catch((err) => {
      if (err.name === "AbortError") return; // handled by timeout or user
      console.error("[chat] Stream error:", err);
      fireTerminal({
        event: "error",
        data: {
          content:
            "Connection failed. Please check your network and try again.",
        },
      });
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });

  return controller;
}
