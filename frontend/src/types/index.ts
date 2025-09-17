export interface FileData {
  _id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  analysisResult?: string;
}

export interface ApiResponse {
  message: string;
  count: number;
  files: FileData[];
}

export interface UploadResponse {
  message: string;
  fileId: string;
  originalName: string;
  size: number;
}

// Component State Types
export interface UploadStatus {
  loading: boolean;
  message: string;
  error: boolean;
}