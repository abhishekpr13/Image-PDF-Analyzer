import React, {useState, useEffect} from "react";
import { FileData } from "./types";
import './App.css';

function FileList() {
  const [uploadedFiles, setUploadedFile] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFile();
  }, []);

  const deleteFile = async(fileId:string) =>{
    try {
      const response = await fetch(`http://localhost:8000/api/files/${fileId}`,
        {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log(" Sucesfully Deleted !!",fileId)
          fetchFile();
        }

    } catch(error) {
      console.log("Unable to delete", error)
    }
  }



  const fetchFile = async() => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:8000/api/files');
      const result = await response.json();
      setUploadedFile(result.files);
      setLoading(false);
    } catch(error) {
      console.log("Error in fetching file", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Files...</div>
  }

  return (
    <div style={{marginTop: '40px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2 style={{margin: 0, color: '#2c3e50'}}>All Uploaded Files ({uploadedFiles.length})</h2>
        <button onClick={fetchFile} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {uploadedFiles.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#6c757d'}}>
          <p>No files uploaded yet. Upload your first file above!</p>
        </div>
      ) : (
        <div className="files-grid">
          {uploadedFiles.map((file) => (
            <div key={file._id} className="file-card">
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: file.mimeType.includes('image') ? '#e3f2fd' : '#fff3e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  {file.mimeType.includes('image') ? '🖼️' : '📄'}
                </div>
                <div>
                  <h4 style={{margin: 0, fontSize: '16px', color: '#2c3e50'}}>{file.originalName}</h4>
                  <p style={{margin: 0, fontSize: '12px', color: '#6c757d'}}>{file.mimeType}</p>
                </div>
              </div>
              
              <div style={{fontSize: '14px', color: '#495057'}}>
                <p style={{margin: '8px 0'}}><strong>Size:</strong> {Math.round(file.fileSize / 1024)} KB</p>
                <p style={{margin: '8px 0'}}><strong>Uploaded:</strong> {new Date(file.uploadDate).toLocaleDateString()}</p>
              </div>
              
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }} onClick={()=> window.open(`http://localhost:8000/api/files/download/${file._id}`)}>
                  Download
                </button>
                <button style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }} onClick={()=> deleteFile(file._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files))
      setUploadStatus('');
    }
  };

  const uploadFiles = async() => {
    setUploadStatus('uploading...')
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        console.log("Upload result", result)
      } catch(error) {
        console.log("upload error", error)
        setUploadStatus('Upload failed! Please try again.');
        return;
      }
    }
    setUploadStatus(`${selectedFiles.length} file(s) uploaded successfully!`)
    setSelectedFiles([])
    setTimeout(() => {
      setUploadStatus('');
    }, 3000);
  }

  return (
    <div className="upload-container">
      <h2 style={{color: '#2c3e50', marginBottom: '10px'}}>Upload Your Files</h2>
      <p style={{color: '#6c757d', marginBottom: '20px'}}>
        Drag and drop files here or click to browse (Images and PDFs only)
      </p>
      
      <input 
        type="file"
        multiple
        onChange={handleFileSelect}
        accept="image/*,application/pdf"
        className="file-input"
        style={{
          padding: '12px',
          border: '2px solid #dee2e6',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer'
        }}
      />

      {uploadStatus && (
        <div className={uploadStatus.includes('failed') ? 'status-error' : 'status-success'}>
          {uploadStatus}
        </div>
      )}
      
      {selectedFiles.length > 0 && (
        <div style={{marginTop: '20px', textAlign: 'left'}}>
          <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>Selected Files:</h4>
          <div style={{marginBottom: '15px'}}>
            {selectedFiles.map((file, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '8px 12px',
                margin: '5px 0',
                borderRadius: '4px',
                border: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{file.name}</span>
                <span style={{color: '#6c757d', fontSize: '12px'}}>
                  {Math.round(file.size / 1024)} KB
                </span>
              </div>
            ))}
          </div>
          
          <button onClick={uploadFiles} className="upload-btn">
            Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header style={{textAlign: 'center', marginBottom: '40px'}}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Image Analyzer
        </h1>
        <p style={{color: '#6c757d', fontSize: '1.1rem'}}>
          Upload and analyze your images and PDFs with ease
        </p>
      </header>
      
      <FileUploader/>
      <FileList/>
    </div>
  );
}

export default App;