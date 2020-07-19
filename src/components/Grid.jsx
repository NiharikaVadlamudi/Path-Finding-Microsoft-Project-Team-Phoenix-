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

function assert(condition, message) {
  if (!condition) {
      throw message || "Assertion failed";
  }
}
class Grid extends Component {
  state = {
    rows: Math.ceil(window.innerHeight / 30),
    cols: Math.ceil(window.innerWidth / 30),
    status: [],
    startLoc: undefined,
    targetLoc: undefined,
    drawAllowed: true,
    drawMode: -1,
    isEmptyVis: true,
    drawButtons: [
      { id: glob.wallButtonId, label: "ADD WALL", status: false, disable: false },
      { id: glob.startButtonId, label: "EDIT START", status: false, disable: false },
      { id: glob.targetButtonId, label: "EDIT TARGET", status: false, disable: false },
      { id: glob.weightButtonId, label: "ADD WEIGHT", status: false, disable: false },
    ],
    showModal: false,
    ModalMessage: "",
    Analysis: undefined,
  }

  constructor() {
    super();
    let status = [];
    for (let r = 0; r < this.state.rows; r++) {
      status[r] = [];
      for (let c = 0; c < this.state.cols; c++) {
        status[r][c] = 0;
      }
    }
    let r = Math.ceil(this.state.rows / 6)
    let c = Math.ceil(this.state.cols / 6)

    this.state.startLoc = [r, c]
    this.state.targetLoc = [r * 4, c * 4]
    status[r][c] = glob.startId
    status[r * 4][c * 4] = glob.targetId
    this.state.status = status;
    this.tempStartLoc = this.state.startLoc
    this.tempTargetLoc = this.state.targetLoc
    this.anyDrawUpdates = false;
  }

  getTdClassName = (status, inverse=false) => {
    if(!inverse){
      switch (status) {
        case glob.emptyId: return "cell empty";
        case glob.wallId: return "cell wall";
        case glob.startId: return "cell start";
        case glob.targetId: return "cell target";
        case glob.visId: return "cell vis";
        case glob.weightId: return "cell weight";
        case glob.visAndWeightId: return "cell visWeight";
        case glob.pathId: return "cell path";
        case glob.pathAndWeightId: return "cell pathWeight";
        default: break;
      }
    }
    else{
      switch (status) {
        case "cell empty" : return glob.emptyId ;
        case "cell wall" : return glob.wallId ;
        case "cell start" : return glob.startId ;
        case "cell target" : return glob.targetId ;
        case "cell vis" : return glob.visId ;
        case "cell weight" : return glob.weightId ;
        case "cell visWeight" : return glob.visAndWeightId ;
        case "cell path" : return glob.pathId ;
        case "cell pathWeight" : return glob.pathAndWeightId ;
        default: break;
      }
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

      <table className="shadow-lg p-2 mb-5 rounded">
        <tbody>{tr}</tbody>
      </table>

    );
  }

  componentDidUpdate(prevProps, prevState) {
    // end drawing
    if (this.anyDrawUpdates && prevProps.isMouseDown && !this.props.isMouseDown) {
      this.pushDrawUpdate();
    }
    return true;
  }

