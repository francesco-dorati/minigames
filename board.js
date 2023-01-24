class Board {
  constructor(width, height) {
    this.width = width
    this.height = height

    // create html grid
    this.board = document.getElementById('board')
    if (!this.board) {
      throw "No element with id='board'"
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // create cell
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = `${x};${y}`

        this.board.appendChild(cell)
      }
    }

    this.style({
      'display': 'grid',
      'gap': '0px',
      'grid-template-columns': `repeat(${this.width}, auto)`,
      'grid-template-rows': `repeat(${this.height}, auto)`,

      'width': '500px',
      'height': '500px',
      'margin': 'auto',
      'border': '5px solid black',
    })
    
    this.cellStyle({
      'position': 'relative',
      'border': '2px solid black',
      'background-color': 'white',
    })
  }

  createElement(x, y) {
    // validate coordinates
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      console.error(`Coordinates out of index: ${[x, y]}`)
    }

    return new Element(x, y)
  }

  get randomCoordinates() {
    return [parseInt(Math.random() * (this.width - 1)), parseInt(Math.random() * (this.height - 1))]
  }

  style(styleDict) {
    for (const a in styleDict) {
      this.board.style[a] = styleDict[a]
    }

    // round corner cells
    if (styleDict['border-radius']) {
      const radius = `${parseInt(styleDict['border-radius'].replace('px', '')) - 5}px`
      document.getElementById('0;0').style.borderRadius = `${radius} 0 0 0`
      document.getElementById(`0;${this.height-1}`).style.borderRadius = `0 0 0 ${radius}`
      document.getElementById(`${this.width-1};0`).style.borderRadius = `0 ${radius} 0 0`
      document.getElementById(`${this.width-1};${this.height-1}`).style.borderRadius = `0 0 ${radius} 0`
    }
    return this
  }
  
  cellStyle(styleDict) {
    for (let i = 0; i < this.board.childElementCount; i++) {
      const cell = this.board.children[i]
      for (const a in styleDict) {
        cell.style[a] = styleDict[a]
      }
    }

    return this
  }

  onCellClick(callback) {
    for (let i = 0; i < this.board.childElementCount; i++) {
      const cell = this.board.children[i]
      cell.addEventListener('click', (e) => callback(e.target.id))
    }
  }

  reset() {
    for (let i = 0; i < this.board.childElementCount; i++) {
      const cell = this.board.children[i]
      while (cell.lastChild) {
        cell.removeChild(cell.lastChild)
      }
    }
  }
}

class Element {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.element = document.createElement('div')

    this.style({
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'box-sizing': 'border-box',
      'background-color': 'red',
      'top': '0',
      'bottom': '0',
      'left': '0',
      'right': '0',
      'margin': 'auto',
      'z-index': '1',
    })

    document.getElementById(`${this.x};${this.y}`).appendChild(this.element)
  }

  move(x, y) {
    this.x = x
    this.y = y
    
    this.element.remove()
    const new_cell = document.getElementById(`${this.x};${this.y}`)
    
    if (new_cell) {
      new_cell.appendChild(this.element)
    } else {
      throw "Coordinates out of board."
    }
  }

  style(styleDict) {
    for (const attr in styleDict) {
      this.element.style[attr] = styleDict[attr] 
    }

    return this
  }

  addClass(className) {
    this.element.classList.add(className)
    return this
  }

  remove() {
    this.element.remove()
  }
}

// const b = new Board(20)
// const e1 = b.createElement(3, 5).style({'background-color': 'green'})
// const e2 = b.createElement(2, 7)
// const e3 = b.createElement(8, 4)

// function move() {
//   e1.move(21, 21)
// }

export default Board