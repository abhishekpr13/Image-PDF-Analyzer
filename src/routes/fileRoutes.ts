import express  from "express";
import FileModel from "../models/file"
import path from "path";




const router = express.Router()

router.get('/',async(req,res)=>{
    try{
        const files = await FileModel.find()
        res.json({
            message: "File retrived succesfully!!",
            count : files.length,
            files: files

        })

    }catch(error){
        res.status(500).json({
            error: "Failed to retrive the file"
          
        })
    }
});

router.get('/:id', async(req,res)=>{
    try{

        const fileID = req.params.id;
        const file = await FileModel.findById(fileID);

        if (!file){
            return res.status(500).json({
                error: "File not found"
            })
        }

        res.json(file)


    } catch(error) {
        res.status(500).json({
            error : " Failed to retrive the id"
        })
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        const delete_id = req.params.id;
        const file = await FileModel.findByIdAndDelete(delete_id)


        if (!file){
            return res.status(500).json({
                error: "File not found"
            })
        }
        res.json({
            message: " Suesfully deleted",
            id : delete_id
        })
    } catch(error){
        res.status(500).json({
            error: " Failed to delete" 
        })
    }
})

router.get('/download/:id',async(req,res)=>{
    try {

        const fileId= req.params.id;
        const file = await FileModel.findById(fileId);
        

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
    }
    const filePath = file.filePath;
    const absolutePath = path.resolve(filePath);
    res.sendFile(absolutePath);

    }catch(error){
        res.status(500).json({
            error: " Failed to delete"
        })
    }
})


export default router;