import express from 'express'
import multer from 'multer'
import {GET_Folder, GET_upload, POST_addFolder, POST_upload } from '../controllers/uploaderControllers';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/upload', upload.single('file') , POST_upload);
router.get('/files/:uniqueName', GET_upload);


router.post('/addfolder', POST_addFolder);
router.get('/folders/:name/:id', GET_Folder);

export default router;