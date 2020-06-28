import React, { Component } from 'react';


class Elements extends Component {


    render() {

        // console.log("props123", this.props);
        let classes = "badge m-2 badge-";
        classes += this.props.el.status === false ? "warning":"primary";


        return (
          <React.Fragment>
          <button className={classes} onClick={() => this.props.onSelectOption(this.props.el)}> {this.props.el.label} </button>
          </React.Fragment>
        );
    }
}

export default Elements;
