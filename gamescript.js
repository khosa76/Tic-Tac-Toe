// Game state
let gameState = Array(9).fill('');
let isPlayerTurn = true;
let gameOver = false;

// DOM elements
const boxes = document.querySelectorAll('.box');
const rstBtn = document.querySelector('#rstBtn');
const newGameBtn = document.querySelector('#new-btn');
const msgContainer = document.querySelector('.msg-container');
const msg = document.querySelector('#msg');

// Win patterns
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Event listeners
boxes.forEach((box, index) => {
  box.addEventListener('click', () => handleBoxClick(index));
});
newGameBtn.addEventListener('click', resetGame);
rstBtn.addEventListener('click', resetGame);

// Game logic
function handleBoxClick(index) {
    if (gameState[index] === '' && !gameOver && isPlayerTurn) {
      gameState[index] = 'X';
      boxes[index].textContent = 'X';
      boxes[index].style.color = 'black';
      boxes[index].disabled = true;
      checkWinner(); // Check for winner after player's move
      if (!gameOver) {
        isPlayerTurn = false; // Update player's turn
        makeComputerMove();
      }
    }
  }
  
  

  function makeComputerMove() {
    if (!gameOver && !isPlayerTurn) {
      const bestMove = getBestMove(gameState);
      gameState[bestMove] = 'O';
      boxes[bestMove].textContent = 'O';
      boxes[bestMove].style.color = 'red';
      boxes[bestMove].disabled = true;
      checkWinner(); // Check for winner after computer's move
      isPlayerTurn = true; // Update player's turn
    }
  }
  

function checkWinner() {
    const score = getScore(gameState);
    // console.log('Score:', score); // Debug statement
    if (score !== -1) {
      if (score === 0) {
        showWinner('Draw');
      } else if (score === -1) {
        showWinner('X');
      } else {
        showWinner('O');
      }
      gameOver = true;
    }
  }
  
  
  

function showWinner(winner) {
    if (winner === 'Draw') {
      msg.textContent = `It's a Draw!`;
    } else {
      msg.textContent = `Congratulations, Winner is ${winner}`;
    }
    msgContainer.classList.remove('hide');
    disableBoxes();
  }
  

function resetGame() {
  gameState = Array(9).fill('');
  isPlayerTurn = true;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add('hide');
}

function enableBoxes() {
  boxes.forEach((box) => {
    box.disabled = false;
    box.textContent = '';
  });
}

function disableBoxes() {
  boxes.forEach((box) => {
    box.disabled = true;
  });
}

// Helper functions
function isDraw() {
  return gameState.every((cell) => cell !== '');
}

function getScore(state) {
    for (let pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
       // console.log('Checking pattern:', pattern); // Debug statement
      if (state[pos1] === state[pos2] && state[pos2] === state[pos3]) {
        // console.log('Winner detected:', state[pos1]); // Debug statement
        if (state[pos1] === 'X') {
          return -1; // Player X wins
        } else if (state[pos1] === 'O') {
          return 1; // Player O wins
        }
      }
    }
  
    if (isDraw()) {
      // console.log('Game is a draw'); // Debug statement
      return 0; // It's a draw
    }
  
    return -1; // Game is not over yet
  }
  

function getBestMove(state) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < state.length; i++) {
    if (state[i] === '') {
      state[i] = 'O';
      const score = minimax(state, 'X', 0, false);
      state[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(state, player, depth, isMaximizingPlayer) {
  const score = getScore(state);
  if (score !== -1) {
    return score;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < state.length; i++) {
      if (state[i] === '') {
        state[i] = 'O';
        const currentScore = minimax(state, 'X', depth + 1, false);
        state[i] = '';
        bestScore = Math.max(bestScore, currentScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < state.length; i++) {
      if (state[i] === '') {
        state[i] = 'X';
        const currentScore = minimax(state, 'O', depth + 1, true);
        state[i] = '';
        bestScore = Math.min(bestScore, currentScore);
      }
    }
    return bestScore;
  }
}
