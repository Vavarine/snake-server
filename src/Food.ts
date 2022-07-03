import { Position } from "./types";

export class Food {
  x: number;
  y: number;

  constructor(pos: Position) {
    this.x = pos.x;
    this.y = pos.y;
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
