import express from 'express';
import path from 'path';
import routes from './routes/routes';

const app = express();

const PORT = +(process.env.PORT || 8080);
const hostname = '127.0.0.1';


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use('/', routes)

app.listen(PORT, hostname, ()=>{
    console.log(`listening on server http://${hostname}:${PORT}`);
})