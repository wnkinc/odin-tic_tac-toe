const GameboardModule = (() => {
    function Gameboard() {
        const rows = 3;
        const columns = 3;
        const board = [];
    
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    
        const getBoard = () => board;
    
        const makeMove = (row, column, player) => {
            const availableCell = board[row][column];
    
            if (availableCell.getValue() !== 0) return;
    
            availableCell.addPlayerMove(player);
        };
    
    
        const printBoard = () => {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
            console.log(boardWithCellValues);
        };
    
        return { getBoard, makeMove, printBoard };
    };

    return {
        Gameboard
    };
})();

function Cell() {
    let value = 0;

    const addPlayerMove = (player) => {
        value = player;
    }; 

    const getValue = () => value;

    return {
        addPlayerMove,
        getValue
    };
}

const GameControllerModule = (() => {
    function GameController(
        playerOneName = "Player One",
        playerTwoName = "Player Two"
    ) {
        const board = GameboardModule.Gameboard();
    
        const players = [
            {
                name: playerOneName,
                token: 1
            },
            {
                name: playerTwoName,
                token: 2
            }
        ];
    
        let activePlayer = players[0];
    
        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
        const getActivePlayer = () => activePlayer;
    
        const printNewRound = () => {
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn`);
        };
    
        const playRound = (row, column) => {
            console.log(`${getActivePlayer().name}'s move into row ${row} and column ${column}.`);
            board.makeMove(row, column, getActivePlayer().token);
    
            const gameBoard = board.getBoard();
    
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // row win check
                    if (j + 2 < 3 &&
                        gameBoard[i][j].getValue() !== 0 &&
                        gameBoard[i][j].getValue() === gameBoard[i][j + 1].getValue() &&
                        gameBoard[i][j].getValue() === gameBoard[i][j + 2].getValue()) {
                            const winningPlayer = gameBoard[i][j].getValue() === 1 ? players[0].name : players[1].name;
                            console.log(`${winningPlayer} is the winner!`);
                    };
                    // column win check
                    if (i + 2 < 3 &&
                        gameBoard[i][j].getValue() !== 0 &&
                        gameBoard[i][j].getValue() === gameBoard[i + 1][j].getValue() &&
                        gameBoard[i][j].getValue() === gameBoard[i + 2][j].getValue()) {
                            const winningPlayer = gameBoard[i][j].getValue() === 1 ? players[0].name : players[1].name;
                            console.log(`${winningPlayer} is the winner!`);
                    };
                    // diagonal to the right win check
                    if (j === 0 &&
                        i === 0 &&
                        gameBoard[i][j].getValue() === gameBoard[i + 1][j + 1].getValue() &&
                        gameBoard[i][j].getValue() === gameBoard[i + 2][j + 2].getValue()) {
                            const winningPlayer = gameBoard[i][j].getValue() === 1 ? players[0].name : players[1].name;
                            console.log(`${winningPlayer} is the winner!`);
                    };
                    // diagonal to the left win check
                    if (j === 2 &&
                        i === 0 &&
                        gameBoard[i][j].getValue() === gameBoard[i + 1][j - 1].getValue() &&
                        gameBoard[i][j].getValue() === gameBoard[i + 2][j - 2].getValue()) {
                            const winningPlayer = gameBoard[i][j].getValue() === 1 ? players[0].name : players[1].name;
                            console.log(`${winningPlayer} is the winner!`);
                    };
                };
            };
    
    
            switchPlayerTurn();
            printNewRound();
        };
    
        printNewRound();
    
        return {
            playRound,
            getActivePlayer,
            getBoard: board.getBoard
        };
    }

    return {
        GameController
    };
})();

//********************* UI ****************************
function ScreenController() {
    const game = GameControllerModule.GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s trun...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.column = columnIndex;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    };

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if(!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}

ScreenController();