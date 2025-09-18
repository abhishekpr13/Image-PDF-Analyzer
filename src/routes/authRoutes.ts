import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';





const authrouter = express.Router();

// Register route 

authrouter.post('/register', async(req,res)=>{
    const { name, email, password } = req.body;
    try {
        // Checking in the user is existing user 
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({
                mesage: " User already exist" 
            })
        };

        const hashedPasword = await bcrypt.hash(password,10);

        // create a new user 
        const newUser = new User({
            name,
            email, 
            password: hashedPasword
        })
        await newUser.save()

        res.status(200).json({
            message: "Sucesfully created the User"
        })
    } catch(error){
        res.status(500).json({
            error: 'Server Error. Unable to register ....'
        })
    }
})

// Login Router 
authrouter.post('/login', async(req,res)=> {
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({error: "No user find"})
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {return res.status(400).json({ error: 'Invalid password' });
}
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
        'Your secrete key',
    {expiresIn: '24hr'})

    res.json({
        message: " Sucesfully login",
        token: token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
    }catch (error){
        console.log(" Failed to login maybe different username and password")
    }
})


export default authrouter;