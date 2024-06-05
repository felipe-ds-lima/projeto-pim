const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const authenticationMiddleware = require('../middlewares/authentication.middleware')

const router = Router()

router.get('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    DBConnection.db.query('SELECT * FROM note WHERE userId = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
       return res.json(results);
    });
});


router.get('/:noteId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { noteId } = req.params;
    DBConnection.db.query('SELECT * FROM note WHERE noteId = ? AND userId = ?', [noteId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json({message: 'Nota não encontrada'});
        }
        return res.json(result[0]);
    });
});

router.post('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { title, content } = req.body;
    DBConnection.db.query('INSERT INTO note (title, content, userId) VALUES (?, ?, ?)', [title, content, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(201).json({message: `Nota criada com ID: ${result.insertId}`});
    });
});

router.put('/:noteId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { noteId } = req.params;
    const { title, content } = req.body;
    DBConnection.db.query('UPDATE note SET title = ?, content = ? WHERE noteId = ? AND userId = ?', [title, content, noteId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Nota não encontrada'});
        }
        return res.json({messsage: 'Nota atualizada com sucesso'});
    });
});

router.delete('/:noteId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { noteId } = req.params;
    DBConnection.db.query('DELETE FROM note WHERE noteId = ? AND userId = ?', [noteId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Nota não encontrada'});
        }
        return res.json({message: 'Nota deletada com sucesso'});
    });
});

module.exports = router
