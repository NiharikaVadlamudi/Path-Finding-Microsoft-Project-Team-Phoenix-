import React, { Component } from 'react';
import Button from "./Button.jsx"
import glob from "./global.jsx"
import useInterval from 'react-useinterval';


class Agent extends Component {
    state = { 
        algo: undefined,
        controlButton:
            {id : glob.startSearchButtonId, label:"SEARCH", status: false},
    }

    handleOnOff = (button) => {
        // do sanity checks
        let controlButton = this.state.controlButton
        controlButton.status = !controlButton.status
        controlButton.label = (controlButton.status ? "STOP" : "SEARCH")
        this.setState({controlButton})
        this.props.handlePhaseToggle();
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