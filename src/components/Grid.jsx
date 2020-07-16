import React, { Component } from 'react';
import Button from "./Button.jsx";
import glob from './global.jsx'
import Agent from "./Agent.jsx"
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';

class Grid extends Component {
  state = {
    rows: 25,
    cols: 40,
    status: [],
    startLoc: undefined,
    targetLoc: undefined,
    drawAllowed: true,
    drawMode: -1,
    isEmptyVis: true,
    drawButtons: [
      { id: glob.wallButtonId, label: "ADD WALL", status: false, disable: false },
      { id: glob.startButtonId, label: "ADD START", status: false, disable: false },
      { id: glob.targetButtonId, label: "ADD TARGET", status: false, disable: false },
      { id: glob.weightButtonId, label: "ADD WEIGHT", status: false, disable: false },
    ],
    showModal: false,
    ModalMessage: "",

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
    switch (status) {
      case glob.emptyId: return "empty";
      case glob.wallId: return "wall";
      case glob.startId: return "start";
      case glob.targetId: return "target";
      case glob.visId: return "vis";
      case glob.weightId: return "weight";
      case glob.visAndWeightId: return "visWeight";
      case glob.pathId: return "path";
      case glob.pathAndWeightId: return "pathWeight";
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
            id={`${r}, ${c}`}
            className={this.getTdClassName(status[r][c])}
            onMouseOver={() => { return this.props.isMouseDown ? this.handleCellClick(r, c) : false }}
            onMouseDown={() => { this.handleCellClick(r, c) }}
          />
        )
      }
      tr.push(<tr key={r}>{td}</tr>);
    }
    return (

      // <div className="container shadow-lg p-3 mb-5 rounded">
      <div className="row justify-content-md-center">
        <div className="col-sm-12">
          <table className="table table-bordered table-dark" width="100%">
            <tbody>{tr}</tbody>
          </table>
        </div>
      </div>
      // </div>

    );
  }

  handleCellClick = (r, c) => {

    if (!this.state.drawAllowed) return;
    if (!this.state.isEmptyVis && this.state.drawMode != -1)
      this.clearLastAlgo();
    const updateStatus = (prevState) => {
      const clone = JSON.parse(JSON.stringify(prevState.status));
      let startLoc = prevState.startLoc
      let targetLoc = prevState.targetLoc
      switch (this.state.drawMode) {
        case glob.wallButtonId:
          if (prevState.status[r][c] === glob.emptyId || prevState.status[r][c] === glob.wallId)
            clone[r][c] = prevState.status[r][c] ^ 1;
          break;
        case glob.startButtonId:
          if (clone[r][c] === glob.emptyId) {
            if (startLoc)
              clone[startLoc[0]][startLoc[1]] = glob.emptyId;
            clone[r][c] = glob.startId;
            startLoc = [r, c];
          }
          else if (clone[r][c] === glob.startId && startLoc) {
            clone[startLoc[0]][startLoc[1]] = glob.emptyId;
            startLoc = undefined;
          }
          break;
        case glob.targetButtonId:
          if (clone[r][c] === glob.emptyId) {
            if (targetLoc)
              clone[targetLoc[0]][targetLoc[1]] = glob.emptyId;
            clone[r][c] = glob.targetId;
            targetLoc = [r, c]
          }
          else if (clone[r][c] === glob.targetId && targetLoc) {
            clone[targetLoc[0]][targetLoc[1]] = glob.emptyId;
            targetLoc = undefined;
          }
          break;
          case glob.weightButtonId:
          if(prevState.status[r][c] === glob.emptyId){
            clone[r][c] = glob.weightId;
          }
          else if(prevState.status[r][c] === glob.weightId){
            clone[r][c] = glob.emptyId;
          }
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

  setModes = (drawModeVal, drawAllowedVal) => {
    let drawMode = this.state.drawMode;
    let drawAllowed = this.state.drawAllowed;
    drawMode = drawModeVal;
    drawAllowed = drawAllowedVal;
    this.setState({ drawMode, drawAllowed });
  }

  handleSelectDrawMode = (element) => {
    if (!this.state.drawAllowed) return;
    let drawMode = -1;
    const drawButtons = this.state.drawButtons.map(c => {
      c.status = ((element !== undefined && c.id === element.id) ? drawMode = c.id : false);
      return c;
    });
    this.setState({ drawButtons, drawMode });
  }


  handleChecks = () => {
    const drawButtons = this.state.drawButtons.map(c => {
      c.status = false;
      return c;
    });

    this.setModes(-1, true);
    this.setState({ drawButtons });
  }


  handlePhaseToggle = (drawModeVal, drawAllowedVal, s, isEmptyVisVal) => {
    this.setModes(drawModeVal, drawAllowedVal);
    this.handleSelectDrawMode(undefined);
    if (isEmptyVisVal !== undefined) {
      let isEmptyVis = isEmptyVisVal;
      this.setState({ isEmptyVis });
    }
  }

  handleAlgo = (order, path) => {
    const clone = JSON.parse(JSON.stringify(this.state.status));
    for(let i = 0; i < order.length; i++){
      clone[order[i][0]][order[i][1]] = clone[order[i][0]][order[i][1]] === glob.weightId ? glob.visAndWeightId : glob.visId;
    }
    for(let i = 0; i < path.length; i++){
      clone[path[i][0]][path[i][1]] = clone[path[i][0]][path[i][1]] === glob.visAndWeightId ? glob.pathAndWeightId : glob.pathId;
    }
    this.setState({ status: clone })
  }

  handleStep = (vis, path) => {
    if(!path){
      document.getElementById(`${vis[0]}, ${vis[1]}`).className = this.getTdClassName(
        this.state.status[vis[0]][vis[1]] === glob.weightId ? glob.visAndWeightId : glob.visId
      )
    }
    else{
      document.getElementById(`${vis[0]}, ${vis[1]}`).className = this.getTdClassName(
        this.state.status[vis[0]][vis[1]] === glob.weightId ? glob.pathAndWeightId : glob.pathId
      )
    }
  }

  clearLastAlgo = () => {
    const clone = JSON.parse(JSON.stringify(this.state.status));
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (clone[i][j] === glob.visId || clone[i][j] === glob.pathId)
          clone[i][j] = glob.emptyId;
        else if(clone[i][j] === glob.visAndWeightId || clone[i][j] === glob.pathAndWeightId)
          clone[i][j] = glob.weightId;
      }
    }
    let isEmptyVis = this.state.isEmptyVis;
    isEmptyVis = true;
    this.setState({ status: clone, isEmptyVis });
  }


  handleClearWalls = () => {
    if(this.state.drawAllowed === true)
    {
      const clone = JSON.parse(JSON.stringify(this.state.status));
      for (let i = 0; i < this.state.rows; i++) {
        for (let j = 0; j < this.state.cols; j++) {
          if (clone[i][j] !== glob.startId && clone[i][j] !== glob.targetId && clone[i][j] !== glob.emptyId)
            clone[i][j] = glob.emptyId;
        }
      }
      let isEmptyVis = this.state.isEmptyVis;
      isEmptyVis = true;
      this.setState({ status: clone, isEmptyVis });

    }
    else {
      this.setModalValues("Stop algo before clearing walls")
    }
  }

  handleClose = () =>
  {
    this.setState({showModal:false});
  }

  setModalValues = (message) =>
  {
    this.setState({ showModal:true, ModalMessage:message })
  }
  render() {
    console.log(this.state.status[2][6])
    return (
      <React.Fragment>
        <span>
          {this.state.drawButtons.map(
            el => <Button key={el.id} el={el} onSelectOption={this.handleSelectDrawMode} />
          )}
        </span>
        <div className="d-flex flex-row flex-wrap m-2 justify-content-around">
       		<div className="d-flex p-2">
       			<div className="legend wall"></div>
       			<div> Wall</div>
       		</div>
       		<div className="d-flex p-2">
       			<div className="legend start"></div>
       			<div>Start</div>
       		</div>
       		<div className="d-flex p-2">
       			<div className="legend target">    </div>
       			<div>Target</div>
       		</div>
          <div className="d-flex p-2">
       			<div className="legend weight"></div>
       			<div>Weights</div>
       		</div>
          <div className="d-flex p-2">
       			<div className="legend vis"></div>
       			<div>Visited</div>
       		</div>
          <div className="d-flex p-2">
       			<div className="legend empty"></div>
       			<div>Not Visited</div>
       		</div>
          <div className="d-flex p-2">
       			<div className="legend visWeight"></div>
       			<div>Visited weight</div>
       		</div>

 	      </div>
        
        <Container>
          <Row>
            <Col md={{ span: 4 }}>{this.getBoard()}</Col>
            <Col md={{ offset: 7 }}>
              <Agent
                gridState={this.state}
                handlePhaseToggle={this.handlePhaseToggle}
                handleStep={this.handleStep}
                handleChecks={this.handleChecks}
                clearLastAlgo={this.clearLastAlgo}
                handleclearWalls={this.handleClearWalls}
                handleAlgo={this.handleAlgo}
                setModalValues={this.setModalValues}
              />
            </Col>
          </Row>
        </Container>

        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.ModalMessage}</Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={this.handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

      </React.Fragment>
    );
  }
}

export default Grid;
