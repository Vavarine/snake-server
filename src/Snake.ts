import { GameSize } from "./Game";

export type Dir = "up" | "down" | "left" | "right";

export class Snake {
  id: string;
  x: number;
  y: number;
  dir: Dir;
  body: { x: number; y: number }[];

  constructor(x: number, y: number, id: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = "right";
    this.body = [
      { x: this.x, y: this.y },
      { x: this.x - 1, y: this.y },
      { x: this.x - 2, y: this.y },
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

    this.body.unshift({ x: this.x, y: this.y });
    this.body.pop();
  }

  changeDir(dir: Dir) {
    this.dir = dir;
  }

  grow() {
    this.body.push({ x: this.x, y: this.y });
  }

  getState() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      dir: this.dir,
      body: this.body,
    };
  }
}
