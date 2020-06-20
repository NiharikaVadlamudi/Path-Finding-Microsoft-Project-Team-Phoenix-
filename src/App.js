import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const rows = 50;
const cols = 50;
const newBoardStatus = (cellStatus = () => Math.random() < 0.3) => {
  const grid = [];
  for(let r = 0; r < rows; r++){
    grid[r] = [];
    for(let c = 0; c < cols; c++){
      grid[r][c] = cellStatus();
    }
  }
  return grid;
}
const BoardGrid = ( {boardStatus, onToggleCellStatus} ) => {
  const handleClick = (r, c) => onToggleCellStatus(r, c);

  const tr = [];
  for(let r = 0; r < rows; r++){
    const td = [];
    for(let c = 0; c < cols; c++){
      td.push(
        <td
            key = {`${r}, ${c}`}
            className={boardStatus[r][c] ? 'alive':'dead'}
            onClick={() => handleClick(r, c)}
        />
        )
    }
    tr.push(<tr key={r}>{td}</tr>);
  }
  return <table><tbody>{tr}</tbody></table>
}
const Slider = ( {speed, onSpeedChange} ) => {
  const handleChange = e => onSpeedChange(e.target.value);

  return(
    <input
        type='range'
        min='50'
        max='1000'
        step='50'
        value={speed}
        onChange={handleChange}
    />
  )
}

class App extends Component {
  
  state = {
    boardStatus: newBoardStatus(),
    generation: 0,
    isGameRunning: false,
    speed: 500
  };

  runStopButton = () => {
    return this.state.isGameRunning ? 
    <button type='button' onClick={this.handleStop}>Stop</button> :
    <button type='button' onClick={this.handleRun}>Start</button>;
  }

  handleClearBoard = () => {
    this.setState({
      boardStatus: newBoardStatus(() => false),
      generation: 0
    });
  }

  handleNewBoard = () => {
    this.setState({
      boardStatus: newBoardStatus(),
      generation: 0
    });
  }

  handleToggleCellStatus = (r, c) => {
    const toggleBoardStatus = prevState => {
      const clonedBoardStatus = JSON.parse(JSON.stringify(prevState.boardStatus));
      clonedBoardStatus[r][c] = !clonedBoardStatus[r][c]
      return clonedBoardStatus;
    };

    this.setState(prevState => ({
      boardStatus: toggleBoardStatus(prevState)
    }));
  }

  handleStep = () => {
    const nextStep = prevState => {
      const boardStatus = prevState.boardStatus;
      const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus))

      const amountTrueNeighbours = (r, c) => {
        const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        return neighbours.reduce((trueNeighbours, neighbour) => {
          const x = r + neighbour[0];
          const y = c + neighbour[1];
          const isNeighbourOnBoard = (x >= 0 && x < rows && y >= 0 && y < cols);
          if(trueNeighbours < 4 && isNeighbourOnBoard && boardStatus[x][y]){
            return trueNeighbours + 1;
          } else {
            return trueNeighbours;
          }
        }, 0);
      }

      for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
          const totTrueNeighbours = amountTrueNeighbours(r, c);

          if(!boardStatus[r][c]){
            if (totTrueNeighbours === 3) clonedBoardStatus[r][c] = true;
          } else {
            if (totTrueNeighbours < 2 || totTrueNeighbours > 3) clonedBoardStatus[r][c] = false;
          }
        }
      }

      return clonedBoardStatus;
    };

    this.setState(prevState => ({
      boardStatus: nextStep(prevState),
      generation: prevState.generation + 1
    }));
  }

  handleSpeedChange = newSpeed => {
    this.setState({ speed: newSpeed });
  }

  handleRun = () => {
    this.setState( {isGameRunning: true} );
  }

  handleStop = () => {
    this.setState( {isGameRunning: false} );
  }

  componentDidUpdate(prevProps, prevState) {
    const {isGameRunning, speed} = this.state;
    const speedChanged = prevState.speed !== speed;
    const gameStarted = !prevState.isGameRunning && isGameRunning;
    const gameStopped = prevState.isGameRunning && !isGameRunning;

    if((isGameRunning && speedChanged) || gameStopped){
      clearInterval(this.timerID);
    }

    if((isGameRunning && speedChanged) || gameStarted){
      this.timerID = setInterval(() => {
        this.handleStep();
      }, speed);
    }
  }


  render() {
    const {boardStatus, isGameRunning, generation, speed} = this.state;

    return (
      <div>
        <h1>game</h1>
        <BoardGrid boardStatus={boardStatus} onToggleCellStatus={this.handleToggleCellStatus} />
        <div className='uppercontrols'>
          <span>
            {'+'}
            <Slider speed={speed} onSpeedChange={this.handleSpeedChange} />
            {'-'}
          </span>
          {`Generation: ${generation}`}
        </div>
        <div className='lowercontrols'>
          {this.runStopButton()}
          <button type='button' disabled={isGameRunning} onClick={this.handleStep}>Step</button>
          <button type='button' onClick={this.handleClearBoard}>Clear</button>
          <button type='button' onClick={this.handleNewBoard}>New</button>
        </div>
      </div>
      );
  }
}

export default App;
