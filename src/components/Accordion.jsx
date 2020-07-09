import React, { Component,useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
// import  useContext  from 'react-bootstrap/AccordionToggle';
import AccordionContext from "react-bootstrap/AccordionContext";



class AccordionElement extends Component {


    render() {
      let classes = "btn btn-lg btn-outline-";
      if(this.props.el.disable === true)
      {
        classes += "secondary";
      }
      else {

        classes += this.props.el.status === false ? "dark":"primary";
      }


        return (
          <React.Fragment>
            <Card style={{ width: '12rem' }}>
              <Accordion.Toggle eventKey={this.props.el.id} className={classes} onClick={() => this.props.onSelectOption(this.props.el)}>
                {this.props.el.label}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={this.props.el.id}>
                <Card.Body>Options</Card.Body>
              </Accordion.Collapse>
          </Card>
          </React.Fragment>
        );
    }
}

export default AccordionElement;
