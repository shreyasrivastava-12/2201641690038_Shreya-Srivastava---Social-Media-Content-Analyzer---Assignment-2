// Gemini API Configuration
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

// Gemini API endpoint and model configuration
export const GEMINI_CONFIG = {
  apiKey: GEMINI_API_KEY,
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxOutputTokens: 4096,
};

// Analysis prompt template
export const ANALYSIS_PROMPT = `
Please analyze the following extracted text and provide a comprehensive social media content analysis with improvement suggestions:

## 1. **Content Summary**
Provide a brief overview of what the text contains and its main message.

## 2. **Sentiment Analysis**
Analyze the emotional tone, mood, and sentiment conveyed in the text. Identify if it's positive, negative, neutral, or mixed, and explain how this affects audience engagement.

## 3. **Key Points & Main Ideas**
Extract and list the primary themes, key messages, and important information that the text communicates.

## 4. **Writing Quality Assessment**
Evaluate:
- Grammar and spelling
- Clarity and readability
- Structure and organization
- Tone consistency
- Audience appropriateness

## 5. **Engagement Enhancement Suggestions**

### **Hashtag Recommendations**
Suggest relevant hashtags that could increase visibility and reach, including:
- General topic hashtags
- Niche/specific hashtags
- Trending hashtags if applicable
- Community hashtags

### **Emoji Usage Suggestions**
Recommend strategic emoji placement to:
- Enhance emotional expression
- Improve relatability
- Increase visual appeal
- Support the message tone

### **Call-to-Action (CTA) Ideas**
Provide specific CTA suggestions that could:
- Encourage audience interaction
- Foster community engagement
- Drive specific actions (comments, shares, saves)
- Build relationships with followers

### **Trending Topic Alignment**
Suggest ways to connect the content with:
- Current events or trends
- Awareness days or months
- Viral challenges or movements
- Seasonal relevance

## 6. **Content Optimization Tips**
Offer specific, actionable advice for:
- Improving readability
- Enhancing engagement potential
- Expanding reach
- Building audience connection

## 7. **Overall Content Rating**
Rate the content from 1-10 with detailed justification covering:
- Message clarity
- Engagement potential
- Shareability
- Community value

## 8. **Implementation Examples**
Provide concrete examples of how to implement the suggestions, including:
- Sample revised hashtags
- Emoji placement examples
- CTA variations
- Trending topic integration

Please provide a comprehensive, actionable analysis that would help improve social media content performance and audience engagement.

Text to analyze:
`;
