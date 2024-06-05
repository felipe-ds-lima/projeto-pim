const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const authenticationMiddleware = require('../middlewares/authentication.middleware')

const router = Router()

router.post('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { title, checked } = req.body;
    const sql = 'INSERT INTO Task (title, checked, userId) VALUES (?, ?, ?)';
    DBConnection.db.query(sql, [title, checked, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(201).json({ taskId: result.insertId, title, checked });
    });
});

router.get('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const sql = 'SELECT * FROM Task WHERE userId = ?';
    DBConnection.db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(results);
    });
});

router.put('/:taskId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { taskId } = req.params;
    const { title, checked } = req.body;
    const sql = 'UPDATE Task SET title = ?, checked = ? WHERE taskId = ? AND userId = ?';
    DBConnection.db.query(sql, [title, checked, taskId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        return res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
    });
});

router.delete('/:taskId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { taskId } = req.params;
    const sql = 'DELETE FROM Task WHERE taskId = ? AND userId = ?';
    DBConnection.db.query(sql, [taskId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        return res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    });
});

module.exports = router