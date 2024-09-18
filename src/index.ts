import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import loggerMiddleware from './middleware/logger';
import {default as authRouter} from './routes/authRoutes';
import {default as homeRouter} from './routes/homeRoutes';
import {default as fileRouter} from './routes/fileRoutes';

const app = express();

const PORT = +(process.env.PORT || 8080);
const hostname = '0.0.0.0';

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
app.use(loggerMiddleware);

app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/', fileRouter);

app.listen(PORT, hostname, ()=>{
    console.log(`listening on server http://${hostname}:${PORT}`);
})