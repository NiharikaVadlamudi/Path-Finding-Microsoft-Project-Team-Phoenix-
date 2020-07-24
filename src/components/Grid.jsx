import React, { Component } from 'react';
import Button from "./Button.jsx";
import glob from './global.jsx'
import Agent from "./Agent.jsx"
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'


function assert(condition, message) {
  if (!condition) {
      throw message || "Assertion failed";
  }
}

class Grid extends Component {
  state = {
    rows: Math.ceil(window.innerHeight / 35),
    cols: Math.ceil(window.innerWidth / 35),
    status: [],
    weight: [],
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
    clearWallsButton: { id: glob.clearWallsButtonId, label: "CLEAR BOARD", status: false },
    showModal: false,
    ModalMessage: "",
    Analysis: undefined,
    weightVal: 25,
    minWeight: 2,
    maxWeight: 50,

  }

  constructor() {
    super();
    let status = [];
    let weight = [];
    for (let r = 0; r < this.state.rows; r++) {
      status[r] = [];
      weight[r] = [];
      for (let c = 0; c < this.state.cols; c++) {
        status[r][c] = glob.emptyId;
        weight[r][c] = glob.emptyWeightId;
      }
    }
    let r = Math.ceil(this.state.rows / 6)
    let c = Math.ceil(this.state.cols / 6)

    this.state.startLoc = [r, c]
    this.state.targetLoc = [r * 4, c * 4]
    status[r][c] = glob.startId
    status[r * 4][c * 4] = glob.targetId
    this.state.status = status;
    this.state.weight = weight;
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
    const { rows, cols, status, weight } = this.state;
    const tr = [];
    for (let r = 0; r < rows; r++) {
      const td = [];
      for (let c = 0; c < cols; c++) {
        let temp = undefined
        if(status[r][c] === glob.weightId || status[r][c] === glob.visAndWeightId || status[r][c] === glob.pathAndWeightId)
        {
          temp = <td
            id={`${r}, ${c}`}

            className={this.getTdClassName(status[r][c])}
            onMouseOver={() => { return this.props.isMouseDown ? this.handleCellClick(r, c) : false }}
            onMouseDown={() => { this.handleCellClick(r, c) }}
          >{weight[r][c]}</td>
        }
        else {
          temp = <td
            id={`${r}, ${c}`}
            className={this.getTdClassName(status[r][c])}
            onMouseOver={() => { return this.props.isMouseDown ? this.handleCellClick(r, c) : false }}
            onMouseDown={() => { this.handleCellClick(r, c) }}
          > 01 </td>
        }
        td.push(temp)
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
    const clone2 = JSON.parse(JSON.stringify(this.state.weight));
    let startLoc = undefined, targetLoc = undefined;
    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
          clone[r][c] = this.getTdClassName(document.getElementById(`${r}, ${c}`).className, true)
          if(clone[r][c] === glob.weightId && clone2[r][c] === glob.emptyWeightId )
          {
            clone2[r][c] = this.state.weightVal
          }
          else if(clone2[r][c] !== glob.emptyWeightId && !(clone[r][c] === glob.weightId || clone[r][c] === glob.visAndWeightId || clone[r][c] === glob.pathAndWeightId) )
          {
            clone2[r][c] = glob.emptyWeightId
          }
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
      weight: clone2,
      startLoc: startLoc,
      targetLoc: targetLoc
    });
  }

