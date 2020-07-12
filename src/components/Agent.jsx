import React, { Component, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from "./Button.jsx"
import AccordionElement from "./Accordion.jsx"
import glob from "./global.jsx"
import BFS from "../Algorithms/bfs.jsx"
import BestFS from "../Algorithms/bestfs.jsx"
import Astar from "../Algorithms/astar"
import DFS from '../Algorithms/dfs'



class Agent extends Component {
    state = {
        algo: undefined,
        startStopButton: {id : glob.startSearchButtonId, label:"SEARCH", status: false},
        pauseResumeButton: {id : glob.pauseResumeButtonId, label:"PAUSE", status: false, disable: true},
        clearWallsButton: {id : glob.clearWallsButtonId, label:"CLEAR WALLS", status: false},
        period: 1,
        neigh: undefined,
        heur: undefined,
        algos : [
          {id : glob.bfsButtonId , label:"BFS" , options: [false, true]},
          {id : glob.aStarButtonId , label:"A*" , options: [true, true]},
          {id : glob.djikstraButtonId , label:"Djikstra" , options: [false, true]},
          {id: glob.bestfsButtonId, label: "BestFS", options: [true, true]},
          {id : glob.dfsButtonId,label:"DFS",options:[true,true]}
            
        ],

    }

    handleStartStop = (button) => {
        var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
        if (startStopButton.status === false)
        {
          this.props.clearLastAlgo();
          if(this.props.gridState.targetLoc === undefined || this.props.gridState.startLoc === undefined || this.state.algo === undefined)
          {
            alert(this.state.algo)
            // this.resetAlgos();
            this.props.handleChecks();
          }
          else {
            startStopButton.status = true;
            startStopButton.label = "STOP";
            this.setState({startStopButton})
            this.props.handlePhaseToggle(-1,false,"start",undefined);
            this.togglePauseDisable();
          }
        }
        else {

          startStopButton.status = false;
          startStopButton.label = "SEARCH";
          this.setState({startStopButton});
          this.props.handlePhaseToggle(-1,true,"stop",false);
          this.togglePauseDisable();

        }
    }

    handlePauseResume = (button) => {
      if(this.state.startStopButton.status === false)
      {
        alert("This button is disabled rn")
      }
      else {
        var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
        pauseResumeButton.status = !pauseResumeButton.status;
        pauseResumeButton.label = pauseResumeButton.status ? "RESUME" : "PAUSE" ;
        this.setState({pauseResumeButton});
      }
    }

    togglePauseDisable = () => {
      var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
      pauseResumeButton.disable = !pauseResumeButton.disable;
      if(this.state.startStopButton.status)
      {
        // console.log(this.state.startStopButton.status)
        pauseResumeButton.label = "PAUSE";
        pauseResumeButton.status = false;

      }
      this.setState({pauseResumeButton});
    }

    handleSelectAlgo = (key, heur, neigh) =>  (event, isExpanded) => {
      if(!this.props.gridState.drawAllowed) return;
      if(isExpanded === undefined || isExpanded === true){
        this.setState({
          algo: key,
          heur: (heur ? heur.value : this.state.heur),
          neigh: (neigh ? neigh.value : this.state.neigh)
        })
      }
    }

    resetAlgos = () => {
        let algo = this.state.algo;
        algo = undefined;
        const algos = this.state.algos.map(c=>{
          c.status =  false;
          return c;
        });
        this.setState({algos,algo});
      }


    componentDidUpdate(prevProps, prevState) {
        // status changed from not searching to searching

        if(prevState.startStopButton.status != this.state.startStopButton.status){
            const searching = this.state.startStopButton.status;
            var pause = this.state.pauseResumeButton.status;
            if(searching){
                // init algo and set it to step periodically
                let algoItems = undefined
                switch(this.state.algo)
                {
                  case glob.bfsButtonId:
                    algoItems = new BFS(this.props, this.state.neigh, this.state.heur); break;
                  case glob.bestfsButtonId:
                    algoItems = new BestFS(this.props, this.state.neigh, this.state.heur); break;
                      break;
                  case glob.aStarButtonId:
                    algoItems= new Astar(this.props,this.state.neigh,this.state.heur); break;
                  case glob.dfsButtonId:
                    algoItems= new DFS(this.props,this.state.neigh,this.state.heur); break;
                  default: break;
                }
                algoItems.orderVisited = algoItems.orderVisited.reverse();
                algoItems.orderVisited.pop();

                pause = this.state.pauseResumeButton.status;

                if(algoItems !== undefined && pause === false)
                {
                  this.periodicStep = setInterval(() => {
                    if(algoItems.orderVisited.length!==0  && pause === false)
                    {
                      pause = this.state.pauseResumeButton.status
                      let cur = algoItems.orderVisited.pop();
                      this.props.handleStep(cur);
                    }
                    if(pause === true)
                    {
                      pause = this.state.pauseResumeButton.status;

                    }
                    if(algoItems.orderVisited.length===0)
                    {
                      var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
                      startStopButton.status = false
                      startStopButton.label = "SEARCH";
                      this.setState({startStopButton});
                      this.props.handlePhaseToggle(-1,true,"stop",false);

                      this.togglePauseDisable();
                    }

                  }, this.state.period);
                }

            }
            else{
                // this.state.algo = undefined
                clearInterval(this.periodicStep)
            }
        }
    }


    componentWillUnmount() {
        clearInterval(this.periodicStep);
    }

    render() {
      // console.log("agent rerender", this.algo, this.heur, this.neigh)
        return (
            <span>
                <Button el={this.state.startStopButton} onSelectOption={ this.handleStartStop }/>
                <Button el={this.state.pauseResumeButton} onSelectOption={ this.handlePauseResume }/>
                <Button el={this.state.clearWallsButton} onSelectOption={ this.props.handleclearWalls }/>

                {this.state.algos.map(el =>
                  <AccordionElement
                    curAlgo={this.state.algo}
                    id={el.id}
                    label={el.label}
                    options={el.options}
                    onSelectOption={this.handleSelectAlgo}
                  />
                )}

            </span>
         );
    }
}

export default Agent;
