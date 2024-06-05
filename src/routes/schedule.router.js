const { Router } = require("express");
const DBConnection = require('../../config/db-connection')
const authenticationMiddleware = require('../middlewares/authentication.middleware')

const router = Router()

router.get('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    DBConnection.db.query('SELECT * FROM ScheduleEvent WHERE userId = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(results);
        }
    });
});

router.get('/:eventId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const eventId = req.params.eventId;
    DBConnection.db.query('SELECT * FROM ScheduleEvent WHERE eventId = ? AND userId = ?', [eventId, userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        } else {
            return res.json(results[0]);
        }
    });
});

router.post('/', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const { title, startDate, endDate, color, sendNotification, repeatAt } = req.body;
    DBConnection.db.query(
        'INSERT INTO ScheduleEvent (title, startDate, endDate, color, sendNotification, repeatAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, startDate, endDate, color, sendNotification, repeatAt, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                return res.status(201).json({ message: 'Evento criado com sucesso', eventId: results.insertId });
            }
        }
    );
});

router.put('/:eventId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const eventId = req.params.eventId;
    const { title, startDate, endDate, color, sendNotification, repeatAt } = req.body;
    DBConnection.db.query(
        'UPDATE ScheduleEvent SET title = ?, startDate = ?, endDate = ?, color = ?, sendNotification = ?, repeatAt = ? WHERE eventId = ? AND userId = ?',
        [title, startDate, endDate, color, sendNotification, repeatAt, eventId, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Evento não encontrado' });
            } else {
                return res.json({ message: 'Evento atualizado com sucesso' });
            }
        }
    );
});

router.delete('/:eventId', authenticationMiddleware, (req, res) => {
    const userId = req.user.userId
    const eventId = req.params.eventId;
    DBConnection.db.query('DELETE FROM ScheduleEvent WHERE eventId = ? AND userId = ?', [eventId, userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        } else {
            return res.json({ message: 'Evento deletado com sucesso' });
        }
    });
});

module.exports = router