import { Request, Response } from "express";

// home
export const GET_home  = (req: Request, res: Response) => {
    res.render('home'); 
}


// register
export const GET_register = (req: Request, res: Response) => {
    const error = undefined;
    res.render('register', {error});
}



// login
export const GET_login = (req: Request, res: Response) => {
    const error = undefined;
    res.render('login', {error});
}