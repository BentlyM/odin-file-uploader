import { Request, Response } from 'express';
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client'

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

export const POST_home = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const currentUser = req.user as {id : number};

    if (!file) {
      return res.status(400).json({ msg: 'Please upload files' });
    }

    const { originalname, buffer } = file;
    const filename = `${uuidv4()}_${originalname}`;

    const { data, error } = await supabase.storage
      .from('documentation')
      .upload(filename, buffer);

    const fileUrl = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/documentation/${filename}`;

    if(file['fieldname'] == 'file'){
      await prisma.file.create({
        data: {
          uniqueName: filename,
          name: file.originalname,
          path: fileUrl,
          userId: currentUser.id,
          size: file.size 
        }
      })
    }

    if (error) {
      return res
        .status(500)
        .json({ msg: 'Upload failed', error: error.message });
    }

    return res
      .status(200)
      .json({ msg: 'File uploaded successfully', uploaded_file: { data, fileUrl } });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
