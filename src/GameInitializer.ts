enum GameState {
  STOP,
  RUNNING,
}

export enum SnakeDirection {
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
}

type SnakeVelocity = number;

interface SnakeBound {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface SnakePosition {
  top: number;
  left: number;
}

interface SnakeGame {
  start: () => void;
  stop: () => void;
  gamePlay: () => void;
  lose: () => void;
  newTurn: () => void;
  isCatchIt: () => boolean;
  changeDirection: (direction: SnakeDirection) => void;
}

interface ApplePosition {
  top: number;
  left: number;
}

interface SnakeGameOptions {
  snakeBoard: HTMLElement;
  scoreBoard: HTMLElement;
  failBoard?: HTMLElement;
  initialSnakePosition?: SnakePosition;
  snakeJumps?: number;
  snakeVelocity?: SnakeVelocity;
  initialSnakeDirection?: SnakeDirection;
}

export default class Game implements SnakeGame {
  snake: HTMLElement;
  apple: HTMLElement;
  score_board: HTMLElement;
  snake_board: HTMLElement;
  fail_board: HTMLElement | null;
  apple_position: ApplePosition = { top: 0, left: 0 }; //After initialization, it changes.
  snake_position: SnakePosition = { top: 20, left: 20 }; //Start at center
  snake_move_unit = 10;
  snake_velocity: SnakeVelocity = 20; //Board square per second
  snake_bound: SnakeBound = { top: 0, right: 40, bottom: 40, left: 0 }; //Max x distance at 40 square from left ()
  snake_score = 0;
  game_time_unit = 1000; // 1 Second(s)
  game_state: GameState = GameState.STOP;
  game_player: ReturnType<typeof setInterval> | null = null;
  snake_direction: SnakeDirection = SnakeDirection.BOTTOM;

  constructor(s: HTMLElement, a: HTMLElement, options: SnakeGameOptions) {
    this.snake = s;
    this.apple = a;

    this.snake.style.position = "absolute";
    this.apple.style.position = "absolute";

    this.score_board = options["scoreBoard"];
    this.snake_board = options["snakeBoard"];

    this.snake_board.style.position = "relative";

    if (this.snake_board.style.width && this.snake_board.style.height) {
      const styles = document.defaultView?.getComputedStyle(this.snake_board);

      this.snake_bound.right = parseInt(styles?.width!) / this.snake_move_unit;
      this.snake_bound.bottom =
        parseInt(styles?.height!) / this.snake_move_unit;
    } else {
      this.snake_board.style.width =
        this.snake_bound.right * this.snake_move_unit + "px";
      this.snake_board.style.height =
        this.snake_bound.bottom * this.snake_move_unit + "px";
    }

    if (options.initialSnakePosition) {
      this.snake_position = options.initialSnakePosition;
    }
    if (options.initialSnakeDirection) {
      this.snake_direction = options.initialSnakeDirection;
    }
    if (options.snakeJumps) {
      this.snake_move_unit = options.snakeJumps;
    }
    if (options.snakeVelocity && options.snakeVelocity < this.game_time_unit) {
      this.snake_velocity = options.snakeVelocity;
    }
    if (options.failBoard) {
      this.fail_board = options.failBoard;
    } else {
      this.fail_board = null;
    }

    this.snake.style["left"] =
      this.snake_position.left * this.snake_move_unit + "px";
    this.snake.style["top"] =
      this.snake_position.top * this.snake_move_unit + "px";
    this.apple_position = this.randomApplePos();
  }

  lose() {
    clearInterval(this.game_player!);
    this.game_player = null;

    if (this.fail_board) {
      this.fail_board.style.display = "unset";
      this.fail_board.textContent = "You Lost 😢";
    } else {
      alert("You Lost 😢");
    }
  }

  randomApplePos(): ApplePosition {
    const pos = {
      top:
        Math.floor(Math.random() * this.snake_bound.bottom) *
        (this.snake_move_unit - 1),
      left:
        Math.floor(Math.random() * this.snake_bound.right) *
        (this.snake_move_unit - 1),
    };

    pos.top = pos.top - (pos.top % 10);
    pos.left = pos.left - (pos.left % 10);

    this.apple.style.top = pos.top + "px";
    this.apple.style.left = pos.left + "px";

    pos.top = pos.top / 10;
    pos.left = pos.left / 10;

    this.apple_position.top = pos.top;
    this.apple_position.left = pos.left;

    return pos;
  }

