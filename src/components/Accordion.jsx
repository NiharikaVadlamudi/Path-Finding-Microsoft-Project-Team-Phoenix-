import React, { Component, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import glob from './global.jsx'
import Select from 'react-select'

class AccordionElement extends Component {

  state = {
    heuristics: [],
    neighbourhood: [],
    id: undefined,
    selectedHeuristic: undefined,
    selectedNeighbourhood: undefined,
    details: <p></p>
  }

  constructor(props) {
    super(props)
    this.state.id = this.props.id
    if (this.props.options[0]) {
      this.state.heuristics = [
        { value: glob.ManhattanId, label: "Manhattan" },
        { value: glob.EuclideanId, label: "Euclidean" },
        { value: glob.VancouverId, label: "Vancouver" },
      ];
      this.state.selectedHeuristic = this.state.heuristics[0]
      this.state.details = <div>
                            <Select 
                              options={this.state.heuristics}
                              defaultValue={this.state.selectedHeuristic}
                              onChange={this.handleHeuristicChange}              
                            />
                            {this.state.details}
                          </div>
    }
    if(this.props.options[1]){
      this.state.neighbourhood = [
        { value: 4, label: "4" },
        { value: 8, label: "8" }
      ]
      this.state.selectedNeighbourhood = this.state.neighbourhood[0]
      this.state.details = <div>
                            <Select 
                              options={this.state.neighbourhood}
                              defaultValue={this.state.selectedNeighbourhood}
                              onChange={this.handleNeighbourhoodChange}              
                            />
                            <hr />
                            {this.state.details}
                          </div>
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("p", nextProps.curAlgo != this.props.curAlgo)
    // console.log("s", nextState !== this.state)
    // console.log(nextProps, this.props)
    return nextProps.curAlgo != this.props.curAlgo || nextState != this.state
  }

  isActive() {
    return this.props.curAlgo === this.state.id;
  }

  handleHeuristicChange = (e) => {
    this.props.onSelectOption(this.state.id, e, this.state.selectedNeighbourhood)(undefined, undefined)
    this.setState({ selectedHeuristic: e });
  }

  handleNeighbourhoodChange = (e) => {
    this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, e)(undefined, undefined)
    this.setState({ selectedNeighbourhood: e });
  }

  render() {
    console.log("acc rendered")
    let classes = "btn btn-lg btn-outline-";
    if (this.isActive()) {
      classes += "primary";
    }
    else {
      classes += "secondary";
    }
    return (
      <Card style={{ width: '12rem' }}>
        <Accordion
          expanded={this.isActive()}
          onChange={this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, this.state.selectedNeighbourhood)}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={classes}>{this.props.label}</div>
          </AccordionSummary>

          <AccordionDetails>
            {this.state.details}
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  }
}

export default AccordionElement;