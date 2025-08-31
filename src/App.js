import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Upload</h1>
        <p>Upload your PDFs and images easily</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
