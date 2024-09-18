import express from 'express';
import {
  GET_login,
  GET_register,
  logout,
  POST_register,
} from '../controllers/authControllers';
import '../strategies/local-strategy';
import passport from 'passport';

const router = express.Router();

//login
router.get('/login', GET_login);
router.post('/login', (req, res, next) => {
  console.log('Login route hit');
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      console.log('Login successful');
      return res.redirect('/');
    });
  })(req, res, next);
});

//register
router.get('/register', GET_register);
router.post('/register', POST_register);

router.post('/logout', logout);

export default router;
