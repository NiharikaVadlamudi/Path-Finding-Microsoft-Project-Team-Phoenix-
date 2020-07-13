import React, { Component } from 'react';
import glob from '../components/global.jsx'

// import Grid from '../components/Grid.jsx'
class BFS {

  constructor(graph, neigh, heur, exec=true) {
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.vis = []
    this.par = []

    for (let i = 0; i < this.rows; i++) {
      this.par[i] = []
      this.vis[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
        this.par[i][j] = [i, j]
      }
    }
    this.neigh = neigh
    this.f = 0;
    this.que = [[this.beg, 0]]
    this.orderVisited = []
    this.vis[this.beg[0]][this.beg[1]] = 1;

    // return this.f, this.vis, this.orderVisited;
    if(exec)
      return this.execute();
  }

  isValid(x, y) {
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  neighbours(x, y) {
    if (this.neigh == 4)
      return [[x - 1, y], [x, y - 1], [x, y + 1], [x + 1, y]];
    else
      return [[x - 1, y - 1], [x - 1, y], [x, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x, y + 1], [x + 1, y], [x + 1, y + 1]];
  }

  step() {
    if(this.que.length === 0 || this.f === 1){
      return false;
    }
    let cur = this.que.shift()
    this.orderVisited.push(cur[0])
    let x = cur[0][0]
    let y = cur[0][1]
    let d = cur[1] 
    this.vis[x][y] = 2
    if (x === this.end[0] && y === this.end[1]) {
      this.f = 1
      return false;
    }
    let neigh = this.neighbours(x, y);
    for (let i = 0; i < neigh.length; i++) {
      let a = neigh[i][0]
      let b = neigh[i][1]
      if (this.isValid(a, b) && this.vis[a][b] === 0 && this.status[a][b] !== glob.wallId) {
        this.par[a][b] = [x, y]
        this.que.push([[a, b], d + 1])
        this.vis[a][b] = 1;
      
      }
    }
    return true
  }

  execute() {

    while (true) {
      if(!this.step())
        break;
    }
    this.orderVisited.pop()
    this.orderVisited = this.orderVisited.reverse()
    this.orderVisited.pop()
    return this
  }

}

export default BFS;
