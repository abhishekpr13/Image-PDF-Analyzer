import React, {useState, useEffect} from "react";
import { FileData } from "./types";
import './App.css';

// Add these CSS animations
const styles = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes buttonPress {
  from { transform: scale(1); }
  to { transform: scale(0.98); }
}
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Login Component
interface LoginProps {
  onLogin: (token: string, user: any) => void;
  switchToRegister: () => void;
}

function Login({ onLogin, switchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        onLogin(result.token, result.user);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      animation: 'fadeIn 0.5s ease-in'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        animation: 'slideDown 0.6s ease-out'
      }}>
        <h2 style={{ 
          color: '#1f2937', 
          fontSize: '28px', 
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          color: '#6b7280',
          fontSize: '16px',
          margin: 0
        }}>
          Sign in to your account
        </p>
      </div>
      
      {error && (
        <div style={{
          color: '#dc2626',
          background: '#fef2f2',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fecaca',
          fontSize: '14px',
          animation: 'shake 0.5s ease-in-out'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: loading ? 'scale(0.98)' : 'scale(1)',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Signing in...
            </div>
          ) : 'Sign In'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span>Don't have an account? </span>
        <button 
          type="button" 
          onClick={switchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#0d6efd',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Register here
        </button>
      </div>
    </div>
  );
}

// Register Component
interface RegisterProps {
  onRegister: () => void;
  switchToLogin: () => void;
}

function Register({ onRegister, switchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });
      
      if (response.ok) {
        alert('Registration successful! Please log in.');
        switchToLogin();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Register</h2>
      
      {error && (
        <div style={{
          color: '#d63384',
          background: '#f8d7da',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c2c7'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#6c757d' : '#198754',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span>Already have an account? </span>
        <button 
          type="button" 
          onClick={switchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#0d6efd',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Login here
        </button>
      </div>
    </div>
  );
}

// File List Component
interface FileListProps {
  token: string;
}

function FileList({ token }: FileListProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const downloadFile = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`${API_URL}/api/files/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      alert('Error downloading file');
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFiles();
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      alert('Error deleting file');
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setUploadedFiles(result.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading files...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '5px'
      }}>
        <h2 style={{ margin: 0 }}>My Files ({uploadedFiles.length})</h2>
        <button 
          onClick={fetchFiles}
          style={{
            padding: '10px 16px',
            background: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(13, 110, 253, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0b5ed7';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0d6efd';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 110, 253, 0.3)';
            e.currentTarget.style.transform = 'translateY(0px)';
          }}
        >
          Refresh
        </button>
      </div>
      
      {uploadedFiles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '5px',
          color: '#6c757d'
        }}>
          <p>No files uploaded yet. Upload your first file above!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {uploadedFiles.map((file) => (
            <div key={file.id} style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  {file.originalName}
                </h4>
                <small style={{ color: '#6c757d' }}>
                  {file.mimeType}
                </small>
              </div>
              
              <div style={{ marginBottom: '15px', fontSize: '14px', color: '#6c757d' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Size:</strong> {Math.round(file.fileSize / 1024)} KB
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Uploaded:</strong> {new Date(file.uploadDate).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => downloadFile(file.id, file.originalName)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#198754',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Download
                </button>
                <button 
                  onClick={() => deleteFile(file.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
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

// File Uploader Component
interface FileUploaderProps {
  token: string;
  onUploadSuccess: () => void;
}

function FileUploader({ token, onUploadSuccess }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
      setUploadStatus('');
    }
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    setUploadStatus('Uploading files...');
    
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }
      }
      
      setUploadStatus(`${selectedFiles.length} file(s) uploaded successfully!`);
      setSelectedFiles([]);
      setTimeout(() => {
        setUploadStatus('');
        onUploadSuccess();
      }, 2000);
    } catch (error) {
      setUploadStatus('Upload failed! Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      border: '2px dashed #ddd',
      borderRadius: '5px',
      padding: '30px',
      textAlign: 'center',
      marginBottom: '40px',
      background: '#fafafa'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>Upload Files</h3>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        Choose images or PDF files to upload
      </p>
      
      <input 
        type="file"
        multiple
        onChange={handleFileSelect}
        accept="image/*,application/pdf"
        style={{
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px'
        }}
      />

      {uploadStatus && (
        <div style={{
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          background: uploadStatus.includes('failed') ? '#f8d7da' : '#d1e7dd',
          color: uploadStatus.includes('failed') ? '#842029' : '#0f5132',
          border: `1px solid ${uploadStatus.includes('failed') ? '#f5c2c7' : '#badbcc'}`
        }}>
          {uploadStatus}
        </div>
      )}
      
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '10px',
              margin: '5px 0',
              borderRadius: '5px',
              border: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{file.name}</span>
              <span style={{ color: '#6c757d' }}>
                {Math.round(file.size / 1024)} KB
              </span>
            </div>
          ))}
          
          <button 
            onClick={uploadFiles} 
            disabled={isUploading}
            style={{
              marginTop: '15px',
              padding: '12px 30px',
              background: isUploading ? '#6c757d' : '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Check for saved token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, user: any) => {
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    
    // Save to localStorage for persistence
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleRegister = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshFiles = () => {
    // This will trigger file list refresh
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          width: '100%',
          maxWidth: '420px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          animation: 'slideIn 0.6s ease-out'
        }}>
          {showLogin ? 
            <Login onLogin={handleLogin} switchToRegister={() => setShowLogin(false)} /> :
            <Register onRegister={handleRegister} switchToLogin={() => setShowLogin(true)} />
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{
          background: 'white',
          padding: '20px',
          borderRadius: '5px',
          marginBottom: '30px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', color: '#333' }}>Image Analyzer</h1>
            <p style={{ margin: 0, color: '#6c757d' }}>Welcome back, {user?.name}!</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c82333';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dc3545';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Logout
          </button>
        </header>
        
        <FileUploader token={token} onUploadSuccess={refreshFiles} />
        <FileList token={token} />
      </div>
    </div>
  );
}

export default App;