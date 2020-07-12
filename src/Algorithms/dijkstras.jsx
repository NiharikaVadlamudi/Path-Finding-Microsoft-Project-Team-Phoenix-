import React, { Component } from 'react';
import glob from '../components/global.jsx';

class Dijkstra {
  constructor(graph, neigh, heur) {
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.vis = []

    this.status[this.beg[0]][this.beg[1]] = 0;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // if (i !== this.beg[0] && j !== this.beg[1] && this.status[i][j] !== glob.wallId && this.status[i][j] !== glob.weightId) {
        if (i !== this.beg[0] && j !== this.beg[1] && this.status[i][j] !== glob.wallId) {
          this.status[i][j] = Infinity;
        }
      }
    }
    this.neigh = neigh;
    this.f = 0;
    this.que = [this.beg, 0];
    this.orderVisited = [];
    this.vis = [];
    return this.execute();
  }


  isValid(x, y) {
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  neighbours(x, y) {
    if (this.neigh === 4)
      return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    else
      return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 1], [x - 1, y - 1]];
  }
  execute() {
    console.log("rtgefds")
    while (this.f !== 1) {
      let cur = this.que.pop()
      this.orderVisited.push(cur[0])
      let x = this.beg[0];
      let y = this.beg[1];
      let d = cur[1];
      let neigh = this.neighbours(x, y);
      for (let i = 0; i < neigh.length; i++) {
        let a = neigh[i][0];
        let b = neigh[i][1];
        if (this.isValid(a, b) && this.status[a][b] !== glob.wallId) {
          let min = this.status[a][b];
          if (a === this.end[0] && b === this.end[1]) {
            this.f = 1
            break;
          }
          if (min === Infinity) { return this.vis = 1; }
          else {
            this.que.push([[a, b], d + 1])
            this.vis[a][b] = 1;
          }
        }
      }
    }
    return this;
  }
}

export default Dijkstra



