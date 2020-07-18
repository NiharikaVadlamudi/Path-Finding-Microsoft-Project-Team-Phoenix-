import React, { Component, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from "./Button.jsx"
import AccordionElement from "./Accordion.jsx"
import glob from "./global.jsx"
import BFS from "../Algorithms/bfs.jsx"
import DFS from "../Algorithms/dfs.jsx"
import BestFS from "../Algorithms/bestfs.jsx"
import Astar from "../Algorithms/astar.jsx"
import Dijkstra from "../Algorithms/dijkstra.jsx"
import BidirectionalBFS from "../Algorithms/bidirectionalBFS.jsx"
import BidirectionalDijkstra from '../Algorithms/bidirectionalDijkstra.jsx'
import BidirectionalDFS from '../Algorithms/bidirectionalDFS.jsx'
import BidirectionalAstar from '../Algorithms/bidirectionalAstar.jsx'
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
class Agent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      algo: undefined,
      startStopButton: { id: glob.startSearchButtonId, label: "SEARCH", status: false },
      pauseResumeButton: { id: glob.pauseResumeButtonId, label: "PAUSE", status: false, disable: true },
      clearWallsButton: { id: glob.clearWallsButtonId, label: "CLEAR WALLS / PATH", status: false },
      period: 10,
      neigh: undefined,
      heur: undefined,
      algos: [
        { id: glob.bfsButtonId, label: "BFS", options: [false, true, true], info: glob.bfsInfo },
        { id: glob.aStarButtonId, label: "A*", options: [true, true, true], info: glob.aStarInfo },
        { id: glob.dijkstraButtonId, label: "Djikstra", options: [false, true, true], info: glob.dijkstraInfo },
        { id: glob.bestfsButtonId, label: "BestFS", options: [true, true, false], info: glob.bestfsInfo },
        { id: glob.dfsButtonId, label: "DFS", options: [false, true, true], info: glob.dfsInfo },
      ],
      checkBidirectional: undefined,
      timer: Infinity,
      searchSize: 0,
      pathCost: 0,
      showAnalysis: false,

    }
    this.order = [];
    this.answer = [];
  }

  handleStartStop = (button) => {
    var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
    if (startStopButton.status === false) {
      this.props.clearLastAlgo();
      if (this.props.gridState.targetLoc === undefined || this.props.gridState.startLoc === undefined || this.state.algo === undefined) {
        this.props.setModalValues("set start/target/algo")
        this.props.handleChecks();

      }
      else {
        startStopButton.status = true;
        startStopButton.label = "STOP";
        this.setState({ startStopButton })
        this.props.handlePhaseToggle(-1, false, "start", undefined);
        this.togglePauseDisable();
      }
    }
    else {
      this.algoEnd()
    }
  }

  algoEnd() {
    var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
    startStopButton.status = false
    startStopButton.label = "SEARCH";
    this.setState({ startStopButton });
    this.props.handlePhaseToggle(-1, true, "stop", false);
    this.props.handleAlgo(this.order, this.answer);
    this.togglePauseDisable();
    this.order = [];
    this.answer = [];
    clearInterval(this.periodicStep)
  }

  handlePauseResume = (button) => {
    if (this.state.startStopButton.status === false) {
      this.props.setModalValues("Button disabled when algo is not running")
    }
    else {
      var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
      pauseResumeButton.status = !pauseResumeButton.status;
      pauseResumeButton.label = pauseResumeButton.status ? "RESUME" : "PAUSE";
      this.setState({ pauseResumeButton });
    }
  }

  togglePauseDisable = () => {
    var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
    pauseResumeButton.disable = !pauseResumeButton.disable;
    if (this.state.startStopButton.status) {
      pauseResumeButton.label = "PAUSE";
      pauseResumeButton.status = false;

    }
    this.setState({ pauseResumeButton });
  }

  handleSelectAlgo = (key, heur, neigh, checkBidirectional) => (event, isExpanded) => {
    if (!this.props.gridState.drawAllowed) return;
    if (isExpanded === undefined || isExpanded === true) {

      this.setState({
        checkBidirectional: (checkBidirectional),
        algo: key,
        heur: (heur ? heur.value : this.state.heur),
        neigh: (neigh ? neigh.value : this.state.neigh)
      })
    }
  }

  resetAlgos = () => {
    let algo = this.state.algo;
    algo = undefined;
    const algos = this.state.algos.map(c => {
      c.status = false;
      return c;
    });
    this.setState({ algos, algo });
  }

  handleAnalysisUpdate = (timer, searchSize, path) => {
    let pathCost = 0;
    for(let i = 0; i < path.length; i++){
      pathCost += this.props.gridState.status[path[i][0]][path[i][1]] === glob.emptyId ? glob.normalVal : glob.weightVal;
    }
    this.setState({
      timer, searchSize, pathCost
    })
  }

  handleShowAnalysis = () =>
  {
    this.setState({showAnalysis:false});
  }


  componentDidUpdate(prevProps, prevState) {
    // status changed from not searching to searching

    if (prevState.startStopButton.status != this.state.startStopButton.status) {
      const searching = this.state.startStopButton.status;
      var pause = this.state.pauseResumeButton.status;
      if (searching) {
        // init algo and set it to step periodically
        let algoItems = undefined;
        let timerStart = (new Date()).getTime();

        switch (this.state.algo) {

          case glob.bfsButtonId:
            if (this.state.checkBidirectional)
              algoItems = new BidirectionalBFS(this.props, this.state.neigh, this.state.heur);
            else
              algoItems = new BFS(this.props, this.state.neigh, this.state.heur);
            break;

          case glob.bestfsButtonId:
            algoItems = new BestFS(this.props, this.state.neigh, this.state.heur); break;
            break;

          case glob.aStarButtonId:
            if (this.state.checkBidirectional)
              algoItems = new BidirectionalAstar(this.props, this.state.neigh, this.state.heur);
            else
              algoItems = new Astar(this.props, this.state.neigh, this.state.heur);
            break;

          case glob.dijkstraButtonId:
            if (this.state.checkBidirectional)
              algoItems = new BidirectionalDijkstra(this.props, this.state.neigh, this.state.heur);
            else
              algoItems = new Dijkstra(this.props, this.state.neigh, this.state.heur);
            break;

          case glob.DFSButtonId:
            if (this.state.checkBidirectional)
              algoItems = new BidirectionalDFS(this.props, this.state.neigh, this.state.heur);
            else
              algoItems = new DFS(this.props, this.state.neigh, this.state.heur);
            break;

          default: break;
        }
        if(algoItems.f)
        {
          pause = this.state.pauseResumeButton.status;

          if (algoItems !== undefined && pause === false) {

            const orderVisited = algoItems.orderVisited
            const path = algoItems.path
            const timer = algoItems.timeTaken
            algoItems = undefined

            this.handleAnalysisUpdate(timer, orderVisited.length, path)

            this.periodicStep = setInterval(() => {
              if (orderVisited.length !== 0 && !pause) {
                pause = this.state.pauseResumeButton.status
                let cur = orderVisited.pop();
                this.order.push(cur)
                this.props.handleStep(cur, 0);
              }
              else if (orderVisited.length === 0) {
                if(path.length == 0)
                {
                  this.setState({ showAnalysis:true})
                  let analysis = <ul className="list-group list-group-flush">
                  <li className="list-group-item">Time: {this.state.timer} ms</li>
                  <li className="list-group-item">Cost: {this.state.pathCost}</li>
                  <li className="list-group-item">Search Space: {this.state.searchSize}</li>
                  {/* <li className="list-group-item">Normal node cost: </li>
                  <li className="list-group-item">Weighted node cost: </li> */}
                  </ul>;
                  this.props.setAnalysis(analysis);
                  this.algoEnd();
                }
                else if(!pause){
                  pause = this.state.pauseResumeButton.status
                  let cur = path.pop();
                  this.answer.push(cur)
                  this.props.handleStep(cur, 1);
                }
              }
              if (pause) {
                pause = this.state.pauseResumeButton.status;
              }

            }, this.state.period);
          }

        }
        else {
          this.props.setModalValues("Target is unreachable")
            this.algoEnd();
        }

      }
      else {
        clearInterval(this.periodicStep)
      }
    }
  }


  componentWillUnmount() {
    clearInterval(this.periodicStep);
  }



  render() {

    return (
      <span>

        {this.state.algos.map(el =>
          <AccordionElement
            curAlgo={this.state.algo}
            id={el.id}
            label={el.label}
            info={el.info}
            options={el.options}
            onSelectOption={this.handleSelectAlgo}
            canSelectOptions={this.state.startStopButton.status}
          />
        )}


      <Modal aria-labelledby="contained-modal-title-vcenter" style={{opacity: 1}} centered show={this.state.showAnalysis} onHide={this.handleShowAnalysis}>
        <Modal.Header closeButton>
          <Modal.Title>Algorithm Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <ul className="list-group list-group-flush">
        <li className="list-group-item">Time: {this.state.timer} ms</li>
        <li className="list-group-item">Cost: {this.state.pathCost}</li>
        <li className="list-group-item">Search Space: {this.state.searchSize}</li>
        {/* <li className="list-group-item">Normal node cost: </li>
        <li className="list-group-item">Weighted node cost: </li> */}
        </ul>

        </Modal.Body>

      </Modal>




      <Button el={this.state.startStopButton} onSelectOption={this.handleStartStop} />
      <Button el={this.state.pauseResumeButton} onSelectOption={this.handlePauseResume} />
      <Button el={this.state.clearWallsButton} onSelectOption={this.props.handleclearWalls} />

      </span>
    );
  }
}

export default Agent;
