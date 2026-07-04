const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const tile = 32;
let score = 0;

const playerImg = new Image();
playerImg.src = 'assets/player.png';

const ghostImgs = [];
for (let i = 1; i <= 4; i++) {
  const img = new Image();
  img.src = `assets/ghost${i}.png`;
  ghostImgs.push(img);
}

const map = [
  '###################',
  '#........#........#',
  '#.###.##.#.##.###.#',
  '#.................#',
  '#.###.#.###.#.###.#',
  '#.....#...#.#.....#',
  '#####.### #.#####.#',
  '#.................#',
  '#.###.#.###.#.###.#',
  '#.....#...#.#.....#',
  '#.###.##.#.##.###.#',
  '#........#........#',
  '###################'
];

const player = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0
};

const ghosts = [
  { x: 9, y: 6, img: ghostImgs[0] },
  { x: 8, y: 6, img: ghostImgs[1] },
  { x: 10, y: 6, img: ghostImgs[2] },
  { x: 9, y: 7, img: ghostImgs[3] }
];

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];

      if (cell === '#') {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * tile, y * tile, tile, tile);
      }

      if (cell === '.') {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x * tile + tile / 2, y * tile + tile / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x * tile, player.y * tile, tile, tile);
}

function drawGhosts() {
  ghosts.forEach(g => {
    ctx.drawImage(g.img, g.x * tile, g.y * tile, tile, tile);
  });
}

function movePlayer() {
  const nx = player.x + player.dirX;
  const ny = player.y + player.dirY;

  if (map[ny][nx] !== '#') {
    player.x = nx;
    player.y = ny;
  }

  if (map[player.y][player.x] === '.') {
    map[player.y] =
      map[player.y].substring(0, player.x) +
      ' ' +
      map[player.y].substring(player.x + 1);

    score += 10;
    scoreEl.textContent = score;
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    const dirs = [
      [1,0],[-1,0],[0,1],[0,-1]
    ];

    const d = dirs[Math.floor(Math.random()*4)];
    const nx = g.x + d[0];
    const ny = g.y + d[1];

    if (map[ny][nx] !== '#') {
      g.x = nx;
      g.y = ny;
    }

    if (g.x === player.x && g.y === player.y) {
      alert('💀 Zostales wyszlamiony? Wynik: ' + score);
      location.reload();
    }
  });
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();
  drawPlayer();
  drawGhosts();
}

function loop() {
  movePlayer();
  moveGhosts();
  draw();
}

setInterval(loop, 200);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') setDir('up');
  if (e.key === 'ArrowDown') setDir('down');
  if (e.key === 'ArrowLeft') setDir('left');
  if (e.key === 'ArrowRight') setDir('right');
});

function setDir(dir) {
  if (dir === 'up')    { player.dirX = 0; player.dirY = -1; }
  if (dir === 'down')  { player.dirX = 0; player.dirY = 1; }
  if (dir === 'left')  { player.dirX = -1; player.dirY = 0; }
  if (dir === 'right') { player.dirX = 1; player.dirY = 0; }
}

draw();
