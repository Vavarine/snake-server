import { Server } from "socket.io";
import http from "http";
import { logInfo } from "./utils/log";

import { Game } from "./Game";

const GAME_COLS = 30;
const GAME_ROWS = 50;

export const socket = (server: http.Server) => {
  const game = new Game(GAME_COLS, GAME_ROWS);
  const io = new Server(server);

  io.on("connection", (socket) => {
    logInfo("socket", `${socket.id} connected`);

    socket.on("join", (data) => {
      const alreadyJoined = game.snakes.find((s) => s.id === socket.id);

      if (alreadyJoined || !data?.nickname || !data?.color) return;

      const { nickname, color } = data;

      game.addSnake(socket.id, nickname, color);

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

  game.onGameOver = (id) => {
    io.to(id).emit("gameOver", { id });
  };

  game.onUpdate = () => {
    io.emit("update", game.getState());
  };

  return io;
};
