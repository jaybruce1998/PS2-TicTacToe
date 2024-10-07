// {"name": "TicTacToe", "author": "Jay", "version": "07102024","file": "main.js"}

const screen = Screen.getMode();

const dark_gray = Color.new(32, 32, 32);
const gray = Color.new(64, 64, 64);
const white = Color.new(255, 255, 255);
const blue = Color.new(0, 0, 255);
const red = Color.new(255, 0, 0);

let font = new Font();
font.color = gray;

let bigfont = new Font();
bigfont.color = blue;
bigfont.scale = 2.0;

// Tic Tac Toe grid and player setup
const GRID_SIZE = 3;
let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

let currentPlayer = 'X';
let cursorX = 0;
let cursorY = 0;
let turns, winner;

// Update the color to green
const green = Color.new(0, 255, 0);

function drawGrid() {
    const startX = 320 - 150;
    const startY = 240 - 150;
    const cellSize = 100;
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            let x = startX + j * cellSize;
            let y = startY + i * cellSize;
            
            // Draw the cell
            Draw.rect(x, y, cellSize, cellSize, white);
            
            // Draw the X or O
            if (board[i][j] !== null) {
            	//bigfont.print(50*i, 50*j, board[i][j]);
                bigfont.print(x + (cellSize / 2) - 10, y + (cellSize / 2) - 10, board[i][j]);
            }
        }
    }
    const lineThickness = 5;

    // Vertical lines
    for (let i = 1; i < GRID_SIZE; i++) {
        let lineX = startX + i * cellSize;
        Draw.rect(lineX - (lineThickness / 2), startY, lineThickness, cellSize * GRID_SIZE, gray); // Vertical line
    }

    // Horizontal lines
    for (let i = 1; i < GRID_SIZE; i++) {
        let lineY = startY + i * cellSize;
        Draw.rect(startX, lineY - (lineThickness / 2), cellSize * GRID_SIZE, lineThickness, gray); // Horizontal line
    }

    // Highlight the current cursor position with a green square (non-filled)
    let cursorXPos = startX + cursorX * cellSize;
    let cursorYPos = startY + cursorY * cellSize;
    
    // Draw only the border for the green square
    Draw.rect(cursorXPos, cursorYPos, cellSize, 5, green); // Top border
    Draw.rect(cursorXPos, cursorYPos + cellSize - 5, cellSize, 5, green); // Bottom border
    Draw.rect(cursorXPos, cursorYPos, 5, cellSize, green); // Left border
    Draw.rect(cursorXPos + cellSize - 5, cursorYPos, 5, cellSize, green); // Right border
    switch(winner) {
    	case 'X':
    	case 'O':
    		bigfont.print(20, 0, winner+" wins!");
    		break;
    	case 'T':
    		bigfont.print(20, 0, "Tie!");
    }
}


// Check for a win or draw
function checkWin() {
    // Rows, columns, diagonals
    for (let i = 0; i < GRID_SIZE; i++) {
        if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) {
            return true;
        }
        if (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) {
            return true;
        }
    }

    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
        return true;
    }

    if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
        return true;
    }

    return false;
}

function checkDraw() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (board[i][j] === null) {
                return false;
            }
        }
    }
    return true;
}

function resetBoard() {
	currentPlayer='X';
	turns=1;
	winner=null;
	for(let i=0; i<3; i++)
		for(let j=0; j<3; j++)
			board[i][j]=null;
}

let pad = Pads.get();
resetBoard();

while (true) {
    pad.update();
    Screen.clear(dark_gray);

    if (pad.justPressed(Pads.UP)) {
        cursorY = (cursorY > 0) ? cursorY - 1 : 2;
    }
    else if (pad.justPressed(Pads.DOWN)) {
        cursorY = (cursorY < GRID_SIZE - 1) ? cursorY + 1 : 0;
    }
    if (pad.justPressed(Pads.LEFT)) {
        cursorX = (cursorX > 0) ? cursorX - 1 : 2;
    }
    else if (pad.justPressed(Pads.RIGHT)) {
        cursorX = (cursorX < GRID_SIZE - 1) ? cursorX + 1 : 0;
    }
    
    if (pad.justPressed(Pads.CROSS)) {
        if (winner===null && board[cursorY][cursorX] === null) {
            board[cursorY][cursorX] = currentPlayer;

            if (checkWin()) {
            	winner=currentPlayer;
            } else if (turns++==9) {
                winner='T';
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
    if(pad.justPressed(Pads.START)&&winner!==null)
    	resetBoard();

    drawGrid();
    Screen.flip();
}

