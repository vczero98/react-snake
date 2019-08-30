/* eslint-disable default-case */
import React from 'react';
import Snake from './Snake';

const DIRECTIONS = {up: 'up', down: 'down', left: 'left', right: 'right'};

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snake: [{x: 1, y: 0}, {x: 0, y: 0}],
            apple: {x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15)},
            direction: DIRECTIONS.right,
            score: 0,
            newPieceToBeAdded: false,
            gameOver: false
        }
        this.intervalID = 0;
        this.caughtApple = this.caughtApple.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    caughtApple() {
        this.setState(prevState => {
            prevState.score++;
            // Generate new apple
            prevState.apple.x = Math.floor(Math.random() * 15);
            prevState.apple.y = Math.floor(Math.random() * 15);
            // Add new snake piece
            prevState.newPieceToBeAdded = true;
            return prevState;
        });
    }

    isValidMove(snake) {
        const head = snake[0];

        // Check if the head is outside of the game area
        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15)
            return false;

        // Check if the head is crashing into the snake
        for (let i = 2; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return false;
            }
        }

        return true;
    }

    gameOver() {
        this.setState({gameOver: true});
        clearInterval(this.intervalID);
    }

    gameLoop() {
        let caughtApple = false;
        let gameOver = false;
        this.setState(prevState => {
            for (let i = prevState.snake.length - 1; i >= 0; i--) {
                if (!gameOver) {
                    if ((i === (prevState.snake.length - 1)) && prevState.newPieceToBeAdded) {
                        // Caught apple in last round, add new piece
                        prevState.snake.push({x: prevState.snake[i].x, y: prevState.snake[i].y});
                        prevState.newPieceToBeAdded = false;
                    } else if (i === 0) {
                        // Head of the snake
                        const head = prevState.snake[i];
                        if (head.x === prevState.apple.x && head.y === prevState.apple.y) {
                            // Caught the apple
                            caughtApple = true;
                        }
                        if (this.isValidMove(prevState.snake)) {
                            switch (prevState.direction) {
                                // Head of the snake moves in one direction
                                case DIRECTIONS.up:
                                    head.y--;
                                    break;
                                case DIRECTIONS.down:
                                    head.y++;
                                    break;
                                case DIRECTIONS.left:
                                    head.x--;
                                    break;
                                case DIRECTIONS.right:
                                    head.x++;
                                    break;
                            }
                        } else {
                            gameOver = true;
                        }
                    } else {
                        // Tail of snake follows next piece of snake
                        prevState.snake[i].x = prevState.snake[i-1].x;
                        prevState.snake[i].y = prevState.snake[i-1].y;
                    }
                }
            }
            
            return prevState;
        }, () => {
            if (caughtApple) this.caughtApple();
            if (gameOver) this.gameOver();
        });
    }

    componentDidMount() {
        // Game loop
        this.intervalID = window.setInterval(this.gameLoop, 250);

        // Add key listeners
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 38:
                    if (this.state.direction !== DIRECTIONS.down) {
                        this.setState({direction: DIRECTIONS.up});
                    }
                    break;
                case 40:
                    if (this.state.direction !== DIRECTIONS.up) {
                        this.setState({direction: DIRECTIONS.down});
                    }
                    break;
                case 37:
                    if (this.state.direction !== DIRECTIONS.right) {
                        this.setState({direction: DIRECTIONS.left});
                    }
                    break;
                case 39:
                    if (this.state.direction !== DIRECTIONS.left) {
                        this.setState({direction: DIRECTIONS.right});
                    }
                    break;
            }
        });
    }

    render() {
        const snake = (() => {
            let tmpSnake = [];
            for (let i = 0; i < this.state.snake.length; i++) {
                tmpSnake.push(
                    <Snake 
                        key={i}
                        head={i === 0}
                        direction={'' + this.state.direction}
                        x={this.state.snake[i].x}
                        y={this.state.snake[i].y} />
                );
            }
            return tmpSnake;
        })();
        const apple = <div id="apple" style={{left: (this.state.apple.x * 15), top: (this.state.apple.y * 15)}} />;

        return (
            <div id="board" className={this.state.gameOver ? 'game-over' : ''}>
                <p id="score">Score: {this.state.score}</p>
                {snake}
                {apple}
                {this.state.gameOver &&
                    <div id="game-over">
                        <p>Game Over</p>
                    </div>
                }
            </div>
        );
    }
}

export default Board;