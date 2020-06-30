import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';
import Elements from './components/Elements.jsx'
import glob from './components/global.jsx'
class App extends Component {

  state = {
    addElements: [
      {id : glob.wallButtonId, label:"ADD WALL", status: false},
      {id : glob.startButtonId, label:"ADD START", status:false},
      {id : glob.targetButtonId, label:"ADD TARGET", status: false },
      {id : glob.weightButtonId, label:"ADD WEIGHT", status: false},
    ],
    drawMode: -1,
    isMouseDown: false
  }

  handleSelectOption = (element) => {
    let drawMode = -1;
    const elements = this.state.addElements.map(c=>{
      c.status = c.id === element.id ? drawMode=c.id : false
      return c;
    });
    this.setState({elements, drawMode});
    // console.log(this.state.addElements);
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
        <span>{this.state.addElements.map(el => <Elements key={el.id} el={el} onSelectOption={ this.handleSelectOption }/>)}</span>
        <Grid drawMode={this.state.drawMode} isMouseDown={this.state.isMouseDown}/>
      </div>
     );
  }
}

export default App;
