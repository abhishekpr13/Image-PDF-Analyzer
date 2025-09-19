import express  from "express";
import FileModel from "../models/file";
import { authenticateToken, AuthRequest } from "../middleware/auth";

import path from "path";


const router = express.Router()


router.get('/:id', authenticateToken, async(req: AuthRequest, res)=>{
    try{
        const fileID = req.params.id;
        const file = await FileModel.findOne({ _id: fileID, userId: req.user.userId }); // Add ownership check

        if (!file){
            return res.status(404).json({ 
                error: "File not found"
            })
        }
        res.json(file)
    } catch(error) {
        res.status(500).json({ 
            error : "Failed to retrieve the file"
        })
    }
})

router.delete('/:id',authenticateToken,async(req:AuthRequest,res)=>{
    try {
        const delete_id = req.params.id;
        const file = await FileModel.findOne({ _id: delete_id, userId: req.user.userId });

        if (!file){
            return res.status(500).json({
                error: "File not found"
            })
        }
        await FileModel.findByIdAndDelete(delete_id);
        res.json({
            message: " Suesfully deleted",
            id : delete_id
        })
    } catch(error){
        res.status(404).json({
            error: " Failed to delete" 
        })
    }
})

router.get('/download/:id',authenticateToken,async(req:AuthRequest,res)=>{
    try {

        const fileId= req.params.id;
        const file = await FileModel.findOne({ _id: fileId, userId: req.user.userId });
        

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
    }
    const filePath = file.filePath;
    const absolutePath = path.resolve(filePath);
    res.sendFile(absolutePath);

    }catch(error){
        res.status(404).json({
            error: " Failed to delete"
        })
    }
})

router.get('/',authenticateToken,async(req:AuthRequest,res)=>{
    try {
        const files = await FileModel.find({userId: req.user.userId});
        res.json({
            message: 'Files retrieved successfully',
            count: files.length,
            files: files
        });
    } catch(error){
        return res.status(404).json({error:" Authentication faile "})
    }

})


export default router;