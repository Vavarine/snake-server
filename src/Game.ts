import { Food } from "./Food";
import { Dir, Snake } from "./Snake";

export type GameSize = {
  width: number;
  height: number;
};

export class Game {
  snakes: Snake[] = [];
  foods: Food[] = [];

  size: GameSize;

  onUpdate: () => void;

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

      this.foods.forEach((food) => {
        if (this.foodGotEatenBySnake(food, snake)) {
          this.foods = this.foods.filter((f) => f !== food);

          console.log(this.foods.length, this.snakes.length);
          console.log(this.snakes.length - this.foods.length);

          if (this.snakes.length - this.foods.length <= 1 && this.snakes.length !== 1) return;

          const newFood = new Food(this.getFreePosition());
          this.foods.push(newFood);
          snake.grow();
        }

        if (this.snakeCollided(snake)) {
          this.removeSnake(snake.id);
        }
      });
    });

    this.onUpdate?.();
  }

  foodGotEatenBySnake(food: Food, snake: Snake) {
    return food.x === snake.x && food.y === snake.y;
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

  addSnake(id: string) {
    const { x, y } = this.getFreePosition();
    const snake = new Snake(x, y, id);

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

  removeSnake(id: string) {
    this.snakes = this.snakes.filter((snake) => snake.id !== id);
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
