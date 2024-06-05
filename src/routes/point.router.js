const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const authenticationMiddleware = require('../middlewares/authentication.middleware')

const router = Router()

router.post('/:timelineId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { timelineId } = req.params;
    const { startDate, endDate, title, content, color } = req.body;
    const sql = 'INSERT INTO Point (startDate, endDate, title, content, color, timelineId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
    DBConnection.db.query(sql, [startDate, endDate, title, content, color, timelineId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(201).json({ pointId: result.insertId, startDate, endDate, title, timelineId, content, color, timelineId, userId });
    });
});

router.get('/:timelineId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { timelineId } = req.params;
    const sql = 'SELECT * FROM Point WHERE timelineId = ? AND userId = ?';
    DBConnection.db.query(sql, [timelineId, userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(results);
    });
});

router.put('/:pointId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { pointId } = req.params;
    const { startDate, endDate, title, content, color } = req.body;
    const sql = 'UPDATE Point SET startDate = ?, endDate = ?, title = ?, content = ?, color = ? WHERE pointId = ? AND userId = ?';
    DBConnection.db.query(sql, [startDate, endDate, title, content, color, pointId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ponto não encontrada' });
        }
        return res.status(200).json({ message: 'Ponto atualizada com sucesso' });
    });
});

router.delete('/:pointId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { pointId } = req.params;
    const sql = 'DELETE FROM Point WHERE pointId = ? AND userId = ?';
    DBConnection.db.query(sql, [pointId, userId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ponto não encontrada' });
        }
        return res.status(200).json({ message: 'Ponto deletada com sucesso' });
    });
});

module.exports = router