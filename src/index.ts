import express from 'express';
import path from 'path';
import router from './routes/routes';
import session from 'express-session';
import passport from 'passport';
import loggerMiddleware from './middleware/logger';

const app = express();

const PORT = +(process.env.PORT || 8080);
const hostname = '127.0.0.1';

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
app.use(loggerMiddleware);

app.use('/', router)

app.listen(PORT, hostname, ()=>{
    console.log(`listening on server http://${hostname}:${PORT}`);
})