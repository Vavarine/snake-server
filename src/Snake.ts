import { GameSize } from "./Game";

export type Dir = "up" | "down" | "left" | "right";

export class Snake {
  id: string;
  x: number;
  y: number;
  dir: Dir;
  body: { x: number; y: number; dir: Dir; hasFood?: boolean }[];
  moved: boolean = false;
  color: string;
  nickname: string;

  constructor(x: number, y: number, id: string, color: string, nickname: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = "right";
    this.color = color;
    this.nickname = nickname;
    this.body = [
      { x: this.x, y: this.y, dir: this.dir },
      { x: this.x - 1, y: this.y, dir: this.dir },
      { x: this.x - 2, y: this.y, dir: this.dir },
      { x: this.x - 3, y: this.y, dir: this.dir },
      { x: this.x - 4, y: this.y, dir: this.dir },
    ];
  }

  move(size: GameSize) {
    const { height, width } = size;

    const map = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    this.x += map[this.dir].x;
    this.y += map[this.dir].y;

    if (this.x < 0) this.x = width - 1;
    if (this.y < 0) this.y = height - 1;
    if (this.x > width - 1) this.x = 0;
    if (this.y > height - 1) this.y = 0;

    this.body.unshift({ x: this.x, y: this.y, dir: this.dir });
    this.body.pop();
    this.body[this.body.length - 1].dir = this.body[this.body.length - 2].dir;
    this.moved = false;
  }

  changeDir(dir: Dir) {
    const isDirOpposite =
      (this.dir === "up" && dir === "down") ||
      (this.dir === "down" && dir === "up") ||
      (this.dir === "left" && dir === "right") ||
      (this.dir === "right" && dir === "left");

    if (this.moved || isDirOpposite) return;
    this.dir = dir;
    this.moved = true;
  }

  grow() {
    this.body[0].hasFood = true;
    this.body.push({ x: this.x, y: this.y, dir: this.dir });
  }

  getState() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      dir: this.dir,
      body: this.body,
      color: this.color,
      nickname: this.nickname,
    };
  }
}
