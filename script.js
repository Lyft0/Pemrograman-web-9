// variabel
var board;
let humanPlay = "X";
let aiPlay = "O";
let diff;
const winCombos = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
const cells = document.querySelectorAll(".cell");

// method start game
const startGame = () => {
  document.querySelector(".promptgame").style.display = "none";
  board = Array.from(Array(9).keys());

  // pengambilan tingkat kesulitan
  const selDiff = document.querySelector('input[name="mode"]:checked').value;
  diff = selDiff;

  // bersihkan board dan click event
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
};

// method setiap giliran pemain
const turnClick = (square) => {
  if (typeof board[square.target.id] == "number") {
    turn(square.target.id, humanPlay);
    if (!checkTie()) turn(bestSpot(), aiPlay);
  }
};

// method mengecek giliran
const turn = (squareId, player) => {
  board[squareId] = player;
  document.getElementById(squareId).innerText = player;

  // cek pemenang
  let gameWon = checkWin(board, player);
  if (gameWon) gameOver(gameWon);
};

// method penentuan pemenang
function checkWin(board, player) {
  // mengambil board dari player
  let plays = board.reduce((a, e, i) => (e == player ? a.concat(i) : a), []);
  let gameWon = null;
  // check setiap board dengan wincombo untuk menentukan pemenang
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

// method game over
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlay ? "green" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == humanPlay ? "Anda Menang!" : "Anda Kalah..");
}

// method penentuan pemenang
function declareWinner(status) {
  document.querySelector(".promptgame").style.display = "block";
  document.querySelector(".promptgame .text").innerText = status;
}

// method mengecek kotak kosong
function emptySquare() {
  return board.filter((s) => typeof s == "number");
}

// method langkah ai
function bestSpot() {
  return diff == "baby" ? emptySquare()[0] : minimax(board, aiPlay).index;
}

// method cek seri
function checkTie() {
  if (emptySquare().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "blue";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Seri!");
    return true;
  }
  return false;
}

// minimax algorithm
function minimax(newBoard, player) {
  var availSpots = emptySquare();

  if (checkWin(newBoard, humanPlay)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlay)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == aiPlay) {
      var result = minimax(newBoard, humanPlay);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlay);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlay) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// START THE GAME!!!
startGame();
