import express from 'express';
import mysql from 'mysql';

const router = express.Router();

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Manejo de la conexión
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        throw error; // O maneja el error de manera más adecuada según tu aplicación
    }
    console.log('Connected to MySQL database');
});

// Funciones CRUD
const index = (req, res) => {
    connection.query('SELECT * FROM categorias', (error, results) => {
        if (error) {
            console.error('Error retrieving categories:', error);
            res.sendStatus(500); // Error interno del servidor
            return;
        }
        res.send(results);
    });
};

const show = (req, res) => {
    connection.query('SELECT * FROM categorias WHERE id = ?', [req.params.id], (error, results) => {
        if (error) {
            console.error('Error retrieving category:', error);
            res.sendStatus(500); // Error interno del servidor
            return;
        }

        if (results.length > 0) {
            res.send(results[0]); // Devuelve solo el primer resultado
        } else {
            res.sendStatus(404); // No encontrado
        }
    });
};

const store = (req, res) => {
    const { nombre } = req.body;
    connection.query('INSERT INTO categorias SET ?', { nombre }, (error, results) => {
        if (error) {
            console.error('Error creating category:', error);
            res.sendStatus(500); // Error interno del servidor
            return;
        }

        res.send({ id: results.insertId, nombre });
    });
};

const update = (req, res) => {
    const { nombre } = req.body;
    connection.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, req.params.id], (error, results) => {
        if (error) {
            console.error('Error updating category:', error);
            res.sendStatus(500); // Error interno del servidor
            return;
        }

        res.send({ id: req.params.id, nombre });
    });
};

const destroy = (req, res) => {
    connection.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (error, results) => {
        if (error) {
            console.error('Error deleting category:', error);
            res.sendStatus(500); // Error interno del servidor
            return;
        }

        res.send(results);
    });
};

// Rutas CRUD
router.get('/', index);
router.get('/:id', show);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;
