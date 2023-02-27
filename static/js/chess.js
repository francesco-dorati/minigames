import Board from "./board.js"

const GRID_SIZE = 15

class Game {
  constructor() {
    // create board
    this.board = new Board(8, 8)
      .style({
        'width': '550px',
        'height': '550px',
        'margin': 'auto',
        'margin-top': '20px',
        'border-radius': '20px',
        'box-shadow': '0 17px 1px #7e5837',
        'border': '9px solid #7e5837',
        'cursor': 'pointer',
      })
      .cellStyle({
        'border': '0',
      });
    
      // create players
      this.player1 = new Player(this.board, 'w', 0)
      this.player2 = new Player(this.board, 'b', 1)

      // return this.player1, this.player2
      
  }

  start() {
    this.turn = 0;
    this.selected = [null, null]
    this.board.onCellClick((id) => {
      
    })

  }

  move(fx,fy,tx,ty) {
    // checks if move can be played
  }
}

class Player {
  constructor (board, color, position) {
    this.color = color;
    this.position = position;
    this.pieces = []

    // create pieces
    let el;
    const style={
      'background-size': 'cover',
      'border-radius': '15px',
      'background-color': 'inherit',
    };

    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].forEach((e, i) => {
      // create figures
      el = board.createElement(i, (position) ? 0 : 7)
          .addClass('el').addClass(this.color).addClass(e)
          .style(style)
          .style({'background-image': `url(/chess/icons/${color}${e}.png)`})
      this.pieces.push(el)

      // create pawns
      el = board.createElement(i, (position) ? 1 : 6)
        .addClass('el').addClass(this.color).addClass('p')
        .style(style)
        .style({'background-image': `url(/chess/icons/${color}p.png)`})
      this.pieces.push(el)

    })

  }

  piece(x, y) {
    return this.pieces.find((el) => (fx == el.x && fy == el.y))
  }

  move(fx, fy, tx, ty) {
    // check if yours
    const piece = this.piece(fx, fy)
    if (!piece) return
    

  }

  canMove(el, x, y) {
    switch (el.element.classList[2]) {
      case 'p':
        if (this.position)
          return (el.x == x) && ((el.y + 1 == y) || (el.y == y))
      case 'r': 
        break;
      case 'n':
        break;
      case 'b':
        break
      case 'k':
        break
      case 'q':
        break
    }
  }
}


const g = new Game()
