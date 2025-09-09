import express from "express"
import cors from "cors";
import multer from "multer";
import path from "path";


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
        const allowedType = ['image/jpeg', 'image/jpg', 'application/pdf'];
       

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

app.get('/',(req,res)=>{
    res.json({message: "Image-PDF-Analyzer is running!"})
})

app.post ('/api/upload',upload.single('file'),(req,res)=>{
    if (!req.file){
        return res.status(400).json({
            error : 'File not uploaded succesfully'
        })
    }
    res.json({
        message: 'File uploaded successfully!',
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
    })
})


const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

