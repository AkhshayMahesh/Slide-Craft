let squares = Array.from(document.getElementsByClassName('square'));
var board = solution = []
let BOARD_SIZE 
let emptyIndex = BOARD_SIZE * BOARD_SIZE - 1;
let moveCount = 0
let imageUrl
let menu = document.querySelector('.menu');
isOpened = false;
let menu1 = document.querySelector('.menu1');
isOpened1 = false;
let menu2 = document.querySelector('.menu2');
isOpened2 = false;

window.onload = () => {
    document.getElementById('size').showModal()
}

function size(n){
    BOARD_SIZE=n
    emptyIndex = BOARD_SIZE * BOARD_SIZE - 1;
    closeModals()
    initGame()
}

function initGame() {
    createBoard()
    shuffleBoard()
    isOpened = false;
    isOpened1 = false;
    isOpened2 = false;
    if (imageUrl) { drawBoard() }
    else { imageUrl = ''; drawBoard() }
}

menu.addEventListener('click', function () {
    if (isOpened) {
        menu.classList.remove('opened');
    } else {
        menu.classList.add('opened');
    }
    isOpened = !isOpened;
});

menu1.addEventListener('click', function () {
    if (isOpened1) {
        menu1.classList.remove('opened');
    } else {
        menu1.classList.add('opened');
    }
    isOpened1 = !isOpened1;
});

menu2.addEventListener('click', function () {
    if (isOpened2) {
        menu2.classList.remove('opened');
    } else {
        menu2.classList.add('opened');
    }
    isOpened2 = !isOpened2;
});

function encodeImageURL(url) {
    const encodedURL = btoa(url);
    return encodedURL;
}
function decodeImageURL(encodedURL) {
    const url = atob(encodedURL);
    return url;
}
function encodePuzzleBoard(board) {
    const encodedBoard = btoa(JSON.stringify(board))
    return encodedBoard;
}
function decodePuzzleBoard(encodedBoard) {
    const board = JSON.parse(atob(encodedBoard))
    return board;
}

function saveState(n) {
    let currState = {
        imginfo: encodeImageURL(imageUrl),
        binfo: encodePuzzleBoard(board)
    }
    stateArr = JSON.parse(localStorage.getItem('stateArr'))
    if (stateArr == null || stateArr == undefined) {
        stateArr = []
    }
    c = stateArr.length
    if (c < n) {
        for (let i = 0; i < n - c; i++) {
            stateArr.push(null)
        }
    }
    stateArr.splice(n, 1, currState)
    localStorage.setItem("stateArr", JSON.stringify(stateArr));
    imageUrl = ''
    // reset()
    document.getElementById("msg").innerHTML+=`-${n}!!`
    document.getElementById("saved").showModal()
}

function loadState(n) {
    stateArr = JSON.parse(localStorage.getItem('stateArr'))
    imageUrl = decodeImageURL(stateArr[n].imginfo)
    board = decodePuzzleBoard(stateArr[n].binfo)
    BOARD_SIZE=Math.sqrt(board.length)
    emptyIndex = BOARD_SIZE * BOARD_SIZE - 1;
    setBoard()
    drawBoard()
}

