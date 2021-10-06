import { createApp } from "https://cdn.skypack.dev/petite-vue";

type Rover = [number, number, Direction, number];

type Fireball = [number, number];

enum Direction {
  north = "N",
  east = "E",
  south = "S",
  west = "W",
}

interface AppData {
  rover: Rover;
  fireballs: Fireball[];
  directions: Direction[];
  max: number;
  gameOver: boolean;
}

const roverStart: Rover = [0, 0, Direction.north, 1];

createApp({
  rover: [...roverStart],
  fireballs: [],
  directions: [
    Direction.north,
    Direction.east,
    Direction.south,
    Direction.west,
  ],
  max: 7,
  gameOver: false,

  get roverStyle() {
    const { rover, directions } = <AppData>this;
    const [x, y, d, health] = rover;
    const translateX = `translateX(${x * 100}%)`;
    const translateY = `translateY(${y * 100 * -1}%)`;
    const rotate = `rotate(${directions.findIndex((x) => x === d) * 90}deg)`;
    const scale = `scale(${health})`;
    return `transform: ${translateX} ${translateY} ${rotate} ${scale};`;
  },

  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
    this.randomizeItems();
  },

  unmounted() {
    window.removeEventListener("keyup", this.handleKeyup);
  },

  handleKeyup(e) {
    const { rover } = <AppData>this;
    const direction = rover[2];
    const dirMap = {
      N: ["w", "ArrowUp"].includes(e.key),
      E: ["d", "ArrowRight"].includes(e.key),
      S: ["s", "ArrowDown"].includes(e.key),
      W: ["a", "ArrowLeft"].includes(e.key),
    };

    const entries = Object.entries(dirMap);
    console.log(entries);

    if (Object.entries(dirMap).some((x) => direction === x[0] && x[1])) {
      return this.move();
    }

    return this.rotate(null, Object.entries(dirMap).find((x) => x[1])[0]);
  },

  move() {
    const { rover, fireballs, max, gameOver } = <AppData>this;
    if (gameOver) return;
    let [x, y, d, h] = rover;
    if (d === "N") y++;
    if (d === "E") x++;
    if (d === "S") y--;
    if (d === "W") x--;
    x = Math.max(0, Math.min(x, max - 1));
    y = Math.max(0, Math.min(y, max - 1));
    this.rover = [x, y, d, h];

    const hit = fireballs.find(([fx, fy]) => fx === x && fy === y);
    if (hit) this.damage();
  },

  rotate(direction, newDirection) {
    const { rover, directions, gameOver } = <AppData>this;
    if (gameOver) return;

    if (newDirection) {
      this.rover[2] = newDirection;
      return;
    }

    let dir = rover[2];
    const currentIndex = directions.findIndex((d) => d === dir);
    const len = directions.length;
    this.rover[2] =
      direction === "L"
        ? directions[(currentIndex + len - 1) % len]
        : directions[(currentIndex + 1) % len];
  },

  damage() {
    const { rover } = <AppData>this;
    let health = rover[3];
    health -= 0.25;
    this.rover[3] = health;
    if (health <= 0) {
      this.gameOver = true;
      return;
    }
    this.randomizeItems();
  },

  restart() {
    this.rover = [...roverStart];
    this.fireballs = [];
    this.randomizeItems();
    this.gameOver = false;
  },

  fireballStyle(i) {
    const { fireballs } = <AppData>this;
    if (!fireballs[i]) return;
    const [x, y] = fireballs[i];
    const translateX = `${x * 100}%`;
    const translateY = `${y * 100 * -1}%`;
    return `transform: translateX(${translateX}) translateY(${translateY});`;
  },

  randomizeItems() {
    this.fireballs = Array.from(
      { length: this.randomNumber({ min: 1, max: 5 }) },
      () => [
        this.randomNumber({ min: 1, max: this.max - 1 }),
        this.randomNumber({ min: 1, max: this.max - 1 }),
      ]
    );
  },

  randomNumber({ min = 0, max = 10 } = {}) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
}).mount();
