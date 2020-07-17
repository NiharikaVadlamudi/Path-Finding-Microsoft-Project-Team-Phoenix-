import React, { Component, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import glob from './global.jsx'
import Select from 'react-select'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

class AccordionElement extends Component {

  state = {
    heuristics: [],
    neighbourhood: [],
    id: undefined,
    selectedHeuristic: undefined,
    selectedNeighbourhood: undefined,
    checkBidirectional: undefined,
  }

  constructor(props) {
    super(props)
    this.state.id = this.props.id
    if (this.props.options[0]) {
      this.state.heuristics = [
        { value: glob.ManhattanId, label: "Manhattan", info: glob.manhattanInfo },
        { value: glob.EuclideanId, label: "Euclidean", info: glob.euclideanInfo },
        { value: glob.VancouverId, label: "Vancouver", info: glob.vancouverInfo },
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
    if(this.props.options[2]){
      this.state.checkBidirectional = false
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.curAlgo != this.props.curAlgo || nextState != this.state || this.props.canSelectOptions != nextProps.canSelectOptions)
  }

  isActive() {
    return this.props.curAlgo === this.state.id;
  }

  handleHeuristicChange = (e) => {
    this.props.onSelectOption(this.state.id, e, this.state.selectedNeighbourhood, this.state.checkBidirectional)(undefined, undefined)
    if(this.props.canSelectOptions === false)
    {
      this.setState({ selectedHeuristic: e });
    }
  }

  handleNeighbourhoodChange = (e) => {
    this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, e, this.state.checkBidirectional)(undefined, undefined)
    if(this.props.canSelectOptions === false)
    {
      this.setState({ selectedNeighbourhood: e });
    }
  }

  handleBidirectionalOption = () => {
    let check = this.state.checkBidirectional;
    this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, this.state.selectedNeighbourhood, !check)(undefined, undefined)
    if(this.props.canSelectOptions === false)
    {
      this.setState({checkBidirectional: !check})
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
                            <div style={{ color:  '#7c7a79', fontSize: '16px',}} >
                            Distance Metric :
                            </div>
                            <Select
                              options={this.state.heuristics}
                              isDisabled={this.props.canSelectOptions}
                              defaultValue={this.state.selectedHeuristic}
                              onChange={this.handleHeuristicChange}
                            />
                            <hr />
                            {details}
                          </div>
    }
    if(this.props.options[1]){
      details = <div  style={{ width: '10rem' }}>
                            <div style={{ color:  '#7c7a79', fontSize: '16px',}} >
                            Neighbour Metric :
                            </div>
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
    if(this.props.options[2]!==undefined && this.props.options[2]){
      details = <div>
                {details}
                <div style={{ color:  '#7c7a79', fontSize: '16px',}} >
                Bidirectional Search:
                </div>
                <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>

                <Switch color="primary" disabled={this.props.canSelectOptions} checked={this.state.checkBidirectional} onChange={this.handleBidirectionalOption} name="checkedA" />
                </Grid>
                <Grid item>On</Grid>
                </Grid>
                <hr/>
                </div>
    }
    return (
      <Card style={{ width: '12rem'}}>
        <Accordion
          expanded={this.isActive()}
          onChange={this.props.onSelectOption(this.state.id, this.state.selectedHeuristic, this.state.selectedNeighbourhood, this.state.checkBidirectional)}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
          <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip id="button-tooltip" {...this.props}>
              {this.props.info}
            </Tooltip>
          }
          >
            <div className={classes}>{this.props.label}</div>
          </OverlayTrigger>

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
