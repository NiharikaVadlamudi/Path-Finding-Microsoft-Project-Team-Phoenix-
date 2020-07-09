import React, { Component } from 'react';


class Button extends Component {

    render() {
        let classes = "badge m-2 badge-";
        if(this.props.el.disable === true)
        {
          classes += "secondary";
        }
        else {

          classes += this.props.el.status === false ? "dark":"primary";
        }

        return (
          <React.Fragment>
          <button
            className={classes}
            onClick={() => this.props.onSelectOption(this.props.el)}
          >
              {this.props.el.label}
          </button>
          </React.Fragment>
        );
    }
}

export default Button;
