
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: ChatMessage[], message: string): Promise<string> {
    try {
      // Re-initialize to ensure latest API key if it's dynamic
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are a helpful assistant for the AlphaTask Suite. Keep responses concise and professional.",
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error: Could not connect to AI service. Please ensure your environment is configured correctly.";
    }
  }
}

export const geminiService = new GeminiService();
