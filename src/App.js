import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';

class App extends Component {

  state = {
    isMouseDown: false
  }

  handleMouseDown = () => {
    this.setState({isMouseDown: true});
  }

  handleMouseUp = () => {
    this.setState({isMouseDown: false});
  }

  render() { 
    return ( 
      <div onMouseDown={() => this.handleMouseDown()} onMouseUp={() => this.handleMouseUp()}>
        <NavBar />
        <Grid isMouseDown={this.state.isMouseDown}/>
      </div>
     );
  }
}
 
export default App;