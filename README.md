# Social Media Content Analyzer

A React.js application that analyzes social media content using AI. Upload PDFs or images to extract text and get AI-powered analysis and improvement suggestions.

## Features

- **File Upload**: Drag & drop or click to upload PDFs and images
- **Text Extraction**: 
  - PDF text extraction using PDF.js
  - Image OCR using Tesseract.js
- **AI Analysis**: Gemini AI integration for content analysis
- **Responsive Design**: Works on desktop and mobile
- **File Management**: Remove files and analyze new content

## Supported Files

- **PDFs**: Text extraction from documents
- **Images**: JPG, PNG, GIF, WEBP (OCR text extraction)
- **Size Limit**: 10MB per file

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Gemini AI**:
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create `.env` file with: `REACT_APP_GEMINI_API_KEY=your_api_key`

3. **Run the app**:
   ```bash
   npm start
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload**: Drag & drop files or click to browse
2. **Wait**: Text extraction happens automatically
3. **Analyze**: AI analysis starts automatically after extraction
4. **Review**: See analysis results and suggestions
5. **New Analysis**: Click "🔄 Analyze Another Post" for new content

## Tech Stack

- **Frontend**: React.js, CSS3
- **PDF Processing**: PDF.js
- **Image OCR**: Tesseract.js
- **AI Analysis**: Google Gemini API

## Project Structure

```
src/
├── components/
│   ├── FileUpload.js      # Main file upload component
│   └── FileUpload.css     # Component styles
├── services/
│   └── geminiService.js   # Gemini AI integration
└── config/
    └── gemini.js          # API configuration
```

## Customization

- **File Types**: Modify `allowedTypes` array in `FileUpload.js`
- **File Size**: Update `maxFileSize` constant
- **Styling**: Edit `FileUpload.css` for visual changes

## License

MIT License - Open source project
