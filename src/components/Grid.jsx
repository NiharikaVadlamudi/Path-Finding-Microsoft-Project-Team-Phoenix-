import React, { Component } from 'react';
import Button from "./Button.jsx";
import glob from './global.jsx'
import Agent from "./Agent.jsx"

class Grid extends Component {
    state = {
        rows: 25,
        cols: 40,
        status: [],
        weight: [],
        startLoc: undefined,
        targetLoc: undefined,
        drawAllowed: true,
        drawMode: -1,
        drawButtons: [
            {id : glob.wallButtonId, label:"ADD WALL", status: false},
            {id : glob.startButtonId, label:"ADD START", status:false},
            {id : glob.targetButtonId, label:"ADD TARGET", status: false },
            {id : glob.weightButtonId, label:"ADD WEIGHT", status: false},
        ]
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

    handleSelectDrawMode = (element) => {

        if(!this.state.drawAllowed) return;

        let drawMode = -1;
        const drawButtons = this.state.drawButtons.map(c=>{
          c.status = (element !== undefined && c.id === element.id ? drawMode=c.id : false);
          return c;
        });
        this.setState({drawButtons, drawMode});
      }

    handleCellClick = (r, c) => {

        if(!this.state.drawAllowed) return;

        const updateStatus = (prevState) => {
            const clone = JSON.parse(JSON.stringify(prevState.status));
            let startLoc = prevState.startLoc
            let targetLoc = prevState.targetLoc
            switch(this.state.drawMode){
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

    handlePhaseToggle = () => {
        this.handleSelectDrawMode(undefined);
        const drawAllowed = !this.state.drawAllowed;
        this.setState({drawAllowed});
    }

    render() {
        return (
            <React.Fragment>
            <span>
                {this.state.drawButtons.map(
                    el => <Button key={el.id} el={el} onSelectOption={ this.handleSelectDrawMode }/>
                )}
            </span>
            <Agent
                handlePhaseToggle={this.handlePhaseToggle}
                status={this.state.status}
                beg={this.state.startLoc}
                end={this.state.targetLoc}
            />
            {this.getBoard()}
            </React.Fragment>
        );
    }
}

export default Grid;
