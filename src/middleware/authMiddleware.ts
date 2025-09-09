import {Response,Request,NextFunction} from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export interface AuthRequest extends Request {
  user?: any;
}

dotenv.config({path:"src/config/.env"})


export const authMiddleware = async (req:AuthRequest,res:Response,next:NextFunction)=>{
    const AuthHeader = req.headers["authorization"]
    const token = AuthHeader && AuthHeader.split(" ")[1]

    if (!token) return res.status(401).json({ message: "No token provided" });

    try{
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not configured" });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();

    }catch(err){
        console.log(err)
        return res.status(403).json({ message: "Invalid token" });
    }


}
