let board = [
    ['', '', 'x'],
    ['', '', 'o'],
    ['', '', '']
  ];

let minimaxInvokeCounter = 0;
  
  
  
  let ai = 'x';
  let human = 'o';
  let currentPlayer = human;

  let scores = {
    [ai]: 100,
    [human]: -100,
    tie: 0
  };
  
  bestMove()
  console.log()

function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, 0, false);
          console.log(i, j, score)
          board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    console.log(move)
    //board[move.i][move.j] = ai;
    //currentPlayer = human;
  }
  
  function evaluate(d) {
    //console.log(d)
    // В случае победы ai возвращаем +10 очков, а в случае победы player -10 очков
  
    // Проверяем все строки доски на заполнение одними X или O
    for (let row = 0; row < 3; row++)
    {
        if (board[row][0] == board[row][1] && board[row][1] == board[row][2])
        {
            if (board[row][0] == ai) {
                return +10;
            }
                
            else if (board[row][0] == human) {
                return -10;
            }               
        }
    }
   
    // Проверяем все столбцы доски на заполнение одними X или O
    for (let col = 0; col < 3; col++)
    {
        if (board[0][col] == board[1][col] && board[1][col] == board[2][col])
        {
            if (board[0][col] == ai) {
                return +10;
            }
            else if (board[0][col] == human) {
                return -10;
            }              
        }
    }
   
    // Проверяем все диагонали доски на заполнение одними X или O
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
    {
        if (board[0][0] == ai) {
            return +10;
        }
        else if (board[0][0] == human) {
            return -10;
        }              
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0])
    {
        if (board[0][2] == ai) {
            return +10;
        }
        else if (board[0][2] == human) {
            return -10;
        }              
    }
   
    // Если никто из них не победил (в случае ничьи) - возвращаем 0 очков
    return 0;
  }

  function minimax(board, depth, isMaximizing) {
      minimaxInvokeCounter++;
    // let result = evaluate();
    // if (result !== 0) {
    //   return result < 0 ? result + depth : result - depth;
    // }
    let score;
    let result = checkWinner();
    if (result !== null) {
        if (result === ai) {
             score = scores[result] - depth;
        } else {
             score = scores[result] + depth;
        }
      return score;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = ai;
            let score = minimax(board, depth + 1, false);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Is the spot available?
          if (board[i][j] == '') {
            board[i][j] = human;
            let score = minimax(board, depth + 1, true);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  

  function equals3(a, b, c) {
    return a == b && b == c && a != '';
  }
  
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

