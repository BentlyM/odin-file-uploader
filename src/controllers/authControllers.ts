import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to handle errors and redirect
const redirectWithError = (res: Response, message: string, path: string) => {
  res.redirect(`${path}?errors=${encodeURIComponent(message)}`);
};

// Register GET
export const GET_register = (req: Request, res: Response) => {
  if (req.user) return res.redirect('/');
  const error = req.query.errors;
  res.render('register', { error });
};

// Register POST
export const POST_register = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user) return res.redirect('/');

  const { email, username, password }: { email: string; username: string; password: string } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [{ email }, { username }]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return redirectWithError(res, 'Email already exists', '/register');
      }
      if (existingUser.username === username) {
        return redirectWithError(res, 'Username already exists', '/register');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    req.logIn(newUser, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return redirectWithError(res, 'Something went wrong', '/register');
  }
};

// Login GET
export const GET_login = (req: Request, res: Response) => {
  if (req.user) return res.redirect('/');
  const error = req.query.errors;
  res.render('login', { error });
};

// Logout
export const logout = (request: Request, response: Response, next: NextFunction) => {
  request.logout((err) => {
    if (err) return next(err);
    response.redirect('/login');
  });
};
