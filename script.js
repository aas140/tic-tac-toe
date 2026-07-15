const Gameboard = (() => {
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
});

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
          playboard.printBoard();
          console.log(`${getActivePlayer().name} is the winner`);
          return;
        }
        else if(checkTie()){
          gameOver = true;
          playboard.printBoard();
          console.log("Match was a TIE");
          return;
        }

        switchPlayer();
        printTurn();
    };
    
    printTurn();

    return {playTurn, getActivePlayer};

};