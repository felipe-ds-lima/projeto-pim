const express = require("express");
const cors = require("cors");
const DBConnection = require("./config/db-connection");
const userRouter = require("./src/routes/user.router");
const sessionRouter = require("./src/routes/session.router");
const notesRouter = require("./src/routes/notes.router");
const tasksRouter = require("./src/routes/tasks.router");
const scheduleRouter = require("./src/routes/schedule.router");
const timelinesRouter = require("./src/routes/timelines.router");
const pointRouter = require("./src/routes/point.router");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
new DBConnection();

app.use(express.static("public"));

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/notes", notesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/timelines", timelinesRouter);
app.use("/api/points", pointRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
