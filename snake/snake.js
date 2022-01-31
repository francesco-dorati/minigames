import Board from "../board.js"

const GRID_SIZE = 15

class Snake {
  constructor(board, y=7, x=3, direction='right') {
    this.board = board
    this.snake = [
      this.board.createElement(x, y), 
      this.board.createElement(x-1, y)
    ]
    this.direction = direction
    this.render()
  }

  get head() {
    return this.snake[0]
  }

  get nextPosition() {
    let {x, y} = this.head
    switch (this.direction) {
      case 'left':
        x--
        break
      case 'up':
        y--
        break
      case 'right':
        x++
        break
      case 'down':
        y++
    }
    return {x, y}
  }

  move() {
    // remove last element
    this.snake[this.snake.length - 1].remove()					
    this.snake.pop()

    // create new head
    this.snake.splice(0, 0, this.board.createElement(this.nextPosition.x, this.nextPosition.y))

    // render snake
    this.render()
  }

  grow() {
    // create new head
    this.snake.splice(0, 0, this.board.createElement(this.nextPosition.x, this.nextPosition.y))

    // render snake
    this.render()
  }

  render() {
    this.snake.forEach((e, i) => {
      const style = {
        'background-color': '#4674e9',
        'box-shadow': '0 5px 1px #00000050',
        'border-radius': 'none',
        'border-style': 'none',
        'border-color': 'darkblue',
        'border-size': '3px',
        'z-index': '2',
      }

      // head cell
      if (i == 0) {
        // check head direction
        switch (this.direction) {
          // heads left 
          case 'left':
            style['border-style'] = 'solid none solid solid'
            style['border-radius'] = '15px 0 0 15px'
            break
          case 'up':
            style['border-style'] = 'solid solid none solid'
            style['border-radius'] = '15px 15px 0 0'
            break
          case 'right':
            style['border-style'] = 'solid solid solid none'	
            style['border-radius'] = '0 15px 15px 0'
            break
          case 'down':
            style['border-style'] = 'none solid solid solid'
            style['border-radius'] = '0 0 15px 15px'
        }

      // tail cell
      } else if (i == this.snake.length - 1) {
        // previous element position
        const prev = this.snake[i - 1]
        if (prev.x == e.x-1 && prev.y == e.y) { // left
            style['border-style'] = 'solid solid solid none'	
            style['border-radius'] = '0 15px 15px 0'
        } else if (prev.x == e.x && prev.y == e.y-1){ // top
            style['border-style'] = 'none solid solid solid'
            style['border-radius'] = '0 0 15px 15px'
        } else if (prev.x == e.x+1 && prev.y == e.y) { // right
            style['border-style'] = 'solid none solid solid'
            style['border-radius'] = '15px 0 0 15px'
        } else if (prev.x == e.x && prev.y == e.y+1) { // bottom
            style['border-style'] = 'solid solid none solid'
            style['border-radius'] = '15px 15px 0 0'
        }	

      // middle element
      } else {
        // check previous and next elements
        const prev = this.snake[i - 1]
        const next = this.snake[i + 1]

        // same line (|)
        if (prev.x == next.x) {
          style['border-style'] = 'none solid none solid'
          style['border-radius'] = '0'

        // same line (-)
        } else if (prev.y == next.y) {
          style['border-style'] = 'solid none solid none'
          style['border-radius'] = '0'
        } 

        // angle (/)
        else if (prev.y == next.y-1 && prev.x == next.x+1)
          if (e.y == prev.y) { // (|^)
            style['border-style'] = 'solid none none solid'
            style['border-radius'] = '15px 0 0 0'
          } else { // (_|)
            style['border-style'] = 'none solid solid none'
            style['border-radius'] = '0 0 15px 0'
          }
          
        // angle (/)
        else if (prev.y == next.y+1 && prev.x == next.x-1) 
          if (e.y == prev.y) { // (_|)
            style['border-style'] = 'none solid solid none'
            style['border-radius'] = '0 0 15px 0'
          } else { // (|^) 
            style['border-style'] = 'solid none none solid'
            style['border-radius'] = '15px 0 0 0'
          }

        // angle (\)
        else if (prev.y == next.y-1 && prev.x == next.x-1) 
          if (e.y == prev.y) { // (^|)
            style['border-style'] = 'solid solid none none'
            style['border-radius'] = '0 15px 0 0'
          } else { // (|_)
            style['border-style'] = 'none none solid solid'
            style['border-radius'] = '0 0 0 15px'
          }

        // angle (\)
        else if (prev.y == next.y+1 && prev.x == next.x+1) 
          if (e.y == prev.y) { // (|_)
            style['border-style'] = 'none none solid solid'
            style['border-radius'] = '0 0 0 15px'
          } else { // (^|) 
            style['border-style'] = 'solid solid none none'
            style['border-radius'] = '0 15px 0 0'
          }
      }

      e.style(style);
    });
  }

