//Pieces
const black = `<div class = 'pieceCont black' id = 'blackPiece'><img class = 'piece black' src='./svgs/blackpiece.svg' alt = 'o'></div>`;
const blackKing = `<img class = 'piece black king' src='./svgs/blackking.svg' alt = 'ok'>`;
const white = `<div class = 'pieceCont white' id = 'whitePiece'><img class = 'piece white' src='./svgs/whitepiece.svg' alt = 'o'></div>`;
const whiteKing = `<img class = 'piece white king' src='./svgs/whiteking.svg' alt = 'ok'>`;

//game

const board = document.querySelector("#board");
const text = document.querySelector("#textArea");
const ErrorText = document.querySelector('.errorMessage')
let turn = 'black'
text.textContent = 'black'
function opponent() {
    return turn === 'black' ? 'white' : 'black'
}

const startingPosition = [
    '', black, '', black, '', black, '', black,
    black, '', black, '', black, '', black, '',
    '', black, '', black, '', black, '', black,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    white, '', white, '', white, '', white, '',
    '', white, '', white, '', white, '', white,
    white, '', white, '', white, '', white, '',
]

function createBoard() {
    startingPosition.forEach((piece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.setAttribute('sqId', i)
        const row = Math.floor(i / 8) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige')
        } else {
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown')
        }
        square.innerHTML = piece
        square.firstChild && square.firstChild.setAttribute('draggable', true)
        board.append(square)
    })
}

createBoard()

const allSquares = document.querySelectorAll('.square')
let pieceToMove;
let initialPosition;
let finalPosition;
let finalSquare;
allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStartHandler)
    square.addEventListener('dragover', (e) => { e.preventDefault() })
    square.addEventListener('drop', dropHandler)
    /* square.addEventListener('click', clickHandler) */
})
function dragStartHandler(e) {
    pieceToMove = e.target
    console.log(pieceToMove)
    initialPosition = Number(e.target.parentNode.getAttribute('sqId'))
}
function dropHandler(e) {
    e.stopPropagation()
    const promotionPlaces = [56, 58, 60, 62]
    finalSquare = e.target
    finalPosition = Number(e.target.classList.contains('pieceCont') ? e.target.parentNode.getAttribute('sqId') : e.target.getAttribute('sqId'))
    const validMove = validMoveChecker()
    console.log(validMove)
    if (validMove) {
        console.log('valid')
        if (e.target.firstChild) {
            console.log('here maybe1')
            e.target.append(pieceToMove)
            e.target.firstChild.remove()
        }
        else {
            console.log('here maybe2')
            e.target.append(pieceToMove)
        }
        if (promotionPlaces.indexOf(finalPosition) !== -1 && !pieceToMove.firstChild.classList.contains('king')) {
            const color = pieceToMove.classList.contains('white') ? 'white' : 'black'
            console.log('the color to promote is ', color)
            e.target.firstChild.firstChild.remove()
            e.target.firstChild.innerHTML = color === 'white' ? whiteKing : blackKing

        }
        turn = turn === 'black' ? 'white' : 'black'
        text.textContent = turn
        reverseSqId()
    }
}

/* function clickHandler(e) {
    pieceToMove = e.target
    initialPosition = Number(e.target.parentNode.getAttribute('sqId'))
    const possiblePositions = [initialPosition + 7, initialPosition + 9]
    possiblePositions.forEach((position) => {
        const squarePosition = document.querySelector(`[sqId = "${position}"]`)
        if (squarePosition.classList.contains('brown') && !squarePosition.firstChild) {
            squarePosition.innerHTML = `<div class = 'circle'></div>`
        }
    })
} */

