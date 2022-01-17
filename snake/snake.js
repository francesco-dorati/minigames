// import Board from "../board.js"

// new Board(3)

const GRID_SIZE = 15
class Board {
  constructor() {
    // create grid
    const html_board = document.getElementById('board')
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        html_board.innerHTML += '<div class="cell" id="' + y + '-' + x + '"></div>'
      }
    }

    // round corners
    document.getElementById('0-0').style.borderRadius = '15px 0 0 0'
    document.getElementById('0-0').style.boxShadow = '0 0 15px balck'
    document.getElementById('0-' + (GRID_SIZE - 1)).style.borderRadius = '0 15px 0 0'
    document.getElementById((GRID_SIZE - 1) +'-0').style.borderRadius = '0 0 0 15px'
    document.getElementById((GRID_SIZE - 1) +'-' + (GRID_SIZE - 1)).style.borderRadius = '0 0 15px 0'
  }
}

class Element {
  constructor(y, x, style={}) {
    this.y = y
    this.x = x

    if (this.x < 0 || this.y < 0 || this.x > GRID_SIZE || this.y > GRID_SIZE) {
      console.error('Got wrong coordinates.')
    }

    // create item iside specific cell
    this.html_cell = document.getElementById(this.y + '-' + this.x)
    this.html_element = this.html_cell.appendChild(document.createElement('div'))

    // styles
    this.style.position = 'absolute'
    this.style.width = 'calc((510px / 15)'
    this.style.height = 'calc(510px / 15)'
    this.style.boxSizing = 'border-box'
    this.style.boxShadow = '0 5px 1px #00000050'
  }

  get position() {
    return {y: this.y, x: this.x}
  }

  get style() {
    return this.html_element.style
  }

  remove() {
    this.html_cell.removeChild(this.html_element)
  }

}

class Snake {
  constructor(y=7, x=3, direction='right') {
    this.SNAKE_COLOR = '#4674e9' 
    this.snake = [
      new Element(y, x), 
      new Element(y, x-1)
    ]
    this.direction = direction
    this.render()
  }
  get head() {
    return this.snake[0]
  }

  get nextPosition() {
    let {y, x} = this.head
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
    return {y, x}
  }

  move() {
    // remove last element
    this.snake[this.snake.length - 1].remove()					
    this.snake.pop()

    // create new head
    this.snake.splice(0, 0, new Element(this.nextPosition.y, this.nextPosition.x))

    // render snake
    this.render()
  }

  grow() {
    // create new head
    this.snake.splice(0, 0, new Element(this.nextPosition.y, this.nextPosition.x))

    // render snake
    this.render()
  }

  render() {
    this.snake.forEach((e, i) => {
      let backgroundColor = this.SNAKE_COLOR
      let border = {
        style: 'none',
        color: 'darkblue',
        size: '3px',
      }
      let borderRadius = 'none'

      // head cell
      if (i == 0) {
        // check head direction
        switch (this.direction) {
          // heads left 
          case 'left':
            border.style = 'solid none solid solid'
            borderRadius = '15px 0 0 15px'
            break
          case 'up':
            border.style = 'solid solid none solid'
            borderRadius = '15px 15px 0 0'
            break
          case 'right':
            border.style = 'solid solid solid none'	
            borderRadius = '0 15px 15px 0'
            break
          case 'down':
            border.style = 'none solid solid solid'
            borderRadius = '0 0 15px 15px'
        }

      // tail cell
      } else if (i == this.snake.length - 1) {
        // previous element position
        switch (JSON.stringify(this.snake[i - 1].position)) {
          case JSON.stringify({y: e.y, x: e.x-1}): // left
            border.style = 'solid solid solid none'	
            borderRadius = '0 15px 15px 0'
            break
          case JSON.stringify({y: e.y-1, x: e.x}): // top
            border.style = 'none solid solid solid'
            borderRadius = '0 0 15px 15px'
            break
          case JSON.stringify({y: e.y, x: e.x+1}): // right
            border.style = 'solid none solid solid'
            borderRadius = '15px 0 0 15px'
            break
          case JSON.stringify({y: e.y+1, x: e.x}): // bottom
            border.style = 'solid solid none solid'
            borderRadius = '15px 15px 0 0'
        }	

      // middle element
      } else {
        // check previous and next elements
        const prev = this.snake[i - 1].position
        const next = this.snake[i + 1].position

        // same line (|)
        if (prev.x == next.x) {
          border.style = 'none solid none solid'
          borderRadius = '0'

        // same line (-)
        } else if (prev.y == next.y) {
          border.style = 'solid none solid none'
          borderRadius = '0'
        } 

        // angle (/)
        else if (prev.y == next.y-1 && prev.x == next.x+1)
          if (e.y == prev.y) { // (|^)
            border.style = 'solid none none solid'
            borderRadius = '15px 0 0 0'
          } else { // (_|)
            border.style = 'none solid solid none'
            borderRadius = '0 0 15px 0'
          }
          
        // angle (/)
        else if (prev.y == next.y+1 && prev.x == next.x-1) 
          if (e.y == prev.y) { // (_|)
            border.style = 'none solid solid none'
            borderRadius = '0 0 15px 0'
          } else { // (|^) 
            border.style = 'solid none none solid'
            borderRadius = '15px 0 0 0'
          }

        // angle (\)
        else if (prev.y == next.y-1 && prev.x == next.x-1) 
          if (e.y == prev.y) { // (^|)
            border.style = 'solid solid none none'
            borderRadius = '0 15px 0 0'
          } else { // (|_)
            border.style = 'none none solid solid'
            borderRadius = '0 0 0 15px'
          }

        // angle (\)
        else if (prev.y == next.y+1 && prev.x == next.x+1) 
          if (e.y == prev.y) { // (|_)
            border.style = 'none none solid solid'
            borderRadius = '0 0 0 15px'
          } else { // (^|) 
            border.style = 'solid solid none none'
            borderRadius = '0 15px 0 0'
          }
      }

      e.style.backgroundColor = backgroundColor
      e.style.borderRadius = borderRadius
      e.style.borderStyle = border.style
      e.style.borderColor = border.color
      e.style.borderSize = border.size
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

class Food {
  constructor(x=null, y=null) {
    y = y || parseInt((Math.random() * (GRID_SIZE - 2)) + 1)
    x = x || parseInt((Math.random() * (GRID_SIZE - 2)) + 1)

    this.food = new Element(y, x)
    this.food.style.backgroundColor = 'red'
    this.food.style.border = 'darkred 3px solid'
    this.food.style.borderRadius = '15px'
  }

  get position() {
    return {y: this.food.y, x: this.food.x}
  }

  remove() {
    this.food.remove()
  }
}

class Game {
  constructor() {
    this.board = new Board()
    this.snake = new Snake()
    this.food = new Food()
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
      if (this.snake.nextPosition.y == this.food.position.y && this.snake.nextPosition.x == this.food.position.x) {
        this.snake.grow()

        do {
          this.food.remove()
          this.food = new Food()
        } while (this.snake.includes(this.food.position))

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
    this.food.remove()
    this.snake = new Snake()
    this.food = new Food()
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

game = new Game()
