import React, { Component, useEffect } from 'react';
import Button from "./Button.jsx"
import glob from "./global.jsx"
import BFS from "../Algorithms/bfs.jsx"
// import useInterval from 'react-useinterval';


class Agent extends Component {
    state = {
        algo: undefined,
        startStopButton: {id : glob.startSearchButtonId, label:"SEARCH", status: false},
        pauseResumeButton: {id : glob.pauseResumeButtonId, label:"PAUSE", status: false, disable: true},
        period: 1
    }

    handleStartStop = (button) => {
        var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
        if (startStopButton.status === false)
        {
          // console.log(this.props.gridState.algoSelected, "j");
          this.props.clearLastAlgo();
          if(this.props.gridState.targetLoc === undefined || this.props.gridState.startLoc === undefined || this.props.gridState.algoSelected === -1)
          {
            alert("Error")
            this.props.handleChecks();
          }
          else {
            startStopButton.status = true;
            startStopButton.label = "STOP";
            var algo = this.state.algo;
            algo = this.props.gridState.algoSelected;
            this.setState({startStopButton,algo})
            this.props.handlePhaseToggle(-1,false,this.props.gridState.algoSelected,"start",undefined);
            this.togglePauseDisable();
          }
        }
        else {

          startStopButton.status = false;
          startStopButton.label = "SEARCH";
          this.props.resetAlgoButtons();
          var algo = this.state.algo;
          algo = undefined;
          this.setState({startStopButton,algo});
          this.props.handlePhaseToggle(-1,true,-1,"stop",false);
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
                  case glob.bfsButtonId: algoItems = new BFS(this.props); algoItems.orderVisted.shift(); break;
                  default: break;
                }

                pause = this.state.pauseResumeButton.status;

                if(algoItems !== undefined && pause === false)
                {
                  this.periodicStep = setInterval(() => {
                    if(algoItems.orderVisted.length!==0  && pause === false)
                    {
                      pause = this.state.pauseResumeButton.status
                      let cur = algoItems.orderVisted.shift();
                      this.props.handleStep(cur);
                    }
                    if(pause === true)
                    {
                      pause = this.state.pauseResumeButton.status;

                    }
                    if(algoItems.orderVisted.length===0)
                    {
                      var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
                      startStopButton.status = false
                      startStopButton.label = "SEARCH";
                      this.props.resetAlgoButtons();
                      var algo = -1;
                      this.setState({startStopButton,algo});
                      this.props.handlePhaseToggle(-1,true,-1,"stop",false);

                      this.togglePauseDisable();
                    }

                  }, this.state.period);
                }

            }
            else{
                this.state.algo = undefined
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
                <Button el={this.state.startStopButton} onSelectOption={ this.handleStartStop }/>
                <Button el={this.state.pauseResumeButton} onSelectOption={ this.handlePauseResume }/>
            </span>
         );
    }
}

export default Agent;
