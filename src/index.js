import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button
        className="square"
        onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
    }

    renderCols(row, width) {
        let cols = [];
        const start = row*width;
        for (let i = 0; i < width; i++) {
            cols.push(this.renderSquare(start+i));
        }
        return cols;
    }

    renderRow(height, width) {
        let rows = [];
        for (let i = 0; i < height; i++) {
            rows.push(
                <div className="board-row">
                    {this.renderCols(i, width)}
                </div>
            );
        }
        return rows;
    }

    render() {

        return (
            <div>
                {this.renderRow(this.props.height, this.props.width)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        const LENGTH = 3;
        super(props);
        this.state = {
            history: [{
                squares: Array(LENGTH*LENGTH).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            height: LENGTH,
            width: LENGTH,
        };
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    findCoords(arr1, arr2) {
        const height = this.state.height;
        const width = this.state.width;
        for (let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) {
                const loc = i;
                return [loc%width+1, height-parseInt(loc/height, 10)];
            }
        }
    }
    
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const height = this.state.height;
        const width = this.state.width;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc = 'Go to game start';
            if (move) {
                let prevStep = history[move-1];
                let [x, y] = this.findCoords(step.squares, prevStep.squares);
                desc = 'Go to move #' + move + ' (' + x + ', ' + y + ')';
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        height={height}
                        width={width}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
}

// =============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);