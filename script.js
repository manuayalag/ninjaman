const WORLD = document.getElementById("world");
const NINJAMAN = document.getElementById("ninjaman");
const RED = document.getElementById("red");
const PUMPKY = document.getElementById("pumpky");
const PINKY = document.getElementById("pinky");
const SCORE = document.getElementById("score");
const VIDAS = document.getElementById("vidas");
const RESTART = document.getElementById("restart");
const MESSAGE = document.getElementById("message");

let score = 0; // puntaje actual del juego
let amountOfFood = 0; // cantidad de comida que hay en el juego
let eatenFood = 0; // Cantidad de comida que comio el jugador
let vidas = 3; // Vidas actual del ninjaman
let gameOver = false;

let world = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let worldDictionary = {
  0: "blank",
  1: "wall",
  2: "sushi",
  3: "onigiri",
};
function generateRandomWorld() {
  for (var i = 2; i < world.length - 2; i++) {
    for (var j = 2; j < world[i].length - 2; j++) {
      let aleatorio = Math.floor(Math.random() * 4); //crea numeros aleatorios entre 0 y 3
      world[i][j] = aleatorio;
      if (aleatorio == 2 || aleatorio == 3) {
        world[i + 1][j] = 0;
        world[i - 1][j] = 0;
        world[i][j + 1] = 1;
        world[i][j - 1] = 1; //SI ES UN SUSHI/ONIGIRI PARA QUE EXISTAN ESPACIOS PARA ACCEDER A ELLOS
      }
    }
  }
  if (world[1][1] == 1) {
    world[1][1] = 0; //EL LUGAR DONDE APARECE NINJAMAN SIEMPRE ESTA EN BLANCO
  }
  totalFood(); //Hice esta funcion porque cuando creo comida sobreescribo lo que esta a su alrededor.
}
function totalFood() {
  for (var i = 0; i < world.length; i++) {
    for (var j = 0; j < world[i].length; j++) {
      if (world[i][j] == 2 || world[i][j] == 3) {
        amountOfFood++;
      }
    }
  }
}
generateRandomWorld();
function drawWorld() {
  output = "";
  for (var row = 0; row < world.length; row++) {
    output += "<div class = 'row'>";
    for (var i = 0; i < world[row].length; i++) {
      output += "<div class = '" + worldDictionary[world[row][i]] + "'></div>";
    }
    output += "</div>";
  }
  WORLD.innerHTML = output;
}
drawWorld();

let ninjaman = {
  x: 1,
  y: 1,
};
let red = {
  x: 7,
  y: 7,
};
let pumpky = {
  x: 5,
  y: 5,
};
let pinky = {
  x: 8,
  y: 5,
};

let ghosts = [red, pumpky, pinky]; // arreglo de fantasmas para moverlos uno por uno
function drawNinjaman() {
  NINJAMAN.style.top = ninjaman.y * 40 + "px";
  NINJAMAN.style.left = ninjaman.x * 40 + "px";
}
drawNinjaman();

function drawGhosts() {
  RED.style.top = red.y * 40 + "px";
  RED.style.left = red.x * 40 + "px";
  PUMPKY.style.top = pumpky.y * 40 + "px";
  PUMPKY.style.left = pumpky.x * 40 + "px";
  PINKY.style.top = pinky.y * 40 + "px";
  PINKY.style.left = pinky.x * 40 + "px";
}
drawGhosts();

