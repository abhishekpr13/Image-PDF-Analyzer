import mongoose, {Document, Schema} from "mongoose";

interface IFile extends Document {
    originalName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadDate: Date;
    analysisResult?: string;
    userId: string; 
}

const FileSchema: Schema = new Schema({   
    originalName: {type: String, required: true},    
    fileName: {type: String, required: true},       
    filePath: {type: String, required: true},        
    fileSize: {type: Number, required: true},       
    mimeType: {type: String, required: true},        
    uploadDate: {type: Date, default: Date.now},     
    analysisResult: {type: String, required: false},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IFile>('File', FileSchema);