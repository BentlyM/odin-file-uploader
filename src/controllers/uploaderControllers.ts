import {Request, Response } from 'express';
import { supabase } from '../supabase';

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
  const file = req.file;

  if (!file) {
    return res.status(400).json({ msg: "Please upload files" });
  }

  const { originalname, buffer } = file;

  const { data, error } = await supabase.storage
    .from('documentation')
    .upload(originalname, buffer);

  if (error) {
    return res.status(500).json({ msg: "Upload failed", error: error.message });
  }

  return res.status(200).json({ msg: "File uploaded successfully", data });
};