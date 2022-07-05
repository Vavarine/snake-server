import { Food } from "./Food";
import { Dir, Snake } from "./Snake";
import { logInfo } from "./utils/log";

export type GameSize = {
  width: number;
  height: number;
};

export class Game {
  snakes: Snake[] = [];
  foods: Food[] = [];

  size: GameSize;

  onUpdate: () => void;
  onGameOver: (socketId: string) => void;

  constructor(height: number, width: number) {
    this.size = { height, width };

    this.setup();

    setInterval(() => {
      this.update();
    }, 150);
  }

  setup() {
    const food = new Food(this.getFreePosition());
    this.foods.push(food);
  }

  update() {
    this.snakes.forEach((snake) => {
      snake.move(this.size);

      if (this.snakeCollided(snake) || this.snakeSelfCollided(snake)) {
        this.removeSnake(snake.id, true);
      }

      this.foods.forEach((food) => {
        if (this.foodGotEatenBySnake(food, snake)) {
          this.foods = this.foods.filter((f) => f !== food);

          snake.grow();

          if (this.snakes.length - this.foods.length <= 1 && this.foods.length !== 0) return;

          const newFood = new Food(this.getFreePosition());
          this.foods.push(newFood);
        }
      });
    });

    this.onUpdate?.();
  }

  foodGotEatenBySnake(food: Food, snake: Snake) {
    return food.x === snake.x && food.y === snake.y;
  }

  snakeSelfCollided(snake: Snake) {
    return snake.body.some((body, i) => {
      if (i === 0) return false;

      return snake.x === body.x && snake.y === body.y;
    });
  }

  snakeCollided(snake: Snake) {
    return this.snakes.some(
      (s) =>
        s !== snake &&
        s.body.some((body) => {
          return body.x === snake.x && body.y === snake.y;
        })
    );
  }

  addSnake(id: string, nickname: string, color: string) {
    const { x, y } = this.getFreePosition();
    const snake = new Snake(x, y, id, color, nickname);

    this.snakes.push(snake);

    if (this.snakes.length - this.foods.length > 1) {
      const food = new Food(this.getFreePosition());
      this.foods.push(food);
    }
  }

  changeSnakeDir(id: string, dir: Dir) {
    const snake = this.snakes.find((s) => s.id === id);
    snake?.changeDir(dir);
  }

  removeSnake(id: string, addFood?: boolean) {
    const snakeToRemove = this.snakes.find((s) => s.id === id);

    this.onGameOver?.(id);

    addFood &&
      snakeToRemove?.body.forEach((body, i) => {
        if (i === 0) return;
        const addFood = Math.random() < 0.4;

        if (addFood) {
          const food = new Food({ x: body.x, y: body.y });
          this.foods.push(food);
        }
      });

    this.snakes = this.snakes.filter((s) => s !== snakeToRemove);
  }

  getFreePosition(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    let isFree = false;

    while (!isFree) {
      x = Math.floor(Math.random() * this.size.width);
      y = Math.floor(Math.random() * this.size.height);

      isFree = this.snakes.every((snake) => {
        return snake.body.every((body) => {
          return body.x !== x || body.y !== y;
        });
      });
    }

    return { x, y };
  }

  getState() {
    const snakesStates = this.snakes.map((snake) => snake.getState());
    const foodsStates = this.foods.map((food) => food.getState());

    return {
      size: this.size,
      snakes: snakesStates,
      foods: foodsStates,
    };
  }
}
