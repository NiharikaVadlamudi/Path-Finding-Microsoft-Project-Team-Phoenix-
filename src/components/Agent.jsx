import React, { Component, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from "./Button.jsx"
import AccordionElement from "./Accordion.jsx"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import glob from "./global.jsx"
import BFS from "../Algorithms/bfs.jsx"
import DFS from "../Algorithms/dfs"
import BestFS from "../Algorithms/bestfs.jsx"
import Astar from "../Algorithms/astar.jsx"
import Dijkstra from "../Algorithms/dijkstra.jsx"
import BidirectionalBFS from "../Algorithms/bidirectionalBFS.jsx"
import BidirectionalDijkstra from '../Algorithms/bidirectionalDijkstra.jsx'
import BidirectionalDFS from '../Algorithms/bidirectionalDFS'
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
      tutorialButton: { id: glob.tutorialButtonId, label: "Tutorial", status: false, disable: false },
      period: 5,
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
      showTutorial: true,

    }
    this.order = [];
    this.answer = [];
  }

  handleStartStop = (button) => {
    var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
    if (startStopButton.status === false) {
      this.props.clearLastAlgo();
      if (this.props.gridState.targetLoc === undefined || this.props.gridState.startLoc === undefined || this.state.algo === undefined) {
        // this.props.setModalValues("set algo")
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
      // this.props.setModalValues("Button disabled when algo is not running")
    }
    else {
      var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
      pauseResumeButton.status = !pauseResumeButton.status;
      pauseResumeButton.label = pauseResumeButton.status ? "RESUME" : "PAUSE";
      this.setState({ pauseResumeButton });
    }
  }

  handleTutorial = () => {
    if(!this.state.startStopButton.status)
    {
      var tutorialButton = JSON.parse(JSON.stringify(this.state.tutorialButton));
      tutorialButton.status = !tutorialButton.status;
      this.setState({ tutorialButton, showTutorial:true });
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
      pathCost += this.props.gridState.status[path[i][0]][path[i][1]] === glob.emptyId ? glob.normalVal : this.props.gridState.weight[path[i][0]][path[i][1]];
    }
    this.setState({
      timer, searchSize, pathCost
    })
  }

  handleShowAnalysis = () =>
  {
    this.setState({showAnalysis:false});
  }

  handleShowTutorial = () =>
  {
    this.setState({showTutorial:false});
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

          case glob.dfsButtonId:
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
            let pathCost = 0;
            for(let i = 0; i < path.length; i++){
              pathCost += this.props.gridState.status[path[i][0]][path[i][1]] === glob.emptyId ? glob.normalVal : this.props.gridState.weight[path[i][0]][path[i][1]];
            }
            this.setState({ showAnalysis:true})
            let analysis = <ul className="list-group list-group-flush listBox">
            <li className="list-group-item">Time: {timer} ms</li>
            <li className="list-group-item">Cost: {pathCost}</li>
            <li className="list-group-item">Search Space: {orderVisited.length}</li>
            {/* <li className="list-group-item">Normal node cost: </li>
            <li className="list-group-item">Weighted node cost: </li> */}
            </ul>;
            this.props.setAnalysis(analysis);

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
    let pauseOverlay = <Button el={this.state.pauseResumeButton} onSelectOption={this.handlePauseResume} />
    if(this.state.startStopButton.status === false)
    {
      pauseOverlay = this.props.buttonOverlays("Pause disabled when Algorithm is not running", pauseOverlay )
    }
    let searchOverlay = <Button el={this.state.startStopButton} onSelectOption={this.handleStartStop} />
    if(this.props.gridState.targetLoc === undefined || this.props.gridState.startLoc === undefined || this.state.algo === undefined)
    {
      searchOverlay = this.props.buttonOverlays("Algorithm not selected", searchOverlay )
    }
    let tutorialOverlay = <Button el={this.state.tutorialButton} onSelectOption={this.handleTutorial} />
    if(this.state.startStopButton.status)
    {
      tutorialOverlay = this.props.buttonOverlays("Cannot display while Algorithm is in Search phase ", tutorialOverlay )
    }

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


      <Modal aria-labelledby="contained-modal-title-vcenter" style={{opacity: 1 }} size="lg" centered show={this.state.showTutorial} onHide={this.handleShowTutorial}>
        <Modal.Header closeButton>
          <Modal.Title>Tutorial</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height:'500px'}}>

        <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div>
            1. Editing the Board: <br/><br/>
              <div className="tutBody">
              You can add walls, weights and edit the positions of the start and target button using the controls given in the top right.
              You can choose a grid from the Custom grid dropdown and make changes to it. <br/> <br/>
              </div>
              <div className="centerAlign">
              <img src="../editBoard.png" alt= "edit" width="650" className="center"/>
              </div>
          </div>
        </li>
        <li className="list-group-item">
          <div>
            2. Weights: <br/><br/>
              <div className="tutBody">
              The value of weights can be set using the slider. Select the add weights option to draw on the board. The value of the
              weight drawn is shown on the cell. <br/> <br/>
              </div>
              <div className="centerAlign">
              <img src="../weightSlider.png" alt= "weight" className="center"/><br/> <br/>
              <img src="../weight.png" alt= "weight" width="650" height="475" className="center"/><br/> <br/>
              </div>
          </div>
        </li>
        <li className="list-group-item">
          <div>
            3. Choosing an algorithm: <br/><br/>
              <div className="tutBody">
              Click on the Accordion to select an algorithm . You can select the distance metric and the number of neighbours to consider
              while searching. Enable bi-directional search to see the algorithm start from both the start and target. <br/> <br/>
              </div>
              <div className="centerAlign">
              <img src="../ChooseAlgo.png" alt= "Algo" width="200" className="center"/><br/> <br/>
              </div>
          </div>
        </li>
        <li className="list-group-item">
          <div>
            4. Analysis<br/><br/>
              <div className="tutBody">
              You can see how long the algorithm took and other information on the left of the grid under the legend. <br/> <br/>
              </div>
              <div className="centerAlign">
              <img src="../analysis.png" alt= "Analysis" className="center"/><br/> <br/>
              </div>
          </div>
        </li>


        </ul>

        </Modal.Body>

      </Modal>

      <div className="row" style={{ paddingLeft:12 , paddingRight: 0 }}>
      {searchOverlay}
      {pauseOverlay}
      </div>
      <div className="row" style={{ paddingLeft:48 , paddingRight: 0 }}>
      {tutorialOverlay}
      </div>






      </span>
    );
  }
}

export default Agent;
