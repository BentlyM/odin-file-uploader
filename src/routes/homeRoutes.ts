import express from 'express'
import { GET_home } from '../controllers/pagesControllers';
const router = express.Router();

//home
router.get('/', GET_home);


export default router;