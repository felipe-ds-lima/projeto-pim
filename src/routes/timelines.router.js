const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const authenticationMiddleware = require('../middlewares/authentication.middleware')

const router = Router()

router.post('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { title } = req.body;
    const sql = 'INSERT INTO Timeline (title, userId) VALUES (?, ?)';
    DBConnection.db.query(sql, [title, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(201).json({ timelineId: result.insertId, title, userId });
    });
});

router.get('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const sql = 'SELECT * FROM Timeline WHERE userId = ?';
    DBConnection.db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(results);
    });
});

router.get('/:timelineId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { timelineId } = req.params;
    const sql = 'SELECT * FROM Timeline WHERE timelineId = ? AND userId = ?';
    DBConnection.db.query(sql, [timelineId, userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(results[0]);
    });
});


router.put('/:timelineId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { timelineId } = req.params;
    const { title } = req.body;
    const sql = 'UPDATE Timeline SET title = ? WHERE timelineId = ? AND userId = ?';
    DBConnection.db.query(sql, [title, timelineId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Timeline não encontrada' });
        }
        return res.status(200).json({ message: 'Timeline atualizada com sucesso' });
    });
});

router.delete('/:timelineId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { timelineId } = req.params;
    const sql = 'DELETE FROM Timeline WHERE timelineId = ? AND userId = ?';
    DBConnection.db.query(sql, [timelineId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Timeline não encontrada' });
        }
        return res.status(200).json({ message: 'Timeline deletada com sucesso' });
    });
});

module.exports = router