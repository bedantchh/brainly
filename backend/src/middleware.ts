import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
const Secret = process.env.JWT_SECRET as string;

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const userMIddleWare = (req:Request,res:Response, next:NextFunction)=>{
    const headers = req.headers["authorization"];
    const decoded = jwt.verify(headers as string, Secret) as { id: string };
    if(decoded){
        req.userId = decoded.id;
        next()
    }else{
        res.status(403).json({
            "message": "Invalid credentials"
        })
    }
}