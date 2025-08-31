import React, { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import geminiService from '../services/geminiService';
import './FileUpload.css';

// Set worker source to use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [extractionProgress, setExtractionProgress] = useState({});
  const [geminiAnalysis, setGeminiAnalysis] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload PDF or image files only.' };
    }
    
    if (file.size > maxFileSize) {
      return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
    }
    
    return { valid: true };
  };

  const extractTextFromPDF = async (file) => {
    try {
      console.log(`Starting PDF text extraction for: ${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      console.log(`PDF loaded: ${pdf.numPages} pages`);
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        
        console.log(`Page ${pageNum}: ${pageText.length} characters`);
      }
      
      console.log('=== PDF TEXT EXTRACTION RESULT ===');
      console.log(`File: ${file.name}`);
      console.log(`Pages: ${pdf.numPages}`);
      console.log(`Total Text Length: ${fullText.length} characters`);
      console.log('Extracted Text:');
      console.log(fullText);
      console.log('================================');
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return null;
    }
  };

  const extractTextFromImage = async (file) => {
    try {
      console.log(`Starting image text extraction for: ${file.name}`);
      
      return new Promise((resolve, reject) => {
        Tesseract.recognize(
          file,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setExtractionProgress(prev => ({
                  ...prev,
                  [file.name]: Math.round(m.progress * 100)
                }));
              }
            }
          }
        ).then(({ data: { text } }) => {
          console.log('=== IMAGE TEXT EXTRACTION RESULT ===');
          console.log(`File: ${file.name}`);
          console.log(`Text Length: ${text.length} characters`);
          console.log('Extracted Text:');
          console.log(text);
          console.log('==================================');
          
          setExtractionProgress(prev => ({ ...prev, [file.name]: 100 }));
          resolve(text);
        }).catch(error => {
          console.error('Error extracting text from image:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error extracting text from image:', error);
      return null;
    }
  };

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => {
      const validation = validateFile(file);
      return {
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        valid: validation.valid,
        error: validation.error,
        preview: null,
        extractedText: null,
        isExtracting: false,
        isAnalyzing: false,
        geminiAnalysis: null
      };
    });

    // Generate previews for valid files and extract text
    newFiles.forEach(fileObj => {
      if (fileObj.valid) {
        // Generate preview for images
        if (fileObj.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === fileObj.id ? { ...f, preview: e.target.result } : f
            ));
          };
          reader.readAsDataURL(fileObj.file);
        }

        // Extract text based on file type
        if (fileObj.type === 'application/pdf') {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, isExtracting: true } : f
          ));
          
          extractTextFromPDF(fileObj.file).then(extractedText => {
            setFiles(prev => prev.map(f => 
              f.id === fileObj.id ? { ...f, extractedText, isExtracting: false } : f
            ));
            
            // Automatically analyze with Gemini after text extraction
            if (extractedText) {
              analyzeWithGemini(fileObj.id, extractedText, fileObj.name);
            }
          });
        } else if (fileObj.type.startsWith('image/')) {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, isExtracting: true } : f
          ));
          
          extractTextFromImage(fileObj.file).then(extractedText => {
            setFiles(prev => prev.map(f => 
              f.id === fileObj.id ? { ...f, extractedText, isExtracting: false } : f
            ));
            
            // Automatically analyze with Gemini after text extraction
            if (extractedText) {
              analyzeWithGemini(fileObj.id, extractedText, fileObj.name);
            }
          });
        }
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, []);

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    handleFileSelect(selectedFiles);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const simulateUpload = (fileId) => {
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev[fileId] + Math.random() * 30;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [fileId]: 100 };
        }
        return { ...prev, [fileId]: newProgress };
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return '📄';
    }
    return '🖼️';
  };

  const analyzeWithGemini = async (fileId, extractedText, fileName) => {
    if (!extractedText) return;
    
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isAnalyzing: true } : f
    ));
    
    try {
      const result = await geminiService.analyzeText(extractedText, fileName);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, geminiAnalysis: result, isAnalyzing: false } : f
      ));
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          geminiAnalysis: { 
            success: false, 
            error: error.message,
            fileName: fileName 
          },
          isAnalyzing: false 
        } : f
      ));
    }
  };

  const getExtractionStatus = (fileObj) => {
    if (fileObj.isExtracting) {
      return (
        <div className="extraction-status">
          <span className="extracting">🔄 Extracting text...</span>
          {extractionProgress[fileObj.name] && (
            <span className="progress">{extractionProgress[fileObj.name]}%</span>
          )}
        </div>
      );
    }
    
    if (fileObj.extractedText) {
      return (
        <div className="extraction-status">
          <span className="success">✅ Text extracted ({fileObj.extractedText.length} chars)</span>
          {fileObj.isAnalyzing && (
            <span className="analyzing">🤖 Analyzing with Gemini...</span>
          )}
          {fileObj.geminiAnalysis && fileObj.geminiAnalysis.success && (
            <span className="analysis-complete">🧠 Gemini analysis complete</span>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Drag & Drop files here</h3>
          <p>or click to browse</p>
          <p className="file-types">Supported: PDF, JPG, PNG, GIF, WEBP (Max: 10MB)</p>
          <p className="text-extraction-info">📝 Text will be automatically extracted and analyzed with Gemini AI</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h3>Uploaded Files ({files.length})</h3>
          {files.map((fileObj) => (
            <div key={fileObj.id} className={`file-item ${fileObj.valid ? 'valid' : 'invalid'}`}>
              <div className="file-info">
                <div className="file-icon">{getFileIcon(fileObj.type)}</div>
                <div className="file-details">
                  <h4>{fileObj.name}</h4>
                  <p>{formatFileSize(fileObj.size)} • {fileObj.type}</p>
                  {!fileObj.valid && <p className="error">{fileObj.error}</p>}
                  {getExtractionStatus(fileObj)}
                </div>
              </div>
              
              {fileObj.valid && (
                <div className="file-actions">
                  {uploadProgress[fileObj.id] !== undefined ? (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${uploadProgress[fileObj.id]}%` }}
                        ></div>
                      </div>
                      <span>{Math.round(uploadProgress[fileObj.id])}%</span>
                    </div>
                  ) : (
                    <button 
                      className="upload-btn"
                      onClick={() => simulateUpload(fileObj.id)}
                    >
                      Upload
                    </button>
                  )}
                  <button 
                    className="remove-btn"
                    onClick={() => removeFile(fileObj.id)}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {fileObj.preview && (
                <div className="file-preview">
                  <img src={fileObj.preview} alt={fileObj.name} />
                </div>
              )}
              
              {/* Gemini Analysis Results */}
              {fileObj.geminiAnalysis && (
                <div className="gemini-analysis">
                  <h4>🤖 Gemini AI Analysis</h4>
                  {fileObj.geminiAnalysis.success ? (
                    <div className="analysis-content">
                      <pre>{fileObj.geminiAnalysis.analysis}</pre>
                    </div>
                  ) : (
                    <div className="analysis-error">
                      <p>❌ Analysis failed: {fileObj.geminiAnalysis.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
