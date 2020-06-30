import React, { Component } from 'react';
import glob from './global.jsx'

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

    getTdClassName = (status) => {
        switch(status){
            case glob.emptyId: return "empty";
            case glob.wallId: return "wall";
            case glob.startId: return "start";
            case glob.targetId: return "target";
            default: break;
        }
    }

    getBoard = () => {
        const { rows, cols, status } = this.state;
        const tr = [];
        for (let r = 0; r < rows; r++) {
            const td = [];
            for (let c = 0; c < cols; c++) {
                td.push(
                    <td
                        key={`${r}, ${c}`}
                        className={this.getTdClassName(status[r][c])}
                        onMouseOver={() => {return this.props.isMouseDown ? this.handleCellClick(r, c) : false}}
                        onMouseDown={() => {this.handleCellClick(r, c)}}
                    />
                )
            }
            tr.push(<tr key={r}>{td}</tr>);
        }
        return (
            <div className="container shadow-lg p-3 mb-5 rounded">
                <div className="row justify-content-md-cente">
                    <div className="col-sm-12">
                        <table className="table table-bordered table-dark" width="100%">
                            <tbody>{tr}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    handleCellClick = (r, c) => {

        const updateStatus = (prevState) => {
            const clone = JSON.parse(JSON.stringify(prevState.status));
            let startLoc = prevState.startLoc
            let targetLoc = prevState.targetLoc
            switch(this.props.drawMode){
                case glob.wallButtonId:
                    if(prevState.status[r][c] === glob.emptyId || prevState.status[r][c] === glob.wallId) 
                        clone[r][c] = prevState.status[r][c] ^ 1; 
                    break;
                case glob.startButtonId:
                    if(clone[r][c] === glob.emptyId){
                        if(startLoc)
                            clone[startLoc[0]][startLoc[1]] = glob.emptyId;
                        clone[r][c] = glob.startId;
                        startLoc = [r, c];
                    }
                    else if(clone[r][c] === glob.startId && startLoc){
                        clone[startLoc[0]][startLoc[1]] = glob.emptyId;
                        startLoc = undefined;
                    }
                    break;
                case glob.targetButtonId:
                    if(clone[r][c] === glob.emptyId){
                        if(targetLoc)
                            clone[targetLoc[0]][targetLoc[1]] = glob.emptyId;
                        clone[r][c] = glob.targetId;
                        targetLoc = [r, c]
                    }
                    else if(clone[r][c] === glob.targetId && targetLoc){
                        clone[targetLoc[0]][targetLoc[1]] = glob.emptyId;
                        targetLoc = undefined;
                    }
                    break;
                case glob.weightButtonId:
                    break; //change later
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
            this.getBoard()
        );
    }
}

export default Grid;
