import React, { Component } from 'react';
import Board from './Board.jsx';

class Grid extends Component {
    state = { 
        rows: 30,
        cols: 40,
        status: []
    }

    constructor() {
        super();
        const status = [];
        for(let r = 0; r < this.state.rows; r++){
            status[r] = [];
            for(let c = 0; c < this.state.cols; c++){
                status[r][c] = 0;
            }
        }
        this.state.status = status;
    }

    handleCellToggle = (r, c, reqMouseDown) => {

        if(reqMouseDown & !this.props.isMouseDown) return;

        const toggleStatus = (prevState) => {
            const clone = JSON.parse(JSON.stringify(prevState.status));
            clone[r][c] = !prevState.status[r][c]
            return clone;
        }

        this.setState(prevState => ({
            status: toggleStatus(prevState)
        }));
    }

    render() { 
        return ( 
            <Board 
                rows={this.state.rows} 
                cols={this.state.cols} 
                status={this.state.status}
                clickFunc={this.handleCellToggle}
            />
        );
    }
}
 
export default Grid;