  includes(pos) {
    let included = false
    this.snake.forEach(e => {
      if (e.y == pos.y && e.x == pos.x)
        included = true
    })
    return included
  }
  
  remove() {
    this.snake.forEach(e => e.remove())
  }
}

class Game {
  constructor() {
    this.board = new Board(15)
      .style({
        'width': '510px',
        'height': '510px',
        'margin': 'auto',
        'margin-top': '20px',
        'border-radius': '15px',
        'box-shadow': '0 15px 1px #3c5f24',
        'border': '5px solid #3c5f24',
      })
      .cellStyle({
        'border': '0'
      })
    this.snake = new Snake(this.board)
    
    this.food = this.board
      .createElement(...this.board.randomCoordinates)
      .style({
        'background-color': 'red',
        'border': 'darkred 3px solid',
        'border-radius': '15px',
        'box-shadow': '0 5px 1px #00000050',
      })
    
    this.speed = 200
    this.points = 0


    // start the game keypress
    this.start_listener = e => {
      if ([32].includes(e.keyCode)) {
        this.start()
      }
    }
    document.addEventListener('keydown', this.start_listener)
  }
  
  start() {
    // remove start listener
    document.removeEventListener('keydown', this.start_listener)

    // key listener (move inside snake)
    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 65: // a
        case 37: // left
          if (this.snake.direction == 'right') break
          this.snake.direction = 'left'
          break
        case 87: // w
        case 38: // up
          if (this.snake.direction == 'down') break
          this.snake.direction = 'up'
          break
        case 68: // d
        case 39: // right
          if (this.snake.direction == 'left') break
          this.snake.direction = 'right'
          break
        case 83: // s
        case 40: // down
          if (this.snake.direction == 'up') break
          this.snake.direction = 'down'
      }
    })
    
    // snake movement
    const move = () => {	
      // check lost
      const next = this.snake.nextPosition
      const touches_border = next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE
      const touches_itself = this.snake.includes({y: next.y, x: next.x})
      if (touches_border || touches_itself) {
        game.loose()
        return
      }

      // if eats
      if (this.snake.nextPosition.y == this.food.y && this.snake.nextPosition.x == this.food.x) {
        this.snake.grow()

        do {
          this.food.move(...this.board.randomCoordinates) // move food
        } while (this.snake.includes({x: this.food.x, y: this.food.y})) // repeat if food spawns on the snake

        this.speed /= 1.05
        
        this.points++
        // if (this.points > this.record) this.record = this.points
      } else {
        this.snake.move()
      }

      this.interval = setTimeout(move, this.speed)
    }
    this.interval = setTimeout(move, this.speed)
  }

  loose() {
    this.reset()
  }

  reset() {
    // clear mover interval
    setTimeout(() => clearTimeout(this.interval), 0)

    // generate new snake and food
    this.snake.remove()
    this.snake = new Snake(this.board)
    this.food.move(...this.board.randomCoordinates)
    this.speed = 200
    this.points = 0

    // start listener
    document.addEventListener('keydown', this.start_listener)
  }

  get points() {
    return document.getElementById('points').innerHTML
  }

  set points(v) {
    document.getElementById('points').innerHTML = v
    return v
  }
}

const game = new Game()
