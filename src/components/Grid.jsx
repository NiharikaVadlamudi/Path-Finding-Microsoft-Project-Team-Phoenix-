import React, { Component } from 'react';
import Board from './Board.jsx';

class Grid extends Component {
    state = {
        rows: 30,
        cols: 40,
        status: [],
        weight: [],
        startLoc: undefined,
        targetLoc: undefined
    }

    constructor() {
        super();
        const status = [];
        for (let r = 0; r < this.state.rows; r++) {
            status[r] = [];
            for (let c = 0; c < this.state.cols; c++) {
                status[r][c] = 0;
            }
        }
        this.state.status = status;
    }

    handleCellClick = (r, c) => {

        const updateStatus = (prevState) => {
            const clone = JSON.parse(JSON.stringify(prevState.status));
            let startLoc = prevState.startLoc
            let targetLoc = prevState.targetLoc
            switch(this.props.drawMode){
                case 1:
                    if(clone[r][c] === 0){
                        if(startLoc)
                            clone[startLoc[0]][startLoc[1]] = 0;
                        clone[r][c] = 2;
                        startLoc = [r, c];
                    }
                    break;
                case 2:
                    if(clone[r][c] === 0){
                        if(targetLoc)
                            clone[targetLoc[0]][targetLoc[1]] = 0;
                        clone[r][c] = 3;
                        targetLoc = [r, c]
                    }
                    break;
                case 3:
                    break; //change later
                case 4:
                    if(prevState.status[r][c] === 0 || prevState.status[r][c] === 1) 
                        clone[r][c] = prevState.status[r][c] ^ 1; 
                    break;
                default: break;
            }
            return [clone, startLoc, targetLoc];
        }

        this.setState(prevState => {
            const newState = updateStatus(prevState)
            return {
                status: newState[0],
                startLoc: newState[1],
                targetLoc: newState[2]
            }
        });
    }

    render() {
        return (
                <Board
                    rows={this.state.rows}
                    cols={this.state.cols}
                    status={this.state.status}
                    clickFunc={this.handleCellClick}
                    isMouseDown={this.props.isMouseDown}
                />
        );
    }
}

export default Grid;
