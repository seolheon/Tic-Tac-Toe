const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const resultDisplay = document.getElementById('result');
const resetButton = document.getElementById('resetButton');
const sideSelection = document.getElementById('sideSelection');
const sideChoices = document.querySelectorAll('.side-choice');

let currentPlayer = '';
let cells = Array.from({ length: 9 }).fill('');
let botPlayer = '';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a] === player && cells[a] === cells[b] && cells[a] === cells[c]) {
            return { winner: player, line: condition };
        }
    }
    return cells.includes('') ? null : { winner: 'draw' };
}

function handleCellClick(index) {
    if (cells[index] || checkWinner(currentPlayer) || currentPlayer === botPlayer) return;
    cells[index] = currentPlayer;
    render();
    if (checkWinner(currentPlayer)) {
        return;
    }
    currentPlayer = currentPlayer === 'X' ? botPlayer : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    if (currentPlayer === botPlayer) {
        setTimeout(() => botMove(), 500);
    }
}

function botMove() {
    const availableMoves = cells.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    cells[availableMoves[randomIndex]] = botPlayer;
    render();
    if (checkWinner(botPlayer)) {
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function resetGame() {
    cells = Array.from({ length: 9 }).fill('');
    currentPlayer = '';
    currentPlayerDisplay.textContent = 'Select your side:';
    resultDisplay.textContent = '';
    resetButton.style.display = 'none';
    sideSelection.style.display = 'block';
    board.style.display = 'none';
}

function render() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        if (cell || checkWinner(currentPlayer)) cellDiv.classList.add('disabled-cell');
        board.appendChild(cellDiv);
        cellDiv.addEventListener('click', () => handleCellClick(index));
    });

    const winnerInfo = checkWinner(currentPlayer);
    if (winnerInfo) {
        if (winnerInfo.winner === 'draw') {
            resultDisplay.textContent = 'It\'s a draw!';
        } else if (winnerInfo.winner){
            resultDisplay.textContent = `${winnerInfo.winner} wins!`;
            const [a, b, c] = winnerInfo.line;
            board.querySelectorAll('.cell').forEach((cell, index) => {
                if ([a, b, c].includes(index)) cell.classList.add('winning-cell');
                else cell.classList.add('disabled-cell');
            });
        }
        if (winnerInfo.winner) {
            resetButton.style.display = 'block';
        }
    } else {
        resultDisplay.textContent = '';
        resetButton.style.display = 'none';
    }
}

sideChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        currentPlayer = choice.textContent;
        botPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
        sideSelection.style.display = 'none'; 
        board.style.display = 'grid'; 
        render();
        if (currentPlayer === botPlayer) {
            setTimeout(() => botMove(), 500);
        }
    });
});


resetButton.addEventListener('click', resetGame);

render();
