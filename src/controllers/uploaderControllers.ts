import { Request, Response } from 'express';
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const POST_upload = async (req: Request, res: Response) => {
  try {
    const currentFile = req.file;
    const currentUser = req.user as {id : number};

    if (!currentFile) {
      return res.status(400).json({ msg: 'Please upload files' });
    }

    const { originalname, buffer } = currentFile;
    const filename = `${uuidv4()}_${originalname}`;

    const { data, error } = await supabase.storage
      .from('documentation')
      .upload(filename, buffer);

    const fileUrl = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/documentation/${filename}`;

    if(currentFile['fieldname'] == 'file'){
      await prisma.file.create({
        data: {
          uniqueName: filename,
          name: currentFile.originalname,
          path: fileUrl,
          user: {
            connect: {id : currentUser.id}
          },
          size: currentFile.size 
        }
      })
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
  res.json({msg: 'not completed yet...'});
}