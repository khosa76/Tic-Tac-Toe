var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const wPlayer = 'W';  // to change the color of winning player 


// Change the colors of X and O
const xColor = 'white';
const oColor = 'white';
const wColor = '#808080'; // to change the color of winning player 







const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]



function changeColor(element, player) {
    element.classList.add('fade-in'); // Add fade-in animation
    if (player === huPlayer) {
        element.style.color = oColor;
    } else if (player === aiPlayer) {
        element.style.color = xColor;
    } else if (player === wPlayer) {
        element.style.color = wColor;  // to change the color of winning player 

    }
}



const cells = document.querySelectorAll('.cell');
startGame();



function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].classList.remove('red', 'green', 'fade-in'); // remove if crash
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
       
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)
      
       
        if (!checkWin(origBoard, huPlayer) && !checkTie()) {
            setTimeout(() => turn(bestSpot(), aiPlayer), 500); // Add 1 second delay for AI turn
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    const cell = document.getElementById(squareId);
    cell.innerText = player;
    cell.classList.remove('fade-in'); // Reset animation class
    void cell.offsetWidth; // Trigger reflow
    changeColor(cell, player); // Change color based on the player

    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}




function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}



function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        const cell = document.getElementById(index);
        // cell.style.backgroundColor = "#333"; 
        changeColor(cell, wPlayer); // Change color based on the player
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}



function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            // cells[i].style.backgroundColor = "rgb(174,156,168)";
            // cells[i].classList.add('red'); // Add tie color class
            cells[i].style.color = "#808080"; // color of tie game
          console.log(cells[i]);
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
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