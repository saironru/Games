let board = 
    [
        [ 'x', 'x', '.'],
        [ '.', '.', '.'],
        [ '.', '.', '.']
    ];



function getAvailableFieldsSet(board) {
    let outputSet = new Set();
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '.') {
                outputSet.add(row + '-' + col);
            }
        }
    }
    return outputSet;
}

let availableSet = getAvailableFieldsSet(board);

console.log('Сет свободных клеток', availableSet);


let player = 'o';
let ai = 'x';


console.log('Player играет за: ', player);
console.log('AI играет за: ', ai);

function evaluate(board, d) {
    // В случае победы ai возвращаем +10 очков, а в случае победы player -10 очков
 
    // Проверяем все строки доски на заполнение одними X или O
    for (let row = 0; row < 3; row++)
    {
        if (board[row][0] == board[row][1] && board[row][1] == board[row][2])
        {
            if (board[row][0] == ai) {
                return +100 + d;
            }
                
            else if (board[row][0] == player) {
                return -100 - d;
            }               
        }
    }
   
    // Проверяем все столбцы доски на заполнение одними X или O
    for (let col = 0; col < 3; col++)
    {
        if (board[0][col] == board[1][col] && board[1][col] == board[2][col])
        {
            if (board[0][col] == ai) {
                return +100 + d;
            }
            else if (board[0][col] == player) {
                return -100 - d;
            }              
        }
    }
   
    // Проверяем все диагонали доски на заполнение одними X или O
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
    {
        if (board[0][0] == ai) {
            return +100 + d;
        }
        else if (board[0][0] == player) {
            return -100 - d;
        }              
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0])
    {
        if (board[0][2] == ai) {
            return +100 + d;
        }
        else if (board[0][2] == player) {
            return -100 - d;
        }              
    }
   
    // Если никто из них не победил (в случае ничьи) - возвращаем 0 очков
    return 0;
}

console.log(evaluate(board, availableSet.size))

// ---------------------------------------------------------------------------------------------

function findBestMove(board) {
    let bestMove = null;
    let bestMoveScore =  -Infinity;
    for (let field of availableSet) {
        console.log(field)
        let fieldCoord = field.split('-');
        let y = fieldCoord[0];
        let x = fieldCoord[1];
        board[y][x] = ai;
        availableSet.delete(field);
        let fieldScore = minimax(board, availableSet, false);
        board[y][x] = '.';
        availableSet.add(field);
        if (fieldScore > bestMoveScore) {
            bestMove = fieldCoord;
            bestMoveScore = fieldScore;
        }
    }
    return bestMove;
}

function minimax(board, availableSet, isMaximizingPlayer) {
    console.log(board, availableSet, isMaximizingPlayer)
    if (availableSet.size === 0 || evaluate(board, availableSet.size) !== 0) {
        return evaluate(board, availableSet.size);
    }

    let bestVal;
    if (isMaximizingPlayer) {
        bestVal = -Infinity;
        for (let field of availableSet) {
            let fieldCoord = field.split('-');
            let y = fieldCoord[0];
            let x = fieldCoord[1];
            board[y][x] = ai;
            availableSet.delete(field);
            let value = minimax(board, availableSet, false);
            board[y][x] = '.';
            availableSet.add(field);
            bestVal = Math.max(bestVal, value);
        }
    } else {
        bestVal = +Infinity;
        for (let field of availableSet) {
            let fieldCoord = field.split('-');
            let y = fieldCoord[0];
            let x = fieldCoord[1];
            board[y][x] = player;
            availableSet.delete(field);
            let value = minimax(board, availableSet, true);
            board[y][x] = '.';
            availableSet.add(field);
            bestVal = Math.min(bestVal, value);
        }
    }
    return bestVal;
}


console.log(findBestMove(board))