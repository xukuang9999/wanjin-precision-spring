type ChatPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatPart[] };
type ChatErrorType = 'timeout' | 'client' | 'server' | 'network' | 'invalid_response';
type ChatResult =
  | { isError: false; text: string }
  | { isError: true; errorType: ChatErrorType; status?: number };

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const CHAT_TIMEOUT_MS = 30_000;
const CHAT_RETRY_DELAY_MS = 800;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestChatResponse = async (history: ChatHistoryItem[], message: string): Promise<ChatResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        isError: true,
        errorType: response.status >= 500 ? 'server' : 'client',
        status: response.status,
      };
    }

    const data = (await response.json()) as { text?: string };
    if (typeof data.text !== 'string' || !data.text.trim()) {
      return { isError: true, errorType: 'invalid_response', status: response.status };
    }

    return {
      isError: false,
      text: data.text,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Chat request timed out after 30 seconds.');
      return { isError: true, errorType: 'timeout' };
    }

    console.error('Chat request failed:', error);
    return { isError: true, errorType: 'network' };
  } finally {
    clearTimeout(timeoutId);
  }
};

export const chatWithBot = async (history: ChatHistoryItem[], message: string): Promise<ChatResult> => {
  let lastError: Extract<ChatResult, { isError: true }> | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await requestChatResponse(history, message);

    if (!result.isError) {
      return result;
    }

    lastError = result;

    const shouldRetry =
      result.errorType === 'timeout' ||
      result.errorType === 'network' ||
      (typeof result.status === 'number' && RETRYABLE_STATUS_CODES.has(result.status));

    if (!shouldRetry || attempt === 1) {
      break;
    }

    await wait(CHAT_RETRY_DELAY_MS * (attempt + 1));
  }

  return lastError ?? { isError: true, errorType: 'network' };
};
