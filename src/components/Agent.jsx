import React, { Component, useEffect } from 'react';
import Button from "./Button.jsx"
import glob from "./global.jsx"
import BFS from "../Algorithms/bfs.jsx"
// import useInterval from 'react-useinterval';


class Agent extends Component {
    state = {
        algo: undefined,
        controlButton:
            {id : glob.startSearchButtonId, label:"SEARCH", status: false},
        period: 1
    }

    handleOnOff = (button) => {
        // do sanity checks
        var controlButton = JSON.parse(JSON.stringify(this.state.controlButton))
        controlButton.status = !controlButton.status
        controlButton.label = (controlButton.status ? "STOP" : "SEARCH")
        this.setState({controlButton})
        this.props.handlePhaseToggle();
    }

    componentDidUpdate(prevProps, prevState) {
        // status changed from not searching to searching
        if(prevState.controlButton.status != this.state.controlButton.status){
            const searching = this.state.controlButton.status
            if(searching){
                // init algo and set it to step periodically
                this.state.algo = new BFS(this.props);

                console.log(this.state.algo.f)
                // console.log(this.state.algo)
                // this.periodicStep = setInterval(() => {
                    // <INSERT CODE HERE TO EXECUTE IT
                    // PERIODICALLY WITH PERIOD this.state.period>
                    ////////////////////////////////
                    // let vis = this.state.algo.step()
                    // if(vis !== undefined)
                        this.props.handleStep(this.state.algo.vis);
                    ////////////////////////////////
                // }, this.state.period);
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
                <Button el={this.state.controlButton} onSelectOption={ this.handleOnOff }/>
            </span>
         );
    }
}

export default Agent;
