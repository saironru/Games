let board = [
    ['', '', 'x'],
    ['', '', ''],
    ['', '', '']
  ];

let ai = 'x';
let human = 'o';
let currentPlayer = ai;
let minimaxInvokeCounter = 0;

let isGodMode = true;
let cache = {};

let scores = {
    [ai]: 10,
    [human]: -10,
    tie: 0
  };

  minimax = makeCaching(minimax);

function hashBoard(board, depth, isMaximizing) {
	let hash = board.flat().join('-');
    // hash += '*' + depth;
    // hash += '*' + isMaximizing;
    return hash;
}

function makeCaching(f) {
     
    return function() {
        let hashKey = hashBoard(...arguments)
      if (!(hashKey in cache)) {
        cache[hashKey] = f.apply(this, arguments);
      }
      return cache[hashKey];
    };
}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
  }
  
function checkWinner() {
    let winner = null;
  
    // Horizontal
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
  

  
function getAllMovesValues() {
    // AI to make its turn
    let output = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // Is the spot available?
        if (board[y][x] == '') {
          board[y][x] = ai;
          
          
          
          
          let [score, winCounter, scoreSum] = minimax(board, 0, false, 0, 0);
          console.log(y, x, score, winCounter, scoreSum)
          output.push([y, x, score, winCounter, scoreSum])
          board[y][x] = '';

        }
      }
    }
    //console.log(board.map(i=>i.toString()))
    console.log('minimaxInvokeCounter', minimaxInvokeCounter)
    minimaxInvokeCounter = 0;
    console.log('-----------------------------')
    //board[move.y][move.x] = ai;
    //currentPlayer = human;
    return output;
  }
  

  
function minimax(board, depth, isMaximizing, winCounter, scoreSum) {
      minimaxInvokeCounter++;
        //console.log(minimaxInvokeCounter)
    let wC = 0, sS = 0;
      let score;
      let result = checkWinner();
      
      if (result !== null) {
          if (result === ai) {
               score = scores[result] - depth;
               wC = 1;
               sS = score;
          } else if (result === human) {
               score = scores[result] + depth;
               wC = -1;
               sS = score;
          } else {
              score = 0;
              wC = 0;
              sS = 0;
          }
        return [score, wC, sS];
      }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          // Is the spot available?
          if (board[y][x] == '') {
            board[y][x] = ai;
            let res = minimax(board, depth + 1, false, winCounter, scoreSum);
            let score = res[0];
            wC += res[1];
            sS += res[2];
            board[y][x] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return [bestScore, wC, sS];
    } else {
      let bestScore = +Infinity;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          // Is the spot available?
          if (board[y][x] == '') {
            board[y][x] = human;
            let res = minimax(board, depth + 1, true, winCounter, scoreSum);
            let score = res[0];
            wC += res[1];
            sS += res[2];
            board[y][x] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return [bestScore, wC, sS];
    }
  }

function bestMove (arr) {
    if (isGodMode) {

        let bestScore = Math.max(...arr.map(i => i[2]));
        arr = arr.filter(i => i[2] === bestScore);
        // console.log(bestScore);
        // console.log(arr.map(i=>i.toString()));

        let bestWinCounter = Math.max(...arr.map(i => i[3]));
        arr = arr.filter(i => i[3] === bestWinCounter);
        // console.log(bestWinCounter);
        // console.log(arr.map(i=>i.toString()));

        let bestScoreSum = Math.max(...arr.map(i => i[4]));
        arr = arr.filter(i => i[4] === bestScoreSum);
        // console.log(bestScoreSum);
        // console.log(arr.map(i=>i.toString()));

        // ???????????????? ?????????????????? ?????? ???? ???????????? (?????????? ???????????????? ???????????????? ?????????????????????????? ?????????? AI)
        let randomItem = arr[Math.floor(Math.random()*arr.length)]
        return [randomItem[0], randomItem[1]]
    } else {
        let worstScore = Math.min(...arr.map(i => i[2]));
        // ???????? ???????????????????? ???????? ???? 1 ???? ?????????? ???????????? ??????, ???? ?????????????? ?????? ?????????? ????????????
        if (arr.some(i=> i[2] !== worstScore)) {
            arr = arr.filter(i => i[2] !== worstScore);
        }
        // console.log(worstScore);
        // console.log(arr.map(i=>i.toString()));
        // ???????????????? ?????????????????? ?????? ???? ???? ?????????? ????????????
        let randomItem = arr[Math.floor(Math.random()*arr.length)]
        return [randomItem[0], randomItem[1]]
    }

}



let allMoves = getAllMovesValues();
//console.log(allMoves.map(i=>i.toString()))

let move = bestMove(allMoves);
console.log(move);
console.log(cache)
console.log(Object.keys(cache).length)
console.log(cache['----x----'])