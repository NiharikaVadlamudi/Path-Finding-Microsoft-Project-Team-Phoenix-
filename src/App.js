import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';
import Elements from './components/Button.jsx'
import glob from './components/global.jsx'
class App extends Component {

  state = {
    isMouseDown: false
  }  

  handleMouseDown = (e) => {
    this.setState({ isMouseDown: true });
    e.preventDefault();
  }

  handleMouseUp = (e) => {
      this.setState({ isMouseDown: false });
      e.preventDefault();
  }

  render() {
    return (
      <div onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <NavBar />
        <Grid isMouseDown={this.state.isMouseDown}/>
      </div>
     );
  }
}

export default App;
