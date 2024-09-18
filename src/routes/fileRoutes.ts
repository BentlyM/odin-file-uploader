import express from 'express'
import multer from 'multer'
import { POST_home } from '../controllers/uploaderControllers';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/', upload.single('file') ,  POST_home);

export default router;