import { Router } from 'express';
import connection from '../db.js'; 

const router = Router();


router.get('/productos/create', (req, res) => {
    res.render('productos/create', { values: {} });
});

// Ruta para guardar el nuevo producto
router.post('/productos/store', (req, res) => {
    const { name, price, category, description } = req.body;
    const query = 'INSERT INTO products (name, price, category, description) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, price, category, description], (err) => {
        if (err) {
            console.error('Error al guardar el producto:', err);
            return res.render('productos/create', { values: req.body, errors: [err] });
        }
        res.redirect('/productos');
    });
});


router.get('/productos', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error en la consulta de la base de datos:', err);
            return res.send('Error en la consulta de la base de datos');
        }
        res.render('productos/index', { productos: results });
    });
});


router.get('/productos/:id/edit', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta de la base de datos:', err);
            return res.send('Error en la consulta de la base de datos');
        }
        res.render('productos/edit', { producto: results[0], values: {} });
    });
});


router.put('/productos/update', (req, res) => {
    const { id, name, price, category, description } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, category = ?, description = ? WHERE id = ?';
    connection.query(query, [name, price, category, description, id], (err) => {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            return res.render('productos/edit', { producto: req.body, errors: [err] });
        }
        res.redirect('/productos');
    });
});


router.delete('/productos/:id/delete', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error al borrar el producto:', err);
            return res.send('Error al borrar el producto');
        }
        res.redirect('/productos');
    });
});

export default router;
