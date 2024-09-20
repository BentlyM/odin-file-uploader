import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Home
export const GET_home = async (req: Request, res: Response) => {
  const currentUser = req.user as { id: number }; // Ensure the user type is correctly defined

  if (!currentUser) {
    return res.redirect('/login');
  }

  try {
    const uploadedFiles = await prisma.file.findMany({
      where: {
        userId: currentUser.id,
        folderId: null,
      },
    });

    const folders = await prisma.folder.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    res.render('home', {
      user: req.user,
      uploadedFiles,
      folders,
    });
  } catch (error) {
    console.error('Error fetching data for home:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
};
