import { Router } from 'express';
import connection from '../db.js'; 
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    console.log('Intento de inicio de sesión:', req.body.email);
    connection.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], async (error, results) => {
        if (error) {
            console.error('Error en la consulta de la base de datos:', error);
            return res.send('Error al conectar con la base de datos');
        }

        if (results.length === 0) {
            console.log('Correo no encontrado');
            return res.send('Correo y/o contraseña incorrecto');
        }

        const compare = await bcrypt.compare(req.body.password, results[0].password);

        if (!compare) {
            console.log('Contraseña incorrecta');
            return res.send('Correo y/o contraseña incorrecto');
        } else {
            req.session.user_id = results[0].id;
            req.session.user_email = results[0].email;
            console.log('Inicio de sesión exitoso');
            return res.redirect('/productos'); 
        }
    });
});


router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('Sesión cerrada');
        res.redirect('/');
    });
});

export default router;
