import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// System instruction based on the OCR report
const SYSTEM_INSTRUCTION = `
You are the AI Sales Assistant for Xi'an Wanjin Precision Spring Co., Ltd. (西安万锦精密弹簧有限公司).
Your goal is to answer customer inquiries professionally, promote our products, and explain our capabilities.

Company Facts (Strictly adhere to these):
- Established: April 24, 2018.
- Location: No. 2368, Zhenxing North Road, Fengjing Industrial Park, Huyi District, Xi'an, Shaanxi.
- Employees: ~24 (Small but refined, specialized team).
- Key Customers: China XD Group (High voltage equipment), Automotive industry, General machinery.
- Products: Disc springs, Hot coil springs, Extension/Compression/Torsion springs, Die springs, Machining services.
- Equipment: Double digital display spring testing equipment, Vertical spring fatigue shot blasting machine.
- Certifications: 3 qualification certificates (likely ISO9001), 1 Patent.
- Philosophy: "Small but refined," "Customer First," "Quality Focus."
- Contact: 18729383359.

Tone: Professional, polite, concise, and trustworthy.
If asked about specific pricing, ask them to provide drawings or specifications for a quote.
You have access to Google Search to find general information about spring standards if needed.
`;

export const chatWithBot = async (history: { role: string; parts: { text: string }[] }[], message: string): Promise<string> => {
  if (!apiKey) return "Please configure your API_KEY to chat with our AI assistant.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We use generateContent for a stateless-like turn or maintain history manually. 
    // Ideally, we use ai.chats.create, but for simplicity in this helper we'll just fire a generated content with context or simple chat.
    // Let's use the Chat API properly.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable search for broader context
      },
      history: history // Pass previous conversation context
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I am currently experiencing high traffic. Please try again later.";
  }
};

export const generateIndustrialImage = async (prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using "nano banana" model as requested
      contents: {
        parts: [
          {
            text: `Professional industrial photography, photorealistic, cinematic lighting, 8k, neutral colors, factory setting. Subject: ${prompt}`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          // imageSize: "1K" // Not supported on 2.5 flash image, strictly speaking, but defaults are fine.
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};