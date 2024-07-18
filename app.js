import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import productoRoutes from './routes/productos.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const isLogin = (req, res, next) => {
    if (!req.session.user_id && req.url !== '/login' && req.url !== '/') {
        return res.redirect('/login');
    }
    next();
};

app.use(isLogin);

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/', authRoutes);
app.use('/', productoRoutes); 
app.use((req, res, next) => {
    res.status(404).send('No encontrado');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
