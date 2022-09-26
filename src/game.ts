import Initializer, { SnakeDirection } from "./GameInitializer";

//Elements
const snakeBoard = document.querySelector(".game")! as HTMLDivElement;
const scoreBoard = document.querySelector(
  ".game-score span"
)! as HTMLDivElement;
const failBoard = document.querySelector(".game-fail")! as HTMLDivElement;
const snake = document.getElementById("snake")! as HTMLDivElement;
const apple = document.getElementById("apple")! as HTMLDivElement;
//Elements

//Controllers
const startBtn = document.getElementById("start-game")! as HTMLButtonElement;
const stopBtn = document.getElementById("stop-game")! as HTMLButtonElement;
//Controllers

const game = new Initializer(snake, apple, {
  snakeBoard: snakeBoard,
  scoreBoard: scoreBoard,
  failBoard: failBoard,
});

startBtn.addEventListener("click", game.start.bind(game));
stopBtn.addEventListener("click", game.stop.bind(game));
