// array as board, fixed count
let board = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
]

// elements
let snakeIndex = [67,75];

let appleIndex = 20;
let listOfAppleFree = []

let moveLeft = false;
let moveRight = false;
let moveUp = true;
let moveDown = false;

let speed = 600;

let defPass = true;

const boardDiv = document.getElementById('board-div');
const gameButton = document.getElementById('game-button');
const controlToggleButton = document.getElementById('control-toggle');
const controlsButton = document.querySelectorAll('.controls-button');
const controlDiv = document.getElementById('#controls-div');

// initial draw call
draw(board);

// early DOM configuration
gameButton.onclick = gameOn;
controlToggleButton.onclick = controlsToggle;
controlsButton.forEach(btn => btn.onclick = function(){inputKey(btn.id)});

// control essentials
document.addEventListener('keydown', (e) => {
    inputKey(e.key.toLowerCase());
})

function controlsToggle() {
    if (controlToggleButton.innerHTML === "show control buttons?") {
        controlDiv.style.display = "flex";
        controlToggleButton.innerHTML = "hide control buttons?"
    } else {
        controlDiv.style.display = "none";
        controlToggleButton.innerHTML = "show control buttons?"
    }
}

function inputKey(key) {
    if (gameButton.innerHTML !== 'click me to play!' && gameButton.innerHTML !== 'aw! wanna try again?') {
        switch(key) {
            case 'arrowup':
            case 'w':
                if (snakeIndex[0]-8 === snakeIndex[1]) {
                    break;
                } else {
                    moveUp = true;
                    moveRight = false;
                    moveLeft = false;
                    moveDown = false;
                    }
                break;
            case 'arrowleft':
            case 'a':
                if (snakeIndex[0]-1 === snakeIndex[1]) {
                    break;
                } else {
                    moveLeft = true;
                    moveUp = false;
                    moveRight = false;
                    moveDown = false;
                }
                break;
            case 'arrowright':
            case 'd':
                if (snakeIndex[0]+1 === snakeIndex[1]) {
                break;
                } else {
                    moveRight = true;
                    moveUp = false;
                    moveLeft = false;
                    moveDown = false;
                }
                break;
            case 'arrowdown':
            case 's':
                if (snakeIndex[0]+8 === snakeIndex[1]) {
                break;
                } else {
                        moveDown = true;
                        moveUp = false;
                        moveRight = false;
                        moveLeft = false;
                    }
                break;
        };
    }         
};

// sets new speed
function newSpeed() {
    speed = 600 -(( 1/( board.length/snakeIndex.length) )*200);
};

// sets new list of snake-free index for next apple
function refreshAppleFree() {
    let freeArr = [];
    for (let i = 0; i < board.length; i++) {
        if (!snakeIndex.some(x => x === i)) {
            freeArr.push(i);
        };
    };
    listOfAppleFree = freeArr;
}

// generate random index for next apple
function newAppleIndex() {
    let rndm = Math.floor(Math.random() * (( listOfAppleFree.length -1 )- 0 + 1) + 0);
    return rndm;
}

// resets the #board-div with a new fresh updated divs ;)
function draw(board) {
    if (boardDiv.innerHTML === '') {
        board.forEach(( e, i) => {

            const cell = document.createElement('div')
            boardDiv.appendChild(cell);

            cell.id = i
            cell.classList.add('cells');
            cell.style.backgroundColor = '#212121';

            detectSnakeOrApple(cell, i);
        });
    }   else {
            board.forEach(( e, i) => {
                const cell = document.getElementById(i);
                cell.style.backgroundColor = '#212121';

                if(cell.innerHTML === ':' && i !== snakeIndex[0]) {
                    cell.innerHTML = '';
                    cell.classList.remove('cell-head');
                    cell.style.transform = '';
                }

                detectSnakeOrApple(cell, i);
            });
        }
}

