import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';
import Elements from './components/Button.jsx'
import glob from './components/global.jsx'
class App extends Component {

  state = {
    isMouseDown: false,
    disabled: false
  }  

  handleMouseDown = (e) => {
    if(!this.state.disabled)
      this.setState({ isMouseDown: true });
    e.preventDefault();
  }

  handleMouseUp = (e) => {
    if(!this.state.disabled)
      this.setState({ isMouseDown: false });
    e.preventDefault();
  }

  handleDisableReadMouse = (val) => {
      this.setState({
        disabled: !val,
        isMouseDown: false
      });
  }

  render() {
    // console.log("App", this.state.disabled)
    return (
      <div onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <NavBar />
        <Grid isMouseDown={this.state.isMouseDown} handleDisableReadMouse={this.handleDisableReadMouse}/>
      </div>
     );
  }
}

export default App;