  newTurn() {
    this.randomApplePos();

    this.snake_score += 1;
    this.score_board.innerHTML = this.snake_score.toString();
  }

  changeDirection(direction: SnakeDirection) {
    this.snake_direction = direction;
  }

  isCatchIt() {
    return (
      this.snake_position.top === this.apple_position.top &&
      this.snake_position.left === this.apple_position.left
    );
  }

  gamePlay() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp": {
          if (
            this.snake_direction === SnakeDirection.RIGHT ||
            this.snake_direction === SnakeDirection.LEFT
          ) {
            return this.changeDirection(SnakeDirection.TOP);
          }
          return;
        }
        case "ArrowDown": {
          if (
            this.snake_direction === SnakeDirection.RIGHT ||
            this.snake_direction === SnakeDirection.LEFT
          ) {
            return this.changeDirection(SnakeDirection.BOTTOM);
          }
          return;
        }
        case "ArrowLeft": {
          if (
            this.snake_direction === SnakeDirection.TOP ||
            this.snake_direction === SnakeDirection.BOTTOM
          ) {
            return this.changeDirection(SnakeDirection.LEFT);
          }
          return;
        }
        case "ArrowRight": {
          if (
            this.snake_direction === SnakeDirection.TOP ||
            this.snake_direction === SnakeDirection.BOTTOM
          ) {
            return this.changeDirection(SnakeDirection.RIGHT);
          }
          return;
        }
      }
    });

    switch (this.snake_direction) {
      case SnakeDirection.BOTTOM: {
        if (this.snake_position.top >= this.snake_bound.bottom - 1) {
          return this.lose();
        }

        if (this.isCatchIt()) {
          this.newTurn();
        }

        this.snake_position.top += 1;

        this.snake.style["top"] =
          this.snake_position.top * this.snake_move_unit + "px";

        return;
      }
      case SnakeDirection.TOP: {
        if (this.snake_position.top <= this.snake_bound.top) {
          return this.lose();
        }

        if (this.isCatchIt()) {
          this.newTurn();
        }

        this.snake_position.top -= 1;

        this.snake.style["top"] =
          this.snake_position.top * this.snake_move_unit + "px";

        return;
      }
      case SnakeDirection.LEFT: {
        if (this.snake_position.left <= this.snake_bound.left) {
          return this.lose();
        }

        if (this.isCatchIt()) {
          this.newTurn();
        }

        this.snake_position.left -= 1;

        this.snake.style["left"] =
          this.snake_position.left * this.snake_move_unit + "px";

        return;
      }
      case SnakeDirection.RIGHT: {
        if (this.snake_position.left >= this.snake_bound.right - 1) {
          return this.lose();
        }

        if (this.isCatchIt()) {
          this.newTurn();
        }

        this.snake_position.left += 1;

        this.snake.style["left"] =
          this.snake_position.left * this.snake_move_unit + "px";

        return;
      }
    }
  }

  start() {
    if (this.game_state === GameState.STOP) {
      setTimeout(() => {
        this.game_state = GameState.RUNNING;

        this.game_player = setInterval(
          this.gamePlay.bind(this),
          this.game_time_unit / this.snake_velocity
        );
      }, 500);
    } else {
      this.snake_position = { top: 20, left: 20 };

      this.snake_score = 0;
      this.score_board.innerHTML = this.snake_score.toString();

      this.snake.style.left =
        this.snake_position.left * this.snake_move_unit + "px";
      this.snake.style.top =
        this.snake_position.top * this.snake_move_unit + "px";

      if (this.fail_board) {
        this.fail_board.style.display = "none";
      }
      this.game_state = GameState.STOP;
    }
  }

  stop() {
    clearInterval(this.game_player!);
    this.game_state = GameState.STOP;
  }
}
