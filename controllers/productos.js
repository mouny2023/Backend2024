import { validationResult } from 'express-validator';
import connection from '../db.js';

const index = (req, res) => {
    connection.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            throw error;
        }
        res.render('productos/index', { productos: results });
    });
};

const show = (req, res) => {
    connection.query('SELECT * FROM productos WHERE id = ?', [req.params.nro], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.length > 0) {
            res.render('productos/show', { producto: results[0] });
        } else {
            res.send('No se encontró el producto');
        }
    });
};

const create = (req, res) => {
    res.render('productos/create', { values: {} });
};

const store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('productos/create', { values: req.body, errors: errors.array() });
    } else {
        const { name, price, category, description } = req.body;
        const newProduct = { name, price, category, description };
        connection.query('INSERT INTO productos SET ?', newProduct, (error) => {
            if (error) {
                throw error;
            }
            res.redirect('/productos');
        });
    }
};

const edit = (req, res) => {
    connection.query('SELECT * FROM productos WHERE id = ?', [req.params.nro], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.length > 0) {
            res.render('productos/edit', { values: {}, producto: results[0] });
        } else {
            res.send('No se encontró el producto');
        }
    });
};

const update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        connection.query('SELECT * FROM productos WHERE id = ?', [req.body.id], (error, results) => {
            if (error) {
                throw error;
            }
            res.render('productos/edit', { values: req.body, producto: results[0], errors: errors.array() });
        });
    } else {
        const { name, price, category, description, id } = req.body;
        const updatedProduct = { name, price, category, description };
        connection.query('UPDATE productos SET ? WHERE id = ?', [updatedProduct, id], (error) => {
            if (error) {
                throw error;
            }
            res.redirect('/productos');
        });
    }
};

const destroy = (req, res) => {
    connection.query('DELETE FROM productos WHERE id = ?', [req.params.nro], (error) => {
        if (error) {
            throw error;
        }
        res.redirect('/productos');
    });
};

export default { index, show, create, store, edit, update, destroy };
