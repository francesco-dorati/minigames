class Board {
  constructor(size) {
    this.size = size

    // create html grid
    this.board = document.getElementById('board')
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
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
      'grid-template-columns': `repeat(${this.size}, auto)`,
      'grid-template-rows': `repeat(${this.size}, auto)`,

      'width': '500px',
      'height': '500px',
      'margin': 'auto',
      'border': '5px solid black',
    })
    
    this.cellStyle({
      'position': 'relative',
      'border': '2px solid black',
    })
  }

  createElement(x, y) {
    // validate coordinates
    if (x < 0 || y < 0 || x > this.size || y > this.size) {
      console.error(`Coordinates out of index: ${[x, y]}`)
    }

    return new Element(x, y)
  }

  get randomCoordinates() {
    return [parseInt(Math.random() * (this.size - 1)), parseInt(Math.random() * (this.size - 1))]
  }

  style(styleDict) {
    for (const a in styleDict) {
      this.board.style[a] = styleDict[a]
    }

    // round corner cells
    if (styleDict['border-radius']) {
      document.getElementById('0;0').style.borderRadius = `${styleDict['border-radius']} 0 0 0`
      document.getElementById(`0;${this.size-1}`).style.borderRadius = `0 0 0 ${styleDict['border-radius']}`
      document.getElementById(`${this.size-1};0`).style.borderRadius = `0 ${styleDict['border-radius']} 0 0`
      document.getElementById(`${this.size-1};${this.size-1}`).style.borderRadius = `0 0 ${styleDict['border-radius']} 0`
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

  render() {

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