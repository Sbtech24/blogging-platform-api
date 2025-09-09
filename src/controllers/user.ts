import { Request,Response,NextFunction } from "express";
import { Appsource } from "../config/data-source";
import { User } from "../model/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({path:"src/config/.env"})

const userRepository = Appsource.getRepository(User)
const JWT_SECRET  = process.env.JWT_SECRET 
console.log(JWT_SECRET)

export const registerUser =async (req:Request,res:Response,next:NextFunction)=>{

    const {username,email,password} = req.body

    try{
        const existing =  await userRepository.findOne({where:{email}})
        if(existing) return res.json({message:"Email is already in use"}).status(400)
    
        const hashedPassword = await bcrypt.hash(password,10)

        const user = userRepository.create({username,email,password:hashedPassword})
        await userRepository.save(user)

        res.status(201).json({
            id:user.id,
            name:user.username,
            email:user.email

        })
    }catch(err){
        console.log(err)
         res.status(500).json({ message: "Server error" });
         next()

    }

}


export const login = async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password} = req.body

    try{
         const user = await userRepository.findOne({where:{email}})
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password,user.password)
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });


    if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
        return res.status(500).json({ message: "JWT secret is not configured properly" });
    }

    const token = jwt.sign(
        {id:user.id,email:user.email}, JWT_SECRET, {expiresIn:"1h"}
    );

    res.json({token})

    }catch(err){
         res.status(500).json({ message: "Server error" });

    }

}



