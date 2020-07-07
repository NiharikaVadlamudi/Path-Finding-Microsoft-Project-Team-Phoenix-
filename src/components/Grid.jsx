import React, { Component } from 'react';
import Button from "./Button.jsx";
import glob from './global.jsx'
import Agent from "./Agent.jsx"

class Grid extends Component {
    state = {
        rows: 25,
        cols: 40,
        status: [],
        startLoc: undefined,
        targetLoc: undefined,
        drawAllowed: true,
        drawMode: -1,
        algoSelected: -1,
        isEmptyVis: true,
        drawButtons: [
            {id : glob.wallButtonId, label:"ADD WALL", status: false, disable: false},
            {id : glob.startButtonId, label:"ADD START", status:false, disable: false},
            {id : glob.targetButtonId, label:"ADD TARGET", status: false, disable: false },
            {id : glob.weightButtonId, label:"ADD WEIGHT", status: false, disable: false},
        ],
        algos : [
          {id : glob.bfsButtonId , label:"BFS" , status: false, disable: false},
          {id : glob.aStarButtonId , label:"A*" , status: false, disable: false},
          {id : glob.djikstraButtonId , label:"Djikstra" , status: false, disable: false},
        ],
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
            case glob.visId: return "vis";
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

      if(!this.state.drawAllowed) return;
      if(!this.state.isEmptyVis)
        this.clearLastAlgo();
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

    setModes = (drawModeVal, drawAllowedVal, algoSelectedVal) => {
      let drawMode = this.state.drawMode;
      let drawAllowed = this.state.drawAllowed;
      let algoSelected = this.state.algoSelected;
      drawMode = drawModeVal;
      drawAllowed = drawAllowedVal;
      algoSelected = algoSelectedVal;
      this.setState({drawMode,drawAllowed,algoSelected});
    }

    handleSelectDrawMode = (element) => {
        if(!this.state.drawAllowed) return;
        let drawMode = -1;
        const drawButtons = this.state.drawButtons.map(c=>{
          c.status = ((element !== undefined && c.id === element.id) ? drawMode=c.id : false);
          return c;
        });
        this.setState({drawButtons, drawMode});
      }

    handleSelectAlgo = (element) => {
        let algoSelected = this.state.algoSelected;

        const algos = this.state.algos.map(c=>{
          c.status = ((element !== undefined && c.id === element.id) ? algoSelected=c.id : false);
          return c;
        });
        this.setState({algos,algoSelected});

      }


    handleChecks = () => {
      const drawButtons = this.state.drawButtons.map(c=>{
          c.status = false;
          return c;
        });
        this.setModes(-1,true,-1);
        this.setState({drawButtons});
      }

    resetAlgoButtons = () => {
      const algos = this.state.algos.map(c=>{
        c.status =  false;
        return c;
      });
      this.setState({algos});
    }

    handlePhaseToggle = (drawModeVal, drawAllowedVal, algoSelectedVal, s, isEmptyVisVal) => {
      this.setModes(drawModeVal, drawAllowedVal, algoSelectedVal);
      this.handleSelectDrawMode(undefined);
      if (isEmptyVisVal!==undefined)
      {
        let isEmptyVis = isEmptyVisVal;
        this.setState({isEmptyVis});
      }
    }


    handleStep = (vis) => {
        const clone = JSON.parse(JSON.stringify(this.state.status));
        clone[vis[0]][vis[1]] = glob.visId;

        this.setState({status: clone})
    }

    clearLastAlgo = () => {
        const clone = JSON.parse(JSON.stringify(this.state.status));
        for(let i = 0; i < this.state.rows; i++){
            for(let j = 0; j < this.state.cols; j++){
                if(clone[i][j] === glob.visId)
                    clone[i][j] = glob.emptyId;
            }
        }
        let isEmptyVis = this.state.isEmptyVis;
        isEmptyVis = true;
        this.setState({status: clone, isEmptyVis});
    }

    render() {
        return (
            <React.Fragment>
                <span>
                    {this.state.drawButtons.map(
                        el => <Button key={el.id} el={el} onSelectOption={ this.handleSelectDrawMode }/>
                    )}
                </span>
                <span>
                    {this.state.algos.map(
                        el => <Button key={el.id} el={el} onSelectOption={ this.handleSelectAlgo }/>
                    )}
                </span>
                <Agent
                    gridState={this.state}
                    handlePhaseToggle={this.handlePhaseToggle}
                    handleStep={this.handleStep}
                    handleChecks={this.handleChecks}
                    clearLastAlgo={this.clearLastAlgo}
                    resetAlgoButtons={this.resetAlgoButtons}
                />
                {this.getBoard()}
            </React.Fragment>
        );
    }
}

export default Grid;
