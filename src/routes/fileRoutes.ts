import express from 'express'
import multer from 'multer'
import {POST_addFolder, POST_upload } from '../controllers/uploaderControllers';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/upload', upload.single('file') , POST_upload);
router.post('/addfolder', POST_addFolder);

export default router;