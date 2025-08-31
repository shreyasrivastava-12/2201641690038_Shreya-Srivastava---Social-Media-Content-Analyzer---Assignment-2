# File Upload UI

A modern, responsive React.js application that allows users to upload PDF files and images with drag-and-drop functionality.

## Features

- **Drag & Drop Interface**: Intuitive drag-and-drop file upload area
- **Multiple File Support**: Upload multiple files at once
- **File Type Validation**: Supports PDF, JPG, PNG, GIF, and WEBP files
- **File Size Validation**: Maximum file size limit of 10MB
- **Image Previews**: Automatic preview generation for image files
- **Progress Tracking**: Visual upload progress indicators
- **File Management**: Remove individual files from the upload list
- **Text Extraction**: 
  - PDF text extraction using PDF.js
  - Image OCR text extraction using Tesseract.js
- **AI Analysis**: Gemini AI integration for text analysis and improvement suggestions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Dark Mode Support**: Automatically adapts to system dark mode preference

## Supported File Types

- **Documents**: PDF (.pdf)
- **Images**: JPG (.jpg, .jpeg), PNG (.png), GIF (.gif), WEBP (.webp)

## File Size Limits

- Maximum file size: 10MB per file
- No limit on the number of files

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Gemini AI API key (for text analysis features)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd file-upload-ui
   ```

3. Set up Gemini AI API:
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env` file in the project root
   - Add your API key: `REACT_APP_GEMINI_API_KEY=your_actual_api_key_here`

4. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` folder.

## Usage

### Uploading Files

1. **Drag & Drop**: Simply drag files from your computer and drop them onto the upload area
2. **Click to Browse**: Click on the upload area to open the file browser and select files
3. **Multiple Selection**: You can select multiple files at once in the file browser

### File Management

- **View Files**: All uploaded files are displayed in a list below the upload area
- **File Information**: See file name, size, type, and validation status
- **Remove Files**: Click the red "✕" button to remove individual files
- **Upload Progress**: Click the "Upload" button to see a simulated upload progress

### AI Text Analysis

- **Gemini Integration**: After text extraction, click "🧠 Analyze with Gemini" button
- **Comprehensive Analysis**: Get content summary, key points, writing quality assessment
- **Improvement Suggestions**: Receive specific recommendations for enhancing the text
- **Quality Rating**: Get an overall quality score from 1-10 with justification

### File Validation

- Files are automatically validated for type and size
- Invalid files are highlighted in red with error messages
- Only valid files can be uploaded

## Technical Details

### Built With

- **React.js**: Modern JavaScript library for building user interfaces
- **CSS3**: Advanced styling with gradients, animations, and responsive design
- **HTML5**: Semantic markup and file input handling

### Key Components

- **FileUpload**: Main component handling file selection, validation, and display
- **Drag & Drop**: Custom drag-and-drop implementation with visual feedback
- **File Preview**: Image preview generation using FileReader API
- **Progress Tracking**: Simulated upload progress with animated progress bars

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Styling

The application uses CSS custom properties and can be easily customized by modifying:

- `src/components/FileUpload.css` - Main component styles
- `src/App.css` - Application-wide styles

### File Types

To add support for additional file types, modify the `allowedTypes` array in `FileUpload.js`.

### File Size Limits

To change the maximum file size, update the `maxFileSize` constant in `FileUpload.js`.

## Future Enhancements

- Real file upload to server/cloud storage
- File compression and optimization
- Advanced file preview (PDF viewer, video previews)
- Batch operations (select all, remove all)
- File organization and categorization
- Upload history and file management

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please check the browser console for error messages or create an issue in the project repository.
