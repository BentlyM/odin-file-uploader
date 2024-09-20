import { Request, Response } from 'express';
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST_upload = async (req: Request, res: Response) => {
  try {
    const currentFile = req.file;
    const currentUser = req.user as { id: number };
    const folderId: number = parseInt(req.body.folder);

    if (!currentFile) {
      return res.status(400).json({ msg: 'Please upload files' });
    }

    const { originalname, buffer } = currentFile;
    const filename = `${uuidv4()}_${originalname}`;

    const { data, error } = await supabase.storage
      .from('documentation')
      .upload(filename, buffer);

    const fileUrl = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/documentation/${filename}`;

    if (!error || currentFile.size / 1024 / 1024 < 2) {
      if (currentFile['fieldname'] === 'file') {
        const fileData: Prisma.FileCreateInput = {
          uniqueName: filename,
          name: currentFile.originalname,
          path: fileUrl,
          user: {
            connect: { id: currentUser.id },
          },
          size: currentFile.size,
          ...(folderId
            ? {
                folder: {
                  connect: {
                    id: folderId as number,
                  },
                },
              }
            : {}),
        };

        await prisma.file.create({
          data: fileData,
        });
      }
    }

    if (error) {
      return res
        .status(500)
        .json({ msg: 'Upload failed', error: error.message });
    }

    return res.redirect('/');
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

export const POST_addFolder = async (req: Request, res: Response) => {
  const currentUser = req.user as { id: number };

  const folder = await prisma.folder.create({
    data: {
      name: req.body.folderName as string,
      user: {
        connect: { id: currentUser.id },
      },
    },
  });

  res.redirect('/');
};

export const GET_upload = async (req: Request, res: Response) => {
  const file = await prisma.file.findUnique({
    where: {
      uniqueName: req.params.uniqueName,
    },
  });

  res.render('fileDetails', { file: file });
};

export const GET_Folder = async (req: Request, res: Response) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: parseInt(req.params.id),
      name: (req.params.name) as string,
    },
    include: {files: true}
  });

  res.render('folderDetails', { folder: folder });
};