function detectSnakeOrApple(cell, i) {
    if(snakeIndex.some(x => x === i)) {
        if(i === snakeIndex[0]) {
            cell.classList.add('cell-head');
            cell.innerHTML = ':';

            let numDeg = moveUp ? 90 : moveRight ? 180 : moveDown ? 270 : 0
            cell.style.transform = `rotate(${numDeg}deg)`
        };    
        cell.style.backgroundColor = '#4df163';
    }   else if(i === appleIndex) {
            cell.style.backgroundColor = '#ff5959';
        };
}

// resets necessary game elements
function reset() {
    
    snakeIndex = [75,83];
    
    appleIndex = 20;
    listOfAppleFree = []
    
    moveLeft = false;
    moveRight = false;
    moveUp = true;
    moveDown = false;
    
    speed = 600;
    
    boardDiv.onclick = () => {defPass = true; gameOn()};
    gameButton.onclick = () => {defPass = true; gameOn()};
    gameButton.innerHTML = 'click me to play!';
    boardDiv.style.filter = '';
    
};

// starts the game with setInterval() and renderBoard()
function gameOn() {
    boardDiv.style.filter = ''
    // recalls renderBoard() for every speed in milliseconds
    let interval = setInterval(() => renderBoard(), speed);
    
    // instruction before first apple gets eaten
    gameButton.innerHTML = '(w, a, s, d) are the controls!';
    
    // disable the unnecessary button for gameplay
    boardDiv.onclick = '';
    gameButton.onclick = '';
    
    // use of localStorage to clean interval later on other function
    localStorage.clear();
    localStorage.setItem('game-interval', interval);
}

// render the game by the game rules
function renderBoard() {
    // if snake eats apple
    if (snakeMove(snakeIndex[0]) === appleIndex) {
        // adds apple index to snake
        snakeIndex.unshift(appleIndex)

        // new apple function
        refreshAppleFree();
        appleIndex = listOfAppleFree[newAppleIndex()];

        newSpeed();

        // refreshes the render calls for new speed
        gameOff();
        gameOn();

        // gameboard update
        gameButton.innerHTML = 
            `<div class="apple-count">${94-(board.length - snakeIndex.length)}/94</div> &nbsp; apples, &nbsp;<div class="speed-count">${(600/speed).toFixed(2)}x</div> &nbsp; speed`;
    } else {
        // else if snake dont eats apple
        snakeIndex = snakeIndex.map((pos, i) => i === 0 ? snakeMove(pos): snakeIndex[i-1] );
    }
    
    // win or defeat checker
    winTest();
    defTest();

    if (defPass) {
        draw(board);
    }
}

// stops the game with clearInterval()
function gameOff() {
    clearInterval( localStorage.getItem('game-interval') );
}

function snakeMove(pos) {
    // basic math to move snake in array w/ restrictions
    if (moveUp) {
        return pos-8;
    } else if (moveDown) {
        return pos+8;
    } else if (moveLeft) {
        return pos-1;
    } else if (moveRight) {
        return pos+1;
    }
}

function winTest() {
    // basic logic to detect win win
    if (snakeIndex.length >= board.length) {
        gameOff();
        gameButton.innerHTML = 'nc! wanna play again?';
        gameButton.onclick = gameOn;
    }
}

function defTest() {
    // to call if proven lose
    function provenLose() {
        reset();
        gameOff();
        defPass = false;
        gameButton.innerHTML = 'aw! wanna try again?';
        boardDiv.style.filter = 'brightness(80%)';
    };

    // some impromptu maths to detect snake move violations
    if (snakeIndex.indexOf(snakeIndex[0]) !== snakeIndex.lastIndexOf(snakeIndex[0])) {
        provenLose();
    } else if (snakeIndex[0] < 0 || snakeIndex[0] > board.length-1) {
        provenLose();
    } else if ((moveLeft && (snakeIndex[0]+1)%8 === 0) || (moveRight && (snakeIndex[0]+8)%8 === 0)) {
        provenLose();
    }
    
}
