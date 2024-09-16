import express from 'express';
import { GET_home, GET_login, GET_register } from '../controllers/uploaderControllers';
import passport from 'passport';
import '../strategies/local-strategy'


const router = express.Router();

//home
router.get('/', GET_home);

//login
router.get('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}) , GET_login);


//register
router.get('/register', GET_register);

export default router;