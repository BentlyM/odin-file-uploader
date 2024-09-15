import { Request, Response } from "express";

export const GET_home  = (req: Request, res: Response) => {
    res.render('home'); 
}