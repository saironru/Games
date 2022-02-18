let board = 
    [
        [ 'o', '.', '.'],
        [ '.', '.', '.'],
        [ '.', '.', '.']
    ];

let ai = 'x';
let human = 'o';

let currentPlayer;



function evaluate(d) {
  console.log(d)
  // В случае победы ai возвращаем +10 очков, а в случае победы player -10 очков

  // Проверяем все строки доски на заполнение одними X или O
  for (let row = 0; row < 3; row++)
  {
      if (board[row][0] == board[row][1] && board[row][1] == board[row][2])
      {
          if (board[row][0] == ai) {
              return +100 - d;
          }
              
          else if (board[row][0] == human) {
              return -100 + d;
          }               
      }
  }
 
  // Проверяем все столбцы доски на заполнение одними X или O
  for (let col = 0; col < 3; col++)
  {
      if (board[0][col] == board[1][col] && board[1][col] == board[2][col])
      {
          if (board[0][col] == ai) {
              return +100 - d;
          }
          else if (board[0][col] == human) {
              return -100 + d;
          }              
      }
  }
 
  // Проверяем все диагонали доски на заполнение одними X или O
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
  {
      if (board[0][0] == ai) {
          return +100 - d;
      }
      else if (board[0][0] == human) {
          return -100 + d;
      }              
  }
  if (board[0][2] == board[1][1] && board[1][1] == board[2][0])
  {
      if (board[0][2] == ai) {
          return +100 - d;
      }
      else if (board[0][2] == human) {
          return -100 + d;
      }              
  }
 
  // Если никто из них не победил (в случае ничьи) - возвращаем 0 очков
  return 0;
}


function bestMove() {
    let bestScore = -Infinity;
    let move;
    // Обходим все клетки доски
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // Проверяем пустая ли клетка
        if (board[y][x] == '.') {
            // Если клетка пустая
            // Ставим в нее ход ai
            board[y][x] = ai;
            // Вызываем минимакс для обновленного поля доски
            let score = minimax(board, 0, false);
            // Возвращаем поле доски к первоначальному виду
            board[y][x] = '.';
            if (score > bestScore) {
                bestScore = score;
                move = { y, x };
          }
        }
      }
    }
    console.log('Лучший ход: ', move);
    //board[move.y][move.x] = ai;
    //currentPlayer = human;
  }
  
  function minimax(board, depth, isMaximizing) {
    let result = evaluate(depth);
    if (result !== 0) {
      return result;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          // Is the spot available?
          if (board[y][x] === '.') {
            board[y][x] = ai;
            let score = minimax(board, depth + 1, false);
            board[y][x] = '.';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = +Infinity;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          // Is the spot available?
          if (board[y][x] === '.') {
            board[y][x] = human;
            let score = minimax(board, depth + 1, true);
            board[y][x] = '.';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  bestMove();


function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}