  pushDrawUpdate(){

    // a few sanity checks
    assert(this.anyDrawUpdates, "Trying to push 0 updates")

    const clone = JSON.parse(JSON.stringify(this.state.status));
    let startLoc = undefined, targetLoc = undefined;
    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
          clone[r][c] = this.getTdClassName(document.getElementById(`${r}, ${c}`).className, true)
          if(clone[r][c] == glob.startId){
            startLoc = [r, c];
          }
          else if(clone[r][c] == glob.targetId){
            targetLoc = [r, c];
          }
      }
    }
    this.anyDrawUpdates = false;

    // a few sanity tests
    assert(startLoc[0] === this.tempStartLoc[0] && startLoc[1] === this.tempStartLoc[1], "Start out of sync " + startLoc + " " + this.tempStartLoc)
    assert(targetLoc[0] === this.tempTargetLoc[0] && targetLoc[1] === this.tempTargetLoc[1], "Target out of sync" + targetLoc + " " + this.tempTargetLoc)
    assert(!this.anyDrawUpdates, "Updates not pushed")

    this.setState({ 
      status: clone,
      startLoc: startLoc,
      targetLoc: targetLoc
    }); 
  }

  handleCellClick = (r, c) => {
    if (!this.state.drawAllowed) return;
    if (!this.state.isEmptyVis && this.state.drawMode != -1)
      this.clearLastAlgo();
    
    const curCell = document.getElementById(`${r}, ${c}`);
    switch (this.state.drawMode) {
      case glob.wallButtonId:
        if(curCell.className === this.getTdClassName(glob.emptyId)){
          curCell.className = this.getTdClassName(glob.wallId);
        }
        else if(curCell.className === this.getTdClassName(glob.wallId)){
          curCell.className = this.getTdClassName(glob.emptyId);
        }
        break;
      case glob.startButtonId:
        if (curCell.className === this.getTdClassName(glob.emptyId)) {
          if (this.tempStartLoc)
            document.getElementById(`${this.tempStartLoc[0]}, ${this.tempStartLoc[1]}`).className = this.getTdClassName(glob.emptyId);
          curCell.className = this.getTdClassName(glob.startId);
          this.tempStartLoc = [r, c];
        }
        break;
      case glob.targetButtonId:
        if (curCell.className === this.getTdClassName(glob.emptyId)) {
          if (this.tempTargetLoc)
            document.getElementById(`${this.tempTargetLoc[0]}, ${this.tempTargetLoc[1]}`).className = this.getTdClassName(glob.emptyId);
          curCell.className = this.getTdClassName(glob.targetId);
          this.tempTargetLoc = [r, c];
        }
        break;
      case glob.weightButtonId:
        if(curCell.className === this.getTdClassName(glob.emptyId)){
          curCell.className = this.getTdClassName(glob.weightId);
        }
        else if(curCell.className === this.getTdClassName(glob.weightId)){
          curCell.className = this.getTdClassName(glob.emptyId);
        }
        break;

      default: break;
    }

    this.anyDrawUpdates = true;

  }

  setModes = (drawModeVal, drawAllowedVal) => {
    let drawMode = this.state.drawMode;
    let drawAllowed = this.state.drawAllowed;
    drawMode = drawModeVal;
    drawAllowed = drawAllowedVal;
    this.setState({ drawMode, drawAllowed });
    this.props.handleDisableReadMouse(drawAllowed);
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
    for (let i = 0; i < order.length; i++) {
      clone[order[i][0]][order[i][1]] = clone[order[i][0]][order[i][1]] === glob.weightId ? glob.visAndWeightId : glob.visId;
    }
    for (let i = 0; i < path.length; i++) {
      clone[path[i][0]][path[i][1]] = clone[path[i][0]][path[i][1]] === glob.visAndWeightId ? glob.pathAndWeightId : glob.pathId;
    }
    this.setState({ status: clone })
  }

  handleStep = (vis, path) => {
    if (!path) {
      document.getElementById(`${vis[0]}, ${vis[1]}`).className = this.getTdClassName(
        this.state.status[vis[0]][vis[1]] === glob.weightId ? glob.visAndWeightId : glob.visId
      )
    }
    else {
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
        else if (clone[i][j] === glob.visAndWeightId || clone[i][j] === glob.pathAndWeightId)
          clone[i][j] = glob.weightId;
      }
    }
    let isEmptyVis = this.state.isEmptyVis;
    isEmptyVis = true;
    this.setState({ status: clone, isEmptyVis });
  }


  handleClearWalls = () => {
    if (this.state.drawAllowed === true) {
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
      // this.setModalValues("Stop algo before clearing walls")
    }
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  setAnalysis = (analysis) => {
    this.setState({ Analysis: analysis });
  }

  setModalValues = (message) => {
    this.setState({ showModal: true, ModalMessage: message })
  }
  render() {
    // console.log("grid", this.state.drawAllowed)

    let analysis = <p> </p>

    if (this.state.Analysis != undefined) {
      analysis = this.state.Analysis
    }

    return (

      <React.Fragment>
        <span>
          {this.state.drawButtons.map(
            el => <Button key={el.id} el={el} onSelectOption={this.handleSelectDrawMode} />
          )}
        </span>

        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row noGutters className="justify-content-md-left">
            <Col xs={{ span: 4, offset: 0 }} md={{ span: 2, offset: 0 }}>
              <div className="d-flex flex-column flex-wrap m-2" style={{ width: '100%' }}>
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
                <div className="d-flex p-2">
                  <div></div>
                  <div>Rows: {this.state.rows}</div>
                </div>
                <div className="d-flex p-2">
                  <div></div>
                  <div>Columns: {this.state.cols}</div>
                </div>
                {analysis}
              </div>

            </Col>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 7, offset: 0 }}>
              {this.getBoard()}
            </Col>
            <Col xs={{ span: 2, offset: 1 }} md={{ span: 2, offset: 1 }}>
              <Agent
                gridState={this.state}
                handlePhaseToggle={this.handlePhaseToggle}
                handleStep={this.handleStep}
                handleChecks={this.handleChecks}
                clearLastAlgo={this.clearLastAlgo}
                handleclearWalls={this.handleClearWalls}
                handleAlgo={this.handleAlgo}
                setModalValues={this.setModalValues}
                setAnalysis={this.setAnalysis}
              />
            </Col>
          </Row>
        </Container>

        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.ModalMessage}</Modal.Body>

        </Modal>

      </React.Fragment>
    );
  }
}

export default Grid;