  handleCellClick = (r, c) => {
    if (!this.state.drawAllowed) return;
    if (!this.state.isEmptyVis && this.state.drawMode != -1)
      this.clearLastAlgo();

    const curCell = document.getElementById(`${r}, ${c}`);
    console.log(curCell.innerHTML)
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
          curCell.innerHTML = this.state.weightVal
        }
        else if(curCell.className === this.getTdClassName(glob.weightId)){
          curCell.className = this.getTdClassName(glob.emptyId);
          curCell.innerHTML = '01'
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

  handleWeightChange = (e,v) =>
  {
    this.setState({weightVal: v})
    console.log(v)
  }

  drawRandomBoard = () =>
  {
    const clone = JSON.parse(JSON.stringify(this.state.status));
    const clone2 = JSON.parse(JSON.stringify(this.state.weight));
    // const clone = JSON.parse(JSON.stringify(this.state.status));
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (clone[i][j] !== glob.startId && clone[i][j] !== glob.targetId && clone[i][j] !== glob.emptyId)
          clone[i][j] = glob.emptyId;
      }
    }
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (clone[i][j] !== glob.startId && clone[i][j] !== glob.targetId && clone[i][j] === glob.emptyId)
        {
          if(Math.random() < 0.3 )
          {
            if(Math.random() < 0.5)
            clone[i][j] = glob.wallId;
            else {
              clone[i][j] = glob.weightId;
              clone2[i][j] = Math.floor(Math.random() * Math.floor(48)) + 2
            }
          }
        }
      }
    }
    this.setState({ status: clone, weight:clone2 });
  }



  drawContourBoard = (c) =>
  {
    const clone = JSON.parse(JSON.stringify(this.state.status));
    const clone2 = JSON.parse(JSON.stringify(this.state.weight));
    // const clone = JSON.parse(JSON.stringify(this.state.status));
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (clone[i][j] !== glob.startId && clone[i][j] !== glob.targetId && clone[i][j] !== glob.emptyId)
          clone[i][j] = glob.emptyId;
      }
    }

    let x=undefined;
    let y=undefined;
    if(!c)
    {
      x=this.state.startLoc[0]
      y=this.state.startLoc[1]
    }
    else {
      x=this.state.targetLoc[0]
      y=this.state.targetLoc[1]
    }

    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (clone[i][j] !== glob.startId && clone[i][j] !== glob.targetId && clone[i][j] === glob.emptyId)
        {
          if(Math.abs(x-i) > Math.abs(j-y))
          {
            if(Math.abs(50 - Math.abs(x-i))%2 === 0)
            {
              clone2[i][j] = Math.abs(50 - Math.abs(x-i))%50
              clone[i][j] = glob.weightId
              if(clone2[i][j] === 0)
                clone2[i][j] = 2
            }

          }
          else
          {
            if(Math.abs(50 - Math.abs(y-j))%2 === 0)
            {
              clone2[i][j] =  Math.abs(50 - Math.abs(y-j))%50
              clone[i][j] = glob.weightId
              if(clone2[i][j] === 0)
                clone2[i][j] = 2
            }
          }
        }
      }
    }

    this.setState({ status: clone, weight:clone2 });


  }

  drawCustomGrid = (e) => {
    if(this.state.drawAllowed)
    {
      switch(e){
        case "1": this.drawRandomBoard(); break;
        case "2": this.drawContourBoard(0); break;
        case "3": this.drawContourBoard(1); break;
        default : break;
      }

    }
  }

  buttonOverlays = (message, button) =>
  {
    let buttonOverlay = <OverlayTrigger
    placement="left"
    delay={{ show: 250, hide: 400 }}
    overlay={
      <Tooltip id="button-tooltip" {...this.props} >
        {message}
      </Tooltip>
    }
    ><div>
    {button}
    </div>
    </OverlayTrigger>
    return buttonOverlay
  }


  render() {
    // console.log("grid", this.state.drawAllowed)

    let analysis = <p> </p>

    if (this.state.Analysis != undefined) {
      analysis = this.state.Analysis
    }
    let clearBoardOverlay = <Button el={this.state.clearWallsButton} onSelectOption={this.handleClearWalls} />
    if(this.state.drawAllowed==false)
    {
      clearBoardOverlay = this.buttonOverlays("Cannot clear board while algorithm is in Search mode", clearBoardOverlay )
    }

    return (

      <React.Fragment>
        <span >
        <div className="row" style={{ paddingLeft: 15, paddingRight: 0 }}>


          {this.state.drawButtons.map(
            el => <Button key={el.id} el={el} onSelectOption={this.handleSelectDrawMode} />
          )}
          {clearBoardOverlay}


          <Dropdown>
            <Dropdown.Toggle className="btn m-2 btn-sm btn-dark" id="dropdown-basic">
              CUSTOM GRID
            </Dropdown.Toggle>

            <Dropdown.Menu >
              <Dropdown.Item eventKey="1" onSelect={this.drawCustomGrid}>Random</Dropdown.Item>
              <Dropdown.Item eventKey="2" onSelect={this.drawCustomGrid}>Start centric contour</Dropdown.Item>
              <Dropdown.Item eventKey="3" onSelect={this.drawCustomGrid}>Target centric contour</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        </span>


        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row noGutters className="justify-content-md-left">
            <Col xs={{ span: 4, offset: 0 }} md={{ span: 2, offset: 0 }}>
              <div className="d-flex flex-column flex-wrap m-2" style={{ width: '100%' }}>
                <div className="d-flex p-2">
                  <div className="legend start"></div>
                  <div className="legendLabel">Start</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend target">    </div>
                  <div className="legendLabel">Target</div>
                </div>
                <div className="d-flex p-2">
                <div className="legend wall"></div>
                <div className="legendLabel"> Wall</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend weight"></div>
                  <div className="legendLabel">Weights</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend vis"></div>
                  <div className="legendLabel">Visited</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend empty"></div>
                  <div className="legendLabel">Not Visited</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend visWeight"></div>
                  <div className="legendLabel">Visited weight</div>
                </div>
                <div className="d-flex p-2">
                  <div className="legend path"></div>
                  <div className="legendLabel">Path</div>
                </div>
                <div className="d-flex p-2">
                  <div></div>
                  <div className="legendLabel">Rows: {this.state.rows}</div>
                </div>
                <div className="d-flex p-2">
                  <div></div>
                  <div className="legendLabel">Columns: {this.state.cols}</div>
                </div>
                {analysis}
              </div>

            </Col>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 7, offset: 0 }}>
              <div className="horAlign" style={{paddingLeft: 20}}>
              Weight : &emsp;
                <Slider className="vertAlign" style={{width: 300}}
                   defaultValue={25}
                   disabled={!this.state.drawAllowed}
                   step={1}
                   min={this.state.minWeight}
                   max={this.state.maxWeight}
                   valueLabelDisplay="on"
                   onChange={this.handleWeightChange}
                />
                </div>
                {this.getBoard()}
            </Col>
            <Col xs={{ span: 2, offset: 1 }} md={{ span: 2, offset: 1 }}>
              <Agent
                gridState={this.state}
                handlePhaseToggle={this.handlePhaseToggle}
                handleStep={this.handleStep}
                handleChecks={this.handleChecks}
                clearLastAlgo={this.clearLastAlgo}
                handleClearWalls={this.handleClearWalls}
                handleAlgo={this.handleAlgo}
                setModalValues={this.setModalValues}
                setAnalysis={this.setAnalysis}
                buttonOverlays={this.buttonOverlays}
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
