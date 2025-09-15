import React, {useState} from "react";
import './App.css';


function FileUploader () {


  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files))
      setUploadStatus('');
    }
  };
    const uploadFiles = async() =>{
      setUploadStatus('uploading...')
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file',file);
      try {
        const response = await fetch('http://localhost:8000/api/upload',{
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        console.log("Upload result", result)
      } catch(error){
        console.log("upload error", error)
      }

    }
    setUploadStatus(`${selectedFiles.length} file(s) uploaded sucesfully`)
    setSelectedFiles([]) //clear the elected files 
    setTimeout(()=>{
      setUploadStatus('');
    },3000);
  }
  return (
    <div>
      <h2>Upload your file</h2>
      <input 
        type="file"
        multiple
        onChange={handleFileSelect}
        accept="image/*,application/pdf"
      />

      {/* Show upload status */}
      {uploadStatus && (
        <div style={{color: uploadStatus.includes('failed') ? 'red' : 'green', margin: '10px 0'}}>
          {uploadStatus}
        </div>
      )}
      
      {/*Display the selected files*/}
      {selectedFiles.length > 0 && 
      <div>
        <h3>selected files:</h3>
        {selectedFiles.map((File,index)=>(
          <p key={index}>{File.name}</p>
        ))}
        {/* Add upload button */}
        
        <button onClick={uploadFiles}>Upload Files</button>

      </div>
      }

    </div>
  );
}

function app () {
  return (
    <div className="App">
      <h1>Image Analyzer</h1>
      <FileUploader/>
    </div>
  );
}

export default app
