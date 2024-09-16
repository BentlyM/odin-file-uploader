import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// home
export const GET_home = (req: Request, res: Response) => {
  if (!req.user) return res.redirect('/login');

  res.render('home', {
    user: req.user,
    uploadedFiles: [
      { filename: 'placeholder' },
      { filename: 'placeholder' },
      { filename: 'placeholder' },
    ],
  });
};

// register
export const GET_register = (req: Request, res: Response) => {
  const error = req.query.errors;
  res.render('register', { error });
};

export const POST_register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type User = { email: string; username: string; password: string };
    const { email, username, password }: User = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser)
      return res.redirect(
        `/register?errors=${encodeURIComponent('Username already exists')}`
      );

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error('Error logging in after registration:', err);
        return next(err);
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      req.logIn(newUser, (err) => {
        if (err) throw new Error(`Something went wrong ${err}`);
        res.redirect('/');
      });
    });
  } catch (e) {
    console.error('Error during registration:', e);
    res.redirect(
      `/register?errors=${encodeURIComponent('Something went wrong')}`
    );
  }
};

// login
export const GET_login = (req: Request, res: Response) => {
  const error = req.query.errors;
  res.render('login', { error });
};


//logout

export const logout = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect('/login');
  });
};