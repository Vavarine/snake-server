import { Server } from "socket.io";
import http from "http";
import { logInfo } from "./utils/log";
import { Snake } from "./Snake";
import { Game } from "./Game";

export const socket = (server: http.Server) => {
  const game = new Game(30, 50);
  const io = new Server(server);

  io.on("connection", (socket) => {
    logInfo("socket", `${socket.id} connected`);

    socket.on("join", () => {
      game.addSnake(socket.id);

      socket.emit("joined", game.getState());
      io.emit("update", game.getState());
    });

    socket.on("changeDir", (data) => {
      if (!data.dir) return;

      game.changeSnakeDir(socket.id, data.dir);
      logInfo("game", `${socket.id} changed dir to ${data.dir}`);
    });

    socket.on("disconnect", () => {
      game.removeSnake(socket.id);

      io.emit("update", game.getState());

      logInfo("socket", `${socket.id} disconnected`);
    });
  });

  game.onUpdate = () => {
    io.emit("update", game.getState());
  };

  return io;
};
