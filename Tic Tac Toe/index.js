const playerInfo = document.querySelector(".player-info");
const boxes = document.querySelectorAll(".box");
const newGameBtn = document.querySelector(".new-game-btn");

let currentPlayer;
let gameGrid;

const winningCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

//initialize the game
function initGame() {
    currentPlayer = 'X';
    gameGrid = ["", "", "", "", "", "", "", "", ""];
    //empty boxes of tic tac toe
    boxes.forEach((box) => {
        box.innerText = "";
        box.style.pointerEvents = "all";
        box.classList.remove("win");
    });
    playerInfo.innerText = `Current Player - ${currentPlayer}`;
    newGameBtn.classList.remove('active');
}

initGame();

// swap player turns
function swapTurn() {
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
    }
    else {
        currentPlayer = 'X';
    }
    playerInfo.innerText = `Current Player - ${currentPlayer}`;
}


// game over function
function checkGameOver() {
    let answer = "";
    winningCombo.forEach((position) => {
        
        if ((gameGrid[position[0]] !== "" && gameGrid[position[1]] !== "" && gameGrid[position[2]] !== "") && (gameGrid[position[0]] === gameGrid[position[1]] && gameGrid[position[1]] === gameGrid[position[2]])) {
            
            //console.log("winner");
            // check for winner x
            if (gameGrid[position[0]] === 'X')
                answer = 'x';
            else
                answer = 'O';
            
            
            //disable pointer events
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            })

            //add win color to boxes
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });


    // we got our winner
    if (answer !== "") {
        playerInfo.innerText = `Winner Player - ${answer}`;
        newGameBtn.classList.add('active');
        return;
    }

    //No winner found, check for tie
    let fillCount = 0;
    gameGrid.forEach((box) => {
        if (box !== "")
            fillCount++;
    });

    if (fillCount === 9) {
         playerInfo.innerText = `Game Tied !`;
         newGameBtn.classList.add("active");
    }
}

// function run when box is clicked
function handleClick(index) {
    if (boxes[index].innerText === "") {
        boxes[index].innerText = `${currentPlayer}`;
        gameGrid[index] = currentPlayer;
        boxes[index].style.pointerEvents = 'none';
        // swap turn X to 0 or vice versa
        swapTurn();
        //check for winning combination
        checkGameOver();

    }
}

// add click event to each box
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        handleClick(index);
    });
});

//add eventlistener to new game button
newGameBtn.addEventListener('click', () => {
    initGame();
})
