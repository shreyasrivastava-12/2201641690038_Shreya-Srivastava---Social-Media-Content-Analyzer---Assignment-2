import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Social Media Content Analyzer</h1>
        <p>Analyzes social media posts and suggests engagement improvements</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
