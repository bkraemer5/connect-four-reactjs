import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

class Square extends React.Component {
  render() {
    return (
    <button
      className="square" 
      style={{background : this.props.value}}
      onClick={() => this.props.onClick()}
      >
    </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(row, col) {
    return (<Square 
      value={this.props.squares[row][col]}
      onClick = {() => {
        this.props.onClick(col);
      }}
      />
    );
  }
  
  elementsList(rows, cols) {
    var elements = [];
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < cols; j++) {
        row.push(this.renderSquare(i, j))
      }
      elements.push(row);
    }
    return elements;
  }

  render() {
    const elements = this.elementsList(6, 7);
    return (
      <div>
        <div className="contents">
          <div className="board">
            {elements.map(elem => (
              <div>{elem}</div>
            ))}
            </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: [...Array(6)].map(e => Array(7).fill('white')),
      }],
      stepNumber: 0,
      redIsNext: true,
      winner: false,
    };
  }

  handleClick(col) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    for (var i = squares.length-1; i >= 0; i--) {
      if(squares[i][col] === 'white') {
        squares[i][col] = this.state.redIsNext ? 'red' : 'blue';
        this.setState({
          history: history.concat([{
            squares: squares
          }]),
          stepNumber: history.length,
          redIsNext: !this.state.redIsNext,
        });
        return true;
      }
    }
    return false;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      redIsNext: (step % 2) === 0,
    });
  }

  render() {
    const title = "CONNECT FOUR";
    const history = this.state.history;
    //const current = history[this.state.stepNumber];
    const current = history[0];

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key = {move}>
          <button onClick={() => {
            this.jumpTo(move)
          }}>
            {desc}
          </button>
        </li>
      );
    });

    const winner = calculateWinner(current.squares, !this.state.redIsNext);
    let status;
    if (winner) {
      status = "WINNER IS: " + (!this.state.redIsNext ? 'RED' : 'BLUE');
      this.state.winner = true;
    }
    else if (isDraw(current.squares)) {
      status = "DRAW"
      this.state.winner = true
    }
    else {
      status = 'Next player: ' + (this.state.redIsNext ? 'RED' : 'BLUE');
    }
    

    return (
      <div className="game">
        <div className="game-board">
        <div className="title">{title}</div>
        <div className="status">{status}</div>
          <Board 
            squares={current.squares}
            onClick={(col) => {
              if (!this.state.winner) {
                this.handleClick(col)
              }
            }}/>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, player) {

  var color = player ? 'lightcoral' : 'skyblue'
  var count = 4;
  // row matches
  for (var i = 0; i < squares.length; i++) {
    for (var j = 0; j < squares[i].length-count+1; j++) {
      if (squares[i][count+j-4] != 'white' && squares[i][count+j-4] === squares[i][count+j-3] && squares[i][count+j-4] === squares[i][count+j-2] && squares[i][count+j-4] === squares[i][count+j-1]) {
        squares[i][count+j-4] = color;
        squares[i][count+j-3] = color;
        squares[i][count+j-2] = color;
        squares[i][count+j-1] = color;
        return squares;
      }
    }
  }
  // col matches
  for (var i = 0; i < squares[0].length; i++) {
    for (var j = 0; j < squares.length-count+1; j++) {
      if (squares[count+j-4][i] != 'white' && squares[count+j-4][i] === squares[count+j-3][i] && squares[count+j-4][i] === squares[count+j-2][i] && squares[count+j-4][i] === squares[count+j-1][i]) {
        squares[count+j-4][i] = color;
        squares[count+j-3][i] = color;
        squares[count+j-2][i] = color;
        squares[count+j-1][i] = color;
        return squares;
      }
    }
  }
  // diagonal matches (left)
  for (var i = 0; i < squares.length-count+1; i++) { 
    for (var j = 0; j < squares[0].length-count; j++) { 
      if (squares[count+i-4][j] != 'white' && squares[count+i-4][j] === squares[count+i-3][j+1] && squares[count+i-4][j] === squares[count+i-2][j+2] && squares[count+i-4][j] === squares[count+i-1][j+3]) {
        squares[count+i-4][j] = color;
        squares[count+i-3][j+1] = color;
        squares[count+i-2][j+2] = color;
        squares[count+i-1][j+3] = color;
        return squares;
      }
    }
  }

  // diagonal matches (right)
  for (var i = 0; i < squares.length-count+1; i++) { 
    for (var j = squares[0].length; j > count; j--) { 
      if (squares[count+i-4][j] != 'white' && squares[count+i-4][j] === squares[count+i-3][j-1] && squares[count+i-4][j] === squares[count+i-2][j-2] && squares[count+i-4][j] === squares[count+i-1][j-3]) {
        squares[count+i-4][j] = color;
        squares[count+i-3][j-1] = color;
        squares[count+i-2][j-2] = color;
        squares[count+i-1][j-3] = color;
        return squares;
      }
    }
  }
  return null
}

function isDraw(squares) {
  for (var i = 0; i < squares.length; i++) {
    for (var j = 0; j < squares[i].length; j++) {
      if (squares[i][j] === 'white') {
        return false;
      }
    }
  }
  return true;
}


ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
