const { Router } = require("express");
const DBConnection = require("../../config/db-connection");
const authenticationMiddleware = require("../middlewares/authentication.middleware");

const router = Router();

router.get("/", authenticationMiddleware, (req, res) => {
  const userId = req.user.userId;
  DBConnection.db.query(
    "SELECT * FROM User WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json(results[0]);
    }
  );
});

router.post("/", (req, res) => {
  const { name, email, password, phone, birthdate } = req.body;
  if (password) {
  }
  DBConnection.db.query(
    "INSERT INTO User (name, email, phone, birthdate, password) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, birthdate, password],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res
        .status(201)
        .json({ message: `Usuário criado com ID: ${result.insertId}` });
    }
  );
});

router.put("/", authenticationMiddleware, (req, res) => {
  const userId = req.user.userId;
  const { name, email, phone, password } = req.body;
  DBConnection.db.query(
    "UPDATE User SET name = ?, email = ?, phone = ? WHERE userId = ?",
    [name, email, phone, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrada" });
      }
      if (password) {
        DBConnection.db.query(
          "UPDATE User SET password = ? WHERE userId = ?",
          [password, userId],
          (err, result) => {
            return res.json({ message: "Usuário atualizado com sucesso" });
          }
        );
      } else {
        return res.json({ message: "Usuário atualizado com sucesso" });
      }
    }
  );
});

router.delete("/", authenticationMiddleware, (req, res) => {
  const userId = req.user.userId;
  DBConnection.db.query(
    "DELETE FROM User WHERE userId = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrada" });
      }
      return res.json({ message: "Usuário deletado com sucesso" });
    }
  );
});

module.exports = router;
