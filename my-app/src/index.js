import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props){
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// class Square extends React.Component {
//     render() {
//       return (
//         <button 
//             className="square" 
//             onClick={() => this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }
  
class Board extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state ={
    //         squares:Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    renderSquare(i) {
    return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
    );
    }

    render() {
        // var grid = [];
        // var elements = [];

        // for (var i=0; i<3; i++){
        //     grid.push(
        //         <div className="board-row">
        //             for (var i=0; i<3; i++){
        //                 elements.push(this.renderSquare(i))
        //             }
        //         </div>
        //     )
        // }

        // array[1,2,3]

        return (

            <div>
            {/* <div className="status">{status}</div> */}

                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
    );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                index: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        // const history = this.state.history;
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        // const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            // squares:squares,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        // const current = history[history.length - 1];
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let changed_index;
        if (this.state.stepNumber>0){
            const previous = history[this.state.stepNumber-1];
            for (var i=0; i<9; i++){
                if (previous.squares[i]!==current.squares[i]){
                    changed_index = i;
                }
            }
        }

        let row;
        let column;

        if (changed_index){
            row = Math.floor(changed_index/3) + 1; 
            column = changed_index%3 + 1; 
        } else {
            row = 1;
            column = 1;
        }

        const moves = history.map((step,move) => {

            const desc = move ?
                'Go to move #' + move + ' ('+row+','+column+')':
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );

        });

        let status;
        if (winner){
            status = 'Winner: ' + winner;
        } else if (current.squares.includes(null)){
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            status = 'Draw';
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
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
    for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
    }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);