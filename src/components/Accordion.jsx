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
    // details: <p></p>
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
    }
    if(this.props.options[1]){
      this.state.neighbourhood = [
        { value: 4, label: "4" },
        { value: 8, label: "8" }
      ]
      this.state.selectedNeighbourhood = this.state.neighbourhood[0]
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.curAlgo != this.props.curAlgo || nextState != this.state || this.props.canSelectOptions != nextProps.canSelectOptions)
  }

  isActive() {
    return this.props.curAlgo === this.state.id;
  }

  handleHeuristicChange = (e) => {
    this.props.onSelectOption(this.state.id, e, this.state.selectedNeighbourhood)(undefined, undefined)
    if(this.props.canSelectOptions === false)
    {
      this.setState({ selectedHeuristic: e });
    }
  }

  handleNeighbourhoodChange = (e) => {
    this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, e)(undefined, undefined)
    if(this.props.canSelectOptions === false)
    {
      this.setState({ selectedNeighbourhood: e });
    }
  }

  render() {
    // console.log("acc rendered")
    let classes = "btn btn-sm btn-block btn-";
    if (this.isActive()) {
      classes += "primary";
    }
    else {
      classes += "outline-secondary";
    }

    let details = undefined
    if (this.props.options[0]) {
      details = <div style={{ width: '10rem' }}>
                            <Select
                              options={this.state.heuristics}
                              isDisabled={this.props.canSelectOptions}
                              defaultValue={this.state.selectedHeuristic}
                              onChange={this.handleHeuristicChange}
                            />
                            {details}
                          </div>
    }
    if(this.props.options[1]){
      details = <div  style={{ width: '10rem' }}>
                            <Select
                              options={this.state.neighbourhood}
                              isDisabled={this.props.canSelectOptions}
                              defaultValue={this.state.selectedNeighbourhood}
                              onChange={this.handleNeighbourhoodChange}
                            />
                            <hr />
                            {details}
                          </div>
    }
    return (
      <Card style={{ width: '12rem'}}>
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

          <AccordionDetails >
            {details}
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  }
}

export default AccordionElement;
