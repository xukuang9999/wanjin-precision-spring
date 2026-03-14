type ChatPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatPart[] };

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const notConfiguredMessage =
  'AI assistant is temporarily unavailable. Please contact sales@wanjinspring.com or call +86 187 2938 3359.';

export const chatWithBot = async (history: ChatHistoryItem[], message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });

    if (!response.ok) {
      return notConfiguredMessage;
    }

    const data = (await response.json()) as { text?: string };
    return data.text || notConfiguredMessage;
  } catch (error) {
    console.error('Chat Error:', error);
    return notConfiguredMessage;
  }
};

export const generateIndustrialImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { image?: string };
    return data.image || null;
  } catch (error) {
    console.error('Image Gen Error:', error);
    return null;
  }
};