function validMoveChecker() {
    if (initialPosition === finalPosition) {
        return false
    }
    if (!finalSquare.classList.contains('brown')) {
        ErrorText.textContent = 'Invalid Square.'
        setTimeout(() => {
            ErrorText.textContent = ''
        }, 2000);
        return
    }
    if (pieceToMove.firstChild.classList.contains('white') && turn === 'black' ||
        pieceToMove.firstChild.classList.contains('black') && turn === 'white') {

        ErrorText.textContent = 'NOT YOUR TURN.'
        setTimeout(() => {
            ErrorText.textContent = ''
        }, 2000);
        return false
    }
    if (finalPosition === initialPosition + 7 && !finalSquare.firstChild ||
        finalPosition === initialPosition + 9 && !finalSquare.firstChild) {
        return true
    }
    if (finalPosition === initialPosition + 14 && !finalSquare.firstChild && document.querySelector(`[sqId = "${(initialPosition + finalPosition) / 2}"]`).firstChild && document.querySelector(`[sqId = "${(initialPosition + finalPosition) / 2}"]`).firstChild.classList.contains(opponent()) ||
        finalPosition === initialPosition + 18 && !finalSquare.firstChild && document.querySelector(`[sqId = "${(initialPosition + finalPosition) / 2}"]`).firstChild && document.querySelector(`[sqId = "${(initialPosition + finalPosition) / 2}"]`).firstChild.classList.contains(opponent())) {
        //belahut
        document.querySelector(`[sqId = "${(initialPosition + finalPosition) / 2}"]`).firstChild.remove()
        if (!doneEating(finalPosition)) {
            turn = turn === 'black' ? 'white' : 'black'
            text.textContent = turn
            reverseSqId()
        }
        return true
    }
    if (pieceToMove.firstChild.classList.contains('king')) {
        console.log('king')
        const leftpossibleKing = [7, 14, 21, 28, 35, 42, 49]
        const rightpossibleKing = [9, 18, 27, 36, 45, 54, 63]
        let leftanswer = false
        let rightanswer = false
        leftpossibleKing.forEach((position, index) => {
            if (finalPosition === initialPosition - position && !finalSquare.firstChild ||
                finalPosition === initialPosition + position && !finalSquare.firstChild) {
                if (noOneInBetween(leftpossibleKing, index)) {
                    leftanswer = true
                }
                if (canTheKingEat(leftpossibleKing, index)) {
                    leftanswer = true
                }
            }
        })
        rightpossibleKing.forEach((position, index) => {
            if (finalPosition === initialPosition - position && !finalSquare.firstChild ||
                finalPosition === initialPosition + position && !finalSquare.firstChild) {
                if (noOneInBetween(rightpossibleKing, index)) {
                    console.log('here you2')
                    rightanswer = true
                }
                if (canTheKingEat(rightpossibleKing, index)) {
                    leftanswer = true
                }
            }
        })

        if (leftanswer || rightanswer) {
            return true
        }

    }

}
function noOneInBetween(arr, index) {
    if (finalPosition > initialPosition) {
        for (let i = 0; i < index; i++) {
            if (document.querySelector(`[sqId = "${initialPosition + arr[i]}"]`).firstChild) {
                return false
            }
        }
    } else {
        for (let i = 0; i < index; i++) {
            if (document.querySelector(`[sqId = "${initialPosition - arr[i]}"]`).firstChild) {
                return false
            }
        }
    }
    return true
}
function canTheKingEat(arr, index) {
    if (finalPosition > initialPosition) {
        if (noOneInBetween(arr, (index - 1)) && document.querySelector(`[sqId = "${initialPosition + arr[index - 1]}"]`).firstChild && document.querySelector(`[sqId = "${initialPosition + arr[index - 1]}"]`).firstChild.classList.contains(opponent())) {
            document.querySelector(`[sqId = "${initialPosition + arr[index - 1]}"]`).firstChild.remove()
            if (!kingDoneEating(finalPosition)) {
                turn = turn === 'black' ? 'white' : 'black'
                text.textContent = turn
                reverseSqId()
            }
            return true
        }
    }
    else {
        if (noOneInBetween(arr, (index - 1)) && document.querySelector(`[sqId = "${initialPosition - arr[index - 1]}"]`).firstChild && document.querySelector(`[sqId = "${initialPosition - arr[index - 1]}"]`).firstChild.classList.contains(opponent())) {
            document.querySelector(`[sqId = "${initialPosition - arr[index - 1]}"]`).firstChild.remove()
            if (!kingDoneEating(finalPosition)) {
                turn = turn === 'black' ? 'white' : 'black'
                text.textContent = turn
                reverseSqId()
            }
            return true
        }
    }
}


function doneEating(initial) {
    const potentialNextPositions = [initial + 14, initial + 18]
    const isTaken = potentialNextPositions.map((position) => {
        console.log('position', position)
        if (position >= 64 || position < 0) {
            return 'taken'
        }
        if (document.querySelector(`[sqId = "${position}"]`).classList.contains('beige')) {
            return 'taken'
        }
        if (!document.querySelector(`[sqId = "${position}"]`).firstChild) {
            return 'clean'
        }
        else {
            return 'taken'
        }
    })

    const isOpponent = [initial + 7, initial + 9].map((position) => {
        if (position >= 64 || position < 0) {
            return 'no'
        }
        if (document.querySelector(`[sqId = "${position}"]`).firstChild && document.querySelector(`[sqId = "${position}"]`).firstChild.classList.contains(opponent())) {
            return 'yes'
        }
        else {
            return 'no'
        }
    })
    for (let i = 0; i < 2; i++) {
        if (isTaken[i] === 'clean' && isOpponent[i] === 'yes') {
            return false
        }
    }
    return true
}
function kingDoneEating(initial) {
    //here is the work where it will conitnue.
    return true
}

function reverseSqId() {
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square) => {
        const newId = 63 - Number(square.getAttribute('sqId'))
        square.setAttribute('sqId', newId)
    })
}




