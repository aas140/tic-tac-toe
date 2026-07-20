const Gameboard = () => {
    // creates the board, place the user marker at position, print the board

    let board = [];

    for(let i=0; i<3; i++){
        board[i] = [];
        for(let j=0; j<3; j++){
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    const setMarker = (marker, r, c) => {
      board[r][c].addToken(marker);
    }

    const printBoard = () => {
        let boardValue = board.map((row) => 
            row.map((cell) => cell.getValue())
        );
        console.log(boardValue);
               
    }
    return {getBoard, setMarker, printBoard};
};

// each cell of the game grid has value Cell()
function Cell(){
    let mark  = '0';
    const addToken = (marker) =>{
        if(mark!='0') return;
        mark = marker;
    }
    const getValue = () => mark;

    return { addToken, getValue};
}

function GameController(p1 =  "Player One", p2 = "Player Two"){
    // assign token to the players, record active player and update the game, check the winner
    
    const playboard = Gameboard();

    const players  = [
        {
            name: p1,
            token: 'X',
        },
        {
            name: p2,
            token: 'O',
        }
    ];
    let gameOver = false;
    let gameStatus = "";
  
    let activePlayer = players[0];

    const switchPlayer = () =>{
        activePlayer = activePlayer === players[0]? players[1]:players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printTurn = () =>{
        playboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);    
    };
  
    const checkWinner = () =>{
      let board = playboard.getBoard();
      
      if(
        (board[0][0].getValue() == board[0][1].getValue() && board[0][1].getValue() == board[0][2].getValue() && board[0][0].getValue()!='0') ||
        (board[1][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[1][2].getValue() && board[1][0].getValue()!='0') ||
        (board[2][0].getValue() == board[2][1].getValue() && board[2][1].getValue() == board[2][2].getValue() && board[2][0].getValue()!='0') ||
        
        (board[0][0].getValue() == board[1][0].getValue() && board[1][0].getValue() == board[2][0].getValue() && board[0][0].getValue()!='0') ||
        (board[0][1].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][1].getValue() && board[0][1].getValue()!='0') ||
        (board[0][2].getValue() == board[1][2].getValue() && board[1][2].getValue() == board[2][2].getValue() && board[0][2].getValue()!='0') ||
        
        (board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][2].getValue() && board[0][0].getValue()!='0') ||
        (board[2][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[0][2].getValue() && board[2][0].getValue()!='0')   
      ) return true;
      return false;
    }
    
    const checkTie = () => {
        const board = playboard.getBoard();

        return board.every(row =>
            row.every(cell => cell.getValue() !== '0')
        );
    };
    const playTurn = (r, c) => {
        if(gameOver) return;
      
        let board = playboard.getBoard();
        if(board[r][c].getValue() != '0') return;
        playboard.setMarker(getActivePlayer().token, r, c);
        if(checkWinner()){
          gameOver = true;
          gameStatus = `${getActivePlayer().name} Wins!`;
          playboard.printBoard();
          console.log(`${getActivePlayer().name} is the winner`);
          return;
        }
        else if(checkTie()){
          gameOver = true;
          gameStatus = "Match was a TIE";
          playboard.printBoard();
          console.log("Match was a TIE");
          return;
        }

        switchPlayer();
        printTurn();
    };
    const isGameOver= () => gameOver;
    const getGameStatus = () => gameStatus;
    
    printTurn();

    return {playTurn, getActivePlayer, getBoard:playboard.getBoard, isGameOver, getGameStatus};

};

function ScreenController(){
    const game = GameController();

    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");

    const updateScreen = () =>{
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        turnDiv.textContent = game.isGameOver()? game.getGameStatus():`${activePlayer.name}'s turn`;

        board.forEach((row, rowind) => {
            row.forEach((cell, colind) =>{
                const cellbtn = document.createElement("button");
                cellbtn.classList.add("cell");

                cellbtn.dataset.column = colind;
                cellbtn.dataset.row = rowind;
                cellbtn.textContent = cell.getValue()==='0'?'':cell.getValue();
                boardDiv.appendChild(cellbtn);
            })
            
        });
    };
    function boarClickHandler(e){
        const col = e.target.dataset.column;
        const row = e.target.dataset.row;
        if(col === undefined || row===undefined) return;

        game.playTurn(Number(row), Number(col));
        updateScreen();
    }
    boardDiv.addEventListener("click", boarClickHandler);

    updateScreen();
}

ScreenController();
const reset = document.querySelector(".reset-btn");

reset.addEventListener("click", ScreenController);