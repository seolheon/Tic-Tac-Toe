const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const resultDisplay = document.getElementById('result');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 'X';
let cells = Array.from({ length: 9 }).fill('');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return { winner: cells[a], line: condition };
        }
    }
    return cells.includes('') ? null : { winner: 'draw' };
}

function handleCellClick(index) {
    if (cells[index] || checkWinner()) return;
    cells[index] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    render();
}

function resetGame() {
    cells = Array.from({ length: 9 }).fill('');
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    resultDisplay.textContent = '';
    resetButton.style.display = 'none';
    render();
}

function render() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        if (cell || checkWinner()) cellDiv.classList.add('disabled-cell');
        cellDiv.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cellDiv);
    });

    const winnerInfo = checkWinner();
    if (winnerInfo) {
        if (winnerInfo.winner === 'draw') {
            resultDisplay.textContent = 'It\'s a draw!';
        } else {
            resultDisplay.textContent = `${winnerInfo.winner} wins!`;
            const [a, b, c] = winnerInfo.line;
            board.querySelectorAll('.cell').forEach((cell, index) => {
                if ([a, b, c].includes(index)) cell.classList.add('winning-cell');
                else cell.classList.add('disabled-cell'); 
            });
        }
        resetButton.style.display = 'block';
    } else {
        resultDisplay.textContent = '';
        resetButton.style.display = 'none';
    }
}

resetButton.addEventListener('click', resetGame);

render();
