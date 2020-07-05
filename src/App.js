import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Grid from './components/Grid.jsx';
<<<<<<< HEAD
import Elements from './components/Button.jsx'
=======
// import {returnGridState} from './components/global.jsx';
import Elements from './components/Elements.jsx'
>>>>>>> dd2b3fccdb64934db2dafa0cbffc45813032dd02
import glob from './components/global.jsx'


class App extends Component {

  state = {
<<<<<<< HEAD
    isMouseDown: false
  }  
=======
    addElements: [
      {id : glob.wallButtonId, label:"ADD WALL", status: 0, type: "Elements"},
      {id : glob.startButtonId, label:"ADD START", status:0, type: "Elements"},
      {id : glob.targetButtonId, label:"ADD TARGET", status: 0, type: "Elements" },
      {id : glob.weightButtonId, label:"ADD WEIGHT", status: 0, type: "Elements"},
    ],
    addAlgorithms: [
      {id : glob.bfsButtonId, label:"BFS", status: 0, type: "Algorithms"},
      {id : glob.dfsButtonId, label:"DFS", status: 0, type: "Algorithms"},
      {id : glob.astarButtonId, label:"A*", status: 0, type: "Algorithms"},
    ],
    addActions: [
      {id : glob.searchPhaseId, label:"Start", status: 0, type: "Actions"},
      {id : glob.designPhaseId, label:"Stop", status: 0, type: "Actions"},
      // {id : glob.resetButtonId, label:"Reset", status: 0, type: "Actions"},
    ],
    drawMode: -1,
    algorithmMode : -1,
    animationMode : designPhaseId,
    isMouseDown: false
  }

  handleSelectOption = (element) => {
    let drawMode = -1;
    let algorithmMode = -1;
    let animationMode = -1;
    let elements = -1

    switch(element.type)
    {

      case "Elements": elements = this.state.addElements.map(c=>{
        c.status = c.id === element.id ? 1 : 0
        if (c.status === 1)
          drawMode = c.id
        return c;
      }); this.setState({elements, drawMode}); break;

      case "Algorithms": elements = this.state.addAlgorithms.map(c=>{
        c.status = c.id === element.id ? 1 : 0
        if (c.status === 1)
          algorithmMode = c.id
        return c;
      }); this.setState({elements, algorithmMode}); break;

      case "Actions": elements = this.state.addActions.map(c=>{
        c.status = c.id === element.id ? 1 : 0
        if (c.status === 1)
          animationMode =  c.id
        return c;
      }); this.setState({elements, animationMode});  break;

      default: break;
    }
  }
>>>>>>> dd2b3fccdb64934db2dafa0cbffc45813032dd02

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
<<<<<<< HEAD
        <Grid isMouseDown={this.state.isMouseDown}/>
=======
        <span>{this.state.addElements.map(el => <Elements key={el.id} el={el} onSelectOption={ this.handleSelectOption }/>)}</span>
        <span>{this.state.addAlgorithms.map(el => <Elements key={el.id} el={el} onSelectOption={ this.handleSelectOption }/>)}</span>
        <span>{this.state.addActions.map(el => <Elements key={el.id} el={el} onSelectOption={ this.handleSelectOption }/>)}</span>
        <Grid 
          drawMode={this.state.drawMode}
          phase={this.state.animationMode} 
          algorithmMode={this.state.algorithmMode}  
          isMouseDown={this.state.isMouseDown}
        />
>>>>>>> dd2b3fccdb64934db2dafa0cbffc45813032dd02
      </div>
     );
  }
}

export default App;
