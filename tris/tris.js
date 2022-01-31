import Board from "../board.js"

const STYLEA = {
  'background-color': 'red',
  'border': 'darkred 5px solid',
  'border-radius': '40px',
  'box-shadow': '0 7px 1px #00000050',
  'width': '70%',
  'height': '70%',
}

const STYLEB = {
  'background-color': 'blue',
  'border': 'darkblue 5px solid',
  'border-radius': '40px',
  'box-shadow': '0 7px 1px #00000050',
  'width': '70%',
  'height': '70%',
}

let turn = 0
let winner = null
const b = new Board(3).style({
  'width': '400px',
  'height': '400px',
  'margin': 'auto',
  'margin-top': '10px',
  'border-radius': '15px',
  'box-shadow': '0 15px 1px black',
  'border': '5px solid black',
})


b.onCellClick((cellId) => {
  if (winner)
    return
  
  if (document.getElementById(cellId).hasChildNodes()) 
    return

  // create new cell
  b.createElement(...cellId.split(';')).style(turn == 0 ? STYLEA : STYLEB).addClass(turn == 0 ? 'A' : 'B')

  // check winner
  winner = checkWinner()

  if (winner) {
    winAnimation(winner)
  } else {
    nextTurn()
  }
})


function checkWinner() {
  //check winner
  for (let i = 0; i < b.board.childElementCount; i++) {
    const cell = b.board.children[i]
    const [x, y] = cell.id.split(';').map(n => parseInt(n))
    
    let next1, next2

    const wins = (player, c1, c2, c3) => {
      return c1.children[0]?.classList.contains(player) 
        && c2?.children[0]?.classList.contains(player) 
        && c3?.children[0]?.classList.contains(player) 
    }

    // oblique right
    if (x == 0 && y == 0) {
      next1 = document.getElementById(`${x+1};${y+1}`)
      next2 = document.getElementById(`${x+2};${y+2}`)

      if (wins('A', cell, next1, next2)) {
        return ['A', cell.id, next1.id, next2.id]
      } else if (wins('B', cell, next1, next2)) {
        return ['B', cell.id, next1.id, next2.id]
      }
    }

    // oblique left
    if (x == 2 && y == 0) {
      next1 = document.getElementById(`${x-1};${y+1}`)
      next2 = document.getElementById(`${x-2};${y+2}`)
      
      if (wins('A', cell, next1, next2)) {
        return ['A', cell.id, next1.id, next2.id]
      } else if (wins('B', cell, next1, next2)) {
        return ['B', cell.id, next1.id, next2.id]
      }
    }

    // right
    if (x == 0) {
      next1 = document.getElementById(`${x+1};${y}`)
      next2 = document.getElementById(`${x+2};${y}`)

      
      if (wins('A', cell, next1, next2)) {
        
        return ['A', cell.id, next1.id, next2.id]
      } else if (wins('B', cell, next1, next2)) {
        console.log(cell, next1, next2)
        return ['B', cell.id, next1.id, next2.id]
      }
    }

    // down
    if (y == 0) {
      next1 = document.getElementById(`${x};${y+1}`)
      next2 = document.getElementById(`${x};${y+2}`)

      if (wins('A', cell, next1, next2)) {
        return ['A', cell.id, next1.id, next2.id]
      } else if (wins('B', cell, next1, next2)) {
        return ['B', cell.id, next1.id, next2.id]
      }
    }
  }
}

function winAnimation(winner) {
  const backgroundColor = winner[0] == 'A' ? '#ffa0a0' : '#a0a0ff'

  document.getElementById(winner[1]).style.backgroundColor = backgroundColor
  document.getElementById(winner[2]).style.backgroundColor = backgroundColor
  document.getElementById(winner[3]).style.backgroundColor = backgroundColor
}

function nextTurn() {
  turn = (turn + 1) % 2
  const turn_icon = document.getElementById('turn_icon')
  turn_icon.style.backgroundColor = turn == 0 ? 'red' : 'blue'
  turn_icon.style.borderColor = turn == 0 ? 'darkred' : 'darkblue'
  // document.getElementById('turn').innerHTML = turn == 0 ? 'A' : 'B'
  // document.getElementById('turn').style.color = turn == 0 ? 'red' : 'green'
}

document.getElementById('reset').addEventListener('click', () => {
  winner = null
  turn = 0
  const turn_icon = document.getElementById('turn_icon')
  turn_icon.style.backgroundColor = turn == 0 ? 'red' : 'blue'
  turn_icon.style.borderColor = turn == 0 ? 'darkred' : 'darkblue'

  for (let i = 0; i < b.board.childElementCount; i++)
    b.board.children[i].style.backgroundColor = 'white'

  b.reset()
})



