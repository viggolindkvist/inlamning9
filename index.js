// CONNECTION TO DATABASE
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inlamning9",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database!");
});

// APPLICATION
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("Server listening on *:3000");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (data) => {
    console.log(data);
    socket.emit("receive message", data);

    const query = `SELECT output FROM bot_responses WHERE input = "${data}"`;
    con.query(query, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        console.log("Lyckades med att hämta data");
        socket.emit("receive message", results[0].output);
      } else {
        console.log("Misslyckades med att hämta data");
        socket.emit(
          "receive message",
          "Har tyvärr inget svar på det, försök med någon annan fråga."
        );
      }
    });
  });
});
