import React, { Component } from 'react';
import glob from '../components/global.jsx';
import TinyQueue from 'tinyqueue';
import {euclideanMetric, manhattanMetric, vancouverMetric} from './metrics.js';

// import Grid from '../components/Grid.jsx'
class BestFS {

  constructor(graph, neigh, heur) {
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.vis = []
    this.metric = this.chooseHeuristic(heur)
    console.log(heur, this.metric)

    for (let i = 0; i < this.rows; i++) {
      this.vis[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
      }
    }
    this.f = 0;
    this.que = new TinyQueue(
      [[this.beg, 0]],
      this.compare
    )
    this.neigh = neigh
    this.orderVisited = []
    this.vis[this.beg[0]][this.beg[1]] = 1;

    return this.execute();
  }

  chooseHeuristic(heur){
    switch(heur){
      case glob.ManhattanId: return manhattanMetric;
      case glob.EuclideanId: return euclideanMetric;
      case glob.VancouverId: return vancouverMetric;
      default: break;
    }
  }

  getHeuristic = (a) => {
    return this.metric(a[0], this.end);
  }

  compare = (a, b) => {
    a = this.getHeuristic(a)
    b = this.getHeuristic(b)
    return a < b ? -1 : a > b ? 1 : 0;
  }

  isValid(x, y) {
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  neighbours(x, y) {
    if (this.neigh == 4)
      return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    else
      return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 1], [x - 1, y - 1]];
  }

  execute() {

    while (this.que.length !== 0 && this.f !== 1) {
      let cur = this.que.pop()
      this.orderVisited.push(cur[0])
      let x = cur[0][0]
      let y = cur[0][1]
      let d = cur[1]
      let neigh = this.neighbours(x, y);
      for (let i = 0; i < neigh.length; i++) {
        let a = neigh[i][0]
        let b = neigh[i][1]
        if (this.isValid(a, b) && this.vis[a][b] === 0 && this.status[a][b] !== glob.wallId) {
          if ((a) === this.end[0] && b === this.end[1]) {
            this.f = 1
            break;
          }
          else {
            this.que.push([[a, b], d + 1])
            this.vis[a][b] = 1;
          }
        }
      }
    }

    return this
  }

}

export default BestFS;
