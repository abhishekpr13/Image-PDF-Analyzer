import express from "express"
import cors from "cors";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import FileModel from "./models/file"
import FileRoute from "./routes/fileRoutes";


// Add mongo db connection 
mongoose.connect('mongodb+srv://abhishek139sharma_db_user:qAQSjPDmA0a1GW80@cluster0.zimscde.mongodb.net/image-analyzer?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueName)
  }
})

const upload = multer({ storage: storage,
    fileFilter: (req,file,cb) =>{
        const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
       

        if (allowedType.includes(file.mimetype)){
            cb(null,true)
            console.log(`Fille is in accepteable formate: ${file.mimetype}`)
        }
        else {
            cb(null, false);
            cb(new Error('Invalid file type'))
            console.log('Invalid file type attempted');
    }
    }
 })


const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/files',FileRoute)

app.get('/',(req,res)=>{
    res.json({message: "Image-PDF-Analyzer is running!"})
})

app.post ('/api/upload',upload.single('file'),async(req,res)=>{
    if (!req.file){
        return res.status(400).json({
            error : 'File not uploaded succesfully'
        });
    }
    try {
        const newFile = new FileModel({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            
        });

        const savedFile = await newFile.save();
        res.json({
        message: 'File uploaded successfully and loaded to the databse !',
        fileId: savedFile._id,
        originalName: savedFile.originalName,
        size: savedFile.fileSize
    })
    } catch(error){
        res.status(500).json({error: 'Failed to save to the databse'})
    }
    
})




const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

