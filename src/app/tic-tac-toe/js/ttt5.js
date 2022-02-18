let board = [
    ['', '', 'x'],
    ['', '', 'o'],
    ['', '', '']
  ];

let minimaxInvokeCounter = 0;
  
let sumScore = 0;
  
  let ai = 'x';
  let human = 'o';
  let currentPlayer = ai;

  let scores = {
    [ai]: 10,
    [human]: -10,
    tie: 0
  };
  
  //minimax = makeCaching(minimax);
  bestMove()
  console.log(minimaxInvokeCounter);

function hashBoard(board) {
	let hash = board.flat().join('-');
    return hash;
}

function makeCaching(f) {
    let cache = {};
  
    return function(board, depth, isMaximizing) {
        let hashKey = hashBoard(board)
      if (!(hashKey in cache)) {
        cache[hashKey] = f.call(this, board, depth, isMaximizing);
      }
      return cache[hashKey];
    };
  
  }

  

function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
            sumScore = 0;
          let score = minimax(board, 0, false);
          console.log(i, j, score, sumScore)
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


  function minimax(board, depth, isMaximizing) {
    minimaxInvokeCounter++;

    let score;
    let result = checkWinner();
    if (result !== null) {
        if (result === ai) {
             score = scores[result] - depth;
             sumScore += score 
        } else {
             score = scores[result] + depth;
             sumScore += score 
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
      let bestScore = +Infinity;
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

