import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// home
export const GET_home = async (req: Request, res: Response) => {
  const currentUser = req.user as {id : number};
    if (!currentUser) return res.redirect('/login');

    const uploadedFiles = await prisma.file.findMany({
      where: {
        userId: currentUser.id,
        folderId: null,
      }
    });

    const folders = await prisma.folder.findMany({
      where: {
        userId: currentUser.id,
      }
    })

    res.render('home', {
      user: req.user,
      uploadedFiles,
      folders: folders
    });
  };