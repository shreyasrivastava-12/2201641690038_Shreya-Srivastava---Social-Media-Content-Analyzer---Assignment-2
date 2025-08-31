import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, ANALYSIS_PROMPT } from '../config/gemini';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: {
        temperature: GEMINI_CONFIG.temperature,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
      }
    });
  }

  async analyzeText(extractedText, fileName) {
    try {
      if (!GEMINI_CONFIG.apiKey) {
        throw new Error('Gemini API key not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
      }

      console.log(`🔍 Sending text to Gemini for analysis: ${fileName}`);
      
      const prompt = `${ANALYSIS_PROMPT}\n\nFile: ${fileName}\n\n${extractedText}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();
      
      console.log('=== GEMINI ANALYSIS RESULT ===');
      console.log(`File: ${fileName}`);
      console.log('Analysis:');
      console.log(analysis);
      console.log('=============================');
      
      return {
        success: true,
        analysis,
        fileName,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error analyzing text with Gemini:', error);
      return {
        success: false,
        error: error.message,
        fileName,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getQuickSummary(extractedText, fileName) {
    try {
      if (!GEMINI_CONFIG.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `Provide a brief 2-3 sentence summary of the following text:\n\n${extractedText}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();
      
      return {
        success: true,
        summary,
        fileName
      };
      
    } catch (error) {
      console.error('Error getting quick summary:', error);
      return {
        success: false,
        error: error.message,
        fileName
      };
    }
  }
}

export default new GeminiService();
