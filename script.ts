import { createApp } from "https://cdn.skypack.dev/petite-vue";

type Rover = [number, number, Direction];

enum Direction {
  north = "N",
  east = "E",
  south = "S",
  west = "W",
}

interface AppData {
  rover: Rover;
  directions: Direction[];
  max: number;
}

createApp({
  rover: [0, 0, "N"],
  directions: ["N", "E", "S", "W"],
  max: 7,

  get roverStyle() {
    const { rover, directions } = <AppData>this;
    const [x, y, d] = rover;
    const translateX = `${x * 100}%`;
    const translateY = `${y * 100 * -1}%`;
    const rotate = `${directions.findIndex((x) => x === d) * 90}deg`;
    return `transform: translateX(${translateX}) translateY(${translateY}) rotate(${rotate});`;
  },

  mounted($el) {
    window.addEventListener("keyup", this.handleKeyup, { passive: true });
  },

  unmounted($el) {
    window.removeEventListener("keyup", this.handleKeyup, { passive: true });
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

    if (Object.entries(dirMap).some((x) => direction === x[0] && x[1])) {
      return this.move();
    }

    return this.rotate(null, Object.entries(dirMap).find((x) => x[1])[0]);
  },

  move() {
    const { rover, max } = <AppData>this;
    let [x, y, d] = rover;
    if (d === "N") y++;
    if (d === "E") x++;
    if (d === "S") y--;
    if (d === "W") x--;
    x = Math.max(0, Math.min(x, max - 1));
    y = Math.max(0, Math.min(y, max - 1));
    this.rover = [x, y, d];
  },

  rotate(direction, newDirection) {
    const { rover, directions } = <AppData>this;

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
}).mount();
