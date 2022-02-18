import { Component, OnInit } from '@angular/core';

interface Cache {
  [key: string]: any[];
}

interface Scores {
  [key: string]: number;
}

type BoardCell = 'x' | 'o' | '' | 'x wintie' | 'o wintie' | ' wintie';
type BoardRow = [BoardCell, BoardCell, BoardCell];
type Board = [BoardRow, BoardRow, BoardRow];

type Coord = 0 | 1 | 2;
type MoveCoord = [Coord, Coord];
type Move = [Coord, Coord, number, number, number];
type Moves = Array<Move>;

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {

  isGodMode: boolean = false;
  isfirstMoveAI: boolean = false;
  isGameEnd: boolean = true;
  message: string = '';
  sizeY: number = 3;
  sizeX: number = 3;
  fieldSize: number = 128;
  fieldBorderSize: number = 1;
  boardWidth: string;
  board: Board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  ai: BoardCell = 'o';
  human: BoardCell = 'x';
  currentPlayer: BoardCell = 'x';
  cache: Cache = {};
  scores: Scores = {};
  minimaxInvokeCounter: number = 0;
  winnerIs: string = '';
  messageClass: string = '';
  gameON: boolean = false;

  constructor() { 
    this.boardWidth = `${this.sizeX * (this.fieldSize + 2 * this.fieldBorderSize)}px`;
  }

  ngOnInit(): void {
    this.minimax = this.makeCaching(this.minimax);
  }

  newGame() {
    this.clearBoard();
    this.gameON = true;
  
    if (this.currentPlayer === this.ai) {
      this.moveAI();
    }
  }

  clickOnBoard(event: any) {
    if (this.currentPlayer === this.human && this.gameON) {
      this.moveHuman(event);
    }
  }

  clearBoard() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    if (this.isfirstMoveAI) {
      this.ai = 'x';
      this.human = 'o';
    } else {
      this.ai = 'o';
      this.human = 'x';
    }
    this.currentPlayer = 'x';
    
    this.scores = {
      [this.ai]: 10,
      [this.human]: -10,
      tie: 0
    };

    this.minimaxInvokeCounter = 0;
    this.message = '';
    this.messageClass = '';
    this.gameON = false;
  }

  hashBoard(board: Board, depth: number, isMaximizing: boolean) {
    let hash = board.flat().join('-');
    hash += '*' + depth;
    hash += '*' + isMaximizing;
    return hash;
  }

  makeCaching(f: Function) {     
    return (...args: [Board, number, boolean]) => {
        let hashKey = this.hashBoard(...args);
      if (!(hashKey in this.cache)) {
        this.cache[hashKey] = f.apply(this, args);
      }
      return this.cache[hashKey];
    };
  }

  equals3(a: string, b: string, c: string) {
    return a == b && b == c && a != '';
  }

  checkWinner(): [string | null, number[][]] {
    let winner: string | null = null;
    let winline: number[][] | null = [[]];
  
    // Horizontal
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        winner = this.board[i][0];
        winline = [[i, 0], [i, 1], [i, 2]];
      }
    }
  
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        winner = this.board[0][i];
        winline = [[0, i], [1, i], [2, i]];
      }
    }
  
    // Diagonal
    if (this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      winner = this.board[0][0];
      winline = [[0, 0], [1, 1], [2, 2]];
    }
    if (this.equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      winner = this.board[2][0];
      winline = [[2, 0], [1, 1], [0, 2]];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == '') {
          openSpots++;
        }
      }
    }
  
    if (winner == null && openSpots == 0) {
      this.winnerIs = 'tie';
      return [ 'tie', [[]] ];
    } else {
      this.winnerIs = this.currentPlayer!;
      return [ winner, winline ];
    }
  }

  minimax(board: Board, depth: number, isMaximizing: boolean, winCounter: number, scoreSum: number) {
    this.minimaxInvokeCounter++;
      //console.log(minimaxInvokeCounter)
    let wC = 0, sS = 0;
    let score;
    let result = this.checkWinner()[0];
    
    if (result !== null) {
        if (result === this.ai) {
             score = this.scores[result] - depth;
             wC = 1;
             sS = score;
        } else if (result === this.human) {
             score = this.scores[result] + depth;
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
          if (this.board[y][x] == '') {
            this.board[y][x] = this.ai;
            let res = this.minimax(this.board, depth + 1, false, winCounter, scoreSum);
            let score = res[0];
            wC += res[1];
            sS += res[2];
            this.board[y][x] = '';
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
          if (this.board[y][x] == '') {
            this.board[y][x] = this.human;
            let res = this.minimax(this.board, depth + 1, true, winCounter, scoreSum);
            let score = res[0];
            wC += res[1];
            sS += res[2];
            this.board[y][x] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return [bestScore, wC, sS];
    }
  }

  getAllMovesValues(): Moves {
    // AI to make its turn
    let output = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // Is the spot available?
        if (this.board[y][x] == '') {
          this.board[y][x] = this.ai;
          
          
          
          
          let [score, winCounter, scoreSum] = this.minimax(this.board, 0, false, 0, 0);
          let move: Move = [y as Coord, x as Coord, score, winCounter, scoreSum]
          console.log(move)
          output.push(move)
          this.board[y][x] = '';

        }
      }
    }
    //console.log(board.map(i=>i.toString()))
    console.log('minimaxInvokeCounter', this.minimaxInvokeCounter)
    this.minimaxInvokeCounter = 0;
    console.log('-----------------------------')
    //board[move.y][move.x] = ai;
    //currentPlayer = human;
    return output;
  }

  bestMove (arr: Moves): MoveCoord {
    if (this.isGodMode) {

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

        // Получаем случайный ход из ЛУЧШИХ (чтобы немножко добавить вариативность ходов AI)
        let randomItem = arr[Math.floor(Math.random()*arr.length)]
        return [randomItem[0], randomItem[1]]
    } else {
        if (Math.random() < 0.9) {
        let worstScore = Math.min(...arr.map(i => i[2]));
        // Если существует хотя бы 1 НЕ САМЫЙ ХУДШИЙ ХОД, то удаляем все САМЫЕ ХУДШИЕ
        if (arr.some(i=> i[2] !== worstScore)) {
            arr = arr.filter(i => i[2] !== worstScore);
        }
      }
        // console.log(worstScore);
        // console.log(arr.map(i=>i.toString()));
        // Получаем случайный ход из НЕ САМЫХ ПЛОХИХ
        let randomItem = arr[Math.floor(Math.random()*arr.length)]
        return [randomItem[0], randomItem[1]]
      

        // 2 ВАРИАНТ

        // let scores = new Set(arr.map(i => i[2]));
        // // Если существует больше двух разных по оценке эффективности ходов, то тогда удаляем самые плохие
        // if (scores.size > 2) {
        //   let worstScore = Math.min(...scores);
        //   arr = arr.filter(i => i[2] !== worstScore);
        // }
          
        //   // console.log(worstScore);
        //   // console.log(arr.map(i=>i.toString()));
        //   // Получаем случайный ход из НЕ САМЫХ ПЛОХИХ
        //   let randomItem = arr[Math.floor(Math.random()*arr.length)]
        //   return [randomItem[0], randomItem[1]]
    }
  }

  moveAI() {
    let allMoves = this.getAllMovesValues();
    //console.log(allMoves.map(i=>i.toString()))

    let move = this.bestMove(allMoves);
    let [ y, x ] = move;
    this.board[y][x] = this.ai;

    let result = this.checkWinner();
    let winner = result[0];
    let winline = result[1];
    if (winner !== null) {
      this.gameOver(winner, winline);
      return;
    }

    this.currentPlayer = this.human;

    console.log(move);
    console.log(this.cache)
    console.log(Object.keys(this.cache).length)
    console.log(this.cache['----x----'])
  }

  moveHuman(event: any) {
    let coordinates = event.target.id.split('-');
    let y = coordinates[1];
    let x = coordinates[2];
    if (this.board[y][x] !== '') return;
    this.board[y][x] = this.human;

    let result = this.checkWinner();
    let winner = result[0];
    let winline = result[1];
    if (winner !== null) {
      this.gameOver(winner, winline);
      return;
    }

    this.currentPlayer = this.ai;
    this.moveAI();
  }

  gameOver(winner: string | null, winline: number[][]) {

    
    if (winner === 'tie') {
      this.message = `Ничья`;
      this.board = this.board.map(item => item.map(i => i + ' wintie')) as Board;
      this.messageClass = 'wintie';
    } else {
      let isHumanWinner = this.currentPlayer === this.human;
      if (winner === 'x') {     
        this.message = `Победили Крестики! (${isHumanWinner ? 'Player' : 'AI'})`;
      } else if (winner === 'o') {
        this.message = `Победили Нолики! (${isHumanWinner ? 'Player' : 'AI'})`; 
      }
      winline.forEach(i => this.board[i[0]][i[1]] += isHumanWinner ? ' winhuman' : ' winai');
      this.messageClass = isHumanWinner ? 'winhuman' : 'winai';
    } 
     
    this.currentPlayer = '';
    this.gameON = false;
  }
  

}