function hunted() {
  for (var i = 0; i < ghosts.length; i++) {
    var ghost = ghosts[i];
    if (ghost.x === ninjaman.x && ghost.y === ninjaman.y) {
      vidas--; // Decrementa las vidas cuando Ninja Man colisiona con un fantasma
      ninjaman.x = 1;
      ninjaman.y = 1;
      if (vidas <= 0) {
        checkGameOver(); // Si las vidas llegan a cero, termina el juego
      }
    }
  }
  updateVidas();
}
function updateVidas() {
  VIDAS.innerText = "VIDAS: " + vidas;
}
function moveGhosts() {
  if (gameOver) {
    return;
  }
  for (var i = 0; i < ghosts.length; i++) {
    var ghost = ghosts[i];
    var randomDirection = Math.floor(Math.random() * 4); // Genera un número aleatorio entre 0 y 3

    // Intenta mover el fantasma en una dirección aleatoria hasta que encuentre una pared
    switch (randomDirection) {
      case 0: // Izquierda
        if (world[ghost.y][ghost.x - 1] !== 1) {
          ghost.x--;
        }
        break;
      case 1: // Derecha
        if (world[ghost.y][ghost.x + 1] !== 1) {
          ghost.x++;
        }
        break;
      case 2: // Arriba
        if (world[ghost.y - 1][ghost.x] !== 1) {
          ghost.y--;
        }
        break;
      case 3: // Abajo
        if (world[ghost.y + 1][ghost.x] !== 1) {
          ghost.y++;
        }
        break;
    }
  }
  hunted();
}
// Llama a esta función para mover los fantasmas en intervalos de tiempo
function startGhostMovement() {
  setInterval(function () {
    moveGhosts();
    drawGhosts();
  }, 300); // Cambia el tiempo según lo rapido que quiero que se muevan los fantasmas
}
startGhostMovement();
document.onkeydown = function (e) {
  if (gameOver) {
    return;
  }
  if (e.keyCode == 37) {
    if (world[ninjaman.y][ninjaman.x - 1] != 1) {
      ninjaman.x--;
    }
  }
  if (e.keyCode == 39) {
    if (world[ninjaman.y][ninjaman.x + 1] != 1) {
      ninjaman.x++;
    }
  }
  if (e.keyCode == 38) {
    if (world[ninjaman.y - 1][ninjaman.x] != 1) {
      ninjaman.y--;
    }
  }
  if (e.keyCode == 40) {
    if (world[ninjaman.y + 1][ninjaman.x] != 1) {
      ninjaman.y++;
    }
  }
  hunted();
  eatSushi();
  world[ninjaman.y][ninjaman.x] = 0;
  drawNinjaman();
  drawWorld();

  function eatSushi() {
    if (world[ninjaman.y][ninjaman.x] == 2) {
      score += 10;
      eatenFood++;
    } else if (world[ninjaman.y][ninjaman.x] == 3) {
      score += 5;
      eatenFood++;
    }
    updateScore();
    checkGameOver();
  }

  //tener un puntaje de cuanto sushi come ninjaman
  // sushi 10 pts y onigiri 5 pts

  // random world
  // crear fantasmas que persiguen a ninjaman
};
function updateScore() {
    SCORE.innerText = "SCORE: " + score;
  }
function checkGameOver() {
  if (amountOfFood == eatenFood) {
    gameOver = true; //cuando ya se comio todo, el juego termina.
	MESSAGE.style.color = "green";
    showGameOverMessage("GANASTE!");
  } else if (vidas <= 0) {
    gameOver = true;
	MESSAGE.style.color = "red";
    showGameOverMessage("PERDISTE");
  }
}
function showGameOverMessage(message) {
    MESSAGE.innerText = message;
    MESSAGE.style.display = "block";
	MESSAGE.style.fontSize = "40px";
	
    RESTART.style.display = "block";
}
function restartGame() {
  // Reiniciamos las variables
  score = 0;
  amountOfFood = 0;
  eatenFood = 0;
  vidas = 3;
  gameOver = false;

  // Reiniciamos la posición de ninjaman y los fantasmas
  ninjaman.x = 1;
  ninjaman.y = 1;
  red.x = 7;
  red.y = 7;
  pumpky.x = 5;
  pumpky.y = 5;
  pinky.x = 8;
  pinky.y = 5;
  // Generamos un nuevo mundo aleatorio y lo dibujamos
  generateRandomWorld();
  drawWorld();
  
  // Actualizamos la visualización del marcador de puntuación y las vidas
  updateScore();
  updateVidas();
  
  // Ocultamos el mensaje de juego terminado y el botón de reinicio
  MESSAGE.style.display = "none";
  RESTART.style.display = "none";
}
RESTART.addEventListener("click", function() {
    restartGame();
});