function openfile(){
    document.getElementById('browse').showModal()
    const imageUploadInput = document.getElementById('image-upload');
    imageUploadInput.addEventListener('change', function () {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function openurl(){
    document.getElementById('url').showModal()
    const imageUrlInput = document.getElementById('image-url');
    imageUrlInput.addEventListener('change', function () {
        imageUrl = this.value;
    });
}

function closeModals(){
    drawBoard()
    Array.from(document.getElementsByTagName('dialog')).forEach(element => {
        element.close()
    });
}

function createBoard() {
    board = []
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        let tile = {
            row: Math.floor(i / BOARD_SIZE),
            col: i % BOARD_SIZE,
            index: i
        };
        board.push(tile);
    }
    setBoard()
}

function setBoard(){
    document.getElementById('container').style.gridTemplateColumns = `repeat(${BOARD_SIZE},1fr)`
    document.getElementById('container').style.gridTemplateRows = `repeat(${BOARD_SIZE},1fr)`
}

function shuffleBoard() {
    let arr = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    for (let i = 0; i < 30; i++) {
        let e = board.findIndex((tile) => { return tile.index == emptyIndex })
        let num = Math.floor(Math.random() * 4)
        r = board[e].row
        c = board[e].col
        r += arr[num][0]
        c += arr[num][1]
        if (r >= BOARD_SIZE || c >= BOARD_SIZE || r < 0 || c < 0) {
            i -= 1
            continue
        }
        let temp = board.findIndex((tile) => { return tile.row == r && tile.col == c })
        let temp2 = board[temp].index
        board[temp].index = board[e].index
        board[e].index = temp2
    }
    drawBoard()
}

function drawBoard() {
    let gameBoard = document.getElementById("container");
    gameBoard.innerHTML = "";
    gameBoard.style.backgroundSize = '100% 100%';
    for (let i = 0; i < board.length; i++) {
        let tile = board[i];
        let tileDiv = document.createElement("div");
        tileDiv.classList.add("square");
        if (imageUrl != '') { tileDiv.classList.add("imgNum"); }
        tileDiv.style.backgroundImage = `url(${imageUrl})`;
        tileDiv.innerHTML = `${tile.index + 1}`
        tileDiv.style.backgroundPosition = `-${tile.index % BOARD_SIZE * 100}% -${Math.floor(tile.index / BOARD_SIZE) * 100}%`;
        tileDiv.style.backgroundSize = `${BOARD_SIZE}00% ${BOARD_SIZE}00%`;
        if (tile.index == emptyIndex) {
            tileDiv.innerHTML = ''
            tileDiv.style.opacity='0.4'
            tileDiv.style.backgroundPosition = `-${tile.col * 100}% -${tile.row * 100}%`;
        }
        gameBoard.append(tileDiv)
        tileDiv.onclick = function () {
            let e = board.findIndex((tile) => { return tile.index == emptyIndex })
            if ((i % BOARD_SIZE == e % BOARD_SIZE && (Math.abs(Math.floor(i / BOARD_SIZE) - Math.floor(e / BOARD_SIZE)) == 1)) || ((Math.floor(i / BOARD_SIZE) == Math.floor(e / BOARD_SIZE)) && (Math.abs(i % BOARD_SIZE - e % BOARD_SIZE) == 1))) {
                let r = tile.index
                tile.index = board[e].index
                board[e].index = r
                drawBoard()
                moveCount++
                checkWin()
            }
        }
    }
}

function checkWin() {
    let correctOrder = board.slice(0, BOARD_SIZE * BOARD_SIZE - 1).map(square => parseInt(square.index));
    if (correctOrder.every((num, index) => num === index))
        document.getElementById("over").showModal()
}

class Node {
    constructor(data, level, fval, parent) {
        this.data = data;
        this.level = level;
        this.fval = fval;
        this.parent = parent
    }

    generateChild() {
        const [x, y] = this.find(this.data, '_');
        const valList = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]];
        const children = [];
        for (const i of valList) {
            const child = this.shuffle(this.data, x, y, i[0], i[1]);
            if (child !== null) {
                const childNode = new Node(child, this.level + 1, 0);
                children.push(childNode);
            }
        }
        return children;
    }

    shuffle(puz, x1, y1, x2, y2) {
        if (x2 >= 0 && x2 < puz.length && y2 >= 0 && y2 < puz.length) {
            const tempPuz = this.copy(puz);
            const temp = tempPuz[x2][y2];
            tempPuz[x2][y2] = tempPuz[x1][y1];
            tempPuz[x1][y1] = temp;
            return tempPuz;
        }
        else {
            return null;
        }
    }

    copy(root) {
        const temp = [];
        for (const i of root) {
            const t = [...i];
            temp.push(t);
        }
        return temp;
    }

    find(puz, x) {
        for (let i = 0; i < puz.length; i++) {
            for (let j = 0; j < puz.length; j++) {
                if (puz[i][j] === x) {
                    return [i, j];
                }
            }
        }
    }
}

class Puzzle {
    constructor(size, start, goal) {
        this.n = size;
        this.open = [];
        this.closed = new Set();
        this.start = start
        this.goal = goal
        this.solution = []
    }
    f(start, goal) {
        return this.h(start.data, goal) + start.level;
    }
    h(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (start[i][j] !== goal[i][j] && start[i][j] !== '_') {
                    temp += 1;
                }
            }
        }
        return temp;
    }
    boardToString(board) {
        return board.map(row => row.join('')).join('');
    }

    has(set, item) {
        for (const val of set) {
            if (val === item) {
                return true;
            }
        }
        return false;
    }

    process() {
        const start = this.start
        const goal = this.goal

        const startNode = new Node(start, 0, 0, null);
        const startString = this.boardToString(startNode.data);
        startNode.fval = this.f(startNode, goal);
        this.open.push(startNode);
        this.closed.add(startString);
        while (true) {
            console.log("Finding Best possible route....")
            const cur = this.open[0];
            if (this.h(cur.data, goal) === 0) {
                break;
            }
            for (const child of cur.generateChild()) {
                const boardString = this.boardToString(child.data);
                if (!this.has(this.closed, boardString)) {
                    child.fval = this.f(child, goal);
                    child.parent = cur;
                    this.open.push(child);
                    this.closed.add(boardString);
                }
            }
            const curString = this.boardToString(cur.data);
            this.closed.add(curString);
            this.open.shift();
            this.open.sort((a, b) => a.fval - b.fval);
        }

        let currentNode = this.open[0];
        const steps = [];
        while (currentNode !== null) {
            steps.push(currentNode.data);
            currentNode = currentNode.parent;
        }
        return steps
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function solveIt() {
    curr = []
    temp = []
    for (let i = 0; i < board.length; i++) {
        temp.push((board[i].index == emptyIndex) ? "_" : board[i].index + 1)
        if (temp.length == BOARD_SIZE) {
            curr.push([...temp])
            temp = []
        }
    }
    goal = []
    temp1 = []
    for (let i = 0; i < board.length; i++) {
        temp1.push(i + 1)
        if (temp1.length == BOARD_SIZE) {
            goal.push([...temp1])
            temp1 = []
        }
    }
    solution = solve(curr, goal)
    if (solution) {
        for (let i = solution.length - 1; i >= 0; i--) {
            indexArr = []
            temp = [...solution[i]]
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let k = 0; k < BOARD_SIZE; k++) {
                    if (temp[j][k] == '_') { temp[j][k] = emptyIndex + 1 }
                    indexArr.push(temp[j][k] - 1)
                }
            }
            for (let m = 0; m < board.length; m++) {
                board[m].index = indexArr[m]
            }
            drawBoard()
            await delay(600)
        }
    }
    await delay(1200)
    document.getElementById("solved").showModal()
}

function solve(curr, goal) {
    const puz = new Puzzle(BOARD_SIZE, curr, goal);
    return puz.process();
}
