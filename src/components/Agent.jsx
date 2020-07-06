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
        // do sanity checks
        var startStopButton = JSON.parse(JSON.stringify(this.state.startStopButton));
        if (startStopButton.status === false)
        {
          this.props.clearLastAlgo();
          if(this.props.end === undefined || this.props.beg === undefined || this.props.algoSelected === -1)
          {
            alert("Error")
            this.props.handleChecks();
          }
          else {
            startStopButton.status = true;
            startStopButton.label = "STOP";
            var algo = this.props.algoSelected;
            this.setState({startStopButton,algo})
            this.props.handlePhaseToggle();
            this.props.toggleIsAlgoRunning();
            this.togglePause();
          }
        }
        else {
          startStopButton.status = false
          startStopButton.label = "SEARCH";
          this.props.handleResetButtons();
          var algo = -1;
          this.props.toggleIsAlgoRunning();
          this.setState({startStopButton,algo});
          this.props.handlePhaseToggle();
        }
    }

    handlePauseResume = (button) => {
      if(this.props.isAlgoRunning === false)
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

    togglePause = () => {
      var pauseResumeButton = JSON.parse(JSON.stringify(this.state.pauseResumeButton));
      pauseResumeButton.disable = !pauseResumeButton.disable;
      this.setState({pauseResumeButton});
    }
    pauseState = () => {
      console.log("aaya")
      return this.state.pauseResumeButton.status
    }

    componentDidUpdate(prevProps, prevState) {
        // status changed from not searching to searching
        // console.log(this.props.isAlgoRunning)
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
                      startStopButton.status = false;
                      startStopButton.label = "SEARCH";
                      this.props.handleResetButtons();
                      var algo = -1;
                      this.setState({startStopButton,algo});
                      this.props.toggleIsAlgoRunning();
                      this.props.handlePhaseToggle();
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
