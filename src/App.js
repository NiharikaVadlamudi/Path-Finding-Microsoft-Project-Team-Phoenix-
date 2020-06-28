import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';
import Elements from './components/Elements.jsx'
class App extends Component {

  state = {
    isMouseDown: false,
    addElements: [
      {id : 1, label:"ADD START", status:false},
      {id : 2, label:"ADD TARGET", status: false },
      {id : 3, label:"ADD WEIGHT", status: false},
      {id : 4, label:"ADD WALL", status: false}
    ]
  }

  handleMouseDown = () => {
    this.setState({isMouseDown: true});
  }

  handleSelectOption = (element) => {
    // console.log("Selected",element);
    const elements = this.state.addElements.map(c=>{
      c.status= c.id === element.id ? true : false
      return c;
    });
    this.setState({elements})
    // console.log(this.state.addElements);


  }
  handleMouseUp = () => {
    this.setState({isMouseDown: false});
  }

  render() {
    return (
      <div onMouseDown={() => this.handleMouseDown()} onMouseUp={() => this.handleMouseUp()}>
        <NavBar />
        <span>{this.state.addElements.map(el => <Elements key={el.id} el={el} onSelectOption={ this.handleSelectOption }/>)}</span>
        <Grid isMouseDown={this.state.isMouseDown }/>

      </div>
     );
  }
}

export default App;
